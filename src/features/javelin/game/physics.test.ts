import { describe, expect, it } from 'vitest';
import {
  computeLaunchSpeedMs,
  createPhysicalJavelin,
  updatePhysicalJavelin
} from './physics';
import { computeCompetitionDistanceM, evaluateThrowLegality } from './scoring';

const simulateDistanceFromLine = (
  speedNorm: number,
  forceNorm: number,
  angleDeg: number,
  windMs: number,
  athleteXM: number
): { distanceM: number; tipFirst: boolean; inSector: boolean } => {
  const athleteForwardMs = 1.8 + speedNorm * 4.5;
  let javelin = createPhysicalJavelin({
    xM: athleteXM + 0.42,
    yM: 1.6,
    zM: 0,
    launchAngleRad: (angleDeg * Math.PI) / 180,
    launchSpeedMs: computeLaunchSpeedMs(speedNorm, forceNorm),
    athleteForwardMs,
    lateralVelMs: 0.12,
    releasedAtMs: 0
  });

  for (let i = 0; i < 1800; i += 1) {
    const step = updatePhysicalJavelin(javelin, 16, windMs);
    javelin = step.javelin;
    if (step.landed) {
      const landingTipXM = step.landingTipXM ?? javelin.xM;
      const landingTipZM = step.landingTipZM ?? javelin.zM;
      const legality = evaluateThrowLegality({
        lineCrossedAtRelease: athleteXM >= 18.2,
        landingTipXM,
        landingTipZM,
        tipFirst: step.tipFirst === true
      });
      return {
        distanceM: computeCompetitionDistanceM(landingTipXM, 18.2),
        tipFirst: step.tipFirst === true,
        inSector: legality.resultKind !== 'foul_sector'
      };
    }
  }

  return {
    distanceM: 0,
    tipFirst: false,
    inSector: false
  };
};

describe('physical javelin simulation', () => {
  it('eventually lands on the ground', () => {
    let javelin = createPhysicalJavelin({
      xM: 3,
      yM: 1.6,
      zM: 0,
      launchAngleRad: (34 * Math.PI) / 180,
      launchSpeedMs: 26,
      athleteForwardMs: 2,
      lateralVelMs: 0,
      releasedAtMs: 0
    });
    let landed = false;
    for (let i = 0; i < 600; i += 1) {
      const step = updatePhysicalJavelin(javelin, 16, 0);
      javelin = step.javelin;
      landed = step.landed;
      if (landed) {
        break;
      }
    }
    expect(landed).toBe(true);
  });

  it('reaches apex then descends', () => {
    let javelin = createPhysicalJavelin({
      xM: 2.8,
      yM: 1.7,
      zM: 0,
      launchAngleRad: (38 * Math.PI) / 180,
      launchSpeedMs: 24,
      athleteForwardMs: 2,
      lateralVelMs: 0,
      releasedAtMs: 0
    });
    const heights: number[] = [];
    for (let i = 0; i < 120; i += 1) {
      const step = updatePhysicalJavelin(javelin, 16, 0.2);
      javelin = step.javelin;
      heights.push(javelin.yM);
      if (step.landed) {
        break;
      }
    }
    const maxHeight = Math.max(...heights);
    const maxIndex = heights.findIndex((value) => value === maxHeight);
    expect(maxIndex).toBeGreaterThan(3);
    expect(heights[heights.length - 1]).toBeLessThan(maxHeight);
  });

  it('orientation trends downward after apex', () => {
    let javelin = createPhysicalJavelin({
      xM: 2.8,
      yM: 1.7,
      zM: 0,
      launchAngleRad: (36 * Math.PI) / 180,
      launchSpeedMs: 25,
      athleteForwardMs: 2,
      lateralVelMs: 0,
      releasedAtMs: 0
    });
    let postApexAngle: number | null = null;
    let foundDescending = false;

    for (let i = 0; i < 220; i += 1) {
      const step = updatePhysicalJavelin(javelin, 16, -0.4);
      javelin = step.javelin;
      if (!foundDescending && javelin.vyMs < 0) {
        foundDescending = true;
        postApexAngle = javelin.angleRad;
      }
      if (step.landed) {
        break;
      }
    }

    expect(foundDescending).toBe(true);
    expect(postApexAngle).not.toBeNull();
    expect(javelin.angleRad).toBeLessThan(postApexAngle as number);
  });

  it('remains finite under strong wind extremes', () => {
    let javelin = createPhysicalJavelin({
      xM: 2.8,
      yM: 1.8,
      zM: 0,
      launchAngleRad: (30 * Math.PI) / 180,
      launchSpeedMs: 22,
      athleteForwardMs: 2,
      lateralVelMs: 0.4,
      releasedAtMs: 0
    });
    for (let i = 0; i < 200; i += 1) {
      const step = updatePhysicalJavelin(javelin, 16, i % 2 === 0 ? 2.5 : -2.5);
      javelin = step.javelin;
      expect(Number.isFinite(javelin.xM)).toBe(true);
      expect(Number.isFinite(javelin.yM)).toBe(true);
      expect(Number.isFinite(javelin.angleRad)).toBe(true);
      if (step.landed) {
        break;
      }
    }
  });

  it('calibrates early and best-case throw bands', () => {
    const early = simulateDistanceFromLine(0.34, 0.98, 35, 0, 6.4);
    const best = simulateDistanceFromLine(0.99, 1, 35, 1.2, 17.8);

    expect(early.distanceM).toBeGreaterThanOrEqual(28);
    expect(early.distanceM).toBeLessThanOrEqual(42);

    expect(best.distanceM).toBeGreaterThanOrEqual(97);
    expect(best.distanceM).toBeLessThanOrEqual(108);
    expect(best.tipFirst).toBe(true);
    expect(best.inSector).toBe(true);
  });
});
