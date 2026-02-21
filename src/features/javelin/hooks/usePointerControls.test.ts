import { afterEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameState } from '../game/types';
import {
  createTouchLongPressHandlers,
  isInteractiveEventTarget,
  shouldHandleAngleAdjustKeyDown,
  shouldReleaseChargeFromEnterKeyUp
} from './usePointerControls';

const inputTarget = (): EventTarget => ({
  tagName: 'INPUT',
  isContentEditable: false,
  closest: () => null
}) as unknown as EventTarget;

const selectTarget = (): EventTarget => ({
  tagName: 'SELECT',
  isContentEditable: false,
  closest: () => null
}) as unknown as EventTarget;

const plainTarget = (): EventTarget => ({
  tagName: 'DIV',
  isContentEditable: false,
  closest: () => null
}) as unknown as EventTarget;

const contentEditableTarget = (): EventTarget => ({
  tagName: 'DIV',
  isContentEditable: true,
  closest: () => null
}) as unknown as EventTarget;

const dispatchSpy = () => vi.fn<(action: GameAction) => void>();

afterEach(() => {
  vi.useRealTimers();
});

describe('usePointerControls key guards', () => {
  it('treats form controls as interactive targets', () => {
    expect(isInteractiveEventTarget(inputTarget())).toBe(true);
    expect(isInteractiveEventTarget(selectTarget())).toBe(true);
    expect(isInteractiveEventTarget(contentEditableTarget())).toBe(true);
    expect(isInteractiveEventTarget(plainTarget())).toBe(false);
  });

  it('does not handle Enter release from interactive targets', () => {
    expect(shouldReleaseChargeFromEnterKeyUp('Enter', 'chargeAim', inputTarget())).toBe(false);
  });

  it('releases charge on Enter keyup during chargeAim for gameplay target', () => {
    expect(shouldReleaseChargeFromEnterKeyUp('Enter', 'chargeAim', plainTarget())).toBe(true);
  });

  it('does not release charge outside chargeAim phase', () => {
    expect(shouldReleaseChargeFromEnterKeyUp('Enter', 'runup', plainTarget())).toBe(false);
    expect(shouldReleaseChargeFromEnterKeyUp('Enter', 'idle', plainTarget())).toBe(false);
  });

  it('does not adjust angle from arrow keys inside interactive controls', () => {
    expect(shouldHandleAngleAdjustKeyDown('ArrowUp', 'runup', inputTarget())).toBe(false);
    expect(shouldHandleAngleAdjustKeyDown('ArrowDown', 'chargeAim', selectTarget())).toBe(false);
  });
});

describe('usePointerControls touch long press', () => {
  it('starts charge after long press during runup', () => {
    vi.useFakeTimers();
    let phaseTag: GameState['phase']['tag'] = 'runup';
    let nowMs = 1000;
    const dispatch = dispatchSpy();
    const handlers = createTouchLongPressHandlers({
      dispatch,
      getPhaseTag: () => phaseTag,
      now: () => nowMs
    });

    handlers.onTouchStart();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'rhythmTap', atMs: 1000 });

    nowMs = 1305;
    vi.advanceTimersByTime(305);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'beginChargeAim', atMs: 1305 });
  });

  it('does not start charge if phase is no longer runup when timer fires', () => {
    vi.useFakeTimers();
    let phaseTag: GameState['phase']['tag'] = 'runup';
    const dispatch = dispatchSpy();
    const handlers = createTouchLongPressHandlers({
      dispatch,
      getPhaseTag: () => phaseTag,
      now: () => 1000
    });

    handlers.onTouchStart();
    phaseTag = 'chargeAim';
    vi.advanceTimersByTime(350);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'rhythmTap', atMs: 1000 });
  });

  it('releases charge on touch end when currently charging', () => {
    let phaseTag: GameState['phase']['tag'] = 'chargeAim';
    const dispatch = dispatchSpy();
    const handlers = createTouchLongPressHandlers({
      dispatch,
      getPhaseTag: () => phaseTag,
      now: () => 2222
    });

    handlers.onTouchEnd();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'releaseCharge', atMs: 2222 });

    phaseTag = 'runup';
    handlers.onTouchEnd();
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
