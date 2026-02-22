import { RHYTHM_TARGET_PHASE01 } from './constants';
import { wrap01 } from './math';
import { BEAT_INTERVAL_MS, GOOD_WINDOW_MS, PERFECT_WINDOW_MS } from './tuning';
import type { TimingQuality } from './types';

export const getCompletedBeatIndex = (startedAtMs: number, atMs: number): number =>
  Math.floor((atMs - startedAtMs) / BEAT_INTERVAL_MS);

export const getNearestBeatIndex = (startedAtMs: number, atMs: number): number =>
  Math.round((atMs - startedAtMs) / BEAT_INTERVAL_MS);

export const getBeatTimeMs = (startedAtMs: number, beatIndex: number): number =>
  startedAtMs + beatIndex * BEAT_INTERVAL_MS;

export const getNearestBeatTimeMs = (startedAtMs: number, atMs: number): number =>
  getBeatTimeMs(startedAtMs, getNearestBeatIndex(startedAtMs, atMs));

export const getNearestBeatDeltaMs = (startedAtMs: number, atMs: number): number =>
  Math.abs(atMs - getNearestBeatTimeMs(startedAtMs, atMs));

export const getTimingQualityFromBeatDelta = (deltaMs: number): TimingQuality => {
  if (deltaMs <= PERFECT_WINDOW_MS) {
    return 'perfect';
  }
  if (deltaMs <= GOOD_WINDOW_MS) {
    return 'good';
  }
  return 'miss';
};

export const getRunupMeterPhase01AtTime = (startedAtMs: number, nowMs: number): number => {
  const rawPhase = wrap01((nowMs - startedAtMs) / BEAT_INTERVAL_MS);
  return wrap01(rawPhase + RHYTHM_TARGET_PHASE01);
};
