import {
  ANGLE_DEFAULT_DEG,
  ANGLE_MAX_DEG,
  ANGLE_MIN_DEG,
  ARM_PREP_DURATION_MS,
  ARM_RELEASE_WINDOW,
  BEAT_INTERVAL_MS,
  GOOD_WINDOW_MS,
  PERFECT_WINDOW_MS,
  RUNUP_MAX_TAPS,
  RUNUP_MIN_TAPS_FOR_THROW,
  RUNUP_SPEED_DECAY_PER_SECOND,
  SPAM_PENALTY_MS,
  SPAM_THRESHOLD_MS
} from './constants';
import { createProjectile, updateProjectile } from './physics';
import { computeThrowDistance } from './scoring';
import type { FaultReason, GameAction, GameState } from './types';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const nearestBeatDeltaMs = (startedAtMs: number, atMs: number): number => {
  const elapsed = atMs - startedAtMs;
  const beatIndex = Math.round(elapsed / BEAT_INTERVAL_MS);
  const beatTime = startedAtMs + beatIndex * BEAT_INTERVAL_MS;
  return Math.abs(atMs - beatTime);
};

const rhythmTapSpeedDelta = (deltaMs: number): number => {
  if (deltaMs <= PERFECT_WINDOW_MS) {
    return 0.11;
  }
  if (deltaMs <= GOOD_WINDOW_MS) {
    return 0.07;
  }
  return 0.025;
};

const getFaultForRelease = (angleDeg: number, releaseTiming: number): FaultReason | null => {
  if (angleDeg <= ANGLE_MIN_DEG + 0.2) {
    return 'lowAngle';
  }
  if (releaseTiming < 0.12) {
    return 'invalidRelease';
  }
  if (releaseTiming > 1.02) {
    return 'lateRelease';
  }
  return null;
};

export const createInitialGameState = (): GameState => ({
  nowMs: performance.now(),
  roundId: 0,
  windMs: 0,
  phase: { tag: 'idle' }
});

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'startRound': {
      return {
        ...state,
        nowMs: action.atMs,
        roundId: state.roundId + 1,
        windMs: action.windMs,
        phase: {
          tag: 'runup',
          speedNorm: 0.08,
          startedAtMs: action.atMs,
          tapCount: 0,
          rhythm: {
            lastTapAtMs: null,
            perfectHits: 0,
            goodHits: 0,
            penaltyUntilMs: 0
          }
        }
      };
    }
    case 'rhythmTap': {
      if (state.phase.tag !== 'runup') {
        return state;
      }
      const phase = state.phase;
      const inPenalty = action.atMs < phase.rhythm.penaltyUntilMs;
      const tapInterval = phase.rhythm.lastTapAtMs === null ? Number.POSITIVE_INFINITY : action.atMs - phase.rhythm.lastTapAtMs;
      const isSpam = tapInterval < SPAM_THRESHOLD_MS;
      const beatDelta = nearestBeatDeltaMs(phase.startedAtMs, action.atMs);
      const baseDelta = inPenalty || isSpam ? -0.05 : rhythmTapSpeedDelta(beatDelta);
      const speedNorm = clamp(phase.speedNorm + baseDelta, 0, 1);
      const perfectHits = phase.rhythm.perfectHits + (beatDelta <= PERFECT_WINDOW_MS ? 1 : 0);
      const goodHits = phase.rhythm.goodHits + (beatDelta <= GOOD_WINDOW_MS ? 1 : 0);
      const penaltyUntilMs = isSpam ? action.atMs + SPAM_PENALTY_MS : phase.rhythm.penaltyUntilMs;

      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          ...phase,
          speedNorm,
          tapCount: Math.min(phase.tapCount + 1, RUNUP_MAX_TAPS),
          rhythm: {
            lastTapAtMs: action.atMs,
            perfectHits,
            goodHits,
            penaltyUntilMs
          }
        }
      };
    }
    case 'beginThrowPrep': {
      if (state.phase.tag !== 'runup') {
        return state;
      }
      if (state.phase.tapCount < RUNUP_MIN_TAPS_FOR_THROW) {
        return state;
      }
      return {
        ...state,
        phase: {
          tag: 'throwPrep',
          speedNorm: state.phase.speedNorm,
          angleDeg: ANGLE_DEFAULT_DEG,
          armPhase: 0,
          releaseWindow: ARM_RELEASE_WINDOW
        }
      };
    }
    case 'adjustAngle': {
      if (state.phase.tag !== 'throwPrep') {
        return state;
      }
      return {
        ...state,
        phase: {
          ...state.phase,
          angleDeg: clamp(state.phase.angleDeg + action.deltaDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG)
        }
      };
    }
    case 'releaseThrow': {
      if (state.phase.tag !== 'throwPrep') {
        return state;
      }
      const releaseTiming = clamp(state.phase.armPhase, 0, 1.1);
      const fault = getFaultForRelease(state.phase.angleDeg, releaseTiming);
      if (fault !== null) {
        return {
          ...state,
          phase: { tag: 'fault', reason: fault }
        };
      }

      const distanceM = computeThrowDistance({
        speedNorm: state.phase.speedNorm,
        angleDeg: state.phase.angleDeg,
        releaseTiming,
        windMs: state.windMs
      });

      return {
        ...state,
        phase: {
          tag: 'flight',
          projectile: createProjectile(distanceM),
          launchedFrom: {
            speedNorm: state.phase.speedNorm,
            angleDeg: state.phase.angleDeg,
            releaseTiming,
            windMs: state.windMs,
            expectedDistanceM: distanceM
          }
        }
      };
    }
    case 'tick': {
      if (
        state.phase.tag === 'idle' ||
        state.phase.tag === 'result' ||
        state.phase.tag === 'fault'
      ) {
        return state;
      }

      const nextState: GameState = { ...state, nowMs: action.nowMs };
      if (nextState.phase.tag === 'runup') {
        const speedNorm = clamp(
          nextState.phase.speedNorm - (action.dtMs / 1000) * RUNUP_SPEED_DECAY_PER_SECOND,
          0,
          1
        );
        return {
          ...nextState,
          phase: {
            ...nextState.phase,
            speedNorm
          }
        };
      }
      if (nextState.phase.tag === 'throwPrep') {
        const armPhase = nextState.phase.armPhase + action.dtMs / ARM_PREP_DURATION_MS;
        if (armPhase > 1.05) {
          return {
            ...nextState,
            phase: { tag: 'fault', reason: 'lateRelease' }
          };
        }
        return {
          ...nextState,
          phase: {
            ...nextState.phase,
            armPhase
          }
        };
      }
      if (nextState.phase.tag === 'flight') {
        const updated = updateProjectile(nextState.phase.projectile, action.dtMs);
        if (updated.landed) {
          return {
            ...nextState,
            phase: {
              tag: 'result',
              distanceM: nextState.phase.launchedFrom.expectedDistanceM,
              isHighscore: false
            }
          };
        }
        return {
          ...nextState,
          phase: {
            ...nextState.phase,
            projectile: updated.projectile
          }
        };
      }
      return nextState;
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
