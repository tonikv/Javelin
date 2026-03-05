import type { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { difficulties, type Difficulty, type NewScoreInput, type ScoreItem } from './model';
import { isBlockedPlayerName } from './nameModeration';

const difficultySet = new Set<Difficulty>(difficulties);

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const CLIENT_VERSION_MAX_LENGTH = 32;
const COUNTRY_MAX_LENGTH = 8;
const LOCALE_MAX_LENGTH = 12;
const PLAYER_NAME_PATTERN = /^[A-Z]{3}$/;

const DISTANCE_MIN_MM = 0;
const DISTANCE_MAX_MM = 130000;

const ANGLE_MIN_CDEG = 0;
const ANGLE_MAX_CDEG = 9000;

const SPEED_MIN_CMS = 0;
const SPEED_MAX_CMS = 4500;

const WIND_MIN_MS = -30;
const WIND_MAX_MS = 30;

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

const cleanText = (value: string): string => value.replace(/[\u0000-\u001F\u007F]/g, '').trim();

const parseRequiredDifficulty = (value: unknown): Difficulty => {
  if (typeof value !== 'string' || !difficultySet.has(value as Difficulty)) {
    throw toValidationError('difficulty', `must be one of ${difficulties.join(', ')}`);
  }
  return value as Difficulty;
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

const parseOptionalString = (value: unknown, field: string, maxLength: number): string | undefined => {
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

const parseOptionalInteger = (value: unknown, field: string, min: number, max: number): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return parseRequiredInteger(value, field, min, max);
};

const parseOptionalNumber = (value: unknown, field: string, min: number, max: number): number | undefined => {
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
      limit: DEFAULT_LIMIT
    };
  }

  const limit = Number(rawLimit);
  if (!Number.isInteger(limit)) {
    throw toValidationError('limit', 'must be an integer');
  }
  if (limit < 1 || limit > MAX_LIMIT) {
    throw toValidationError('limit', `must be between 1 and ${MAX_LIMIT}`);
  }

  return {
    difficulty,
    limit
  };
};

export const decodeRequestBody = (body: string | null | undefined, isBase64Encoded: boolean): string => {
  if (!body) {
    throw new ValidationError('Request body is required');
  }
  if (!isBase64Encoded) {
    return body;
  }
  return Buffer.from(body, 'base64').toString('utf8');
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
  const distanceMm = parseRequiredInteger(payload.distanceMm, 'distanceMm', DISTANCE_MIN_MM, DISTANCE_MAX_MM);
  const playedAt = parsePlayedAt(payload.playedAt);

  return {
    difficulty,
    playerName,
    distanceMm,
    playedAt,
    clientVersion: parseOptionalString(payload.clientVersion, 'clientVersion', CLIENT_VERSION_MAX_LENGTH),
    windMs: parseOptionalNumber(payload.windMs, 'windMs', WIND_MIN_MS, WIND_MAX_MS),
    windZMs: parseOptionalNumber(payload.windZMs, 'windZMs', WIND_MIN_MS, WIND_MAX_MS),
    launchSpeedCms: parseOptionalInteger(payload.launchSpeedCms, 'launchSpeedCms', SPEED_MIN_CMS, SPEED_MAX_CMS),
    angleCdeg: parseOptionalInteger(payload.angleCdeg, 'angleCdeg', ANGLE_MIN_CDEG, ANGLE_MAX_CDEG),
    country: parseOptionalString(payload.country, 'country', COUNTRY_MAX_LENGTH),
    locale: parseOptionalString(payload.locale, 'locale', LOCALE_MAX_LENGTH)
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

const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === 'string' && difficultySet.has(value as Difficulty);

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
