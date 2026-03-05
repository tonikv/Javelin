import { useCallback, useState } from 'react';
import { MAX_HIGHSCORES } from '../game/constants';
import type { HighscoreEntry, Locale } from '../game/types';
import {
  fetchGlobalLeaderboard,
  getGlobalLeaderboardApiBase,
  postGlobalScore,
  type LeaderboardDifficulty
} from '../highscores/globalLeaderboardApi';

type UseGlobalLeaderboardOptions = {
  difficulty: LeaderboardDifficulty;
  limit?: number;
};

type SubmitGlobalScoreInput = {
  difficulty?: LeaderboardDifficulty;
  playerName: string;
  distanceM: number;
  playedAtIso: string;
  windMs: number;
  windZMs?: number;
  launchSpeedMs?: number;
  angleDeg?: number;
  locale: Locale;
  clientVersion?: string;
};

type UseGlobalLeaderboardResult = {
  available: boolean;
  highscores: HighscoreEntry[];
  isLoading: boolean;
  hasError: boolean;
  refresh: () => Promise<void>;
  submitScore: (input: SubmitGlobalScoreInput) => Promise<boolean>;
};

export const useGlobalLeaderboard = ({
  difficulty,
  limit = MAX_HIGHSCORES
}: UseGlobalLeaderboardOptions): UseGlobalLeaderboardResult => {
  const [highscores, setHighscores] = useState<HighscoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const available = getGlobalLeaderboardApiBase() !== null;

  const refresh = useCallback(async (): Promise<void> => {
    if (!available) {
      setHighscores([]);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    try {
      const next = await fetchGlobalLeaderboard({
        difficulty,
        limit
      });
      setHighscores(next);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [available, difficulty, limit]);

  const submitScore = useCallback(
    async (input: SubmitGlobalScoreInput): Promise<boolean> => {
      if (!available) {
        return false;
      }

      try {
        await postGlobalScore({
          difficulty: input.difficulty ?? difficulty,
          ...input
        });
        return true;
      } catch {
        setHasError(true);
        return false;
      }
    },
    [available, difficulty]
  );

  return {
    available,
    highscores,
    isLoading,
    hasError,
    refresh,
    submitScore
  };
};
