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

## Priority order
1. Stable game loop and controls
2. Play feel tuning
3. Localization and local leaderboard
4. Accessibility and polish
