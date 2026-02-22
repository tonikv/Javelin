import type { ReactElement } from 'react';
import type { GameState } from '../game/types';
import { getThrowLineRemainingM } from '../game/selectors';
import { useI18n } from '../../../i18n/init';

type HudPanelProps = {
  state: GameState;
};

const phaseMessageKey = (state: GameState): string => {
  switch (state.phase.tag) {
    case 'idle':
      return 'phase.idle';
    case 'runup':
      return 'phase.runup';
    case 'chargeAim':
      return 'phase.chargeAim';
    case 'throwAnim':
      return 'phase.throwAnim';
    case 'flight':
      return 'phase.flight';
    case 'result':
      return 'phase.result';
    case 'fault':
      return 'phase.fault';
    default:
      return 'phase.idle';
  }
};

export const HudPanel = ({ state }: HudPanelProps): ReactElement => {
  const { t, formatNumber } = useI18n();
  const throwLineRemainingM = getThrowLineRemainingM(state);

  const phaseHint =
    state.phase.tag === 'runup'
      ? `${t('javelin.runupHint')} ${throwLineRemainingM !== null ? `${formatNumber(throwLineRemainingM)} m` : ''}`
      : state.phase.tag === 'chargeAim'
        ? t('javelin.speedPassiveHint')
        : '';

  return (
    <section className="card hud-panel" aria-label={t('a11y.hudPanel')}>
      <div className="hud-topline">{t(phaseMessageKey(state))}</div>
      {phaseHint && <div className="hud-hint">{phaseHint}</div>}
    </section>
  );
};
