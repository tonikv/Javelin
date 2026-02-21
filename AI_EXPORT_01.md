# AI Export
- Generated: 2026-02-21T20:34:38.148747+00:00
- Workspace: Javelin
- Files in this chunk: 54
- Limits: maxTotalChars=600000, maxFileChars=20000
- Approx tokens (this chunk): 48352

## Repo Map (compact)
- .github
  - workflows/…
  - copilot-instructions.md
- agent-guide-gameplay-v2.md
- AGENTS.md
- docs
  - ai-notes.md
- index.html
- package.json
- public
  - locales/…
- README.md
- src
  - app/… (1 files)
  - features/ (36 files)
    - javelin/ (36 files)
      - components/… (6 files)
      - game/… (25 files)
      - hooks/… (4 files)
      - (1 files at this level)
  - i18n/… (2 files)
  - (2 files at this level)
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
- Env vars used: GITHUB_ACTIONS

## Files Omitted / Truncated

**Files filtered out:** 4 total
- By extension filter: 4

## Table of Contents
- src/features/javelin/game/types.ts
- .github/copilot-instructions.md
- .github/workflows/deploy.yml
- agent-guide-gameplay-v2.md
- AGENTS.md
- docs/ai-notes.md
- index.html
- package.json
- public/locales/en/common.json
- public/locales/fi/common.json
- public/locales/sv/common.json
- README.md
- src/app/App.tsx
- src/features/javelin/components/CircularTimingMeter.tsx
- src/features/javelin/components/ControlHelp.tsx
- src/features/javelin/components/GameCanvas.tsx
- src/features/javelin/components/HudPanel.tsx
- src/features/javelin/components/LanguageSwitch.tsx
- src/features/javelin/components/ScoreBoard.tsx
- src/features/javelin/game/athletePose.ts
- src/features/javelin/game/audio.ts
- src/features/javelin/game/camera.ts
- src/features/javelin/game/chargeMeter.ts
- src/features/javelin/game/constants.ts
- src/features/javelin/game/controls.ts
- src/features/javelin/game/math.ts
- src/features/javelin/game/physics.ts
- src/features/javelin/game/reducer.ts
- src/features/javelin/game/render.ts
- src/features/javelin/game/renderAthlete.ts
- src/features/javelin/game/renderMeter.ts
- src/features/javelin/game/scoring.ts
- src/features/javelin/game/selectors.ts
- src/features/javelin/game/tuning.ts
- src/features/javelin/game/update.ts
- src/features/javelin/hooks/useGameLoop.ts
- src/features/javelin/hooks/useLocalHighscores.ts
- src/features/javelin/hooks/usePointerControls.ts
- src/features/javelin/JavelinPage.tsx
- src/i18n/init.tsx
- src/i18n/resources.ts
- src/index.css
- src/main.tsx
- tsconfig.json
- vite.config.ts
- src/features/javelin/game/athletePose.test.ts
- src/features/javelin/game/chargeMeter.test.ts
- src/features/javelin/game/controls.test.ts
- src/features/javelin/game/physics.test.ts
- src/features/javelin/game/reducer.test.ts
- src/features/javelin/game/render.test.ts
- src/features/javelin/game/scoring.test.ts
- src/features/javelin/game/selectors.test.ts
- src/features/javelin/hooks/useLocalHighscores.test.ts

---

### Other code & helpers


## src/features/javelin/game/types.ts
_Defines: Locale, FaultReason, TimingQuality, MeterWindow, RhythmState, ChargeMeterState_

```ts
export type Locale = 'fi' | 'sv' | 'en';

export type FaultReason = 'lateRelease' | 'invalidRelease' | 'lowAngle';

export type TimingQuality = 'perfect' | 'good' | 'miss';

export type MeterWindow = {
  start: number;
  end: number;
};

export type RhythmState = {
  firstTapAtMs: number | null;
  lastTapAtMs: number | null;
  perfectHits: number;
  goodHits: number;
  penaltyUntilMs: number;
  lastQuality: TimingQuality | null;
  lastQualityAtMs: number;
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
      rhythm: RhythmState;
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
      distanceM: number;
      isHighscore: boolean;
      resultKind: ResultKind;
      tipFirst: boolean | null;
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
  aimAngleDeg: number;
  phase: GamePhase;
};

export type GameAction =
  | { type: 'startRound'; atMs: number; windMs: number }
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
};

```
> meta: lines=163 chars=3793 truncated=no priority


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
      # ... 2 more items omitted
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


## agent-guide-gameplay-v2.md

```md
# Agent Guide — Javelin: Gameplay Improvements (v2)

> **Target project**: `selain-games-2026-javelin`
> **Updated**: 2026-02-21 — reflects codebase after refactoring + visual guides were applied
> **Run tests after each change**: `npm run test`
> **Run build after all steps**: `npm run build`

---

## What Changed Since v1

The refactoring and visual guides have been applied. Key structural changes:

- **`math.ts`** exists — shared `clamp`, `clamp01`, `wrap01`, `lerp`, `toRad`, easing functions. No local redefinitions needed.
- **`camera.ts`** extracted from render.ts — exports `createWorldToScreen`, `createWorldToScreenRaw`, `resetSmoothCamera`, `getCameraTargetX`, `getViewWidthM`, etc. Camera is now smoothed with `dtMs`.
- **`renderMeter.ts`** extracted — contains `drawWorldTimingMeter`, `getHeadMeterScreenAnchor`, `getWorldMeterState`.
- **`renderAthlete.ts`** extracted — contains `drawAthlete`, `HeadAnchor`.
- **`constants.ts`** is now structural-only (field dims, camera layout, physics). No tuning re-exports.
- **`tuning.ts`** has convenience aliases (`BEAT_INTERVAL_MS`, `CHARGE_OVERFILL_FAULT_01`, etc.) exported directly.
- **`ChargeMeterState`** — `cycles` field already removed, JSDoc added. Only `phase01`, windows, `lastQuality`, `lastSampleAtMs`.
- **`update.ts`** — tick handlers extracted to standalone functions (`tickFault`, `tickRunup`, `tickChargeAim`, `tickThrowAnim`, `tickFlight`) but still in the same file (~640 lines). Reducer is a thin dispatcher.
- **`chargeAim` phase** — `athleteXM` removed; uses `runupDistanceM` directly.
- **`renderGame`** — now takes `dtMs` parameter for smooth camera. Calls `drawClouds`, draws landed javelins with tip-first/flat distinction, draws landing markers with fade-in.
- **`drawWindVane`** — still in `render.ts`, signature: `(ctx, width, windMs, localeFormatter)`.

---

## Summary

Six gameplay features. All file references updated for current codebase.

| # | Feature | Impact | Primary Files |
|---|---------|--------|---------------|
| 1 | Rhythm beat indicator (visual + audio) | Players can feel the timing instead of guessing | `renderMeter.ts`, new `audio.ts`, `render.ts` |
| 2 | Throw quality flash feedback | Reward / punish is visible at release moment | `render.ts`, `update.ts`, `types.ts` |
| 3 | Cyclic charge meter | Adds skill ceiling to force timing | `update.ts`, `tuning.ts` |
| 4 | Wind strategy indicators | Wind becomes a meaningful gameplay factor | `render.ts`, `HudPanel.tsx`, locales |
| 5 | Attempt counter / best-of-6 | Gives a competitive arc and session structure | `types.ts`, `update.ts`, `JavelinPage.tsx`, locales |
| 6 | Touch / mobile input | Playable on phones (GitHub Pages audience) | `usePointerControls.ts`, `ControlHelp.tsx`, locales |

**Recommended order**: 1 → 2 → 3 → 4 → 5 → 6

Features 1–4 are independent of each other. Feature 5 changes game state structure. Feature 6 is a separate input layer and can be done at any point.

---

## Feature 1 — Rhythm Beat Indicator

### Problem

During runup, the timing meter shows a cursor sweeping around a semicircle with green and blue zones, but there's no pulse or beat that communicates the tempo. Players must visually track the cursor and guess when to click. The `BEAT_INTERVAL_MS` (820 ms) defines a hidden metronome that the player has no way to perceive.

### 1a. Visual beat flash on the meter arc

The meter drawing lives in **`renderMeter.ts`** in the `drawWorldTimingMeter` function. Add a brief glow flash when the cursor crosses the target zone.

**Approach**: Use `getRunupMeterPhase01(state)` (already imported in `renderMeter.ts` from `selectors.ts`). The target phase is `RHYTHM_TARGET_PHASE01 = 0.5` (from `constants.ts`). When the cursor is within ±0.03 of the target, draw a glow ring behind the meter.

Add to `drawWorldTimingMeter` in **`renderMeter.ts`**, after drawing the meter arcs but before the cursor:

```ts
// Beat flash — glow when cursor is near target
if (state.phase.tag === 'runup') {
  const meterPhase = getRunupMeterPhase01(state);
  if (meterPhase !== null) {
    const distToTarget = Math.abs(meterPhase - RHYTHM_TARGET_PHASE01);
    const wrappedDist = Math.min(distToTarget, 1 - distToTarget);
    if (wrappedDist < 0.06) {
      const flashAlpha = (1 - wrappedDist / 0.06) * 0.5;
      ctx.save();
      ctx.globalAlpha = flashAlpha;
      ctx.strokeStyle = '#22c272';
      ctx.lineWidth = WORLD_METER_LINE_WIDTH_PX + 6;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, WORLD_METER_RADIUS_PX, Math.PI, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
    }
  }
}
```

Import `RHYTHM_TARGET_PHASE01` from `./constants` in `renderMeter.ts` (add to existing imports).

### 1b. Audio beat tick

Create **`src/features/javelin/game/audio.ts`**:

```ts
type BeatAudioContext = {
  ctx: AudioContext;
  lastTickAtMs: number;
  minIntervalMs: number;
};

let audioState: BeatAudioContext | null = null;

const ensureAudioContext = (): BeatAudioContext => {
  if (audioState === null) {
    audioState = {
      ctx: new AudioContext(),
      lastTickAtMs: 0,
      minIntervalMs: 200 // debounce
    };
  }
  return audioState;
};

/**
 * Play a short tick sound. Call once per beat.
 * Uses a brief sine wave oscillator — no audio files needed.
 */
