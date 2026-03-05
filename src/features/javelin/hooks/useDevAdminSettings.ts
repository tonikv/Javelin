import { useCallback, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../../app/browser';
import { DEV_ADMIN_SETTINGS_STORAGE_KEY } from '../game/constants';
import { difficultyLevels } from '../game/types';
import type {
  DifficultyGameplayTuningOverride,
  DifficultyGameplayTuningOverrides,
  EliteRhythmTuning
} from '../game/tuning';
import type { DifficultyUnlocks } from './useDifficultyUnlocks';

export type DevAdminSettings = {
  unlockAllDifficulties: boolean;
  tuningOverrides: DifficultyGameplayTuningOverrides;
};

export const DEFAULT_DEV_ADMIN_SETTINGS: DevAdminSettings = {
  unlockAllDifficulties: false,
  tuningOverrides: {}
};

const DEV_UNLOCK_ALL: DifficultyUnlocks = {
  rookie: true,
  pro: true,
  elite: true
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseOptionalFiniteNumber = (value: unknown): number | undefined | null => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return value;
};

const parseWindowOverride = (
  value: unknown
): DifficultyGameplayTuningOverride['chargePerfectWindow'] | undefined | null => {
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    return null;
  }
  const start = parseOptionalFiniteNumber(value.start);
  const end = parseOptionalFiniteNumber(value.end);
  if (start === null || end === null) {
    return null;
  }
  return {
    start,
    end
  };
};

const parseRhythmOverride = (
  value: unknown
): DifficultyGameplayTuningOverride['rhythm'] | undefined | null => {
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    return null;
  }
  const targetTapIntervalMs = parseOptionalFiniteNumber(value.targetTapIntervalMs);
  const perfectToleranceMs = parseOptionalFiniteNumber(value.perfectToleranceMs);
  const goodToleranceMs = parseOptionalFiniteNumber(value.goodToleranceMs);
  const offBeatMultiplier = parseOptionalFiniteNumber(value.offBeatMultiplier);
  if (
    targetTapIntervalMs === null ||
    perfectToleranceMs === null ||
    goodToleranceMs === null ||
    offBeatMultiplier === null
  ) {
    return null;
  }
  return {
    targetTapIntervalMs,
    perfectToleranceMs,
    goodToleranceMs,
    offBeatMultiplier
  } as Partial<EliteRhythmTuning>;
};

const parseDifficultyOverride = (
  value: unknown
): DifficultyGameplayTuningOverride | undefined | null => {
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    return null;
  }
  const tapGainNorm = parseOptionalFiniteNumber(value.tapGainNorm);
  const tapSoftCapIntervalMs = parseOptionalFiniteNumber(value.tapSoftCapIntervalMs);
  const tapSoftCapMinMultiplier = parseOptionalFiniteNumber(value.tapSoftCapMinMultiplier);
  const runupSpeedDecayPerSecond = parseOptionalFiniteNumber(value.runupSpeedDecayPerSecond);
  const chargeAimSpeedDecayPerSecond = parseOptionalFiniteNumber(value.chargeAimSpeedDecayPerSecond);
  const chargeAimStopSpeedNorm = parseOptionalFiniteNumber(value.chargeAimStopSpeedNorm);
  const chargeFillDurationMs = parseOptionalFiniteNumber(value.chargeFillDurationMs);
  const chargePerfectWindow = parseWindowOverride(value.chargePerfectWindow);
  const chargeGoodWindow = parseWindowOverride(value.chargeGoodWindow);
  const rhythm = parseRhythmOverride(value.rhythm);

  if (
    tapGainNorm === null ||
    tapSoftCapIntervalMs === null ||
    tapSoftCapMinMultiplier === null ||
    runupSpeedDecayPerSecond === null ||
    chargeAimSpeedDecayPerSecond === null ||
    chargeAimStopSpeedNorm === null ||
    chargeFillDurationMs === null ||
    chargePerfectWindow === null ||
    chargeGoodWindow === null ||
    rhythm === null
  ) {
    return null;
  }

  return {
    tapGainNorm,
    tapSoftCapIntervalMs,
    tapSoftCapMinMultiplier,
    runupSpeedDecayPerSecond,
    chargeAimSpeedDecayPerSecond,
    chargeAimStopSpeedNorm,
    chargeFillDurationMs,
    chargePerfectWindow,
    chargeGoodWindow,
    rhythm
  };
};

