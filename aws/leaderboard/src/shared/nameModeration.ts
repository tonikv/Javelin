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

export const normalizePlayerName = (value: string): string =>
  value
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3);

export const isBlockedPlayerName = (value: string): boolean =>
  blockedNameSet.has(normalizePlayerName(value));
