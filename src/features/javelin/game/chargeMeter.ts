import { clamp, lerp, pingPong01 } from './math';
import type { DifficultyGameplayTuning } from './tuning';
import type { ChargeMeterMode, MeterWindow, TimingQuality } from './types';

export type ChargeMeterSample = {
  mode: ChargeMeterMode;
  phase01: number;
  perfectWindow: MeterWindow;
  goodWindow: MeterWindow;
  quality: TimingQuality;
  previewForceNorm: number;
  completedCycles: number;
};

/**
 * Test whether a cyclic meter phase is inside a window.
 * Supports wrap-around windows where start > end.
 */
export const isInWindow = (phase01: number, window: MeterWindow): boolean => {
  const phase = clamp(phase01, 0, 1);
  if (window.start <= window.end) {
    return phase >= window.start && phase <= window.end;
  }
  return phase >= window.start || phase <= window.end;
};

/**
 * Classify release timing as perfect, good, or miss based on configured windows.
 */
export const getTimingQuality = (
  phase01: number,
  perfectWindow: MeterWindow,
  goodWindow: MeterWindow
): TimingQuality => {
  if (isInWindow(phase01, perfectWindow)) {
    return 'perfect';
  }
  if (isInWindow(phase01, goodWindow)) {
    return 'good';
  }
  return 'miss';
};

export const centeredWindow = (center01: number, width: number): MeterWindow => {
  const halfWidth = clamp(width, 0, 1) * 0.5;
  return {
    start: clamp(center01 - halfWidth, 0, 1),
    end: clamp(center01 + halfWidth, 0, 1)
  };
};

export const computeForcePreview = (phase01: number): number =>
  clamp(phase01, 0.05, 1);

export const applyForceQualityBonus = (
  previewForceNorm: number,
  quality: TimingQuality
): number => {
  if (quality === 'perfect') {
    return clamp(previewForceNorm + 0.1, 0.1, 1);
  }
  if (quality === 'good') {
    return clamp(previewForceNorm + 0.04, 0.1, 1);
  }
  return clamp(previewForceNorm - 0.1, 0.1, 1);
};

const computeCenterSweepReleaseAccuracy01 = (phase01: number): number =>
  1 - clamp(Math.abs(phase01 - 0.5) / 0.5, 0, 1);

const computeCenterSweepReleasePreviewForceNorm = (phase01: number): number =>
  lerp(0.68, 1, computeCenterSweepReleaseAccuracy01(phase01));

export const computeReleaseForceNorm = (
  phase01: number,
  quality: TimingQuality,
  mode: ChargeMeterMode
): number => {
  if (mode === 'centerSweep') {
    const baseForceNorm = computeCenterSweepReleasePreviewForceNorm(phase01);
    if (quality === 'perfect') {
      return clamp(baseForceNorm + 0.05, 0.1, 1);
    }
    if (quality === 'good') {
      return clamp(baseForceNorm, 0.1, 1);
    }
    return clamp(Math.max(0.55, baseForceNorm - 0.08), 0.1, 1);
  }

  return applyForceQualityBonus(computeForcePreview(phase01), quality);
};

export const computeChargeMeterSample = (
  elapsedMs: number,
  tuning: DifficultyGameplayTuning,
  entrySpeedNorm: number
): ChargeMeterSample => {
  if (tuning.releaseMeter) {
    const speedNorm = clamp(entrySpeedNorm, 0, 1);
    const sweepDurationMs = lerp(
      tuning.releaseMeter.sweepDurationMsMax,
      tuning.releaseMeter.sweepDurationMsMin,
      speedNorm
    );
    const rawSweep = Math.max(0, elapsedMs) / sweepDurationMs;
    const phase01 = pingPong01(rawSweep);
    const perfectWindow = centeredWindow(
      0.5,
      lerp(
        tuning.releaseMeter.perfectWidth,
        tuning.releaseMeter.highSpeedPerfectWidth,
        speedNorm
      )
    );
    const goodWindow = centeredWindow(
      0.5,
      lerp(
        tuning.releaseMeter.goodWidth,
        tuning.releaseMeter.highSpeedGoodWidth,
        speedNorm
      )
    );
    const quality = getTimingQuality(phase01, perfectWindow, goodWindow);

    return {
      mode: 'centerSweep',
      phase01,
      perfectWindow,
      goodWindow,
      quality,
      previewForceNorm: computeCenterSweepReleasePreviewForceNorm(phase01),
      completedCycles: Math.floor(rawSweep)
    };
  }

  const rawFill01 = Math.max(0, elapsedMs) / tuning.throwPhase.chargeFillDurationMs;
  const phase01 = clamp(rawFill01 % 1, 0, 1);
  const perfectWindow = tuning.throwPhase.chargePerfectWindow;
  const goodWindow = tuning.throwPhase.chargeGoodWindow;
  const quality = getTimingQuality(phase01, perfectWindow, goodWindow);

  return {
    mode: 'loop',
    phase01,
    perfectWindow,
    goodWindow,
    quality,
    previewForceNorm: computeForcePreview(phase01),
    completedCycles: Math.floor(rawFill01)
  };
};
