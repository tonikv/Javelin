/**
 * Screen-space overlay rendering helpers.
 * Includes onboarding hints, wind hints, release flash, and result marker fade.
 */
import type { WorldToScreen } from '../camera';
import { CANVAS_FONT_STACK } from '../constants';
import { getWindIndicatorLayout } from '../renderWind';
import type { RenderPalette } from '../renderTheme';
import type { GameState } from '../types';
import { drawLandingMarker } from './javelinRender';
import type { ReleaseFlashLabels, RenderSession } from './types';

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

export const drawOnboardingHint = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  uiScale: number,
  palette: RenderPalette
): void => {
  if (!text.trim()) {
    return;
  }

  const y = Math.max(56, height - 28 * uiScale);
  ctx.textAlign = 'center';
  ctx.font = `700 ${Math.round(11 * uiScale)}px ${CANVAS_FONT_STACK}`;
  drawOutlinedText(
    ctx,
    text,
    width / 2,
    y,
    palette.scene.throwLineLabelFill,
    palette.scene.throwLineLabelOutline,
    Math.max(2, 1.8 * uiScale)
  );
};

export const drawWindHint = (
  ctx: CanvasRenderingContext2D,
  width: number,
  windMs: number,
  uiScale: number,
  text: string,
  palette: RenderPalette
): void => {
  if (!text.trim()) {
    return;
  }
  const layout = getWindIndicatorLayout(width, uiScale);
  const x = layout.labelX;
  const y = layout.labelY + 14 * uiScale;
  ctx.textAlign = 'left';
  ctx.font = `700 ${Math.round(10 * uiScale)}px ${CANVAS_FONT_STACK}`;
  drawOutlinedText(
    ctx,
    text,
    x,
    y,
    windMs >= 0 ? palette.wind.headwindFlagFill : palette.wind.tailwindFlagFill,
    palette.wind.labelOutline,
    Math.max(1.6, 1.3 * uiScale)
  );
};

export const drawResultOverlay = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  toScreen: WorldToScreen,
  numberFormat: Intl.NumberFormat,
  uiScale: number,
  palette: RenderPalette,
  session: RenderSession
): void => {
  if (state.phase.tag !== 'result') {
    session.resultMarker.lastRoundId = -1;
    return;
  }

  if (state.roundId !== session.resultMarker.lastRoundId) {
    session.resultMarker.lastRoundId = state.roundId;
    session.resultMarker.shownAtMs = state.nowMs;
  }
  const fadeAgeMs = Math.max(0, state.nowMs - session.resultMarker.shownAtMs);
  const alpha = Math.min(1, fadeAgeMs / 400);
  ctx.save();
  ctx.globalAlpha = alpha;
  drawLandingMarker(
    ctx,
    toScreen,
    state.phase.landingTipXM,
    state.phase.resultKind,
    `${numberFormat.format(state.phase.distanceM)}m`,
    uiScale,
    palette
  );
  ctx.restore();
};

export const drawReleaseFlash = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  uiScale: number,
  palette: RenderPalette,
  labels: ReleaseFlashLabels
): void => {
  const releaseFeedback =
    state.phase.tag === 'throwAnim'
      ? {
          label: state.phase.lineCrossedAtRelease
            ? labels.foulLine
            : labels[state.phase.releaseQuality],
          shownAtMs: state.phase.releaseFlashAtMs
        }
      : state.phase.tag === 'flight'
        ? {
            label: state.phase.launchedFrom.lineCrossedAtRelease
              ? labels.foulLine
              : labels[state.phase.launchedFrom.releaseQuality],
            shownAtMs: state.phase.javelin.releasedAtMs
          }
        : null;

  if (releaseFeedback === null) {
    return;
  }

  const feedbackAgeMs = Math.max(0, state.nowMs - releaseFeedback.shownAtMs);
  const holdMs = 220;
  const fadeMs = 620;
  const totalMs = holdMs + fadeMs;
  if (feedbackAgeMs >= totalMs) {
    return;
  }

  const fadeT = feedbackAgeMs <= holdMs ? 0 : (feedbackAgeMs - holdMs) / fadeMs;
  const alpha = 1 - Math.min(1, fadeT);
  const scale = 1 + (1 - alpha) * 0.12;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `900 ${Math.round(28 * scale * uiScale)}px ${CANVAS_FONT_STACK}`;
  ctx.textAlign = 'center';
  const y = 74 + (uiScale - 1) * 10 - (1 - alpha) * 8 * uiScale;
  ctx.strokeStyle = palette.scene.releaseFlashOutline;
  ctx.lineWidth = Math.max(2, 2 * uiScale);
  ctx.strokeText(releaseFeedback.label, width / 2, y);
  ctx.fillStyle = palette.scene.releaseFlashFill;
  ctx.fillText(releaseFeedback.label, width / 2, y);
  ctx.restore();
};
