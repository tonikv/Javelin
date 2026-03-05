import { createHash } from 'node:crypto';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import type { PutCommandInput } from '@aws-sdk/lib-dynamodb';

export const resolveClientSourceIp = (event: APIGatewayProxyEventV2): string =>
  event.requestContext.http?.sourceIp ?? 'unknown';

export const hashClientSourceIp = (sourceIp: string, salt: string): string =>
  createHash('sha256')
    .update(`${salt}:${sourceIp}`)
    .digest('hex');

export const buildSubmitGuardPutInput = (
  guardTableName: string,
  clientKey: string,
  nowEpochSeconds: number,
  cooldownSeconds: number
): PutCommandInput => ({
  TableName: guardTableName,
  Item: {
    clientKey,
    expiresAtEpoch: nowEpochSeconds + cooldownSeconds
  },
  ConditionExpression: 'attribute_not_exists(clientKey) OR expiresAtEpoch < :nowEpoch',
  ExpressionAttributeValues: {
    ':nowEpoch': nowEpochSeconds
  }
});

export const isConditionalWriteFailure = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  (error as { name?: string }).name === 'ConditionalCheckFailedException';
