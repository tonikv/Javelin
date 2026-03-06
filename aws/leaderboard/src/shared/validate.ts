import type { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import {
  LEADERBOARD_LIMITS,
  PLAYER_NAME_PATTERN,
  isBlockedPlayerName,
  isLeaderboardDifficulty,
  leaderboardDifficulties
} from './leaderboardContract';
import type { Difficulty, NewScoreInput, ScoreItem } from './model';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const toValidationError = (field: string, message: string): ValidationError =>
  new ValidationError(`Invalid ${field}: ${message}`);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const cleanText = (value: string): string => {
  let result = '';
  for (const char of value) {
    const code = char.charCodeAt(0);
    if ((code >= 0x00 && code <= 0x1f) || code === 0x7f) {
      continue;
    }
    result += char;
  }
  return result.trim();
};

const parseRequiredDifficulty = (value: unknown): Difficulty => {
  if (!isLeaderboardDifficulty(value)) {
    throw toValidationError('difficulty', `must be one of ${leaderboardDifficulties.join(', ')}`);
  }
  return value;
};

const parsePlayerName = (value: unknown): string => {
  if (typeof value !== 'string') {
    throw toValidationError('playerName', 'must be a string');
  }
  const cleaned = cleanText(value);
  if (!PLAYER_NAME_PATTERN.test(cleaned)) {
    throw toValidationError('playerName', 'must match ^[A-Z]{3}$');
  }
  if (isBlockedPlayerName(cleaned)) {
    throw toValidationError('playerName', 'is not allowed');
  }
  return cleaned;
};

const parseOptionalString = (
  value: unknown,
  field: string,
  maxLength: number
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw toValidationError(field, 'must be a string');
  }
  const cleaned = cleanText(value);
  if (cleaned.length === 0) {
    return undefined;
  }
  if (cleaned.length > maxLength) {
    throw toValidationError(field, `must be at most ${maxLength} characters`);
  }
  return cleaned;
};

const parseRequiredInteger = (value: unknown, field: string, min: number, max: number): number => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw toValidationError(field, 'must be an integer');
  }
  if (value < min || value > max) {
    throw toValidationError(field, `must be between ${min} and ${max}`);
  }
  return value;
};

const parseOptionalInteger = (
  value: unknown,
  field: string,
  min: number,
  max: number
): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return parseRequiredInteger(value, field, min, max);
};

const parseOptionalNumber = (
  value: unknown,
  field: string,
  min: number,
  max: number
): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw toValidationError(field, 'must be a finite number');
  }
  if (value < min || value > max) {
    throw toValidationError(field, `must be between ${min} and ${max}`);
  }
  return value;
};

const parsePlayedAt = (value: unknown): string => {
  if (typeof value !== 'string') {
    throw toValidationError('playedAt', 'must be a string');
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    throw toValidationError('playedAt', 'must be a valid ISO timestamp');
  }
  return new Date(parsed).toISOString();
};

export type GetLeaderboardInput = {
  difficulty: Difficulty;
  limit: number;
};

export const parseGetLeaderboardInput = (
  query: APIGatewayProxyEventQueryStringParameters | undefined
): GetLeaderboardInput => {
  const difficulty = parseRequiredDifficulty(query?.difficulty);
  const rawLimit = query?.limit;
  if (rawLimit === undefined || rawLimit.length === 0) {
    return {
      difficulty,
      limit: LEADERBOARD_LIMITS.defaultFetchLimit
    };
  }

  const limit = Number(rawLimit);
  if (!Number.isInteger(limit)) {
    throw toValidationError('limit', 'must be an integer');
  }
  if (limit < 1 || limit > LEADERBOARD_LIMITS.maxFetchLimit) {
    throw toValidationError('limit', `must be between 1 and ${LEADERBOARD_LIMITS.maxFetchLimit}`);
  }

  return {
    difficulty,
    limit
  };
};

