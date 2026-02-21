import { GAMEPLAY_TUNING } from './tuning';

export const BEAT_INTERVAL_MS = GAMEPLAY_TUNING.speedUp.beatIntervalMs;
export const PERFECT_WINDOW_MS = GAMEPLAY_TUNING.speedUp.perfectWindowMs;
export const GOOD_WINDOW_MS = GAMEPLAY_TUNING.speedUp.goodWindowMs;
export const SPAM_THRESHOLD_MS = GAMEPLAY_TUNING.speedUp.spamThresholdMs;
export const SPAM_PENALTY_MS = GAMEPLAY_TUNING.speedUp.spamPenaltyMs;
export const RUNUP_MAX_TAPS = 12;
export const RUNUP_SPEED_DECAY_PER_SECOND = GAMEPLAY_TUNING.movement.runupSpeedDecayPerSecond;
export const RUNUP_PASSIVE_MAX_SPEED = GAMEPLAY_TUNING.speedUp.passiveMaxSpeedNorm;
export const RUNUP_PASSIVE_TO_HALF_MS = GAMEPLAY_TUNING.speedUp.passiveToHalfMs;
export const RUNUP_SPEED_MIN_MS = 1.6;
export const RUNUP_SPEED_MAX_MS = 9.6;
export const RUNUP_START_X_M = GAMEPLAY_TUNING.movement.runupStartXM;
export const THROW_LINE_X_M = 18.2;
export const CHARGE_ZONE_MARGIN_M = 1.4;
export const RUNUP_MAX_X_M = 22.4;

export const RHYTHM_TARGET_PHASE01 = 0.5;

export const ANGLE_MIN_DEG = -90;
export const ANGLE_MAX_DEG = 90;
export const ANGLE_DEFAULT_DEG = 36;
export const ANGLE_CHANGE_STEP_DEG = 1.2;

export const RHYTHM_SPEED_DELTA_PERFECT = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.perfect;
export const RHYTHM_SPEED_DELTA_GOOD = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.good;
export const RHYTHM_SPEED_DELTA_MISS = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.miss;
export const RHYTHM_SPEED_DELTA_IN_PENALTY = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.inPenalty;
export const RHYTHM_SPEED_DELTA_SPAM = GAMEPLAY_TUNING.speedUp.hitSpeedDelta.spam;

export const CHARGE_FORCE_CYCLE_MS = GAMEPLAY_TUNING.throwPhase.chargeForceCycleMs;
export const CHARGE_PERFECT_WINDOW = GAMEPLAY_TUNING.throwPhase.chargePerfectWindow;
export const CHARGE_GOOD_WINDOW = GAMEPLAY_TUNING.throwPhase.chargeGoodWindow;
export const CHARGEAIM_SPEED_DECAY_PER_SECOND = GAMEPLAY_TUNING.movement.chargeAimSpeedDecayPerSecond;
export const CHARGEAIM_STOP_SPEED_NORM = GAMEPLAY_TUNING.movement.chargeAimStopSpeedNorm;

export const THROW_ANIM_DURATION_MS = GAMEPLAY_TUNING.throwPhase.throwAnimDurationMs;
export const THROW_RELEASE_PROGRESS = GAMEPLAY_TUNING.throwPhase.throwReleaseProgress01;
export const RUN_TO_AIM_BLEND_MS = 180; // kept for legacy; v7 uses RUN_TO_DRAWBACK_BLEND_MS
export const RUN_TO_DRAWBACK_BLEND_MS = GAMEPLAY_TUNING.throwPhase.runToDrawbackBlendMs;

export const CAMERA_RUNUP_VIEW_WIDTH_M = 21;
export const CAMERA_THROW_VIEW_WIDTH_M = 19.5;
export const CAMERA_FLIGHT_VIEW_WIDTH_M = 29.5;
export const CAMERA_RESULT_VIEW_WIDTH_M = 29.5;
export const CAMERA_DEFAULT_VIEW_WIDTH_M = 24;

export const CAMERA_RUNUP_TARGET_AHEAD = 0.5;
export const CAMERA_THROW_TARGET_AHEAD = 0.5;
export const CAMERA_FLIGHT_TARGET_AHEAD = 0.5;
export const CAMERA_RESULT_TARGET_AHEAD = 0.5;

export const CAMERA_GROUND_BOTTOM_PADDING = 74;
export const CAMERA_Y_SCALE_RUNUP = 21;
export const CAMERA_Y_SCALE_THROW = 22;
export const CAMERA_Y_SCALE_FLIGHT = 20;
export const CAMERA_Y_SCALE_RESULT = 20;

export const WORLD_METER_RADIUS_PX = 30;
export const WORLD_METER_LINE_WIDTH_PX = 6;
export const WORLD_METER_CURSOR_RADIUS_PX = 5;
export const WORLD_METER_OFFSET_Y_PX = 44;

export const JAVELIN_GRIP_OFFSET_M = 0.12;
export const JAVELIN_GRIP_OFFSET_Y_M = 0.03;
export const JAVELIN_RELEASE_OFFSET_Y_M = 0.06;

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
