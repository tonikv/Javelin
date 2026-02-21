import { useEffect, useRef } from 'react';
import type { GameAction } from '../game/types';

type Dispatch = (action: GameAction) => void;

export const useGameLoop = (dispatch: Dispatch): void => {
  const frameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const loop = (nowMs: number): void => {
      const dtMs = Math.min(nowMs - lastTimeRef.current, 40);
      lastTimeRef.current = nowMs;
      dispatch({ type: 'tick', dtMs, nowMs });
      frameIdRef.current = requestAnimationFrame(loop);
    };

    frameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [dispatch]);
};
