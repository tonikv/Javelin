# Agent Guide - Javelin Gameplay V2

Generated: 2026-02-22
Status: In progress (Workstream 4 started)

## Purpose
Gameplay V2 targets better throw feel, clearer player feedback, and stronger arcade character while keeping the current reducer-driven architecture intact.

Primary outcomes:
- Tighter and more readable angle control across keyboard, mouse, and touch.
- Better throw anticipation via trajectory preview in charge phase.
- Clearer audiovisual feedback for rhythm, release quality, flight, and landing.
- No regressions in core loop stability, localization, or leaderboard flow.

## Guardrails
- Keep reducer and selectors pure and immutable.
- Keep phase logic centered in `src/features/javelin/game/update.ts` with per-phase handlers.
- Keep camera behavior in `src/features/javelin/game/camera.ts` and rendering in render modules.
- Route all user-visible strings through localization keys.
- Avoid `any`; preserve strict TypeScript.
- Add or update tests for each gameplay change.

## Current Baseline (from main)
- Core loop and controls are stable.
- Result phase now preserves throw specs (speed/angle) until next run starts.
- Idle pose shows javelin and is grounded correctly.
- Mobile-first UI and responsive layout refactor already landed.

## Workstreams

### 1. Angle and Input Rework
Goal: make aiming responsive but controllable, especially during charge.

Scope:
- Narrow effective angle gameplay range and tune clamp boundaries.
- Add keyboard hold acceleration instead of fixed-step repeats.
- Add pointer deadzone near shoulder anchor to reduce jitter.
- Optional pointer smoothing with tuning value.

Target files:
- `src/features/javelin/game/constants.ts`
- `src/features/javelin/game/tuning.ts`
- `src/features/javelin/game/controls.ts`
- `src/features/javelin/hooks/usePointerControls.ts`
- `src/features/javelin/game/controls.test.ts`
- `src/features/javelin/game/reducer.test.ts`

Done criteria:
- Keyboard hold feels gradual and predictable.
- Small pointer movement near anchor does not spike angle.
- Angle remains clamped and stable through all phases.
- Updated tests pass.

### 2. Trajectory Preview
Goal: show a simple forward throw arc only when it is meaningful.

Scope:
- Add lightweight preview utility with simplified parabola.
- Render dotted arc during `chargeAim` only.
- Keep it visual-only (no gameplay authority).

Target files:
- `src/features/javelin/game/trajectory.ts` (new)
- `src/features/javelin/game/render.ts`
- `src/features/javelin/game/tuning.ts`
- `src/features/javelin/game/trajectory.test.ts` (new)

Done criteria:
- Arc appears only in `chargeAim`.
- Arc updates with angle/speed/force changes.
- Arc disappears immediately on throw release.
- New tests pass.

### 3. Procedural Audio Pass
Goal: increase feedback clarity with lightweight synthesized audio.

Scope:
- Expand `audio.ts` from tick-only to event-driven sound helpers.
- Add per-category gain staging (rhythm/effects/crowd).
- Trigger one-shot events from render/hook transitions, not reducers.
- Keep graceful no-audio behavior when `AudioContext` is unavailable.

Target files:
- `src/features/javelin/game/audio.ts`
- `src/features/javelin/game/render.ts`
- `src/features/javelin/hooks/usePointerControls.ts`
- `src/features/javelin/components/GameCanvas.tsx`
- `src/features/javelin/game/tuning.ts`

Done criteria:
- Distinct cues for rhythm quality, throw release, and landing.
- No repeated retrigger spam on steady frames.
- Audio starts after user gesture and remains stable after tab focus changes.

### 4. Cleanup and Drift Reduction
Goal: reduce dead code and duplicated helpers before/while implementing V2.

Scope:
- Deduplicate shared numeric helpers (for example `roundTo1` if duplicated).
- Remove obsolete tuning aliases if no longer used.
- Deprecate or remove dead gameplay formula helpers unused by runtime path.

Target files:
- `src/features/javelin/game/math.ts`
- `src/features/javelin/game/physics.ts`
- `src/features/javelin/game/scoring.ts`
- `src/features/javelin/game/tuning.ts`

Done criteria:
- No duplicate helper implementations.
- No orphaned aliases in tuning exports.
- Tests and build remain green.

## Suggested Implementation Order
1. Cleanup and drift reduction.
2. Angle and input rework.
3. Trajectory preview.
4. Procedural audio pass.
5. Final polish pass and balancing.

## Validation Matrix
Run on every completed step:
- `npm run test`
- `npm run build`

Manual checks:
- Keyboard-only playthrough from idle to result.
- Mouse and touch aiming behavior in `runup` and `chargeAim`.
- Mobile portrait (320x568 and 390x844) and desktop fallback.
- FI/SV/EN UI and status messaging consistency.

## Acceptance Criteria for Gameplay V2
- Core throw loop remains stable with no phase-lock bugs.
- Aiming is easier to control under both keyboard and pointer input.
- Player gets better pre-throw and post-throw readability.
- Audio feedback improves timing/release clarity without noise fatigue.
- Code quality remains aligned with AGENTS.md principles.

## Notes for Next Agent Iteration
- Start with Workstream 4 before introducing new gameplay behavior.
- Keep commits scoped by workstream to simplify review and rollback.
- Update this document after each workstream with "Status" and key tuning decisions.

## Progress Log
- 2026-02-22: Workstream 4 cleanup batch started.
- 2026-02-22: `roundTo1` deduplicated into `math.ts`; removed duplicate local implementations in `physics.ts` and `scoring.ts`.
- 2026-02-22: Deprecated `CHARGEAIM_*` tuning aliases removed after usage audit.
- 2026-02-22: `computeThrowDistance` marked legacy-only via `@deprecated` JSDoc (runtime path remains physics-based).
- 2026-02-22: Started Workstream 1 by narrowing gameplay angle clamp to `15..55` and aligning pointer/pose clamping with constants.
- 2026-02-22: Added tunable keyboard hold acceleration and pointer deadzone plumbing in input controls.
- 2026-02-22: Started Workstream 2 with new `trajectory.ts`, tuning hooks, and `chargeAim`-only dotted preview rendering.
- 2026-02-22: Started Workstream 3 with event-based procedural audio engine, crowd ambience bootstrap, and phase-transition sound triggers in render.
- 2026-02-22: Added continuous flight-wind audio layer with per-frame intensity control tied to javelin speed.
- 2026-02-22: Added pointer-angle smoothing control (`angleControl.pointerSmoothing`) and smoothing tests.
- 2026-02-22: Added `docs/audio-qa.md` manual validation checklist for procedural audio behavior.
