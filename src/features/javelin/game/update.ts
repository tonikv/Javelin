import {
  ANGLE_DEFAULT_DEG,
  ANGLE_MAX_DEG,
  ANGLE_MIN_DEG,
  JAVELIN_GRIP_OFFSET_M,
  JAVELIN_RELEASE_OFFSET_Y_M,
  RUNUP_MAX_TAPS,
  RUNUP_MAX_X_M,
  RUNUP_SPEED_MAX_MS,
  RUNUP_SPEED_MIN_MS,
  THROW_LINE_X_M
} from './constants';
import {
  applyForceQualityBonus,
  computeForcePreview,
  getTimingQuality
} from './chargeMeter';
import { computeAthletePoseGeometry } from './athletePose';
import { clamp, easeOutQuad, toRad, wrap01 } from './math';
import { computeLaunchSpeedMs, createPhysicalJavelin, updatePhysicalJavelin } from './physics';
import {
  computeCompetitionDistanceM,
  evaluateThrowLegality
} from './scoring';
import {
  BEAT_INTERVAL_MS,
  CHARGE_AIM_SPEED_DECAY_PER_SECOND,
  CHARGE_AIM_STOP_SPEED_NORM,
  CHARGE_FILL_DURATION_MS,
  CHARGE_GOOD_WINDOW,
  CHARGE_MAX_CYCLES,
  CHARGE_PERFECT_WINDOW,
  FAULT_JAVELIN_LAUNCH_SPEED_MS,
  FAULT_STUMBLE_DISTANCE_M,
  FOLLOW_THROUGH_STEP_DISTANCE_M,
  GOOD_WINDOW_MS,
  PERFECT_WINDOW_MS,
  RHYTHM_SPEED_DELTA_GOOD,
  RHYTHM_SPEED_DELTA_IN_PENALTY,
  RHYTHM_SPEED_DELTA_MISS,
  RHYTHM_SPEED_DELTA_PERFECT,
  RHYTHM_SPEED_DELTA_SPAM,
  RUNUP_PASSIVE_MAX_SPEED,
  RUNUP_PASSIVE_TO_HALF_MS,
  RUNUP_SPEED_DECAY_PER_SECOND,
  RUNUP_START_X_M,
  RUN_TO_DRAWBACK_BLEND_MS,
  SPAM_PENALTY_MS,
  SPAM_THRESHOLD_MS,
  THROW_ANIM_DURATION_MS,
  THROW_RELEASE_PROGRESS
} from './tuning';
import type { GameAction, GameState, TimingQuality } from './types';

const nearestBeatDeltaMs = (startedAtMs: number, atMs: number): number => {
  const elapsed = atMs - startedAtMs;
  const beatIndex = Math.round(elapsed / BEAT_INTERVAL_MS);
  const beatTime = startedAtMs + beatIndex * BEAT_INTERVAL_MS;
  return Math.abs(atMs - beatTime);
};

const timingQualityFromBeatDelta = (deltaMs: number): TimingQuality => {
  if (deltaMs <= PERFECT_WINDOW_MS) {
    return 'perfect';
  }
  if (deltaMs <= GOOD_WINDOW_MS) {
    return 'good';
  }
  return 'miss';
};

const rhythmTapSpeedDelta = (quality: TimingQuality): number => {
  if (quality === 'perfect') {
    return RHYTHM_SPEED_DELTA_PERFECT;
  }
  if (quality === 'good') {
    return RHYTHM_SPEED_DELTA_GOOD;
  }
  return RHYTHM_SPEED_DELTA_MISS;
};

const runStrideHz = (speedNorm: number): number => 1 + speedNorm * 2.2;

const advanceRunAnimT = (currentAnimT: number, dtMs: number, speedNorm: number): number =>
  wrap01(currentAnimT + (Math.max(0, dtMs) / 1000) * runStrideHz(speedNorm));

const passiveSpeedTarget = (startedAtMs: number, nowMs: number): number => {
  const elapsedMs = Math.max(0, nowMs - startedAtMs);
  const t = clamp(elapsedMs / RUNUP_PASSIVE_TO_HALF_MS, 0, 1);
  return RUNUP_PASSIVE_MAX_SPEED * easeOutQuad(t);
};

