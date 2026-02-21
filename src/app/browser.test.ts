import { afterEach, describe, expect, it } from 'vitest';
import { isInteractiveElement, safeLocalStorageGet, safeLocalStorageSet } from './browser';

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

const makeTarget = (overrides: {
  tagName?: string;
  isContentEditable?: boolean;
  closest?: (selector: string) => unknown;
} = {}): EventTarget =>
  ({
    tagName: 'DIV',
    isContentEditable: false,
    closest: () => null,
    ...overrides
  }) as unknown as EventTarget;

afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
});

describe('browser helpers', () => {
  it('detects interactive event targets', () => {
    expect(isInteractiveElement(makeTarget({ tagName: 'INPUT' }))).toBe(true);
    expect(isInteractiveElement(makeTarget({ isContentEditable: true }))).toBe(true);
    expect(
      isInteractiveElement(
        makeTarget({
          closest: () => ({})
        })
      )
    ).toBe(true);
    expect(isInteractiveElement(makeTarget())).toBe(false);
  });

  it('treats ARIA textbox-like roles as interactive by closest lookup', () => {
    const selectors: string[] = [];
    const target = makeTarget({
      closest: (selector) => {
        selectors.push(selector);
        return selector.includes('[role="combobox"]') ? {} : null;
      }
    });

    expect(isInteractiveElement(target)).toBe(true);
    expect(selectors).toHaveLength(1);
  });

  it('returns null when storage getter throws', () => {
    setStorageMock({
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined
    });
    expect(safeLocalStorageGet('x')).toBeNull();
  });

  it('does not throw when storage setter throws', () => {
    setStorageMock({
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      }
    });
    expect(() => safeLocalStorageSet('x', '1')).not.toThrow();
  });
});
