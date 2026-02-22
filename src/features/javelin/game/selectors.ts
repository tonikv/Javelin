import { RHYTHM_TARGET_PHASE01, THROW_LINE_X_M } from './constants';
import { getRunupMeterPhase01AtTime } from './rhythm';
import { BEAT_INTERVAL_MS, GOOD_WINDOW_MS, PERFECT_WINDOW_MS } from './tuning';
import type { GameState, TimingQuality } from './types';

export const getSpeedPercent = (state: GameState): number => {
  if (
    state.phase.tag === 'runup' ||
    state.phase.tag === 'chargeAim' ||
    state.phase.tag === 'throwAnim'
  ) {
    return Math.round(state.phase.speedNorm * 100);
  }
  if (state.phase.tag === 'flight') {
    return Math.round(state.phase.launchedFrom.speedNorm * 100);
  }
  if (state.phase.tag === 'result') {
    return Math.round(state.phase.launchedFrom.speedNorm * 100);
  }
  return 0;
};

export const getAngleDeg = (state: GameState): number => {
  switch (state.phase.tag) {
    case 'chargeAim':
    case 'throwAnim':
      return state.phase.angleDeg;
    case 'flight':
    case 'result':
      return state.phase.launchedFrom.angleDeg;
    case 'idle':
    case 'runup':
    case 'fault':
    default:
      return state.aimAngleDeg;
  }
};

export const getRunupMeterPhase01 = (state: GameState): number | null => {
  if (state.phase.tag !== 'runup') {
    return null;
  }
  return getRunupMeterPhase01AtTime(state.phase.startedAtMs, state.nowMs);
};

export const getRunupFeedback = (state: GameState): TimingQuality | null =>
  state.phase.tag === 'runup' ? state.phase.rhythm.lastQuality : null;

export const getForcePreviewPercent = (state: GameState): number | null => {
  if (state.phase.tag === 'chargeAim') {
    return Math.round(state.phase.forceNormPreview * 100);
  }
  if (state.phase.tag === 'throwAnim') {
    return Math.round(state.phase.forceNorm * 100);
  }
  if (state.phase.tag === 'flight') {
    return Math.round(state.phase.launchedFrom.forceNorm * 100);
  }
  return null;
};

export const getRhythmHotZones = (): {
  perfect: { start: number; end: number };
  good: { start: number; end: number };
} => {
  const perfectRadius = PERFECT_WINDOW_MS / BEAT_INTERVAL_MS;
  const goodRadius = GOOD_WINDOW_MS / BEAT_INTERVAL_MS;
  return {
    perfect: {
      start: RHYTHM_TARGET_PHASE01 - perfectRadius,
      end: RHYTHM_TARGET_PHASE01 + perfectRadius
    },
    good: {
      start: RHYTHM_TARGET_PHASE01 - goodRadius,
      end: RHYTHM_TARGET_PHASE01 + goodRadius
    }
  };
};

export const getRunupDistanceM = (state: GameState): number | null => {
  switch (state.phase.tag) {
    case 'runup':
    case 'chargeAim':
      return state.phase.runupDistanceM;
    case 'throwAnim':
    case 'flight':
    case 'result':
      return state.phase.athleteXM;
    case 'idle':
    case 'fault':
    default:
      return null;
  }
};

export const getThrowLineRemainingM = (state: GameState): number | null => {
  const distance = getRunupDistanceM(state);
  if (distance === null) {
    return null;
  }
  return Math.max(0, THROW_LINE_X_M - distance);
};
