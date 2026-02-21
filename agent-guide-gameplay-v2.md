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

Change the play-again button to show "Next attempt" vs "New session":

```tsx
<button onClick={() => {
  if (state.attemptNumber >= state.attemptsTotal) {
    dispatch({ type: 'startSession', attempts: 6 });
  }
  dispatch({ type: 'startRound', atMs: performance.now(), windMs: randomWind() });
}}>
  {state.attemptNumber >= state.attemptsTotal
    ? t('action.newSession')
    : state.phase.tag === 'idle'
      ? t('action.start')
      : t('action.nextAttempt')}
</button>
```

### 5g. Add i18n keys

**en/common.json:**
```json
"javelin.attempt": "Attempt",
"javelin.sessionBest": "Best",
"action.nextAttempt": "Next Attempt",
"action.newSession": "New Session (6 attempts)"
```

**fi/common.json:**
```json
"javelin.attempt": "Yritys",
"javelin.sessionBest": "Paras",
"action.nextAttempt": "Seuraava yritys",
"action.newSession": "Uusi sarja (6 yritystä)"
```

**sv/common.json:**
```json
"javelin.attempt": "Försök",
"javelin.sessionBest": "Bästa",
"action.nextAttempt": "Nästa försök",
"action.newSession": "Ny serie (6 försök)"
```

### 5h. Tests

```ts
it('prevents starting round beyond max attempts', () => {
  let state = createInitialGameState();
  state = { ...state, attemptsTotal: 2, attemptNumber: 2 };
  const next = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
  expect(next.phase.tag).toBe('idle'); // blocked
});

it('tracks session best across attempts', () => {
  // Simulate two throws landing with different distances
  // Verify sessionBestM equals the better one
});
```

---

## Feature 6 — Touch / Mobile Input

### Problem

The game only handles mouse clicks and keyboard. On mobile, the canvas receives touch events but nothing maps them to game actions. GitHub Pages is a common mobile destination.

### 6a. Add touch handlers in `usePointerControls.ts`

Add alongside the existing mouse/keyboard handlers. Use a long-press pattern (single finger for everything):

```ts
import { resumeAudioContext } from '../game/audio';

// Inside the useEffect, before the event listener registrations:

let longPressTimer: number | null = null;
const LONG_PRESS_MS = 300;

const onTouchStart = (event: TouchEvent): void => {
  event.preventDefault();
  resumeAudioContext();

  if (phaseTag === 'runup') {
    dispatch({ type: 'rhythmTap', atMs: now() });
    // Start long-press timer to transition to chargeAim
    longPressTimer = window.setTimeout(() => {
      dispatch({ type: 'beginChargeAim', atMs: now() });
      longPressTimer = null;
    }, LONG_PRESS_MS);
  }

  if (phaseTag === 'idle' || phaseTag === 'result') {
    dispatch({ type: 'rhythmTap', atMs: now() });
  }
};

const onTouchEnd = (event: TouchEvent): void => {
  if (longPressTimer !== null) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  if (phaseTag === 'chargeAim') {
    dispatch({ type: 'releaseCharge', atMs: now() });
  }
};

const onTouchMove = (event: TouchEvent): void => {
  event.preventDefault();
  if (event.touches.length >= 1 && (phaseTag === 'chargeAim' || phaseTag === 'runup' || phaseTag === 'idle')) {
    const touch = event.touches[0];
    dispatchAngleFromPointer(touch.clientX, touch.clientY);
  }
};
```

The long-press approach: tap rhythmically for speed, then hold to start charging, drag to aim, release to throw.

### 6b. Register touch event listeners

Add alongside the existing mouse/keyboard listeners:

```ts
canvas.addEventListener('touchstart', onTouchStart, { passive: false });
canvas.addEventListener('touchend', onTouchEnd);
canvas.addEventListener('touchmove', onTouchMove, { passive: false });

return () => {
  // ... existing cleanup ...
  canvas.removeEventListener('touchstart', onTouchStart);
  canvas.removeEventListener('touchend', onTouchEnd);
  canvas.removeEventListener('touchmove', onTouchMove);
  // Clear any pending long-press timer
  if (longPressTimer !== null) {
    clearTimeout(longPressTimer);
  }
};
```

`{ passive: false }` is required for `preventDefault()` to work on touch events.

### 6c. Prevent canvas scrolling and zooming

In **`GameCanvas.tsx`**, add `touch-action: none` to the canvas:

```tsx
<canvas
  ref={canvasRef}
  className="game-canvas"
  style={{ touchAction: 'none' }}
  role="img"
  aria-label="Javelin throw game canvas"
/>
```

Or add to `index.css`:

```css
.game-canvas {
  touch-action: none;
}
```

### 6d. Update `ControlHelp.tsx` for mobile

Detect touch capability and show appropriate instructions:

```tsx
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
```

Show different help text based on device. Add i18n keys:

**en/common.json:**
```json
"help.touch1": "Tap: build rhythm speed",
"help.touch2": "Hold: charge throw force",
"help.touch3": "Drag while holding: aim angle",
"help.touch4": "Release: throw"
```

**fi/common.json:**
```json
"help.touch1": "Napauta: kiihdytä rytmillä",
"help.touch2": "Pidä pohjassa: lataa heittovoima",
"help.touch3": "Vedä pitäessä: säädä kulmaa",
"help.touch4": "Vapauta: heitä"
```

**sv/common.json:**
```json
"help.touch1": "Tryck: bygg rytmfart",
"help.touch2": "Håll: ladda kastkraft",
"help.touch3": "Dra medan du håller: sikta vinkel",
"help.touch4": "Släpp: kasta"
```

### 6e. Test

Touch input is hard to unit test. Manual testing on a phone or Chrome DevTools device emulation. Ensure:
- Tapping builds speed during runup
- Long-press transitions to chargeAim
- Drag during chargeAim adjusts angle
- Finger lift releases throw
- No page scrolling or zooming during play
- Context menu does not appear on long press

---

## Tuning Reference

| Feature | Parameter | Easy | Default | Hard |
|---------|-----------|------|---------|------|
| Rhythm | `beatIntervalMs` | 900 | 820 | 700 |
| Rhythm | `perfectWindowMs` | 160 | 120 | 80 |
| Charge | `chargeMaxCycles` | 5 | 3 | 2 |
| Charge | `chargeFillDurationMs` | 1000 | 800 | 600 |
| Session | `attemptsTotal` | 6 | 6 | 3 |
| Touch | `LONG_PRESS_MS` | 400 | 300 | 200 |
