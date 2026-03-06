# Javelin Refactoring Guide (Development Track)

Last updated: 2026-03-06  
Active branch: `feat/javelin-refactoring-guide`  
Status: Refactor completed on this branch

## Purpose

This is a live execution guide for the next refactoring cycle of the Javelin demo.
It replaces the earlier snapshot-style review and tracks what to implement next, in order.

## Guardrails (must hold)

- Keep game logic pure and immutable.
- Keep reducer phase updates in `src/features/javelin/game/update/*` (no monolithic reducer logic).
- Keep canvas rendering separate from gameplay/business logic.
- Route all user-facing text through localization keys in `src/i18n/resources.ts`.
- Keep strict TypeScript; avoid `any`.
- Add or update tests whenever gameplay, validation, or leaderboard behavior changes.
- Preserve architecture boundaries documented in `AGENTS.md`.

## Baseline (post-refactor, verified on 2026-03-06)

- `src/features/javelin/JavelinPage.tsx`: 86 lines (composition-focused).
- `src/features/javelin/components/DevAdminPanel.tsx`: 60 lines (container-focused).
- `src/features/javelin/hooks/useGlobalLeaderboard.ts`: 151 lines with abort + stale-request handling and typed error state.
- Dual frame loops are present:
  - simulation RAF in `src/features/javelin/hooks/useGameLoop.ts`
  - render RAF in `src/features/javelin/components/GameCanvas.tsx`
- Tests exist in both frontend and backend (29 `*.test.ts/tsx` files currently).
- Root scripts include lint/format/typecheck/validate commands.
- CI workflow now exists at `.github/workflows/ci.yml` (in addition to deploy workflow).

## Refactoring Objectives

1. Reduce orchestration pressure in `JavelinPage.tsx` and `DevAdminPanel.tsx`.
2. Improve leaderboard resilience and FE/BE rule parity.
3. Keep difficulty balancing changes centralized in tuning/profile helpers.
4. Maintain or improve accessibility and error-state clarity.
5. Strengthen delivery safety rails (CI, linting, predictable checks).

## Phased Plan

### Phase 0: Safety Rails and Delivery Hygiene

Scope:

- Add lint + format tooling and scripts.
- Add pull-request CI workflow for install, typecheck, lint, test, build.
- Document mandatory local validation commands.

Definition of done:

- PR CI blocks merges on failing checks.
- `npm run lint` and `npm run format:check` exist and pass locally.

### Phase 1: Split `JavelinPage.tsx` Into Focused Composition

Scope:

- Extract `useJavelinSession` (reducer wiring + session-level derived state).
- Extract `useLeaderboardController` (local/global mode, refresh, submit flow, save gating).
- Move section composition into dedicated components:
  - `GameLayout`
  - `ScoreboardPanel`
  - `ResultPanel`

Definition of done:

- `JavelinPage.tsx` is primarily composition and wiring.
- No fetch/persistence logic embedded in page JSX.

### Phase 2: Split `DevAdminPanel.tsx`

Scope:

- Extract draft/parsing state into `useDevAdminDraft`.
- Break UI surface into focused sections:
  - difficulty tuning section
  - release meter section
  - run-up rhythm section
  - action row
- Keep validation/parsing logic test-covered.

Definition of done:

- Container component mostly coordinates callbacks and section props.
- Parsing and conversion logic is testable independently of UI.

### Phase 3: Leaderboard Contract Consolidation

Scope:

- Introduce a shared contract module for:
  - difficulty values
  - trigram normalization/validation
  - payload bounds and conversion rules
- Remove duplicated rule literals where feasible.

Definition of done:

- One canonical source for leaderboard rule constants.
- FE and BE behavior parity verified by tests.

### Phase 4: Leaderboard Hook Hardening

Scope:

- Add `AbortController` support for refresh.
- Prevent stale updates on rapid difficulty/mode switches.
- Normalize error states (`rate-limited`, `unavailable`, `server-error`, etc.).
- Keep API transport in `globalLeaderboardApi.ts`; hook handles async state machine.

Definition of done:

- No stale-response overwrite issues during rapid toggling.
- Error state is explicit and UI-friendly.

### Phase 5: Frame Scheduling Decision and Performance

Scope:

- Measure current dual-RAF behavior.
- Either unify loop ownership or formally document why dual loops stay.
- Reduce unnecessary React rerenders caused by per-frame state updates.

Definition of done:

- Frame ownership is explicit and documented.
- No avoidable gameplay-adjacent UI churn under normal play.

### Phase 6: Leaderboard Trust and Security Hardening

Scope:

- Decide trust model: casual/untrusted vs competitive/trusted.
- If competitive, add server-side verification strategy.
- Remove unsafe production defaults (notably `IpHashSalt` placeholder usage risk).
- Define suspicious score telemetry/review flow.

Definition of done:

- Trust model is explicit and implemented.
- Production deployment cannot silently use insecure secret defaults.

## Initial Backlog (Execution Order)

1. Add CI workflow for typecheck/lint/test/build.
2. Add lint and format scripts plus config.
3. Extract `useLeaderboardController` from `JavelinPage.tsx`.
4. Split scoreboard/result UI panels from `JavelinPage.tsx`.
5. Extract `useDevAdminDraft` and first DevAdmin section components.
6. Add abort/stale-request handling to global leaderboard hook.

## Kickoff Log

- [x] 2026-03-06: Created branch `feat/javelin-refactoring-guide`.
- [x] 2026-03-06: Replaced snapshot-style review with this live phased development guide.
- [x] 2026-03-06: Implemented Phase 0 tooling/CI slice (lint/format scripts + PR CI workflow + validation docs).
- [x] 2026-03-06: Ran full validation successfully (`npm run validate`).
- [x] 2026-03-06: Completed Phase 1 (`JavelinPage` decomposition + session/leaderboard hooks + panel components).
- [x] 2026-03-06: Completed Phase 2 (`DevAdminPanel` decomposition with section components + draft hook).
- [x] 2026-03-06: Completed Phase 3 (shared leaderboard contract module used by FE+BE).
- [x] 2026-03-06: Completed Phase 4 (`useGlobalLeaderboard` abort/stale-request/error-kind hardening).
- [x] 2026-03-06: Completed Phase 5 frame-loop ownership documentation (`docs/architecture/frame-loop.md`).
- [x] 2026-03-06: Completed Phase 6 template hardening for `IpHashSalt` (placeholder default removed).
