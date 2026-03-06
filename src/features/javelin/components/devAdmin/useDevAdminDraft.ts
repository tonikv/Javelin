import { useCallback, useEffect, useState } from 'react';
import { difficultyLevels, type DifficultyLevel } from '../../game/types';
import {
  getDifficultyGameplayTuning,
  type DifficultyGameplayTuningOverrides
} from '../../game/tuning';
import type { DevAdminSettings } from '../../hooks/useDevAdminSettings';
import {
  ELITE_TEMPO_POINT_COUNT,
  type DraftByDifficulty,
  type DifficultyDraft,
  type TempoCurvePointDraft
} from './types';

const toNumberString = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/g, '').replace(/\.$/, '');

const getFallbackEliteTempoCurve = (): TempoCurvePointDraft[] => [
  { speedNorm: '0', targetIntervalMs: '180' },
  { speedNorm: '0.35', targetIntervalMs: '160' },
  { speedNorm: '0.65', targetIntervalMs: '140' },
  { speedNorm: '0.85', targetIntervalMs: '124' },
  { speedNorm: '1', targetIntervalMs: '112' }
];

const toDifficultyDraft = (
  difficulty: DifficultyLevel,
  overrides: DifficultyGameplayTuningOverrides
): DifficultyDraft => {
  const resolved = getDifficultyGameplayTuning(difficulty, overrides);
  const runupRhythm = resolved.runupRhythm;
  const releaseMeter = resolved.releaseMeter;

  return {
    tapGainNorm: toNumberString(resolved.speedUp.tapGainNorm),
    tapSoftCapIntervalMs: toNumberString(resolved.speedUp.tapSoftCapIntervalMs),
    tapSoftCapMinMultiplier: toNumberString(resolved.speedUp.tapSoftCapMinMultiplier),
    runupSpeedDecayPerSecond: toNumberString(resolved.movement.runupSpeedDecayPerSecond),
    chargeAimSpeedDecayPerSecond: toNumberString(resolved.movement.chargeAimSpeedDecayPerSecond),
    chargeAimStopSpeedNorm: toNumberString(resolved.movement.chargeAimStopSpeedNorm),
    chargeFillDurationMs: toNumberString(resolved.throwPhase.chargeFillDurationMs),
    chargePerfectWindowStart: toNumberString(resolved.throwPhase.chargePerfectWindow.start),
    chargePerfectWindowEnd: toNumberString(resolved.throwPhase.chargePerfectWindow.end),
    chargeGoodWindowStart: toNumberString(resolved.throwPhase.chargeGoodWindow.start),
    chargeGoodWindowEnd: toNumberString(resolved.throwPhase.chargeGoodWindow.end),
    tempoCurve:
      runupRhythm?.tempoCurve.map((point) => ({
        speedNorm: toNumberString(point.speedNorm),
        targetIntervalMs: toNumberString(point.targetIntervalMs)
      })) ?? getFallbackEliteTempoCurve(),
    perfectToleranceRatio: toNumberString(runupRhythm?.perfectToleranceRatio ?? 0.1),
    goodToleranceRatio: toNumberString(runupRhythm?.goodToleranceRatio ?? 0.2),
    perfectMultiplier: toNumberString(runupRhythm?.perfectMultiplier ?? 1),
    goodMultiplier: toNumberString(runupRhythm?.goodMultiplier ?? 0.72),
    missMultiplier: toNumberString(runupRhythm?.missMultiplier ?? 0.25),
    stabilityGainPerGood: toNumberString(runupRhythm?.stabilityGainPerGood ?? 0.08),
    stabilityLossPerMiss: toNumberString(runupRhythm?.stabilityLossPerMiss ?? 0.14),
    stableDecayMultiplier: toNumberString(runupRhythm?.stableDecayMultiplier ?? 0.82),
    unstableDecayMultiplier: toNumberString(runupRhythm?.unstableDecayMultiplier ?? 1.08),
    comboMax: toNumberString(runupRhythm?.comboMax ?? 6),
    sweepDurationMsMin: toNumberString(releaseMeter?.sweepDurationMsMin ?? 360),
    sweepDurationMsMax: toNumberString(releaseMeter?.sweepDurationMsMax ?? 520),
    releasePerfectWidth: toNumberString(releaseMeter?.perfectWidth ?? 0.08),
    releaseGoodWidth: toNumberString(releaseMeter?.goodWidth ?? 0.18),
    highSpeedPerfectWidth: toNumberString(releaseMeter?.highSpeedPerfectWidth ?? 0.06),
    highSpeedGoodWidth: toNumberString(releaseMeter?.highSpeedGoodWidth ?? 0.16)
  };
};

