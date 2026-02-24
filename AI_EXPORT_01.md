# AI Export
- Generated: 2026-02-24T13:51:47.105040+00:00
- Workspace: Javelin
- Files in this chunk: 95
- Limits: maxTotalChars=600000, maxFileChars=20000
- Approx tokens (this chunk): 74075

## Repo Map (compact)
- .github
  - workflows/…
  - copilot-instructions.md
- AGENTS.md
- docs
  - ai-notes.md
  - audio-qa.md
- index.html
- package.json
- public
  - robots.txt
- README.md
- src
  - app/… (4 files)
  - features/ (71 files)
    - javelin/ (71 files)
      - components/… (10 files)
      - game/… (50 files)
      - hooks/… (10 files)
      - (1 files at this level)
  - i18n/… (3 files)
  - pwa/… (1 files)
  - theme/… (2 files)
  - (3 files at this level)
- tsconfig.json
- vite.config.ts

## Project Overview (auto)
- App type: React-based web application or component library.

**Context (auto):**
- Languages: TypeScript/JavaScript
- Package manager(s): npm
- JS/TS stack: React, Vite
- CI: GitHub Actions configured
- Primary docs file: README.md
- Env vars used: CANVAS_FONT_STACK, GITHUB_ACTIONS

## Files Omitted / Truncated

**Files filtered out:** 8 total
- By exclude pattern: 4 (e.g., public/apple-touch-icon.png, public/maskable-icon-512x512.png, public/pwa-192x192.png, public/pwa-512x512.png)
- By extension filter: 4

## Table of Contents
- src/features/javelin/game/render/types.ts
- src/features/javelin/game/types.ts
- src/features/javelin/hooks/controls/types.ts
- .github/copilot-instructions.md
- .github/workflows/deploy.yml
- AGENTS.md
- docs/ai-notes.md
- docs/audio-qa.md
- index.html
- package.json
- public/robots.txt
- README.md
- src/app/App.tsx
- src/app/browser.ts
- src/app/useMediaQuery.ts
- src/features/javelin/components/CircularTimingMeter.tsx
- src/features/javelin/components/ControlHelp.tsx
- src/features/javelin/components/GameActions.tsx
- src/features/javelin/components/GameCanvas.tsx
- src/features/javelin/components/HudPanel.tsx
- src/features/javelin/components/LanguageSwitch.tsx
- src/features/javelin/components/ResultDisplay.tsx
- src/features/javelin/components/SaveScoreForm.tsx
- src/features/javelin/components/ScoreBoard.tsx
- src/features/javelin/components/ThemeToggle.tsx
- src/features/javelin/game/athletePose.ts
- src/features/javelin/game/audio.ts
- src/features/javelin/game/camera.ts
- src/features/javelin/game/chargeMeter.ts
- src/features/javelin/game/constants.ts
- src/features/javelin/game/controls.ts
- src/features/javelin/game/math.ts
- src/features/javelin/game/physics.ts
- src/features/javelin/game/reducer.ts
- src/features/javelin/game/render/background.ts
- src/features/javelin/game/render/field.ts
- src/features/javelin/game/render/index.ts
- src/features/javelin/game/render/javelinRender.ts
- src/features/javelin/game/render/overlays.ts
- src/features/javelin/game/render/renderGame.ts
- src/features/javelin/game/render/session.ts
- src/features/javelin/game/renderAthlete.ts
- src/features/javelin/game/renderMeter.ts
- src/features/javelin/game/renderTheme.ts
- src/features/javelin/game/renderWind.ts
- src/features/javelin/game/scoring.ts
- src/features/javelin/game/selectors.ts
- src/features/javelin/game/trajectory.ts
- src/features/javelin/game/tuning.ts
- src/features/javelin/game/update/helpers.ts
- src/features/javelin/game/update/index.ts
- src/features/javelin/game/update/initialState.ts
- src/features/javelin/game/update/reduce.ts
- src/features/javelin/game/update/tickChargeAim.ts
- src/features/javelin/game/update/tickFault.ts
- src/features/javelin/game/update/tickFlight.ts
- src/features/javelin/game/update/tickRunup.ts
- src/features/javelin/game/update/tickThrowAnim.ts
- src/features/javelin/game/wind.ts
- src/features/javelin/hooks/controls/index.ts
- src/features/javelin/hooks/controls/useKeyboardControls.ts
- src/features/javelin/hooks/controls/useMouseControls.ts
- src/features/javelin/hooks/controls/useTouchControls.ts
- src/features/javelin/hooks/useGameLoop.ts
- src/features/javelin/hooks/useLocalHighscores.ts
- src/features/javelin/hooks/useResultMessage.ts
- src/features/javelin/JavelinPage.tsx
- src/i18n/init.tsx
- src/i18n/resources.ts
- src/index.css
- src/main.tsx
- src/pwa/register.ts
- src/theme/init.test.tsx
- src/theme/init.tsx
- src/vite-env.d.ts
- tsconfig.json
- vite.config.ts
- src/app/browser.test.ts
- src/features/javelin/game/athletePose.test.ts
- src/features/javelin/game/audio.test.ts
- src/features/javelin/game/camera.test.ts
- src/features/javelin/game/chargeMeter.test.ts
- src/features/javelin/game/controls.test.ts
- src/features/javelin/game/physics.test.ts
- src/features/javelin/game/reducer.test.ts
- src/features/javelin/game/render.test.ts
- src/features/javelin/game/renderTheme.test.ts
- src/features/javelin/game/renderWind.test.ts
- src/features/javelin/game/scoring.test.ts
- src/features/javelin/game/selectors.test.ts
- src/features/javelin/game/trajectory.test.ts
- src/features/javelin/game/wind.test.ts
- src/features/javelin/hooks/useLocalHighscores.test.ts
- src/features/javelin/hooks/usePointerControls.test.ts
- src/i18n/init.test.ts

---

### Rendering & visual effects


## src/features/javelin/game/render/types.ts
_Defines: CloudLayer, CLOUD_LAYERS, ResultMarkerFadeState, PaletteCacheState, BackgroundGradientCacheState, RenderSession_

```ts
/**
 * Shared types for the game rendering pipeline.
 * All rendering sub-modules import their shared types from here.
 */
import type { CameraSmoothingState } from '../camera';
import type { RenderPalette } from '../renderTheme';
import type { GameState, TimingQuality } from '../types';
import type { ThemeMode } from '../../../../theme/init';

export type CloudLayer = {
  yFraction: number;
  parallaxFactor: number;
  clouds: Array<{
    offsetXM: number;
    widthPx: number;
    heightPx: number;
    opacity: number;
  }>;
};

export const CLOUD_LAYERS: CloudLayer[] = [
  {
    yFraction: 0.12,
    parallaxFactor: 0.05,
    clouds: [
      { offsetXM: 0, widthPx: 120, heightPx: 18, opacity: 0.28 },
      { offsetXM: 35, widthPx: 90, heightPx: 14, opacity: 0.24 },
      { offsetXM: 72, widthPx: 140, heightPx: 20, opacity: 0.26 },
      { offsetXM: 120, widthPx: 100, heightPx: 16, opacity: 0.22 }
    ]
  },
  {
    yFraction: 0.28,
    parallaxFactor: 0.15,
    clouds: [
      { offsetXM: 10, widthPx: 80, heightPx: 28, opacity: 0.32 },
      { offsetXM: 50, widthPx: 110, heightPx: 34, opacity: 0.3 },
      { offsetXM: 95, widthPx: 70, heightPx: 24, opacity: 0.28 }
    ]
  },
  {
    yFraction: 0.18,
    parallaxFactor: 0.3,
    clouds: [
      { offsetXM: 20, widthPx: 100, heightPx: 38, opacity: 0.34 },
      { offsetXM: 80, widthPx: 130, heightPx: 42, opacity: 0.31 }
    ]
  }
];

export type ResultMarkerFadeState = {
  lastRoundId: number;
  shownAtMs: number;
};

export type PaletteCacheState = {
  theme: ThemeMode;
  palette: RenderPalette;
} | null;

export type BackgroundGradientCacheState = {
  width: number;
  height: number;
  theme: ThemeMode;
  sky: CanvasGradient;
  haze: CanvasGradient;
} | null;

export type RenderSession = {
  camera: CameraSmoothingState;
  resultMarker: ResultMarkerFadeState;
  lastRunupTapAtMs: number | null;
  lastFaultJavelinLanded: boolean;
  lastPhaseTag: GameState['phase']['tag'];
  paletteCache: PaletteCacheState;
  backgroundGradientCache: BackgroundGradientCacheState;
};

export type ReleaseFlashLabels = Record<TimingQuality, string> & {
  foulLine: string;
};

export type OverlayHints = {
  onboarding: string;
  headwind: string;
  tailwind: string;
};

/**
 * Optional audio callbacks raised by the render pipeline.
 * Rendering detects event boundaries and delegates side-effects to these hooks.
 */
export type GameAudioCallbacks = {
  onRunupTap?: (tapGainNorm: number) => void;
  onChargeStart?: () => void;
  onThrowRelease?: (speedNorm: number, quality: TimingQuality) => void;
  onFlightWindUpdate?: (intensity: number) => void;
  onFlightWindStop?: () => void;
  onLandingImpact?: (tipFirst: boolean) => void;
  onCrowdReaction?: (reaction: 'cheer' | 'groan') => void;
  onFault?: () => void;
};

/** All inputs needed to render a single game frame. */
export type RenderFrameInput = {
  ctx: CanvasRenderingContext2D;
  state: GameState;
  width: number;
  height: number;
  dtMs: number;
  numberFormat: Intl.NumberFormat;
  labels: {
    throwLine: string;
    releaseFlash: ReleaseFlashLabels;
    onboarding: string;
    headwind: string;
    tailwind: string;
  };
  theme: ThemeMode;
  prefersReducedMotion: boolean;
  session: RenderSession;
  audio?: GameAudioCallbacks;
};

```
> meta: lines=124 chars=3274 truncated=no priority

### Other code & helpers


## src/features/javelin/game/types.ts
_Defines: Locale, FaultReason, TimingQuality, MeterWindow, RunupTapState, ChargeMeterState_

```ts
export type Locale = 'fi' | 'sv' | 'en';

export type FaultReason = 'lateRelease' | 'invalidRelease' | 'lowAngle';

export type TimingQuality = 'perfect' | 'good' | 'miss';

export type MeterWindow = {
  start: number;
  end: number;
};

export type RunupTapState = {
  lastTapAtMs: number | null;
  lastTapGainNorm: number;
};

/**
 * Tracks cyclic throw-force charge progress.
 * `phase01` wraps from 1 back to 0 on each cycle.
 * Exceeding configured max cycles triggers a late-release fault.
 */
export type ChargeMeterState = {
  phase01: number;
  perfectWindow: MeterWindow;
  goodWindow: MeterWindow;
  lastQuality: TimingQuality | null;
  lastSampleAtMs: number;
};

export type AthletePoseState = {
  animTag: 'idle' | 'run' | 'aim' | 'throw' | 'followThrough' | 'fall';
  animT: number;
};

export type ThrowInput = {
  speedNorm: number;
  angleDeg: number;
  releaseTiming: number;
  windMs: number;
};

export type LaunchSnapshot = {
  speedNorm: number;
  angleDeg: number;
  forceNorm: number;
  windMs: number;
  launchSpeedMs: number;
  athleteXM: number;
  releaseQuality: TimingQuality;
  lineCrossedAtRelease: boolean;
};

export type PhysicalJavelinState = {
  xM: number;
  yM: number;
  zM: number;
  vxMs: number;
  vyMs: number;
  vzMs: number;
  angleRad: number;
  angularVelRad: number;
  releasedAtMs: number;
  lengthM: number;
};

export type ResultKind = 'valid' | 'foul_line' | 'foul_sector' | 'foul_tip_first';

export type GamePhase =
  | { tag: 'idle' }
  | {
      tag: 'runup';
      speedNorm: number;
      startedAtMs: number;
      tapCount: number;
      runupDistanceM: number;
      tap: RunupTapState;
      athletePose: AthletePoseState;
    }
  | {
      tag: 'chargeAim';
      speedNorm: number;
      runupDistanceM: number;
      startedAtMs: number;
      runEntryAnimT: number;
      angleDeg: number;
      chargeStartedAtMs: number;
      chargeMeter: ChargeMeterState;
      forceNormPreview: number;
      athletePose: AthletePoseState;
    }
  | {
      tag: 'throwAnim';
      speedNorm: number;
      athleteXM: number;
      angleDeg: number;
      forceNorm: number;
      releaseQuality: TimingQuality;
      lineCrossedAtRelease: boolean;
      releaseFlashAtMs: number;
      animProgress: number;
      released: boolean;
      athletePose: AthletePoseState;
    }
  | {
      tag: 'flight';
      athleteXM: number;
      javelin: PhysicalJavelinState;
      launchedFrom: LaunchSnapshot;
      athletePose: AthletePoseState;
    }
  | {
      tag: 'result';
      athleteXM: number;
      launchedFrom: LaunchSnapshot;
      distanceM: number;
      isHighscore: boolean;
      resultKind: ResultKind;
      tipFirst: boolean | null;
      landingTipXM: number;
      landingXM: number;
      landingYM: number;
      landingAngleRad: number;
    }
  | {
      tag: 'fault';
      reason: FaultReason;
      athleteXM: number;
      athletePose: AthletePoseState;
      javelin: PhysicalJavelinState;
      javelinLanded: boolean;
    };

export type GameState = {
  nowMs: number;
  roundId: number;
  windMs: number;
  windZMs: number;
  aimAngleDeg: number;
  phase: GamePhase;
};

export type GameAction =
  | { type: 'startRound'; atMs: number; windMs: number; windZMs?: number }
  | { type: 'rhythmTap'; atMs: number }
  | { type: 'beginChargeAim'; atMs: number }
  | { type: 'setAngle'; angleDeg: number }
  | { type: 'adjustAngle'; deltaDeg: number }
  | { type: 'releaseCharge'; atMs: number }
  | { type: 'tick'; dtMs: number; nowMs: number }
  | { type: 'setResultHighscoreFlag'; isHighscore: boolean }
  | { type: 'resetToIdle' };

export type HighscoreEntry = {
  id: string;
  name: string;
  distanceM: number;
  playedAtIso: string;
  locale: Locale;
  windMs: number;
  launchSpeedMs?: number;
  angleDeg?: number;
};

```
> meta: lines=163 chars=3805 truncated=no priority


## src/features/javelin/hooks/controls/types.ts
_Reusable hook / shared state or side-effect logic._

```ts
/**
 * Shared control-layer types and pure guard helpers.
 * This module contains input-agnostic logic reused by keyboard, mouse, and touch hooks.
 */
import { isInteractiveElement } from '../../../../app/browser';
import type { GameAction, GameState } from '../../game/types';

export type Dispatch = (action: GameAction) => void;

export type AngleKeyHoldState = {
  direction: 'up' | 'down';
  holdStartedAtMs: number;
  lastAppliedAtMs: number;
};

type TimerHandle = ReturnType<typeof setTimeout>;

export type TouchLongPressHandlers = {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  clear: () => void;
};

export type TouchLongPressHandlerArgs = {
  dispatch: Dispatch;
  getPhaseTag: () => GameState['phase']['tag'];
  now: () => number;
  longPressMs?: number;
  setTimer?: (callback: () => void, delayMs: number) => TimerHandle;
  clearTimer?: (timer: TimerHandle) => void;
};

const TOUCH_LONG_PRESS_MS = 300;

export const isInteractiveEventTarget = (target: EventTarget | null): boolean => {
  return isInteractiveElement(target);
};

const allowsArrowAngleAdjust = (phaseTag: GameState['phase']['tag']): boolean =>
  phaseTag === 'idle' || phaseTag === 'runup' || phaseTag === 'chargeAim';

const allowsActionKeyHandling = (phaseTag: GameState['phase']['tag']): boolean =>
  phaseTag === 'runup' || phaseTag === 'chargeAim';

export const shouldReleaseChargeFromEnterKeyUp = (
  code: string,
  phaseTag: GameState['phase']['tag'],
  target: EventTarget | null
): boolean => code === 'Enter' && phaseTag === 'chargeAim' && !isInteractiveEventTarget(target);

export const shouldHandleAngleAdjustKeyDown = (
  code: string,
  phaseTag: GameState['phase']['tag'],
  target: EventTarget | null
): boolean =>
  (code === 'ArrowUp' || code === 'ArrowDown') &&
  allowsArrowAngleAdjust(phaseTag) &&
  !isInteractiveEventTarget(target);

export const shouldConsumeActionKeyDown = (
  code: string,
  phaseTag: GameState['phase']['tag'],
  target: EventTarget | null,
  repeat: boolean
): boolean =>
  !repeat &&
  !isInteractiveEventTarget(target) &&
  (code === 'Space' || code === 'Enter') &&
  allowsActionKeyHandling(phaseTag);

export const createTouchLongPressHandlers = ({
  dispatch,
  getPhaseTag,
  now,
  longPressMs = TOUCH_LONG_PRESS_MS,
  setTimer = (callback, delayMs) => globalThis.setTimeout(callback, delayMs),
  clearTimer = (timer) => globalThis.clearTimeout(timer)
}: TouchLongPressHandlerArgs): TouchLongPressHandlers => {
  let longPressTimer: TimerHandle | null = null;

  const clear = (): void => {
    if (longPressTimer !== null) {
      clearTimer(longPressTimer);
      longPressTimer = null;
    }
  };

  const onTouchStart = (): void => {
    const phaseTag = getPhaseTag();
    if (phaseTag === 'runup') {
      dispatch({ type: 'rhythmTap', atMs: now() });
      clear();
      longPressTimer = setTimer(() => {
        if (getPhaseTag() === 'runup') {
          dispatch({ type: 'beginChargeAim', atMs: now() });
        }
        longPressTimer = null;
      }, longPressMs);
      return;
    }

    if (phaseTag === 'idle' || phaseTag === 'result') {
      dispatch({ type: 'rhythmTap', atMs: now() });
    }
  };

  const onTouchEnd = (): void => {
    clear();
    if (getPhaseTag() === 'chargeAim') {
      dispatch({ type: 'releaseCharge', atMs: now() });
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
    clear
  };
};

```
> meta: lines=120 chars=3390 truncated=no priority


## .github/copilot-instructions.md

```md
- Prefer pure functions and immutable updates.
- Use discriminated unions for game phases.
- Keep Canvas rendering stateless with respect to business logic.
- Do not hardcode user-facing strings; use i18n keys.
- Write tests for scoring, reducer transitions, and highscore sorting.

```
> meta: lines=6 chars=282 truncated=no


## .github/workflows/deploy.yml

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      # ... 3 more items omitted
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4

```
> meta: lines=37 chars=665 truncated=no


## AGENTS.md

```md
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

```
> meta: lines=26 chars=1406 truncated=no


## docs/ai-notes.md

```md
# AI Development Notes

## Where AI was used
- Initial project scaffolding and file generation.
- Creating reducer/test boilerplate.
- Drafting i18n key sets and translation placeholders.

## What was decided manually
- Game phase state machine boundaries.
- Throw tuning constants and scoring model.
- Accessibility requirements and keyboard control behavior.
- Separation between domain logic, render logic, and React UI.

## Suggestions rejected
- Overly realistic aerodynamic simulation (too much scope for MVP).
- Asset-heavy sprite pipeline (kept code-drawn canvas graphics).

## Quality checks
- Unit tests for scoring, reducer transitions, and highscore helpers.
- TypeScript strict compilation.
- Production build verification with Vite.

```
> meta: lines=22 chars=747 truncated=no

### Audio


## docs/audio-qa.md

```md
# Audio QA Checklist

Manual verification targets for Gameplay V2 procedural audio.

## Setup
- Start local dev server: `npm run dev`
- Use a browser with Web Audio support (Chrome/Firefox/Safari).
- Interact once with the game surface to unlock audio context.

## Rhythm and Charge
- [ ] Rhythm ticks are audible and distinct for perfect vs good timing.
- [ ] Rhythm ticks are not spammed when holding or mashing input.
- [ ] Entering charge phase has a clear transition cue.

## Throw and Flight
- [ ] Throw release plays a whoosh.
- [ ] Faster release produces brighter/stronger whoosh character.
- [ ] During flight, wind layer fades in and tracks perceived javelin speed.
- [ ] Wind layer fades out after flight ends.

## Landing and Outcomes
- [ ] Landing plays one impact sound per throw.
- [ ] Tip-first landing includes an extra bright accent.
- [ ] Valid result triggers positive crowd reaction.
- [ ] Foul/fault results trigger negative crowd reaction.
- [ ] Fault phase includes retro-style short oof cue.

## Stability
- [ ] No console audio errors during 10 consecutive rounds.
- [ ] Sounds remain stable after switching tabs and returning.
- [ ] Mobile touch interaction starts audio correctly after first gesture.

```
> meta: lines=32 chars=1230 truncated=no

### Other code & helpers


## index.html

```html
<!doctype html>
<html lang="fi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Browser-based javelin throw game – React + TypeScript + Canvas"
    />
    <meta property="og:title" content="Selain Games 2026 - Keihäänheitto" />
    <meta property="og:type" content="website" />
    <meta name="theme-color" content="#0f1a24" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Keihäänheitto" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <title>Selain Games 2026 - Keihäänheitto</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```
> meta: lines=26 chars=1025 truncated=no

### Configuration / tooling / CI


## package.json
_JavaScript/TypeScript package manifest (scripts, dependencies, metadata)._

```json
{
  "name": "selain-games-2026-javelin",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/react": "^19.1.12",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "~5.9.3",
    "vite": "^7.3.1",
    "vite-plugin-pwa": "^1.2.0",
    "vitest": "^3.2.4"
  }
}

```
> meta: lines=27 chars=584 truncated=no

### Other code & helpers


## public/robots.txt

```txt
User-agent: *
Allow: /

```
> meta: lines=3 chars=23 truncated=no

### Docs & specifications


## README.md
_Project README / high-level documentation._

```md
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

```
> meta: lines=85 chars=1927 truncated=no

### Entry points & app wiring


## src/app/App.tsx
_Defines: App_

```tsx
import type { ReactElement } from 'react';
import { JavelinPage } from '../features/javelin/JavelinPage';

export const App = (): ReactElement => {
  return <JavelinPage />;
};

```
> meta: lines=7 chars=177 truncated=no


## src/app/browser.ts
_Defines: isInteractiveElement, safeLocalStorageGet, safeLocalStorageSet_

```ts
const INTERACTIVE_TAGS = new Set(['input', 'textarea', 'select', 'button']);
const INTERACTIVE_SELECTOR =
  'input, textarea, select, button, [contenteditable], [role="textbox"], [role="combobox"], [role="spinbutton"]';

type InteractiveElement = {
  tagName?: string;
  isContentEditable?: boolean;
  closest?: (selector: string) => unknown;
};

export const isInteractiveElement = (target: EventTarget | null): boolean => {
  if (target === null || typeof target !== 'object') {
    return false;
  }

  const maybeElement = target as InteractiveElement;

  if (maybeElement.isContentEditable === true) {
    return true;
  }
  if (typeof maybeElement.tagName === 'string' && INTERACTIVE_TAGS.has(maybeElement.tagName.toLowerCase())) {
    return true;
  }
  if (typeof maybeElement.closest === 'function') {
    return maybeElement.closest(INTERACTIVE_SELECTOR) !== null;
  }
  return false;
};

export const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeLocalStorageSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    
  }
};

```
> meta: lines=45 chars=1196 truncated=no


## src/app/useMediaQuery.ts
_Defines: useMediaQuery_

```ts
import { useEffect, useState } from 'react';

const getMatches = (query: string): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(query).matches;
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const onChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', onChange);
    return () => {
      mediaQueryList.removeEventListener('change', onChange);
    };
  }, [query]);

  return matches;
};

```
> meta: lines=33 chars=885 truncated=no

### Frontend / UI


## src/features/javelin/components/CircularTimingMeter.tsx
_Reusable UI component or set of components._

```tsx
import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { wrap01 } from '../game/math';
import type { TimingQuality } from '../game/types';

type HotZone = {
  start: number;
  end: number;
  kind: 'good' | 'perfect';
};

type CircularTimingMeterProps = {
  labelKey: string;
  phase01: number;
  hotZones: HotZone[];
  active?: boolean;
  hitFeedback?: TimingQuality | null;
  valueText?: string;
  size?: number;
};

const TAU = Math.PI * 2;

const pointOnCircle = (cx: number, cy: number, r: number, phase01: number): { x: number; y: number } => {
  const angle = wrap01(phase01) * TAU - Math.PI / 2;
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r
  };
};

const arcPath = (cx: number, cy: number, r: number, start01: number, end01: number): string => {
  const start = pointOnCircle(cx, cy, r, start01);
  const end = pointOnCircle(cx, cy, r, end01);
  const span = (wrap01(end01) - wrap01(start01) + 1) % 1;
  const largeArc = span > 0.5 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const renderZonePath = (
  cx: number,
  cy: number,
  r: number,
  start01: number,
  end01: number
): string[] => {
  const start = wrap01(start01);
  const end = wrap01(end01);
  if (start <= end) {
    return [arcPath(cx, cy, r, start, end)];
  }
  return [arcPath(cx, cy, r, start, 1), arcPath(cx, cy, r, 0, end)];
};

export const CircularTimingMeter = ({
  labelKey,
  phase01,
  hotZones,
  active = true,
  hitFeedback = null,
  valueText = '',
  size = 128
}: CircularTimingMeterProps): ReactElement => {
  const { t } = useI18n();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 16;
  const cursor = pointOnCircle(cx, cy, radius, phase01);

  return (
    <div className={`timing-meter ${active ? 'is-active' : ''} feedback-${hitFeedback ?? 'none'}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${t(labelKey)} ${valueText}`.trim()}
      >
        <circle className="timing-track" cx={cx} cy={cy} r={radius} />
        {hotZones.flatMap((zone) =>
          renderZonePath(cx, cy, radius, zone.start, zone.end).map((path, index) => (
            <path
              key={`${zone.kind}-${zone.start}-${zone.end}-${index}`}
              d={path}
              className={`timing-zone zone-${zone.kind}`}
              strokeDasharray={zone.kind === 'good' ? '4 2' : undefined}
            />
          ))
        )}
        <circle className="timing-cursor" cx={cursor.x} cy={cursor.y} r={6} />
      </svg>
      <div className="timing-meter-meta">
        <span>{t(labelKey)}</span>
        {valueText && <strong>{valueText}</strong>}
        {hitFeedback && <small aria-live="polite">{t(`hud.${hitFeedback}`)}</small>}
      </div>
    </div>
  );
};

```
> meta: lines=98 chars=2844 truncated=no


## src/features/javelin/components/ControlHelp.tsx
_Reusable UI component or set of components._

```tsx
import { memo, useMemo, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';

type ControlHelpContentProps = {
  isTouchDevice?: boolean;
};

export const detectTouchDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const ControlHelpContentComponent = ({ isTouchDevice }: ControlHelpContentProps): ReactElement => {
  const { t } = useI18n();
  const useTouchHelp = useMemo(() => isTouchDevice ?? detectTouchDevice(), [isTouchDevice]);
  const helpItems = useMemo(
    () =>
      useTouchHelp
        ? [t('help.touch1'), t('help.touch2'), t('help.touch3'), t('help.touch4')]
        : [
            t('help.mouse1'),
            t('help.mouse2'),
            t('help.mouse3'),
            t('help.mouse4'),
            t('help.kbd1'),
            t('help.kbd2'),
            t('help.kbd3'),
            t('help.kbd4')
          ],
    [t, useTouchHelp]
  );

  return (
    <ul className="control-help-list">
      {helpItems.map((item, index) => (
        <li key={`${index}-${item}`}>{item}</li>
      ))}
    </ul>
  );
};

export const ControlHelpContent = memo(ControlHelpContentComponent);

const ControlHelpComponent = (): ReactElement => {
  const { t } = useI18n();

  return (
    <section className="card control-help" aria-label={t('help.title')}>
      <h3>{t('help.title')}</h3>
      <ControlHelpContent />
    </section>
  );
};

export const ControlHelp = memo(ControlHelpComponent);

```
> meta: lines=58 chars=1538 truncated=no


## src/features/javelin/components/GameActions.tsx
_Reusable UI component or set of components._

```tsx
/**
 * Primary game action controls.
 * Handles round start/restart and reset-to-idle actions.
 */
import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { resumeAudioContext } from '../game/audio';
import type { GameAction, GameState } from '../game/types';

type Dispatch = (action: GameAction) => void;

type GameActionsProps = {
  state: GameState;
  dispatch: Dispatch;
};

export const GameActions = ({ state, dispatch }: GameActionsProps): ReactElement => {
  const { t } = useI18n();

  return (
    <div className="actions">
      <button
        type="button"
        onClick={(event) => {
          resumeAudioContext();
          dispatch({
            type: 'startRound',
            atMs: performance.now(),
            windMs: state.windMs,
            windZMs: state.windZMs
          });
          event.currentTarget.blur();
        }}
      >
        {state.phase.tag === 'idle' ? t('action.start') : t('action.playAgain')}
      </button>
      <button
        type="button"
        className="ghost"
        onClick={(event) => {
          dispatch({ type: 'resetToIdle' });
          event.currentTarget.blur();
        }}
      >
        {t('phase.idle')}
      </button>
    </div>
  );
};

```
> meta: lines=50 chars=1255 truncated=no


## src/features/javelin/components/GameCanvas.tsx
_Reusable UI component or set of components._

```tsx
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { createRenderSession, renderGame, type GameAudioCallbacks } from '../game/render';
import {
  playChargeStart,
  playCrowdReaction,
  playFaultOof,
  playLandingImpact,
  playRunupTap,
// ... 9 more import lines from ., .., react

type Dispatch = (action: GameAction) => void;

type GameCanvasProps = {
  state: GameState;
  dispatch: Dispatch;
};

const getPhaseAnnouncement = (
  state: GameState,
  t: (key: string) => string,
  numberFormat: Intl.NumberFormat
): string => {
  switch (state.phase.tag) {
    case 'runup':
      return t('a11y.announce.runupStarted');
    case 'chargeAim':
      return t('a11y.announce.chargeAim');
    case 'throwAnim':
      return t('a11y.announce.throwAnim');
    case 'flight':
      return t('a11y.announce.flight');
    case 'result':
      return `${t('a11y.announce.resultPrefix')}: ${numberFormat.format(state.phase.distanceM)} m`;
    case 'fault':
      return t('a11y.announce.fault');
    case 'idle':
    default:
      return t('a11y.announce.idle');
  }
};

export const GameCanvas = ({ state, dispatch }: GameCanvasProps): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef(state);
  const lastAnnouncedPhaseRef = useRef<GameState['phase']['tag'] | null>(null);
  const lastRenderAtMsRef = useRef<number>(performance.now());
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const renderSessionRef = useRef(createRenderSession());
  const viewportRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1
  });
  const [viewportVersion, setViewportVersion] = useState(0);
  const [phaseAnnouncement, setPhaseAnnouncement] = useState('');
  const { locale, t } = useI18n();
  const { theme } = useTheme();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale]
  );
  const isTouchDevice = useMemo(() => detectTouchDevice(), []);
  const onboardingHint = useMemo(
    () => (isTouchDevice ? t('onboarding.hintTouch') : t('onboarding.hint')),
    [isTouchDevice, t]
  );
  const windHints = useMemo(
    () => ({
      headwind: t('javelin.windHintHeadwind'),
      tailwind: t('javelin.windHintTailwind')
    }),
    [t]
  );
  const announcedResultDistance =
    state.phase.tag === 'result' ? state.phase.distanceM : null;
  const releaseFlashLabels = useMemo(
    () => ({
      perfect: t('hud.perfect'),
      good: t('hud.good'),
      miss: t('hud.miss'),
      foulLine: t('javelin.result.foul_line')
    }),
    [t]
  );
  const audioCallbacks = useMemo<GameAudioCallbacks>(
    () => ({
      onRunupTap: (tapGainNorm) => playRunupTap(tapGainNorm),
      onChargeStart: () => playChargeStart(),
      onThrowRelease: (speedNorm) => playThrowWhoosh(speedNorm),
      onFlightWindUpdate: (intensity) => setFlightWindIntensity(intensity),
      onFlightWindStop: () => setFlightWindIntensity(0),
      onLandingImpact: (tipFirst) => playLandingImpact(tipFirst),
      onCrowdReaction: (reaction) => playCrowdReaction(reaction),
      onFault: () => playFaultOof()
    }),
    []
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (lastAnnouncedPhaseRef.current === state.phase.tag) {
      return;
    }
    lastAnnouncedPhaseRef.current = state.phase.tag;
    setPhaseAnnouncement(getPhaseAnnouncement(state, t, numberFormat));
  }, [announcedResultDistance, numberFormat, state.phase.tag, t]);

  usePointerControls({ canvas: canvasRef.current, dispatch, state });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const syncBackbuffer = (): void => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const pixelWidth = Math.max(1, Math.floor(width * dpr));
      const pixelHeight = Math.max(1, Math.floor(height * dpr));
      const current = viewportRef.current;
      const changed = current.width !== width || current.height !== height || current.dpr !== dpr;
      if (!changed) {
        return;
      }
      if (canvas.width !== pixelWidth) {
        canvas.width = pixelWidth;
      }
      if (canvas.height !== pixelHeight) {
        canvas.height = pixelHeight;
      }
      viewportRef.current = { width, height, dpr };
      setViewportVersion((version) => version + 1);
    };

    contextRef.current = canvas.getContext('2d');
    if (!contextRef.current) {
      return;
    }
    syncBackbuffer();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        syncBackbuffer();
      });
      observer.observe(canvas);
      return () => {
        observer.disconnect();
      };
    }

    const onWindowResize = (): void => {
      syncBackbuffer();
    };
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;

    const drawFrame = (): void => {
      const context = contextRef.current;
      const { width, height, dpr } = viewportRef.current;
      if (context && width > 0 && height > 0) {
        const nowMs = performance.now();
        const dtMs = Math.min(40, Math.max(0, nowMs - lastRenderAtMsRef.current));
        lastRenderAtMsRef.current = nowMs;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderGame({
          ctx: context,
          state: stateRef.current,
          width,
          height,
          dtMs,
          numberFormat,
          labels: {
            throwLine: t('javelin.throwLine'),
            releaseFlash: releaseFlashLabels,
            onboarding: onboardingHint,
            headwind: windHints.headwind,
            tailwind: windHints.tailwind
          },
          theme,
          prefersReducedMotion,
          session: renderSessionRef.current,
          audio: audioCallbacks
        });
      }
      rafId = window.requestAnimationFrame(drawFrame);
    };

    lastRenderAtMsRef.current = performance.now();
    rafId = window.requestAnimationFrame(drawFrame);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [
    numberFormat,
    onboardingHint,
    audioCallbacks,
    prefersReducedMotion,
    releaseFlashLabels,
    t,
    theme,
    viewportVersion,
    windHints
  ]);

  return (
    <div className="canvas-frame">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{ touchAction: 'none' }}
        role="application"
        tabIndex={0}
        aria-roledescription={t('a11y.gameCanvas')}
        aria-label={t('a11y.gameCanvas')}
      />
      <p className="sr-only" aria-live="assertive" aria-atomic="true">
        {phaseAnnouncement}
      </p>
    </div>
  );
};

```
> meta: lines=236 chars=7105 truncated=no


## src/features/javelin/components/HudPanel.tsx
_Reusable UI component or set of components._

```tsx
import type { ReactElement } from 'react';
import type { GameState } from '../game/types';
import { getThrowLineRemainingM } from '../game/selectors';
import { useI18n } from '../../../i18n/init';

type HudPanelProps = {
  state: GameState;
};

const phaseMessageKey = (state: GameState): string => {
  switch (state.phase.tag) {
    case 'idle':
      return 'phase.idle';
    case 'runup':
      return 'phase.runup';
    case 'chargeAim':
      return 'phase.chargeAim';
    case 'throwAnim':
      return 'phase.throwAnim';
    case 'flight':
      return 'phase.flight';
    case 'result':
      return 'phase.result';
    case 'fault':
      return 'phase.fault';
    default:
      return 'phase.idle';
  }
};

export const HudPanel = ({ state }: HudPanelProps): ReactElement => {
  const { t, formatNumber } = useI18n();
  const throwLineRemainingM = getThrowLineRemainingM(state);

  const phaseHint =
    state.phase.tag === 'runup'
      ? `${t('javelin.runupHint')} ${throwLineRemainingM !== null ? `${formatNumber(throwLineRemainingM)} m` : ''}`
      : state.phase.tag === 'chargeAim'
        ? t('javelin.speedPassiveHint')
        : '';

  return (
    <section className="card hud-panel" aria-label={t('a11y.hudPanel')}>
      <div className="hud-topline">{t(phaseMessageKey(state))}</div>
      {phaseHint && <div className="hud-hint">{phaseHint}</div>}
    </section>
  );
};

```
> meta: lines=49 chars=1395 truncated=no


## src/features/javelin/components/LanguageSwitch.tsx
_Reusable UI component or set of components._

```tsx
import { memo, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import type { Locale } from '../game/types';

const LABELS: Record<Locale, string> = {
  fi: 'Suomi',
  sv: 'Svenska',
  en: 'English'
};

const LanguageSwitchComponent = (): ReactElement => {
  const { locale, setLocale, t } = useI18n();

  return (
    <label className="language-switch">
      <span>{t('language.label')}</span>
      <select
        aria-label={t('language.label')}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        <option value="fi">{LABELS.fi}</option>
        <option value="sv">{LABELS.sv}</option>
        <option value="en">{LABELS.en}</option>
      </select>
    </label>
  );
};

export const LanguageSwitch = memo(LanguageSwitchComponent);

```
> meta: lines=31 chars=826 truncated=no


## src/features/javelin/components/ResultDisplay.tsx
_Reusable UI component or set of components._

