/**
 * Athlete pose sampling and javelin-related rendering helpers.
 * Includes world-space projectile visuals and landing markers.
 */
import {
  computeAthletePoseGeometry,
  getRunToAimBlend01,
  sampleThrowSubphase,
  type AthletePoseGeometry
} from '../athletePose';
import { createWorldToScreenRaw, type WorldToScreen } from '../camera';
import {
  CANVAS_FONT_STACK,
  JAVELIN_GRIP_OFFSET_M,
  JAVELIN_GRIP_OFFSET_Y_M,
  JAVELIN_LENGTH_M
} from '../constants';
import type { RenderPalette } from '../renderTheme';
import { GAMEPLAY_TUNING } from '../tuning';
import { type TrajectoryPoint } from '../trajectory';
import type { GameState, ResultKind } from '../types';

const {
  runupStartXM: RUNUP_START_X_M
} = GAMEPLAY_TUNING.movement;
const { runToDrawbackBlendMs: RUN_TO_DRAWBACK_BLEND_MS } = GAMEPLAY_TUNING.throwPhase;
const {
  baseOpacity: TRAJECTORY_PREVIEW_BASE_OPACITY,
  dotColor: TRAJECTORY_PREVIEW_DOT_COLOR,
  dotRadiusPx: TRAJECTORY_PREVIEW_DOT_RADIUS_PX,
  endOpacity: TRAJECTORY_PREVIEW_END_OPACITY
} = GAMEPLAY_TUNING.trajectoryIndicator;

type PosePoint = {
  xM: number;
  yM: number;
};

export type JavelinRenderState =
  | { mode: 'none' }
  | { mode: 'attached'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'flight'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'landed'; xM: number; yM: number; angleRad: number; lengthM: number };

const RUNWAY_FOOT_CONTACT_Y_M = 0.02;
const MIN_POSE_GROUNDING_SHIFT_M = 0.0001;

const shiftPointDown = (point: PosePoint, offsetYM: number): PosePoint => ({
  xM: point.xM,
  yM: point.yM - offsetYM
});

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

export const drawJavelinWorld = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  xM: number,
  yM: number,
  angleRad: number,
  lengthM = JAVELIN_LENGTH_M,
  palette?: RenderPalette
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

  ctx.strokeStyle = palette?.scene.javelinStroke ?? '#111111';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tailScreen.x, tailScreen.y);
  ctx.lineTo(tipScreen.x, tipScreen.y);
  ctx.stroke();
};

export const drawLandedJavelin = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  xM: number,
  yM: number,
  angleRad: number,
  lengthM: number,
  tipFirst: boolean,
  landingTipXM?: number,
  palette?: RenderPalette
): void => {
  const centerFromTip = (renderAngleRad: number): number =>
    landingTipXM !== undefined ? landingTipXM - (Math.cos(renderAngleRad) * lengthM) / 2 : xM;

  if (tipFirst) {
    const stuckAngle = Math.max(angleRad, -Math.PI * 0.35);
    const centerXM = centerFromTip(stuckAngle);
    drawJavelinWorld(ctx, toScreen, centerXM, yM, stuckAngle, lengthM, palette);

    const tip = toScreen({ xM: centerXM + (Math.cos(stuckAngle) * lengthM) / 2, yM: 0 });
    ctx.save();
    ctx.fillStyle = palette?.scene.javelinSoilMark ?? 'rgba(80, 50, 20, 0.3)';
    ctx.beginPath();
    ctx.ellipse(tip.x, tip.y + 2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const flatAngle = angleRad * 0.3;
  const lyingYM = Math.max(0.05, yM * 0.3);
  const centerXM = centerFromTip(flatAngle);
  drawJavelinWorld(ctx, toScreen, centerXM, lyingYM, flatAngle, lengthM, palette);

  const center = toScreen({ xM: centerXM, yM: 0 });
  ctx.save();
  ctx.strokeStyle = palette?.scene.javelinGroundTrace ?? 'rgba(80, 50, 20, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(center.x - 8, center.y + 3);
  ctx.lineTo(center.x + 12, center.y + 3);
  ctx.stroke();
  ctx.restore();
};

export const drawLandingMarker = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  landingXM: number,
  resultKind: ResultKind,
  distanceLabel: string,
  uiScale: number,
  palette: RenderPalette
): void => {
  const landing = toScreen({ xM: landingXM, yM: 0 });
  const groundY = landing.y;

  ctx.strokeStyle =
    resultKind === 'valid' ? palette.scene.landingValidStroke : palette.scene.landingFoulStroke;
  ctx.lineWidth = Math.max(1.8, 2 * uiScale);
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY + 5 * uiScale);
  ctx.lineTo(landing.x, groundY - 36 * uiScale);
  ctx.stroke();

  ctx.fillStyle =
    resultKind === 'valid' ? palette.scene.landingValidFlag : palette.scene.landingFoulFlag;
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY - 36 * uiScale);
  ctx.lineTo(landing.x + 28 * uiScale, groundY - 30 * uiScale);
  ctx.lineTo(landing.x, groundY - 24 * uiScale);
  ctx.closePath();
  ctx.fill();

  ctx.font = `700 ${Math.round(10 * uiScale)}px ${CANVAS_FONT_STACK}`;
  ctx.textAlign = 'left';
  drawOutlinedText(
    ctx,
    distanceLabel,
    landing.x + 4 * uiScale,
    groundY - 28 * uiScale,
    palette.scene.landingTextFill,
    palette.scene.landingTextOutline,
    Math.max(1.6, 1.4 * uiScale)
  );

  ctx.fillStyle = palette.scene.landingDot;
  ctx.beginPath();
  ctx.arc(landing.x, groundY + 2 * uiScale, 3 * uiScale, 0, Math.PI * 2);
  ctx.fill();
};

export const drawTrajectoryIndicator = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  points: TrajectoryPoint[],
  uiScale: number,
  reducedMotion: boolean
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
    const alpha = reducedMotion
      ? TRAJECTORY_PREVIEW_BASE_OPACITY
      : TRAJECTORY_PREVIEW_BASE_OPACITY +
        (TRAJECTORY_PREVIEW_END_OPACITY - TRAJECTORY_PREVIEW_BASE_OPACITY) * t;
    const screen = toScreen(points[index]);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, dotRadiusPx, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

export const getPoseForState = (state: GameState): AthletePoseGeometry => {
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
      default: {
        const _exhaustive: never = state.phase;
        return _exhaustive;
      }
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

export const shouldDrawFrontArmOverHead = (state: GameState): boolean => {
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
      return true;
    default: {
      const _exhaustive: never = state.phase;
      return _exhaustive;
    }
  }
};
