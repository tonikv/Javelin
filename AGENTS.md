# AGENTS.md

## Goal
Build and maintain the browser game demo "Selain Games 2026 / Keihäänheitto" with React + TypeScript.

## Current Status (2026-03-05)
- Reducer-driven game loop is active with strict TypeScript typing.
- Difficulty is first-class: `rookie | pro | elite` in game state, selectable in UI, default `rookie`.
- Difficulty unlock progression is implemented in browser storage:
  - key: `sg2026-javelin-difficulty-unlocks-v1`
  - unlock `pro` on valid `> 90.0m` rookie throw
  - unlock `elite` on valid `> 90.0m` pro throw
- Gameplay tuning is profile-based per difficulty in `src/features/javelin/game/tuning.ts`.
- Elite run-up includes rhythm-based tap gain penalties/rewards.
- Local leaderboard is per-difficulty v2 storage:
  - key: `sg2026-javelin-highscores-v2`
  - legacy v1 data migrates to `rookie` on first load
- Global leaderboard fetch/post uses selected throw difficulty (no hardcoded `pro`).
- Name moderation is enforced on FE+BE:
  - exactly `^[A-Z]{3}$`
  - normalization to uppercase A-Z trigram
  - shared trigram blocklist concept (duplicated FE/BE files)
- Backend anti-spam protections are implemented:
  - HTTP API throttling (`burst 20`, `rate 5`)
  - per-client cooldown guard table `JavelinScoreSubmitGuard` (TTL `expiresAtEpoch`)
  - IP hash (SHA-256 + `IP_HASH_SALT`) and 10s cooldown, `429` on repeat submit
- Dark-mode athlete palette now matches light mode palette.

## Core Engineering Rules
- Keep game logic pure and immutable.
- Use discriminated unions for phases and typed action payloads.
- Keep canvas rendering separate from business logic.
- Route all user-visible strings through localization keys (`src/i18n/resources.ts`).
- Avoid `any`; keep strict typing.
- Add/update tests whenever gameplay, validation, or leaderboard behavior changes.

## Architecture You Must Preserve
- Shared math utilities: `src/features/javelin/game/math.ts`
- Camera: `src/features/javelin/game/camera.ts`
- Meter rendering: `src/features/javelin/game/renderMeter.ts`
- Athlete rendering: `src/features/javelin/game/renderAthlete.ts`
- Tunables: `src/features/javelin/game/tuning.ts`
- Structural constants: `src/features/javelin/game/constants.ts`
- Reducer tick flow in per-phase handlers under `src/features/javelin/game/update/*` (avoid monolithic reducer branches)
- Reuse existing helpers (`clamp`, easing, interpolation, wrap helpers); do not duplicate utilities

## Highscore / Moderation Map
- Local highscores: `src/features/javelin/hooks/useLocalHighscores.ts`
- Difficulty unlocks: `src/features/javelin/hooks/useDifficultyUnlocks.ts`
- Global API client + mapping: `src/features/javelin/highscores/globalLeaderboardApi.ts`
- Name moderation FE: `src/features/javelin/highscores/nameModeration.ts`
- Save form: `src/features/javelin/components/SaveScoreForm.tsx`
- Scoreboard flow orchestration: `src/features/javelin/JavelinPage.tsx`

## Backend (AWS) Map
- Infra + throttling + tables: `aws/leaderboard/template.yaml`
- Handlers: `aws/leaderboard/src/getLeaderboard.ts`, `aws/leaderboard/src/postLeaderboard.ts`
- Validation + name rules: `aws/leaderboard/src/shared/validate.ts`, `aws/leaderboard/src/shared/nameModeration.ts`
- Spam guard helpers: `aws/leaderboard/src/shared/spamGuard.ts`
- Response helpers: `aws/leaderboard/src/shared/response.ts`

## Environment
- Frontend:
  - `VITE_LEADERBOARD_API_BASE`
  - `VITE_APP_VERSION`
- Backend:
  - `TABLE_NAME`
  - `INDEX_NAME`
  - `GUARD_TABLE_NAME`
  - `IP_HASH_SALT`
  - `SUBMIT_COOLDOWN_SECONDS`
  - deploy param `AllowedOrigins`

## Current Priorities
1. Keep difficulty play-feel balanced via tuning values only (avoid ad-hoc logic outside tuning/profile helpers).
2. Maintain leaderboard integrity and moderation parity between frontend and backend.
3. Continue UX/accessibility polish for difficulty/leaderboard states and error handling.
