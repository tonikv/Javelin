/**
 * Touch input wiring with tap and long-press gestures.
 * Converts touch movement into aiming updates while preserving passive=false scrolling control.
 */
import { useEffect, useRef, type MutableRefObject } from 'react';
import { resumeAudioContext } from '../../game/audio';
import { pointerFromAnchorToAngleDeg, smoothPointerAngleDeg } from '../../game/controls';
import { getPlayerAngleAnchorScreen } from '../../game/render';
import type { GameState } from '../../game/types';
import { createTouchLongPressHandlers, type Dispatch } from './types';

type UseTouchControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  stateRef: MutableRefObject<GameState>;
};

export const useTouchControls = ({ canvas, dispatch, stateRef }: UseTouchControlsArgs): void => {
  const lastAngleRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const now = (): number => performance.now();
    const touchLongPressHandlers = createTouchLongPressHandlers({
      dispatch,
      getPhaseTag: () => stateRef.current.phase.tag,
      now
    });
    const dispatchAngleFromPointer = (clientX: number, clientY: number): void => {
      const rect = canvas.getBoundingClientRect();
      const anchor = getPlayerAngleAnchorScreen(stateRef.current, rect.width, rect.height);
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

    const onTouchStart = (event: TouchEvent): void => {
      event.preventDefault();
      resumeAudioContext();
      touchLongPressHandlers.onTouchStart();
    };

    const onTouchEnd = (): void => {
      touchLongPressHandlers.onTouchEnd();
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

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      touchLongPressHandlers.clear();
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [canvas, dispatch, stateRef]);
};
