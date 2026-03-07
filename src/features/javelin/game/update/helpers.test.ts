import { describe, expect, it } from 'vitest';
import { getDifficultyGameplayTuning } from '../tuning';
import { computeRhythmTapGain, getRunupAntiMashMultiplier } from './helpers';

describe('rhythm tap gain', () => {
  it('uses the adaptive target interval as the soft cap at elite high speed', () => {
    const elite = getDifficultyGameplayTuning('elite');
    const runupRhythm = elite.runupRhythm;
    if (!runupRhythm) {
      throw new Error('Expected elite rhythm tuning.');
    }

    const targetIntervalMs =
      runupRhythm.tempoCurve[runupRhythm.tempoCurve.length - 1]?.targetIntervalMs ?? 0;
    const gain = computeRhythmTapGain({
      intervalMs: targetIntervalMs,
      targetIntervalMs,
      tapGainNorm: elite.speedUp.tapGainNorm,
      tapSoftCapIntervalMs: elite.speedUp.tapSoftCapIntervalMs,
      tapSoftCapMinMultiplier: elite.speedUp.tapSoftCapMinMultiplier,
      quality: 'perfect',
      combo: 0,
      tuning: runupRhythm
    });

    expect(targetIntervalMs).toBeLessThan(elite.speedUp.tapSoftCapIntervalMs);
    expect(
      getRunupAntiMashMultiplier(
        targetIntervalMs,
        elite.speedUp.tapSoftCapIntervalMs,
        elite.speedUp.tapSoftCapMinMultiplier
      )
    ).toBeLessThan(1);
    expect(gain.antiMashMultiplier).toBe(1);
  });

  it('still penalizes taps that are faster than the adaptive target interval', () => {
    const elite = getDifficultyGameplayTuning('elite');
    const runupRhythm = elite.runupRhythm;
    if (!runupRhythm) {
      throw new Error('Expected elite rhythm tuning.');
    }

    const targetIntervalMs =
      runupRhythm.tempoCurve[runupRhythm.tempoCurve.length - 1]?.targetIntervalMs ?? 0;
    const rushedIntervalMs = Math.round(targetIntervalMs * 0.5);
    const gain = computeRhythmTapGain({
      intervalMs: rushedIntervalMs,
      targetIntervalMs,
      tapGainNorm: elite.speedUp.tapGainNorm,
      tapSoftCapIntervalMs: elite.speedUp.tapSoftCapIntervalMs,
      tapSoftCapMinMultiplier: elite.speedUp.tapSoftCapMinMultiplier,
      quality: 'miss',
      combo: 0,
      tuning: runupRhythm
    });

    expect(gain.antiMashMultiplier).toBeLessThan(1);
  });
});
