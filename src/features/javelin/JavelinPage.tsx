import { useEffect, useMemo, useReducer, useState, type ReactElement } from 'react';
import { LanguageSwitch } from './components/LanguageSwitch';
import { HudPanel } from './components/HudPanel';
import { GameCanvas } from './components/GameCanvas';
import { ScoreBoard } from './components/ScoreBoard';
import { ControlHelp } from './components/ControlHelp';
import { gameReducer } from './game/reducer';
import { WIND_MAX_MS, WIND_MIN_MS } from './game/constants';
import type { FaultReason } from './game/types';
import { useGameLoop } from './hooks/useGameLoop';
import { useLocalHighscores } from './hooks/useLocalHighscores';
import { useI18n } from '../../i18n/init';
import { createInitialGameState } from './game/update';

const randomWind = (): number =>
  Math.round((WIND_MIN_MS + Math.random() * (WIND_MAX_MS - WIND_MIN_MS)) * 10) / 10;

const faultReasonKey = (reason: FaultReason): string => `result.fault.${reason}`;

export const JavelinPage = (): ReactElement => {
  const { t, formatNumber, locale } = useI18n();
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [nameInput, setNameInput] = useState('AAA');
  const [savedRoundId, setSavedRoundId] = useState<number>(-1);
  const { highscores, addHighscore, clearHighscores, isHighscore } = useLocalHighscores();

  useGameLoop(dispatch);

  useEffect(() => {
    if (state.phase.tag !== 'result') {
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
    if (state.phase.tag === 'result') {
      return `${t('result.distance')} ${formatNumber(state.phase.distanceM)} m`;
    }
    if (state.phase.tag === 'fault') {
      return t(faultReasonKey(state.phase.reason));
    }
    return '';
  }, [state.phase, t, formatNumber]);

  const canSaveScore =
    state.phase.tag === 'result' &&
    state.phase.isHighscore &&
    savedRoundId !== state.roundId;
  const resultDistanceM = state.phase.tag === 'result' ? state.phase.distanceM : null;

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">{t('app.title')}</p>
          <h1>{t('javelin.title')}</h1>
        </div>
        <LanguageSwitch />
      </header>

      <section className="layout">
        <div className="main-column">
          <HudPanel state={state} />
          <GameCanvas state={state} dispatch={dispatch} />
          <div className="actions">
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: 'startRound',
                  atMs: performance.now(),
                  windMs: randomWind()
                })
              }
            >
              {state.phase.tag === 'idle' ? t('action.start') : t('action.playAgain')}
            </button>
            <button type="button" className="ghost" onClick={() => dispatch({ type: 'resetToIdle' })}>
              {t('phase.idle')}
            </button>
          </div>

          <p className="result-live" aria-live="polite">
            {resultMessage}
          </p>

          {canSaveScore && state.phase.tag === 'result' && (
            <form
              className="save-form"
              onSubmit={(event) => {
                event.preventDefault();
                addHighscore({
                  id: crypto.randomUUID(),
                  name: nameInput.trim().slice(0, 10) || 'PLAYER',
                  distanceM: resultDistanceM ?? 0,
                  playedAtIso: new Date().toISOString(),
                  locale,
                  windMs: state.windMs
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
          {state.phase.tag === 'result' && state.phase.isHighscore && (
            <div className="badge">{t('result.highscore')}</div>
          )}
        </div>

        <aside className="side-column">
          <ControlHelp />
          <ScoreBoard highscores={highscores} />
          <button type="button" className="ghost" onClick={clearHighscores}>
            {t('action.resetScores')}
          </button>
        </aside>
      </section>
    </main>
  );
};
