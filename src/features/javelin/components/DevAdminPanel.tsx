import { useEffect, useState, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { difficultyLevels, type DifficultyLevel } from '../game/types';
import {
  getDifficultyGameplayTuning,
  type DifficultyGameplayTuningOverrides
} from '../game/tuning';
import type { DevAdminSettings } from '../hooks/useDevAdminSettings';

const ELITE_TEMPO_POINT_COUNT = 5;

type TempoCurvePointDraft = {
  speedNorm: string;
  targetIntervalMs: string;
};

type DifficultyDraft = {
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

type DraftByDifficulty = Record<DifficultyLevel, DifficultyDraft>;

type DevAdminPanelProps = {
  settings: DevAdminSettings;
  canApplyTuning: boolean;
  onSetUnlockAllDifficulties: (enabled: boolean) => void;
  onResetUnlockProgression: () => void;
  onApplyTuningOverrides: (overrides: DifficultyGameplayTuningOverrides) => void;
  onResetTuningOverrides: () => void;
  onResetAll: () => void;
};

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
        },
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

export const DevAdminPanel = ({
  settings,
  canApplyTuning,
  onSetUnlockAllDifficulties,
  onResetUnlockProgression,
  onApplyTuningOverrides,
  onResetTuningOverrides,
  onResetAll
}: DevAdminPanelProps): ReactElement => {
  const { t } = useI18n();
  const [draft, setDraft] = useState<DraftByDifficulty>(() => toDraftByDifficulty(settings.tuningOverrides));
  const [hasInputError, setHasInputError] = useState(false);

  useEffect(() => {
    setDraft(toDraftByDifficulty(settings.tuningOverrides));
  }, [settings.tuningOverrides]);

  const updateDraftField = (difficulty: DifficultyLevel, field: keyof DifficultyDraft, value: string): void => {
    setDraft((previous) => ({
      ...previous,
      [difficulty]: {
        ...previous[difficulty],
        [field]: value
      }
    }));
  };

  const updateTempoCurvePoint = (
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
  };

  return (
    <section className="card dev-admin-panel" aria-label={t('devAdmin.title')}>
      <h3>{t('devAdmin.title')}</h3>
      <p className="dev-admin-note">{t('devAdmin.devOnlyNote')}</p>

      <label className="dev-admin-toggle">
        <input
          type="checkbox"
          checked={settings.unlockAllDifficulties}
          onChange={(event) => onSetUnlockAllDifficulties(event.target.checked)}
        />
        {t('devAdmin.unlockAll')}
      </label>

      <div className="dev-admin-actions">
        <button type="button" className="ghost" onClick={onResetUnlockProgression}>
          {t('devAdmin.resetUnlockProgression')}
        </button>
      </div>

      <div className="dev-admin-tuning-grid">
        {difficultyLevels.map((difficulty) => {
          const row = draft[difficulty];
          return (
            <fieldset key={difficulty} className="dev-admin-fieldset">
              <legend>{t(`difficulty.${difficulty}`)}</legend>

              <label>
                tapGainNorm
                <input
                  type="number"
                  step="0.001"
                  value={row.tapGainNorm}
                  onChange={(event) => updateDraftField(difficulty, 'tapGainNorm', event.target.value)}
                />
              </label>
              <label>
                tapSoftCapIntervalMs
                <input
                  type="number"
                  step="1"
                  value={row.tapSoftCapIntervalMs}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'tapSoftCapIntervalMs', event.target.value)
                  }
                />
              </label>
              <label>
                tapSoftCapMinMultiplier
                <input
                  type="number"
                  step="0.01"
                  value={row.tapSoftCapMinMultiplier}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'tapSoftCapMinMultiplier', event.target.value)
                  }
                />
              </label>
              <label>
                runupSpeedDecayPerSecond
                <input
                  type="number"
                  step="0.01"
                  value={row.runupSpeedDecayPerSecond}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'runupSpeedDecayPerSecond', event.target.value)
                  }
                />
              </label>
              <label>
                chargeAimSpeedDecayPerSecond
                <input
                  type="number"
                  step="0.01"
                  value={row.chargeAimSpeedDecayPerSecond}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'chargeAimSpeedDecayPerSecond', event.target.value)
                  }
                />
              </label>
              <label>
                chargeAimStopSpeedNorm
                <input
                  type="number"
                  step="0.01"
                  value={row.chargeAimStopSpeedNorm}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'chargeAimStopSpeedNorm', event.target.value)
                  }
                />
              </label>
              <label>
                chargePerfectWindow.start
                <input
                  type="number"
                  step="0.01"
                  value={row.chargePerfectWindowStart}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'chargePerfectWindowStart', event.target.value)
                  }
                />
              </label>
              <label>
                chargePerfectWindow.end
                <input
                  type="number"
                  step="0.01"
                  value={row.chargePerfectWindowEnd}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'chargePerfectWindowEnd', event.target.value)
                  }
                />
              </label>
              <label>
                chargeGoodWindow.start
                <input
                  type="number"
                  step="0.01"
                  value={row.chargeGoodWindowStart}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'chargeGoodWindowStart', event.target.value)
                  }
                />
              </label>
              <label>
                chargeGoodWindow.end
                <input
                  type="number"
                  step="0.01"
                  value={row.chargeGoodWindowEnd}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'chargeGoodWindowEnd', event.target.value)
                  }
                />
              </label>

              {difficulty !== 'rookie' && (
                <>
                  {row.tempoCurve.map((point, index) => (
                    <label key={`tempo-${index}`}>
                      tempoCurve[{index}]
                      <div className="dev-admin-inline-grid">
                        <input
                          type="number"
                          step="0.01"
                          value={point.speedNorm}
                          onChange={(event) =>
                            updateTempoCurvePoint(difficulty, index, 'speedNorm', event.target.value)
                          }
                        />
                        <input
                          type="number"
                          step="1"
                          value={point.targetIntervalMs}
                          onChange={(event) =>
                            updateTempoCurvePoint(
                              difficulty,
                              index,
                              'targetIntervalMs',
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </label>
                  ))}
                  <label>
                    perfectToleranceRatio
                    <input
                      type="number"
                      step="0.01"
                      value={row.perfectToleranceRatio}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'perfectToleranceRatio', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    goodToleranceRatio
                    <input
                      type="number"
                      step="0.01"
                      value={row.goodToleranceRatio}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'goodToleranceRatio', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    perfectMultiplier
                    <input
                      type="number"
                      step="0.01"
                      value={row.perfectMultiplier}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'perfectMultiplier', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    goodMultiplier
                    <input
                      type="number"
                      step="0.01"
                      value={row.goodMultiplier}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'goodMultiplier', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    missMultiplier
                    <input
                      type="number"
                      step="0.01"
                      value={row.missMultiplier}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'missMultiplier', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    stabilityGainPerGood
                    <input
                      type="number"
                      step="0.01"
                      value={row.stabilityGainPerGood}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'stabilityGainPerGood', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    stabilityLossPerMiss
                    <input
                      type="number"
                      step="0.01"
                      value={row.stabilityLossPerMiss}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'stabilityLossPerMiss', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    stableDecayMultiplier
                    <input
                      type="number"
                      step="0.01"
                      value={row.stableDecayMultiplier}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'stableDecayMultiplier', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    unstableDecayMultiplier
                    <input
                      type="number"
                      step="0.01"
                      value={row.unstableDecayMultiplier}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'unstableDecayMultiplier', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    comboMax
                    <input
                      type="number"
                      step="1"
                      value={row.comboMax}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'comboMax', event.target.value)
                      }
                    />
                  </label>
                </>
              )}
              <label>
                sweepDurationMsMin
                <input
                  type="number"
                  step="1"
                  value={row.sweepDurationMsMin}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'sweepDurationMsMin', event.target.value)
                  }
                />
              </label>
              <label>
                sweepDurationMsMax
                <input
                  type="number"
                  step="1"
                  value={row.sweepDurationMsMax}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'sweepDurationMsMax', event.target.value)
                  }
                />
              </label>
              <label>
                releasePerfectWidth
                <input
                  type="number"
                  step="0.01"
                  value={row.releasePerfectWidth}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'releasePerfectWidth', event.target.value)
                  }
                />
              </label>
              <label>
                releaseGoodWidth
                <input
                  type="number"
                  step="0.01"
                  value={row.releaseGoodWidth}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'releaseGoodWidth', event.target.value)
                  }
                />
              </label>
              <label>
                highSpeedPerfectWidth
                <input
                  type="number"
                  step="0.01"
                  value={row.highSpeedPerfectWidth}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'highSpeedPerfectWidth', event.target.value)
                  }
                />
              </label>
              <label>
                highSpeedGoodWidth
                <input
                  type="number"
                  step="0.01"
                  value={row.highSpeedGoodWidth}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'highSpeedGoodWidth', event.target.value)
                  }
                />
              </label>
            </fieldset>
          );
        })}
      </div>

      {!canApplyTuning && <p className="dev-admin-note">{t('devAdmin.applyIdleOnly')}</p>}
      {hasInputError && <p className="dev-admin-error">{t('devAdmin.invalidNumber')}</p>}

      <div className="dev-admin-actions">
        <button
          type="button"
          onClick={() => {
            try {
              onApplyTuningOverrides(parseOverridesFromDraft(draft));
              setHasInputError(false);
            } catch {
              setHasInputError(true);
            }
          }}
          disabled={!canApplyTuning}
        >
          {t('devAdmin.applyOverrides')}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={onResetTuningOverrides}
          disabled={!canApplyTuning}
        >
          {t('devAdmin.resetDifficultyDefaults')}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={onResetAll}
          disabled={!canApplyTuning}
        >
          {t('devAdmin.resetAllOverrides')}
        </button>
      </div>
    </section>
  );
};
