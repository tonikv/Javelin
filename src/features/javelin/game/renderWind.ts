import { clamp, lerp } from './math';
import { getRenderPalette } from './renderTheme';
import { WIND_VISUAL_CALM_THRESHOLD_MS, WIND_VISUAL_MAX_REFERENCE_MS } from './tuning';
import type { ThemeMode } from '../../../theme/init';

const MOBILE_WIND_BREAKPOINT_PX = 600;
const FLAG_SEGMENT_COUNT = 6;

export type WindIndicatorLayout = {
  isMobile: boolean;
  mastX: number;
  mastTopY: number;
  mastBottomY: number;
  flagAnchorY: number;
  labelX: number;
  labelY: number;
};

export type FlagPolylinePoint = {
  x: number;
  y: number;
};

const drawOutlinedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  outlineStyle: string,
  outlineWidth: number
): void => {
  ctx.save();
  ctx.strokeStyle = outlineStyle;
  ctx.lineWidth = outlineWidth;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
};

const smoothstep01 = (value: number): number => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const windSignedStrength = (windMs: number): number =>
  clamp(windMs / Math.max(0.01, WIND_VISUAL_MAX_REFERENCE_MS), -1, 1);

const windStrength01 = (windMs: number): number =>
  smoothstep01(
    (Math.abs(windMs) - WIND_VISUAL_CALM_THRESHOLD_MS) /
      Math.max(0.01, WIND_VISUAL_MAX_REFERENCE_MS - WIND_VISUAL_CALM_THRESHOLD_MS)
  );

export const getWindIndicatorLayout = (width: number, uiScale: number): WindIndicatorLayout => {
  const safeScale = clamp(uiScale, 0.8, 1.5);
  const isMobile = width < MOBILE_WIND_BREAKPOINT_PX;
  const rightPadding = isMobile ? 18 : Math.round(26 * safeScale);
  const topPadding = isMobile ? 16 : Math.round(20 * safeScale);
  const mastHeight = (isMobile ? 32 : 36) * safeScale;
  const mastX = width - rightPadding;
  const mastTopY = topPadding;
  const mastBottomY = topPadding + mastHeight;

  return {
    isMobile,
    mastX,
    mastTopY,
    mastBottomY,
    flagAnchorY: mastTopY + 2 * safeScale,
    labelX: mastX - (isMobile ? 56 : 60) * safeScale,
    labelY: mastBottomY + 14 * safeScale
  };
};

type BuildFlagPolylineInput = {
  mastX: number;
  flagAnchorY: number;
  windMs: number;
  nowMs: number;
  uiScale: number;
  reducedMotion?: boolean;
  segmentCount?: number;
};

export const buildFlagPolyline = ({
  mastX,
  flagAnchorY,
  windMs,
  nowMs,
  uiScale,
  reducedMotion = false,
  segmentCount = FLAG_SEGMENT_COUNT
}: BuildFlagPolylineInput): FlagPolylinePoint[] => {
  const count = Math.max(3, Math.floor(segmentCount));
  const strength01 = windStrength01(windMs);
  const signedStrength = windSignedStrength(windMs);
  const motionScale = reducedMotion ? 0.15 : 1;
  const segmentSweepPx = lerp(0.18, 8.8, strength01) * uiScale;
  const calmLeanPx = lerp(0.9, 0.2, strength01) * uiScale;
  const sagPx = lerp(5.2, 0.9, strength01) * uiScale;
  const flapAmplitudePx = lerp(0.05, 4.9, strength01) * uiScale * motionScale;
  const flapFreqPerMs = lerp(0.0014, 0.012, strength01) * motionScale;

  const points: FlagPolylinePoint[] = [{ x: mastX + calmLeanPx, y: flagAnchorY }];
  let currentX = mastX + calmLeanPx;
  for (let index = 1; index <= count; index += 1) {
    const progress = index / count;
    currentX += signedStrength * segmentSweepPx * (0.82 + progress * 0.2);
    const harmonicA = Math.sin(nowMs * flapFreqPerMs + index * 0.95);
    const harmonicB = Math.sin(nowMs * flapFreqPerMs * 1.85 + index * 1.6);
    const flapOffset = (harmonicA + harmonicB * 0.35) * flapAmplitudePx * progress;
    const sagOffset = sagPx * progress * progress;
    points.push({
      x: currentX,
      y: flagAnchorY + sagOffset + flapOffset
    });
  }

  return points;
};

const drawFlag = (
  ctx: CanvasRenderingContext2D,
  polyline: FlagPolylinePoint[],
  windMs: number,
  uiScale: number,
  theme: ThemeMode
): void => {
  if (polyline.length < 2) {
    return;
  }
  const palette = getRenderPalette(theme);

  const strength01 = windStrength01(windMs);
  const thicknessPx = Math.max(2.5, (3.8 + strength01 * 1.9) * uiScale);
  const lowerEdge = polyline
    .slice()
    .reverse()
    .map((point, reverseIndex) => {
      const progress = 1 - reverseIndex / Math.max(1, polyline.length - 1);
      return {
        x: point.x,
        y: point.y + thicknessPx * (0.65 + 0.35 * progress)
      };
    });

  const fill = windMs >= 0 ? palette.wind.headwindFlagFill : palette.wind.tailwindFlagFill;
  const stroke =
    windMs >= 0 ? palette.wind.headwindFlagStroke : palette.wind.tailwindFlagStroke;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(polyline[0].x, polyline[0].y);
  for (let index = 1; index < polyline.length; index += 1) {
    ctx.lineTo(polyline[index].x, polyline[index].y);
  }
  for (let index = 0; index < lowerEdge.length; index += 1) {
    ctx.lineTo(lowerEdge[index].x, lowerEdge[index].y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1.2, 1.4 * uiScale);
  ctx.stroke();
  ctx.restore();
};

export const drawWindIndicator = (
  ctx: CanvasRenderingContext2D,
  width: number,
  windMs: number,
  nowMs: number,
  localeFormatter: Intl.NumberFormat,
  uiScale: number,
  theme: ThemeMode = 'light',
  reducedMotion = false
): void => {
  const palette = getRenderPalette(theme);
  const layout = getWindIndicatorLayout(width, uiScale);
  const polyline = buildFlagPolyline({
    mastX: layout.mastX,
    flagAnchorY: layout.flagAnchorY,
    windMs,
    nowMs,
    uiScale,
    reducedMotion
  });

  ctx.save();
  ctx.strokeStyle = palette.wind.mastStroke;
  ctx.lineWidth = Math.max(2, 3 * uiScale);
  ctx.beginPath();
  ctx.moveTo(layout.mastX, layout.mastBottomY);
  ctx.lineTo(layout.mastX, layout.mastTopY);
  ctx.stroke();
  drawFlag(ctx, polyline, windMs, uiScale, theme);
  ctx.restore();

  ctx.font = `700 ${Math.round(12 * uiScale)}px ui-sans-serif`;
  const windText = `${windMs >= 0 ? '+' : ''}${localeFormatter.format(windMs)} m/s`;
  drawOutlinedText(
    ctx,
    windText,
    layout.labelX,
    layout.labelY,
    palette.wind.labelFill,
    palette.wind.labelOutline,
    Math.max(1.8, 1.6 * uiScale)
  );
};
