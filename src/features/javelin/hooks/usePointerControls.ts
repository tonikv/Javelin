import { useEffect } from 'react';
import { keyboardAngleDelta, pointerClientYToAngleDeg } from '../game/controls';
import type { GameAction, GamePhase } from '../game/types';

type Dispatch = (action: GameAction) => void;

type UsePointerControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  phaseTag: GamePhase['tag'];
};

export const usePointerControls = ({ canvas, dispatch, phaseTag }: UsePointerControlsArgs): void => {
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const now = (): number => performance.now();
    const dispatchAngleFromPointer = (clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      dispatch({
        type: 'setAngle',
        angleDeg: pointerClientYToAngleDeg(clientY, rect.top, rect.height)
      });
    };

    const onMouseDown = (event: MouseEvent): void => {
      if (event.button === 0) {
        dispatch({ type: 'rhythmTap', atMs: now() });
      }
      if (event.button === 2) {
        event.preventDefault();
        dispatch({ type: 'beginChargeAim', atMs: now() });
        dispatchAngleFromPointer(event.clientY);
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
        dispatchAngleFromPointer(event.clientY);
      }
    };

    const onContextMenu = (event: Event): void => {
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        dispatch({ type: 'rhythmTap', atMs: now() });
        return;
      }
      if (event.code === 'Enter' && !event.repeat) {
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
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [canvas, dispatch, phaseTag]);
};
