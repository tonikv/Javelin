# Selain Games 2026 - Keihäänheitto

Single-game browser demo built with React + TypeScript.
Goal: show product-minded frontend quality with functional game logic (reducer + pure scoring/physics) in a fast-to-try format.

## Play

- Local dev:

```bash
npm install
npm run dev
```

## Controls

- Mouse:
  - Left click: tap rapidly to build run-up speed
  - Right click down: enter throw prep
  - Right click release: release throw
  - Move mouse up/down while holding right button: adjust angle
- Keyboard:
  - `Space`: tap for run-up speed
  - `Enter`: start throw prep / release
  - `ArrowUp` / `ArrowDown`: adjust angle

## Stack

- React 19 + TypeScript
- Vite 7
- Vite PWA (service worker + installable manifest)
- Canvas 2D rendering
- Vitest unit tests
- LocalStorage leaderboard
- Built-in FI/SV/EN localization layer

## Architecture

- Domain logic (`src/features/javelin/game`):
  - Pure scoring and projectile calculations
  - Reducer-based state machine with discriminated unions
- UI layer (`src/features/javelin/components`):
  - Canvas surface + HUD + controls + score table
- Effects (`src/features/javelin/hooks`):
  - RAF game loop
  - Input adapter
  - LocalStorage highscore adapter

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```

## PWA / Mobile Install

- The game is installable as a Progressive Web App on supported mobile and desktop browsers.
- First load online, then it can run offline from the app icon.
- Install flow:
  - Android Chrome: browser menu -> `Install app`
  - iOS Safari: `Share` -> `Add to Home Screen`

To validate production PWA behavior locally:

```bash
npm run build
npm run preview
```

## GitHub Pages

Workflow is included in `.github/workflows/deploy.yml`.
`vite.config.ts` uses `/Javelin/` base path automatically on GitHub Actions.

## Scope Notes

- Leaderboard local-only in this demo.
- Next logical phase: backend leaderboard API + anti-cheat.
