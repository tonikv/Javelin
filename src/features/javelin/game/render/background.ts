/**
 * Sky, clouds, and atmospheric haze rendering.
 * Called once per frame before any world-space content.
 */
import { CAMERA_GROUND_BOTTOM_PADDING } from '../constants';
import { getRenderPalette, type RenderPalette } from '../renderTheme';
import type { ThemeMode } from '../../../../theme/init';
import { CLOUD_LAYERS, type RenderSession } from './types';

export const getSessionPalette = (theme: ThemeMode, session: RenderSession): RenderPalette => {
  if (session.paletteCache?.theme === theme) {
    return session.paletteCache.palette;
  }
  const palette = getRenderPalette(theme);
  session.paletteCache = { theme, palette };
  return palette;
};

const getBackgroundGradients = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: RenderPalette,
  theme: ThemeMode,
  session: RenderSession
): { sky: CanvasGradient; haze: CanvasGradient } => {
  const cache = session.backgroundGradientCache;
  if (cache && cache.width === width && cache.height === height && cache.theme === theme) {
    return { sky: cache.sky, haze: cache.haze };
  }

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, palette.scene.skyTop);
  sky.addColorStop(0.56, palette.scene.skyMid);
  sky.addColorStop(1, palette.scene.skyBottom);

  const haze = ctx.createRadialGradient(
    width * 0.25,
    height * 0.1,
    20,
    width * 0.25,
    height * 0.1,
    width * 0.8
  );
  haze.addColorStop(0, palette.scene.hazeCenter);
  haze.addColorStop(1, 'rgba(255, 255, 255, 0)');

  session.backgroundGradientCache = { width, height, theme, sky, haze };
  return { sky, haze };
};

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: RenderPalette,
  theme: ThemeMode,
  session: RenderSession
): void => {
  const gradients = getBackgroundGradients(ctx, width, height, palette, theme, session);

  ctx.fillStyle = gradients.sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = gradients.haze;
  ctx.fillRect(0, 0, width, height);
};

export const drawClouds = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  worldMinX: number,
  palette: RenderPalette
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;

  for (const layer of CLOUD_LAYERS) {
    const baseY = groundY * layer.yFraction;
    const scrollPx = worldMinX * layer.parallaxFactor * 4;

    for (const cloud of layer.clouds) {
      const rawX = cloud.offsetXM * 8 - scrollPx;
      const wrapWidth = width + cloud.widthPx * 2;
      const x = ((rawX % wrapWidth) + wrapWidth) % wrapWidth - cloud.widthPx;
      const y = baseY;

      ctx.save();
      ctx.globalAlpha = Math.min(1, cloud.opacity + 0.16);
      ctx.fillStyle = palette.scene.cloudFill;
      ctx.beginPath();
      const rx = cloud.widthPx / 2;
      const ry = cloud.heightPx / 2;
      ctx.ellipse(x + rx, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 0.6, y + ry * 0.15, rx * 0.7, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 1.4, y - ry * 0.1, rx * 0.65, ry * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = palette.scene.cloudStroke;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }
};
