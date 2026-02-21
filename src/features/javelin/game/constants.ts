import type { MeterWindow } from './types';

export const BEAT_INTERVAL_MS = 880;
export const PERFECT_WINDOW_MS = 90;
export const GOOD_WINDOW_MS = 180;
export const SPAM_THRESHOLD_MS = 160;
export const SPAM_PENALTY_MS = 320;
export const RUNUP_MAX_TAPS = 12;
export const RUNUP_SPEED_DECAY_PER_SECOND = 0.018;
export const RUNUP_PASSIVE_MAX_SPEED = 0.5;
export const RUNUP_PASSIVE_TO_HALF_MS = 4200;
export const RUNUP_SPEED_MIN_MS = 1.6;
export const RUNUP_SPEED_MAX_MS = 9.6;
export const RUNUP_START_X_M = 2.8;
export const THROW_LINE_X_M = 18.2;
export const CHARGE_ZONE_MARGIN_M = 1.4;
export const RUNUP_MAX_X_M = 22.4;

export const RHYTHM_TARGET_PHASE01 = 0.5;

export const ANGLE_MIN_DEG = 18;
export const ANGLE_MAX_DEG = 52;
export const ANGLE_DEFAULT_DEG = 36;
export const ANGLE_CHANGE_STEP_DEG = 1.2;
export const ANGLE_MOUSE_SENSITIVITY = 0.1;

export const CHARGE_FORCE_CYCLE_MS = 860;
export const CHARGE_PERFECT_WINDOW: MeterWindow = { start: 0.47, end: 0.53 };
export const CHARGE_GOOD_WINDOW: MeterWindow = { start: 0.4, end: 0.6 };

export const THROW_ANIM_DURATION_MS = 860;
export const THROW_RELEASE_PROGRESS = 0.6;
export const RUN_TO_AIM_BLEND_MS = 180;

export const CAMERA_RUNUP_VIEW_WIDTH_M = 21;
export const CAMERA_THROW_VIEW_WIDTH_M = 19.5;
export const CAMERA_FLIGHT_VIEW_WIDTH_M = 29.5;
export const CAMERA_RESULT_VIEW_WIDTH_M = 24.5;
export const CAMERA_DEFAULT_VIEW_WIDTH_M = 24;

export const CAMERA_RUNUP_TARGET_AHEAD = 0.36;
export const CAMERA_THROW_TARGET_AHEAD = 0.34;
export const CAMERA_FLIGHT_TARGET_AHEAD = 0.48;
export const CAMERA_RESULT_TARGET_AHEAD = 0.38;

export const CAMERA_GROUND_BOTTOM_PADDING = 74;
export const CAMERA_Y_SCALE_RUNUP = 21;
export const CAMERA_Y_SCALE_THROW = 22;
export const CAMERA_Y_SCALE_FLIGHT = 20;
export const CAMERA_Y_SCALE_RESULT = 20.5;

export const WORLD_METER_RADIUS_PX = 30;
export const WORLD_METER_LINE_WIDTH_PX = 6;
export const WORLD_METER_CURSOR_RADIUS_PX = 5;
export const WORLD_METER_OFFSET_Y_PX = 18;

export const LAUNCH_SPEED_MIN_MS = 9;
export const LAUNCH_SPEED_MAX_MS = 44;
export const LAUNCH_POWER_EXP = 1.42;

export const DRAG_COEFFICIENT = 0.00835;
export const LIFT_COEFFICIENT = 0.00024;
export const AOA_MAX_RAD = 0.75;
export const MAX_LINEAR_ACCEL = 42;
export const MAX_ANGULAR_VEL_RAD = 8;
export const MAX_ANGULAR_ACC_RAD = 80;
export const ALIGN_TORQUE_BASE = 7.9;
export const ALIGN_TORQUE_SPEED_FACTOR = 16;
export const ANGULAR_DAMPING = 7.2;
export const AERO_NOSE_DOWN_BIAS_RAD = 0.04;
export const JAVELIN_LENGTH_M = 2.6;

export const WIND_MIN_MS = -2.5;
export const WIND_MAX_MS = 2.5;
export const FIELD_MAX_DISTANCE_M = 132;

export const MAX_HIGHSCORES = 10;
export const HIGHSCORE_STORAGE_KEY = 'sg2026-javelin-highscores-v1';
