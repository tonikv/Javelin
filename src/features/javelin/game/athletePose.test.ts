import { describe, expect, it } from 'vitest';
import {
  computeAthletePoseGeometry,
  getRunToAimBlend01,
  sampleThrowSubphase
} from './athletePose';

describe('athlete pose helpers', () => {
  it('segments throw animation into windup, delivery, and follow stages', () => {
    expect(sampleThrowSubphase(0.1).stage).toBe('windup');
    expect(sampleThrowSubphase(0.5).stage).toBe('delivery');
    expect(sampleThrowSubphase(0.9).stage).toBe('follow');
  });

  it('clamps run-to-aim blend between 0 and 1', () => {
    expect(getRunToAimBlend01(1000, 940, 180)).toBe(0);
    expect(getRunToAimBlend01(1000, 1090, 180)).toBeCloseTo(0.5, 1);
    expect(getRunToAimBlend01(1000, 1400, 180)).toBe(1);
  });

  it('stages throw hand and javelin from loaded to forward delivery', () => {
    const loaded = computeAthletePoseGeometry({ animTag: 'throw', animT: 0.16 }, 0.84, 36, 12.5);
    const delivery = computeAthletePoseGeometry({ animTag: 'throw', animT: 0.76 }, 0.84, 36, 12.5);
    const loadedReach = loaded.handFront.xM - loaded.pelvis.xM;
    const deliveryReach = delivery.handFront.xM - delivery.pelvis.xM;

    expect(Number.isFinite(loadedReach)).toBe(true);
    expect(Number.isFinite(deliveryReach)).toBe(true);
    expect(Math.abs(deliveryReach - loadedReach)).toBeGreaterThan(0.15);
    expect(loaded.javelinAngleRad).toBeGreaterThan(delivery.javelinAngleRad);
  });
});
