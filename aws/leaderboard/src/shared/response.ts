import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const BASE_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer'
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

export const tooManyRequests = (retryAfterSeconds: number): APIGatewayProxyStructuredResultV2 => ({
  statusCode: 429,
  headers: {
    ...BASE_HEADERS,
    'retry-after': String(retryAfterSeconds)
  },
  body: JSON.stringify({
    error: 'TooManyRequests',
    message: 'Too many submissions. Please wait before submitting again.',
    retryAfterSeconds
  })
});

export const internalError = (): APIGatewayProxyStructuredResultV2 =>
  jsonResponse(500, { error: 'InternalServerError', message: 'Internal server error' });
