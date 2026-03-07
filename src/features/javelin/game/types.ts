import type { DifficultyGameplayTuningOverrides } from './tuning';

export type Locale = 'fi' | 'sv' | 'en';

export type FaultReason = 'lateRelease' | 'invalidRelease' | 'lowAngle';

export type TimingQuality = 'perfect' | 'good' | 'miss';

export const difficultyLevels = ['rookie', 'pro', 'elite'] as const;

export type DifficultyLevel = (typeof difficultyLevels)[number];

export type MeterWindow = {
  start: number;
  end: number;
};

export type RunupTapState = {
  lastTapAtMs: number | null;
  lastTapMultiplier: number;
};

export type RhythmHitQuality = 'perfect' | 'good' | 'miss';

export type RunupRhythmState = {
  targetIntervalMs: number;
  lastIntervalMs: number | null;
  lastOffsetMs: number | null;
  lastQuality: RhythmHitQuality | null;
  combo: number;
  stability01: number;
};

export type RunupChargeHoldState = {
  startedAtMs: number;
};

export type RunupMeterMode = 'speedFill' | 'rhythmLane';

export type ChargeMeterMode = 'loop' | 'centerSweep';

export type ChargeMeterSnapshot = {
  mode: ChargeMeterMode;
  phase01: number;
  perfectWindow: MeterWindow;
  goodWindow: MeterWindow;
  lastQuality: TimingQuality | null;
};

/**
 * Tracks active charge-meter progress.
 * `phase01` is interpreted by `mode` and sampled continuously until release.
 */
export type ChargeMeterState = ChargeMeterSnapshot & {
  lastSampleAtMs: number;
};

export type AthletePoseState = {
  animTag: 'idle' | 'run' | 'aim' | 'throw' | 'followThrough' | 'fall';
  animT: number;
};

export type ThrowInput = {
  speedNorm: number;
  angleDeg: number;
  releaseTiming: number;
  windMs: number;
};

export type LaunchSnapshot = {
  difficulty: DifficultyLevel;
  speedNorm: number;
  angleDeg: number;
  forceNorm: number;
  windMs: number;
  launchSpeedMs: number;
  athleteXM: number;
  releaseQuality: TimingQuality;
  lineCrossedAtRelease: boolean;
};

export type PhysicalJavelinState = {
  xM: number;
  yM: number;
  zM: number;
  vxMs: number;
  vyMs: number;
  vzMs: number;
  angleRad: number;
  angularVelRad: number;
  releasedAtMs: number;
  lengthM: number;
};

export type ResultKind = 'valid' | 'foul_line' | 'foul_sector' | 'foul_tip_first';

export type GamePhase =
  | { tag: 'idle' }
  | {
      tag: 'runup';
      meterMode: RunupMeterMode;
      speedNorm: number;
      startedAtMs: number;
      tapCount: number;
      runupDistanceM: number;
      tap: RunupTapState;
      chargeHold: RunupChargeHoldState | null;
      runupRhythm: RunupRhythmState | null;
      athletePose: AthletePoseState;
    }
  | {
      tag: 'chargeAim';
      speedNorm: number;
      entrySpeedNorm: number;
      runupDistanceM: number;
      startedAtMs: number;
      runEntryAnimT: number;
      angleDeg: number;
      chargeStartedAtMs: number;
      chargeMeter: ChargeMeterState;
      forceNormPreview: number;
      athletePose: AthletePoseState;
    }
  | {
      tag: 'throwAnim';
      speedNorm: number;
      athleteXM: number;
      angleDeg: number;
      forceNorm: number;
      releaseQuality: TimingQuality;
      releaseMeter: ChargeMeterSnapshot;
      lineCrossedAtRelease: boolean;
      releaseFlashAtMs: number;
      animProgress: number;
      released: boolean;
      athletePose: AthletePoseState;
    }
  | {
      tag: 'flight';
      athleteXM: number;
      javelin: PhysicalJavelinState;
      launchedFrom: LaunchSnapshot;
      athletePose: AthletePoseState;
    }
  | {
      tag: 'result';
      athleteXM: number;
      launchedFrom: LaunchSnapshot;
      distanceM: number;
      isHighscore: boolean;
      resultKind: ResultKind;
      tipFirst: boolean | null;
      landingTipXM: number;
      landingXM: number;
      landingYM: number;
      landingAngleRad: number;
    }
  | {
      tag: 'fault';
      reason: FaultReason;
      athleteXM: number;
      athletePose: AthletePoseState;
      javelin: PhysicalJavelinState;
      javelinLanded: boolean;
    };

export type GameState = {
  nowMs: number;
  roundId: number;
  difficulty: DifficultyLevel;
  devTuningOverrides: DifficultyGameplayTuningOverrides;
  windMs: number;
  windZMs: number;
  aimAngleDeg: number;
  phase: GamePhase;
};

export type GameAction =
  | { type: 'startRound'; atMs: number; windMs: number; windZMs?: number }
  | { type: 'rhythmTap'; atMs: number }
  | { type: 'startChargeHold'; atMs: number }
  | { type: 'cancelChargeHold' }
  | { type: 'setDifficulty'; difficulty: DifficultyLevel }
  | { type: 'setDevTuningOverrides'; overrides: DifficultyGameplayTuningOverrides }
  | { type: 'resetDevTuningOverrides' }
  | { type: 'beginChargeAim'; atMs: number }
  | { type: 'setAngle'; angleDeg: number }
  | { type: 'adjustAngle'; deltaDeg: number }
  | { type: 'releaseCharge'; atMs: number }
  | { type: 'tick'; dtMs: number; nowMs: number }
  | { type: 'setResultHighscoreFlag'; isHighscore: boolean }
  | { type: 'resetToIdle' };

export type HighscoreEntry = {
  id: string;
  name: string;
  difficulty: DifficultyLevel;
  distanceM: number;
  playedAtIso: string;
  locale: Locale;
  windMs: number;
  launchSpeedMs?: number;
  angleDeg?: number;
};
