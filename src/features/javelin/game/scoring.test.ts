import { describe, expect, it } from 'vitest';
import {
  angleEfficiency,
  computeThrowDistance,
  releaseEfficiency,
  windEfficiency
} from './scoring';

describe('scoring helpers', () => {
  it('peaks around 36 degree angle', () => {
    expect(angleEfficiency(36)).toBeGreaterThan(angleEfficiency(26));
    expect(angleEfficiency(36)).toBeGreaterThan(angleEfficiency(46));
  });

  it('reward release timing close to 0.77', () => {
    expect(releaseEfficiency(0.77)).toBeGreaterThan(releaseEfficiency(0.45));
    expect(releaseEfficiency(0.77)).toBeGreaterThan(releaseEfficiency(0.95));
  });

  it('wind efficiency stays clamped', () => {
    expect(windEfficiency(-10)).toBe(0.88);
    expect(windEfficiency(10)).toBe(1.12);
  });

  it('produces believable throw ranges', () => {
    const weakThrow = computeThrowDistance({
      speedNorm: 0.35,
      angleDeg: 28,
      releaseTiming: 0.4,
      windMs: -2
    });
    const strongThrow = computeThrowDistance({
      speedNorm: 0.92,
      angleDeg: 36,
      releaseTiming: 0.77,
      windMs: 1.4
    });
    expect(weakThrow).toBeGreaterThanOrEqual(12);
    expect(strongThrow).toBeLessThanOrEqual(98);
    expect(strongThrow).toBeGreaterThan(weakThrow);
  });
});
