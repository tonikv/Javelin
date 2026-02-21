import { RUNUP_START_X_M } from './constants';
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

type PoseSamplingOptions = {
  runBlendFromAnimT?: number;
  runToAimBlend01?: number;
};

type ThrowStage = 'windup' | 'delivery' | 'follow';

export type ThrowSubphaseSample = {
  stage: ThrowStage;
  windup01: number;
  delivery01: number;
  follow01: number;
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

const easeInCubic = (t: number): number => t ** 3;

const easeOutQuad = (t: number): number => 1 - (1 - t) * (1 - t);

const easeInOutSine = (t: number): number => 0.5 - Math.cos(Math.PI * clamp01(t)) * 0.5;

const toRad = (deg: number): number => (deg * Math.PI) / 180;

const polar = (angleRad: number, length: number): { x: number; y: number } => ({
  x: Math.cos(angleRad) * length,
  y: Math.sin(angleRad) * length
});

const add = (a: PointM, b: { x: number; y: number }): PointM => ({
  xM: a.xM + b.x,
  yM: a.yM + b.y
});

const lerpPoint = (a: PointM, b: PointM, t: number): PointM => ({
  xM: lerp(a.xM, b.xM, t),
  yM: lerp(a.yM, b.yM, t)
});

const solveArm2BoneIK = (
  shoulder: PointM,
  target: PointM,
  upperLen: number,
  lowerLen: number
): { elbow: PointM; hand: PointM } => {
  const dx = target.xM - shoulder.xM;
  const dy = target.yM - shoulder.yM;
  const dist = Math.hypot(dx, dy);
  const maxReach = upperLen + lowerLen;

  if (dist >= maxReach - 0.001 || dist < 0.001) {
    const dirX = dist > 0.001 ? dx / dist : 1;
    const dirY = dist > 0.001 ? dy / dist : 0;
    return {
      elbow: {
        xM: shoulder.xM + dirX * upperLen,
        yM: shoulder.yM + dirY * upperLen
      },
      hand: {
        xM: shoulder.xM + dirX * maxReach,
        yM: shoulder.yM + dirY * maxReach
      }
    };
  }

  const cosShoulderAngle =
    (upperLen * upperLen + dist * dist - lowerLen * lowerLen) / (2 * upperLen * dist);
  const clampedCos = Math.max(-1, Math.min(1, cosShoulderAngle));
  const baseAngle = Math.atan2(dy, dx);
  const shoulderAngle = baseAngle - Math.acos(clampedCos);

  const elbow: PointM = {
    xM: shoulder.xM + Math.cos(shoulderAngle) * upperLen,
    yM: shoulder.yM + Math.sin(shoulderAngle) * upperLen
  };

  const elbowToTarget = Math.atan2(target.yM - elbow.yM, target.xM - elbow.xM);
  const hand: PointM = {
    xM: elbow.xM + Math.cos(elbowToTarget) * lowerLen,
    yM: elbow.yM + Math.sin(elbowToTarget) * lowerLen
  };

  return { elbow, hand };
};

export const getRunToAimBlend01 = (
  chargeStartedAtMs: number,
  nowMs: number,
  blendDurationMs: number
): number => {
  if (blendDurationMs <= 0) {
    return 1;
  }
  return clamp01((nowMs - chargeStartedAtMs) / blendDurationMs);
};

export const sampleThrowSubphase = (progress01: number): ThrowSubphaseSample => {
  const t = clamp01(progress01);
  const windupEnd = 0.3;
  const deliveryEnd = 0.68;

  if (t < windupEnd) {
    return {
      stage: 'windup',
      windup01: easeOutCubic(t / windupEnd),
      delivery01: 0,
      follow01: 0
    };
  }

  if (t < deliveryEnd) {
    return {
      stage: 'delivery',
      windup01: 1,
      delivery01: easeInCubic((t - windupEnd) / (deliveryEnd - windupEnd)),
      follow01: 0
    };
  }

  return {
    stage: 'follow',
    windup01: 1,
    delivery01: 1,
    follow01: easeOutQuad((t - deliveryEnd) / (1 - deliveryEnd))
  };
};

const splitBodyMix = (
  from: MotionCurves,
  to: MotionCurves,
  lowerBlend: number,
  upperBlend: number
): MotionCurves => ({
  leanRad: lerp(from.leanRad, to.leanRad, lerp(lowerBlend, upperBlend, 0.65)),
  pelvisShiftXM: lerp(from.pelvisShiftXM, to.pelvisShiftXM, lowerBlend),
  pelvisBobYM: lerp(from.pelvisBobYM, to.pelvisBobYM, lowerBlend),
  hipFront: lerp(from.hipFront, to.hipFront, lowerBlend),
  hipBack: lerp(from.hipBack, to.hipBack, lowerBlend),
  kneeFront: lerp(from.kneeFront, to.kneeFront, lowerBlend),
  kneeBack: lerp(from.kneeBack, to.kneeBack, lowerBlend),
  shoulderFront: lerp(from.shoulderFront, to.shoulderFront, upperBlend),
  shoulderBack: lerp(from.shoulderBack, to.shoulderBack, upperBlend),
  elbowFront: lerp(from.elbowFront, to.elbowFront, upperBlend),
  elbowBack: lerp(from.elbowBack, to.elbowBack, upperBlend),
  javelinAngleRad: lerp(from.javelinAngleRad, to.javelinAngleRad, upperBlend)
});

const runCurves = (t01: number, speedNorm: number, aimAngleDeg: number): MotionCurves => {
  const cycle = clamp01(t01) * Math.PI * 2;
  const stride = Math.sin(cycle);
  const counter = Math.sin(cycle + Math.PI);
  const runJavelinAngleDeg = Math.max(-90, Math.min(90, aimAngleDeg));
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
    javelinAngleRad: toRad(runJavelinAngleDeg)
  };
};

