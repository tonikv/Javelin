import { useEffect, useRef } from 'react';
import { isInteractiveElement } from '../../../app/browser';
import { resumeAudioContext } from '../game/audio';
import {
  keyboardAngleDelta,
  keyboardAngleHoldDelta,
  pointerFromAnchorToAngleDeg,
  smoothPointerAngleDeg
} from '../game/controls';
import { getPlayerAngleAnchorScreen } from '../game/render';
import { ANGLE_KEYBOARD_STEP_DEG } from '../game/tuning';
import type { GameAction, GameState } from '../game/types';

type Dispatch = (action: GameAction) => void;

type UsePointerControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  state: GameState;
};

type TimerHandle = ReturnType<typeof setTimeout>;

type AngleKeyHoldState = {
  direction: 'up' | 'down';
  holdStartedAtMs: number;
  lastAppliedAtMs: number;
};

type TouchLongPressHandlers = {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  clear: () => void;
};

type TouchLongPressHandlerArgs = {
  dispatch: Dispatch;
  getPhaseTag: () => GameState['phase']['tag'];
  now: () => number;
  longPressMs?: number;
  setTimer?: (callback: () => void, delayMs: number) => TimerHandle;
  clearTimer?: (timer: TimerHandle) => void;
};

const TOUCH_LONG_PRESS_MS = 300;

export const isInteractiveEventTarget = (target: EventTarget | null): boolean => {
  return isInteractiveElement(target);
};

const allowsArrowAngleAdjust = (phaseTag: GameState['phase']['tag']): boolean =>
  phaseTag === 'idle' || phaseTag === 'runup' || phaseTag === 'chargeAim';

export const shouldReleaseChargeFromEnterKeyUp = (
  code: string,
  phaseTag: GameState['phase']['tag'],
  target: EventTarget | null
): boolean => code === 'Enter' && phaseTag === 'chargeAim' && !isInteractiveEventTarget(target);

export const shouldHandleAngleAdjustKeyDown = (
  code: string,
  phaseTag: GameState['phase']['tag'],
  target: EventTarget | null
): boolean =>
  (code === 'ArrowUp' || code === 'ArrowDown') &&
  allowsArrowAngleAdjust(phaseTag) &&
  !isInteractiveEventTarget(target);

export const createTouchLongPressHandlers = ({
  dispatch,
  getPhaseTag,
  now,
  longPressMs = TOUCH_LONG_PRESS_MS,
  setTimer = (callback, delayMs) => globalThis.setTimeout(callback, delayMs),
  clearTimer = (timer) => globalThis.clearTimeout(timer)
}: TouchLongPressHandlerArgs): TouchLongPressHandlers => {
  let longPressTimer: TimerHandle | null = null;

  const clear = (): void => {
    if (longPressTimer !== null) {
      clearTimer(longPressTimer);
      longPressTimer = null;
    }
  };

  const onTouchStart = (): void => {
    const phaseTag = getPhaseTag();
    if (phaseTag === 'runup') {
      dispatch({ type: 'rhythmTap', atMs: now() });
      clear();
      longPressTimer = setTimer(() => {
        if (getPhaseTag() === 'runup') {
          dispatch({ type: 'beginChargeAim', atMs: now() });
        }
        longPressTimer = null;
      }, longPressMs);
      return;
    }

    if (phaseTag === 'idle' || phaseTag === 'result') {
      dispatch({ type: 'rhythmTap', atMs: now() });
    }
  };

  const onTouchEnd = (): void => {
    clear();
    if (getPhaseTag() === 'chargeAim') {
      dispatch({ type: 'releaseCharge', atMs: now() });
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
    clear
  };
};

export const usePointerControls = ({ canvas, dispatch, state }: UsePointerControlsArgs): void => {
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
    let angleKeyHoldState: AngleKeyHoldState | null = null;
    let lastPointerAngleDeg: number | null = null;
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
      const smoothedAngleDeg = smoothPointerAngleDeg(lastPointerAngleDeg, angleDeg);
      lastPointerAngleDeg = smoothedAngleDeg;
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

    const onKeyDown = (event: KeyboardEvent): void => {
      if (isInteractiveEventTarget(event.target)) {
        return;
      }
      const phaseTag = stateRef.current.phase.tag;
      if (event.code === 'Space' && !event.repeat) {
        resumeAudioContext();
        event.preventDefault();
        dispatch({ type: 'rhythmTap', atMs: now() });
        return;
      }
      if (event.code === 'Enter' && !event.repeat && phaseTag === 'runup') {
        resumeAudioContext();
        event.preventDefault();
        dispatch({ type: 'beginChargeAim', atMs: now() });
        return;
      }
      if (
        (event.code === 'ArrowUp' || event.code === 'ArrowDown') &&
        shouldHandleAngleAdjustKeyDown(event.code, phaseTag, event.target)
      ) {
        event.preventDefault();
        const direction = event.code === 'ArrowUp' ? 'up' : 'down';
        const timestampMs = now();
        const shouldRestartHold =
          !event.repeat ||
          angleKeyHoldState === null ||
          angleKeyHoldState.direction !== direction;
        if (shouldRestartHold) {
          angleKeyHoldState = {
            direction,
            holdStartedAtMs: timestampMs,
            lastAppliedAtMs: timestampMs
          };
          dispatch({
            type: 'adjustAngle',
            deltaDeg: keyboardAngleDelta(direction, ANGLE_KEYBOARD_STEP_DEG)
          });
          return;
        }
        const holdState = angleKeyHoldState;
        if (holdState === null) {
          return;
        }
        const holdDurationMs = timestampMs - holdState.holdStartedAtMs;
        const dtMs = timestampMs - holdState.lastAppliedAtMs;
        dispatch({
          type: 'adjustAngle',
          deltaDeg: keyboardAngleHoldDelta(direction, holdDurationMs, dtMs)
        });
        angleKeyHoldState = {
          ...holdState,
          lastAppliedAtMs: timestampMs
        };
      }
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      if (isInteractiveEventTarget(event.target)) {
        return;
      }
      if (
        (event.code === 'ArrowUp' && angleKeyHoldState?.direction === 'up') ||
        (event.code === 'ArrowDown' && angleKeyHoldState?.direction === 'down')
      ) {
        angleKeyHoldState = null;
      }
      // Enter keyup is reserved for throw release only while charging.
      if (shouldReleaseChargeFromEnterKeyUp(event.code, stateRef.current.phase.tag, event.target)) {
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
      touchLongPressHandlers.clear();
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
  }, [canvas, dispatch]);
};
