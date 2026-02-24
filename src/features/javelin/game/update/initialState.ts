/**
 * Game state bootstrap helpers.
 * Provides deterministic initial state shape with sampled starting wind.
 */
import { ANGLE_DEFAULT_DEG } from '../constants';
import type { GameState } from '../types';
import { sampleCrosswindTargetMs, sampleWindTargetMs } from '../wind';

export const createInitialGameState = (): GameState => {
  const nowMs = performance.now();
  return {
    nowMs,
    roundId: 0,
    windMs: sampleWindTargetMs(nowMs),
    windZMs: sampleCrosswindTargetMs(nowMs),
    aimAngleDeg: ANGLE_DEFAULT_DEG,
    phase: { tag: 'idle' }
  };
};
