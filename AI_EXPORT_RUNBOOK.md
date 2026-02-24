# Agent Runbook — Javelin
Generated: 2026-02-24T13:51:55.410265+00:00
Total files: 95 | Runbook tokens: ~4,682

## Project Overview
- App type: React-based web application or component library.

## Context
- Languages: TypeScript/JavaScript
- Package manager(s): npm
- JS/TS stack: React, Vite
- CI: GitHub Actions configured
- Primary docs file: README.md
- Env vars used: CANVAS_FONT_STACK, GITHUB_ACTIONS

## Repo Map
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

## Project Configuration
- Package: selain-games-2026-javelin v0.1.0
- Scripts: dev, build, preview, test, test:watch

## Build & Test Commands
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run test` — run tests
- `npm ci` (from CI: deploy.yml)
- `npm test` (from CI: deploy.yml)
- `npm run build` (from CI: deploy.yml)

## Recently Active Files
- `src/features/javelin/game/render.ts` (28 changes)
- `src/features/javelin/game/update.ts` (22 changes)
- `src/features/javelin/game/reducer.test.ts` (19 changes)
- `src/features/javelin/game/types.ts` (18 changes)
- `src/features/javelin/game/constants.ts` (17 changes)
- `src/features/javelin/game/tuning.ts` (15 changes)
- `src/features/javelin/game/render.test.ts` (15 changes)
- `src/features/javelin/game/athletePose.ts` (14 changes)
- `src/features/javelin/JavelinPage.tsx` (13 changes)
- `src/index.css` (12 changes)
- `src/features/javelin/hooks/usePointerControls.ts` (11 changes)
- `src/i18n/resources.ts` (11 changes)
- `src/features/javelin/game/selectors.ts` (11 changes)
- `src/features/javelin/components/GameCanvas.tsx` (8 changes)
- `src/features/javelin/game/physics.ts` (8 changes)

## Module Dependencies
- `src/app/App.tsx` → ../features/javelin/JavelinPage
- `src/app/browser.test.ts` → ./browser
- `src/features/javelin/JavelinPage.tsx` → ../../app/useMediaQuery, ../../i18n/init, ./components/ControlHelp, ./components/GameActions, ./components/GameCanvas, ./components/HudPanel, ./components/LanguageSwitch, ./components/ResultDisplay, ./components/SaveScoreForm, ./components/ScoreBoard, ./components/ThemeToggle, ./game/reducer (+5 more)
- `src/features/javelin/components/CircularTimingMeter.tsx` → ../../../i18n/init, ../game/math, ../game/types
- `src/features/javelin/components/ControlHelp.tsx` → ../../../i18n/init
- `src/features/javelin/components/GameActions.tsx` → ../../../i18n/init, ../game/audio, ../game/types
- `src/features/javelin/components/GameCanvas.tsx` → ../../../app/useMediaQuery, ../../../i18n/init, ../../../theme/init, ../game/audio, ../game/render, ../game/types, ../hooks/controls, ./ControlHelp
- `src/features/javelin/components/HudPanel.tsx` → ../../../i18n/init, ../game/selectors, ../game/types
- `src/features/javelin/components/LanguageSwitch.tsx` → ../../../i18n/init, ../game/types
- `src/features/javelin/components/ResultDisplay.tsx` → ../../../i18n/init, ../hooks/useResultMessage
- `src/features/javelin/components/SaveScoreForm.tsx` → ../../../i18n/init
- `src/features/javelin/components/ScoreBoard.tsx` → ../../../i18n/init, ../game/types
- `src/features/javelin/components/ThemeToggle.tsx` → ../../../i18n/init, ../../../theme/init
- `src/features/javelin/game/athletePose.test.ts` → ./athletePose
- `src/features/javelin/game/athletePose.ts` → ./constants, ./math, ./tuning, ./types
- `src/features/javelin/game/audio.test.ts` → ./audio
- `src/features/javelin/game/audio.ts` → ./math, ./tuning
- `src/features/javelin/game/camera.test.ts` → ./camera, ./constants, ./tuning, ./types
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
- `src/features/javelin/game/render/background.ts` → ../../../../theme/init, ../constants, ../renderTheme, ./types
- `src/features/javelin/game/render/field.ts` → ../camera, ../constants, ../renderTheme
- `src/features/javelin/game/render/index.ts` → ../camera, ../renderMeter, ./javelinRender, ./renderGame, ./session, ./types
- `src/features/javelin/game/render/javelinRender.ts` → ../athletePose, ../camera, ../constants, ../renderTheme, ../trajectory, ../tuning, ../types
- `src/features/javelin/game/render/overlays.ts` → ../camera, ../constants, ../renderTheme, ../renderWind, ../types, ./javelinRender, ./types
- `src/features/javelin/game/render/renderGame.ts` → ../camera, ../constants, ../renderAthlete, ../renderMeter, ../renderWind, ../trajectory, ./background, ./field, ./javelinRender, ./overlays, ./types
- `src/features/javelin/game/render/session.ts` → ../camera, ./types
- `src/features/javelin/game/render/types.ts` → ../../../../theme/init, ../camera, ../renderTheme, ../types
- `src/features/javelin/game/renderAthlete.ts` → ./athletePose, ./camera, ./renderTheme
- `src/features/javelin/game/renderMeter.ts` → ../../../theme/init, ./constants, ./math, ./renderAthlete, ./renderTheme, ./selectors, ./tuning, ./types
- `src/features/javelin/game/renderTheme.test.ts` → ./renderTheme
- `src/features/javelin/game/renderTheme.ts` → ../../../theme/init
- `src/features/javelin/game/renderWind.test.ts` → ./renderWind
- `src/features/javelin/game/renderWind.ts` → ../../../theme/init, ./constants, ./math, ./renderTheme, ./tuning
- `src/features/javelin/game/scoring.test.ts` → ./scoring
- `src/features/javelin/game/scoring.ts` → ./constants, ./math, ./types
- `src/features/javelin/game/selectors.test.ts` → ./selectors, ./types
- `src/features/javelin/game/selectors.ts` → ./constants, ./types
- `src/features/javelin/game/trajectory.test.ts` → ./trajectory
- `src/features/javelin/game/trajectory.ts` → ./constants, ./math, ./physics, ./tuning
- `src/features/javelin/game/tuning.ts` → ./types
- `src/features/javelin/game/update/helpers.ts` → ../athletePose, ../constants, ../math, ../physics, ../tuning, ../types
- `src/features/javelin/game/update/index.ts` → ./initialState, ./reduce
- `src/features/javelin/game/update/initialState.ts` → ../constants, ../types, ../wind
- `src/features/javelin/game/update/reduce.ts` → ../athletePose, ../chargeMeter, ../constants, ../math, ../tuning, ../types, ../wind, ./helpers, ./tickChargeAim, ./tickFault, ./tickFlight, ./tickRunup (+1 more)
- `src/features/javelin/game/update/tickChargeAim.ts` → ../chargeMeter, ../constants, ../math, ../tuning, ../types, ./helpers
- `src/features/javelin/game/update/tickFault.ts` → ../math, ../physics, ../types, ./helpers
- `src/features/javelin/game/update/tickFlight.ts` → ../math, ../physics, ../scoring, ../types, ./helpers
- `src/features/javelin/game/update/tickRunup.ts` → ../constants, ../math, ../tuning, ../types, ./helpers
- `src/features/javelin/game/update/tickThrowAnim.ts` → ../athletePose, ../constants, ../math, ../physics, ../tuning, ../types, ./helpers
- `src/features/javelin/game/wind.test.ts` → ./constants, ./tuning, ./wind
- `src/features/javelin/game/wind.ts` → ./constants, ./math, ./tuning
- `src/features/javelin/hooks/controls/index.ts` → ../../game/types, ./types, ./useKeyboardControls, ./useMouseControls, ./useTouchControls
- `src/features/javelin/hooks/controls/types.ts` → ../../../../app/browser, ../../game/types
- `src/features/javelin/hooks/controls/useKeyboardControls.ts` → ../../game/audio, ../../game/controls, ../../game/tuning, ../../game/types, ./types
- `src/features/javelin/hooks/controls/useMouseControls.ts` → ../../game/audio, ../../game/controls, ../../game/render, ../../game/types, ./types
- `src/features/javelin/hooks/controls/useTouchControls.ts` → ../../game/audio, ../../game/controls, ../../game/render, ../../game/types, ./types
- `src/features/javelin/hooks/useGameLoop.ts` → ../game/types
- `src/features/javelin/hooks/useLocalHighscores.test.ts` → ../game/constants, ../game/types, ./useLocalHighscores
- `src/features/javelin/hooks/useLocalHighscores.ts` → ../../../app/browser, ../game/constants, ../game/types
- `src/features/javelin/hooks/usePointerControls.test.ts` → ../game/types, ./controls
- `src/features/javelin/hooks/useResultMessage.ts` → ../../../i18n/init, ../game/types
- `src/i18n/init.test.ts` → ./init
- `src/i18n/init.tsx` → ../app/browser, ../features/javelin/game/types, ./resources
- `src/i18n/resources.ts` → ../features/javelin/game/types
- `src/main.tsx` → ./app/App, ./i18n/init, ./pwa/register, ./theme/init
- `src/theme/init.test.tsx` → ./init
- `src/theme/init.tsx` → ../app/browser

## Files by Subsystem

### Entry points & app wiring
- `src/app/App.tsx` (7 lines) — App
- `src/app/browser.ts` (45 lines) — isInteractiveElement, safeLocalStorageGet, safeLocalStorageSet
- `src/app/useMediaQuery.ts` (33 lines) — useMediaQuery
- `src/main.tsx` (26 lines)
- `src/app/browser.test.ts` (79 lines)

### Gameplay systems
- `src/features/javelin/game/physics.ts` (305 lines) — computeLaunchSpeedMs, createPhysicalJavelin, updatePhysicalJavelin, distanceFromJavelin
- `src/features/javelin/game/tuning.ts` (175 lines) — GameplayTuning, GAMEPLAY_TUNING

### Rendering & visual effects
- `src/features/javelin/game/render/types.ts` (124 lines) — CloudLayer, CLOUD_LAYERS, ResultMarkerFadeState, PaletteCacheState, BackgroundGradientCacheState, RenderSession, ReleaseFlashLabels, OverlayHints, GameAudioCallbacks, RenderFrameInput
- `src/features/javelin/game/camera.ts` (261 lines) — WorldToScreenInput, WorldToScreen, RUNWAY_OFFSET_X, CameraSmoothingState, createCameraSmoothingState, getCameraTargetX, getViewWidthM, getCameraAheadRatio, getVerticalScale, createWorldToScreenRaw (+1 more)
- `src/features/javelin/game/render/background.ts` (105 lines) — getSessionPalette, drawBackground, drawClouds
- `src/features/javelin/game/render/field.ts` (116 lines) — drawTrackAndField
- `src/features/javelin/game/render/index.ts` (16 lines)
- `src/features/javelin/game/render/javelinRender.ts` (401 lines) — JavelinRenderState, getVisibleJavelinRenderState, drawJavelinWorld, drawLandedJavelin, drawLandingMarker, drawTrajectoryIndicator, getPoseForState, getPlayerAngleAnchorScreen, shouldDrawFrontArmOverHead
- `src/features/javelin/game/render/overlays.ts` (171 lines) — drawOnboardingHint, drawWindHint, drawResultOverlay, drawReleaseFlash
- `src/features/javelin/game/render/renderGame.ts` (216 lines) — renderGame
- `src/features/javelin/game/render/session.ts` (20 lines) — createRenderSession

### Audio
- `docs/audio-qa.md` (32 lines)
- `src/features/javelin/game/audio.ts` (437 lines) — playRunupTap, playChargeStart, playThrowWhoosh, setFlightWindIntensity, playLandingImpact, playCrowdReaction, playFaultOof, resumeAudioContext

### Frontend / UI
- `src/features/javelin/components/CircularTimingMeter.tsx` (98 lines) — CircularTimingMeter
- `src/features/javelin/components/ControlHelp.tsx` (58 lines) — detectTouchDevice, ControlHelpContent, ControlHelp
- `src/features/javelin/components/GameActions.tsx` (50 lines) — GameActions
- `src/features/javelin/components/GameCanvas.tsx` (244 lines) — GameCanvas
- `src/features/javelin/components/HudPanel.tsx` (49 lines) — HudPanel
- `src/features/javelin/components/LanguageSwitch.tsx` (31 lines) — LanguageSwitch
- `src/features/javelin/components/ResultDisplay.tsx` (53 lines) — ResultDisplay
- `src/features/javelin/components/SaveScoreForm.tsx` (38 lines) — SaveScoreForm
- `src/features/javelin/components/ScoreBoard.tsx` (76 lines) — ScoreBoardContent, ScoreBoard
- `src/features/javelin/components/ThemeToggle.tsx` (30 lines) — ThemeToggle

### Configuration / tooling / CI
- `package.json` (27 lines) — JavaScript/TypeScript package manifest (scripts, dependencies, metadata).
- `tsconfig.json` (25 lines) — TypeScript compiler configuration.

### Docs & specifications
- `README.md` (85 lines) — Project README / high-level documentation.

### Other code & helpers
- `src/features/javelin/game/types.ts` (163 lines) — Locale, FaultReason, TimingQuality, MeterWindow, RunupTapState, ChargeMeterState, AthletePoseState, ThrowInput, LaunchSnapshot, PhysicalJavelinState (+5 more)
- `src/features/javelin/hooks/controls/types.ts` (120 lines) — Dispatch, AngleKeyHoldState, TouchLongPressHandlers, TouchLongPressHandlerArgs, isInteractiveEventTarget, shouldReleaseChargeFromEnterKeyUp, shouldHandleAngleAdjustKeyDown, shouldConsumeActionKeyDown, createTouchLongPressHandlers
- `.github/copilot-instructions.md` (6 lines)
- `.github/workflows/deploy.yml` (42 lines)
- `AGENTS.md` (26 lines)
- `docs/ai-notes.md` (22 lines)
- `index.html` (26 lines)
- `public/robots.txt` (3 lines)
- `src/features/javelin/game/athletePose.ts` (499 lines) — AthletePoseGeometry, ThrowSubphaseSample, getRunToAimBlend01, sampleThrowSubphase, computeAthletePoseGeometry
- `src/features/javelin/game/chargeMeter.ts` (48 lines) — isInWindow, getTimingQuality, computeForcePreview, applyForceQualityBonus
- `src/features/javelin/game/constants.ts` (67 lines) — RUNUP_MAX_TAPS, RUNUP_SPEED_MIN_MS, RUNUP_SPEED_MAX_MS, THROW_LINE_X_M, CHARGE_ZONE_MARGIN_M, RUNUP_MAX_X_M, ANGLE_MIN_DEG, ANGLE_MAX_DEG, ANGLE_DEFAULT_DEG, CAMERA_RUNUP_VIEW_WIDTH_M (+5 more)
- `src/features/javelin/game/controls.ts` (72 lines) — keyboardAngleDelta, keyboardAngleHoldDelta, pointerFromAnchorToAngleDeg, smoothPointerAngleDeg
- `src/features/javelin/game/math.ts` (34 lines) — clamp, clamp01, wrap01, lerp, toRad, toDeg, roundTo1, easeOutQuad, easeOutCubic, easeInCubic (+1 more)
- `src/features/javelin/game/reducer.ts` (13 lines) — gameReducer
- `src/features/javelin/game/renderAthlete.ts` (106 lines) — HeadAnchor, drawAthlete
- `src/features/javelin/game/renderMeter.ts` (231 lines) — getHeadMeterScreenAnchor, drawWorldTimingMeter
- `src/features/javelin/game/renderTheme.ts` (188 lines) — RenderPalette, getRenderPalette
- `src/features/javelin/game/renderWind.ts` (221 lines) — WindIndicatorLayout, FlagPolylinePoint, getWindIndicatorLayout, buildFlagPolyline, drawWindIndicator
- `src/features/javelin/game/scoring.ts` (117 lines) — DISTANCE_MEASURE_MODE, SECTOR_ANGLE_DEG, SECTOR_HALF_ANGLE_RAD, ScoringRules, COMPETITION_RULES, angleEfficiency, releaseEfficiency, windEfficiency, computeThrowDistance, computeCompetitionDistanceM (+2 more)
- `src/features/javelin/game/selectors.ts` (64 lines) — getSpeedPercent, getRunupMeterPhase01, getForcePreviewPercent, getRunupDistanceM, getThrowLineRemainingM
- `src/features/javelin/game/trajectory.ts` (69 lines) — TrajectoryPoint, TrajectoryPreview, computeTrajectoryPreview
- `src/features/javelin/game/update/helpers.ts` (115 lines) — runupTapGainMultiplier, runStrideHz, advanceRunAnimT, runSpeedMsFromNorm, isRunning, FALL_ANIM_DURATION_MS, followThroughStepOffsetM, faultStumbleOffsetM, createFaultJavelinFromCharge, lateralVelocityFromRelease (+1 more)
- `src/features/javelin/game/update/index.ts` (7 lines)
- `src/features/javelin/game/update/initialState.ts` (20 lines) — createInitialGameState
- `src/features/javelin/game/update/reduce.ts` (279 lines) — reduceGameState
- `src/features/javelin/game/update/tickChargeAim.ts` (85 lines) — tickChargeAim
- `src/features/javelin/game/update/tickFault.ts` (47 lines) — tickFault
- `src/features/javelin/game/update/tickFlight.ts` (65 lines) — tickFlight
- `src/features/javelin/game/update/tickRunup.ts` (49 lines) — tickRunup
- `src/features/javelin/game/update/tickThrowAnim.ts` (92 lines) — tickThrowAnim
- `src/features/javelin/game/wind.ts` (145 lines) — sampleWindTargetMs, sampleCrosswindTargetMs, advanceWindMs, advanceCrosswindMs
- `src/features/javelin/hooks/controls/index.ts` (44 lines) — usePointerControls
- `src/features/javelin/hooks/controls/useKeyboardControls.ts` (126 lines) — useKeyboardControls
- `src/features/javelin/hooks/controls/useMouseControls.ts` (101 lines) — useMouseControls
- `src/features/javelin/hooks/controls/useTouchControls.ts` (88 lines) — useTouchControls
- `src/features/javelin/hooks/useGameLoop.ts` (26 lines) — useGameLoop
- `src/features/javelin/hooks/useLocalHighscores.ts` (141 lines) — pruneHighscores, insertHighscoreSorted, loadHighscores, saveHighscores, useLocalHighscores
- `src/features/javelin/hooks/useResultMessage.ts` (77 lines) — ResultThrowSpecs, ResultMessageState, useResultMessage
- `src/features/javelin/JavelinPage.tsx` (196 lines) — JavelinPage
- `src/i18n/init.tsx` (117 lines) — readStoredLocale, getBrowserLocale, resolveLocale, persistLocale, I18nProvider, useI18n
- `src/i18n/resources.ts` (229 lines) — Messages, resources
- `src/index.css` (638 lines)
- `src/pwa/register.ts` (18 lines) — registerPwa
- `src/theme/init.test.tsx` (93 lines)
- `src/theme/init.tsx` (99 lines) — ThemeMode, readStoredTheme, getBrowserPrefersDark, resolveTheme, persistTheme, ThemeProvider, useTheme
- `src/vite-env.d.ts` (3 lines)
- `vite.config.ts` (67 lines)
- `src/features/javelin/game/athletePose.test.ts` (78 lines)
- `src/features/javelin/game/audio.test.ts` (31 lines)
- `src/features/javelin/game/camera.test.ts` (248 lines)
- `src/features/javelin/game/chargeMeter.test.ts` (30 lines)
- `src/features/javelin/game/controls.test.ts` (69 lines)
- `src/features/javelin/game/physics.test.ts` (217 lines)
- `src/features/javelin/game/reducer.test.ts` (477 lines)
- `src/features/javelin/game/render.test.ts` (360 lines)
- `src/features/javelin/game/renderTheme.test.ts` (33 lines)
- `src/features/javelin/game/renderWind.test.ts` (76 lines)
- `src/features/javelin/game/scoring.test.ts` (112 lines)
- `src/features/javelin/game/selectors.test.ts` (71 lines)
- `src/features/javelin/game/trajectory.test.ts` (136 lines)
- `src/features/javelin/game/wind.test.ts` (128 lines)
- `src/features/javelin/hooks/useLocalHighscores.test.ts` (117 lines) — Reusable hook / shared state or side-effect logic.
- `src/features/javelin/hooks/usePointerControls.test.ts` (136 lines) — Reusable hook / shared state or side-effect logic.
- `src/i18n/init.test.ts` (74 lines)
