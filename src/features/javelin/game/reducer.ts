import type { GameAction, GameState } from './types';
import { reduceGameState } from './update';

/**
 * Stable public API for the game reducer.
 *
 * This thin wrapper provides a seam for future middleware (logging,
 * dev tools, replay capture) without changing consumer import paths.
 * Game logic remains in update/* modules.
 */
export const gameReducer = (state: GameState, action: GameAction): GameState =>
  reduceGameState(state, action);
