import type { GameAction, GameState } from './types';
import { reduceGameState } from './update';

// Stable reducer boundary for UI hooks; game logic lives in update.ts.
export const gameReducer = (state: GameState, action: GameAction): GameState =>
  reduceGameState(state, action);
