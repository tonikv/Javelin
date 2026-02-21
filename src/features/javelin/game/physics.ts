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
  Number.isFinite(javelin.zM) &&
  Number.isFinite(javelin.vxMs) &&
  Number.isFinite(javelin.vyMs) &&
  Number.isFinite(javelin.vzMs) &&
  Number.isFinite(javelin.angleRad) &&
  Number.isFinite(javelin.angularVelRad);

export const computeLaunchSpeedMs = (speedNorm: number, forceNorm: number): number => {
  const combinedPowerNorm = clamp(0.74 * speedNorm + 0.26 * forceNorm, 0, 1);
  return (
    LAUNCH_SPEED_MIN_MS +
    (LAUNCH_SPEED_MAX_MS - LAUNCH_SPEED_MIN_MS) * combinedPowerNorm ** LAUNCH_POWER_EXP
  );
};

type CreatePhysicalJavelinInput = {
  xM: number;
  yM: number;
  zM?: number;
  launchAngleRad: number;
  launchSpeedMs: number;
  athleteForwardMs: number;
  lateralVelMs: number;
  releasedAtMs: number;
};

export const createPhysicalJavelin = ({
  xM,
  yM,
  zM = 0,
  launchAngleRad,
  launchSpeedMs,
  athleteForwardMs,
  lateralVelMs,
  releasedAtMs
}: CreatePhysicalJavelinInput): PhysicalJavelinState => ({
  xM,
  yM,
  zM,
  vxMs: Math.cos(launchAngleRad) * launchSpeedMs + athleteForwardMs,
  vyMs: Math.sin(launchAngleRad) * launchSpeedMs,
  vzMs: lateralVelMs,
  angleRad: launchAngleRad,
  angularVelRad: 0,
  releasedAtMs,
  lengthM: JAVELIN_LENGTH_M
});

type TipPosition = {
  tipXM: number;
  tipYM: number;
  tipZM: number;
  tailYM: number;
};

const computeTipPosition = (javelin: PhysicalJavelinState): TipPosition => {
  const halfLength = javelin.lengthM / 2;
  return {
    tipXM: javelin.xM + Math.cos(javelin.angleRad) * halfLength,
    tipYM: javelin.yM + Math.sin(javelin.angleRad) * halfLength,
    tipZM: javelin.zM,
    tailYM: javelin.yM - Math.sin(javelin.angleRad) * halfLength
  };
};

const isTipFirstLanding = (javelin: PhysicalJavelinState): boolean => {
  const tip = computeTipPosition(javelin);
  return tip.tipYM <= tip.tailYM - 0.02 && javelin.vyMs < -0.25;
};

