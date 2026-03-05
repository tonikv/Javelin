import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HIGHSCORE_STORAGE_KEY, HIGHSCORE_STORAGE_KEY_LEGACY } from '../game/constants';
import type { DifficultyLevel, HighscoreEntry } from '../game/types';
import {
  insertHighscoreSorted,
  isHighscoreForEntries,
  loadHighscoresByDifficulty,
  pruneHighscores,
  saveHighscoresByDifficulty
} from './useLocalHighscores';

type StorageMock = {
  getItem: ReturnType<typeof vi.fn<(key: string) => string | null>>;
  setItem: ReturnType<typeof vi.fn<(key: string, value: string) => void>>;
  clear: ReturnType<typeof vi.fn<() => void>>;
};

let storage: StorageMock;

const makeEntry = (
  name: string,
  difficulty: DifficultyLevel,
  distanceM: number,
  playedAtIso: string,
  extra: Partial<HighscoreEntry> = {}
): HighscoreEntry => ({
  id: `${difficulty}-${name}-${distanceM}`,
  name,
  difficulty,
  distanceM,
  playedAtIso,
  locale: 'fi',
  windMs: 0,
  ...extra
});

beforeEach(() => {
  const store = new Map<string, string>();
  storage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    clear: vi.fn(() => {
      store.clear();
    })
  };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage
  });
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('highscore helpers', () => {
  it('inserts entries sorted by distance desc', () => {
    const list = [
      makeEntry('A', 'rookie', 72.1, '2026-02-21T09:00:00.000Z'),
      makeEntry('B', 'rookie', 66.3, '2026-02-21T09:01:00.000Z')
    ];
    const next = insertHighscoreSorted(
      list,
      makeEntry('C', 'rookie', 78.5, '2026-02-21T09:02:00.000Z')
    );
    expect(next.map((entry) => entry.name)).toEqual(['C', 'A', 'B']);
  });

  it('breaks ties with earliest timestamp first', () => {
    const list = [makeEntry('A', 'rookie', 70, '2026-02-21T10:00:00.000Z')];
    const next = insertHighscoreSorted(list, makeEntry('B', 'rookie', 70, '2026-02-21T09:00:00.000Z'));
    expect(next[0].name).toBe('B');
  });

  it('prunes to max size', () => {
    const list = Array.from({ length: 15 }, (_, index) =>
      makeEntry(
        `${index}`,
        'rookie',
        95 - index,
        `2026-02-21T09:${String(index).padStart(2, '0')}:00.000Z`
      )
    );
    expect(pruneHighscores(list, 10)).toHaveLength(10);
  });

  it('evaluates highscore threshold from current board only', () => {
    const rookieBoard = Array.from({ length: 10 }, (_, index) =>
      makeEntry(
        `R${index}`,
        'rookie',
        100 - index,
        `2026-02-21T09:${String(index).padStart(2, '0')}:00.000Z`
      )
    );
    const eliteBoard = Array.from({ length: 2 }, (_, index) =>
      makeEntry(
        `E${index}`,
        'elite',
        70 - index,
        `2026-02-21T10:${String(index).padStart(2, '0')}:00.000Z`
      )
    );

    expect(isHighscoreForEntries(rookieBoard, 91.5)).toBe(true);
    expect(isHighscoreForEntries(rookieBoard, 89.5)).toBe(false);
    expect(isHighscoreForEntries(eliteBoard, 69.5)).toBe(true);
  });

  it('returns empty buckets when storage getter throws', () => {
    storage.getItem.mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(loadHighscoresByDifficulty()).toEqual({
      rookie: [],
      pro: [],
      elite: []
    });
  });

  it('ignores malformed and invalid stored entries while preserving valid optional specs', () => {
    const valid = makeEntry('AAA', 'pro', 75.2, '2026-02-21T09:10:00.000Z', {
      windMs: -0.8,
      launchSpeedMs: 31.4,
      angleDeg: 36
    });
    localStorage.setItem(
      HIGHSCORE_STORAGE_KEY,
      JSON.stringify({
        rookie: [],
        pro: [
          valid,
          { ...valid, difficulty: 'invalid' },
          { ...valid, distanceM: Number.NaN },
          { ...valid, playedAtIso: 'not-a-date' },
          { ...valid, locale: 'xx' },
          { ...valid, windMs: Number.POSITIVE_INFINITY },
          { ...valid, launchSpeedMs: Number.POSITIVE_INFINITY },
          { ...valid, angleDeg: Number.NaN }
        ],
        elite: []
      })
    );

    const loaded = loadHighscoresByDifficulty();
    expect(loaded.pro).toEqual([valid]);
    expect(loaded.rookie).toEqual([]);
    expect(loaded.elite).toEqual([]);
  });

  it('migrates legacy v1 scores into rookie bucket in v2 storage', () => {
    const legacy = [
      {
        id: 'legacy-1',
        name: 'AAA',
        distanceM: 82.2,
        playedAtIso: '2026-02-21T09:10:00.000Z',
        locale: 'en',
        windMs: 0.4
      }
    ];
    localStorage.setItem(HIGHSCORE_STORAGE_KEY_LEGACY, JSON.stringify(legacy));

    const loaded = loadHighscoresByDifficulty();

    expect(loaded.rookie).toHaveLength(1);
    expect(loaded.rookie[0].difficulty).toBe('rookie');
    expect(loaded.pro).toEqual([]);
    expect(loaded.elite).toEqual([]);
    expect(storage.setItem).toHaveBeenCalledWith(HIGHSCORE_STORAGE_KEY, expect.any(String));
  });

  it('swallows storage setter errors', () => {
    storage.setItem.mockImplementation(() => {
      throw new Error('quota');
    });

    expect(() =>
      saveHighscoresByDifficulty({
        rookie: [makeEntry('A', 'rookie', 70, '2026-02-21T10:00:00.000Z')],
        pro: [],
        elite: []
      })
    ).not.toThrow();
  });
});
