export const BLOCKLISTED_NAME_TRIGRAMS = [
  'ASS',
  'CUM',
  'FUC',
  'FUK',
  'KKK',
  'NIG',
  'SEX',
  'XXX'
] as const;

const blockedNameSet = new Set<string>(BLOCKLISTED_NAME_TRIGRAMS);

export type PlayerNameValidationError = 'length' | 'blocked';

export const normalizePlayerNameInput = (value: string): string =>
  value
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3);

export const isBlockedPlayerName = (value: string): boolean =>
  blockedNameSet.has(normalizePlayerNameInput(value));

export const validatePlayerName = (value: string): PlayerNameValidationError | null => {
  const normalized = normalizePlayerNameInput(value);
  if (normalized.length !== 3) {
    return 'length';
  }
  if (blockedNameSet.has(normalized)) {
    return 'blocked';
  }
  return null;
};
