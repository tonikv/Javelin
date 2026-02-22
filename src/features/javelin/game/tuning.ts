import type { MeterWindow } from "./types";

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
  chargeMaxCycles: number;
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

type AngleControlTuning = {
  stepDeg: number;
  holdStartDegPerSec: number;
  holdMaxDegPerSec: number;
  rampMs: number;
  pointerDeadzonePx: number;
  pointerSmoothing: number;
};

type TrajectoryIndicatorTuning = {
  numPoints: number;
  timeStepS: number;
  dotRadiusPx: number;
  baseOpacity: number;
  endOpacity: number;
  dotColor: string;
};

type AudioTuning = {
  masterVolume: number;
  rhythmVolume: number;
  crowdVolume: number;
  effectsVolume: number;
  crowdAmbientGain: number;
};

export type GameplayTuning = {
  speedUp: SpeedUpTuning;
  throwPhase: ThrowPhaseTuning;
  movement: MovementTuning;
  angleControl: AngleControlTuning;
  trajectoryIndicator: TrajectoryIndicatorTuning;
  audio: AudioTuning;
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
    beatIntervalMs: 620,
    perfectWindowMs: 120,
    goodWindowMs: 230,
    spamThresholdMs: 130,
    spamPenaltyMs: 220,
    passiveToHalfMs: 3200,
    passiveMaxSpeedNorm: 0.62,
    hitSpeedDelta: {
      perfect: 0.17,
      good: 0.07,
      miss: -0.08,
      inPenalty: -0.25,
      spam: -0.015,
    },
  },
  throwPhase: {
    chargeFillDurationMs: 800,
    chargeMaxCycles: 3,
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
  angleControl: {
    stepDeg: 1.0,
    holdStartDegPerSec: 30,
    holdMaxDegPerSec: 120,
    rampMs: 600,
    pointerDeadzonePx: 12,
    pointerSmoothing: 0.4,
  },
  trajectoryIndicator: {
    numPoints: 10,
    timeStepS: 0.12,
    dotRadiusPx: 3,
    baseOpacity: 0.55,
    endOpacity: 0.1,
    dotColor: "#1a6b9a",
  },
  audio: {
    masterVolume: 0.5,
    rhythmVolume: 0.8,
    crowdVolume: 0.4,
    effectsVolume: 0.7,
    crowdAmbientGain: 0.018,
  },
};

export const BEAT_INTERVAL_MS = GAMEPLAY_TUNING.speedUp.beatIntervalMs;
export const PERFECT_WINDOW_MS = GAMEPLAY_TUNING.speedUp.perfectWindowMs;
export const GOOD_WINDOW_MS = GAMEPLAY_TUNING.speedUp.goodWindowMs;
export const SPAM_THRESHOLD_MS = GAMEPLAY_TUNING.speedUp.spamThresholdMs;
export const SPAM_PENALTY_MS = GAMEPLAY_TUNING.speedUp.spamPenaltyMs;
export const RUNUP_PASSIVE_MAX_SPEED =
  GAMEPLAY_TUNING.speedUp.passiveMaxSpeedNorm;
export const RUNUP_PASSIVE_TO_HALF_MS = GAMEPLAY_TUNING.speedUp.passiveToHalfMs;

export const RHYTHM_SPEED_DELTA_PERFECT =
  GAMEPLAY_TUNING.speedUp.hitSpeedDelta.perfect;
export const RHYTHM_SPEED_DELTA_GOOD =
  GAMEPLAY_TUNING.speedUp.hitSpeedDelta.good;
export const RHYTHM_SPEED_DELTA_MISS =
  GAMEPLAY_TUNING.speedUp.hitSpeedDelta.miss;
export const RHYTHM_SPEED_DELTA_IN_PENALTY =
  GAMEPLAY_TUNING.speedUp.hitSpeedDelta.inPenalty;
export const RHYTHM_SPEED_DELTA_SPAM =
  GAMEPLAY_TUNING.speedUp.hitSpeedDelta.spam;

export const RUNUP_START_X_M = GAMEPLAY_TUNING.movement.runupStartXM;
export const RUNUP_SPEED_DECAY_PER_SECOND =
  GAMEPLAY_TUNING.movement.runupSpeedDecayPerSecond;
