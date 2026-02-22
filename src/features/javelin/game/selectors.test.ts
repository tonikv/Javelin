import { describe, expect, it } from 'vitest';
import { getRunupMeterPhase01, getSpeedPercent } from './selectors';
import type { GameState } from './types';

const makeRunupState = (speedNorm: number): GameState => ({
  nowMs: 2000,
  roundId: 1,
  windMs: 0,
  aimAngleDeg: 36,
  phase: {
    tag: 'runup',
    speedNorm,
    startedAtMs: 1000,
    tapCount: 1,
    runupDistanceM: 0,
    tap: {
      lastTapAtMs: 1200,
      lastTapGainNorm: 0.8
    },
    athletePose: {
      animTag: 'run',
      animT: 0
    }
  }
});

describe('runup meter phase', () => {
  it('maps directly to runup speed', () => {
    const phase = getRunupMeterPhase01(makeRunupState(0.3));
    expect(phase).not.toBeNull();
    expect(phase).toBeCloseTo(0.3, 3);
  });
});

describe('result throw specs', () => {
  it('keeps throw speed percent in result phase', () => {
    const state: GameState = {
      nowMs: 3200,
      roundId: 2,
      windMs: 0.4,
      aimAngleDeg: 12,
      phase: {
        tag: 'result',
        athleteXM: 18.6,
        launchedFrom: {
          speedNorm: 0.83,
          angleDeg: 41,
          forceNorm: 0.77,
          windMs: 0.4,
          launchSpeedMs: 30.5,
          athleteXM: 18.2,
          releaseQuality: 'perfect',
          lineCrossedAtRelease: false
        },
        distanceM: 65.2,
        isHighscore: false,
        resultKind: 'valid',
        tipFirst: true,
        landingXM: 83.4,
        landingYM: 0,
        landingAngleRad: -0.3
      }
    };

    expect(getSpeedPercent(state)).toBe(83);
  });
});
