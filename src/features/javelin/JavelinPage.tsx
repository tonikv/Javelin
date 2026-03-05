import { memo, useEffect, useReducer, useState, type ReactElement } from 'react';
import { LanguageSwitch } from './components/LanguageSwitch';
import { ThemeToggle } from './components/ThemeToggle';
import { HudPanel } from './components/HudPanel';
import { GameCanvas } from './components/GameCanvas';
import { GameActions } from './components/GameActions';
import { ResultDisplay } from './components/ResultDisplay';
import { SaveScoreForm } from './components/SaveScoreForm';
import { ScoreBoard, ScoreBoardContent } from './components/ScoreBoard';
import { ControlHelp, ControlHelpContent } from './components/ControlHelp';
import { gameReducer } from './game/reducer';
import type { HighscoreEntry } from './game/types';
import { useGameLoop } from './hooks/useGameLoop';
import { useDifficultyUnlocks } from './hooks/useDifficultyUnlocks';
import { useGlobalLeaderboard } from './hooks/useGlobalLeaderboard';
import { useLocalHighscores } from './hooks/useLocalHighscores';
import { useResultMessage } from './hooks/useResultMessage';
import { useI18n } from '../../i18n/init';
import { useMediaQuery } from '../../app/useMediaQuery';
import { createInitialGameState } from './game/update';

type TopBarProps = {
  appTitle: string;
  gameTitle: string;
};

const TopBarComponent = ({ appTitle, gameTitle }: TopBarProps): ReactElement => (
  <header className="topbar">
    <div className="topbar-title">
      <p className="eyebrow">{appTitle}</p>
      <h1>{gameTitle}</h1>
    </div>
    <div className="topbar-controls">
      <LanguageSwitch />
      <ThemeToggle />
    </div>
  </header>
);

const TopBar = memo(TopBarComponent);

type LeaderboardMode = 'local' | 'global';

type LeaderboardControlsProps = {
  mode: LeaderboardMode;
  onModeChange: (mode: LeaderboardMode) => void;
  onResetLocalScores: () => void;
  onRefreshGlobalScores: () => void;
  isGlobalLoading: boolean;
  isGlobalAvailable: boolean;
  globalHasError: boolean;
  scoreboardTitle: string;
};

