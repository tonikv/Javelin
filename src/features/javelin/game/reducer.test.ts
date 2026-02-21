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

  it('does not allow throw prep before minimum taps', () => {
    const initial = createInitialGameState();
    const started = gameReducer(initial, { type: 'startRound', atMs: 1000, windMs: 0.2 });
    const next = gameReducer(started, { type: 'beginThrowPrep' });
    expect(next.phase.tag).toBe('runup');
  });

  it('transitions runup -> throwPrep -> flight', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1450 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1900 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2350 });
    state = gameReducer(state, { type: 'beginThrowPrep' });
    expect(state.phase.tag).toBe('throwPrep');
    state = gameReducer(state, { type: 'tick', dtMs: 800, nowMs: 3150 });
    state = gameReducer(state, { type: 'releaseThrow' });
    expect(state.phase.tag).toBe('flight');
  });

  it('fails if release is too late', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1450 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1900 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2350 });
    state = gameReducer(state, { type: 'beginThrowPrep' });
    state = gameReducer(state, { type: 'tick', dtMs: 1200, nowMs: 3600 });
    expect(state.phase.tag).toBe('fault');
  });
});
