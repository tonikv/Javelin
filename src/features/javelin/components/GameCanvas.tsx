import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { createRenderSession, renderGame } from '../game/render';
import type { GameAction, GameState } from '../game/types';
import { usePointerControls } from '../hooks/usePointerControls';
import { useI18n } from '../../../i18n/init';
import { useTheme } from '../../../theme/init';

type Dispatch = (action: GameAction) => void;

type GameCanvasProps = {
  state: GameState;
  dispatch: Dispatch;
};

export const GameCanvas = ({ state, dispatch }: GameCanvasProps): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastRenderAtMsRef = useRef<number>(performance.now());
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const renderSessionRef = useRef(createRenderSession());
  const viewportRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1
  });
  const [viewportVersion, setViewportVersion] = useState(0);
  const { locale, t } = useI18n();
  const { theme } = useTheme();

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale]
  );
  const releaseFlashLabels = useMemo(
    () => ({
      perfect: t('hud.perfect'),
      good: t('hud.good'),
      miss: t('hud.miss'),
      foulLine: t('javelin.result.foul_line')
    }),
    [t]
  );

  usePointerControls({ canvas: canvasRef.current, dispatch, state });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const syncBackbuffer = (): void => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const pixelWidth = Math.max(1, Math.floor(width * dpr));
      const pixelHeight = Math.max(1, Math.floor(height * dpr));
      const current = viewportRef.current;
      const changed = current.width !== width || current.height !== height || current.dpr !== dpr;
      if (!changed) {
        return;
      }
      if (canvas.width !== pixelWidth) {
        canvas.width = pixelWidth;
      }
      if (canvas.height !== pixelHeight) {
        canvas.height = pixelHeight;
      }
      viewportRef.current = { width, height, dpr };
      setViewportVersion((version) => version + 1);
    };

    contextRef.current = canvas.getContext('2d');
    if (!contextRef.current) {
      return;
    }
    syncBackbuffer();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        syncBackbuffer();
      });
      observer.observe(canvas);
      return () => {
        observer.disconnect();
      };
    }

    const onWindowResize = (): void => {
      syncBackbuffer();
    };
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    const context = contextRef.current;
    const { width, height, dpr } = viewportRef.current;
    if (!context || width <= 0 || height <= 0) {
      return;
    }

    const nowMs = performance.now();
    const dtMs = Math.min(40, Math.max(0, nowMs - lastRenderAtMsRef.current));
    lastRenderAtMsRef.current = nowMs;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderGame(
      context,
      state,
      width,
      height,
      dtMs,
      numberFormat,
      t('javelin.throwLine'),
      releaseFlashLabels,
      theme,
      renderSessionRef.current
    );
  }, [state, numberFormat, t, releaseFlashLabels, viewportVersion, theme]);

  return (
    <div className="canvas-frame">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{ touchAction: 'none' }}
        role="img"
        aria-label={t('a11y.gameCanvas')}
      />
    </div>
  );
};
