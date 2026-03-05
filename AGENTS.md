# AGENTS.md

## Project Status (2026-03-05)
- Game is React + TypeScript with strict typing and reducer-driven gameplay.
- Local highscores are active (`localStorage`) and remain offline fallback.
- Global highscores are implemented (AWS HTTP API + Lambda + DynamoDB) and integrated in UI.
- Deployed API base: `https://h59663z7h6.execute-api.eu-north-1.amazonaws.com`.
- Frontend global mode currently uses fixed difficulty `pro` until gameplay difficulty selection is added.

## Core Engineering Rules
- Keep game logic pure and immutable.
- Use discriminated unions for game phases.
- Keep canvas rendering separate from business logic.
- Route all user-visible text through localization keys in `src/i18n/resources.ts`.
- Avoid `any`; keep strict typing.
- Add/update tests for scoring, reducer transitions, and highscore logic whenever behavior changes.

## Architecture You Must Preserve
- Shared math utilities: `src/features/javelin/game/math.ts`.
- Camera: `src/features/javelin/game/camera.ts`.
- Meter rendering: `src/features/javelin/game/renderMeter.ts`.
- Athlete rendering: `src/features/javelin/game/renderAthlete.ts`.
- Tunables: `src/features/javelin/game/tuning.ts`.
- Structural constants: `src/features/javelin/game/constants.ts`.
- Reducer tick flow: keep per-phase handlers in `src/features/javelin/game/update/*` (no monolithic branch).
- Reuse existing helpers (`clamp`, easing, interpolation, wrap helpers) from shared math files; do not duplicate.

## Highscore System Map
- Local highscores: `src/features/javelin/hooks/useLocalHighscores.ts`.
- Global API client + mapping: `src/features/javelin/highscores/globalLeaderboardApi.ts`.
- Global state hook: `src/features/javelin/hooks/useGlobalLeaderboard.ts`.
- Scoreboard mode toggle + submit flow: `src/features/javelin/JavelinPage.tsx`.
- Scoreboard rendering: `src/features/javelin/components/ScoreBoard.tsx`.

## Backend (AWS) Map
- Infra + CORS config: `aws/leaderboard/template.yaml`.
- Handlers: `aws/leaderboard/src/getLeaderboard.ts`, `aws/leaderboard/src/postLeaderboard.ts`.
- Validation: `aws/leaderboard/src/shared/validate.ts`.
- Backend tests: `aws/leaderboard/src/shared/validate.test.ts`.
- Table: `JavelinScores` with GSI `byDifficultyDistance` (`difficulty` + `distanceMm`).

## Environment + Deploy
- Frontend env:
  - `VITE_LEADERBOARD_API_BASE`
  - `VITE_APP_VERSION`
- Backend deploy parameter:
  - `AllowedOrigins` (comma-delimited CORS origins)
- Current deployed origins include:
  - `https://tonikv.github.io`
  - `http://localhost:5173`

## Next Work Priorities
1. Add in-game difficulty selection and map it to global leaderboard difficulty (`rookie | pro | elite`).
2. Strengthen anti-cheat/validation (server-side replay verification if needed).
3. Keep local/global leaderboard UX polished (error states, loading, accessibility text).
