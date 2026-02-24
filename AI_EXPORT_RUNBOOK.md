# Agent Runbook — Javelin
Generated: 2026-02-24T09:27:07.273529+00:00
Total files: 67 | Runbook tokens: ~3,164

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
- AGENT_GUIDE_GAMEPLAY_V2.md
- AGENTS.md
- docs
  - ai-notes.md
  - audio-qa.md
- index.html
- package.json
- public
  - locales/…
- README.md
- src
  - app/… (4 files)
  - features/ (44 files)
    - javelin/ (44 files)
      - components/… (6 files)
      - game/… (32 files)
      - hooks/… (5 files)
      - (1 files at this level)
  - i18n/… (3 files)
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
- `src/features/javelin/game/render.ts` (24 changes)
- `src/features/javelin/game/update.ts` (20 changes)
- `src/features/javelin/game/reducer.test.ts` (17 changes)
- `src/features/javelin/game/types.ts` (16 changes)
- `src/features/javelin/game/constants.ts` (16 changes)
- `src/features/javelin/game/render.test.ts` (13 changes)
- `src/features/javelin/game/athletePose.ts` (13 changes)
- `src/features/javelin/game/tuning.ts` (12 changes)
- `src/features/javelin/game/selectors.ts` (11 changes)
- `src/features/javelin/hooks/usePointerControls.ts` (10 changes)
- `src/i18n/resources.ts` (9 changes)
- `src/index.css` (9 changes)
- `src/features/javelin/JavelinPage.tsx` (9 changes)
- `src/features/javelin/components/HudPanel.tsx` (8 changes)
- `src/features/javelin/game/physics.ts` (7 changes)

## Module Dependencies
- `src/app/App.tsx` → ../features/javelin/JavelinPage
- `src/app/browser.test.ts` → ./browser
- `src/features/javelin/JavelinPage.tsx` → ../../app/useMediaQuery, ../../i18n/init, ./components/ControlHelp, ./components/GameCanvas, ./components/HudPanel, ./components/LanguageSwitch, ./components/ScoreBoard, ./game/audio, ./game/reducer, ./game/types, ./game/update, ./hooks/useGameLoop (+1 more)
- `src/features/javelin/components/CircularTimingMeter.tsx` → ../../../i18n/init, ../game/types
- `src/features/javelin/components/ControlHelp.tsx` → ../../../i18n/init
- `src/features/javelin/components/GameCanvas.tsx` → ../../../i18n/init, ../game/render, ../game/types, ../hooks/usePointerControls
- `src/features/javelin/components/HudPanel.tsx` → ../../../i18n/init, ../game/selectors, ../game/types
- `src/features/javelin/components/LanguageSwitch.tsx` → ../../../i18n/init, ../game/types
- `src/features/javelin/components/ScoreBoard.tsx` → ../../../i18n/init, ../game/types
- `src/features/javelin/game/athletePose.test.ts` → ./athletePose
- `src/features/javelin/game/athletePose.ts` → ./constants, ./math, ./tuning, ./types
- `src/features/javelin/game/audio.test.ts` → ./audio
- `src/features/javelin/game/audio.ts` → ./math, ./tuning
- `src/features/javelin/game/camera.ts` → ./constants, ./math, ./tuning, ./types
- `src/features/javelin/game/chargeMeter.test.ts` → ./chargeMeter
- `src/features/javelin/game/chargeMeter.ts` → ./math, ./types
- `src/features/javelin/game/controls.test.ts` → ./constants, ./controls
- `src/features/javelin/game/controls.ts` → ./constants, ./math, ./tuning
- `src/features/javelin/game/physics.test.ts` → ./constants, ./physics, ./scoring
- `src/features/javelin/game/physics.ts` → ./constants, ./math, ./types
- `src/features/javelin/game/reducer.test.ts` → ./constants, ./reducer, ./tuning, ./update, ./wind
- `src/features/javelin/game/reducer.ts` → ./types, ./update
- `src/features/javelin/game/render.test.ts` → ./athletePose, ./render, ./tuning, ./types
- `src/features/javelin/game/render.ts` → ./athletePose, ./audio, ./camera, ./constants, ./renderAthlete, ./renderMeter, ./renderWind, ./trajectory, ./tuning, ./types
- `src/features/javelin/game/renderAthlete.ts` → ./athletePose, ./camera
- `src/features/javelin/game/renderMeter.ts` → ./constants, ./math, ./renderAthlete, ./selectors, ./tuning, ./types
- `src/features/javelin/game/renderWind.test.ts` → ./renderWind
- `src/features/javelin/game/renderWind.ts` → ./math, ./tuning
- `src/features/javelin/game/scoring.test.ts` → ./scoring
- `src/features/javelin/game/scoring.ts` → ./constants, ./math, ./types
- `src/features/javelin/game/selectors.test.ts` → ./selectors, ./types
- `src/features/javelin/game/selectors.ts` → ./constants, ./types
- `src/features/javelin/game/trajectory.test.ts` → ./trajectory
- `src/features/javelin/game/trajectory.ts` → ./constants, ./math, ./physics, ./tuning
- `src/features/javelin/game/tuning.ts` → ./types
- `src/features/javelin/game/update.ts` → ./athletePose, ./chargeMeter, ./constants, ./math, ./physics, ./scoring, ./tuning, ./types, ./wind
- `src/features/javelin/game/wind.test.ts` → ./constants, ./tuning, ./wind
- `src/features/javelin/game/wind.ts` → ./constants, ./math, ./tuning
- `src/features/javelin/hooks/useGameLoop.ts` → ../game/types
- `src/features/javelin/hooks/useLocalHighscores.test.ts` → ../game/constants, ../game/types, ./useLocalHighscores
- `src/features/javelin/hooks/useLocalHighscores.ts` → ../../../app/browser, ../game/constants, ../game/types
- `src/features/javelin/hooks/usePointerControls.test.ts` → ../game/types, ./usePointerControls
- `src/features/javelin/hooks/usePointerControls.ts` → ../../../app/browser, ../game/audio, ../game/controls, ../game/render, ../game/tuning, ../game/types
- `src/i18n/init.test.ts` → ./init
- `src/i18n/init.tsx` → ../app/browser, ../features/javelin/game/types, ./resources
- `src/i18n/resources.ts` → ../features/javelin/game/types
- `src/main.tsx` → ./app/App, ./i18n/init

