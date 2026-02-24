/**
 * Shared types for the game rendering pipeline.
 * All rendering sub-modules import their shared types from here.
 */
import type { CameraSmoothingState } from '../camera';
import type { RenderPalette } from '../renderTheme';
import type { GameState, TimingQuality } from '../types';
import type { ThemeMode } from '../../../../theme/init';

export type CloudLayer = {
  yFraction: number;
  parallaxFactor: number;
  clouds: Array<{
    offsetXM: number;
    widthPx: number;
    heightPx: number;
    opacity: number;
  }>;
};

export const CLOUD_LAYERS: CloudLayer[] = [
  {
    yFraction: 0.12,
    parallaxFactor: 0.05,
    clouds: [
      { offsetXM: 0, widthPx: 120, heightPx: 18, opacity: 0.28 },
      { offsetXM: 35, widthPx: 90, heightPx: 14, opacity: 0.24 },
      { offsetXM: 72, widthPx: 140, heightPx: 20, opacity: 0.26 },
      { offsetXM: 120, widthPx: 100, heightPx: 16, opacity: 0.22 }
    ]
  },
  {
    yFraction: 0.28,
    parallaxFactor: 0.15,
    clouds: [
      { offsetXM: 10, widthPx: 80, heightPx: 28, opacity: 0.32 },
      { offsetXM: 50, widthPx: 110, heightPx: 34, opacity: 0.3 },
      { offsetXM: 95, widthPx: 70, heightPx: 24, opacity: 0.28 }
    ]
  },
  {
    yFraction: 0.18,
    parallaxFactor: 0.3,
    clouds: [
      { offsetXM: 20, widthPx: 100, heightPx: 38, opacity: 0.34 },
      { offsetXM: 80, widthPx: 130, heightPx: 42, opacity: 0.31 }
    ]
  }
];

export type ResultMarkerFadeState = {
  lastRoundId: number;
  shownAtMs: number;
};

export type PaletteCacheState = {
  theme: ThemeMode;
  palette: RenderPalette;
} | null;

export type BackgroundGradientCacheState = {
  width: number;
  height: number;
  theme: ThemeMode;
  sky: CanvasGradient;
  haze: CanvasGradient;
} | null;

export type RenderSession = {
  camera: CameraSmoothingState;
  resultMarker: ResultMarkerFadeState;
  lastRunupTapAtMs: number | null;
  lastFaultJavelinLanded: boolean;
  lastPhaseTag: GameState['phase']['tag'];
  paletteCache: PaletteCacheState;
  backgroundGradientCache: BackgroundGradientCacheState;
};

export type ReleaseFlashLabels = Record<TimingQuality, string> & {
  foulLine: string;
};

export type OverlayHints = {
  onboarding: string;
  headwind: string;
  tailwind: string;
};

/**
 * Optional audio callbacks raised by the render pipeline.
 * Rendering detects event boundaries and delegates side-effects to these hooks.
 */
export type GameAudioCallbacks = {
  onRunupTap?: (tapGainNorm: number) => void;
  onChargeStart?: () => void;
  onThrowRelease?: (speedNorm: number, quality: TimingQuality) => void;
  onFlightWindUpdate?: (intensity: number) => void;
  onFlightWindStop?: () => void;
  onLandingImpact?: (tipFirst: boolean) => void;
  onCrowdReaction?: (reaction: 'cheer' | 'groan') => void;
  onFault?: () => void;
};

/** All inputs needed to render a single game frame. */
export type RenderFrameInput = {
  ctx: CanvasRenderingContext2D;
  state: GameState;
  width: number;
  height: number;
  dtMs: number;
  numberFormat: Intl.NumberFormat;
  labels: {
    throwLine: string;
    releaseFlash: ReleaseFlashLabels;
    onboarding: string;
    headwind: string;
    tailwind: string;
  };
  theme: ThemeMode;
  prefersReducedMotion: boolean;
  session: RenderSession;
  audio?: GameAudioCallbacks;
};
