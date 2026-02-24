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

type SideColumnProps = {
  highscores: HighscoreEntry[];
  clearHighscores: () => void;
};

const SideColumnComponent = ({ highscores, clearHighscores }: SideColumnProps): ReactElement => {
  const { t } = useI18n();
  return (
    <aside className="side-column">
      <ControlHelp />
      <ScoreBoard highscores={highscores} />
      <button
        type="button"
        className="ghost"
        onClick={clearHighscores}
        aria-label={`${t('action.resetScores')} - ${t('scoreboard.title')}`}
      >
        {t('action.resetScores')}
      </button>
    </aside>
  );
};

const SideColumn = memo(SideColumnComponent);

type CompactSideColumnProps = {
  highscores: HighscoreEntry[];
  clearHighscores: () => void;
};

const CompactSideColumnComponent = ({
  highscores,
  clearHighscores
}: CompactSideColumnProps): ReactElement => {
  const { t } = useI18n();
  const hasScores = highscores.length > 0;
  const [isScoreboardOpen, setIsScoreboardOpen] = useState<boolean>(hasScores);

  useEffect(() => {
    setIsScoreboardOpen(hasScores);
  }, [hasScores]);

  return (
    <section className="compact-side-column">
      <details className="card disclosure disclosure-help">
        <summary>{t('help.title')}</summary>
        <div className="disclosure-body">
          <ControlHelpContent />
        </div>
      </details>
      <details
        className="card disclosure disclosure-scoreboard"
        open={isScoreboardOpen}
        onToggle={(event) => setIsScoreboardOpen(event.currentTarget.open)}
      >
        <summary>{t('scoreboard.title')}</summary>
        <div className="disclosure-body">
          <ScoreBoardContent highscores={highscores} />
        </div>
      </details>
      <button
        type="button"
        className="ghost reset-scores"
        onClick={clearHighscores}
        aria-label={`${t('action.resetScores')} - ${t('scoreboard.title')}`}
      >
        {t('action.resetScores')}
      </button>
    </section>
  );
};

const CompactSideColumn = memo(CompactSideColumnComponent);

export const JavelinPage = (): ReactElement => {
  const { t, locale } = useI18n();
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [savedRoundId, setSavedRoundId] = useState<number>(-1);
  const { highscores, addHighscore, clearHighscores, isHighscore } = useLocalHighscores();
  const isCompactLayout = useMediaQuery('(max-width: 1023px)');

  useGameLoop(dispatch);

  useEffect(() => {
    if (state.phase.tag !== 'result' || state.phase.resultKind !== 'valid') {
      return;
    }
    const shouldBeHighscore = isHighscore(state.phase.distanceM);
    if (state.phase.isHighscore === shouldBeHighscore) {
      return;
    }
    dispatch({
      type: 'setResultHighscoreFlag',
      isHighscore: shouldBeHighscore
    });
  }, [state.phase, isHighscore]);

  const { resultMessage, resultStatusMessage, isFoulMessage, resultThrowSpecs } = useResultMessage(state);

  const canSaveScore =
    state.phase.tag === 'result' &&
    state.phase.resultKind === 'valid' &&
    state.phase.isHighscore &&
    savedRoundId !== state.roundId;

  return (
    <main className="page">
      <TopBar appTitle={t('app.title')} gameTitle={t('javelin.title')} />

      <section className="layout">
        <div className="main-column">
          <HudPanel state={state} />
          <GameCanvas state={state} dispatch={dispatch} />
          <GameActions state={state} dispatch={dispatch} />
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
                addHighscore({
                  id: crypto.randomUUID(),
                  name,
                  distanceM: state.phase.distanceM,
                  playedAtIso: new Date().toISOString(),
                  locale,
                  windMs: state.phase.launchedFrom.windMs,
                  launchSpeedMs: state.phase.launchedFrom.launchSpeedMs,
                  angleDeg: state.phase.launchedFrom.angleDeg
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
          <CompactSideColumn highscores={highscores} clearHighscores={clearHighscores} />
        ) : (
          <SideColumn highscores={highscores} clearHighscores={clearHighscores} />
        )}
      </section>
    </main>
  );
};
