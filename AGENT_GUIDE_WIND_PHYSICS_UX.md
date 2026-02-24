# Agent Guide — Wind, Physics & UX Fixes

Generated: 2026-02-24
Status: Ready to start

## Purpose

Fix wind model inaccuracies, physics edge cases, and UX gaps identified during flight dynamics review. All changes preserve the existing reducer-driven architecture and phase state machine.

## Guardrails

- Keep reducer and selectors pure and immutable.
- Keep phase logic centered in `src/features/javelin/game/update.ts` with per-phase handlers.
- Keep gameplay-tunable values in `src/features/javelin/game/tuning.ts` and structural constants in `src/features/javelin/game/constants.ts`.
- Do not hardcode user-facing strings; use i18n keys.
- Run `npm run test` after every workstream. No regressions allowed.
- Commit per workstream, not per file.

---

## Workstream 1 — Crosswind (Z-axis wind)

**Goal:** Wind affects lateral drift, not just range. Players feel wind pushing the javelin sideways.

### Files to touch

- `src/features/javelin/game/types.ts`
- `src/features/javelin/game/constants.ts`
- `src/features/javelin/game/tuning.ts`
- `src/features/javelin/game/wind.ts`
- `src/features/javelin/game/physics.ts`
- `src/features/javelin/game/update.ts`
- `src/features/javelin/game/wind.test.ts`
- `src/features/javelin/game/physics.test.ts`
- `src/features/javelin/game/reducer.test.ts`

### Steps

1. **Add `windZMs` to `GameState`** in `types.ts`. Add it alongside `windMs`. Update `GameAction`'s `startRound` to include `windZMs`.

2. **Add crosswind tuning** in `tuning.ts` under `wind`:
   ```ts
   crosswindPhaseOffsetRad: number;   // phase offset from main wind cycle
   crosswindAmplitudeScale: number;   // fraction of main wind amplitude
   ```
   Suggested defaults: `crosswindPhaseOffsetRad: 1.3` (roughly 75° offset so crosswind peaks when headwind is mid-range), `crosswindAmplitudeScale: 0.35` (crosswind weaker than headwind).

3. **Add `sampleCrosswindTargetMs`** in `wind.ts`. Reuse `sampleWindTargetMs` logic but apply the phase offset to `cyclePhaseRad` and scale the output by `crosswindAmplitudeScale`. Add a matching `advanceCrosswindMs` that mirrors `advanceWindMs` but operates on the Z channel.

4. **Add crosswind constants** in `constants.ts`:
   ```ts
   export const CROSSWIND_MIN_MS = -1.0;
   export const CROSSWIND_MAX_MS = 1.0;
   ```

5. **Pass `windZMs` into `updatePhysicalJavelin`** in `physics.ts`. Change the air-velocity calculation:
   ```ts
   // Before
   const airVx = javelin.vxMs - windMs;
   const airVz = javelin.vzMs;

   // After
   const airVx = javelin.vxMs - windMs;
   const airVz = javelin.vzMs - windZMs;
   ```
   Update the function signature to accept `windZMs: number` as a fourth parameter (default `0` for backward compat).

6. **Wire crosswind through `update.ts`**:
   - In `tick` handler: advance `windZMs` via `advanceCrosswindMs`.
   - In `tickFlight`: pass `state.windZMs` to `updatePhysicalJavelin`.
   - In `tickFault`: same.
   - In `createInitialGameState`: initialize `windZMs` from `sampleCrosswindTargetMs`.
   - In `startRound` action: accept and store `windZMs`.

7. **Update tests** in `wind.test.ts` (new crosswind sampler returns finite values, stays in bounds), `physics.test.ts` (crosswind shifts landing Z position), and `reducer.test.ts` (tick advances crosswind, startRound accepts it).

### Acceptance criteria

- `windZMs` updates every tick independently of `windMs`.
- A javelin thrown with nonzero crosswind drifts laterally more than with zero crosswind.
- All existing tests pass. New tests cover crosswind bounds and physics integration.

---

## Workstream 2 — Fix wind amplitude clipping

**Goal:** Wind target stays within clamp bounds naturally; no sustained plateaus at ±2.5 m/s.

### Files to touch

- `src/features/javelin/game/tuning.ts`
- `src/features/javelin/game/wind.test.ts`

### Steps

1. **Reduce `cycleAmplitudeMs`** from `2.2` to `1.85`. This keeps the combined maximum (1.85 + 0.35 + 0.1 + 0.12 = 2.42) under the ±2.5 clamp.

2. **Add a test** in `wind.test.ts` that samples `sampleWindTargetMs` across a full cycle and asserts fewer than 2% of samples land exactly at `WIND_MIN_MS` or `WIND_MAX_MS`. This guards against future tuning regressions.

### Acceptance criteria

- Wind oscillates smoothly without flat plateaus at extremes.
- Existing wind tests still pass.

---

## Workstream 3 — Wind-aware trajectory preview

