import { describe, expect, it } from 'vitest';
import { computeAthletePoseGeometry } from './athletePose';
import { getHeadMeterScreenAnchor, getVisibleJavelinRenderState } from './render';
import type { GameState } from './types';

const baseState: Pick<GameState, 'nowMs' | 'roundId' | 'windMs'> = {
  nowMs: 2000,
  roundId: 1,
  windMs: 0.2
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
});
