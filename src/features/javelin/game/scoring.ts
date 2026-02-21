import { THROW_LINE_X_M } from './constants';
import { clamp } from './math';
import type { ResultKind, ThrowInput } from './types';

const roundTo1 = (value: number): number => Math.round(value * 10) / 10;

export const DISTANCE_MEASURE_MODE = 'throwLineArc' as const;
export const FOUL_ON_LINE_CROSS = true as const;
export const REQUIRE_TIP_FIRST = true as const;
export const REQUIRE_SECTOR = true as const;

export const SECTOR_ANGLE_DEG = 28.96;
export const SECTOR_HALF_ANGLE_RAD = (SECTOR_ANGLE_DEG / 2) * (Math.PI / 180);

export const angleEfficiency = (angleDeg: number): number => {
  const optimum = 36;
  const diff = Math.abs(angleDeg - optimum);
  return clamp(1 - (diff / 20) ** 1.4, 0.35, 1.02);
};

export const releaseEfficiency = (releaseTiming: number): number => {
  const center = 0.77;
  const diff = Math.abs(releaseTiming - center);
  return clamp(1 - (diff / 0.2) ** 1.7, 0.2, 1);
};

export const windEfficiency = (windMs: number): number =>
  clamp(1 + windMs * 0.035, 0.88, 1.12);

export const computeThrowDistance = (input: ThrowInput): number => {
  const raw =
    118 *
    clamp(input.speedNorm, 0, 1) ** 1.15 *
    angleEfficiency(input.angleDeg) *
    releaseEfficiency(input.releaseTiming) *
    windEfficiency(input.windMs);

  return roundTo1(clamp(raw, 12, 110));
};

export const computeCompetitionDistanceM = (
  landingTipXM: number,
  throwLineXM = THROW_LINE_X_M
): number => roundTo1(Math.max(0, landingTipXM - throwLineXM));

export const isLandingInSector = (
  landingTipXM: number,
  landingTipZM: number,
  throwLineXM = THROW_LINE_X_M
): boolean => {
  const forward = landingTipXM - throwLineXM;
  if (forward <= 0) {
    return false;
  }
  const maxAbsLateral = Math.tan(SECTOR_HALF_ANGLE_RAD) * forward;
  return Math.abs(landingTipZM) <= maxAbsLateral;
};

type LegalityInput = {
  lineCrossedAtRelease: boolean;
  landingTipXM: number;
  landingTipZM: number;
  tipFirst: boolean;
  throwLineXM?: number;
};

export const evaluateThrowLegality = ({
  lineCrossedAtRelease,
  landingTipXM,
  landingTipZM,
  tipFirst,
  throwLineXM = THROW_LINE_X_M
}: LegalityInput): { valid: boolean; resultKind: ResultKind } => {
  if (FOUL_ON_LINE_CROSS && lineCrossedAtRelease) {
    return { valid: false, resultKind: 'foul_line' };
  }
  if (REQUIRE_SECTOR && !isLandingInSector(landingTipXM, landingTipZM, throwLineXM)) {
    return { valid: false, resultKind: 'foul_sector' };
  }
  if (REQUIRE_TIP_FIRST && !tipFirst) {
    return { valid: false, resultKind: 'foul_tip_first' };
  }
  return { valid: true, resultKind: 'valid' };
};
