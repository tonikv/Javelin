import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createPostGlobalScorePayload,
  fetchGlobalLeaderboard,
  GlobalLeaderboardApiError,
  parseGlobalLeaderboardEntries,
  resolveGlobalLeaderboardApiBase
} from './globalLeaderboardApi';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('resolveGlobalLeaderboardApiBase', () => {
  it('returns null when missing', () => {
    expect(resolveGlobalLeaderboardApiBase(undefined)).toBeNull();
    expect(resolveGlobalLeaderboardApiBase('')).toBeNull();
    expect(resolveGlobalLeaderboardApiBase('   ')).toBeNull();
  });

  it('trims and strips trailing slash', () => {
    expect(resolveGlobalLeaderboardApiBase(' https://api.example.com/ ')).toBe(
      'https://api.example.com'
    );
  });
});

describe('parseGlobalLeaderboardEntries', () => {
  it('maps valid items into local highscore entries', () => {
    const parsed = parseGlobalLeaderboardEntries({
      difficulty: 'pro',
      items: [
        {
          scoreId: 'score-a',
          playerName: 'Ada',
          difficulty: 'pro',
          distanceMm: 82345,
          playedAt: '2026-03-05T19:40:00.000Z',
          windMs: 1.2,
          launchSpeedCms: 3210,
          angleCdeg: 3650,
          locale: 'fi-FI'
        }
      ]
    });

    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toEqual({
      id: 'score-a',
      name: 'Ada',
      difficulty: 'pro',
      distanceM: 82.345,
      playedAtIso: '2026-03-05T19:40:00.000Z',
      locale: 'fi',
      windMs: 1.2,
      launchSpeedMs: 32.1,
      angleDeg: 36.5
    });
  });

  it('filters malformed rows', () => {
    const parsed = parseGlobalLeaderboardEntries({
      difficulty: 'rookie',
      items: [
        { scoreId: 'missing-fields' },
        {
          scoreId: 'ok',
          playerName: 'Player',
          difficulty: 'rookie',
          distanceMm: 70000,
          playedAt: '2026-03-05T19:40:00.000Z'
        }
      ]
    });

    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.id).toBe('ok');
  });
});

describe('createPostGlobalScorePayload', () => {
  it('converts frontend units to backend units', () => {
    const payload = createPostGlobalScorePayload({
      difficulty: 'elite',
      playerName: '  ADA  ',
      distanceM: 81.234,
      playedAtIso: '2026-03-05T19:40:00.000Z',
      windMs: 1.25,
      windZMs: -0.4,
      launchSpeedMs: 31.2,
      angleDeg: 35.25,
      locale: 'en',
      clientVersion: '0.1.0'
    });

    expect(payload).toEqual({
      difficulty: 'elite',
      playerName: 'ADA',
      distanceMm: 81234,
      playedAt: '2026-03-05T19:40:00.000Z',
      windMs: 1.25,
      windZMs: -0.4,
      launchSpeedCms: 3120,
      angleCdeg: 3525,
      locale: 'en',
      clientVersion: '0.1.0'
    });
  });

  it('throws typed error for invalid player names', () => {
    expect(() =>
      createPostGlobalScorePayload({
        difficulty: 'elite',
        playerName: '***',
        distanceM: 70,
        playedAtIso: '2026-03-05T19:40:00.000Z',
        windMs: 0,
        locale: 'en'
      })
    ).toThrowError(GlobalLeaderboardApiError);
  });
});

describe('fetchGlobalLeaderboard', () => {
  it('maps bad payloads to invalid-response error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ bad: 'shape' })
      } as Response)
    );

    await expect(
      fetchGlobalLeaderboard({ difficulty: 'pro', apiBase: 'https://api.example.com' })
    ).rejects.toSatisfy((error) => {
      expect(error).toBeInstanceOf(Error);
      const candidate = error as { code?: string };
      expect(candidate.code).toBe('invalid-response');
      return true;
    });
  });

  it('exposes status for http errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429
      } as Response)
    );

    await expect(
      fetchGlobalLeaderboard({ difficulty: 'elite', apiBase: 'https://api.example.com' })
    ).rejects.toSatisfy((error) => {
      expect(error).toBeInstanceOf(Error);
      const candidate = error as { code?: string; status?: number };
      expect(candidate.code).toBe('http');
      expect(candidate.status).toBe(429);
      return true;
    });
  });
});
