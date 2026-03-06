/**
 * Pure reducer for the javelin game state machine.
 * Handles all game actions and routes tick updates to per-phase handlers.
 * Never mutates the input state.
 */
import { computeAthletePoseGeometry } from '../athletePose';
import { computeChargeMeterSample, computeReleaseForceNorm } from '../chargeMeter';
import {
  ANGLE_MAX_DEG,
  ANGLE_MIN_DEG,
  RUNUP_MAX_TAPS,
  THROW_LINE_X_M
} from '../constants';
import { clamp } from '../math';
import {
  EMPTY_DIFFICULTY_GAMEPLAY_TUNING_OVERRIDES,
  GAMEPLAY_TUNING,
  getDifficultyGameplayTuning
} from '../tuning';
import type { GameAction, GameState } from '../types';
import { advanceCrosswindMs, advanceWindMs } from '../wind';
import {
  classifyRunupRhythmTap,
  computeRhythmTapGain,
  createLateReleaseFaultPhase,
  getNextRhythmCombo,
  getNextRhythmStability,
  getRunupTargetTapIntervalMs,
  isRunning,
  runupTapGainMultiplier
} from './helpers';
import { tickChargeAim } from './tickChargeAim';
import { tickFault } from './tickFault';
import { tickFlight } from './tickFlight';
import { tickRunup } from './tickRunup';
import { tickThrowAnim } from './tickThrowAnim';

