import { describe, expect, it } from 'vitest';
import { ANGLE_MAX_DEG, ANGLE_MIN_DEG } from './constants';
import {
  keyboardAngleHoldDelta,
  pointerFromAnchorToAngleDeg,
  smoothPointerAngleDeg
} from './controls';

describe('pointerFromAnchorToAngleDeg', () => {
  it('maps points above/below anchor to expected vertical angles', () => {
    const top = pointerFromAnchorToAngleDeg(300, 100, 300, 300);
    const middle = pointerFromAnchorToAngleDeg(500, 300, 300, 300);
    const bottom = pointerFromAnchorToAngleDeg(300, 500, 300, 300);

    expect(top).toBe(ANGLE_MAX_DEG);
    expect(middle).toBe(ANGLE_MIN_DEG);
    expect(bottom).toBe(ANGLE_MIN_DEG);
  });

  it('responds strongly when pointer is close to anchor horizontally', () => {
    const nearAnchor = pointerFromAnchorToAngleDeg(302, 250, 300, 300);
    const farAnchor = pointerFromAnchorToAngleDeg(520, 250, 300, 300);

    expect(nearAnchor).toBeGreaterThan(farAnchor);
    expect(nearAnchor).toBeCloseTo(ANGLE_MAX_DEG, 4);
  });

  it('returns NaN inside pointer deadzone', () => {
    const deadzoneAngle = pointerFromAnchorToAngleDeg(307, 295, 300, 300);
    expect(Number.isNaN(deadzoneAngle)).toBe(true);
  });
});

describe('keyboardAngleHoldDelta', () => {
  it('accelerates hold delta from start to ramp maximum', () => {
    const start = keyboardAngleHoldDelta('up', 0, 16);
    const mid = keyboardAngleHoldDelta('up', 300, 16);
    const max = keyboardAngleHoldDelta('up', 600, 16);

    expect(start).toBeGreaterThan(0);
    expect(mid).toBeGreaterThan(start);
    expect(max).toBeGreaterThan(mid);
  });

  it('applies direction sign and handles non-positive dt', () => {
    const down = keyboardAngleHoldDelta('down', 600, 16);
    const noDt = keyboardAngleHoldDelta('up', 600, 0);

    expect(down).toBeLessThan(0);
    expect(noDt).toBe(0);
  });
});

describe('smoothPointerAngleDeg', () => {
  it('returns raw angle on first pointer sample', () => {
    expect(smoothPointerAngleDeg(null, 50)).toBe(50);
  });

  it('blends toward raw angle using smoothing factor', () => {
    const smoothed = smoothPointerAngleDeg(20, 40, 0.4);
    expect(smoothed).toBeCloseTo(28, 5);
  });

  it('clamps smoothing factor bounds', () => {
    expect(smoothPointerAngleDeg(20, 40, 0)).toBe(20);
    expect(smoothPointerAngleDeg(20, 40, 1.2)).toBe(40);
  });
});
