import type { DifficultyLevel } from '../../game/types';

export const ELITE_TEMPO_POINT_COUNT = 5;

export type TempoCurvePointDraft = {
  speedNorm: string;
  targetIntervalMs: string;
};

export type DifficultyDraft = {
  tapGainNorm: string;
  tapSoftCapIntervalMs: string;
  tapSoftCapMinMultiplier: string;
  runupSpeedDecayPerSecond: string;
  chargeAimSpeedDecayPerSecond: string;
  chargeAimStopSpeedNorm: string;
  chargeFillDurationMs: string;
  chargePerfectWindowStart: string;
  chargePerfectWindowEnd: string;
  chargeGoodWindowStart: string;
  chargeGoodWindowEnd: string;
  tempoCurve: TempoCurvePointDraft[];
  perfectToleranceRatio: string;
  goodToleranceRatio: string;
  perfectMultiplier: string;
  goodMultiplier: string;
  missMultiplier: string;
  stabilityGainPerGood: string;
  stabilityLossPerMiss: string;
  stableDecayMultiplier: string;
  unstableDecayMultiplier: string;
  comboMax: string;
  sweepDurationMsMin: string;
  sweepDurationMsMax: string;
  releasePerfectWidth: string;
  releaseGoodWidth: string;
  highSpeedPerfectWidth: string;
  highSpeedGoodWidth: string;
};

export type DraftByDifficulty = Record<DifficultyLevel, DifficultyDraft>;