export const decodeRequestBody = (
  body: string | null | undefined,
  isBase64Encoded: boolean
): string => {
  if (!body) {
    throw new ValidationError('Request body is required');
  }
  const decoded = isBase64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body;
  if (Buffer.byteLength(decoded, 'utf8') > LEADERBOARD_LIMITS.requestBodyMaxBytes) {
    throw new ValidationError(
      `Request body must be at most ${LEADERBOARD_LIMITS.requestBodyMaxBytes} bytes`
    );
  }
  return decoded;
};

export const parsePostScoreInput = (rawBody: string): NewScoreInput => {
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    throw new ValidationError('Request body must be valid JSON');
  }

  if (!isRecord(payload)) {
    throw new ValidationError('Request body must be an object');
  }

  const difficulty = parseRequiredDifficulty(payload.difficulty);
  const playerName = parsePlayerName(payload.playerName);
  const distanceMm = parseRequiredInteger(
    payload.distanceMm,
    'distanceMm',
    LEADERBOARD_LIMITS.distanceMm.min,
    LEADERBOARD_LIMITS.distanceMm.max
  );
  const playedAt = parsePlayedAt(payload.playedAt);

  return {
    difficulty,
    playerName,
    distanceMm,
    playedAt,
    clientVersion: parseOptionalString(
      payload.clientVersion,
      'clientVersion',
      LEADERBOARD_LIMITS.clientVersionMaxLength
    ),
    windMs: parseOptionalNumber(
      payload.windMs,
      'windMs',
      LEADERBOARD_LIMITS.windMs.min,
      LEADERBOARD_LIMITS.windMs.max
    ),
    windZMs: parseOptionalNumber(
      payload.windZMs,
      'windZMs',
      LEADERBOARD_LIMITS.windMs.min,
      LEADERBOARD_LIMITS.windMs.max
    ),
    launchSpeedCms: parseOptionalInteger(
      payload.launchSpeedCms,
      'launchSpeedCms',
      LEADERBOARD_LIMITS.speedCms.min,
      LEADERBOARD_LIMITS.speedCms.max
    ),
    angleCdeg: parseOptionalInteger(
      payload.angleCdeg,
      'angleCdeg',
      LEADERBOARD_LIMITS.angleCdeg.min,
      LEADERBOARD_LIMITS.angleCdeg.max
    ),
    country: parseOptionalString(payload.country, 'country', LEADERBOARD_LIMITS.countryMaxLength),
    locale: parseOptionalString(payload.locale, 'locale', LEADERBOARD_LIMITS.localeMaxLength)
  };
};

const readNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const readString = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const parseStoredOptionalString = (value: unknown): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'string' ? value : undefined;
};

const parseStoredOptionalNumber = (value: unknown): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
};

const isDifficulty = (value: unknown): value is Difficulty => isLeaderboardDifficulty(value);

const parseStoredItem = (value: unknown): ScoreItem | null => {
  if (!isRecord(value)) {
    return null;
  }

  if (!isDifficulty(value.difficulty)) {
    return null;
  }

  const scoreId = readString(value.scoreId);
  const playerName = readString(value.playerName);
  const playedAt = readString(value.playedAt);
  const distanceMm = readNumber(value.distanceMm);

  if (!scoreId || !playerName || !playedAt || distanceMm === null) {
    return null;
  }

  return {
    scoreId,
    difficulty: value.difficulty,
    playerName,
    distanceMm,
    playedAt,
    clientVersion: parseStoredOptionalString(value.clientVersion),
    windMs: parseStoredOptionalNumber(value.windMs),
    windZMs: parseStoredOptionalNumber(value.windZMs),
    launchSpeedCms: parseStoredOptionalNumber(value.launchSpeedCms),
    angleCdeg: parseStoredOptionalNumber(value.angleCdeg),
    country: parseStoredOptionalString(value.country),
    locale: parseStoredOptionalString(value.locale)
  };
};

export const parseStoredItems = (items: unknown[]): ScoreItem[] =>
  items.map(parseStoredItem).filter((item): item is ScoreItem => item !== null);
