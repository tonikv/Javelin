/**
 * Cross-frame render session state initialization.
 * Stores smoothing state, one-shot flags, and render caches.
 */
import { createCameraSmoothingState } from '../camera';
import type { RenderSession } from './types';

export const createRenderSession = (): RenderSession => ({
  camera: createCameraSmoothingState(),
  resultMarker: {
    lastRoundId: -1,
    shownAtMs: 0
  },
  lastRunupTapAtMs: null,
  lastFaultJavelinLanded: false,
  lastPhaseTag: 'idle',
  paletteCache: null,
  backgroundGradientCache: null
});
