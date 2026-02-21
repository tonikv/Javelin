import {
  DRAG_COEFFICIENT,
  FIELD_MAX_DISTANCE_M,
  LAUNCH_POWER_EXP,
  LAUNCH_SPEED_MAX_MS,
  LAUNCH_SPEED_MIN_MS,
  WIND_ACCEL_FACTOR,
  WIND_VELOCITY_COUPLING
} from './constants';
import type { PhysicalJavelinState } from './types';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const normalizeAngleRad = (angleRad: number): number => {
  let angle = angleRad;
  while (angle > Math.PI) {
    angle -= Math.PI * 2;
  }
  while (angle < -Math.PI) {
    angle += Math.PI * 2;
  }
  return angle;
};

const roundTo1 = (value: number): number => Math.round(value * 10) / 10;

export const computeLaunchSpeedMs = (speedNorm: number, forceNorm: number): number => {
  const combinedPowerNorm = clamp(0.55 * speedNorm + 0.45 * forceNorm, 0, 1);
  return (
    LAUNCH_SPEED_MIN_MS +
    (LAUNCH_SPEED_MAX_MS - LAUNCH_SPEED_MIN_MS) * combinedPowerNorm ** LAUNCH_POWER_EXP
  );
};

type CreatePhysicalJavelinInput = {
  xM: number;
  yM: number;
  launchAngleRad: number;
  launchSpeedMs: number;
  releasedAtMs: number;
};

export const createPhysicalJavelin = ({
  xM,
  yM,
  launchAngleRad,
  launchSpeedMs,
  releasedAtMs
}: CreatePhysicalJavelinInput): PhysicalJavelinState => ({
  xM,
  yM,
  vxMs: Math.cos(launchAngleRad) * launchSpeedMs,
  vyMs: Math.sin(launchAngleRad) * launchSpeedMs,
  angleRad: launchAngleRad,
  angularVelRad: 0,
  releasedAtMs
});

export const updatePhysicalJavelin = (
  javelin: PhysicalJavelinState,
  dtMs: number,
  windMs: number
): { javelin: PhysicalJavelinState; landed: boolean } => {
  const dt = clamp(dtMs / 1000, 0.001, 0.05);
  const gravity = 9.81;
  const drag = DRAG_COEFFICIENT;

  const relativeVx = javelin.vxMs - windMs * WIND_VELOCITY_COUPLING;
  const speed = Math.max(0.001, Math.hypot(relativeVx, javelin.vyMs));
  const ax = -drag * relativeVx * speed + windMs * WIND_ACCEL_FACTOR;
  const ay = -gravity - drag * javelin.vyMs * speed;

  const vxMs = javelin.vxMs + ax * dt;
  const vyMs = javelin.vyMs + ay * dt;
  const xM = javelin.xM + vxMs * dt;
  const yM = javelin.yM + vyMs * dt;

  const targetAngleRad = Math.atan2(vyMs, Math.max(0.1, vxMs));
  const diff = normalizeAngleRad(targetAngleRad - javelin.angleRad);
  const angularVelRad = javelin.angularVelRad + diff * 9 * dt - javelin.angularVelRad * 6.2 * dt;
  const angleRad = normalizeAngleRad(javelin.angleRad + angularVelRad * dt);

  if (yM <= 0) {
    return {
      javelin: {
        ...javelin,
        xM: clamp(xM, 0, FIELD_MAX_DISTANCE_M),
        yM: 0,
        vxMs,
        vyMs,
        angleRad,
        angularVelRad
      },
      landed: true
    };
  }

  return {
    javelin: {
      ...javelin,
      xM,
      yM,
      vxMs,
      vyMs,
      angleRad,
      angularVelRad
    },
    landed: false
  };
};

export const distanceFromJavelin = (javelin: PhysicalJavelinState): number =>
  roundTo1(clamp(javelin.xM, 0, FIELD_MAX_DISTANCE_M));
