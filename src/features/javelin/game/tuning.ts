import type { MeterWindow } from "./types";

type SpeedUpTuning = {
  tapGainNorm: number;
  tapSoftCapIntervalMs: number;
  tapSoftCapMinMultiplier: number;
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

type WindTuning = {
  cycleDurationMs: number;
  cycleAmplitudeMs: number;
  cycleHarmonicMultiplier: number;
  cycleHarmonicAmplitudeMs: number;
  randomKeyframeMs: number;
  randomAmplitudeMs: number;
  randomBlend: number;
  microGustPeriodMs: number;
  microGustAmplitudeMs: number;
  smoothingMs: number;
  crosswindPhaseOffsetRad: number;
  crosswindAmplitudeScale: number;
  visualCalmThresholdMs: number;
  visualMaxReferenceMs: number;
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
  runupTapVolume: number;
  crowdVolume: number;
  effectsVolume: number;
  crowdAmbientGain: number;
};

export type GameplayTuning = {
  speedUp: SpeedUpTuning;
  throwPhase: ThrowPhaseTuning;
  movement: MovementTuning;
  wind: WindTuning;
  angleControl: AngleControlTuning;
  trajectoryIndicator: TrajectoryIndicatorTuning;
  audio: AudioTuning;
};

/**
 * Central gameplay tuning values.
 *
 * Difficulty guidance:
 * - Easier run-up: increase tapGainNorm and/or reduce runupSpeedDecayPerSecond.
 * - Stronger anti-mash curve: increase tapSoftCapIntervalMs or reduce tapSoftCapMinMultiplier.
 * - Easier throw timing: wider charge windows and/or slower chargeFillDurationMs.
 */
export const GAMEPLAY_TUNING: GameplayTuning = {
  speedUp: {
    tapGainNorm: 0.085,
    tapSoftCapIntervalMs: 105,
    tapSoftCapMinMultiplier: 0.2,
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
    runupSpeedDecayPerSecond: 0.18,
    chargeAimSpeedDecayPerSecond: 0.2,
    chargeAimStopSpeedNorm: 0.03,
    followThroughStepDistanceM: 0.75,
    faultStumbleDistanceM: 0.82,
  },
  /**
   * Wind model tuning.
   *
   * These values drive both gameplay wind and flag behavior.
   * The default profile is intentionally readable: players can spot a favorable trend
   * and still complete run-up + charge + throw inside the same wind phase.
   */
  wind: {
    // Full headwind->tailwind->headwind cycle. Larger = slower changes and longer reaction window.
    cycleDurationMs: 28000,
    // Main forward-wind strength. Tuned below clamp to avoid flat clipping at +/- max wind.
    cycleAmplitudeMs: 1.85,
    // Secondary wave speed multiplier (relative to main cycle).
    cycleHarmonicMultiplier: 2,
    // Secondary wave strength. Keep moderate so cycle shape remains readable while not robotic.
    cycleHarmonicAmplitudeMs: 0.28,
    // Random trend anchor spacing. Larger = slower random drift between broad wind moods.
    randomKeyframeMs: 11000,
    // Max random contribution before blending.
    randomAmplitudeMs: 0.28,
    // 0..1 blend for randomness. Lower = players can time throws from visible trend.
    randomBlend: 0.12,
    // Small high-frequency wobble period to avoid robotic motion.
    microGustPeriodMs: 3200,
    // Small high-frequency wobble amount. Keep subtle so wind remains legible.
    microGustAmplitudeMs: 0.07,
    // State response lag. Larger = smoother/slower changes.
    smoothingMs: 1500,
    // Crosswind cycle phase shift from forward wind. Offset gives lateral drift peaks at different times.
    crosswindPhaseOffsetRad: 1.3,
    // Crosswind strength as fraction of forward-wind target.
    crosswindAmplitudeScale: 0.35,
    // Below this magnitude, the flag appears mostly hanging.
    visualCalmThresholdMs: 0.2,
    // Magnitude mapped to "full wind" flag pose.
    visualMaxReferenceMs: 2.4,
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
    numPoints: 20,
    timeStepS: 0.12,
    dotRadiusPx: 3,
    baseOpacity: 0.55,
    endOpacity: 0.1,
    dotColor: "#1a6b9a",
  },
  audio: {
    masterVolume: 0.5,
    runupTapVolume: 0.8,
    crowdVolume: 0.4,
    effectsVolume: 0.7,
    crowdAmbientGain: 0.018,
  },
};

export const RUNUP_TAP_GAIN_NORM = GAMEPLAY_TUNING.speedUp.tapGainNorm;
export const RUNUP_TAP_SOFT_CAP_INTERVAL_MS =
  GAMEPLAY_TUNING.speedUp.tapSoftCapIntervalMs;
export const RUNUP_TAP_SOFT_CAP_MIN_MULTIPLIER =
  GAMEPLAY_TUNING.speedUp.tapSoftCapMinMultiplier;

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

export const WIND_CYCLE_DURATION_MS = GAMEPLAY_TUNING.wind.cycleDurationMs;
export const WIND_CYCLE_AMPLITUDE_MS = GAMEPLAY_TUNING.wind.cycleAmplitudeMs;
export const WIND_CYCLE_HARMONIC_MULTIPLIER =
  GAMEPLAY_TUNING.wind.cycleHarmonicMultiplier;
export const WIND_CYCLE_HARMONIC_AMPLITUDE_MS =
  GAMEPLAY_TUNING.wind.cycleHarmonicAmplitudeMs;
export const WIND_RANDOM_KEYFRAME_MS = GAMEPLAY_TUNING.wind.randomKeyframeMs;
export const WIND_RANDOM_AMPLITUDE_MS = GAMEPLAY_TUNING.wind.randomAmplitudeMs;
export const WIND_RANDOM_BLEND = GAMEPLAY_TUNING.wind.randomBlend;
export const WIND_MICRO_GUST_PERIOD_MS = GAMEPLAY_TUNING.wind.microGustPeriodMs;
export const WIND_MICRO_GUST_AMPLITUDE_MS =
  GAMEPLAY_TUNING.wind.microGustAmplitudeMs;
export const WIND_SMOOTHING_MS = GAMEPLAY_TUNING.wind.smoothingMs;
export const WIND_CROSSWIND_PHASE_OFFSET_RAD =
  GAMEPLAY_TUNING.wind.crosswindPhaseOffsetRad;
export const WIND_CROSSWIND_AMPLITUDE_SCALE =
  GAMEPLAY_TUNING.wind.crosswindAmplitudeScale;
export const WIND_VISUAL_CALM_THRESHOLD_MS =
  GAMEPLAY_TUNING.wind.visualCalmThresholdMs;
export const WIND_VISUAL_MAX_REFERENCE_MS =
  GAMEPLAY_TUNING.wind.visualMaxReferenceMs;

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
export const AUDIO_RUNUP_TAP_VOLUME = GAMEPLAY_TUNING.audio.runupTapVolume;
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
