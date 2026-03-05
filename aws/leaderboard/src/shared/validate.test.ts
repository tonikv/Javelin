import { describe, expect, it } from 'vitest';
import { ValidationError, parseGetLeaderboardInput, parsePostScoreInput } from './validate';

describe('parseGetLeaderboardInput', () => {
  it('accepts valid difficulty and default limit', () => {
    expect(parseGetLeaderboardInput({ difficulty: 'elite' })).toEqual({
      difficulty: 'elite',
      limit: 10
    });
  });

  it('accepts explicit integer limit', () => {
    expect(parseGetLeaderboardInput({ difficulty: 'pro', limit: '25' })).toEqual({
      difficulty: 'pro',
      limit: 25
    });
  });

  it('rejects invalid difficulty', () => {
    expect(() => parseGetLeaderboardInput({ difficulty: 'nightmare' })).toThrowError(ValidationError);
  });

  it('rejects non-integer limits', () => {
    expect(() => parseGetLeaderboardInput({ difficulty: 'rookie', limit: '2.2' })).toThrowError(ValidationError);
  });
});

describe('parsePostScoreInput', () => {
  it('parses valid score payload', () => {
    const parsed = parsePostScoreInput(
      JSON.stringify({
        difficulty: 'elite',
        playerName: 'Ada',
        distanceMm: 82345,
        playedAt: '2026-03-04T12:00:00.000Z',
        clientVersion: '1.2.0',
        windMs: 1.2,
        windZMs: -0.5,
        launchSpeedCms: 3200,
        angleCdeg: 3600,
        country: 'FI',
        locale: 'fi-FI'
      })
    );

    expect(parsed).toEqual({
      difficulty: 'elite',
      playerName: 'Ada',
      distanceMm: 82345,
      playedAt: '2026-03-04T12:00:00.000Z',
      clientVersion: '1.2.0',
      windMs: 1.2,
      windZMs: -0.5,
      launchSpeedCms: 3200,
      angleCdeg: 3600,
      country: 'FI',
      locale: 'fi-FI'
    });
  });

  it('normalizes whitespace in player name', () => {
    const parsed = parsePostScoreInput(
      JSON.stringify({
        difficulty: 'pro',
        playerName: '   Ada    Lovelace  ',
        distanceMm: 51234,
        playedAt: '2026-03-05T09:00:00.000Z'
      })
    );

    expect(parsed.playerName).toBe('Ada Lovelace');
  });

  it('rejects out-of-range distance', () => {
    expect(() =>
      parsePostScoreInput(
        JSON.stringify({
          difficulty: 'rookie',
          playerName: 'Player',
          distanceMm: 999999,
          playedAt: '2026-03-04T12:00:00.000Z'
        })
      )
    ).toThrowError(ValidationError);
  });

  it('rejects invalid json body', () => {
    expect(() => parsePostScoreInput('not-json')).toThrowError(ValidationError);
  });
});