const toDraftByDifficulty = (overrides: DifficultyGameplayTuningOverrides): DraftByDifficulty => ({
  rookie: toDifficultyDraft('rookie', overrides),
  pro: toDifficultyDraft('pro', overrides),
  elite: toDifficultyDraft('elite', overrides)
});

const parseFiniteNumber = (value: string): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseOverridesFromDraft = (draft: DraftByDifficulty): DifficultyGameplayTuningOverrides => {
  const result: DifficultyGameplayTuningOverrides = {};

  for (const difficulty of difficultyLevels) {
    const source = draft[difficulty];
    const tapGainNorm = parseFiniteNumber(source.tapGainNorm);
    const tapSoftCapIntervalMs = parseFiniteNumber(source.tapSoftCapIntervalMs);
    const tapSoftCapMinMultiplier = parseFiniteNumber(source.tapSoftCapMinMultiplier);
    const runupSpeedDecayPerSecond = parseFiniteNumber(source.runupSpeedDecayPerSecond);
    const chargeAimSpeedDecayPerSecond = parseFiniteNumber(source.chargeAimSpeedDecayPerSecond);
    const chargeAimStopSpeedNorm = parseFiniteNumber(source.chargeAimStopSpeedNorm);
    const chargeFillDurationMs = parseFiniteNumber(source.chargeFillDurationMs);
    const chargePerfectWindowStart = parseFiniteNumber(source.chargePerfectWindowStart);
    const chargePerfectWindowEnd = parseFiniteNumber(source.chargePerfectWindowEnd);
    const chargeGoodWindowStart = parseFiniteNumber(source.chargeGoodWindowStart);
    const chargeGoodWindowEnd = parseFiniteNumber(source.chargeGoodWindowEnd);

    if (
      tapGainNorm === null ||
      tapSoftCapIntervalMs === null ||
      tapSoftCapMinMultiplier === null ||
      runupSpeedDecayPerSecond === null ||
      chargeAimSpeedDecayPerSecond === null ||
      chargeAimStopSpeedNorm === null ||
      chargeFillDurationMs === null ||
      chargePerfectWindowStart === null ||
      chargePerfectWindowEnd === null ||
      chargeGoodWindowStart === null ||
      chargeGoodWindowEnd === null
    ) {
      throw new Error('invalid-number');
    }

    const next = {
      tapGainNorm,
      tapSoftCapIntervalMs,
      tapSoftCapMinMultiplier,
      runupSpeedDecayPerSecond,
      chargeAimSpeedDecayPerSecond,
      chargeAimStopSpeedNorm,
      chargeFillDurationMs,
      chargePerfectWindow: {
        start: chargePerfectWindowStart,
        end: chargePerfectWindowEnd
      },
      chargeGoodWindow: {
        start: chargeGoodWindowStart,
        end: chargeGoodWindowEnd
      }
    } as const;

    const sweepDurationMsMin = parseFiniteNumber(source.sweepDurationMsMin);
    const sweepDurationMsMax = parseFiniteNumber(source.sweepDurationMsMax);
    const releasePerfectWidth = parseFiniteNumber(source.releasePerfectWidth);
    const releaseGoodWidth = parseFiniteNumber(source.releaseGoodWidth);
    const highSpeedPerfectWidth = parseFiniteNumber(source.highSpeedPerfectWidth);
    const highSpeedGoodWidth = parseFiniteNumber(source.highSpeedGoodWidth);

    if (
      sweepDurationMsMin === null ||
      sweepDurationMsMax === null ||
      releasePerfectWidth === null ||
      releaseGoodWidth === null ||
      highSpeedPerfectWidth === null ||
      highSpeedGoodWidth === null
    ) {
      throw new Error('invalid-number');
    }

    if (difficulty !== 'rookie') {
      const tempoCurve = source.tempoCurve.map((point) => ({
        speedNorm: parseFiniteNumber(point.speedNorm),
        targetIntervalMs: parseFiniteNumber(point.targetIntervalMs)
      }));
      const perfectToleranceRatio = parseFiniteNumber(source.perfectToleranceRatio);
      const goodToleranceRatio = parseFiniteNumber(source.goodToleranceRatio);
      const perfectMultiplier = parseFiniteNumber(source.perfectMultiplier);
      const goodMultiplier = parseFiniteNumber(source.goodMultiplier);
      const missMultiplier = parseFiniteNumber(source.missMultiplier);
      const stabilityGainPerGood = parseFiniteNumber(source.stabilityGainPerGood);
      const stabilityLossPerMiss = parseFiniteNumber(source.stabilityLossPerMiss);
      const stableDecayMultiplier = parseFiniteNumber(source.stableDecayMultiplier);
      const unstableDecayMultiplier = parseFiniteNumber(source.unstableDecayMultiplier);
      const comboMax = parseFiniteNumber(source.comboMax);
      if (
        tempoCurve.length !== ELITE_TEMPO_POINT_COUNT ||
        tempoCurve.some((point) => point.speedNorm === null || point.targetIntervalMs === null) ||
        perfectToleranceRatio === null ||
        goodToleranceRatio === null ||
        perfectMultiplier === null ||
        goodMultiplier === null ||
        missMultiplier === null ||
        stabilityGainPerGood === null ||
        stabilityLossPerMiss === null ||
        stableDecayMultiplier === null ||
        unstableDecayMultiplier === null ||
        comboMax === null
      ) {
        throw new Error('invalid-number');
      }

      result[difficulty] = {
        ...next,
        releaseMeter: {
          sweepDurationMsMin,
          sweepDurationMsMax,
          perfectWidth: releasePerfectWidth,
          goodWidth: releaseGoodWidth,
          highSpeedPerfectWidth,
          highSpeedGoodWidth
        },
        runupRhythm: {
          tempoCurve: tempoCurve.map((point) => ({
            speedNorm: point.speedNorm ?? 0,
            targetIntervalMs: point.targetIntervalMs ?? 0
          })),
          perfectToleranceRatio,
          goodToleranceRatio,
          perfectMultiplier,
          goodMultiplier,
          missMultiplier,
          stabilityGainPerGood,
          stabilityLossPerMiss,
          stableDecayMultiplier,
          unstableDecayMultiplier,
          comboMax
        }
      };
      continue;
    }

    result[difficulty] = {
      ...next,
      releaseMeter: {
        sweepDurationMsMin,
        sweepDurationMsMax,
        perfectWidth: releasePerfectWidth,
        goodWidth: releaseGoodWidth,
        highSpeedPerfectWidth,
        highSpeedGoodWidth
      }
    };
  }

  return result;
};

