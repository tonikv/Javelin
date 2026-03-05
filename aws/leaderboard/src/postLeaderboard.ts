import { randomUUID } from 'node:crypto';
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { documentClient } from './shared/dynamodb';
import { getGuardTableName, getIpHashSalt, getSubmitCooldownSeconds, getTableName } from './shared/env';
import type { ScoreItem } from './shared/model';
import { badRequest, internalError, jsonResponse, tooManyRequests } from './shared/response';
import {
  buildSubmitGuardPutInput,
  hashClientSourceIp,
  isConditionalWriteFailure,
  resolveClientSourceIp
} from './shared/spamGuard';
import { ValidationError, decodeRequestBody, parsePostScoreInput } from './shared/validate';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = decodeRequestBody(event.body, event.isBase64Encoded ?? false);
    const parsed = parsePostScoreInput(body);
    const nowEpochSeconds = Math.floor(Date.now() / 1000);
    const cooldownSeconds = getSubmitCooldownSeconds();
    const clientSourceIp = resolveClientSourceIp(event);
    const clientKey = hashClientSourceIp(clientSourceIp, getIpHashSalt());

    try {
      await documentClient.send(
        new PutCommand(
          buildSubmitGuardPutInput(
            getGuardTableName(),
            clientKey,
            nowEpochSeconds,
            cooldownSeconds
          )
        )
      );
    } catch (error) {
      if (isConditionalWriteFailure(error)) {
        return tooManyRequests(cooldownSeconds);
      }
      throw error;
    }

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
