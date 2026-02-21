import { useEffect, useRef } from 'react';
import { resumeAudioContext } from '../game/audio';
import { keyboardAngleDelta, pointerFromAnchorToAngleDeg } from '../game/controls';
import { getPlayerAngleAnchorScreen } from '../game/render';
import type { GameAction, GamePhase, GameState } from '../game/types';

type Dispatch = (action: GameAction) => void;

type UsePointerControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  phaseTag: GamePhase['tag'];
  state: GameState;
};

export const usePointerControls = ({ canvas, dispatch, phaseTag, state }: UsePointerControlsArgs): void => {
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const now = (): number => performance.now();
    let longPressTimer: number | null = null;
    const LONG_PRESS_MS = 300;
    const clearLongPressTimer = (): void => {
      if (longPressTimer !== null) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };
    const dispatchAngleFromPointer = (clientX: number, clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      const anchor = getPlayerAngleAnchorScreen(stateRef.current, rect.width, rect.height);
      dispatch({
        type: 'setAngle',
        angleDeg: pointerFromAnchorToAngleDeg(
          clientX,
          clientY,
          rect.left + anchor.x,
          rect.top + anchor.y
        )
      });
    };

    const onMouseDown = (event: MouseEvent): void => {
      resumeAudioContext();
      if (event.button === 0) {
        dispatch({ type: 'rhythmTap', atMs: now() });
      }
      if (event.button === 2) {
        event.preventDefault();
        dispatch({ type: 'beginChargeAim', atMs: now() });
        dispatchAngleFromPointer(event.clientX, event.clientY);
      }
    };

    const onMouseUp = (event: MouseEvent): void => {
      if (event.button === 2) {
        dispatch({ type: 'releaseCharge', atMs: now() });
      }
    };

    const onMouseMove = (event: MouseEvent): void => {
      const shouldTrackPointerAngle =
        phaseTag === 'idle' ||
        phaseTag === 'runup' ||
        phaseTag === 'chargeAim' ||
        (phaseTag === 'throwAnim' && (event.buttons & 2) !== 0);
      if (shouldTrackPointerAngle) {
        dispatchAngleFromPointer(event.clientX, event.clientY);
      }
    };

    const onContextMenu = (event: Event): void => {
      event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent): void => {
      event.preventDefault();
      resumeAudioContext();
      const currentPhaseTag = stateRef.current.phase.tag;
      if (currentPhaseTag === 'runup') {
        dispatch({ type: 'rhythmTap', atMs: now() });
        clearLongPressTimer();
        longPressTimer = window.setTimeout(() => {
          if (stateRef.current.phase.tag === 'runup') {
            dispatch({ type: 'beginChargeAim', atMs: now() });
          }
          longPressTimer = null;
        }, LONG_PRESS_MS);
        return;
      }
      if (currentPhaseTag === 'idle' || currentPhaseTag === 'result') {
        dispatch({ type: 'rhythmTap', atMs: now() });
      }
    };

    const onTouchEnd = (): void => {
      clearLongPressTimer();
      if (stateRef.current.phase.tag === 'chargeAim') {
        dispatch({ type: 'releaseCharge', atMs: now() });
      }
    };

    const onTouchMove = (event: TouchEvent): void => {
      event.preventDefault();
      if (event.touches.length < 1) {
        return;
      }
      const currentPhaseTag = stateRef.current.phase.tag;
      if (currentPhaseTag === 'chargeAim' || currentPhaseTag === 'runup' || currentPhaseTag === 'idle') {
        const touch = event.touches[0];
        dispatchAngleFromPointer(touch.clientX, touch.clientY);
      }
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.code === 'Space' && !event.repeat) {
        resumeAudioContext();
        event.preventDefault();
        dispatch({ type: 'rhythmTap', atMs: now() });
        return;
      }
      if (event.code === 'Enter' && !event.repeat) {
        resumeAudioContext();
        event.preventDefault();
        if (phaseTag === 'runup') {
          dispatch({ type: 'beginChargeAim', atMs: now() });
        }
        return;
      }
      if (event.code === 'ArrowUp') {
        event.preventDefault();
        dispatch({ type: 'adjustAngle', deltaDeg: keyboardAngleDelta('up') });
        return;
      }
      if (event.code === 'ArrowDown') {
        event.preventDefault();
        dispatch({ type: 'adjustAngle', deltaDeg: keyboardAngleDelta('down') });
      }
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      if (event.code === 'Enter') {
        event.preventDefault();
        dispatch({ type: 'releaseCharge', atMs: now() });
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      clearLongPressTimer();
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [canvas, dispatch, phaseTag]);
};
