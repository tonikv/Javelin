import { describe, expect, it } from 'vitest';
import { RUNUP_PASSIVE_TO_HALF_MS, THROW_ANIM_DURATION_MS, THROW_LINE_X_M } from './constants';
import { gameReducer } from './reducer';
import { createInitialGameState } from './update';

describe('gameReducer', () => {
  it('starts a round into runup', () => {
    const state = createInitialGameState();
    const next = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 1.2 });
    expect(next.phase.tag).toBe('runup');
    expect(next.windMs).toBe(1.2);
  });

  it('builds passive speed to around 50% without taps', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, {
      type: 'tick',
      dtMs: RUNUP_PASSIVE_TO_HALF_MS,
      nowMs: 1000 + RUNUP_PASSIVE_TO_HALF_MS
    });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.speedNorm).toBeGreaterThanOrEqual(0.46);
      expect(state.phase.speedNorm).toBeLessThanOrEqual(0.56);
    }
  });

  it('perfect timing tap boosts speed above passive baseline', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, {
      type: 'tick',
      dtMs: RUNUP_PASSIVE_TO_HALF_MS,
      nowMs: 1000 + RUNUP_PASSIVE_TO_HALF_MS
    });
    const baseline = state.phase.tag === 'runup' ? state.phase.speedNorm : 0;
    state = gameReducer(state, { type: 'rhythmTap', atMs: 6280 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.speedNorm).toBeGreaterThan(baseline);
    }
  });

  it('spam tapping is penalized', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    const speedAfterFirst = state.phase.tag === 'runup' ? state.phase.speedNorm : 0;
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1940 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.speedNorm).toBeLessThan(speedAfterFirst);
    }
  });

  it('runup locomotion advances and can cross throw line', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'tick', dtMs: 9000, nowMs: 10000 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.runupDistanceM).toBeGreaterThan(THROW_LINE_X_M);
    }
  });

  it('allows early throw start before line', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.2 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 3700 });
    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag === 'chargeAim') {
      expect(state.phase.athleteXM).toBeLessThan(THROW_LINE_X_M);
    }
  });

  it('crosses release threshold once and enters flight', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.2 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 3700 });
    state = gameReducer(state, { type: 'tick', dtMs: 280, nowMs: 3980 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 3990 });
    expect(state.phase.tag).toBe('throwAnim');

    state = gameReducer(state, {
      type: 'tick',
      dtMs: Math.round(THROW_ANIM_DURATION_MS * 0.72),
      nowMs: 4610
    });

    expect(state.phase.tag).toBe('flight');
    if (state.phase.tag === 'flight') {
      const releasedAt = state.phase.javelin.releasedAtMs;
      state = gameReducer(state, { type: 'tick', dtMs: 16, nowMs: 4626 });
      expect(state.phase.tag).toBe('flight');
      if (state.phase.tag === 'flight') {
        expect(state.phase.javelin.releasedAtMs).toBe(releasedAt);
      }
    }
  });

  it('crossing line at release ends as foul_line', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.3 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'tick', dtMs: 7800, nowMs: 8800 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 8820 });
    expect(state.phase.tag).toBe('chargeAim');
    state = gameReducer(state, { type: 'tick', dtMs: 300, nowMs: 9120 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 9130 });
    expect(state.phase.tag).toBe('throwAnim');

    for (let i = 0; i < 700; i += 1) {
      state = gameReducer(state, { type: 'tick', dtMs: 16, nowMs: 9130 + i * 16 });
      if (state.phase.tag === 'result') {
        break;
      }
    }

    expect(state.phase.tag).toBe('result');
    if (state.phase.tag === 'result') {
      expect(state.phase.resultKind).toBe('foul_line');
    }
  });
});
