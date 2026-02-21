import {
  ALIGN_TORQUE_BASE,
  ALIGN_TORQUE_SPEED_FACTOR,
  ANGULAR_DAMPING,
  AERO_NOSE_DOWN_BIAS_RAD,
  AOA_MAX_RAD,
  DRAG_COEFFICIENT,
  FIELD_MAX_DISTANCE_M,
  JAVELIN_LENGTH_M,
  LAUNCH_POWER_EXP,
  LAUNCH_SPEED_MAX_MS,
  LAUNCH_SPEED_MIN_MS,
  LIFT_COEFFICIENT,
  MAX_ANGULAR_ACC_RAD,
  MAX_ANGULAR_VEL_RAD,
  MAX_LINEAR_ACCEL
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

const isFiniteState = (javelin: PhysicalJavelinState): boolean =>
  Number.isFinite(javelin.xM) &&
  Number.isFinite(javelin.yM) &&
  Number.isFinite(javelin.vxMs) &&
  Number.isFinite(javelin.vyMs) &&
  Number.isFinite(javelin.angleRad) &&
  Number.isFinite(javelin.angularVelRad);

const isTipFirstLanding = (javelin: PhysicalJavelinState): boolean => {
  const halfLength = javelin.lengthM / 2;
  const tipY = Math.sin(javelin.angleRad) * halfLength;
  const tailY = -Math.sin(javelin.angleRad) * halfLength;
  return tipY < tailY - 0.03 && javelin.vyMs < -0.3;
};

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
  releasedAtMs,
  lengthM: JAVELIN_LENGTH_M
});

export const updatePhysicalJavelin = (
  javelin: PhysicalJavelinState,
  dtMs: number,
  windMs: number
): { javelin: PhysicalJavelinState; landed: boolean; tipFirst: boolean | null } => {
  const dt = clamp(dtMs / 1000, 0.001, 0.05);
  const gravity = 9.81;

  if (!isFiniteState(javelin)) {
    const safeJavelin: PhysicalJavelinState = {
      ...javelin,
      xM: Number.isFinite(javelin.xM) ? javelin.xM : 0,
      yM: Number.isFinite(javelin.yM) ? Math.max(0, javelin.yM) : 0,
      vxMs: Number.isFinite(javelin.vxMs) ? javelin.vxMs : 0,
      vyMs: Number.isFinite(javelin.vyMs) ? javelin.vyMs : 0,
      angleRad: Number.isFinite(javelin.angleRad) ? javelin.angleRad : 0,
      angularVelRad: Number.isFinite(javelin.angularVelRad) ? javelin.angularVelRad : 0,
      lengthM: Number.isFinite(javelin.lengthM) ? javelin.lengthM : JAVELIN_LENGTH_M
    };
    return { javelin: safeJavelin, landed: safeJavelin.yM <= 0, tipFirst: safeJavelin.yM <= 0 ? false : null };
  }

  const airVx = javelin.vxMs - windMs;
  const airVy = javelin.vyMs;
  const airSpeed = Math.max(0.001, Math.hypot(airVx, airVy));
  const flowAngle = Math.atan2(airVy, airVx);
  const aoa = clamp(normalizeAngleRad(javelin.angleRad - flowAngle), -AOA_MAX_RAD, AOA_MAX_RAD);

  const dragAcc = clamp(DRAG_COEFFICIENT * airSpeed * airSpeed, 0, MAX_LINEAR_ACCEL);
  const liftAcc = clamp(
    LIFT_COEFFICIENT * airSpeed * airSpeed * Math.sin(2 * aoa),
    -MAX_LINEAR_ACCEL * 0.33,
    MAX_LINEAR_ACCEL * 0.33
  );

  const dragDirX = -airVx / airSpeed;
  const dragDirY = -airVy / airSpeed;
  const liftDirX = -dragDirY;
  const liftDirY = dragDirX;

  const ax = clamp(dragDirX * dragAcc + liftDirX * liftAcc, -MAX_LINEAR_ACCEL, MAX_LINEAR_ACCEL);
  const ay = clamp(
    dragDirY * dragAcc + liftDirY * liftAcc - gravity,
    -MAX_LINEAR_ACCEL,
    MAX_LINEAR_ACCEL
  );

  const vxMs = javelin.vxMs + ax * dt;
  const vyMs = javelin.vyMs + ay * dt;
  const xM = javelin.xM + vxMs * dt;
  const yM = javelin.yM + vyMs * dt;

  const targetAngleRad = flowAngle - AERO_NOSE_DOWN_BIAS_RAD;
  const alignError = normalizeAngleRad(targetAngleRad - javelin.angleRad);
  const airSpeedFactor = clamp(airSpeed / 34, 0, 1);
  const angularAcc = clamp(
    alignError * (ALIGN_TORQUE_BASE + ALIGN_TORQUE_SPEED_FACTOR * airSpeedFactor) -
      javelin.angularVelRad * ANGULAR_DAMPING,
    -MAX_ANGULAR_ACC_RAD,
    MAX_ANGULAR_ACC_RAD
  );

  const angularVelRad = clamp(
    javelin.angularVelRad + angularAcc * dt,
    -MAX_ANGULAR_VEL_RAD,
    MAX_ANGULAR_VEL_RAD
  );
  const angleRad = normalizeAngleRad(javelin.angleRad + angularVelRad * dt);

  if (!Number.isFinite(xM) || !Number.isFinite(yM) || !Number.isFinite(vxMs) || !Number.isFinite(vyMs)) {
    const fallbackVy = javelin.vyMs - gravity * dt;
    return {
      javelin: {
        ...javelin,
        xM: clamp(javelin.xM + javelin.vxMs * dt, 0, FIELD_MAX_DISTANCE_M),
        yM: Math.max(0, javelin.yM + fallbackVy * dt),
        vxMs: javelin.vxMs,
        vyMs: fallbackVy,
        angleRad: normalizeAngleRad(javelin.angleRad + javelin.angularVelRad * dt),
        angularVelRad: javelin.angularVelRad
      },
      landed: javelin.yM <= 0,
      tipFirst: null
    };
  }

  const nextJavelin: PhysicalJavelinState = {
    ...javelin,
    xM,
    yM,
    vxMs,
    vyMs,
    angleRad,
    angularVelRad
  };

  if (yM <= 0) {
    const landedJavelin: PhysicalJavelinState = {
      ...nextJavelin,
      xM: clamp(xM, 0, FIELD_MAX_DISTANCE_M),
      yM: 0
    };
    return {
      javelin: landedJavelin,
      landed: true,
      tipFirst: isTipFirstLanding(landedJavelin)
    };
  }

  return {
    javelin: nextJavelin,
    landed: false,
    tipFirst: null
  };
};

export const distanceFromJavelin = (javelin: PhysicalJavelinState): number =>
  roundTo1(clamp(javelin.xM, 0, FIELD_MAX_DISTANCE_M));
