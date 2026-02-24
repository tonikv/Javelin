import { ANGLE_MAX_DEG, ANGLE_MIN_DEG } from './constants';
import { clamp, toRad } from './math';
import { computeLaunchSpeedMs } from './physics';
import { GAMEPLAY_TUNING } from './tuning';

const {
  numPoints: TRAJECTORY_PREVIEW_NUM_POINTS,
  timeStepS: TRAJECTORY_PREVIEW_TIME_STEP_S
} = GAMEPLAY_TUNING.trajectoryIndicator;

export type TrajectoryPoint = {
  xM: number;
  yM: number;
};

export type TrajectoryPreview = {
  points: TrajectoryPoint[];
};

type ComputeTrajectoryPreviewInput = {
  originXM: number;
  originYM: number;
  angleDeg: number;
  speedNorm: number;
  forceNorm: number;
  windMs?: number;
  numPoints?: number;
  timeStepS?: number;
};

/**
 * Compute a short trajectory preview arc for charge aiming.
 * Uses a simplified parabola (no drag/lift) for frame-by-frame rendering.
 */
export const computeTrajectoryPreview = ({
  originXM,
  originYM,
  angleDeg,
  speedNorm,
  forceNorm,
  windMs = 0,
  numPoints = TRAJECTORY_PREVIEW_NUM_POINTS,
  timeStepS = TRAJECTORY_PREVIEW_TIME_STEP_S
}: ComputeTrajectoryPreviewInput): TrajectoryPreview => {
  const launchSpeedMs = computeLaunchSpeedMs(clamp(speedNorm, 0, 1), clamp(forceNorm, 0, 1));
  const clampedAngleDeg = clamp(angleDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
  const angleRad = toRad(clampedAngleDeg);
  const vxMs = Math.cos(angleRad) * launchSpeedMs;
  const vyMs = Math.sin(angleRad) * launchSpeedMs;
  const effectiveVxMs = vxMs - windMs;

  const safeNumPoints = Math.max(1, Math.floor(numPoints));
  const safeTimeStepS = Math.max(0.02, timeStepS);
  const gravityMs2 = 9.81;
  const points: TrajectoryPoint[] = [];

  for (let index = 1; index <= safeNumPoints; index += 1) {
    const t = index * safeTimeStepS;
    const xM = originXM + effectiveVxMs * t;
    const yM = originYM + vyMs * t - 0.5 * gravityMs2 * t * t;
    if (yM < 0) {
      break;
    }
    points.push({ xM, yM });
  }

  return { points };
};
