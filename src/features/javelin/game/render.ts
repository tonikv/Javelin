import {
  computeAthletePoseGeometry,
  getRunToAimBlend01,
  sampleThrowSubphase,
  type AthletePoseGeometry
} from './athletePose';
import {
  CAMERA_DEFAULT_VIEW_WIDTH_M,
  CAMERA_FLIGHT_TARGET_AHEAD,
  CAMERA_FLIGHT_VIEW_WIDTH_M,
  CAMERA_GROUND_BOTTOM_PADDING,
  CAMERA_RESULT_TARGET_AHEAD,
  CAMERA_RESULT_VIEW_WIDTH_M,
  CAMERA_RUNUP_TARGET_AHEAD,
  CAMERA_RUNUP_VIEW_WIDTH_M,
  CAMERA_THROW_TARGET_AHEAD,
  CAMERA_THROW_VIEW_WIDTH_M,
  CAMERA_Y_SCALE_FLIGHT,
  CAMERA_Y_SCALE_RESULT,
  CAMERA_Y_SCALE_RUNUP,
  CAMERA_Y_SCALE_THROW,
  FIELD_MAX_DISTANCE_M,
  JAVELIN_LENGTH_M,
  RUN_TO_AIM_BLEND_MS,
  THROW_LINE_X_M,
  WORLD_METER_CURSOR_RADIUS_PX,
  WORLD_METER_LINE_WIDTH_PX,
  WORLD_METER_OFFSET_Y_PX,
  WORLD_METER_RADIUS_PX
} from './constants';
import {
  getRhythmHotZones,
  getRunupFeedback,
  getRunupMeterPhase01,
  getSpeedPercent
} from './selectors';
import type { GameState } from './types';

type WorldToScreenInput = {
  xM: number;
  yM: number;
};

type WorldToScreen = (input: WorldToScreenInput) => { x: number; y: number };

type HeadAnchor = {
  x: number;
  y: number;
};

const RUNWAY_OFFSET_X = 60;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

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

const getCameraTargetX = (state: GameState): number => {
  if (state.phase.tag === 'runup') {
    return state.phase.runupDistanceM;
  }
  if (state.phase.tag === 'chargeAim' || state.phase.tag === 'throwAnim') {
    return state.phase.athleteXM;
  }
  if (state.phase.tag === 'flight') {
    return state.phase.javelin.xM;
  }
  if (state.phase.tag === 'result') {
    return state.phase.distanceM + THROW_LINE_X_M;
  }
  return 5;
};

const getViewWidthM = (state: GameState): number => {
  if (state.phase.tag === 'runup') {
    return CAMERA_RUNUP_VIEW_WIDTH_M;
  }
  if (state.phase.tag === 'chargeAim' || state.phase.tag === 'throwAnim') {
    return CAMERA_THROW_VIEW_WIDTH_M;
  }
  if (state.phase.tag === 'flight') {
    return CAMERA_FLIGHT_VIEW_WIDTH_M;
  }
  if (state.phase.tag === 'result') {
    return CAMERA_RESULT_VIEW_WIDTH_M;
  }
  return CAMERA_DEFAULT_VIEW_WIDTH_M;
};

const getCameraAheadRatio = (state: GameState): number => {
  if (state.phase.tag === 'runup') {
    return CAMERA_RUNUP_TARGET_AHEAD;
  }
  if (state.phase.tag === 'chargeAim' || state.phase.tag === 'throwAnim') {
    return CAMERA_THROW_TARGET_AHEAD;
  }
  if (state.phase.tag === 'flight') {
    return CAMERA_FLIGHT_TARGET_AHEAD;
  }
  if (state.phase.tag === 'result') {
    return CAMERA_RESULT_TARGET_AHEAD;
  }
  return CAMERA_RUNUP_TARGET_AHEAD;
};

