import type { AthletePoseState } from './types';

type PointM = {
  xM: number;
  yM: number;
};

export type AthletePoseGeometry = {
  head: PointM;
  shoulderCenter: PointM;
  pelvis: PointM;
  hipFront: PointM;
  hipBack: PointM;
  kneeFront: PointM;
  kneeBack: PointM;
  footFront: PointM;
  footBack: PointM;
  elbowFront: PointM;
  elbowBack: PointM;
  handFront: PointM;
  handBack: PointM;
  javelinGrip: PointM;
  javelinAngleRad: number;
};

const BASE_X_M = 2.8;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const smoothStep = (edge0: number, edge1: number, value: number): number => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const polar = (angleRad: number, length: number): { x: number; y: number } => ({
  x: Math.cos(angleRad) * length,
  y: Math.sin(angleRad) * length
});

const add = (a: PointM, b: { x: number; y: number }): PointM => ({
  xM: a.xM + b.x,
  yM: a.yM + b.y
});

const toRad = (deg: number): number => (deg * Math.PI) / 180;

type MotionCurves = {
  leanRad: number;
  pelvisShiftXM: number;
  pelvisBobYM: number;
  hipFront: number;
  hipBack: number;
  kneeFront: number;
  kneeBack: number;
  shoulderFront: number;
  shoulderBack: number;
  elbowFront: number;
  elbowBack: number;
  javelinAngleRad: number;
};

const curvesForPose = (
  pose: AthletePoseState,
  speedNorm: number,
  aimAngleDeg: number
): MotionCurves => {
  const t = clamp01(pose.animT);
  const cycle = t * Math.PI * 2;

  if (pose.animTag === 'run') {
    const stride = Math.sin(cycle);
    const counter = Math.sin(cycle + Math.PI);
    return {
      leanRad: -0.18 - 0.18 * speedNorm,
      pelvisShiftXM: 0.08 * stride,
      pelvisBobYM: 0.045 * Math.sin(cycle * 2) * (0.45 + speedNorm),
      hipFront: 0.62 * stride,
      hipBack: -0.62 * stride,
      kneeFront: 0.4 + 0.22 * (1 - stride),
      kneeBack: 0.4 + 0.22 * (1 + stride),
      shoulderFront: -0.9 * counter - 0.12,
      shoulderBack: 0.74 * counter + 0.12,
      elbowFront: 0.14,
      elbowBack: -0.12,
      javelinAngleRad: toRad(9)
    };
  }

  if (pose.animTag === 'aim') {
    const settle = Math.sin(cycle * Math.PI);
    return {
      leanRad: -0.3,
      pelvisShiftXM: 0.02 * settle,
      pelvisBobYM: 0.015 * settle,
      hipFront: 0.2,
      hipBack: -0.18,
      kneeFront: 0.56,
      kneeBack: 0.48,
      shoulderFront: -1.5 + 0.18 * settle,
      shoulderBack: 0.38,
      elbowFront: 0.42,
      elbowBack: -0.08,
      javelinAngleRad: toRad(aimAngleDeg)
    };
  }

  if (pose.animTag === 'throw') {
    const explosive = smoothStep(0.14, 0.62, t);
    const follow = smoothStep(0.62, 1, t);
    return {
      leanRad: lerp(-0.34, 0.24, follow) - 0.05 * (1 - explosive),
      pelvisShiftXM: lerp(-0.02, 0.2, follow),
      pelvisBobYM: 0.02 * Math.sin(t * Math.PI),
      hipFront: lerp(0.22, 0.66, explosive),
      hipBack: lerp(-0.24, -0.48, explosive),
      kneeFront: lerp(0.56, 0.38, explosive),
      kneeBack: lerp(0.5, 0.72, follow),
      shoulderFront: lerp(-2.0, 0.34, explosive) + follow * 0.2,
      shoulderBack: lerp(0.4, -0.5, explosive),
      elbowFront: lerp(0.62, -0.18, explosive),
      elbowBack: lerp(-0.08, 0.18, explosive),
      javelinAngleRad: lerp(toRad(aimAngleDeg), toRad(-14), smoothStep(0.32, 1, t))
    };
  }

  if (pose.animTag === 'followThrough') {
    return {
      leanRad: 0.3,
      pelvisShiftXM: 0.16 * t,
      pelvisBobYM: 0.01,
      hipFront: 0.56,
      hipBack: -0.52,
      kneeFront: 0.35,
      kneeBack: 0.82,
      shoulderFront: 0.26,
      shoulderBack: -0.52,
      elbowFront: -0.12,
      elbowBack: 0.22,
      javelinAngleRad: toRad(-20)
    };
  }

  return {
    leanRad: -0.04,
    pelvisShiftXM: 0,
    pelvisBobYM: 0,
    hipFront: 0.12,
    hipBack: -0.12,
    kneeFront: 0.42,
    kneeBack: 0.42,
    shoulderFront: -0.26,
    shoulderBack: 0.2,
    elbowFront: 0.14,
    elbowBack: -0.08,
    javelinAngleRad: toRad(4)
  };
};

