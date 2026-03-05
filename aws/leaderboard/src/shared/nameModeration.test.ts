import { describe, expect, it } from 'vitest';
import { isBlockedPlayerName, normalizePlayerName } from './nameModeration';

describe('backend name moderation', () => {
  it('normalizes input to trigram uppercase letters', () => {
    expect(normalizePlayerName('a1*bcd')).toBe('ABC');
  });

  it('detects blocked trigrams after normalization', () => {
    expect(isBlockedPlayerName('ass')).toBe(true);
    expect(isBlockedPlayerName('AAA')).toBe(false);
  });
});
