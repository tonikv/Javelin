import { describe, expect, it } from 'vitest';
import {
  isBlockedPlayerName,
  isLeaderboardDifficulty,
  normalizePlayerName,
  validatePlayerName
} from './leaderboardContract';

describe('leaderboardContract', () => {
  it('validates known difficulties', () => {
    expect(isLeaderboardDifficulty('rookie')).toBe(true);
    expect(isLeaderboardDifficulty('pro')).toBe(true);
    expect(isLeaderboardDifficulty('elite')).toBe(true);
    expect(isLeaderboardDifficulty('nightmare')).toBe(false);
  });

  it('normalizes and validates player names', () => {
    expect(normalizePlayerName('a1*bcd')).toBe('ABC');
    expect(validatePlayerName('AB')).toBe('length');
    expect(validatePlayerName('ass')).toBe('blocked');
    expect(validatePlayerName('AAA')).toBeNull();
  });

  it('detects blocked names after normalization', () => {
    expect(isBlockedPlayerName('fuk')).toBe(true);
    expect(isBlockedPlayerName('abc')).toBe(false);
  });
});
