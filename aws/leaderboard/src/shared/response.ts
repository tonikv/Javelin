import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const BASE_HEADERS = {
  'content-type': 'application/json; charset=utf-8'
} as const;

export const jsonResponse = (
  statusCode: number,
  payload: object
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: BASE_HEADERS,
  body: JSON.stringify(payload)
});

export const badRequest = (message: string): APIGatewayProxyStructuredResultV2 =>
  jsonResponse(400, { error: 'BadRequest', message });

export const internalError = (): APIGatewayProxyStructuredResultV2 =>
  jsonResponse(500, { error: 'InternalServerError', message: 'Internal server error' });
