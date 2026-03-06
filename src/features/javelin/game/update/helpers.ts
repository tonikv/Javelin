/**
 * Shared update helpers used across phase tick handlers and reducer transitions.
 * Keeps repeated movement, timing, and throw-construction logic in one place.
 */
import { computeAthletePoseGeometry } from '../athletePose';
import {
  ANGLE_DEFAULT_DEG,
  JAVELIN_GRIP_OFFSET_M,
  JAVELIN_RELEASE_OFFSET_Y_M,
  RUNUP_SPEED_MAX_MS,
  RUNUP_SPEED_MIN_MS
} from '../constants';
import { clamp, easeOutQuad, lerp, toRad, wrap01 } from '../math';
import { createPhysicalJavelin } from '../physics';
import {
  GAMEPLAY_TUNING,
  getDifficultyGameplayTuning,
  type DifficultyGameplayTuningOverrides,
  type RunupRhythmTuning
} from '../tuning';
import type { DifficultyLevel, GameState, RhythmHitQuality, TimingQuality } from '../types';

const {
  faultJavelinLaunchSpeedMs: FAULT_JAVELIN_LAUNCH_SPEED_MS
} = GAMEPLAY_TUNING.throwPhase;
const {
  faultStumbleDistanceM: FAULT_STUMBLE_DISTANCE_M,
  followThroughStepDistanceM: FOLLOW_THROUGH_STEP_DISTANCE_M
} = GAMEPLAY_TUNING.movement;

export const rhythmTapQualityMultiplier = (
  deltaMs: number,
  difficulty: DifficultyLevel,
  overrides: DifficultyGameplayTuningOverrides
): number => {
  const rhythm = getDifficultyGameplayTuning(difficulty, overrides).runupRhythm;
  if (!rhythm) {
    return 1;
  }
  const targetTapIntervalMs = getRunupTargetTapIntervalMs(0, rhythm);
  const quality = classifyRunupRhythmTap(deltaMs, targetTapIntervalMs, rhythm);
  if (quality === 'perfect') {
    return rhythm.perfectMultiplier;
  }
  if (quality === 'good') {
    return rhythm.goodMultiplier;
  }
  return rhythm.missMultiplier;
};

export const getRunupAntiMashMultiplier = (
  deltaMs: number,
  tapSoftCapIntervalMs: number,
  tapSoftCapMinMultiplier: number
): number => {
  const ratio = clamp(deltaMs / tapSoftCapIntervalMs, 0, 1);
  return Math.max(tapSoftCapMinMultiplier, ratio * ratio);
};

export const runupTapGainMultiplier = (
  deltaMs: number,
  difficulty: DifficultyLevel,
  overrides: DifficultyGameplayTuningOverrides
): number => {
  const profile = getDifficultyGameplayTuning(difficulty, overrides);
  return (
    getRunupAntiMashMultiplier(
      deltaMs,
      profile.speedUp.tapSoftCapIntervalMs,
      profile.speedUp.tapSoftCapMinMultiplier
    ) * rhythmTapQualityMultiplier(deltaMs, difficulty, overrides)
  );
};

export const getRunupTargetTapIntervalMs = (
  speedNorm: number,
  tuning: RunupRhythmTuning
): number => {
  if (tuning.tempoCurve.length === 0) {
    return 160;
  }
  const clampedSpeedNorm = clamp(speedNorm, 0, 1);
  const [firstPoint, ...restPoints] = tuning.tempoCurve;
  if (!firstPoint) {
    return 160;
  }
  if (clampedSpeedNorm <= firstPoint.speedNorm) {
    return firstPoint.targetIntervalMs;
  }

  let previousPoint = firstPoint;
  for (const point of restPoints) {
    if (clampedSpeedNorm <= point.speedNorm) {
      const span = Math.max(0.0001, point.speedNorm - previousPoint.speedNorm);
      const t = clamp((clampedSpeedNorm - previousPoint.speedNorm) / span, 0, 1);
      return lerp(previousPoint.targetIntervalMs, point.targetIntervalMs, t);
    }
    previousPoint = point;
  }

  return previousPoint.targetIntervalMs;
};

export const classifyRunupRhythmTap = (
  intervalMs: number,
  targetMs: number,
  tuning: RunupRhythmTuning
): RhythmHitQuality => {
  const deltaMs = Math.abs(intervalMs - targetMs);
  const perfectToleranceMs = targetMs * tuning.perfectToleranceRatio;
  const goodToleranceMs = targetMs * tuning.goodToleranceRatio;
  if (deltaMs <= perfectToleranceMs) {
    return 'perfect';
  }
  if (deltaMs <= goodToleranceMs) {
    return 'good';
  }
  return 'miss';
};

export const getRhythmComboBonusMultiplier = (combo: number): number => {
  if (combo >= 6) {
    return 1.06;
  }
  if (combo >= 4) {
    return 1.04;
  }
  if (combo >= 2) {
    return 1.02;
  }
  return 1;
};

export const getNextRhythmCombo = (
  combo: number,
  quality: RhythmHitQuality,
  comboMax: number
): number => {
  if (quality === 'miss') {
    return Math.max(0, combo - 2);
  }
  return Math.min(comboMax, combo + 1);
};

