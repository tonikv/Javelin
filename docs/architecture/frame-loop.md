# Frame Loop Ownership

## Current model

The game intentionally uses two requestAnimationFrame loops:

- Simulation loop in `src/features/javelin/hooks/useGameLoop.ts`
  - dispatches reducer `tick` actions
  - clamps `dtMs` for simulation stability
- Render loop in `src/features/javelin/components/GameCanvas.tsx`
  - renders from `stateRef.current`
  - keeps render-only timing/session state outside React

## Why this remains in place

- Simulation and rendering responsibilities are explicit and independently testable.
- Render loop can keep visual interpolation/session effects without mutating reducer state.
- Current profiling does not show blocking regressions from this split.

## Safety requirements

- Reducer tick remains the single source of truth for gameplay state transitions.
- Render loop must read from refs (`stateRef`) to avoid stale closure drift.
- Any future change to single-loop scheduling must keep `game/update/*` phase handlers pure.

## Revisit triggers

- Measurable frame drops in normal gameplay devices.
- Evidence of stale UI state caused by loop cadence mismatch.
- Requirement to run deterministic replay or strict fixed-step simulation ownership.
