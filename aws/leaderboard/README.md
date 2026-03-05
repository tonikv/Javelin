# Javelin Global Leaderboard Backend

Serverless backend for global persistent highscores:

- API Gateway HTTP API
- AWS Lambda (Node.js + TypeScript)
- DynamoDB (`JavelinScores` + `byDifficultyDistance` GSI)

## Local Commands

```bash
npm install
npm test
npm run typecheck
npm run build
```

## Deploy With SAM

1. Build TypeScript:

```bash
npm run build
```

2. Build SAM artifacts:

```bash
sam build
```

3. First-time guided deploy:

```bash
sam deploy --guided
```

Set `AllowedOrigins` to your frontend origins (for example `https://tonikv.github.io,http://localhost:5173`).

## API

- `GET /leaderboard?difficulty=elite&limit=10`
- `POST /leaderboard`

POST body example:

```json
{
  "difficulty": "elite",
  "playerName": "Ada",
  "distanceMm": 82345,
  "playedAt": "2026-03-04T12:00:00.000Z",
  "clientVersion": "1.2.0",
  "windMs": 1.2,
  "windZMs": -0.5,
  "launchSpeedCms": 3200,
  "angleCdeg": 3600
}
```
