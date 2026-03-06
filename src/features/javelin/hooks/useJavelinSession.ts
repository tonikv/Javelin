import { useCallback, useEffect, useReducer, useState } from 'react';
import { gameReducer } from '../game/reducer';
import type { GameAction, GameState } from '../game/types';
import type { DifficultyGameplayTuningOverrides } from '../game/tuning';
import { createInitialGameState } from '../game/update';
import { useDevAdminSettings, resolveEffectiveDifficultyUnlocks } from './useDevAdminSettings';
import { useDifficultyUnlocks } from './useDifficultyUnlocks';
import { useGameLoop } from './useGameLoop';
import { useResultMessage, type ResultMessageState } from './useResultMessage';

type Dispatch = (action: GameAction) => void;

type DevAdminController = {
  enabled: boolean;
  settings: ReturnType<typeof useDevAdminSettings>['settings'];
  canApplyTuning: boolean;
  isGlobalSubmitBlocked: boolean;
  setUnlockAllDifficulties: (enabled: boolean) => void;
  resetUnlockProgression: () => void;
  applyTuningOverrides: (overrides: DifficultyGameplayTuningOverrides) => void;
  resetTuningOverrides: () => void;
  resetAll: () => void;
};

export type UseJavelinSessionResult = ResultMessageState & {
  state: GameState;
  dispatch: Dispatch;
  difficultyUnlocks: ReturnType<typeof useDifficultyUnlocks>['unlocks'];
  devAdmin: DevAdminController;
};

export const useJavelinSession = (): UseJavelinSessionResult => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [processedUnlockRoundId, setProcessedUnlockRoundId] = useState<number>(-1);
  const {
    unlocks: canonicalDifficultyUnlocks,
    registerThrowResult,
    resetUnlocks
  } = useDifficultyUnlocks();
  const {
    enabled: devAdminEnabled,
    settings: devAdminSettings,
    setUnlockAllDifficulties,
    applyTuningOverrides,
    resetTuningOverrides,
    resetAll: resetDevAdminAll
  } = useDevAdminSettings();

  const difficultyUnlocks = resolveEffectiveDifficultyUnlocks(
    canonicalDifficultyUnlocks,
    devAdminSettings,
    devAdminEnabled
  );

  useGameLoop(dispatch);

  useEffect(() => {
    if (!devAdminEnabled) {
      return;
    }
    if (state.phase.tag !== 'idle' && state.phase.tag !== 'result') {
      return;
    }
    dispatch({
      type: 'setDevTuningOverrides',
      overrides: devAdminSettings.tuningOverrides
    });
  }, [devAdminEnabled, devAdminSettings.tuningOverrides, state.phase.tag]);

  useEffect(() => {
    if (difficultyUnlocks[state.difficulty]) {
      return;
    }
    dispatch({
      type: 'setDifficulty',
      difficulty: 'rookie'
    });
  }, [difficultyUnlocks, state.difficulty]);

  useEffect(() => {
    if (state.phase.tag !== 'result' || processedUnlockRoundId === state.roundId) {
      return;
    }
    registerThrowResult({
      difficulty: state.phase.launchedFrom.difficulty,
      distanceM: state.phase.distanceM,
      isValidThrow: state.phase.resultKind === 'valid'
    });
    setProcessedUnlockRoundId(state.roundId);
  }, [processedUnlockRoundId, registerThrowResult, state.phase, state.roundId]);

  const applyTuningOverridesAndSyncState = useCallback(
    (overrides: DifficultyGameplayTuningOverrides): void => {
      applyTuningOverrides(overrides);
      dispatch({
        type: 'setDevTuningOverrides',
        overrides
      });
    },
    [applyTuningOverrides]
  );

  const resetTuningOverridesAndSyncState = useCallback((): void => {
    resetTuningOverrides();
    dispatch({ type: 'resetDevTuningOverrides' });
  }, [resetTuningOverrides]);

  const resetAllDevAdminState = useCallback((): void => {
    resetDevAdminAll();
    resetUnlocks();
    dispatch({ type: 'resetDevTuningOverrides' });
  }, [resetDevAdminAll, resetUnlocks]);

  const resultMessageState = useResultMessage(state);

  return {
    state,
    dispatch,
    difficultyUnlocks,
    devAdmin: {
      enabled: devAdminEnabled,
      settings: devAdminSettings,
      canApplyTuning: state.phase.tag === 'idle' || state.phase.tag === 'result',
      isGlobalSubmitBlocked: devAdminEnabled,
      setUnlockAllDifficulties,
      resetUnlockProgression: resetUnlocks,
      applyTuningOverrides: applyTuningOverridesAndSyncState,
      resetTuningOverrides: resetTuningOverridesAndSyncState,
      resetAll: resetAllDevAdminState
    },
    ...resultMessageState
  };
};
