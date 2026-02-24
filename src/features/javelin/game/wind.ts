import { WIND_MAX_MS, WIND_MIN_MS } from './constants';
import { clamp, lerp } from './math';
import {
  WIND_CYCLE_AMPLITUDE_MS,
  WIND_CYCLE_DURATION_MS,
  WIND_CYCLE_HARMONIC_AMPLITUDE_MS,
  WIND_CYCLE_HARMONIC_MULTIPLIER,
  WIND_MICRO_GUST_AMPLITUDE_MS,
  WIND_MICRO_GUST_PERIOD_MS,
  WIND_RANDOM_AMPLITUDE_MS,
  WIND_RANDOM_BLEND,
  WIND_RANDOM_KEYFRAME_MS,
  WIND_SMOOTHING_MS
} from './tuning';

const TAU = Math.PI * 2;

const signedNoise1D = (index: number): number => {
  const seed = Math.sin(index * 127.1 + 311.7) * 43758.5453123;
  const fract = seed - Math.floor(seed);
  return fract * 2 - 1;
};

const smoothstep01 = (value: number): number => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const clampWind = (windMs: number): number => clamp(windMs, WIND_MIN_MS, WIND_MAX_MS);

export const sampleWindTargetMs = (nowMs: number): number => {
  const safeNowMs = Math.max(0, nowMs);
  const cyclePhaseRad = (safeNowMs / Math.max(1, WIND_CYCLE_DURATION_MS)) * TAU;
  const primaryCycleMs = Math.sin(cyclePhaseRad) * WIND_CYCLE_AMPLITUDE_MS;
  const harmonicCycleMs =
    Math.sin(cyclePhaseRad * Math.max(1, WIND_CYCLE_HARMONIC_MULTIPLIER) + 0.9) *
    WIND_CYCLE_HARMONIC_AMPLITUDE_MS;
  const periodicCycleMs = primaryCycleMs + harmonicCycleMs;

  const keyframePos = safeNowMs / Math.max(1, WIND_RANDOM_KEYFRAME_MS);
  const keyframeIndex = Math.floor(keyframePos);
  const mixT = smoothstep01(keyframePos - keyframeIndex);
  const keyA = signedNoise1D(keyframeIndex);
  const keyB = signedNoise1D(keyframeIndex + 1);
  const randomTrendMs = lerp(keyA, keyB, mixT) * WIND_RANDOM_AMPLITUDE_MS * clamp(WIND_RANDOM_BLEND, 0, 1);

  const microGustRad = (safeNowMs / Math.max(1, WIND_MICRO_GUST_PERIOD_MS)) * TAU + 1.2;
  const microGustMs = Math.sin(microGustRad) * WIND_MICRO_GUST_AMPLITUDE_MS;

  return clampWind(periodicCycleMs + randomTrendMs + microGustMs);
};

export const advanceWindMs = (currentWindMs: number, dtMs: number, nowMs: number): number => {
  const dtS = clamp(dtMs / 1000, 0, 0.25);
  const safeCurrent = Number.isFinite(currentWindMs) ? currentWindMs : 0;
  const targetWindMs = sampleWindTargetMs(nowMs);
  if (dtS <= 0) {
    return clampWind(safeCurrent);
  }

  const smoothingTauS = Math.max(0.05, WIND_SMOOTHING_MS / 1000);
  const alpha = dtS / (smoothingTauS + dtS);
  const nextWindMs = safeCurrent + (targetWindMs - safeCurrent) * alpha;
  return clampWind(nextWindMs);
};