export const playBeatTick = (nowMs: number, isInZone: boolean): void => {
  const audio = ensureAudioContext();
  if (nowMs - audio.lastTickAtMs < audio.minIntervalMs) {
    return;
  }
  audio.lastTickAtMs = nowMs;

  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.connect(gain);
  gain.connect(audio.ctx.destination);

  osc.frequency.value = isInZone ? 880 : 440;
  osc.type = 'sine';

  const now = audio.ctx.currentTime;
  gain.gain.setValueAtTime(isInZone ? 0.15 : 0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.start(now);
  osc.stop(now + 0.06);
};

/** Resume audio context (must be called from user gesture). */
export const resumeAudioContext = (): void => {
  if (audioState?.ctx.state === 'suspended') {
    audioState.ctx.resume();
  }
};
```

### 1c. Trigger beat tick in the render loop

In **`render.ts`** → `renderGame`, after `drawWorldTimingMeter(ctx, state, headScreen)`:

```ts
// Beat audio tick
if (state.phase.tag === 'runup') {
  const meterPhase = getRunupMeterPhase01(state);
  if (meterPhase !== null) {
    const distToTarget = Math.abs(meterPhase - RHYTHM_TARGET_PHASE01);
    const wrappedDist = Math.min(distToTarget, 1 - distToTarget);
    if (wrappedDist < 0.02) {
      playBeatTick(state.nowMs, wrappedDist < 0.01);
    }
  }
}
```

Add imports to `render.ts`:
```ts
import { playBeatTick } from './audio';
import { getRunupMeterPhase01 } from './selectors';
import { RHYTHM_TARGET_PHASE01 } from './constants';
```

### 1d. Resume audio on first user interaction

In **`usePointerControls.ts`**, add at the top of any mouse/keyboard handler:

```ts
import { resumeAudioContext } from '../game/audio';

// Inside onMouseDown, first line:
resumeAudioContext();
```

Browsers require a user gesture before `AudioContext` can play sound. This resumes it on first click.

### 1e. Test considerations

- Audio is side-effectful — don't test it in unit tests
- The visual flash is rendering-only — verify manually
- Add a test that `getRunupMeterPhase01` returns values near 0.5 at beat boundaries:

```ts
it('meter phase reaches target at beat boundary', () => {
  const state = makeRunupState({ startedAtMs: 1000, nowMs: 1000 + BEAT_INTERVAL_MS * 3 });
  const phase = getRunupMeterPhase01(state);
  expect(phase).toBeCloseTo(RHYTHM_TARGET_PHASE01, 1);
});
```

---

## Feature 2 — Throw Quality Flash Feedback

### Problem

When the player releases the charge (RMB up), the meter shows which quality zone they hit but only as a static cursor color. There's no celebratory or punishing flash at the critical release moment.

### 2a. Add release feedback state to `types.ts`

Add `releaseFlashAtMs` to the `throwAnim` phase:

```diff
  | {
      tag: 'throwAnim';
      speedNorm: number;
      athleteXM: number;
      angleDeg: number;
      forceNorm: number;
      releaseQuality: TimingQuality;
      animProgress: number;
      released: boolean;
      athletePose: AthletePoseState;
+     releaseFlashAtMs: number;
    }
```

### 2b. Set `releaseFlashAtMs` in `update.ts`

In the `releaseCharge` case of `reduceGameState`, when building the `throwAnim` phase object (around line 4598):

```diff
  phase: {
    tag: 'throwAnim',
    speedNorm: state.phase.speedNorm,
    athleteXM: state.phase.runupDistanceM,
    angleDeg: state.phase.angleDeg,
    forceNorm,
    releaseQuality: quality,
    animProgress: 0,
    released: false,
+   releaseFlashAtMs: action.atMs,
    athletePose: {
      animTag: 'throw',
      animT: 0
    }
  }
```

### 2c. Render the flash in `render.ts`

In `renderGame`, after the meter drawing (`drawWorldTimingMeter`) and before the closing of the function:

```ts
// Release quality flash
if (state.phase.tag === 'throwAnim') {
  const flashAge = state.nowMs - state.phase.releaseFlashAtMs;
  const FLASH_DURATION_MS = 600;
  if (flashAge < FLASH_DURATION_MS) {
    const alpha = 1 - flashAge / FLASH_DURATION_MS;
    const flashColor =
      state.phase.releaseQuality === 'perfect'
        ? `rgba(34, 194, 114, ${alpha * 0.6})`
        : state.phase.releaseQuality === 'good'
          ? `rgba(50, 156, 245, ${alpha * 0.5})`
          : `rgba(246, 210, 85, ${alpha * 0.4})`;

    // Fullscreen flash overlay
    ctx.save();
    ctx.fillStyle = flashColor;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Text label
    const label =
      state.phase.releaseQuality === 'perfect'
        ? 'PERFECT!'
        : state.phase.releaseQuality === 'good'
          ? 'GOOD'
          : 'MISS';
    const textAlpha = Math.min(1, alpha * 1.6);
    const scale = 1 + (1 - alpha) * 0.3;
    ctx.save();
    ctx.globalAlpha = textAlpha;
    ctx.font = `900 ${Math.round(28 * scale)}px ui-sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0b2238';
    ctx.fillText(label, width / 2, 72);
    ctx.restore();
  }
}
```

### 2d. Test

```ts
it('sets release flash timestamp on charge release', () => {
  // Set up chargeAim state, dispatch releaseCharge at atMs: 5000
  // Expect state.phase.tag === 'throwAnim'
  // Expect state.phase.releaseFlashAtMs === 5000
});
```

---

## Feature 3 — Cyclic Charge Meter

### Problem

The charge meter fills linearly from 0 to 1 and faults on overfill. There's only one pass through the perfect window, so the timing skill ceiling is low — a fast release always scores adequately. A cyclic meter would let the player wait for the optimal moment in a repeating pattern, adding tension and skill.

### Current state after refactoring

The `cycles` field was already removed from `ChargeMeterState`. The type is now clean:

```ts
export type ChargeMeterState = {
  phase01: number;
  perfectWindow: MeterWindow;
  goodWindow: MeterWindow;
  lastQuality: TimingQuality | null;
  lastSampleAtMs: number;
};
```

The overfill logic still uses `CHARGE_OVERFILL_FAULT_01 = 1.03` (from `tuning.ts`). The core change is making `phase01` wrap instead of clamp, and replacing the overfill threshold with a cycle count.

### 3a. Change charge fill to cycle in `tickChargeAim` (update.ts)

Currently at line ~4238:

```ts
const elapsedMs = Math.max(0, nowMs - state.phase.chargeStartedAtMs);
const rawFill01 = elapsedMs / CHARGE_FILL_DURATION_MS;
if (rawFill01 >= CHARGE_OVERFILL_FAULT_01) {
  return { ...state, phase: createLateReleaseFaultPhase(state.phase, nowMs) };
}
const phase01 = clamp(rawFill01, 0, 1);
```

Replace with:

```ts
const elapsedMs = Math.max(0, nowMs - state.phase.chargeStartedAtMs);
const rawFill01 = elapsedMs / CHARGE_FILL_DURATION_MS;
const fullCycles = Math.floor(rawFill01);
if (fullCycles >= CHARGE_MAX_CYCLES) {
  return { ...state, phase: createLateReleaseFaultPhase(state.phase, nowMs) };
}
const phase01 = clamp(rawFill01 % 1, 0, 1); // wraps on each cycle
```

### 3b. Update tuning types and values

In `tuning.ts`, replace `chargeOverfillFault01` with `chargeMaxCycles`:

```diff
  type ThrowPhaseTuning = {
    chargeFillDurationMs: number;
-   chargeOverfillFault01: number;
+   chargeMaxCycles: number;
    faultJavelinLaunchSpeedMs: number;
```

In `GAMEPLAY_TUNING`:

```diff
  throwPhase: {
    chargeFillDurationMs: 800,
-   chargeOverfillFault01: 1.03,
+   chargeMaxCycles: 3,
    faultJavelinLaunchSpeedMs: 8.4,
```

Update the convenience alias:

```diff
- export const CHARGE_OVERFILL_FAULT_01 = GAMEPLAY_TUNING.throwPhase.chargeOverfillFault01;
+ export const CHARGE_MAX_CYCLES = GAMEPLAY_TUNING.throwPhase.chargeMaxCycles;
```

### 3c. Update the `releaseCharge` handler

In `reduceGameState`, the `releaseCharge` case (line ~4574) also checks `rawFill01 >= CHARGE_OVERFILL_FAULT_01`. Update:

```diff
- if (rawFill01 >= CHARGE_OVERFILL_FAULT_01) {
+ const fullCycles = Math.floor(rawFill01);
+ if (fullCycles >= CHARGE_MAX_CYCLES) {
```

And the phase01 computation:

```diff
- const phase01 = clamp(rawFill01, 0, 1);
+ const phase01 = clamp(rawFill01 % 1, 0, 1);
```

### 3d. Update imports

In `update.ts`, replace:

```diff
- import { CHARGE_OVERFILL_FAULT_01 } from './tuning';
+ import { CHARGE_MAX_CYCLES } from './tuning';
```

Search the entire codebase for `CHARGE_OVERFILL_FAULT_01` — it should only appear in `update.ts` and `tuning.ts`. Remove all references.

### 3e. Optional: cycle count indicator in meter

In `renderMeter.ts`, the `getWorldMeterState` function for `chargeAim` can expose cycle info for a visual indicator. Optionally draw small dots below the meter (filled for elapsed cycles, empty for remaining). This is a nice-to-have.

### 3f. Test updates

Update tests in `reducer.test.ts`:

```ts
it('faults after exceeding max charge cycles', () => {
  let state = makeChargeAimState({ chargeStartedAtMs: 1000 });
  // Tick past 3 full cycles: 3 * 800 = 2400 ms
  state = gameReducer(state, { type: 'tick', dtMs: 2500, nowMs: 3500 });
  expect(state.phase.tag).toBe('fault');
});

it('allows release on second cycle with correct quality', () => {
  let state = makeChargeAimState({ chargeStartedAtMs: 1000 });
  // Tick to 1.85 cycles (1480 ms) — phase01 wraps to 0.85, in perfect window
  state = gameReducer(state, { type: 'tick', dtMs: 1480, nowMs: 2480 });
  state = gameReducer(state, { type: 'releaseCharge', atMs: 2480 });
  expect(state.phase.tag).toBe('throwAnim');
  if (state.phase.tag === 'throwAnim') {
    expect(state.phase.releaseQuality).toBe('perfect');
  }
});
```

Remove or update any existing tests that reference `CHARGE_OVERFILL_FAULT_01`.

### 3g. Tuning reference

| Parameter | Easy | Default | Hard |
|-----------|------|---------|------|
| `chargeMaxCycles` | 5 | 3 | 2 |
| `chargeFillDurationMs` | 1000 | 800 | 600 |

---

## Feature 4 — Wind Strategy Indicators

### Problem

Wind is displayed as a number and vane arrow in the corner, but there's no guidance on how to compensate. The wind affects physics but the player can't strategize around it.

### 4a. Wind streaks visualization in `render.ts`

Update `drawWindVane` signature to accept `nowMs` and add animated streaks:

```diff
  const drawWindVane = (
    ctx: CanvasRenderingContext2D,
    width: number,
    windMs: number,
+   nowMs: number,
    localeFormatter: Intl.NumberFormat
  ): void => {
```

After the existing flag and text drawing, add wind streaks:

```ts
  // Animated wind streaks across the sky
  const intensity = Math.abs(windMs) / 2.5; // 0–1
  const dir = windMs >= 0 ? 1 : -1;
  const streakCount = Math.ceil(intensity * 5);
  ctx.save();
  ctx.globalAlpha = 0.08 + intensity * 0.12;
  ctx.strokeStyle = '#8cc4e0';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < streakCount; i++) {
    const baseX = (i * width / streakCount) + ((nowMs * 0.03 * dir) % width);
    const y = 30 + i * 22;
    const len = 20 + intensity * 30;
    ctx.beginPath();
    ctx.moveTo(((baseX % (width + 60)) - 30), y);
    ctx.lineTo(((baseX % (width + 60)) - 30) + len * dir, y);
    ctx.stroke();
  }
  ctx.restore();
```

Update the call in `renderGame` to pass `state.nowMs`:

```diff
- drawWindVane(ctx, width, state.windMs, numberFormat);
+ drawWindVane(ctx, width, state.windMs, state.nowMs, numberFormat);
```

### 4b. Angle compensation hint in HudPanel

In **`HudPanel.tsx`**, add a wind hint when in `chargeAim` phase:

```ts
const windHint = (() => {
  if (state.phase.tag !== 'chargeAim') return '';
  if (Math.abs(state.windMs) < 0.3) return '';
  if (state.windMs < -0.3) return t('javelin.windHintHeadwind');
  return t('javelin.windHintTailwind');
})();
```

Display below existing hint content:
```tsx
{windHint && <div className="hud-hint hud-hint-wind">{windHint}</div>}
```

### 4c. Add i18n keys

Add to all three locale files:

**en/common.json:**
```json
"javelin.windHintHeadwind": "Headwind — aim higher for distance",
"javelin.windHintTailwind": "Tailwind — lower angle carries further"
```

**fi/common.json:**
```json
"javelin.windHintHeadwind": "Vastatuuli — tähtää korkeammalle",
"javelin.windHintTailwind": "Myötätuuli — matalampi kulma kantaa pidemmälle"
```

**sv/common.json:**
```json
"javelin.windHintHeadwind": "Motvind — sikta högre för distans",
"javelin.windHintTailwind": "Medvind — lägre vinkel bär längre"
```

### 4d. Test

Visual only — verify wind streaks animate in the correct direction and hints appear during chargeAim.

---

## Feature 5 — Attempt Counter / Best-of-6

### Problem

Each throw is independent with no session structure. Real javelin gives 3–6 attempts.

### 5a. Extend `GameState` in `types.ts`

```diff
  export type GameState = {
    nowMs: number;
    roundId: number;
    windMs: number;
    aimAngleDeg: number;
    phase: GamePhase;
+   attemptsTotal: number;
+   attemptNumber: number;
+   sessionBestM: number | null;
  };
```

### 5b. Update `createInitialGameState` in `update.ts`

```diff
  export const createInitialGameState = (): GameState => ({
    nowMs: performance.now(),
    roundId: 0,
    windMs: 0,
    aimAngleDeg: ANGLE_DEFAULT_DEG,
-   phase: { tag: 'idle' }
+   phase: { tag: 'idle' },
+   attemptsTotal: 6,
+   attemptNumber: 0,
+   sessionBestM: null,
  });
```

### 5c. Add `startSession` action to `types.ts`

```diff
  export type GameAction =
+   | { type: 'startSession'; attempts: number }
    | { type: 'startRound'; atMs: number; windMs: number }
```

Handle in `reduceGameState`:
```ts
case 'startSession': {
  return {
    ...createInitialGameState(),
    attemptsTotal: action.attempts,
    attemptNumber: 0,
    sessionBestM: null,
  };
}
```

### 5d. Update `startRound` to increment attempt counter

```diff
  case 'startRound': {
+   if (state.attemptNumber >= state.attemptsTotal) {
+     return state; // session over
+   }
    return {
      ...state,
      nowMs: action.atMs,
      roundId: state.roundId + 1,
+     attemptNumber: state.attemptNumber + 1,
      windMs: action.windMs,
      phase: {
        tag: 'runup',
        ...
```

### 5e. Update session best when result lands

In `tickFlight` (update.ts), where it transitions to `result` (around line 4390):

```diff
  return {
    ...state,
+   sessionBestM:
+     legality.resultKind === 'valid'
+       ? Math.max(state.sessionBestM ?? 0, computeCompetitionDistanceM(landingTipXM))
+       : state.sessionBestM,
    phase: {
      tag: 'result',
```

### 5f. Update `JavelinPage.tsx` UI

Show attempt counter and session best in the actions area:

```tsx
<div className="hud-topline">
  {state.attemptNumber > 0 && (
    <span className="attempt-counter">
      {t('javelin.attempt')} {state.attemptNumber}/{state.attemptsTotal}
    </span>
  )}
  {state.sessionBestM !== null && (
    <span className="session-best">
      {t('javelin.sessionBest')}: {formatNumber(state.sessionBestM)} m
    </span>
  )}
</div>
```

Change the play-again button to show "Next attempt" vs "New sessi

// [TRUNCATED at 20000 chars]

```
> NOTE: Truncated to 20000 chars (original: 25875).
> meta: lines=868 chars=25875 truncated=yes


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


## index.html

```html
<!doctype html>
<html lang="fi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Selain Games 2026 - Keihäänheitto</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```
> meta: lines=14 chars=385 truncated=no

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
    "vitest": "^3.2.4"
  }
}

```
> meta: lines=26 chars=551 truncated=no

### Other code & helpers


## public/locales/en/common.json

```json
{
  "app.title": "Browser Games 2026",
  "javelin.title": "Javelin Throw",
  "phase.runup": "Build speed on rhythm",
  "phase.chargeAim": "Charge throw force",
  "phase.throwAnim": "Throw animation",
  "hud.rhythm": "Rhythm",
  "hud.force": "Force",
  "help.mouse4": "Right button up: release throw",
  "help.kbd4": "Enter up: release throw",
  "javelin.runupHint": "Time clicks to the green zone. Distance to line",
  "javelin.throwLine": "Throw Line",
  "javelin.speedPassiveHint": "Base speed also builds without clicking.",
  "javelin.windHintHeadwind": "Headwind - aim higher for distance",
  "javelin.windHintTailwind": "Tailwind - lower angle carries further",
  "javelin.attempt": "Attempt",
  "javelin.sessionBest": "Best",
  "action.nextAttempt": "Next Attempt",
  "action.newSession": "New Session (6 attempts)",
  "help.touch1": "Tap: build rhythm speed",
  "help.touch2": "Hold: charge throw force",
  "help.touch3": "Drag while holding: aim angle",
  "help.touch4": "Release: throw",
  "javelin.landingTipFirst": "Tip-first landing",
  "javelin.landingFlat": "Flat landing",
  "javelin.result.foul_line": "Foul: line crossed",
  "javelin.result.foul_sector": "Foul: outside sector",
  "javelin.result.foul_tip_first": "Foul: tip did not land first",
  "result.notSavedInvalid": "Invalid throw - result is not saved",
  "result.notHighscore": "Not a highscore - result is not saved"
}

```
> meta: lines=32 chars=1398 truncated=no


## public/locales/fi/common.json

```json
{
  "app.title": "Selain Games 2026",
  "javelin.title": "Keihäänheitto",
  "phase.runup": "Kiihdytä rytmillä",
  "phase.chargeAim": "Pidä heittovoimaa",
  "phase.throwAnim": "Heittoliike",
  "hud.rhythm": "Rytmi",
  "hud.force": "Voima",
  "help.mouse4": "Oikea painike ylös: vapauta heitto",
  "help.kbd4": "Enter ylös: vapauta heitto",
  "javelin.runupHint": "Ajoita klikkaukset vihreään alueeseen. Heittoviivalle",
  "javelin.throwLine": "Heittoviiva",
  "javelin.speedPassiveHint": "Perusvauhti kasvaa myös ilman klikkejä.",
  "javelin.windHintHeadwind": "Vastatuuli - tähtää korkeammalle",
  "javelin.windHintTailwind": "Myötätuuli - matalampi kulma kantaa pidemmälle",
  "javelin.attempt": "Yritys",
  "javelin.sessionBest": "Paras",
  "action.nextAttempt": "Seuraava yritys",
  "action.newSession": "Uusi sarja (6 yritystä)",
  "help.touch1": "Napauta: kiihdytä rytmillä",
  "help.touch2": "Pidä pohjassa: lataa heittovoima",
  "help.touch3": "Vedä pitäessä: säädä kulmaa",
  "help.touch4": "Vapauta: heitä",
  "javelin.landingTipFirst": "Kärki edellä",
  "javelin.landingFlat": "Litteä alastulo",
  "javelin.result.foul_line": "Hylätty: viiva ylitetty",
  "javelin.result.foul_sector": "Hylätty: sektorin ulkopuolella",
  "javelin.result.foul_tip_first": "Hylätty: kärki ei osunut ensin",
  "result.notSavedInvalid": "Virheellinen heitto - tulosta ei tallenneta",
  "result.notHighscore": "Ei uusi ennätys - tulosta ei tallenneta"
}

```
> meta: lines=32 chars=1442 truncated=no


## public/locales/sv/common.json

```json
{
  "app.title": "Browser Games 2026",
  "javelin.title": "Spjutkastning",
  "phase.runup": "Bygg fart i rytm",
  "phase.chargeAim": "Ladda kastkraft",
  "phase.throwAnim": "Kaströrelse",
  "hud.rhythm": "Rytm",
  "hud.force": "Kraft",
  "help.mouse4": "Högerknapp upp: släpp kastet",
  "help.kbd4": "Enter upp: släpp kastet",
  "javelin.runupHint": "Tajma klicken till det gröna området. Kvar till linjen",
  "javelin.throwLine": "Kastlinje",
  "javelin.speedPassiveHint": "Grundfarten ökar även utan klick.",
  "javelin.windHintHeadwind": "Motvind - sikta högre för distans",
  "javelin.windHintTailwind": "Medvind - lägre vinkel bär längre",
  "javelin.attempt": "Försök",
  "javelin.sessionBest": "Bästa",
  "action.nextAttempt": "Nästa försök",
  "action.newSession": "Ny serie (6 försök)",
  "help.touch1": "Tryck: bygg rytmfart",
  "help.touch2": "Håll: ladda kastkraft",
  "help.touch3": "Dra medan du håller: sikta vinkel",
  "help.touch4": "Släpp: kasta",
  "javelin.landingTipFirst": "Spetsen först",
  "javelin.landingFlat": "Platt landning",
  "javelin.result.foul_line": "Ogiltigt: linjen överträdd",
  "javelin.result.foul_sector": "Ogiltigt: utanför sektorn",
  "javelin.result.foul_tip_first": "Ogiltigt: spetsen landade inte först",
  "result.notSavedInvalid": "Ogiltigt kast - resultatet sparas inte",
  "result.notHighscore": "Inte nytt rekord - resultatet sparas inte"
}

```
> meta: lines=32 chars=1392 truncated=no

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
  - Left click: rhythm taps during run-up
  - Right click down: enter throw prep
  - Right click release: release throw
  - Move mouse up/down while holding right button: adjust angle
- Keyboard:
  - `Space`: rhythm tap
  - `Enter`: start throw prep / release
  - `ArrowUp` / `ArrowDown`: adjust angle

## Stack

- React 19 + TypeScript
- Vite 7
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

## GitHub Pages

Workflow is included in `.github/workflows/deploy.yml`.
`vite.config.ts` uses `/Javelin/` base path automatically on GitHub Actions.

## Scope Notes

- Leaderboard local-only in this demo.
- Next logical phase: backend leaderboard API + anti-cheat.

```
> meta: lines=69 chars=1472 truncated=no

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

### Frontend / UI


## src/features/javelin/components/CircularTimingMeter.tsx
_Reusable UI component or set of components._

```tsx
import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
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

const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

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
            />
          ))
        )}
        <circle className="timing-cursor" cx={cursor.x} cy={cursor.y} r={6} />
      </svg>
      <div className="timing-meter-meta">
        <span>{t(labelKey)}</span>
        {valueText && <strong>{valueText}</strong>}
        {hitFeedback && <small>{t(`hud.${hitFeedback}`)}</small>}
      </div>
    </div>
  );
};

```
> meta: lines=101 chars=2836 truncated=no


## src/features/javelin/components/ControlHelp.tsx
_Reusable UI component or set of components._

```tsx
import { useMemo, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';

export const ControlHelp = (): ReactElement => {
  const { t } = useI18n();
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  return (
    <section className="card control-help" aria-label={t('help.title')}>
      <h3>{t('help.title')}</h3>
      <ul>
        {isTouchDevice ? (
          <>
            <li>{t('help.touch1')}</li>
            <li>{t('help.touch2')}</li>
            <li>{t('help.touch3')}</li>
            <li>{t('help.touch4')}</li>
          </>
        ) : (
          <>
            <li>{t('help.mouse1')}</li>
            <li>{t('help.mouse2')}</li>
            <li>{t('help.mouse3')}</li>
            <li>{t('help.mouse4')}</li>
            <li>{t('help.kbd1')}</li>
            <li>{t('help.kbd2')}</li>
            <li>{t('help.kbd3')}</li>
            <li>{t('help.kbd4')}</li>
          </>
        )}
      </ul>
    </section>
  );
};

```
> meta: lines=40 chars=1103 truncated=no


## src/features/javelin/components/GameCanvas.tsx
_Reusable UI component or set of components._

```tsx
import { useEffect, useMemo, useRef, type ReactElement } from 'react';
import { renderGame } from '../game/render';
import type { GameAction, GameState } from '../game/types';
import { usePointerControls } from '../hooks/usePointerControls';
import { useI18n } from '../../../i18n/init';

type Dispatch = (action: GameAction) => void;

type GameCanvasProps = {
  state: GameState;
  dispatch: Dispatch;
};

export const GameCanvas = ({ state, dispatch }: GameCanvasProps): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastRenderAtMsRef = useRef<number>(performance.now());
  const { locale, t } = useI18n();

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale]
  );
  const releaseFlashLabels = useMemo(
    () => ({
      perfect: t('hud.perfect'),
      good: t('hud.good'),
      miss: t('hud.miss'),
      foulLine: t('javelin.result.foul_line')
    }),
    [t]
  );

  usePointerControls({ canvas: canvasRef.current, dispatch, phaseTag: state.phase.tag, state });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    const nowMs = performance.now();
    const dtMs = Math.min(40, Math.max(0, nowMs - lastRenderAtMsRef.current));
    lastRenderAtMsRef.current = nowMs;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderGame(
      context,
      state,
      rect.width,
      rect.height,
      dtMs,
      numberFormat,
      t('javelin.throwLine'),
      releaseFlashLabels
    );
  }, [state, numberFormat, t, releaseFlashLabels]);

  return (
    <div className="canvas-frame">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{ touchAction: 'none' }}
        role="img"
        aria-label="Javelin throw game canvas"
      />
    </div>
  );
};

```
> meta: lines=76 chars=2159 truncated=no


## src/features/javelin/components/HudPanel.tsx
_Reusable UI component or set of components._

```tsx
import type { ReactElement } from 'react';
import type { GameState } from '../game/types';
import { getAngleDeg, getSpeedPercent, getThrowLineRemainingM } from '../game/selectors';
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
  const speed = getSpeedPercent(state);
  const angle = getAngleDeg(state);
  const throwLineRemainingM = getThrowLineRemainingM(state);

  const phaseHint =
    state.phase.tag === 'runup'
      ? `${t('javelin.runupHint')} ${throwLineRemainingM !== null ? `${formatNumber(throwLineRemainingM)} m` : ''}`
      : state.phase.tag === 'chargeAim'
        ? t('javelin.speedPassiveHint')
        : '';
  const windHint = (() => {
    if (state.phase.tag !== 'chargeAim') {
      return '';
    }
    if (Math.abs(state.windMs) < 0.3) {
      return '';
    }
    return state.windMs < -0.3 ? t('javelin.windHintHeadwind') : t('javelin.windHintTailwind');
  })();

  return (
    <section className="card hud-panel" aria-label="HUD">
      <div className="hud-topline">{t(phaseMessageKey(state))}</div>
      {phaseHint && <div className="hud-hint">{phaseHint}</div>}
      {windHint && <div className="hud-hint hud-hint-wind">{windHint}</div>}
      <div className="hud-grid">
        <div className="hud-item">
          <span>{t('hud.speed')}</span>
          <strong>{speed}%</strong>
        </div>
        <div className="hud-item">
          <span>{t('hud.angle')}</span>
          <strong>{formatNumber(angle, 0)}°</strong>
        </div>
        <div className="hud-item">
          <span>{t('hud.wind')}</span>
          <strong>
            {state.windMs >= 0 ? '+' : ''}
            {formatNumber(state.windMs)} m/s
          </strong>
        </div>
      </div>
    </section>
  );
};

```
> meta: lines=78 chars=2355 truncated=no


## src/features/javelin/components/LanguageSwitch.tsx
_Reusable UI component or set of components._

```tsx
import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import type { Locale } from '../game/types';

const LABELS: Record<Locale, string> = {
  fi: 'Suomi',
  sv: 'Svenska',
  en: 'English'
};

export const LanguageSwitch = (): ReactElement => {
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

```
> meta: lines=29 chars=756 truncated=no


## src/features/javelin/components/ScoreBoard.tsx
_Reusable UI component or set of components._

```tsx
import type { ReactElement } from 'react';
import type { HighscoreEntry } from '../game/types';
import { useI18n } from '../../../i18n/init';

type ScoreBoardProps = {
  highscores: HighscoreEntry[];
};

export const ScoreBoard = ({ highscores }: ScoreBoardProps): ReactElement => {
  const { t, formatNumber, locale } = useI18n();

  return (
    <section className="card scoreboard" aria-label={t('scoreboard.title')}>
      <h3>{t('scoreboard.title')}</h3>
      {highscores.length === 0 ? (
        <p>{t('scoreboard.empty')}</p>
      ) : (
        <ol>
          {highscores.map((entry) => (
            <li key={entry.id}>
              <span>{entry.name}</span>
              <strong>{formatNumber(entry.distanceM)} m</strong>
              <time>
                {new Intl.DateTimeFormat(locale, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).format(new Date(entry.playedAtIso))}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

```
> meta: lines=37 chars=1067 truncated=no

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
// ... 3 more import lines from .

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

const runCurves = (t01: number, speedNorm: number, aimAngleDeg: number): MotionCurves => {
  const cycle = clamp01(t01) * Math.PI * 2;
  const stride = Math.sin(cycle);
  const counter = Math.sin(cycle + Math.PI);
  const runJavelinAngleDeg = Math.max(-90, Math.min(90, aimAngleDeg));
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
  javelinAngleRad: toRad(Math.max(-90, Math.min(90, aimAngleDeg)))
});

