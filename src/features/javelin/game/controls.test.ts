import { describe, expect, it } from 'vitest';
import { pointerClientYToAngleDeg } from './controls';

describe('pointerClientYToAngleDeg', () => {
  it('maps top to 90, middle to 0, and bottom to -90', () => {
    const top = pointerClientYToAngleDeg(100, 100, 400);
    const middle = pointerClientYToAngleDeg(300, 100, 400);
    const bottom = pointerClientYToAngleDeg(500, 100, 400);

    expect(top).toBe(90);
    expect(middle).toBe(0);
    expect(bottom).toBe(-90);
  });

  it('clamps out-of-bounds positions', () => {
    expect(pointerClientYToAngleDeg(0, 100, 400)).toBe(90);
    expect(pointerClientYToAngleDeg(700, 100, 400)).toBe(-90);
  });
});