export const getNextRhythmStability = (
  stability01: number,
  quality: RhythmHitQuality,
  tuning: RunupRhythmTuning
): number => {
  if (quality === 'miss') {
    return clamp(stability01 - tuning.stabilityLossPerMiss, 0, 1);
  }
  return clamp(stability01 + tuning.stabilityGainPerGood, 0, 1);
};

export const getRunupRhythmDecayMultiplier = (
  stability01: number,
  tuning: RunupRhythmTuning
): number =>
  lerp(tuning.unstableDecayMultiplier, tuning.stableDecayMultiplier, clamp(stability01, 0, 1));

export const computeRhythmTapGain = ({
  intervalMs,
  tapGainNorm,
  tapSoftCapIntervalMs,
  tapSoftCapMinMultiplier,
  quality,
  combo,
  tuning
}: {
  intervalMs: number;
  tapGainNorm: number;
  tapSoftCapIntervalMs: number;
  tapSoftCapMinMultiplier: number;
  quality: RhythmHitQuality;
  combo: number;
  tuning: RunupRhythmTuning;
}): { gainNorm: number; antiMashMultiplier: number; qualityMultiplier: number; comboMultiplier: number } => {
  const antiMashMultiplier = getRunupAntiMashMultiplier(
    intervalMs,
    tapSoftCapIntervalMs,
    tapSoftCapMinMultiplier
  );
  const qualityMultiplier =
    quality === 'perfect'
      ? tuning.perfectMultiplier
      : quality === 'good'
        ? tuning.goodMultiplier
        : tuning.missMultiplier;
  const comboMultiplier = getRhythmComboBonusMultiplier(combo);
  return {
    gainNorm: tapGainNorm * antiMashMultiplier * qualityMultiplier * comboMultiplier,
    antiMashMultiplier,
    qualityMultiplier,
    comboMultiplier
  };
};

export const runStrideHz = (speedNorm: number): number => 1 + speedNorm * 2.2;

export const advanceRunAnimT = (currentAnimT: number, dtMs: number, speedNorm: number): number =>
  wrap01(currentAnimT + (Math.max(0, dtMs) / 1000) * runStrideHz(speedNorm));

export const runSpeedMsFromNorm = (speedNorm: number): number =>
  RUNUP_SPEED_MIN_MS + (RUNUP_SPEED_MAX_MS - RUNUP_SPEED_MIN_MS) * speedNorm;

export const isRunning = (speedNorm: number): boolean => speedNorm > 0.01;

export const FALL_ANIM_DURATION_MS = 340;

export const followThroughStepOffsetM = (animT: number): number => {
  const t = clamp(animT, 0, 1);
  const step01 = t < 0.78 ? easeOutQuad(t / 0.78) : 1;
  return FOLLOW_THROUGH_STEP_DISTANCE_M * step01;
};

export const faultStumbleOffsetM = (animT: number): number => {
  const t = clamp(animT, 0, 1);
  const step01 = t < 0.72 ? easeOutQuad(t / 0.72) : 1;
  return FAULT_STUMBLE_DISTANCE_M * step01;
};

export const createFaultJavelinFromCharge = (
  phase: Extract<GameState['phase'], { tag: 'chargeAim' }>,
  nowMs: number
) => {
  const releasePose = computeAthletePoseGeometry(
    phase.athletePose,
    phase.speedNorm,
    phase.angleDeg,
    phase.runupDistanceM,
    {
      runBlendFromAnimT: phase.runEntryAnimT,
      runToAimBlend01: 1
    }
  );
  const launchAngleRad = Math.max(0.02, toRad(Math.min(24, phase.angleDeg)));
  const athleteForwardMs = runSpeedMsFromNorm(phase.speedNorm) * 0.12;
  return createPhysicalJavelin({
    xM: releasePose.javelinGrip.xM + Math.cos(launchAngleRad) * JAVELIN_GRIP_OFFSET_M,
    yM: Math.max(
      1.05,
      releasePose.javelinGrip.yM + Math.sin(launchAngleRad) * JAVELIN_RELEASE_OFFSET_Y_M
    ),
    zM: 0,
    launchAngleRad,
    launchSpeedMs: FAULT_JAVELIN_LAUNCH_SPEED_MS,
    athleteForwardMs,
    lateralVelMs: 0,
    releasedAtMs: nowMs
  });
};

export const lateralVelocityFromRelease = (
  quality: TimingQuality,
  angleDeg: number,
  roundId: number
): number => {
  const qualityBase = quality === 'perfect' ? 0.1 : quality === 'good' ? 0.45 : 0.95;
  const sign = roundId % 2 === 0 ? 1 : -1;
  const angleBias = ((angleDeg - ANGLE_DEFAULT_DEG) / 18) * 0.55;
  return sign * qualityBase + angleBias;
};

export const createLateReleaseFaultPhase = (
  phase: Extract<GameState['phase'], { tag: 'chargeAim' }>,
  nowMs: number
): Extract<GameState['phase'], { tag: 'fault' }> => ({
  tag: 'fault',
  reason: 'lateRelease',
  athleteXM: phase.runupDistanceM,
  athletePose: {
    animTag: 'fall',
    animT: 0
  },
  javelin: createFaultJavelinFromCharge(phase, nowMs),
  javelinLanded: false
});