const aimCurves = (t01: number, aimAngleDeg: number): MotionCurves => {
  const settle = Math.sin(clamp01(t01) * Math.PI);
  return {
    leanRad: -0.31,
    pelvisShiftXM: 0.02 * settle,
    pelvisBobYM: 0.015 * settle,
    hipFront: 0.2,
    hipBack: -0.18,
    kneeFront: 0.56,
    kneeBack: 0.48,
    shoulderFront: 1.52 + 0.16 * settle,
    shoulderBack: 0.38,
    elbowFront: -0.24,
    elbowBack: -0.08,
    javelinAngleRad: toRad(aimAngleDeg)
  };
};

const throwCurves = (t01: number, aimAngleDeg: number): MotionCurves => {
  const stage = sampleThrowSubphase(t01);
  const windup = stage.windup01;
  const delivery = stage.delivery01;
  const follow = stage.follow01;

  return {
    leanRad: lerp(lerp(-0.24, -0.34, windup), lerp(0.08, 0.2, follow), delivery),
    pelvisShiftXM: lerp(lerp(-0.01, -0.06, windup), lerp(0.16, 0.2, follow), delivery),
    pelvisBobYM: 0.012 * Math.sin(clamp01(t01) * Math.PI),
    hipFront: lerp(lerp(0.2, 0.08, windup), lerp(0.62, 0.56, follow), delivery),
    hipBack: lerp(lerp(-0.18, -0.26, windup), lerp(-0.48, -0.42, follow), delivery),
    kneeFront: lerp(lerp(0.58, 0.66, windup), lerp(0.36, 0.4, follow), delivery),
    kneeBack: lerp(lerp(0.5, 0.56, windup), lerp(0.72, 0.78, follow), delivery),
    shoulderFront: lerp(lerp(1.2, 1.9, windup), lerp(0.2, -0.08, follow), delivery),
    shoulderBack: lerp(lerp(0.34, 0.5, windup), lerp(-0.34, -0.24, follow), delivery),
    elbowFront: lerp(lerp(-0.2, -0.44, windup), lerp(-0.08, -0.02, follow), delivery),
    elbowBack: lerp(lerp(-0.06, 0.12, windup), lerp(0.16, 0.2, follow), delivery),
    javelinAngleRad: toRad(aimAngleDeg)
  };
};

const followThroughCurves = (t01: number): MotionCurves => {
  const t = clamp01(t01);
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
};

const idleCurves = (aimAngleDeg: number): MotionCurves => ({
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
  javelinAngleRad: toRad(Math.max(-90, Math.min(90, aimAngleDeg)))
});

