export const difficulties = ['rookie', 'pro', 'elite'] as const;

export type Difficulty = (typeof difficulties)[number];

export type ScoreItem = {
  scoreId: string;
  difficulty: Difficulty;
  distanceMm: number;
  playerName: string;
  playedAt: string;
  clientVersion?: string;
  windMs?: number;
  windZMs?: number;
  launchSpeedCms?: number;
  angleCdeg?: number;
  country?: string;
  locale?: string;
};

export type LeaderboardResponse = {
  difficulty: Difficulty;
  items: ScoreItem[];
};

export type NewScoreInput = Omit<ScoreItem, 'scoreId'>;
