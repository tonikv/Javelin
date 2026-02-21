import { ANGLE_CHANGE_STEP_DEG } from './constants';
import { clamp } from './math';

export const keyboardAngleDelta = (direction: 'up' | 'down'): number =>
  direction === 'up' ? ANGLE_CHANGE_STEP_DEG : -ANGLE_CHANGE_STEP_DEG;

export const pointerFromAnchorToAngleDeg = (
  pointerClientX: number,
  pointerClientY: number,
  anchorClientX: number,
  anchorClientY: number
): number => {
  const dx = Math.abs(pointerClientX - anchorClientX);
  const dy = anchorClientY - pointerClientY;
  if (dx === 0) {
    return dy >= 0 ? 90 : -90;
  }
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  return clamp(angleDeg, -90, 90);
};
