import { describe, expect, it } from 'vitest';
import { CAMERA_GROUND_BOTTOM_PADDING } from './constants';
import { createWorldToScreenRaw, getCameraTargetX, getViewWidthM, RUNWAY_OFFSET_X } from './camera';
import { RUNUP_START_X_M } from './tuning';
import type { GameState } from './types';

const baseState: Pick<GameState, 'nowMs' | 'roundId' | 'windMs' | 'windZMs' | 'aimAngleDeg'> = {
  nowMs: 2200,
  roundId: 2,
  windMs: 0.2,
  windZMs: -0.1,
  aimAngleDeg: 34
};

const offset = -RUNUP_START_X_M;

describe('camera', () => {
  it('returns expected camera target x for each gameplay phase', () => {
    const idleState: GameState = { ...baseState, phase: { tag: 'idle' } };
    const runupState: GameState = {
      ...baseState,
      phase: {
        tag: 'runup',
        speedNorm: 0.4,
        startedAtMs: 1000,
        tapCount: 3,
        runupDistanceM: 10.2,
        tap: { lastTapAtMs: 1180, lastTapGainNorm: 0.8 },
        athletePose: { animTag: 'run', animT: 0.2 }
      }
    };
    const chargeState: GameState = {
      ...baseState,
      phase: {
        tag: 'chargeAim',
        speedNorm: 0.55,
        runupDistanceM: 12.1,
        startedAtMs: 1000,
        runEntryAnimT: 0.4,
        angleDeg: 35,
        chargeStartedAtMs: 1500,
        chargeMeter: {
          phase01: 0.6,
          perfectWindow: { start: 0.78, end: 0.98 },
          goodWindow: { start: 0.56, end: 0.98 },
          lastQuality: 'good',
          lastSampleAtMs: 2200
        },
        forceNormPreview: 0.7,
        athletePose: { animTag: 'aim', animT: 0.3 }
      }
    };
    const throwState: GameState = {
      ...baseState,
      phase: {
        tag: 'throwAnim',
        speedNorm: 0.68,
        athleteXM: 16.4,
        angleDeg: 33,
        forceNorm: 0.76,
        releaseQuality: 'perfect',
        lineCrossedAtRelease: false,
        releaseFlashAtMs: 2100,
        animProgress: 0.4,
        released: false,
        athletePose: { animTag: 'throw', animT: 0.4 }
      }
    };
    const flightState: GameState = {
      ...baseState,
      phase: {
        tag: 'flight',
        athleteXM: 18,
        javelin: {
          xM: 20.4,
          yM: 4.8,
          zM: 0,
          vxMs: 18,
          vyMs: 3,
          vzMs: 0.2,
          angleRad: 0.2,
          angularVelRad: 0.3,
          releasedAtMs: 2100,
          lengthM: 2.6
        },
        launchedFrom: {
          speedNorm: 0.68,
          angleDeg: 33,
          forceNorm: 0.76,
          windMs: 0.2,
          launchSpeedMs: 27,
          athleteXM: 18,
          releaseQuality: 'good',
          lineCrossedAtRelease: false
        },
        athletePose: { animTag: 'followThrough', animT: 0.2 }
      }
    };
    const resultState: GameState = {
      ...baseState,
      phase: {
        tag: 'result',
        athleteXM: 19.2,
        launchedFrom: {
          speedNorm: 0.68,
          angleDeg: 33,
          forceNorm: 0.76,
          windMs: 0.2,
          launchSpeedMs: 27,
          athleteXM: 19.2,
          releaseQuality: 'good',
          lineCrossedAtRelease: false
        },
        distanceM: 71.1,
        isHighscore: false,
        resultKind: 'valid',
        tipFirst: true,
        landingTipXM: 90,
        landingXM: 89.2,
        landingYM: 0,
        landingAngleRad: -0.3
      }
    };
    const faultState: GameState = {
      ...baseState,
      phase: {
        tag: 'fault',
        reason: 'lateRelease',
        athleteXM: 13.4,
        athletePose: { animTag: 'fall', animT: 0.3 },
        javelin: {
          xM: 15.1,
          yM: 1.2,
          zM: 0,
          vxMs: 4,
          vyMs: -2,
          vzMs: 0,
          angleRad: -0.2,
          angularVelRad: 0,
          releasedAtMs: 2100,
          lengthM: 2.6
        },
        javelinLanded: false
      }
    };

    if (runupState.phase.tag !== 'runup') {
      throw new Error('Expected runup phase in test setup.');
    }
    if (chargeState.phase.tag !== 'chargeAim') {
      throw new Error('Expected chargeAim phase in test setup.');
    }
    if (throwState.phase.tag !== 'throwAnim') {
      throw new Error('Expected throwAnim phase in test setup.');
    }
    if (resultState.phase.tag !== 'result') {
      throw new Error('Expected result phase in test setup.');
    }
    if (faultState.phase.tag !== 'fault') {
      throw new Error('Expected fault phase in test setup.');
    }

    expect(getCameraTargetX(idleState)).toBeCloseTo(RUNUP_START_X_M + offset, 6);
    expect(getCameraTargetX(runupState)).toBeCloseTo(runupState.phase.runupDistanceM + offset, 6);
    expect(getCameraTargetX(chargeState)).toBeCloseTo(chargeState.phase.runupDistanceM + offset, 6);
    expect(getCameraTargetX(throwState)).toBeCloseTo(throwState.phase.athleteXM + offset, 6);
    expect(getCameraTargetX(flightState)).toBeCloseTo(25.6, 6);
    expect(getCameraTargetX(resultState)).toBe(resultState.phase.landingXM);
    expect(getCameraTargetX(faultState)).toBeCloseTo(faultState.phase.athleteXM + offset, 6);
  });

  it('projects known world points into expected screen coordinates', () => {
    const state: GameState = {
      ...baseState,
      phase: {
        tag: 'runup',
        speedNorm: 0.2,
        startedAtMs: 1000,
        tapCount: 1,
        runupDistanceM: RUNUP_START_X_M,
        tap: { lastTapAtMs: 1000, lastTapGainNorm: 1 },
        athletePose: { animTag: 'idle', animT: 0 }
      }
    };

    const width = 1000;
    const height = 500;
    const camera = createWorldToScreenRaw(state, width, height);
    const minPoint = camera.toScreen({ xM: camera.worldMinX, yM: 0 });
    const maxPoint = camera.toScreen({ xM: camera.worldMaxX, yM: 0 });
    const elevated = camera.toScreen({ xM: camera.worldMinX, yM: 2 });

    expect(minPoint.x).toBeCloseTo(RUNWAY_OFFSET_X, 6);
    expect(maxPoint.x).toBeCloseTo(width - 24, 6);
    expect(minPoint.y).toBeCloseTo(height - CAMERA_GROUND_BOTTOM_PADDING, 6);
    expect(elevated.y).toBeLessThan(minPoint.y);
  });

  it('uses a wider field of view in flight than in runup', () => {
    const runupState: GameState = {
      ...baseState,
      phase: {
        tag: 'runup',
        speedNorm: 0.2,
        startedAtMs: 1000,
        tapCount: 1,
        runupDistanceM: RUNUP_START_X_M,
        tap: { lastTapAtMs: 1000, lastTapGainNorm: 1 },
        athletePose: { animTag: 'idle', animT: 0 }
      }
    };
    const flightState: GameState = {
      ...baseState,
      phase: {
        tag: 'flight',
        athleteXM: 18,
        javelin: {
          xM: 22,
          yM: 5,
          zM: 0,
          vxMs: 20,
          vyMs: 4,
          vzMs: 0,
          angleRad: 0.2,
          angularVelRad: 0.3,
          releasedAtMs: 2000,
          lengthM: 2.6
        },
        launchedFrom: {
          speedNorm: 0.72,
          angleDeg: 34,
          forceNorm: 0.8,
          windMs: 0.2,
          launchSpeedMs: 28,
          athleteXM: 18,
          releaseQuality: 'good',
          lineCrossedAtRelease: false
        },
        athletePose: { animTag: 'followThrough', animT: 0.4 }
      }
    };

    expect(getViewWidthM(flightState)).toBeGreaterThan(getViewWidthM(runupState));
  });
});
