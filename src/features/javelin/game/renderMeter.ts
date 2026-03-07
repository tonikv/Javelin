import {
  CANVAS_FONT_STACK,
  WORLD_METER_CURSOR_RADIUS_PX,
  WORLD_METER_LINE_WIDTH_PX,
  WORLD_METER_OFFSET_Y_PX,
  WORLD_METER_RADIUS_PX
} from './constants';
import { centeredWindow } from './chargeMeter';
import { clamp01, wrap01 } from './math';
import { getForcePreviewPercent, getSpeedPercent, getRunupMeterPhase01 } from './selectors';
import { getRenderPalette } from './renderTheme';
import { getDifficultyGameplayTuning, type RunupRhythmTuning } from './tuning';
import type { HeadAnchor } from './renderAthlete';
import type { ChargeMeterSnapshot, GameState, MeterWindow, TimingQuality } from './types';
import type { ThemeMode } from '../../../theme/init';

type MeterZones = {
  perfect: MeterWindow;
  good: MeterWindow;
};

type ArcMeterState = {
  kind: 'arc';
  phase01: number;
  zones: MeterZones | null;
  feedback: TimingQuality | null;
  valueLabel: string;
};

type CenterLaneMeterState = {
  kind: 'centerLane';
  cursor01: number;
  zones: MeterZones;
  feedback: TimingQuality | null;
  valueLabel: string;
};

type RhythmLaneMeterState = {
  kind: 'rhythmLane';
  marker01: number | null;
  zones: MeterZones;
  feedback: TimingQuality | null;
  targetLabel: string;
  valueLabel: string;
  stability01: number;
};

type WorldMeterState = ArcMeterState | CenterLaneMeterState | RhythmLaneMeterState;

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

const getRhythmVisualHalfRangeRatio = (tuning: RunupRhythmTuning): number =>
  clamp01(
    Math.max(
      0.4,
      Math.min(1, Math.max(tuning.goodToleranceRatio * 2.75, tuning.goodToleranceRatio + 0.08))
    )
  );

const getRhythmMarker01 = (offsetRatio: number, visualHalfRangeRatio: number): number =>
  clamp01(0.5 + (offsetRatio / Math.max(0.0001, visualHalfRangeRatio)) * 0.5);

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

const getFeedbackColor = (
  feedback: TimingQuality | null,
  palette: ReturnType<typeof getRenderPalette>
): string => {
  if (feedback === 'perfect') {
    return palette.meter.cursorPerfect;
  }
  if (feedback === 'good') {
    return palette.meter.cursorGood;
  }
  return palette.meter.cursorMiss;
};

export const getHeadMeterScreenAnchor = (headScreen: HeadAnchor): HeadAnchor => ({
  x: headScreen.x,
  y: headScreen.y - WORLD_METER_OFFSET_Y_PX
});

const getChargeMeterZones = (meter: ChargeMeterSnapshot): MeterZones => ({
  perfect: meter.perfectWindow,
  good: meter.goodWindow
});

const getRhythmLaneState = (state: GameState): RhythmLaneMeterState | null => {
  if (
    state.phase.tag !== 'runup' ||
    state.phase.meterMode !== 'rhythmLane' ||
    !state.phase.runupRhythm
  ) {
    return null;
  }
  const tuning = getDifficultyGameplayTuning(
    state.difficulty,
    state.devTuningOverrides
  ).runupRhythm;
  if (!tuning) {
    return null;
  }

  const lastOffsetMs = state.phase.runupRhythm.lastOffsetMs;
  const targetForLastTapMs =
    state.phase.runupRhythm.lastIntervalMs !== null && lastOffsetMs !== null
      ? Math.max(1, state.phase.runupRhythm.lastIntervalMs - lastOffsetMs)
      : state.phase.runupRhythm.targetIntervalMs;
  const offsetRatio = lastOffsetMs === null ? null : lastOffsetMs / targetForLastTapMs;
  const visualHalfRangeRatio = getRhythmVisualHalfRangeRatio(tuning);

  return {
    kind: 'rhythmLane',
    marker01: offsetRatio === null ? null : getRhythmMarker01(offsetRatio, visualHalfRangeRatio),
    zones: {
      perfect: centeredWindow(0.5, tuning.perfectToleranceRatio / visualHalfRangeRatio),
      good: centeredWindow(0.5, tuning.goodToleranceRatio / visualHalfRangeRatio)
    },
    feedback: state.phase.runupRhythm.lastQuality,
    targetLabel: `${Math.round(state.phase.runupRhythm.targetIntervalMs)} ms`,
    valueLabel: `${getSpeedPercent(state)}%`,
    stability01: state.phase.runupRhythm.stability01
  };
};

