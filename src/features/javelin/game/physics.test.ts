import { describe, expect, it } from 'vitest';
import {
  RUNUP_SPEED_MAX_MS,
  RUNUP_SPEED_MIN_MS
} from './constants';
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
  athleteXM: number,
  windZMs = 0
): { distanceM: number; tipFirst: boolean; inSector: boolean; landingZM: number } => {
  const athleteForwardMs =
    (RUNUP_SPEED_MIN_MS + (RUNUP_SPEED_MAX_MS - RUNUP_SPEED_MIN_MS) * speedNorm) * 0.34;
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
    const step = updatePhysicalJavelin(javelin, 16, windMs, windZMs);
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
        inSector: legality.resultKind !== 'foul_sector',
        landingZM: landingTipZM
      };
    }
  }

  return {
    distanceM: 0,
    tipFirst: false,
    inSector: false,
    landingZM: 0
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

  it('calibrates standing and full-speed throw ranges', () => {
    const standing = simulateDistanceFromLine(0, 1, 36, 0, 18);
    const fullHeadwind = simulateDistanceFromLine(1, 1, 36, -2.5, 18);
    const fullTailwind = simulateDistanceFromLine(1, 1, 36, 2.5, 18);

    expect(standing.distanceM).toBeGreaterThanOrEqual(30);
    expect(standing.distanceM).toBeLessThanOrEqual(40);

    expect(fullHeadwind.distanceM).toBeGreaterThanOrEqual(90);
    expect(fullTailwind.distanceM).toBeLessThanOrEqual(105);
    expect(fullHeadwind.distanceM).toBeGreaterThan(fullTailwind.distanceM);

    expect(fullHeadwind.tipFirst).toBe(true);
    expect(fullTailwind.tipFirst).toBe(true);
    expect(fullHeadwind.inSector).toBe(true);
    expect(fullTailwind.inSector).toBe(true);
  });

  it('crosswind produces larger lateral landing offset than calm air', () => {
    const calm = simulateDistanceFromLine(0.85, 0.86, 37, 0, 18, 0);
    const cross = simulateDistanceFromLine(0.85, 0.86, 37, 0, 18, 0.9);

    expect(Math.abs(cross.landingZM)).toBeGreaterThan(Math.abs(calm.landingZM) + 0.5);
  });

  it('damps sideways velocity aggressively under aerodynamic drag', () => {
    let javelin = createPhysicalJavelin({
      xM: 3,
      yM: 1.6,
      zM: 0,
      launchAngleRad: (34 * Math.PI) / 180,
      launchSpeedMs: 26,
      athleteForwardMs: 2,
      lateralVelMs: 1.2,
      releasedAtMs: 0
    });
    const initialRatio = Math.abs(javelin.vzMs) / Math.max(0.001, Math.abs(javelin.vxMs));

    for (let i = 0; i < 45; i += 1) {
      const step = updatePhysicalJavelin(javelin, 16, 0, 0);
      javelin = step.javelin;
      if (step.landed) {
        break;
      }
    }

    const finalRatio = Math.abs(javelin.vzMs) / Math.max(0.001, Math.abs(javelin.vxMs));
    expect(finalRatio).toBeLessThan(initialRatio * 0.9);
  });
});