```tsx
/**
 * Result message and throw-spec presentation for the current round.
 * Purely visual component that consumes already-derived result data.
 */
import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import type { ResultThrowSpecs } from '../hooks/useResultMessage';

type ResultDisplayProps = {
  resultMessage: string;
  resultStatusMessage: string | null;
  isFoulMessage: boolean;
  resultThrowSpecs: ResultThrowSpecs | null;
};

export const ResultDisplay = ({
  resultMessage,
  resultStatusMessage,
  isFoulMessage,
  resultThrowSpecs
}: ResultDisplayProps): ReactElement => {
  const { t, formatNumber } = useI18n();

  return (
    <>
      <p
        className={`result-live ${isFoulMessage ? 'is-foul' : ''}`}
        aria-live="polite"
      >
        {resultMessage}
      </p>
      {resultStatusMessage && (
        <p className={`result-note ${isFoulMessage ? 'is-foul' : ''}`}>{resultStatusMessage}</p>
      )}
      {resultThrowSpecs !== null && (
        <div className="result-specs">
          <span className="score-chip">
            {t('spec.wind')}:{' '}
            {resultThrowSpecs.windMs >= 0 ? '+' : ''}
            {formatNumber(resultThrowSpecs.windMs)} m/s
          </span>
          <span className="score-chip">
            {t('spec.angle')}: {formatNumber(resultThrowSpecs.angleDeg, 0)}°
          </span>
          <span className="score-chip">
            {t('spec.launchSpeed')}: {formatNumber(resultThrowSpecs.launchSpeedMs)} m/s
          </span>
        </div>
      )}
    </>
  );
};

```
> meta: lines=53 chars=1566 truncated=no


## src/features/javelin/components/SaveScoreForm.tsx
_Reusable UI component or set of components._

```tsx
/**
 * Highscore save form with in-component name state and sanitization.
 * Emits a normalized player name to the parent submit handler.
 */
import { useState, type FormEvent, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';

type SaveScoreFormProps = {
  onSave: (name: string) => void;
  defaultName: string;
};

export const SaveScoreForm = ({ onSave, defaultName }: SaveScoreFormProps): ReactElement => {
  const { t } = useI18n();
  const [nameInput, setNameInput] = useState('AAA');

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const normalizedName = nameInput.trim().slice(0, 10) || defaultName;
    onSave(normalizedName);
  };

  return (
    <form className="save-form" onSubmit={onSubmit}>
      <label>
        {t('scoreboard.name')}
        <input
          minLength={3}
          maxLength={10}
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value.toUpperCase())}
        />
      </label>
      <button type="submit">{t('action.saveScore')}</button>
    </form>
  );
};

```
> meta: lines=38 chars=1110 truncated=no


## src/features/javelin/components/ScoreBoard.tsx
_Reusable UI component or set of components._

```tsx
import { memo, useMemo, type ReactElement } from 'react';
import type { HighscoreEntry } from '../game/types';
import { useI18n } from '../../../i18n/init';

type ScoreBoardProps = {
  highscores: HighscoreEntry[];
};

type ScoreBoardContentProps = {
  highscores: HighscoreEntry[];
};

const ScoreBoardContentComponent = ({ highscores }: ScoreBoardContentProps): ReactElement => {
  const { t, formatNumber, locale } = useI18n();
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
    [locale]
  );

  if (highscores.length === 0) {
    return <p className="scoreboard-empty">{t('scoreboard.empty')}</p>;
  }

  const formatSignedWind = (windMs: number): string =>
    `${windMs >= 0 ? '+' : ''}${formatNumber(windMs)} m/s`;

  return (
    <ol className="scoreboard-list">
      {highscores.map((entry) => (
        <li key={entry.id} className="scoreboard-entry">
          <div className="scoreboard-main">
            <span className="scoreboard-name">{entry.name}</span>
            <strong className="scoreboard-distance">{formatNumber(entry.distanceM)} m</strong>
            <time className="scoreboard-date">{dateFormatter.format(new Date(entry.playedAtIso))}</time>
          </div>
          <div className="scoreboard-meta">
            <span className="score-chip">
              {t('spec.wind')}: {formatSignedWind(entry.windMs)}
            </span>
            {typeof entry.angleDeg === 'number' && (
              <span className="score-chip">
                {t('spec.angle')}: {formatNumber(entry.angleDeg, 0)}°
              </span>
            )}
            {typeof entry.launchSpeedMs === 'number' && (
              <span className="score-chip">
                {t('spec.launchSpeed')}: {formatNumber(entry.launchSpeedMs)} m/s
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export const ScoreBoardContent = memo(ScoreBoardContentComponent);

const ScoreBoardComponent = ({ highscores }: ScoreBoardProps): ReactElement => {
  const { t } = useI18n();

  return (
    <section className="card scoreboard" aria-label={t('scoreboard.title')}>
      <h3>{t('scoreboard.title')}</h3>
      <ScoreBoardContent highscores={highscores} />
    </section>
  );
};

export const ScoreBoard = memo(ScoreBoardComponent);

```
> meta: lines=76 chars=2398 truncated=no


## src/features/javelin/components/ThemeToggle.tsx
_Reusable UI component or set of components._

```tsx
import { memo, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { useTheme } from '../../../theme/init';

const ThemeToggleComponent = (): ReactElement => {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const ariaLabel = nextTheme === 'dark' ? t('theme.toggleToDark') : t('theme.toggleToLight');

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={ariaLabel}
      onClick={toggleTheme}
      title={ariaLabel}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'dark' ? 'D' : 'L'}
      </span>
      <span className="theme-toggle-text">
        {t('theme.label')}: {theme === 'dark' ? t('theme.dark') : t('theme.light')}
      </span>
    </button>
  );
};

export const ThemeToggle = memo(ThemeToggleComponent);

```
> meta: lines=30 chars=915 truncated=no

### Other code & helpers


## src/features/javelin/game/athletePose.ts
_Defines: AthletePoseGeometry, ThrowSubphaseSample, getRunToAimBlend01, sampleThrowSubphase, computeAthletePoseGeometry_

```ts
import {
  clamp01,
  easeInCubic,
  easeInOutSine,
  easeOutCubic,
  easeOutQuad,
  lerp,
  toRad
// ... 4 more import lines from .

const { runupStartXM: RUNUP_START_X_M } = GAMEPLAY_TUNING.movement;

type PointM = {
  xM: number;
  yM: number;
};

export type AthletePoseGeometry = {
  head: PointM;
  headTiltRad: number;
  shoulderCenter: PointM;
  pelvis: PointM;
  hipFront: PointM;
  hipBack: PointM;
  kneeFront: PointM;
  kneeBack: PointM;
  footFront: PointM;
  footBack: PointM;
  elbowFront: PointM;
  elbowBack: PointM;
  handFront: PointM;
  handBack: PointM;
  javelinGrip: PointM;
  javelinAngleRad: number;
};

type MotionCurves = {
  leanRad: number;
  pelvisShiftXM: number;
  pelvisBobYM: number;
  hipFront: number;
  hipBack: number;
  kneeFront: number;
  kneeBack: number;
  shoulderFront: number;
  shoulderBack: number;
  elbowFront: number;
  elbowBack: number;
  javelinAngleRad: number;
};

type PoseSamplingOptions = {
  runBlendFromAnimT?: number;
  runToAimBlend01?: number;
};

type ThrowStage = 'windup' | 'delivery' | 'follow';

export type ThrowSubphaseSample = {
  stage: ThrowStage;
  windup01: number;
  delivery01: number;
  follow01: number;
};

const polar = (angleRad: number, length: number): { x: number; y: number } => ({
  x: Math.cos(angleRad) * length,
  y: Math.sin(angleRad) * length
});

const add = (a: PointM, b: { x: number; y: number }): PointM => ({
  xM: a.xM + b.x,
  yM: a.yM + b.y
});

const lerpPoint = (a: PointM, b: PointM, t: number): PointM => ({
  xM: lerp(a.xM, b.xM, t),
  yM: lerp(a.yM, b.yM, t)
});

const solveArm2BoneIK = (
  shoulder: PointM,
  target: PointM,
  upperLen: number,
  lowerLen: number
): { elbow: PointM; hand: PointM } => {
  const dx = target.xM - shoulder.xM;
  const dy = target.yM - shoulder.yM;
  const dist = Math.hypot(dx, dy);
  const maxReach = upperLen + lowerLen;

  if (dist >= maxReach - 0.001 || dist < 0.001) {
    const dirX = dist > 0.001 ? dx / dist : 1;
    const dirY = dist > 0.001 ? dy / dist : 0;
    return {
      elbow: {
        xM: shoulder.xM + dirX * upperLen,
        yM: shoulder.yM + dirY * upperLen
      },
      hand: {
        xM: shoulder.xM + dirX * maxReach,
        yM: shoulder.yM + dirY * maxReach
      }
    };
  }

  const cosShoulderAngle =
    (upperLen * upperLen + dist * dist - lowerLen * lowerLen) / (2 * upperLen * dist);
  const clampedCos = Math.max(-1, Math.min(1, cosShoulderAngle));
  const baseAngle = Math.atan2(dy, dx);
  const shoulderAngle = baseAngle - Math.acos(clampedCos);

  const elbow: PointM = {
    xM: shoulder.xM + Math.cos(shoulderAngle) * upperLen,
    yM: shoulder.yM + Math.sin(shoulderAngle) * upperLen
  };

  const elbowToTarget = Math.atan2(target.yM - elbow.yM, target.xM - elbow.xM);
  const hand: PointM = {
    xM: elbow.xM + Math.cos(elbowToTarget) * lowerLen,
    yM: elbow.yM + Math.sin(elbowToTarget) * lowerLen
  };

  return { elbow, hand };
};

export const getRunToAimBlend01 = (
  chargeStartedAtMs: number,
  nowMs: number,
  blendDurationMs: number
): number => {
  if (blendDurationMs <= 0) {
    return 1;
  }
  return clamp01((nowMs - chargeStartedAtMs) / blendDurationMs);
};

export const sampleThrowSubphase = (progress01: number): ThrowSubphaseSample => {
  const t = clamp01(progress01);
  const windupEnd = 0.3;
  const deliveryEnd = 0.68;

  if (t < windupEnd) {
    return {
      stage: 'windup',
      windup01: easeOutCubic(t / windupEnd),
      delivery01: 0,
      follow01: 0
    };
  }

  if (t < deliveryEnd) {
    return {
      stage: 'delivery',
      windup01: 1,
      delivery01: easeInCubic((t - windupEnd) / (deliveryEnd - windupEnd)),
      follow01: 0
    };
  }

  return {
    stage: 'follow',
    windup01: 1,
    delivery01: 1,
    follow01: easeOutQuad((t - deliveryEnd) / (1 - deliveryEnd))
  };
};

const splitBodyMix = (
  from: MotionCurves,
  to: MotionCurves,
  lowerBlend: number,
  upperBlend: number
): MotionCurves => ({
  leanRad: lerp(from.leanRad, to.leanRad, lerp(lowerBlend, upperBlend, 0.65)),
  pelvisShiftXM: lerp(from.pelvisShiftXM, to.pelvisShiftXM, lowerBlend),
  pelvisBobYM: lerp(from.pelvisBobYM, to.pelvisBobYM, lowerBlend),
  hipFront: lerp(from.hipFront, to.hipFront, lowerBlend),
  hipBack: lerp(from.hipBack, to.hipBack, lowerBlend),
  kneeFront: lerp(from.kneeFront, to.kneeFront, lowerBlend),
  kneeBack: lerp(from.kneeBack, to.kneeBack, lowerBlend),
  shoulderFront: lerp(from.shoulderFront, to.shoulderFront, upperBlend),
  shoulderBack: lerp(from.shoulderBack, to.shoulderBack, upperBlend),
  elbowFront: lerp(from.elbowFront, to.elbowFront, upperBlend),
  elbowBack: lerp(from.elbowBack, to.elbowBack, upperBlend),
  javelinAngleRad: lerp(from.javelinAngleRad, to.javelinAngleRad, upperBlend)
});

/**
 * Animation curve constants below represent body joint angles (radians)
 * and offsets (meters) in the athlete's local coordinate system.
 * Positive lean = forward, positive hip/shoulder = forward swing.
 * These values were hand-tuned for visual quality and are not
 * intended to be configurable at runtime.
 */
const runCurves = (t01: number, speedNorm: number, aimAngleDeg: number): MotionCurves => {
  const cycle = clamp01(t01) * Math.PI * 2;
  const stride = Math.sin(cycle);
  const counter = Math.sin(cycle + Math.PI);
  const runJavelinAngleDeg = Math.max(ANGLE_MIN_DEG, Math.min(ANGLE_MAX_DEG, aimAngleDeg));
  return {
    leanRad: -0.18 - 0.18 * speedNorm,
    pelvisShiftXM: 0.08 * stride,
    pelvisBobYM: 0.045 * Math.sin(cycle * 2) * (0.45 + speedNorm),
    hipFront: 0.62 * stride,
    hipBack: -0.62 * stride,
    kneeFront: 0.4 + 0.22 * (1 - stride),
    kneeBack: 0.4 + 0.22 * (1 + stride),
    shoulderFront: -0.9 * counter - 0.12,
    shoulderBack: 0.74 * counter + 0.12,
    elbowFront: 0.14,
    elbowBack: -0.12,
    javelinAngleRad: toRad(runJavelinAngleDeg)
  };
};

const aimCurves = (t01: number, aimAngleDeg: number): MotionCurves => {
  const settle = Math.sin(clamp01(t01) * Math.PI);
  return {
    leanRad: -0.31,
    pelvisShiftXM: 0.02 * settle,
    pelvisBobYM: 0.015 * settle,
    hipFront: 0.2,
    hipBack: -0.18,
    kneeFront: 0.56,
    kneeBack: 0.48,
    shoulderFront: 1.52 + 0.16 * settle,
    shoulderBack: 0.38,
    elbowFront: -0.24,
    elbowBack: -0.08,
    javelinAngleRad: toRad(aimAngleDeg)
  };
};

const throwCurves = (t01: number, aimAngleDeg: number): MotionCurves => {
  const stage = sampleThrowSubphase(t01);
  const windup = stage.windup01;
  const delivery = stage.delivery01;
  const follow = stage.follow01;

  return {
    leanRad: lerp(lerp(-0.24, -0.34, windup), lerp(0.08, 0.2, follow), delivery),
    pelvisShiftXM: lerp(lerp(-0.01, -0.06, windup), lerp(0.16, 0.2, follow), delivery),
    pelvisBobYM: 0.012 * Math.sin(clamp01(t01) * Math.PI),
    hipFront: lerp(lerp(0.2, 0.08, windup), lerp(0.62, 0.56, follow), delivery),
    hipBack: lerp(lerp(-0.18, -0.26, windup), lerp(-0.48, -0.42, follow), delivery),
    kneeFront: lerp(lerp(0.58, 0.66, windup), lerp(0.36, 0.4, follow), delivery),
    kneeBack: lerp(lerp(0.5, 0.56, windup), lerp(0.72, 0.78, follow), delivery),
    shoulderFront: lerp(lerp(1.2, 1.9, windup), lerp(0.2, -0.08, follow), delivery),
    shoulderBack: lerp(lerp(0.34, 0.5, windup), lerp(-0.34, -0.24, follow), delivery),
    elbowFront: lerp(lerp(-0.2, -0.44, windup), lerp(-0.08, -0.02, follow), delivery),
    elbowBack: lerp(lerp(-0.06, 0.12, windup), lerp(0.16, 0.2, follow), delivery),
    javelinAngleRad: toRad(aimAngleDeg)
  };
};

const followThroughCurves = (t01: number, speedNorm: number): MotionCurves => {
  const t = clamp01(t01);
  const step01 = easeOutQuad(Math.min(1, t / 0.78));
  const settle01 = easeInOutSine(clamp01((t - 0.38) / 0.62));
  const brakingIntensity = clamp01(speedNorm * 1.4);
  return {
    leanRad: lerp(0.16 + brakingIntensity * 0.12, -0.05, settle01),
    pelvisShiftXM: lerp(0.02, 0.22, step01),
    pelvisBobYM: 0.006 + 0.014 * Math.sin(t * Math.PI),
    hipFront: lerp(0.52 + brakingIntensity * 0.18, 0.38, settle01),
    hipBack: lerp(-0.44 - brakingIntensity * 0.12, -0.3, settle01),
    kneeFront: lerp(0.3 - brakingIntensity * 0.1, 0.42, settle01),
    kneeBack: lerp(0.82 + brakingIntensity * 0.08, 0.68, settle01),
    shoulderFront: lerp(0.32, 0.16, settle01),
    shoulderBack: lerp(-0.48, -0.3, settle01),
    elbowFront: lerp(-0.18, -0.06, settle01),
    elbowBack: lerp(0.24, 0.16, settle01),
    javelinAngleRad: toRad(-20)
  };
};

const fallCurves = (t01: number): MotionCurves => {
  const t = clamp01(t01);
  const thrust01 = easeOutQuad(Math.min(1, t / 0.55));
  const collapse01 = easeInOutSine(clamp01((t - 0.35) / 0.65));
  return {
    leanRad: lerp(-0.18, -0.88, collapse01),
    pelvisShiftXM: lerp(0.06, 0.42, thrust01),
    pelvisBobYM: lerp(0.01, -0.2, collapse01),
    hipFront: lerp(0.32, 0.74, collapse01),
    hipBack: lerp(-0.2, -0.44, collapse01),
    kneeFront: lerp(0.48, 0.88, collapse01),
    kneeBack: lerp(0.6, 1.02, collapse01),
    shoulderFront: lerp(-0.34, -0.92, thrust01),
    shoulderBack: lerp(0.12, -0.28, collapse01),
    elbowFront: lerp(-0.12, 0.08, collapse01),
    elbowBack: lerp(-0.04, 0.18, collapse01),
    javelinAngleRad: lerp(toRad(12), toRad(-8), collapse01)
  };
};

const idleCurves = (aimAngleDeg: number): MotionCurves => ({
  leanRad: -0.04,
  pelvisShiftXM: 0,
  pelvisBobYM: 0,
  hipFront: 0.12,
  hipBack: -0.12,
  kneeFront: 0.42,
  kneeBack: 0.42,
  shoulderFront: -0.26,
  shoulderBack: 0.2,
  elbowFront: 0.14,
  elbowBack: -0.08,
  javelinAngleRad: toRad(Math.max(ANGLE_MIN_DEG, Math.min(ANGLE_MAX_DEG, aimAngleDeg)))
});

const curvesForPose = (
  pose: AthletePoseState,
  speedNorm: number,
  aimAngleDeg: number,
  options: PoseSamplingOptions
): MotionCurves => {
  const t = clamp01(pose.animT);

  switch (pose.animTag) {
    case 'run':
      return runCurves(t, speedNorm, aimAngleDeg);
    case 'aim': {
      const targetAim = aimCurves(t, aimAngleDeg);
      if (
        typeof options.runBlendFromAnimT === 'number' &&
        typeof options.runToAimBlend01 === 'number' &&
        options.runToAimBlend01 < 1
      ) {
        const runSource = runCurves(options.runBlendFromAnimT, speedNorm, aimAngleDeg);
        const upperBlend = easeInOutSine(options.runToAimBlend01);
        const lowerBlend = easeInOutSine(
          clamp01(options.runToAimBlend01 * (1 - Math.min(speedNorm * 6, 1)))
        );
        return splitBodyMix(runSource, targetAim, lowerBlend, upperBlend);
      }
      return targetAim;
    }
    case 'throw':
      return throwCurves(t, aimAngleDeg);
    case 'followThrough':
      return followThroughCurves(t, speedNorm);
    case 'fall':
      return fallCurves(t);
    case 'idle':
    default:
      return idleCurves(aimAngleDeg);
  }
};

/**
 * Compute full-body joint geometry for the athlete in world meters.
 * Coordinate system: +X downfield and +Y upward from ground level.
 *
 * Uses forward kinematics for body chains and two-bone IK for the throwing arm
 * so the hand remains aligned with the javelin grip target.
 */
export const computeAthletePoseGeometry = (
  pose: AthletePoseState,
  speedNorm: number,
  aimAngleDeg: number,
  baseXM = RUNUP_START_X_M,
  options: PoseSamplingOptions = {}
): AthletePoseGeometry => {
  const curves = curvesForPose(pose, speedNorm, aimAngleDeg, options);
  const pelvis: PointM = {
    xM: baseXM + curves.pelvisShiftXM,
    yM: 1 + curves.pelvisBobYM
  };

  const torsoAngle = Math.PI / 2 + curves.leanRad;
  const shoulderCenter = add(pelvis, polar(torsoAngle, 0.58));
  const head = add(shoulderCenter, polar(Math.PI / 2 + curves.leanRad * 0.1, 0.22));
  const headTiltRad = (() => {
    switch (pose.animTag) {
      case 'run':
        return -0.1 - 0.08 * speedNorm;
      case 'aim':
      case 'throw':
        return toRad(aimAngleDeg) * 0.35;
      case 'followThrough':
        return -0.15;
      case 'fall':
        return -0.5;
      case 'idle':
      default:
        return 0;
    }
  })();

  const hipFront: PointM = { xM: pelvis.xM + 0.055, yM: pelvis.yM - 0.02 };
  const hipBack: PointM = { xM: pelvis.xM - 0.055, yM: pelvis.yM - 0.02 };
  const shoulderFront: PointM = { xM: shoulderCenter.xM + 0.05, yM: shoulderCenter.yM - 0.02 };
  const shoulderBack: PointM = { xM: shoulderCenter.xM - 0.05, yM: shoulderCenter.yM - 0.02 };

  const thighFrontAngle = -Math.PI / 2 + curves.hipFront;
  const thighBackAngle = -Math.PI / 2 + curves.hipBack;
  const kneeFront = add(hipFront, polar(thighFrontAngle, 0.39));
  const kneeBack = add(hipBack, polar(thighBackAngle, 0.39));

  const shinFrontAngle = thighFrontAngle - (0.54 + curves.kneeFront);
  const shinBackAngle = thighBackAngle - (0.58 + curves.kneeBack);
  const footFrontRaw = add(kneeFront, polar(shinFrontAngle, 0.37));
  const footBackRaw = add(kneeBack, polar(shinBackAngle, 0.37));
  const footFront: PointM = { xM: footFrontRaw.xM, yM: Math.max(0.02, footFrontRaw.yM) };
  const footBack: PointM = { xM: footBackRaw.xM, yM: Math.max(0.02, footBackRaw.yM) };

  const armFrontAngle = torsoAngle + curves.shoulderFront;
  const armBackAngle = torsoAngle + curves.shoulderBack;
  const elbowFrontCurve = add(shoulderFront, polar(armFrontAngle, 0.33));
  const elbowBack = add(shoulderBack, polar(armBackAngle, 0.3));
  const handFrontCurve = add(elbowFrontCurve, polar(armFrontAngle + curves.elbowFront, 0.31));
  const handBack = add(elbowBack, polar(armBackAngle + curves.elbowBack, 0.29));

  const baseJavelinAngleRad = pose.animTag === 'throw' ? toRad(aimAngleDeg) : curves.javelinAngleRad;
  const aimDir = polar(baseJavelinAngleRad, 1);
  const aimNormal = { x: -aimDir.y, y: aimDir.x };
  const ikTarget: PointM = (() => {
    if (pose.animTag !== 'throw') {
      return {
        xM: shoulderFront.xM + aimDir.x * 0.56,
        yM: shoulderFront.yM + aimDir.y * 0.56
      };
    }

    const stage = sampleThrowSubphase(pose.animT);
    const hold: PointM = {
      xM: shoulderFront.xM + aimDir.x * 0.34 + aimNormal.x * 0.04,
      yM: shoulderFront.yM + aimDir.y * 0.34 + aimNormal.y * 0.04
    };
    const windupPoint: PointM = {
      xM: shoulderFront.xM - aimDir.x * 0.16 + aimNormal.x * 0.1,
      yM: shoulderFront.yM - aimDir.y * 0.16 + aimNormal.y * 0.1
    };
    const releasePoint: PointM = {
      xM: shoulderFront.xM + aimDir.x * 0.58 + aimNormal.x * 0.01,
      yM: shoulderFront.yM + aimDir.y * 0.58 + aimNormal.y * 0.01
    };
    const followPoint: PointM = {
      xM: shoulderFront.xM + aimDir.x * 0.48 - aimNormal.x * 0.06,
      yM: shoulderFront.yM + aimDir.y * 0.48 - aimNormal.y * 0.06
    };

    switch (stage.stage) {
      case 'windup':
        return lerpPoint(hold, windupPoint, stage.windup01);
      case 'delivery':
        return lerpPoint(windupPoint, releasePoint, stage.delivery01);
      case 'follow':
      default:
        return lerpPoint(releasePoint, followPoint, stage.follow01);
    }
  })();
  const ikResult = solveArm2BoneIK(shoulderFront, ikTarget, 0.33, 0.31);
  const ikBlend =
    pose.animTag === 'idle'
      ? 0.7
      : pose.animTag === 'run'
        ? 0.6
        : pose.animTag === 'aim'
          ? 0.85
          : pose.animTag === 'throw'
            ? 0.92
            : 0;
  const elbowFront: PointM = {
    xM: lerp(elbowFrontCurve.xM, ikResult.elbow.xM, ikBlend),
    yM: lerp(elbowFrontCurve.yM, ikResult.elbow.yM, ikBlend)
  };
  const handFront: PointM = {
    xM: lerp(handFrontCurve.xM, ikResult.hand.xM, ikBlend),
    yM: lerp(handFrontCurve.yM, ikResult.hand.yM, ikBlend)
  };

  const attachedJavelinAngle = baseJavelinAngleRad;

  return {
    head,
    headTiltRad,
    shoulderCenter,
    pelvis,
    hipFront,
    hipBack,
    kneeFront,
    kneeBack,
    footFront,
    footBack,
    elbowFront,
    elbowBack,
    handFront,
    handBack,
    javelinGrip: handFront,
    javelinAngleRad: attachedJavelinAngle
  };
};

```
> meta: lines=496 chars=15868 truncated=no

### Audio


## src/features/javelin/game/audio.ts
_Defines: playRunupTap, playChargeStart, playThrowWhoosh, setFlightWindIntensity, playLandingImpact, playCrowdReaction_

```ts
import { clamp, lerp } from './math';
import { GAMEPLAY_TUNING } from './tuning';

const {
  masterVolume: AUDIO_MASTER_VOLUME,
  runupTapVolume: AUDIO_RUNUP_TAP_VOLUME,
  crowdVolume: AUDIO_CROWD_VOLUME,
  effectsVolume: AUDIO_EFFECTS_VOLUME,
  crowdAmbientGain: AUDIO_CROWD_AMBIENT_GAIN
} = GAMEPLAY_TUNING.audio;

type CrowdReaction = 'cheer' | 'groan';

type AudioEngine = {
  ctx: AudioContext;
  master: GainNode;
  channels: {
    runup: GainNode;
    crowd: GainNode;
    effects: GainNode;
  };
  crowdSource: AudioBufferSourceNode | null;
  crowdAmbientGain: GainNode | null;
  flightWindSource: AudioBufferSourceNode | null;
  flightWindGain: GainNode | null;
  noiseBuffer: AudioBuffer | null;
  lastRunupTapAtMs: number;
  minRunupTapIntervalMs: number;
  crowdBaseGain: number;
};

type BrowserWindowWithWebkit = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let audioState: AudioEngine | null = null;

const getAudioContextCtor = (): typeof AudioContext | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const browserWindow = window as BrowserWindowWithWebkit;
  return browserWindow.AudioContext ?? browserWindow.webkitAudioContext ?? null;
};

const createNoiseBuffer = (ctx: AudioContext, durationS: number): AudioBuffer => {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(1, Math.ceil(sampleRate * durationS));
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }
  return buffer;
};

const ensureNoiseBuffer = (audio: AudioEngine, durationS = 2): AudioBuffer => {
  if (audio.noiseBuffer === null) {
    audio.noiseBuffer = createNoiseBuffer(audio.ctx, durationS);
  }
  return audio.noiseBuffer;
};

const ensureAudioEngine = (): AudioEngine | null => {
  if (audioState !== null) {
    return audioState;
  }

  const AudioContextCtor = getAudioContextCtor();
  if (AudioContextCtor === null) {
    return null;
  }

  const ctx = new AudioContextCtor();
  const master = ctx.createGain();
  const runup = ctx.createGain();
  const crowd = ctx.createGain();
  const effects = ctx.createGain();

  master.gain.value = clamp(AUDIO_MASTER_VOLUME, 0, 1);
  runup.gain.value = clamp(AUDIO_RUNUP_TAP_VOLUME, 0, 1);
  crowd.gain.value = clamp(AUDIO_CROWD_VOLUME, 0, 1);
  effects.gain.value = clamp(AUDIO_EFFECTS_VOLUME, 0, 1);

  runup.connect(master);
  crowd.connect(master);
  effects.connect(master);
  master.connect(ctx.destination);

  audioState = {
    ctx,
    master,
    channels: {
      runup,
      crowd,
      effects
    },
    crowdSource: null,
    crowdAmbientGain: null,
    flightWindSource: null,
    flightWindGain: null,
    noiseBuffer: null,
    lastRunupTapAtMs: 0,
    minRunupTapIntervalMs: 36,
    crowdBaseGain: clamp(AUDIO_CROWD_AMBIENT_GAIN, 0.001, 0.25)
  };

  return audioState;
};

const startCrowdAmbience = (audio: AudioEngine): void => {
  if (audio.crowdSource !== null) {
    return;
  }

  const source = audio.ctx.createBufferSource();
  source.buffer = ensureNoiseBuffer(audio, 2);
  source.loop = true;

  const filter = audio.ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, audio.ctx.currentTime);
  filter.Q.setValueAtTime(0.8, audio.ctx.currentTime);

  const gain = audio.ctx.createGain();
  gain.gain.setValueAtTime(audio.crowdBaseGain, audio.ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.channels.crowd);

  source.start();
  source.onended = () => {
    if (audio.crowdSource === source) {
      audio.crowdSource = null;
      audio.crowdAmbientGain = null;
    }
  };

  audio.crowdSource = source;
  audio.crowdAmbientGain = gain;
};

const ensureFlightWind = (audio: AudioEngine): GainNode => {
  if (audio.flightWindSource !== null && audio.flightWindGain !== null) {
    return audio.flightWindGain;
  }

  const source = audio.ctx.createBufferSource();
  source.buffer = ensureNoiseBuffer(audio, 2);
  source.loop = true;

  const filter = audio.ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1800, audio.ctx.currentTime);

  const gain = audio.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, audio.ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.channels.effects);
  source.start();
  source.onended = () => {
    if (audio.flightWindSource === source) {
      audio.flightWindSource = null;
      audio.flightWindGain = null;
    }
  };

  audio.flightWindSource = source;
  audio.flightWindGain = gain;
  return gain;
};

type ToneParams = {
  frequencyHz: number;
  endFrequencyHz?: number;
  type: OscillatorType;
  volume: number;
  durationS: number;
  attackS?: number;
  startOffsetS?: number;
};

const playTone = (audio: AudioEngine, destination: AudioNode, params: ToneParams): void => {
  const now = audio.ctx.currentTime + (params.startOffsetS ?? 0);
  const attackS = Math.max(0.001, params.attackS ?? 0.005);
  const durationS = Math.max(0.015, params.durationS);
  const endTime = now + durationS;

  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = params.type;
  osc.frequency.setValueAtTime(Math.max(20, params.frequencyHz), now);
  if (typeof params.endFrequencyHz === 'number') {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, params.endFrequencyHz), endTime);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(Math.max(0.0001, params.volume), now + attackS);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(endTime + 0.03);
};

type NoiseBurstParams = {
  filterType: BiquadFilterType;
  filterHz: number;
  volume: number;
  durationS: number;
  attackS?: number;
  startOffsetS?: number;
};

const playNoiseBurst = (audio: AudioEngine, destination: AudioNode, params: NoiseBurstParams): void => {
  const now = audio.ctx.currentTime + (params.startOffsetS ?? 0);
  const durationS = Math.max(0.02, params.durationS);
  const attackS = Math.max(0.002, params.attackS ?? 0.01);
  const source = audio.ctx.createBufferSource();
  source.buffer = createNoiseBuffer(audio.ctx, durationS);

  const filter = audio.ctx.createBiquadFilter();
  filter.type = params.filterType;
  filter.frequency.setValueAtTime(Math.max(20, params.filterHz), now);

  const gain = audio.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(Math.max(0.0001, params.volume), now + attackS);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationS);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(now);
  source.stop(now + durationS + 0.03);
};

const runWithAudio = (callback: (audio: AudioEngine) => void): void => {
  const audio = ensureAudioEngine();
  if (audio === null) {
    return;
  }
  callback(audio);
};

export const playRunupTap = (intensity01: number): void => {
  runWithAudio((audio) => {
    const nowMs = audio.ctx.currentTime * 1000;
    if (nowMs - audio.lastRunupTapAtMs < audio.minRunupTapIntervalMs) {
      return;
    }
    audio.lastRunupTapAtMs = nowMs;

    const intensity = clamp(intensity01, 0, 1);
    const baseFrequencyHz = lerp(260, 520, intensity);
    const baseVolume = lerp(0.055, 0.11, intensity);

    playTone(audio, audio.channels.runup, {
      frequencyHz: baseFrequencyHz,
      type: 'triangle',
      volume: baseVolume,
      durationS: 0.045,
      attackS: 0.003
    });
    playTone(audio, audio.channels.runup, {
      frequencyHz: baseFrequencyHz * 1.35,
      type: 'square',
      volume: baseVolume * 0.55,
      durationS: 0.028,
      attackS: 0.002,
      startOffsetS: 0.015
    });
  });
};

export const playChargeStart = (): void => {
  runWithAudio((audio) => {
    playTone(audio, audio.channels.effects, {
      frequencyHz: 150,
      endFrequencyHz: 120,
      type: 'sine',
      volume: 0.045,
      durationS: 0.12,
      attackS: 0.01
    });
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'lowpass',
      filterHz: 520,
      volume: 0.025,
      durationS: 0.12
    });
  });
};

export const playThrowWhoosh = (speedNorm: number): void => {
  runWithAudio((audio) => {
    const speedT = clamp(speedNorm, 0, 1);
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'highpass',
      filterHz: lerp(2000, 6000, speedT),
      volume: lerp(0.08, 0.15, speedT),
      durationS: 0.15
    });
  });
};

export const setFlightWindIntensity = (speedNorm: number): void => {
  runWithAudio((audio) => {
    const gain = ensureFlightWind(audio);
    const intensity = clamp(speedNorm, 0, 1);
    const now = audio.ctx.currentTime;
    const currentGain = Math.max(0.0001, gain.gain.value);
    const targetGain = lerp(0.0001, 0.09, intensity);
    const rampDurationS = targetGain < currentGain ? 0.025 : 0.08;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(currentGain, now);
    gain.gain.linearRampToValueAtTime(targetGain, now + rampDurationS);
  });
};

export const playLandingImpact = (tipFirst: boolean): void => {
  runWithAudio((audio) => {
    playTone(audio, audio.channels.effects, {
      frequencyHz: 112,
      endFrequencyHz: 86,
      type: 'sine',
      volume: 0.135,
      durationS: 0.12,
      attackS: 0.003
    });
    playTone(audio, audio.channels.effects, {
      frequencyHz: 220,
      endFrequencyHz: 168,
      type: 'triangle',
      volume: 0.082,
      durationS: 0.08,
      attackS: 0.002
    });
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'lowpass',
      filterHz: 560,
      volume: 0.072,
      durationS: 0.11,
      attackS: 0.003
    });
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'bandpass',
      filterHz: 1450,
      volume: 0.09,
      durationS: 0.06,
      attackS: 0.002
    });
    if (tipFirst) {
      playTone(audio, audio.channels.effects, {
        frequencyHz: 1500,
        endFrequencyHz: 1280,
        type: 'triangle',
        volume: 0.07,
        durationS: 0.05,
        attackS: 0.003,
        startOffsetS: 0.018
      });
    }
  });
};

export const playCrowdReaction = (reaction: CrowdReaction): void => {
  runWithAudio((audio) => {
    const now = audio.ctx.currentTime;
    const crowdChannel = audio.channels.crowd.gain;
    const base = clamp(AUDIO_CROWD_VOLUME, 0, 1);
    crowdChannel.cancelScheduledValues(now);
    crowdChannel.setValueAtTime(crowdChannel.value, now);

    if (reaction === 'cheer') {
      crowdChannel.linearRampToValueAtTime(base * 0.92, now + 0.09);
      crowdChannel.linearRampToValueAtTime(Math.min(1, base * 1.8), now + 0.29);
      crowdChannel.linearRampToValueAtTime(base, now + 1.45);
      playNoiseBurst(audio, audio.channels.crowd, {
        filterType: 'bandpass',
        filterHz: 1500,
        volume: 0.07,
        durationS: 0.28,
        startOffsetS: 0.09
      });
      return;
    }

    crowdChannel.linearRampToValueAtTime(base * 0.45, now + 0.06);
    crowdChannel.linearRampToValueAtTime(base, now + 0.85);
    playTone(audio, audio.channels.crowd, {
      frequencyHz: 110,
      type: 'square',
      volume: 0.05,
      durationS: 0.12
    });
  });
};

export const playFaultOof = (): void => {
  runWithAudio((audio) => {
    playTone(audio, audio.channels.effects, {
      frequencyHz: 140,
      endFrequencyHz: 100,
      type: 'square',
      volume: 0.1,
      durationS: 0.18,
      attackS: 0.002
    });
  });
};

export const resumeAudioContext = (): void => {
  const audio = ensureAudioEngine();
  if (audio === null) {
    return;
  }

  const bootAmbience = (): void => {
    startCrowdAmbience(audio);
  };

  if (audio.ctx.state === 'suspended') {
    void audio.ctx.resume().then(bootAmbience).catch(() => {
      
    });
    return;
  }

  bootAmbience();
};

```
> meta: lines=437 chars=12054 truncated=no

### Rendering & visual effects


## src/features/javelin/game/camera.ts
_Defines: WorldToScreenInput, WorldToScreen, RUNWAY_OFFSET_X, CameraSmoothingState, createCameraSmoothingState, getCameraTargetX_

