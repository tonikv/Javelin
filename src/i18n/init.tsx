import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactElement
} from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../app/browser';
import type { Locale } from '../features/javelin/game/types';
import { resources } from './resources';

const LOCALE_STORAGE_KEY = 'sg2026-javelin-locale-v1';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  formatNumber: (value: number, maxFractionDigits?: number) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const readStoredLocale = (): Locale | null => {
  const stored = safeLocalStorageGet(LOCALE_STORAGE_KEY);
  if (stored === 'fi' || stored === 'sv' || stored === 'en') {
    return stored;
  }
  return null;
};

export const getBrowserLocale = (): string => {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.language !== 'string') {
      return '';
    }
    return navigator.language.toLowerCase();
  } catch {
    return '';
  }
};

export const resolveLocale = (stored: Locale | null, browserLocale: string): Locale => {
  if (stored !== null) {
    return stored;
  }
  if (browserLocale.startsWith('fi')) {
    return 'fi';
  }
  if (browserLocale.startsWith('sv')) {
    return 'sv';
  }
  return 'en';
};

export const persistLocale = (locale: Locale): void => {
  safeLocalStorageSet(LOCALE_STORAGE_KEY, locale);
};

const detectLocale = (): Locale => {
  return resolveLocale(readStoredLocale(), getBrowserLocale());
};

export const I18nProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const t = useCallback(
    (key: string): string => resources[locale][key] ?? resources.en[key] ?? key,
    [locale]
  );

  const formatNumber = useCallback(
    (value: number, maxFractionDigits = 1): string =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: maxFractionDigits }).format(value),
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, formatNumber }),
    [locale, setLocale, t, formatNumber]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
};
