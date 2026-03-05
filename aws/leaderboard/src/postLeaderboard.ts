import { randomUUID } from 'node:crypto';
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { documentClient } from './shared/dynamodb';
import { getTableName } from './shared/env';
import type { ScoreItem } from './shared/model';
import { badRequest, internalError, jsonResponse } from './shared/response';
import { ValidationError, decodeRequestBody, parsePostScoreInput } from './shared/validate';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = decodeRequestBody(event.body, event.isBase64Encoded ?? false);
    const parsed = parsePostScoreInput(body);
    const scoreId = randomUUID();
    const scoreItem: ScoreItem = {
      scoreId,
      ...parsed
    };

    await documentClient.send(
      new PutCommand({
        TableName: getTableName(),
        Item: scoreItem,
        ConditionExpression: 'attribute_not_exists(scoreId)'
      })
    );

    console.info(
      JSON.stringify({
        message: 'leaderboard.submit.success',
        scoreId,
        difficulty: scoreItem.difficulty,
        distanceMm: scoreItem.distanceMm
      })
    );

    return jsonResponse(201, { ok: true, scoreId });
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    console.error(
      JSON.stringify({
        message: 'leaderboard.submit.failure',
        error: error instanceof Error ? error.message : 'unknown-error'
      })
    );

    return internalError();
  }
};
