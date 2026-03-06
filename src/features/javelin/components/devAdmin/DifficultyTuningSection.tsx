import type { ReactElement } from 'react';
import { useI18n } from '../../../../i18n/init';
import { difficultyLevels, type DifficultyLevel } from '../../game/types';
import { ReleaseMeterSection } from './ReleaseMeterSection';
import { RunupRhythmSection } from './RunupRhythmSection';
import type { DraftByDifficulty, DifficultyDraft, TempoCurvePointDraft } from './types';

type DifficultyTuningSectionProps = {
  draft: DraftByDifficulty;
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
};

export const DifficultyTuningSection = ({
  draft,
  updateDraftField,
  updateTempoCurvePoint
}: DifficultyTuningSectionProps): ReactElement => {
  const { t } = useI18n();

  return (
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
                onChange={(event) =>
                  updateDraftField(difficulty, 'tapGainNorm', event.target.value)
                }
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
              <RunupRhythmSection
                difficulty={difficulty}
                row={row}
                updateDraftField={updateDraftField}
                updateTempoCurvePoint={updateTempoCurvePoint}
              />
            )}

            <ReleaseMeterSection
              difficulty={difficulty}
              row={row}
              updateDraftField={updateDraftField}
            />
          </fieldset>
        );
      })}
    </div>
  );
};
