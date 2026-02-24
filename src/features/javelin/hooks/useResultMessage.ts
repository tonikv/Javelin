/**
 * Derive localized result and status copy from the current game phase.
 * Returns neutral values when the game is not in a result or fault context.
 */
import { useMemo } from 'react';
import { useI18n } from '../../../i18n/init';
import type { FaultReason, GameState } from '../game/types';

const faultReasonKey = (reason: FaultReason): string => `result.fault.${reason}`;

export type ResultThrowSpecs = Extract<GameState['phase'], { tag: 'result' }>['launchedFrom'];

export type ResultMessageState = {
  resultMessage: string;
  resultStatusMessage: string | null;
  isFoulMessage: boolean;
  resultThrowSpecs: ResultThrowSpecs | null;
};

export const useResultMessage = (state: GameState): ResultMessageState => {
  const { t, formatNumber } = useI18n();

  const resultMessage = useMemo(() => {
    if (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) {
      return t('javelin.result.foul_line');
    }
    if (state.phase.tag === 'result') {
      const landingMessage =
        state.phase.tipFirst === null
          ? ''
          : state.phase.tipFirst
            ? ` · ${t('javelin.landingTipFirst')}`
            : ` · ${t('javelin.landingFlat')}`;
      if (state.phase.resultKind !== 'valid') {
        return `${t(`javelin.result.${state.phase.resultKind}`)} · ${formatNumber(state.phase.distanceM)} m`;
      }
      return `${t('result.distance')} ${formatNumber(state.phase.distanceM)} m${landingMessage}`;
    }
    if (state.phase.tag === 'fault') {
      return t(faultReasonKey(state.phase.reason));
    }
    return '';
  }, [state.phase, t, formatNumber]);

  const resultStatusMessage = useMemo(() => {
    if (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) {
      return t('result.notSavedInvalid');
    }
    if (state.phase.tag === 'fault') {
      return t('result.notSavedInvalid');
    }
    if (state.phase.tag !== 'result') {
      return null;
    }
    if (state.phase.resultKind !== 'valid') {
      return t('result.notSavedInvalid');
    }
    if (!state.phase.isHighscore) {
      return t('result.notHighscore');
    }
    return null;
  }, [state.phase, t]);

  const resultThrowSpecs = state.phase.tag === 'result' ? state.phase.launchedFrom : null;
  const isFoulMessage =
    state.phase.tag === 'fault' ||
    (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) ||
    (state.phase.tag === 'result' && state.phase.resultKind !== 'valid');

  return {
    resultMessage,
    resultStatusMessage,
    isFoulMessage,
    resultThrowSpecs
  };
};
