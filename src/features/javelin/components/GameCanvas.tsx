import { useEffect, useMemo, useRef, type ReactElement } from 'react';
import { renderGame } from '../game/render';
import type { GameAction, GameState } from '../game/types';
import { usePointerControls } from '../hooks/usePointerControls';
import { useI18n } from '../../../i18n/init';

type Dispatch = (action: GameAction) => void;

type GameCanvasProps = {
  state: GameState;
  dispatch: Dispatch;
};

export const GameCanvas = ({ state, dispatch }: GameCanvasProps): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastRenderAtMsRef = useRef<number>(performance.now());
  const { locale, t } = useI18n();

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale]
  );

  usePointerControls({ canvas: canvasRef.current, dispatch, phaseTag: state.phase.tag, state });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    const nowMs = performance.now();
    const dtMs = Math.min(40, Math.max(0, nowMs - lastRenderAtMsRef.current));
    lastRenderAtMsRef.current = nowMs;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderGame(context, state, rect.width, rect.height, dtMs, numberFormat, t('javelin.throwLine'));
  }, [state, numberFormat, t]);

  return (
    <div className="canvas-frame">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        role="img"
        aria-label="Javelin throw game canvas"
      />
    </div>
  );
};
