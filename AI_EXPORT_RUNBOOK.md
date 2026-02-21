# Agent Runbook — Javelin
Generated: 2026-02-21T19:26:17.702562+00:00
Total files: 52 | Runbook tokens: ~2,528

## Project Overview
- App type: React-based web application or component library.

## Context
- Languages: TypeScript/JavaScript
- Package manager(s): npm
- JS/TS stack: React, Vite
- CI: GitHub Actions configured
- Primary docs file: README.md
- Env vars used: GITHUB_ACTIONS

## Repo Map
- .github
  - workflows/…
  - copilot-instructions.md
- agent-guide-visual.md
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
  - features/ (34 files)
    - javelin/ (34 files)
      - components/… (6 files)
      - game/… (23 files)
      - hooks/… (4 files)
      - (1 files at this level)
  - i18n/… (2 files)
  - (2 files at this level)
- tsconfig.json
- vite.config.ts

## Project Configuration
- Package: selain-games-2026-javelin v0.1.0
- Scripts: dev, build, preview, test, test:watch

## Build & Test Commands
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run test` — run tests
- `npm ci` (from CI: deploy.yml)
- `npm run build` (from CI: deploy.yml)

## Recently Active Files
- `src/features/javelin/game/render.ts` (16 changes)
- `src/features/javelin/game/update.ts` (16 changes)
- `src/features/javelin/game/constants.ts` (13 changes)
- `src/features/javelin/game/reducer.test.ts` (13 changes)
- `src/features/javelin/game/athletePose.ts` (12 changes)
- `src/features/javelin/game/types.ts` (12 changes)
- `src/features/javelin/game/render.test.ts` (8 changes)
- `src/features/javelin/game/selectors.ts` (7 changes)
- `src/features/javelin/hooks/usePointerControls.ts` (6 changes)
- `src/features/javelin/game/athletePose.test.ts` (5 changes)
- `src/features/javelin/game/tuning.ts` (5 changes)
- `src/features/javelin/game/physics.ts` (5 changes)
- `src/features/javelin/components/HudPanel.tsx` (5 changes)
- `src/features/javelin/components/GameCanvas.tsx` (4 changes)
- `src/features/javelin/game/controls.ts` (4 changes)

## Module Dependencies
- `src/app/App.tsx` → ../features/javelin/JavelinPage
- `src/features/javelin/JavelinPage.tsx` → ../../i18n/init, ./components/ControlHelp, ./components/GameCanvas, ./components/HudPanel, ./components/LanguageSwitch, ./components/ScoreBoard, ./game/constants, ./game/reducer, ./game/types, ./game/update, ./hooks/useGameLoop, ./hooks/useLocalHighscores
- `src/features/javelin/components/CircularTimingMeter.tsx` → ../../../i18n/init, ../game/types
- `src/features/javelin/components/ControlHelp.tsx` → ../../../i18n/init
- `src/features/javelin/components/GameCanvas.tsx` → ../../../i18n/init, ../game/render, ../game/types, ../hooks/usePointerControls
- `src/features/javelin/components/HudPanel.tsx` → ../../../i18n/init, ../game/selectors, ../game/types
- `src/features/javelin/components/LanguageSwitch.tsx` → ../../../i18n/init, ../game/types
- `src/features/javelin/components/ScoreBoard.tsx` → ../../../i18n/init, ../game/types
- `src/features/javelin/game/athletePose.test.ts` → ./athletePose
- `src/features/javelin/game/athletePose.ts` → ./math, ./tuning, ./types
- `src/features/javelin/game/camera.ts` → ./constants, ./math, ./tuning, ./types
- `src/features/javelin/game/chargeMeter.test.ts` → ./chargeMeter
- `src/features/javelin/game/chargeMeter.ts` → ./math, ./types
- `src/features/javelin/game/controls.test.ts` → ./controls
- `src/features/javelin/game/controls.ts` → ./constants, ./math
- `src/features/javelin/game/physics.test.ts` → ./physics, ./scoring
- `src/features/javelin/game/physics.ts` → ./constants, ./math, ./types
- `src/features/javelin/game/reducer.test.ts` → ./constants, ./reducer, ./tuning, ./update
- `src/features/javelin/game/reducer.ts` → ./types, ./update
- `src/features/javelin/game/render.test.ts` → ./athletePose, ./render, ./tuning, ./types
- `src/features/javelin/game/render.ts` → ./athletePose, ./camera, ./constants, ./renderAthlete, ./renderMeter, ./tuning, ./types
- `src/features/javelin/game/renderAthlete.ts` → ./athletePose, ./camera
- `src/features/javelin/game/renderMeter.ts` → ./constants, ./math, ./renderAthlete, ./selectors, ./tuning, ./types
- `src/features/javelin/game/scoring.test.ts` → ./scoring
- `src/features/javelin/game/scoring.ts` → ./constants, ./math, ./types
- `src/features/javelin/game/selectors.ts` → ./constants, ./math, ./tuning, ./types
- `src/features/javelin/game/tuning.ts` → ./types
- `src/features/javelin/game/update.ts` → ./athletePose, ./chargeMeter, ./constants, ./math, ./physics, ./scoring, ./tuning, ./types
- `src/features/javelin/hooks/useGameLoop.ts` → ../game/types
- `src/features/javelin/hooks/useLocalHighscores.test.ts` → ../game/types, ./useLocalHighscores
- `src/features/javelin/hooks/useLocalHighscores.ts` → ../game/constants, ../game/types
- `src/features/javelin/hooks/usePointerControls.ts` → ../game/controls, ../game/render, ../game/types
- `src/i18n/init.tsx` → ../features/javelin/game/types, ./resources
- `src/i18n/resources.ts` → ../features/javelin/game/types
- `src/main.tsx` → ./app/App, ./i18n/init

## Files by Subsystem

### Entry points & app wiring
- `src/app/App.tsx` (7 lines) — App
- `src/main.tsx` (20 lines)

### Gameplay systems
- `src/features/javelin/game/physics.ts` (267 lines) — computeLaunchSpeedMs, createPhysicalJavelin, updatePhysicalJavelin, distanceFromJavelin
- `src/features/javelin/game/tuning.ts` (123 lines) — GameplayTuning, GAMEPLAY_TUNING, BEAT_INTERVAL_MS, PERFECT_WINDOW_MS, GOOD_WINDOW_MS, SPAM_THRESHOLD_MS, SPAM_PENALTY_MS, RUNUP_PASSIVE_MAX_SPEED, RUNUP_PASSIVE_TO_HALF_MS, RHYTHM_SPEED_DELTA_PERFECT (+5 more)

### Rendering & visual effects
- `agent-guide-visual.md` (772 lines)
- `src/features/javelin/game/camera.ts` (210 lines) — WorldToScreenInput, WorldToScreen, RUNWAY_OFFSET_X, resetSmoothCamera, getCameraTargetX, getViewWidthM, getCameraAheadRatio, getVerticalScale, createWorldToScreenRaw, createWorldToScreen
- `src/features/javelin/game/render.ts` (541 lines) — getVisibleJavelinRenderState, getPlayerAngleAnchorScreen, renderGame

### Frontend / UI
- `src/features/javelin/components/CircularTimingMeter.tsx` (101 lines) — CircularTimingMeter
- `src/features/javelin/components/ControlHelp.tsx` (23 lines) — ControlHelp
- `src/features/javelin/components/GameCanvas.tsx` (57 lines) — GameCanvas
- `src/features/javelin/components/HudPanel.tsx` (68 lines) — HudPanel
- `src/features/javelin/components/LanguageSwitch.tsx` (29 lines) — LanguageSwitch
- `src/features/javelin/components/ScoreBoard.tsx` (37 lines) — ScoreBoard

### Configuration / tooling / CI
- `package.json` (26 lines) — JavaScript/TypeScript package manifest (scripts, dependencies, metadata).
- `tsconfig.json` (25 lines) — TypeScript compiler configuration.

### Docs & specifications
- `README.md` (69 lines) — Project README / high-level documentation.

### Other code & helpers
- `src/features/javelin/game/types.ts` (161 lines) — Locale, FaultReason, TimingQuality, MeterWindow, RhythmState, ChargeMeterState, AthletePoseState, ThrowInput, LaunchSnapshot, PhysicalJavelinState (+5 more)
- `.github/copilot-instructions.md` (6 lines)
- `.github/workflows/deploy.yml` (41 lines)
- `AGENTS.md` (26 lines)
- `docs/ai-notes.md` (22 lines)
- `index.html` (14 lines)
- `public/locales/en/common.json` (20 lines)
- `public/locales/fi/common.json` (20 lines)
- `public/locales/sv/common.json` (20 lines)
- `src/features/javelin/game/athletePose.ts` (487 lines) — AthletePoseGeometry, ThrowSubphaseSample, getRunToAimBlend01, sampleThrowSubphase, computeAthletePoseGeometry
- `src/features/javelin/game/chargeMeter.ts` (41 lines) — isInWindow, getTimingQuality, computeForcePreview, applyForceQualityBonus
- `src/features/javelin/game/constants.ts` (63 lines) — RUNUP_MAX_TAPS, RUNUP_SPEED_MIN_MS, RUNUP_SPEED_MAX_MS, THROW_LINE_X_M, CHARGE_ZONE_MARGIN_M, RUNUP_MAX_X_M, RHYTHM_TARGET_PHASE01, ANGLE_MIN_DEG, ANGLE_MAX_DEG, ANGLE_DEFAULT_DEG (+5 more)
- `src/features/javelin/game/controls.ts` (21 lines) — keyboardAngleDelta, pointerFromAnchorToAngleDeg
- `src/features/javelin/game/math.ts` (31 lines) — clamp, clamp01, wrap01, lerp, toRad, toDeg, easeOutQuad, easeOutCubic, easeInCubic, easeInOutSine
- `src/features/javelin/game/reducer.ts` (6 lines) — gameReducer
- `src/features/javelin/game/renderAthlete.ts` (103 lines) — HeadAnchor, drawAthlete
- `src/features/javelin/game/renderMeter.ts` (201 lines) — getHeadMeterScreenAnchor, drawWorldTimingMeter
- `src/features/javelin/game/scoring.ts` (85 lines) — DISTANCE_MEASURE_MODE, FOUL_ON_LINE_CROSS, REQUIRE_TIP_FIRST, REQUIRE_SECTOR, SECTOR_ANGLE_DEG, SECTOR_HALF_ANGLE_RAD, angleEfficiency, releaseEfficiency, windEfficiency, computeThrowDistance (+3 more)
- `src/features/javelin/game/selectors.ts` (101 lines) — getSpeedPercent, getAngleDeg, getRunupMeterPhase01, getRunupFeedback, getForcePreviewPercent, getRhythmHotZones, getRunupDistanceM, getThrowLineRemainingM
- `src/features/javelin/game/update.ts` (684 lines) — createInitialGameState, reduceGameState
- `src/features/javelin/hooks/useGameLoop.ts` (26 lines) — useGameLoop
- `src/features/javelin/hooks/useLocalHighscores.ts` (91 lines) — pruneHighscores, insertHighscoreSorted, loadHighscores, saveHighscores, useLocalHighscores
- `src/features/javelin/hooks/usePointerControls.ts` (122 lines) — usePointerControls
- `src/features/javelin/JavelinPage.tsx` (152 lines) — JavelinPage
- `src/i18n/init.tsx` (73 lines) — I18nProvider, useI18n
- `src/i18n/resources.ts` (154 lines) — Messages, resources
- `src/index.css` (375 lines)
- `vite.config.ts` (11 lines)
- `src/features/javelin/game/athletePose.test.ts` (78 lines)
- `src/features/javelin/game/chargeMeter.test.ts` (30 lines)
- `src/features/javelin/game/controls.test.ts` (23 lines)
- `src/features/javelin/game/physics.test.ts` (172 lines)
- `src/features/javelin/game/reducer.test.ts` (297 lines)
- `src/features/javelin/game/render.test.ts` (203 lines)
- `src/features/javelin/game/scoring.test.ts` (85 lines)
- `src/features/javelin/hooks/useLocalHighscores.test.ts` (37 lines) — Reusable hook / shared state or side-effect logic.