```ts
import {
  CAMERA_DEFAULT_VIEW_WIDTH_M,
  CAMERA_FLIGHT_TARGET_AHEAD,
  CAMERA_FLIGHT_VIEW_WIDTH_M,
  CAMERA_GROUND_BOTTOM_PADDING,
  CAMERA_RESULT_TARGET_AHEAD,
  CAMERA_RESULT_VIEW_WIDTH_M,
  CAMERA_RUNUP_TARGET_AHEAD,
// ... 10 more import lines from .

const { runupStartXM: RUNUP_START_X_M } = GAMEPLAY_TUNING.movement;

export type WorldToScreenInput = {
  xM: number;
  yM: number;
};

export type WorldToScreen = (input: WorldToScreenInput) => { x: number; y: number };

export const RUNWAY_OFFSET_X = 60;

type PhaseCameraConfig = {
  viewWidthM: number;
  aheadRatio: number;
  yScale: number;
};

type SmoothedCamera = {
  viewWidthM: number;
  yScale: number;
  targetX: number;
  lastPhaseTag: GamePhase['tag'];
};

export type CameraSmoothingState = SmoothedCamera;

const PLAYER_ANCHOR_OFFSET_M = -RUNUP_START_X_M;
const FLIGHT_CAMERA_PROFILE_LERP_SPEED = 5.8;
const FLIGHT_CAMERA_TARGET_LERP_SPEED = 8.4;

const lerpToward = (current: number, target: number, factor: number): number =>
  current + (target - current) * Math.min(1, Math.max(0, factor));

const PHASE_CAMERA_CONFIG: Record<GamePhase['tag'], PhaseCameraConfig> = {
  idle: {
    viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RUNUP_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  runup: {
    viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RUNUP_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  chargeAim: {
    viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RUNUP_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  throwAnim: {
    viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_THROW_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  flight: {
    viewWidthM: CAMERA_FLIGHT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_FLIGHT_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_FLIGHT
  },
  result: {
    viewWidthM: CAMERA_RESULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RESULT_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RESULT
  },
  fault: {
    viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_THROW_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_THROW
  }
};

const createInitialCameraState = (): CameraSmoothingState => ({
  viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
  yScale: CAMERA_Y_SCALE_RUNUP,
  targetX: RUNUP_START_X_M,
  lastPhaseTag: 'idle'
});

export const createCameraSmoothingState = (): CameraSmoothingState =>
  createInitialCameraState();

const resetSmoothCamera = (cameraState: CameraSmoothingState): void => {
  Object.assign(cameraState, createInitialCameraState());
};

/**
 * Compute world-space X target for the camera focus.
 * Leads athlete during approach phases and tracks javelin progress in flight.
 */
export const getCameraTargetX = (state: GameState): number => {
  switch (state.phase.tag) {
    case 'runup':
    case 'chargeAim':
      return state.phase.runupDistanceM + PLAYER_ANCHOR_OFFSET_M;
    case 'throwAnim':
      return state.phase.athleteXM + PLAYER_ANCHOR_OFFSET_M;
    case 'flight': {
      
      const releaseAnchorTarget = state.phase.athleteXM + PLAYER_ANCHOR_OFFSET_M;
      return Math.max(releaseAnchorTarget, state.phase.javelin.xM);
    }
    case 'result':
      return state.phase.landingXM;
    case 'fault':
      return state.phase.athleteXM + PLAYER_ANCHOR_OFFSET_M;
    case 'idle':
    default:
      return RUNUP_START_X_M + PLAYER_ANCHOR_OFFSET_M;
  }
};

export const getViewWidthM = (state: GameState): number =>
  PHASE_CAMERA_CONFIG[state.phase.tag].viewWidthM;

export const getCameraAheadRatio = (state: GameState): number =>
  PHASE_CAMERA_CONFIG[state.phase.tag].aheadRatio;

export const getVerticalScale = (state: GameState): number =>
  PHASE_CAMERA_CONFIG[state.phase.tag].yScale;

const createWorldToScreenWithCamera = (
  state: GameState,
  width: number,
  height: number,
  viewWidthM: number,
  targetX: number,
  yScale: number
): { toScreen: WorldToScreen; worldMinX: number; worldMaxX: number } => {
  const ahead = getCameraAheadRatio(state);
  const worldMinLimit = -viewWidthM * ahead;
  const worldMinX = clamp(
    targetX - viewWidthM * ahead,
    worldMinLimit,
    FIELD_MAX_DISTANCE_M - viewWidthM
  );
  const worldMaxX = worldMinX + viewWidthM;
  const playableWidth = width - RUNWAY_OFFSET_X - 24;

  const toScreen: WorldToScreen = ({ xM, yM }) => {
    const x = RUNWAY_OFFSET_X + ((xM - worldMinX) / viewWidthM) * playableWidth;
    const y = height - CAMERA_GROUND_BOTTOM_PADDING - yM * yScale;
    return { x, y };
  };

  return { toScreen, worldMinX, worldMaxX };
};

const updateSmoothedCamera = (
  state: GameState,
  dtMs: number,
  cameraState: CameraSmoothingState,
  reducedMotion = false
): void => {
  const targetViewWidth = getViewWidthM(state);
  const targetYScale = getVerticalScale(state);
  const targetX = getCameraTargetX(state);

  if (reducedMotion) {
    Object.assign(cameraState, {
      viewWidthM: targetViewWidth,
      yScale: targetYScale,
      targetX,
      lastPhaseTag: state.phase.tag
    });
    return;
  }

  switch (state.phase.tag) {
    case 'idle':
      resetSmoothCamera(cameraState);
      return;
    case 'flight':
    case 'result':
      break;
    default:
      Object.assign(cameraState, {
        viewWidthM: targetViewWidth,
        yScale: targetYScale,
        targetX,
        lastPhaseTag: state.phase.tag
      });
      return;
  }

  const phaseChanged = state.phase.tag !== cameraState.lastPhaseTag;

  const dt = Math.max(0, dtMs) / 1000;
  const profileLerpFactor = Math.min(
    1,
    dt * (phaseChanged ? FLIGHT_CAMERA_PROFILE_LERP_SPEED * 0.75 : FLIGHT_CAMERA_PROFILE_LERP_SPEED)
  );
  const targetLerpFactor = Math.min(
    1,
    dt * (phaseChanged ? FLIGHT_CAMERA_TARGET_LERP_SPEED * 0.75 : FLIGHT_CAMERA_TARGET_LERP_SPEED)
  );

  Object.assign(cameraState, {
    viewWidthM: lerpToward(cameraState.viewWidthM, targetViewWidth, profileLerpFactor),
    yScale: lerpToward(cameraState.yScale, targetYScale, profileLerpFactor),
    targetX: lerpToward(cameraState.targetX, targetX, targetLerpFactor),
    lastPhaseTag: state.phase.tag
  });
};

/**
 * Create an unsmoothed world-to-screen transform for the given frame.
 * Maps world meters into canvas pixels using the active phase camera profile.
 */
export const createWorldToScreenRaw = (
  state: GameState,
  width: number,
  height: number
): { toScreen: WorldToScreen; worldMinX: number; worldMaxX: number } => {
  return createWorldToScreenWithCamera(
    state,
    width,
    height,
    getViewWidthM(state),
    getCameraTargetX(state),
    getVerticalScale(state)
  );
};

export const createWorldToScreen = (
  state: GameState,
  width: number,
  height: number,
  dtMs: number,
  cameraState: CameraSmoothingState,
  reducedMotion = false
): { toScreen: WorldToScreen; worldMinX: number; worldMaxX: number } => {
  updateSmoothedCamera(state, dtMs, cameraState, reducedMotion);
  return createWorldToScreenWithCamera(
    state,
    width,
    height,
    cameraState.viewWidthM,
    cameraState.targetX,
    cameraState.yScale
  );
};

```
> meta: lines=252 chars=7039 truncated=no

### Other code & helpers


## src/features/javelin/game/chargeMeter.ts
_Defines: isInWindow, getTimingQuality, computeForcePreview, applyForceQualityBonus_

```ts
import type { MeterWindow, TimingQuality } from './types';
import { clamp } from './math';

/**
 * Test whether a cyclic meter phase is inside a window.
 * Supports wrap-around windows where start > end.
 */
export const isInWindow = (phase01: number, window: MeterWindow): boolean => {
  const phase = clamp(phase01, 0, 1);
  if (window.start <= window.end) {
    return phase >= window.start && phase <= window.end;
  }
  return phase >= window.start || phase <= window.end;
};

/**
 * Classify release timing as perfect, good, or miss based on configured windows.
 */
export const getTimingQuality = (
  phase01: number,
  perfectWindow: MeterWindow,
  goodWindow: MeterWindow
): TimingQuality => {
  if (isInWindow(phase01, perfectWindow)) {
    return 'perfect';
  }
  if (isInWindow(phase01, goodWindow)) {
    return 'good';
  }
  return 'miss';
};

export const computeForcePreview = (phase01: number): number =>
  clamp(phase01, 0.05, 1);

export const applyForceQualityBonus = (
  previewForceNorm: number,
  quality: TimingQuality
): number => {
  if (quality === 'perfect') {
    return clamp(previewForceNorm + 0.1, 0.1, 1);
  }
  if (quality === 'good') {
    return clamp(previewForceNorm + 0.04, 0.1, 1);
  }
  return clamp(previewForceNorm - 0.1, 0.1, 1);
};

```
> meta: lines=48 chars=1276 truncated=no


## src/features/javelin/game/constants.ts
_Defines: RUNUP_MAX_TAPS, RUNUP_SPEED_MIN_MS, RUNUP_SPEED_MAX_MS, THROW_LINE_X_M, CHARGE_ZONE_MARGIN_M, RUNUP_MAX_X_M_

```ts
export const RUNUP_MAX_TAPS = 12;
export const RUNUP_SPEED_MIN_MS = 1.6;
export const RUNUP_SPEED_MAX_MS = 9.6;
export const THROW_LINE_X_M = 18.2;
export const CHARGE_ZONE_MARGIN_M = 1.4;
export const RUNUP_MAX_X_M = 22.4;

export const ANGLE_MIN_DEG = 15;
export const ANGLE_MAX_DEG = 55;
export const ANGLE_DEFAULT_DEG = 36;

export const CAMERA_RUNUP_VIEW_WIDTH_M = 21;
export const CAMERA_THROW_VIEW_WIDTH_M = 19.5;
export const CAMERA_FLIGHT_VIEW_WIDTH_M = 29.5;
export const CAMERA_RESULT_VIEW_WIDTH_M = 29.5;
export const CAMERA_DEFAULT_VIEW_WIDTH_M = 24;

export const CAMERA_RUNUP_TARGET_AHEAD = 0.5;
export const CAMERA_THROW_TARGET_AHEAD = 0.5;
export const CAMERA_FLIGHT_TARGET_AHEAD = 0.5;
export const CAMERA_RESULT_TARGET_AHEAD = 0.5;

export const CAMERA_GROUND_BOTTOM_PADDING = 74;
export const CAMERA_Y_SCALE_RUNUP = 21;
export const CAMERA_Y_SCALE_THROW = 22;
export const CAMERA_Y_SCALE_FLIGHT = 20;
export const CAMERA_Y_SCALE_RESULT = 20;

export const WORLD_METER_RADIUS_PX = 30;
export const WORLD_METER_LINE_WIDTH_PX = 6;
export const WORLD_METER_CURSOR_RADIUS_PX = 5;
export const WORLD_METER_OFFSET_Y_PX = 44;
/** Font stack for all canvas text rendering. */
export const CANVAS_FONT_STACK = '"Trebuchet MS", "Segoe UI", sans-serif';

export const JAVELIN_GRIP_OFFSET_M = 0.12;
export const JAVELIN_GRIP_OFFSET_Y_M = 0.03;
export const JAVELIN_RELEASE_OFFSET_Y_M = 0.06;

export const LAUNCH_SPEED_MIN_MS = 11;
export const LAUNCH_SPEED_MAX_MS = 42.8;
export const LAUNCH_POWER_EXP = 1.3;
export const LAUNCH_RUNUP_WEIGHT = 0.58;
export const LAUNCH_FORCE_WEIGHT = 0.42;

export const DRAG_COEFFICIENT = 0.00835;
export const LIFT_COEFFICIENT = 0.00024;
export const AOA_MAX_RAD = 0.75;
export const LATERAL_DRAG_MULTIPLIER = 2.2;
export const MAX_LINEAR_ACCEL = 42;
export const MAX_ANGULAR_VEL_RAD = 8;
export const MAX_ANGULAR_ACC_RAD = 80;
export const ALIGN_TORQUE_BASE = 7.9;
export const ALIGN_TORQUE_SPEED_FACTOR = 16;
export const ANGULAR_DAMPING = 7.2;
export const AERO_NOSE_DOWN_BIAS_RAD = 0.04;
export const JAVELIN_LENGTH_M = 2.6;

export const WIND_MIN_MS = -2.5;
export const WIND_MAX_MS = 2.5;
export const CROSSWIND_MIN_MS = -1.0;
export const CROSSWIND_MAX_MS = 1.0;
export const FIELD_MAX_DISTANCE_M = 132;

export const MAX_HIGHSCORES = 10;
export const HIGHSCORE_STORAGE_KEY = 'sg2026-javelin-highscores-v1';

```
> meta: lines=67 chars=2359 truncated=no


## src/features/javelin/game/controls.ts
_Defines: keyboardAngleDelta, keyboardAngleHoldDelta, pointerFromAnchorToAngleDeg, smoothPointerAngleDeg_

```ts
import { ANGLE_MAX_DEG, ANGLE_MIN_DEG } from './constants';
import { clamp, clamp01, easeOutQuad, lerp } from './math';
import { GAMEPLAY_TUNING } from './tuning';

const {
  holdMaxDegPerSec: ANGLE_KEYBOARD_HOLD_MAX_DEG_PER_SEC,
  holdStartDegPerSec: ANGLE_KEYBOARD_HOLD_START_DEG_PER_SEC,
  rampMs: ANGLE_KEYBOARD_RAMP_MS,
  pointerSmoothing: ANGLE_POINTER_SMOOTHING,
  stepDeg: ANGLE_KEYBOARD_STEP_DEG,
  pointerDeadzonePx: ANGLE_POINTER_DEADZONE_PX
} = GAMEPLAY_TUNING.angleControl;

const directionSign = (direction: 'up' | 'down'): number => (direction === 'up' ? 1 : -1);

export const keyboardAngleDelta = (
  direction: 'up' | 'down',
  stepDeg = ANGLE_KEYBOARD_STEP_DEG
): number => directionSign(direction) * stepDeg;

export const keyboardAngleHoldDelta = (
  direction: 'up' | 'down',
  holdDurationMs: number,
  dtMs: number
): number => {
  const safeDtMs = Math.max(0, dtMs);
  if (safeDtMs <= 0) {
    return 0;
  }
  const safeRampMs = Math.max(1, ANGLE_KEYBOARD_RAMP_MS);
  const rampT = clamp01(Math.max(0, holdDurationMs) / safeRampMs);
  const degPerSec = lerp(
    ANGLE_KEYBOARD_HOLD_START_DEG_PER_SEC,
    ANGLE_KEYBOARD_HOLD_MAX_DEG_PER_SEC,
    easeOutQuad(rampT)
  );
  return directionSign(direction) * degPerSec * (safeDtMs / 1000);
};

export const pointerFromAnchorToAngleDeg = (
  pointerClientX: number,
  pointerClientY: number,
  anchorClientX: number,
  anchorClientY: number,
  deadzonePx = ANGLE_POINTER_DEADZONE_PX
): number => {
  const dx = pointerClientX - anchorClientX;
  const dy = anchorClientY - pointerClientY;
  const distancePx = Math.hypot(dx, dy);
  if (distancePx < deadzonePx) {
    return Number.NaN;
  }
  if (dx === 0) {
    return clamp(dy >= 0 ? ANGLE_MAX_DEG : ANGLE_MIN_DEG, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
  }
  const absDx = Math.max(Math.abs(dx), 1);
  const angleDeg = (Math.atan2(dy, absDx) * 180) / Math.PI;
  return clamp(angleDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
};

export const smoothPointerAngleDeg = (
  previousAngleDeg: number | null,
  rawAngleDeg: number,
  smoothing = ANGLE_POINTER_SMOOTHING
): number => {
  const t = clamp(smoothing, 0, 1);
  if (previousAngleDeg === null || t >= 1) {
    return rawAngleDeg;
  }
  return previousAngleDeg + (rawAngleDeg - previousAngleDeg) * t;
};

```
> meta: lines=72 chars=2263 truncated=no


## src/features/javelin/game/math.ts
_Defines: clamp, clamp01, wrap01, lerp, toRad, toDeg_

```ts
/** Clamp value between min and max inclusive. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Clamp value between 0 and 1 inclusive. */
export const clamp01 = (value: number): number => clamp(value, 0, 1);

/** Wrap value into [0, 1) range. Handles negatives correctly. */
export const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

/** Linear interpolation between a and b. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Degrees to radians. */
export const toRad = (deg: number): number => (deg * Math.PI) / 180;

/** Radians to degrees. */
export const toDeg = (rad: number): number => (rad * 180) / Math.PI;

/** Round a value to one decimal place. */
export const roundTo1 = (value: number): number => Math.round(value * 10) / 10;

export const easeOutQuad = (t: number): number => 1 - (1 - t) * (1 - t);

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const easeInCubic = (t: number): number => t ** 3;

export const easeInOutSine = (t: number): number =>
  0.5 - Math.cos(Math.PI * clamp01(t)) * 0.5;

```
> meta: lines=34 chars=1224 truncated=no

### Gameplay systems


## src/features/javelin/game/physics.ts
_Defines: computeLaunchSpeedMs, createPhysicalJavelin, updatePhysicalJavelin, distanceFromJavelin_

```ts
import {
  ALIGN_TORQUE_BASE,
  ALIGN_TORQUE_SPEED_FACTOR,
  ANGULAR_DAMPING,
  AERO_NOSE_DOWN_BIAS_RAD,
  AOA_MAX_RAD,
  DRAG_COEFFICIENT,
  FIELD_MAX_DISTANCE_M,
// ... 15 more import lines from .

const normalizeAngleRad = (angleRad: number): number => {
  let angle = angleRad;
  while (angle > Math.PI) {
    angle -= Math.PI * 2;
  }
  while (angle < -Math.PI) {
    angle += Math.PI * 2;
  }
  return angle;
};

const isFiniteState = (javelin: PhysicalJavelinState): boolean =>
  Number.isFinite(javelin.xM) &&
  Number.isFinite(javelin.yM) &&
  Number.isFinite(javelin.zM) &&
  Number.isFinite(javelin.vxMs) &&
  Number.isFinite(javelin.vyMs) &&
  Number.isFinite(javelin.vzMs) &&
  Number.isFinite(javelin.angleRad) &&
  Number.isFinite(javelin.angularVelRad);

/**
 * Compute launch speed from normalized run-up speed and charge force.
 *
 * @param speedNorm - Run-up speed from 0 (stationary) to 1 (max sprint).
 * @param forceNorm - Charge force from 0 (weak) to 1 (perfect release).
 * @returns Launch speed in meters per second.
 */
export const computeLaunchSpeedMs = (speedNorm: number, forceNorm: number): number => {
  const combinedPowerNorm = clamp(
    LAUNCH_RUNUP_WEIGHT * speedNorm + LAUNCH_FORCE_WEIGHT * forceNorm,
    0,
    1
  );
  return (
    LAUNCH_SPEED_MIN_MS +
    (LAUNCH_SPEED_MAX_MS - LAUNCH_SPEED_MIN_MS) * combinedPowerNorm ** LAUNCH_POWER_EXP
  );
};

type CreatePhysicalJavelinInput = {
  xM: number;
  yM: number;
  zM?: number;
  launchAngleRad: number;
  launchSpeedMs: number;
  athleteForwardMs: number;
  lateralVelMs: number;
  releasedAtMs: number;
};

/**
 * Create a javelin physics state at release time.
 * Coordinate system: +X downfield, +Y upward, +Z lateral from throw centerline.
 * Positions are meters and velocities are meters/second.
 */
export const createPhysicalJavelin = ({
  xM,
  yM,
  zM = 0,
  launchAngleRad,
  launchSpeedMs,
  athleteForwardMs,
  lateralVelMs,
  releasedAtMs
}: CreatePhysicalJavelinInput): PhysicalJavelinState => ({
  xM,
  yM,
  zM,
  vxMs: Math.cos(launchAngleRad) * launchSpeedMs + athleteForwardMs,
  vyMs: Math.sin(launchAngleRad) * launchSpeedMs,
  vzMs: lateralVelMs,
  angleRad: launchAngleRad,
  angularVelRad: 0,
  releasedAtMs,
  lengthM: JAVELIN_LENGTH_M
});

type TipPosition = {
  tipXM: number;
  tipYM: number;
  tipZM: number;
  tailYM: number;
};

const computeTipPosition = (javelin: PhysicalJavelinState): TipPosition => {
  const halfLength = javelin.lengthM / 2;
  return {
    tipXM: javelin.xM + Math.cos(javelin.angleRad) * halfLength,
    tipYM: javelin.yM + Math.sin(javelin.angleRad) * halfLength,
    tipZM: javelin.zM,
    tailYM: javelin.yM - Math.sin(javelin.angleRad) * halfLength
  };
};

const isTipFirstLanding = (javelin: PhysicalJavelinState): boolean => {
  const tip = computeTipPosition(javelin);
  return tip.tipYM <= tip.tailYM - 0.02 && javelin.vyMs < -0.25;
};

/**
 * Step javelin physics by one frame.
 * Applies gravity, aerodynamic drag/lift, angle alignment torque, and wind drift.
 *
 * @param dtMs - Time step in milliseconds, clamped internally to 1..50 ms.
 * @param windMs - Head/tail wind component in m/s.
 * @param windZMs - Crosswind component in m/s.
 */
export const updatePhysicalJavelin = (
  javelin: PhysicalJavelinState,
  dtMs: number,
  windMs: number,
  windZMs = 0
): {
  javelin: PhysicalJavelinState;
  landed: boolean;
  tipFirst: boolean | null;
  landingTipXM: number | null;
  landingTipZM: number | null;
} => {
  const dt = clamp(dtMs / 1000, 0.001, 0.05);
  const gravity = 9.81;

  if (!isFiniteState(javelin)) {
    const safeJavelin: PhysicalJavelinState = {
      ...javelin,
      xM: Number.isFinite(javelin.xM) ? javelin.xM : 0,
      yM: Number.isFinite(javelin.yM) ? Math.max(0, javelin.yM) : 0,
      zM: Number.isFinite(javelin.zM) ? javelin.zM : 0,
      vxMs: Number.isFinite(javelin.vxMs) ? javelin.vxMs : 0,
      vyMs: Number.isFinite(javelin.vyMs) ? javelin.vyMs : 0,
      vzMs: Number.isFinite(javelin.vzMs) ? javelin.vzMs : 0,
      angleRad: Number.isFinite(javelin.angleRad) ? javelin.angleRad : 0,
      angularVelRad: Number.isFinite(javelin.angularVelRad) ? javelin.angularVelRad : 0,
      lengthM: Number.isFinite(javelin.lengthM) ? javelin.lengthM : JAVELIN_LENGTH_M
    };
    return {
      javelin: safeJavelin,
      landed: safeJavelin.yM <= 0,
      tipFirst: safeJavelin.yM <= 0 ? false : null,
      landingTipXM: safeJavelin.yM <= 0 ? safeJavelin.xM : null,
      landingTipZM: safeJavelin.yM <= 0 ? safeJavelin.zM : null
    };
  }

  const airVx = javelin.vxMs + windMs;
  const airVy = javelin.vyMs;
  const airVz = javelin.vzMs - windZMs;
  const airSpeed = Math.max(0.001, Math.hypot(airVx, airVy, airVz));
  const flowAngle = Math.atan2(airVy, Math.max(0.01, airVx));
  const aoa = clamp(normalizeAngleRad(javelin.angleRad - flowAngle), -AOA_MAX_RAD, AOA_MAX_RAD);
  const windRefMs = Math.max(0.1, WIND_MAX_MS);
  const headwindFactor01 = clamp(-windMs / windRefMs, 0, 1);
  const tailwindFactor01 = clamp(windMs / windRefMs, 0, 1);
  
  const windAoaBiasRad = headwindFactor01 * 0.06 - tailwindFactor01 * 0.025;
  const effectiveAoa = clamp(aoa + windAoaBiasRad, -AOA_MAX_RAD, AOA_MAX_RAD);
  const liftWindScale = clamp(1 + headwindFactor01 * 0.4 - tailwindFactor01 * 0.18, 0.7, 1.5);

  const dragAcc = clamp(DRAG_COEFFICIENT * airSpeed * airSpeed, 0, MAX_LINEAR_ACCEL);
  const liftAcc = clamp(
    LIFT_COEFFICIENT * airSpeed * airSpeed * Math.sin(2 * effectiveAoa) * liftWindScale,
    -MAX_LINEAR_ACCEL * 0.25,
    MAX_LINEAR_ACCEL * 0.25
  );

  const dragDirX = -airVx / airSpeed;
  const dragDirY = -airVy / airSpeed;
  const dragDirZ = -airVz / airSpeed;
  const liftDirX = -dragDirY;
  const liftDirY = dragDirX;

  const ax = clamp(dragDirX * dragAcc + liftDirX * liftAcc, -MAX_LINEAR_ACCEL, MAX_LINEAR_ACCEL);
  const ay = clamp(
    dragDirY * dragAcc + liftDirY * liftAcc - gravity,
    -MAX_LINEAR_ACCEL,
    MAX_LINEAR_ACCEL
  );
  const az = clamp(
    dragDirZ * dragAcc * LATERAL_DRAG_MULTIPLIER,
    -MAX_LINEAR_ACCEL,
    MAX_LINEAR_ACCEL
  );

  const vxMs = javelin.vxMs + ax * dt;
  const vyMs = javelin.vyMs + ay * dt;
  const vzMs = javelin.vzMs + az * dt;

  const xM = javelin.xM + vxMs * dt;
  const yM = javelin.yM + vyMs * dt;
  const zM = javelin.zM + vzMs * dt;

  const targetAngleRad = flowAngle - AERO_NOSE_DOWN_BIAS_RAD;
  const alignError = normalizeAngleRad(targetAngleRad - javelin.angleRad);
  const airSpeedFactor = clamp(airSpeed / 38, 0, 1);
  const angularAcc = clamp(
    alignError * (ALIGN_TORQUE_BASE + ALIGN_TORQUE_SPEED_FACTOR * airSpeedFactor) -
      javelin.angularVelRad * ANGULAR_DAMPING,
    -MAX_ANGULAR_ACC_RAD,
    MAX_ANGULAR_ACC_RAD
  );

  const angularVelRad = clamp(
    javelin.angularVelRad + angularAcc * dt,
    -MAX_ANGULAR_VEL_RAD,
    MAX_ANGULAR_VEL_RAD
  );
  const angleRad = normalizeAngleRad(javelin.angleRad + angularVelRad * dt);

  if (
    !Number.isFinite(xM) ||
    !Number.isFinite(yM) ||
    !Number.isFinite(zM) ||
    !Number.isFinite(vxMs) ||
    !Number.isFinite(vyMs) ||
    !Number.isFinite(vzMs)
  ) {
    const fallbackVy = javelin.vyMs - gravity * dt;
    const fallback: PhysicalJavelinState = {
      ...javelin,
      xM: clamp(javelin.xM + javelin.vxMs * dt, 0, FIELD_MAX_DISTANCE_M),
      yM: Math.max(0, javelin.yM + fallbackVy * dt),
      zM: javelin.zM + javelin.vzMs * dt,
      vxMs: javelin.vxMs,
      vyMs: fallbackVy,
      vzMs: javelin.vzMs,
      angleRad: normalizeAngleRad(javelin.angleRad + javelin.angularVelRad * dt),
      angularVelRad: javelin.angularVelRad
    };
    return {
      javelin: fallback,
      landed: fallback.yM <= 0,
      tipFirst: fallback.yM <= 0 ? false : null,
      landingTipXM: fallback.yM <= 0 ? fallback.xM : null,
      landingTipZM: fallback.yM <= 0 ? fallback.zM : null
    };
  }

  const nextJavelin: PhysicalJavelinState = {
    ...javelin,
    xM,
    yM,
    zM,
    vxMs,
    vyMs,
    vzMs,
    angleRad,
    angularVelRad
  };

  const tip = computeTipPosition(nextJavelin);
  const touchesGround = nextJavelin.yM <= 0 || tip.tipYM <= 0 || tip.tailYM <= 0;

  if (touchesGround) {
    const landedJavelin: PhysicalJavelinState = {
      ...nextJavelin,
      xM: clamp(nextJavelin.xM, 0, FIELD_MAX_DISTANCE_M),
      yM: Math.max(0, nextJavelin.yM)
    };
    const tipPosition = computeTipPosition(landedJavelin);
    return {
      javelin: landedJavelin,
      landed: true,
      tipFirst: isTipFirstLanding(landedJavelin),
      landingTipXM: clamp(tipPosition.tipXM, 0, FIELD_MAX_DISTANCE_M),
      landingTipZM: tipPosition.tipZM
    };
  }

  return {
    javelin: nextJavelin,
    landed: false,
    tipFirst: null,
    landingTipXM: null,
    landingTipZM: null
  };
};

export const distanceFromJavelin = (javelin: PhysicalJavelinState): number =>
  roundTo1(clamp(javelin.xM, 0, FIELD_MAX_DISTANCE_M));

```
> meta: lines=291 chars=8892 truncated=no

### Other code & helpers


## src/features/javelin/game/reducer.ts
_Defines: gameReducer_

```ts
import type { GameAction, GameState } from './types';
import { reduceGameState } from './update';

/**
 * Stable public API for the game reducer.
 *
 * This thin wrapper provides a seam for future middleware (logging,
 * dev tools, replay capture) without changing consumer import paths.
 * Game logic remains in update
export const gameReducer = (state: GameState, action: GameAction): GameState =>
  reduceGameState(state, action);

```
> meta: lines=12 chars=434 truncated=no

### Rendering & visual effects


## src/features/javelin/game/render/background.ts
_Defines: getSessionPalette, drawBackground, drawClouds_

```ts
/**
 * Sky, clouds, and atmospheric haze rendering.
 * Called once per frame before any world-space content.
 */
import { CAMERA_GROUND_BOTTOM_PADDING } from '../constants';
import { getRenderPalette, type RenderPalette } from '../renderTheme';
import type { ThemeMode } from '../../../../theme/init';
import { CLOUD_LAYERS, type RenderSession } from './types';

export const getSessionPalette = (theme: ThemeMode, session: RenderSession): RenderPalette => {
  if (session.paletteCache?.theme === theme) {
    return session.paletteCache.palette;
  }
  const palette = getRenderPalette(theme);
  session.paletteCache = { theme, palette };
  return palette;
};

const getBackgroundGradients = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: RenderPalette,
  theme: ThemeMode,
  session: RenderSession
): { sky: CanvasGradient; haze: CanvasGradient } => {
  const cache = session.backgroundGradientCache;
  if (cache && cache.width === width && cache.height === height && cache.theme === theme) {
    return { sky: cache.sky, haze: cache.haze };
  }

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, palette.scene.skyTop);
  sky.addColorStop(0.56, palette.scene.skyMid);
  sky.addColorStop(1, palette.scene.skyBottom);

  const haze = ctx.createRadialGradient(
    width * 0.25,
    height * 0.1,
    20,
    width * 0.25,
    height * 0.1,
    width * 0.8
  );
  haze.addColorStop(0, palette.scene.hazeCenter);
  haze.addColorStop(1, 'rgba(255, 255, 255, 0)');

  session.backgroundGradientCache = { width, height, theme, sky, haze };
  return { sky, haze };
};

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: RenderPalette,
  theme: ThemeMode,
  session: RenderSession
): void => {
  const gradients = getBackgroundGradients(ctx, width, height, palette, theme, session);

  ctx.fillStyle = gradients.sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = gradients.haze;
  ctx.fillRect(0, 0, width, height);
};

export const drawClouds = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  worldMinX: number,
  palette: RenderPalette
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;

  for (const layer of CLOUD_LAYERS) {
    const baseY = groundY * layer.yFraction;
    const scrollPx = worldMinX * layer.parallaxFactor * 4;

    for (const cloud of layer.clouds) {
      const rawX = cloud.offsetXM * 8 - scrollPx;
      const wrapWidth = width + cloud.widthPx * 2;
      const x = ((rawX % wrapWidth) + wrapWidth) % wrapWidth - cloud.widthPx;
      const y = baseY;

      ctx.save();
      ctx.globalAlpha = Math.min(1, cloud.opacity + 0.16);
      ctx.fillStyle = palette.scene.cloudFill;
      ctx.beginPath();
      const rx = cloud.widthPx / 2;
      const ry = cloud.heightPx / 2;
      ctx.ellipse(x + rx, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 0.6, y + ry * 0.15, rx * 0.7, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 1.4, y - ry * 0.1, rx * 0.65, ry * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = palette.scene.cloudStroke;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }
};

```
> meta: lines=105 chars=3244 truncated=no


## src/features/javelin/game/render/field.ts
_Defines: drawTrackAndField_

```ts
/**
 * Field, runway, throw line, and distance tick rendering.
 * Drawn in world space before athlete and projectile layers.
 */
import { RUNWAY_OFFSET_X, type WorldToScreen } from '../camera';
import {
  CAMERA_GROUND_BOTTOM_PADDING,
  CANVAS_FONT_STACK,
  FIELD_MAX_DISTANCE_M,
  THROW_LINE_X_M
} from '../constants';
import type { RenderPalette } from '../renderTheme';

const drawOutlinedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  outlineStyle: string,
  outlineWidth: number
): void => {
  ctx.save();
  ctx.strokeStyle = outlineStyle;
  ctx.lineWidth = outlineWidth;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
};

const drawThrowLine = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  height: number,
  label: string,
  uiScale: number,
  palette: RenderPalette
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  const line = toScreen({ xM: THROW_LINE_X_M, yM: 0 });
  ctx.strokeStyle = palette.scene.throwLineStroke;
  ctx.lineWidth = Math.max(2.4, 3 * uiScale);
  ctx.beginPath();
  ctx.moveTo(line.x, groundY - 24 * uiScale);
  ctx.lineTo(line.x, groundY + 19 * uiScale);
  ctx.stroke();

  ctx.font = `700 ${Math.round(12 * uiScale)}px ${CANVAS_FONT_STACK}`;
  drawOutlinedText(
    ctx,
    label,
    line.x - 28 * uiScale,
    groundY - 27 * uiScale,
    palette.scene.throwLineLabelFill,
    palette.scene.throwLineLabelOutline,
    Math.max(2, 1.8 * uiScale)
  );
};

export const drawTrackAndField = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  toScreen: WorldToScreen,
  throwLineLabel: string,
  worldMinX: number,
  worldMaxX: number,
  uiScale: number,
  palette: RenderPalette
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  ctx.fillStyle = palette.scene.fieldGrass;
  ctx.fillRect(0, groundY, width, CAMERA_GROUND_BOTTOM_PADDING);

  ctx.strokeStyle = palette.scene.runwayLine;
  ctx.lineWidth = Math.max(1.8, 2 * uiScale);
  ctx.beginPath();
  ctx.moveTo(RUNWAY_OFFSET_X, groundY);
  ctx.lineTo(width - 20, groundY);
  ctx.stroke();

  const relativeStart = Math.max(0, Math.floor((worldMinX - THROW_LINE_X_M) / 5) * 5);
  const relativeEnd = Math.max(0, worldMaxX - THROW_LINE_X_M + 5);
  for (let relativeM = relativeStart; relativeM <= relativeEnd; relativeM += 5) {
    const xM = THROW_LINE_X_M + relativeM;
    if (xM < THROW_LINE_X_M || xM > FIELD_MAX_DISTANCE_M) {
      continue;
    }
    const { x } = toScreen({ xM, yM: 0 });
    const isMajor = relativeM % 10 === 0;
    ctx.strokeStyle = isMajor ? palette.scene.distanceTickMajor : palette.scene.distanceTickMinor;
    ctx.lineWidth = isMajor ? Math.max(1.8, 2 * uiScale) : Math.max(1, 1.2 * uiScale);
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, groundY + (isMajor ? 16 * uiScale : 10 * uiScale));
    ctx.stroke();

    if (isMajor) {
      ctx.font = `700 ${Math.round(12 * uiScale)}px ${CANVAS_FONT_STACK}`;
      drawOutlinedText(
        ctx,
        `${relativeM} m`,
        x - 12 * uiScale,
        groundY + 32 * uiScale,
        palette.scene.distanceLabelFill,
        palette.scene.distanceLabelOutline,
        Math.max(1.8, 1.5 * uiScale)
      );
    }
  }

  drawThrowLine(ctx, toScreen, height, throwLineLabel, uiScale, palette);
};

```
> meta: lines=116 chars=3399 truncated=no


## src/features/javelin/game/render/index.ts

```ts
/**
 * Public API for the game rendering subsystem.
 * Re-exports compositor, session state, and helper selectors used by UI hooks and tests.
 */
export { renderGame } from './renderGame';
export { createRenderSession } from './session';
export type {
  GameAudioCallbacks,
  RenderSession,
  RenderFrameInput,
  ReleaseFlashLabels
} from './types';
export { getVisibleJavelinRenderState, getPlayerAngleAnchorScreen } from './javelinRender';
export { getCameraTargetX } from '../camera';
export { getHeadMeterScreenAnchor } from '../renderMeter';

```
> meta: lines=16 chars=547 truncated=no


## src/features/javelin/game/render/javelinRender.ts
_Defines: JavelinRenderState, getVisibleJavelinRenderState, drawJavelinWorld, drawLandedJavelin, drawLandingMarker, drawTrajectoryIndicator_

