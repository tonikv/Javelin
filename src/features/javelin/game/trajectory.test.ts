import { describe, expect, it } from 'vitest';
import { computeTrajectoryPreview } from './trajectory';

describe('computeTrajectoryPreview', () => {
  it('generates points with strictly increasing x', () => {
    const preview = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.5,
      angleDeg: 36,
      speedNorm: 0.7,
      forceNorm: 0.7,
      numPoints: 12,
      timeStepS: 0.12
    });

    expect(preview.points.length).toBeGreaterThan(1);
    for (let index = 1; index < preview.points.length; index += 1) {
      expect(preview.points[index].xM).toBeGreaterThan(preview.points[index - 1].xM);
    }
  });

  it('stops before emitting points below ground', () => {
    const maxPoints = 40;
    const preview = computeTrajectoryPreview({
      originXM: 2,
      originYM: 0.2,
      angleDeg: 15,
      speedNorm: 0,
      forceNorm: 0,
      numPoints: maxPoints,
      timeStepS: 0.1
    });

    expect(preview.points.length).toBeLessThan(maxPoints);
    expect(preview.points.every((point) => point.yM >= 0)).toBe(true);
  });

  it('produces higher first-point altitude for higher release angle', () => {
    const low = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.3,
      angleDeg: 20,
      speedNorm: 0.65,
      forceNorm: 0.8,
      numPoints: 6,
      timeStepS: 0.12
    });
    const high = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.3,
      angleDeg: 50,
      speedNorm: 0.65,
      forceNorm: 0.8,
      numPoints: 6,
      timeStepS: 0.12
    });

    expect(low.points.length).toBeGreaterThan(0);
    expect(high.points.length).toBeGreaterThan(0);
    expect(high.points[0].yM).toBeGreaterThan(low.points[0].yM);
  });

  it('returns a valid preview with zero force', () => {
    const preview = computeTrajectoryPreview({
      originXM: 4,
      originYM: 1.2,
      angleDeg: 36,
      speedNorm: 0,
      forceNorm: 0,
      numPoints: 10,
      timeStepS: 0.1
    });

    expect(preview.points.length).toBeGreaterThan(0);
    for (const point of preview.points) {
      expect(Number.isFinite(point.xM)).toBe(true);
      expect(Number.isFinite(point.yM)).toBe(true);
    }
  });

  it('never returns more points than requested', () => {
    const maxPoints = 7;
    const preview = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.4,
      angleDeg: 40,
      speedNorm: 0.9,
      forceNorm: 0.9,
      numPoints: maxPoints,
      timeStepS: 0.12
    });

    expect(preview.points.length).toBeLessThanOrEqual(maxPoints);
  });
});
