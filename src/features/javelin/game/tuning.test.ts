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
        rhythm: {
          perfectToleranceMs: 50,
          goodToleranceMs: 10,
          offBeatMultiplier: 2
        }
      }
    });

    expect(resolved.speedUp.rhythm).toBeDefined();
    if (resolved.speedUp.rhythm) {
      expect(resolved.speedUp.rhythm.goodToleranceMs).toBeGreaterThanOrEqual(
        resolved.speedUp.rhythm.perfectToleranceMs
      );
      expect(resolved.speedUp.rhythm.offBeatMultiplier).toBeLessThanOrEqual(1);
      expect(resolved.speedUp.rhythm.offBeatMultiplier).toBeGreaterThanOrEqual(0);
    }
  });
});
