import { useCallback, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../../app/browser';
import { DIFFICULTY_UNLOCK_STORAGE_KEY } from '../game/constants';
import { difficultyLevels, type DifficultyLevel } from '../game/types';

export type DifficultyUnlocks = Record<DifficultyLevel, boolean>;

export const DEFAULT_DIFFICULTY_UNLOCKS: DifficultyUnlocks = {
  rookie: true,
  pro: false,
  elite: false
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toUnlockFlag = (value: unknown): boolean | null => {
  if (typeof value !== 'boolean') {
    return null;
  }
  return value;
};

const parseDifficultyUnlocks = (value: unknown): DifficultyUnlocks | null => {
  if (!isRecord(value)) {
    return null;
  }

  const parsed: Partial<DifficultyUnlocks> = {};
  for (const difficulty of difficultyLevels) {
    const flag = toUnlockFlag(value[difficulty]);
    if (flag === null) {
      return null;
    }
    parsed[difficulty] = flag;
  }
  if (parsed.rookie !== true) {
    return null;
  }
  return parsed as DifficultyUnlocks;
};

export const loadDifficultyUnlocks = (): DifficultyUnlocks => {
  const raw = safeLocalStorageGet(DIFFICULTY_UNLOCK_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_DIFFICULTY_UNLOCKS;
  }
  try {
    const parsed = parseDifficultyUnlocks(JSON.parse(raw) as unknown);
    return parsed ?? DEFAULT_DIFFICULTY_UNLOCKS;
  } catch {
    return DEFAULT_DIFFICULTY_UNLOCKS;
  }
};

export const saveDifficultyUnlocks = (unlocks: DifficultyUnlocks): void => {
  safeLocalStorageSet(DIFFICULTY_UNLOCK_STORAGE_KEY, JSON.stringify(unlocks));
};

export const applyDifficultyUnlockProgress = (
  unlocks: DifficultyUnlocks,
  difficulty: DifficultyLevel,
  distanceM: number,
  isValidThrow: boolean
): DifficultyUnlocks => {
  if (!isValidThrow || distanceM <= 90) {
    return unlocks;
  }

  if (difficulty === 'rookie' && !unlocks.pro) {
    return {
      ...unlocks,
      pro: true
    };
  }

  if (difficulty === 'pro' && !unlocks.elite) {
    return {
      ...unlocks,
      elite: true
    };
  }

  return unlocks;
};

type RegisterThrowResultInput = {
  difficulty: DifficultyLevel;
  distanceM: number;
  isValidThrow: boolean;
};

type UseDifficultyUnlocksResult = {
  unlocks: DifficultyUnlocks;
  registerThrowResult: (input: RegisterThrowResultInput) => void;
  resetUnlocks: () => void;
};

export const useDifficultyUnlocks = (): UseDifficultyUnlocksResult => {
  const [unlocks, setUnlocks] = useState<DifficultyUnlocks>(loadDifficultyUnlocks);

  const registerThrowResult = useCallback((input: RegisterThrowResultInput) => {
    setUnlocks((previous) => {
      const next = applyDifficultyUnlockProgress(
        previous,
        input.difficulty,
        input.distanceM,
        input.isValidThrow
      );
      if (next !== previous) {
        saveDifficultyUnlocks(next);
      }
      return next;
    });
  }, []);

  const resetUnlocks = useCallback(() => {
    setUnlocks(DEFAULT_DIFFICULTY_UNLOCKS);
    saveDifficultyUnlocks(DEFAULT_DIFFICULTY_UNLOCKS);
  }, []);

  return {
    unlocks,
    registerThrowResult,
    resetUnlocks
  };
};
