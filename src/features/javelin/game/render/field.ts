/**
 * Field, runway, throw line, and distance tick rendering.
 * Drawn in world space before athlete and projectile layers.
 */
import { RUNWAY_OFFSET_X, type WorldToScreen } from '../camera';
import {
  CAMERA_GROUND_BOTTOM_PADDING,
  CANVAS_FONT_STACK,
  FIELD_MAX_DISTANCE_M,
  THROW_LINE_X_M
} from '../constants';
import type { RenderPalette } from '../renderTheme';

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

const drawThrowLine = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  height: number,
  label: string,
  uiScale: number,
  palette: RenderPalette
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  const line = toScreen({ xM: THROW_LINE_X_M, yM: 0 });
  ctx.strokeStyle = palette.scene.throwLineStroke;
  ctx.lineWidth = Math.max(2.4, 3 * uiScale);
  ctx.beginPath();
  ctx.moveTo(line.x, groundY - 24 * uiScale);
  ctx.lineTo(line.x, groundY + 19 * uiScale);
  ctx.stroke();

  ctx.font = `700 ${Math.round(12 * uiScale)}px ${CANVAS_FONT_STACK}`;
  drawOutlinedText(
    ctx,
    label,
    line.x - 28 * uiScale,
    groundY - 27 * uiScale,
    palette.scene.throwLineLabelFill,
    palette.scene.throwLineLabelOutline,
    Math.max(2, 1.8 * uiScale)
  );
};

export const drawTrackAndField = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  toScreen: WorldToScreen,
  throwLineLabel: string,
  worldMinX: number,
  worldMaxX: number,
  uiScale: number,
  palette: RenderPalette
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  ctx.fillStyle = palette.scene.fieldGrass;
  ctx.fillRect(0, groundY, width, CAMERA_GROUND_BOTTOM_PADDING);

  ctx.strokeStyle = palette.scene.runwayLine;
  ctx.lineWidth = Math.max(1.8, 2 * uiScale);
  ctx.beginPath();
  ctx.moveTo(RUNWAY_OFFSET_X, groundY);
  ctx.lineTo(width - 20, groundY);
  ctx.stroke();

  const relativeStart = Math.max(0, Math.floor((worldMinX - THROW_LINE_X_M) / 5) * 5);
  const relativeEnd = Math.max(0, worldMaxX - THROW_LINE_X_M + 5);
  for (let relativeM = relativeStart; relativeM <= relativeEnd; relativeM += 5) {
    const xM = THROW_LINE_X_M + relativeM;
    if (xM < THROW_LINE_X_M || xM > FIELD_MAX_DISTANCE_M) {
      continue;
    }
    const { x } = toScreen({ xM, yM: 0 });
    const isMajor = relativeM % 10 === 0;
    ctx.strokeStyle = isMajor ? palette.scene.distanceTickMajor : palette.scene.distanceTickMinor;
    ctx.lineWidth = isMajor ? Math.max(1.8, 2 * uiScale) : Math.max(1, 1.2 * uiScale);
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, groundY + (isMajor ? 16 * uiScale : 10 * uiScale));
    ctx.stroke();

    if (isMajor) {
      ctx.font = `700 ${Math.round(12 * uiScale)}px ${CANVAS_FONT_STACK}`;
      drawOutlinedText(
        ctx,
        `${relativeM} m`,
        x - 12 * uiScale,
        groundY + 32 * uiScale,
        palette.scene.distanceLabelFill,
        palette.scene.distanceLabelOutline,
        Math.max(1.8, 1.5 * uiScale)
      );
    }
  }

  drawThrowLine(ctx, toScreen, height, throwLineLabel, uiScale, palette);
};