```ts
/**
 * Athlete pose sampling and javelin-related rendering helpers.
 * Includes world-space projectile visuals and landing markers.
 */
import {
  computeAthletePoseGeometry,
  getRunToAimBlend01,
  sampleThrowSubphase,
  type AthletePoseGeometry
} from '../athletePose';
import { createWorldToScreenRaw, type WorldToScreen } from '../camera';
import {
// ... 9 more import lines from ..

const {
  runupStartXM: RUNUP_START_X_M
} = GAMEPLAY_TUNING.movement;
const { runToDrawbackBlendMs: RUN_TO_DRAWBACK_BLEND_MS } = GAMEPLAY_TUNING.throwPhase;
const {
  baseOpacity: TRAJECTORY_PREVIEW_BASE_OPACITY,
  dotColor: TRAJECTORY_PREVIEW_DOT_COLOR,
  dotRadiusPx: TRAJECTORY_PREVIEW_DOT_RADIUS_PX,
  endOpacity: TRAJECTORY_PREVIEW_END_OPACITY
} = GAMEPLAY_TUNING.trajectoryIndicator;

type PosePoint = {
  xM: number;
  yM: number;
};

export type JavelinRenderState =
  | { mode: 'none' }
  | { mode: 'attached'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'flight'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'landed'; xM: number; yM: number; angleRad: number; lengthM: number };

const RUNWAY_FOOT_CONTACT_Y_M = 0.02;
const MIN_POSE_GROUNDING_SHIFT_M = 0.0001;

const shiftPointDown = (point: PosePoint, offsetYM: number): PosePoint => ({
  xM: point.xM,
  yM: point.yM - offsetYM
});

const drawOutlinedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  outlineStyle: string,
  outlineWidth: number
): void => {
  ctx.save();
  ctx.strokeStyle = outlineStyle;
  ctx.lineWidth = outlineWidth;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
};

const groundPoseToRunway = (pose: AthletePoseGeometry): AthletePoseGeometry => {
  const lowestFootYM = Math.min(pose.footFront.yM, pose.footBack.yM);
  const offsetYM = lowestFootYM - RUNWAY_FOOT_CONTACT_Y_M;
  if (offsetYM <= MIN_POSE_GROUNDING_SHIFT_M) {
    return pose;
  }

  return {
    ...pose,
    head: shiftPointDown(pose.head, offsetYM),
    shoulderCenter: shiftPointDown(pose.shoulderCenter, offsetYM),
    pelvis: shiftPointDown(pose.pelvis, offsetYM),
    hipFront: shiftPointDown(pose.hipFront, offsetYM),
    hipBack: shiftPointDown(pose.hipBack, offsetYM),
    kneeFront: shiftPointDown(pose.kneeFront, offsetYM),
    kneeBack: shiftPointDown(pose.kneeBack, offsetYM),
    footFront: shiftPointDown(pose.footFront, offsetYM),
    footBack: shiftPointDown(pose.footBack, offsetYM),
    elbowFront: shiftPointDown(pose.elbowFront, offsetYM),
    elbowBack: shiftPointDown(pose.elbowBack, offsetYM),
    handFront: shiftPointDown(pose.handFront, offsetYM),
    handBack: shiftPointDown(pose.handBack, offsetYM),
    javelinGrip: shiftPointDown(pose.javelinGrip, offsetYM)
  };
};

export const getVisibleJavelinRenderState = (
  state: GameState,
  pose: AthletePoseGeometry
): JavelinRenderState => {
  if (state.phase.tag === 'flight') {
    return {
      mode: 'flight',
      xM: state.phase.javelin.xM,
      yM: state.phase.javelin.yM,
      angleRad: state.phase.javelin.angleRad,
      lengthM: state.phase.javelin.lengthM
    };
  }

  if (state.phase.tag === 'fault') {
    return {
      mode: state.phase.javelinLanded ? 'landed' : 'flight',
      xM: state.phase.javelin.xM,
      yM: state.phase.javelin.yM,
      angleRad: state.phase.javelin.angleRad,
      lengthM: state.phase.javelin.lengthM
    };
  }

  if (
    state.phase.tag === 'idle' ||
    state.phase.tag === 'runup' ||
    state.phase.tag === 'chargeAim' ||
    state.phase.tag === 'throwAnim'
  ) {
    return {
      mode: 'attached',
      xM: pose.javelinGrip.xM + Math.cos(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_M,
      yM: pose.javelinGrip.yM + Math.sin(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_Y_M,
      angleRad: pose.javelinAngleRad,
      lengthM: JAVELIN_LENGTH_M
    };
  }

  if (state.phase.tag === 'result') {
    return {
      mode: 'landed',
      xM: state.phase.landingXM,
      yM: Math.max(0.08, state.phase.landingYM),
      angleRad: state.phase.landingAngleRad,
      lengthM: JAVELIN_LENGTH_M
    };
  }

  return { mode: 'none' };
};

export const drawJavelinWorld = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  xM: number,
  yM: number,
  angleRad: number,
  lengthM = JAVELIN_LENGTH_M,
  palette?: RenderPalette
): void => {
  const halfLength = lengthM / 2;
  const tail = {
    xM: xM - Math.cos(angleRad) * halfLength,
    yM: yM - Math.sin(angleRad) * halfLength
  };
  const tip = {
    xM: xM + Math.cos(angleRad) * halfLength,
    yM: yM + Math.sin(angleRad) * halfLength
  };
  const tailScreen = toScreen(tail);
  const tipScreen = toScreen(tip);

  ctx.strokeStyle = palette?.scene.javelinStroke ?? '#111111';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tailScreen.x, tailScreen.y);
  ctx.lineTo(tipScreen.x, tipScreen.y);
  ctx.stroke();
};

export const drawLandedJavelin = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  xM: number,
  yM: number,
  angleRad: number,
  lengthM: number,
  tipFirst: boolean,
  landingTipXM?: number,
  palette?: RenderPalette
): void => {
  const centerFromTip = (renderAngleRad: number): number =>
    landingTipXM !== undefined ? landingTipXM - (Math.cos(renderAngleRad) * lengthM) / 2 : xM;

  if (tipFirst) {
    const stuckAngle = Math.max(angleRad, -Math.PI * 0.35);
    const centerXM = centerFromTip(stuckAngle);
    drawJavelinWorld(ctx, toScreen, centerXM, yM, stuckAngle, lengthM, palette);

    const tip = toScreen({ xM: centerXM + (Math.cos(stuckAngle) * lengthM) / 2, yM: 0 });
    ctx.save();
    ctx.fillStyle = palette?.scene.javelinSoilMark ?? 'rgba(80, 50, 20, 0.3)';
    ctx.beginPath();
    ctx.ellipse(tip.x, tip.y + 2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const flatAngle = angleRad * 0.3;
  const lyingYM = Math.max(0.05, yM * 0.3);
  const centerXM = centerFromTip(flatAngle);
  drawJavelinWorld(ctx, toScreen, centerXM, lyingYM, flatAngle, lengthM, palette);

  const center = toScreen({ xM: centerXM, yM: 0 });
  ctx.save();
  ctx.strokeStyle = palette?.scene.javelinGroundTrace ?? 'rgba(80, 50, 20, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(center.x - 8, center.y + 3);
  ctx.lineTo(center.x + 12, center.y + 3);
  ctx.stroke();
  ctx.restore();
};

export const drawLandingMarker = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  landingXM: number,
  resultKind: ResultKind,
  distanceLabel: string,
  uiScale: number,
  palette: RenderPalette
): void => {
  const landing = toScreen({ xM: landingXM, yM: 0 });
  const groundY = landing.y;

  ctx.strokeStyle =
    resultKind === 'valid' ? palette.scene.landingValidStroke : palette.scene.landingFoulStroke;
  ctx.lineWidth = Math.max(1.8, 2 * uiScale);
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY + 5 * uiScale);
  ctx.lineTo(landing.x, groundY - 36 * uiScale);
  ctx.stroke();

  ctx.fillStyle =
    resultKind === 'valid' ? palette.scene.landingValidFlag : palette.scene.landingFoulFlag;
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY - 36 * uiScale);
  ctx.lineTo(landing.x + 28 * uiScale, groundY - 30 * uiScale);
  ctx.lineTo(landing.x, groundY - 24 * uiScale);
  ctx.closePath();
  ctx.fill();

  ctx.font = `700 ${Math.round(10 * uiScale)}px ${CANVAS_FONT_STACK}`;
  ctx.textAlign = 'left';
  drawOutlinedText(
    ctx,
    distanceLabel,
    landing.x + 4 * uiScale,
    groundY - 28 * uiScale,
    palette.scene.landingTextFill,
    palette.scene.landingTextOutline,
    Math.max(1.6, 1.4 * uiScale)
  );

  ctx.fillStyle = palette.scene.landingDot;
  ctx.beginPath();
  ctx.arc(landing.x, groundY + 2 * uiScale, 3 * uiScale, 0, Math.PI * 2);
  ctx.fill();
};

export const drawTrajectoryIndicator = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  points: TrajectoryPoint[],
  uiScale: number,
  reducedMotion: boolean
): void => {
  if (points.length === 0) {
    return;
  }

  const lastIndex = Math.max(1, points.length - 1);
  const dotRadiusPx = Math.max(2, TRAJECTORY_PREVIEW_DOT_RADIUS_PX * uiScale);
  ctx.save();
  ctx.fillStyle = TRAJECTORY_PREVIEW_DOT_COLOR;
  for (let index = 0; index < points.length; index += 1) {
    const t = index / lastIndex;
    const alpha = reducedMotion
      ? TRAJECTORY_PREVIEW_BASE_OPACITY
      : TRAJECTORY_PREVIEW_BASE_OPACITY +
        (TRAJECTORY_PREVIEW_END_OPACITY - TRAJECTORY_PREVIEW_BASE_OPACITY) * t;
    const screen = toScreen(points[index]);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, dotRadiusPx, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

export const getPoseForState = (state: GameState): AthletePoseGeometry => {
  const pose = (() => {
    switch (state.phase.tag) {
      case 'runup':
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          state.phase.speedNorm,
          state.aimAngleDeg,
          state.phase.runupDistanceM
        );
      case 'chargeAim': {
        const runToAimBlend01 =
          state.phase.speedNorm > 0.01
            ? getRunToAimBlend01(state.phase.chargeStartedAtMs, state.nowMs, RUN_TO_DRAWBACK_BLEND_MS)
            : 1;
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          state.phase.speedNorm,
          state.phase.angleDeg,
          state.phase.runupDistanceM,
          {
            runBlendFromAnimT: state.phase.runEntryAnimT,
            runToAimBlend01
          }
        );
      }
      case 'throwAnim':
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          state.phase.speedNorm,
          state.phase.angleDeg,
          state.phase.athleteXM
        );
      case 'flight':
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          state.phase.launchedFrom.speedNorm,
          state.phase.launchedFrom.angleDeg,
          state.phase.athleteXM
        );
      case 'result':
        return computeAthletePoseGeometry(
          { animTag: 'followThrough', animT: 1 },
          0.72,
          24,
          state.phase.athleteXM
        );
      case 'fault':
        return computeAthletePoseGeometry(
          state.phase.athletePose,
          0.14,
          state.aimAngleDeg,
          state.phase.athleteXM
        );
      case 'idle':
        return computeAthletePoseGeometry(
          { animTag: 'idle', animT: 0 },
          0,
          state.aimAngleDeg,
          RUNUP_START_X_M
        );
      default: {
        const _exhaustive: never = state.phase;
        return _exhaustive;
      }
    }
  })();

  return groundPoseToRunway(pose);
};

export const getPlayerAngleAnchorScreen = (
  state: GameState,
  width: number,
  height: number
): { x: number; y: number } => {
  const camera = createWorldToScreenRaw(state, width, height);
  const pose = getPoseForState(state);
  return camera.toScreen(pose.shoulderCenter);
};

export const shouldDrawFrontArmOverHead = (state: GameState): boolean => {
  switch (state.phase.tag) {
    case 'chargeAim':
    case 'flight':
    case 'fault':
      return false;
    case 'throwAnim':
      return sampleThrowSubphase(state.phase.animProgress).stage !== 'windup';
    case 'idle':
    case 'runup':
    case 'result':
      return true;
    default: {
      const _exhaustive: never = state.phase;
      return _exhaustive;
    }
  }
};

```
> meta: lines=393 chars=11497 truncated=no


## src/features/javelin/game/render/overlays.ts
_Defines: drawOnboardingHint, drawWindHint, drawResultOverlay, drawReleaseFlash_

```ts
/**
 * Screen-space overlay rendering helpers.
 * Includes onboarding hints, wind hints, release flash, and result marker fade.
 */
import type { WorldToScreen } from '../camera';
import { CANVAS_FONT_STACK } from '../constants';
import { getWindIndicatorLayout } from '../renderWind';
import type { RenderPalette } from '../renderTheme';
import type { GameState } from '../types';
import { drawLandingMarker } from './javelinRender';
import type { ReleaseFlashLabels, RenderSession } from './types';

const drawOutlinedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  outlineStyle: string,
  outlineWidth: number
): void => {
  ctx.save();
  ctx.strokeStyle = outlineStyle;
  ctx.lineWidth = outlineWidth;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
};

export const drawOnboardingHint = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  uiScale: number,
  palette: RenderPalette
): void => {
  if (!text.trim()) {
    return;
  }

  const y = Math.max(56, height - 28 * uiScale);
  ctx.textAlign = 'center';
  ctx.font = `700 ${Math.round(11 * uiScale)}px ${CANVAS_FONT_STACK}`;
  drawOutlinedText(
    ctx,
    text,
    width / 2,
    y,
    palette.scene.throwLineLabelFill,
    palette.scene.throwLineLabelOutline,
    Math.max(2, 1.8 * uiScale)
  );
};

export const drawWindHint = (
  ctx: CanvasRenderingContext2D,
  width: number,
  windMs: number,
  uiScale: number,
  text: string,
  palette: RenderPalette
): void => {
  if (!text.trim()) {
    return;
  }
  const layout = getWindIndicatorLayout(width, uiScale);
  const x = layout.labelX;
  const y = layout.labelY + 14 * uiScale;
  ctx.textAlign = 'left';
  ctx.font = `700 ${Math.round(10 * uiScale)}px ${CANVAS_FONT_STACK}`;
  drawOutlinedText(
    ctx,
    text,
    x,
    y,
    windMs >= 0 ? palette.wind.headwindFlagFill : palette.wind.tailwindFlagFill,
    palette.wind.labelOutline,
    Math.max(1.6, 1.3 * uiScale)
  );
};

export const drawResultOverlay = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  toScreen: WorldToScreen,
  numberFormat: Intl.NumberFormat,
  uiScale: number,
  palette: RenderPalette,
  session: RenderSession
): void => {
  if (state.phase.tag !== 'result') {
    session.resultMarker.lastRoundId = -1;
    return;
  }

  if (state.roundId !== session.resultMarker.lastRoundId) {
    session.resultMarker.lastRoundId = state.roundId;
    session.resultMarker.shownAtMs = state.nowMs;
  }
  const fadeAgeMs = Math.max(0, state.nowMs - session.resultMarker.shownAtMs);
  const alpha = Math.min(1, fadeAgeMs / 400);
  ctx.save();
  ctx.globalAlpha = alpha;
  drawLandingMarker(
    ctx,
    toScreen,
    state.phase.landingTipXM,
    state.phase.resultKind,
    `${numberFormat.format(state.phase.distanceM)}m`,
    uiScale,
    palette
  );
  ctx.restore();
};

export const drawReleaseFlash = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  uiScale: number,
  palette: RenderPalette,
  labels: ReleaseFlashLabels
): void => {
  const releaseFeedback =
    state.phase.tag === 'throwAnim'
      ? {
          label: state.phase.lineCrossedAtRelease
            ? labels.foulLine
            : labels[state.phase.releaseQuality],
          shownAtMs: state.phase.releaseFlashAtMs
        }
      : state.phase.tag === 'flight'
        ? {
            label: state.phase.launchedFrom.lineCrossedAtRelease
              ? labels.foulLine
              : labels[state.phase.launchedFrom.releaseQuality],
            shownAtMs: state.phase.javelin.releasedAtMs
          }
        : null;

  if (releaseFeedback === null) {
    return;
  }

  const feedbackAgeMs = Math.max(0, state.nowMs - releaseFeedback.shownAtMs);
  const holdMs = 220;
  const fadeMs = 620;
  const totalMs = holdMs + fadeMs;
  if (feedbackAgeMs >= totalMs) {
    return;
  }

  const fadeT = feedbackAgeMs <= holdMs ? 0 : (feedbackAgeMs - holdMs) / fadeMs;
  const alpha = 1 - Math.min(1, fadeT);
  const scale = 1 + (1 - alpha) * 0.12;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `900 ${Math.round(28 * scale * uiScale)}px ${CANVAS_FONT_STACK}`;
  ctx.textAlign = 'center';
  const y = 74 + (uiScale - 1) * 10 - (1 - alpha) * 8 * uiScale;
  ctx.strokeStyle = palette.scene.releaseFlashOutline;
  ctx.lineWidth = Math.max(2, 2 * uiScale);
  ctx.strokeText(releaseFeedback.label, width / 2, y);
  ctx.fillStyle = palette.scene.releaseFlashFill;
  ctx.fillText(releaseFeedback.label, width / 2, y);
  ctx.restore();
};

```
> meta: lines=171 chars=4613 truncated=no


## src/features/javelin/game/render/renderGame.ts
_Defines: renderGame_

```ts
/**
 * Main frame compositor.
 * Calls rendering sub-modules in correct draw order (back-to-front).
 */
import { createWorldToScreen } from '../camera';
import { JAVELIN_GRIP_OFFSET_M, JAVELIN_GRIP_OFFSET_Y_M } from '../constants';
import { drawAthlete } from '../renderAthlete';
import { drawWorldTimingMeter } from '../renderMeter';
import { drawWindIndicator } from '../renderWind';
import { computeTrajectoryPreview } from '../trajectory';
import { drawBackground, drawClouds, getSessionPalette } from './background';
import { drawTrackAndField } from './field';
// ... 10 more import lines from ., ..

const getOverlayUiScale = (width: number): number => {
  const safeWidth = Math.max(280, width);
  return Math.max(0.95, Math.min(1.25, 420 / safeWidth));
};

/**
 * Render one complete game frame to canvas.
 * Draw order is back-to-front: environment, field, athlete/javelin, meters, overlays.
 */
export const renderGame = (input: RenderFrameInput): void => {
  const {
    ctx,
    state,
    width,
    height,
    dtMs,
    numberFormat,
    labels,
    theme,
    prefersReducedMotion,
    session,
    audio
  } = input;

  const phaseChanged = state.phase.tag !== session.lastPhaseTag;
  if (state.phase.tag === 'flight') {
    const speedMs = Math.hypot(
      state.phase.javelin.vxMs,
      state.phase.javelin.vyMs,
      state.phase.javelin.vzMs
    );
    const motionAudioScale = prefersReducedMotion ? 0.35 : 1;
    audio?.onFlightWindUpdate?.(Math.min(1, speedMs / 38) * motionAudioScale);
  } else {
    audio?.onFlightWindStop?.();
  }

  if (phaseChanged) {
    switch (state.phase.tag) {
      case 'chargeAim':
        audio?.onChargeStart?.();
        break;
      case 'throwAnim':
        audio?.onThrowRelease?.(state.phase.speedNorm, state.phase.releaseQuality);
        break;
      case 'result':
        audio?.onLandingImpact?.(state.phase.tipFirst === true);
        audio?.onCrowdReaction?.(state.phase.resultKind === 'valid' ? 'cheer' : 'groan');
        break;
      case 'fault':
        audio?.onFault?.();
        audio?.onCrowdReaction?.('groan');
        break;
      case 'idle':
      case 'runup':
      case 'flight':
      default:
        break;
    }
  }

  const overlayUiScale = getOverlayUiScale(width);
  const palette = getSessionPalette(theme, session);
  const camera = createWorldToScreen(
    state,
    width,
    height,
    dtMs,
    session.camera,
    prefersReducedMotion
  );
  const { toScreen, worldMinX, worldMaxX } = camera;

  drawBackground(ctx, width, height, palette, theme, session);
  drawClouds(ctx, width, height, worldMinX, palette);
  drawTrackAndField(
    ctx,
    width,
    height,
    toScreen,
    labels.throwLine,
    worldMinX,
    worldMaxX,
    overlayUiScale,
    palette
  );
  drawWindIndicator(
    ctx,
    width,
    state.windMs,
    state.nowMs,
    numberFormat,
    overlayUiScale,
    theme,
    prefersReducedMotion
  );
  if (state.phase.tag === 'chargeAim') {
    drawWindHint(
      ctx,
      width,
      state.windMs,
      overlayUiScale,
      state.windMs >= 0 ? labels.headwind : labels.tailwind,
      palette
    );
  }

  const pose = getPoseForState(state);
  const javelin = getVisibleJavelinRenderState(state, pose);
  const headScreen = drawAthlete(
    ctx,
    toScreen,
    pose,
    shouldDrawFrontArmOverHead(state),
    palette
  );

  if (javelin.mode === 'landed') {
    const tipFirst = state.phase.tag === 'result' ? state.phase.tipFirst === true : false;
    const landingTipXM = state.phase.tag === 'result' ? state.phase.landingTipXM : undefined;
    drawLandedJavelin(
      ctx,
      toScreen,
      javelin.xM,
      javelin.yM,
      javelin.angleRad,
      javelin.lengthM,
      tipFirst,
      landingTipXM,
      palette
    );
  } else if (javelin.mode !== 'none') {
    drawJavelinWorld(
      ctx,
      toScreen,
      javelin.xM,
      javelin.yM,
      javelin.angleRad,
      javelin.lengthM,
      palette
    );
  }

  if (state.phase.tag === 'chargeAim') {
    const trajectoryPreview = computeTrajectoryPreview({
      originXM: pose.javelinGrip.xM + Math.cos(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_M,
      originYM: pose.javelinGrip.yM + Math.sin(pose.javelinAngleRad) * JAVELIN_GRIP_OFFSET_Y_M,
      angleDeg: state.phase.angleDeg,
      speedNorm: state.phase.speedNorm,
      forceNorm: state.phase.forceNormPreview,
      windMs: state.windMs
    });
    drawTrajectoryIndicator(
      ctx,
      toScreen,
      trajectoryPreview.points,
      overlayUiScale,
      prefersReducedMotion
    );
  }

  if (state.phase.tag === 'idle' && state.roundId === 0) {
    drawOnboardingHint(ctx, width, height, labels.onboarding, overlayUiScale, palette);
  }

  drawResultOverlay(ctx, state, toScreen, numberFormat, overlayUiScale, palette, session);
  drawReleaseFlash(ctx, state, width, overlayUiScale, palette, labels.releaseFlash);
  drawWorldTimingMeter(ctx, state, headScreen, overlayUiScale, theme);

  if (state.phase.tag === 'runup') {
    const currentTapAtMs = state.phase.tap.lastTapAtMs;
    if (currentTapAtMs !== null && currentTapAtMs !== session.lastRunupTapAtMs) {
      audio?.onRunupTap?.(state.phase.tap.lastTapGainNorm);
      session.lastRunupTapAtMs = currentTapAtMs;
    } else if (currentTapAtMs === null) {
      session.lastRunupTapAtMs = null;
    }
  } else {
    session.lastRunupTapAtMs = null;
  }

  if (state.phase.tag === 'fault') {
    if (state.phase.javelinLanded && !session.lastFaultJavelinLanded) {
      audio?.onLandingImpact?.(false);
    }
    session.lastFaultJavelinLanded = state.phase.javelinLanded;
  } else {
    session.lastFaultJavelinLanded = false;
  }

  session.lastPhaseTag = state.phase.tag;
};

```
> meta: lines=207 chars=5716 truncated=no


## src/features/javelin/game/render/session.ts
_Defines: createRenderSession_

```ts
/**
 * Cross-frame render session state initialization.
 * Stores smoothing state, one-shot flags, and render caches.
 */
import { createCameraSmoothingState } from '../camera';
import type { RenderSession } from './types';

export const createRenderSession = (): RenderSession => ({
  camera: createCameraSmoothingState(),
  resultMarker: {
    lastRoundId: -1,
    shownAtMs: 0
  },
  lastRunupTapAtMs: null,
  lastFaultJavelinLanded: false,
  lastPhaseTag: 'idle',
  paletteCache: null,
  backgroundGradientCache: null
});

```
> meta: lines=20 chars=526 truncated=no

### Other code & helpers


## src/features/javelin/game/renderAthlete.ts
_Defines: HeadAnchor, drawAthlete_

```ts
import type { AthletePoseGeometry } from './athletePose';
import type { WorldToScreen } from './camera';
import type { RenderPalette } from './renderTheme';

export type HeadAnchor = {
  x: number;
  y: number;
};

const drawLimb = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  width: number,
  color: string
): void => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
};

const drawFrontArm = (
  ctx: CanvasRenderingContext2D,
  points: {
    shoulderCenter: { x: number; y: number };
    elbowFront: { x: number; y: number };
    handFront: { x: number; y: number };
  },
  palette: RenderPalette
): void => {
  drawLimb(ctx, points.shoulderCenter, points.elbowFront, 5, palette.athlete.limbStroke);
  drawLimb(ctx, points.elbowFront, points.handFront, 4, palette.athlete.limbFill);
};

export const drawAthlete = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  pose: AthletePoseGeometry,
  drawFrontArmOverHead: boolean,
  palette: RenderPalette
): HeadAnchor => {
  const shadowCenter = toScreen({ xM: pose.pelvis.xM + 0.06, yM: 0.02 });
  ctx.fillStyle = 'rgba(5, 28, 42, 0.18)';
  ctx.beginPath();
  ctx.ellipse(shadowCenter.x, shadowCenter.y + 3, 17, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const p = {
    head: toScreen(pose.head),
    shoulderCenter: toScreen(pose.shoulderCenter),
    pelvis: toScreen(pose.pelvis),
    hipFront: toScreen(pose.hipFront),
    hipBack: toScreen(pose.hipBack),
    kneeFront: toScreen(pose.kneeFront),
    kneeBack: toScreen(pose.kneeBack),
    footFront: toScreen(pose.footFront),
    footBack: toScreen(pose.footBack),
    elbowFront: toScreen(pose.elbowFront),
    elbowBack: toScreen(pose.elbowBack),
    handFront: toScreen(pose.handFront),
    handBack: toScreen(pose.handBack)
  };

  drawLimb(ctx, p.hipBack, p.kneeBack, 6, palette.athlete.limbStroke);
  drawLimb(ctx, p.kneeBack, p.footBack, 5, palette.athlete.limbFill);
  drawLimb(ctx, p.hipFront, p.kneeFront, 6, palette.athlete.limbStroke);
  drawLimb(ctx, p.kneeFront, p.footFront, 5, palette.athlete.limbFill);

  drawLimb(ctx, p.pelvis, p.shoulderCenter, 9, palette.athlete.limbStroke);

  drawLimb(ctx, p.shoulderCenter, p.elbowBack, 5, palette.athlete.limbFill);
  drawLimb(ctx, p.elbowBack, p.handBack, 4, palette.athlete.limbFill);

  if (!drawFrontArmOverHead) {
    drawFrontArm(ctx, p, palette);
  }

  ctx.fillStyle = palette.athlete.skin;
  ctx.beginPath();
  ctx.arc(p.head.x, p.head.y, 7.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = palette.athlete.outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.head.x, p.head.y, 7.6, 0, Math.PI * 2);
  ctx.stroke();

  const eyeOffsetX = Math.cos(pose.headTiltRad) * 3.5 + Math.sin(pose.headTiltRad) * 0.5;
  const eyeOffsetY = -Math.sin(pose.headTiltRad) * 3.5 + Math.cos(pose.headTiltRad) * 0.5;
  ctx.fillStyle = palette.athlete.eye;
  ctx.beginPath();
  ctx.arc(p.head.x + eyeOffsetX, p.head.y - eyeOffsetY, 1.2, 0, Math.PI * 2);
  ctx.fill();

  if (drawFrontArmOverHead) {
    drawFrontArm(ctx, p, palette);
  }

  return p.head;
};

```
> meta: lines=106 chars=3213 truncated=no


## src/features/javelin/game/renderMeter.ts
_Defines: getHeadMeterScreenAnchor, drawWorldTimingMeter_

```ts
import {
  CANVAS_FONT_STACK,
  WORLD_METER_CURSOR_RADIUS_PX,
  WORLD_METER_LINE_WIDTH_PX,
  WORLD_METER_OFFSET_Y_PX,
  WORLD_METER_RADIUS_PX
} from './constants';
import { clamp01, wrap01 } from './math';
// ... 6 more import lines from ., ..

const {
  chargeGoodWindow: CHARGE_GOOD_WINDOW,
  chargePerfectWindow: CHARGE_PERFECT_WINDOW
} = GAMEPLAY_TUNING.throwPhase;

type MeterZones = {
  perfect: { start: number; end: number };
  good: { start: number; end: number };
};

type WorldMeterState = {
  phase01: number;
  zones: MeterZones | null;
  feedback: TimingQuality | null;
  valuePercent: number;
};

const normalizeUiScale = (uiScale: number): number => Math.max(0.9, Math.min(1.3, uiScale));

const normalizeMeterPhase01 = (phase01: number): number => {
  if (phase01 <= 0) {
    return 0;
  }
  if (phase01 >= 1) {
    return 1;
  }
  return wrap01(phase01);
};

const phaseToSemicircleAngle = (phase01: number): number => Math.PI + clamp01(phase01) * Math.PI;

const drawSemicircleArc = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  start01: number,
  end01: number,
  color: string,
  lineWidth: number
): void => {
  const drawSegment = (start: number, end: number): void => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, phaseToSemicircleAngle(start), phaseToSemicircleAngle(end), false);
    ctx.stroke();
  };

  if (Math.abs(end01 - start01) >= 1) {
    drawSegment(0, 1);
    return;
  }

  const start = wrap01(start01);
  const end = wrap01(end01);
  if (start <= end) {
    drawSegment(start, end);
    return;
  }
  drawSegment(start, 1);
  drawSegment(0, end);
};

export const getHeadMeterScreenAnchor = (headScreen: HeadAnchor): HeadAnchor => ({
  x: headScreen.x,
  y: headScreen.y - WORLD_METER_OFFSET_Y_PX
});

const getWorldMeterState = (state: GameState): WorldMeterState | null => {
  if (state.phase.tag === 'runup') {
    const meterPhase = getRunupMeterPhase01(state);
    if (meterPhase === null) {
      return null;
    }
    return {
      phase01: meterPhase,
      zones: null,
      feedback: null,
      valuePercent: getSpeedPercent(state)
    };
  }

  if (state.phase.tag === 'chargeAim') {
    return {
      phase01: state.phase.chargeMeter.phase01,
      zones: {
        perfect: CHARGE_PERFECT_WINDOW,
        good: CHARGE_GOOD_WINDOW
      },
      feedback: state.phase.chargeMeter.lastQuality,
      valuePercent: getForcePreviewPercent(state) ?? Math.round(state.phase.forceNormPreview * 100)
    };
  }

  if (state.phase.tag === 'throwAnim') {
    return {
      phase01: state.phase.forceNorm,
      zones: {
        perfect: CHARGE_PERFECT_WINDOW,
        good: CHARGE_GOOD_WINDOW
      },
      feedback: state.phase.releaseQuality,
      valuePercent: getForcePreviewPercent(state) ?? Math.round(state.phase.forceNorm * 100)
    };
  }

  return null;
};

export const drawWorldTimingMeter = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  headScreen: HeadAnchor,
  uiScale = 1,
  theme: ThemeMode = 'light'
): void => {
  const meterState = getWorldMeterState(state);
  if (meterState === null) {
    return;
  }
  const palette = getRenderPalette(theme);

  const visualScale = normalizeUiScale(uiScale);
  const meterRadius = WORLD_METER_RADIUS_PX * visualScale;
  const meterLineWidth = WORLD_METER_LINE_WIDTH_PX * visualScale;
  const meterCursorRadius = WORLD_METER_CURSOR_RADIUS_PX * visualScale;
  const anchor = getHeadMeterScreenAnchor(headScreen);
  anchor.y -= (visualScale - 1) * 8;
  if (!Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = 0.96;

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    meterRadius,
    0,
    1,
    palette.meter.trackArc,
    meterLineWidth
  );

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    meterRadius,
    0,
    meterState.phase01,
    meterState.zones === null ? palette.meter.runupFill : palette.meter.chargeFill,
    meterLineWidth
  );

  if (meterState.zones !== null) {
    drawSemicircleArc(
      ctx,
      anchor.x,
      anchor.y,
      meterRadius,
      meterState.zones.good.start,
      meterState.zones.good.end,
      palette.meter.zoneGood,
      meterLineWidth
    );

    drawSemicircleArc(
      ctx,
      anchor.x,
      anchor.y,
      meterRadius,
      meterState.zones.perfect.start,
      meterState.zones.perfect.end,
      palette.meter.zonePerfect,
      meterLineWidth + 0.8 * visualScale
    );
  }

  const cursorAngle = phaseToSemicircleAngle(normalizeMeterPhase01(meterState.phase01));
  const cursorX = anchor.x + Math.cos(cursorAngle) * meterRadius;
  const cursorY = anchor.y + Math.sin(cursorAngle) * meterRadius;

  const cursorFill =
    meterState.zones === null
      ? palette.meter.cursorPerfect
      : meterState.feedback === 'perfect'
        ? palette.meter.cursorPerfect
        : meterState.feedback === 'good'
          ? palette.meter.cursorGood
          : palette.meter.cursorMiss;

  ctx.fillStyle = cursorFill;
  ctx.strokeStyle = palette.meter.cursorStroke;
  ctx.lineWidth = Math.max(2, 2 * visualScale);
  ctx.beginPath();
  ctx.arc(cursorX, cursorY, meterCursorRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const valueLabel = `${meterState.valuePercent}%`;
  ctx.font = `700 ${Math.round(11 * visualScale)}px ${CANVAS_FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.strokeStyle = palette.meter.valueTextOutline;
  ctx.lineWidth = Math.max(2, 1.7 * visualScale);
  ctx.strokeText(valueLabel, anchor.x, anchor.y + 16 * visualScale);
  ctx.fillStyle = palette.meter.valueTextFill;
  ctx.fillText(valueLabel, anchor.x, anchor.y + 16 * visualScale);

  ctx.restore();
};

```
> meta: lines=226 chars=5777 truncated=no


## src/features/javelin/game/renderTheme.ts
_Defines: RenderPalette, getRenderPalette_

```ts
import type { ThemeMode } from '../../../theme/init';

export type RenderPalette = {
  scene: {
    skyTop: string;
    skyMid: string;
    skyBottom: string;
    hazeCenter: string;
    cloudFill: string;
    cloudStroke: string;
    fieldGrass: string;
    runwayLine: string;
    distanceTickMajor: string;
    distanceTickMinor: string;
    distanceLabelFill: string;
    distanceLabelOutline: string;
    throwLineStroke: string;
    throwLineLabelFill: string;
    throwLineLabelOutline: string;
    javelinStroke: string;
    javelinSoilMark: string;
    javelinGroundTrace: string;
    landingValidStroke: string;
    landingFoulStroke: string;
    landingValidFlag: string;
    landingFoulFlag: string;
    landingTextFill: string;
    landingTextOutline: string;
    landingDot: string;
    releaseFlashFill: string;
    releaseFlashOutline: string;
  };
  meter: {
    trackArc: string;
    runupFill: string;
    chargeFill: string;
    zoneGood: string;
    zonePerfect: string;
    cursorPerfect: string;
    cursorGood: string;
    cursorMiss: string;
    cursorStroke: string;
    valueTextFill: string;
    valueTextOutline: string;
  };
  wind: {
    mastStroke: string;
    labelFill: string;
    labelOutline: string;
    headwindFlagFill: string;
    headwindFlagStroke: string;
    tailwindFlagFill: string;
    tailwindFlagStroke: string;
  };
  athlete: {
    skin: string;
    outline: string;
    eye: string;
    limbStroke: string;
    limbFill: string;
  };
};

const LIGHT_PALETTE: RenderPalette = {
  scene: {
    skyTop: '#dceef8',
    skyMid: '#c8e1ef',
    skyBottom: '#b8d6e3',
    hazeCenter: 'rgba(255, 255, 255, 0.24)',
    cloudFill: '#f8fcff',
    cloudStroke: 'rgba(142, 179, 200, 0.45)',
    fieldGrass: '#88d37f',
    runwayLine: '#ffffff',
    distanceTickMajor: 'rgba(255, 255, 255, 0.85)',
    distanceTickMinor: 'rgba(255, 255, 255, 0.4)',
    distanceLabelFill: '#0b2238',
    distanceLabelOutline: 'rgba(245, 252, 255, 0.92)',
    throwLineStroke: '#ff5d4e',
    throwLineLabelFill: '#a3211a',
    throwLineLabelOutline: 'rgba(246, 252, 255, 0.92)',
    javelinStroke: '#111111',
    javelinSoilMark: 'rgba(80, 50, 20, 0.3)',
    javelinGroundTrace: 'rgba(80, 50, 20, 0.2)',
    landingValidStroke: '#1f9d44',
    landingFoulStroke: '#cf3a2f',
    landingValidFlag: '#22c272',
    landingFoulFlag: '#e0453a',
    landingTextFill: '#ffffff',
    landingTextOutline: 'rgba(8, 35, 56, 0.6)',
    landingDot: 'rgba(15, 40, 60, 0.35)',
    releaseFlashFill: '#0b2238',
    releaseFlashOutline: 'rgba(240, 250, 255, 0.92)',
  },
  meter: {
    trackArc: 'rgba(10, 46, 77, 0.34)',
    runupFill: 'rgba(18, 196, 119, 0.9)',
    chargeFill: 'rgba(246, 210, 85, 0.72)',
    zoneGood: 'rgba(30, 142, 247, 0.82)',
    zonePerfect: 'rgba(18, 196, 119, 0.98)',
    cursorPerfect: '#22c272',
    cursorGood: '#329cf5',
    cursorMiss: '#f6d255',
    cursorStroke: '#0f3b61',
    valueTextFill: 'rgba(6, 32, 57, 0.9)',
    valueTextOutline: 'rgba(235, 246, 255, 0.95)',
  },
  wind: {
    mastStroke: '#0f4165',
    labelFill: '#10314a',
    labelOutline: 'rgba(245, 252, 255, 0.95)',
    headwindFlagFill: '#1f9d44',
    headwindFlagStroke: '#0b6e2d',
    tailwindFlagFill: '#cf3a2f',
    tailwindFlagStroke: '#8e281f',
  },
  athlete: {
    skin: '#ffe3bc',
    outline: '#073257',
    eye: '#0b2c49',
    limbStroke: '#073257',
    limbFill: '#073257',
  },
};