export const CHARGE_AIM_SPEED_DECAY_PER_SECOND =
  GAMEPLAY_TUNING.movement.chargeAimSpeedDecayPerSecond;
export const CHARGE_AIM_STOP_SPEED_NORM =
  GAMEPLAY_TUNING.movement.chargeAimStopSpeedNorm;
export const FOLLOW_THROUGH_STEP_DISTANCE_M =
  GAMEPLAY_TUNING.movement.followThroughStepDistanceM;
export const FAULT_STUMBLE_DISTANCE_M =
  GAMEPLAY_TUNING.movement.faultStumbleDistanceM;

export const ANGLE_KEYBOARD_STEP_DEG = GAMEPLAY_TUNING.angleControl.stepDeg;
export const ANGLE_KEYBOARD_HOLD_START_DEG_PER_SEC =
  GAMEPLAY_TUNING.angleControl.holdStartDegPerSec;
export const ANGLE_KEYBOARD_HOLD_MAX_DEG_PER_SEC =
  GAMEPLAY_TUNING.angleControl.holdMaxDegPerSec;
export const ANGLE_KEYBOARD_RAMP_MS = GAMEPLAY_TUNING.angleControl.rampMs;
export const ANGLE_POINTER_DEADZONE_PX =
  GAMEPLAY_TUNING.angleControl.pointerDeadzonePx;
export const ANGLE_POINTER_SMOOTHING =
  GAMEPLAY_TUNING.angleControl.pointerSmoothing;

export const TRAJECTORY_PREVIEW_NUM_POINTS =
  GAMEPLAY_TUNING.trajectoryIndicator.numPoints;
export const TRAJECTORY_PREVIEW_TIME_STEP_S =
  GAMEPLAY_TUNING.trajectoryIndicator.timeStepS;
export const TRAJECTORY_PREVIEW_DOT_RADIUS_PX =
  GAMEPLAY_TUNING.trajectoryIndicator.dotRadiusPx;
export const TRAJECTORY_PREVIEW_BASE_OPACITY =
  GAMEPLAY_TUNING.trajectoryIndicator.baseOpacity;
export const TRAJECTORY_PREVIEW_END_OPACITY =
  GAMEPLAY_TUNING.trajectoryIndicator.endOpacity;
export const TRAJECTORY_PREVIEW_DOT_COLOR =
  GAMEPLAY_TUNING.trajectoryIndicator.dotColor;

export const AUDIO_MASTER_VOLUME = GAMEPLAY_TUNING.audio.masterVolume;
export const AUDIO_RHYTHM_VOLUME = GAMEPLAY_TUNING.audio.rhythmVolume;
export const AUDIO_CROWD_VOLUME = GAMEPLAY_TUNING.audio.crowdVolume;
export const AUDIO_EFFECTS_VOLUME = GAMEPLAY_TUNING.audio.effectsVolume;
export const AUDIO_CROWD_AMBIENT_GAIN = GAMEPLAY_TUNING.audio.crowdAmbientGain;

export const CHARGE_FILL_DURATION_MS =
  GAMEPLAY_TUNING.throwPhase.chargeFillDurationMs;
export const CHARGE_MAX_CYCLES = GAMEPLAY_TUNING.throwPhase.chargeMaxCycles;
export const FAULT_JAVELIN_LAUNCH_SPEED_MS =
  GAMEPLAY_TUNING.throwPhase.faultJavelinLaunchSpeedMs;
export const CHARGE_PERFECT_WINDOW =
  GAMEPLAY_TUNING.throwPhase.chargePerfectWindow;
export const CHARGE_GOOD_WINDOW = GAMEPLAY_TUNING.throwPhase.chargeGoodWindow;
export const RUN_TO_DRAWBACK_BLEND_MS =
  GAMEPLAY_TUNING.throwPhase.runToDrawbackBlendMs;
export const THROW_ANIM_DURATION_MS =
  GAMEPLAY_TUNING.throwPhase.throwAnimDurationMs;
export const THROW_RELEASE_PROGRESS =
  GAMEPLAY_TUNING.throwPhase.throwReleaseProgress01;