**Goal:** The dotted trajectory arc during `chargeAim` accounts for wind, giving the player an honest preview.

### Files to touch

- `src/features/javelin/game/trajectory.ts`
- `src/features/javelin/game/trajectory.test.ts`
- `src/features/javelin/game/render.ts` (caller passes wind)

### Steps

1. **Add `windMs` parameter** to `ComputeTrajectoryPreviewInput` in `trajectory.ts` (default `0`).

2. **Subtract wind from horizontal velocity** in the preview loop:
   ```ts
   // Before
   const xM = originXM + vxMs * t;

   // After
   const effectiveVxMs = vxMs - windMs;
   const xM = originXM + effectiveVxMs * t;
   ```
   This is a first-order correction. Do not add drag/lift — keep the preview simple and cheap.

3. **Pass `state.windMs`** from the `chargeAim` rendering path in `render.ts` when calling `computeTrajectoryPreview`.

4. **Update tests** in `trajectory.test.ts`: a headwind (`windMs > 0`) should produce a shorter preview arc; a tailwind (`windMs < 0`) should produce a longer one.

### Acceptance criteria

- Trajectory dots visibly shift with wind direction.
- Preview is still lightweight (no per-step physics sim).
- Existing trajectory tests pass alongside new wind-aware tests.

---

## Workstream 4 — Fix lateral drag ratio

**Goal:** Sideways-moving javelins experience higher drag than nose-first ones, matching real aerodynamics.

### Files to touch

- `src/features/javelin/game/constants.ts`
- `src/features/javelin/game/physics.ts`
- `src/features/javelin/game/physics.test.ts`

### Steps

1. **Add a named constant** in `constants.ts`:
   ```ts
   export const LATERAL_DRAG_MULTIPLIER = 2.2;
   ```

2. **Replace the hardcoded `0.55`** in `physics.ts`:
   ```ts
   // Before
   const az = clamp(dragDirZ * dragAcc * 0.55, -MAX_LINEAR_ACCEL * 0.45, MAX_LINEAR_ACCEL * 0.45);

   // After
   const az = clamp(
     dragDirZ * dragAcc * LATERAL_DRAG_MULTIPLIER,
     -MAX_LINEAR_ACCEL,
     MAX_LINEAR_ACCEL
   );
   ```
   Also remove the `* 0.45` clamp narrowing — lateral accel should use the full `MAX_LINEAR_ACCEL` range since drag is now the dominant force.

3. **Update physics tests**: a javelin with initial `vzMs = 1.0` should lose lateral speed faster than before. Add a test that compares lateral velocity after N steps with old vs new multiplier direction (lateral drag > longitudinal).

### Acceptance criteria

- Imperfect-release throws drift less sideways before landing.
- "Perfect" timing releases (low lateral vel) are minimally affected.
- No change to X/Y physics behavior.

---

## Workstream 5 — Live foul-line warning

**Goal:** Player gets visual warning as they approach the throw line, before they release.

### Files to touch

- `src/features/javelin/game/selectors.ts`
- `src/features/javelin/components/HudPanel.tsx`
- `src/features/javelin/game/render.ts`
- `src/features/javelin/game/selectors.test.ts`
- `src/i18n/resources.ts`
- `public/locales/en/common.json`
- `public/locales/fi/common.json`
- `public/locales/sv/common.json`

### Steps

1. **Add a `isNearThrowLine` selector** in `selectors.ts`:
   ```ts
   export const isNearThrowLine = (state: GameState): boolean => {
     const remaining = getThrowLineRemainingM(state);
     return remaining !== null && remaining < 0.8;
   };
   ```

2. **Add danger styling to HudPanel**: when `isNearThrowLine(state)` is true during `chargeAim`, show a warning hint (e.g., `t('javelin.foulWarning')`). Apply a CSS class like `hud-danger` for red tint.

3. **Color-shift the throw line** in `render.ts`: when the athlete is within 0.8m during `chargeAim`, pulse the throw line between its normal red and a brighter warning color (use a simple sine pulse on alpha).

4. **Add i18n keys** for the foul warning string in all three locales.

5. **Add selector test** for `isNearThrowLine` covering runup, chargeAim near/far, and non-applicable phases.

### Acceptance criteria

- Player sees a visual warning before committing to a throw near the line.
- Warning appears only during `runup` and `chargeAim`, not during other phases.
- All locales have the warning string.

---

## Workstream 6 — Richer HUD during chargeAim

**Goal:** Surface speed %, force preview %, and wind reading as text in the HUD panel so players don't have to scan the canvas.

### Files to touch

- `src/features/javelin/components/HudPanel.tsx`
- `src/features/javelin/game/selectors.ts`
- `src/i18n/resources.ts`
- `public/locales/en/common.json`
- `public/locales/fi/common.json`
- `public/locales/sv/common.json`
- `src/index.css`

### Steps

