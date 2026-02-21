import type { ReactElement } from 'react';
import { ARM_RELEASE_WINDOW } from '../game/constants';
import type { GameState } from '../game/types';
import { getAngleDeg, getReleaseProgress, getSpeedPercent, isReleaseWindowOpen } from '../game/selectors';
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
    case 'throwPrep':
      return 'phase.throwPrep';
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
  const speed = getSpeedPercent(state);
  const angle = getAngleDeg(state);
  const releaseProgress = getReleaseProgress(state);
  const releaseReady = isReleaseWindowOpen(state);

  return (
    <section className="card hud-panel" aria-label="HUD">
      <div className="hud-topline">{t(phaseMessageKey(state))}</div>
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
      {releaseProgress !== null && (
        <div className="release-box">
          <div>
            {t('hud.release')} {releaseReady ? t('phase.throwPrep') : ''}
          </div>
          <progress value={Math.max(0, Math.min(1, releaseProgress))} max={1} />
          <small>
            {Math.round(ARM_RELEASE_WINDOW.start * 100)}-{Math.round(ARM_RELEASE_WINDOW.end * 100)}%
          </small>
        </div>
      )}
    </section>
  );
};
