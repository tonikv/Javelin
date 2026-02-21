/** Clamp value between min and max inclusive. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Clamp value between 0 and 1 inclusive. */
export const clamp01 = (value: number): number => clamp(value, 0, 1);

/** Wrap value into [0, 1) range. Handles negatives correctly. */
export const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

/** Linear interpolation between a and b. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Degrees to radians. */
export const toRad = (deg: number): number => (deg * Math.PI) / 180;

/** Radians to degrees. */
export const toDeg = (rad: number): number => (rad * 180) / Math.PI;

export const easeOutQuad = (t: number): number => 1 - (1 - t) * (1 - t);

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const easeInCubic = (t: number): number => t ** 3;

export const easeInOutSine = (t: number): number =>
  0.5 - Math.cos(Math.PI * clamp01(t)) * 0.5;
