import {
  computeAthletePoseGeometry,
  getRunToAimBlend01,
  sampleThrowSubphase,
  type AthletePoseGeometry
} from './athletePose';
import { playBeatTick } from './audio';
import {
  createCameraSmoothingState,
  createWorldToScreen,
  createWorldToScreenRaw,
  RUNWAY_OFFSET_X,
  type CameraSmoothingState,
  type WorldToScreen
} from './camera';
import {
  CAMERA_GROUND_BOTTOM_PADDING,
  FIELD_MAX_DISTANCE_M,
  JAVELIN_GRIP_OFFSET_M,
  JAVELIN_GRIP_OFFSET_Y_M,
  JAVELIN_LENGTH_M,
  RHYTHM_TARGET_PHASE01,
  THROW_LINE_X_M
} from './constants';
import { drawAthlete } from './renderAthlete';
import { drawWorldTimingMeter } from './renderMeter';
import { getRunupMeterPhase01 } from './selectors';
import {
  RUNUP_START_X_M,
  RUN_TO_DRAWBACK_BLEND_MS,
  TRAJECTORY_PREVIEW_BASE_OPACITY,
  TRAJECTORY_PREVIEW_DOT_COLOR,
  TRAJECTORY_PREVIEW_DOT_RADIUS_PX,
  TRAJECTORY_PREVIEW_END_OPACITY
} from './tuning';
import { computeTrajectoryPreview, type TrajectoryPoint } from './trajectory';
import type { GameState, ResultKind, TimingQuality } from './types';

export { getCameraTargetX } from './camera';
export { getHeadMeterScreenAnchor } from './renderMeter';

type CloudLayer = {
  yFraction: number;
  parallaxFactor: number;
  clouds: Array<{
    offsetXM: number;
    widthPx: number;
    heightPx: number;
    opacity: number;
  }>;
};

const CLOUD_LAYERS: CloudLayer[] = [
  {
    yFraction: 0.12,
    parallaxFactor: 0.05,
    clouds: [
      { offsetXM: 0, widthPx: 120, heightPx: 18, opacity: 0.28 },
      { offsetXM: 35, widthPx: 90, heightPx: 14, opacity: 0.24 },
      { offsetXM: 72, widthPx: 140, heightPx: 20, opacity: 0.26 },
      { offsetXM: 120, widthPx: 100, heightPx: 16, opacity: 0.22 }
    ]
  },
  {
    yFraction: 0.28,
    parallaxFactor: 0.15,
    clouds: [
      { offsetXM: 10, widthPx: 80, heightPx: 28, opacity: 0.32 },
      { offsetXM: 50, widthPx: 110, heightPx: 34, opacity: 0.3 },
      { offsetXM: 95, widthPx: 70, heightPx: 24, opacity: 0.28 }
    ]
  },
  {
    yFraction: 0.18,
    parallaxFactor: 0.3,
    clouds: [
      { offsetXM: 20, widthPx: 100, heightPx: 38, opacity: 0.34 },
      { offsetXM: 80, widthPx: 130, heightPx: 42, opacity: 0.31 }
    ]
  }
];

type ResultMarkerFadeState = {
  lastRoundId: number;
  shownAtMs: number;
};

export type RenderSession = {
  camera: CameraSmoothingState;
  resultMarker: ResultMarkerFadeState;
};

export const createRenderSession = (): RenderSession => ({
  camera: createCameraSmoothingState(),
  resultMarker: {
    lastRoundId: -1,
    shownAtMs: 0
  }
});

type ReleaseFlashLabels = Record<TimingQuality, string> & {
  foulLine: string;
};

const getOverlayUiScale = (width: number): number => {
  const safeWidth = Math.max(280, width);
  return Math.max(0.95, Math.min(1.25, 420 / safeWidth));
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

const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#dceef8');
  sky.addColorStop(0.56, '#c8e1ef');
  sky.addColorStop(1, '#b8d6e3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const haze = ctx.createRadialGradient(width * 0.25, height * 0.1, 20, width * 0.25, height * 0.1, width * 0.8);
  haze.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
  haze.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);
};

const drawClouds = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  worldMinX: number
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
      ctx.fillStyle = '#f8fcff';
      ctx.beginPath();
      const rx = cloud.widthPx / 2;
      const ry = cloud.heightPx / 2;
      ctx.ellipse(x + rx, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 0.6, y + ry * 0.15, rx * 0.7, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 1.4, y - ry * 0.1, rx * 0.65, ry * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(142, 179, 200, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }
};

