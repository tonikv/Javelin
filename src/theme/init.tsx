import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactElement
} from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../app/browser';

const THEME_STORAGE_KEY = 'sg2026-javelin-theme-v1';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const readStoredTheme = (): ThemeMode | null => {
  const stored = safeLocalStorageGet(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
};

export const getBrowserPrefersDark = (): boolean => {
  try {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const resolveTheme = (
  stored: ThemeMode | null,
  browserPrefersDark: boolean
): ThemeMode => {
  if (stored !== null) {
    return stored;
  }
  return browserPrefersDark ? 'dark' : 'light';
};

export const persistTheme = (theme: ThemeMode): void => {
  safeLocalStorageSet(THEME_STORAGE_KEY, theme);
};

const detectTheme = (): ThemeMode =>
  resolveTheme(readStoredTheme(), getBrowserPrefersDark());

export const ThemeProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [theme, setThemeState] = useState<ThemeMode>(detectTheme);

  const setTheme = useCallback((mode: ThemeMode): void => {
    setThemeState(mode);
    persistTheme(mode);
  }, []);

  const toggleTheme = useCallback((): void => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};