const curvesForPose = (
  pose: AthletePoseState,
  speedNorm: number,
  aimAngleDeg: number,
  options: PoseSamplingOptions
): MotionCurves => {
  const t = clamp01(pose.animT);

  if (pose.animTag === 'run') {
    return runCurves(t, speedNorm, aimAngleDeg);
  }

  if (pose.animTag === 'aim') {
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

  if (pose.animTag === 'throw') {
    return throwCurves(t, aimAngleDeg);
  }

  if (pose.animTag === 'followThrough') {
    return followThroughCurves(t, speedNorm);
  }

  if (pose.animTag === 'fall') {
    return fallCurves(t);
  }

  return idleCurves(aimAngleDeg);
};

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
    if (pose.animTag === 'idle') {
      return 0;
    }
    if (pose.animTag === 'run') {
      return -0.1 - 0.08 * speedNorm;
    }
    if (pose.animTag === 'aim' || pose.animTag === 'throw') {
      return toRad(aimAngleDeg) * 0.35;
    }
    if (pose.animTag === 'followThrough') {
      return -0.15;
    }
    if (pose.animTag === 'fall') {
      return -0.5;
    }
    return 0;
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

    if (stage.stage === 'windup') {
      return lerpPoint(hold, windupPoint, stage.windup01);
    }
    if (stage.stage === 'delivery') {
      return lerpPoint(windupPoint, releasePoint, stage.delivery01);
    }
    return lerpPoint(releasePoint, followPoint, stage.follow01);
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
> meta: lines=485 chars=15183 truncated=no

### Audio


## src/features/javelin/game/audio.ts
_Defines: playBeatTick, resumeAudioContext_

```ts
type BeatAudioContext = {
  ctx: AudioContext;
  lastTickAtMs: number;
  minIntervalMs: number;
};

let audioState: BeatAudioContext | null = null;

const ensureAudioContext = (): BeatAudioContext | null => {
  if (audioState !== null) {
    return audioState;
  }
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') {
    return null;
  }
  audioState = {
    ctx: new window.AudioContext(),
    lastTickAtMs: 0,
    minIntervalMs: 200
  };
  return audioState;
};

/**
 * Play a short rhythm tick sound.
 * Uses an oscillator to avoid loading audio assets.
 */
export const playBeatTick = (nowMs: number, isInZone: boolean): void => {
  const audio = ensureAudioContext();
  if (audio === null) {
    return;
  }
  if (nowMs - audio.lastTickAtMs < audio.minIntervalMs) {
    return;
  }
  audio.lastTickAtMs = nowMs;

  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.connect(gain);
  gain.connect(audio.ctx.destination);

  osc.frequency.value = isInZone ? 880 : 440;
  osc.type = 'sine';

  const now = audio.ctx.currentTime;
  gain.gain.setValueAtTime(isInZone ? 0.15 : 0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.start(now);
  osc.stop(now + 0.06);
};

export const resumeAudioContext = (): void => {
  const audio = ensureAudioContext();
  if (audio?.ctx.state === 'suspended') {
    void audio.ctx.resume();
  }
};

```
> meta: lines=60 chars=1429 truncated=no

### Rendering & visual effects


## src/features/javelin/game/camera.ts
_Defines: WorldToScreenInput, WorldToScreen, RUNWAY_OFFSET_X, resetSmoothCamera, getCameraTargetX, getViewWidthM_

```ts
import {
  CAMERA_DEFAULT_VIEW_WIDTH_M,
  CAMERA_FLIGHT_TARGET_AHEAD,
  CAMERA_FLIGHT_VIEW_WIDTH_M,
  CAMERA_GROUND_BOTTOM_PADDING,
  CAMERA_RESULT_TARGET_AHEAD,
  CAMERA_RESULT_VIEW_WIDTH_M,
  CAMERA_RUNUP_TARGET_AHEAD,
// ... 12 more import lines from .

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

const PHASE_CAMERA_CONFIG: Record<GamePhase['tag'], PhaseCameraConfig> = {
  idle: {
    viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RUNUP_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  runup: {
    viewWidthM: CAMERA_RUNUP_VIEW_WIDTH_M,
    aheadRatio: CAMERA_RUNUP_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  chargeAim: {
    viewWidthM: CAMERA_THROW_VIEW_WIDTH_M,
    aheadRatio: CAMERA_THROW_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_RUNUP
  },
  throwAnim: {
    viewWidthM: CAMERA_THROW_VIEW_WIDTH_M,
    aheadRatio: CAMERA_THROW_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_THROW
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
    viewWidthM: CAMERA_THROW_VIEW_WIDTH_M,
    aheadRatio: CAMERA_THROW_TARGET_AHEAD,
    yScale: CAMERA_Y_SCALE_THROW
  }
};

const CAMERA_LERP_SPEED = 4.5;

let smoothCam: SmoothedCamera = {
  viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
  yScale: CAMERA_Y_SCALE_RUNUP,
  targetX: RUNUP_START_X_M,
  lastPhaseTag: 'idle'
};

const lerpToward = (current: number, target: number, factor: number): number =>
  current + (target - current) * Math.min(1, Math.max(0, factor));

export const resetSmoothCamera = (): void => {
  smoothCam = {
    viewWidthM: CAMERA_DEFAULT_VIEW_WIDTH_M,
    yScale: CAMERA_Y_SCALE_RUNUP,
    targetX: RUNUP_START_X_M,
    lastPhaseTag: 'idle'
  };
};

export const getCameraTargetX = (state: GameState): number => {
  switch (state.phase.tag) {
    case 'runup':
    case 'chargeAim':
      return state.phase.runupDistanceM;
    case 'throwAnim':
      return state.phase.athleteXM;
    case 'flight':
      return state.phase.javelin.xM;
    case 'result':
      return state.phase.landingXM;
    case 'fault':
      return state.phase.athleteXM;
    case 'idle':
    default:
      return 5;
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

const updateSmoothedCamera = (state: GameState, dtMs: number): void => {
  if (state.phase.tag === 'idle') {
    resetSmoothCamera();
    return;
  }

  const targetViewWidth = getViewWidthM(state);
  const targetYScale = getVerticalScale(state);
  const targetX = getCameraTargetX(state);
  const dt = (Math.max(0, dtMs) / 1000) * CAMERA_LERP_SPEED;
  const phaseChanged = state.phase.tag !== smoothCam.lastPhaseTag;
  const lerpFactor = phaseChanged ? Math.min(1, dt * 2.5) : Math.min(1, dt);

  smoothCam = {
    viewWidthM: lerpToward(smoothCam.viewWidthM, targetViewWidth, lerpFactor),
    yScale: lerpToward(smoothCam.yScale, targetYScale, lerpFactor),
    targetX: lerpToward(smoothCam.targetX, targetX, Math.min(1, dt * 1.2)),
    lastPhaseTag: state.phase.tag
  };
};

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
  dtMs: number
): { toScreen: WorldToScreen; worldMinX: number; worldMaxX: number } => {
  updateSmoothedCamera(state, dtMs);
  return createWorldToScreenWithCamera(
    state,
    width,
    height,
    smoothCam.viewWidthM,
    smoothCam.targetX,
    smoothCam.yScale
  );
};

```
> meta: lines=199 chars=5335 truncated=no

### Other code & helpers


## src/features/javelin/game/chargeMeter.ts
_Defines: isInWindow, getTimingQuality, computeForcePreview, applyForceQualityBonus_

```ts
import type { MeterWindow, TimingQuality } from './types';
import { clamp } from './math';

export const isInWindow = (phase01: number, window: MeterWindow): boolean => {
  const phase = clamp(phase01, 0, 1);
  if (window.start <= window.end) {
    return phase >= window.start && phase <= window.end;
  }
  return phase >= window.start || phase <= window.end;
};

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
> meta: lines=41 chars=1070 truncated=no


## src/features/javelin/game/constants.ts
_Defines: RUNUP_MAX_TAPS, RUNUP_SPEED_MIN_MS, RUNUP_SPEED_MAX_MS, THROW_LINE_X_M, CHARGE_ZONE_MARGIN_M, RUNUP_MAX_X_M_

```ts
export const RUNUP_MAX_TAPS = 12;
export const RUNUP_SPEED_MIN_MS = 1.6;
export const RUNUP_SPEED_MAX_MS = 9.6;
export const THROW_LINE_X_M = 18.2;
export const CHARGE_ZONE_MARGIN_M = 1.4;
export const RUNUP_MAX_X_M = 22.4;

export const RHYTHM_TARGET_PHASE01 = 0.5;

export const ANGLE_MIN_DEG = -90;
export const ANGLE_MAX_DEG = 90;
export const ANGLE_DEFAULT_DEG = 36;
export const ANGLE_CHANGE_STEP_DEG = 1.2;

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

export const JAVELIN_GRIP_OFFSET_M = 0.12;
export const JAVELIN_GRIP_OFFSET_Y_M = 0.03;
export const JAVELIN_RELEASE_OFFSET_Y_M = 0.06;

export const LAUNCH_SPEED_MIN_MS = 9;
export const LAUNCH_SPEED_MAX_MS = 44;
export const LAUNCH_POWER_EXP = 1.42;

export const DRAG_COEFFICIENT = 0.00835;
export const LIFT_COEFFICIENT = 0.00024;
export const AOA_MAX_RAD = 0.75;
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
export const FIELD_MAX_DISTANCE_M = 132;

export const MAX_HIGHSCORES = 10;
export const HIGHSCORE_STORAGE_KEY = 'sg2026-javelin-highscores-v1';

```
> meta: lines=63 chars=2118 truncated=no


## src/features/javelin/game/controls.ts
_Defines: keyboardAngleDelta, pointerFromAnchorToAngleDeg_

```ts
import { ANGLE_CHANGE_STEP_DEG } from './constants';
import { clamp } from './math';

export const keyboardAngleDelta = (direction: 'up' | 'down'): number =>
  direction === 'up' ? ANGLE_CHANGE_STEP_DEG : -ANGLE_CHANGE_STEP_DEG;

export const pointerFromAnchorToAngleDeg = (
  pointerClientX: number,
  pointerClientY: number,
  anchorClientX: number,
  anchorClientY: number
): number => {
  const dx = Math.abs(pointerClientX - anchorClientX);
  const dy = anchorClientY - pointerClientY;
  if (dx === 0) {
    return dy >= 0 ? 90 : -90;
  }
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  return clamp(angleDeg, -90, 90);
};

```
> meta: lines=21 chars=639 truncated=no


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

export const easeOutQuad = (t: number): number => 1 - (1 - t) * (1 - t);

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const easeInCubic = (t: number): number => t ** 3;

export const easeInOutSine = (t: number): number =>
  0.5 - Math.cos(Math.PI * clamp01(t)) * 0.5;

```
> meta: lines=31 chars=1100 truncated=no

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
// ... 11 more import lines from .

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

const roundTo1 = (value: number): number => Math.round(value * 10) / 10;

const isFiniteState = (javelin: PhysicalJavelinState): boolean =>
  Number.isFinite(javelin.xM) &&
  Number.isFinite(javelin.yM) &&
  Number.isFinite(javelin.zM) &&
  Number.isFinite(javelin.vxMs) &&
  Number.isFinite(javelin.vyMs) &&
  Number.isFinite(javelin.vzMs) &&
  Number.isFinite(javelin.angleRad) &&
  Number.isFinite(javelin.angularVelRad);

export const computeLaunchSpeedMs = (speedNorm: number, forceNorm: number): number => {
  const combinedPowerNorm = clamp(0.74 * speedNorm + 0.26 * forceNorm, 0, 1);
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

export const updatePhysicalJavelin = (
  javelin: PhysicalJavelinState,
  dtMs: number,
  windMs: number
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

  const airVx = javelin.vxMs - windMs;
  const airVy = javelin.vyMs;
  const airVz = javelin.vzMs;
  const airSpeed = Math.max(0.001, Math.hypot(airVx, airVy, airVz));
  const flowAngle = Math.atan2(airVy, Math.max(0.01, airVx));
  const aoa = clamp(normalizeAngleRad(javelin.angleRad - flowAngle), -AOA_MAX_RAD, AOA_MAX_RAD);

  const dragAcc = clamp(DRAG_COEFFICIENT * airSpeed * airSpeed, 0, MAX_LINEAR_ACCEL);
  const liftAcc = clamp(
    LIFT_COEFFICIENT * airSpeed * airSpeed * Math.sin(2 * aoa),
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
  const az = clamp(dragDirZ * dragAcc * 0.55, -MAX_LINEAR_ACCEL * 0.45, MAX_LINEAR_ACCEL * 0.45);

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
> meta: lines=257 chars=7644 truncated=no

### Other code & helpers


## src/features/javelin/game/reducer.ts
_Defines: gameReducer_

```ts
import type { GameAction, GameState } from './types';
import { reduceGameState } from './update';

export const gameReducer = (state: GameState, action: GameAction): GameState =>
  reduceGameState(state, action);

```
> meta: lines=6 chars=213 truncated=no

### Rendering & visual effects


## src/features/javelin/game/render.ts
_Defines: getVisibleJavelinRenderState, getPlayerAngleAnchorScreen, renderGame_

```ts
import {
  computeAthletePoseGeometry,
  getRunToAimBlend01,
  sampleThrowSubphase,
  type AthletePoseGeometry
} from './athletePose';
import { playBeatTick } from './audio';
import {
// ... 19 more import lines from .

export { getCameraTargetX } from './camera';
export { getHeadMeterScreenAnchor } from './renderMeter';

type CloudLayer = {
  yFraction: number;
  parallaxFactor: number;
  clouds: Array<{
    offsetXM: number;
    widthPx: number;
    heightPx: number;
    opacity: number;
  }>;
};

const CLOUD_LAYERS: CloudLayer[] = [
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

let lastResultRoundId = -1;
let resultShownAtMs = 0;

type ReleaseFlashLabels = Record<TimingQuality, string> & {
  foulLine: string;
};

const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#dceef8');
  sky.addColorStop(0.56, '#c8e1ef');
  sky.addColorStop(1, '#b8d6e3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const haze = ctx.createRadialGradient(width * 0.25, height * 0.1, 20, width * 0.25, height * 0.1, width * 0.8);
  haze.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
  haze.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);
};

const drawClouds = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  worldMinX: number
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
      ctx.fillStyle = '#f8fcff';
      ctx.beginPath();
      const rx = cloud.widthPx / 2;
      const ry = cloud.heightPx / 2;
      ctx.ellipse(x + rx, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 0.6, y + ry * 0.15, rx * 0.7, ry * 0.8, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rx * 1.4, y - ry * 0.1, rx * 0.65, ry * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(142, 179, 200, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }
};

const drawThrowLine = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  height: number,
  label: string
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  const line = toScreen({ xM: THROW_LINE_X_M, yM: 0 });
  ctx.strokeStyle = '#ff5d4e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(line.x, groundY - 24);
  ctx.lineTo(line.x, groundY + 19);
  ctx.stroke();

  ctx.fillStyle = '#a3211a';
  ctx.font = '700 12px ui-sans-serif';
  ctx.fillText(label, line.x - 28, groundY - 27);
};

const drawTrackAndField = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  toScreen: WorldToScreen,
  throwLineLabel: string,
  worldMinX: number,
  worldMaxX: number
): void => {
  const groundY = height - CAMERA_GROUND_BOTTOM_PADDING;
  ctx.fillStyle = '#88d37f';
  ctx.fillRect(0, groundY, width, CAMERA_GROUND_BOTTOM_PADDING);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
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
    ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = isMajor ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, groundY + (isMajor ? 16 : 10));
    ctx.stroke();

    if (isMajor) {
      ctx.fillStyle = '#0b2238';
      ctx.font = 'bold 12px ui-sans-serif';
      ctx.fillText(`${relativeM} m`, x - 12, groundY + 32);
    }
  }

  drawThrowLine(ctx, toScreen, height, throwLineLabel);
};

const drawWindVane = (
  ctx: CanvasRenderingContext2D,
  width: number,
  windMs: number,
  localeFormatter: Intl.NumberFormat
): void => {
  const dir = windMs >= 0 ? 1 : -1;
  const x = width - 118;
  const y = 42;

  ctx.strokeStyle = '#0f4165';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 22);
  ctx.lineTo(x, y - 8);
  ctx.stroke();

  ctx.fillStyle = windMs >= 0 ? '#1f9d44' : '#cf3a2f';
  ctx.beginPath();
  if (dir >= 0) {
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x + 26, y - 1);
    ctx.lineTo(x, y + 7);
  } else {
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x - 26, y - 1);
    ctx.lineTo(x, y + 7);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#10314a';
  ctx.font = '600 12px ui-sans-serif';
  const windText = `${windMs >= 0 ? '+' : ''}${localeFormatter.format(windMs)} m/s`;
  ctx.fillText(windText, x - 16, y + 34);
};

const drawJavelinWorld = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  xM: number,
  yM: number,
  angleRad: number,
  lengthM = JAVELIN_LENGTH_M
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

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tailScreen.x, tailScreen.y);
  ctx.lineTo(tipScreen.x, tipScreen.y);
  ctx.stroke();
};

const drawLandedJavelin = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  xM: number,
  yM: number,
  angleRad: number,
  lengthM: number,
  tipFirst: boolean
): void => {
  if (tipFirst) {
    const stuckAngle = Math.max(angleRad, -Math.PI * 0.35);
    drawJavelinWorld(ctx, toScreen, xM, yM, stuckAngle, lengthM);

    const tip = toScreen({ xM: xM + (Math.cos(stuckAngle) * lengthM) / 2, yM: 0 });
    ctx.save();
    ctx.fillStyle = 'rgba(80, 50, 20, 0.3)';
    ctx.beginPath();
    ctx.ellipse(tip.x, tip.y + 2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const flatAngle = angleRad * 0.3;
  const lyingYM = Math.max(0.05, yM * 0.3);
  drawJavelinWorld(ctx, toScreen, xM, lyingYM, flatAngle, lengthM);

  const center = toScreen({ xM, yM: 0 });
  ctx.save();
  ctx.strokeStyle = 'rgba(80, 50, 20, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(center.x - 8, center.y + 3);
  ctx.lineTo(center.x + 12, center.y + 3);
  ctx.stroke();
  ctx.restore();
};

const drawLandingMarker = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  landingXM: number,
  resultKind: ResultKind,
  distanceLabel: string
): void => {
  const landing = toScreen({ xM: landingXM, yM: 0 });
  const groundY = landing.y;

  ctx.strokeStyle = resultKind === 'valid' ? '#1f9d44' : '#cf3a2f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY + 5);
  ctx.lineTo(landing.x, groundY - 36);
  ctx.stroke();

  ctx.fillStyle = resultKind === 'valid' ? '#22c272' : '#e0453a';
  ctx.beginPath();
  ctx.moveTo(landing.x, groundY - 36);
  ctx.lineTo(landing.x + 28, groundY - 30);
  ctx.lineTo(landing.x, groundY - 24);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 10px ui-sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(distanceLabel, landing.x + 4, groundY - 28);

  ctx.fillStyle = 'rgba(15, 40, 60, 0.35)';
  ctx.beginPath();
  ctx.arc(landing.x, groundY + 2, 3, 0, Math.PI * 2);
  ctx.fill();
};

type JavelinRenderState =
  | { mode: 'none' }
  | { mode: 'attached'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'flight'; xM: number; yM: number; angleRad: number; lengthM: number }
  | { mode: 'landed'; xM: number; yM: number; angleRad: number; lengthM: number };

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

const getPoseForState = (state: GameState): AthletePoseGeometry => {
  if (state.phase.tag === 'runup') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      state.phase.speedNorm,
      state.aimAngleDeg,
      state.phase.runupDistanceM
    );
  }
  if (state.phase.tag === 'chargeAim') {
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
  if (state.phase.tag === 'throwAnim') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      state.phase.speedNorm,
      state.phase.angleDeg,
      state.phase.athleteXM
    );
  }
  if (state.phase.tag === 'flight') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      state.phase.launchedFrom.speedNorm,
      state.phase.launchedFrom.angleDeg,
      state.phase.athleteXM
    );
  }
  if (state.phase.tag === 'result') {
    return computeAthletePoseGeometry(
      { animTag: 'followThrough', animT: 1 },
      0.72,
      24,
      state.phase.athleteXM
    );
  }
  if (state.phase.tag === 'fault') {
    return computeAthletePoseGeometry(
      state.phase.athletePose,
      0.14,
      state.aimAngleDeg,
      state.phase.athleteXM
    );
  }
  return computeAthletePoseGeometry(
    { animTag: 'idle', animT: 0 },
    0,
    state.aimAngleDeg,
    RUNUP_START_X_M
  );
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

const shouldDrawFrontArmOverHead = (state: GameState): boolean => {
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
    default:
      return true;
  }
};

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
  dtMs: number,
  numberFormat: Intl.NumberFormat,
  throwLineLabel: string,
  releaseFlashLabels: ReleaseFlashLabels
): void => {
  const camera = createWorldToScreen(state, width, height, dtMs);
  const { toScreen, worldMinX, worldMaxX } = camera;

  drawBackground(ctx, width, height);
  drawClouds(ctx, width, height, worldMinX);
  drawTrackAndField(
    ctx,
    width,
    height,
    toScreen,
    throwLineLabel,
    worldMinX,
    worldMaxX
  );
  drawWindVane(ctx, width, state.windMs, numberFormat);

  const pose = getPoseForState(state);
  const javelin = getVisibleJavelinRenderState(state, pose);
  const headScreen = drawAthlete(ctx, toScreen, pose, shouldDrawFrontArmOverHead(state));

  if (javelin.mode === 'landed') {
    const tipFirst = state.phase.tag === 'result' ? state.phase.tipFirst === true : false;
    drawLandedJavelin(
      ctx,
      toScreen,
      javelin.xM,
      javelin.yM,
      javelin.angleRad,
      javelin.lengthM,
      tipFirst
    );
  } else if (javelin.mode !== 'none') {
    drawJavelinWorld(ctx, toScreen, javelin.xM, javelin.yM, javelin.angleRad, javelin.lengthM);
  }

  if (state.phase.tag === 'result') {
    if (state.roundId !== lastResultRoundId) {
      lastResultRoundId = state.roundId;
      resultShownAtMs = state.nowMs;
    }
    const fadeAgeMs = Math.max(0, state.nowMs - resultShownAtMs);
    const alpha = Math.min(1, fadeAgeMs / 400);
    ctx.save();
    ctx.globalAlpha = alpha;
    drawLandingMarker(
      ctx,
      toScreen,
      state.phase.landingXM,
      state.phase.resultKind,
      `${numberFormat.format(state.phase.distanceM)}m`
    );
    ctx.restore();
  } else {
    lastResultRoundId = -1;
  }

  const releaseFeedback =
    state.phase.tag === 'throwAnim'
      ? {
          label: state.phase.lineCrossedAtRelease
            ? releaseFlashLabels.foulLine
            : releaseFlashLabels[state.phase.releaseQuality],
          shownAtMs: state.phase.releaseFlashAtMs
        }
      : state.phase.tag === 'flight'
        ? {
            label: state.phase.launchedFrom.lineCrossedAtRelease
              ? releaseFlashLabels.foulLine
              : releaseFlashLabels[state.phase.launchedFrom.releaseQuality],
            shownAtMs: state.phase.javelin.releasedAtMs
          }
        : null;

  if (releaseFeedback !== null) {
    const feedbackAgeMs = Math.max(0, state.nowMs - releaseFeedback.shownAtMs);
    const holdMs = 220;
    const fadeMs = 620;
    const totalMs = holdMs + fadeMs;
    if (feedbackAgeMs < totalMs) {
      const fadeT = feedbackAgeMs <= holdMs ? 0 : (feedbackAgeMs - holdMs) / fadeMs;
      const alpha = 1 - Math.min(1, fadeT);
      const scale = 1 + (1 - alpha) * 0.12;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `900 ${Math.round(28 * scale)}px ui-sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0b2238';
      const y = 74 - (1 - alpha) * 8;
      ctx.fillText(releaseFeedback.label, width / 2, y);
      ctx.restore();
    }
  }

  drawWorldTimingMeter(ctx, state, headScreen);

  if (state.phase.tag === 'runup') {
    const meterPhase = getRunupMeterPhase01(state);
    if (meterPhase !== null) {
      const distToTarget = Math.abs(meterPhase - RHYTHM_TARGET_PHASE01);
      const wrappedDist = Math.min(distToTarget, 1 - distToTarget);
      if (wrappedDist < 0.02) {
        playBeatTick(state.nowMs, wrappedDist < 0.01);
      }
    }
  }
};

```
> meta: lines=583 chars=16328 truncated=no

### Other code & helpers


## src/features/javelin/game/renderAthlete.ts
_Defines: HeadAnchor, drawAthlete_

```ts
import type { AthletePoseGeometry } from './athletePose';
import type { WorldToScreen } from './camera';

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
  }
): void => {
  drawLimb(ctx, points.shoulderCenter, points.elbowFront, 5, '#0a2f4d');
  drawLimb(ctx, points.elbowFront, points.handFront, 4, '#103c5e');
};

