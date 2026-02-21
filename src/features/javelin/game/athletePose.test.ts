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
    const handTravel = Math.hypot(
      delivery.handFront.xM - loaded.handFront.xM,
      delivery.handFront.yM - loaded.handFront.yM
    );

    expect(Number.isFinite(handTravel)).toBe(true);
    expect(handTravel).toBeGreaterThan(0.2);
    expect(Math.abs(delivery.javelinAngleRad - loaded.javelinAngleRad)).toBeLessThan(0.08);
    expect(delivery.javelinAngleRad).toBeCloseTo((36 * Math.PI) / 180, 1);
  });

  it('front arm tracks javelin angle during aim', () => {
    const pose = computeAthletePoseGeometry({ animTag: 'aim', animT: 0.5 }, 0.5, 45, 10);
    const dx = pose.handFront.xM - pose.shoulderCenter.xM;
    const dy = pose.handFront.yM - pose.shoulderCenter.yM;
    const handAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

    expect(handAngleDeg).toBeGreaterThan(20);
    expect(handAngleDeg).toBeLessThan(70);
  });
});