const getVerticalScale = (state: GameState): number => {
  if (state.phase.tag === 'runup' || state.phase.tag === 'chargeAim') {
    return CAMERA_Y_SCALE_RUNUP;
  }
  if (state.phase.tag === 'throwAnim') {
    return CAMERA_Y_SCALE_THROW;
  }
  if (state.phase.tag === 'flight') {
    return CAMERA_Y_SCALE_FLIGHT;
  }
  if (state.phase.tag === 'result') {
    return CAMERA_Y_SCALE_RESULT;
  }
  return CAMERA_Y_SCALE_RUNUP;
};

const createWorldToScreen = (
  state: GameState,
  width: number,
  height: number
): { toScreen: WorldToScreen; worldMinX: number; worldMaxX: number } => {
  const viewWidthM = getViewWidthM(state);
  const targetX = getCameraTargetX(state);
  const ahead = getCameraAheadRatio(state);
  const worldMinX = clamp(targetX - viewWidthM * ahead, 0, FIELD_MAX_DISTANCE_M - viewWidthM);
  const worldMaxX = worldMinX + viewWidthM;
  const playableWidth = width - RUNWAY_OFFSET_X - 24;
  const yScale = getVerticalScale(state);

  const toScreen: WorldToScreen = ({ xM, yM }) => {
    const x = RUNWAY_OFFSET_X + ((xM - worldMinX) / viewWidthM) * playableWidth;
    const y = height - CAMERA_GROUND_BOTTOM_PADDING - yM * yScale;
    return { x, y };
  };

  return { toScreen, worldMinX, worldMaxX };
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

const drawAthlete = (
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

  ctx.fillStyle = '#0b2c49';
  ctx.beginPath();
  ctx.arc(p.head.x - 1.4, p.head.y - 0.7, 1.2, 0, Math.PI * 2);
  ctx.fill();

  if (drawFrontArmOverHead) {
    drawFrontArm(ctx, p);
  }

  return p.head;
};

const phaseToSemicircleAngle = (phase01: number): number => Math.PI - wrap01(phase01) * Math.PI;

const drawSemicircleArc = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  start01: number,
  end01: number,
  color: string,
  lineWidth: number
): void => {
  const drawSegment = (start: number, end: number): void => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      radius,
      phaseToSemicircleAngle(start),
      phaseToSemicircleAngle(end),
      true
    );
    ctx.stroke();
  };

  const start = wrap01(start01);
  const end = wrap01(end01);
  if (start <= end) {
    drawSegment(start, end);
    return;
  }
  drawSegment(start, 1);
  drawSegment(0, end);
};

export const getHeadMeterScreenAnchor = (headScreen: HeadAnchor): HeadAnchor => ({
  x: headScreen.x,
  y: headScreen.y - WORLD_METER_OFFSET_Y_PX
});

