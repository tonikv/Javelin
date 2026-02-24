/**
 * Advance the flight phase by one tick.
 * Integrates javelin physics and transitions to result on landing.
 */
import { COMPETITION_RULES, computeCompetitionDistanceM, evaluateThrowLegality } from '../scoring';
import { updatePhysicalJavelin } from '../physics';
import { clamp } from '../math';
import type { GameState } from '../types';
import { followThroughStepOffsetM } from './helpers';

export const tickFlight = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'flight') {
    return state;
  }

  const nextFollowAnimT = clamp(state.phase.athletePose.animT + dtMs / 650, 0, 1);
  const stepDeltaM =
    followThroughStepOffsetM(nextFollowAnimT) -
    followThroughStepOffsetM(state.phase.athletePose.animT);
  const athleteXM = state.phase.athleteXM + stepDeltaM;
  const updated = updatePhysicalJavelin(state.phase.javelin, dtMs, state.windMs, state.windZMs);
  if (updated.landed) {
    const landingTipXM = updated.landingTipXM ?? updated.javelin.xM;
    const landingTipZM = updated.landingTipZM ?? updated.javelin.zM;
    const distanceM = computeCompetitionDistanceM(landingTipXM);
    const legality = evaluateThrowLegality({
      lineCrossedAtRelease: state.phase.launchedFrom.lineCrossedAtRelease,
      landingTipXM,
      landingTipZM,
      tipFirst: updated.tipFirst === true,
      rules: COMPETITION_RULES
    });

    return {
      ...state,
      phase: {
        tag: 'result',
        athleteXM,
        launchedFrom: state.phase.launchedFrom,
        distanceM,
        isHighscore: false,
        resultKind: legality.resultKind,
        tipFirst: updated.tipFirst,
        landingTipXM,
        landingXM: updated.javelin.xM,
        landingYM: Math.max(0, updated.javelin.yM),
        landingAngleRad: updated.javelin.angleRad
      }
    };
  }

  return {
    ...state,
    phase: {
      ...state.phase,
      athleteXM,
      javelin: updated.javelin,
      athletePose: {
        animTag: 'followThrough',
        animT: nextFollowAnimT
      }
    }
  };
};