const getWorldMeterState = (state: GameState): WorldMeterState | null => {
  const rhythmLane = getRhythmLaneState(state);
  if (rhythmLane) {
    return rhythmLane;
  }

  if (state.phase.tag === 'runup') {
    const meterPhase = getRunupMeterPhase01(state);
    if (meterPhase === null) {
      return null;
    }
    return {
      kind: 'arc',
      phase01: meterPhase,
      zones: null,
      feedback: null,
      valueLabel: `${getSpeedPercent(state)}%`
    };
  }

  if (state.phase.tag === 'chargeAim') {
    if (state.phase.chargeMeter.mode === 'centerSweep') {
      return {
        kind: 'centerLane',
        cursor01: state.phase.chargeMeter.phase01,
        zones: getChargeMeterZones(state.phase.chargeMeter),
        feedback: state.phase.chargeMeter.lastQuality,
        valueLabel: `${getForcePreviewPercent(state) ?? Math.round(state.phase.forceNormPreview * 100)}%`
      };
    }
    return {
      kind: 'arc',
      phase01: state.phase.chargeMeter.phase01,
      zones: getChargeMeterZones(state.phase.chargeMeter),
      feedback: state.phase.chargeMeter.lastQuality,
      valueLabel: `${getForcePreviewPercent(state) ?? Math.round(state.phase.forceNormPreview * 100)}%`
    };
  }

  if (state.phase.tag === 'throwAnim') {
    if (state.phase.releaseMeter.mode === 'centerSweep') {
      return {
        kind: 'centerLane',
        cursor01: state.phase.releaseMeter.phase01,
        zones: getChargeMeterZones(state.phase.releaseMeter),
        feedback: state.phase.releaseQuality,
        valueLabel: `${getForcePreviewPercent(state) ?? Math.round(state.phase.forceNorm * 100)}%`
      };
    }
    return {
      kind: 'arc',
      phase01: state.phase.releaseMeter.phase01,
      zones: getChargeMeterZones(state.phase.releaseMeter),
      feedback: state.phase.releaseQuality,
      valueLabel: `${getForcePreviewPercent(state) ?? Math.round(state.phase.forceNorm * 100)}%`
    };
  }

  return null;
};

