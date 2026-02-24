/**
 * Shared control-layer types and pure guard helpers.
 * This module contains input-agnostic logic reused by keyboard, mouse, and touch hooks.
 */
import { isInteractiveElement } from '../../../../app/browser';
import type { GameAction, GameState } from '../../game/types';

export type Dispatch = (action: GameAction) => void;

export type AngleKeyHoldState = {
  direction: 'up' | 'down';
  holdStartedAtMs: number;
  lastAppliedAtMs: number;
};

type TimerHandle = ReturnType<typeof setTimeout>;

export type TouchLongPressHandlers = {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  clear: () => void;
};

export type TouchLongPressHandlerArgs = {
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

const allowsActionKeyHandling = (phaseTag: GameState['phase']['tag']): boolean =>
  phaseTag === 'runup' || phaseTag === 'chargeAim';

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

export const shouldConsumeActionKeyDown = (
  code: string,
  phaseTag: GameState['phase']['tag'],
  target: EventTarget | null,
  repeat: boolean
): boolean =>
  !repeat &&
  !isInteractiveEventTarget(target) &&
  (code === 'Space' || code === 'Enter') &&
  allowsActionKeyHandling(phaseTag);

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
