/**
 * Primary game action controls.
 * Handles round start/restart and reset-to-idle actions.
 */
import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { resumeAudioContext } from '../game/audio';
import { difficultyLevels, type GameAction, type GameState } from '../game/types';
import type { DifficultyUnlocks } from '../hooks/useDifficultyUnlocks';

type Dispatch = (action: GameAction) => void;

type GameActionsProps = {
  state: GameState;
  dispatch: Dispatch;
  difficultyUnlocks: DifficultyUnlocks;
};

export const GameActions = ({ state, dispatch, difficultyUnlocks }: GameActionsProps): ReactElement => {
  const { t } = useI18n();
  const canChangeDifficulty = state.phase.tag === 'idle' || state.phase.tag === 'result';
  const unlockHintKey =
    !difficultyUnlocks.pro
      ? 'difficulty.unlockHint.pro'
      : !difficultyUnlocks.elite
        ? 'difficulty.unlockHint.elite'
        : 'difficulty.unlockHint.all';

  return (
    <>
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

      <section className="card difficulty-controls" aria-label={t('difficulty.label')}>
        <p className="difficulty-title">{t('difficulty.label')}</p>
        <div className="difficulty-switch" role="group" aria-label={t('difficulty.label')}>
          {difficultyLevels.map((difficulty) => {
            const unlocked = difficultyUnlocks[difficulty];
            return (
              <button
                key={difficulty}
                type="button"
                className={state.difficulty === difficulty ? '' : 'ghost'}
                aria-pressed={state.difficulty === difficulty}
                disabled={!unlocked || !canChangeDifficulty}
                onClick={(event) => {
                  dispatch({
                    type: 'setDifficulty',
                    difficulty
                  });
                  event.currentTarget.blur();
                }}
              >
                {t(`difficulty.${difficulty}`)}
              </button>
            );
          })}
        </div>
        <p className="difficulty-hint">{t(`difficulty.hint.${state.difficulty}`)}</p>
        <p className="difficulty-unlock-hint">{t(unlockHintKey)}</p>
      </section>
    </>
  );
};
