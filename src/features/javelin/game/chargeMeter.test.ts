import { describe, expect, it } from 'vitest';
import {
  computeChargeMeterSample,
  applyForceQualityBonus,
  computeForcePreview,
  computeReleaseForceNorm,
  getTimingQuality
} from './chargeMeter';
import { getDifficultyGameplayTuning } from './tuning';

describe('charge meter helpers', () => {
  it('fills force steadily toward end of charge', () => {
    expect(computeForcePreview(0.85)).toBeGreaterThan(computeForcePreview(0.25));
    expect(computeForcePreview(1.1)).toBeCloseTo(1, 5);
  });

  it('detects perfect and good windows', () => {
    const perfect = { start: 0.45, end: 0.55 };
    const good = { start: 0.35, end: 0.65 };
    expect(getTimingQuality(0.5, perfect, good)).toBe('perfect');
    expect(getTimingQuality(0.6, perfect, good)).toBe('good');
    expect(getTimingQuality(0.8, perfect, good)).toBe('miss');
  });

  it('releases near hotspot produce stronger force', () => {
    const previewNear = computeForcePreview(0.5);
    const previewFar = computeForcePreview(0.15);
    const near = applyForceQualityBonus(previewNear, 'perfect');
    const far = applyForceQualityBonus(previewFar, 'miss');
    expect(near).toBeGreaterThan(far);
  });

  it('samples release as a center sweep with centered windows', () => {
    const tuning = getDifficultyGameplayTuning('elite');
    const halfSweepMs = Math.round((tuning.releaseMeter?.sweepDurationMsMax ?? 520) * 0.5);
    const sample = computeChargeMeterSample(halfSweepMs, tuning, 0);

    expect(sample.mode).toBe('centerSweep');
    expect(sample.phase01).toBeCloseTo(0.5, 3);
    expect(sample.quality).toBe('perfect');
    expect(sample.perfectWindow.start).toBeCloseTo(0.46, 2);
    expect(sample.perfectWindow.end).toBeCloseTo(0.54, 2);
    expect(computeReleaseForceNorm(sample.phase01, sample.quality, sample.mode)).toBeGreaterThan(
      0.99
    );
  });

  it('uses slower rookie/pro sweep speeds while widening rookie/pro windows', () => {
    const rookie = getDifficultyGameplayTuning('rookie');
    const pro = getDifficultyGameplayTuning('pro');
    const elite = getDifficultyGameplayTuning('elite');

    expect(rookie.releaseMeter?.sweepDurationMsMax ?? 0).toBeGreaterThan(
      elite.releaseMeter?.sweepDurationMsMax ?? 0
    );
    expect(rookie.releaseMeter?.sweepDurationMsMin ?? 0).toBeGreaterThan(
      elite.releaseMeter?.sweepDurationMsMin ?? 0
    );
    expect(pro.releaseMeter?.sweepDurationMsMax ?? 0).toBeGreaterThan(
      elite.releaseMeter?.sweepDurationMsMax ?? 0
    );
    expect(pro.releaseMeter?.sweepDurationMsMin ?? 0).toBeGreaterThan(
      elite.releaseMeter?.sweepDurationMsMin ?? 0
    );
    expect(rookie.releaseMeter?.perfectWidth ?? 0).toBeGreaterThan(
      pro.releaseMeter?.perfectWidth ?? 0
    );
    expect(pro.releaseMeter?.perfectWidth ?? 0).toBeGreaterThan(
      elite.releaseMeter?.perfectWidth ?? 0
    );
    expect(rookie.releaseMeter?.goodWidth ?? 0).toBeGreaterThan(pro.releaseMeter?.goodWidth ?? 0);
    expect(pro.releaseMeter?.goodWidth ?? 0).toBeGreaterThan(elite.releaseMeter?.goodWidth ?? 0);
  });
});
