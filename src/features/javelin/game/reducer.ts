import type { GameAction, GameState } from './types';
import { reduceGameState } from './update';

export const gameReducer = (state: GameState, action: GameAction): GameState =>
  reduceGameState(state, action);
