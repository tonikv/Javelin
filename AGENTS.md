# AGENTS.md

## Goal

Build and maintain the browser game demo "Selain Games 2026 / Keihäänheitto" with React + TypeScript.

## Current Status (2026-03-06)

- Reducer-driven game loop is active with strict TypeScript typing.
- Difficulty is first-class: `rookie | pro | elite` in game state, selectable in UI, default `rookie`.
- `JavelinPage.tsx` is now a thin composition root:
  - session/reducer orchestration: `src/features/javelin/hooks/useJavelinSession.ts`
  - leaderboard orchestration: `src/features/javelin/hooks/useLeaderboardController.ts`
  - extracted UI sections: `TopBar`, `ScoreboardPanel`, `ResultPanel`
- `DevAdminPanel.tsx` is decomposed:
  - draft/parsing hook: `src/features/javelin/components/devAdmin/useDevAdminDraft.ts`
  - split sections: difficulty tuning, run-up rhythm, release meter, action row
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
- Global leaderboard hook is hardened:
  - `AbortController` cancellation for refresh
  - stale-response protection during rapid mode/difficulty switches
  - typed error-kind state for UI
- Shared FE+BE leaderboard contract is active:
  - backend source of truth: `aws/leaderboard/src/shared/leaderboardContract.ts`
  - frontend bridge: `src/features/javelin/highscores/leaderboardContract.ts`
- Name moderation is enforced on FE+BE from shared contract:
  - exactly `^[A-Z]{3}$`
  - normalization to uppercase A-Z trigram
  - shared trigram blocklist data
- Backend anti-spam protections are implemented:
  - HTTP API throttling (`burst 20`, `rate 5`)
  - per-client cooldown guard table `JavelinScoreSubmitGuard` (TTL `expiresAtEpoch`)
  - IP hash (SHA-256 + `IP_HASH_SALT`) and 10s cooldown, `429` on repeat submit
- Backend deployment hardening:
  - `IpHashSalt` template parameter no longer has insecure placeholder default
  - salt must be non-placeholder and at least 16 chars
- Deferred backend runtime maintenance:
  - `aws/leaderboard/template.yaml` still uses `nodejs20.x`
  - plan migration to `nodejs22.x` in a dedicated pass
  - deadline context: AWS Lambda lists `nodejs20.x` deprecation on 2026-04-30
- Dark-mode athlete palette now matches light mode palette.
- Dual RAF model is documented in `docs/architecture/frame-loop.md`.
- CI/tooling safety rails are active:
  - PR CI workflow: `.github/workflows/ci.yml`
  - lint/format scripts + `npm run validate` pipeline in root `package.json`

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
- Shared leaderboard contract bridge (FE): `src/features/javelin/highscores/leaderboardContract.ts`
- Name moderation FE: `src/features/javelin/highscores/nameModeration.ts`
- Save form: `src/features/javelin/components/SaveScoreForm.tsx`
- Scoreboard flow orchestration: `src/features/javelin/hooks/useLeaderboardController.ts`
- Scoreboard UI shell: `src/features/javelin/components/ScoreboardPanel.tsx`

## Backend (AWS) Map

- Infra + throttling + tables: `aws/leaderboard/template.yaml`
- Handlers: `aws/leaderboard/src/getLeaderboard.ts`, `aws/leaderboard/src/postLeaderboard.ts`
- Shared contract: `aws/leaderboard/src/shared/leaderboardContract.ts`
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
  - deploy param `IpHashSalt`

## Current Priorities

1. Keep difficulty play-feel balanced via tuning values only (avoid ad-hoc logic outside tuning/profile helpers).
2. Maintain leaderboard integrity and moderation parity through the shared contract layer.
3. Continue UX/accessibility polish for difficulty/leaderboard states and richer global error handling.
4. Define/implement stronger global leaderboard trust model (server-side verification path) if competitive integrity is required.
