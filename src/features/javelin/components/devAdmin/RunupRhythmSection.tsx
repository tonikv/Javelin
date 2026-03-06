import type { ReactElement } from 'react';
import type { DifficultyLevel } from '../../game/types';
import type { DifficultyDraft, TempoCurvePointDraft } from './types';

type RunupRhythmSectionProps = {
  difficulty: DifficultyLevel;
  row: DifficultyDraft;
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

export const RunupRhythmSection = ({
  difficulty,
  row,
  updateDraftField,
  updateTempoCurvePoint
}: RunupRhythmSectionProps): ReactElement => (
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
              updateTempoCurvePoint(difficulty, index, 'targetIntervalMs', event.target.value)
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
        onChange={(event) => updateDraftField(difficulty, 'goodToleranceRatio', event.target.value)}
      />
    </label>
    <label>
      perfectMultiplier
      <input
        type="number"
        step="0.01"
        value={row.perfectMultiplier}
        onChange={(event) => updateDraftField(difficulty, 'perfectMultiplier', event.target.value)}
      />
    </label>
    <label>
      goodMultiplier
      <input
        type="number"
        step="0.01"
        value={row.goodMultiplier}
        onChange={(event) => updateDraftField(difficulty, 'goodMultiplier', event.target.value)}
      />
    </label>
    <label>
      missMultiplier
      <input
        type="number"
        step="0.01"
        value={row.missMultiplier}
        onChange={(event) => updateDraftField(difficulty, 'missMultiplier', event.target.value)}
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
        onChange={(event) => updateDraftField(difficulty, 'comboMax', event.target.value)}
      />
    </label>
  </>
);
