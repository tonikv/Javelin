import { MAX_HIGHSCORES } from '../game/constants';
import type { DifficultyLevel, HighscoreEntry, Locale } from '../game/types';
import { normalizePlayerNameInput, validatePlayerName } from './nameModeration';

export const leaderboardDifficulties = ['rookie', 'pro', 'elite'] as const satisfies readonly DifficultyLevel[];

export type LeaderboardDifficulty = DifficultyLevel;

export type FetchGlobalLeaderboardInput = {
  difficulty: LeaderboardDifficulty;
  limit?: number;
};

export type PostGlobalScoreInput = {
  difficulty: LeaderboardDifficulty;
  playerName: string;
  distanceM: number;
  playedAtIso: string;
  windMs: number;
  windZMs?: number;
  launchSpeedMs?: number;
  angleDeg?: number;
  locale: Locale;
  clientVersion?: string;
};

type GlobalLeaderboardApiPayload = {
  difficulty?: unknown;
  items: unknown;
};

type GlobalLeaderboardItemRecord = Record<string, unknown>;

const compareHighscores = (a: HighscoreEntry, b: HighscoreEntry): number => {
  if (b.distanceM !== a.distanceM) {
    return b.distanceM - a.distanceM;
  }
  return a.playedAtIso.localeCompare(b.playedAtIso);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const difficultySet = new Set<LeaderboardDifficulty>(leaderboardDifficulties);

const toDifficultyOrNull = (value: unknown): LeaderboardDifficulty | null => {
  if (typeof value !== 'string') {
    return null;
  }
  return difficultySet.has(value as LeaderboardDifficulty) ? (value as LeaderboardDifficulty) : null;
};

const toFiniteNumberOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const toOptionalFiniteNumber = (value: unknown): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return toFiniteNumberOrNull(value) ?? undefined;
};

const toLocale = (value: unknown): Locale => {
  if (typeof value !== 'string') {
    return 'en';
  }
  const normalized = value.toLowerCase();
  if (normalized.startsWith('fi')) {
    return 'fi';
  }
  if (normalized.startsWith('sv')) {
    return 'sv';
  }
  if (normalized.startsWith('en')) {
    return 'en';
  }
  return 'en';
};

const parseGlobalLeaderboardItem = (
  value: unknown,
  fallbackDifficulty: LeaderboardDifficulty | null
): HighscoreEntry | null => {
  if (!isRecord(value)) {
    return null;
  }

  const raw = value as GlobalLeaderboardItemRecord;
  if (typeof raw.scoreId !== 'string' || typeof raw.playerName !== 'string' || typeof raw.playedAt !== 'string') {
    return null;
  }

  const parsedPlayedAt = Date.parse(raw.playedAt);
  if (Number.isNaN(parsedPlayedAt)) {
    return null;
  }

  const distanceMm = toFiniteNumberOrNull(raw.distanceMm);
  if (distanceMm === null || distanceMm < 0) {
    return null;
  }

  const launchSpeedCms = toOptionalFiniteNumber(raw.launchSpeedCms);
  const angleCdeg = toOptionalFiniteNumber(raw.angleCdeg);
  const windMs = toOptionalFiniteNumber(raw.windMs) ?? 0;
  const difficulty = toDifficultyOrNull(raw.difficulty) ?? fallbackDifficulty;
  if (difficulty === null) {
    return null;
  }

  return {
    id: raw.scoreId,
    name: raw.playerName,
    difficulty,
    distanceM: distanceMm / 1000,
    playedAtIso: new Date(parsedPlayedAt).toISOString(),
    locale: toLocale(raw.locale),
    windMs,
    launchSpeedMs: launchSpeedCms === undefined ? undefined : launchSpeedCms / 100,
    angleDeg: angleCdeg === undefined ? undefined : angleCdeg / 100
  };
};

export const parseGlobalLeaderboardEntries = (payload: unknown): HighscoreEntry[] => {
  if (!isRecord(payload)) {
    throw new Error('Global leaderboard response must be an object');
  }

  const castPayload = payload as GlobalLeaderboardApiPayload;
  if (!Array.isArray(castPayload.items)) {
    throw new Error('Global leaderboard response items must be an array');
  }
  const payloadDifficulty = toDifficultyOrNull(castPayload.difficulty);

  return castPayload.items
    .map((item) => parseGlobalLeaderboardItem(item, payloadDifficulty))
    .filter((entry): entry is HighscoreEntry => entry !== null)
    .sort(compareHighscores)
    .slice(0, MAX_HIGHSCORES);
};

export const resolveGlobalLeaderboardApiBase = (raw: string | undefined): string | null => {
  if (typeof raw !== 'string') {
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return trimmed.replace(/\/+$/g, '');
};

export const getGlobalLeaderboardApiBase = (): string | null =>
  resolveGlobalLeaderboardApiBase(import.meta.env.VITE_LEADERBOARD_API_BASE);

const createHttpError = (status: number): Error => new Error(`Global leaderboard API request failed with ${status}`);

export const createPostGlobalScorePayload = (input: PostGlobalScoreInput): Record<string, unknown> => {
  const normalizedPlayerName = normalizePlayerNameInput(input.playerName);
  const nameValidationError = validatePlayerName(normalizedPlayerName);
  if (nameValidationError !== null) {
    throw new Error(`Invalid player name: ${nameValidationError}`);
  }

  return {
    difficulty: input.difficulty,
    playerName: normalizedPlayerName,
    distanceMm: Math.max(0, Math.round(input.distanceM * 1000)),
    playedAt: new Date(input.playedAtIso).toISOString(),
    windMs: input.windMs,
    windZMs: input.windZMs,
    launchSpeedCms: input.launchSpeedMs === undefined ? undefined : Math.round(input.launchSpeedMs * 100),
    angleCdeg: input.angleDeg === undefined ? undefined : Math.round(input.angleDeg * 100),
    locale: input.locale,
    clientVersion: input.clientVersion
  };
};

export const fetchGlobalLeaderboard = async (input: FetchGlobalLeaderboardInput): Promise<HighscoreEntry[]> => {
  const apiBase = getGlobalLeaderboardApiBase();
  if (apiBase === null) {
    throw new Error('Global leaderboard API base is not configured');
  }

  const limit = Math.max(1, Math.min(input.limit ?? MAX_HIGHSCORES, MAX_HIGHSCORES));
  const url = new URL(`${apiBase}/leaderboard`);
  url.searchParams.set('difficulty', input.difficulty);
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw createHttpError(response.status);
  }

  const payload = (await response.json()) as unknown;
  return parseGlobalLeaderboardEntries(payload);
};

export const postGlobalScore = async (input: PostGlobalScoreInput): Promise<void> => {
  const apiBase = getGlobalLeaderboardApiBase();
  if (apiBase === null) {
    throw new Error('Global leaderboard API base is not configured');
  }

  const response = await fetch(`${apiBase}/leaderboard`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify(createPostGlobalScorePayload(input))
  });

  if (!response.ok) {
    throw createHttpError(response.status);
  }
};
