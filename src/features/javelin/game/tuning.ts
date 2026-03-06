import type { DifficultyLevel, MeterWindow } from './types';
import { clamp } from './math';

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

export type RunupTempoCurvePoint = {
  speedNorm: number;
  targetIntervalMs: number;
};

export type RunupRhythmTuning = {
  tempoCurve: RunupTempoCurvePoint[];
  perfectToleranceRatio: number;
  goodToleranceRatio: number;
  missMultiplier: number;
  goodMultiplier: number;
  perfectMultiplier: number;
  stabilityGainPerGood: number;
  stabilityLossPerMiss: number;
  stableDecayMultiplier: number;
  unstableDecayMultiplier: number;
  comboMax: number;
};

export type ReleaseMeterTuning = {
  sweepDurationMsMin: number;
  sweepDurationMsMax: number;
  perfectWidth: number;
  goodWidth: number;
  highSpeedPerfectWidth: number;
  highSpeedGoodWidth: number;
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

type DifficultyThrowPhaseTuning = Pick<
  ThrowPhaseTuning,
  'chargeFillDurationMs' | 'chargePerfectWindow' | 'chargeGoodWindow'
>;

type DifficultyMovementTuning = Pick<
  MovementTuning,
  'runupSpeedDecayPerSecond' | 'chargeAimSpeedDecayPerSecond' | 'chargeAimStopSpeedNorm'
>;

export type DifficultyGameplayTuning = {
  speedUp: SpeedUpTuning;
  throwPhase: DifficultyThrowPhaseTuning;
  movement: DifficultyMovementTuning;
  runupRhythm?: RunupRhythmTuning;
  releaseMeter?: ReleaseMeterTuning;
};

export type DifficultyGameplayTuningOverride = {
  tapGainNorm?: number;
  tapSoftCapIntervalMs?: number;
  tapSoftCapMinMultiplier?: number;
  runupSpeedDecayPerSecond?: number;
  chargeAimSpeedDecayPerSecond?: number;
  chargeAimStopSpeedNorm?: number;
  chargeFillDurationMs?: number;
  chargePerfectWindow?: Partial<MeterWindow>;
  chargeGoodWindow?: Partial<MeterWindow>;
  runupRhythm?: Partial<RunupRhythmTuning>;
  releaseMeter?: Partial<ReleaseMeterTuning>;
};

export type DifficultyGameplayTuningOverrides = Partial<
  Record<DifficultyLevel, DifficultyGameplayTuningOverride>
>;

export const EMPTY_DIFFICULTY_GAMEPLAY_TUNING_OVERRIDES: DifficultyGameplayTuningOverrides = {};

/**
 * Central gameplay tuning values.
 *
 * Shared values that are not difficulty-sensitive live here.
 * Difficulty-sensitive speed and charge behavior is defined in DIFFICULTY_GAMEPLAY_TUNING.
 */
export const GAMEPLAY_TUNING: GameplayTuning = {
  speedUp: {
    tapGainNorm: 0.082,
    tapSoftCapIntervalMs: 115,
    tapSoftCapMinMultiplier: 0.18
  },
  throwPhase: {
    chargeFillDurationMs: 760,
    chargeMaxCycles: 3,
    faultJavelinLaunchSpeedMs: 8.4,
    chargePerfectWindow: { start: 0.8, end: 0.94 },
    chargeGoodWindow: { start: 0.62, end: 0.96 },
    runToDrawbackBlendMs: 420,
    throwAnimDurationMs: 320,
    throwReleaseProgress01: 0.56
  },
  movement: {
    runupStartXM: -7.6,
    runupSpeedDecayPerSecond: 0.2,
    chargeAimSpeedDecayPerSecond: 0.24,
    chargeAimStopSpeedNorm: 0.03,
    followThroughStepDistanceM: 0.75,
    faultStumbleDistanceM: 0.82
  },
  wind: {
    cycleDurationMs: 28000,
    cycleAmplitudeMs: 1.85,
    cycleHarmonicMultiplier: 2,
    cycleHarmonicAmplitudeMs: 0.28,
    randomKeyframeMs: 11000,
    randomAmplitudeMs: 0.28,
    randomBlend: 0.12,
    microGustPeriodMs: 3200,
    microGustAmplitudeMs: 0.07,
    smoothingMs: 1500,
    crosswindPhaseOffsetRad: 1.3,
    crosswindAmplitudeScale: 0.35,
    visualCalmThresholdMs: 0.2,
    visualMaxReferenceMs: 2.4
  },
  angleControl: {
    stepDeg: 1.0,
    holdStartDegPerSec: 30,
    holdMaxDegPerSec: 120,
    rampMs: 600,
    pointerDeadzonePx: 12,
    pointerSmoothing: 0.4
  },
  trajectoryIndicator: {
    numPoints: 20,
    timeStepS: 0.12,
    dotRadiusPx: 3,
    baseOpacity: 0.55,
    endOpacity: 0.1,
    dotColor: '#1a6b9a'
  },
  audio: {
    masterVolume: 0.5,
    runupTapVolume: 0.8,
    crowdVolume: 0.4,
    effectsVolume: 0.7,
    crowdAmbientGain: 0.018
  }
};

export const DIFFICULTY_GAMEPLAY_TUNING: Record<DifficultyLevel, DifficultyGameplayTuning> = {
  rookie: {
    speedUp: {
      tapGainNorm: 0.082,
      tapSoftCapIntervalMs: 115,
      tapSoftCapMinMultiplier: 0.18
    },
    movement: {
      runupSpeedDecayPerSecond: 0.2,
      chargeAimSpeedDecayPerSecond: 0.24,
      chargeAimStopSpeedNorm: 0.03
    },
    throwPhase: {
      chargeFillDurationMs: 760,
      chargePerfectWindow: { start: 0.8, end: 0.94 },
      chargeGoodWindow: { start: 0.62, end: 0.96 }
    },
    releaseMeter: {
      sweepDurationMsMin: 560,
      sweepDurationMsMax: 820,
      perfectWidth: 0.2,
      goodWidth: 0.4,
      highSpeedPerfectWidth: 0.16,
      highSpeedGoodWidth: 0.34
    }
  },
  pro: {
    speedUp: {
      tapGainNorm: 0.074,
      tapSoftCapIntervalMs: 130,
      tapSoftCapMinMultiplier: 0.12
    },
    movement: {
      runupSpeedDecayPerSecond: 0.23,
      chargeAimSpeedDecayPerSecond: 0.28,
      chargeAimStopSpeedNorm: 0.05
    },
    throwPhase: {
      chargeFillDurationMs: 700,
      chargePerfectWindow: { start: 0.84, end: 0.92 },
      chargeGoodWindow: { start: 0.7, end: 0.94 }
    },
    releaseMeter: {
      sweepDurationMsMin: 510,
      sweepDurationMsMax: 760,
      perfectWidth: 0.16,
      goodWidth: 0.34,
      highSpeedPerfectWidth: 0.125,
      highSpeedGoodWidth: 0.28
    },
    runupRhythm: {
      tempoCurve: [
        { speedNorm: 0.0, targetIntervalMs: 210 },
        { speedNorm: 0.35, targetIntervalMs: 194 },
        { speedNorm: 0.65, targetIntervalMs: 178 },
        { speedNorm: 0.85, targetIntervalMs: 164 },
        { speedNorm: 1.0, targetIntervalMs: 154 }
      ],
      perfectToleranceRatio: 0.18,
      goodToleranceRatio: 0.34,
      perfectMultiplier: 1,
      goodMultiplier: 0.9,
      missMultiplier: 0.58,
      stabilityGainPerGood: 0.035,
      stabilityLossPerMiss: 0.045,
      stableDecayMultiplier: 0.96,
      unstableDecayMultiplier: 1.02,
      comboMax: 4
    }
  },
  elite: {
    speedUp: {
      tapGainNorm: 0.068,
      tapSoftCapIntervalMs: 140,
      tapSoftCapMinMultiplier: 0.08
    },
    movement: {
      runupSpeedDecayPerSecond: 0.26,
      chargeAimSpeedDecayPerSecond: 0.32,
      chargeAimStopSpeedNorm: 0.06
    },
    throwPhase: {
      chargeFillDurationMs: 650,
      chargePerfectWindow: { start: 0.87, end: 0.91 },
      chargeGoodWindow: { start: 0.76, end: 0.92 }
    },
    runupRhythm: {
      tempoCurve: [
        { speedNorm: 0.0, targetIntervalMs: 180 },
        { speedNorm: 0.35, targetIntervalMs: 160 },
        { speedNorm: 0.65, targetIntervalMs: 140 },
        { speedNorm: 0.85, targetIntervalMs: 124 },
        { speedNorm: 1.0, targetIntervalMs: 112 }
      ],
      perfectToleranceRatio: 0.1,
      goodToleranceRatio: 0.2,
      perfectMultiplier: 1,
      goodMultiplier: 0.72,
      missMultiplier: 0.25,
      stabilityGainPerGood: 0.08,
      stabilityLossPerMiss: 0.14,
      stableDecayMultiplier: 0.82,
      unstableDecayMultiplier: 1.08,
      comboMax: 6
    },
    releaseMeter: {
      sweepDurationMsMin: 360,
      sweepDurationMsMax: 520,
      perfectWidth: 0.08,
      goodWidth: 0.18,
      highSpeedPerfectWidth: 0.06,
      highSpeedGoodWidth: 0.16
    }
  }
};

const sanitizeMeterWindow = (window: MeterWindow): MeterWindow => {
  const start = clamp(window.start, 0, 1);
  const end = clamp(window.end, 0, 1);
  if (start <= end) {
    return { start, end };
  }
  return { start: end, end: start };
};

const mergeMeterWindow = (
  base: MeterWindow,
  override: Partial<MeterWindow> | undefined
): MeterWindow =>
  sanitizeMeterWindow({
    start: override?.start ?? base.start,
    end: override?.end ?? base.end
  });

const sanitizeRunupTempoCurve = (
  base: RunupTempoCurvePoint[],
  override: RunupTempoCurvePoint[] | undefined
): RunupTempoCurvePoint[] => {
  const source = override && override.length >= 2 ? override : base;
  return [...source]
    .map((point) => ({
      speedNorm: clamp(point.speedNorm, 0, 1),
      targetIntervalMs: clamp(Math.round(point.targetIntervalMs), 40, 400)
    }))
    .sort((left, right) => left.speedNorm - right.speedNorm);
};

const sanitizeRunupRhythmTuning = (
  base: RunupRhythmTuning,
  override: Partial<RunupRhythmTuning> | undefined
): RunupRhythmTuning => {
  const perfectToleranceRatio = clamp(
    override?.perfectToleranceRatio ?? base.perfectToleranceRatio,
    0.02,
    0.4
  );
  const goodToleranceRatio = clamp(
    override?.goodToleranceRatio ?? base.goodToleranceRatio,
    perfectToleranceRatio,
    0.8
  );
  const stableDecayMultiplier = clamp(
    override?.stableDecayMultiplier ?? base.stableDecayMultiplier,
    0.25,
    1
  );
  const unstableDecayMultiplier = clamp(
    override?.unstableDecayMultiplier ?? base.unstableDecayMultiplier,
    stableDecayMultiplier,
    2
  );

  return {
    tempoCurve: sanitizeRunupTempoCurve(base.tempoCurve, override?.tempoCurve),
    perfectToleranceRatio,
    goodToleranceRatio,
    perfectMultiplier: clamp(override?.perfectMultiplier ?? base.perfectMultiplier, 0.1, 1.5),
    goodMultiplier: clamp(override?.goodMultiplier ?? base.goodMultiplier, 0.1, 1.5),
    missMultiplier: clamp(override?.missMultiplier ?? base.missMultiplier, 0.01, 1),
    stabilityGainPerGood: clamp(
      override?.stabilityGainPerGood ?? base.stabilityGainPerGood,
      0.01,
      0.5
    ),
    stabilityLossPerMiss: clamp(
      override?.stabilityLossPerMiss ?? base.stabilityLossPerMiss,
      0.01,
      0.5
    ),
    stableDecayMultiplier,
    unstableDecayMultiplier,
    comboMax: clamp(Math.round(override?.comboMax ?? base.comboMax), 0, 12)
  };
};

const sanitizeReleaseMeterTuning = (
  base: ReleaseMeterTuning,
  override: Partial<ReleaseMeterTuning> | undefined
): ReleaseMeterTuning => {
  const sweepDurationMsMin = clamp(
    Math.round(override?.sweepDurationMsMin ?? base.sweepDurationMsMin),
    160,
    1200
  );
  const sweepDurationMsMax = clamp(
    Math.round(override?.sweepDurationMsMax ?? base.sweepDurationMsMax),
    sweepDurationMsMin,
    1400
  );
  const perfectWidth = clamp(override?.perfectWidth ?? base.perfectWidth, 0.02, 0.3);
  const goodWidth = clamp(override?.goodWidth ?? base.goodWidth, perfectWidth, 0.5);
  const highSpeedPerfectWidth = clamp(
    override?.highSpeedPerfectWidth ?? base.highSpeedPerfectWidth,
    0.02,
    perfectWidth
  );
  const highSpeedGoodWidth = clamp(
    override?.highSpeedGoodWidth ?? base.highSpeedGoodWidth,
    highSpeedPerfectWidth,
    goodWidth
  );

  return {
    sweepDurationMsMin,
    sweepDurationMsMax,
    perfectWidth,
    goodWidth,
    highSpeedPerfectWidth,
    highSpeedGoodWidth
  };
};

const resolveDifficultyTuningWithOverride = (
  base: DifficultyGameplayTuning,
  override: DifficultyGameplayTuningOverride | undefined
): DifficultyGameplayTuning => {
  const perfectWindow = mergeMeterWindow(
    base.throwPhase.chargePerfectWindow,
    override?.chargePerfectWindow
  );
  const goodWindowInput = mergeMeterWindow(
    base.throwPhase.chargeGoodWindow,
    override?.chargeGoodWindow
  );
  const goodWindow: MeterWindow = {
    start: Math.min(goodWindowInput.start, perfectWindow.start),
    end: Math.max(goodWindowInput.end, perfectWindow.end)
  };

  return {
    speedUp: {
      tapGainNorm: clamp(override?.tapGainNorm ?? base.speedUp.tapGainNorm, 0.001, 0.3),
      tapSoftCapIntervalMs: clamp(
        Math.round(override?.tapSoftCapIntervalMs ?? base.speedUp.tapSoftCapIntervalMs),
        40,
        400
      ),
      tapSoftCapMinMultiplier: clamp(
        override?.tapSoftCapMinMultiplier ?? base.speedUp.tapSoftCapMinMultiplier,
        0.01,
        1
      )
    },
    movement: {
      runupSpeedDecayPerSecond: clamp(
        override?.runupSpeedDecayPerSecond ?? base.movement.runupSpeedDecayPerSecond,
        0,
        2
      ),
      chargeAimSpeedDecayPerSecond: clamp(
        override?.chargeAimSpeedDecayPerSecond ?? base.movement.chargeAimSpeedDecayPerSecond,
        0,
        2
      ),
      chargeAimStopSpeedNorm: clamp(
        override?.chargeAimStopSpeedNorm ?? base.movement.chargeAimStopSpeedNorm,
        0,
        1
      )
    },
    throwPhase: {
      chargeFillDurationMs: clamp(
        Math.round(override?.chargeFillDurationMs ?? base.throwPhase.chargeFillDurationMs),
        200,
        2000
      ),
      chargePerfectWindow: perfectWindow,
      chargeGoodWindow: goodWindow
    },
    runupRhythm: base.runupRhythm
      ? sanitizeRunupRhythmTuning(base.runupRhythm, override?.runupRhythm)
      : undefined,
    releaseMeter: base.releaseMeter
      ? sanitizeReleaseMeterTuning(base.releaseMeter, override?.releaseMeter)
      : undefined
  };
};

export const resolveDifficultyGameplayTuning = (
  difficulty: DifficultyLevel,
  overrides: DifficultyGameplayTuningOverrides = EMPTY_DIFFICULTY_GAMEPLAY_TUNING_OVERRIDES
): DifficultyGameplayTuning =>
  resolveDifficultyTuningWithOverride(
    DIFFICULTY_GAMEPLAY_TUNING[difficulty],
    overrides[difficulty]
  );

export const getDifficultyGameplayTuning = (
  difficulty: DifficultyLevel,
  overrides: DifficultyGameplayTuningOverrides = EMPTY_DIFFICULTY_GAMEPLAY_TUNING_OVERRIDES
): DifficultyGameplayTuning => resolveDifficultyGameplayTuning(difficulty, overrides);