const DARK_PALETTE: RenderPalette = {
  scene: {
    skyTop: '#152430',
    skyMid: '#1c2f40',
    skyBottom: '#23384a',
    hazeCenter: 'rgba(110, 154, 191, 0.18)',
    cloudFill: '#b8cedf',
    cloudStroke: 'rgba(92, 125, 151, 0.55)',
    fieldGrass: '#3c7552',
    runwayLine: '#d9e6ee',
    distanceTickMajor: 'rgba(217, 230, 238, 0.86)',
    distanceTickMinor: 'rgba(196, 214, 227, 0.45)',
    distanceLabelFill: '#d8ecf9',
    distanceLabelOutline: 'rgba(10, 20, 28, 0.88)',
    throwLineStroke: '#ff7a6d',
    throwLineLabelFill: '#ffd6ce',
    throwLineLabelOutline: 'rgba(22, 38, 50, 0.95)',
    javelinStroke: '#eceff3',
    javelinSoilMark: 'rgba(95, 66, 36, 0.45)',
    javelinGroundTrace: 'rgba(130, 93, 54, 0.35)',
    landingValidStroke: '#44d483',
    landingFoulStroke: '#ff6b61',
    landingValidFlag: '#58e398',
    landingFoulFlag: '#ff7d73',
    landingTextFill: '#0f1d2a',
    landingTextOutline: 'rgba(222, 239, 248, 0.68)',
    landingDot: 'rgba(198, 221, 236, 0.45)',
    releaseFlashFill: '#e7f4fc',
    releaseFlashOutline: 'rgba(13, 28, 40, 0.92)',
  },
  meter: {
    trackArc: 'rgba(194, 219, 234, 0.4)',
    runupFill: 'rgba(73, 226, 153, 0.92)',
    chargeFill: 'rgba(247, 216, 106, 0.84)',
    zoneGood: 'rgba(92, 181, 255, 0.9)',
    zonePerfect: 'rgba(72, 224, 146, 1)',
    cursorPerfect: '#59e59a',
    cursorGood: '#79bfff',
    cursorMiss: '#f7db77',
    cursorStroke: '#082338',
    valueTextFill: 'rgba(229, 244, 253, 0.96)',
    valueTextOutline: 'rgba(6, 18, 26, 0.95)',
  },
  wind: {
    mastStroke: '#c8deee',
    labelFill: '#deeffa',
    labelOutline: 'rgba(7, 20, 28, 0.95)',
    headwindFlagFill: '#44d483',
    headwindFlagStroke: '#2aa463',
    tailwindFlagFill: '#ff6b61',
    tailwindFlagStroke: '#d84f47',
  },
  athlete: {
    skin: '#f5d6a8',
    outline: '#a0c4e8',
    eye: '#c0d8ef',
    limbStroke: '#a0c4e8',
    limbFill: '#a0c4e8',
  },
};

export const getRenderPalette = (theme: ThemeMode): RenderPalette =>
  theme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

```
> meta: lines=188 chars=5423 truncated=no


## src/features/javelin/game/renderWind.ts
_Defines: WindIndicatorLayout, FlagPolylinePoint, getWindIndicatorLayout, buildFlagPolyline, drawWindIndicator_

```ts
import { clamp, lerp } from './math';
import { getRenderPalette } from './renderTheme';
import { GAMEPLAY_TUNING } from './tuning';
import { CANVAS_FONT_STACK } from './constants';
import type { ThemeMode } from '../../../theme/init';

const {
  visualCalmThresholdMs: WIND_VISUAL_CALM_THRESHOLD_MS,
  visualMaxReferenceMs: WIND_VISUAL_MAX_REFERENCE_MS
} = GAMEPLAY_TUNING.wind;

const MOBILE_WIND_BREAKPOINT_PX = 600;
const FLAG_SEGMENT_COUNT = 6;

export type WindIndicatorLayout = {
  isMobile: boolean;
  mastX: number;
  mastTopY: number;
  mastBottomY: number;
  flagAnchorY: number;
  labelX: number;
  labelY: number;
};

export type FlagPolylinePoint = {
  x: number;
  y: number;
};

const drawOutlinedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  outlineStyle: string,
  outlineWidth: number
): void => {
  ctx.save();
  ctx.strokeStyle = outlineStyle;
  ctx.lineWidth = outlineWidth;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
};

const smoothstep01 = (value: number): number => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const windSignedStrength = (windMs: number): number =>
  clamp(windMs / Math.max(0.01, WIND_VISUAL_MAX_REFERENCE_MS), -1, 1);

const windStrength01 = (windMs: number): number =>
  smoothstep01(
    (Math.abs(windMs) - WIND_VISUAL_CALM_THRESHOLD_MS) /
      Math.max(0.01, WIND_VISUAL_MAX_REFERENCE_MS - WIND_VISUAL_CALM_THRESHOLD_MS)
  );

export const getWindIndicatorLayout = (width: number, uiScale: number): WindIndicatorLayout => {
  const safeScale = clamp(uiScale, 0.8, 1.5);
  const isMobile = width < MOBILE_WIND_BREAKPOINT_PX;
  const rightPadding = isMobile ? 18 : Math.round(26 * safeScale);
  const topPadding = isMobile ? 16 : Math.round(20 * safeScale);
  const mastHeight = (isMobile ? 32 : 36) * safeScale;
  const mastX = width - rightPadding;
  const mastTopY = topPadding;
  const mastBottomY = topPadding + mastHeight;

  return {
    isMobile,
    mastX,
    mastTopY,
    mastBottomY,
    flagAnchorY: mastTopY + 2 * safeScale,
    labelX: mastX - (isMobile ? 56 : 60) * safeScale,
    labelY: mastBottomY + 14 * safeScale
  };
};

type BuildFlagPolylineInput = {
  mastX: number;
  flagAnchorY: number;
  windMs: number;
  nowMs: number;
  uiScale: number;
  reducedMotion?: boolean;
  segmentCount?: number;
};

export const buildFlagPolyline = ({
  mastX,
  flagAnchorY,
  windMs,
  nowMs,
  uiScale,
  reducedMotion = false,
  segmentCount = FLAG_SEGMENT_COUNT
}: BuildFlagPolylineInput): FlagPolylinePoint[] => {
  const count = Math.max(3, Math.floor(segmentCount));
  const strength01 = windStrength01(windMs);
  const signedStrength = windSignedStrength(windMs);
  const motionScale = reducedMotion ? 0.15 : 1;
  const segmentSweepPx = lerp(0.18, 8.8, strength01) * uiScale;
  const calmLeanPx = lerp(0.9, 0.2, strength01) * uiScale;
  const sagPx = lerp(5.2, 0.9, strength01) * uiScale;
  const flapAmplitudePx = lerp(0.05, 4.9, strength01) * uiScale * motionScale;
  const flapFreqPerMs = lerp(0.0014, 0.012, strength01) * motionScale;

  const points: FlagPolylinePoint[] = [{ x: mastX + calmLeanPx, y: flagAnchorY }];
  let currentX = mastX + calmLeanPx;
  for (let index = 1; index <= count; index += 1) {
    const progress = index / count;
    currentX += signedStrength * segmentSweepPx * (0.82 + progress * 0.2);
    const harmonicA = Math.sin(nowMs * flapFreqPerMs + index * 0.95);
    const harmonicB = Math.sin(nowMs * flapFreqPerMs * 1.85 + index * 1.6);
    const flapOffset = (harmonicA + harmonicB * 0.35) * flapAmplitudePx * progress;
    const sagOffset = sagPx * progress * progress;
    points.push({
      x: currentX,
      y: flagAnchorY + sagOffset + flapOffset
    });
  }

  return points;
};

const drawFlag = (
  ctx: CanvasRenderingContext2D,
  polyline: FlagPolylinePoint[],
  windMs: number,
  uiScale: number,
  theme: ThemeMode
): void => {
  if (polyline.length < 2) {
    return;
  }
  const palette = getRenderPalette(theme);

  const strength01 = windStrength01(windMs);
  const thicknessPx = Math.max(2.5, (3.8 + strength01 * 1.9) * uiScale);
  const lowerEdge = polyline
    .slice()
    .reverse()
    .map((point, reverseIndex) => {
      const progress = 1 - reverseIndex / Math.max(1, polyline.length - 1);
      return {
        x: point.x,
        y: point.y + thicknessPx * (0.65 + 0.35 * progress)
      };
    });

  const fill = windMs >= 0 ? palette.wind.headwindFlagFill : palette.wind.tailwindFlagFill;
  const stroke =
    windMs >= 0 ? palette.wind.headwindFlagStroke : palette.wind.tailwindFlagStroke;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(polyline[0].x, polyline[0].y);
  for (let index = 1; index < polyline.length; index += 1) {
    ctx.lineTo(polyline[index].x, polyline[index].y);
  }
  for (let index = 0; index < lowerEdge.length; index += 1) {
    ctx.lineTo(lowerEdge[index].x, lowerEdge[index].y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1.2, 1.4 * uiScale);
  ctx.stroke();
  ctx.restore();
};

export const drawWindIndicator = (
  ctx: CanvasRenderingContext2D,
  width: number,
  windMs: number,
  nowMs: number,
  localeFormatter: Intl.NumberFormat,
  uiScale: number,
  theme: ThemeMode = 'light',
  reducedMotion = false
): void => {
  const palette = getRenderPalette(theme);
  const layout = getWindIndicatorLayout(width, uiScale);
  const polyline = buildFlagPolyline({
    mastX: layout.mastX,
    flagAnchorY: layout.flagAnchorY,
    windMs,
    nowMs,
    uiScale,
    reducedMotion
  });

  ctx.save();
  ctx.strokeStyle = palette.wind.mastStroke;
  ctx.lineWidth = Math.max(2, 3 * uiScale);
  ctx.beginPath();
  ctx.moveTo(layout.mastX, layout.mastBottomY);
  ctx.lineTo(layout.mastX, layout.mastTopY);
  ctx.stroke();
  drawFlag(ctx, polyline, windMs, uiScale, theme);
  ctx.restore();

  ctx.font = `700 ${Math.round(12 * uiScale)}px ${CANVAS_FONT_STACK}`;
  const windText = `${windMs >= 0 ? '+' : ''}${localeFormatter.format(windMs)} m/s`;
  drawOutlinedText(
    ctx,
    windText,
    layout.labelX,
    layout.labelY,
    palette.wind.labelFill,
    palette.wind.labelOutline,
    Math.max(1.8, 1.6 * uiScale)
  );
};

```
> meta: lines=221 chars=6327 truncated=no


## src/features/javelin/game/scoring.ts
_Defines: DISTANCE_MEASURE_MODE, SECTOR_ANGLE_DEG, SECTOR_HALF_ANGLE_RAD, ScoringRules, COMPETITION_RULES, angleEfficiency_

```ts
import { THROW_LINE_X_M } from './constants';
import { clamp, roundTo1 } from './math';
import type { ResultKind, ThrowInput } from './types';

export const DISTANCE_MEASURE_MODE = 'throwLineArc' as const;

/** @deprecated Prefer COMPETITION_RULES.sectorAngleDeg. */
export const SECTOR_ANGLE_DEG = 28.96;
/** @deprecated Prefer runtime sectorHalfAngleRad derived from ScoringRules. */
export const SECTOR_HALF_ANGLE_RAD = (SECTOR_ANGLE_DEG / 2) * (Math.PI / 180);

/** Configurable competition rules for throw legality evaluation. */
export type ScoringRules = {
  foulOnLineCross: boolean;
  requireTipFirst: boolean;
  requireSector: boolean;
  sectorAngleDeg: number;
};

/** Standard competition rule set used by gameplay. */
export const COMPETITION_RULES: ScoringRules = {
  foulOnLineCross: true,
  requireTipFirst: true,
  requireSector: true,
  sectorAngleDeg: 28.96
};

/**
 * Score throw angle against the 36-degree optimum.
 * Returns 1.0 at optimum and tapers down with larger deviations.
 */
export const angleEfficiency = (angleDeg: number): number => {
  const optimum = 36;
  const diff = Math.abs(angleDeg - optimum);
  return clamp(1 - (diff / 20) ** 1.4, 0.35, 1.02);
};

export const releaseEfficiency = (releaseTiming: number): number => {
  const center = 0.77;
  const diff = Math.abs(releaseTiming - center);
  return clamp(1 - (diff / 0.2) ** 1.7, 0.2, 1);
};

export const windEfficiency = (windMs: number): number =>
  clamp(1 + windMs * 0.035, 0.88, 1.12);

/**
 * @deprecated Legacy formula-based distance estimate kept for tests and balancing experiments.
 * Runtime scoring uses `computeCompetitionDistanceM` from physical landing data.
 */
export const computeThrowDistance = (input: ThrowInput): number => {
  const raw =
    118 *
    clamp(input.speedNorm, 0, 1) ** 1.15 *
    angleEfficiency(input.angleDeg) *
    releaseEfficiency(input.releaseTiming) *
    windEfficiency(input.windMs);

  return roundTo1(clamp(raw, 12, 110));
};

export const computeCompetitionDistanceM = (
  landingTipXM: number,
  throwLineXM = THROW_LINE_X_M
): number => roundTo1(Math.max(0, landingTipXM - throwLineXM));

export const isLandingInSector = (
  landingTipXM: number,
  landingTipZM: number,
  throwLineXM = THROW_LINE_X_M,
  sectorHalfAngleRad = SECTOR_HALF_ANGLE_RAD
): boolean => {
  const forward = landingTipXM - throwLineXM;
  if (forward <= 0) {
    return false;
  }
  const maxAbsLateral = Math.tan(sectorHalfAngleRad) * forward;
  return Math.abs(landingTipZM) <= maxAbsLateral;
};

type LegalityInput = {
  lineCrossedAtRelease: boolean;
  landingTipXM: number;
  landingTipZM: number;
  tipFirst: boolean;
  throwLineXM?: number;
  rules?: ScoringRules;
};

/**
 * Evaluate throw legality with foul line, sector, and tip-first rules.
 */
export const evaluateThrowLegality = ({
  lineCrossedAtRelease,
  landingTipXM,
  landingTipZM,
  tipFirst,
  throwLineXM = THROW_LINE_X_M,
  rules = COMPETITION_RULES
}: LegalityInput): { valid: boolean; resultKind: ResultKind } => {
  const sectorHalfAngleRad = (rules.sectorAngleDeg / 2) * (Math.PI / 180);

  if (rules.foulOnLineCross && lineCrossedAtRelease) {
    return { valid: false, resultKind: 'foul_line' };
  }
  if (
    rules.requireSector &&
    !isLandingInSector(landingTipXM, landingTipZM, throwLineXM, sectorHalfAngleRad)
  ) {
    return { valid: false, resultKind: 'foul_sector' };
  }
  if (rules.requireTipFirst && !tipFirst) {
    return { valid: false, resultKind: 'foul_tip_first' };
  }
  return { valid: true, resultKind: 'valid' };
};

```
> meta: lines=117 chars=3543 truncated=no


## src/features/javelin/game/selectors.ts
_Defines: getSpeedPercent, getRunupMeterPhase01, getForcePreviewPercent, getRunupDistanceM, getThrowLineRemainingM_

```ts
import { THROW_LINE_X_M } from './constants';
import type { GameState } from './types';

export const getSpeedPercent = (state: GameState): number => {
  if (
    state.phase.tag === 'runup' ||
    state.phase.tag === 'chargeAim' ||
    state.phase.tag === 'throwAnim'
  ) {
    return Math.round(state.phase.speedNorm * 100);
  }
  if (state.phase.tag === 'flight') {
    return Math.round(state.phase.launchedFrom.speedNorm * 100);
  }
  if (state.phase.tag === 'result') {
    return Math.round(state.phase.launchedFrom.speedNorm * 100);
  }
  return 0;
};

export const getRunupMeterPhase01 = (state: GameState): number | null => {
  if (state.phase.tag !== 'runup') {
    return null;
  }
  return Math.max(0, Math.min(1, state.phase.speedNorm));
};

export const getForcePreviewPercent = (state: GameState): number | null => {
  if (state.phase.tag === 'chargeAim') {
    return Math.round(state.phase.forceNormPreview * 100);
  }
  if (state.phase.tag === 'throwAnim') {
    return Math.round(state.phase.forceNorm * 100);
  }
  if (state.phase.tag === 'flight') {
    return Math.round(state.phase.launchedFrom.forceNorm * 100);
  }
  return null;
};

export const getRunupDistanceM = (state: GameState): number | null => {
  switch (state.phase.tag) {
    case 'runup':
    case 'chargeAim':
      return state.phase.runupDistanceM;
    case 'throwAnim':
    case 'flight':
    case 'result':
      return state.phase.athleteXM;
    case 'idle':
    case 'fault':
    default:
      return null;
  }
};

export const getThrowLineRemainingM = (state: GameState): number | null => {
  const distance = getRunupDistanceM(state);
  if (distance === null) {
    return null;
  }
  return Math.max(0, THROW_LINE_X_M - distance);
};

```
> meta: lines=64 chars=1735 truncated=no


## src/features/javelin/game/trajectory.ts
_Defines: TrajectoryPoint, TrajectoryPreview, computeTrajectoryPreview_

```ts
import { ANGLE_MAX_DEG, ANGLE_MIN_DEG } from './constants';
import { clamp, toRad } from './math';
import { computeLaunchSpeedMs } from './physics';
import { GAMEPLAY_TUNING } from './tuning';

const {
  numPoints: TRAJECTORY_PREVIEW_NUM_POINTS,
  timeStepS: TRAJECTORY_PREVIEW_TIME_STEP_S
} = GAMEPLAY_TUNING.trajectoryIndicator;

export type TrajectoryPoint = {
  xM: number;
  yM: number;
};

export type TrajectoryPreview = {
  points: TrajectoryPoint[];
};

type ComputeTrajectoryPreviewInput = {
  originXM: number;
  originYM: number;
  angleDeg: number;
  speedNorm: number;
  forceNorm: number;
  windMs?: number;
  numPoints?: number;
  timeStepS?: number;
};

/**
 * Compute a short trajectory preview arc for charge aiming.
 * Uses a simplified parabola (no drag/lift) for frame-by-frame rendering.
 */
export const computeTrajectoryPreview = ({
  originXM,
  originYM,
  angleDeg,
  speedNorm,
  forceNorm,
  windMs = 0,
  numPoints = TRAJECTORY_PREVIEW_NUM_POINTS,
  timeStepS = TRAJECTORY_PREVIEW_TIME_STEP_S
}: ComputeTrajectoryPreviewInput): TrajectoryPreview => {
  const launchSpeedMs = computeLaunchSpeedMs(clamp(speedNorm, 0, 1), clamp(forceNorm, 0, 1));
  const clampedAngleDeg = clamp(angleDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
  const angleRad = toRad(clampedAngleDeg);
  const vxMs = Math.cos(angleRad) * launchSpeedMs;
  const vyMs = Math.sin(angleRad) * launchSpeedMs;
  const effectiveVxMs = vxMs - windMs;

  const safeNumPoints = Math.max(1, Math.floor(numPoints));
  const safeTimeStepS = Math.max(0.02, timeStepS);
  const gravityMs2 = 9.81;
  const points: TrajectoryPoint[] = [];

  for (let index = 1; index <= safeNumPoints; index += 1) {
    const t = index * safeTimeStepS;
    const xM = originXM + effectiveVxMs * t;
    const yM = originYM + vyMs * t - 0.5 * gravityMs2 * t * t;
    if (yM < 0) {
      break;
    }
    points.push({ xM, yM });
  }

  return { points };
};

```
> meta: lines=69 chars=1913 truncated=no

### Gameplay systems


## src/features/javelin/game/tuning.ts
_Defines: GameplayTuning, GAMEPLAY_TUNING_

```ts
import type { MeterWindow } from "./types";

type SpeedUpTuning = {
  tapGainNorm: number;
  tapSoftCapIntervalMs: number;
  tapSoftCapMinMultiplier: number;
};

type ThrowPhaseTuning = {
  chargeFillDurationMs: number;
  chargeMaxCycles: number;
  faultJavelinLaunchSpeedMs: number;
  chargePerfectWindow: MeterWindow;
  chargeGoodWindow: MeterWindow;
  runToDrawbackBlendMs: number;
  throwAnimDurationMs: number;
  throwReleaseProgress01: number;
};

type MovementTuning = {
  runupStartXM: number;
  runupSpeedDecayPerSecond: number;
  chargeAimSpeedDecayPerSecond: number;
  chargeAimStopSpeedNorm: number;
  followThroughStepDistanceM: number;
  faultStumbleDistanceM: number;
};

type WindTuning = {
  cycleDurationMs: number;
  cycleAmplitudeMs: number;
  cycleHarmonicMultiplier: number;
  cycleHarmonicAmplitudeMs: number;
  randomKeyframeMs: number;
  randomAmplitudeMs: number;
  randomBlend: number;
  microGustPeriodMs: number;
  microGustAmplitudeMs: number;
  smoothingMs: number;
  crosswindPhaseOffsetRad: number;
  crosswindAmplitudeScale: number;
  visualCalmThresholdMs: number;
  visualMaxReferenceMs: number;
};

type AngleControlTuning = {
  stepDeg: number;
  holdStartDegPerSec: number;
  holdMaxDegPerSec: number;
  rampMs: number;
  pointerDeadzonePx: number;
  pointerSmoothing: number;
};

type TrajectoryIndicatorTuning = {
  numPoints: number;
  timeStepS: number;
  dotRadiusPx: number;
  baseOpacity: number;
  endOpacity: number;
  dotColor: string;
};

type AudioTuning = {
  masterVolume: number;
  runupTapVolume: number;
  crowdVolume: number;
  effectsVolume: number;
  crowdAmbientGain: number;
};

export type GameplayTuning = {
  speedUp: SpeedUpTuning;
  throwPhase: ThrowPhaseTuning;
  movement: MovementTuning;
  wind: WindTuning;
  angleControl: AngleControlTuning;
  trajectoryIndicator: TrajectoryIndicatorTuning;
  audio: AudioTuning;
};

/**
 * Central gameplay tuning values.
 *
 * Difficulty guidance:
 * - Easier run-up: increase tapGainNorm and/or reduce runupSpeedDecayPerSecond.
 * - Stronger anti-mash curve: increase tapSoftCapIntervalMs or reduce tapSoftCapMinMultiplier.
 * - Easier throw timing: wider charge windows and/or slower chargeFillDurationMs.
 */
export const GAMEPLAY_TUNING: GameplayTuning = {
  speedUp: {
    tapGainNorm: 0.085,
    tapSoftCapIntervalMs: 105,
    tapSoftCapMinMultiplier: 0.2,
  },
  throwPhase: {
    chargeFillDurationMs: 800,
    chargeMaxCycles: 3,
    faultJavelinLaunchSpeedMs: 8.4,
    chargePerfectWindow: { start: 0.78, end: 0.98 },
    chargeGoodWindow: { start: 0.56, end: 0.98 },
    runToDrawbackBlendMs: 420,
    throwAnimDurationMs: 320,
    throwReleaseProgress01: 0.56,
  },
  movement: {
    runupStartXM: -7.6,
    runupSpeedDecayPerSecond: 0.18,
    chargeAimSpeedDecayPerSecond: 0.2,
    chargeAimStopSpeedNorm: 0.03,
    followThroughStepDistanceM: 0.75,
    faultStumbleDistanceM: 0.82,
  },
  /**
   * Wind model tuning.
   *
   * These values drive both gameplay wind and flag behavior.
   * The default profile is intentionally readable: players can spot a favorable trend
   * and still complete run-up + charge + throw inside the same wind phase.
   */
  wind: {
    
    cycleDurationMs: 28000,
    
    cycleAmplitudeMs: 1.85,
    
    cycleHarmonicMultiplier: 2,
    
    cycleHarmonicAmplitudeMs: 0.28,
    
    randomKeyframeMs: 11000,
    
    randomAmplitudeMs: 0.28,
    
    randomBlend: 0.12,
    
    microGustPeriodMs: 3200,
    
    microGustAmplitudeMs: 0.07,
    
    smoothingMs: 1500,
    
    crosswindPhaseOffsetRad: 1.3,
    
    crosswindAmplitudeScale: 0.35,
    
    visualCalmThresholdMs: 0.2,
    
    visualMaxReferenceMs: 2.4,
  },
  angleControl: {
    stepDeg: 1.0,
    holdStartDegPerSec: 30,
    holdMaxDegPerSec: 120,
    rampMs: 600,
    pointerDeadzonePx: 12,
    pointerSmoothing: 0.4,
  },
  trajectoryIndicator: {
    numPoints: 20,
    timeStepS: 0.12,
    dotRadiusPx: 3,
    baseOpacity: 0.55,
    endOpacity: 0.1,
    dotColor: "#1a6b9a",
  },
  audio: {
    masterVolume: 0.5,
    runupTapVolume: 0.8,
    crowdVolume: 0.4,
    effectsVolume: 0.7,
    crowdAmbientGain: 0.018,
  },
};

```
> meta: lines=175 chars=4148 truncated=no

### Other code & helpers


## src/features/javelin/game/update/helpers.ts
_Defines: runupTapGainMultiplier, runStrideHz, advanceRunAnimT, runSpeedMsFromNorm, isRunning, FALL_ANIM_DURATION_MS_

```ts
/**
 * Shared update helpers used across phase tick handlers and reducer transitions.
 * Keeps repeated movement, timing, and throw-construction logic in one place.
 */
import { computeAthletePoseGeometry } from '../athletePose';
import {
  ANGLE_DEFAULT_DEG,
  JAVELIN_GRIP_OFFSET_M,
  JAVELIN_RELEASE_OFFSET_Y_M,
  RUNUP_SPEED_MAX_MS,
  RUNUP_SPEED_MIN_MS
} from '../constants';
// ... 4 more import lines from ..

const {
  faultJavelinLaunchSpeedMs: FAULT_JAVELIN_LAUNCH_SPEED_MS
} = GAMEPLAY_TUNING.throwPhase;
const {
  faultStumbleDistanceM: FAULT_STUMBLE_DISTANCE_M,
  followThroughStepDistanceM: FOLLOW_THROUGH_STEP_DISTANCE_M
} = GAMEPLAY_TUNING.movement;
const {
  tapSoftCapIntervalMs: RUNUP_TAP_SOFT_CAP_INTERVAL_MS,
  tapSoftCapMinMultiplier: RUNUP_TAP_SOFT_CAP_MIN_MULTIPLIER
} = GAMEPLAY_TUNING.speedUp;

export const runupTapGainMultiplier = (deltaMs: number): number => {
  const ratio = clamp(deltaMs / RUNUP_TAP_SOFT_CAP_INTERVAL_MS, 0, 1);
  return Math.max(RUNUP_TAP_SOFT_CAP_MIN_MULTIPLIER, ratio * ratio);
};

export const runStrideHz = (speedNorm: number): number => 1 + speedNorm * 2.2;

export const advanceRunAnimT = (currentAnimT: number, dtMs: number, speedNorm: number): number =>
  wrap01(currentAnimT + (Math.max(0, dtMs) / 1000) * runStrideHz(speedNorm));

export const runSpeedMsFromNorm = (speedNorm: number): number =>
  RUNUP_SPEED_MIN_MS + (RUNUP_SPEED_MAX_MS - RUNUP_SPEED_MIN_MS) * speedNorm;

export const isRunning = (speedNorm: number): boolean => speedNorm > 0.01;

export const FALL_ANIM_DURATION_MS = 340;

export const followThroughStepOffsetM = (animT: number): number => {
  const t = clamp(animT, 0, 1);
  const step01 = t < 0.78 ? easeOutQuad(t / 0.78) : 1;
  return FOLLOW_THROUGH_STEP_DISTANCE_M * step01;
};

export const faultStumbleOffsetM = (animT: number): number => {
  const t = clamp(animT, 0, 1);
  const step01 = t < 0.72 ? easeOutQuad(t / 0.72) : 1;
  return FAULT_STUMBLE_DISTANCE_M * step01;
};

export const createFaultJavelinFromCharge = (
  phase: Extract<GameState['phase'], { tag: 'chargeAim' }>,
  nowMs: number
) => {
  const releasePose = computeAthletePoseGeometry(
    phase.athletePose,
    phase.speedNorm,
    phase.angleDeg,
    phase.runupDistanceM,
    {
      runBlendFromAnimT: phase.runEntryAnimT,
      runToAimBlend01: 1
    }
  );
  const launchAngleRad = Math.max(0.02, toRad(Math.min(24, phase.angleDeg)));
  const athleteForwardMs = runSpeedMsFromNorm(phase.speedNorm) * 0.12;
  return createPhysicalJavelin({
    xM: releasePose.javelinGrip.xM + Math.cos(launchAngleRad) * JAVELIN_GRIP_OFFSET_M,
    yM: Math.max(
      1.05,
      releasePose.javelinGrip.yM + Math.sin(launchAngleRad) * JAVELIN_RELEASE_OFFSET_Y_M
    ),
    zM: 0,
    launchAngleRad,
    launchSpeedMs: FAULT_JAVELIN_LAUNCH_SPEED_MS,
    athleteForwardMs,
    lateralVelMs: 0,
    releasedAtMs: nowMs
  });
};

export const lateralVelocityFromRelease = (
  quality: TimingQuality,
  angleDeg: number,
  roundId: number
): number => {
  const qualityBase = quality === 'perfect' ? 0.1 : quality === 'good' ? 0.45 : 0.95;
  const sign = roundId % 2 === 0 ? 1 : -1;
  const angleBias = ((angleDeg - ANGLE_DEFAULT_DEG) / 18) * 0.55;
  return sign * qualityBase + angleBias;
};

export const createLateReleaseFaultPhase = (
  phase: Extract<GameState['phase'], { tag: 'chargeAim' }>,
  nowMs: number
): Extract<GameState['phase'], { tag: 'fault' }> => ({
  tag: 'fault',
  reason: 'lateRelease',
  athleteXM: phase.runupDistanceM,
  athletePose: {
    animTag: 'fall',
    animT: 0
  },
  javelin: createFaultJavelinFromCharge(phase, nowMs),
  javelinLanded: false
});

```
> meta: lines=112 chars=3626 truncated=no


## src/features/javelin/game/update/index.ts

```ts
/**
 * Public API for game-state update logic.
 * Exposes initial-state creation and the pure reducer entrypoint.
 */
export { reduceGameState } from './reduce';
export { createInitialGameState } from './initialState';

```
> meta: lines=7 chars=219 truncated=no


## src/features/javelin/game/update/initialState.ts
_Defines: createInitialGameState_

```ts
/**
 * Game state bootstrap helpers.
 * Provides deterministic initial state shape with sampled starting wind.
 */
import { ANGLE_DEFAULT_DEG } from '../constants';
import type { GameState } from '../types';
import { sampleCrosswindTargetMs, sampleWindTargetMs } from '../wind';

export const createInitialGameState = (): GameState => {
  const nowMs = performance.now();
  return {
    nowMs,
    roundId: 0,
    windMs: sampleWindTargetMs(nowMs),
    windZMs: sampleCrosswindTargetMs(nowMs),
    aimAngleDeg: ANGLE_DEFAULT_DEG,
    phase: { tag: 'idle' }
  };
};

```
> meta: lines=20 chars=565 truncated=no


## src/features/javelin/game/update/reduce.ts
_Defines: reduceGameState_

```ts
/**
 * Pure reducer for the javelin game state machine.
 * Handles all game actions and routes tick updates to per-phase handlers.
 * Never mutates the input state.
 */
import { computeAthletePoseGeometry } from '../athletePose';
import { applyForceQualityBonus, computeForcePreview, getTimingQuality } from '../chargeMeter';
import {
  ANGLE_MAX_DEG,
  ANGLE_MIN_DEG,
  RUNUP_MAX_TAPS,
  THROW_LINE_X_M
} from '../constants';
// ... 10 more import lines from ., ..

const {
  chargeFillDurationMs: CHARGE_FILL_DURATION_MS,
  chargeGoodWindow: CHARGE_GOOD_WINDOW,
  chargeMaxCycles: CHARGE_MAX_CYCLES,
  chargePerfectWindow: CHARGE_PERFECT_WINDOW,
  throwReleaseProgress01: THROW_RELEASE_PROGRESS
} = GAMEPLAY_TUNING.throwPhase;
const { tapGainNorm: RUNUP_TAP_GAIN_NORM } = GAMEPLAY_TUNING.speedUp;
const { runupStartXM: RUNUP_START_X_M } = GAMEPLAY_TUNING.movement;

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'startRound': {
      return {
        ...state,
        nowMs: action.atMs,
        roundId: state.roundId + 1,
        windMs: action.windMs,
        windZMs: action.windZMs ?? state.windZMs,
        phase: {
          tag: 'runup',
          speedNorm: 0,
          startedAtMs: action.atMs,
          tapCount: 0,
          runupDistanceM: RUNUP_START_X_M,
          tap: {
            lastTapAtMs: null,
            lastTapGainNorm: 0
          },
          athletePose: {
            animTag: 'idle',
            animT: 0
          }
        }
      };
    }
    case 'rhythmTap': {
      if (state.phase.tag !== 'runup') {
        return state;
      }
      const phase = state.phase;
      const lastTapAtMs = phase.tap.lastTapAtMs;
      const tapIntervalMs =
        lastTapAtMs === null ? Number.POSITIVE_INFINITY : Math.max(0, action.atMs - lastTapAtMs);
      const tapGainMultiplier = lastTapAtMs === null ? 1 : runupTapGainMultiplier(tapIntervalMs);
      const tapGainNorm = RUNUP_TAP_GAIN_NORM * tapGainMultiplier;
      const speedNorm = clamp(phase.speedNorm + tapGainNorm, 0, 1);

      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          ...phase,
          speedNorm,
          tapCount: Math.min(phase.tapCount + 1, RUNUP_MAX_TAPS),
          tap: {
            lastTapAtMs: action.atMs,
            lastTapGainNorm: tapGainMultiplier
          },
          athletePose: {
            animTag: isRunning(speedNorm) ? 'run' : 'idle',
            animT: isRunning(speedNorm)
              ? phase.athletePose.animTag === 'run'
                ? phase.athletePose.animT
                : 0
              : 0
          }
        }
      };
    }
    case 'beginChargeAim': {
      if (state.phase.tag !== 'runup') {
        return state;
      }
      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          tag: 'chargeAim',
          speedNorm: state.phase.speedNorm,
          runupDistanceM: state.phase.runupDistanceM,
          startedAtMs: state.phase.startedAtMs,
          runEntryAnimT: state.phase.athletePose.animT,
          angleDeg: state.aimAngleDeg,
          chargeStartedAtMs: action.atMs,
          chargeMeter: {
            phase01: 0,
            perfectWindow: CHARGE_PERFECT_WINDOW,
            goodWindow: CHARGE_GOOD_WINDOW,
            lastQuality: null,
            lastSampleAtMs: action.atMs
          },
          forceNormPreview: computeForcePreview(0),
          athletePose: {
            animTag: 'aim',
            animT: 0
          }
        }
      };
    }
    case 'adjustAngle': {
      if (state.phase.tag === 'chargeAim') {
        const nextAngleDeg = clamp(
          state.phase.angleDeg + action.deltaDeg,
          ANGLE_MIN_DEG,
          ANGLE_MAX_DEG
        );
        return {
          ...state,
          aimAngleDeg: nextAngleDeg,
          phase: {
            ...state.phase,
            angleDeg: nextAngleDeg
          }
        };
      }
      if (state.phase.tag === 'runup' || state.phase.tag === 'idle') {
        return {
          ...state,
          aimAngleDeg: clamp(state.aimAngleDeg + action.deltaDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG)
        };
      }
      return state;
    }
    case 'setAngle': {
      const nextAngleDeg = clamp(action.angleDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
      if (state.phase.tag === 'chargeAim') {
        return {
          ...state,
          aimAngleDeg: nextAngleDeg,
          phase: {
            ...state.phase,
            angleDeg: nextAngleDeg
          }
        };
      }
      if (state.phase.tag === 'runup' || state.phase.tag === 'idle') {
        return {
          ...state,
          aimAngleDeg: nextAngleDeg
        };
      }
      return state;
    }
    case 'releaseCharge': {
      if (state.phase.tag !== 'chargeAim') {
        return state;
      }
      const elapsedMs = Math.max(0, action.atMs - state.phase.chargeStartedAtMs);
      const rawFill01 = elapsedMs / CHARGE_FILL_DURATION_MS;
      const fullCycles = Math.floor(rawFill01);
      if (fullCycles >= CHARGE_MAX_CYCLES) {
        return {
          ...state,
          nowMs: action.atMs,
          phase: createLateReleaseFaultPhase(state.phase, action.atMs)
        };
      }
      const phase01 = clamp(rawFill01 % 1, 0, 1);
      const quality = getTimingQuality(
        phase01,
        state.phase.chargeMeter.perfectWindow,
        state.phase.chargeMeter.goodWindow
      );
      const forceNorm = applyForceQualityBonus(computeForcePreview(phase01), quality);
      const releasePose = computeAthletePoseGeometry(
        {
          animTag: 'throw',
          animT: THROW_RELEASE_PROGRESS
        },
        state.phase.speedNorm,
        state.phase.angleDeg,
        state.phase.runupDistanceM
      );
      const lineCrossedAtRelease =
        Math.max(
          state.phase.runupDistanceM,
          releasePose.footFront.xM,
          releasePose.footBack.xM,
          releasePose.shoulderCenter.xM
        ) >= THROW_LINE_X_M;

      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          tag: 'throwAnim',
          speedNorm: state.phase.speedNorm,
          athleteXM: state.phase.runupDistanceM,
          angleDeg: state.phase.angleDeg,
          forceNorm,
          releaseQuality: quality,
          lineCrossedAtRelease,
          releaseFlashAtMs: action.atMs,
          animProgress: 0,
          released: false,
          athletePose: {
            animTag: 'throw',
            animT: 0
          }
        }
      };
    }
    case 'tick': {
      const nextState: GameState = {
        ...state,
        nowMs: action.nowMs,
        windMs: advanceWindMs(state.windMs, action.dtMs, action.nowMs),
        windZMs: advanceCrosswindMs(state.windZMs, action.dtMs, action.nowMs)
      };
      if (nextState.phase.tag === 'idle' || nextState.phase.tag === 'result') {
        return nextState;
      }

      switch (nextState.phase.tag) {
        case 'fault':
          return tickFault(nextState, action.dtMs);
        case 'runup':
          return tickRunup(nextState, action.dtMs);
        case 'chargeAim':
          return tickChargeAim(nextState, action.dtMs, action.nowMs);
        case 'throwAnim':
          return tickThrowAnim(nextState, action.dtMs, action.nowMs);
        case 'flight':
          return tickFlight(nextState, action.dtMs);
        default: {
          const _exhaustive: never = nextState.phase;
          return _exhaustive;
        }
      }
    }
    case 'setResultHighscoreFlag': {
      if (state.phase.tag !== 'result') {
        return state;
      }
      return {
        ...state,
        phase: {
          ...state.phase,
          isHighscore: action.isHighscore
        }
      };
    }
    case 'resetToIdle': {
      return {
        ...state,
        phase: { tag: 'idle' }
      };
    }
    default: {
      return state;
    }
  }
};

```
> meta: lines=270 chars=7909 truncated=no


## src/features/javelin/game/update/tickChargeAim.ts
_Defines: tickChargeAim_

```ts
/**
 * Advance the charge-aim phase by one tick.
 * Updates meter cycling, run slowdown, and mixed run-to-aim animation blending.
 */
import { RUNUP_MAX_X_M } from '../constants';
import { computeForcePreview, getTimingQuality } from '../chargeMeter';
import { clamp } from '../math';
import { GAMEPLAY_TUNING } from '../tuning';
import type { GameState } from '../types';
import { advanceRunAnimT, createLateReleaseFaultPhase, runSpeedMsFromNorm } from './helpers';