export const drawAthlete = (
  ctx: CanvasRenderingContext2D,
  toScreen: WorldToScreen,
  pose: AthletePoseGeometry,
  drawFrontArmOverHead: boolean
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

  drawLimb(ctx, p.hipBack, p.kneeBack, 6, '#0a2f4d');
  drawLimb(ctx, p.kneeBack, p.footBack, 5, '#124468');
  drawLimb(ctx, p.hipFront, p.kneeFront, 6, '#0d3658');
  drawLimb(ctx, p.kneeFront, p.footFront, 5, '#1b5b83');

  drawLimb(ctx, p.pelvis, p.shoulderCenter, 9, '#0f3d62');

  drawLimb(ctx, p.shoulderCenter, p.elbowBack, 5, '#124468');
  drawLimb(ctx, p.elbowBack, p.handBack, 4, '#1b5b83');

  if (!drawFrontArmOverHead) {
    drawFrontArm(ctx, p);
  }

  ctx.fillStyle = '#ffe3bc';
  ctx.beginPath();
  ctx.arc(p.head.x, p.head.y, 7.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#073257';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.head.x, p.head.y, 7.6, 0, Math.PI * 2);
  ctx.stroke();

  const eyeOffsetX = Math.cos(pose.headTiltRad) * 3.5 + Math.sin(pose.headTiltRad) * 0.5;
  const eyeOffsetY = -Math.sin(pose.headTiltRad) * 3.5 + Math.cos(pose.headTiltRad) * 0.5;
  ctx.fillStyle = '#0b2c49';
  ctx.beginPath();
  ctx.arc(p.head.x + eyeOffsetX, p.head.y - eyeOffsetY, 1.2, 0, Math.PI * 2);
  ctx.fill();

  if (drawFrontArmOverHead) {
    drawFrontArm(ctx, p);
  }

  return p.head;
};

```
> meta: lines=103 chars=2913 truncated=no


## src/features/javelin/game/renderMeter.ts
_Defines: getHeadMeterScreenAnchor, drawWorldTimingMeter_

```ts
import {
  RHYTHM_TARGET_PHASE01,
  WORLD_METER_CURSOR_RADIUS_PX,
  WORLD_METER_LINE_WIDTH_PX,
  WORLD_METER_OFFSET_Y_PX,
  WORLD_METER_RADIUS_PX
} from './constants';
import { clamp01, wrap01 } from './math';
// ... 10 more import lines from .

type MeterZones = {
  perfect: { start: number; end: number };
  good: { start: number; end: number };
};

type WorldMeterState = {
  phase01: number;
  zones: MeterZones;
  feedback: TimingQuality | null;
  valuePercent: number;
};

const normalizeMeterPhase01 = (phase01: number): number => {
  if (phase01 <= 0) {
    return 0;
  }
  if (phase01 >= 1) {
    return 1;
  }
  return wrap01(phase01);
};

const phaseToSemicircleAngle = (phase01: number): number =>
  Math.PI + clamp01(phase01) * Math.PI;

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
      zones: getRhythmHotZones(),
      feedback: getRunupFeedback(state),
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
  headScreen: HeadAnchor
): void => {
  const meterState = getWorldMeterState(state);
  if (meterState === null) {
    return;
  }

  const anchor = getHeadMeterScreenAnchor(headScreen);
  if (!Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = 0.96;

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    WORLD_METER_RADIUS_PX,
    0,
    1,
    'rgba(10, 46, 77, 0.34)',
    WORLD_METER_LINE_WIDTH_PX
  );

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    WORLD_METER_RADIUS_PX,
    meterState.zones.good.start,
    meterState.zones.good.end,
    'rgba(30, 142, 247, 0.82)',
    WORLD_METER_LINE_WIDTH_PX
  );

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    WORLD_METER_RADIUS_PX,
    meterState.zones.perfect.start,
    meterState.zones.perfect.end,
    'rgba(18, 196, 119, 0.98)',
    WORLD_METER_LINE_WIDTH_PX + 0.8
  );

  if (state.phase.tag === 'runup') {
    const meterPhase = getRunupMeterPhase01(state);
    if (meterPhase !== null) {
      const distToTarget = Math.abs(meterPhase - RHYTHM_TARGET_PHASE01);
      const wrappedDist = Math.min(distToTarget, 1 - distToTarget);
      if (wrappedDist < 0.06) {
        const flashAlpha = (1 - wrappedDist / 0.06) * 0.5;
        ctx.save();
        ctx.globalAlpha = flashAlpha;
        ctx.strokeStyle = '#22c272';
        ctx.lineWidth = WORLD_METER_LINE_WIDTH_PX + 6;
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, WORLD_METER_RADIUS_PX, Math.PI, Math.PI * 2, false);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  const cursorAngle = phaseToSemicircleAngle(normalizeMeterPhase01(meterState.phase01));
  const cursorX = anchor.x + Math.cos(cursorAngle) * WORLD_METER_RADIUS_PX;
  const cursorY = anchor.y + Math.sin(cursorAngle) * WORLD_METER_RADIUS_PX;

  const cursorFill =
    meterState.feedback === 'perfect'
      ? '#22c272'
      : meterState.feedback === 'good'
        ? '#329cf5'
        : '#f6d255';

  ctx.fillStyle = cursorFill;
  ctx.strokeStyle = '#0f3b61';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cursorX, cursorY, WORLD_METER_CURSOR_RADIUS_PX, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(6, 32, 57, 0.9)';
  ctx.font = '700 11px ui-sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${meterState.valuePercent}%`, anchor.x, anchor.y + 16);

  ctx.restore();
};

```
> meta: lines=212 chars=5260 truncated=no


## src/features/javelin/game/scoring.ts
_Defines: DISTANCE_MEASURE_MODE, FOUL_ON_LINE_CROSS, REQUIRE_TIP_FIRST, REQUIRE_SECTOR, SECTOR_ANGLE_DEG, SECTOR_HALF_ANGLE_RAD_

```ts
import { THROW_LINE_X_M } from './constants';
import { clamp } from './math';
import type { ResultKind, ThrowInput } from './types';

const roundTo1 = (value: number): number => Math.round(value * 10) / 10;

export const DISTANCE_MEASURE_MODE = 'throwLineArc' as const;
export const FOUL_ON_LINE_CROSS = true as const;
export const REQUIRE_TIP_FIRST = true as const;
export const REQUIRE_SECTOR = true as const;

export const SECTOR_ANGLE_DEG = 28.96;
export const SECTOR_HALF_ANGLE_RAD = (SECTOR_ANGLE_DEG / 2) * (Math.PI / 180);

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
  throwLineXM = THROW_LINE_X_M
): boolean => {
  const forward = landingTipXM - throwLineXM;
  if (forward <= 0) {
    return false;
  }
  const maxAbsLateral = Math.tan(SECTOR_HALF_ANGLE_RAD) * forward;
  return Math.abs(landingTipZM) <= maxAbsLateral;
};

