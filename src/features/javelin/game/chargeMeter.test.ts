import { describe, expect, it } from 'vitest';
import {
  applyForceQualityBonus,
  computeForcePreview,
  getTimingQuality
} from './chargeMeter';

describe('charge meter helpers', () => {
  it('peaks around midpoint of cycle', () => {
    expect(computeForcePreview(0.5)).toBeGreaterThan(computeForcePreview(0.1));
    expect(computeForcePreview(0.5)).toBeGreaterThan(computeForcePreview(0.9));
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
});
