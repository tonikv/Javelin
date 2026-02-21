import type { AthletePoseGeometry } from './athletePose';
import type { WorldToScreen } from './camera';

export type HeadAnchor = {
  x: number;
  y: number;
};

const drawLimb = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  width: number,
  color: string
): void => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
};

const drawFrontArm = (
  ctx: CanvasRenderingContext2D,
  points: {
    shoulderCenter: { x: number; y: number };
    elbowFront: { x: number; y: number };
    handFront: { x: number; y: number };
  }
): void => {
  drawLimb(ctx, points.shoulderCenter, points.elbowFront, 5, '#0a2f4d');
  drawLimb(ctx, points.elbowFront, points.handFront, 4, '#103c5e');
};

export const drawAthlete = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  pose: AthletePoseGeometry,
  drawFrontArmOverHead: boolean
): HeadAnchor => {
  const shadowCenter = toScreen({ xM: pose.pelvis.xM + 0.06, yM: 0.02 });
  ctx.fillStyle = 'rgba(5, 28, 42, 0.18)';
  ctx.beginPath();
  ctx.ellipse(shadowCenter.x, shadowCenter.y + 3, 17, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const p = {
    head: toScreen(pose.head),
    shoulderCenter: toScreen(pose.shoulderCenter),
    pelvis: toScreen(pose.pelvis),
    hipFront: toScreen(pose.hipFront),
    hipBack: toScreen(pose.hipBack),
    kneeFront: toScreen(pose.kneeFront),
    kneeBack: toScreen(pose.kneeBack),
    footFront: toScreen(pose.footFront),
    footBack: toScreen(pose.footBack),
    elbowFront: toScreen(pose.elbowFront),
    elbowBack: toScreen(pose.elbowBack),
    handFront: toScreen(pose.handFront),
    handBack: toScreen(pose.handBack)
  };

  drawLimb(ctx, p.hipBack, p.kneeBack, 6, '#0a2f4d');
  drawLimb(ctx, p.kneeBack, p.footBack, 5, '#124468');
  drawLimb(ctx, p.hipFront, p.kneeFront, 6, '#0d3658');
  drawLimb(ctx, p.kneeFront, p.footFront, 5, '#1b5b83');

  drawLimb(ctx, p.pelvis, p.shoulderCenter, 9, '#0f3d62');

  drawLimb(ctx, p.shoulderCenter, p.elbowBack, 5, '#124468');
  drawLimb(ctx, p.elbowBack, p.handBack, 4, '#1b5b83');

  if (!drawFrontArmOverHead) {
    drawFrontArm(ctx, p);
  }

  ctx.fillStyle = '#ffe3bc';
  ctx.beginPath();
  ctx.arc(p.head.x, p.head.y, 7.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#073257';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.head.x, p.head.y, 7.6, 0, Math.PI * 2);
  ctx.stroke();

  const eyeOffsetX = Math.cos(pose.headTiltRad) * 3.5 + Math.sin(pose.headTiltRad) * 0.5;
  const eyeOffsetY = -Math.sin(pose.headTiltRad) * 3.5 + Math.cos(pose.headTiltRad) * 0.5;
  ctx.fillStyle = '#0b2c49';
  ctx.beginPath();
  ctx.arc(p.head.x + eyeOffsetX, p.head.y - eyeOffsetY, 1.2, 0, Math.PI * 2);
  ctx.fill();

  if (drawFrontArmOverHead) {
    drawFrontArm(ctx, p);
  }

  return p.head;
};
