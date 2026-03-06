import { describe, expect, it } from 'vitest';
import {
  DIFFICULTY_GAMEPLAY_TUNING,
  resolveDifficultyGameplayTuning
} from './tuning';

describe('difficulty tuning resolver', () => {
  it('returns base values without overrides', () => {
    const rookie = resolveDifficultyGameplayTuning('rookie');
    expect(rookie).toEqual(DIFFICULTY_GAMEPLAY_TUNING.rookie);
  });

  it('applies overrides and sanitizes charge windows', () => {
    const resolved = resolveDifficultyGameplayTuning('pro', {
      pro: {
        chargePerfectWindow: { start: 0.95, end: 0.9 },
        chargeGoodWindow: { start: 0.96, end: 0.88 }
      }
    });

    expect(resolved.throwPhase.chargePerfectWindow.start).toBeLessThanOrEqual(
      resolved.throwPhase.chargePerfectWindow.end
    );
    expect(resolved.throwPhase.chargeGoodWindow.start).toBeLessThanOrEqual(
      resolved.throwPhase.chargePerfectWindow.start
    );
    expect(resolved.throwPhase.chargeGoodWindow.end).toBeGreaterThanOrEqual(
      resolved.throwPhase.chargePerfectWindow.end
    );
  });

  it('sanitizes elite rhythm bounds coherently', () => {
    const resolved = resolveDifficultyGameplayTuning('elite', {
      elite: {
        runupRhythm: {
          perfectToleranceRatio: 0.4,
          goodToleranceRatio: 0.05,
          missMultiplier: 2,
          stableDecayMultiplier: 2,
          unstableDecayMultiplier: 0.1
        }
      }
    });

    expect(resolved.runupRhythm).toBeDefined();
    if (resolved.runupRhythm) {
      expect(resolved.runupRhythm.goodToleranceRatio).toBeGreaterThanOrEqual(
        resolved.runupRhythm.perfectToleranceRatio
      );
      expect(resolved.runupRhythm.missMultiplier).toBeLessThanOrEqual(1);
      expect(resolved.runupRhythm.missMultiplier).toBeGreaterThanOrEqual(0.01);
      expect(resolved.runupRhythm.stableDecayMultiplier).toBeLessThanOrEqual(1);
      expect(resolved.runupRhythm.unstableDecayMultiplier).toBeGreaterThanOrEqual(
        resolved.runupRhythm.stableDecayMultiplier
      );
    }
  });
});
