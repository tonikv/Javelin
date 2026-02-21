import { describe, expect, it } from 'vitest';
import { RUNUP_MAX_X_M, RUNUP_PASSIVE_TO_HALF_MS } from './constants';
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
      expect(state.phase.speedNorm).toBeGreaterThanOrEqual(0.48);
      expect(state.phase.speedNorm).toBeLessThanOrEqual(0.52);
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
    state = gameReducer(state, { type: 'rhythmTap', atMs: 5400 });
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

  it('runup locomotion advances and clamps at throw line', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'tick', dtMs: 9000, nowMs: 10000 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.runupDistanceM).toBeGreaterThan(2.8);
      expect(state.phase.runupDistanceM).toBeLessThanOrEqual(RUNUP_MAX_X_M);
    }
  });

  it('does not allow charge before throw line zone', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.2 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    const next = gameReducer(state, { type: 'beginChargeAim', atMs: 3700 });
    expect(next.phase.tag).toBe('runup');
  });

  it('transitions runup -> chargeAim -> throwAnim -> flight near throw line', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'tick', dtMs: 5600, nowMs: 6600 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 6280 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 7160 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 8040 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 8200 });
    expect(state.phase.tag).toBe('chargeAim');
    state = gameReducer(state, { type: 'tick', dtMs: 430, nowMs: 8630 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 8640 });
    expect(state.phase.tag).toBe('throwAnim');
    state = gameReducer(state, { type: 'tick', dtMs: 260, nowMs: 8900 });
    expect(state.phase.tag).toBe('flight');
  });
});
