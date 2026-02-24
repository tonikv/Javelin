/**
 * Advance the throw animation phase by one tick.
 * Transitions to flight exactly once when release progress threshold is crossed.
 */
import { computeAthletePoseGeometry } from '../athletePose';
import { JAVELIN_GRIP_OFFSET_M, JAVELIN_RELEASE_OFFSET_Y_M } from '../constants';
import { clamp, toRad } from '../math';
import { computeLaunchSpeedMs, createPhysicalJavelin } from '../physics';
import { GAMEPLAY_TUNING } from '../tuning';
import type { GameState } from '../types';
import { lateralVelocityFromRelease, runSpeedMsFromNorm } from './helpers';

const {
  throwAnimDurationMs: THROW_ANIM_DURATION_MS,
  throwReleaseProgress01: THROW_RELEASE_PROGRESS
} = GAMEPLAY_TUNING.throwPhase;

export const tickThrowAnim = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'throwAnim') {
    return state;
  }

  const nextProgress = clamp(state.phase.animProgress + dtMs / THROW_ANIM_DURATION_MS, 0, 1);
  const released = nextProgress >= THROW_RELEASE_PROGRESS;
  if (released && !state.phase.released) {
    const releasePose = computeAthletePoseGeometry(
      {
        animTag: 'throw',
        animT: THROW_RELEASE_PROGRESS
      },
      state.phase.speedNorm,
      state.phase.angleDeg,
      state.phase.athleteXM
    );
    const launchSpeedMs = computeLaunchSpeedMs(state.phase.speedNorm, state.phase.forceNorm);
    const launchAngleRad = toRad(state.phase.angleDeg);
    const athleteForwardMs = runSpeedMsFromNorm(state.phase.speedNorm) * 0.34;
    const lateralVelMs = lateralVelocityFromRelease(
      state.phase.releaseQuality,
      state.phase.angleDeg,
      state.roundId
    );

    return {
      ...state,
      phase: {
        tag: 'flight',
        athleteXM: state.phase.athleteXM,
        javelin: createPhysicalJavelin({
          xM: releasePose.javelinGrip.xM + Math.cos(launchAngleRad) * JAVELIN_GRIP_OFFSET_M,
          yM: Math.max(
            1.35,
            releasePose.javelinGrip.yM + Math.sin(launchAngleRad) * JAVELIN_RELEASE_OFFSET_Y_M
          ),
          zM: 0,
          launchAngleRad,
          launchSpeedMs,
          athleteForwardMs,
          lateralVelMs,
          releasedAtMs: nowMs
        }),
        launchedFrom: {
          speedNorm: state.phase.speedNorm,
          athleteXM: state.phase.athleteXM,
          angleDeg: state.phase.angleDeg,
          forceNorm: state.phase.forceNorm,
          releaseQuality: state.phase.releaseQuality,
          lineCrossedAtRelease: state.phase.lineCrossedAtRelease,
          windMs: state.windMs,
          launchSpeedMs
        },
        athletePose: {
          animTag: 'followThrough',
          animT: 0
        }
      }
    };
  }

  return {
    ...state,
    phase: {
      ...state.phase,
      animProgress: nextProgress,
      athletePose: {
        animTag: 'throw',
        animT: nextProgress
      }
    }
  };
};