type LegalityInput = {
  lineCrossedAtRelease: boolean;
  landingTipXM: number;
  landingTipZM: number;
  tipFirst: boolean;
  throwLineXM?: number;
};

export const evaluateThrowLegality = ({
  lineCrossedAtRelease,
  landingTipXM,
  landingTipZM,
  tipFirst,
  throwLineXM = THROW_LINE_X_M
}: LegalityInput): { valid: boolean; resultKind: ResultKind } => {
  if (FOUL_ON_LINE_CROSS && lineCrossedAtRelease) {
    return { valid: false, resultKind: 'foul_line' };
  }
  if (REQUIRE_SECTOR && !isLandingInSector(landingTipXM, landingTipZM, throwLineXM)) {
    return { valid: false, resultKind: 'foul_sector' };
  }
  if (REQUIRE_TIP_FIRST && !tipFirst) {
    return { valid: false, resultKind: 'foul_tip_first' };
  }
  return { valid: true, resultKind: 'valid' };
};

```
> meta: lines=85 chars=2586 truncated=no


## src/features/javelin/game/selectors.ts
_Defines: getSpeedPercent, getAngleDeg, getRunupMeterPhase01, getRunupFeedback, getForcePreviewPercent, getRhythmHotZones_

```ts
import { RHYTHM_TARGET_PHASE01, THROW_LINE_X_M } from './constants';
import { wrap01 } from './math';
import { BEAT_INTERVAL_MS, GOOD_WINDOW_MS, PERFECT_WINDOW_MS } from './tuning';
import type { GameState, TimingQuality } from './types';

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
  return 0;
};

export const getAngleDeg = (state: GameState): number => {
  switch (state.phase.tag) {
    case 'chargeAim':
    case 'throwAnim':
      return state.phase.angleDeg;
    case 'flight':
      return state.phase.launchedFrom.angleDeg;
    case 'idle':
    case 'runup':
    case 'result':
    case 'fault':
    default:
      return state.aimAngleDeg;
  }
};

export const getRunupMeterPhase01 = (state: GameState): number | null => {
  if (state.phase.tag !== 'runup') {
    return null;
  }
  const rawPhase = wrap01((state.nowMs - state.phase.startedAtMs) / BEAT_INTERVAL_MS);
  return wrap01(rawPhase + RHYTHM_TARGET_PHASE01);
};

