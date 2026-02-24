/**
 * Mouse input wiring for tap, charge, release, and pointer-based aiming.
 * Uses canvas-local mouse events with global mouseup for robust release handling.
 */
import { useEffect, type MutableRefObject } from 'react';
import { resumeAudioContext } from '../../game/audio';
import { pointerFromAnchorToAngleDeg, smoothPointerAngleDeg } from '../../game/controls';
import { getPlayerAngleAnchorScreen } from '../../game/render';
import type { GameState } from '../../game/types';
import type { Dispatch } from './types';

type UseMouseControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  stateRef: MutableRefObject<GameState>;
  anchorRef: MutableRefObject<{ x: number; y: number } | null>;
  lastAngleRef: MutableRefObject<number | null>;
};

export const useMouseControls = ({
  canvas,
  dispatch,
  stateRef,
  anchorRef,
  lastAngleRef
}: UseMouseControlsArgs): void => {
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const now = (): number => performance.now();
    const dispatchAngleFromPointer = (clientX: number, clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      const anchor = getPlayerAngleAnchorScreen(stateRef.current, rect.width, rect.height);
      anchorRef.current = anchor;
      const angleDeg = pointerFromAnchorToAngleDeg(
        clientX,
        clientY,
        rect.left + anchor.x,
        rect.top + anchor.y
      );
      if (Number.isNaN(angleDeg)) {
        return;
      }
      const smoothedAngleDeg = smoothPointerAngleDeg(lastAngleRef.current, angleDeg);
      lastAngleRef.current = smoothedAngleDeg;
      dispatch({
        type: 'setAngle',
        angleDeg: smoothedAngleDeg
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
      const phaseTag = stateRef.current.phase.tag;
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

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [anchorRef, canvas, dispatch, lastAngleRef, stateRef]);
};
