import { useCallback, useMemo, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../../app/browser';
import {
  HIGHSCORE_STORAGE_KEY,
  HIGHSCORE_STORAGE_KEY_LEGACY,
  MAX_HIGHSCORES
} from '../game/constants';
import { difficultyLevels, type DifficultyLevel, type HighscoreEntry, type Locale } from '../game/types';

type HighscoresByDifficulty = Record<DifficultyLevel, HighscoreEntry[]>;

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

export const isHighscoreForEntries = (entries: HighscoreEntry[], distanceM: number): boolean => {
  const threshold = entries.length >= MAX_HIGHSCORES ? entries[MAX_HIGHSCORES - 1].distanceM : null;
  return threshold === null || distanceM > threshold;
};

const supportedLocales = new Set<Locale>(['fi', 'sv', 'en']);
const difficultySet = new Set<DifficultyLevel>(difficultyLevels);

const createEmptyHighscoreBuckets = (): HighscoresByDifficulty => ({
  rookie: [],
  pro: [],
  elite: []
});

const parseEntry = (value: unknown, fallbackDifficulty?: DifficultyLevel): HighscoreEntry | null => {
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

  let difficulty: DifficultyLevel | undefined;
  if (raw.difficulty !== undefined) {
    if (typeof raw.difficulty !== 'string' || !difficultySet.has(raw.difficulty as DifficultyLevel)) {
      return null;
    }
    difficulty = raw.difficulty as DifficultyLevel;
    if (fallbackDifficulty !== undefined && difficulty !== fallbackDifficulty) {
      return null;
    }
  } else {
    difficulty = fallbackDifficulty;
  }
  if (!difficulty) {
    return null;
  }

  if (
    raw.locale !== undefined &&
    (typeof raw.locale !== 'string' || !supportedLocales.has(raw.locale as Locale))
  ) {
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
    difficulty,
    distanceM: raw.distanceM,
    playedAtIso: raw.playedAtIso,
    locale,
    windMs,
    launchSpeedMs,
    angleDeg
  };
};

const isDefined = <T>(value: T | null): value is T => value !== null;

const parseHighscoresByDifficulty = (value: unknown): HighscoresByDifficulty | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const raw = value as Record<string, unknown>;
  const parsed = createEmptyHighscoreBuckets();

  for (const difficulty of difficultyLevels) {
    const listValue = raw[difficulty];
    if (!Array.isArray(listValue)) {
      return null;
    }
    parsed[difficulty] = listValue
      .map((entry) => parseEntry(entry, difficulty))
      .filter(isDefined)
      .sort(compareHighscores)
      .slice(0, MAX_HIGHSCORES);
  }

  return parsed;
};

const parseLegacyHighscores = (value: unknown): HighscoreEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => parseEntry(entry, 'rookie'))
    .filter(isDefined)
    .sort(compareHighscores)
    .slice(0, MAX_HIGHSCORES)
    .map((entry) => ({
      ...entry,
      difficulty: 'rookie' as const
    }));
};

export const saveHighscoresByDifficulty = (entries: HighscoresByDifficulty): void => {
  safeLocalStorageSet(HIGHSCORE_STORAGE_KEY, JSON.stringify(entries));
};

export const loadHighscoresByDifficulty = (): HighscoresByDifficulty => {
  const rawV2 = safeLocalStorageGet(HIGHSCORE_STORAGE_KEY);
  if (rawV2) {
    try {
      const parsed = parseHighscoresByDifficulty(JSON.parse(rawV2) as unknown);
      if (parsed) {
        return parsed;
      }
    } catch {
      // Continue to legacy migration below.
    }
  }

  const legacyRaw = safeLocalStorageGet(HIGHSCORE_STORAGE_KEY_LEGACY);
  if (!legacyRaw) {
    return createEmptyHighscoreBuckets();
  }

  try {
    const legacyEntries = parseLegacyHighscores(JSON.parse(legacyRaw) as unknown);
    const migrated = createEmptyHighscoreBuckets();
    migrated.rookie = legacyEntries;
    saveHighscoresByDifficulty(migrated);
    return migrated;
  } catch {
    return createEmptyHighscoreBuckets();
  }
};

type UseLocalHighscoresOptions = {
  difficulty: DifficultyLevel;
};

type UseLocalHighscoresResult = {
  highscores: HighscoreEntry[];
  addHighscore: (entry: HighscoreEntry) => void;
  clearHighscores: () => void;
  isHighscore: (distanceM: number) => boolean;
  isHighscoreForDifficulty: (distanceM: number, difficulty: DifficultyLevel) => boolean;
};

export const useLocalHighscores = ({ difficulty }: UseLocalHighscoresOptions): UseLocalHighscoresResult => {
  const [highscoresByDifficulty, setHighscoresByDifficulty] = useState<HighscoresByDifficulty>(
    loadHighscoresByDifficulty
  );

  const highscores = useMemo(() => highscoresByDifficulty[difficulty], [difficulty, highscoresByDifficulty]);

  const addHighscore = useCallback((entry: HighscoreEntry) => {
    setHighscoresByDifficulty((previous) => {
      const nextForDifficulty = pruneHighscores(
        insertHighscoreSorted(previous[entry.difficulty], entry)
      );
      const next = {
        ...previous,
        [entry.difficulty]: nextForDifficulty
      };
      saveHighscoresByDifficulty(next);
      return next;
    });
  }, []);

  const clearHighscores = useCallback(() => {
    setHighscoresByDifficulty((previous) => {
      const next = {
        ...previous,
        [difficulty]: []
      };
      saveHighscoresByDifficulty(next);
      return next;
    });
  }, [difficulty]);

  const isHighscoreForDifficulty = useCallback(
    (distanceM: number, forDifficulty: DifficultyLevel): boolean => {
      const board = highscoresByDifficulty[forDifficulty];
      return isHighscoreForEntries(board, distanceM);
    },
    [highscoresByDifficulty]
  );

  const isHighscore = useCallback(
    (distanceM: number): boolean => isHighscoreForDifficulty(distanceM, difficulty),
    [difficulty, isHighscoreForDifficulty]
  );

  return {
    highscores,
    addHighscore,
    clearHighscores,
    isHighscore,
    isHighscoreForDifficulty
  };
};