const {
  chargeAimSpeedDecayPerSecond: CHARGE_AIM_SPEED_DECAY_PER_SECOND,
  chargeAimStopSpeedNorm: CHARGE_AIM_STOP_SPEED_NORM,
  runupStartXM: RUNUP_START_X_M
} = GAMEPLAY_TUNING.movement;
const {
  chargeFillDurationMs: CHARGE_FILL_DURATION_MS,
  chargeMaxCycles: CHARGE_MAX_CYCLES,
  runToDrawbackBlendMs: RUN_TO_DRAWBACK_BLEND_MS
} = GAMEPLAY_TUNING.throwPhase;

export const tickChargeAim = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'chargeAim') {
    return state;
  }

  const elapsedMs = Math.max(0, nowMs - state.phase.chargeStartedAtMs);
  const rawFill01 = elapsedMs / CHARGE_FILL_DURATION_MS;
  const fullCycles = Math.floor(rawFill01);
  if (fullCycles >= CHARGE_MAX_CYCLES) {
    return {
      ...state,
      phase: createLateReleaseFaultPhase(state.phase, nowMs)
    };
  }

  const phase01 = clamp(rawFill01 % 1, 0, 1);
  const speedAfterDecay = clamp(
    state.phase.speedNorm - (dtMs / 1000) * CHARGE_AIM_SPEED_DECAY_PER_SECOND,
    0,
    1
  );
  const speedNorm = Math.max(speedAfterDecay, 0);
  const stillRunning = speedNorm > CHARGE_AIM_STOP_SPEED_NORM;
  const runSpeedMs = stillRunning ? runSpeedMsFromNorm(speedNorm) : 0;
  const runupDistanceM = clamp(
    state.phase.runupDistanceM + runSpeedMs * (dtMs / 1000),
    RUNUP_START_X_M,
    RUNUP_MAX_X_M
  );
  const blend01 = clamp(elapsedMs / RUN_TO_DRAWBACK_BLEND_MS, 0, 1);
  const aimAnimT = blend01 < 1 ? blend01 * 0.2 : phase01;
  const legAnimT = stillRunning
    ? advanceRunAnimT(state.phase.runEntryAnimT, dtMs, speedNorm)
    : state.phase.runEntryAnimT;
  const forceNormPreview = computeForcePreview(phase01);
  const quality = getTimingQuality(
    phase01,
    state.phase.chargeMeter.perfectWindow,
    state.phase.chargeMeter.goodWindow
  );

  return {
    ...state,
    phase: {
      ...state.phase,
      speedNorm,
      runupDistanceM,
      runEntryAnimT: legAnimT,
      forceNormPreview,
      chargeMeter: {
        ...state.phase.chargeMeter,
        phase01,
        lastQuality: quality,
        lastSampleAtMs: nowMs
      },
      athletePose: {
        animTag: 'aim',
        animT: aimAnimT
      }
    }
  };
};

```
> meta: lines=85 chars=2646 truncated=no


## src/features/javelin/game/update/tickFault.ts
_Defines: tickFault_

```ts
/**
 * Advance the fault phase by one tick.
 * Applies stumble animation and optional fault-javelin physics integration.
 */
import { clamp } from '../math';
import { updatePhysicalJavelin } from '../physics';
import type { GameState } from '../types';
import { FALL_ANIM_DURATION_MS, faultStumbleOffsetM } from './helpers';

export const tickFault = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'fault') {
    return state;
  }

  const nextFaultAnimT = clamp(state.phase.athletePose.animT + dtMs / FALL_ANIM_DURATION_MS, 0, 1);
  const stumbleDeltaM =
    faultStumbleOffsetM(nextFaultAnimT) - faultStumbleOffsetM(state.phase.athletePose.animT);
  const javelinUpdate = state.phase.javelinLanded
    ? null
    : updatePhysicalJavelin(state.phase.javelin, dtMs, state.windMs, state.windZMs);

  return {
    ...state,
    phase: {
      ...state.phase,
      athleteXM: state.phase.athleteXM + stumbleDeltaM,
      athletePose: {
        animTag: 'fall',
        animT: nextFaultAnimT
      },
      javelin:
        javelinUpdate === null
          ? state.phase.javelin
          : javelinUpdate.landed
            ? {
                ...javelinUpdate.javelin,
                vxMs: 0,
                vyMs: 0,
                vzMs: 0,
                angularVelRad: 0
              }
            : javelinUpdate.javelin,
      javelinLanded: javelinUpdate === null ? state.phase.javelinLanded : javelinUpdate.landed
    }
  };
};

```
> meta: lines=47 chars=1465 truncated=no


## src/features/javelin/game/update/tickFlight.ts
_Defines: tickFlight_

```ts
/**
 * Advance the flight phase by one tick.
 * Integrates javelin physics and transitions to result on landing.
 */
import { COMPETITION_RULES, computeCompetitionDistanceM, evaluateThrowLegality } from '../scoring';
import { updatePhysicalJavelin } from '../physics';
import { clamp } from '../math';
import type { GameState } from '../types';
import { followThroughStepOffsetM } from './helpers';

export const tickFlight = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'flight') {
    return state;
  }

  const nextFollowAnimT = clamp(state.phase.athletePose.animT + dtMs / 650, 0, 1);
  const stepDeltaM =
    followThroughStepOffsetM(nextFollowAnimT) -
    followThroughStepOffsetM(state.phase.athletePose.animT);
  const athleteXM = state.phase.athleteXM + stepDeltaM;
  const updated = updatePhysicalJavelin(state.phase.javelin, dtMs, state.windMs, state.windZMs);
  if (updated.landed) {
    const landingTipXM = updated.landingTipXM ?? updated.javelin.xM;
    const landingTipZM = updated.landingTipZM ?? updated.javelin.zM;
    const distanceM = computeCompetitionDistanceM(landingTipXM);
    const legality = evaluateThrowLegality({
      lineCrossedAtRelease: state.phase.launchedFrom.lineCrossedAtRelease,
      landingTipXM,
      landingTipZM,
      tipFirst: updated.tipFirst === true,
      rules: COMPETITION_RULES
    });

    return {
      ...state,
      phase: {
        tag: 'result',
        athleteXM,
        launchedFrom: state.phase.launchedFrom,
        distanceM,
        isHighscore: false,
        resultKind: legality.resultKind,
        tipFirst: updated.tipFirst,
        landingTipXM,
        landingXM: updated.javelin.xM,
        landingYM: Math.max(0, updated.javelin.yM),
        landingAngleRad: updated.javelin.angleRad
      }
    };
  }

  return {
    ...state,
    phase: {
      ...state.phase,
      athleteXM,
      javelin: updated.javelin,
      athletePose: {
        animTag: 'followThrough',
        animT: nextFollowAnimT
      }
    }
  };
};

```
> meta: lines=65 chars=2030 truncated=no


## src/features/javelin/game/update/tickRunup.ts
_Defines: tickRunup_

```ts
/**
 * Advance the runup phase by one tick.
 * Applies speed decay, position advancement, and animation progression.
 */
import { RUNUP_MAX_X_M } from '../constants';
import { clamp } from '../math';
import { GAMEPLAY_TUNING } from '../tuning';
import type { GameState } from '../types';
import { advanceRunAnimT, isRunning, runSpeedMsFromNorm } from './helpers';

const {
  runupSpeedDecayPerSecond: RUNUP_SPEED_DECAY_PER_SECOND,
  runupStartXM: RUNUP_START_X_M
} = GAMEPLAY_TUNING.movement;

export const tickRunup = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'runup') {
    return state;
  }

  const speedAfterDecay = clamp(
    state.phase.speedNorm - (dtMs / 1000) * RUNUP_SPEED_DECAY_PER_SECOND,
    0,
    1
  );
  const speedNorm = speedAfterDecay;
  const runSpeedMs = isRunning(speedNorm) ? runSpeedMsFromNorm(speedNorm) : 0;
  const runupDistanceM = clamp(
    state.phase.runupDistanceM + runSpeedMs * (dtMs / 1000),
    RUNUP_START_X_M,
    RUNUP_MAX_X_M
  );

  return {
    ...state,
    phase: {
      ...state.phase,
      speedNorm,
      runupDistanceM,
      athletePose: {
        animTag: isRunning(speedNorm) ? 'run' : 'idle',
        animT: isRunning(speedNorm)
          ? advanceRunAnimT(state.phase.athletePose.animT, dtMs, speedNorm)
          : 0
      }
    }
  };
};

```
> meta: lines=49 chars=1331 truncated=no


## src/features/javelin/game/update/tickThrowAnim.ts
_Defines: tickThrowAnim_

```ts
/**
 * Advance the throw animation phase by one tick.
 * Transitions to flight exactly once when release progress threshold is crossed.
 */
import { computeAthletePoseGeometry } from '../athletePose';
import { JAVELIN_GRIP_OFFSET_M, JAVELIN_RELEASE_OFFSET_Y_M } from '../constants';
import { clamp, toRad } from '../math';
import { computeLaunchSpeedMs, createPhysicalJavelin } from '../physics';
import { GAMEPLAY_TUNING } from '../tuning';
import type { GameState } from '../types';
import { lateralVelocityFromRelease, runSpeedMsFromNorm } from './helpers';

const {
  throwAnimDurationMs: THROW_ANIM_DURATION_MS,
  throwReleaseProgress01: THROW_RELEASE_PROGRESS
} = GAMEPLAY_TUNING.throwPhase;

export const tickThrowAnim = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'throwAnim') {
    return state;
  }

  const nextProgress = clamp(state.phase.animProgress + dtMs / THROW_ANIM_DURATION_MS, 0, 1);
  const released = nextProgress >= THROW_RELEASE_PROGRESS;
  if (released && !state.phase.released) {
    const releasePose = computeAthletePoseGeometry(
      {
        animTag: 'throw',
        animT: THROW_RELEASE_PROGRESS
      },
      state.phase.speedNorm,
      state.phase.angleDeg,
      state.phase.athleteXM
    );
    const launchSpeedMs = computeLaunchSpeedMs(state.phase.speedNorm, state.phase.forceNorm);
    const launchAngleRad = toRad(state.phase.angleDeg);
    const athleteForwardMs = runSpeedMsFromNorm(state.phase.speedNorm) * 0.34;
    const lateralVelMs = lateralVelocityFromRelease(
      state.phase.releaseQuality,
      state.phase.angleDeg,
      state.roundId
    );

    return {
      ...state,
      phase: {
        tag: 'flight',
        athleteXM: state.phase.athleteXM,
        javelin: createPhysicalJavelin({
          xM: releasePose.javelinGrip.xM + Math.cos(launchAngleRad) * JAVELIN_GRIP_OFFSET_M,
          yM: Math.max(
            1.35,
            releasePose.javelinGrip.yM + Math.sin(launchAngleRad) * JAVELIN_RELEASE_OFFSET_Y_M
          ),
          zM: 0,
          launchAngleRad,
          launchSpeedMs,
          athleteForwardMs,
          lateralVelMs,
          releasedAtMs: nowMs
        }),
        launchedFrom: {
          speedNorm: state.phase.speedNorm,
          athleteXM: state.phase.athleteXM,
          angleDeg: state.phase.angleDeg,
          forceNorm: state.phase.forceNorm,
          releaseQuality: state.phase.releaseQuality,
          lineCrossedAtRelease: state.phase.lineCrossedAtRelease,
          windMs: state.windMs,
          launchSpeedMs
        },
        athletePose: {
          animTag: 'followThrough',
          animT: 0
        }
      }
    };
  }

  return {
    ...state,
    phase: {
      ...state.phase,
      animProgress: nextProgress,
      athletePose: {
        animTag: 'throw',
        animT: nextProgress
      }
    }
  };
};

```
> meta: lines=92 chars=2888 truncated=no


## src/features/javelin/game/wind.ts
_Defines: sampleWindTargetMs, sampleCrosswindTargetMs, advanceWindMs, advanceCrosswindMs_

```ts
import {
  CROSSWIND_MAX_MS,
  CROSSWIND_MIN_MS,
  WIND_MAX_MS,
  WIND_MIN_MS
} from './constants';
import { clamp, lerp } from './math';
import { GAMEPLAY_TUNING } from './tuning';

const {
  crosswindAmplitudeScale: WIND_CROSSWIND_AMPLITUDE_SCALE,
  crosswindPhaseOffsetRad: WIND_CROSSWIND_PHASE_OFFSET_RAD,
  cycleAmplitudeMs: WIND_CYCLE_AMPLITUDE_MS,
  cycleDurationMs: WIND_CYCLE_DURATION_MS,
  cycleHarmonicAmplitudeMs: WIND_CYCLE_HARMONIC_AMPLITUDE_MS,
  cycleHarmonicMultiplier: WIND_CYCLE_HARMONIC_MULTIPLIER,
  microGustAmplitudeMs: WIND_MICRO_GUST_AMPLITUDE_MS,
  microGustPeriodMs: WIND_MICRO_GUST_PERIOD_MS,
  randomAmplitudeMs: WIND_RANDOM_AMPLITUDE_MS,
  randomBlend: WIND_RANDOM_BLEND,
  randomKeyframeMs: WIND_RANDOM_KEYFRAME_MS,
  smoothingMs: WIND_SMOOTHING_MS
} = GAMEPLAY_TUNING.wind;

const TAU = Math.PI * 2;

/**
 * Deterministic pseudo-noise from an integer index.
 * Returns a value in [-1, 1]. Used for repeatable random wind keyframes
 * without requiring a seeded PRNG.
 */
const signedNoise1D = (index: number): number => {
  const seed = Math.sin(index * 127.1 + 311.7) * 43758.5453123;
  const fract = seed - Math.floor(seed);
  return fract * 2 - 1;
};

const smoothstep01 = (value: number): number => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const clampWind = (windMs: number): number => clamp(windMs, WIND_MIN_MS, WIND_MAX_MS);
const clampCrosswind = (windMs: number): number =>
  clamp(windMs, CROSSWIND_MIN_MS, CROSSWIND_MAX_MS);

type SampleWindTargetInput = {
  nowMs: number;
  cyclePhaseOffsetRad: number;
  amplitudeScale: number;
  clampMin: number;
  clampMax: number;
};

const sampleTargetMs = ({
  nowMs,
  cyclePhaseOffsetRad,
  amplitudeScale,
  clampMin,
  clampMax
}: SampleWindTargetInput): number => {
  const safeNowMs = Math.max(0, nowMs);
  const amplitude = Math.max(0, amplitudeScale);
  const cyclePhaseRad = (safeNowMs / Math.max(1, WIND_CYCLE_DURATION_MS)) * TAU + cyclePhaseOffsetRad;
  const primaryCycleMs = Math.sin(cyclePhaseRad) * WIND_CYCLE_AMPLITUDE_MS;
  const harmonicCycleMs =
    Math.sin(cyclePhaseRad * Math.max(1, WIND_CYCLE_HARMONIC_MULTIPLIER) + 0.9) *
    WIND_CYCLE_HARMONIC_AMPLITUDE_MS;
  const periodicCycleMs = primaryCycleMs + harmonicCycleMs;

  const keyframePos = safeNowMs / Math.max(1, WIND_RANDOM_KEYFRAME_MS);
  const keyframeIndex = Math.floor(keyframePos);
  const mixT = smoothstep01(keyframePos - keyframeIndex);
  const keyA = signedNoise1D(keyframeIndex);
  const keyB = signedNoise1D(keyframeIndex + 1);
  const randomTrendMs = lerp(keyA, keyB, mixT) * WIND_RANDOM_AMPLITUDE_MS * clamp(WIND_RANDOM_BLEND, 0, 1);

  const microGustRad =
    (safeNowMs / Math.max(1, WIND_MICRO_GUST_PERIOD_MS)) * TAU + 1.2 + cyclePhaseOffsetRad * 0.35;
  const microGustMs = Math.sin(microGustRad) * WIND_MICRO_GUST_AMPLITUDE_MS;

  return clamp((periodicCycleMs + randomTrendMs + microGustMs) * amplitude, clampMin, clampMax);
};

export const sampleWindTargetMs = (nowMs: number): number => {
  return sampleTargetMs({
    nowMs,
    cyclePhaseOffsetRad: 0,
    amplitudeScale: 1,
    clampMin: WIND_MIN_MS,
    clampMax: WIND_MAX_MS
  });
};

export const sampleCrosswindTargetMs = (nowMs: number): number => {
  const target = sampleTargetMs({
    nowMs,
    cyclePhaseOffsetRad: WIND_CROSSWIND_PHASE_OFFSET_RAD,
    amplitudeScale: WIND_CROSSWIND_AMPLITUDE_SCALE,
    clampMin: CROSSWIND_MIN_MS,
    clampMax: CROSSWIND_MAX_MS
  });
  return clampCrosswind(target);
};

/**
 * Advance headwind with deterministic target sampling and exponential smoothing.
 *
 * @param currentWindMs - Current smoothed wind in m/s.
 * @param dtMs - Frame step in milliseconds.
 * @param nowMs - Absolute timeline position in milliseconds.
 * @returns Next wind value in m/s clamped to configured headwind range.
 */
export const advanceWindMs = (currentWindMs: number, dtMs: number, nowMs: number): number => {
  const dtS = clamp(dtMs / 1000, 0, 0.25);
  const safeCurrent = Number.isFinite(currentWindMs) ? currentWindMs : 0;
  const targetWindMs = sampleWindTargetMs(nowMs);
  if (dtS <= 0) {
    return clampWind(safeCurrent);
  }

  const smoothingTauS = Math.max(0.05, WIND_SMOOTHING_MS / 1000);
  const alpha = dtS / (smoothingTauS + dtS);
  const nextWindMs = safeCurrent + (targetWindMs - safeCurrent) * alpha;
  return clampWind(nextWindMs);
};

export const advanceCrosswindMs = (
  currentWindZMs: number,
  dtMs: number,
  nowMs: number
): number => {
  const dtS = clamp(dtMs / 1000, 0, 0.25);
  const safeCurrent = Number.isFinite(currentWindZMs) ? currentWindZMs : 0;
  const targetWindMs = sampleCrosswindTargetMs(nowMs);
  if (dtS <= 0) {
    return clampCrosswind(safeCurrent);
  }

  const smoothingTauS = Math.max(0.05, WIND_SMOOTHING_MS / 1000);
  const alpha = dtS / (smoothingTauS + dtS);
  const nextWindMs = safeCurrent + (targetWindMs - safeCurrent) * alpha;
  return clampCrosswind(nextWindMs);
};

```
> meta: lines=145 chars=4922 truncated=no


## src/features/javelin/hooks/controls/index.ts
_Reusable hook / shared state or side-effect logic._

```ts
/**
 * Composed controls hook that wires keyboard, mouse, and touch handlers.
 * Also re-exports pure guard helpers used by unit tests.
 */
import { useEffect, useRef } from 'react';
import type { GameState } from '../../game/types';
import {
  type AngleKeyHoldState,
  type Dispatch
} from './types';
import { useKeyboardControls } from './useKeyboardControls';
import { useMouseControls } from './useMouseControls';
// ... 1 more import lines from ., .., react

type UsePointerControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  state: GameState;
};

export const usePointerControls = ({ canvas, dispatch, state }: UsePointerControlsArgs): void => {
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const angleHoldRef = useRef<AngleKeyHoldState | null>(null);
  const anchorRef = useRef<{ x: number; y: number } | null>(null);
  const lastAngleRef = useRef<number | null>(null);

  useKeyboardControls({ dispatch, stateRef, angleHoldRef });
  useMouseControls({ canvas, dispatch, stateRef, anchorRef, lastAngleRef });
  useTouchControls({ canvas, dispatch, stateRef });
};

export {
  isInteractiveEventTarget,
  shouldReleaseChargeFromEnterKeyUp,
  shouldHandleAngleAdjustKeyDown,
  shouldConsumeActionKeyDown,
  createTouchLongPressHandlers
} from './types';

```
> meta: lines=44 chars=1343 truncated=no


## src/features/javelin/hooks/controls/useKeyboardControls.ts
_Reusable hook / shared state or side-effect logic._

```ts
/**
 * Keyboard input wiring for throw actions and angle adjustment.
 * Registers global key listeners and dispatches game actions from key events.
 */
import { useEffect, type MutableRefObject } from 'react';
import { keyboardAngleDelta, keyboardAngleHoldDelta } from '../../game/controls';
import { resumeAudioContext } from '../../game/audio';
import { GAMEPLAY_TUNING } from '../../game/tuning';
import type { GameState } from '../../game/types';
import {
  isInteractiveEventTarget,
  shouldConsumeActionKeyDown,
// ... 5 more import lines from ., .., react

const { stepDeg: ANGLE_KEYBOARD_STEP_DEG } = GAMEPLAY_TUNING.angleControl;

type UseKeyboardControlsArgs = {
  dispatch: Dispatch;
  stateRef: MutableRefObject<GameState>;
  angleHoldRef: MutableRefObject<AngleKeyHoldState | null>;
};

export const useKeyboardControls = ({
  dispatch,
  stateRef,
  angleHoldRef
}: UseKeyboardControlsArgs): void => {
  useEffect(() => {
    const now = (): number => performance.now();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (isInteractiveEventTarget(event.target)) {
        return;
      }

      const phaseTag = stateRef.current.phase.tag;
      if (event.code === 'Space' && shouldConsumeActionKeyDown(event.code, phaseTag, event.target, event.repeat)) {
        resumeAudioContext();
        event.preventDefault();
        if (phaseTag === 'runup') {
          dispatch({ type: 'rhythmTap', atMs: now() });
        }
        return;
      }

      if (event.code === 'Enter' && shouldConsumeActionKeyDown(event.code, phaseTag, event.target, event.repeat)) {
        resumeAudioContext();
        event.preventDefault();
        if (phaseTag === 'runup') {
          dispatch({ type: 'beginChargeAim', atMs: now() });
        }
        return;
      }

      if (
        (event.code === 'ArrowUp' || event.code === 'ArrowDown') &&
        shouldHandleAngleAdjustKeyDown(event.code, phaseTag, event.target)
      ) {
        event.preventDefault();
        const direction = event.code === 'ArrowUp' ? 'up' : 'down';
        const timestampMs = now();
        const previousHoldState = angleHoldRef.current;
        const shouldRestartHold =
          !event.repeat ||
          previousHoldState === null ||
          previousHoldState.direction !== direction;
        if (shouldRestartHold) {
          angleHoldRef.current = {
            direction,
            holdStartedAtMs: timestampMs,
            lastAppliedAtMs: timestampMs
          };
          dispatch({
            type: 'adjustAngle',
            deltaDeg: keyboardAngleDelta(direction, ANGLE_KEYBOARD_STEP_DEG)
          });
          return;
        }

        if (previousHoldState === null) {
          return;
        }
        const holdDurationMs = timestampMs - previousHoldState.holdStartedAtMs;
        const dtMs = timestampMs - previousHoldState.lastAppliedAtMs;
        dispatch({
          type: 'adjustAngle',
          deltaDeg: keyboardAngleHoldDelta(direction, holdDurationMs, dtMs)
        });
        angleHoldRef.current = {
          ...previousHoldState,
          lastAppliedAtMs: timestampMs
        };
      }
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      if (isInteractiveEventTarget(event.target)) {
        return;
      }
      if (
        (event.code === 'ArrowUp' && angleHoldRef.current?.direction === 'up') ||
        (event.code === 'ArrowDown' && angleHoldRef.current?.direction === 'down')
      ) {
        angleHoldRef.current = null;
      }

      
      if (shouldReleaseChargeFromEnterKeyUp(event.code, stateRef.current.phase.tag, event.target)) {
        event.preventDefault();
        dispatch({ type: 'releaseCharge', atMs: now() });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [angleHoldRef, dispatch, stateRef]);
};

```
> meta: lines=122 chars=3997 truncated=no


## src/features/javelin/hooks/controls/useMouseControls.ts
_Reusable hook / shared state or side-effect logic._

```ts
/**
 * Mouse input wiring for tap, charge, release, and pointer-based aiming.
 * Uses canvas-local mouse events with global mouseup for robust release handling.
 */
import { useEffect, type MutableRefObject } from 'react';
import { resumeAudioContext } from '../../game/audio';
import { pointerFromAnchorToAngleDeg, smoothPointerAngleDeg } from '../../game/controls';
import { getPlayerAngleAnchorScreen } from '../../game/render';
import type { GameState } from '../../game/types';
import type { Dispatch } from './types';

type UseMouseControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  stateRef: MutableRefObject<GameState>;
  anchorRef: MutableRefObject<{ x: number; y: number } | null>;
  lastAngleRef: MutableRefObject<number | null>;
};

export const useMouseControls = ({
  canvas,
  dispatch,
  stateRef,
  anchorRef,
  lastAngleRef
}: UseMouseControlsArgs): void => {
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const now = (): number => performance.now();
    const dispatchAngleFromPointer = (clientX: number, clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      const anchor = getPlayerAngleAnchorScreen(stateRef.current, rect.width, rect.height);
      anchorRef.current = anchor;
      const angleDeg = pointerFromAnchorToAngleDeg(
        clientX,
        clientY,
        rect.left + anchor.x,
        rect.top + anchor.y
      );
      if (Number.isNaN(angleDeg)) {
        return;
      }
      const smoothedAngleDeg = smoothPointerAngleDeg(lastAngleRef.current, angleDeg);
      lastAngleRef.current = smoothedAngleDeg;
      dispatch({
        type: 'setAngle',
        angleDeg: smoothedAngleDeg
      });
    };

    const onMouseDown = (event: MouseEvent): void => {
      resumeAudioContext();
      if (event.button === 0) {
        dispatch({ type: 'rhythmTap', atMs: now() });
      }
      if (event.button === 2) {
        event.preventDefault();
        dispatch({ type: 'beginChargeAim', atMs: now() });
        dispatchAngleFromPointer(event.clientX, event.clientY);
      }
    };

    const onMouseUp = (event: MouseEvent): void => {
      if (event.button === 2) {
        dispatch({ type: 'releaseCharge', atMs: now() });
      }
    };

    const onMouseMove = (event: MouseEvent): void => {
      const phaseTag = stateRef.current.phase.tag;
      const shouldTrackPointerAngle =
        phaseTag === 'idle' ||
        phaseTag === 'runup' ||
        phaseTag === 'chargeAim' ||
        (phaseTag === 'throwAnim' && (event.buttons & 2) !== 0);
      if (shouldTrackPointerAngle) {
        dispatchAngleFromPointer(event.clientX, event.clientY);
      }
    };

    const onContextMenu = (event: Event): void => {
      event.preventDefault();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [anchorRef, canvas, dispatch, lastAngleRef, stateRef]);
};

```
> meta: lines=101 chars=3320 truncated=no


## src/features/javelin/hooks/controls/useTouchControls.ts
_Reusable hook / shared state or side-effect logic._

```ts
/**
 * Touch input wiring with tap and long-press gestures.
 * Converts touch movement into aiming updates while preserving passive=false scrolling control.
 */
import { useEffect, useRef, type MutableRefObject } from 'react';
import { resumeAudioContext } from '../../game/audio';
import { pointerFromAnchorToAngleDeg, smoothPointerAngleDeg } from '../../game/controls';
import { getPlayerAngleAnchorScreen } from '../../game/render';
import type { GameState } from '../../game/types';
import { createTouchLongPressHandlers, type Dispatch } from './types';

type UseTouchControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  stateRef: MutableRefObject<GameState>;
};

export const useTouchControls = ({ canvas, dispatch, stateRef }: UseTouchControlsArgs): void => {
  const lastAngleRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const now = (): number => performance.now();
    const touchLongPressHandlers = createTouchLongPressHandlers({
      dispatch,
      getPhaseTag: () => stateRef.current.phase.tag,
      now
    });
    const dispatchAngleFromPointer = (clientX: number, clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      const anchor = getPlayerAngleAnchorScreen(stateRef.current, rect.width, rect.height);
      const angleDeg = pointerFromAnchorToAngleDeg(
        clientX,
        clientY,
        rect.left + anchor.x,
        rect.top + anchor.y
      );
      if (Number.isNaN(angleDeg)) {
        return;
      }
      const smoothedAngleDeg = smoothPointerAngleDeg(lastAngleRef.current, angleDeg);
      lastAngleRef.current = smoothedAngleDeg;
      dispatch({
        type: 'setAngle',
        angleDeg: smoothedAngleDeg
      });
    };

    const onTouchStart = (event: TouchEvent): void => {
      event.preventDefault();
      resumeAudioContext();
      touchLongPressHandlers.onTouchStart();
    };

    const onTouchEnd = (): void => {
      touchLongPressHandlers.onTouchEnd();
    };

    const onTouchMove = (event: TouchEvent): void => {
      event.preventDefault();
      if (event.touches.length < 1) {
        return;
      }
      const currentPhaseTag = stateRef.current.phase.tag;
      if (currentPhaseTag === 'chargeAim' || currentPhaseTag === 'runup' || currentPhaseTag === 'idle') {
        const touch = event.touches[0];
        dispatchAngleFromPointer(touch.clientX, touch.clientY);
      }
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      touchLongPressHandlers.clear();
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [canvas, dispatch, stateRef]);
};

```
> meta: lines=88 chars=3105 truncated=no


## src/features/javelin/hooks/useGameLoop.ts
_Reusable hook / shared state or side-effect logic._

```ts
import { useEffect, useRef } from 'react';
import type { GameAction } from '../game/types';

type Dispatch = (action: GameAction) => void;

export const useGameLoop = (dispatch: Dispatch): void => {
  const frameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const loop = (nowMs: number): void => {
      const dtMs = Math.min(nowMs - lastTimeRef.current, 40);
      lastTimeRef.current = nowMs;
      dispatch({ type: 'tick', dtMs, nowMs });
      frameIdRef.current = requestAnimationFrame(loop);
    };

    frameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [dispatch]);
};

```
> meta: lines=26 chars=779 truncated=no


## src/features/javelin/hooks/useLocalHighscores.ts
_Reusable hook / shared state or side-effect logic._

```ts
import { useCallback, useMemo, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../../app/browser';
import { HIGHSCORE_STORAGE_KEY, MAX_HIGHSCORES } from '../game/constants';
import type { HighscoreEntry, Locale } from '../game/types';

const compareHighscores = (a: HighscoreEntry, b: HighscoreEntry): number => {
  if (b.distanceM !== a.distanceM) {
    return b.distanceM - a.distanceM;
  }
  return a.playedAtIso.localeCompare(b.playedAtIso);
};

export const pruneHighscores = (
  entries: HighscoreEntry[],
  size = MAX_HIGHSCORES
): HighscoreEntry[] => entries.slice(0, size);

export const insertHighscoreSorted = (
  entries: HighscoreEntry[],
  entry: HighscoreEntry
): HighscoreEntry[] => [...entries, entry].sort(compareHighscores);

const supportedLocales = new Set<Locale>(['fi', 'sv', 'en']);

const parseEntry = (value: unknown): HighscoreEntry | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== 'string' || typeof raw.name !== 'string') {
    return null;
  }
  if (typeof raw.distanceM !== 'number' || !Number.isFinite(raw.distanceM)) {
    return null;
  }
  if (typeof raw.playedAtIso !== 'string' || Number.isNaN(Date.parse(raw.playedAtIso))) {
    return null;
  }

  if (raw.locale !== undefined && (typeof raw.locale !== 'string' || !supportedLocales.has(raw.locale as Locale))) {
    return null;
  }
  const locale: Locale = raw.locale === undefined ? 'en' : (raw.locale as Locale);

  if (raw.windMs !== undefined && (typeof raw.windMs !== 'number' || !Number.isFinite(raw.windMs))) {
    return null;
  }
  const windMs = raw.windMs === undefined ? 0 : raw.windMs;

  if (
    raw.launchSpeedMs !== undefined &&
    (typeof raw.launchSpeedMs !== 'number' || !Number.isFinite(raw.launchSpeedMs))
  ) {
    return null;
  }
  const launchSpeedMs = typeof raw.launchSpeedMs === 'number' ? raw.launchSpeedMs : undefined;

  if (raw.angleDeg !== undefined && (typeof raw.angleDeg !== 'number' || !Number.isFinite(raw.angleDeg))) {
    return null;
  }
  const angleDeg = typeof raw.angleDeg === 'number' ? raw.angleDeg : undefined;

  return {
    id: raw.id,
    name: raw.name,
    distanceM: raw.distanceM,
    playedAtIso: raw.playedAtIso,
    locale,
    windMs,
    launchSpeedMs,
    angleDeg
  };
};

const isDefined = <T>(value: T | null): value is T => value !== null;

export const loadHighscores = (): HighscoreEntry[] => {
  const raw = safeLocalStorageGet(HIGHSCORE_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map(parseEntry)
      .filter(isDefined)
      .sort(compareHighscores)
      .slice(0, MAX_HIGHSCORES);
  } catch {
    return [];
  }
};

export const saveHighscores = (entries: HighscoreEntry[]): void => {
  safeLocalStorageSet(HIGHSCORE_STORAGE_KEY, JSON.stringify(entries));
};

type UseLocalHighscoresResult = {
  highscores: HighscoreEntry[];
  addHighscore: (entry: HighscoreEntry) => void;
  clearHighscores: () => void;
  isHighscore: (distanceM: number) => boolean;
};

export const useLocalHighscores = (): UseLocalHighscoresResult => {
  const [highscores, setHighscores] = useState<HighscoreEntry[]>(loadHighscores);

  const addHighscore = useCallback((entry: HighscoreEntry) => {
    setHighscores((previous) => {
      const next = pruneHighscores(insertHighscoreSorted(previous, entry));
      saveHighscores(next);
      return next;
    });
  }, []);

  const clearHighscores = useCallback(() => {
    setHighscores([]);
    saveHighscores([]);
  }, []);

  const threshold = useMemo<number | null>(
    () => (highscores.length >= MAX_HIGHSCORES ? highscores[MAX_HIGHSCORES - 1].distanceM : null),
    [highscores]
  );

  const isHighscore = useCallback(
    (distanceM: number) => threshold === null || distanceM > threshold,
    [threshold]
  );

  return {
    highscores,
    addHighscore,
    clearHighscores,
    isHighscore
  };
};

```
> meta: lines=141 chars=4092 truncated=no


## src/features/javelin/hooks/useResultMessage.ts
_Reusable hook / shared state or side-effect logic._

```ts
/**
 * Derive localized result and status copy from the current game phase.
 * Returns neutral values when the game is not in a result or fault context.
 */
import { useMemo } from 'react';
import { useI18n } from '../../../i18n/init';
import type { FaultReason, GameState } from '../game/types';

const faultReasonKey = (reason: FaultReason): string => `result.fault.${reason}`;

export type ResultThrowSpecs = Extract<GameState['phase'], { tag: 'result' }>['launchedFrom'];

export type ResultMessageState = {
  resultMessage: string;
  resultStatusMessage: string | null;
  isFoulMessage: boolean;
  resultThrowSpecs: ResultThrowSpecs | null;
};

export const useResultMessage = (state: GameState): ResultMessageState => {
  const { t, formatNumber } = useI18n();

  const resultMessage = useMemo(() => {
    if (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) {
      return t('javelin.result.foul_line');
    }
    if (state.phase.tag === 'result') {
      const landingMessage =
        state.phase.tipFirst === null
          ? ''
          : state.phase.tipFirst
            ? ` · ${t('javelin.landingTipFirst')}`
            : ` · ${t('javelin.landingFlat')}`;
      if (state.phase.resultKind !== 'valid') {
        return `${t(`javelin.result.${state.phase.resultKind}`)} · ${formatNumber(state.phase.distanceM)} m`;
      }
      return `${t('result.distance')} ${formatNumber(state.phase.distanceM)} m${landingMessage}`;
    }
    if (state.phase.tag === 'fault') {
      return t(faultReasonKey(state.phase.reason));
    }
    return '';
  }, [state.phase, t, formatNumber]);

  const resultStatusMessage = useMemo(() => {
    if (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) {
      return t('result.notSavedInvalid');
    }
    if (state.phase.tag === 'fault') {
      return t('result.notSavedInvalid');
    }
    if (state.phase.tag !== 'result') {
      return null;
    }
    if (state.phase.resultKind !== 'valid') {
      return t('result.notSavedInvalid');
    }
    if (!state.phase.isHighscore) {
      return t('result.notHighscore');
    }
    return null;
  }, [state.phase, t]);

  const resultThrowSpecs = state.phase.tag === 'result' ? state.phase.launchedFrom : null;
  const isFoulMessage =
    state.phase.tag === 'fault' ||
    (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) ||
    (state.phase.tag === 'result' && state.phase.resultKind !== 'valid');

  return {
    resultMessage,
    resultStatusMessage,
    isFoulMessage,
    resultThrowSpecs
  };
};

```
> meta: lines=77 chars=2589 truncated=no


## src/features/javelin/JavelinPage.tsx
_Defines: JavelinPage_

```tsx
import { memo, useEffect, useReducer, useState, type ReactElement } from 'react';
import { LanguageSwitch } from './components/LanguageSwitch';
import { ThemeToggle } from './components/ThemeToggle';
import { HudPanel } from './components/HudPanel';
import { GameCanvas } from './components/GameCanvas';
import { GameActions } from './components/GameActions';
import { ResultDisplay } from './components/ResultDisplay';
import { SaveScoreForm } from './components/SaveScoreForm';
// ... 10 more import lines from ., .., react

type TopBarProps = {
  appTitle: string;
  gameTitle: string;
};

const TopBarComponent = ({ appTitle, gameTitle }: TopBarProps): ReactElement => (
  <header className="topbar">
    <div className="topbar-title">
      <p className="eyebrow">{appTitle}</p>
      <h1>{gameTitle}</h1>
    </div>
    <div className="topbar-controls">
      <LanguageSwitch />
      <ThemeToggle />
    </div>
  </header>
);

const TopBar = memo(TopBarComponent);

type SideColumnProps = {
  highscores: HighscoreEntry[];
  clearHighscores: () => void;
};

const SideColumnComponent = ({ highscores, clearHighscores }: SideColumnProps): ReactElement => {
  const { t } = useI18n();
  return (
    <aside className="side-column">
      <ControlHelp />
      <ScoreBoard highscores={highscores} />
      <button
        type="button"
        className="ghost"
        onClick={clearHighscores}
        aria-label={`${t('action.resetScores')} - ${t('scoreboard.title')}`}
      >
        {t('action.resetScores')}
      </button>
    </aside>
  );
};

const SideColumn = memo(SideColumnComponent);

type CompactSideColumnProps = {
  highscores: HighscoreEntry[];
  clearHighscores: () => void;
};

