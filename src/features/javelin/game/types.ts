export type Locale = 'fi' | 'sv' | 'en';

export type FaultReason = 'lateRelease' | 'invalidRelease' | 'lowAngle';

export type RhythmState = {
  lastTapAtMs: number | null;
  perfectHits: number;
  goodHits: number;
  penaltyUntilMs: number;
};

export type ReleaseWindow = {
  start: number;
  end: number;
};

export type ThrowInput = {
  speedNorm: number;
  angleDeg: number;
  releaseTiming: number;
  windMs: number;
};

export type LaunchSnapshot = {
  speedNorm: number;
  angleDeg: number;
  releaseTiming: number;
  windMs: number;
  expectedDistanceM: number;
};

export type ProjectileState = {
  elapsedMs: number;
  durationMs: number;
  distanceTargetM: number;
  peakHeightM: number;
  xM: number;
  yM: number;
};

export type GamePhase =
  | { tag: 'idle' }
  | {
      tag: 'runup';
      speedNorm: number;
      startedAtMs: number;
      tapCount: number;
      rhythm: RhythmState;
    }
  | {
      tag: 'throwPrep';
      speedNorm: number;
      angleDeg: number;
      armPhase: number;
      releaseWindow: ReleaseWindow;
    }
  | {
      tag: 'flight';
      projectile: ProjectileState;
      launchedFrom: LaunchSnapshot;
    }
  | {
      tag: 'result';
      distanceM: number;
      isHighscore: boolean;
    }
  | {
      tag: 'fault';
      reason: FaultReason;
    };

export type GameState = {
  nowMs: number;
  roundId: number;
  windMs: number;
  phase: GamePhase;
};

export type GameAction =
  | { type: 'startRound'; atMs: number; windMs: number }
  | { type: 'rhythmTap'; atMs: number }
  | { type: 'beginThrowPrep' }
  | { type: 'adjustAngle'; deltaDeg: number }
  | { type: 'releaseThrow' }
  | { type: 'tick'; dtMs: number; nowMs: number }
  | { type: 'setResultHighscoreFlag'; isHighscore: boolean }
  | { type: 'resetToIdle' };

export type HighscoreEntry = {
  id: string;
  name: string;
  distanceM: number;
  playedAtIso: string;
  locale: Locale;
  windMs: number;
};
