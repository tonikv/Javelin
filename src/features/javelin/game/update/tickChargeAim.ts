/**
 * Advance the charge-aim phase by one tick.
 * Updates meter cycling, run slowdown, and mixed run-to-aim animation blending.
 */
import { RUNUP_MAX_X_M } from '../constants';
import { computeChargeMeterSample } from '../chargeMeter';
import { clamp } from '../math';
import { GAMEPLAY_TUNING, getDifficultyGameplayTuning } from '../tuning';
import type { GameState } from '../types';
import { advanceRunAnimT, createLateReleaseFaultPhase, runSpeedMsFromNorm } from './helpers';

const {
  chargeMaxCycles: CHARGE_MAX_CYCLES,
  runToDrawbackBlendMs: RUN_TO_DRAWBACK_BLEND_MS
} = GAMEPLAY_TUNING.throwPhase;
const { runupStartXM: RUNUP_START_X_M } = GAMEPLAY_TUNING.movement;

export const tickChargeAim = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'chargeAim') {
    return state;
  }
  const tuning = getDifficultyGameplayTuning(state.difficulty, state.devTuningOverrides);

  const elapsedMs = Math.max(0, nowMs - state.phase.chargeStartedAtMs);
  const meterSample = computeChargeMeterSample(elapsedMs, tuning, state.phase.entrySpeedNorm);
  if (meterSample.completedCycles >= CHARGE_MAX_CYCLES) {
    return {
      ...state,
      phase: createLateReleaseFaultPhase(state.phase, nowMs)
    };
  }

  const speedAfterDecay = clamp(
    state.phase.speedNorm - (dtMs / 1000) * tuning.movement.chargeAimSpeedDecayPerSecond,
    0,
    1
  );
  const speedNorm = Math.max(speedAfterDecay, 0);
  const stillRunning = speedNorm > tuning.movement.chargeAimStopSpeedNorm;
  const runSpeedMs = stillRunning ? runSpeedMsFromNorm(speedNorm) : 0;
  const runupDistanceM = clamp(
    state.phase.runupDistanceM + runSpeedMs * (dtMs / 1000),
    RUNUP_START_X_M,
    RUNUP_MAX_X_M
  );
  const blend01 = clamp(elapsedMs / RUN_TO_DRAWBACK_BLEND_MS, 0, 1);
  const aimAnimT = blend01 < 1 ? blend01 * 0.2 : meterSample.phase01;
  const legAnimT = stillRunning
    ? advanceRunAnimT(state.phase.runEntryAnimT, dtMs, speedNorm)
    : state.phase.runEntryAnimT;

  return {
    ...state,
    phase: {
      ...state.phase,
      speedNorm,
      runupDistanceM,
      runEntryAnimT: legAnimT,
      forceNormPreview: meterSample.previewForceNorm,
      chargeMeter: {
        ...state.phase.chargeMeter,
        mode: meterSample.mode,
        phase01: meterSample.phase01,
        perfectWindow: meterSample.perfectWindow,
        goodWindow: meterSample.goodWindow,
        lastQuality: meterSample.quality,
        lastSampleAtMs: nowMs
      },
      athletePose: {
        animTag: 'aim',
        animT: aimAnimT
      }
    }
  };
};
