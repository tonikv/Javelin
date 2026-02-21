import { ANGLE_CHANGE_STEP_DEG, ANGLE_MOUSE_SENSITIVITY } from './constants';

export const pointerMovementToAngleDelta = (movementY: number): number =>
  -movementY * ANGLE_MOUSE_SENSITIVITY;

export const keyboardAngleDelta = (direction: 'up' | 'down'): number =>
  direction === 'up' ? ANGLE_CHANGE_STEP_DEG : -ANGLE_CHANGE_STEP_DEG;
