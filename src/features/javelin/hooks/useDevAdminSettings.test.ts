import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEV_ADMIN_SETTINGS_STORAGE_KEY } from '../game/constants';
import {
  DEFAULT_DEV_ADMIN_SETTINGS,
  loadDevAdminSettings,
  resolveEffectiveDifficultyUnlocks,
  saveDevAdminSettings,
  shouldBlockGlobalSubmitInDevAdmin
} from './useDevAdminSettings';

beforeEach(() => {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      clear: vi.fn(() => store.clear())
    }
  });
  localStorage.clear();
});

describe('dev admin settings storage', () => {
  it('loads defaults when disabled', () => {
    localStorage.setItem(
      DEV_ADMIN_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        unlockAllDifficulties: true
      })
    );
    expect(loadDevAdminSettings(false)).toEqual(DEFAULT_DEV_ADMIN_SETTINGS);
  });

  it('loads valid persisted settings in dev mode', () => {
    localStorage.setItem(
      DEV_ADMIN_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        unlockAllDifficulties: true,
        tuningOverrides: {
          rookie: {
            tapGainNorm: 0.1
          }
        }
      })
    );

    expect(loadDevAdminSettings(true)).toEqual({
      unlockAllDifficulties: true,
      tuningOverrides: {
        rookie: {
          tapGainNorm: 0.1
        }
      }
    });
  });

  it('falls back to defaults when persisted data is malformed', () => {
    localStorage.setItem(
      DEV_ADMIN_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        unlockAllDifficulties: 'yes',
        tuningOverrides: {}
      })
    );
    expect(loadDevAdminSettings(true)).toEqual(DEFAULT_DEV_ADMIN_SETTINGS);
  });

  it('persists only when enabled', () => {
    saveDevAdminSettings(true, {
      unlockAllDifficulties: true,
      tuningOverrides: {}
    });
    expect(localStorage.getItem(DEV_ADMIN_SETTINGS_STORAGE_KEY)).toContain('"unlockAllDifficulties":true');

    localStorage.clear();
    saveDevAdminSettings(false, {
      unlockAllDifficulties: true,
      tuningOverrides: {}
    });
    expect(localStorage.getItem(DEV_ADMIN_SETTINGS_STORAGE_KEY)).toBeNull();
  });
});

describe('dev admin policies', () => {
  it('resolves effective unlocks to all-true when unlockAll is active in dev', () => {
    const canonical = { rookie: true, pro: false, elite: false };
    const effective = resolveEffectiveDifficultyUnlocks(
      canonical,
      {
        unlockAllDifficulties: true,
        tuningOverrides: {}
      },
      true
    );
    expect(effective).toEqual({ rookie: true, pro: true, elite: true });
  });

  it('keeps canonical unlocks when unlockAll is disabled or not in dev', () => {
    const canonical = { rookie: true, pro: false, elite: false };
    expect(
      resolveEffectiveDifficultyUnlocks(
        canonical,
        {
          unlockAllDifficulties: false,
          tuningOverrides: {}
        },
        true
      )
    ).toEqual(canonical);
    expect(
      resolveEffectiveDifficultyUnlocks(
        canonical,
        {
          unlockAllDifficulties: true,
          tuningOverrides: {}
        },
        false
      )
    ).toEqual(canonical);
  });

  it('blocks global submit only in dev mode', () => {
    expect(shouldBlockGlobalSubmitInDevAdmin(true)).toBe(true);
    expect(shouldBlockGlobalSubmitInDevAdmin(false)).toBe(false);
  });
});
