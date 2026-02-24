/**
 * Advance the fault phase by one tick.
 * Applies stumble animation and optional fault-javelin physics integration.
 */
import { clamp } from '../math';
import { updatePhysicalJavelin } from '../physics';
import type { GameState } from '../types';
import { FALL_ANIM_DURATION_MS, faultStumbleOffsetM } from './helpers';

export const tickFault = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'fault') {
    return state;
  }

  const nextFaultAnimT = clamp(state.phase.athletePose.animT + dtMs / FALL_ANIM_DURATION_MS, 0, 1);
  const stumbleDeltaM =
    faultStumbleOffsetM(nextFaultAnimT) - faultStumbleOffsetM(state.phase.athletePose.animT);
  const javelinUpdate = state.phase.javelinLanded
    ? null
    : updatePhysicalJavelin(state.phase.javelin, dtMs, state.windMs, state.windZMs);

  return {
    ...state,
    phase: {
      ...state.phase,
      athleteXM: state.phase.athleteXM + stumbleDeltaM,
      athletePose: {
        animTag: 'fall',
        animT: nextFaultAnimT
      },
      javelin:
        javelinUpdate === null
          ? state.phase.javelin
          : javelinUpdate.landed
            ? {
                ...javelinUpdate.javelin,
                vxMs: 0,
                vyMs: 0,
                vzMs: 0,
                angularVelRad: 0
              }
            : javelinUpdate.javelin,
      javelinLanded: javelinUpdate === null ? state.phase.javelinLanded : javelinUpdate.landed
    }
  };
};
