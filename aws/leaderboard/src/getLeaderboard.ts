import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { documentClient } from './shared/dynamodb';
import { getIndexName, getTableName } from './shared/env';
import type { LeaderboardResponse } from './shared/model';
import { badRequest, internalError, jsonResponse } from './shared/response';
import { ValidationError, parseGetLeaderboardInput, parseStoredItems } from './shared/validate';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { difficulty, limit } = parseGetLeaderboardInput(event.queryStringParameters);
    const tableName = getTableName();
    const indexName = getIndexName();

    const result = await documentClient.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: '#difficulty = :difficulty',
        ExpressionAttributeNames: {
          '#difficulty': 'difficulty'
        },
        ExpressionAttributeValues: {
          ':difficulty': difficulty
        },
        ScanIndexForward: false,
        Limit: limit
      })
    );

    const items = parseStoredItems(result.Items ?? []);
    const payload: LeaderboardResponse = {
      difficulty,
      items
    };

    console.info(
      JSON.stringify({
        message: 'leaderboard.fetch.success',
        difficulty,
        requestedLimit: limit,
        returnedCount: items.length
      })
    );

    return jsonResponse(200, payload);
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    console.error(
      JSON.stringify({
        message: 'leaderboard.fetch.failure',
        error: error instanceof Error ? error.message : 'unknown-error'
      })
    );
    return internalError();
  }
};
