import { useCallback, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../../../app/browser';
import { DEV_ADMIN_SETTINGS_STORAGE_KEY } from '../game/constants';
import { difficultyLevels } from '../game/types';
import type {
  DifficultyGameplayTuningOverride,
  DifficultyGameplayTuningOverrides,
  ReleaseMeterTuning,
  RunupRhythmTuning
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

const parseTempoCurveOverride = (value: unknown): RunupRhythmTuning['tempoCurve'] | undefined | null => {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    return null;
  }
  const parsed = value.map((entry) => {
    if (!isRecord(entry)) {
      return null;
    }
    const speedNorm = parseOptionalFiniteNumber(entry.speedNorm);
    const targetIntervalMs = parseOptionalFiniteNumber(entry.targetIntervalMs);
    if (
      speedNorm === null ||
      targetIntervalMs === null ||
      speedNorm === undefined ||
      targetIntervalMs === undefined
    ) {
      return null;
    }
    return {
      speedNorm,
      targetIntervalMs
    };
  });

  if (parsed.some((entry) => entry === null)) {
    return null;
  }

  return parsed.filter((entry): entry is NonNullable<typeof entry> => entry !== null);
};

const parseRunupRhythmOverride = (
  value: unknown
): DifficultyGameplayTuningOverride['runupRhythm'] | undefined | null => {
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    return null;
  }
  const tempoCurve = parseTempoCurveOverride(value.tempoCurve);
  const perfectToleranceRatio = parseOptionalFiniteNumber(value.perfectToleranceRatio);
  const goodToleranceRatio = parseOptionalFiniteNumber(value.goodToleranceRatio);
  const perfectMultiplier = parseOptionalFiniteNumber(value.perfectMultiplier);
  const goodMultiplier = parseOptionalFiniteNumber(value.goodMultiplier);
  const missMultiplier = parseOptionalFiniteNumber(value.missMultiplier);
  const stabilityGainPerGood = parseOptionalFiniteNumber(value.stabilityGainPerGood);
  const stabilityLossPerMiss = parseOptionalFiniteNumber(value.stabilityLossPerMiss);
  const stableDecayMultiplier = parseOptionalFiniteNumber(value.stableDecayMultiplier);
  const unstableDecayMultiplier = parseOptionalFiniteNumber(value.unstableDecayMultiplier);
  const comboMax = parseOptionalFiniteNumber(value.comboMax);
  if (
    tempoCurve === null ||
    perfectToleranceRatio === null ||
    goodToleranceRatio === null ||
    perfectMultiplier === null ||
    goodMultiplier === null ||
    missMultiplier === null ||
    stabilityGainPerGood === null ||
    stabilityLossPerMiss === null ||
    stableDecayMultiplier === null ||
    unstableDecayMultiplier === null ||
    comboMax === null
  ) {
    return null;
  }
  return {
    tempoCurve,
    perfectToleranceRatio,
    goodToleranceRatio,
    perfectMultiplier,
    goodMultiplier,
    missMultiplier,
    stabilityGainPerGood,
    stabilityLossPerMiss,
    stableDecayMultiplier,
    unstableDecayMultiplier,
    comboMax
  } as Partial<RunupRhythmTuning>;
};

const parseReleaseMeterOverride = (
  value: unknown
): DifficultyGameplayTuningOverride['releaseMeter'] | undefined | null => {
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    return null;
  }
  const sweepDurationMsMin = parseOptionalFiniteNumber(value.sweepDurationMsMin);
  const sweepDurationMsMax = parseOptionalFiniteNumber(value.sweepDurationMsMax);
  const perfectWidth = parseOptionalFiniteNumber(value.perfectWidth);
  const goodWidth = parseOptionalFiniteNumber(value.goodWidth);
  const highSpeedPerfectWidth = parseOptionalFiniteNumber(value.highSpeedPerfectWidth);
  const highSpeedGoodWidth = parseOptionalFiniteNumber(value.highSpeedGoodWidth);
  if (
    sweepDurationMsMin === null ||
    sweepDurationMsMax === null ||
    perfectWidth === null ||
    goodWidth === null ||
    highSpeedPerfectWidth === null ||
    highSpeedGoodWidth === null
  ) {
    return null;
  }
  return {
    sweepDurationMsMin,
    sweepDurationMsMax,
    perfectWidth,
    goodWidth,
    highSpeedPerfectWidth,
    highSpeedGoodWidth
  } as Partial<ReleaseMeterTuning>;
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
  const runupRhythm = parseRunupRhythmOverride(
    value.runupRhythm ?? value.eliteRunupRhythm ?? value.rhythm
  );
  const releaseMeter = parseReleaseMeterOverride(value.releaseMeter ?? value.eliteReleaseMeter);

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
    runupRhythm === null ||
    releaseMeter === null
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
    runupRhythm,
    releaseMeter
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