export const getRunupFeedback = (state: GameState): TimingQuality | null =>
  state.phase.tag === 'runup' ? state.phase.rhythm.lastQuality : null;

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

export const getRhythmHotZones = (): {
  perfect: { start: number; end: number };
  good: { start: number; end: number };
} => {
  const perfectRadius = PERFECT_WINDOW_MS / BEAT_INTERVAL_MS;
  const goodRadius = GOOD_WINDOW_MS / BEAT_INTERVAL_MS;
  return {
    perfect: {
      start: RHYTHM_TARGET_PHASE01 - perfectRadius,
      end: RHYTHM_TARGET_PHASE01 + perfectRadius
    },
    good: {
      start: RHYTHM_TARGET_PHASE01 - goodRadius,
      end: RHYTHM_TARGET_PHASE01 + goodRadius
    }
  };
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
> meta: lines=101 chars=2869 truncated=no

### Gameplay systems


## src/features/javelin/game/tuning.ts
_Defines: GameplayTuning, GAMEPLAY_TUNING, BEAT_INTERVAL_MS, PERFECT_WINDOW_MS, GOOD_WINDOW_MS, SPAM_THRESHOLD_MS_

```ts
import type { MeterWindow } from './types';

type SpeedUpTuning = {
  beatIntervalMs: number;
  perfectWindowMs: number;
  goodWindowMs: number;
  spamThresholdMs: number;
  spamPenaltyMs: number;
  passiveToHalfMs: number;
  passiveMaxSpeedNorm: number;
  hitSpeedDelta: {
    perfect: number;
    good: number;
    miss: number;
    inPenalty: number;
    spam: number;
  };
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

export type GameplayTuning = {
  speedUp: SpeedUpTuning;
  throwPhase: ThrowPhaseTuning;
  movement: MovementTuning;
};

/**
 * Central gameplay tuning values.
 *
 * Difficulty guidance:
 * - Easier speed-up: lower beatIntervalMs, wider perfect/good windows, less negative miss/spam deltas.
 * - Easier throw timing: wider charge windows and/or slower chargeFillDurationMs.
 */
export const GAMEPLAY_TUNING: GameplayTuning = {
  speedUp: {
    beatIntervalMs: 820,
    perfectWindowMs: 120,
    goodWindowMs: 230,
    spamThresholdMs: 130,
    spamPenaltyMs: 220,
    passiveToHalfMs: 3200,
    passiveMaxSpeedNorm: 0.62,
    hitSpeedDelta: {
      perfect: 0.15,
      good: 0.07,
      miss: -0.008,
      inPenalty: -0.025,
      spam: -0.055,
    },
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
    runupSpeedDecayPerSecond: 0.012,
    chargeAimSpeedDecayPerSecond: 0.2,
    chargeAimStopSpeedNorm: 0.03,
    followThroughStepDistanceM: 0.75,
    faultStumbleDistanceM: 0.82,
  },
};

export const BEAT_INTERVAL_MS = GAMEPLAY_TUNING.speedUp.beatIntervalMs;
export const PERFECT_WINDOW_MS = GAMEPLAY_TUNING.speedUp.perfectWindowMs;
export const GOOD_WINDOW_MS = GAMEPLAY_TUNING.speedUp.goodWindowMs;
export const SPAM_THRESHOLD_MS = GAMEPLAY_TUNING.speedUp.spamThresholdMs;
export const SPAM_PENALTY_MS = GAMEPLAY_TUNING.speedUp.spamPenaltyMs;
export const RUNUP_PASSIVE_MAX_SPEED = GAMEPLAY_TUNING.speedUp.passiveMaxSpeedNorm;
export const RUNUP_PASSIVE_TO_HALF_MS = GAMEPLAY_TUNING.speedUp.passiveToHalfMs;

export const RHYTHM_SPEED_DELTA_PERFECT = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.perfect;
export const RHYTHM_SPEED_DELTA_GOOD = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.good;
export const RHYTHM_SPEED_DELTA_MISS = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.miss;
export const RHYTHM_SPEED_DELTA_IN_PENALTY = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.inPenalty;
export const RHYTHM_SPEED_DELTA_SPAM = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.spam;

export const RUNUP_START_X_M = GAMEPLAY_TUNING.movement.runupStartXM;
export const RUNUP_SPEED_DECAY_PER_SECOND = GAMEPLAY_TUNING.movement.runupSpeedDecayPerSecond;
export const CHARGE_AIM_SPEED_DECAY_PER_SECOND = GAMEPLAY_TUNING.movement.chargeAimSpeedDecayPerSecond;
export const CHARGE_AIM_STOP_SPEED_NORM = GAMEPLAY_TUNING.movement.chargeAimStopSpeedNorm;
export const FOLLOW_THROUGH_STEP_DISTANCE_M = GAMEPLAY_TUNING.movement.followThroughStepDistanceM;
export const FAULT_STUMBLE_DISTANCE_M = GAMEPLAY_TUNING.movement.faultStumbleDistanceM;

export const CHARGEAIM_SPEED_DECAY_PER_SECOND = CHARGE_AIM_SPEED_DECAY_PER_SECOND;
export const CHARGEAIM_STOP_SPEED_NORM = CHARGE_AIM_STOP_SPEED_NORM;

export const CHARGE_FILL_DURATION_MS = GAMEPLAY_TUNING.throwPhase.chargeFillDurationMs;
export const CHARGE_MAX_CYCLES = GAMEPLAY_TUNING.throwPhase.chargeMaxCycles;
export const FAULT_JAVELIN_LAUNCH_SPEED_MS = GAMEPLAY_TUNING.throwPhase.faultJavelinLaunchSpeedMs;
export const CHARGE_PERFECT_WINDOW = GAMEPLAY_TUNING.throwPhase.chargePerfectWindow;
export const CHARGE_GOOD_WINDOW = GAMEPLAY_TUNING.throwPhase.chargeGoodWindow;
export const RUN_TO_DRAWBACK_BLEND_MS = GAMEPLAY_TUNING.throwPhase.runToDrawbackBlendMs;
export const THROW_ANIM_DURATION_MS = GAMEPLAY_TUNING.throwPhase.throwAnimDurationMs;
export const THROW_RELEASE_PROGRESS = GAMEPLAY_TUNING.throwPhase.throwReleaseProgress01;

```
> meta: lines=122 chars=4553 truncated=no

### Other code & helpers


## src/features/javelin/game/update.ts
_Defines: createInitialGameState, reduceGameState_

```ts
import {
  ANGLE_DEFAULT_DEG,
  ANGLE_MAX_DEG,
  ANGLE_MIN_DEG,
  JAVELIN_GRIP_OFFSET_M,
  JAVELIN_RELEASE_OFFSET_Y_M,
  RUNUP_MAX_TAPS,
  RUNUP_MAX_X_M,
// ... 45 more import lines from .

const nearestBeatDeltaMs = (startedAtMs: number, atMs: number): number => {
  const elapsed = atMs - startedAtMs;
  const beatIndex = Math.round(elapsed / BEAT_INTERVAL_MS);
  const beatTime = startedAtMs + beatIndex * BEAT_INTERVAL_MS;
  return Math.abs(atMs - beatTime);
};

const timingQualityFromBeatDelta = (deltaMs: number): TimingQuality => {
  if (deltaMs <= PERFECT_WINDOW_MS) {
    return 'perfect';
  }
  if (deltaMs <= GOOD_WINDOW_MS) {
    return 'good';
  }
  return 'miss';
};

const rhythmTapSpeedDelta = (quality: TimingQuality): number => {
  if (quality === 'perfect') {
    return RHYTHM_SPEED_DELTA_PERFECT;
  }
  if (quality === 'good') {
    return RHYTHM_SPEED_DELTA_GOOD;
  }
  return RHYTHM_SPEED_DELTA_MISS;
};

const runStrideHz = (speedNorm: number): number => 1 + speedNorm * 2.2;

const advanceRunAnimT = (currentAnimT: number, dtMs: number, speedNorm: number): number =>
  wrap01(currentAnimT + (Math.max(0, dtMs) / 1000) * runStrideHz(speedNorm));

const passiveSpeedTarget = (startedAtMs: number, nowMs: number): number => {
  const elapsedMs = Math.max(0, nowMs - startedAtMs);
  const t = clamp(elapsedMs / RUNUP_PASSIVE_TO_HALF_MS, 0, 1);
  return RUNUP_PASSIVE_MAX_SPEED * easeOutQuad(t);
};

const runSpeedMsFromNorm = (speedNorm: number): number =>
  RUNUP_SPEED_MIN_MS + (RUNUP_SPEED_MAX_MS - RUNUP_SPEED_MIN_MS) * speedNorm;

const isRunning = (speedNorm: number): boolean => speedNorm > 0.01;
const FALL_ANIM_DURATION_MS = 340;

const followThroughStepOffsetM = (animT: number): number => {
  const t = clamp(animT, 0, 1);
  const step01 = t < 0.78 ? easeOutQuad(t / 0.78) : 1;
  return FOLLOW_THROUGH_STEP_DISTANCE_M * step01;
};

const faultStumbleOffsetM = (animT: number): number => {
  const t = clamp(animT, 0, 1);
  const step01 = t < 0.72 ? easeOutQuad(t / 0.72) : 1;
  return FAULT_STUMBLE_DISTANCE_M * step01;
};

const createFaultJavelinFromCharge = (
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

const lateralVelocityFromRelease = (
  quality: TimingQuality,
  angleDeg: number,
  roundId: number
): number => {
  const qualityBase = quality === 'perfect' ? 0.1 : quality === 'good' ? 0.45 : 0.95;
  const sign = roundId % 2 === 0 ? 1 : -1;
  const angleBias = ((angleDeg - ANGLE_DEFAULT_DEG) / 18) * 0.55;
  return sign * qualityBase + angleBias;
};

const createLateReleaseFaultPhase = (
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

export const createInitialGameState = (): GameState => ({
  nowMs: performance.now(),
  roundId: 0,
  windMs: 0,
  aimAngleDeg: ANGLE_DEFAULT_DEG,
  phase: { tag: 'idle' }
});

const tickFault = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'fault') {
    return state;
  }

  const nextFaultAnimT = clamp(
    state.phase.athletePose.animT + dtMs / FALL_ANIM_DURATION_MS,
    0,
    1
  );
  const stumbleDeltaM =
    faultStumbleOffsetM(nextFaultAnimT) - faultStumbleOffsetM(state.phase.athletePose.animT);
  const javelinUpdate = state.phase.javelinLanded
    ? null
    : updatePhysicalJavelin(state.phase.javelin, dtMs, state.windMs);

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

const tickRunup = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'runup') {
    return state;
  }

  const hasStartedRunup = state.phase.rhythm.firstTapAtMs !== null;
  const passiveTarget =
    state.phase.rhythm.firstTapAtMs === null
      ? 0
      : passiveSpeedTarget(state.phase.rhythm.firstTapAtMs, nowMs);
  const speedAfterDecay = clamp(
    state.phase.speedNorm - (dtMs / 1000) * RUNUP_SPEED_DECAY_PER_SECOND,
    0,
    1
  );
  const speedNorm = Math.max(speedAfterDecay, passiveTarget);
  const runSpeedMs = hasStartedRunup ? runSpeedMsFromNorm(speedNorm) : 0;
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

const tickChargeAim = (state: GameState, dtMs: number, nowMs: number): GameState => {
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

const tickThrowAnim = (state: GameState, dtMs: number, nowMs: number): GameState => {
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

const tickFlight = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'flight') {
    return state;
  }

  const nextFollowAnimT = clamp(state.phase.athletePose.animT + dtMs / 650, 0, 1);
  const stepDeltaM =
    followThroughStepOffsetM(nextFollowAnimT) -
    followThroughStepOffsetM(state.phase.athletePose.animT);
  const athleteXM = state.phase.athleteXM + stepDeltaM;
  const updated = updatePhysicalJavelin(state.phase.javelin, dtMs, state.windMs);
  if (updated.landed) {
    const landingTipXM = updated.landingTipXM ?? updated.javelin.xM;
    const landingTipZM = updated.landingTipZM ?? updated.javelin.zM;
    const distanceM = computeCompetitionDistanceM(landingTipXM);
    const legality = evaluateThrowLegality({
      lineCrossedAtRelease: state.phase.launchedFrom.lineCrossedAtRelease,
      landingTipXM,
      landingTipZM,
      tipFirst: updated.tipFirst === true
    });

    return {
      ...state,
      phase: {
        tag: 'result',
        athleteXM,
        distanceM,
        isHighscore: false,
        resultKind: legality.resultKind,
        tipFirst: updated.tipFirst,
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

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'startRound': {
      return {
        ...state,
        nowMs: action.atMs,
        roundId: state.roundId + 1,
        windMs: action.windMs,
        phase: {
          tag: 'runup',
          speedNorm: 0,
          startedAtMs: action.atMs,
          tapCount: 0,
          runupDistanceM: RUNUP_START_X_M,
          rhythm: {
            firstTapAtMs: null,
            lastTapAtMs: null,
            perfectHits: 0,
            goodHits: 0,
            penaltyUntilMs: 0,
            lastQuality: null,
            lastQualityAtMs: 0
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
      const inPenalty = action.atMs < phase.rhythm.penaltyUntilMs;
      const tapInterval =
        phase.rhythm.lastTapAtMs === null
          ? Number.POSITIVE_INFINITY
          : action.atMs - phase.rhythm.lastTapAtMs;
      const isSpam = tapInterval < SPAM_THRESHOLD_MS;
      const beatDelta = nearestBeatDeltaMs(phase.startedAtMs, action.atMs);
      const quality = timingQualityFromBeatDelta(beatDelta);
      const baseDelta = isSpam
        ? RHYTHM_SPEED_DELTA_SPAM
        : inPenalty
          ? RHYTHM_SPEED_DELTA_IN_PENALTY
          : rhythmTapSpeedDelta(quality);
      const speedNorm = clamp(phase.speedNorm + baseDelta, 0, 1);
      const perfectHits = phase.rhythm.perfectHits + (quality === 'perfect' ? 1 : 0);
      const goodHits = phase.rhythm.goodHits + (quality !== 'miss' ? 1 : 0);
      const penaltyUntilMs = isSpam ? action.atMs + SPAM_PENALTY_MS : phase.rhythm.penaltyUntilMs;

      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          ...phase,
          speedNorm,
          tapCount: Math.min(phase.tapCount + 1, RUNUP_MAX_TAPS),
          rhythm: {
            firstTapAtMs: phase.rhythm.firstTapAtMs ?? action.atMs,
            lastTapAtMs: action.atMs,
            perfectHits,
            goodHits,
            penaltyUntilMs,
            lastQuality: isSpam ? 'miss' : quality,
            lastQualityAtMs: action.atMs
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
      if (state.phase.tag === 'idle' || state.phase.tag === 'result') {
        return state;
      }

      const nextState: GameState = { ...state, nowMs: action.nowMs };
      switch (nextState.phase.tag) {
        case 'fault':
          return tickFault(nextState, action.dtMs);
        case 'runup':
          return tickRunup(nextState, action.dtMs, action.nowMs);
        case 'chargeAim':
          return tickChargeAim(nextState, action.dtMs, action.nowMs);
        case 'throwAnim':
          return tickThrowAnim(nextState, action.dtMs, action.nowMs);
        case 'flight':
          return tickFlight(nextState, action.dtMs);
        default:
          return nextState;
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
> meta: lines=661 chars=19185 truncated=no


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
import { HIGHSCORE_STORAGE_KEY, MAX_HIGHSCORES } from '../game/constants';
import type { HighscoreEntry } from '../game/types';

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

export const loadHighscores = (): HighscoreEntry[] => {
  const raw = localStorage.getItem(HIGHSCORE_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as HighscoreEntry[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter(
        (item) =>
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.distanceM === 'number' &&
          typeof item.playedAtIso === 'string'
      )
      .sort(compareHighscores)
      .slice(0, MAX_HIGHSCORES);
  } catch {
    return [];
  }
};

export const saveHighscores = (entries: HighscoreEntry[]): void => {
  localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(entries));
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
> meta: lines=91 chars=2522 truncated=no


## src/features/javelin/hooks/usePointerControls.ts
_Reusable hook / shared state or side-effect logic._

```ts
import { useEffect, useRef } from 'react';
import { resumeAudioContext } from '../game/audio';
import { keyboardAngleDelta, pointerFromAnchorToAngleDeg } from '../game/controls';
import { getPlayerAngleAnchorScreen } from '../game/render';
import type { GameAction, GamePhase, GameState } from '../game/types';

type Dispatch = (action: GameAction) => void;

type UsePointerControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  phaseTag: GamePhase['tag'];
  state: GameState;
};

