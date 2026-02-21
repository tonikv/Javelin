import type { MeterWindow } from './types';

export const BEAT_INTERVAL_MS = 450;
export const PERFECT_WINDOW_MS = 30;
export const GOOD_WINDOW_MS = 70;
export const SPAM_THRESHOLD_MS = 120;
export const SPAM_PENALTY_MS = 220;
export const RUNUP_MAX_TAPS = 12;
export const RUNUP_MIN_TAPS_FOR_THROW = 3;
export const RUNUP_SPEED_DECAY_PER_SECOND = 0.03;

export const RHYTHM_TARGET_PHASE01 = 0.5;

export const ANGLE_MIN_DEG = 18;
export const ANGLE_MAX_DEG = 52;
export const ANGLE_DEFAULT_DEG = 36;
export const ANGLE_CHANGE_STEP_DEG = 1.2;
export const ANGLE_MOUSE_SENSITIVITY = 0.1;

export const CHARGE_FORCE_CYCLE_MS = 860;
export const CHARGE_PERFECT_WINDOW: MeterWindow = { start: 0.47, end: 0.53 };
export const CHARGE_GOOD_WINDOW: MeterWindow = { start: 0.4, end: 0.6 };

export const THROW_ANIM_DURATION_MS = 620;
export const THROW_RELEASE_PROGRESS = 0.35;

export const LAUNCH_SPEED_MIN_MS = 11;
export const LAUNCH_SPEED_MAX_MS = 40;
export const LAUNCH_POWER_EXP = 1.2;

export const DRAG_COEFFICIENT = 0.0098;
export const WIND_VELOCITY_COUPLING = 0.65;
export const WIND_ACCEL_FACTOR = 0.11;

export const WIND_MIN_MS = -2.5;
export const WIND_MAX_MS = 2.5;
export const FIELD_MAX_DISTANCE_M = 98;

export const MAX_HIGHSCORES = 10;
export const HIGHSCORE_STORAGE_KEY = 'sg2026-javelin-highscores-v1';