const CompactSideColumnComponent = ({
  highscores,
  clearHighscores
}: CompactSideColumnProps): ReactElement => {
  const { t } = useI18n();
  const hasScores = highscores.length > 0;
  const [isScoreboardOpen, setIsScoreboardOpen] = useState<boolean>(hasScores);

  useEffect(() => {
    setIsScoreboardOpen(hasScores);
  }, [hasScores]);

  return (
    <section className="compact-side-column">
      <details className="card disclosure disclosure-help">
        <summary>{t('help.title')}</summary>
        <div className="disclosure-body">
          <ControlHelpContent />
        </div>
      </details>
      <details
        className="card disclosure disclosure-scoreboard"
        open={isScoreboardOpen}
        onToggle={(event) => setIsScoreboardOpen(event.currentTarget.open)}
      >
        <summary>{t('scoreboard.title')}</summary>
        <div className="disclosure-body">
          <ScoreBoardContent highscores={highscores} />
        </div>
      </details>
      <button
        type="button"
        className="ghost reset-scores"
        onClick={clearHighscores}
        aria-label={`${t('action.resetScores')} - ${t('scoreboard.title')}`}
      >
        {t('action.resetScores')}
      </button>
    </section>
  );
};

const CompactSideColumn = memo(CompactSideColumnComponent);

export const JavelinPage = (): ReactElement => {
  const { t, locale } = useI18n();
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [savedRoundId, setSavedRoundId] = useState<number>(-1);
  const { highscores, addHighscore, clearHighscores, isHighscore } = useLocalHighscores();
  const isCompactLayout = useMediaQuery('(max-width: 1023px)');

  useGameLoop(dispatch);

  useEffect(() => {
    if (state.phase.tag !== 'result' || state.phase.resultKind !== 'valid') {
      return;
    }
    const shouldBeHighscore = isHighscore(state.phase.distanceM);
    if (state.phase.isHighscore === shouldBeHighscore) {
      return;
    }
    dispatch({
      type: 'setResultHighscoreFlag',
      isHighscore: shouldBeHighscore
    });
  }, [state.phase, isHighscore]);

  const { resultMessage, resultStatusMessage, isFoulMessage, resultThrowSpecs } = useResultMessage(state);

  const canSaveScore =
    state.phase.tag === 'result' &&
    state.phase.resultKind === 'valid' &&
    state.phase.isHighscore &&
    savedRoundId !== state.roundId;

  return (
    <main className="page">
      <TopBar appTitle={t('app.title')} gameTitle={t('javelin.title')} />

      <section className="layout">
        <div className="main-column">
          <HudPanel state={state} />
          <GameCanvas state={state} dispatch={dispatch} />
          <GameActions state={state} dispatch={dispatch} />
          <ResultDisplay
            resultMessage={resultMessage}
            resultStatusMessage={resultStatusMessage}
            isFoulMessage={isFoulMessage}
            resultThrowSpecs={resultThrowSpecs}
          />

          {canSaveScore && state.phase.tag === 'result' && (
            <SaveScoreForm
              onSave={(name) => {
                if (state.phase.tag !== 'result') {
                  return;
                }
                addHighscore({
                  id: crypto.randomUUID(),
                  name,
                  distanceM: state.phase.distanceM,
                  playedAtIso: new Date().toISOString(),
                  locale,
                  windMs: state.phase.launchedFrom.windMs,
                  launchSpeedMs: state.phase.launchedFrom.launchSpeedMs,
                  angleDeg: state.phase.launchedFrom.angleDeg
                });
                setSavedRoundId(state.roundId);
              }}
              defaultName={t('scoreboard.defaultName')}
            />
          )}
          {state.phase.tag === 'result' && state.phase.resultKind === 'valid' && state.phase.isHighscore && (
            <div className="badge">{t('result.highscore')}</div>
          )}
        </div>

        {isCompactLayout ? (
          <CompactSideColumn highscores={highscores} clearHighscores={clearHighscores} />
        ) : (
          <SideColumn highscores={highscores} clearHighscores={clearHighscores} />
        )}
      </section>
    </main>
  );
};

```
> meta: lines=187 chars=5953 truncated=no


## src/i18n/init.tsx
_Defines: readStoredLocale, getBrowserLocale, resolveLocale, persistLocale, I18nProvider, useI18n_

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
// ... 6 more import lines from ., .., react

const LOCALE_STORAGE_KEY = 'sg2026-javelin-locale-v1';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  formatNumber: (value: number, maxFractionDigits?: number) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const readStoredLocale = (): Locale | null => {
  const stored = safeLocalStorageGet(LOCALE_STORAGE_KEY);
  if (stored === 'fi' || stored === 'sv' || stored === 'en') {
    return stored;
  }
  return null;
};

export const getBrowserLocale = (): string => {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.language !== 'string') {
      return '';
    }
    return navigator.language.toLowerCase();
  } catch {
    return '';
  }
};

export const resolveLocale = (stored: Locale | null, browserLocale: string): Locale => {
  if (stored !== null) {
    return stored;
  }
  if (browserLocale.startsWith('fi')) {
    return 'fi';
  }
  if (browserLocale.startsWith('sv')) {
    return 'sv';
  }
  return 'en';
};

export const persistLocale = (locale: Locale): void => {
  safeLocalStorageSet(LOCALE_STORAGE_KEY, locale);
};

const detectLocale = (): Locale => {
  return resolveLocale(readStoredLocale(), getBrowserLocale());
};

export const I18nProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const numberFormatCacheRef = useRef(new Map<string, Intl.NumberFormat>());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: string): string => resources[locale][key] ?? resources.en[key] ?? key,
    [locale]
  );

  const formatNumber = useCallback(
    (value: number, maxFractionDigits = 1): string => {
      const cacheKey = `${locale}-${maxFractionDigits}`;
      const cache = numberFormatCacheRef.current;
      let formatter = cache.get(cacheKey);
      if (!formatter) {
        formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: maxFractionDigits });
        cache.set(cacheKey, formatter);
      }
      return formatter.format(value);
    },
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, formatNumber }),
    [locale, setLocale, t, formatNumber]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
};

```
> meta: lines=112 chars=2926 truncated=no


## src/i18n/resources.ts
_Defines: Messages, resources_

```ts
import type { Locale } from '../features/javelin/game/types';

export type Messages = Record<string, string>;

export const resources: Record<Locale, Messages> = {
  fi: {
    'app.title': 'Selain Games 2026',
    'javelin.title': 'Keihään​heitto',
    'javelin.runupHint': 'Naputa nopeasti vauhtia. Heittoviivalle',
    'javelin.throwLine': 'Heittoviiva',
    'javelin.speedPassiveHint': 'Vauhti hiipuu tähtäyksessä - vapauta vihreällä alueella.',
    'javelin.windHintHeadwind': 'Vastatuuli - tähtää korkeammalle',
    'javelin.windHintTailwind': 'Myötätuuli - matalampi kulma kantaa pidemmälle',
    'onboarding.hint': 'Space/klikkaus vauhtiin -> Enter/oikea painike lataukseen -> vapauta heittoon',
    'onboarding.hintTouch': 'Naputa vauhtiin -> pidä painettuna lataukseen -> vapauta heittoon',
    'javelin.landingTipFirst': 'Kärki edellä',
    'javelin.landingFlat': 'Litteä alastulo',
    'javelin.result.foul_line': 'Hylätty: viiva ylitetty',
    'javelin.result.foul_sector': 'Hylätty: sektorin ulkopuolella',
    'javelin.result.foul_tip_first': 'Hylätty: kärki ei osunut ensin',
    'phase.idle': 'Valmis',
    'phase.runup': 'Kiihdytä naputtamalla',
    'phase.chargeAim': 'Pidä heittovoimaa',
    'phase.throwAnim': 'Heittoliike',
    'phase.flight': 'Keihäs ilmassa',
    'phase.result': 'Tulos valmis',
    'phase.fault': 'Virheheitto',
    'hud.rhythm': 'Kiihdytys',
    'hud.force': 'Voima',
    'spec.wind': 'Tuuli',
    'spec.angle': 'Kulma',
    'spec.launchSpeed': 'Nopeus',
    'hud.perfect': 'Täydellinen',
    'hud.good': 'Hyvä',
    'hud.miss': 'Huti',
    'action.start': 'Aloita kierros',
    'action.playAgain': 'Uusi kierros',
    'action.saveScore': 'Tallenna',
    'action.resetScores': 'Nollaa taulukko',
    'help.title': 'Ohjaus',
    'help.mouse1': 'Vasen klikki: naputa vauhtia',
    'help.mouse2': 'Oikea painike alas: aloita tähtäys',
    'help.mouse3': 'Liikuta hiirtä ylös/alas: säädä kulmaa',
    'help.mouse4': 'Oikea painike ylös: vapauta heitto',
    'help.kbd1': 'Space: naputa vauhtia',
    'help.kbd2': 'Enter alas: aloita tähtäys',
    'help.kbd3': 'Nuoli ylös/alas: kulma',
    'help.kbd4': 'Enter ylös: vapauta heitto',
    'help.touch1': 'Napauta nopeasti: rakenna vauhtia',
    'help.touch2': 'Pidä pohjassa: lataa heittovoima',
    'help.touch3': 'Vedä pitäessä: säädä kulmaa',
    'help.touch4': 'Vapauta: heitä',
    'result.distance': 'Tulos',
    'result.highscore': 'Uusi ennätys!',
    'result.notSavedInvalid': 'Virheellinen heitto - tulosta ei tallenneta',
    'result.notHighscore': 'Ei uusi ennätys - tulosta ei tallenneta',
    'result.fault.lateRelease': 'Virhe: release myöhässä',
    'result.fault.invalidRelease': 'Virhe: release liian aikaisin',
    'result.fault.lowAngle': 'Virhe: kulma liian matala',
    'scoreboard.title': 'Paikallinen ennätystaulukko',
    'scoreboard.name': 'Nimi',
    'scoreboard.defaultName': 'Pelaaja',
    'scoreboard.empty': 'Ei vielä tuloksia.',
    'language.label': 'Kieli',
    'theme.label': 'Teema',
    'theme.light': 'Vaalea',
    'theme.dark': 'Tumma',
    'theme.toggleToLight': 'Vaihda vaaleaan teemaan',
    'theme.toggleToDark': 'Vaihda tummaan teemaan',
    'a11y.gameCanvas': 'Keihäänheiton pelialue',
    'a11y.hudPanel': 'Tilapaneeli',
    'a11y.announce.idle': 'Valmiina heittoon',
    'a11y.announce.runupStarted': 'Vauhdinotto alkoi',
    'a11y.announce.chargeAim': 'Heittovoimaa ladataan',
    'a11y.announce.throwAnim': 'Heittoliike',
    'a11y.announce.flight': 'Keihäs ilmassa',
    'a11y.announce.resultPrefix': 'Tulos',
    'a11y.announce.fault': 'Virheheitto'
  },
  sv: {
    'app.title': 'Browser Games 2026',
    'javelin.title': 'Spjut​kastning',
    'javelin.runupHint': 'Tryck snabbt för fart. Kvar till linjen',
    'javelin.throwLine': 'Kastlinje',
    'javelin.speedPassiveHint': 'Farten avtar under laddning - släpp i gröna zonen.',
    'javelin.windHintHeadwind': 'Motvind - sikta högre för distans',
    'javelin.windHintTailwind': 'Medvind - lägre vinkel bär längre',
    'onboarding.hint': 'Space/klicka för fart -> Enter/högerknapp för laddning -> släpp för kast',
    'onboarding.hintTouch': 'Tryck för fart -> håll för laddning -> släpp för kast',
    'javelin.landingTipFirst': 'Spetsen först',
    'javelin.landingFlat': 'Platt landning',
    'javelin.result.foul_line': 'Ogiltigt: linjen överträdd',
    'javelin.result.foul_sector': 'Ogiltigt: utanför sektorn',
    'javelin.result.foul_tip_first': 'Ogiltigt: spetsen landade inte först',
    'phase.idle': 'Klar',
    'phase.runup': 'Bygg fart',
    'phase.chargeAim': 'Ladda kastkraft',
    'phase.throwAnim': 'Kaströrelse',
    'phase.flight': 'Spjutet flyger',
    'phase.result': 'Resultat klart',
    'phase.fault': 'Övertramp',
    'hud.rhythm': 'Ansats',
    'hud.force': 'Kraft',
    'spec.wind': 'Vind',
    'spec.angle': 'Vinkel',
    'spec.launchSpeed': 'Hastighet',
    'hud.perfect': 'Perfekt',
    'hud.good': 'Bra',
    'hud.miss': 'Miss',
    'action.start': 'Starta runda',
    'action.playAgain': 'Ny runda',
    'action.saveScore': 'Spara',
    'action.resetScores': 'Nollställ listan',
    'help.title': 'Styrning',
    'help.mouse1': 'Vänsterklick: tryck för fart',
    'help.mouse2': 'Högerknapp ned: börja sikta',
    'help.mouse3': 'Mus upp/ner: justera vinkel',
    'help.mouse4': 'Högerknapp upp: släpp kastet',
    'help.kbd1': 'Space: tryck för fart',
    'help.kbd2': 'Enter ned: börja sikta',
    'help.kbd3': 'Pil upp/ner: vinkel',
    'help.kbd4': 'Enter upp: släpp kastet',
    'help.touch1': 'Tryck snabbt: bygg fart',
    'help.touch2': 'Håll: ladda kastkraft',
    'help.touch3': 'Dra medan du håller: sikta vinkel',
    'help.touch4': 'Släpp: kasta',
    'result.distance': 'Resultat',
    'result.highscore': 'Nytt rekord!',
    'result.notSavedInvalid': 'Ogiltigt kast - resultatet sparas inte',
    'result.notHighscore': 'Inte nytt rekord - resultatet sparas inte',
    'result.fault.lateRelease': 'Fel: release för sent',
    'result.fault.invalidRelease': 'Fel: release för tidigt',
    'result.fault.lowAngle': 'Fel: för låg vinkel',
    'scoreboard.title': 'Lokal topplista',
    'scoreboard.name': 'Namn',
    'scoreboard.defaultName': 'Spelare',
    'scoreboard.empty': 'Inga resultat än.',
    'language.label': 'Språk',
    'theme.label': 'Tema',
    'theme.light': 'Ljus',
    'theme.dark': 'Mörk',
    'theme.toggleToLight': 'Byt till ljust tema',
    'theme.toggleToDark': 'Byt till mörkt tema',
    'a11y.gameCanvas': 'Spjutkastning spelplan',
    'a11y.hudPanel': 'Statuspanel',
    'a11y.announce.idle': 'Redo att kasta',
    'a11y.announce.runupStarted': 'Ansatsen har startat',
    'a11y.announce.chargeAim': 'Kastkraft laddas',
    'a11y.announce.throwAnim': 'Kaströrelse',
    'a11y.announce.flight': 'Spjutet flyger',
    'a11y.announce.resultPrefix': 'Resultat',
    'a11y.announce.fault': 'Ogiltigt kast'
  },
  en: {
    'app.title': 'Browser Games 2026',
    'javelin.title': 'Javelin Throw',
    'javelin.runupHint': 'Tap fast to build speed. Distance to line',
    'javelin.throwLine': 'Throw Line',
    'javelin.speedPassiveHint': 'Speed decays during charge - release in the green zone.',
    'javelin.windHintHeadwind': 'Headwind - aim higher for distance',
    'javelin.windHintTailwind': 'Tailwind - lower angle carries further',
    'onboarding.hint': 'Tap Space/Click for speed -> Hold Enter/Right-click to charge -> Release to throw',
    'onboarding.hintTouch': 'Tap for speed -> Hold to charge -> Release to throw',
    'javelin.landingTipFirst': 'Tip-first landing',
    'javelin.landingFlat': 'Flat landing',
    'javelin.result.foul_line': 'Foul: line crossed',
    'javelin.result.foul_sector': 'Foul: outside sector',
    'javelin.result.foul_tip_first': 'Foul: tip did not land first',
    'phase.idle': 'Ready',
    'phase.runup': 'Build speed',
    'phase.chargeAim': 'Charge throw force',
    'phase.throwAnim': 'Throw animation',
    'phase.flight': 'Javelin in flight',
    'phase.result': 'Result ready',
    'phase.fault': 'Fault throw',
    'hud.rhythm': 'Run-up',
    'hud.force': 'Force',
    'spec.wind': 'Wind',
    'spec.angle': 'Angle',
    'spec.launchSpeed': 'Speed',
    'hud.perfect': 'Perfect',
    'hud.good': 'Good',
    'hud.miss': 'Miss',
    'action.start': 'Start round',
    'action.playAgain': 'Play again',
    'action.saveScore': 'Save',
    'action.resetScores': 'Reset board',
    'help.title': 'Controls',
    'help.mouse1': 'Left click: tap for speed',
    'help.mouse2': 'Right button down: begin charge',
    'help.mouse3': 'Move mouse up/down: adjust angle',
    'help.mouse4': 'Right button up: release throw',
    'help.kbd1': 'Space: tap for speed',
    'help.kbd2': 'Enter down: begin charge',
    'help.kbd3': 'Arrow up/down: angle',
    'help.kbd4': 'Enter up: release throw',
    'help.touch1': 'Tap quickly: build speed',
    'help.touch2': 'Hold: charge throw force',
    'help.touch3': 'Drag while holding: aim angle',
    'help.touch4': 'Release: throw',
    'result.distance': 'Result',
    'result.highscore': 'New highscore!',
    'result.notSavedInvalid': 'Invalid throw - result is not saved',
    'result.notHighscore': 'Not a highscore - result is not saved',
    'result.fault.lateRelease': 'Fault: late release',
    'result.fault.invalidRelease': 'Fault: too early release',
    'result.fault.lowAngle': 'Fault: angle too low',
    'scoreboard.title': 'Local leaderboard',
    'scoreboard.name': 'Name',
    'scoreboard.defaultName': 'PLAYER',
    'scoreboard.empty': 'No scores yet.',
    'language.label': 'Language',
    'theme.label': 'Theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggleToLight': 'Switch to light theme',
    'theme.toggleToDark': 'Switch to dark theme',
    'a11y.gameCanvas': 'Javelin throw play area',
    'a11y.hudPanel': 'Status panel',
    'a11y.announce.idle': 'Ready to throw',
    'a11y.announce.runupStarted': 'Run-up started',
    'a11y.announce.chargeAim': 'Charging throw',
    'a11y.announce.throwAnim': 'Throw released',
    'a11y.announce.flight': 'Javelin in flight',
    'a11y.announce.resultPrefix': 'Result',
    'a11y.announce.fault': 'Fault throw'
  }
};

```
> meta: lines=229 chars=10164 truncated=no


## src/index.css

```css
:root {
  color-scheme: light;
  font-family: 'Trebuchet MS', 'Avenir Next', 'Segoe UI', sans-serif;
  line-height: 1.35;
  font-weight: 500;
  text-rendering: optimizeLegibility;
  --bg-main: #f2fbff;
  --bg-radial-a: rgba(84, 196, 255, 0.28);
  --bg-radial-b: rgba(255, 201, 101, 0.24);
  --bg-grad-start: #e7f8ff;
  --bg-grad-end: #f6fff2;
  --bg-card: rgba(255, 255, 255, 0.9);
  --text-main: #0e2b42;
  --text-soft: #36566f;
  --accent: #008f55;
  --accent-strong: #0064be;
  --button-primary-text: #ffffff;
  --button-ghost-bg: #e5f1ff;
  --button-ghost-text: #0f3b61;
  --focus-outline: #003f77;
  --card-border: rgba(19, 73, 116, 0.12);
  --canvas-frame-border: rgba(8, 52, 87, 0.2);
  --canvas-fallback: #dff5ff;
  --chip-bg: rgba(0, 100, 190, 0.11);
  --chip-text: #0f3b61;
  --scoreboard-entry-bg: rgba(0, 143, 85, 0.08);
  --input-bg: #ffffff;
  --input-border: rgba(15, 59, 97, 0.28);
  --badge-bg: #e3ffdc;
  --badge-text: #1f6c35;
  --foul-text: #9b2217;
  --control-bg: #ffffff;
  --control-border: rgba(14, 43, 66, 0.28);
  --control-text: #0e2b42;
  --warning: #bc3c2a;
  --shadow: 0 18px 40px rgba(14, 43, 66, 0.16);
  --radius: 4px;
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --bg-main: #0f1a24;
  --bg-radial-a: rgba(49, 113, 152, 0.28);
  --bg-radial-b: rgba(152, 125, 67, 0.2);
  --bg-grad-start: #122130;
  --bg-grad-end: #18261f;
  --bg-card: rgba(23, 34, 46, 0.92);
  --text-main: #d7e8f5;
  --text-soft: #96b3c8;
  --accent: #48c98c;
  --accent-strong: #287fd6;
  --button-primary-text: #f4fbff;
  --button-ghost-bg: #21354a;
  --button-ghost-text: #d6e8f8;
  --focus-outline: #7bb7ee;
  --card-border: rgba(143, 182, 213, 0.3);
  --canvas-frame-border: rgba(121, 162, 196, 0.42);
  --canvas-fallback: #223647;
  --chip-bg: rgba(69, 143, 212, 0.26);
  --chip-text: #d8ecfb;
  --scoreboard-entry-bg: rgba(72, 201, 140, 0.16);
  --input-bg: #1c2b39;
  --input-border: rgba(161, 198, 226, 0.5);
  --badge-bg: #24593a;
  --badge-text: #a4efc0;
  --foul-text: #ff9a90;
  --control-bg: #1c2b39;
  --control-border: rgba(161, 198, 226, 0.5);
  --control-text: #d7e8f5;
  --shadow: 0 18px 40px rgba(2, 9, 15, 0.55);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;
    --bg-main: #0f1a24;
    --bg-radial-a: rgba(49, 113, 152, 0.28);
    --bg-radial-b: rgba(152, 125, 67, 0.2);
    --bg-grad-start: #122130;
    --bg-grad-end: #18261f;
    --bg-card: rgba(23, 34, 46, 0.92);
    --text-main: #d7e8f5;
    --text-soft: #96b3c8;
    --accent: #48c98c;
    --accent-strong: #287fd6;
    --button-primary-text: #f4fbff;
    --button-ghost-bg: #21354a;
    --button-ghost-text: #d6e8f8;
    --focus-outline: #7bb7ee;
    --card-border: rgba(143, 182, 213, 0.3);
    --canvas-frame-border: rgba(121, 162, 196, 0.42);
    --canvas-fallback: #223647;
    --chip-bg: rgba(69, 143, 212, 0.26);
    --chip-text: #d8ecfb;
    --scoreboard-entry-bg: rgba(72, 201, 140, 0.16);
    --input-bg: #1c2b39;
    --input-border: rgba(161, 198, 226, 0.5);
    --badge-bg: #24593a;
    --badge-text: #a4efc0;
    --foul-text: #ff9a90;
    --control-bg: #1c2b39;
    --control-border: rgba(161, 198, 226, 0.5);
    --control-text: #d7e8f5;
    --shadow: 0 18px 40px rgba(2, 9, 15, 0.55);
  }
}

* {
  box-sizing: border-box;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

body {
  margin: 0;
  min-height: 100vh;
  font-size: 16px;
  color: var(--text-main);
  background-color: var(--bg-main);
  background:
    radial-gradient(circle at 20% 10%, var(--bg-radial-a), transparent 35%),
    radial-gradient(circle at 80% 10%, var(--bg-radial-b), transparent 30%),
    linear-gradient(135deg, var(--bg-grad-start) 0%, var(--bg-grad-end) 100%);
}

button,
input,
select {
  font: inherit;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
summary:focus-visible {
  outline: 3px solid var(--focus-outlin

// [TRUNCATED at 4000 chars]

```
> NOTE: Truncated to 4000 chars (original: 11694).
> meta: lines=638 chars=11694 truncated=yes

### Entry points & app wiring


## src/main.tsx

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { I18nProvider } from './i18n/init';
import { ThemeProvider } from './theme/init';
import { registerPwa } from './pwa/register';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

registerPwa();

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>
);

```
> meta: lines=26 chars=580 truncated=no

### Other code & helpers


## src/pwa/register.ts
_Defines: registerPwa_

```ts
import { registerSW } from 'virtual:pwa-register';

export const registerPwa = (): void => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return;
  }

  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.info('Selain Games update is ready. Reload to apply it.');
    },
    onOfflineReady() {
      console.info('Selain Games is ready for offline play.');
    }
  });
};

```
> meta: lines=18 chars=415 truncated=no


## src/theme/init.test.tsx

```tsx
import { afterEach, describe, expect, it } from 'vitest';
import {
  getBrowserPrefersDark,
  persistTheme,
  readStoredTheme,
  resolveTheme
} from './init';

type StorageMock = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const setStorageMock = (mock: StorageMock): void => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: mock
  });
};

const setWindowMock = (value: unknown): void => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value
  });
};

afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
  delete (globalThis as { window?: unknown }).window;
});

describe('theme helpers', () => {
  it('resolves stored theme over browser preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('falls back to browser preference when storage is empty', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('returns null when stored theme is invalid or storage read fails', () => {
    setStorageMock({
      getItem: () => 'sepia',
      setItem: () => undefined
    });
    expect(readStoredTheme()).toBeNull();

    setStorageMock({
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined
    });
    expect(readStoredTheme()).toBeNull();
  });

  it('reads dark browser preference when matchMedia reports dark mode', () => {
    setWindowMock({
      matchMedia: (query: string) => ({
        matches: query === '(prefers-color-scheme: dark)'
      })
    });

    expect(getBrowserPrefersDark()).toBe(true);
  });

  it('falls back to light preference when browser APIs are missing or throw', () => {
    setWindowMock({});
    expect(getBrowserPrefersDark()).toBe(false);

    setWindowMock({
      matchMedia: () => {
        throw new Error('unsupported');
      }
    });
    expect(getBrowserPrefersDark()).toBe(false);
  });

  it('swallows storage write errors when persisting theme', () => {
    setStorageMock({
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      }
    });

    expect(() => persistTheme('dark')).not.toThrow();
  });
});

```
> meta: lines=93 chars=2346 truncated=no


## src/theme/init.tsx
_Defines: ThemeMode, readStoredTheme, getBrowserPrefersDark, resolveTheme, persistTheme, ThemeProvider_

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
// ... 3 more import lines from .., react

const THEME_STORAGE_KEY = 'sg2026-javelin-theme-v1';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const readStoredTheme = (): ThemeMode | null => {
  const stored = safeLocalStorageGet(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
};

export const getBrowserPrefersDark = (): boolean => {
  try {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const resolveTheme = (
  stored: ThemeMode | null,
  browserPrefersDark: boolean
): ThemeMode => {
  if (stored !== null) {
    return stored;
  }
  return browserPrefersDark ? 'dark' : 'light';
};

export const persistTheme = (theme: ThemeMode): void => {
  safeLocalStorageSet(THEME_STORAGE_KEY, theme);
};

const detectTheme = (): ThemeMode =>
  resolveTheme(readStoredTheme(), getBrowserPrefersDark());

export const ThemeProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [theme, setThemeState] = useState<ThemeMode>(detectTheme);

  const setTheme = useCallback((mode: ThemeMode): void => {
    setThemeState(mode);
    persistTheme(mode);
  }, []);

  const toggleTheme = useCallback((): void => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};

```
> meta: lines=97 chars=2394 truncated=no


## src/vite-env.d.ts

```ts



```
> meta: lines=3 chars=2 truncated=no

### Configuration / tooling / CI


## tsconfig.json
_TypeScript compiler configuration._

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client", "vitest/globals"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}

```
> meta: lines=25 chars=667 truncated=no

### Other code & helpers


## vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    sourcemap: 'hidden'
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-icon-512x512.png'
      ],
      manifest: {
        id: 'fi.selain.games2026.javelin',
        name: 'Selain Games 2026 - Keihäänheitto',
        short_name: 'Keihäänheitto',
        description: 'Selain Games 2026 - Keihäänheitto',
        lang: 'fi',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'portrait',
        background_color: '#0f1a24',
        theme_color: '#0f1a24',
        categories: ['games', 'sports'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,json}']
      }
    })
  ],
  base: process.env.GITHUB_ACTIONS ? '/Javelin/' : '/',
  test: {
    environment: 'node'
  }
});

```
> meta: lines=67 chars=1739 truncated=no

### Entry points & app wiring


## src/app/browser.test.ts

```ts
import { afterEach, describe, expect, it } from 'vitest';
import { isInteractiveElement, safeLocalStorageGet, safeLocalStorageSet } from './browser';

type StorageMock = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const setStorageMock = (mock: StorageMock): void => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: mock
  });
};

const makeTarget = (overrides: {
  tagName?: string;
  isContentEditable?: boolean;
  closest?: (selector: string) => unknown;
} = {}): EventTarget =>
  ({
    tagName: 'DIV',
    isContentEditable: false,
    closest: () => null,
    ...overrides
  }) as unknown as EventTarget;

afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
});

describe('browser helpers', () => {
  it('detects interactive event targets', () => {
    expect(isInteractiveElement(makeTarget({ tagName: 'INPUT' }))).toBe(true);
    expect(isInteractiveElement(makeTarget({ isContentEditable: true }))).toBe(true);
    expect(
      isInteractiveElement(
        makeTarget({
          closest: () => ({})
        })
      )
    ).toBe(true);
    expect(isInteractiveElement(makeTarget())).toBe(false);
  });

  it('treats ARIA textbox-like roles as interactive by closest lookup', () => {
    const selectors: string[] = [];
    const target = makeTarget({
      closest: (selector) => {
        selectors.push(selector);
        return selector.includes('[role="combobox"]') ? {} : null;
      }
    });

    expect(isInteractiveElement(target)).toBe(true);
    expect(selectors).toHaveLength(1);
  });

  it('returns null when storage getter throws', () => {
    setStorageMock({
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined
    });
    expect(safeLocalStorageGet('x')).toBeNull();
  });

  it('does not throw when storage setter throws', () => {
    setStorageMock({
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      }
    });
    expect(() => safeLocalStorageSet('x', '1')).not.toThrow();
  });
});

```
> meta: lines=79 chars=2130 truncated=no

### Other code & helpers


## src/features/javelin/game/athletePose.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  computeAthletePoseGeometry,
  getRunToAimBlend01,
  sampleThrowSubphase
} from './athletePose';

