import {
  computeAthletePoseGeometry,
  getRunToAimBlend01,
  sampleThrowSubphase,
  type AthletePoseGeometry
} from './athletePose';
import {
  createWorldToScreen,
  createWorldToScreenRaw,
  RUNWAY_OFFSET_X,
  type WorldToScreen
} from './camera';
import {
  CAMERA_GROUND_BOTTOM_PADDING,
  FIELD_MAX_DISTANCE_M,
  JAVELIN_GRIP_OFFSET_M,
  JAVELIN_GRIP_OFFSET_Y_M,
  JAVELIN_LENGTH_M,
  THROW_LINE_X_M
} from './constants';
import { drawAthlete } from './renderAthlete';
import { drawWorldTimingMeter } from './renderMeter';
import { RUNUP_START_X_M, RUN_TO_DRAWBACK_BLEND_MS } from './tuning';
import type { GameState, ResultKind } from './types';

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
      { offsetXM: 0, widthPx: 120, heightPx: 18, opacity: 0.18 },
      { offsetXM: 35, widthPx: 90, heightPx: 14, opacity: 0.14 },
      { offsetXM: 72, widthPx: 140, heightPx: 20, opacity: 0.16 },
      { offsetXM: 120, widthPx: 100, heightPx: 16, opacity: 0.12 }
    ]
  },
  {
    yFraction: 0.28,
    parallaxFactor: 0.15,
    clouds: [
      { offsetXM: 10, widthPx: 80, heightPx: 28, opacity: 0.22 },
      { offsetXM: 50, widthPx: 110, heightPx: 34, opacity: 0.2 },
      { offsetXM: 95, widthPx: 70, heightPx: 24, opacity: 0.18 }
    ]
  },
  {
    yFraction: 0.18,
    parallaxFactor: 0.3,
    clouds: [
      { offsetXM: 20, widthPx: 100, heightPx: 38, opacity: 0.25 },
      { offsetXM: 80, widthPx: 130, heightPx: 42, opacity: 0.22 }
    ]
  }
];

let lastResultRoundId = -1;
let resultShownAtMs = 0;

const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#e9f7ff');
  sky.addColorStop(0.58, '#d0efff');
  sky.addColorStop(1, '#f5ffe4');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(0, 44, 83, 0.06)';
  for (let i = 0; i < width; i += 28) {
    ctx.fillRect(i, 0, 2, height);
  }
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
      ctx.globalAlpha = cloud.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      const rx = cloud.widthPx / 2;
      const ry = cloud.heightPx / 2;
      ctx.ellipse(x + rx, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 0.6, y + ry * 0.15, rx * 0.7, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 1.4, y - ry * 0.1, rx * 0.65, ry * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
};

const drawThrowLine = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  height: number,
  label: string
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  const line = toScreen({ xM: THROW_LINE_X_M, yM: 0 });
  ctx.strokeStyle = '#ff5d4e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(line.x, groundY - 24);
  ctx.lineTo(line.x, groundY + 19);
  ctx.stroke();

  ctx.fillStyle = '#a3211a';
  ctx.font = '700 12px ui-sans-serif';
  ctx.fillText(label, line.x - 28, groundY - 27);
};

const drawTrackAndField = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  toScreen: WorldToScreen,
  throwLineLabel: string,
  worldMinX: number,
  worldMaxX: number
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  ctx.fillStyle = '#88d37f';
  ctx.fillRect(0, groundY, width, CAMERA_GROUND_BOTTOM_PADDING);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
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
    ctx.lineWidth = isMajor ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, groundY + (isMajor ? 16 : 10));
    ctx.stroke();

    if (isMajor) {
      ctx.fillStyle = '#0b2238';
      ctx.font = 'bold 12px ui-sans-serif';
      ctx.fillText(`${relativeM} m`, x - 12, groundY + 32);
    }
  }

  drawThrowLine(ctx, toScreen, height, throwLineLabel);
};

const drawWindVane = (
  ctx: CanvasRenderingContext2D,
  width: number,
  windMs: number,
  localeFormatter: Intl.NumberFormat
): void => {
  const dir = windMs >= 0 ? 1 : -1;
  const x = width - 118;
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
  distanceLabel: string
): void => {
  const landing = toScreen({ xM: landingXM, yM: 0 });
  const groundY = landing.y;

  ctx.strokeStyle = resultKind === 'valid' ? '#1f9d44' : '#cf3a2f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY + 5);
  ctx.lineTo(landing.x, groundY - 36);
  ctx.stroke();

  ctx.fillStyle = resultKind === 'valid' ? '#22c272' : '#e0453a';
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY - 36);
  ctx.lineTo(landing.x + 28, groundY - 30);
  ctx.lineTo(landing.x, groundY - 24);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 10px ui-sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(distanceLabel, landing.x + 4, groundY - 28);

  ctx.fillStyle = 'rgba(15, 40, 60, 0.35)';
  ctx.beginPath();
  ctx.arc(landing.x, groundY + 2, 3, 0, Math.PI * 2);
  ctx.fill();
};

type JavelinRenderState =
  | { mode: 'none' }
  | { mode: 'attached'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'flight'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'landed'; xM: number; yM: number; angleRad: number; lengthM: number };

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
  if (state.phase.tag === 'runup') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      state.phase.speedNorm,
      state.aimAngleDeg,
      state.phase.runupDistanceM
    );
  }
  if (state.phase.tag === 'chargeAim') {
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
  if (state.phase.tag === 'throwAnim') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      state.phase.speedNorm,
      state.phase.angleDeg,
      state.phase.athleteXM
    );
  }
  if (state.phase.tag === 'flight') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      state.phase.launchedFrom.speedNorm,
      state.phase.launchedFrom.angleDeg,
      state.phase.athleteXM
    );
  }
  if (state.phase.tag === 'result') {
    return computeAthletePoseGeometry(
      { animTag: 'followThrough', animT: 1 },
      0.72,
      24,
      state.phase.athleteXM
    );
  }
  if (state.phase.tag === 'fault') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      0.14,
      state.aimAngleDeg,
      state.phase.athleteXM
    );
  }
  return computeAthletePoseGeometry(
    { animTag: 'idle', animT: 0 },
    0,
    state.aimAngleDeg,
    RUNUP_START_X_M
  );
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
  throwLineLabel: string
): void => {
  const camera = createWorldToScreen(state, width, height, dtMs);
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
    worldMaxX
  );
  drawWindVane(ctx, width, state.windMs, numberFormat);

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

  if (state.phase.tag === 'result') {
    if (state.roundId !== lastResultRoundId) {
      lastResultRoundId = state.roundId;
      resultShownAtMs = state.nowMs;
    }
    const fadeAgeMs = Math.max(0, state.nowMs - resultShownAtMs);
    const alpha = Math.min(1, fadeAgeMs / 400);
    ctx.save();
    ctx.globalAlpha = alpha;
    drawLandingMarker(
      ctx,
      toScreen,
      state.phase.landingXM,
      state.phase.resultKind,
      `${numberFormat.format(state.phase.distanceM)}m`
    );
    ctx.restore();
  } else {
    lastResultRoundId = -1;
  }

  drawWorldTimingMeter(ctx, state, headScreen);
};
