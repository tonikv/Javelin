import { ARM_RELEASE_WINDOW } from './constants';
import type { GameState } from './types';

export const getSpeedPercent = (state: GameState): number => {
  if (state.phase.tag === 'runup' || state.phase.tag === 'throwPrep') {
    return Math.round(state.phase.speedNorm * 100);
  }
  if (state.phase.tag === 'flight') {
    return Math.round(state.phase.launchedFrom.speedNorm * 100);
  }
  return 0;
};

export const getAngleDeg = (state: GameState): number => {
  if (state.phase.tag === 'throwPrep') {
    return state.phase.angleDeg;
  }
  if (state.phase.tag === 'flight') {
    return state.phase.launchedFrom.angleDeg;
  }
  return 36;
};

export const getReleaseProgress = (state: GameState): number | null =>
  state.phase.tag === 'throwPrep' ? state.phase.armPhase : null;

export const isReleaseWindowOpen = (state: GameState): boolean => {
  if (state.phase.tag !== 'throwPrep') {
    return false;
  }
  return (
    state.phase.armPhase >= ARM_RELEASE_WINDOW.start &&
    state.phase.armPhase <= ARM_RELEASE_WINDOW.end
  );
};
