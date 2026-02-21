import type { MeterWindow } from './types';

type SpeedUpTuning = {
  beatIntervalMs: number;
  perfectWindowMs: number;
  goodWindowMs: number;
  spamThresholdMs: number;
  spamPenaltyMs: number;
  passiveToHalfMs: number;
  passiveMaxSpeedNorm: number;
  hitSpeedDelta: {
    perfect: number;
    good: number;
    miss: number;
    inPenalty: number;
    spam: number;
  };
};

type ThrowPhaseTuning = {
  chargeFillDurationMs: number;
  chargeOverfillFault01: number;
  faultJavelinLaunchSpeedMs: number;
  chargePerfectWindow: MeterWindow;
  chargeGoodWindow: MeterWindow;
  runToDrawbackBlendMs: number;
  throwAnimDurationMs: number;
  throwReleaseProgress01: number;
};

type MovementTuning = {
  runupStartXM: number;
  runupSpeedDecayPerSecond: number;
  chargeAimSpeedDecayPerSecond: number;
  chargeAimStopSpeedNorm: number;
  followThroughStepDistanceM: number;
  faultStumbleDistanceM: number;
};

export type GameplayTuning = {
  speedUp: SpeedUpTuning;
  throwPhase: ThrowPhaseTuning;
  movement: MovementTuning;
};

/**
 * Central gameplay tuning values.
 *
 * Difficulty guidance:
 * - Easier speed-up: lower beatIntervalMs, wider perfect/good windows, less negative miss/spam deltas.
 * - Easier throw timing: wider charge windows and/or slower chargeFillDurationMs.
 */
export const GAMEPLAY_TUNING: GameplayTuning = {
  speedUp: {
    beatIntervalMs: 820,
    perfectWindowMs: 120,
    goodWindowMs: 230,
    spamThresholdMs: 130,
    spamPenaltyMs: 220,
    passiveToHalfMs: 3200,
    passiveMaxSpeedNorm: 0.62,
    hitSpeedDelta: {
      perfect: 0.15,
      good: 0.07,
      miss: -0.008,
      inPenalty: -0.025,
      spam: -0.055,
    },
  },
  throwPhase: {
    chargeFillDurationMs: 800,
    chargeOverfillFault01: 1.03,
    faultJavelinLaunchSpeedMs: 8.4,
    chargePerfectWindow: { start: 0.78, end: 0.98 },
    chargeGoodWindow: { start: 0.56, end: 0.98 },
    runToDrawbackBlendMs: 420,
    throwAnimDurationMs: 320,
    throwReleaseProgress01: 0.56,
  },
  movement: {
    runupStartXM: -7.6,
    runupSpeedDecayPerSecond: 0.012,
    chargeAimSpeedDecayPerSecond: 0.2,
    chargeAimStopSpeedNorm: 0.03,
    followThroughStepDistanceM: 0.75,
    faultStumbleDistanceM: 0.82,
  },
};

export const BEAT_INTERVAL_MS = GAMEPLAY_TUNING.speedUp.beatIntervalMs;
export const PERFECT_WINDOW_MS = GAMEPLAY_TUNING.speedUp.perfectWindowMs;
export const GOOD_WINDOW_MS = GAMEPLAY_TUNING.speedUp.goodWindowMs;
export const SPAM_THRESHOLD_MS = GAMEPLAY_TUNING.speedUp.spamThresholdMs;
export const SPAM_PENALTY_MS = GAMEPLAY_TUNING.speedUp.spamPenaltyMs;
export const RUNUP_PASSIVE_MAX_SPEED = GAMEPLAY_TUNING.speedUp.passiveMaxSpeedNorm;
export const RUNUP_PASSIVE_TO_HALF_MS = GAMEPLAY_TUNING.speedUp.passiveToHalfMs;

export const RHYTHM_SPEED_DELTA_PERFECT = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.perfect;
export const RHYTHM_SPEED_DELTA_GOOD = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.good;
export const RHYTHM_SPEED_DELTA_MISS = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.miss;
export const RHYTHM_SPEED_DELTA_IN_PENALTY = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.inPenalty;
export const RHYTHM_SPEED_DELTA_SPAM = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.spam;

export const RUNUP_START_X_M = GAMEPLAY_TUNING.movement.runupStartXM;
export const RUNUP_SPEED_DECAY_PER_SECOND = GAMEPLAY_TUNING.movement.runupSpeedDecayPerSecond;
export const CHARGE_AIM_SPEED_DECAY_PER_SECOND = GAMEPLAY_TUNING.movement.chargeAimSpeedDecayPerSecond;
export const CHARGE_AIM_STOP_SPEED_NORM = GAMEPLAY_TUNING.movement.chargeAimStopSpeedNorm;
export const FOLLOW_THROUGH_STEP_DISTANCE_M = GAMEPLAY_TUNING.movement.followThroughStepDistanceM;
export const FAULT_STUMBLE_DISTANCE_M = GAMEPLAY_TUNING.movement.faultStumbleDistanceM;

// Deprecated aliases kept for compatibility during transition.
export const CHARGEAIM_SPEED_DECAY_PER_SECOND = CHARGE_AIM_SPEED_DECAY_PER_SECOND;
export const CHARGEAIM_STOP_SPEED_NORM = CHARGE_AIM_STOP_SPEED_NORM;

export const CHARGE_FILL_DURATION_MS = GAMEPLAY_TUNING.throwPhase.chargeFillDurationMs;
export const CHARGE_OVERFILL_FAULT_01 = GAMEPLAY_TUNING.throwPhase.chargeOverfillFault01;
export const FAULT_JAVELIN_LAUNCH_SPEED_MS = GAMEPLAY_TUNING.throwPhase.faultJavelinLaunchSpeedMs;
export const CHARGE_PERFECT_WINDOW = GAMEPLAY_TUNING.throwPhase.chargePerfectWindow;
export const CHARGE_GOOD_WINDOW = GAMEPLAY_TUNING.throwPhase.chargeGoodWindow;
export const RUN_TO_DRAWBACK_BLEND_MS = GAMEPLAY_TUNING.throwPhase.runToDrawbackBlendMs;
export const THROW_ANIM_DURATION_MS = GAMEPLAY_TUNING.throwPhase.throwAnimDurationMs;
export const THROW_RELEASE_PROGRESS = GAMEPLAY_TUNING.throwPhase.throwReleaseProgress01;