## Files by Subsystem

### Entry points & app wiring
- `src/app/App.tsx` (7 lines) — App
- `src/app/browser.ts` (45 lines) — isInteractiveElement, safeLocalStorageGet, safeLocalStorageSet
- `src/app/useMediaQuery.ts` (40 lines) — useMediaQuery
- `src/main.tsx` (20 lines)
- `src/app/browser.test.ts` (79 lines)

### Gameplay systems
- `src/features/javelin/game/physics.ts` (271 lines) — computeLaunchSpeedMs, createPhysicalJavelin, updatePhysicalJavelin, distanceFromJavelin
- `src/features/javelin/game/tuning.ts` (250 lines) — GameplayTuning, GAMEPLAY_TUNING, RUNUP_TAP_GAIN_NORM, RUNUP_TAP_SOFT_CAP_INTERVAL_MS, RUNUP_TAP_SOFT_CAP_MIN_MULTIPLIER, RUNUP_START_X_M, RUNUP_SPEED_DECAY_PER_SECOND, CHARGE_AIM_SPEED_DECAY_PER_SECOND, CHARGE_AIM_STOP_SPEED_NORM, FOLLOW_THROUGH_STEP_DISTANCE_M (+5 more)

### Rendering & visual effects
- `src/features/javelin/game/camera.ts` (237 lines) — WorldToScreenInput, WorldToScreen, RUNWAY_OFFSET_X, CameraSmoothingState, createCameraSmoothingState, getCameraTargetX, getViewWidthM, getCameraAheadRatio, getVerticalScale, createWorldToScreenRaw (+1 more)
- `src/features/javelin/game/render.ts` (784 lines) — RenderSession, createRenderSession, getVisibleJavelinRenderState, getPlayerAngleAnchorScreen, renderGame

### Audio
- `docs/audio-qa.md` (32 lines)
- `src/features/javelin/game/audio.ts` (434 lines) — playRunupTap, playChargeStart, playThrowWhoosh, setFlightWindIntensity, playLandingImpact, playCrowdReaction, playFaultOof, resumeAudioContext

### Frontend / UI
- `src/features/javelin/components/CircularTimingMeter.tsx` (101 lines) — CircularTimingMeter
- `src/features/javelin/components/ControlHelp.tsx` (58 lines) — ControlHelpContent, ControlHelp
- `src/features/javelin/components/GameCanvas.tsx` (132 lines) — GameCanvas
- `src/features/javelin/components/HudPanel.tsx` (49 lines) — HudPanel
- `src/features/javelin/components/LanguageSwitch.tsx` (31 lines) — LanguageSwitch
- `src/features/javelin/components/ScoreBoard.tsx` (76 lines) — ScoreBoardContent, ScoreBoard

### Configuration / tooling / CI
- `package.json` (26 lines) — JavaScript/TypeScript package manifest (scripts, dependencies, metadata).
- `tsconfig.json` (25 lines) — TypeScript compiler configuration.

### Docs & specifications
- `README.md` (69 lines) — Project README / high-level documentation.

