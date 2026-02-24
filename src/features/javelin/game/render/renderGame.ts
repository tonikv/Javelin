/**
 * Main frame compositor.
 * Calls rendering sub-modules in correct draw order (back-to-front).
 */
import { createWorldToScreen } from '../camera';
import { JAVELIN_GRIP_OFFSET_M, JAVELIN_GRIP_OFFSET_Y_M } from '../constants';
import { drawAthlete } from '../renderAthlete';
import { drawWorldTimingMeter } from '../renderMeter';
import { drawWindIndicator } from '../renderWind';
import { computeTrajectoryPreview } from '../trajectory';
import { drawBackground, drawClouds, getSessionPalette } from './background';
import { drawTrackAndField } from './field';
import {
  drawJavelinWorld,
  drawLandedJavelin,
  drawTrajectoryIndicator,
  getPoseForState,
  getVisibleJavelinRenderState,
  shouldDrawFrontArmOverHead
} from './javelinRender';
import { drawOnboardingHint, drawReleaseFlash, drawResultOverlay, drawWindHint } from './overlays';
import type { RenderFrameInput } from './types';

const getOverlayUiScale = (width: number): number => {
  const safeWidth = Math.max(280, width);
  return Math.max(0.95, Math.min(1.25, 420 / safeWidth));
};

/**
 * Render one complete game frame to canvas.
 * Draw order is back-to-front: environment, field, athlete/javelin, meters, overlays.
 */
export const renderGame = (input: RenderFrameInput): void => {
  const {
    ctx,
    state,
    width,
    height,
    dtMs,
    numberFormat,
    labels,
    theme,
    prefersReducedMotion,
    session,
    audio
  } = input;

  const phaseChanged = state.phase.tag !== session.lastPhaseTag;
  if (state.phase.tag === 'flight') {
    const speedMs = Math.hypot(
      state.phase.javelin.vxMs,
      state.phase.javelin.vyMs,
      state.phase.javelin.vzMs
    );
    const motionAudioScale = prefersReducedMotion ? 0.35 : 1;
    audio?.onFlightWindUpdate?.(Math.min(1, speedMs / 38) * motionAudioScale);
  } else {
    audio?.onFlightWindStop?.();
  }

  if (phaseChanged) {
    switch (state.phase.tag) {
      case 'chargeAim':
        audio?.onChargeStart?.();
        break;
      case 'throwAnim':
        audio?.onThrowRelease?.(state.phase.speedNorm, state.phase.releaseQuality);
        break;
      case 'result':
        audio?.onLandingImpact?.(state.phase.tipFirst === true);
        audio?.onCrowdReaction?.(state.phase.resultKind === 'valid' ? 'cheer' : 'groan');
        break;
      case 'fault':
        audio?.onFault?.();
        audio?.onCrowdReaction?.('groan');
        break;
      case 'idle':
      case 'runup':
      case 'flight':
      default:
        break;
    }
  }

  const overlayUiScale = getOverlayUiScale(width);
  const palette = getSessionPalette(theme, session);
  const camera = createWorldToScreen(
    state,
    width,
    height,
    dtMs,
    session.camera,
    prefersReducedMotion
  );
  const { toScreen, worldMinX, worldMaxX } = camera;

  drawBackground(ctx, width, height, palette, theme, session);
  drawClouds(ctx, width, height, worldMinX, palette);
  drawTrackAndField(
    ctx,
    width,
    height,
    toScreen,
    labels.throwLine,
    worldMinX,
    worldMaxX,
    overlayUiScale,
    palette
  );
  drawWindIndicator(
    ctx,
    width,
    state.windMs,
    state.nowMs,
    numberFormat,
    overlayUiScale,
    theme,
    prefersReducedMotion
  );
  if (state.phase.tag === 'chargeAim') {
    drawWindHint(
      ctx,
      width,
      state.windMs,
      overlayUiScale,
      state.windMs >= 0 ? labels.headwind : labels.tailwind,
      palette
    );
  }

  const pose = getPoseForState(state);
  const javelin = getVisibleJavelinRenderState(state, pose);
  const headScreen = drawAthlete(
    ctx,
    toScreen,
    pose,
    shouldDrawFrontArmOverHead(state),
    palette
  );

  if (javelin.mode === 'landed') {
    const tipFirst = state.phase.tag === 'result' ? state.phase.tipFirst === true : false;
    const landingTipXM = state.phase.tag === 'result' ? state.phase.landingTipXM : undefined;
    drawLandedJavelin(
      ctx,
      toScreen,
      javelin.xM,
      javelin.yM,
      javelin.angleRad,
      javelin.lengthM,
      tipFirst,
      landingTipXM,
      palette
    );
  } else if (javelin.mode !== 'none') {
    drawJavelinWorld(
      ctx,
      toScreen,
      javelin.xM,
      javelin.yM,
      javelin.angleRad,
      javelin.lengthM,
      palette
    );
  }

  if (state.phase.tag === 'chargeAim') {
    const trajectoryPreview = computeTrajectoryPreview({
      originXM: pose.javelinGrip.xM + Math.cos(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_M,
      originYM: pose.javelinGrip.yM + Math.sin(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_Y_M,
      angleDeg: state.phase.angleDeg,
      speedNorm: state.phase.speedNorm,
      forceNorm: state.phase.forceNormPreview,
      windMs: state.windMs
    });
    drawTrajectoryIndicator(
      ctx,
      toScreen,
      trajectoryPreview.points,
      overlayUiScale,
      prefersReducedMotion
    );
  }

  if (state.phase.tag === 'idle' && state.roundId === 0) {
    drawOnboardingHint(ctx, width, height, labels.onboarding, overlayUiScale, palette);
  }

  drawResultOverlay(ctx, state, toScreen, numberFormat, overlayUiScale, palette, session);
  drawReleaseFlash(ctx, state, width, overlayUiScale, palette, labels.releaseFlash);
  drawWorldTimingMeter(ctx, state, headScreen, overlayUiScale, theme);

  if (state.phase.tag === 'runup') {
    const currentTapAtMs = state.phase.tap.lastTapAtMs;
    if (currentTapAtMs !== null && currentTapAtMs !== session.lastRunupTapAtMs) {
      audio?.onRunupTap?.(state.phase.tap.lastTapGainNorm);
      session.lastRunupTapAtMs = currentTapAtMs;
    } else if (currentTapAtMs === null) {
      session.lastRunupTapAtMs = null;
    }
  } else {
    session.lastRunupTapAtMs = null;
  }

  if (state.phase.tag === 'fault') {
    if (state.phase.javelinLanded && !session.lastFaultJavelinLanded) {
      audio?.onLandingImpact?.(false);
    }
    session.lastFaultJavelinLanded = state.phase.javelinLanded;
  } else {
    session.lastFaultJavelinLanded = false;
  }

  session.lastPhaseTag = state.phase.tag;
};
