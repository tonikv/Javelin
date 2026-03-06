import {
  BLOCKLISTED_NAME_TRIGRAMS,
  type PlayerNameValidationError,
  normalizePlayerName,
  validatePlayerName
} from './leaderboardContract';

export { BLOCKLISTED_NAME_TRIGRAMS, validatePlayerName };
export type { PlayerNameValidationError };

export const normalizePlayerNameInput = normalizePlayerName;

export const isBlockedPlayerName = (value: string): boolean =>
  validatePlayerName(value) === 'blocked';
