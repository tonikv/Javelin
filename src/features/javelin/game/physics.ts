import type { ProjectileState } from './types';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const createProjectile = (distanceTargetM: number): ProjectileState => {
  const distance = clamp(distanceTargetM, 12, 98);
  const durationMs = clamp(900 + distance * 13, 900, 2200);
  const peakHeightM = clamp(distance / 6.5, 4.5, 16);
  return {
    elapsedMs: 0,
    durationMs,
    distanceTargetM: distance,
    peakHeightM,
    xM: 0,
    yM: 1.8
  };
};

export const updateProjectile = (
  projectile: ProjectileState,
  dtMs: number
): { projectile: ProjectileState; landed: boolean } => {
  const nextElapsed = Math.min(projectile.elapsedMs + dtMs, projectile.durationMs);
  const progress = clamp(nextElapsed / projectile.durationMs, 0, 1);
  const xM = projectile.distanceTargetM * progress;
  const yM = Math.max(
    0,
    projectile.peakHeightM * Math.sin(progress * Math.PI) + (1 - progress) * 1.8
  );

  const nextProjectile: ProjectileState = {
    ...projectile,
    elapsedMs: nextElapsed,
    xM,
    yM
  };

  return {
    projectile: nextProjectile,
    landed: progress >= 1
  };
};
