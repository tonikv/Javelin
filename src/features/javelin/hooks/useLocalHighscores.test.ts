import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HIGHSCORE_STORAGE_KEY } from '../game/constants';
import {
  insertHighscoreSorted,
  loadHighscores,
  pruneHighscores,
  saveHighscores
} from './useLocalHighscores';
import type { HighscoreEntry } from '../game/types';

type StorageMock = {
  getItem: ReturnType<typeof vi.fn<(key: string) => string | null>>;
  setItem: ReturnType<typeof vi.fn<(key: string, value: string) => void>>;
  clear: ReturnType<typeof vi.fn<() => void>>;
};

let storage: StorageMock;

const makeEntry = (
  name: string,
  distanceM: number,
  playedAtIso: string,
  extra: Partial<HighscoreEntry> = {}
): HighscoreEntry => ({
  id: `${name}-${distanceM}`,
  name,
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
      makeEntry('A', 72.1, '2026-02-21T09:00:00.000Z'),
      makeEntry('B', 66.3, '2026-02-21T09:01:00.000Z')
    ];
    const next = insertHighscoreSorted(list, makeEntry('C', 78.5, '2026-02-21T09:02:00.000Z'));
    expect(next.map((entry) => entry.name)).toEqual(['C', 'A', 'B']);
  });

  it('breaks ties with earliest timestamp first', () => {
    const list = [makeEntry('A', 70, '2026-02-21T10:00:00.000Z')];
    const next = insertHighscoreSorted(list, makeEntry('B', 70, '2026-02-21T09:00:00.000Z'));
    expect(next[0].name).toBe('B');
  });

  it('prunes to max size', () => {
    const list = Array.from({ length: 15 }, (_, index) =>
      makeEntry(`${index}`, 95 - index, `2026-02-21T09:${String(index).padStart(2, '0')}:00.000Z`)
    );
    expect(pruneHighscores(list, 10)).toHaveLength(10);
  });

  it('returns empty when storage getter throws', () => {
    storage.getItem.mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(loadHighscores()).toEqual([]);
  });

  it('ignores malformed and invalid stored entries while preserving optional throw specs', () => {
    const valid = makeEntry('VALID', 75.2, '2026-02-21T09:10:00.000Z', {
      windMs: -0.8,
      launchSpeedMs: 31.4,
      angleDeg: 36
    });
    localStorage.setItem(
      HIGHSCORE_STORAGE_KEY,
      JSON.stringify([
        valid,
        { ...valid, distanceM: Number.NaN },
        { ...valid, playedAtIso: 'not-a-date' },
        { ...valid, locale: 'xx' },
        { ...valid, windMs: Number.POSITIVE_INFINITY },
        { ...valid, launchSpeedMs: Number.POSITIVE_INFINITY },
        { ...valid, angleDeg: Number.NaN }
      ])
    );

    expect(loadHighscores()).toEqual([valid]);
  });

  it('swallows storage setter errors', () => {
    storage.setItem.mockImplementation(() => {
      throw new Error('quota');
    });

    expect(() => saveHighscores([makeEntry('A', 70, '2026-02-21T10:00:00.000Z')])).not.toThrow();
  });
});
