import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DIFFICULTY_UNLOCK_STORAGE_KEY } from '../game/constants';
import {
  DEFAULT_DIFFICULTY_UNLOCKS,
  applyDifficultyUnlockProgress,
  loadDifficultyUnlocks,
  saveDifficultyUnlocks
} from './useDifficultyUnlocks';

beforeEach(() => {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      clear: vi.fn(() => store.clear())
    }
  });
  localStorage.clear();
});

describe('difficulty unlock progression', () => {
  it('defaults to rookie unlocked only', () => {
    expect(loadDifficultyUnlocks()).toEqual(DEFAULT_DIFFICULTY_UNLOCKS);
  });

  it('unlocks pro from rookie only on valid throws over 90m', () => {
    const noUnlock = applyDifficultyUnlockProgress(DEFAULT_DIFFICULTY_UNLOCKS, 'rookie', 90, true);
    expect(noUnlock.pro).toBe(false);

    const unlocked = applyDifficultyUnlockProgress(DEFAULT_DIFFICULTY_UNLOCKS, 'rookie', 90.01, true);
    expect(unlocked.pro).toBe(true);
  });

  it('unlocks elite from pro only on valid throws over 90m', () => {
    const withPro = { ...DEFAULT_DIFFICULTY_UNLOCKS, pro: true };
    const noUnlock = applyDifficultyUnlockProgress(withPro, 'pro', 88, true);
    expect(noUnlock.elite).toBe(false);

    const unlocked = applyDifficultyUnlockProgress(withPro, 'pro', 95, true);
    expect(unlocked.elite).toBe(true);
  });

  it('does not unlock on invalid throws', () => {
    const next = applyDifficultyUnlockProgress(DEFAULT_DIFFICULTY_UNLOCKS, 'rookie', 120, false);
    expect(next).toEqual(DEFAULT_DIFFICULTY_UNLOCKS);
  });

  it('parses valid stored unlock payload', () => {
    localStorage.setItem(
      DIFFICULTY_UNLOCK_STORAGE_KEY,
      JSON.stringify({ rookie: true, pro: true, elite: false })
    );
    expect(loadDifficultyUnlocks()).toEqual({ rookie: true, pro: true, elite: false });
  });

  it('can reset unlock payload to defaults', () => {
    saveDifficultyUnlocks({ rookie: true, pro: true, elite: true });
    saveDifficultyUnlocks(DEFAULT_DIFFICULTY_UNLOCKS);
    expect(loadDifficultyUnlocks()).toEqual(DEFAULT_DIFFICULTY_UNLOCKS);
  });
});
