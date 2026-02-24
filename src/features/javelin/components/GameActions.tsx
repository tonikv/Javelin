/**
 * Primary game action controls.
 * Handles round start/restart and reset-to-idle actions.
 */
import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { resumeAudioContext } from '../game/audio';
import type { GameAction, GameState } from '../game/types';

type Dispatch = (action: GameAction) => void;

type GameActionsProps = {
  state: GameState;
  dispatch: Dispatch;
};

export const GameActions = ({ state, dispatch }: GameActionsProps): ReactElement => {
  const { t } = useI18n();

  return (
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
  );
};
