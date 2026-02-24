import { describe, expect, it } from 'vitest';
import { WIND_MAX_MS, WIND_MIN_MS } from './constants';
import { advanceWindMs, sampleWindTargetMs } from './wind';
import { WIND_CYCLE_DURATION_MS } from './tuning';

describe('wind model', () => {
  it('keeps target samples within configured wind bounds', () => {
    for (let nowMs = 0; nowMs <= 180000; nowMs += 333) {
      const sampled = sampleWindTargetMs(nowMs);
      expect(sampled).toBeGreaterThanOrEqual(WIND_MIN_MS);
      expect(sampled).toBeLessThanOrEqual(WIND_MAX_MS);
    }
  });

  it('is deterministic for fixed timestamps', () => {
    const timestamps = [0, 40, 320, 1600, 4800, 9450, 23210, 78111];
    const first = timestamps.map((nowMs) => sampleWindTargetMs(nowMs));
    const second = timestamps.map((nowMs) => sampleWindTargetMs(nowMs));
    expect(second).toEqual(first);
  });

  it('advances in smooth finite steps under frame-sized delta time', () => {
    let windMs = 0;
    for (let frame = 1; frame <= 240; frame += 1) {
      const next = advanceWindMs(windMs, 16, frame * 16);
      expect(next).toBeGreaterThanOrEqual(WIND_MIN_MS);
      expect(next).toBeLessThanOrEqual(WIND_MAX_MS);
      expect(Math.abs(next - windMs)).toBeLessThanOrEqual(0.4);
      windMs = next;
    }
  });

  it('changes visible 0.1 m/s display buckets over short playtime', () => {
    let windMs = 0;
    const buckets = new Set<number>();
    for (let frame = 1; frame <= 900; frame += 1) {
      const nowMs = frame * 16;
      windMs = advanceWindMs(windMs, 16, nowMs);
      buckets.add(Math.round(windMs * 10) / 10);
    }
    expect(buckets.size).toBeGreaterThanOrEqual(4);
  });

  it('keeps short-window trend readable for throw timing', () => {
    const startMs = 20000;
    const samples: number[] = [];
    for (let nowMs = startMs; nowMs <= startMs + 3200; nowMs += 120) {
      samples.push(sampleWindTargetMs(nowMs));
    }

    let directionFlips = 0;
    let previousSign = 0;
    for (let index = 1; index < samples.length; index += 1) {
      const delta = samples[index] - samples[index - 1];
      const sign = Math.abs(delta) < 0.01 ? 0 : Math.sign(delta);
      if (sign !== 0 && previousSign !== 0 && sign !== previousSign) {
        directionFlips += 1;
      }
      if (sign !== 0) {
        previousSign = sign;
      }
    }

    expect(directionFlips).toBeLessThanOrEqual(2);
  });

  it('preserves broad cycle shape across repeated cycles', () => {
    const probeMs = [1800, 4800, 8200, 11600];
    const diffs = probeMs.map((t) =>
      Math.abs(sampleWindTargetMs(t) - sampleWindTargetMs(t + WIND_CYCLE_DURATION_MS))
    );
    const avgDiff = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
    expect(avgDiff).toBeLessThan(0.55);
  });
});