type UseDevAdminDraftOptions = {
  settings: DevAdminSettings;
};

type UseDevAdminDraftResult = {
  draft: DraftByDifficulty;
  hasInputError: boolean;
  updateDraftField: (
    difficulty: DifficultyLevel,
    field: keyof DifficultyDraft,
    value: string
  ) => void;
  updateTempoCurvePoint: (
    difficulty: DifficultyLevel,
    index: number,
    field: keyof TempoCurvePointDraft,
    value: string
  ) => void;
  applyDraft: (onApply: (overrides: DifficultyGameplayTuningOverrides) => void) => void;
};

export const useDevAdminDraft = ({ settings }: UseDevAdminDraftOptions): UseDevAdminDraftResult => {
  const [draft, setDraft] = useState<DraftByDifficulty>(() =>
    toDraftByDifficulty(settings.tuningOverrides)
  );
  const [hasInputError, setHasInputError] = useState(false);

  useEffect(() => {
    setDraft(toDraftByDifficulty(settings.tuningOverrides));
  }, [settings.tuningOverrides]);

  const updateDraftField = useCallback(
    (difficulty: DifficultyLevel, field: keyof DifficultyDraft, value: string): void => {
      setDraft((previous) => ({
        ...previous,
        [difficulty]: {
          ...previous[difficulty],
          [field]: value
        }
      }));
    },
    []
  );

  const updateTempoCurvePoint = useCallback(
    (
      difficulty: DifficultyLevel,
      index: number,
      field: keyof TempoCurvePointDraft,
      value: string
    ): void => {
      setDraft((previous) => ({
        ...previous,
        [difficulty]: {
          ...previous[difficulty],
          tempoCurve: previous[difficulty].tempoCurve.map((point, pointIndex) =>
            pointIndex === index
              ? {
                  ...point,
                  [field]: value
                }
              : point
          )
        }
      }));
    },
    []
  );

  const applyDraft = useCallback(
    (onApply: (overrides: DifficultyGameplayTuningOverrides) => void): void => {
      try {
        onApply(parseOverridesFromDraft(draft));
        setHasInputError(false);
      } catch {
        setHasInputError(true);
      }
    },
    [draft]
  );

  return {
    draft,
    hasInputError,
    updateDraftField,
    updateTempoCurvePoint,
    applyDraft
  };
};