export const updatePhysicalJavelin = (
  javelin: PhysicalJavelinState,
  dtMs: number,
  windMs: number
): {
  javelin: PhysicalJavelinState;
  landed: boolean;
  tipFirst: boolean | null;
  landingTipXM: number | null;
  landingTipZM: number | null;
} => {
  const dt = clamp(dtMs / 1000, 0.001, 0.05);
  const gravity = 9.81;

  if (!isFiniteState(javelin)) {
    const safeJavelin: PhysicalJavelinState = {
      ...javelin,
      xM: Number.isFinite(javelin.xM) ? javelin.xM : 0,
      yM: Number.isFinite(javelin.yM) ? Math.max(0, javelin.yM) : 0,
      zM: Number.isFinite(javelin.zM) ? javelin.zM : 0,
      vxMs: Number.isFinite(javelin.vxMs) ? javelin.vxMs : 0,
      vyMs: Number.isFinite(javelin.vyMs) ? javelin.vyMs : 0,
      vzMs: Number.isFinite(javelin.vzMs) ? javelin.vzMs : 0,
      angleRad: Number.isFinite(javelin.angleRad) ? javelin.angleRad : 0,
      angularVelRad: Number.isFinite(javelin.angularVelRad) ? javelin.angularVelRad : 0,
      lengthM: Number.isFinite(javelin.lengthM) ? javelin.lengthM : JAVELIN_LENGTH_M
    };
    return {
      javelin: safeJavelin,
      landed: safeJavelin.yM <= 0,
      tipFirst: safeJavelin.yM <= 0 ? false : null,
      landingTipXM: safeJavelin.yM <= 0 ? safeJavelin.xM : null,
      landingTipZM: safeJavelin.yM <= 0 ? safeJavelin.zM : null
    };
  }

  const airVx = javelin.vxMs - windMs;
  const airVy = javelin.vyMs;
  const airVz = javelin.vzMs;
  const airSpeed = Math.max(0.001, Math.hypot(airVx, airVy, airVz));
  const flowAngle = Math.atan2(airVy, Math.max(0.01, airVx));
  const aoa = clamp(normalizeAngleRad(javelin.angleRad - flowAngle), -AOA_MAX_RAD, AOA_MAX_RAD);

  const dragAcc = clamp(DRAG_COEFFICIENT * airSpeed * airSpeed, 0, MAX_LINEAR_ACCEL);
  const liftAcc = clamp(
    LIFT_COEFFICIENT * airSpeed * airSpeed * Math.sin(2 * aoa),
    -MAX_LINEAR_ACCEL * 0.25,
    MAX_LINEAR_ACCEL * 0.25
  );

  const dragDirX = -airVx / airSpeed;
  const dragDirY = -airVy / airSpeed;
  const dragDirZ = -airVz / airSpeed;
  const liftDirX = -dragDirY;
  const liftDirY = dragDirX;

  const ax = clamp(dragDirX * dragAcc + liftDirX * liftAcc, -MAX_LINEAR_ACCEL, MAX_LINEAR_ACCEL);
  const ay = clamp(
    dragDirY * dragAcc + liftDirY * liftAcc - gravity,
    -MAX_LINEAR_ACCEL,
    MAX_LINEAR_ACCEL
  );
  const az = clamp(dragDirZ * dragAcc * 0.55, -MAX_LINEAR_ACCEL * 0.45, MAX_LINEAR_ACCEL * 0.45);

  const vxMs = javelin.vxMs + ax * dt;
  const vyMs = javelin.vyMs + ay * dt;
  const vzMs = javelin.vzMs + az * dt;

  const xM = javelin.xM + vxMs * dt;
  const yM = javelin.yM + vyMs * dt;
  const zM = javelin.zM + vzMs * dt;

  const targetAngleRad = flowAngle - AERO_NOSE_DOWN_BIAS_RAD;
  const alignError = normalizeAngleRad(targetAngleRad - javelin.angleRad);
  const airSpeedFactor = clamp(airSpeed / 38, 0, 1);
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

  if (
    !Number.isFinite(xM) ||
    !Number.isFinite(yM) ||
    !Number.isFinite(zM) ||
    !Number.isFinite(vxMs) ||
    !Number.isFinite(vyMs) ||
    !Number.isFinite(vzMs)
  ) {
    const fallbackVy = javelin.vyMs - gravity * dt;
    const fallback: PhysicalJavelinState = {
      ...javelin,
      xM: clamp(javelin.xM + javelin.vxMs * dt, 0, FIELD_MAX_DISTANCE_M),
      yM: Math.max(0, javelin.yM + fallbackVy * dt),
      zM: javelin.zM + javelin.vzMs * dt,
      vxMs: javelin.vxMs,
      vyMs: fallbackVy,
      vzMs: javelin.vzMs,
      angleRad: normalizeAngleRad(javelin.angleRad + javelin.angularVelRad * dt),
      angularVelRad: javelin.angularVelRad
    };
    return {
      javelin: fallback,
      landed: fallback.yM <= 0,
      tipFirst: fallback.yM <= 0 ? false : null,
      landingTipXM: fallback.yM <= 0 ? fallback.xM : null,
      landingTipZM: fallback.yM <= 0 ? fallback.zM : null
    };
  }

  const nextJavelin: PhysicalJavelinState = {
    ...javelin,
    xM,
    yM,
    zM,
    vxMs,
    vyMs,
    vzMs,
    angleRad,
    angularVelRad
  };

  const tip = computeTipPosition(nextJavelin);
  const touchesGround = nextJavelin.yM <= 0 || tip.tipYM <= 0 || tip.tailYM <= 0;

  if (touchesGround) {
    const landedJavelin: PhysicalJavelinState = {
      ...nextJavelin,
      xM: clamp(nextJavelin.xM, 0, FIELD_MAX_DISTANCE_M),
      yM: Math.max(0, nextJavelin.yM)
    };
    const tipPosition = computeTipPosition(landedJavelin);
    return {
      javelin: landedJavelin,
      landed: true,
      tipFirst: isTipFirstLanding(landedJavelin),
      landingTipXM: clamp(tipPosition.tipXM, 0, FIELD_MAX_DISTANCE_M),
      landingTipZM: tipPosition.tipZM
    };
  }

  return {
    javelin: nextJavelin,
    landed: false,
    tipFirst: null,
    landingTipXM: null,
    landingTipZM: null
  };
};

export const distanceFromJavelin = (javelin: PhysicalJavelinState): number =>
  roundTo1(clamp(javelin.xM, 0, FIELD_MAX_DISTANCE_M));
