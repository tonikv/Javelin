import { describe, expect, it } from 'vitest';
import { pointerFromAnchorToAngleDeg } from './controls';

describe('pointerFromAnchorToAngleDeg', () => {
  it('maps points above/below anchor to expected vertical angles', () => {
    const top = pointerFromAnchorToAngleDeg(300, 100, 300, 300);
    const middle = pointerFromAnchorToAngleDeg(500, 300, 300, 300);
    const bottom = pointerFromAnchorToAngleDeg(300, 500, 300, 300);

    expect(top).toBe(90);
    expect(middle).toBe(0);
    expect(bottom).toBe(-90);
  });

  it('responds strongly when pointer is close to anchor horizontally', () => {
    const nearAnchor = pointerFromAnchorToAngleDeg(302, 250, 300, 300);
    const farAnchor = pointerFromAnchorToAngleDeg(520, 250, 300, 300);

    expect(nearAnchor).toBeGreaterThan(farAnchor);
    expect(nearAnchor).toBeGreaterThan(80);
  });
});
