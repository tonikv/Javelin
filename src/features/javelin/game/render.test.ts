import { describe, expect, it } from 'vitest';
import { computeAthletePoseGeometry } from './athletePose';
import {
  createRenderSession,
  getCameraTargetX,
  getHeadMeterScreenAnchor,
  getPlayerAngleAnchorScreen,
  getVisibleJavelinRenderState
} from './render';
import { RUNUP_START_X_M } from './tuning';
import type { GameState } from './types';

const baseState: Pick<GameState, 'nowMs' | 'roundId' | 'windMs' | 'aimAngleDeg'> = {
  nowMs: 2000,
  roundId: 1,
  windMs: 0.2,
  aimAngleDeg: 18
};

describe('javelin visibility state', () => {
  it('creates isolated render sessions', () => {
    const sessionA = createRenderSession();
    const sessionB = createRenderSession();

    sessionA.resultMarker.lastRoundId = 9;
    sessionA.camera.targetX = 18;
    sessionA.lastPhaseTag = 'result';

    expect(sessionB.resultMarker.lastRoundId).toBe(-1);
    expect(sessionB.camera.targetX).toBe(RUNUP_START_X_M);
    expect(sessionB.lastPhaseTag).toBe('idle');
  });

  it('is attached during runup and charge', () => {
    const runupState: GameState = {
      ...baseState,
      phase: {
        tag: 'runup',
        speedNorm: 0.6,
        startedAtMs: 1000,
        tapCount: 4,
        runupDistanceM: 10,
        rhythm: {
          firstTapAtMs: 1200,
          lastTapAtMs: 1880,
          perfectHits: 2,
          goodHits: 3,
          penaltyUntilMs: 0,
          lastQuality: 'good',
          lastQualityAtMs: 1880
        },
        athletePose: { animTag: 'run', animT: 0.4 }
      }
    };

    const chargeState: GameState = {
      ...baseState,
      phase: {
        tag: 'chargeAim',
        speedNorm: 0.72,
        runupDistanceM: 17.4,
        startedAtMs: 1200,
        runEntryAnimT: 0.78,
        angleDeg: 35,
        chargeStartedAtMs: 1800,
        chargeMeter: {
          phase01: 0.5,
          perfectWindow: { start: 0.47, end: 0.53 },
          goodWindow: { start: 0.4, end: 0.6 },
          lastQuality: 'perfect',
          lastSampleAtMs: 2000
        },
        forceNormPreview: 0.92,
        athletePose: { animTag: 'aim', animT: 0.2 }
      }
    };

    if (runupState.phase.tag !== 'runup') {
      throw new Error('Expected runup phase in test setup');
    }
    if (chargeState.phase.tag !== 'chargeAim') {
      throw new Error('Expected chargeAim phase in test setup');
    }

    const runPose = computeAthletePoseGeometry(
      runupState.phase.athletePose,
      runupState.phase.speedNorm,
      22,
      runupState.phase.runupDistanceM
    );
    const chargePose = computeAthletePoseGeometry(
      chargeState.phase.athletePose,
      chargeState.phase.speedNorm,
      chargeState.phase.angleDeg,
      chargeState.phase.runupDistanceM
    );

    expect(getVisibleJavelinRenderState(runupState, runPose).mode).toBe('attached');
    expect(getVisibleJavelinRenderState(chargeState, chargePose).mode).toBe('attached');
  });

  it('keeps javelin attached in idle pose', () => {
    const idleState: GameState = {
      ...baseState,
      phase: {
        tag: 'idle'
      }
    };

    const idlePose = computeAthletePoseGeometry(
      { animTag: 'idle', animT: 0 },
      0,
      idleState.aimAngleDeg,
      RUNUP_START_X_M
    );

    expect(getVisibleJavelinRenderState(idleState, idlePose).mode).toBe('attached');
  });

  it('switches to flight mode after release', () => {
    const flightState: GameState = {
      ...baseState,
      phase: {
        tag: 'flight',
        athleteXM: 17.9,
        javelin: {
          xM: 20,
          yM: 6.1,
          zM: 0.3,
          vxMs: 18,
          vyMs: 4,
          vzMs: 0.1,
          angleRad: 0.2,
          angularVelRad: 0.3,
          releasedAtMs: 1900,
          lengthM: 2.6
        },
        launchedFrom: {
          speedNorm: 0.83,
          angleDeg: 35,
          forceNorm: 0.9,
          windMs: 0.2,
          launchSpeedMs: 28,
          athleteXM: 17.9,
          releaseQuality: 'perfect',
          lineCrossedAtRelease: false
        },
        athletePose: { animTag: 'followThrough', animT: 0.4 }
      }
    };
    if (flightState.phase.tag !== 'flight') {
      throw new Error('Expected flight phase in test setup');
    }
    const pose = computeAthletePoseGeometry(
      flightState.phase.athletePose,
      flightState.phase.launchedFrom.speedNorm,
      flightState.phase.launchedFrom.angleDeg,
      flightState.phase.athleteXM
    );
    const visible = getVisibleJavelinRenderState(flightState, pose);
    expect(visible.mode).toBe('flight');
    if (visible.mode === 'flight') {
      expect(visible.xM).toBeGreaterThan(flightState.phase.athleteXM);
    }
  });

  it('computes finite meter anchor from head screen point', () => {
    const anchor = getHeadMeterScreenAnchor({ x: 220, y: 140 });
    expect(Number.isFinite(anchor.x)).toBe(true);
    expect(Number.isFinite(anchor.y)).toBe(true);
    expect(anchor.y).toBeLessThan(140);
  });

  it('camera follows chargeAim runup distance', () => {
    const chargePhaseBase: Extract<GameState['phase'], { tag: 'chargeAim' }> = {
      tag: 'chargeAim',
      speedNorm: 0.55,
      runupDistanceM: 10,
      startedAtMs: 1000,
      runEntryAnimT: 0.4,
      angleDeg: 34,
      chargeStartedAtMs: 1800,
      chargeMeter: {
        phase01: 0.25,
        perfectWindow: { start: 0.47, end: 0.53 },
        goodWindow: { start: 0.4, end: 0.6 },
        lastQuality: 'good',
        lastSampleAtMs: 1980
      },
      forceNormPreview: 0.5,
      athletePose: { animTag: 'aim', animT: 0.1 }
    };

    const chargeState1: GameState = {
      ...baseState,
      phase: chargePhaseBase
    };
    const chargeState2: GameState = {
      ...chargeState1,
      phase: {
        ...chargePhaseBase,
        runupDistanceM: 12
      }
    };
    expect(getCameraTargetX(chargeState2)).toBeGreaterThan(getCameraTargetX(chargeState1));
  });

  it('keeps idle camera target on runup start anchor', () => {
    const idleState: GameState = {
      ...baseState,
      phase: {
        tag: 'idle'
      }
    };

    expect(getCameraTargetX(idleState)).toBe(0);
  });

  it('keeps athlete screen anchor stable when transitioning idle to runup', () => {
    const idleState: GameState = {
      ...baseState,
      phase: {
        tag: 'idle'
      }
    };
    const runupState: GameState = {
      ...baseState,
      phase: {
        tag: 'runup',
        speedNorm: 0,
        startedAtMs: 1000,
        tapCount: 0,
        runupDistanceM: RUNUP_START_X_M,
        rhythm: {
          firstTapAtMs: null,
          lastTapAtMs: null,
          perfectHits: 0,
          goodHits: 0,
          penaltyUntilMs: 0,
          lastQuality: null,
          lastQualityAtMs: 0
        },
        athletePose: { animTag: 'idle', animT: 0 }
      }
    };

    const idleAnchor = getPlayerAngleAnchorScreen(idleState, 900, 420);
    const runupAnchor = getPlayerAngleAnchorScreen(runupState, 900, 420);

    expect(runupAnchor.x).toBeCloseTo(idleAnchor.x, 5);
    expect(runupAnchor.y).toBeCloseTo(idleAnchor.y, 5);
  });

  it('keeps result camera target at landed javelin position', () => {
    const resultState: GameState = {
      ...baseState,
      phase: {
        tag: 'result',
        athleteXM: RUNUP_START_X_M,
        launchedFrom: {
          speedNorm: 0.78,
          angleDeg: 38,
          forceNorm: 0.82,
          windMs: 0.2,
          launchSpeedMs: 29,
          athleteXM: RUNUP_START_X_M,
          releaseQuality: 'good',
          lineCrossedAtRelease: false
        },
        distanceM: 0,
        isHighscore: false,
        resultKind: 'foul_tip_first',
        tipFirst: false,
        landingXM: 3.1,
        landingYM: 0,
        landingAngleRad: -0.4
      }
    };

    const pose = computeAthletePoseGeometry(
      { animTag: 'followThrough', animT: 1 },
      0.72,
      24,
      RUNUP_START_X_M
    );
    const visible = getVisibleJavelinRenderState(resultState, pose);
    expect(visible.mode).toBe('landed');
    if (visible.mode === 'landed') {
      expect(visible.xM).toBe(3.1);
    }

    const cameraTargetX = getCameraTargetX(resultState);
    expect(cameraTargetX).toBe(3.1);
  });

  it('tracks javelin during flight phase', () => {
    const flightState: GameState = {
      ...baseState,
      phase: {
        tag: 'flight',
        athleteXM: 16.2,
        javelin: {
          xM: 28.4,
          yM: 5.1,
          zM: 0.2,
          vxMs: 20,
          vyMs: 3.5,
          vzMs: 0.1,
          angleRad: 0.2,
          angularVelRad: 0.3,
          releasedAtMs: 1900,
          lengthM: 2.6
        },
        launchedFrom: {
          speedNorm: 0.8,
          angleDeg: 34,
          forceNorm: 0.85,
          windMs: 0.2,
          launchSpeedMs: 28,
          athleteXM: 16.2,
          releaseQuality: 'good',
          lineCrossedAtRelease: false
        },
        athletePose: { animTag: 'followThrough', animT: 0.5 }
      }
    };

    expect(getCameraTargetX(flightState)).toBe(28.4);
  });

  it('prevents backward camera jump when javelin just launched', () => {
    const flightState: GameState = {
      ...baseState,
      phase: {
        tag: 'flight',
        athleteXM: 18,
        javelin: {
          xM: 19,
          yM: 5,
          zM: 0,
          vxMs: 18,
          vyMs: 3,
          vzMs: 0,
          angleRad: 0.2,
          angularVelRad: 0.3,
          releasedAtMs: 1900,
          lengthM: 2.6
        },
        launchedFrom: {
          speedNorm: 0.8,
          angleDeg: 34,
          forceNorm: 0.85,
          windMs: 0.2,
          launchSpeedMs: 28,
          athleteXM: 18,
          releaseQuality: 'good',
          lineCrossedAtRelease: false
        },
        athletePose: { animTag: 'followThrough', animT: 0.4 }
      }
    };

    expect(getCameraTargetX(flightState)).toBe(25.6);
  });
});
