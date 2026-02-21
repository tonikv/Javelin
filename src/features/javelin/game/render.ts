import { computeAthletePoseGeometry, type AthletePoseGeometry } from './athletePose';
import { FIELD_MAX_DISTANCE_M, JAVELIN_LENGTH_M, THROW_LINE_X_M } from './constants';
import type { GameState } from './types';

type WorldToScreenInput = {
  xM: number;
  yM: number;
  width: number;
  height: number;
};

const RUNWAY_OFFSET_X = 72;
const GROUND_BOTTOM_PADDING = 70;
const Y_SCALE = 14;

const toScreen = ({ xM, yM, width, height }: WorldToScreenInput): { x: number; y: number } => {
  const playableWidth = width - RUNWAY_OFFSET_X - 28;
  const x = RUNWAY_OFFSET_X + (xM / FIELD_MAX_DISTANCE_M) * playableWidth;
  const y = height - GROUND_BOTTOM_PADDING - yM * Y_SCALE;
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

const drawThrowLine = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  label: string
): void => {
  const groundY = height - GROUND_BOTTOM_PADDING;
  const line = toScreen({ xM: THROW_LINE_X_M, yM: 0, width, height });
  ctx.strokeStyle = '#ff5d4e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(line.x, groundY - 26);
  ctx.lineTo(line.x, groundY + 20);
  ctx.stroke();

  ctx.fillStyle = '#a3211a';
  ctx.font = '700 12px ui-sans-serif';
  ctx.fillText(label, line.x - 34, groundY - 30);
};

const drawTrackAndField = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  throwLineLabel: string
): void => {
  const groundY = height - GROUND_BOTTOM_PADDING;
  ctx.fillStyle = '#88d37f';
  ctx.fillRect(0, groundY, width, GROUND_BOTTOM_PADDING);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(RUNWAY_OFFSET_X, groundY);
  ctx.lineTo(width - 20, groundY);
  ctx.stroke();

  for (let m = 10; m <= FIELD_MAX_DISTANCE_M; m += 10) {
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

  drawThrowLine(ctx, width, height, throwLineLabel);
};

const drawWindVane = (
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
  width: number,
  height: number,
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
  const tailScreen = toScreen({ ...tail, width, height });
  const tipScreen = toScreen({ ...tip, width, height });

  ctx.strokeStyle = '#ffe69a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tailScreen.x, tailScreen.y);
  ctx.lineTo(tipScreen.x, tipScreen.y);
  ctx.stroke();

  ctx.fillStyle = '#d4472d';
  ctx.beginPath();
  ctx.arc(tipScreen.x, tipScreen.y, 2.2, 0, Math.PI * 2);
  ctx.fill();
};

const drawAthlete = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pose: AthletePoseGeometry
): void => {
  const shadowCenter = toScreen({ xM: pose.pelvis.xM + 0.06, yM: 0.02, width, height });
  ctx.fillStyle = 'rgba(5, 28, 42, 0.18)';
  ctx.beginPath();
  ctx.ellipse(shadowCenter.x, shadowCenter.y + 3, 17, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const p = {
    head: toScreen({ ...pose.head, width, height }),
    shoulderCenter: toScreen({ ...pose.shoulderCenter, width, height }),
    pelvis: toScreen({ ...pose.pelvis, width, height }),
    hipFront: toScreen({ ...pose.hipFront, width, height }),
    hipBack: toScreen({ ...pose.hipBack, width, height }),
    kneeFront: toScreen({ ...pose.kneeFront, width, height }),
    kneeBack: toScreen({ ...pose.kneeBack, width, height }),
    footFront: toScreen({ ...pose.footFront, width, height }),
    footBack: toScreen({ ...pose.footBack, width, height }),
    elbowFront: toScreen({ ...pose.elbowFront, width, height }),
    elbowBack: toScreen({ ...pose.elbowBack, width, height }),
    handFront: toScreen({ ...pose.handFront, width, height }),
    handBack: toScreen({ ...pose.handBack, width, height })
  };

  drawLimb(ctx, p.hipBack, p.kneeBack, 6, '#0a2f4d');
  drawLimb(ctx, p.kneeBack, p.footBack, 5, '#124468');
  drawLimb(ctx, p.hipFront, p.kneeFront, 6, '#0d3658');
  drawLimb(ctx, p.kneeFront, p.footFront, 5, '#1b5b83');

  drawLimb(ctx, p.pelvis, p.shoulderCenter, 9, '#0f3d62');

  drawLimb(ctx, p.shoulderCenter, p.elbowBack, 5, '#124468');
  drawLimb(ctx, p.elbowBack, p.handBack, 4, '#1b5b83');
  drawLimb(ctx, p.shoulderCenter, p.elbowFront, 5, '#0a2f4d');
  drawLimb(ctx, p.elbowFront, p.handFront, 4, '#103c5e');

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
      xM: state.phase.distanceM,
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
      22,
      state.phase.runupDistanceM
    );
  }
  if (state.phase.tag === 'chargeAim') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      state.phase.speedNorm,
      state.phase.angleDeg,
      state.phase.athleteXM
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
    return computeAthletePoseGeometry({ animTag: 'followThrough', animT: 1 }, 0.72, 24, state.phase.athleteXM);
  }
  return computeAthletePoseGeometry({ animTag: 'idle', animT: 0 }, 0, 20, 2.8);
};

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
  numberFormat: Intl.NumberFormat,
  throwLineLabel: string
): void => {
  drawBackground(ctx, width, height);
  drawTrackAndField(ctx, width, height, throwLineLabel);
  drawWindVane(ctx, width, state.windMs, numberFormat);

  const pose = getPoseForState(state);
  drawAthlete(ctx, width, height, pose);

  const javelin = getVisibleJavelinRenderState(state, pose);
  if (javelin.mode !== 'none') {
    drawJavelinWorld(
      ctx,
      width,
      height,
      javelin.xM,
      javelin.yM,
      javelin.angleRad,
      javelin.lengthM
    );
  }
};
