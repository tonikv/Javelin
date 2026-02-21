import { describe, expect, it } from 'vitest';
import {
  computeLaunchSpeedMs,
  createPhysicalJavelin,
  distanceFromJavelin,
  updatePhysicalJavelin
} from './physics';

const simulateDistance = (
  speedNorm: number,
  forceNorm: number,
  angleDeg: number,
  windMs: number
): number => {
  let javelin = createPhysicalJavelin({
    xM: 3,
    yM: 1.6,
    launchAngleRad: (angleDeg * Math.PI) / 180,
    launchSpeedMs: computeLaunchSpeedMs(speedNorm, forceNorm),
    releasedAtMs: 0
  });

  for (let i = 0; i < 1200; i += 1) {
    const step = updatePhysicalJavelin(javelin, 16, windMs);
    javelin = step.javelin;
    if (step.landed) {
      return distanceFromJavelin(javelin);
    }
  }
  return distanceFromJavelin(javelin);
};

describe('physical javelin simulation', () => {
  it('eventually lands on the ground', () => {
    let javelin = createPhysicalJavelin({
      xM: 3,
      yM: 1.6,
      launchAngleRad: (34 * Math.PI) / 180,
      launchSpeedMs: 26,
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
    expect(javelin.yM).toBe(0);
  });

  it('reaches apex then descends', () => {
    let javelin = createPhysicalJavelin({
      xM: 2.8,
      yM: 1.7,
      launchAngleRad: (38 * Math.PI) / 180,
      launchSpeedMs: 24,
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
      launchAngleRad: (36 * Math.PI) / 180,
      launchSpeedMs: 25,
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

  it('keeps weak/good/excellent ranges separated', () => {
    const weak = simulateDistance(0.35, 0.3, 27, -0.8);
    const good = simulateDistance(0.7, 0.65, 35, 0.1);
    const excellent = simulateDistance(0.92, 0.95, 36, 0.8);

    expect(weak).toBeGreaterThanOrEqual(15);
    expect(weak).toBeLessThan(40);

    expect(good).toBeGreaterThanOrEqual(45);
    expect(good).toBeLessThan(75);

    expect(excellent).toBeGreaterThanOrEqual(75);
    expect(excellent).toBeLessThanOrEqual(95);
  });

  it('remains finite under strong wind extremes', () => {
    let javelin = createPhysicalJavelin({
      xM: 2.8,
      yM: 1.8,
      launchAngleRad: (30 * Math.PI) / 180,
      launchSpeedMs: 22,
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

  it('reports tip-first for a good throw', () => {
    let javelin = createPhysicalJavelin({
      xM: 3,
      yM: 1.6,
      launchAngleRad: (34 * Math.PI) / 180,
      launchSpeedMs: 28,
      releasedAtMs: 0
    });
    let tipFirst: boolean | null = null;
    for (let i = 0; i < 800; i += 1) {
      const step = updatePhysicalJavelin(javelin, 16, 0.4);
      javelin = step.javelin;
      if (step.landed) {
        tipFirst = step.tipFirst;
        break;
      }
    }
    expect(tipFirst).toBe(true);
  });
});