const parseTuningOverrides = (value: unknown): DifficultyGameplayTuningOverrides | null => {
  if (value === undefined) {
    return {};
  }
  if (!isRecord(value)) {
    return null;
  }
  const parsed: DifficultyGameplayTuningOverrides = {};
  for (const difficulty of difficultyLevels) {
    const next = parseDifficultyOverride(value[difficulty]);
    if (next === null) {
      return null;
    }
    if (next !== undefined) {
      parsed[difficulty] = next;
    }
  }
  return parsed;
};

const parseDevAdminSettings = (value: unknown): DevAdminSettings | null => {
  if (!isRecord(value)) {
    return null;
  }
  if (typeof value.unlockAllDifficulties !== 'boolean') {
    return null;
  }
  const tuningOverrides = parseTuningOverrides(value.tuningOverrides);
  if (tuningOverrides === null) {
    return null;
  }
  return {
    unlockAllDifficulties: value.unlockAllDifficulties,
    tuningOverrides
  };
};

export const loadDevAdminSettings = (enabled: boolean): DevAdminSettings => {
  if (!enabled) {
    return DEFAULT_DEV_ADMIN_SETTINGS;
  }
  const raw = safeLocalStorageGet(DEV_ADMIN_SETTINGS_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_DEV_ADMIN_SETTINGS;
  }
  try {
    const parsed = parseDevAdminSettings(JSON.parse(raw) as unknown);
    return parsed ?? DEFAULT_DEV_ADMIN_SETTINGS;
  } catch {
    return DEFAULT_DEV_ADMIN_SETTINGS;
  }
};

export const saveDevAdminSettings = (enabled: boolean, settings: DevAdminSettings): void => {
  if (!enabled) {
    return;
  }
  safeLocalStorageSet(DEV_ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const resolveEffectiveDifficultyUnlocks = (
  canonicalUnlocks: DifficultyUnlocks,
  devSettings: DevAdminSettings,
  devModeEnabled: boolean
): DifficultyUnlocks =>
  devModeEnabled && devSettings.unlockAllDifficulties ? DEV_UNLOCK_ALL : canonicalUnlocks;

export const shouldBlockGlobalSubmitInDevAdmin = (devModeEnabled: boolean): boolean => devModeEnabled;

type UseDevAdminSettingsResult = {
  enabled: boolean;
  settings: DevAdminSettings;
  setUnlockAllDifficulties: (enabled: boolean) => void;
  applyTuningOverrides: (overrides: DifficultyGameplayTuningOverrides) => void;
  resetTuningOverrides: () => void;
  resetAll: () => void;
};

export const useDevAdminSettings = (): UseDevAdminSettingsResult => {
  const enabled = import.meta.env.DEV;
  const [settings, setSettings] = useState<DevAdminSettings>(() => loadDevAdminSettings(enabled));

  const updateSettings = useCallback(
    (next: DevAdminSettings) => {
      setSettings(next);
      saveDevAdminSettings(enabled, next);
    },
    [enabled]
  );

  const setUnlockAllDifficulties = useCallback(
    (unlockAllDifficulties: boolean) => {
      updateSettings({
        ...settings,
        unlockAllDifficulties
      });
    },
    [settings, updateSettings]
  );

  const applyTuningOverrides = useCallback(
    (tuningOverrides: DifficultyGameplayTuningOverrides) => {
      updateSettings({
        ...settings,
        tuningOverrides
      });
    },
    [settings, updateSettings]
  );

  const resetTuningOverrides = useCallback(() => {
    updateSettings({
      ...settings,
      tuningOverrides: {}
    });
  }, [settings, updateSettings]);

  const resetAll = useCallback(() => {
    updateSettings(DEFAULT_DEV_ADMIN_SETTINGS);
  }, [updateSettings]);

  return {
    enabled,
    settings,
    setUnlockAllDifficulties,
    applyTuningOverrides,
    resetTuningOverrides,
    resetAll
  };
};
