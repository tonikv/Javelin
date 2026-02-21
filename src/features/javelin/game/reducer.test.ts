import { describe, expect, it } from 'vitest';
import { gameReducer } from './reducer';
import { createInitialGameState } from './update';

describe('gameReducer', () => {
  it('starts a round into runup', () => {
    const state = createInitialGameState();
    const next = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 1.2 });
    expect(next.phase.tag).toBe('runup');
    expect(next.windMs).toBe(1.2);
  });

  it('does not allow charge before minimum taps', () => {
    const initial = createInitialGameState();
    const started = gameReducer(initial, { type: 'startRound', atMs: 1000, windMs: 0.2 });
    const next = gameReducer(started, { type: 'beginChargeAim', atMs: 1200 });
    expect(next.phase.tag).toBe('runup');
  });

  it('transitions runup -> chargeAim -> throwAnim -> flight', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1450 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1900 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2350 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 2400 });
    expect(state.phase.tag).toBe('chargeAim');
    state = gameReducer(state, { type: 'tick', dtMs: 460, nowMs: 2860 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 2870 });
    expect(state.phase.tag).toBe('throwAnim');
    state = gameReducer(state, { type: 'tick', dtMs: 260, nowMs: 3130 });
    expect(state.phase.tag).toBe('flight');
  });

  it('faults if charging release angle is too low', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1450 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1900 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2350 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 2400 });
    state = gameReducer(state, { type: 'adjustAngle', deltaDeg: -30 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 2900 });
    expect(state.phase.tag).toBe('fault');
  });
});