describe('athlete pose helpers', () => {
  it('segments throw animation into windup, delivery, and follow stages', () => {
    expect(sampleThrowSubphase(0.1).stage).toBe('windup');
    expect(sampleThrowSubphase(0.5).stage).toBe('delivery');
    expect(sampleThrowSubphase(0.9).stage).toBe('follow');
  });

  it('clamps run-to-aim blend between 0 and 1', () => {
    expect(getRunToAimBlend01(1000, 940, 180)).toBe(0);
    expect(getRunToAimBlend01(1000, 1090, 180)).toBeCloseTo(0.5, 1);
    expect(getRunToAimBlend01(1000, 1400, 180)).toBe(1);
  });

  it('stages throw hand and javelin from loaded to forward delivery', () => {
    const loaded = computeAthletePoseGeometry({ animTag: 'throw', animT: 0.16 }, 0.84, 36, 12.5);
    const delivery = computeAthletePoseGeometry({ animTag: 'throw', animT: 0.76 }, 0.84, 36, 12.5);
    const handTravel = Math.hypot(
      delivery.handFront.xM - loaded.handFront.xM,
      delivery.handFront.yM - loaded.handFront.yM
    );

    expect(Number.isFinite(handTravel)).toBe(true);
    expect(handTravel).toBeGreaterThan(0.2);
    expect(Math.abs(delivery.javelinAngleRad - loaded.javelinAngleRad)).toBeLessThan(0.08);
    expect(delivery.javelinAngleRad).toBeCloseTo((36 * Math.PI) / 180, 1);
  });

  it('front arm tracks javelin angle during aim', () => {
    const pose = computeAthletePoseGeometry({ animTag: 'aim', animT: 0.5 }, 0.5, 45, 10);
    const dx = pose.handFront.xM - pose.shoulderCenter.xM;
    const dy = pose.handFront.yM - pose.shoulderCenter.yM;
    const handAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

    expect(handAngleDeg).toBeGreaterThan(20);
    expect(handAngleDeg).toBeLessThan(70);
  });

  it('head tilts toward aim angle during charge', () => {
    const highAim = computeAthletePoseGeometry({ animTag: 'aim', animT: 0.5 }, 0.5, 60, 10);
    const lowAim = computeAthletePoseGeometry({ animTag: 'aim', animT: 0.5 }, 0.5, 10, 10);
    expect(highAim.headTiltRad).toBeGreaterThan(lowAim.headTiltRad);
  });

  it('head tilts forward during run', () => {
    const pose = computeAthletePoseGeometry({ animTag: 'run', animT: 0.5 }, 0.8, 36, 10);
    expect(pose.headTiltRad).toBeLessThan(0);
  });

  it('keeps legs close to run pose during early aim blend at high speed', () => {
    const runPose = computeAthletePoseGeometry({ animTag: 'run', animT: 0.5 }, 0.6, 36, 10);
    const aimBlendPose = computeAthletePoseGeometry(
      { animTag: 'aim', animT: 0.1 },
      0.6,
      36,
      10,
      { runBlendFromAnimT: 0.5, runToAimBlend01: 0.3 }
    );

    expect(Math.abs(aimBlendPose.kneeFront.xM - runPose.kneeFront.xM)).toBeLessThan(0.1);
    expect(Math.abs(aimBlendPose.kneeBack.xM - runPose.kneeBack.xM)).toBeLessThan(0.1);
  });

  it('follow-through has wider stance at high speed', () => {
    const slow = computeAthletePoseGeometry({ animTag: 'fol

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 3345).
> meta: lines=78 chars=3345 truncated=yes


## src/features/javelin/game/audio.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  playRunupTap,
  playChargeStart,
  playCrowdReaction,
  playFaultOof,
  playLandingImpact,
  setFlightWindIntensity,
// ... 3 more import lines from ., vitest

describe('audio no-op fallback', () => {
  it('does not throw when AudioContext is unavailable', () => {
    expect(() => resumeAudioContext()).not.toThrow();
    expect(() => playRunupTap(1)).not.toThrow();
    expect(() => playRunupTap(0.3)).not.toThrow();
    expect(() => playChargeStart()).not.toThrow();
    expect(() => playThrowWhoosh(0.75)).not.toThrow();
    expect(() => setFlightWindIntensity(0.5)).not.toThrow();
    expect(() => playLandingImpact(true)).not.toThrow();
    expect(() => playCrowdReaction('cheer')).not.toThrow();
    expect(() => playCrowdReaction('groan')).not.toThrow();
    expect(() => playFaultOof()).not.toThrow();
  });

  it('keeps delayed crowd transient path safe without audio engine', () => {
    expect(() => playCrowdReaction('cheer')).not.toThrow();
  });
});

```
> meta: lines=29 chars=1023 truncated=no


## src/features/javelin/game/camera.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { CAMERA_GROUND_BOTTOM_PADDING } from './constants';
import { createWorldToScreenRaw, getCameraTargetX, getViewWidthM, RUNWAY_OFFSET_X } from './camera';
import { GAMEPLAY_TUNING } from './tuning';
import type { GameState } from './types';

const { runupStartXM: RUNUP_START_X_M } = GAMEPLAY_TUNING.movement;

const baseState: Pick<GameState, 'nowMs' | 'roundId' | 'windMs' | 'windZMs' | 'aimAngleDeg'> = {
  nowMs: 2200,
  roundId: 2,
  windMs: 0.2,
  windZMs: -0.1,
  aimAngleDeg: 34
};

const offset = -RUNUP_START_X_M;

describe('camera', () => {
  it('returns expected camera target x for each gameplay phase', () => {
    const idleState: GameState = { ...baseState, phase: { tag: 'idle' } };
    const runupState: GameState = {
      ...baseState,
      phase: {
        tag: 'runup',
        speedNorm: 0.4,
        startedAtMs: 1000,
        tapCount: 3,
        runupDistanceM: 10.2,
        tap: { lastTapAtMs: 1180, lastTapGainNorm: 0.8 },
        athletePose: { animTag: 'run', animT: 0.2 }
      }
    };
    const chargeState: GameState = {
      ...baseState,
      phase: {
        tag: 'chargeAim',
        speedNorm: 0.55,
        runupDistanceM: 12.1,
        startedAtMs: 1000,
        runEntryAnimT: 0.4,
        angleDeg: 35,
        chargeStartedAtMs: 1500,
        chargeMeter: {
          phase01: 0.6,
          perfectWindow: { start: 0.78, end: 0.98 },
          goodWindow: { start: 0.56, end: 0.98 },
          lastQuality: 'good',
          lastSampleAtMs: 2200
        },
        forceNormPreview: 0.7,
        athletePose: { animTag: 'aim', animT: 0.3 }
      }
    };
    const throwState: GameState = {
      ...baseState,
      phase: {
        tag: 'throwAnim',
        speedNorm: 0.68,
        athleteXM: 16.4,
        angleDeg: 33,
        forceNorm: 0.76,
        releaseQuality: 'perfect',
        lineCrossedAtRelease: false,
        releaseFlashAtMs: 2100,
        animProgress: 0.4,
        released: false,
        athletePose: { animTag: 'throw', animT: 0.4 }
      }
    };
    const flightState: GameState = {
      ...baseState,
      phase: {
        tag: 'flight',
        athleteXM: 18,
        javelin: {
          xM: 20.4,
          yM: 4.8,
          zM: 0,
          vxMs: 18,
          vyMs: 3,
          vzMs: 0.2,
          angleRad: 0.2,
          angularVelRad: 0.3,
          releasedAtMs: 2100,
          lengthM: 2.6
        },
        launchedFrom: {
          speedNorm: 0.68,
          angleDeg: 33,
          forceNorm: 0.76,
          windMs: 0.2,
          launchSpeedMs: 27,
          athleteXM: 18,
          releaseQuality: 'good',
          lineCrossedAtRelease: false
        },
        athletePose: { animTag: 'followThrough', animT: 0.2 }
      }
    };
    const resultState: GameState = {
      ...baseState,
      phase: {
        tag: 'result',
        athleteXM: 19.2,
        launchedFrom: {
          speedNorm: 0.68,
          angleDeg: 33,
          forceNor

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 7255).
> meta: lines=248 chars=7255 truncated=yes


## src/features/javelin/game/chargeMeter.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  applyForceQualityBonus,
  computeForcePreview,
  getTimingQuality
} from './chargeMeter';

describe('charge meter helpers', () => {
  it('fills force steadily toward end of charge', () => {
    expect(computeForcePreview(0.85)).toBeGreaterThan(computeForcePreview(0.25));
    expect(computeForcePreview(1.1)).toBeCloseTo(1, 5);
  });

  it('detects perfect and good windows', () => {
    const perfect = { start: 0.45, end: 0.55 };
    const good = { start: 0.35, end: 0.65 };
    expect(getTimingQuality(0.5, perfect, good)).toBe('perfect');
    expect(getTimingQuality(0.6, perfect, good)).toBe('good');
    expect(getTimingQuality(0.8, perfect, good)).toBe('miss');
  });

  it('releases near hotspot produce stronger force', () => {
    const previewNear = computeForcePreview(0.5);
    const previewFar = computeForcePreview(0.15);
    const near = applyForceQualityBonus(previewNear, 'perfect');
    const far = applyForceQualityBonus(previewFar, 'miss');
    expect(near).toBeGreaterThan(far);
  });
});

```
> meta: lines=30 chars=1069 truncated=no


## src/features/javelin/game/controls.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { ANGLE_MAX_DEG, ANGLE_MIN_DEG } from './constants';
import {
  keyboardAngleHoldDelta,
  pointerFromAnchorToAngleDeg,
  smoothPointerAngleDeg
} from './controls';

describe('pointerFromAnchorToAngleDeg', () => {
  it('maps points above/below anchor to expected vertical angles', () => {
    const top = pointerFromAnchorToAngleDeg(300, 100, 300, 300);
    const middle = pointerFromAnchorToAngleDeg(500, 300, 300, 300);
    const bottom = pointerFromAnchorToAngleDeg(300, 500, 300, 300);

    expect(top).toBe(ANGLE_MAX_DEG);
    expect(middle).toBe(ANGLE_MIN_DEG);
    expect(bottom).toBe(ANGLE_MIN_DEG);
  });

  it('responds strongly when pointer is close to anchor horizontally', () => {
    const nearAnchor = pointerFromAnchorToAngleDeg(302, 250, 300, 300);
    const farAnchor = pointerFromAnchorToAngleDeg(520, 250, 300, 300);

    expect(nearAnchor).toBeGreaterThan(farAnchor);
    expect(nearAnchor).toBeCloseTo(ANGLE_MAX_DEG, 4);
  });

  it('returns NaN inside pointer deadzone', () => {
    const deadzoneAngle = pointerFromAnchorToAngleDeg(307, 295, 300, 300);
    expect(Number.isNaN(deadzoneAngle)).toBe(true);
  });
});

describe('keyboardAngleHoldDelta', () => {
  it('accelerates hold delta from start to ramp maximum', () => {
    const start = keyboardAngleHoldDelta('up', 0, 16);
    const mid = keyboardAngleHoldDelta('up', 300, 16);
    const max = keyboardAngleHoldDelta('up', 600, 16);

    expect(start).toBeGreaterThan(0);
    expect(mid).toBeGreaterThan(start);
    expect(max).toBeGreaterThan(mid);
  });

  it('applies direction sign and handles non-positive dt', () => {
    const down = keyboardAngleHoldDelta('down', 600, 16);
    const noDt = keyboardAngleHoldDelta('up', 600, 0);

    expect(down).toBeLessThan(0);
    expect(noDt).toBe(0);
  });
});

describe('smoothPointerAngleDeg', () => {
  it('returns raw angle on first pointer sample', () => {
    expect(smoothPointerAngleDeg(null, 50)).toBe(50);
  });

  it('blends toward raw angle using smoothing factor', () => {
    const smoothed = smoothPointerAngleDeg(20, 40, 0.4);
    expect(smoothed).toBeCloseTo(28, 5);
  });

  it('clamps smoothing factor bounds', () => {
    expect(smoothPointerAngleDeg(20, 40, 0)).toBe(20);
    expect(smoothPointerAngleDeg(20, 40, 1.2)).toBe(40);
  });
});

```
> meta: lines=69 chars=2341 truncated=no


## src/features/javelin/game/physics.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  RUNUP_SPEED_MAX_MS,
  RUNUP_SPEED_MIN_MS
} from './constants';
import {
  computeLaunchSpeedMs,
  createPhysicalJavelin,
// ... 3 more import lines from ., vitest

const simulateDistanceFromLine = (
  speedNorm: number,
  forceNorm: number,
  angleDeg: number,
  windMs: number,
  athleteXM: number,
  windZMs = 0
): { distanceM: number; tipFirst: boolean; inSector: boolean; landingZM: number } => {
  const athleteForwardMs =
    (RUNUP_SPEED_MIN_MS + (RUNUP_SPEED_MAX_MS - RUNUP_SPEED_MIN_MS) * speedNorm) * 0.34;
  let javelin = createPhysicalJavelin({
    xM: athleteXM + 0.42,
    yM: 1.6,
    zM: 0,
    launchAngleRad: (angleDeg * Math.PI) / 180,
    launchSpeedMs: computeLaunchSpeedMs(speedNorm, forceNorm),
    athleteForwardMs,
    lateralVelMs: 0.12,
    releasedAtMs: 0
  });

  for (let i = 0; i < 1800; i += 1) {
    const step = updatePhysicalJavelin(javelin, 16, windMs, windZMs);
    javelin = step.javelin;
    if (step.landed) {
      const landingTipXM = step.landingTipXM ?? javelin.xM;
      const landingTipZM = step.landingTipZM ?? javelin.zM;
      const legality = evaluateThrowLegality({
        lineCrossedAtRelease: athleteXM >= 18.2,
        landingTipXM,
        landingTipZM,
        tipFirst: step.tipFirst === true
      });
      return {
        distanceM: computeCompetitionDistanceM(landingTipXM, 18.2),
        tipFirst: step.tipFirst === true,
        inSector: legality.resultKind !== 'foul_sector',
        landingZM: landingTipZM
      };
    }
  }

  return {
    distanceM: 0,
    tipFirst: false,
    inSector: false,
    landingZM: 0
  };
};

describe('physical javelin simulation', () => {
  it('eventually lands on the ground', () => {
    let javelin = createPhysicalJavelin({
      xM: 3,
      yM: 1.6,
      zM: 0,
      launchAngleRad: (34 * Math.PI) / 180,
      launchSpeedMs: 26,
      athleteForwardMs: 2,
      lateralVelMs: 0,
      releasedAtMs: 0
    });
    let landed = false;
    for (let i = 0; i < 600; i += 1) {
      const step = updatePhysicalJavelin(javelin, 16, 0);
      javelin = step.javelin;
      landed = step.landed;
      if (landed) {
        break;
      }
    }
    expect(landed).toBe(true);
  });

  it('reaches apex then descends', () => {
    let javelin = createPhysicalJavelin({
      xM: 2.8,
      yM: 1.7,
      zM: 0,
      launchAngleRad: (38 * Math.PI) / 180,
      launchSpeedMs: 24,
      athleteForwardMs: 2,
      lateralVelMs: 0,
      releasedAtMs: 0
    });
    const heights: number[] = [];
    for (let i = 0; i < 120; i += 1) {
      const step = updatePhysicalJavelin(javelin, 16, 0.2);
      javelin = step.javelin;
      heights.push(javelin.yM);
      if (step.landed) {
        break;
      }
    }
    const maxHeight = Math.max(...heights);
    const maxIndex = heights.findIndex((value) => value === maxHeight);
    expect(maxIndex).toBeGreaterThan(3);
    expect(heights[heights.length - 1]).toBeLessThan(maxHeight);
  });

  

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 6430).
> meta: lines=215 chars=6348 truncated=yes


## src/features/javelin/game/reducer.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  RUNUP_MAX_TAPS,
  RUNUP_MAX_X_M,
  THROW_LINE_X_M
} from './constants';
import { gameReducer } from './reducer';
import {
// ... 4 more import lines from ., vitest

const {
  chargeFillDurationMs: CHARGE_FILL_DURATION_MS,
  chargeMaxCycles: CHARGE_MAX_CYCLES,
  throwAnimDurationMs: THROW_ANIM_DURATION_MS
} = GAMEPLAY_TUNING.throwPhase;
const {
  runupStartXM: RUNUP_START_X_M
} = GAMEPLAY_TUNING.movement;
const {
  tapSoftCapIntervalMs: RUNUP_TAP_SOFT_CAP_INTERVAL_MS
} = GAMEPLAY_TUNING.speedUp;

const tapRunupNTimes = (
  state: ReturnType<typeof createInitialGameState>,
  firstTapAtMs: number,
  count: number,
  intervalMs: number
) => {
  let nextState = state;
  for (let index = 0; index < count; index += 1) {
    nextState = gameReducer(nextState, {
      type: 'rhythmTap',
      atMs: firstTapAtMs + index * intervalMs
    });
  }
  return nextState;
};

const tickForDuration = (
  state: ReturnType<typeof createInitialGameState>,
  startAtMs: number,
  durationMs: number,
  stepMs = 16
) => {
  let nextState = state;
  let elapsedMs = 0;
  while (elapsedMs < durationMs) {
    const dtMs = Math.min(stepMs, durationMs - elapsedMs);
    elapsedMs += dtMs;
    nextState = gameReducer(nextState, {
      type: 'tick',
      dtMs,
      nowMs: startAtMs + elapsedMs
    });
  }
  return nextState;
};

describe('gameReducer', () => {
  it('starts a round into runup', () => {
    const state = createInitialGameState();
    const next = gameReducer(state, {
      type: 'startRound',
      atMs: 1000,
      windMs: 1.2,
      windZMs: -0.4
    });
    expect(next.phase.tag).toBe('runup');
    expect(next.windMs).toBe(1.2);
    expect(next.windZMs).toBe(-0.4);
  });

  it('updates wind during idle ticks', () => {
    const state = {
      ...createInitialGameState(),
      nowMs: 0,
      windMs: 0,
      windZMs: 0,
      phase: { tag: 'idle' as const }
    };
    const next = gameReducer(state, { type: 'tick', dtMs: 1200, nowMs: 1200 });
    expect(next.phase.tag).toBe('idle');
    expect(next.windMs).toBe(advanceWindMs(state.windMs, 1200, 1200));
    expect(next.windZMs).toBe(advanceCrosswindMs(state.windZMs, 1200, 1200));
  });

  it('stays still before first tap and starts moving after tap input', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'tick', dtMs: 2000, nowMs: 3000 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.speedNorm).toBe(0);
      expect(state.phase.runupDistanceM).toBe(RUNUP_START_X_M);
      expect(state.phase.athletePose.animTag).toBe('idle');
      expect(state.phase.athletePose.animT).toBe(0);
    }

    state = gameReducer(state, { type: 'rhythmTap', atMs: 3200 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.speedNorm).toBeGrea

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 18529).
> meta: lines=474 chars=18423 truncated=yes


## src/features/javelin/game/render.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { computeAthletePoseGeometry } from './athletePose';
import {
  createRenderSession,
  getCameraTargetX,
  getHeadMeterScreenAnchor,
  getPlayerAngleAnchorScreen,
  getVisibleJavelinRenderState
// ... 3 more import lines from ., vitest

const { runupStartXM: RUNUP_START_X_M } = GAMEPLAY_TUNING.movement;

const baseState: Pick<GameState, 'nowMs' | 'roundId' | 'windMs' | 'windZMs' | 'aimAngleDeg'> = {
  nowMs: 2000,
  roundId: 1,
  windMs: 0.2,
  windZMs: 0.05,
  aimAngleDeg: 18
};

describe('javelin visibility state', () => {
  it('creates isolated render sessions', () => {
    const sessionA = createRenderSession();
    const sessionB = createRenderSession();

    sessionA.resultMarker.lastRoundId = 9;
    sessionA.camera.targetX = 18;
    sessionA.lastPhaseTag = 'result';

    expect(sessionB.resultMarker.lastRoundId).toBe(-1);
    expect(sessionB.camera.targetX).toBe(RUNUP_START_X_M);
    expect(sessionB.lastPhaseTag).toBe('idle');
  });

  it('is attached during runup and charge', () => {
    const runupState: GameState = {
      ...baseState,
      phase: {
        tag: 'runup',
        speedNorm: 0.6,
        startedAtMs: 1000,
        tapCount: 4,
        runupDistanceM: 10,
        tap: {
          lastTapAtMs: 1880,
          lastTapGainNorm: 0.85
        },
        athletePose: { animTag: 'run', animT: 0.4 }
      }
    };

    const chargeState: GameState = {
      ...baseState,
      phase: {
        tag: 'chargeAim',
        speedNorm: 0.72,
        runupDistanceM: 17.4,
        startedAtMs: 1200,
        runEntryAnimT: 0.78,
        angleDeg: 35,
        chargeStartedAtMs: 1800,
        chargeMeter: {
          phase01: 0.5,
          perfectWindow: { start: 0.47, end: 0.53 },
          goodWindow: { start: 0.4, end: 0.6 },
          lastQuality: 'perfect',
          lastSampleAtMs: 2000
        },
        forceNormPreview: 0.92,
        athletePose: { animTag: 'aim', animT: 0.2 }
      }
    };

    if (runupState.phase.tag !== 'runup') {
      throw new Error('Expected runup phase in test setup');
    }
    if (chargeState.phase.tag !== 'chargeAim') {
      throw new Error('Expected chargeAim phase in test setup');
    }

    const runPose = computeAthletePoseGeometry(
      runupState.phase.athletePose,
      runupState.phase.speedNorm,
      22,
      runupState.phase.runupDistanceM
    );
    const chargePose = computeAthletePoseGeometry(
      chargeState.phase.athletePose,
      chargeState.phase.speedNorm,
      chargeState.phase.angleDeg,
      chargeState.phase.runupDistanceM
    );

    expect(getVisibleJavelinRenderState(runupState, runPose).mode).toBe('attached');
    expect(getVisibleJavelinRenderState(chargeState, chargePose).mode).toBe('attached');
  });

  it('keeps javelin attached in idle pose', () => {
    const idleState: GameState = {
      ...baseState,
      phase: {
        tag: 'idle'
      }
    };

    const idlePose = computeAthletePoseGeometry(
      

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 9663).
> meta: lines=358 chars=9600 truncated=yes


## src/features/javelin/game/renderTheme.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { getRenderPalette } from './renderTheme';

describe('render theme palettes', () => {
  it('provides required scene and meter palette keys for both themes', () => {
    const light = getRenderPalette('light');
    const dark = getRenderPalette('dark');

    expect(light.scene.skyTop).toBeTruthy();
    expect(light.scene.fieldGrass).toBeTruthy();
    expect(light.scene.throwLineStroke).toBeTruthy();
    expect(light.meter.trackArc).toBeTruthy();
    expect(light.wind.mastStroke).toBeTruthy();

    expect(dark.scene.skyTop).toBeTruthy();
    expect(dark.scene.fieldGrass).toBeTruthy();
    expect(dark.scene.throwLineStroke).toBeTruthy();
    expect(dark.meter.trackArc).toBeTruthy();
    expect(dark.wind.mastStroke).toBeTruthy();
  });

  it('uses distinct light and dark colors for core scene readability', () => {
    const light = getRenderPalette('light');
    const dark = getRenderPalette('dark');

    expect(dark.scene.skyTop).not.toBe(light.scene.skyTop);
    expect(dark.scene.fieldGrass).not.toBe(light.scene.fieldGrass);
    expect(dark.scene.distanceLabelFill).not.toBe(light.scene.distanceLabelFill);
    expect(dark.meter.valueTextFill).not.toBe(light.meter.valueTextFill);
    expect(dark.wind.labelFill).not.toBe(light.wind.labelFill);
  });
});

```
> meta: lines=33 chars=1323 truncated=no


## src/features/javelin/game/renderWind.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { buildFlagPolyline, getWindIndicatorLayout } from './renderWind';

describe('wind indicator layout and flag geometry', () => {
  it('anchors wind mast in top-right on mobile widths', () => {
    const layout = getWindIndicatorLayout(320, 1.2);
    expect(layout.isMobile).toBe(true);
    expect(layout.mastX).toBeGreaterThan(280);
    expect(layout.mastX).toBeLessThan(320);
    expect(layout.mastTopY).toBeLessThan(24);
  });

  it('keeps desktop anchor consistently near right edge', () => {
    const desktopA = getWindIndicatorLayout(1024, 1);
    const desktopB = getWindIndicatorLayout(1366, 1);
    expect(desktopA.isMobile).toBe(false);
    expect(desktopB.isMobile).toBe(false);
    expect(1024 - desktopA.mastX).toBeGreaterThanOrEqual(20);
    expect(1024 - desktopA.mastX).toBeLessThanOrEqual(32);
    expect(1366 - desktopB.mastX).toBeGreaterThanOrEqual(20);
    expect(1366 - desktopB.mastX).toBeLessThanOrEqual(32);
  });

  it('builds finite segmented cloth points and follows wind direction', () => {
    const positive = buildFlagPolyline({
      mastX: 250,
      flagAnchorY: 34,
      windMs: 2.1,
      nowMs: 1200,
      uiScale: 1
    });
    const negative = buildFlagPolyline({
      mastX: 250,
      flagAnchorY: 34,
      windMs: -2.1,
      nowMs: 1200,
      uiScale: 1
    });

    expect(positive.length).toBe(7);
    expect(negative.length).toBe(7);
    for (const point of [...positive, ...negative]) {
      expect(Number.isFinite(point.x)).toBe(true);
      expect(Number.isFinite(point.y)).toBe(true);
    }

    const positiveTip = positive[positive.length - 1];
    const negativeTip = negative[negative.length - 1];
    expect(positiveTip.x).toBeGreaterThan(250);
    expect(negativeTip.x).toBeLessThan(250);
  });

  it('hangs near mast when wind is calm and extends with stronger wind', () => {
    const calm = buildFlagPolyline({
      mastX: 250,
      flagAnchorY: 34,
      windMs: 0,
      nowMs: 1200,
      uiScale: 1
    });
    const strong = buildFlagPolyline({
      mastX: 250,
      flagAnchorY: 34,
      windMs: 2.2,
      nowMs: 1200,
      uiScale: 1
    });

    const calmTip = calm[calm.length - 1];
    const strongTip = strong[strong.length - 1];
    expect(Math.abs(calmTip.x - 250)).toBeLessThanOrEqual(2.5);
    expect(calmTip.y).toBeGreaterThan(34);
    expect(strongTip.x - 250).toBeGreaterThan(12);
  });
});

```
> meta: lines=76 chars=2435 truncated=no


## src/features/javelin/game/scoring.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  angleEfficiency,
  COMPETITION_RULES,
  computeCompetitionDistanceM,
  computeThrowDistance,
  evaluateThrowLegality,
  isLandingInSector,
// ... 3 more import lines from ., vitest

describe('scoring helpers', () => {
  it('peaks around 36 degree angle', () => {
    expect(angleEfficiency(36)).toBeGreaterThan(angleEfficiency(26));
    expect(angleEfficiency(36)).toBeGreaterThan(angleEfficiency(46));
  });

  it('reward release timing close to 0.77', () => {
    expect(releaseEfficiency(0.77)).toBeGreaterThan(releaseEfficiency(0.45));
    expect(releaseEfficiency(0.77)).toBeGreaterThan(releaseEfficiency(0.95));
  });

  it('wind efficiency stays clamped', () => {
    expect(windEfficiency(-10)).toBe(0.88);
    expect(windEfficiency(10)).toBe(1.12);
  });

  it('produces believable throw ranges', () => {
    const weakThrow = computeThrowDistance({
      speedNorm: 0.35,
      angleDeg: 28,
      releaseTiming: 0.4,
      windMs: -2
    });
    const strongThrow = computeThrowDistance({
      speedNorm: 0.92,
      angleDeg: 36,
      releaseTiming: 0.77,
      windMs: 1.4
    });
    expect(weakThrow).toBeGreaterThanOrEqual(12);
    expect(strongThrow).toBeLessThanOrEqual(110);
    expect(strongThrow).toBeGreaterThan(weakThrow);
  });

  it('measures distance from throw line baseline', () => {
    expect(computeCompetitionDistanceM(50, 18.2)).toBe(31.8);
    expect(computeCompetitionDistanceM(16, 18.2)).toBe(0);
  });

  it('checks sector legality with lateral offset', () => {
    expect(isLandingInSector(60, 4.2, 18.2)).toBe(true);
    expect(isLandingInSector(60, 20, 18.2)).toBe(false);
  });

  it('returns foul reasons based on rule order', () => {
    expect(
      evaluateThrowLegality({
        lineCrossedAtRelease: true,
        landingTipXM: 80,
        landingTipZM: 0,
        tipFirst: true
      }).resultKind
    ).toBe('foul_line');

    expect(
      evaluateThrowLegality({
        lineCrossedAtRelease: false,
        landingTipXM: 60,
        landingTipZM: 30,
        tipFirst: true
      }).resultKind
    ).toBe('foul_sector');

    expect(
      evaluateThrowLegality({
        lineCrossedAtRelease: false,
        landingTipXM: 60,
        landingTipZM: 0,
        tipFirst: false
      }).resultKind
    ).toBe('foul_tip_first');
  });

  it('allows line cross when foulOnLineCross is false', () => {
    const result = evaluateThrowLegality({
      lineCrossedAtRelease: true,
      landingTipXM: 80,
      landingTipZM: 0,
      tipFirst: true,
      rules: { ...COMPETITION_RULES, foulOnLineCross: false }
    });

    expect(result.valid).toBe(true);
    expect(result.resultKind).toBe('valid');
  });

  it('allows flat landing when requireTipFirst is false', () => {
    const result = evaluateThrowLegality({
      lineCrossedAtRelease: false,
      landingTipXM: 70,
      landingTipZM: 0,
      tipFirst: false,
      rules: { ...COMPETITION_RULES, requireTipFirst: false }
    })

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 3111).
> meta: lines=110 chars=3095 truncated=yes


## src/features/javelin/game/selectors.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { getRunupMeterPhase01, getSpeedPercent } from './selectors';
import type { GameState } from './types';

const makeRunupState = (speedNorm: number): GameState => ({
  nowMs: 2000,
  roundId: 1,
  windMs: 0,
  windZMs: 0,
  aimAngleDeg: 36,
  phase: {
    tag: 'runup',
    speedNorm,
    startedAtMs: 1000,
    tapCount: 1,
    runupDistanceM: 0,
    tap: {
      lastTapAtMs: 1200,
      lastTapGainNorm: 0.8
    },
    athletePose: {
      animTag: 'run',
      animT: 0
    }
  }
});

describe('runup meter phase', () => {
  it('maps directly to runup speed', () => {
    const phase = getRunupMeterPhase01(makeRunupState(0.3));
    expect(phase).not.toBeNull();
    expect(phase).toBeCloseTo(0.3, 3);
  });
});

describe('result throw specs', () => {
  it('keeps throw speed percent in result phase', () => {
    const state: GameState = {
      nowMs: 3200,
      roundId: 2,
      windMs: 0.4,
      windZMs: 0.1,
      aimAngleDeg: 12,
      phase: {
        tag: 'result',
        athleteXM: 18.6,
        launchedFrom: {
          speedNorm: 0.83,
          angleDeg: 41,
          forceNorm: 0.77,
          windMs: 0.4,
          launchSpeedMs: 30.5,
          athleteXM: 18.2,
          releaseQuality: 'perfect',
          lineCrossedAtRelease: false
        },
        distanceM: 65.2,
        isHighscore: false,
        resultKind: 'valid',
        tipFirst: true,
        landingTipXM: 84.6,
        landingXM: 83.4,
        landingYM: 0,
        landingAngleRad: -0.3
      }
    };

    expect(getSpeedPercent(state)).toBe(83);
  });
});

```
> meta: lines=71 chars=1611 truncated=no


## src/features/javelin/game/trajectory.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { computeTrajectoryPreview } from './trajectory';

describe('computeTrajectoryPreview', () => {
  it('generates points with strictly increasing x', () => {
    const preview = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.5,
      angleDeg: 36,
      speedNorm: 0.7,
      forceNorm: 0.7,
      numPoints: 12,
      timeStepS: 0.12
    });

    expect(preview.points.length).toBeGreaterThan(1);
    for (let index = 1; index < preview.points.length; index += 1) {
      expect(preview.points[index].xM).toBeGreaterThan(preview.points[index - 1].xM);
    }
  });

  it('stops before emitting points below ground', () => {
    const maxPoints = 40;
    const preview = computeTrajectoryPreview({
      originXM: 2,
      originYM: 0.2,
      angleDeg: 15,
      speedNorm: 0,
      forceNorm: 0,
      numPoints: maxPoints,
      timeStepS: 0.1
    });

    expect(preview.points.length).toBeLessThan(maxPoints);
    expect(preview.points.every((point) => point.yM >= 0)).toBe(true);
  });

  it('produces higher first-point altitude for higher release angle', () => {
    const low = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.3,
      angleDeg: 20,
      speedNorm: 0.65,
      forceNorm: 0.8,
      numPoints: 6,
      timeStepS: 0.12
    });
    const high = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.3,
      angleDeg: 50,
      speedNorm: 0.65,
      forceNorm: 0.8,
      numPoints: 6,
      timeStepS: 0.12
    });

    expect(low.points.length).toBeGreaterThan(0);
    expect(high.points.length).toBeGreaterThan(0);
    expect(high.points[0].yM).toBeGreaterThan(low.points[0].yM);
  });

  it('returns a valid preview with zero force', () => {
    const preview = computeTrajectoryPreview({
      originXM: 4,
      originYM: 1.2,
      angleDeg: 36,
      speedNorm: 0,
      forceNorm: 0,
      numPoints: 10,
      timeStepS: 0.1
    });

    expect(preview.points.length).toBeGreaterThan(0);
    for (const point of preview.points) {
      expect(Number.isFinite(point.xM)).toBe(true);
      expect(Number.isFinite(point.yM)).toBe(true);
    }
  });

  it('never returns more points than requested', () => {
    const maxPoints = 7;
    const preview = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.4,
      angleDeg: 40,
      speedNorm: 0.9,
      forceNorm: 0.9,
      numPoints: maxPoints,
      timeStepS: 0.12
    });

    expect(preview.points.length).toBeLessThanOrEqual(maxPoints);
  });

  it('extends preview arc under headwind and shortens under tailwind', () => {
    const neutral = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.4,
      angleDeg: 36,
      speedNorm: 0.8,
      forceNorm: 0.8,
      numPoints: 16,
      timeStepS: 0.12,
      windMs: 0
    });
    const headwind = computeTrajectoryPreview({
      originXM: 0,
      originYM: 1.4,
      angleDeg: 36,
      speedNorm: 0.8,
      forceNorm: 0.8,
      nu

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 3638).
> meta: lines=136 chars=3638 truncated=yes


## src/features/javelin/game/wind.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  CROSSWIND_MAX_MS,
  CROSSWIND_MIN_MS,
  WIND_MAX_MS,
  WIND_MIN_MS
} from './constants';
import {
// ... 6 more import lines from ., vitest

const { cycleDurationMs: WIND_CYCLE_DURATION_MS } = GAMEPLAY_TUNING.wind;

describe('wind model', () => {
  it('keeps target samples within configured wind bounds', () => {
    for (let nowMs = 0; nowMs <= 180000; nowMs += 333) {
      const sampled = sampleWindTargetMs(nowMs);
      expect(sampled).toBeGreaterThanOrEqual(WIND_MIN_MS);
      expect(sampled).toBeLessThanOrEqual(WIND_MAX_MS);
    }
  });

  it('is deterministic for fixed timestamps', () => {
    const timestamps = [0, 40, 320, 1600, 4800, 9450, 23210, 78111];
    const first = timestamps.map((nowMs) => sampleWindTargetMs(nowMs));
    const second = timestamps.map((nowMs) => sampleWindTargetMs(nowMs));
    expect(second).toEqual(first);
  });

  it('keeps crosswind target samples within configured crosswind bounds', () => {
    for (let nowMs = 0; nowMs <= 180000; nowMs += 333) {
      const sampled = sampleCrosswindTargetMs(nowMs);
      expect(sampled).toBeGreaterThanOrEqual(CROSSWIND_MIN_MS);
      expect(sampled).toBeLessThanOrEqual(CROSSWIND_MAX_MS);
      expect(Number.isFinite(sampled)).toBe(true);
    }
  });

  it('is deterministic for fixed timestamps on crosswind channel', () => {
    const timestamps = [0, 40, 320, 1600, 4800, 9450, 23210, 78111];
    const first = timestamps.map((nowMs) => sampleCrosswindTargetMs(nowMs));
    const second = timestamps.map((nowMs) => sampleCrosswindTargetMs(nowMs));
    expect(second).toEqual(first);
  });

  it('advances in smooth finite steps under frame-sized delta time', () => {
    let windMs = 0;
    for (let frame = 1; frame <= 240; frame += 1) {
      const next = advanceWindMs(windMs, 16, frame * 16);
      expect(next).toBeGreaterThanOrEqual(WIND_MIN_MS);
      expect(next).toBeLessThanOrEqual(WIND_MAX_MS);
      expect(Math.abs(next - windMs)).toBeLessThanOrEqual(0.4);
      windMs = next;
    }
  });

  it('changes visible 0.1 m/s display buckets over short playtime', () => {
    let windMs = 0;
    const buckets = new Set<number>();
    for (let frame = 1; frame <= 900; frame += 1) {
      const nowMs = frame * 16;
      windMs = advanceWindMs(windMs, 16, nowMs);
      buckets.add(Math.round(windMs * 10) / 10);
    }
    expect(buckets.size).toBeGreaterThanOrEqual(4);
  });

  it('advances crosswind in smooth finite steps under frame-sized delta time', () => {
    let windZMs = 0;
    for (let frame = 1; frame <= 240; frame += 1) {
      const next = advanceCrosswindMs(windZMs, 16, frame * 16);
      expect(next).toBeGreaterThanOrEqual(CROSSWIND_MIN_MS);
      expect(next).toBeLessThanOrEqual(CROSSWIND_MAX_MS);
      expect(Math.abs(next - windZMs)).toBeLessThanOrEqual(0.2);
      windZMs = next;
    }
  });

  it('keeps short-window trend readable for throw timing', () => {
    const startMs = 20000;
    const samples: number[] 

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 4569).
> meta: lines=123 chars=4463 truncated=yes


## src/features/javelin/hooks/useLocalHighscores.test.ts
_Reusable hook / shared state or side-effect logic._

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HIGHSCORE_STORAGE_KEY } from '../game/constants';
import {
  insertHighscoreSorted,
  loadHighscores,
  pruneHighscores,
  saveHighscores
} from './useLocalHighscores';
// ... 1 more import lines from ., .., vitest

type StorageMock = {
  getItem: ReturnType<typeof vi.fn<(key: string) => string | null>>;
  setItem: ReturnType<typeof vi.fn<(key: string, value: string) => void>>;
  clear: ReturnType<typeof vi.fn<() => void>>;
};

let storage: StorageMock;

const makeEntry = (
  name: string,
  distanceM: number,
  playedAtIso: string,
  extra: Partial<HighscoreEntry> = {}
): HighscoreEntry => ({
  id: `${name}-${distanceM}`,
  name,
  distanceM,
  playedAtIso,
  locale: 'fi',
  windMs: 0,
  ...extra
});

beforeEach(() => {
  const store = new Map<string, string>();
  storage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    clear: vi.fn(() => {
      store.clear();
    })
  };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage
  });
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('highscore helpers', () => {
  it('inserts entries sorted by distance desc', () => {
    const list = [
      makeEntry('A', 72.1, '2026-02-21T09:00:00.000Z'),
      makeEntry('B', 66.3, '2026-02-21T09:01:00.000Z')
    ];
    const next = insertHighscoreSorted(list, makeEntry('C', 78.5, '2026-02-21T09:02:00.000Z'));
    expect(next.map((entry) => entry.name)).toEqual(['C', 'A', 'B']);
  });

  it('breaks ties with earliest timestamp first', () => {
    const list = [makeEntry('A', 70, '2026-02-21T10:00:00.000Z')];
    const next = insertHighscoreSorted(list, makeEntry('B', 70, '2026-02-21T09:00:00.000Z'));
    expect(next[0].name).toBe('B');
  });

  it('prunes to max size', () => {
    const list = Array.from({ length: 15 }, (_, index) =>
      makeEntry(`${index}`, 95 - index, `2026-02-21T09:${String(index).padStart(2, '0')}:00.000Z`)
    );
    expect(pruneHighscores(list, 10)).toHaveLength(10);
  });

  it('returns empty when storage getter throws', () => {
    storage.getItem.mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(loadHighscores()).toEqual([]);
  });

  it('ignores malformed and invalid stored entries while preserving optional throw specs', () => {
    const valid = makeEntry('VALID', 75.2, '2026-02-21T09:10:00.000Z', {
      windMs: -0.8,
      launchSpeedMs: 31.4,
      angleDeg: 36
    });
    localStorage.setItem(
      HIGHSCORE_STORAGE_KEY,
      JSON.stringify([
        valid,
        { ...valid, distanceM: Number.NaN },
        { ...valid, playedAtIso: 'not-a-date' },
        { ...valid, locale: 'xx' },
        { ...valid, windMs: Number.POSITIVE_INFINITY },
        { ...valid, launchSpeedMs: Number.POSITIVE_INFINITY },
        { ...valid, angleDeg:

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 3335).
> meta: lines=117 chars=3328 truncated=yes


## src/features/javelin/hooks/usePointerControls.test.ts
_Reusable hook / shared state or side-effect logic._

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameState } from '../game/types';
import {
  createTouchLongPressHandlers,
  isInteractiveEventTarget,
  shouldConsumeActionKeyDown,
  shouldHandleAngleAdjustKeyDown,
  shouldReleaseChargeFromEnterKeyUp
// ... 1 more import lines from ., .., vitest

const inputTarget = (): EventTarget => ({
  tagName: 'INPUT',
  isContentEditable: false,
  closest: () => null
}) as unknown as EventTarget;

const selectTarget = (): EventTarget => ({
  tagName: 'SELECT',
  isContentEditable: false,
  closest: () => null
}) as unknown as EventTarget;

const plainTarget = (): EventTarget => ({
  tagName: 'DIV',
  isContentEditable: false,
  closest: () => null
}) as unknown as EventTarget;

const contentEditableTarget = (): EventTarget => ({
  tagName: 'DIV',
  isContentEditable: true,
  closest: () => null
}) as unknown as EventTarget;

const dispatchSpy = () => vi.fn<(action: GameAction) => void>();

afterEach(() => {
  vi.useRealTimers();
});

describe('usePointerControls key guards', () => {
  it('treats form controls as interactive targets', () => {
    expect(isInteractiveEventTarget(inputTarget())).toBe(true);
    expect(isInteractiveEventTarget(selectTarget())).toBe(true);
    expect(isInteractiveEventTarget(contentEditableTarget())).toBe(true);
    expect(isInteractiveEventTarget(plainTarget())).toBe(false);
  });

  it('does not handle Enter release from interactive targets', () => {
    expect(shouldReleaseChargeFromEnterKeyUp('Enter', 'chargeAim', inputTarget())).toBe(false);
  });

  it('releases charge on Enter keyup during chargeAim for gameplay target', () => {
    expect(shouldReleaseChargeFromEnterKeyUp('Enter', 'chargeAim', plainTarget())).toBe(true);
  });

  it('does not release charge outside chargeAim phase', () => {
    expect(shouldReleaseChargeFromEnterKeyUp('Enter', 'runup', plainTarget())).toBe(false);
    expect(shouldReleaseChargeFromEnterKeyUp('Enter', 'idle', plainTarget())).toBe(false);
  });

  it('does not adjust angle from arrow keys inside interactive controls', () => {
    expect(shouldHandleAngleAdjustKeyDown('ArrowUp', 'runup', inputTarget())).toBe(false);
    expect(shouldHandleAngleAdjustKeyDown('ArrowDown', 'chargeAim', selectTarget())).toBe(false);
  });

  it('consumes Space and Enter only during active phases', () => {
    expect(shouldConsumeActionKeyDown('Space', 'runup', plainTarget(), false)).toBe(true);
    expect(shouldConsumeActionKeyDown('Enter', 'chargeAim', plainTarget(), false)).toBe(true);
    expect(shouldConsumeActionKeyDown('Space', 'idle', plainTarget(), false)).toBe(false);
    expect(shouldConsumeActionKeyDown('Enter', 'result', plainTarget(), false)).toBe(false);
    expect(shouldConsumeActionKeyDown('Space', 'runup', inputTarget(), false)).toBe(false);
    expect(shouldConsumeActionKeyDown('Enter', 'runup', plainTarget(), true)).toBe(false);
  });
});

describe('usePointerControls touch long press', () => {
  it('st

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 4779).
> meta: lines=136 chars=4804 truncated=yes


## src/i18n/init.test.ts

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getBrowserLocale, persistLocale, readStoredLocale, resolveLocale } from './init';

const installStorageMock = (options: {
  getItem?: (key: string) => string | null;
  setItem?: (key: string, value: string) => void;
} = {}): void => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: options.getItem ?? (() => null),
      setItem: options.setItem ?? (() => undefined)
    }
  });
};

const installNavigatorMock = (value: unknown): void => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value
  });
};

afterEach(() => {
  vi.restoreAllMocks();
  delete (globalThis as { navigator?: unknown }).navigator;
});

describe('i18n locale guards', () => {
  it('prefers stored locale when present', () => {
    expect(resolveLocale('fi', 'en-us')).toBe('fi');
    expect(resolveLocale('sv', 'fi-fi')).toBe('sv');
  });

  it('falls back to browser locale when storage is empty', () => {
    expect(resolveLocale(null, 'fi-fi')).toBe('fi');
    expect(resolveLocale(null, 'sv-se')).toBe('sv');
    expect(resolveLocale(null, 'en-us')).toBe('en');
  });

  it('returns null when reading storage throws', () => {
    installStorageMock({
      getItem: () => {
        throw new Error('blocked');
      }
    });

    expect(readStoredLocale()).toBeNull();
  });

  it('swallows storage write failures when persisting locale', () => {
    installStorageMock({
      setItem: () => {
        throw new Error('quota');
      }
    });

    expect(() => persistLocale('en')).not.toThrow();
  });

  it('returns empty browser locale when navigator is missing or invalid', () => {
    installNavigatorMock(undefined);
    expect(getBrowserLocale()).toBe('');

    installNavigatorMock({});
    expect(getBrowserLocale()).toBe('');
  });

  it('returns lowercased browser locale string', () => {
    installNavigatorMock({ language: 'FI-FI' });
    expect(getBrowserLocale()).toBe('fi-fi');
  });
});

```
> meta: lines=74 chars=2047 truncated=no
