import { afterEach, describe, expect, it } from 'vitest';
import {
  getBrowserPrefersDark,
  persistTheme,
  readStoredTheme,
  resolveTheme
} from './init';

type StorageMock = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const setStorageMock = (mock: StorageMock): void => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: mock
  });
};

const setWindowMock = (value: unknown): void => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value
  });
};

afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
  delete (globalThis as { window?: unknown }).window;
});

describe('theme helpers', () => {
  it('resolves stored theme over browser preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('falls back to browser preference when storage is empty', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('returns null when stored theme is invalid or storage read fails', () => {
    setStorageMock({
      getItem: () => 'sepia',
      setItem: () => undefined
    });
    expect(readStoredTheme()).toBeNull();

    setStorageMock({
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined
    });
    expect(readStoredTheme()).toBeNull();
  });

  it('reads dark browser preference when matchMedia reports dark mode', () => {
    setWindowMock({
      matchMedia: (query: string) => ({
        matches: query === '(prefers-color-scheme: dark)'
      })
    });

    expect(getBrowserPrefersDark()).toBe(true);
  });

  it('falls back to light preference when browser APIs are missing or throw', () => {
    setWindowMock({});
    expect(getBrowserPrefersDark()).toBe(false);

    setWindowMock({
      matchMedia: () => {
        throw new Error('unsupported');
      }
    });
    expect(getBrowserPrefersDark()).toBe(false);
  });

  it('swallows storage write errors when persisting theme', () => {
    setStorageMock({
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      }
    });

    expect(() => persistTheme('dark')).not.toThrow();
  });
});
