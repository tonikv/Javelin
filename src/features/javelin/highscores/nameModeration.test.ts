import { describe, expect, it } from 'vitest';
import { normalizePlayerNameInput, validatePlayerName } from './nameModeration';

describe('name moderation', () => {
  it('normalizes to uppercase letters only and trims to 3 chars', () => {
    expect(normalizePlayerNameInput('a1*bcd')).toBe('ABC');
    expect(normalizePlayerNameInput('äöåabc')).toBe('ABC');
  });

  it('requires exactly 3 letters', () => {
    expect(validatePlayerName('AB')).toBe('length');
    expect(validatePlayerName('ABCD')).toBeNull();
    expect(validatePlayerName(normalizePlayerNameInput('ABCD'))).toBeNull();
  });

  it('rejects blocked trigrams', () => {
    expect(validatePlayerName('ass')).toBe('blocked');
    expect(validatePlayerName('FUK')).toBe('blocked');
    expect(validatePlayerName('AAA')).toBeNull();
  });
});
