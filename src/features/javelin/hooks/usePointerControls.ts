import { useEffect } from 'react';
import { keyboardAngleDelta, pointerMovementToAngleDelta } from '../game/controls';
import type { GameAction } from '../game/types';

type Dispatch = (action: GameAction) => void;

type UsePointerControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  phaseTag: string;
};

export const usePointerControls = ({ canvas, dispatch, phaseTag }: UsePointerControlsArgs): void => {
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const onMouseDown = (event: MouseEvent): void => {
      if (event.button === 0) {
        dispatch({ type: 'rhythmTap', atMs: performance.now() });
      }
      if (event.button === 2) {
        dispatch({ type: 'beginThrowPrep' });
      }
    };

    const onMouseUp = (event: MouseEvent): void => {
      if (event.button === 2) {
        dispatch({ type: 'releaseThrow' });
      }
    };

    const onMouseMove = (event: MouseEvent): void => {
      if ((event.buttons & 2) !== 0) {
        dispatch({
          type: 'adjustAngle',
          deltaDeg: pointerMovementToAngleDelta(event.movementY)
        });
      }
    };

    const onContextMenu = (event: Event): void => {
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        dispatch({ type: 'rhythmTap', atMs: performance.now() });
        return;
      }
      if (event.code === 'Enter' && !event.repeat) {
        event.preventDefault();
        if (phaseTag === 'throwPrep') {
          dispatch({ type: 'releaseThrow' });
        } else {
          dispatch({ type: 'beginThrowPrep' });
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

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [canvas, dispatch, phaseTag]);
};