const LeaderboardControlsComponent = ({
  mode,
  onModeChange,
  onResetLocalScores,
  onRefreshGlobalScores,
  isGlobalLoading,
  isGlobalAvailable,
  globalHasError,
  scoreboardTitle
}: LeaderboardControlsProps): ReactElement => {
  const { t } = useI18n();

  const statusMessage =
    mode !== 'global'
      ? null
      : !isGlobalAvailable
        ? t('scoreboard.globalUnavailable')
        : isGlobalLoading
          ? t('scoreboard.globalLoading')
          : globalHasError
            ? t('scoreboard.globalLoadError')
            : null;

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

type SideColumnProps = {
  highscores: HighscoreEntry[];
  mode: LeaderboardMode;
  onModeChange: (mode: LeaderboardMode) => void;
  clearLocalHighscores: () => void;
  refreshGlobalHighscores: () => void;
  isGlobalLoading: boolean;
  isGlobalAvailable: boolean;
  globalHasError: boolean;
  scoreboardTitle: string;
  scoreboardEmptyMessage: string;
};

const SideColumnComponent = ({
  highscores,
  mode,
  onModeChange,
  clearLocalHighscores,
  refreshGlobalHighscores,
  isGlobalLoading,
  isGlobalAvailable,
  globalHasError,
  scoreboardTitle,
  scoreboardEmptyMessage
}: SideColumnProps): ReactElement => {
  return (
    <aside className="side-column">
      <ControlHelp />
      <LeaderboardControls
        mode={mode}
        onModeChange={onModeChange}
        onResetLocalScores={clearLocalHighscores}
        onRefreshGlobalScores={refreshGlobalHighscores}
        isGlobalLoading={isGlobalLoading}
        isGlobalAvailable={isGlobalAvailable}
        globalHasError={globalHasError}
        scoreboardTitle={scoreboardTitle}
      />
      <ScoreBoard highscores={highscores} title={scoreboardTitle} emptyMessage={scoreboardEmptyMessage} />
    </aside>
  );
};

const SideColumn = memo(SideColumnComponent);

type CompactSideColumnProps = {
  highscores: HighscoreEntry[];
  mode: LeaderboardMode;
  onModeChange: (mode: LeaderboardMode) => void;
  clearLocalHighscores: () => void;
  refreshGlobalHighscores: () => void;
  isGlobalLoading: boolean;
  isGlobalAvailable: boolean;
  globalHasError: boolean;
  scoreboardTitle: string;
  scoreboardEmptyMessage: string;
};

const CompactSideColumnComponent = ({
  highscores,
  mode,
  onModeChange,
  clearLocalHighscores,
  refreshGlobalHighscores,
  isGlobalLoading,
  isGlobalAvailable,
  globalHasError,
  scoreboardTitle,
  scoreboardEmptyMessage
}: CompactSideColumnProps): ReactElement => {
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
        onResetLocalScores={clearLocalHighscores}
        onRefreshGlobalScores={refreshGlobalHighscores}
        isGlobalLoading={isGlobalLoading}
        isGlobalAvailable={isGlobalAvailable}
        globalHasError={globalHasError}
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

const CompactSideColumn = memo(CompactSideColumnComponent);

export const JavelinPage = (): ReactElement => {
  const { t, locale } = useI18n();
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [savedRoundId, setSavedRoundId] = useState<number>(-1);
  const [processedUnlockRoundId, setProcessedUnlockRoundId] = useState<number>(-1);
  const [leaderboardMode, setLeaderboardMode] = useState<LeaderboardMode>('local');
  const { unlocks: difficultyUnlocks, registerThrowResult } = useDifficultyUnlocks();
  const { highscores, addHighscore, clearHighscores, isHighscoreForDifficulty } = useLocalHighscores({
    difficulty: state.difficulty
  });
  const {
    available: isGlobalLeaderboardAvailable,
    highscores: globalHighscores,
    isLoading: isGlobalLeaderboardLoading,
    hasError: hasGlobalLeaderboardError,
    refresh: refreshGlobalLeaderboard,
    submitScore: submitGlobalScore
  } = useGlobalLeaderboard({
    difficulty: state.difficulty
  });
  const isCompactLayout = useMediaQuery('(max-width: 1023px)');

  useGameLoop(dispatch);

  useEffect(() => {
    if (leaderboardMode !== 'global') {
      return;
    }
    void refreshGlobalLeaderboard();
  }, [leaderboardMode, refreshGlobalLeaderboard]);

  useEffect(() => {
    if (difficultyUnlocks[state.difficulty]) {
      return;
    }
    dispatch({
      type: 'setDifficulty',
      difficulty: 'rookie'
    });
  }, [difficultyUnlocks, state.difficulty]);

  useEffect(() => {
    if (state.phase.tag !== 'result' || processedUnlockRoundId === state.roundId) {
      return;
    }
    registerThrowResult({
      difficulty: state.phase.launchedFrom.difficulty,
      distanceM: state.phase.distanceM,
      isValidThrow: state.phase.resultKind === 'valid'
    });
    setProcessedUnlockRoundId(state.roundId);
  }, [processedUnlockRoundId, registerThrowResult, state.phase, state.roundId]);

  useEffect(() => {
    if (state.phase.tag !== 'result' || state.phase.resultKind !== 'valid') {
      return;
    }
    const shouldBeHighscore = isHighscoreForDifficulty(
      state.phase.distanceM,
      state.phase.launchedFrom.difficulty
    );
    if (state.phase.isHighscore === shouldBeHighscore) {
      return;
    }
    dispatch({
      type: 'setResultHighscoreFlag',
      isHighscore: shouldBeHighscore
    });
  }, [state.phase, isHighscoreForDifficulty]);

  const { resultMessage, resultStatusMessage, isFoulMessage, resultThrowSpecs } = useResultMessage(state);

  const canSaveScore =
    state.phase.tag === 'result' &&
    state.phase.resultKind === 'valid' &&
    state.phase.isHighscore &&
    savedRoundId !== state.roundId;

  const displayedHighscores = leaderboardMode === 'local' ? highscores : globalHighscores;
  const difficultyLabel = t(`difficulty.${state.difficulty}`);
  const scoreboardTitle = `${
    leaderboardMode === 'local' ? t('scoreboard.titleLocal') : t('scoreboard.titleGlobal')
  } (${difficultyLabel})`;
  const scoreboardEmptyMessage =
    leaderboardMode === 'local'
      ? t('scoreboard.empty')
      : isGlobalLeaderboardAvailable
        ? t('scoreboard.emptyGlobal')
        : t('scoreboard.globalUnavailable');

  return (
    <main className="page">
      <TopBar appTitle={t('app.title')} gameTitle={t('javelin.title')} />

      <section className="layout">
        <div className="main-column">
          <HudPanel state={state} />
          <GameCanvas state={state} dispatch={dispatch} />
          <GameActions state={state} dispatch={dispatch} difficultyUnlocks={difficultyUnlocks} />
          <ResultDisplay
            resultMessage={resultMessage}
            resultStatusMessage={resultStatusMessage}
            isFoulMessage={isFoulMessage}
            resultThrowSpecs={resultThrowSpecs}
          />

          {canSaveScore && state.phase.tag === 'result' && (
            <SaveScoreForm
              onSave={(name) => {
                if (state.phase.tag !== 'result') {
                  return;
                }
                const playedAtIso = new Date().toISOString();
                addHighscore({
                  id: crypto.randomUUID(),
                  name,
                  difficulty: state.phase.launchedFrom.difficulty,
                  distanceM: state.phase.distanceM,
                  playedAtIso,
                  locale,
                  windMs: state.phase.launchedFrom.windMs,
                  launchSpeedMs: state.phase.launchedFrom.launchSpeedMs,
                  angleDeg: state.phase.launchedFrom.angleDeg
                });
                void submitGlobalScore({
                  difficulty: state.phase.launchedFrom.difficulty,
                  playerName: name,
                  distanceM: state.phase.distanceM,
                  playedAtIso,
                  locale,
                  windMs: state.phase.launchedFrom.windMs,
                  windZMs: state.windZMs,
                  launchSpeedMs: state.phase.launchedFrom.launchSpeedMs,
                  angleDeg: state.phase.launchedFrom.angleDeg,
                  clientVersion: import.meta.env.VITE_APP_VERSION
                }).then((submitted) => {
                  if (submitted && leaderboardMode === 'global') {
                    void refreshGlobalLeaderboard();
                  }
                });
                setSavedRoundId(state.roundId);
              }}
              defaultName={t('scoreboard.defaultName')}
            />
          )}
          {state.phase.tag === 'result' && state.phase.resultKind === 'valid' && state.phase.isHighscore && (
            <div className="badge">{t('result.highscore')}</div>
          )}
        </div>

        {isCompactLayout ? (
          <CompactSideColumn
            highscores={displayedHighscores}
            mode={leaderboardMode}
            onModeChange={setLeaderboardMode}
            clearLocalHighscores={clearHighscores}
            refreshGlobalHighscores={() => {
              void refreshGlobalLeaderboard();
            }}
            isGlobalLoading={isGlobalLeaderboardLoading}
            isGlobalAvailable={isGlobalLeaderboardAvailable}
            globalHasError={hasGlobalLeaderboardError}
            scoreboardTitle={scoreboardTitle}
            scoreboardEmptyMessage={scoreboardEmptyMessage}
          />
        ) : (
          <SideColumn
            highscores={displayedHighscores}
            mode={leaderboardMode}
            onModeChange={setLeaderboardMode}
            clearLocalHighscores={clearHighscores}
            refreshGlobalHighscores={() => {
              void refreshGlobalLeaderboard();
            }}
            isGlobalLoading={isGlobalLeaderboardLoading}
            isGlobalAvailable={isGlobalLeaderboardAvailable}
            globalHasError={hasGlobalLeaderboardError}
            scoreboardTitle={scoreboardTitle}
            scoreboardEmptyMessage={scoreboardEmptyMessage}
          />
        )}
      </section>
    </main>
  );
};