const runSpeedMsFromNorm = (speedNorm: number): number =>
  RUNUP_SPEED_MIN_MS + (RUNUP_SPEED_MAX_MS - RUNUP_SPEED_MIN_MS) * speedNorm;

const isRunning = (speedNorm: number): boolean => speedNorm > 0.01;
const FALL_ANIM_DURATION_MS = 340;

const followThroughStepOffsetM = (animT: number): number => {
  const t = clamp(animT, 0, 1);
  const step01 = t < 0.78 ? easeOutQuad(t / 0.78) : 1;
  return FOLLOW_THROUGH_STEP_DISTANCE_M * step01;
};

const faultStumbleOffsetM = (animT: number): number => {
  const t = clamp(animT, 0, 1);
  const step01 = t < 0.72 ? easeOutQuad(t / 0.72) : 1;
  return FAULT_STUMBLE_DISTANCE_M * step01;
};

const createFaultJavelinFromCharge = (
  phase: Extract<GameState['phase'], { tag: 'chargeAim' }>,
  nowMs: number
) => {
  const releasePose = computeAthletePoseGeometry(
    phase.athletePose,
    phase.speedNorm,
    phase.angleDeg,
    phase.runupDistanceM,
    {
      runBlendFromAnimT: phase.runEntryAnimT,
      runToAimBlend01: 1
    }
  );
  const launchAngleRad = Math.max(0.02, toRad(Math.min(24, phase.angleDeg)));
  const athleteForwardMs = runSpeedMsFromNorm(phase.speedNorm) * 0.12;
  return createPhysicalJavelin({
    xM: releasePose.javelinGrip.xM + Math.cos(launchAngleRad) * JAVELIN_GRIP_OFFSET_M,
    yM: Math.max(
      1.05,
      releasePose.javelinGrip.yM + Math.sin(launchAngleRad) * JAVELIN_RELEASE_OFFSET_Y_M
    ),
    zM: 0,
    launchAngleRad,
    launchSpeedMs: FAULT_JAVELIN_LAUNCH_SPEED_MS,
    athleteForwardMs,
    lateralVelMs: 0,
    releasedAtMs: nowMs
  });
};

const lateralVelocityFromRelease = (
  quality: TimingQuality,
  angleDeg: number,
  roundId: number
): number => {
  const qualityBase = quality === 'perfect' ? 0.1 : quality === 'good' ? 0.45 : 0.95;
  const sign = roundId % 2 === 0 ? 1 : -1;
  const angleBias = ((angleDeg - ANGLE_DEFAULT_DEG) / 18) * 0.55;
  return sign * qualityBase + angleBias;
};

const createLateReleaseFaultPhase = (
  phase: Extract<GameState['phase'], { tag: 'chargeAim' }>,
  nowMs: number
): Extract<GameState['phase'], { tag: 'fault' }> => ({
  tag: 'fault',
  reason: 'lateRelease',
  athleteXM: phase.runupDistanceM,
  athletePose: {
    animTag: 'fall',
    animT: 0
  },
  javelin: createFaultJavelinFromCharge(phase, nowMs),
  javelinLanded: false
});

export const createInitialGameState = (): GameState => ({
  nowMs: performance.now(),
  roundId: 0,
  windMs: 0,
  aimAngleDeg: ANGLE_DEFAULT_DEG,
  phase: { tag: 'idle' }
});

