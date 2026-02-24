/**
 * Keyboard input wiring for throw actions and angle adjustment.
 * Registers global key listeners and dispatches game actions from key events.
 */
import { useEffect, type MutableRefObject } from 'react';
import { keyboardAngleDelta, keyboardAngleHoldDelta } from '../../game/controls';
import { resumeAudioContext } from '../../game/audio';
import { GAMEPLAY_TUNING } from '../../game/tuning';
import type { GameState } from '../../game/types';
import {
  isInteractiveEventTarget,
  shouldConsumeActionKeyDown,
  shouldHandleAngleAdjustKeyDown,
  shouldReleaseChargeFromEnterKeyUp,
  type AngleKeyHoldState,
  type Dispatch
} from './types';

const { stepDeg: ANGLE_KEYBOARD_STEP_DEG } = GAMEPLAY_TUNING.angleControl;

type UseKeyboardControlsArgs = {
  dispatch: Dispatch;
  stateRef: MutableRefObject<GameState>;
  angleHoldRef: MutableRefObject<AngleKeyHoldState | null>;
};

export const useKeyboardControls = ({
  dispatch,
  stateRef,
  angleHoldRef
}: UseKeyboardControlsArgs): void => {
  useEffect(() => {
    const now = (): number => performance.now();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (isInteractiveEventTarget(event.target)) {
        return;
      }

      const phaseTag = stateRef.current.phase.tag;
      if (event.code === 'Space' && shouldConsumeActionKeyDown(event.code, phaseTag, event.target, event.repeat)) {
        resumeAudioContext();
        event.preventDefault();
        if (phaseTag === 'runup') {
          dispatch({ type: 'rhythmTap', atMs: now() });
        }
        return;
      }

      if (event.code === 'Enter' && shouldConsumeActionKeyDown(event.code, phaseTag, event.target, event.repeat)) {
        resumeAudioContext();
        event.preventDefault();
        if (phaseTag === 'runup') {
          dispatch({ type: 'beginChargeAim', atMs: now() });
        }
        return;
      }

      if (
        (event.code === 'ArrowUp' || event.code === 'ArrowDown') &&
        shouldHandleAngleAdjustKeyDown(event.code, phaseTag, event.target)
      ) {
        event.preventDefault();
        const direction = event.code === 'ArrowUp' ? 'up' : 'down';
        const timestampMs = now();
        const previousHoldState = angleHoldRef.current;
        const shouldRestartHold =
          !event.repeat ||
          previousHoldState === null ||
          previousHoldState.direction !== direction;
        if (shouldRestartHold) {
          angleHoldRef.current = {
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

        if (previousHoldState === null) {
          return;
        }
        const holdDurationMs = timestampMs - previousHoldState.holdStartedAtMs;
        const dtMs = timestampMs - previousHoldState.lastAppliedAtMs;
        dispatch({
          type: 'adjustAngle',
          deltaDeg: keyboardAngleHoldDelta(direction, holdDurationMs, dtMs)
        });
        angleHoldRef.current = {
          ...previousHoldState,
          lastAppliedAtMs: timestampMs
        };
      }
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      if (isInteractiveEventTarget(event.target)) {
        return;
      }
      if (
        (event.code === 'ArrowUp' && angleHoldRef.current?.direction === 'up') ||
        (event.code === 'ArrowDown' && angleHoldRef.current?.direction === 'down')
      ) {
        angleHoldRef.current = null;
      }

      // Enter keyup is reserved for throw release only while charging.
      if (shouldReleaseChargeFromEnterKeyUp(event.code, stateRef.current.phase.tag, event.target)) {
        event.preventDefault();
        dispatch({ type: 'releaseCharge', atMs: now() });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [angleHoldRef, dispatch, stateRef]);
};
