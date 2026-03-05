import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn()
}));

vi.mock('./shared/dynamodb', () => ({
  documentClient: {
    send: sendMock
  }
}));

vi.mock('./shared/env', () => ({
  getTableName: () => 'JavelinScores',
  getGuardTableName: () => 'JavelinScoreSubmitGuard',
  getIpHashSalt: () => 'test-salt',
  getSubmitCooldownSeconds: () => 10
}));

import { handler } from './postLeaderboard';

const buildEvent = () =>
  ({
    body: JSON.stringify({
      difficulty: 'pro',
      playerName: 'AAA',
      distanceMm: 81234,
      playedAt: '2026-03-05T19:40:00.000Z'
    }),
    isBase64Encoded: false,
    requestContext: {
      http: {
        sourceIp: '198.51.100.42'
      }
    }
  }) as const;

describe('postLeaderboard handler spam protection', () => {
  beforeEach(() => {
    sendMock.mockReset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-05T20:00:00.000Z'));
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('accepts first submit and writes guard + score item', async () => {
    sendMock.mockResolvedValueOnce({});
    sendMock.mockResolvedValueOnce({});

    const response = await (handler as unknown as (event: unknown) => Promise<{ statusCode: number }>)(
      buildEvent()
    );

    expect(response.statusCode).toBe(201);
    expect(sendMock).toHaveBeenCalledTimes(2);

    const guardPut = sendMock.mock.calls[0][0] as PutCommand;
    const scorePut = sendMock.mock.calls[1][0] as PutCommand;

    expect(guardPut.input.TableName).toBe('JavelinScoreSubmitGuard');
    expect(guardPut.input.Item).toEqual({
      clientKey: expect.stringMatching(/^[a-f0-9]{64}$/),
      expiresAtEpoch: 1772740810
    });
    expect(guardPut.input.ConditionExpression).toContain('expiresAtEpoch < :nowEpoch');

    expect(scorePut.input.TableName).toBe('JavelinScores');
    expect(scorePut.input.Item).toMatchObject({
      difficulty: 'pro',
      playerName: 'AAA',
      distanceMm: 81234
    });
  });

  it('rejects immediate repeat submit with 429 when cooldown condition fails', async () => {
    sendMock.mockRejectedValueOnce({ name: 'ConditionalCheckFailedException' });

    const response = await (handler as unknown as (event: unknown) => Promise<{ statusCode: number; body?: string }>)(
      buildEvent()
    );

    expect(response.statusCode).toBe(429);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(response.body).toContain('TooManyRequests');
  });

  it('accepts submit after cooldown window', async () => {
    sendMock.mockResolvedValueOnce({});
    sendMock.mockResolvedValueOnce({});

    vi.setSystemTime(new Date('2026-03-05T20:00:11.000Z'));

    const response = await (handler as unknown as (event: unknown) => Promise<{ statusCode: number }>)(
      buildEvent()
    );

    expect(response.statusCode).toBe(201);
    expect(sendMock).toHaveBeenCalledTimes(2);
  });
});
