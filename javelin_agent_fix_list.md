# Javelin Repo — Current Fix List for Agentic Coding (2026-02-21)

## Scope
Review based on the latest exported repo snapshot (`AI_EXPORT_01.md`) and runbook (`AI_EXPORT_RUNBOOK.md`).

This file is written as **agent instructions**: concrete, prioritized tasks with acceptance criteria.

---

## What is already good (keep)

1. **Clear architecture split**
   - Game/domain logic is mostly separated (`game/*`) from UI components and hooks.
   - Reducer + discriminated union phases is a good fit for this game loop/state machine.

2. **Feature progress is strong**
   - Touch input support exists.
   - Localized UI/messages expanded (including status messaging / wind hints).
   - Rendering got richer (release flash labels, clouds/parallax, camera smoothing).

3. **Testing baseline is decent**
   - Multiple game-domain tests exist (physics/scoring/render/reducer/selectors/etc.).
   - Helper tests for highscore sorting/pruning are present.

4. **Tooling baseline is solid**
   - React + TS + Vite + Vitest, strict TS flags, simple build/test scripts.

---

## Priority Fix List (for coding agent)

## P0 — Fix input handling bugs (keyboard focus + Enter key release)
**Why**
Current global keyboard listeners can fire while typing in inputs/selects, and `Enter` keyup releases charge unconditionally. This can interfere with the save-score form and other controls.

### Symptoms / risks
- `window` key handlers are always attached while canvas exists.
- `onKeyUp` dispatches `releaseCharge` for every `Enter` keyup (even when not charging).
- `preventDefault()` on Enter keyup can interfere with form submit / focused controls.
- Arrow keys may hijack input/select navigation.

### Files
- `src/features/javelin/hooks/usePointerControls.ts`

### Agent tasks
1. Add an **interactive-target guard** helper:
   - Ignore keyboard shortcuts if event target is:
     - `input`, `textarea`, `select`, `button`
     - contentEditable element
2. Gate `Enter` keyup release:
   - Only when current phase is `chargeAim`
   - Prefer checking `stateRef.current.phase.tag` (not stale closure)
3. Gate `preventDefault()` accordingly:
   - Only call when the shortcut is actually handled
4. Add regression tests (new file or existing tests):
   - Enter in save form does **not** dispatch `releaseCharge`
   - Arrow keys in input/select do not dispatch `adjustAngle`
   - Enter release works during `chargeAim`

### Acceptance criteria
- Score save form can be submitted with Enter when focused in the input.
- Keyboard shortcuts still work for gameplay.
- No global keyboard side-effects when typing in UI controls.

---

## P0 — Decouple canvas resize/backbuffer allocation from frame rendering
**Why**
`GameCanvas` recalculates bounding box and reallocates canvas backing store in the render effect. This is expensive and also misses idle/result window resize updates when game state is not changing.

### Files
- `src/features/javelin/components/GameCanvas.tsx`

### Agent tasks
1. Split current `useEffect` into:
   - **Resize effect** (with `ResizeObserver` + DPR handling)
   - **Draw effect** (render current frame)
2. Store logical canvas size / dpr in refs (or local state if needed)
3. Only set `canvas.width` / `canvas.height` when values actually changed
4. Add resize fallback:
   - `window.resize` listener if `ResizeObserver` unavailable
5. Keep `touchAction: 'none'` and accessibility attrs intact

### Acceptance criteria
- Canvas stays crisp after window resize in idle/result states.
- No unnecessary backing-store reallocations every active frame.
- Rendering output unchanged.

---

## P0 — Harden LocalStorage usage (highscores + locale)
**Why**
Storage access is unguarded in several places. Browsers can throw on `localStorage` access (privacy mode, denied storage, quota exceeded), which should not break gameplay.

### Files
- `src/features/javelin/hooks/useLocalHighscores.ts`
- `src/i18n/init.tsx`

### Agent tasks (highscores)
1. Wrap `localStorage.getItem` in `loadHighscores()` with try/catch
2. Wrap `localStorage.setItem` in `saveHighscores()` with try/catch
3. Tighten data validation for parsed entries:
   - `Number.isFinite(distanceM)`
   - valid ISO/date parse check (`Date.parse(...)`)
   - `locale` is one of supported values if present
   - `windMs` finite if present
4. Keep invalid entries filtered out, not fatal

### Agent tasks (i18n)
1. Guard `detectLocale()` against storage access errors
2. Guard `navigator.language` access for non-browser/edge contexts
3. Guard `setLocale()` storage write with try/catch (state update should still work)
4. Do not change public API (`useI18n`, provider contract)

