import type { ReactElement } from 'react';
import type { GameState } from '../game/types';
import type { ResultThrowSpecs } from '../hooks/useResultMessage';
import { ResultDisplay } from './ResultDisplay';
import { SaveScoreForm } from './SaveScoreForm';

type ResultPanelProps = {
  state: GameState;
  resultMessage: string;
  resultStatusMessage: string | null;
  isFoulMessage: boolean;
  resultThrowSpecs: ResultThrowSpecs | null;
  canSaveScore: boolean;
  defaultName: string;
  onSaveScore: (name: string) => Promise<void>;
  shouldShowGlobalBlockedNote: boolean;
  showHighscoreBadge: boolean;
  globalSubmitBlockedLabel: string;
  highscoreBadgeLabel: string;
};

export const ResultPanel = ({
  state,
  resultMessage,
  resultStatusMessage,
  isFoulMessage,
  resultThrowSpecs,
  canSaveScore,
  defaultName,
  onSaveScore,
  shouldShowGlobalBlockedNote,
  showHighscoreBadge,
  globalSubmitBlockedLabel,
  highscoreBadgeLabel
}: ResultPanelProps): ReactElement => (
  <>
    <ResultDisplay
      resultMessage={resultMessage}
      resultStatusMessage={resultStatusMessage}
      isFoulMessage={isFoulMessage}
      resultThrowSpecs={resultThrowSpecs}
    />

    {canSaveScore && state.phase.tag === 'result' && (
      <SaveScoreForm
        onSave={(name) => {
          void onSaveScore(name);
        }}
        defaultName={defaultName}
      />
    )}
    {shouldShowGlobalBlockedNote && <p className="save-form-note">{globalSubmitBlockedLabel}</p>}
    {showHighscoreBadge && <div className="badge">{highscoreBadgeLabel}</div>}
  </>
);
