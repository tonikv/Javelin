import { describe, expect, it } from 'vitest';
import { buildFlagPolyline, getWindIndicatorLayout } from './renderWind';

describe('wind indicator layout and flag geometry', () => {
  it('anchors wind mast in top-right on mobile widths', () => {
    const layout = getWindIndicatorLayout(320, 1.2);
    expect(layout.isMobile).toBe(true);
    expect(layout.mastX).toBeGreaterThan(280);
    expect(layout.mastX).toBeLessThan(320);
    expect(layout.mastTopY).toBeLessThan(24);
  });

  it('keeps desktop anchor consistently near right edge', () => {
    const desktopA = getWindIndicatorLayout(1024, 1);
    const desktopB = getWindIndicatorLayout(1366, 1);
    expect(desktopA.isMobile).toBe(false);
    expect(desktopB.isMobile).toBe(false);
    expect(1024 - desktopA.mastX).toBeGreaterThanOrEqual(20);
    expect(1024 - desktopA.mastX).toBeLessThanOrEqual(32);
    expect(1366 - desktopB.mastX).toBeGreaterThanOrEqual(20);
    expect(1366 - desktopB.mastX).toBeLessThanOrEqual(32);
  });

  it('builds finite segmented cloth points and follows wind direction', () => {
    const positive = buildFlagPolyline({
      mastX: 250,
      flagAnchorY: 34,
      windMs: 2.1,
      nowMs: 1200,
      uiScale: 1
    });
    const negative = buildFlagPolyline({
      mastX: 250,
      flagAnchorY: 34,
      windMs: -2.1,
      nowMs: 1200,
      uiScale: 1
    });

    expect(positive.length).toBe(7);
    expect(negative.length).toBe(7);
    for (const point of [...positive, ...negative]) {
      expect(Number.isFinite(point.x)).toBe(true);
      expect(Number.isFinite(point.y)).toBe(true);
    }

    const positiveTip = positive[positive.length - 1];
    const negativeTip = negative[negative.length - 1];
    expect(positiveTip.x).toBeGreaterThan(250);
    expect(negativeTip.x).toBeLessThan(250);
  });

  it('hangs near mast when wind is calm and extends with stronger wind', () => {
    const calm = buildFlagPolyline({
      mastX: 250,
      flagAnchorY: 34,
      windMs: 0,
      nowMs: 1200,
      uiScale: 1
    });
    const strong = buildFlagPolyline({
      mastX: 250,
      flagAnchorY: 34,
      windMs: 2.2,
      nowMs: 1200,
      uiScale: 1
    });

    const calmTip = calm[calm.length - 1];
    const strongTip = strong[strong.length - 1];
    expect(Math.abs(calmTip.x - 250)).toBeLessThanOrEqual(2.5);
    expect(calmTip.y).toBeGreaterThan(34);
    expect(strongTip.x - 250).toBeGreaterThan(12);
  });
});