export const usePointerControls = ({ canvas, dispatch, phaseTag, state }: UsePointerControlsArgs): void => {
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const now = (): number => performance.now();
    let longPressTimer: number | null = null;
    const LONG_PRESS_MS = 300;
    const clearLongPressTimer = (): void => {
      if (longPressTimer !== null) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };
    const dispatchAngleFromPointer = (clientX: number, clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      const anchor = getPlayerAngleAnchorScreen(stateRef.current, rect.width, rect.height);
      dispatch({
        type: 'setAngle',
        angleDeg: pointerFromAnchorToAngleDeg(
          clientX,
          clientY,
          rect.left + anchor.x,
          rect.top + anchor.y
        )
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

    const onTouchStart = (event: TouchEvent): void => {
      event.preventDefault();
      resumeAudioContext();
      const currentPhaseTag = stateRef.current.phase.tag;
      if (currentPhaseTag === 'runup') {
        dispatch({ type: 'rhythmTap', atMs: now() });
        clearLongPressTimer();
        longPressTimer = window.setTimeout(() => {
          if (stateRef.current.phase.tag === 'runup') {
            dispatch({ type: 'beginChargeAim', atMs: now() });
          }
          longPressTimer = null;
        }, LONG_PRESS_MS);
        return;
      }
      if (currentPhaseTag === 'idle' || currentPhaseTag === 'result') {
        dispatch({ type: 'rhythmTap', atMs: now() });
      }
    };

    const onTouchEnd = (): void => {
      clearLongPressTimer();
      if (stateRef.current.phase.tag === 'chargeAim') {
        dispatch({ type: 'releaseCharge', atMs: now() });
      }
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

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.code === 'Space' && !event.repeat) {
        resumeAudioContext();
        event.preventDefault();
        dispatch({ type: 'rhythmTap', atMs: now() });
        return;
      }
      if (event.code === 'Enter' && !event.repeat) {
        resumeAudioContext();
        event.preventDefault();
        if (phaseTag === 'runup') {
          dispatch({ type: 'beginChargeAim', atMs: now() });
        }
        return;
      }
      if (event.code === 'ArrowUp') {
        event.preventDefault();
        dispatch({ type: 'adjustAngle', deltaDeg: keyboardAngleDelta('up') });
        return;
      }
      if (event.code === 'ArrowDown') {
        event.preventDefault();
        dispatch({ type: 'adjustAngle', deltaDeg: keyboardAngleDelta('down') });
      }
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      if (event.code === 'Enter') {
        event.preventDefault();
        dispatch({ type: 'releaseCharge', atMs: now() });
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      clearLongPressTimer();
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [canvas, dispatch, phaseTag]);
};

```
> meta: lines=182 chars=6189 truncated=no


## src/features/javelin/JavelinPage.tsx
_Defines: JavelinPage_

```tsx
import { useEffect, useMemo, useReducer, useState, type ReactElement } from 'react';
import { LanguageSwitch } from './components/LanguageSwitch';
import { HudPanel } from './components/HudPanel';
import { GameCanvas } from './components/GameCanvas';
import { ScoreBoard } from './components/ScoreBoard';
import { ControlHelp } from './components/ControlHelp';
import { gameReducer } from './game/reducer';
import { WIND_MAX_MS, WIND_MIN_MS } from './game/constants';
// ... 5 more import lines from ., .., react

const randomWind = (): number =>
  Math.round((WIND_MIN_MS + Math.random() * (WIND_MAX_MS - WIND_MIN_MS)) * 10) / 10;

const faultReasonKey = (reason: FaultReason): string => `result.fault.${reason}`;

export const JavelinPage = (): ReactElement => {
  const { t, formatNumber, locale } = useI18n();
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [nameInput, setNameInput] = useState('AAA');
  const [savedRoundId, setSavedRoundId] = useState<number>(-1);
  const { highscores, addHighscore, clearHighscores, isHighscore } = useLocalHighscores();

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
      return '';
    }
    if (state.phase.resultKind !== 'valid') {
      return t('result.notSavedInvalid');
    }
    if (!state.phase.isHighscore) {
      return t('result.notHighscore');
    }
    return '';
  }, [state.phase, t]);

  const canSaveScore =
    state.phase.tag === 'result' &&
    state.phase.resultKind === 'valid' &&
    state.phase.isHighscore &&
    savedRoundId !== state.roundId;
  const resultDistanceM = state.phase.tag === 'result' ? state.phase.distanceM : null;

  const isFoulMessage =
    state.phase.tag === 'fault' ||
    (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) ||
    (state.phase.tag === 'result' && state.phase.resultKind !== 'valid');

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">{t('app.title')}</p>
          <h1>{t('javelin.title')}</h1>
        </div>
        <LanguageSwitch />
      </header>

      <section className="layout">
        <div className="main-column">
          <HudPanel state={state} />
          <GameCanvas state={state} dispatch={dispatch} />
          <div className="actions">
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: 'startRound',
                  atMs: performance.now(),
                  windMs: randomWind()
                })
              }
            >
              {state.phase.tag === 'idle' ? t('action.start') : t('action.playAgain')}
            </button>
            <button type="button" className="ghost" onClick={() => dispatch({ type: 'resetToIdle' })}>
              {t('phase.idle')}
            </button>
          </div>

          <p
            className={`result-live ${isFoulMessage ? 'is-foul' : ''}`}
            aria-live="polite"
          >
            {resultMessage}
          </p>
          {resultStatusMessage && (
            <p className={`result-note ${isFoulMessage ? 'is-foul' : ''}`}>{resultStatusMessage}</p>
          )}

          {canSaveScore && state.phase.tag === 'result' && (
            <form
              className="save-form"
              onSubmit={(event) => {
                event.preventDefault();
                addHighscore({
                  id: crypto.randomUUID(),
                  name: nameInput.trim().slice(0, 10) || 'PLAYER',
                  distanceM: resultDistanceM ?? 0,
                  playedAtIso: new Date().toISOString(),
                  locale,
                  windMs: state.windMs
                });
                setSavedRoundId(state.roundId);
              }}
            >
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
          )}
          {state.phase.tag === 'result' && state.phase.resultKind === 'valid' && state.phase.isHighscore && (
            <div className="badge">{t('result.highscore')}</div>
          )}
        </div>

        <aside className="side-column">
          <ControlHelp />
          <ScoreBoard highscores={highscores} />
          <button type="button" className="ghost" onClick={clearHighscores}>
            {t('action.resetScores')}
          </button>
        </aside>
      </section>
    </main>
  );
};

```
> meta: lines=177 chars=6262 truncated=no


## src/i18n/init.tsx
_Defines: I18nProvider, useI18n_

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactElement
// ... 3 more import lines from ., .., react

const LOCALE_STORAGE_KEY = 'sg2026-javelin-locale-v1';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  formatNumber: (value: number, maxFractionDigits?: number) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const detectLocale = (): Locale => {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'fi' || stored === 'sv' || stored === 'en') {
    return stored;
  }
  const browserLocale = navigator.language.toLowerCase();
  if (browserLocale.startsWith('fi')) {
    return 'fi';
  }
  if (browserLocale.startsWith('sv')) {
    return 'sv';
  }
  return 'en';
};

export const I18nProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string): string => resources[locale][key] ?? resources.en[key] ?? key,
    [locale]
  );

  const formatNumber = useCallback(
    (value: number, maxFractionDigits = 1): string =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: maxFractionDigits }).format(value),
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
> meta: lines=71 chars=1909 truncated=no


## src/i18n/resources.ts
_Defines: Messages, resources_

```ts
import type { Locale } from '../features/javelin/game/types';

export type Messages = Record<string, string>;

export const resources: Record<Locale, Messages> = {
  fi: {
    'app.title': 'Selain Games 2026',
    'javelin.title': 'Keihäänheitto',
    'javelin.runupHint': 'Ajoita klikkaukset vihreään alueeseen. Heittoviivalle',
    'javelin.throwLine': 'Heittoviiva',
    'javelin.speedPassiveHint': 'Perusvauhti kasvaa myös ilman klikkejä.',
    'javelin.windHintHeadwind': 'Vastatuuli - tähtää korkeammalle',
    'javelin.windHintTailwind': 'Myötätuuli - matalampi kulma kantaa pidemmälle',
    'javelin.landingTipFirst': 'Kärki edellä',
    'javelin.landingFlat': 'Litteä alastulo',
    'javelin.result.foul_line': 'Hylätty: viiva ylitetty',
    'javelin.result.foul_sector': 'Hylätty: sektorin ulkopuolella',
    'javelin.result.foul_tip_first': 'Hylätty: kärki ei osunut ensin',
    'phase.idle': 'Valmis',
    'phase.runup': 'Kiihdytä rytmillä',
    'phase.chargeAim': 'Pidä heittovoimaa',
    'phase.throwAnim': 'Heittoliike',
    'phase.flight': 'Keihäs ilmassa',
    'phase.result': 'Tulos valmis',
    'phase.fault': 'Virheheitto',
    'hud.speed': 'Vauhti',
    'hud.angle': 'Kulma',
    'hud.wind': 'Tuuli',
    'hud.rhythm': 'Rytmi',
    'hud.force': 'Voima',
    'hud.perfect': 'Täydellinen',
    'hud.good': 'Hyvä',
    'hud.miss': 'Huti',
    'javelin.attempt': 'Yritys',
    'javelin.sessionBest': 'Paras',
    'action.start': 'Aloita kierros',
    'action.playAgain': 'Uusi kierros',
    'action.nextAttempt': 'Seuraava yritys',
    'action.newSession': 'Uusi sarja (6 yritystä)',
    'action.saveScore': 'Tallenna',
    'action.resetScores': 'Nollaa taulukko',
    'help.title': 'Ohjaus',
    'help.mouse1': 'Vasen klikki: rytmipainallus',
    'help.mouse2': 'Oikea painike alas: aloita tähtäys',
    'help.mouse3': 'Liikuta hiirtä ylös/alas: säädä kulmaa',
    'help.mouse4': 'Oikea painike ylös: vapauta heitto',
    'help.kbd1': 'Space: rytmipainallus',
    'help.kbd2': 'Enter alas: aloita tähtäys',
    'help.kbd3': 'Nuoli ylös/alas: kulma',
    'help.kbd4': 'Enter ylös: vapauta heitto',
    'help.touch1': 'Napauta: kiihdytä rytmillä',
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
    'scoreboard.empty': 'Ei vielä tuloksia.',
    'language.label': 'Kieli'
  },
  sv: {
    'app.title': 'Browser Games 2026',
    'javelin.title': 'Spjutkastning',
    'javelin.runupHint': 'Tajma klicken till det gröna området. Kvar till linjen',
    'javelin.throwLine': 'Kastlinje',
    'javelin.speedPassiveHint': 'Grundfarten ökar även utan klick.',
    'javelin.windHintHeadwind': 'Motvind - sikta högre för distans',
    'javelin.windHintTailwind': 'Medvind - lägre vinkel bär längre',
    'javelin.landingTipFirst': 'Spetsen först',
    'javelin.landingFlat': 'Platt landning',
    'javelin.result.foul_line': 'Ogiltigt: linjen överträdd',
    'javelin.result.foul_sector': 'Ogiltigt: utanför sektorn',
    'javelin.result.foul_tip_first': 'Ogiltigt: spetsen landade inte först',
    'phase.idle': 'Klar',
    'phase.runup': 'Bygg fart i rytm',
    'phase.chargeAim': 'Ladda kastkraft',
    'phase.throwAnim': 'Kaströrelse',
    'phase.flight': 'Spjutet flyger',
    'phase.result': 'Resultat klart',
    'phase.fault': 'Övertramp',
    'hud.speed': 'Fart',
    'hud.angle': 'Vinkel',
    'hud.wind': 'Vind',
    'hud.rhythm': 'Rytm',
    'hud.force': 'Kraft',
    'hud.perfect': 'Perfekt',
    'hud.good': 'Bra',
    'hud.miss': 'Miss',
    'javelin.attempt': 'Försök',
    'javelin.sessionBest': 'Bästa',
    'action.start': 'Starta runda',
    'action.playAgain': 'Ny runda',
    'action.nextAttempt': 'Nästa försök',
    'action.newSession': 'Ny serie (6 försök)',
    'action.saveScore': 'Spara',
    'action.resetScores': 'Nollställ listan',
    'help.title': 'Styrning',
    'help.mouse1': 'Vänsterklick: rytmtryck',
    'help.mouse2': 'Högerknapp ned: börja sikta',
    'help.mouse3': 'Mus upp/ner: justera vinkel',
    'help.mouse4': 'Högerknapp upp: släpp kastet',
    'help.kbd1': 'Space: rytmtryck',
    'help.kbd2': 'Enter ned: börja sikta',
    'help.kbd3': 'Pil upp/ner: vinkel',
    'help.kbd4': 'Enter upp: släpp kastet',
    'help.touch1': 'Tryck: bygg rytmfart',
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
    'scoreboard.empty': 'Inga resultat än.',
    'language.label': 'Språk'
  },
  en: {
    'app.title': 'Browser Games 2026',
    'javelin.title': 'Javelin Throw',
    'javelin.runupHint': 'Time clicks to the green zone. Distance to line',
    'javelin.throwLine': 'Throw Line',
    'javelin.speedPassiveHint': 'Base speed also builds without clicking.',
    'javelin.windHintHeadwind': 'Headwind - aim higher for distance',
    'javelin.windHintTailwind': 'Tailwind - lower angle carries further',
    'javelin.landingTipFirst': 'Tip-first landing',
    'javelin.landingFlat': 'Flat landing',
    'javelin.result.foul_line': 'Foul: line crossed',
    'javelin.result.foul_sector': 'Foul: outside sector',
    'javelin.result.foul_tip_first': 'Foul: tip did not land first',
    'phase.idle': 'Ready',
    'phase.runup': 'Build speed on rhythm',
    'phase.chargeAim': 'Charge throw force',
    'phase.throwAnim': 'Throw animation',
    'phase.flight': 'Javelin in flight',
    'phase.result': 'Result ready',
    'phase.fault': 'Fault throw',
    'hud.speed': 'Speed',
    'hud.angle': 'Angle',
    'hud.wind': 'Wind',
    'hud.rhythm': 'Rhythm',
    'hud.force': 'Force',
    'hud.perfect': 'Perfect',
    'hud.good': 'Good',
    'hud.miss': 'Miss',
    'javelin.attempt': 'Attempt',
    'javelin.sessionBest': 'Best',
    'action.start': 'Start round',
    'action.playAgain': 'Play again',
    'action.nextAttempt': 'Next Attempt',
    'action.newSession': 'New Session (6 attempts)',
    'action.saveScore': 'Save',
    'action.resetScores': 'Reset board',
    'help.title': 'Controls',
    'help.mouse1': 'Left click: rhythm tap',
    'help.mouse2': 'Right button down: begin charge',
    'help.mouse3': 'Move mouse up/down: adjust angle',
    'help.mouse4': 'Right button up: release throw',
    'help.kbd1': 'Space: rhythm tap',
    'help.kbd2': 'Enter down: begin charge',
    'help.kbd3': 'Arrow up/down: angle',
    'help.kbd4': 'Enter up: release throw',
    'help.touch1': 'Tap: build rhythm speed',
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
    'scoreboard.empty': 'No scores yet.',
    'language.label': 'Language'
  }
};

