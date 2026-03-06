import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_HIGHSCORES } from '../game/constants';
import type { HighscoreEntry, Locale } from '../game/types';
import {
  fetchGlobalLeaderboard,
  getGlobalLeaderboardApiBase,
  isGlobalLeaderboardApiError,
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
  errorKind: GlobalLeaderboardErrorKind;
  hasError: boolean;
  refresh: () => Promise<void>;
  submitScore: (input: SubmitGlobalScoreInput) => Promise<boolean>;
};

export type GlobalLeaderboardErrorKind =
  | 'none'
  | 'invalid-response'
  | 'network-error'
  | 'rate-limited'
  | 'server-error'
  | 'unavailable';

const toErrorKind = (error: unknown): GlobalLeaderboardErrorKind => {
  if (isGlobalLeaderboardApiError(error)) {
    if (error.code === 'aborted') {
      return 'none';
    }
    if (error.code === 'invalid-response') {
      return 'invalid-response';
    }
    if (error.code === 'network') {
      return 'network-error';
    }
    if (error.code === 'unavailable') {
      return 'unavailable';
    }
    if (error.code === 'http' && error.status === 429) {
      return 'rate-limited';
    }
    return 'server-error';
  }
  return 'server-error';
};

export const useGlobalLeaderboard = ({
  difficulty,
  limit = MAX_HIGHSCORES
}: UseGlobalLeaderboardOptions): UseGlobalLeaderboardResult => {
  const [highscores, setHighscores] = useState<HighscoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKind, setErrorKind] = useState<GlobalLeaderboardErrorKind>('none');
  const requestIdRef = useRef(0);
  const refreshAbortControllerRef = useRef<AbortController | null>(null);
  const available = getGlobalLeaderboardApiBase() !== null;
  const hasError = errorKind !== 'none';

  useEffect(() => {
    return () => {
      refreshAbortControllerRef.current?.abort();
      refreshAbortControllerRef.current = null;
    };
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (!available) {
      setHighscores([]);
      setErrorKind('none');
      return;
    }

    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    refreshAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    refreshAbortControllerRef.current = abortController;

    setIsLoading(true);
    setErrorKind('none');
    try {
      const next = await fetchGlobalLeaderboard({
        difficulty,
        limit,
        signal: abortController.signal
      });
      if (requestId !== requestIdRef.current) {
        return;
      }
      setHighscores(next);
      setErrorKind('none');
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      const nextErrorKind = toErrorKind(error);
      setErrorKind(nextErrorKind);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
        if (refreshAbortControllerRef.current === abortController) {
          refreshAbortControllerRef.current = null;
        }
      }
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
        setErrorKind('none');
        return true;
      } catch (error) {
        const nextErrorKind = toErrorKind(error);
        if (nextErrorKind !== 'none') {
          setErrorKind(nextErrorKind);
        }
        return false;
      }
    },
    [available, difficulty]
  );

  return {
    available,
    highscores,
    isLoading,
    errorKind,
    hasError,
    refresh,
    submitScore
  };
};
