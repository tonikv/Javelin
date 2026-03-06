export const leaderboardDifficulties = ['rookie', 'pro', 'elite'] as const;

export type LeaderboardDifficulty = (typeof leaderboardDifficulties)[number];

const leaderboardDifficultySet = new Set<LeaderboardDifficulty>(leaderboardDifficulties);

export const isLeaderboardDifficulty = (value: unknown): value is LeaderboardDifficulty =>
  typeof value === 'string' && leaderboardDifficultySet.has(value as LeaderboardDifficulty);

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

export const PLAYER_NAME_PATTERN = /^[A-Z]{3}$/;

export type PlayerNameValidationError = 'length' | 'blocked';

export const normalizePlayerName = (value: string): string =>
  value
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3);

export const isBlockedPlayerName = (value: string): boolean =>
  blockedNameSet.has(normalizePlayerName(value));

export const validatePlayerName = (value: string): PlayerNameValidationError | null => {
  const normalized = normalizePlayerName(value);
  if (normalized.length !== 3) {
    return 'length';
  }
  if (blockedNameSet.has(normalized)) {
    return 'blocked';
  }
  return null;
};

export const LEADERBOARD_LIMITS = {
  defaultFetchLimit: 10,
  maxFetchLimit: 50,
  distanceMm: {
    min: 0,
    max: 130000
  },
  angleCdeg: {
    min: 0,
    max: 9000
  },
  speedCms: {
    min: 0,
    max: 4500
  },
  windMs: {
    min: -30,
    max: 30
  },
  clientVersionMaxLength: 32,
  countryMaxLength: 8,
  localeMaxLength: 12
} as const;