const drawThrowLine = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  height: number,
  label: string,
  uiScale: number
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  const line = toScreen({ xM: THROW_LINE_X_M, yM: 0 });
  ctx.strokeStyle = '#ff5d4e';
  ctx.lineWidth = Math.max(2.4, 3 * uiScale);
  ctx.beginPath();
  ctx.moveTo(line.x, groundY - 24 * uiScale);
  ctx.lineTo(line.x, groundY + 19 * uiScale);
  ctx.stroke();

  ctx.font = `700 ${Math.round(12 * uiScale)}px ui-sans-serif`;
  drawOutlinedText(
    ctx,
    label,
    line.x - 28 * uiScale,
    groundY - 27 * uiScale,
    '#a3211a',
    'rgba(246, 252, 255, 0.92)',
    Math.max(2, 1.8 * uiScale)
  );
};

const drawTrackAndField = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  toScreen: WorldToScreen,
  throwLineLabel: string,
  worldMinX: number,
  worldMaxX: number,
  uiScale: number
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  ctx.fillStyle = '#88d37f';
  ctx.fillRect(0, groundY, width, CAMERA_GROUND_BOTTOM_PADDING);

  ctx.strokeStyle = '#ffffff';
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
    ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = isMajor ? Math.max(1.8, 2 * uiScale) : Math.max(1, 1.2 * uiScale);
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, groundY + (isMajor ? 16 * uiScale : 10 * uiScale));
    ctx.stroke();

    if (isMajor) {
      ctx.font = `700 ${Math.round(12 * uiScale)}px ui-sans-serif`;
      drawOutlinedText(
        ctx,
        `${relativeM} m`,
        x - 12 * uiScale,
        groundY + 32 * uiScale,
        '#0b2238',
        'rgba(245, 252, 255, 0.92)',
        Math.max(1.8, 1.5 * uiScale)
      );
    }
  }

  drawThrowLine(ctx, toScreen, height, throwLineLabel, uiScale);
};

const drawWindVane = (
  ctx: CanvasRenderingContext2D,
  width: number,
  windMs: number,
  localeFormatter: Intl.NumberFormat,
  uiScale: number
): void => {
  const dir = windMs >= 0 ? 1 : -1;
  const x = width - 118 * uiScale;
  const y = Math.max(32, 42 * uiScale);

  ctx.strokeStyle = '#0f4165';
  ctx.lineWidth = Math.max(2, 3 * uiScale);
  ctx.beginPath();
  ctx.moveTo(x, y + 22 * uiScale);
  ctx.lineTo(x, y - 8 * uiScale);
  ctx.stroke();

  ctx.fillStyle = windMs >= 0 ? '#1f9d44' : '#cf3a2f';
  ctx.beginPath();
  if (dir >= 0) {
    ctx.moveTo(x, y - 8 * uiScale);
    ctx.lineTo(x + 26 * uiScale, y - uiScale);
    ctx.lineTo(x, y + 7 * uiScale);
  } else {
    ctx.moveTo(x, y - 8 * uiScale);
    ctx.lineTo(x - 26 * uiScale, y - uiScale);
    ctx.lineTo(x, y + 7 * uiScale);
  }
  ctx.closePath();
  ctx.fill();

  ctx.font = `700 ${Math.round(12 * uiScale)}px ui-sans-serif`;
  const windText = `${windMs >= 0 ? '+' : ''}${localeFormatter.format(windMs)} m/s`;
  drawOutlinedText(
    ctx,
    windText,
    x - 16 * uiScale,
    y + 34 * uiScale,
    '#10314a',
    'rgba(245, 252, 255, 0.95)',
    Math.max(1.8, 1.6 * uiScale)
  );
};

const drawJavelinWorld = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  xM: number,
  yM: number,
  angleRad: number,
  lengthM = JAVELIN_LENGTH_M
): void => {
  const halfLength = lengthM / 2;
  const tail = {
    xM: xM - Math.cos(angleRad) * halfLength,
    yM: yM - Math.sin(angleRad) * halfLength
  };
  const tip = {
    xM: xM + Math.cos(angleRad) * halfLength,
    yM: yM + Math.sin(angleRad) * halfLength
  };
  const tailScreen = toScreen(tail);
  const tipScreen = toScreen(tip);

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tailScreen.x, tailScreen.y);
  ctx.lineTo(tipScreen.x, tipScreen.y);
  ctx.stroke();
};

