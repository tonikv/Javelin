/**
 * Advance the charge-aim phase by one tick.
 * Updates meter cycling, run slowdown, and mixed run-to-aim animation blending.
 */
import { RUNUP_MAX_X_M } from '../constants';
import { computeForcePreview, getTimingQuality } from '../chargeMeter';
import { clamp } from '../math';
import { GAMEPLAY_TUNING } from '../tuning';
import type { GameState } from '../types';
import { advanceRunAnimT, createLateReleaseFaultPhase, runSpeedMsFromNorm } from './helpers';

const {
  chargeAimSpeedDecayPerSecond: CHARGE_AIM_SPEED_DECAY_PER_SECOND,
  chargeAimStopSpeedNorm: CHARGE_AIM_STOP_SPEED_NORM,
  runupStartXM: RUNUP_START_X_M
} = GAMEPLAY_TUNING.movement;
const {
  chargeFillDurationMs: CHARGE_FILL_DURATION_MS,
  chargeMaxCycles: CHARGE_MAX_CYCLES,
  runToDrawbackBlendMs: RUN_TO_DRAWBACK_BLEND_MS
} = GAMEPLAY_TUNING.throwPhase;

export const tickChargeAim = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'chargeAim') {
    return state;
  }

  const elapsedMs = Math.max(0, nowMs - state.phase.chargeStartedAtMs);
  const rawFill01 = elapsedMs / CHARGE_FILL_DURATION_MS;
  const fullCycles = Math.floor(rawFill01);
  if (fullCycles >= CHARGE_MAX_CYCLES) {
    return {
      ...state,
      phase: createLateReleaseFaultPhase(state.phase, nowMs)
    };
  }

  const phase01 = clamp(rawFill01 % 1, 0, 1);
  const speedAfterDecay = clamp(
    state.phase.speedNorm - (dtMs / 1000) * CHARGE_AIM_SPEED_DECAY_PER_SECOND,
    0,
    1
  );
  const speedNorm = Math.max(speedAfterDecay, 0);
  const stillRunning = speedNorm > CHARGE_AIM_STOP_SPEED_NORM;
  const runSpeedMs = stillRunning ? runSpeedMsFromNorm(speedNorm) : 0;
  const runupDistanceM = clamp(
    state.phase.runupDistanceM + runSpeedMs * (dtMs / 1000),
    RUNUP_START_X_M,
    RUNUP_MAX_X_M
  );
  const blend01 = clamp(elapsedMs / RUN_TO_DRAWBACK_BLEND_MS, 0, 1);
  const aimAnimT = blend01 < 1 ? blend01 * 0.2 : phase01;
  const legAnimT = stillRunning
    ? advanceRunAnimT(state.phase.runEntryAnimT, dtMs, speedNorm)
    : state.phase.runEntryAnimT;
  const forceNormPreview = computeForcePreview(phase01);
  const quality = getTimingQuality(
    phase01,
    state.phase.chargeMeter.perfectWindow,
    state.phase.chargeMeter.goodWindow
  );

  return {
    ...state,
    phase: {
      ...state.phase,
      speedNorm,
      runupDistanceM,
      runEntryAnimT: legAnimT,
      forceNormPreview,
      chargeMeter: {
        ...state.phase.chargeMeter,
        phase01,
        lastQuality: quality,
        lastSampleAtMs: nowMs
      },
      athletePose: {
        animTag: 'aim',
        animT: aimAnimT
      }
    }
  };
};