const tickFault = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'fault') {
    return state;
  }

  const nextFaultAnimT = clamp(
    state.phase.athletePose.animT + dtMs / FALL_ANIM_DURATION_MS,
    0,
    1
  );
  const stumbleDeltaM =
    faultStumbleOffsetM(nextFaultAnimT) - faultStumbleOffsetM(state.phase.athletePose.animT);
  const javelinUpdate = state.phase.javelinLanded
    ? null
    : updatePhysicalJavelin(state.phase.javelin, dtMs, state.windMs);

  return {
    ...state,
    phase: {
      ...state.phase,
      athleteXM: state.phase.athleteXM + stumbleDeltaM,
      athletePose: {
        animTag: 'fall',
        animT: nextFaultAnimT
      },
      javelin:
        javelinUpdate === null
          ? state.phase.javelin
          : javelinUpdate.landed
            ? {
                ...javelinUpdate.javelin,
                vxMs: 0,
                vyMs: 0,
                vzMs: 0,
                angularVelRad: 0
              }
            : javelinUpdate.javelin,
      javelinLanded: javelinUpdate === null ? state.phase.javelinLanded : javelinUpdate.landed
    }
  };
};

const tickRunup = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'runup') {
    return state;
  }

  const hasStartedRunup = state.phase.rhythm.firstTapAtMs !== null;
  const passiveTarget =
    state.phase.rhythm.firstTapAtMs === null
      ? 0
      : passiveSpeedTarget(state.phase.rhythm.firstTapAtMs, nowMs);
  const speedAfterDecay = clamp(
    state.phase.speedNorm - (dtMs / 1000) * RUNUP_SPEED_DECAY_PER_SECOND,
    0,
    1
  );
  const speedNorm = Math.max(speedAfterDecay, passiveTarget);
  const runSpeedMs = hasStartedRunup ? runSpeedMsFromNorm(speedNorm) : 0;
  const runupDistanceM = clamp(
    state.phase.runupDistanceM + runSpeedMs * (dtMs / 1000),
    RUNUP_START_X_M,
    RUNUP_MAX_X_M
  );

  return {
    ...state,
    phase: {
      ...state.phase,
      speedNorm,
      runupDistanceM,
      athletePose: {
        animTag: isRunning(speedNorm) ? 'run' : 'idle',
        animT: isRunning(speedNorm)
          ? advanceRunAnimT(state.phase.athletePose.animT, dtMs, speedNorm)
          : 0
      }
    }
  };
};

const tickChargeAim = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'chargeAim') {
    return state;
  }

  const elapsedMs = Math.max(0, nowMs - state.phase.chargeStartedAtMs);
  const rawFill01 = elapsedMs / CHARGE_FILL_DURATION_MS;
  const fullCycles = Math.floor(rawFill01);
  if (fullCycles >= CHARGE_MAX_CYCLES) {
    return {
      ...state,
      phase: createLateReleaseFaultPhase(state.phase, nowMs)
    };
  }

  const phase01 = clamp(rawFill01 % 1, 0, 1);
  const speedAfterDecay = clamp(
    state.phase.speedNorm - (dtMs / 1000) * CHARGE_AIM_SPEED_DECAY_PER_SECOND,
    0,
    1
  );
  const speedNorm = Math.max(speedAfterDecay, 0);
  const stillRunning = speedNorm > CHARGE_AIM_STOP_SPEED_NORM;
  const runSpeedMs = stillRunning ? runSpeedMsFromNorm(speedNorm) : 0;
  const runupDistanceM = clamp(
    state.phase.runupDistanceM + runSpeedMs * (dtMs / 1000),
    RUNUP_START_X_M,
    RUNUP_MAX_X_M
  );
  const blend01 = clamp(elapsedMs / RUN_TO_DRAWBACK_BLEND_MS, 0, 1);
  const aimAnimT = blend01 < 1 ? blend01 * 0.2 : phase01;
  const legAnimT = stillRunning
    ? advanceRunAnimT(state.phase.runEntryAnimT, dtMs, speedNorm)
    : state.phase.runEntryAnimT;
  const forceNormPreview = computeForcePreview(phase01);
  const quality = getTimingQuality(
    phase01,
    state.phase.chargeMeter.perfectWindow,
    state.phase.chargeMeter.goodWindow
  );

  return {
    ...state,
    phase: {
      ...state.phase,
      speedNorm,
      runupDistanceM,
      runEntryAnimT: legAnimT,
      forceNormPreview,
      chargeMeter: {
        ...state.phase.chargeMeter,
        phase01,
        lastQuality: quality,
        lastSampleAtMs: nowMs
      },
      athletePose: {
        animTag: 'aim',
        animT: aimAnimT
      }
    }
  };
};