const drawWorldRhythmMeter = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  headScreen: HeadAnchor
): void => {
  const meterPhase = getRunupMeterPhase01(state);
  if (meterPhase === null) {
    return;
  }

  const anchor = getHeadMeterScreenAnchor(headScreen);
  if (!Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) {
    return;
  }

  const zones = getRhythmHotZones();
  const feedback = getRunupFeedback(state);
  const speedPercent = getSpeedPercent(state);

  ctx.save();
  ctx.globalAlpha = 0.96;

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    WORLD_METER_RADIUS_PX,
    0,
    1,
    'rgba(10, 46, 77, 0.34)',
    WORLD_METER_LINE_WIDTH_PX
  );

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    WORLD_METER_RADIUS_PX,
    zones.good.start,
    zones.good.end,
    'rgba(30, 142, 247, 0.82)',
    WORLD_METER_LINE_WIDTH_PX
  );

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    WORLD_METER_RADIUS_PX,
    zones.perfect.start,
    zones.perfect.end,
    'rgba(18, 196, 119, 0.98)',
    WORLD_METER_LINE_WIDTH_PX + 0.8
  );

  const cursorAngle = phaseToSemicircleAngle(meterPhase);
  const cursorX = anchor.x + Math.cos(cursorAngle) * WORLD_METER_RADIUS_PX;
  const cursorY = anchor.y + Math.sin(cursorAngle) * WORLD_METER_RADIUS_PX;

  const cursorFill =
    feedback === 'perfect' ? '#22c272' : feedback === 'good' ? '#329cf5' : '#f6d255';

  ctx.fillStyle = cursorFill;
  ctx.strokeStyle = '#0f3b61';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cursorX, cursorY, WORLD_METER_CURSOR_RADIUS_PX, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(6, 32, 57, 0.9)';
  ctx.font = '700 11px ui-sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${speedPercent}%`, anchor.x, anchor.y + 16);

  ctx.restore();
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

  if (
    state.phase.tag === 'runup' ||
    state.phase.tag === 'chargeAim' ||
    state.phase.tag === 'throwAnim'
  ) {
    return {
      mode: 'attached',
      xM: pose.javelinGrip.xM + Math.cos(pose.javelinAngleRad) * 0.44,
      yM: pose.javelinGrip.yM + Math.sin(pose.javelinAngleRad) * 0.08,
      angleRad: pose.javelinAngleRad,
      lengthM: JAVELIN_LENGTH_M
    };
  }

  if (state.phase.tag === 'result') {
    return {
      mode: 'landed',
      xM: state.phase.distanceM + THROW_LINE_X_M,
      yM: 0.22,
      angleRad: state.phase.tipFirst ? (-34 * Math.PI) / 180 : (-8 * Math.PI) / 180,
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
        ? getRunToAimBlend01(state.phase.chargeStartedAtMs, state.nowMs, RUN_TO_AIM_BLEND_MS)
        : 1;
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      state.phase.speedNorm,
      state.phase.angleDeg,
      state.phase.athleteXM,
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
  return computeAthletePoseGeometry({ animTag: 'idle', animT: 0 }, 0, state.aimAngleDeg, 2.8);
};

export const getPlayerAngleAnchorScreen = (
  state: GameState,
  width: number,
  height: number
): { x: number; y: number } => {
  const camera = createWorldToScreen(state, width, height);
  const pose = getPoseForState(state);
  return camera.toScreen(pose.shoulderCenter);
};

const shouldDrawFrontArmOverHead = (state: GameState): boolean => {
  if (state.phase.tag === 'chargeAim') {
    return false;
  }
  if (state.phase.tag === 'throwAnim') {
    return sampleThrowSubphase(state.phase.animProgress).stage !== 'windup';
  }
  if (state.phase.tag === 'flight') {
    return false;
  }
  return true;
};

const shouldDrawAttachedJavelinBehindAthlete = (state: GameState): boolean =>
  state.phase.tag === 'chargeAim' ||
  (state.phase.tag === 'throwAnim' && sampleThrowSubphase(state.phase.animProgress).stage === 'windup');

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
  numberFormat: Intl.NumberFormat,
  throwLineLabel: string
): void => {
  const camera = createWorldToScreen(state, width, height);
  const { toScreen, worldMinX, worldMaxX } = camera;

  drawBackground(ctx, width, height);
  drawTrackAndField(ctx, width, height, toScreen, throwLineLabel, worldMinX, worldMaxX);
  drawWindVane(ctx, width, state.windMs, numberFormat);

  const pose = getPoseForState(state);
  const javelin = getVisibleJavelinRenderState(state, pose);
  const attachedBehind = javelin.mode === 'attached' && shouldDrawAttachedJavelinBehindAthlete(state);

  if (attachedBehind && javelin.mode === 'attached') {
    drawJavelinWorld(ctx, toScreen, javelin.xM, javelin.yM, javelin.angleRad, javelin.lengthM);
  }

  const headScreen = drawAthlete(ctx, toScreen, pose, shouldDrawFrontArmOverHead(state));

  if (javelin.mode !== 'none' && !attachedBehind) {
    drawJavelinWorld(ctx, toScreen, javelin.xM, javelin.yM, javelin.angleRad, javelin.lengthM);
  }

  if (state.phase.tag === 'runup') {
    drawWorldRhythmMeter(ctx, state, headScreen);
  }
};
