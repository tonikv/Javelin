import { memo, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { useTheme } from '../../../theme/init';

const ThemeToggleComponent = (): ReactElement => {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const ariaLabel = nextTheme === 'dark' ? t('theme.toggleToDark') : t('theme.toggleToLight');

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={ariaLabel}
      onClick={toggleTheme}
      title={ariaLabel}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'dark' ? 'D' : 'L'}
      </span>
      <span className="theme-toggle-text">
        {t('theme.label')}: {theme === 'dark' ? t('theme.dark') : t('theme.light')}
      </span>
    </button>
  );
};

export const ThemeToggle = memo(ThemeToggleComponent);
