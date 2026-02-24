import { memo, useEffect, useMemo, useReducer, useState, type ReactElement } from 'react';
import { LanguageSwitch } from './components/LanguageSwitch';
import { HudPanel } from './components/HudPanel';
import { GameCanvas } from './components/GameCanvas';
import { ScoreBoard, ScoreBoardContent } from './components/ScoreBoard';
import { ControlHelp, ControlHelpContent } from './components/ControlHelp';
import { gameReducer } from './game/reducer';
import { resumeAudioContext } from './game/audio';
import type { FaultReason, HighscoreEntry } from './game/types';
import { useGameLoop } from './hooks/useGameLoop';
import { useLocalHighscores } from './hooks/useLocalHighscores';
import { useI18n } from '../../i18n/init';
import { useMediaQuery } from '../../app/useMediaQuery';
import { createInitialGameState } from './game/update';

const faultReasonKey = (reason: FaultReason): string => `result.fault.${reason}`;

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
    <LanguageSwitch />
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
      <button type="button" className="ghost" onClick={clearHighscores}>
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
      <button type="button" className="ghost reset-scores" onClick={clearHighscores}>
        {t('action.resetScores')}
      </button>
    </section>
  );
};

const CompactSideColumn = memo(CompactSideColumnComponent);

export const JavelinPage = (): ReactElement => {
  const { t, formatNumber, locale } = useI18n();
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [nameInput, setNameInput] = useState('AAA');
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

  const resultMessage = useMemo(() => {
    if (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) {
      return t('javelin.result.foul_line');
    }
    if (state.phase.tag === 'result') {
      const landingMessage =
        state.phase.tipFirst === null
          ? ''
          : state.phase.tipFirst
            ? ` · ${t('javelin.landingTipFirst')}`
            : ` · ${t('javelin.landingFlat')}`;
      if (state.phase.resultKind !== 'valid') {
        return `${t(`javelin.result.${state.phase.resultKind}`)} · ${formatNumber(state.phase.distanceM)} m`;
      }
      return `${t('result.distance')} ${formatNumber(state.phase.distanceM)} m${landingMessage}`;
    }
    if (state.phase.tag === 'fault') {
      return t(faultReasonKey(state.phase.reason));
    }
    return '';
  }, [state.phase, t, formatNumber]);
  const resultStatusMessage = useMemo(() => {
    if (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) {
      return t('result.notSavedInvalid');
    }
    if (state.phase.tag === 'fault') {
      return t('result.notSavedInvalid');
    }
    if (state.phase.tag !== 'result') {
      return '';
    }
    if (state.phase.resultKind !== 'valid') {
      return t('result.notSavedInvalid');
    }
    if (!state.phase.isHighscore) {
      return t('result.notHighscore');
    }
    return '';
  }, [state.phase, t]);

  const canSaveScore =
    state.phase.tag === 'result' &&
    state.phase.resultKind === 'valid' &&
    state.phase.isHighscore &&
    savedRoundId !== state.roundId;
  const resultDistanceM = state.phase.tag === 'result' ? state.phase.distanceM : null;
  const resultThrowSpecs = state.phase.tag === 'result' ? state.phase.launchedFrom : null;

  const isFoulMessage =
    state.phase.tag === 'fault' ||
    (state.phase.tag === 'flight' && state.phase.launchedFrom.lineCrossedAtRelease) ||
    (state.phase.tag === 'result' && state.phase.resultKind !== 'valid');

  return (
    <main className="page">
      <TopBar appTitle={t('app.title')} gameTitle={t('javelin.title')} />

      <section className="layout">
        <div className="main-column">
          <HudPanel state={state} />
          <GameCanvas state={state} dispatch={dispatch} />
          <div className="actions">
            <button
              type="button"
              onClick={(event) => {
                resumeAudioContext();
                dispatch({
                  type: 'startRound',
                  atMs: performance.now(),
                  windMs: state.windMs,
                  windZMs: state.windZMs
                });
                event.currentTarget.blur();
              }}
            >
              {state.phase.tag === 'idle' ? t('action.start') : t('action.playAgain')}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={(event) => {
                dispatch({ type: 'resetToIdle' });
                event.currentTarget.blur();
              }}
            >
              {t('phase.idle')}
            </button>
          </div>

          <p
            className={`result-live ${isFoulMessage ? 'is-foul' : ''}`}
            aria-live="polite"
          >
            {resultMessage}
          </p>
          {resultStatusMessage && (
            <p className={`result-note ${isFoulMessage ? 'is-foul' : ''}`}>{resultStatusMessage}</p>
          )}
          {resultThrowSpecs !== null && (
            <div className="result-specs">
              <span className="score-chip">
                {t('spec.wind')}:{' '}
                {resultThrowSpecs.windMs >= 0 ? '+' : ''}
                {formatNumber(resultThrowSpecs.windMs)} m/s
              </span>
              <span className="score-chip">
                {t('spec.angle')}: {formatNumber(resultThrowSpecs.angleDeg, 0)}°
              </span>
              <span className="score-chip">
                {t('spec.launchSpeed')}: {formatNumber(resultThrowSpecs.launchSpeedMs)} m/s
              </span>
            </div>
          )}

          {canSaveScore && state.phase.tag === 'result' && (
            <form
              className="save-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (state.phase.tag !== 'result') {
                  return;
                }
                addHighscore({
                  id: crypto.randomUUID(),
                  name: nameInput.trim().slice(0, 10) || t('scoreboard.defaultName'),
                  distanceM: resultDistanceM ?? 0,
                  playedAtIso: new Date().toISOString(),
                  locale,
                  windMs: state.phase.launchedFrom.windMs,
                  launchSpeedMs: state.phase.launchedFrom.launchSpeedMs,
                  angleDeg: state.phase.launchedFrom.angleDeg
                });
                setSavedRoundId(state.roundId);
              }}
            >
              <label>
                {t('scoreboard.name')}
                <input
                  minLength={3}
                  maxLength={10}
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value.toUpperCase())}
                />
              </label>
              <button type="submit">{t('action.saveScore')}</button>
            </form>
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
