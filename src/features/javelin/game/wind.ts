import {
  CROSSWIND_MAX_MS,
  CROSSWIND_MIN_MS,
  WIND_MAX_MS,
  WIND_MIN_MS
} from './constants';
import { clamp, lerp } from './math';
import { GAMEPLAY_TUNING } from './tuning';

const {
  crosswindAmplitudeScale: WIND_CROSSWIND_AMPLITUDE_SCALE,
  crosswindPhaseOffsetRad: WIND_CROSSWIND_PHASE_OFFSET_RAD,
  cycleAmplitudeMs: WIND_CYCLE_AMPLITUDE_MS,
  cycleDurationMs: WIND_CYCLE_DURATION_MS,
  cycleHarmonicAmplitudeMs: WIND_CYCLE_HARMONIC_AMPLITUDE_MS,
  cycleHarmonicMultiplier: WIND_CYCLE_HARMONIC_MULTIPLIER,
  microGustAmplitudeMs: WIND_MICRO_GUST_AMPLITUDE_MS,
  microGustPeriodMs: WIND_MICRO_GUST_PERIOD_MS,
  randomAmplitudeMs: WIND_RANDOM_AMPLITUDE_MS,
  randomBlend: WIND_RANDOM_BLEND,
  randomKeyframeMs: WIND_RANDOM_KEYFRAME_MS,
  smoothingMs: WIND_SMOOTHING_MS
} = GAMEPLAY_TUNING.wind;

const TAU = Math.PI * 2;

/**
 * Deterministic pseudo-noise from an integer index.
 * Returns a value in [-1, 1]. Used for repeatable random wind keyframes
 * without requiring a seeded PRNG.
 */
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
const clampCrosswind = (windMs: number): number =>
  clamp(windMs, CROSSWIND_MIN_MS, CROSSWIND_MAX_MS);

type SampleWindTargetInput = {
  nowMs: number;
  cyclePhaseOffsetRad: number;
  amplitudeScale: number;
  clampMin: number;
  clampMax: number;
};

const sampleTargetMs = ({
  nowMs,
  cyclePhaseOffsetRad,
  amplitudeScale,
  clampMin,
  clampMax
}: SampleWindTargetInput): number => {
  const safeNowMs = Math.max(0, nowMs);
  const amplitude = Math.max(0, amplitudeScale);
  const cyclePhaseRad = (safeNowMs / Math.max(1, WIND_CYCLE_DURATION_MS)) * TAU + cyclePhaseOffsetRad;
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

  const microGustRad =
    (safeNowMs / Math.max(1, WIND_MICRO_GUST_PERIOD_MS)) * TAU + 1.2 + cyclePhaseOffsetRad * 0.35;
  const microGustMs = Math.sin(microGustRad) * WIND_MICRO_GUST_AMPLITUDE_MS;

  return clamp((periodicCycleMs + randomTrendMs + microGustMs) * amplitude, clampMin, clampMax);
};

export const sampleWindTargetMs = (nowMs: number): number => {
  return sampleTargetMs({
    nowMs,
    cyclePhaseOffsetRad: 0,
    amplitudeScale: 1,
    clampMin: WIND_MIN_MS,
    clampMax: WIND_MAX_MS
  });
};

export const sampleCrosswindTargetMs = (nowMs: number): number => {
  const target = sampleTargetMs({
    nowMs,
    cyclePhaseOffsetRad: WIND_CROSSWIND_PHASE_OFFSET_RAD,
    amplitudeScale: WIND_CROSSWIND_AMPLITUDE_SCALE,
    clampMin: CROSSWIND_MIN_MS,
    clampMax: CROSSWIND_MAX_MS
  });
  return clampCrosswind(target);
};

/**
 * Advance headwind with deterministic target sampling and exponential smoothing.
 *
 * @param currentWindMs - Current smoothed wind in m/s.
 * @param dtMs - Frame step in milliseconds.
 * @param nowMs - Absolute timeline position in milliseconds.
 * @returns Next wind value in m/s clamped to configured headwind range.
 */
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

export const advanceCrosswindMs = (
  currentWindZMs: number,
  dtMs: number,
  nowMs: number
): number => {
  const dtS = clamp(dtMs / 1000, 0, 0.25);
  const safeCurrent = Number.isFinite(currentWindZMs) ? currentWindZMs : 0;
  const targetWindMs = sampleCrosswindTargetMs(nowMs);
  if (dtS <= 0) {
    return clampCrosswind(safeCurrent);
  }

  const smoothingTauS = Math.max(0.05, WIND_SMOOTHING_MS / 1000);
  const alpha = dtS / (smoothingTauS + dtS);
  const nextWindMs = safeCurrent + (targetWindMs - safeCurrent) * alpha;
  return clampCrosswind(nextWindMs);
};
