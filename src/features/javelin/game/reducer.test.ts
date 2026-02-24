import { describe, expect, it } from 'vitest';
import {
  RUNUP_MAX_TAPS,
  RUNUP_MAX_X_M,
  THROW_LINE_X_M
} from './constants';
import { gameReducer } from './reducer';
import {
  GAMEPLAY_TUNING
} from './tuning';
import { createInitialGameState } from './update';
import { advanceCrosswindMs, advanceWindMs } from './wind';

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
      expect(state.phase.speedNorm).toBeGreaterThan(0);
      expect(state.phase.athletePose.animTag).toBe('run');
    }
  });

  it('slower tap cadence builds more speed than very rapid tapping', () => {
    let spaced = createInitialGameState();
    spaced = gameReducer(spaced, { type: 'startRound', atMs: 1000, windMs: 0 });
    spaced = tapRunupNTimes(spaced, 1000, 5, RUNUP_TAP_SOFT_CAP_INTERVAL_MS + 15);

    let rapid = createInitialGameState();
    rapid = gameReducer(rapid, { type: 'startRound', atMs: 1000, windMs: 0 });
    rapid = tapRunupNTimes(rapid, 1000, 5, 20);

    expect(spaced.phase.tag).toBe('runup');
    expect(rapid.phase.tag).toBe('runup');
    if (spaced.phase.tag === 'runup' && rapid.phase.tag === 'runup') {
      expect(spaced.phase.speedNorm).toBeGreaterThan(rapid.phase.speedNorm);
    }
  });

  it('rapid tapping still increases speed but with reduced per-tap gain', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1000 });
    const speedAfterFirst = state.phase.tag === 'runup' ? state.phase.speedNorm : 0;
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1015 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      const rapidGain = state.phase.speedNorm - speedAfterFirst;
      expect(rapidGain).toBeGreaterThan(0);
      expect(rapidGain).toBeLessThan(speedAfterFirst);
    }
  });

  it('applies stronger gain for spaced taps than near-instant repeats', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1000 });
    const speedAfterFirst = state.phase.tag === 'runup' ? state.phase.speedNorm : 0;
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1015 });
    const nearInstantTotal = state.phase.tag === 'runup' ? state.phase.speedNorm : 0;
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1140 });
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      const nearInstantGain = nearInstantTotal - speedAfterFirst;
      const spacedGain = state.phase.speedNorm - nearInstantTotal;
      expect(spacedGain).toBeGreaterThan(nearInstantGain);
    }
  });

  it('caps tap count to configured runup max taps', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = tapRunupNTimes(state, 1000, RUNUP_MAX_TAPS + 8, 25);

    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.tapCount).toBe(RUNUP_MAX_TAPS);
    }
  });

  it('runup locomotion advances and can cross throw line', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = tapRunupNTimes(state, 1100, 12, 120);
    state = tickForDuration(state, 2420, 5600, 16);
    expect(state.phase.tag).toBe('runup');
    if (state.phase.tag === 'runup') {
      expect(state.phase.runupDistanceM).toBeGreaterThan(THROW_LINE_X_M);
    }
  });

  it('allows immediate throw start before line without taps', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.2 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 1080 });
    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag === 'chargeAim') {
      expect(state.phase.runupDistanceM).toBeLessThan(THROW_LINE_X_M);
      expect(state.phase.startedAtMs).toBe(1000);
    }
  });

  it('keeps moving and decaying speed during chargeAim', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 3700 });

    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag !== 'chargeAim') {
      throw new Error('Expected chargeAim after beginChargeAim');
    }
    const startDistance = state.phase.runupDistanceM;
    const startSpeed = state.phase.speedNorm;

    for (let i = 1; i <= 5; i += 1) {
      state = gameReducer(state, { type: 'tick', dtMs: 100, nowMs: 3700 + i * 100 });
    }

    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag === 'chargeAim') {
      expect(state.phase.runupDistanceM).toBeGreaterThan(startDistance);
      expect(state.phase.speedNorm).toBeLessThan(startSpeed);
    }
  });

  it('decelerates during chargeAim before overfill', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 4520 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 4600 });
    const startSpeed = state.phase.tag === 'chargeAim' ? state.phase.speedNorm : 0;

    const tickCount = Math.floor((CHARGE_FILL_DURATION_MS * 0.9) / 100);
    for (let i = 1; i <= tickCount; i += 1) {
      state = gameReducer(state, { type: 'tick', dtMs: 100, nowMs: 4600 + i * 100 });
    }

    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag === 'chargeAim') {
      expect(state.phase.speedNorm).toBeLessThan(startSpeed);
    }
  });

  it('clamps chargeAim position to runup max distance', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'tick', dtMs: 9000, nowMs: 10000 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 10020 });

    for (let i = 1; i <= 4; i += 1) {
      state = gameReducer(state, { type: 'tick', dtMs: 120, nowMs: 10020 + i * 120 });
    }

    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag === 'chargeAim') {
      expect(state.phase.runupDistanceM).toBeLessThanOrEqual(RUNUP_MAX_X_M);
    }
  });

  it('crosses release threshold once and enters flight', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.2 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 3700 });
    state = gameReducer(state, { type: 'tick', dtMs: 280, nowMs: 3980 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 3990 });
    expect(state.phase.tag).toBe('throwAnim');

    state = gameReducer(state, {
      type: 'tick',
      dtMs: Math.round(THROW_ANIM_DURATION_MS * 0.72),
      nowMs: 4610
    });

    expect(state.phase.tag).toBe('flight');
    if (state.phase.tag === 'flight') {
      const releasedAt = state.phase.javelin.releasedAtMs;
      const athleteXAtRelease = state.phase.athleteXM;
      state = gameReducer(state, { type: 'tick', dtMs: 16, nowMs: 4626 });
      expect(state.phase.tag).toBe('flight');
      if (state.phase.tag === 'flight') {
        expect(state.phase.javelin.releasedAtMs).toBe(releasedAt);
        expect(state.phase.athleteXM).toBeGreaterThan(athleteXAtRelease);
      }
    }
  });

  it('captures release-time wind snapshot from live wind state', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.2 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 3700 });
    state = gameReducer(state, { type: 'tick', dtMs: 280, nowMs: 3980 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 3990 });
    expect(state.phase.tag).toBe('throwAnim');

    state = gameReducer(state, {
      type: 'tick',
      dtMs: Math.round(THROW_ANIM_DURATION_MS * 0.72),
      nowMs: 4610
    });

    expect(state.phase.tag).toBe('flight');
    if (state.phase.tag === 'flight') {
      expect(state.phase.launchedFrom.windMs).toBe(state.windMs);
    }
  });

  it('release near end of fill yields stronger force than early release', () => {
    let early = createInitialGameState();
    early = gameReducer(early, { type: 'startRound', atMs: 1000, windMs: 0 });
    early = gameReducer(early, { type: 'beginChargeAim', atMs: 1200 });
    early = gameReducer(early, { type: 'tick', dtMs: 120, nowMs: 1320 });
    early = gameReducer(early, { type: 'releaseCharge', atMs: 1320 });
    expect(early.phase.tag).toBe('throwAnim');

    let late = createInitialGameState();
    late = gameReducer(late, { type: 'startRound', atMs: 1000, windMs: 0 });
    late = gameReducer(late, { type: 'beginChargeAim', atMs: 1200 });
    late = gameReducer(late, {
      type: 'tick',
      dtMs: Math.round(CHARGE_FILL_DURATION_MS * 0.92),
      nowMs: 1200 + Math.round(CHARGE_FILL_DURATION_MS * 0.92)
    });
    late = gameReducer(
      late,
      { type: 'releaseCharge', atMs: 1200 + Math.round(CHARGE_FILL_DURATION_MS * 0.92) }
    );
    expect(late.phase.tag).toBe('throwAnim');

    if (early.phase.tag === 'throwAnim' && late.phase.tag === 'throwAnim') {
      expect(late.phase.forceNorm).toBeGreaterThan(early.phase.forceNorm);
    }
  });

  it('sets release flash timestamp on charge release', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 1200 });
    state = gameReducer(state, { type: 'tick', dtMs: 120, nowMs: 1320 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 1320 });
    expect(state.phase.tag).toBe('throwAnim');
    if (state.phase.tag === 'throwAnim') {
      expect(state.phase.releaseFlashAtMs).toBe(1320);
    }
  });

  it('allows release on second cycle with correct quality', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 1200 });
    const releaseMs = 1200 + Math.round(CHARGE_FILL_DURATION_MS * 1.85);
    state = gameReducer(state, {
      type: 'tick',
      dtMs: releaseMs - 1200,
      nowMs: releaseMs
    });
    state = gameReducer(state, { type: 'releaseCharge', atMs: releaseMs });
    expect(state.phase.tag).toBe('throwAnim');
    if (state.phase.tag === 'throwAnim') {
      expect(state.phase.releaseQuality).toBe('perfect');
    }
  });

  it('faults after exceeding max charge cycles', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 1200 });
    const overfillMs = CHARGE_FILL_DURATION_MS * CHARGE_MAX_CYCLES + 10;
    state = gameReducer(state, { type: 'tick', dtMs: overfillMs, nowMs: 1200 + overfillMs });

    expect(state.phase.tag).toBe('fault');
    if (state.phase.tag === 'fault') {
      expect(state.phase.reason).toBe('lateRelease');
      expect(state.phase.athletePose.animTag).toBe('fall');
      const startX = state.phase.athleteXM;
      state = gameReducer(state, { type: 'tick', dtMs: 120, nowMs: 1200 + overfillMs + 120 });
      expect(state.phase.tag).toBe('fault');
      if (state.phase.tag === 'fault') {
        expect(state.phase.athleteXM).toBeGreaterThan(startX);
      }
    }
  });

  it('sets absolute angle and clamps to allowed range', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'setAngle', angleDeg: 15 });
    expect(state.aimAngleDeg).toBe(15);

    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.1 });
    state = gameReducer(state, { type: 'setAngle', angleDeg: 66 });
    expect(state.aimAngleDeg).toBe(55);
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 1080 });
    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag === 'chargeAim') {
      expect(state.phase.angleDeg).toBe(55);
    }

    state = gameReducer(state, { type: 'setAngle', angleDeg: 90 });
    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag === 'chargeAim') {
      expect(state.phase.angleDeg).toBe(55);
    }

    state = gameReducer(state, { type: 'setAngle', angleDeg: -150 });
    expect(state.phase.tag).toBe('chargeAim');
    if (state.phase.tag === 'chargeAim') {
      expect(state.phase.angleDeg).toBe(15);
    }
  });

  it('crossing line at release ends as foul_line', () => {
    let state = createInitialGameState();
    state = gameReducer(state, { type: 'startRound', atMs: 1000, windMs: 0.3 });
    state = tapRunupNTimes(state, 1100, 12, 120);
    state = tickForDuration(state, 2420, 5600, 16);
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 8040 });
    expect(state.phase.tag).toBe('chargeAim');
    state = tickForDuration(state, 8040, 220, 16);
    state = gameReducer(state, { type: 'releaseCharge', atMs: 8270 });
    expect(state.phase.tag).toBe('throwAnim');
    if (state.phase.tag === 'throwAnim') {
      expect(state.phase.lineCrossedAtRelease).toBe(true);
    }

    for (let i = 0; i < 700; i += 1) {
      state = gameReducer(state, { type: 'tick', dtMs: 16, nowMs: 8270 + i * 16 });
      if (state.phase.tag === 'result') {
        break;
      }
    }

    expect(state.phase.tag).toBe('result');
    if (state.phase.tag === 'result') {
      expect(state.phase.resultKind).toBe('foul_line');
    }
  });

  it('continues wind evolution in result phase without mutating result payload', () => {
    const phase: Extract<ReturnType<typeof createInitialGameState>['phase'], { tag: 'result' }> = {
      tag: 'result',
      athleteXM: 18.7,
      launchedFrom: {
        speedNorm: 0.74,
        angleDeg: 36,
        forceNorm: 0.81,
        windMs: 0.4,
        launchSpeedMs: 28.2,
        athleteXM: 18.7,
        releaseQuality: 'good',
        lineCrossedAtRelease: false
      },
      distanceM: 72.8,
      isHighscore: false,
      resultKind: 'valid',
      tipFirst: true,
      landingTipXM: 92.4,
      landingXM: 91,
      landingYM: 0,
      landingAngleRad: -0.32
    };
    const state = {
      ...createInitialGameState(),
      nowMs: 5000,
      windMs: 0.4,
      windZMs: -0.2,
      roundId: 4,
      phase
    };
    const next = gameReducer(state, { type: 'tick', dtMs: 1400, nowMs: 6400 });

    expect(next.phase.tag).toBe('result');
    expect(next.phase).toBe(phase);
    expect(next.windMs).toBe(advanceWindMs(0.4, 1400, 6400));
    expect(next.windZMs).toBe(advanceCrosswindMs(-0.2, 1400, 6400));
  });
});