### Other code & helpers
- `src/features/javelin/game/types.ts` (162 lines) — Locale, FaultReason, TimingQuality, MeterWindow, RunupTapState, ChargeMeterState, AthletePoseState, ThrowInput, LaunchSnapshot, PhysicalJavelinState (+5 more)
- `.github/copilot-instructions.md` (6 lines)
- `.github/workflows/deploy.yml` (41 lines)
- `AGENT_GUIDE_GAMEPLAY_V2.md` (156 lines)
- `AGENTS.md` (26 lines)
- `docs/ai-notes.md` (22 lines)
- `index.html` (14 lines)
- `public/locales/en/common.json` (32 lines)
- `public/locales/fi/common.json` (32 lines)
- `public/locales/sv/common.json` (32 lines)
- `src/features/javelin/game/athletePose.ts` (488 lines) — AthletePoseGeometry, ThrowSubphaseSample, getRunToAimBlend01, sampleThrowSubphase, computeAthletePoseGeometry
- `src/features/javelin/game/chargeMeter.ts` (41 lines) — isInWindow, getTimingQuality, computeForcePreview, applyForceQualityBonus
- `src/features/javelin/game/constants.ts` (62 lines) — RUNUP_MAX_TAPS, RUNUP_SPEED_MIN_MS, RUNUP_SPEED_MAX_MS, THROW_LINE_X_M, CHARGE_ZONE_MARGIN_M, RUNUP_MAX_X_M, ANGLE_MIN_DEG, ANGLE_MAX_DEG, ANGLE_DEFAULT_DEG, CAMERA_RUNUP_VIEW_WIDTH_M (+5 more)
- `src/features/javelin/game/controls.ts` (70 lines) — keyboardAngleDelta, keyboardAngleHoldDelta, pointerFromAnchorToAngleDeg, smoothPointerAngleDeg
- `src/features/javelin/game/math.ts` (34 lines) — clamp, clamp01, wrap01, lerp, toRad, toDeg, roundTo1, easeOutQuad, easeOutCubic, easeInCubic (+1 more)
- `src/features/javelin/game/reducer.ts` (6 lines) — gameReducer
- `src/features/javelin/game/renderAthlete.ts` (103 lines) — HeadAnchor, drawAthlete
- `src/features/javelin/game/renderMeter.ts` (221 lines) — getHeadMeterScreenAnchor, drawWorldTimingMeter
- `src/features/javelin/game/renderWind.ts` (203 lines) — WindIndicatorLayout, FlagPolylinePoint, getWindIndicatorLayout, buildFlagPolyline, drawWindIndicator
- `src/features/javelin/game/scoring.ts` (87 lines) — DISTANCE_MEASURE_MODE, FOUL_ON_LINE_CROSS, REQUIRE_TIP_FIRST, REQUIRE_SECTOR, SECTOR_ANGLE_DEG, SECTOR_HALF_ANGLE_RAD, angleEfficiency, releaseEfficiency, windEfficiency, computeThrowDistance (+3 more)
- `src/features/javelin/game/selectors.ts` (64 lines) — getSpeedPercent, getRunupMeterPhase01, getForcePreviewPercent, getRunupDistanceM, getThrowLineRemainingM
- `src/features/javelin/game/trajectory.ts` (61 lines) — TrajectoryPoint, TrajectoryPreview, computeTrajectoryPreview
- `src/features/javelin/game/update.ts` (652 lines) — createInitialGameState, reduceGameState
- `src/features/javelin/game/wind.ts` (66 lines) — sampleWindTargetMs, advanceWindMs
- `src/features/javelin/hooks/useGameLoop.ts` (26 lines) — useGameLoop
- `src/features/javelin/hooks/useLocalHighscores.ts` (141 lines) — pruneHighscores, insertHighscoreSorted, loadHighscores, saveHighscores, useLocalHighscores
- `src/features/javelin/hooks/usePointerControls.ts` (315 lines) — isInteractiveEventTarget, shouldReleaseChargeFromEnterKeyUp, shouldHandleAngleAdjustKeyDown, createTouchLongPressHandlers, usePointerControls
- `src/features/javelin/JavelinPage.tsx` (283 lines) — JavelinPage
- `src/i18n/init.tsx` (99 lines) — readStoredLocale, getBrowserLocale, resolveLocale, persistLocale, I18nProvider, useI18n
- `src/i18n/resources.ts` (193 lines) — Messages, resources
- `src/index.css` (464 lines)
- `vite.config.ts` (11 lines)
- `src/features/javelin/game/athletePose.test.ts` (78 lines)
- `src/features/javelin/game/audio.test.ts` (31 lines)
- `src/features/javelin/game/chargeMeter.test.ts` (30 lines)
- `src/features/javelin/game/controls.test.ts` (69 lines)
- `src/features/javelin/game/physics.test.ts` (182 lines)
- `src/features/javelin/game/reducer.test.ts` (459 lines)
- `src/features/javelin/game/render.test.ts` (357 lines)
- `src/features/javelin/game/renderWind.test.ts` (76 lines)
- `src/features/javelin/game/scoring.test.ts` (85 lines)
- `src/features/javelin/game/selectors.test.ts` (69 lines)
- `src/features/javelin/game/trajectory.test.ts` (96 lines)
- `src/features/javelin/game/wind.test.ts` (76 lines)
- `src/features/javelin/hooks/useLocalHighscores.test.ts` (117 lines) — Reusable hook / shared state or side-effect logic.
- `src/features/javelin/hooks/usePointerControls.test.ts` (126 lines) — Reusable hook / shared state or side-effect logic.
- `src/i18n/init.test.ts` (74 lines)
