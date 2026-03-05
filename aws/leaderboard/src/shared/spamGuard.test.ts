import { describe, expect, it } from 'vitest';
import {
  buildSubmitGuardPutInput,
  hashClientSourceIp,
  isConditionalWriteFailure,
  resolveClientSourceIp
} from './spamGuard';

describe('spam guard helpers', () => {
  it('hashes source ip deterministically with salt', () => {
    const first = hashClientSourceIp('203.0.113.4', 'salt-a');
    const second = hashClientSourceIp('203.0.113.4', 'salt-a');
    const third = hashClientSourceIp('203.0.113.4', 'salt-b');

    expect(first).toHaveLength(64);
    expect(first).toBe(second);
    expect(first).not.toBe(third);
  });

  it('builds conditional guard write with cooldown expiry', () => {
    const input = buildSubmitGuardPutInput('GuardTable', 'client-key', 100, 10);

    expect(input.TableName).toBe('GuardTable');
    expect(input.Item).toEqual({
      clientKey: 'client-key',
      expiresAtEpoch: 110
    });
    expect(input.ConditionExpression).toContain('attribute_not_exists(clientKey)');
    expect(input.ExpressionAttributeValues).toEqual({
      ':nowEpoch': 100
    });
  });

  it('detects conditional write failure errors', () => {
    expect(isConditionalWriteFailure({ name: 'ConditionalCheckFailedException' })).toBe(true);
    expect(isConditionalWriteFailure({ name: 'OtherError' })).toBe(false);
    expect(isConditionalWriteFailure(null)).toBe(false);
  });

  it('resolves source ip from request context', () => {
    const event = {
      requestContext: {
        http: {
          sourceIp: '198.51.100.7'
        }
      }
    } as const;
    expect(resolveClientSourceIp(event as never)).toBe('198.51.100.7');
  });
});