const drawLandedJavelin = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  xM: number,
  yM: number,
  angleRad: number,
  lengthM: number,
  tipFirst: boolean
): void => {
  if (tipFirst) {
    const stuckAngle = Math.max(angleRad, -Math.PI * 0.35);
    drawJavelinWorld(ctx, toScreen, xM, yM, stuckAngle, lengthM);

    const tip = toScreen({ xM: xM + (Math.cos(stuckAngle) * lengthM) / 2, yM: 0 });
    ctx.save();
    ctx.fillStyle = 'rgba(80, 50, 20, 0.3)';
    ctx.beginPath();
    ctx.ellipse(tip.x, tip.y + 2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const flatAngle = angleRad * 0.3;
  const lyingYM = Math.max(0.05, yM * 0.3);
  drawJavelinWorld(ctx, toScreen, xM, lyingYM, flatAngle, lengthM);

  const center = toScreen({ xM, yM: 0 });
  ctx.save();
  ctx.strokeStyle = 'rgba(80, 50, 20, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(center.x - 8, center.y + 3);
  ctx.lineTo(center.x + 12, center.y + 3);
  ctx.stroke();
  ctx.restore();
};

const drawLandingMarker = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  landingXM: number,
  resultKind: ResultKind,
  distanceLabel: string,
  uiScale: number
): void => {
  const landing = toScreen({ xM: landingXM, yM: 0 });
  const groundY = landing.y;

  ctx.strokeStyle = resultKind === 'valid' ? '#1f9d44' : '#cf3a2f';
  ctx.lineWidth = Math.max(1.8, 2 * uiScale);
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY + 5 * uiScale);
  ctx.lineTo(landing.x, groundY - 36 * uiScale);
  ctx.stroke();

  ctx.fillStyle = resultKind === 'valid' ? '#22c272' : '#e0453a';
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY - 36 * uiScale);
  ctx.lineTo(landing.x + 28 * uiScale, groundY - 30 * uiScale);
  ctx.lineTo(landing.x, groundY - 24 * uiScale);
  ctx.closePath();
  ctx.fill();

  ctx.font = `700 ${Math.round(10 * uiScale)}px ui-sans-serif`;
  ctx.textAlign = 'left';
  drawOutlinedText(
    ctx,
    distanceLabel,
    landing.x + 4 * uiScale,
    groundY - 28 * uiScale,
    '#ffffff',
    'rgba(8, 35, 56, 0.6)',
    Math.max(1.6, 1.4 * uiScale)
  );

  ctx.fillStyle = 'rgba(15, 40, 60, 0.35)';
  ctx.beginPath();
  ctx.arc(landing.x, groundY + 2 * uiScale, 3 * uiScale, 0, Math.PI * 2);
  ctx.fill();
};