### Acceptance criteria
- App works even if storage read/write throws.
- Malformed highscores in storage do not crash app.
- Locale selection still updates UI even if storage persistence fails.

---

## P1 — Remove/contain module-level render state (cross-instance bleed risk)
**Why**
`render.ts` and `camera.ts` keep mutable module-level state (`lastResultRoundId`, `resultShownAtMs`, `smoothCam`). This is simple but creates hidden coupling across mounts/canvases and can behave poorly under remount/StrictMode/test reuse.

### Files
- `src/features/javelin/game/render.ts`
- `src/features/javelin/game/camera.ts`
- `src/features/javelin/components/GameCanvas.tsx` (integration point)

### Agent tasks
Choose one (A preferred, B acceptable):

**A. Instance-scoped render session (preferred)**
- Introduce a `RenderSession` object (refs owned by `GameCanvas`) containing:
  - camera smoothing state
  - landing marker fade state
  - last render timestamp if useful
- Pass session into `renderGame(...)`

**B. Minimal containment**
- Export explicit reset functions for all module-level render state
- Call resets on mount/unmount and when resetting to idle/starting new round
- Document lifecycle assumptions

### Acceptance criteria
- No hidden cross-instance shared render state.
- Rendering remains visually identical.
- Tests can run in any order without leaked visual state.

---

## P1 — Reduce unnecessary full-page render churn during active play
**Why**
The game state reducer lives at page level, so the whole page subtree re-renders during active phases. This is acceptable for a small demo but is the next scalability bottleneck.

### Files
- `src/features/javelin/JavelinPage.tsx`
- `src/features/javelin/components/*`
- optionally `useGameLoop` integration path

### Agent tasks (incremental, do not over-engineer)
1. Memoize static / low-frequency components where cheap:
   - `ControlHelp`
   - `LanguageSwitch` (if props stable)
   - `ScoreBoard` (already mostly low-frequency if highscores stable)
2. Consider splitting “fast-changing game state” from “UI state”
   - Example: canvas/HUD get live reducer state
   - side panel receives derived memoized props
3. Avoid broad object-prop churn when possible (pass minimal derived values)
4. Keep behavior identical

### Acceptance criteria
- Same UX/output.
- Fewer avoidable React re-renders in profiler during active throw sequence.
- No regression in inputs or localization.

---

## P1 — Test gaps for new input/touch/i18n paths
**Why**
Recent features expanded behavior (touch, release feedback, locale persistence), but the highest-risk regressions are mostly untested.

### Add tests for
1. `usePointerControls`
   - keyboard focus guards
   - Enter keyup release only in `chargeAim`
   - touch long-press path transitions (if practical)
2. `useLocalHighscores`
   - malformed JSON
   - storage getter throws
   - storage setter throws
   - invalid entries filtered
3. `i18n/init`
   - storage read/write failures
   - browser locale fallback behavior
4. (Optional) render/camera session reset behavior after remount

### Acceptance criteria
- New tests fail on old behavior and pass on fixed behavior.
- Tests remain deterministic.

---

## P2 — Cleanup / consistency improvements (low risk)
These are not urgent but improve maintainability.

### Suggested tasks
1. Normalize import paths if any odd relative path artifacts remain (e.g. repeated `./././`)
2. Add a tiny utility module for browser capability checks:
   - `safeLocalStorageGet`
   - `safeLocalStorageSet`
   - `isInteractiveElement`
3. Add comments near non-obvious gameplay input rules (e.g. why Enter keyup releases)
4. Consider exposing `aria-label` strings via i18n for consistency

---

## Implementation constraints for the agent
- Prefer **small, reviewable commits** by priority (P0 first)
- Do **not** rewrite reducer/game physics unless required for a bug fix
- Preserve existing UX/tuning values unless explicitly needed
- Keep TypeScript strict mode clean
- Add/adjust tests with each behavioral change

---

## Suggested commit sequence
1. `fix(input): guard global keyboard shortcuts and Enter release behavior`
2. `fix(canvas): separate resize observer from draw effect`
3. `fix(storage): harden highscores and locale persistence against storage errors`
4. `refactor(render): make render/camera transient state instance-scoped`
5. `test: add regression coverage for input/storage/i18n guards`
6. `perf(ui): reduce avoidable non-gameplay re-renders`

---

## Verification checklist (agent must run)
- `npm run test`
- `npm run build`

Manual checks:
- Play with mouse + keyboard
- Touch device emulation in browser devtools
- Resize window during idle/result (canvas remains crisp)
- Disable/throw storage (or simulate) and confirm app still loads
- Save score form submits with Enter when input focused
