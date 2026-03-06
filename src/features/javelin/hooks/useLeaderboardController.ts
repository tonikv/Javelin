import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GameAction, GameState, HighscoreEntry, Locale } from '../game/types';
import { useGlobalLeaderboard, type GlobalLeaderboardErrorKind } from './useGlobalLeaderboard';
import { useLocalHighscores } from './useLocalHighscores';

export type LeaderboardMode = 'local' | 'global';

type Dispatch = (action: GameAction) => void;

type UseLeaderboardControllerOptions = {
  dispatch: Dispatch;
  locale: Locale;
  state: GameState;
  t: (key: string) => string;
  isGlobalSubmitBlocked: boolean;
};

type UseLeaderboardControllerResult = {
  leaderboardMode: LeaderboardMode;
  setLeaderboardMode: (mode: LeaderboardMode) => void;
  displayedHighscores: HighscoreEntry[];
  scoreboardTitle: string;
  scoreboardEmptyMessage: string;
  canSaveScore: boolean;
  shouldShowGlobalBlockedNote: boolean;
  showHighscoreBadge: boolean;
  saveScore: (name: string) => Promise<void>;
  clearLocalHighscores: () => void;
  refreshGlobalHighscores: () => Promise<void>;
  isGlobalAvailable: boolean;
  isGlobalLoading: boolean;
  hasGlobalError: boolean;
  globalErrorKind: GlobalLeaderboardErrorKind;
};

export const useLeaderboardController = ({
  dispatch,
  locale,
  state,
  t,
  isGlobalSubmitBlocked
}: UseLeaderboardControllerOptions): UseLeaderboardControllerResult => {
  const [savedRoundId, setSavedRoundId] = useState<number>(-1);
  const [leaderboardMode, setLeaderboardMode] = useState<LeaderboardMode>('local');
  const { highscores, addHighscore, clearHighscores, isHighscoreForDifficulty } =
    useLocalHighscores({
      difficulty: state.difficulty
    });
  const {
    available: isGlobalAvailable,
    highscores: globalHighscores,
    isLoading: isGlobalLoading,
    hasError: hasGlobalError,
    errorKind: globalErrorKind,
    refresh: refreshGlobalHighscores,
    submitScore: submitGlobalScore
  } = useGlobalLeaderboard({
    difficulty: state.difficulty
  });

  useEffect(() => {
    if (leaderboardMode !== 'global') {
      return;
    }
    void refreshGlobalHighscores();
  }, [leaderboardMode, refreshGlobalHighscores]);

  useEffect(() => {
    if (state.phase.tag !== 'result' || state.phase.resultKind !== 'valid') {
      return;
    }
    const shouldBeHighscore = isHighscoreForDifficulty(
      state.phase.distanceM,
      state.phase.launchedFrom.difficulty
    );
    if (state.phase.isHighscore === shouldBeHighscore) {
      return;
    }
    dispatch({
      type: 'setResultHighscoreFlag',
      isHighscore: shouldBeHighscore
    });
  }, [dispatch, isHighscoreForDifficulty, state.phase]);

  const canSaveScore =
    state.phase.tag === 'result' &&
    state.phase.resultKind === 'valid' &&
    state.phase.isHighscore &&
    savedRoundId !== state.roundId;

  const showHighscoreBadge =
    state.phase.tag === 'result' && state.phase.resultKind === 'valid' && state.phase.isHighscore;

  const displayedHighscores = leaderboardMode === 'local' ? highscores : globalHighscores;
  const difficultyLabel = t(`difficulty.${state.difficulty}`);
  const scoreboardTitle = `${
    leaderboardMode === 'local' ? t('scoreboard.titleLocal') : t('scoreboard.titleGlobal')
  } (${difficultyLabel})`;
  const scoreboardEmptyMessage =
    leaderboardMode === 'local'
      ? t('scoreboard.empty')
      : isGlobalAvailable
        ? t('scoreboard.emptyGlobal')
        : t('scoreboard.globalUnavailable');

  const saveScore = useCallback(
    async (name: string): Promise<void> => {
      if (state.phase.tag !== 'result') {
        return;
      }
      const playedAtIso = new Date().toISOString();
      addHighscore({
        id: crypto.randomUUID(),
        name,
        difficulty: state.phase.launchedFrom.difficulty,
        distanceM: state.phase.distanceM,
        playedAtIso,
        locale,
        windMs: state.phase.launchedFrom.windMs,
        launchSpeedMs: state.phase.launchedFrom.launchSpeedMs,
        angleDeg: state.phase.launchedFrom.angleDeg
      });

      if (isGlobalSubmitBlocked) {
        setSavedRoundId(state.roundId);
        return;
      }

      const submitted = await submitGlobalScore({
        difficulty: state.phase.launchedFrom.difficulty,
        playerName: name,
        distanceM: state.phase.distanceM,
        playedAtIso,
        locale,
        windMs: state.phase.launchedFrom.windMs,
        windZMs: state.windZMs,
        launchSpeedMs: state.phase.launchedFrom.launchSpeedMs,
        angleDeg: state.phase.launchedFrom.angleDeg,
        clientVersion: import.meta.env.VITE_APP_VERSION
      });

      if (submitted && leaderboardMode === 'global') {
        await refreshGlobalHighscores();
      }

      setSavedRoundId(state.roundId);
    },
    [
      addHighscore,
      isGlobalSubmitBlocked,
      leaderboardMode,
      locale,
      refreshGlobalHighscores,
      state.phase,
      state.roundId,
      state.windZMs,
      submitGlobalScore
    ]
  );

  return useMemo(
    () => ({
      leaderboardMode,
      setLeaderboardMode,
      displayedHighscores,
      scoreboardTitle,
      scoreboardEmptyMessage,
      canSaveScore,
      shouldShowGlobalBlockedNote: canSaveScore && isGlobalSubmitBlocked,
      showHighscoreBadge,
      saveScore,
      clearLocalHighscores: clearHighscores,
      refreshGlobalHighscores,
      isGlobalAvailable,
      isGlobalLoading,
      hasGlobalError,
      globalErrorKind
    }),
    [
      canSaveScore,
      clearHighscores,
      displayedHighscores,
      globalErrorKind,
      hasGlobalError,
      isGlobalAvailable,
      isGlobalLoading,
      isGlobalSubmitBlocked,
      leaderboardMode,
      refreshGlobalHighscores,
      saveScore,
      scoreboardEmptyMessage,
      scoreboardTitle,
      showHighscoreBadge
    ]
  );
};
