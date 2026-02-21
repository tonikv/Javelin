import { describe, expect, it } from 'vitest';
import { RHYTHM_TARGET_PHASE01 } from './constants';
import { getRunupMeterPhase01 } from './selectors';
import { BEAT_INTERVAL_MS } from './tuning';
import type { GameState } from './types';

const makeRunupState = (nowMs: number, startedAtMs: number): GameState => ({
  nowMs,
  roundId: 1,
  windMs: 0,
  aimAngleDeg: 36,
  phase: {
    tag: 'runup',
    speedNorm: 0.3,
    startedAtMs,
    tapCount: 1,
    runupDistanceM: 0,
    rhythm: {
      firstTapAtMs: startedAtMs + 20,
      lastTapAtMs: startedAtMs + 20,
      perfectHits: 0,
      goodHits: 0,
      penaltyUntilMs: 0,
      lastQuality: null,
      lastQualityAtMs: startedAtMs + 20
    },
    athletePose: {
      animTag: 'run',
      animT: 0
    }
  }
});

describe('runup meter phase', () => {
  it('reaches target phase at beat boundaries', () => {
    const startedAtMs = 1000;
    const nowMs = startedAtMs + BEAT_INTERVAL_MS * 3;
    const phase = getRunupMeterPhase01(makeRunupState(nowMs, startedAtMs));
    expect(phase).not.toBeNull();
    expect(phase).toBeCloseTo(RHYTHM_TARGET_PHASE01, 1);
  });
});
