import { describe, expect, it } from 'vitest';
import { computeAthletePoseGeometry } from './athletePose';
import { RUNUP_START_X_M } from './constants';
import { getCameraTargetX, getHeadMeterScreenAnchor, getVisibleJavelinRenderState } from './render';
import type { GameState } from './types';

const baseState: Pick<GameState, 'nowMs' | 'roundId' | 'windMs' | 'aimAngleDeg'> = {
  nowMs: 2000,
  roundId: 1,
  windMs: 0.2,
  aimAngleDeg: 18
};

describe('javelin visibility state', () => {
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
        athleteXM: 17.4,
        runupDistanceM: 17.4,
        startedAtMs: 1200,
        runEntryAnimT: 0.78,
        angleDeg: 35,
        chargeStartedAtMs: 1800,
        chargeMeter: {
          phase01: 0.5,
          cycles: 1,
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
      chargeState.phase.athleteXM
    );

    expect(getVisibleJavelinRenderState(runupState, runPose).mode).toBe('attached');
    expect(getVisibleJavelinRenderState(chargeState, chargePose).mode).toBe('attached');
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
      athleteXM: 10,
      runupDistanceM: 10,
      startedAtMs: 1000,
      runEntryAnimT: 0.4,
      angleDeg: 34,
      chargeStartedAtMs: 1800,
      chargeMeter: {
        phase01: 0.25,
        cycles: 0,
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
        athleteXM: 12,
        runupDistanceM: 12
      }
    };
    expect(getCameraTargetX(chargeState2)).toBeGreaterThan(getCameraTargetX(chargeState1));
  });

  it('keeps result camera target at landed javelin position', () => {
    const resultState: GameState = {
      ...baseState,
      phase: {
        tag: 'result',
        athleteXM: RUNUP_START_X_M,
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
});
