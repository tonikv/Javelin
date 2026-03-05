import type { DifficultyLevel, MeterWindow } from './types';

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

export type EliteRhythmTuning = {
  targetTapIntervalMs: number;
  perfectToleranceMs: number;
  goodToleranceMs: number;
  offBeatMultiplier: number;
};

type DifficultySpeedUpTuning = SpeedUpTuning & {
  rhythm?: EliteRhythmTuning;
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
  speedUp: DifficultySpeedUpTuning;
  throwPhase: DifficultyThrowPhaseTuning;
  movement: DifficultyMovementTuning;
};

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
    }
  },
  elite: {
    speedUp: {
      tapGainNorm: 0.068,
      tapSoftCapIntervalMs: 140,
      tapSoftCapMinMultiplier: 0.08,
      rhythm: {
        targetTapIntervalMs: 125,
        perfectToleranceMs: 18,
        goodToleranceMs: 36,
        offBeatMultiplier: 0.2
      }
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
    }
  }
};

export const getDifficultyGameplayTuning = (difficulty: DifficultyLevel): DifficultyGameplayTuning =>
  DIFFICULTY_GAMEPLAY_TUNING[difficulty];
