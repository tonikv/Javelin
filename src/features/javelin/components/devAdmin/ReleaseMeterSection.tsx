import type { ReactElement } from 'react';
import type { DifficultyLevel } from '../../game/types';
import type { DifficultyDraft } from './types';

type ReleaseMeterSectionProps = {
  difficulty: DifficultyLevel;
  row: DifficultyDraft;
  updateDraftField: (
    difficulty: DifficultyLevel,
    field: keyof DifficultyDraft,
    value: string
  ) => void;
};

export const ReleaseMeterSection = ({
  difficulty,
  row,
  updateDraftField
}: ReleaseMeterSectionProps): ReactElement => (
  <>
    <label>
      sweepDurationMsMin
      <input
        type="number"
        step="1"
        value={row.sweepDurationMsMin}
        onChange={(event) => updateDraftField(difficulty, 'sweepDurationMsMin', event.target.value)}
      />
    </label>
    <label>
      sweepDurationMsMax
      <input
        type="number"
        step="1"
        value={row.sweepDurationMsMax}
        onChange={(event) => updateDraftField(difficulty, 'sweepDurationMsMax', event.target.value)}
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
        onChange={(event) => updateDraftField(difficulty, 'releaseGoodWidth', event.target.value)}
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
        onChange={(event) => updateDraftField(difficulty, 'highSpeedGoodWidth', event.target.value)}
      />
    </label>
  </>
);
