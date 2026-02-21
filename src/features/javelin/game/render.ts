import type { GameState } from './types';

type WorldToScreenInput = {
  xM: number;
  yM: number;
  width: number;
  height: number;
};

const WORLD_WIDTH_M = 100;
const RUNWAY_OFFSET_X = 72;
const GROUND_BOTTOM_PADDING = 70;

const toScreen = ({ xM, yM, width, height }: WorldToScreenInput): { x: number; y: number } => {
  const playableWidth = width - RUNWAY_OFFSET_X - 28;
  const x = RUNWAY_OFFSET_X + (xM / WORLD_WIDTH_M) * playableWidth;
  const y = height - GROUND_BOTTOM_PADDING - yM * 12;
  return { x, y };
};

const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#eef8ff');
  sky.addColorStop(0.66, '#d3f0ff');
  sky.addColorStop(1, '#fff9df');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(0, 44, 83, 0.06)';
  for (let i = 0; i < width; i += 28) {
    ctx.fillRect(i, 0, 2, height);
  }
};

const drawField = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  const groundY = height - GROUND_BOTTOM_PADDING;
  ctx.fillStyle = '#88d37f';
  ctx.fillRect(0, groundY, width, GROUND_BOTTOM_PADDING);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(RUNWAY_OFFSET_X, groundY);
  ctx.lineTo(width - 20, groundY);
  ctx.stroke();

  for (let m = 10; m <= WORLD_WIDTH_M; m += 10) {
    const { x } = toScreen({ xM: m, yM: 0, width, height });
    const isMajor = m % 20 === 0;
    ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = isMajor ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, groundY + (isMajor ? 18 : 12));
    ctx.stroke();

    if (isMajor) {
      ctx.fillStyle = '#0b2238';
      ctx.font = 'bold 12px ui-sans-serif';
      ctx.fillText(`${m} m`, x - 14, groundY + 35);
    }
  }
};

const drawAthlete = (
  ctx: CanvasRenderingContext2D,
  height: number,
  armPhase: number,
  angleDeg: number
): void => {
  const groundY = height - GROUND_BOTTOM_PADDING;
  const x = 44;
  const y = groundY - 10;
  const shoulderY = y - 26;
  const armLength = 24;
  const throwAngle = ((-angleDeg + 90) * Math.PI) / 180;
  const animatedAngle = throwAngle + Math.sin(Math.min(armPhase, 1) * Math.PI) * 0.45;
  const armX = x + Math.cos(animatedAngle) * armLength;
  const armY = shoulderY - Math.sin(animatedAngle) * armLength;

  ctx.strokeStyle = '#07243d';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(x, y - 36, 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - 29);
  ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x - 8, y + 10);
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x + 8, y + 10);
  ctx.moveTo(x, shoulderY);
  ctx.lineTo(x - 13, shoulderY + 8);
  ctx.moveTo(x, shoulderY);
  ctx.lineTo(armX, armY);
  ctx.stroke();

  ctx.strokeStyle = '#ffd05b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(armX, armY);
  ctx.lineTo(armX + 20, armY - 3);
  ctx.stroke();
};

const drawJavelin = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  xM: number,
  yM: number,
  angleDeg: number
): void => {
  const point = toScreen({ xM, yM, width, height });
  const angleRad = (-angleDeg * Math.PI) / 180;
  const lengthPx = 30;
  const tipX = point.x + Math.cos(angleRad) * lengthPx;
  const tipY = point.y + Math.sin(angleRad) * lengthPx;

  ctx.strokeStyle = '#ffe69a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  ctx.fillStyle = '#d4472d';
  ctx.beginPath();
  ctx.arc(tipX, tipY, 2.2, 0, Math.PI * 2);
  ctx.fill();
};

const drawWind = (
  ctx: CanvasRenderingContext2D,
  width: number,
  windMs: number,
  localeFormatter: Intl.NumberFormat
): void => {
  const dir = windMs >= 0 ? 1 : -1;
  const x = width - 128;
  const y = 42;

  ctx.strokeStyle = '#0f4165';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 22);
  ctx.lineTo(x, y - 8);
  ctx.stroke();

  ctx.fillStyle = windMs >= 0 ? '#1f9d44' : '#cf3a2f';
  ctx.beginPath();
  if (dir >= 0) {
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x + 26, y - 1);
    ctx.lineTo(x, y + 7);
  } else {
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x - 26, y - 1);
    ctx.lineTo(x, y + 7);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#10314a';
  ctx.font = '600 12px ui-sans-serif';
  const windText = `${windMs >= 0 ? '+' : ''}${localeFormatter.format(windMs)} m/s`;
  ctx.fillText(windText, x - 16, y + 34);
};

const drawReleaseMeter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  armPhase: number,
  releaseStart: number,
  releaseEnd: number
): void => {
  const meterWidth = Math.min(260, width - 40);
  const x = (width - meterWidth) / 2;
  const y = height - 30;
  ctx.fillStyle = 'rgba(9, 28, 44, 0.2)';
  ctx.fillRect(x, y, meterWidth, 8);

  ctx.fillStyle = 'rgba(18, 196, 119, 0.45)';
  ctx.fillRect(
    x + releaseStart * meterWidth,
    y,
    (releaseEnd - releaseStart) * meterWidth,
    8
  );

  ctx.fillStyle = '#0b2238';
  ctx.fillRect(x, y + 10, clamp01(armPhase) * meterWidth, 3);
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
  numberFormat: Intl.NumberFormat
): void => {
  drawBackground(ctx, width, height);
  drawField(ctx, width, height);
  drawWind(ctx, width, state.windMs, numberFormat);

  if (state.phase.tag === 'runup') {
    drawAthlete(ctx, height, 0.25, 35);
  }

  if (state.phase.tag === 'throwPrep') {
    drawAthlete(ctx, height, state.phase.armPhase, state.phase.angleDeg);
    drawReleaseMeter(
      ctx,
      width,
      height,
      state.phase.armPhase,
      state.phase.releaseWindow.start,
      state.phase.releaseWindow.end
    );
  }

  if (state.phase.tag === 'flight') {
    drawAthlete(ctx, height, 0.95, state.phase.launchedFrom.angleDeg);
    drawJavelin(
      ctx,
      width,
      height,
      state.phase.projectile.xM,
      state.phase.projectile.yM,
      state.phase.launchedFrom.angleDeg
    );
  }

  if (state.phase.tag === 'result') {
    drawAthlete(ctx, height, 1, 30);
    drawJavelin(ctx, width, height, state.phase.distanceM, 0, 8);
  }
};
