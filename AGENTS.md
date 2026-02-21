# AGENTS.md

## Goal
Build and maintain the browser game demo "Selain Games 2026 / Keihäänheitto" with React + TypeScript.

## Coding principles
- Keep game logic pure and immutable.
- Use discriminated unions for game phases.
- Keep canvas rendering separate from business logic.
- Route all user-visible strings through localization keys.
- Avoid `any`; keep strict typing.
- Add tests for scoring, reducer transitions, and highscore logic.

## Refactor maintenance rules
- Preserve the split architecture: shared math in `src/features/javelin/game/math.ts`, camera in `src/features/javelin/game/camera.ts`, meter rendering in `src/features/javelin/game/renderMeter.ts`, athlete rendering in `src/features/javelin/game/renderAthlete.ts`.
- Keep gameplay-tunable values in `src/features/javelin/game/tuning.ts` and structural constants in `src/features/javelin/game/constants.ts`.
- Keep reducer `tick` behavior organized through per-phase handlers in `src/features/javelin/game/update.ts`; avoid rebuilding a monolithic phase branch.
- Prefer `switch` on `phase.tag` in selectors/camera/render helpers for clarity and exhaustiveness.
- Do not reintroduce duplicate utility helpers (`clamp`, `wrap01`, easing, interpolation); use `src/features/javelin/game/math.ts`.

## Priority order
1. Stable game loop and controls
2. Play feel tuning
3. Localization and local leaderboard
4. Accessibility and polish
