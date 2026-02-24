import { THROW_LINE_X_M } from './constants';
import { clamp, roundTo1 } from './math';
import type { ResultKind, ThrowInput } from './types';

export const DISTANCE_MEASURE_MODE = 'throwLineArc' as const;

/** @deprecated Prefer COMPETITION_RULES.sectorAngleDeg. */
export const SECTOR_ANGLE_DEG = 28.96;
/** @deprecated Prefer runtime sectorHalfAngleRad derived from ScoringRules. */
export const SECTOR_HALF_ANGLE_RAD = (SECTOR_ANGLE_DEG / 2) * (Math.PI / 180);

/** Configurable competition rules for throw legality evaluation. */
export type ScoringRules = {
  foulOnLineCross: boolean;
  requireTipFirst: boolean;
  requireSector: boolean;
  sectorAngleDeg: number;
};

/** Standard competition rule set used by gameplay. */
export const COMPETITION_RULES: ScoringRules = {
  foulOnLineCross: true,
  requireTipFirst: true,
  requireSector: true,
  sectorAngleDeg: 28.96
};

/**
 * Score throw angle against the 36-degree optimum.
 * Returns 1.0 at optimum and tapers down with larger deviations.
 */
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

/**
 * @deprecated Legacy formula-based distance estimate kept for tests and balancing experiments.
 * Runtime scoring uses `computeCompetitionDistanceM` from physical landing data.
 */
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
  throwLineXM = THROW_LINE_X_M,
  sectorHalfAngleRad = SECTOR_HALF_ANGLE_RAD
): boolean => {
  const forward = landingTipXM - throwLineXM;
  if (forward <= 0) {
    return false;
  }
  const maxAbsLateral = Math.tan(sectorHalfAngleRad) * forward;
  return Math.abs(landingTipZM) <= maxAbsLateral;
};

type LegalityInput = {
  lineCrossedAtRelease: boolean;
  landingTipXM: number;
  landingTipZM: number;
  tipFirst: boolean;
  throwLineXM?: number;
  rules?: ScoringRules;
};

/**
 * Evaluate throw legality with foul line, sector, and tip-first rules.
 */
export const evaluateThrowLegality = ({
  lineCrossedAtRelease,
  landingTipXM,
  landingTipZM,
  tipFirst,
  throwLineXM = THROW_LINE_X_M,
  rules = COMPETITION_RULES
}: LegalityInput): { valid: boolean; resultKind: ResultKind } => {
  const sectorHalfAngleRad = (rules.sectorAngleDeg / 2) * (Math.PI / 180);

  if (rules.foulOnLineCross && lineCrossedAtRelease) {
    return { valid: false, resultKind: 'foul_line' };
  }
  if (
    rules.requireSector &&
    !isLandingInSector(landingTipXM, landingTipZM, throwLineXM, sectorHalfAngleRad)
  ) {
    return { valid: false, resultKind: 'foul_sector' };
  }
  if (rules.requireTipFirst && !tipFirst) {
    return { valid: false, resultKind: 'foul_tip_first' };
  }
  return { valid: true, resultKind: 'valid' };
};
