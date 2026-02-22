import { useCallback, useMemo, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../../app/browser';
import { HIGHSCORE_STORAGE_KEY, MAX_HIGHSCORES } from '../game/constants';
import type { HighscoreEntry, Locale } from '../game/types';

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

const supportedLocales = new Set<Locale>(['fi', 'sv', 'en']);

const parseEntry = (value: unknown): HighscoreEntry | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== 'string' || typeof raw.name !== 'string') {
    return null;
  }
  if (typeof raw.distanceM !== 'number' || !Number.isFinite(raw.distanceM)) {
    return null;
  }
  if (typeof raw.playedAtIso !== 'string' || Number.isNaN(Date.parse(raw.playedAtIso))) {
    return null;
  }

  if (raw.locale !== undefined && (typeof raw.locale !== 'string' || !supportedLocales.has(raw.locale as Locale))) {
    return null;
  }
  const locale: Locale = raw.locale === undefined ? 'en' : (raw.locale as Locale);

  if (raw.windMs !== undefined && (typeof raw.windMs !== 'number' || !Number.isFinite(raw.windMs))) {
    return null;
  }
  const windMs = raw.windMs === undefined ? 0 : raw.windMs;

  if (
    raw.launchSpeedMs !== undefined &&
    (typeof raw.launchSpeedMs !== 'number' || !Number.isFinite(raw.launchSpeedMs))
  ) {
    return null;
  }
  const launchSpeedMs = typeof raw.launchSpeedMs === 'number' ? raw.launchSpeedMs : undefined;

  if (raw.angleDeg !== undefined && (typeof raw.angleDeg !== 'number' || !Number.isFinite(raw.angleDeg))) {
    return null;
  }
  const angleDeg = typeof raw.angleDeg === 'number' ? raw.angleDeg : undefined;

  return {
    id: raw.id,
    name: raw.name,
    distanceM: raw.distanceM,
    playedAtIso: raw.playedAtIso,
    locale,
    windMs,
    launchSpeedMs,
    angleDeg
  };
};

const isDefined = <T>(value: T | null): value is T => value !== null;

export const loadHighscores = (): HighscoreEntry[] => {
  const raw = safeLocalStorageGet(HIGHSCORE_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map(parseEntry)
      .filter(isDefined)
      .sort(compareHighscores)
      .slice(0, MAX_HIGHSCORES);
  } catch {
    return [];
  }
};

export const saveHighscores = (entries: HighscoreEntry[]): void => {
  safeLocalStorageSet(HIGHSCORE_STORAGE_KEY, JSON.stringify(entries));
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
