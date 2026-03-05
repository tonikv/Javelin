import { describe, expect, it } from 'vitest';
import {
  createPostGlobalScorePayload,
  parseGlobalLeaderboardEntries,
  resolveGlobalLeaderboardApiBase
} from './globalLeaderboardApi';

describe('resolveGlobalLeaderboardApiBase', () => {
  it('returns null when missing', () => {
    expect(resolveGlobalLeaderboardApiBase(undefined)).toBeNull();
    expect(resolveGlobalLeaderboardApiBase('')).toBeNull();
    expect(resolveGlobalLeaderboardApiBase('   ')).toBeNull();
  });

  it('trims and strips trailing slash', () => {
    expect(resolveGlobalLeaderboardApiBase(' https://api.example.com/ ')).toBe('https://api.example.com');
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
});