export const computeAthletePoseGeometry = (
  pose: AthletePoseState,
  speedNorm: number,
  aimAngleDeg: number
): AthletePoseGeometry => {
  const curves = curvesForPose(pose, speedNorm, aimAngleDeg);
  const pelvis: PointM = {
    xM: BASE_X_M + curves.pelvisShiftXM,
    yM: 1 + curves.pelvisBobYM
  };

  const torsoAngle = Math.PI / 2 + curves.leanRad;
  const shoulderCenter = add(pelvis, polar(torsoAngle, 0.58));
  const head = add(shoulderCenter, polar(Math.PI / 2 + curves.leanRad * 0.1, 0.22));

  const hipFront: PointM = { xM: pelvis.xM + 0.055, yM: pelvis.yM - 0.02 };
  const hipBack: PointM = { xM: pelvis.xM - 0.055, yM: pelvis.yM - 0.02 };
  const shoulderFront: PointM = { xM: shoulderCenter.xM + 0.05, yM: shoulderCenter.yM - 0.02 };
  const shoulderBack: PointM = { xM: shoulderCenter.xM - 0.05, yM: shoulderCenter.yM - 0.02 };

  const thighFrontAngle = -Math.PI / 2 + curves.hipFront;
  const thighBackAngle = -Math.PI / 2 + curves.hipBack;
  const kneeFront = add(hipFront, polar(thighFrontAngle, 0.39));
  const kneeBack = add(hipBack, polar(thighBackAngle, 0.39));

  const shinFrontAngle = thighFrontAngle - (0.54 + curves.kneeFront);
  const shinBackAngle = thighBackAngle - (0.58 + curves.kneeBack);
  const footFrontRaw = add(kneeFront, polar(shinFrontAngle, 0.37));
  const footBackRaw = add(kneeBack, polar(shinBackAngle, 0.37));
  const footFront: PointM = { xM: footFrontRaw.xM, yM: Math.max(0.02, footFrontRaw.yM) };
  const footBack: PointM = { xM: footBackRaw.xM, yM: Math.max(0.02, footBackRaw.yM) };

  const armFrontAngle = torsoAngle + curves.shoulderFront;
  const armBackAngle = torsoAngle + curves.shoulderBack;
  const elbowFront = add(shoulderFront, polar(armFrontAngle, 0.33));
  const elbowBack = add(shoulderBack, polar(armBackAngle, 0.3));
  const handFront = add(elbowFront, polar(armFrontAngle + curves.elbowFront, 0.31));
  const handBack = add(elbowBack, polar(armBackAngle + curves.elbowBack, 0.29));

  return {
    head,
    shoulderCenter,
    pelvis,
    hipFront,
    hipBack,
    kneeFront,
    kneeBack,
    footFront,
    footBack,
    elbowFront,
    elbowBack,
    handFront,
    handBack,
    javelinGrip: handFront,
    javelinAngleRad: curves.javelinAngleRad
  };
};
