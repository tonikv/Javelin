const INTERACTIVE_TAGS = new Set(['input', 'textarea', 'select', 'button']);
const INTERACTIVE_SELECTOR =
  'input, textarea, select, button, [contenteditable], [role="textbox"], [role="combobox"], [role="spinbutton"]';

type InteractiveElement = {
  tagName?: string;
  isContentEditable?: boolean;
  closest?: (selector: string) => unknown;
};

export const isInteractiveElement = (target: EventTarget | null): boolean => {
  if (target === null || typeof target !== 'object') {
    return false;
  }

  const maybeElement = target as InteractiveElement;

  if (maybeElement.isContentEditable === true) {
    return true;
  }
  if (typeof maybeElement.tagName === 'string' && INTERACTIVE_TAGS.has(maybeElement.tagName.toLowerCase())) {
    return true;
  }
  if (typeof maybeElement.closest === 'function') {
    return maybeElement.closest(INTERACTIVE_SELECTOR) !== null;
  }
  return false;
};

export const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeLocalStorageSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Intentionally swallowed - localStorage may be unavailable or full.
  }
};
