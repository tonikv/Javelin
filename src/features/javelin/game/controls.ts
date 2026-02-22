import { ANGLE_MAX_DEG, ANGLE_MIN_DEG } from './constants';
import { clamp, clamp01, easeOutQuad, lerp } from './math';
import {
  ANGLE_KEYBOARD_HOLD_MAX_DEG_PER_SEC,
  ANGLE_KEYBOARD_HOLD_START_DEG_PER_SEC,
  ANGLE_KEYBOARD_RAMP_MS,
  ANGLE_KEYBOARD_STEP_DEG,
  ANGLE_POINTER_DEADZONE_PX
} from './tuning';

const directionSign = (direction: 'up' | 'down'): number => (direction === 'up' ? 1 : -1);

export const keyboardAngleDelta = (
  direction: 'up' | 'down',
  stepDeg = ANGLE_KEYBOARD_STEP_DEG
): number => directionSign(direction) * stepDeg;

export const keyboardAngleHoldDelta = (
  direction: 'up' | 'down',
  holdDurationMs: number,
  dtMs: number
): number => {
  const safeDtMs = Math.max(0, dtMs);
  if (safeDtMs <= 0) {
    return 0;
  }
  const safeRampMs = Math.max(1, ANGLE_KEYBOARD_RAMP_MS);
  const rampT = clamp01(Math.max(0, holdDurationMs) / safeRampMs);
  const degPerSec = lerp(
    ANGLE_KEYBOARD_HOLD_START_DEG_PER_SEC,
    ANGLE_KEYBOARD_HOLD_MAX_DEG_PER_SEC,
    easeOutQuad(rampT)
  );
  return directionSign(direction) * degPerSec * (safeDtMs / 1000);
};

export const pointerFromAnchorToAngleDeg = (
  pointerClientX: number,
  pointerClientY: number,
  anchorClientX: number,
  anchorClientY: number,
  deadzonePx = ANGLE_POINTER_DEADZONE_PX
): number => {
  const dx = pointerClientX - anchorClientX;
  const dy = anchorClientY - pointerClientY;
  const distancePx = Math.hypot(dx, dy);
  if (distancePx < deadzonePx) {
    return Number.NaN;
  }
  if (dx === 0) {
    return clamp(dy >= 0 ? ANGLE_MAX_DEG : ANGLE_MIN_DEG, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
  }
  const absDx = Math.max(Math.abs(dx), 1);
  const angleDeg = (Math.atan2(dy, absDx) * 180) / Math.PI;
  return clamp(angleDeg, ANGLE_MIN_DEG, ANGLE_MAX_DEG);
};