const tickThrowAnim = (state: GameState, dtMs: number, nowMs: number): GameState => {
  if (state.phase.tag !== 'throwAnim') {
    return state;
  }

  const nextProgress = clamp(state.phase.animProgress + dtMs / THROW_ANIM_DURATION_MS, 0, 1);
  const released = nextProgress >= THROW_RELEASE_PROGRESS;
  if (released && !state.phase.released) {
    const releasePose = computeAthletePoseGeometry(
      {
        animTag: 'throw',
        animT: THROW_RELEASE_PROGRESS
      },
      state.phase.speedNorm,
      state.phase.angleDeg,
      state.phase.athleteXM
    );
    const launchSpeedMs = computeLaunchSpeedMs(state.phase.speedNorm, state.phase.forceNorm);
    const launchAngleRad = toRad(state.phase.angleDeg);
    const athleteForwardMs = runSpeedMsFromNorm(state.phase.speedNorm) * 0.34;
    const lateralVelMs = lateralVelocityFromRelease(
      state.phase.releaseQuality,
      state.phase.angleDeg,
      state.roundId
    );

    return {
      ...state,
      phase: {
        tag: 'flight',
        athleteXM: state.phase.athleteXM,
        javelin: createPhysicalJavelin({
          xM: releasePose.javelinGrip.xM + Math.cos(launchAngleRad) * JAVELIN_GRIP_OFFSET_M,
          yM: Math.max(
            1.35,
            releasePose.javelinGrip.yM + Math.sin(launchAngleRad) * JAVELIN_RELEASE_OFFSET_Y_M
          ),
          zM: 0,
          launchAngleRad,
          launchSpeedMs,
          athleteForwardMs,
          lateralVelMs,
          releasedAtMs: nowMs
        }),
        launchedFrom: {
          speedNorm: state.phase.speedNorm,
          athleteXM: state.phase.athleteXM,
          angleDeg: state.phase.angleDeg,
          forceNorm: state.phase.forceNorm,
          releaseQuality: state.phase.releaseQuality,
          lineCrossedAtRelease: state.phase.lineCrossedAtRelease,
          windMs: state.windMs,
          launchSpeedMs
        },
        athletePose: {
          animTag: 'followThrough',
          animT: 0
        }
      }
    };
  }

  return {
    ...state,
    phase: {
      ...state.phase,
      animProgress: nextProgress,
      athletePose: {
        animTag: 'throw',
        animT: nextProgress
      }
    }
  };
};