const {
  chargeMaxCycles: CHARGE_MAX_CYCLES,
  throwReleaseProgress01: THROW_RELEASE_PROGRESS
} = GAMEPLAY_TUNING.throwPhase;
const { runupStartXM: RUNUP_START_X_M } = GAMEPLAY_TUNING.movement;

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'setDifficulty': {
      if (state.phase.tag !== 'idle' && state.phase.tag !== 'result') {
        return state;
      }
      if (state.difficulty === action.difficulty) {
        return state;
      }
      return {
        ...state,
        difficulty: action.difficulty
      };
    }
    case 'setDevTuningOverrides': {
      if (state.phase.tag !== 'idle' && state.phase.tag !== 'result') {
        return state;
      }
      if (state.devTuningOverrides === action.overrides) {
        return state;
      }
      return {
        ...state,
        devTuningOverrides: action.overrides
      };
    }
    case 'resetDevTuningOverrides': {
      if (state.phase.tag !== 'idle' && state.phase.tag !== 'result') {
        return state;
      }
      if (Object.keys(state.devTuningOverrides).length === 0) {
        return state;
      }
      return {
        ...state,
        devTuningOverrides: EMPTY_DIFFICULTY_GAMEPLAY_TUNING_OVERRIDES
      };
    }
    case 'startRound': {
      const difficultyTuning = getDifficultyGameplayTuning(state.difficulty, state.devTuningOverrides);
      return {
        ...state,
        nowMs: action.atMs,
        roundId: state.roundId + 1,
        windMs: action.windMs,
        windZMs: action.windZMs ?? state.windZMs,
        phase: {
          tag: 'runup',
          meterMode: difficultyTuning.runupRhythm ? 'rhythmLane' : 'speedFill',
          speedNorm: 0,
          startedAtMs: action.atMs,
          tapCount: 0,
          runupDistanceM: RUNUP_START_X_M,
          tap: {
            lastTapAtMs: null,
            lastTapMultiplier: 0
          },
          runupRhythm: difficultyTuning.runupRhythm
            ? {
                targetIntervalMs: getRunupTargetTapIntervalMs(0, difficultyTuning.runupRhythm),
                lastIntervalMs: null,
                lastOffsetMs: null,
                lastQuality: null,
                combo: 0,
                stability01: 0
              }
            : null,
          athletePose: {
            animTag: 'idle',
            animT: 0
          }
        }
      };
    }
    case 'rhythmTap': {
      if (state.phase.tag !== 'runup') {
        return state;
      }
      const difficultyTuning = getDifficultyGameplayTuning(state.difficulty, state.devTuningOverrides);
      const phase = state.phase;
      const lastTapAtMs = phase.tap.lastTapAtMs;
      const tapIntervalMs =
        lastTapAtMs === null ? Number.POSITIVE_INFINITY : Math.max(0, action.atMs - lastTapAtMs);
      const runupRhythmTuning = difficultyTuning.runupRhythm;
      const runupRhythmState = phase.runupRhythm;

      let tapGainMultiplier = 1;
      let tapGainNorm = difficultyTuning.speedUp.tapGainNorm;
      let nextRunupRhythm = runupRhythmState;

      if (lastTapAtMs !== null && runupRhythmTuning && runupRhythmState) {
        const targetIntervalMs = getRunupTargetTapIntervalMs(phase.speedNorm, runupRhythmTuning);
        const offsetMs = tapIntervalMs - targetIntervalMs;
        const quality = classifyRunupRhythmTap(tapIntervalMs, targetIntervalMs, runupRhythmTuning);
        const nextCombo = getNextRhythmCombo(runupRhythmState.combo, quality, runupRhythmTuning.comboMax);
        const tapGain = computeRhythmTapGain({
          intervalMs: tapIntervalMs,
          tapGainNorm: difficultyTuning.speedUp.tapGainNorm,
          tapSoftCapIntervalMs: difficultyTuning.speedUp.tapSoftCapIntervalMs,
          tapSoftCapMinMultiplier: difficultyTuning.speedUp.tapSoftCapMinMultiplier,
          quality,
          combo: nextCombo,
          tuning: runupRhythmTuning
        });
        tapGainNorm = tapGain.gainNorm;
        tapGainMultiplier =
          tapGainNorm / Math.max(0.0001, difficultyTuning.speedUp.tapGainNorm);
        nextRunupRhythm = {
          ...runupRhythmState,
          targetIntervalMs,
          lastIntervalMs: tapIntervalMs,
          lastOffsetMs: offsetMs,
          lastQuality: quality,
          combo: nextCombo,
          stability01: getNextRhythmStability(
            runupRhythmState.stability01,
            quality,
            runupRhythmTuning
          )
        };
      } else if (lastTapAtMs !== null) {
        tapGainMultiplier = runupTapGainMultiplier(
          tapIntervalMs,
          state.difficulty,
          state.devTuningOverrides
        );
        tapGainNorm = difficultyTuning.speedUp.tapGainNorm * tapGainMultiplier;
      } else if (runupRhythmTuning && runupRhythmState) {
        nextRunupRhythm = {
          ...runupRhythmState,
          targetIntervalMs: getRunupTargetTapIntervalMs(phase.speedNorm, runupRhythmTuning)
        };
      }

      const speedNorm = clamp(phase.speedNorm + tapGainNorm, 0, 1);

      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          ...phase,
          speedNorm,
          tapCount: Math.min(phase.tapCount + 1, RUNUP_MAX_TAPS),
          tap: {
            lastTapAtMs: action.atMs,
            lastTapMultiplier: tapGainMultiplier
          },
          runupRhythm:
            runupRhythmTuning && nextRunupRhythm
              ? {
                  ...nextRunupRhythm,
                  targetIntervalMs: getRunupTargetTapIntervalMs(speedNorm, runupRhythmTuning)
                }
              : nextRunupRhythm,
          athletePose: {
            animTag: isRunning(speedNorm) ? 'run' : 'idle',
            animT: isRunning(speedNorm)
              ? phase.athletePose.animTag === 'run'
                ? phase.athletePose.animT
                : 0
              : 0
          }
        }
      };
    }
    case 'beginChargeAim': {
      if (state.phase.tag !== 'runup') {
        return state;
      }
      const difficultyTuning = getDifficultyGameplayTuning(state.difficulty, state.devTuningOverrides);
      const chargeMeterSample = computeChargeMeterSample(
        0,
        difficultyTuning,
        state.phase.speedNorm
      );
      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          tag: 'chargeAim',
          speedNorm: state.phase.speedNorm,
          entrySpeedNorm: state.phase.speedNorm,
          runupDistanceM: state.phase.runupDistanceM,
          startedAtMs: state.phase.startedAtMs,
          runEntryAnimT: state.phase.athletePose.animT,
          angleDeg: state.aimAngleDeg,
          chargeStartedAtMs: action.atMs,
          chargeMeter: {
            mode: chargeMeterSample.mode,
            phase01: chargeMeterSample.phase01,
            perfectWindow: chargeMeterSample.perfectWindow,
            goodWindow: chargeMeterSample.goodWindow,
            lastQuality: chargeMeterSample.quality,
            lastSampleAtMs: action.atMs
          },
          forceNormPreview: chargeMeterSample.previewForceNorm,
          athletePose: {
            animTag: 'aim',
            animT: 0
          }
        }
      };
    }
    case 'adjustAngle': {
      if (state.phase.tag === 'chargeAim') {
        const nextAngleDeg = clamp(
          state.phase.angleDeg + action.deltaDeg,
          ANGLE_MIN_DEG,
          ANGLE_MAX_DEG
        );
        return {
          ...state,
          aimAngleDeg: nextAngleDeg,
          phase: {
            ...state.phase,
            angleDeg: nextAngleDeg
          }
        };
      }
      if (state.phase.tag === 'runup' || state.phase.tag === 'idle') {
        return {
          ...state,
          aimAngleDeg: clamp(state.aimAngleDeg + action.deltaDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG)
        };
      }
      return state;
    }
    case 'setAngle': {
      const nextAngleDeg = clamp(action.angleDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
      if (state.phase.tag === 'chargeAim') {
        return {
          ...state,
          aimAngleDeg: nextAngleDeg,
          phase: {
            ...state.phase,
            angleDeg: nextAngleDeg
          }
        };
      }
      if (state.phase.tag === 'runup' || state.phase.tag === 'idle') {
        return {
          ...state,
          aimAngleDeg: nextAngleDeg
        };
      }
      return state;
    }
    case 'releaseCharge': {
      if (state.phase.tag !== 'chargeAim') {
        return state;
      }
      const difficultyTuning = getDifficultyGameplayTuning(state.difficulty, state.devTuningOverrides);
      const elapsedMs = Math.max(0, action.atMs - state.phase.chargeStartedAtMs);
      const chargeMeterSample = computeChargeMeterSample(
        elapsedMs,
        difficultyTuning,
        state.phase.entrySpeedNorm
      );
      if (chargeMeterSample.completedCycles >= CHARGE_MAX_CYCLES) {
        return {
          ...state,
          nowMs: action.atMs,
          phase: createLateReleaseFaultPhase(state.phase, action.atMs)
        };
      }
      const forceNorm = computeReleaseForceNorm(
        chargeMeterSample.phase01,
        chargeMeterSample.quality,
        chargeMeterSample.mode
      );
      const releasePose = computeAthletePoseGeometry(
        {
          animTag: 'throw',
          animT: THROW_RELEASE_PROGRESS
        },
        state.phase.speedNorm,
        state.phase.angleDeg,
        state.phase.runupDistanceM
      );
      const lineCrossedAtRelease =
        Math.max(
          state.phase.runupDistanceM,
          releasePose.footFront.xM,
          releasePose.footBack.xM,
          releasePose.shoulderCenter.xM
        ) >= THROW_LINE_X_M;

      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          tag: 'throwAnim',
          speedNorm: state.phase.speedNorm,
          athleteXM: state.phase.runupDistanceM,
          angleDeg: state.phase.angleDeg,
          forceNorm,
          releaseQuality: chargeMeterSample.quality,
          releaseMeter: {
            mode: chargeMeterSample.mode,
            phase01: chargeMeterSample.phase01,
            perfectWindow: chargeMeterSample.perfectWindow,
            goodWindow: chargeMeterSample.goodWindow,
            lastQuality: chargeMeterSample.quality
          },
          lineCrossedAtRelease,
          releaseFlashAtMs: action.atMs,
          animProgress: 0,
          released: false,
          athletePose: {
            animTag: 'throw',
            animT: 0
          }
        }
      };
    }
    case 'tick': {
      const nextState: GameState = {
        ...state,
        nowMs: action.nowMs,
        windMs: advanceWindMs(state.windMs, action.dtMs, action.nowMs),
        windZMs: advanceCrosswindMs(state.windZMs, action.dtMs, action.nowMs)
      };
      if (nextState.phase.tag === 'idle' || nextState.phase.tag === 'result') {
        return nextState;
      }

      switch (nextState.phase.tag) {
        case 'fault':
          return tickFault(nextState, action.dtMs);
        case 'runup':
          return tickRunup(nextState, action.dtMs);
        case 'chargeAim':
          return tickChargeAim(nextState, action.dtMs, action.nowMs);
        case 'throwAnim':
          return tickThrowAnim(nextState, action.dtMs, action.nowMs);
        case 'flight':
          return tickFlight(nextState, action.dtMs);
        default: {
          const _exhaustive: never = nextState.phase;
          return _exhaustive;
        }
      }
    }
    case 'setResultHighscoreFlag': {
      if (state.phase.tag !== 'result') {
        return state;
      }
      return {
        ...state,
        phase: {
          ...state.phase,
          isHighscore: action.isHighscore
        }
      };
    }
    case 'resetToIdle': {
      return {
        ...state,
        phase: { tag: 'idle' }
      };
    }
    default: {
      return state;
    }
  }
};