1. **Extend `HudPanel`** to read and display during `chargeAim`:
   - Speed: `getSpeedPercent(state)` → e.g., "Speed: 78%"
   - Force: `getForcePreviewPercent(state)` → e.g., "Force: 62%"
   - Wind: `state.windMs` → e.g., "Wind: +1.4 m/s"

2. **Add a `hud-stats` row** below `hud-hint` using a horizontal flex layout with `score-chip`-style badges (reuse existing styling pattern from result specs).

3. **Show during `flight` phase too** using `launchedFrom` snapshot values, so the player can see what they threw with while watching the javelin fly.

4. **Add i18n keys** for any new labels (or reuse existing `spec.wind`, `spec.angle`, etc. if they fit).

5. **Keep the panel compact on mobile** — use the existing `isCompactLayout` / media query pattern. On narrow screens, abbreviate labels or stack vertically.

### Acceptance criteria

- During `chargeAim` and `flight`, the HUD shows speed, force, and wind as text.
- Values update live during `chargeAim` (force changes with meter, wind drifts).
- Mobile layout doesn't overflow or clip.

---

## Workstream 7 — Flight wind display improvement

**Goal:** The result screen shows meaningful wind info, not just the snapshot at release.

### Files to touch

- `src/features/javelin/game/types.ts`
- `src/features/javelin/game/update.ts`
- `src/features/javelin/JavelinPage.tsx`
- `src/i18n/resources.ts`
- `public/locales/en/common.json`
- `public/locales/fi/common.json`
- `public/locales/sv/common.json`

### Steps

1. **Track wind stats during flight** — add to the `flight` phase type:
   ```ts
   windMinMs: number;
   windMaxMs: number;
   windSumMs: number;
   windSamples: number;
   ```

2. **Initialize in `tickThrowAnim`** when transitioning to `flight`: set all to `state.windMs`, samples = 1.

3. **Update in `tickFlight`** each tick:
   ```ts
   windMinMs: Math.min(state.phase.windMinMs, state.windMs),
   windMaxMs: Math.max(state.phase.windMaxMs, state.windMs),
   windSumMs: state.phase.windSumMs + state.windMs,
   windSamples: state.phase.windSamples + 1,
   ```

4. **Carry into `result` phase** — add `windAvgMs` (computed from sum/samples) and optionally `windRangeMs` (max − min) to the result phase type.

5. **Display in `JavelinPage.tsx`**: replace the single wind chip with average wind and range, e.g., "Wind: +1.1 m/s (range: 1.8)". Use new i18n keys.

### Acceptance criteria

- Result screen shows average wind during flight, not just release-moment wind.
- Long flights with shifting wind display a meaningful range.
- Short flights where wind barely changes show a clean single value.

---

## Workstream 8 — Code cleanup

**Goal:** Remove duplication and minor tech debt identified during review.

### Files to touch

- `src/features/javelin/game/render.ts`
- `src/features/javelin/game/renderWind.ts`
- `src/features/javelin/game/scoring.ts`
- `src/features/javelin/game/wind.ts`

### Steps

1. **Extract `drawOutlinedText`** into a new `src/features/javelin/game/canvasUtils.ts` module. Import it from both `render.ts` and `renderWind.ts`. Remove the duplicate definitions.

2. **Move `computeThrowDistance`** from `scoring.ts` into the test file that uses it (`scoring.test.ts` or a dedicated `scoring.testUtils.ts`). It's marked `@deprecated` and only kept for balancing experiments — it shouldn't live in production code. If tests import it, re-export from the test utility file only.

3. **Add a comment to `signedNoise1D`** in `wind.ts` explaining its purpose:
   ```ts
   /**
    * Deterministic pseudo-noise from an integer index.
    * Returns a value in [-1, 1]. Used for repeatable random wind keyframes
    * without requiring a seeded PRNG.
    */
   ```

4. **Add `smoothstep01` to `math.ts`** — it's currently duplicated in `wind.ts` and `renderWind.ts`. Centralize it alongside the other easing functions.

### Acceptance criteria

- No duplicated utility functions across rendering modules.
- Deprecated scoring function is out of production code path.
- All tests pass with no import changes needed outside the touched files.

---

## Suggested execution order

| Priority | Workstream | Reason |
|----------|-----------|--------|
| 1 | WS2 — Wind amplitude clipping | Smallest change, immediate feel improvement |
| 2 | WS4 — Lateral drag fix | Small constant change, big realism improvement |
| 3 | WS3 — Trajectory preview + wind | Medium effort, directly addresses player trust |
| 4 | WS1 — Crosswind | Largest physics change, do after drag is fixed |
| 5 | WS5 — Foul-line warning | UX quick win |
| 6 | WS6 — Richer HUD | UX improvement, no gameplay logic changes |
| 7 | WS7 — Flight wind display | Nice-to-have, depends on WS1 for crosswind display |
| 8 | WS8 — Code cleanup | Do last, no gameplay impact |
