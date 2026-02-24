/**
 * Composed controls hook that wires keyboard, mouse, and touch handlers.
 * Also re-exports pure guard helpers used by unit tests.
 */
import { useEffect, useRef } from 'react';
import type { GameState } from '../../game/types';
import {
  type AngleKeyHoldState,
  type Dispatch
} from './types';
import { useKeyboardControls } from './useKeyboardControls';
import { useMouseControls } from './useMouseControls';
import { useTouchControls } from './useTouchControls';

type UsePointerControlsArgs = {
  canvas: HTMLCanvasElement | null;
  dispatch: Dispatch;
  state: GameState;
};

export const usePointerControls = ({ canvas, dispatch, state }: UsePointerControlsArgs): void => {
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const angleHoldRef = useRef<AngleKeyHoldState | null>(null);
  const anchorRef = useRef<{ x: number; y: number } | null>(null);
  const lastAngleRef = useRef<number | null>(null);

  useKeyboardControls({ dispatch, stateRef, angleHoldRef });
  useMouseControls({ canvas, dispatch, stateRef, anchorRef, lastAngleRef });
  useTouchControls({ canvas, dispatch, stateRef });
};

export {
  isInteractiveEventTarget,
  shouldReleaseChargeFromEnterKeyUp,
  shouldHandleAngleAdjustKeyDown,
  shouldConsumeActionKeyDown,
  createTouchLongPressHandlers
} from './types';
