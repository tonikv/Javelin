import { useEffect, useState, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { difficultyLevels, type DifficultyLevel } from '../game/types';
import {
  getDifficultyGameplayTuning,
  type DifficultyGameplayTuningOverrides
} from '../game/tuning';
import type { DevAdminSettings } from '../hooks/useDevAdminSettings';

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
  targetTapIntervalMs: string;
  perfectToleranceMs: string;
  goodToleranceMs: string;
  offBeatMultiplier: string;
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

const toDifficultyDraft = (
  difficulty: DifficultyLevel,
  overrides: DifficultyGameplayTuningOverrides
): DifficultyDraft => {
  const resolved = getDifficultyGameplayTuning(difficulty, overrides);
  const rhythm = resolved.speedUp.rhythm;

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
    targetTapIntervalMs: toNumberString(rhythm?.targetTapIntervalMs ?? 125),
    perfectToleranceMs: toNumberString(rhythm?.perfectToleranceMs ?? 18),
    goodToleranceMs: toNumberString(rhythm?.goodToleranceMs ?? 36),
    offBeatMultiplier: toNumberString(rhythm?.offBeatMultiplier ?? 0.2)
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

    if (difficulty === 'elite') {
      const targetTapIntervalMs = parseFiniteNumber(source.targetTapIntervalMs);
      const perfectToleranceMs = parseFiniteNumber(source.perfectToleranceMs);
      const goodToleranceMs = parseFiniteNumber(source.goodToleranceMs);
      const offBeatMultiplier = parseFiniteNumber(source.offBeatMultiplier);

      if (
        targetTapIntervalMs === null ||
        perfectToleranceMs === null ||
        goodToleranceMs === null ||
        offBeatMultiplier === null
      ) {
        throw new Error('invalid-number');
      }

      result[difficulty] = {
        ...next,
        rhythm: {
          targetTapIntervalMs,
          perfectToleranceMs,
          goodToleranceMs,
          offBeatMultiplier
        }
      };
      continue;
    }

    result[difficulty] = next;
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
                chargeFillDurationMs
                <input
                  type="number"
                  step="1"
                  value={row.chargeFillDurationMs}
                  onChange={(event) =>
                    updateDraftField(difficulty, 'chargeFillDurationMs', event.target.value)
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

              {difficulty === 'elite' && (
                <>
                  <label>
                    targetTapIntervalMs
                    <input
                      type="number"
                      step="1"
                      value={row.targetTapIntervalMs}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'targetTapIntervalMs', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    perfectToleranceMs
                    <input
                      type="number"
                      step="1"
                      value={row.perfectToleranceMs}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'perfectToleranceMs', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    goodToleranceMs
                    <input
                      type="number"
                      step="1"
                      value={row.goodToleranceMs}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'goodToleranceMs', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    offBeatMultiplier
                    <input
                      type="number"
                      step="0.01"
                      value={row.offBeatMultiplier}
                      onChange={(event) =>
                        updateDraftField(difficulty, 'offBeatMultiplier', event.target.value)
                      }
                    />
                  </label>
                </>
              )}
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