const curvesForPose = (
  pose: AthletePoseState,
  speedNorm: number,
  aimAngleDeg: number,
  options: PoseSamplingOptions
): MotionCurves => {
  const t = clamp01(pose.animT);

  if (pose.animTag === 'run') {
    return runCurves(t, speedNorm, aimAngleDeg);
  }

  if (pose.animTag === 'aim') {
    const targetAim = aimCurves(t, aimAngleDeg);
    if (
      typeof options.runBlendFromAnimT === 'number' &&
      typeof options.runToAimBlend01 === 'number' &&
      options.runToAimBlend01 < 1
    ) {
      const runSource = runCurves(options.runBlendFromAnimT, speedNorm, aimAngleDeg);
      const upperBlend = easeInOutSine(options.runToAimBlend01);
      const lowerBlend = easeInOutSine(
        clamp01(options.runToAimBlend01 * (1 - Math.min(speedNorm * 6, 1)))
      );
      return splitBodyMix(runSource, targetAim, lowerBlend, upperBlend);
    }
    return targetAim;
  }

  if (pose.animTag === 'throw') {
    return throwCurves(t, aimAngleDeg);
  }

  if (pose.animTag === 'followThrough') {
    return followThroughCurves(t);
  }

  return idleCurves(aimAngleDeg);
};

export const computeAthletePoseGeometry = (
  pose: AthletePoseState,
  speedNorm: number,
  aimAngleDeg: number,
  baseXM = RUNUP_START_X_M,
  options: PoseSamplingOptions = {}
): AthletePoseGeometry => {
  const curves = curvesForPose(pose, speedNorm, aimAngleDeg, options);
  const pelvis: PointM = {
    xM: baseXM + curves.pelvisShiftXM,
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
  const elbowFrontCurve = add(shoulderFront, polar(armFrontAngle, 0.33));
  const elbowBack = add(shoulderBack, polar(armBackAngle, 0.3));
  const handFrontCurve = add(elbowFrontCurve, polar(armFrontAngle + curves.elbowFront, 0.31));
  const handBack = add(elbowBack, polar(armBackAngle + curves.elbowBack, 0.29));

  const baseJavelinAngleRad = pose.animTag === 'throw' ? toRad(aimAngleDeg) : curves.javelinAngleRad;
  const aimDir = polar(baseJavelinAngleRad, 1);
  const aimNormal = { x: -aimDir.y, y: aimDir.x };
  const ikTarget: PointM = (() => {
    if (pose.animTag !== 'throw') {
      return {
        xM: shoulderFront.xM + aimDir.x * 0.56,
        yM: shoulderFront.yM + aimDir.y * 0.56
      };
    }

    const stage = sampleThrowSubphase(pose.animT);
    const hold: PointM = {
      xM: shoulderFront.xM + aimDir.x * 0.34 + aimNormal.x * 0.04,
      yM: shoulderFront.yM + aimDir.y * 0.34 + aimNormal.y * 0.04
    };
    const windupPoint: PointM = {
      xM: shoulderFront.xM - aimDir.x * 0.16 + aimNormal.x * 0.1,
      yM: shoulderFront.yM - aimDir.y * 0.16 + aimNormal.y * 0.1
    };
    const releasePoint: PointM = {
      xM: shoulderFront.xM + aimDir.x * 0.58 + aimNormal.x * 0.01,
      yM: shoulderFront.yM + aimDir.y * 0.58 + aimNormal.y * 0.01
    };
    const followPoint: PointM = {
      xM: shoulderFront.xM + aimDir.x * 0.48 - aimNormal.x * 0.06,
      yM: shoulderFront.yM + aimDir.y * 0.48 - aimNormal.y * 0.06
    };

    if (stage.stage === 'windup') {
      return lerpPoint(hold, windupPoint, stage.windup01);
    }
    if (stage.stage === 'delivery') {
      return lerpPoint(windupPoint, releasePoint, stage.delivery01);
    }
    return lerpPoint(releasePoint, followPoint, stage.follow01);
  })();
  const ikResult = solveArm2BoneIK(shoulderFront, ikTarget, 0.33, 0.31);
  const ikBlend =
    pose.animTag === 'idle'
      ? 0.7
      : pose.animTag === 'run'
        ? 0.6
        : pose.animTag === 'aim'
          ? 0.85
          : pose.animTag === 'throw'
            ? 0.92
            : 0;
  const elbowFront: PointM = {
    xM: lerp(elbowFrontCurve.xM, ikResult.elbow.xM, ikBlend),
    yM: lerp(elbowFrontCurve.yM, ikResult.elbow.yM, ikBlend)
  };
  const handFront: PointM = {
    xM: lerp(handFrontCurve.xM, ikResult.hand.xM, ikBlend),
    yM: lerp(handFrontCurve.yM, ikResult.hand.yM, ikBlend)
  };

  const attachedJavelinAngle = baseJavelinAngleRad;

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
    javelinAngleRad: attachedJavelinAngle
  };
};