```
> meta: lines=190 chars=8078 truncated=no


## src/index.css

```css
:root {
  color-scheme: light;
  font-family: 'Trebuchet MS', 'Avenir Next', 'Segoe UI', sans-serif;
  line-height: 1.35;
  font-weight: 500;
  text-rendering: optimizeLegibility;
  --bg-main: #f2fbff;
  --bg-card: rgba(255, 255, 255, 0.82);
  --text-main: #0e2b42;
  --text-soft: #4a657b;
  --accent: #008f55;
  --accent-strong: #0064be;
  --warning: #bc3c2a;
  --shadow: 0 18px 40px rgba(14, 43, 66, 0.16);
  --radius: 20px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: var(--text-main);
  background:
    radial-gradient(circle at 20% 10%, rgba(84, 196, 255, 0.28), transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(255, 201, 101, 0.24), transparent 30%),
    linear-gradient(135deg, #e7f8ff 0%, #f6fff2 100%);
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid #003f77;
  outline-offset: 2px;
}

.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}

.topbar {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.eyebrow {
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-soft);
  font-size: 0.8rem;
}

h1 {
  margin: 0;
  font-size: clamp(1.7rem, 3.4vw, 2.5rem);
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.main-column,
.side-column {
  display: grid;
  gap: 12px;
  align-content: start;
}

.card {
  background: var(--bg-card);
  border: 2px solid rgba(19, 73, 116, 0.12);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(2px);
}

.hud-panel {
  padding: 12px 16px;
}

.hud-topline {
  font-weight: 800;
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hud-hint {
  font-size: 0.84rem;
  color: var(--text-soft);
  margin-bottom: 8px;
}

.hud-hint-wind {
  color: #0f4e7a;
  font-weight: 700;
}

.hud-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.hud-item {
  padding: 6px 10px;
  border-radius: 12px;
  background: rgba(0, 100, 190, 0.09);
  display: grid;
  gap: 2px;
}

.hud-item span {
  font-size: 0.82rem;
  color: var(--text-soft);
}

.hud-item strong {
  font-size: 1.2rem;
}

.release-box {
  margin-top: 10px;
  display: grid;
  gap: 2px;
}

.release-box progress {
  width: 100%;
  height: 8px;
}

.meter-row {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.timing-meter {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 14px;
  background: rgba(11, 61, 98, 0.08);
  border: 1px solid rgba(8, 52, 87, 0.14);
}

.timing-meter svg {
  width: 94px;
  height: 94px;
}

.timing-track {
  fill: none;
  stroke: rgba(11, 34, 56, 0.2);
  stroke-width: 8;
}

.timing-zone {
  fill: none;
  stroke-linecap: round;
}

.zone-good {
  stroke: rgba(30, 142, 247, 0.7);
  stroke-width: 8;
}

.zone-perfect {
  stroke: rgba(18, 196, 119, 0.95);
  stroke-width: 9;
}

.timing-cursor {
  fill: #f6d255;
  stroke: #0f3b61;
  stroke-width: 2;
}

.timing-meter-meta {
  display: grid;
  gap: 2px;
}

.timing-meter-meta span {
  color: var(--text-soft);
  font-size: 0.83rem;
}

.timing-meter-meta strong {
  font-size: 1rem;
}

.timing-meter-meta small {
  color: #0e4f77;
  font-weight: 700;
}

.timing-meter.feedback-perfect {
  background: rgba(18, 196, 119, 0.16);
}

.timing-meter.feedback-good {
  background: rgba(30, 142, 247, 0.13);
}

.timing-meter.is-active {
  border-color: rgba(11, 92, 163, 0.45);
  box-shadow: inset 0 0 0 1px rgba(11, 92, 163, 0.18);
}

.canvas-frame {
  border-radius: var(--radius);
  overflow: hidden;
  border: 2px solid rgba(8, 52, 87, 0.2);
}

.game-canvas {
  width: 100%;
  height: min(54vh, 460px);
  display: block;
  background: #dff5ff;
  touch-action: none;
}

.actions {
  display: flex;
  gap: 10px;
}

.attempt-counter,
.session-best {
  display: inli

// [TRUNCATED at 4000 chars]

```
> NOTE: Truncated to 4000 chars (original: 6316).
> meta: lines=406 chars=6316 truncated=yes

### Entry points & app wiring


## src/main.tsx

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { I18nProvider } from './i18n/init';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);

```
> meta: lines=20 chars=425 truncated=no

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

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/Javelin/' : '/',
  test: {
    environment: 'node'
  }
});

```
> meta: lines=11 chars=230 truncated=no


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
import { pointerFromAnchorToAngleDeg } from './controls';

describe('pointerFromAnchorToAngleDeg', () => {
  it('maps points above/below anchor to expected vertical angles', () => {
    const top = pointerFromAnchorToAngleDeg(300, 100, 300, 300);
    const middle = pointerFromAnchorToAngleDeg(500, 300, 300, 300);
    const bottom = pointerFromAnchorToAngleDeg(300, 500, 300, 300);

    expect(top).toBe(90);
    expect(middle).toBe(0);
    expect(bottom).toBe(-90);
  });

  it('responds strongly when pointer is close to anchor horizontally', () => {
    const nearAnchor = pointerFromAnchorToAngleDeg(302, 250, 300, 300);
    const farAnchor = pointerFromAnchorToAngleDeg(520, 250, 300, 300);

    expect(nearAnchor).toBeGreaterThan(farAnchor);
    expect(nearAnchor).toBeGreaterThan(80);
  });
});

```
> meta: lines=23 chars=850 truncated=no


## src/features/javelin/game/physics.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  computeLaunchSpeedMs,
  createPhysicalJavelin,
  updatePhysicalJavelin
} from './physics';
import { computeCompetitionDistanceM, evaluateThrowLegality } from './scoring';

const simulateDistanceFromLine = (
  speedNorm: number,
  forceNorm: number,
  angleDeg: number,
  windMs: number,
  athleteXM: number
): { distanceM: number; tipFirst: boolean; inSector: boolean } => {
  const athleteForwardMs = 1.8 + speedNorm * 4.5;
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
    const step = updatePhysicalJavelin(javelin, 16, windMs);
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
        inSector: legality.resultKind !== 'foul_sector'
      };
    }
  }

  return {
    distanceM: 0,
    tipFirst: false,
    inSector: false
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

  it('orientation trends downward after apex', () => {
    let javelin = createPhysicalJavelin({
      xM: 2.8,
      yM: 1.7,
      zM: 0,
      launchAn

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 4860).
> meta: lines=172 chars=4860 truncated=yes


## src/features/javelin/game/reducer.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  RUNUP_MAX_X_M,
  THROW_LINE_X_M
} from './constants';
import { gameReducer } from './reducer';
import {
  BEAT_INTERVAL_MS,
// ... 8 more import lines from ., vitest

describe('gameReducer', () => {
  it('starts a round into runup', () => {
    const state = createInitialGameState();
    const next = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 1.2 });
    expect(next.phase.tag).toBe('runup');
    expect(next.windMs).toBe(1.2);
  });

  it('stays still before first tap and then builds passive speed', () => {
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
    state = gameReducer(state, {
      type: 'tick',
      dtMs: RUNUP_PASSIVE_TO_HALF_MS,
      nowMs: 3200 + RUNUP_PASSIVE_TO_HALF_MS
    });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.speedNorm).toBeCloseTo(RUNUP_PASSIVE_MAX_SPEED, 2);
    }
  });

  it('perfect timing tap boosts speed above passive baseline', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1300 });
    state = gameReducer(state, {
      type: 'tick',
      dtMs: RUNUP_PASSIVE_TO_HALF_MS,
      nowMs: 1300 + RUNUP_PASSIVE_TO_HALF_MS
    });
    const baseline = state.phase.tag === 'runup' ? state.phase.speedNorm : 0;
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1000 + BEAT_INTERVAL_MS * 6 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.speedNorm).toBeGreaterThan(baseline);
    }
  });

  it('spam tapping is penalized', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    const speedAfterFirst = state.phase.tag === 'runup' ? state.phase.speedNorm : 0;
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1940 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.speedNorm).toBeLessThan(speedAfterFirst);
    }
  });

  it('runup locomotion advances and can cross throw line', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 130

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 13664).
> meta: lines=319 chars=13489 truncated=yes


## src/features/javelin/game/render.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { computeAthletePoseGeometry } from './athletePose';
import { getCameraTargetX, getHeadMeterScreenAnchor, getVisibleJavelinRenderState } from './render';
import { RUNUP_START_X_M } from './tuning';
import type { GameState } from './types';

const baseState: Pick<GameState, 'nowMs' | 'roundId' | 'windMs' | 'aimAngleDeg'> = {
  nowMs: 2000,
  roundId: 1,
  windMs: 0.2,
  aimAngleDeg: 18
};

describe('javelin visibility state', () => {
  it('is attached during runup and charge', () => {
    const runupState: GameState = {
      ...baseState,
      phase: {
        tag: 'runup',
        speedNorm: 0.6,
        startedAtMs: 1000,
        tapCount: 4,
        runupDistanceM: 10,
        rhythm: {
          firstTapAtMs: 1200,
          lastTapAtMs: 1880,
          perfectHits: 2,
          goodHits: 3,
          penaltyUntilMs: 0,
          lastQuality: 'good',
          lastQualityAtMs: 1880
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

  it('switches to flight mode after release', () => {
    const flightState: GameState = {
      ...baseState,
      phase: {
        tag: 'flight',
        athleteXM: 17.9,
        javelin: {
          xM: 20,
          yM: 6.1,
          zM: 0.3,
          vxMs: 18,
          vyMs: 4,
          vzMs: 0.1,
          angleRad: 0.2,
          angularVelRad: 0.3,
          releasedAtMs: 1900,
          lengthM: 2.6
        },
        launchedFrom: {
          speedNorm: 0.83,
          angleDeg: 35,
          forceNorm: 0.9,
          windMs: 0.2,
          launchSpeedMs: 28,
        

// [TRUNCATED at 3000 chars]

```
> NOTE: Truncated to 3000 chars (original: 5813).
> meta: lines=203 chars=5813 truncated=yes


## src/features/javelin/game/scoring.test.ts

```ts
import { describe, expect, it } from 'vitest';
import {
  angleEfficiency,
  computeCompetitionDistanceM,
  computeThrowDistance,
  evaluateThrowLegality,
  isLandingInSector,
  releaseEfficiency,
// ... 2 more import lines from ., vitest

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
});

```
> meta: lines=84 chars=2351 truncated=no


## src/features/javelin/game/selectors.test.ts

```ts
import { describe, expect, it } from 'vitest';
import { RHYTHM_TARGET_PHASE01 } from './constants';
import { getRunupMeterPhase01 } from './selectors';
import { BEAT_INTERVAL_MS } from './tuning';
import type { GameState } from './types';

const makeRunupState = (nowMs: number, startedAtMs: number): GameState => ({
  nowMs,
  roundId: 1,
  windMs: 0,
  aimAngleDeg: 36,
  phase: {
    tag: 'runup',
    speedNorm: 0.3,
    startedAtMs,
    tapCount: 1,
    runupDistanceM: 0,
    rhythm: {
      firstTapAtMs: startedAtMs + 20,
      lastTapAtMs: startedAtMs + 20,
      perfectHits: 0,
      goodHits: 0,
      penaltyUntilMs: 0,
      lastQuality: null,
      lastQualityAtMs: startedAtMs + 20
    },
    athletePose: {
      animTag: 'run',
      animT: 0
    }
  }
});

describe('runup meter phase', () => {
  it('reaches target phase at beat boundaries', () => {
    const startedAtMs = 1000;
    const nowMs = startedAtMs + BEAT_INTERVAL_MS * 3;
    const phase = getRunupMeterPhase01(makeRunupState(nowMs, startedAtMs));
    expect(phase).not.toBeNull();
    expect(phase).toBeCloseTo(RHYTHM_TARGET_PHASE01, 1);
  });
});

```
> meta: lines=43 chars=1131 truncated=no


## src/features/javelin/hooks/useLocalHighscores.test.ts
_Reusable hook / shared state or side-effect logic._

```ts
import { describe, expect, it } from 'vitest';
import { insertHighscoreSorted, pruneHighscores } from './useLocalHighscores';
import type { HighscoreEntry } from '../game/types';

const makeEntry = (name: string, distanceM: number, playedAtIso: string): HighscoreEntry => ({
  id: `${name}-${distanceM}`,
  name,
  distanceM,
  playedAtIso,
  locale: 'fi',
  windMs: 0
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
});

```
> meta: lines=37 chars=1305 truncated=no