const drawTrajectoryIndicator = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  points: TrajectoryPoint[],
  uiScale: number
): void => {
  if (points.length === 0) {
    return;
  }

  const lastIndex = Math.max(1, points.length - 1);
  const dotRadiusPx = Math.max(2, TRAJECTORY_PREVIEW_DOT_RADIUS_PX * uiScale);
  ctx.save();
  ctx.fillStyle = TRAJECTORY_PREVIEW_DOT_COLOR;
  for (let index = 0; index < points.length; index += 1) {
    const t = index / lastIndex;
    const alpha = TRAJECTORY_PREVIEW_BASE_OPACITY + (TRAJECTORY_PREVIEW_END_OPACITY - TRAJECTORY_PREVIEW_BASE_OPACITY) * t;
    const screen = toScreen(points[index]);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, dotRadiusPx, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

type JavelinRenderState =
  | { mode: 'none' }
  | { mode: 'attached'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'flight'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'landed'; xM: number; yM: number; angleRad: number; lengthM: number };

const RUNWAY_FOOT_CONTACT_Y_M = 0.02;
const MIN_POSE_GROUNDING_SHIFT_M = 0.0001;

type PosePoint = {
  xM: number;
  yM: number;
};

const shiftPointDown = (point: PosePoint, offsetYM: number): PosePoint => ({
  xM: point.xM,
  yM: point.yM - offsetYM
});

const groundPoseToRunway = (pose: AthletePoseGeometry): AthletePoseGeometry => {
  const lowestFootYM = Math.min(pose.footFront.yM, pose.footBack.yM);
  const offsetYM = lowestFootYM - RUNWAY_FOOT_CONTACT_Y_M;
  if (offsetYM <= MIN_POSE_GROUNDING_SHIFT_M) {
    return pose;
  }

  return {
    ...pose,
    head: shiftPointDown(pose.head, offsetYM),
    shoulderCenter: shiftPointDown(pose.shoulderCenter, offsetYM),
    pelvis: shiftPointDown(pose.pelvis, offsetYM),
    hipFront: shiftPointDown(pose.hipFront, offsetYM),
    hipBack: shiftPointDown(pose.hipBack, offsetYM),
    kneeFront: shiftPointDown(pose.kneeFront, offsetYM),
    kneeBack: shiftPointDown(pose.kneeBack, offsetYM),
    footFront: shiftPointDown(pose.footFront, offsetYM),
    footBack: shiftPointDown(pose.footBack, offsetYM),
    elbowFront: shiftPointDown(pose.elbowFront, offsetYM),
    elbowBack: shiftPointDown(pose.elbowBack, offsetYM),
    handFront: shiftPointDown(pose.handFront, offsetYM),
    handBack: shiftPointDown(pose.handBack, offsetYM),
    javelinGrip: shiftPointDown(pose.javelinGrip, offsetYM)
  };
};

export const getVisibleJavelinRenderState = (
  state: GameState,
  pose: AthletePoseGeometry
): JavelinRenderState => {
  if (state.phase.tag === 'flight') {
    return {
      mode: 'flight',
      xM: state.phase.javelin.xM,
      yM: state.phase.javelin.yM,
      angleRad: state.phase.javelin.angleRad,
      lengthM: state.phase.javelin.lengthM
    };
  }

  if (state.phase.tag === 'fault') {
    return {
      mode: state.phase.javelinLanded ? 'landed' : 'flight',
      xM: state.phase.javelin.xM,
      yM: state.phase.javelin.yM,
      angleRad: state.phase.javelin.angleRad,
      lengthM: state.phase.javelin.lengthM
    };
  }

  if (
    state.phase.tag === 'idle' ||
    state.phase.tag === 'runup' ||
    state.phase.tag === 'chargeAim' ||
    state.phase.tag === 'throwAnim'
  ) {
    return {
      mode: 'attached',
      xM: pose.javelinGrip.xM + Math.cos(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_M,
      yM: pose.javelinGrip.yM + Math.sin(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_Y_M,
      angleRad: pose.javelinAngleRad,
      lengthM: JAVELIN_LENGTH_M
    };
  }

  if (state.phase.tag === 'result') {
    return {
      mode: 'landed',
      xM: state.phase.landingXM,
      yM: Math.max(0.08, state.phase.landingYM),
      angleRad: state.phase.landingAngleRad,
      lengthM: JAVELIN_LENGTH_M
    };
  }

  return { mode: 'none' };
};

const getPoseForState = (state: GameState): AthletePoseGeometry => {
  const pose = (() => {
    switch (state.phase.tag) {
      case 'runup':
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          state.phase.speedNorm,
          state.aimAngleDeg,
          state.phase.runupDistanceM
        );
      case 'chargeAim': {
        const runToAimBlend01 =
          state.phase.speedNorm > 0.01
            ? getRunToAimBlend01(state.phase.chargeStartedAtMs, state.nowMs, RUN_TO_DRAWBACK_BLEND_MS)
            : 1;
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          state.phase.speedNorm,
          state.phase.angleDeg,
          state.phase.runupDistanceM,
          {
            runBlendFromAnimT: state.phase.runEntryAnimT,
            runToAimBlend01
          }
        );
      }
      case 'throwAnim':
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          state.phase.speedNorm,
          state.phase.angleDeg,
          state.phase.athleteXM
        );
      case 'flight':
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          state.phase.launchedFrom.speedNorm,
          state.phase.launchedFrom.angleDeg,
          state.phase.athleteXM
        );
      case 'result':
        return computeAthletePoseGeometry(
          { animTag: 'followThrough', animT: 1 },
          0.72,
          24,
          state.phase.athleteXM
        );
      case 'fault':
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          0.14,
          state.aimAngleDeg,
          state.phase.athleteXM
        );
      case 'idle':
        return computeAthletePoseGeometry(
          { animTag: 'idle', animT: 0 },
          0,
          state.aimAngleDeg,
          RUNUP_START_X_M
        );
    }
  })();

  return groundPoseToRunway(pose);
};

export const getPlayerAngleAnchorScreen = (
  state: GameState,
  width: number,
  height: number
): { x: number; y: number } => {
  const camera = createWorldToScreenRaw(state, width, height);
  const pose = getPoseForState(state);
  return camera.toScreen(pose.shoulderCenter);
};

