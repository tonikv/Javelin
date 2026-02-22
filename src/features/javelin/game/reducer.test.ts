import { describe, expect, it } from 'vitest';
import {
  RUNUP_MAX_X_M,
  THROW_LINE_X_M
} from './constants';
import { gameReducer } from './reducer';
import {
  BEAT_INTERVAL_MS,
  CHARGE_FILL_DURATION_MS,
  CHARGE_MAX_CYCLES,
  RUNUP_PASSIVE_MAX_SPEED,
  RUNUP_PASSIVE_TO_HALF_MS,
  RUNUP_START_X_M,
  THROW_ANIM_DURATION_MS
} from './tuning';
import { createInitialGameState } from './update';

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
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1300 });
    state = gameReducer(state, { type: 'tick', dtMs: 9000, nowMs: 10000 });
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
    state = gameReducer(state, { type: 'rhythmTap', atMs: 1880 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 2760 });
    state = gameReducer(state, { type: 'rhythmTap', atMs: 3640 });
    state = gameReducer(state, { type: 'tick', dtMs: 7800, nowMs: 8800 });
    state = gameReducer(state, { type: 'beginChargeAim', atMs: 8820 });
    expect(state.phase.tag).toBe('chargeAim');
    state = gameReducer(state, { type: 'tick', dtMs: 300, nowMs: 9120 });
    state = gameReducer(state, { type: 'releaseCharge', atMs: 9130 });
    expect(state.phase.tag).toBe('throwAnim');

    for (let i = 0; i < 700; i += 1) {
      state = gameReducer(state, { type: 'tick', dtMs: 16, nowMs: 9130 + i * 16 });
      if (state.phase.tag === 'result') {
        break;
      }
    }

    expect(state.phase.tag).toBe('result');
    if (state.phase.tag === 'result') {
      expect(state.phase.resultKind).toBe('foul_line');
    }
  });
});
