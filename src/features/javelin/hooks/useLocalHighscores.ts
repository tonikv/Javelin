import { useCallback, useMemo, useState } from 'react';
import { HIGHSCORE_STORAGE_KEY, MAX_HIGHSCORES } from '../game/constants';
import type { HighscoreEntry } from '../game/types';

const compareHighscores = (a: HighscoreEntry, b: HighscoreEntry): number => {
  if (b.distanceM !== a.distanceM) {
    return b.distanceM - a.distanceM;
  }
  return a.playedAtIso.localeCompare(b.playedAtIso);
};

export const pruneHighscores = (
  entries: HighscoreEntry[],
  size = MAX_HIGHSCORES
): HighscoreEntry[] => entries.slice(0, size);

export const insertHighscoreSorted = (
  entries: HighscoreEntry[],
  entry: HighscoreEntry
): HighscoreEntry[] => [...entries, entry].sort(compareHighscores);

export const loadHighscores = (): HighscoreEntry[] => {
  const raw = localStorage.getItem(HIGHSCORE_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as HighscoreEntry[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter(
        (item) =>
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.distanceM === 'number' &&
          typeof item.playedAtIso === 'string'
      )
      .sort(compareHighscores)
      .slice(0, MAX_HIGHSCORES);
  } catch {
    return [];
  }
};

export const saveHighscores = (entries: HighscoreEntry[]): void => {
  localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(entries));
};

type UseLocalHighscoresResult = {
  highscores: HighscoreEntry[];
  addHighscore: (entry: HighscoreEntry) => void;
  clearHighscores: () => void;
  isHighscore: (distanceM: number) => boolean;
};

export const useLocalHighscores = (): UseLocalHighscoresResult => {
  const [highscores, setHighscores] = useState<HighscoreEntry[]>(loadHighscores);

  const addHighscore = useCallback((entry: HighscoreEntry) => {
    setHighscores((previous) => {
      const next = pruneHighscores(insertHighscoreSorted(previous, entry));
      saveHighscores(next);
      return next;
    });
  }, []);

  const clearHighscores = useCallback(() => {
    setHighscores([]);
    saveHighscores([]);
  }, []);

  const threshold = useMemo<number | null>(
    () => (highscores.length >= MAX_HIGHSCORES ? highscores[MAX_HIGHSCORES - 1].distanceM : null),
    [highscores]
  );

  const isHighscore = useCallback(
    (distanceM: number) => threshold === null || distanceM > threshold,
    [threshold]
  );

  return {
    highscores,
    addHighscore,
    clearHighscores,
    isHighscore
  };
};
