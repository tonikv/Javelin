import type { GameState } from '../types';
import type { GameAudioCallbacks, RenderSession } from './types';

export const didMeterCursorCrossCenter = (
  previousPhase01: number | null,
  currentPhase01: number
): boolean => {
  if (previousPhase01 === null) {
    return false;
  }
  return (
    (previousPhase01 < 0.5 && currentPhase01 >= 0.5) ||
    (previousPhase01 > 0.5 && currentPhase01 <= 0.5)
  );
};

export const emitTimingCursorAudioCues = (
  state: GameState,
  session: RenderSession,
  audio?: GameAudioCallbacks
): void => {
  if (state.phase.tag === 'chargeAim' && state.phase.chargeMeter.mode === 'centerSweep') {
    if (
      didMeterCursorCrossCenter(session.lastChargeCenterPhase01, state.phase.chargeMeter.phase01)
    ) {
      audio?.onChargeCenterCue?.();
    }
    session.lastChargeCenterPhase01 = state.phase.chargeMeter.phase01;
    return;
  }

  session.lastChargeCenterPhase01 = null;
};
