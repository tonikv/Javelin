import { afterEach, describe, expect, it, vi } from 'vitest';
import { getBrowserLocale, persistLocale, readStoredLocale, resolveLocale } from './init';

const installStorageMock = (options: {
  getItem?: (key: string) => string | null;
  setItem?: (key: string, value: string) => void;
} = {}): void => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: options.getItem ?? (() => null),
      setItem: options.setItem ?? (() => undefined)
    }
  });
};

const installNavigatorMock = (value: unknown): void => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value
  });
};

afterEach(() => {
  vi.restoreAllMocks();
  delete (globalThis as { navigator?: unknown }).navigator;
});

describe('i18n locale guards', () => {
  it('prefers stored locale when present', () => {
    expect(resolveLocale('fi', 'en-us')).toBe('fi');
    expect(resolveLocale('sv', 'fi-fi')).toBe('sv');
  });

  it('falls back to browser locale when storage is empty', () => {
    expect(resolveLocale(null, 'fi-fi')).toBe('fi');
    expect(resolveLocale(null, 'sv-se')).toBe('sv');
    expect(resolveLocale(null, 'en-us')).toBe('en');
  });

  it('returns null when reading storage throws', () => {
    installStorageMock({
      getItem: () => {
        throw new Error('blocked');
      }
    });

    expect(readStoredLocale()).toBeNull();
  });

  it('swallows storage write failures when persisting locale', () => {
    installStorageMock({
      setItem: () => {
        throw new Error('quota');
      }
    });

    expect(() => persistLocale('en')).not.toThrow();
  });

  it('returns empty browser locale when navigator is missing or invalid', () => {
    installNavigatorMock(undefined);
    expect(getBrowserLocale()).toBe('');

    installNavigatorMock({});
    expect(getBrowserLocale()).toBe('');
  });

  it('returns lowercased browser locale string', () => {
    installNavigatorMock({ language: 'FI-FI' });
    expect(getBrowserLocale()).toBe('fi-fi');
  });
});
