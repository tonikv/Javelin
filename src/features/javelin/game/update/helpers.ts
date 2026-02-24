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
import { clamp, easeOutQuad, toRad, wrap01 } from '../math';
import { createPhysicalJavelin } from '../physics';
import { GAMEPLAY_TUNING } from '../tuning';
import type { GameState, TimingQuality } from '../types';

const {
  faultJavelinLaunchSpeedMs: FAULT_JAVELIN_LAUNCH_SPEED_MS
} = GAMEPLAY_TUNING.throwPhase;
const {
  faultStumbleDistanceM: FAULT_STUMBLE_DISTANCE_M,
  followThroughStepDistanceM: FOLLOW_THROUGH_STEP_DISTANCE_M
} = GAMEPLAY_TUNING.movement;
const {
  tapSoftCapIntervalMs: RUNUP_TAP_SOFT_CAP_INTERVAL_MS,
  tapSoftCapMinMultiplier: RUNUP_TAP_SOFT_CAP_MIN_MULTIPLIER
} = GAMEPLAY_TUNING.speedUp;

export const runupTapGainMultiplier = (deltaMs: number): number => {
  const ratio = clamp(deltaMs / RUNUP_TAP_SOFT_CAP_INTERVAL_MS, 0, 1);
  return Math.max(RUNUP_TAP_SOFT_CAP_MIN_MULTIPLIER, ratio * ratio);
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