const tickFlight = (state: GameState, dtMs: number): GameState => {
  if (state.phase.tag !== 'flight') {
    return state;
  }

  const nextFollowAnimT = clamp(state.phase.athletePose.animT + dtMs / 650, 0, 1);
  const stepDeltaM =
    followThroughStepOffsetM(nextFollowAnimT) -
    followThroughStepOffsetM(state.phase.athletePose.animT);
  const athleteXM = state.phase.athleteXM + stepDeltaM;
  const updated = updatePhysicalJavelin(state.phase.javelin, dtMs, state.windMs);
  if (updated.landed) {
    const landingTipXM = updated.landingTipXM ?? updated.javelin.xM;
    const landingTipZM = updated.landingTipZM ?? updated.javelin.zM;
    const distanceM = computeCompetitionDistanceM(landingTipXM);
    const legality = evaluateThrowLegality({
      lineCrossedAtRelease: state.phase.launchedFrom.lineCrossedAtRelease,
      landingTipXM,
      landingTipZM,
      tipFirst: updated.tipFirst === true
    });

    return {
      ...state,
      phase: {
        tag: 'result',
        athleteXM,
        launchedFrom: state.phase.launchedFrom,
        distanceM,
        isHighscore: false,
        resultKind: legality.resultKind,
        tipFirst: updated.tipFirst,
        landingXM: updated.javelin.xM,
        landingYM: Math.max(0, updated.javelin.yM),
        landingAngleRad: updated.javelin.angleRad
      }
    };
  }

  return {
    ...state,
    phase: {
      ...state.phase,
      athleteXM,
      javelin: updated.javelin,
      athletePose: {
        animTag: 'followThrough',
        animT: nextFollowAnimT
      }
    }
  };
};

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'startRound': {
      return {
        ...state,
        nowMs: action.atMs,
        roundId: state.roundId + 1,
        windMs: action.windMs,
        phase: {
          tag: 'runup',
          speedNorm: 0,
          startedAtMs: action.atMs,
          tapCount: 0,
          runupDistanceM: RUNUP_START_X_M,
          rhythm: {
            firstTapAtMs: null,
            lastTapAtMs: null,
            perfectHits: 0,
            goodHits: 0,
            penaltyUntilMs: 0,
            lastQuality: null,
            lastQualityAtMs: 0
          },
          athletePose: {
            animTag: 'idle',
            animT: 0
          }
        }
      };
    }
    case 'rhythmTap': {
      if (state.phase.tag !== 'runup') {
        return state;
      }
      const phase = state.phase;
      const inPenalty = action.atMs < phase.rhythm.penaltyUntilMs;
      const tapInterval =
        phase.rhythm.lastTapAtMs === null
          ? Number.POSITIVE_INFINITY
          : action.atMs - phase.rhythm.lastTapAtMs;
      const isSpam = tapInterval < SPAM_THRESHOLD_MS;
      const beatDelta = nearestBeatDeltaMs(phase.startedAtMs, action.atMs);
      const quality = timingQualityFromBeatDelta(beatDelta);
      const baseDelta = isSpam
        ? RHYTHM_SPEED_DELTA_SPAM
        : inPenalty
          ? RHYTHM_SPEED_DELTA_IN_PENALTY
          : rhythmTapSpeedDelta(quality);
      const speedNorm = clamp(phase.speedNorm + baseDelta, 0, 1);
      const perfectHits = phase.rhythm.perfectHits + (quality === 'perfect' ? 1 : 0);
      const goodHits = phase.rhythm.goodHits + (quality !== 'miss' ? 1 : 0);
      const penaltyUntilMs = isSpam ? action.atMs + SPAM_PENALTY_MS : phase.rhythm.penaltyUntilMs;

      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          ...phase,
          speedNorm,
          tapCount: Math.min(phase.tapCount + 1, RUNUP_MAX_TAPS),
          rhythm: {
            firstTapAtMs: phase.rhythm.firstTapAtMs ?? action.atMs,
            lastTapAtMs: action.atMs,
            perfectHits,
            goodHits,
            penaltyUntilMs,
            lastQuality: isSpam ? 'miss' : quality,
            lastQualityAtMs: action.atMs
          },
          athletePose: {
            animTag: isRunning(speedNorm) ? 'run' : 'idle',
            animT: isRunning(speedNorm)
              ? phase.athletePose.animTag === 'run'
                ? phase.athletePose.animT
                : 0
              : 0
          }
        }
      };
    }
    case 'beginChargeAim': {
      if (state.phase.tag !== 'runup') {
        return state;
      }
      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          tag: 'chargeAim',
          speedNorm: state.phase.speedNorm,
          runupDistanceM: state.phase.runupDistanceM,
          startedAtMs: state.phase.startedAtMs,
          runEntryAnimT: state.phase.athletePose.animT,
          angleDeg: state.aimAngleDeg,
          chargeStartedAtMs: action.atMs,
          chargeMeter: {
            phase01: 0,
            perfectWindow: CHARGE_PERFECT_WINDOW,
            goodWindow: CHARGE_GOOD_WINDOW,
            lastQuality: null,
            lastSampleAtMs: action.atMs
          },
          forceNormPreview: computeForcePreview(0),
          athletePose: {
            animTag: 'aim',
            animT: 0
          }
        }
      };
    }
    case 'adjustAngle': {
      if (state.phase.tag === 'chargeAim') {
        const nextAngleDeg = clamp(
          state.phase.angleDeg + action.deltaDeg,
          ANGLE_MIN_DEG,
          ANGLE_MAX_DEG
        );
        return {
          ...state,
          aimAngleDeg: nextAngleDeg,
          phase: {
            ...state.phase,
            angleDeg: nextAngleDeg
          }
        };
      }
      if (state.phase.tag === 'runup' || state.phase.tag === 'idle') {
        return {
          ...state,
          aimAngleDeg: clamp(state.aimAngleDeg + action.deltaDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG)
        };
      }
      return state;
    }
    case 'setAngle': {
      const nextAngleDeg = clamp(action.angleDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
      if (state.phase.tag === 'chargeAim') {
        return {
          ...state,
          aimAngleDeg: nextAngleDeg,
          phase: {
            ...state.phase,
            angleDeg: nextAngleDeg
          }
        };
      }
      if (state.phase.tag === 'runup' || state.phase.tag === 'idle') {
        return {
          ...state,
          aimAngleDeg: nextAngleDeg
        };
      }
      return state;
    }
    case 'releaseCharge': {
      if (state.phase.tag !== 'chargeAim') {
        return state;
      }
      const elapsedMs = Math.max(0, action.atMs - state.phase.chargeStartedAtMs);
      const rawFill01 = elapsedMs / CHARGE_FILL_DURATION_MS;
      const fullCycles = Math.floor(rawFill01);
      if (fullCycles >= CHARGE_MAX_CYCLES) {
        return {
          ...state,
          nowMs: action.atMs,
          phase: createLateReleaseFaultPhase(state.phase, action.atMs)
        };
      }
      const phase01 = clamp(rawFill01 % 1, 0, 1);
      const quality = getTimingQuality(
        phase01,
        state.phase.chargeMeter.perfectWindow,
        state.phase.chargeMeter.goodWindow
      );
      const forceNorm = applyForceQualityBonus(computeForcePreview(phase01), quality);
      const releasePose = computeAthletePoseGeometry(
        {
          animTag: 'throw',
          animT: THROW_RELEASE_PROGRESS
        },
        state.phase.speedNorm,
        state.phase.angleDeg,
        state.phase.runupDistanceM
      );
      const lineCrossedAtRelease =
        Math.max(
          state.phase.runupDistanceM,
          releasePose.footFront.xM,
          releasePose.footBack.xM,
          releasePose.shoulderCenter.xM
        ) >= THROW_LINE_X_M;

      return {
        ...state,
        nowMs: action.atMs,
        phase: {
          tag: 'throwAnim',
          speedNorm: state.phase.speedNorm,
          athleteXM: state.phase.runupDistanceM,
          angleDeg: state.phase.angleDeg,
          forceNorm,
          releaseQuality: quality,
          lineCrossedAtRelease,
          releaseFlashAtMs: action.atMs,
          animProgress: 0,
          released: false,
          athletePose: {
            animTag: 'throw',
            animT: 0
          }
        }
      };
    }
    case 'tick': {
      if (state.phase.tag === 'idle' || state.phase.tag === 'result') {
        return state;
      }

      const nextState: GameState = { ...state, nowMs: action.nowMs };
      switch (nextState.phase.tag) {
        case 'fault':
          return tickFault(nextState, action.dtMs);
        case 'runup':
          return tickRunup(nextState, action.dtMs, action.nowMs);
        case 'chargeAim':
          return tickChargeAim(nextState, action.dtMs, action.nowMs);
        case 'throwAnim':
          return tickThrowAnim(nextState, action.dtMs, action.nowMs);
        case 'flight':
          return tickFlight(nextState, action.dtMs);
        default:
          return nextState;
      }
    }
    case 'setResultHighscoreFlag': {
      if (state.phase.tag !== 'result') {
        return state;
      }
      return {
        ...state,
        phase: {
          ...state.phase,
          isHighscore: action.isHighscore
        }
      };
    }
    case 'resetToIdle': {
      return {
        ...state,
        phase: { tag: 'idle' }
      };
    }
    default: {
      return state;
    }
  }
};