const shouldDrawFrontArmOverHead = (state: GameState): boolean => {
  switch (state.phase.tag) {
    case 'chargeAim':
    case 'flight':
    case 'fault':
      return false;
    case 'throwAnim':
      return sampleThrowSubphase(state.phase.animProgress).stage !== 'windup';
    case 'idle':
    case 'runup':
    case 'result':
    default:
      return true;
  }
};

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
  dtMs: number,
  numberFormat: Intl.NumberFormat,
  throwLineLabel: string,
  releaseFlashLabels: ReleaseFlashLabels,
  session: RenderSession
): void => {
  const overlayUiScale = getOverlayUiScale(width);
  const camera = createWorldToScreen(state, width, height, dtMs, session.camera);
  const { toScreen, worldMinX, worldMaxX } = camera;

  drawBackground(ctx, width, height);
  drawClouds(ctx, width, height, worldMinX);
  drawTrackAndField(
    ctx,
    width,
    height,
    toScreen,
    throwLineLabel,
    worldMinX,
    worldMaxX,
    overlayUiScale
  );
  drawWindVane(ctx, width, state.windMs, numberFormat, overlayUiScale);

  const pose = getPoseForState(state);
  const javelin = getVisibleJavelinRenderState(state, pose);
  const headScreen = drawAthlete(ctx, toScreen, pose, shouldDrawFrontArmOverHead(state));

  if (javelin.mode === 'landed') {
    const tipFirst = state.phase.tag === 'result' ? state.phase.tipFirst === true : false;
    drawLandedJavelin(
      ctx,
      toScreen,
      javelin.xM,
      javelin.yM,
      javelin.angleRad,
      javelin.lengthM,
      tipFirst
    );
  } else if (javelin.mode !== 'none') {
    drawJavelinWorld(ctx, toScreen, javelin.xM, javelin.yM, javelin.angleRad, javelin.lengthM);
  }

  if (state.phase.tag === 'chargeAim') {
    const trajectoryPreview = computeTrajectoryPreview({
      originXM: pose.javelinGrip.xM + Math.cos(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_M,
      originYM: pose.javelinGrip.yM + Math.sin(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_Y_M,
      angleDeg: state.phase.angleDeg,
      speedNorm: state.phase.speedNorm,
      forceNorm: state.phase.forceNormPreview
    });
    drawTrajectoryIndicator(ctx, toScreen, trajectoryPreview.points, overlayUiScale);
  }

  if (state.phase.tag === 'result') {
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
      state.phase.landingXM,
      state.phase.resultKind,
      `${numberFormat.format(state.phase.distanceM)}m`,
      overlayUiScale
    );
    ctx.restore();
  } else {
    session.resultMarker.lastRoundId = -1;
  }

  const releaseFeedback =
    state.phase.tag === 'throwAnim'
      ? {
          label: state.phase.lineCrossedAtRelease
            ? releaseFlashLabels.foulLine
            : releaseFlashLabels[state.phase.releaseQuality],
          shownAtMs: state.phase.releaseFlashAtMs
        }
      : state.phase.tag === 'flight'
        ? {
            label: state.phase.launchedFrom.lineCrossedAtRelease
              ? releaseFlashLabels.foulLine
              : releaseFlashLabels[state.phase.launchedFrom.releaseQuality],
            shownAtMs: state.phase.javelin.releasedAtMs
          }
        : null;

  if (releaseFeedback !== null) {
    const feedbackAgeMs = Math.max(0, state.nowMs - releaseFeedback.shownAtMs);
    const holdMs = 220;
    const fadeMs = 620;
    const totalMs = holdMs + fadeMs;
    if (feedbackAgeMs < totalMs) {
      const fadeT = feedbackAgeMs <= holdMs ? 0 : (feedbackAgeMs - holdMs) / fadeMs;
      const alpha = 1 - Math.min(1, fadeT);
      const scale = 1 + (1 - alpha) * 0.12;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${Math.round(28 * scale * overlayUiScale)}px ui-sans-serif`;
      ctx.textAlign = 'center';
      const y = 74 + (overlayUiScale - 1) * 10 - (1 - alpha) * 8 * overlayUiScale;
      ctx.strokeStyle = 'rgba(240, 250, 255, 0.92)';
      ctx.lineWidth = Math.max(2, 2 * overlayUiScale);
      ctx.strokeText(releaseFeedback.label, width / 2, y);
      ctx.fillStyle = '#0b2238';
      ctx.fillText(releaseFeedback.label, width / 2, y);
      ctx.restore();
    }
  }

  drawWorldTimingMeter(ctx, state, headScreen, overlayUiScale);

  if (state.phase.tag === 'runup') {
    const meterPhase = getRunupMeterPhase01(state);
    if (meterPhase !== null) {
      const distToTarget = Math.abs(meterPhase - RHYTHM_TARGET_PHASE01);
      const wrappedDist = Math.min(distToTarget, 1 - distToTarget);
      if (wrappedDist < 0.02) {
        playBeatTick(state.nowMs, wrappedDist < 0.01);
      }
    }
  }
};
