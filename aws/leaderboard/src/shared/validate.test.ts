import { describe, expect, it } from 'vitest';
import {
  ValidationError,
  decodeRequestBody,
  parseGetLeaderboardInput,
  parsePostScoreInput
} from './validate';

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
    expect(() => parseGetLeaderboardInput({ difficulty: 'nightmare' })).toThrowError(
      ValidationError
    );
  });

  it('rejects non-integer limits', () => {
    expect(() => parseGetLeaderboardInput({ difficulty: 'rookie', limit: '2.2' })).toThrowError(
      ValidationError
    );
  });
});

describe('parsePostScoreInput', () => {
  it('parses valid score payload', () => {
    const parsed = parsePostScoreInput(
      JSON.stringify({
        difficulty: 'elite',
        playerName: 'ADA',
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
      playerName: 'ADA',
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

  it('rejects non-matching playerName pattern', () => {
    expect(() =>
      parsePostScoreInput(
        JSON.stringify({
          difficulty: 'pro',
          playerName: 'Ada',
          distanceMm: 51234,
          playedAt: '2026-03-05T09:00:00.000Z'
        })
      )
    ).toThrowError(ValidationError);
  });

  it('rejects blocked player names', () => {
    expect(() =>
      parsePostScoreInput(
        JSON.stringify({
          difficulty: 'pro',
          playerName: 'ASS',
          distanceMm: 51234,
          playedAt: '2026-03-05T09:00:00.000Z'
        })
      )
    ).toThrowError(ValidationError);
  });

  it('rejects out-of-range distance', () => {
    expect(() =>
      parsePostScoreInput(
        JSON.stringify({
          difficulty: 'rookie',
          playerName: 'AAA',
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

describe('decodeRequestBody', () => {
  it('rejects oversized plain request bodies', () => {
    expect(() => decodeRequestBody('x'.repeat(1025), false)).toThrowError(ValidationError);
  });

  it('rejects oversized base64 request bodies', () => {
    const encoded = Buffer.from('x'.repeat(1025), 'utf8').toString('base64');
    expect(() => decodeRequestBody(encoded, true)).toThrowError(ValidationError);
  });
});
