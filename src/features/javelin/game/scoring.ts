import type { ThrowInput } from './types';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const roundTo1 = (value: number): number => Math.round(value * 10) / 10;

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

  return roundTo1(clamp(raw, 12, 98));
};
