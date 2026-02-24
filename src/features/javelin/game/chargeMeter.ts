import type { MeterWindow, TimingQuality } from './types';
import { clamp } from './math';

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
