import { ANGLE_CHANGE_STEP_DEG } from './constants';

export const keyboardAngleDelta = (direction: 'up' | 'down'): number =>
  direction === 'up' ? ANGLE_CHANGE_STEP_DEG : -ANGLE_CHANGE_STEP_DEG;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const pointerClientYToAngleDeg = (
  clientY: number,
  rectTop: number,
  rectHeight: number
): number => {
  if (rectHeight <= 0) {
    return 0;
  }
  const y01 = clamp((clientY - rectTop) / rectHeight, 0, 1);
  return (1 - y01) * 180 - 90;
};
