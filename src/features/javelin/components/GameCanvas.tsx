import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { createRenderSession, renderGame } from '../game/render';
import type { GameAction, GameState } from '../game/types';
import { usePointerControls } from '../hooks/usePointerControls';
import { useMediaQuery } from '../../../app/useMediaQuery';
import { useI18n } from '../../../i18n/init';
import { useTheme } from '../../../theme/init';
import { detectTouchDevice } from './ControlHelp';

type Dispatch = (action: GameAction) => void;

type GameCanvasProps = {
  state: GameState;
  dispatch: Dispatch;
};

const getPhaseAnnouncement = (
  state: GameState,
  t: (key: string) => string,
  numberFormat: Intl.NumberFormat
): string => {
  switch (state.phase.tag) {
    case 'runup':
      return t('a11y.announce.runupStarted');
    case 'chargeAim':
      return t('a11y.announce.chargeAim');
    case 'throwAnim':
      return t('a11y.announce.throwAnim');
    case 'flight':
      return t('a11y.announce.flight');
    case 'result':
      return `${t('a11y.announce.resultPrefix')}: ${numberFormat.format(state.phase.distanceM)} m`;
    case 'fault':
      return t('a11y.announce.fault');
    case 'idle':
    default:
      return t('a11y.announce.idle');
  }
};

export const GameCanvas = ({ state, dispatch }: GameCanvasProps): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef(state);
  const lastAnnouncedPhaseRef = useRef<GameState['phase']['tag'] | null>(null);
  const lastRenderAtMsRef = useRef<number>(performance.now());
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const renderSessionRef = useRef(createRenderSession());
  const viewportRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1
  });
  const [viewportVersion, setViewportVersion] = useState(0);
  const [phaseAnnouncement, setPhaseAnnouncement] = useState('');
  const { locale, t } = useI18n();
  const { theme } = useTheme();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale]
  );
  const isTouchDevice = useMemo(() => detectTouchDevice(), []);
  const onboardingHint = useMemo(
    () => (isTouchDevice ? t('onboarding.hintTouch') : t('onboarding.hint')),
    [isTouchDevice, t]
  );
  const windHints = useMemo(
    () => ({
      headwind: t('javelin.windHintHeadwind'),
      tailwind: t('javelin.windHintTailwind')
    }),
    [t]
  );
  const announcedResultDistance =
    state.phase.tag === 'result' ? state.phase.distanceM : null;
  const releaseFlashLabels = useMemo(
    () => ({
      perfect: t('hud.perfect'),
      good: t('hud.good'),
      miss: t('hud.miss'),
      foulLine: t('javelin.result.foul_line')
    }),
    [t]
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (lastAnnouncedPhaseRef.current === state.phase.tag) {
      return;
    }
    lastAnnouncedPhaseRef.current = state.phase.tag;
    setPhaseAnnouncement(getPhaseAnnouncement(state, t, numberFormat));
  }, [announcedResultDistance, numberFormat, state.phase.tag, t]);

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
    let rafId = 0;

    const drawFrame = (): void => {
      const context = contextRef.current;
      const { width, height, dpr } = viewportRef.current;
      if (context && width > 0 && height > 0) {
        const nowMs = performance.now();
        const dtMs = Math.min(40, Math.max(0, nowMs - lastRenderAtMsRef.current));
        lastRenderAtMsRef.current = nowMs;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderGame(
          context,
          stateRef.current,
          width,
          height,
          dtMs,
          numberFormat,
          t('javelin.throwLine'),
          releaseFlashLabels,
          theme,
          prefersReducedMotion,
          {
            onboarding: onboardingHint,
            headwind: windHints.headwind,
            tailwind: windHints.tailwind
          },
          renderSessionRef.current
        );
      }
      rafId = window.requestAnimationFrame(drawFrame);
    };

    lastRenderAtMsRef.current = performance.now();
    rafId = window.requestAnimationFrame(drawFrame);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [
    numberFormat,
    onboardingHint,
    prefersReducedMotion,
    releaseFlashLabels,
    t,
    theme,
    viewportVersion,
    windHints
  ]);

  return (
    <div className="canvas-frame">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{ touchAction: 'none' }}
        role="application"
        tabIndex={0}
        aria-roledescription={t('a11y.gameCanvas')}
        aria-label={t('a11y.gameCanvas')}
      />
      <p className="sr-only" aria-live="assertive" aria-atomic="true">
        {phaseAnnouncement}
      </p>
    </div>
  );
};
