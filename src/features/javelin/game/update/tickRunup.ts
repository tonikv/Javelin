/**
 * Advance the runup phase by one tick.
 * Applies speed decay, position advancement, and animation progression.
 */
import { RUNUP_MAX_X_M } from '../constants';
import { clamp } from '../math';
import { GAMEPLAY_TUNING } from '../tuning';
import type { GameState } from '../types';
import { advanceRunAnimT, isRunning, runSpeedMsFromNorm } from './helpers';

const {
  runupSpeedDecayPerSecond: RUNUP_SPEED_DECAY_PER_SECOND,
  runupStartXM: RUNUP_START_X_M
} = GAMEPLAY_TUNING.movement;

export const tickRunup = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'runup') {
    return state;
  }

  const speedAfterDecay = clamp(
    state.phase.speedNorm - (dtMs / 1000) * RUNUP_SPEED_DECAY_PER_SECOND,
    0,
    1
  );
  const speedNorm = speedAfterDecay;
  const runSpeedMs = isRunning(speedNorm) ? runSpeedMsFromNorm(speedNorm) : 0;
  const runupDistanceM = clamp(
    state.phase.runupDistanceM + runSpeedMs * (dtMs / 1000),
    RUNUP_START_X_M,
    RUNUP_MAX_X_M
  );

  return {
    ...state,
    phase: {
      ...state.phase,
      speedNorm,
      runupDistanceM,
      athletePose: {
        animTag: isRunning(speedNorm) ? 'run' : 'idle',
        animT: isRunning(speedNorm)
          ? advanceRunAnimT(state.phase.athletePose.animT, dtMs, speedNorm)
          : 0
      }
    }
  };
};
