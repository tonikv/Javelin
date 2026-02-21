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
  FIELD_MAX_DISTANCE_M
} from './constants';
import { clamp } from './math';
import type { GamePhase, GameState } from './types';

export type WorldToScreenInput = {
  xM: number;
  yM: number;
};

export type WorldToScreen = (input: WorldToScreenInput) => { x: number; y: number };

export const RUNWAY_OFFSET_X = 60;

type PhaseCameraConfig = {
  viewWidthM: number;
  aheadRatio: number;
  yScale: number;
};

const PHASE_CAMERA_CONFIG: Record<GamePhase['tag'], PhaseCameraConfig> = {
  idle: {
    viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RUNUP_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  runup: {
    viewWidthM: CAMERA_RUNUP_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RUNUP_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  chargeAim: {
    viewWidthM: CAMERA_THROW_VIEW_WIDTH_M,
    aheadRatio: CAMERA_THROW_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  throwAnim: {
    viewWidthM: CAMERA_THROW_VIEW_WIDTH_M,
    aheadRatio: CAMERA_THROW_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_THROW
  },
  flight: {
    viewWidthM: CAMERA_FLIGHT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_FLIGHT_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_FLIGHT
  },
  result: {
    viewWidthM: CAMERA_RESULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RESULT_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RESULT
  },
  fault: {
    viewWidthM: CAMERA_THROW_VIEW_WIDTH_M,
    aheadRatio: CAMERA_THROW_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_THROW
  }
};

export const getCameraTargetX = (state: GameState): number => {
  switch (state.phase.tag) {
    case 'runup':
    case 'chargeAim':
      return state.phase.runupDistanceM;
    case 'throwAnim':
      return state.phase.athleteXM;
    case 'flight':
      return state.phase.javelin.xM;
    case 'result':
      return state.phase.landingXM;
    case 'fault':
      return state.phase.athleteXM;
    case 'idle':
    default:
      return 5;
  }
};

export const getViewWidthM = (state: GameState): number =>
  PHASE_CAMERA_CONFIG[state.phase.tag].viewWidthM;

export const getCameraAheadRatio = (state: GameState): number =>
  PHASE_CAMERA_CONFIG[state.phase.tag].aheadRatio;

export const getVerticalScale = (state: GameState): number =>
  PHASE_CAMERA_CONFIG[state.phase.tag].yScale;

export const createWorldToScreen = (
  state: GameState,
  width: number,
  height: number
): { toScreen: WorldToScreen; worldMinX: number; worldMaxX: number } => {
  const viewWidthM = getViewWidthM(state);
  const targetX = getCameraTargetX(state);
  const ahead = getCameraAheadRatio(state);
  const worldMinLimit = -viewWidthM * ahead;
  const worldMinX = clamp(
    targetX - viewWidthM * ahead,
    worldMinLimit,
    FIELD_MAX_DISTANCE_M - viewWidthM
  );
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
