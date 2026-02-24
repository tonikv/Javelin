/**
 * Public API for the game rendering subsystem.
 * Re-exports compositor, session state, and helper selectors used by UI hooks and tests.
 */
export { renderGame } from './renderGame';
export { createRenderSession } from './session';
export type {
  GameAudioCallbacks,
  RenderSession,
  RenderFrameInput,
  ReleaseFlashLabels
} from './types';
export { getVisibleJavelinRenderState, getPlayerAngleAnchorScreen } from './javelinRender';
export { getCameraTargetX } from '../camera';
export { getHeadMeterScreenAnchor } from '../renderMeter';