const drawValueLabel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  fontPx: number,
  palette: ReturnType<typeof getRenderPalette>,
  visualScale: number
): void => {
  ctx.font = `700 ${Math.round(fontPx)}px ${CANVAS_FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.strokeStyle = palette.meter.valueTextOutline;
  ctx.lineWidth = Math.max(2, 1.7 * visualScale);
  ctx.strokeText(text, x, y);
  ctx.fillStyle = palette.meter.valueTextFill;
  ctx.fillText(text, x, y);
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void => {
  if (width <= 0 || height <= 0) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawLaneWindow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  window: MeterWindow,
  color: string
): void => {
  const startX = x + width * clamp01(window.start);
  const endX = x + width * clamp01(window.end);
  ctx.fillStyle = color;
  ctx.fillRect(startX, y, Math.max(2, endX - startX), height);
};

const drawLaneBoundaryTick = (
  ctx: CanvasRenderingContext2D,
  x: number,
  top: number,
  bottom: number,
  color: string,
  lineWidth: number
): void => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, bottom);
  ctx.stroke();
};

const drawArcCursor = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  phase01: number,
  cursorRadius: number,
  fillStyle: string,
  strokeStyle: string,
  lineWidth: number,
  glowColor?: string
): void => {
  const cursorAngle = phaseToSemicircleAngle(normalizeMeterPhase01(phase01));
  const cursorX = cx + Math.cos(cursorAngle) * radius;
  const cursorY = cy + Math.sin(cursorAngle) * radius;

  if (glowColor) {
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = cursorRadius * 2.6;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, cursorRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(cursorX, cursorY, cursorRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

const drawArcMeter = (
  ctx: CanvasRenderingContext2D,
  {
    anchor,
    radius,
    lineWidth,
    phase01,
    zones,
    feedback,
    fillColor,
    cursorColor,
    cursorRadius,
    palette,
    visualScale,
    cursorGlowColor
  }: {
    anchor: HeadAnchor;
    radius: number;
    lineWidth: number;
    phase01: number;
    zones: MeterZones | null;
    feedback: TimingQuality | null;
    fillColor: string;
    cursorColor: string;
    cursorRadius: number;
    palette: ReturnType<typeof getRenderPalette>;
    visualScale: number;
    cursorGlowColor?: string;
  }
): void => {
  const effectiveCursorGlowColor =
    cursorGlowColor ?? (feedback === 'perfect' ? palette.meter.centerGlow : undefined);
  drawSemicircleArc(ctx, anchor.x, anchor.y, radius, 0, 1, palette.meter.trackArc, lineWidth);
  drawSemicircleArc(ctx, anchor.x, anchor.y, radius, 0, phase01, fillColor, lineWidth);

  if (zones !== null) {
    drawSemicircleArc(
      ctx,
      anchor.x,
      anchor.y,
      radius,
      zones.good.start,
      zones.good.end,
      palette.meter.zoneGood,
      lineWidth
    );
    drawSemicircleArc(
      ctx,
      anchor.x,
      anchor.y,
      radius,
      zones.perfect.start,
      zones.perfect.end,
      palette.meter.zonePerfect,
      lineWidth + 0.8 * visualScale
    );
  }

  drawArcCursor(
    ctx,
    anchor.x,
    anchor.y,
    radius,
    phase01,
    cursorRadius,
    cursorColor,
    palette.meter.cursorStroke,
    Math.max(2, 2 * visualScale),
    effectiveCursorGlowColor
  );
};

type LaneMeterDrawOptions = {
  showValueLabel?: boolean;
};

const drawLaneMeter = (
  ctx: CanvasRenderingContext2D,
  meterState: CenterLaneMeterState | RhythmLaneMeterState,
  anchor: HeadAnchor,
  visualScale: number,
  palette: ReturnType<typeof getRenderPalette>,
  options: LaneMeterDrawOptions = {}
): void => {
  const laneWidth = WORLD_METER_RADIUS_PX * visualScale * 2.8;
  const laneHeight = 11 * visualScale;
  const laneX = anchor.x - laneWidth * 0.5;
  const laneY = anchor.y - laneHeight * 0.5;
  const laneRadius = 6 * visualScale;

  drawRoundedRect(ctx, laneX, laneY, laneWidth, laneHeight, laneRadius);
  ctx.fillStyle = palette.meter.trackArc;
  ctx.fill();

  drawLaneWindow(
    ctx,
    laneX,
    laneY,
    laneWidth,
    laneHeight,
    meterState.zones.good,
    palette.meter.zoneGood
  );
  drawLaneWindow(
    ctx,
    laneX,
    laneY,
    laneWidth,
    laneHeight,
    meterState.zones.perfect,
    palette.meter.zonePerfect
  );

  const centerLineTop = laneY - 3 * visualScale;
  const centerLineBottom = laneY + laneHeight + 3 * visualScale;
  if (meterState.kind === 'centerLane' && meterState.feedback === 'perfect') {
    drawLaneBoundaryTick(
      ctx,
      anchor.x,
      centerLineTop,
      centerLineBottom,
      palette.meter.centerGlow,
      Math.max(4, 4.2 * visualScale)
    );
  }
  drawLaneBoundaryTick(
    ctx,
    anchor.x,
    centerLineTop,
    centerLineBottom,
    palette.meter.cursorStroke,
    meterState.kind === 'centerLane'
      ? Math.max(2.2, 2.4 * visualScale)
      : Math.max(1.5, 1.5 * visualScale)
  );

  if (meterState.kind === 'centerLane') {
    const tickTop = laneY - 2 * visualScale;
    const tickBottom = laneY + laneHeight + 2 * visualScale;
    for (const [position01, color, lineWidth] of [
      [meterState.zones.good.start, palette.meter.zoneGood, Math.max(1.3, 1.3 * visualScale)],
      [meterState.zones.good.end, palette.meter.zoneGood, Math.max(1.3, 1.3 * visualScale)],
      [meterState.zones.perfect.start, palette.meter.zonePerfect, Math.max(2, 1.8 * visualScale)],
      [meterState.zones.perfect.end, palette.meter.zonePerfect, Math.max(2, 1.8 * visualScale)]
    ] as const) {
      drawLaneBoundaryTick(
        ctx,
        laneX + laneWidth * clamp01(position01),
        tickTop,
        tickBottom,
        color,
        lineWidth
      );
    }

    const cursorX = laneX + laneWidth * clamp01(meterState.cursor01);
    const cursorY = laneY + laneHeight * 0.5;
    if (meterState.feedback === 'perfect') {
      ctx.save();
      ctx.shadowColor = palette.meter.centerGlow;
      ctx.shadowBlur = 9 * visualScale;
      ctx.fillStyle = palette.meter.centerGlow;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, WORLD_METER_CURSOR_RADIUS_PX * visualScale * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = getFeedbackColor(meterState.feedback, palette);
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, WORLD_METER_CURSOR_RADIUS_PX * visualScale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.meter.cursorStroke;
    ctx.stroke();
  } else {
    if (meterState.marker01 !== null) {
      const markerX = laneX + laneWidth * clamp01(meterState.marker01);
      ctx.strokeStyle = getFeedbackColor(meterState.feedback, palette);
      ctx.lineWidth = Math.max(3, 3 * visualScale);
      ctx.beginPath();
      ctx.moveTo(markerX, laneY - 4 * visualScale);
      ctx.lineTo(markerX, laneY + laneHeight + 4 * visualScale);
      ctx.stroke();
    }

    const stabilityHeight = Math.max(2, 3 * visualScale);
    const stabilityY = laneY + laneHeight + 6 * visualScale;
    drawRoundedRect(ctx, laneX, stabilityY, laneWidth, stabilityHeight, stabilityHeight * 0.5);
    ctx.fillStyle = palette.meter.trackArc;
    ctx.fill();
    drawRoundedRect(
      ctx,
      laneX,
      stabilityY,
      laneWidth * clamp01(meterState.stability01),
      stabilityHeight,
      stabilityHeight * 0.5
    );
    ctx.fillStyle = palette.meter.runupFill;
    ctx.fill();

    drawValueLabel(
      ctx,
      anchor.x,
      laneY - 7 * visualScale,
      meterState.targetLabel,
      9.5 * visualScale,
      palette,
      visualScale
    );
  }

  if ((options.showValueLabel ?? true) && meterState.valueLabel.trim().length > 0) {
    drawValueLabel(
      ctx,
      anchor.x,
      laneY + laneHeight + (meterState.kind === 'rhythmLane' ? 18 : 14) * visualScale,
      meterState.valueLabel,
      11 * visualScale,
      palette,
      visualScale
    );
  }
};

export const drawWorldTimingMeter = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  headScreen: HeadAnchor,
  uiScale = 1,
  theme: ThemeMode = 'light'
): void => {
  const meterState = getWorldMeterState(state);
  if (meterState === null) {
    return;
  }
  const palette = getRenderPalette(theme);

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

  if (meterState.kind !== 'arc') {
    drawLaneMeter(ctx, meterState, anchor, visualScale, palette);
    ctx.restore();
    return;
  }

  drawArcMeter(ctx, {
    anchor,
    radius: meterRadius,
    lineWidth: meterLineWidth,
    phase01: meterState.phase01,
    zones: meterState.zones,
    feedback: meterState.feedback,
    fillColor: meterState.zones === null ? palette.meter.runupFill : palette.meter.chargeFill,
    cursorColor:
      meterState.zones === null
        ? palette.meter.cursorPerfect
        : getFeedbackColor(meterState.feedback, palette),
    cursorRadius: meterCursorRadius,
    palette,
    visualScale,
    cursorGlowColor:
      meterState.feedback === 'perfect' && meterState.zones !== null
        ? palette.meter.centerGlow
        : undefined
  });

  drawValueLabel(
    ctx,
    anchor.x,
    anchor.y + 16 * visualScale,
    meterState.valueLabel,
    11 * visualScale,
    palette,
    visualScale
  );

  ctx.restore();
};
