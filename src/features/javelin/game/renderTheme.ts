import type { ThemeMode } from '../../../theme/init';

export type RenderPalette = {
  scene: {
    skyTop: string;
    skyMid: string;
    skyBottom: string;
    hazeCenter: string;
    cloudFill: string;
    cloudStroke: string;
    fieldGrass: string;
    runwayLine: string;
    distanceTickMajor: string;
    distanceTickMinor: string;
    distanceLabelFill: string;
    distanceLabelOutline: string;
    throwLineStroke: string;
    throwLineLabelFill: string;
    throwLineLabelOutline: string;
    javelinStroke: string;
    javelinSoilMark: string;
    javelinGroundTrace: string;
    landingValidStroke: string;
    landingFoulStroke: string;
    landingValidFlag: string;
    landingFoulFlag: string;
    landingTextFill: string;
    landingTextOutline: string;
    landingDot: string;
    releaseFlashFill: string;
    releaseFlashOutline: string;
  };
  meter: {
    trackArc: string;
    runupFill: string;
    chargeFill: string;
    zoneGood: string;
    zonePerfect: string;
    cursorPerfect: string;
    cursorGood: string;
    cursorMiss: string;
    cursorStroke: string;
    valueTextFill: string;
    valueTextOutline: string;
  };
  wind: {
    mastStroke: string;
    labelFill: string;
    labelOutline: string;
    headwindFlagFill: string;
    headwindFlagStroke: string;
    tailwindFlagFill: string;
    tailwindFlagStroke: string;
  };
};

const LIGHT_PALETTE: RenderPalette = {
  scene: {
    skyTop: '#dceef8',
    skyMid: '#c8e1ef',
    skyBottom: '#b8d6e3',
    hazeCenter: 'rgba(255, 255, 255, 0.24)',
    cloudFill: '#f8fcff',
    cloudStroke: 'rgba(142, 179, 200, 0.45)',
    fieldGrass: '#88d37f',
    runwayLine: '#ffffff',
    distanceTickMajor: 'rgba(255, 255, 255, 0.85)',
    distanceTickMinor: 'rgba(255, 255, 255, 0.4)',
    distanceLabelFill: '#0b2238',
    distanceLabelOutline: 'rgba(245, 252, 255, 0.92)',
    throwLineStroke: '#ff5d4e',
    throwLineLabelFill: '#a3211a',
    throwLineLabelOutline: 'rgba(246, 252, 255, 0.92)',
    javelinStroke: '#111111',
    javelinSoilMark: 'rgba(80, 50, 20, 0.3)',
    javelinGroundTrace: 'rgba(80, 50, 20, 0.2)',
    landingValidStroke: '#1f9d44',
    landingFoulStroke: '#cf3a2f',
    landingValidFlag: '#22c272',
    landingFoulFlag: '#e0453a',
    landingTextFill: '#ffffff',
    landingTextOutline: 'rgba(8, 35, 56, 0.6)',
    landingDot: 'rgba(15, 40, 60, 0.35)',
    releaseFlashFill: '#0b2238',
    releaseFlashOutline: 'rgba(240, 250, 255, 0.92)',
  },
  meter: {
    trackArc: 'rgba(10, 46, 77, 0.34)',
    runupFill: 'rgba(18, 196, 119, 0.9)',
    chargeFill: 'rgba(246, 210, 85, 0.72)',
    zoneGood: 'rgba(30, 142, 247, 0.82)',
    zonePerfect: 'rgba(18, 196, 119, 0.98)',
    cursorPerfect: '#22c272',
    cursorGood: '#329cf5',
    cursorMiss: '#f6d255',
    cursorStroke: '#0f3b61',
    valueTextFill: 'rgba(6, 32, 57, 0.9)',
    valueTextOutline: 'rgba(235, 246, 255, 0.95)',
  },
  wind: {
    mastStroke: '#0f4165',
    labelFill: '#10314a',
    labelOutline: 'rgba(245, 252, 255, 0.95)',
    headwindFlagFill: '#1f9d44',
    headwindFlagStroke: '#0b6e2d',
    tailwindFlagFill: '#cf3a2f',
    tailwindFlagStroke: '#8e281f',
  },
};

const DARK_PALETTE: RenderPalette = {
  scene: {
    skyTop: '#152430',
    skyMid: '#1c2f40',
    skyBottom: '#23384a',
    hazeCenter: 'rgba(110, 154, 191, 0.18)',
    cloudFill: '#b8cedf',
    cloudStroke: 'rgba(92, 125, 151, 0.55)',
    fieldGrass: '#3c7552',
    runwayLine: '#d9e6ee',
    distanceTickMajor: 'rgba(217, 230, 238, 0.86)',
    distanceTickMinor: 'rgba(196, 214, 227, 0.45)',
    distanceLabelFill: '#d8ecf9',
    distanceLabelOutline: 'rgba(10, 20, 28, 0.88)',
    throwLineStroke: '#ff7a6d',
    throwLineLabelFill: '#ffd6ce',
    throwLineLabelOutline: 'rgba(22, 38, 50, 0.95)',
    javelinStroke: '#eceff3',
    javelinSoilMark: 'rgba(95, 66, 36, 0.45)',
    javelinGroundTrace: 'rgba(130, 93, 54, 0.35)',
    landingValidStroke: '#44d483',
    landingFoulStroke: '#ff6b61',
    landingValidFlag: '#58e398',
    landingFoulFlag: '#ff7d73',
    landingTextFill: '#0f1d2a',
    landingTextOutline: 'rgba(222, 239, 248, 0.68)',
    landingDot: 'rgba(198, 221, 236, 0.45)',
    releaseFlashFill: '#e7f4fc',
    releaseFlashOutline: 'rgba(13, 28, 40, 0.92)',
  },
  meter: {
    trackArc: 'rgba(194, 219, 234, 0.4)',
    runupFill: 'rgba(73, 226, 153, 0.92)',
    chargeFill: 'rgba(247, 216, 106, 0.84)',
    zoneGood: 'rgba(92, 181, 255, 0.9)',
    zonePerfect: 'rgba(72, 224, 146, 1)',
    cursorPerfect: '#59e59a',
    cursorGood: '#79bfff',
    cursorMiss: '#f7db77',
    cursorStroke: '#082338',
    valueTextFill: 'rgba(229, 244, 253, 0.96)',
    valueTextOutline: 'rgba(6, 18, 26, 0.95)',
  },
  wind: {
    mastStroke: '#c8deee',
    labelFill: '#deeffa',
    labelOutline: 'rgba(7, 20, 28, 0.95)',
    headwindFlagFill: '#44d483',
    headwindFlagStroke: '#2aa463',
    tailwindFlagFill: '#ff6b61',
    tailwindFlagStroke: '#d84f47',
  },
};

export const getRenderPalette = (theme: ThemeMode): RenderPalette =>
  theme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;
