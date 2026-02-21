import type { ReactElement } from 'react';
import {
  CHARGE_GOOD_WINDOW,
  CHARGE_PERFECT_WINDOW
} from '../game/constants';
import type { GameState, TimingQuality } from '../game/types';
import {
  getAngleDeg,
  getForcePreviewPercent,
  getSpeedPercent,
  getThrowLineRemainingM
} from '../game/selectors';
import { useI18n } from '../../../i18n/init';
import { CircularTimingMeter } from './CircularTimingMeter';

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

const meterFeedback = (state: GameState): TimingQuality | null => {
  if (state.phase.tag === 'chargeAim') {
    return state.phase.chargeMeter.lastQuality;
  }
  return null;
};

export const HudPanel = ({ state }: HudPanelProps): ReactElement => {
  const { t, formatNumber } = useI18n();
  const speed = getSpeedPercent(state);
  const angle = getAngleDeg(state);
  const forcePercent = getForcePreviewPercent(state);
  const throwLineRemainingM = getThrowLineRemainingM(state);

  const phaseHint =
    state.phase.tag === 'runup'
      ? `${t('javelin.runupHint')} ${throwLineRemainingM !== null ? `${formatNumber(throwLineRemainingM)} m` : ''}`
      : state.phase.tag === 'chargeAim'
        ? t('javelin.speedPassiveHint')
        : '';

  return (
    <section className="card hud-panel" aria-label="HUD">
      <div className="hud-topline">{t(phaseMessageKey(state))}</div>
      {phaseHint && <div className="hud-hint">{phaseHint}</div>}
      <div className="hud-grid">
        <div className="hud-item">
          <span>{t('hud.speed')}</span>
          <strong>{speed}%</strong>
        </div>
        <div className="hud-item">
          <span>{t('hud.angle')}</span>
          <strong>{formatNumber(angle, 0)}°</strong>
        </div>
        <div className="hud-item">
          <span>{t('hud.wind')}</span>
          <strong>
            {state.windMs >= 0 ? '+' : ''}
            {formatNumber(state.windMs)} m/s
          </strong>
        </div>
      </div>

      {(state.phase.tag === 'chargeAim' || state.phase.tag === 'throwAnim') && (
        <div className="meter-row">
          <CircularTimingMeter
            labelKey="hud.force"
            phase01={state.phase.tag === 'chargeAim' ? state.phase.chargeMeter.phase01 : state.phase.forceNorm}
            hitFeedback={meterFeedback(state)}
            hotZones={[
              { ...CHARGE_GOOD_WINDOW, kind: 'good' },
              { ...CHARGE_PERFECT_WINDOW, kind: 'perfect' }
            ]}
            valueText={forcePercent === null ? '' : `${forcePercent}%`}
            active={state.phase.tag === 'chargeAim'}
          />
        </div>
      )}
    </section>
  );
};
