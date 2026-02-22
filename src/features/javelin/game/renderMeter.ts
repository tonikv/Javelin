import {
  WORLD_METER_CURSOR_RADIUS_PX,
  WORLD_METER_LINE_WIDTH_PX,
  WORLD_METER_OFFSET_Y_PX,
  WORLD_METER_RADIUS_PX
} from './constants';
import { clamp01, wrap01 } from './math';
import { getForcePreviewPercent, getRunupMeterPhase01, getSpeedPercent } from './selectors';
import { CHARGE_GOOD_WINDOW, CHARGE_PERFECT_WINDOW } from './tuning';
import type { HeadAnchor } from './renderAthlete';
import type { GameState, TimingQuality } from './types';

type MeterZones = {
  perfect: { start: number; end: number };
  good: { start: number; end: number };
};

type WorldMeterState = {
  phase01: number;
  zones: MeterZones | null;
  feedback: TimingQuality | null;
  valuePercent: number;
};

const normalizeUiScale = (uiScale: number): number => Math.max(0.9, Math.min(1.3, uiScale));

const normalizeMeterPhase01 = (phase01: number): number => {
  if (phase01 <= 0) {
    return 0;
  }
  if (phase01 >= 1) {
    return 1;
  }
  return wrap01(phase01);
};

const phaseToSemicircleAngle = (phase01: number): number => Math.PI + clamp01(phase01) * Math.PI;

const drawSemicircleArc = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  start01: number,
  end01: number,
  color: string,
  lineWidth: number
): void => {
  const drawSegment = (start: number, end: number): void => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, phaseToSemicircleAngle(start), phaseToSemicircleAngle(end), false);
    ctx.stroke();
  };

  if (Math.abs(end01 - start01) >= 1) {
    drawSegment(0, 1);
    return;
  }

  const start = wrap01(start01);
  const end = wrap01(end01);
  if (start <= end) {
    drawSegment(start, end);
    return;
  }
  drawSegment(start, 1);
  drawSegment(0, end);
};

export const getHeadMeterScreenAnchor = (headScreen: HeadAnchor): HeadAnchor => ({
  x: headScreen.x,
  y: headScreen.y - WORLD_METER_OFFSET_Y_PX
});

const getWorldMeterState = (state: GameState): WorldMeterState | null => {
  if (state.phase.tag === 'runup') {
    const meterPhase = getRunupMeterPhase01(state);
    if (meterPhase === null) {
      return null;
    }
    return {
      phase01: meterPhase,
      zones: null,
      feedback: null,
      valuePercent: getSpeedPercent(state)
    };
  }

  if (state.phase.tag === 'chargeAim') {
    return {
      phase01: state.phase.chargeMeter.phase01,
      zones: {
        perfect: CHARGE_PERFECT_WINDOW,
        good: CHARGE_GOOD_WINDOW
      },
      feedback: state.phase.chargeMeter.lastQuality,
      valuePercent: getForcePreviewPercent(state) ?? Math.round(state.phase.forceNormPreview * 100)
    };
  }

  if (state.phase.tag === 'throwAnim') {
    return {
      phase01: state.phase.forceNorm,
      zones: {
        perfect: CHARGE_PERFECT_WINDOW,
        good: CHARGE_GOOD_WINDOW
      },
      feedback: state.phase.releaseQuality,
      valuePercent: getForcePreviewPercent(state) ?? Math.round(state.phase.forceNorm * 100)
    };
  }

  return null;
};

export const drawWorldTimingMeter = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  headScreen: HeadAnchor,
  uiScale = 1
): void => {
  const meterState = getWorldMeterState(state);
  if (meterState === null) {
    return;
  }

  const visualScale = normalizeUiScale(uiScale);
  const meterRadius = WORLD_METER_RADIUS_PX * visualScale;
  const meterLineWidth = WORLD_METER_LINE_WIDTH_PX * visualScale;
  const meterCursorRadius = WORLD_METER_CURSOR_RADIUS_PX * visualScale;
  const anchor = getHeadMeterScreenAnchor(headScreen);
  anchor.y -= (visualScale - 1) * 8;
  if (!Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = 0.96;

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    meterRadius,
    0,
    1,
    'rgba(10, 46, 77, 0.34)',
    meterLineWidth
  );

  drawSemicircleArc(
    ctx,
    anchor.x,
    anchor.y,
    meterRadius,
    0,
    meterState.phase01,
    meterState.zones === null ? 'rgba(18, 196, 119, 0.9)' : 'rgba(246, 210, 85, 0.72)',
    meterLineWidth
  );

  if (meterState.zones !== null) {
    drawSemicircleArc(
      ctx,
      anchor.x,
      anchor.y,
      meterRadius,
      meterState.zones.good.start,
      meterState.zones.good.end,
      'rgba(30, 142, 247, 0.82)',
      meterLineWidth
    );

    drawSemicircleArc(
      ctx,
      anchor.x,
      anchor.y,
      meterRadius,
      meterState.zones.perfect.start,
      meterState.zones.perfect.end,
      'rgba(18, 196, 119, 0.98)',
      meterLineWidth + 0.8 * visualScale
    );
  }

  const cursorAngle = phaseToSemicircleAngle(normalizeMeterPhase01(meterState.phase01));
  const cursorX = anchor.x + Math.cos(cursorAngle) * meterRadius;
  const cursorY = anchor.y + Math.sin(cursorAngle) * meterRadius;

  const cursorFill =
    meterState.zones === null
      ? '#22c272'
      : meterState.feedback === 'perfect'
        ? '#22c272'
        : meterState.feedback === 'good'
          ? '#329cf5'
          : '#f6d255';

  ctx.fillStyle = cursorFill;
  ctx.strokeStyle = '#0f3b61';
  ctx.lineWidth = Math.max(2, 2 * visualScale);
  ctx.beginPath();
  ctx.arc(cursorX, cursorY, meterCursorRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const valueLabel = `${meterState.valuePercent}%`;
  ctx.font = `700 ${Math.round(11 * visualScale)}px ui-sans-serif`;
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'rgba(235, 246, 255, 0.95)';
  ctx.lineWidth = Math.max(2, 1.7 * visualScale);
  ctx.strokeText(valueLabel, anchor.x, anchor.y + 16 * visualScale);
  ctx.fillStyle = 'rgba(6, 32, 57, 0.9)';
  ctx.fillText(valueLabel, anchor.x, anchor.y + 16 * visualScale);

  ctx.restore();
};
