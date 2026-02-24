import { describe, expect, it } from 'vitest';
import {
  angleEfficiency,
  COMPETITION_RULES,
  computeCompetitionDistanceM,
  computeThrowDistance,
  evaluateThrowLegality,
  isLandingInSector,
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
    expect(strongThrow).toBeLessThanOrEqual(110);
    expect(strongThrow).toBeGreaterThan(weakThrow);
  });

  it('measures distance from throw line baseline', () => {
    expect(computeCompetitionDistanceM(50, 18.2)).toBe(31.8);
    expect(computeCompetitionDistanceM(16, 18.2)).toBe(0);
  });

  it('checks sector legality with lateral offset', () => {
    expect(isLandingInSector(60, 4.2, 18.2)).toBe(true);
    expect(isLandingInSector(60, 20, 18.2)).toBe(false);
  });

  it('returns foul reasons based on rule order', () => {
    expect(
      evaluateThrowLegality({
        lineCrossedAtRelease: true,
        landingTipXM: 80,
        landingTipZM: 0,
        tipFirst: true
      }).resultKind
    ).toBe('foul_line');

    expect(
      evaluateThrowLegality({
        lineCrossedAtRelease: false,
        landingTipXM: 60,
        landingTipZM: 30,
        tipFirst: true
      }).resultKind
    ).toBe('foul_sector');

    expect(
      evaluateThrowLegality({
        lineCrossedAtRelease: false,
        landingTipXM: 60,
        landingTipZM: 0,
        tipFirst: false
      }).resultKind
    ).toBe('foul_tip_first');
  });

  it('allows line cross when foulOnLineCross is false', () => {
    const result = evaluateThrowLegality({
      lineCrossedAtRelease: true,
      landingTipXM: 80,
      landingTipZM: 0,
      tipFirst: true,
      rules: { ...COMPETITION_RULES, foulOnLineCross: false }
    });

    expect(result.valid).toBe(true);
    expect(result.resultKind).toBe('valid');
  });

  it('allows flat landing when requireTipFirst is false', () => {
    const result = evaluateThrowLegality({
      lineCrossedAtRelease: false,
      landingTipXM: 70,
      landingTipZM: 0,
      tipFirst: false,
      rules: { ...COMPETITION_RULES, requireTipFirst: false }
    });

    expect(result.valid).toBe(true);
    expect(result.resultKind).toBe('valid');
  });
});
