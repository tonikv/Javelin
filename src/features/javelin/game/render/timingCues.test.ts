import { describe, expect, it, vi } from 'vitest';
import type { GameState } from '../types';
import { createRenderSession } from './session';
import { didMeterCursorCrossCenter, emitTimingCursorAudioCues } from './timingCues';

const baseState: Pick<
  GameState,
  'nowMs' | 'roundId' | 'difficulty' | 'devTuningOverrides' | 'windMs' | 'windZMs' | 'aimAngleDeg'
> = {
  nowMs: 1000,
  roundId: 1,
  difficulty: 'elite',
  devTuningOverrides: {},
  windMs: 0,
  windZMs: 0,
  aimAngleDeg: 36
};

const createRunupState = (): GameState => ({
  ...baseState,
  phase: {
    tag: 'runup',
    meterMode: 'rhythmLane',
    speedNorm: 0.64,
    startedAtMs: 1000,
    tapCount: 4,
    runupDistanceM: 9.4,
    tap: {
      lastTapAtMs: 1000,
      lastTapMultiplier: 1
    },
    chargeHold: null,
    runupRhythm: {
      targetIntervalMs: 180,
      lastIntervalMs: 180,
      lastOffsetMs: 0,
      lastQuality: 'good',
      combo: 2,
      stability01: 0.58
    },
    athletePose: {
      animTag: 'run',
      animT: 0.4
    }
  }
});

const createChargeAimState = (phase01: number): GameState => ({
  ...baseState,
  nowMs: 1400,
  phase: {
    tag: 'chargeAim',
    speedNorm: 0.72,
    entrySpeedNorm: 0.72,
    runupDistanceM: 12.6,
    startedAtMs: 1000,
    runEntryAnimT: 0.45,
    angleDeg: 35,
    chargeStartedAtMs: 1200,
    chargeMeter: {
      mode: 'centerSweep',
      phase01,
      perfectWindow: { start: 0.45, end: 0.55 },
      goodWindow: { start: 0.39, end: 0.61 },
      lastQuality: phase01 >= 0.45 && phase01 <= 0.55 ? 'perfect' : 'good',
      lastSampleAtMs: 1400
    },
    forceNormPreview: 0.88,
    athletePose: {
      animTag: 'aim',
      animT: 0.3
    }
  }
});

describe('timing cursor audio cues', () => {
  it('detects center crossings in either direction', () => {
    expect(didMeterCursorCrossCenter(0.4, 0.5)).toBe(true);
    expect(didMeterCursorCrossCenter(0.6, 0.49)).toBe(true);
    expect(didMeterCursorCrossCenter(0.2, 0.3)).toBe(false);
  });

  it('fires the charge center cue once per crossing and resets after leaving charge aim', () => {
    const session = createRenderSession();
    const onChargeCenterCue = vi.fn();

    emitTimingCursorAudioCues(createChargeAimState(0.32), session, { onChargeCenterCue });
    emitTimingCursorAudioCues(createChargeAimState(0.56), session, { onChargeCenterCue });
    emitTimingCursorAudioCues(createChargeAimState(0.72), session, { onChargeCenterCue });
    emitTimingCursorAudioCues(createRunupState(), session, { onChargeCenterCue });
    emitTimingCursorAudioCues(createChargeAimState(0.64), session, { onChargeCenterCue });
    emitTimingCursorAudioCues(createChargeAimState(0.44), session, { onChargeCenterCue });

    expect(onChargeCenterCue).toHaveBeenCalledTimes(2);
  });
});
