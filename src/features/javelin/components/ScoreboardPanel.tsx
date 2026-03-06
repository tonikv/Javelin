import { memo, useEffect, useState, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import type { HighscoreEntry } from '../game/types';
import type { GlobalLeaderboardErrorKind } from '../hooks/useGlobalLeaderboard';
import type { LeaderboardMode } from '../hooks/useLeaderboardController';
import { ControlHelp, ControlHelpContent } from './ControlHelp';
import { ScoreBoard, ScoreBoardContent } from './ScoreBoard';

type LeaderboardControlsProps = {
  mode: LeaderboardMode;
  onModeChange: (mode: LeaderboardMode) => void;
  onResetLocalScores: () => void;
  onRefreshGlobalScores: () => void;
  isGlobalLoading: boolean;
  isGlobalAvailable: boolean;
  globalHasError: boolean;
  globalErrorKind: GlobalLeaderboardErrorKind;
  scoreboardTitle: string;
};

const resolveGlobalStatusMessageKey = (
  globalHasError: boolean,
  globalErrorKind: GlobalLeaderboardErrorKind
): string | null => {
  if (!globalHasError) {
    return null;
  }
  if (globalErrorKind === 'rate-limited') {
    return 'scoreboard.globalLoadError';
  }
  return 'scoreboard.globalLoadError';
};

const LeaderboardControlsComponent = ({
  mode,
  onModeChange,
  onResetLocalScores,
  onRefreshGlobalScores,
  isGlobalLoading,
  isGlobalAvailable,
  globalHasError,
  globalErrorKind,
  scoreboardTitle
}: LeaderboardControlsProps): ReactElement => {
  const { t } = useI18n();

  const statusKey =
    mode !== 'global'
      ? null
      : !isGlobalAvailable
        ? 'scoreboard.globalUnavailable'
        : isGlobalLoading
          ? 'scoreboard.globalLoading'
          : resolveGlobalStatusMessageKey(globalHasError, globalErrorKind);
  const statusMessage = statusKey ? t(statusKey) : null;

  return (
    <div className="leaderboard-controls">
      <div className="leaderboard-mode-switch" role="group" aria-label={t('scoreboard.modeLabel')}>
        <button
          type="button"
          className={mode === 'local' ? '' : 'ghost'}
          onClick={() => onModeChange('local')}
          aria-pressed={mode === 'local'}
        >
          {t('scoreboard.modeLocal')}
        </button>
        <button
          type="button"
          className={mode === 'global' ? '' : 'ghost'}
          onClick={() => onModeChange('global')}
          aria-pressed={mode === 'global'}
        >
          {t('scoreboard.modeGlobal')}
        </button>
      </div>

      {mode === 'local' ? (
        <button
          type="button"
          className="ghost"
          onClick={onResetLocalScores}
          aria-label={`${t('action.resetScores')} - ${scoreboardTitle}`}
        >
          {t('action.resetScores')}
        </button>
      ) : (
        <button
          type="button"
          className="ghost"
          onClick={onRefreshGlobalScores}
          disabled={isGlobalLoading || !isGlobalAvailable}
          aria-label={`${t('action.refreshScores')} - ${scoreboardTitle}`}
        >
          {t('action.refreshScores')}
        </button>
      )}

      {statusMessage && (
        <p className="scoreboard-status" role="status">
          {statusMessage}
        </p>
      )}
    </div>
  );
};

const LeaderboardControls = memo(LeaderboardControlsComponent);

type ScoreboardPanelProps = {
  highscores: HighscoreEntry[];
  mode: LeaderboardMode;
  onModeChange: (mode: LeaderboardMode) => void;
  onResetLocalScores: () => void;
  onRefreshGlobalScores: () => void;
  isGlobalLoading: boolean;
  isGlobalAvailable: boolean;
  globalHasError: boolean;
  globalErrorKind: GlobalLeaderboardErrorKind;
  scoreboardTitle: string;
  scoreboardEmptyMessage: string;
  isCompactLayout: boolean;
};

type ExpandedPanelProps = Omit<ScoreboardPanelProps, 'isCompactLayout'>;

const ExpandedPanel = ({
  highscores,
  mode,
  onModeChange,
  onResetLocalScores,
  onRefreshGlobalScores,
  isGlobalLoading,
  isGlobalAvailable,
  globalHasError,
  globalErrorKind,
  scoreboardTitle,
  scoreboardEmptyMessage
}: ExpandedPanelProps): ReactElement => (
  <aside className="side-column">
    <ControlHelp />
    <LeaderboardControls
      mode={mode}
      onModeChange={onModeChange}
      onResetLocalScores={onResetLocalScores}
      onRefreshGlobalScores={onRefreshGlobalScores}
      isGlobalLoading={isGlobalLoading}
      isGlobalAvailable={isGlobalAvailable}
      globalHasError={globalHasError}
      globalErrorKind={globalErrorKind}
      scoreboardTitle={scoreboardTitle}
    />
    <ScoreBoard
      highscores={highscores}
      title={scoreboardTitle}
      emptyMessage={scoreboardEmptyMessage}
    />
  </aside>
);

const ExpandedScoreboardPanel = memo(ExpandedPanel);

const CompactPanel = ({
  highscores,
  mode,
  onModeChange,
  onResetLocalScores,
  onRefreshGlobalScores,
  isGlobalLoading,
  isGlobalAvailable,
  globalHasError,
  globalErrorKind,
  scoreboardTitle,
  scoreboardEmptyMessage
}: ExpandedPanelProps): ReactElement => {
  const { t } = useI18n();
  const hasVisibleScoreboardContent = highscores.length > 0 || mode === 'global';
  const [isScoreboardOpen, setIsScoreboardOpen] = useState<boolean>(hasVisibleScoreboardContent);

  useEffect(() => {
    setIsScoreboardOpen(hasVisibleScoreboardContent);
  }, [hasVisibleScoreboardContent]);

  return (
    <section className="compact-side-column">
      <details className="card disclosure disclosure-help">
        <summary>{t('help.title')}</summary>
        <div className="disclosure-body">
          <ControlHelpContent />
        </div>
      </details>
      <LeaderboardControls
        mode={mode}
        onModeChange={onModeChange}
        onResetLocalScores={onResetLocalScores}
        onRefreshGlobalScores={onRefreshGlobalScores}
        isGlobalLoading={isGlobalLoading}
        isGlobalAvailable={isGlobalAvailable}
        globalHasError={globalHasError}
        globalErrorKind={globalErrorKind}
        scoreboardTitle={scoreboardTitle}
      />
      <details
        className="card disclosure disclosure-scoreboard"
        open={isScoreboardOpen}
        onToggle={(event) => setIsScoreboardOpen(event.currentTarget.open)}
      >
        <summary>{scoreboardTitle}</summary>
        <div className="disclosure-body">
          <ScoreBoardContent highscores={highscores} emptyMessage={scoreboardEmptyMessage} />
        </div>
      </details>
    </section>
  );
};

const CompactScoreboardPanel = memo(CompactPanel);

export const ScoreboardPanel = (props: ScoreboardPanelProps): ReactElement =>
  props.isCompactLayout ? (
    <CompactScoreboardPanel {...props} />
  ) : (
    <ExpandedScoreboardPanel {...props} />
  );
