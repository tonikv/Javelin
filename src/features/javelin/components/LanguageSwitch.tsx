import { memo, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import type { Locale } from '../game/types';

const LABELS: Record<Locale, string> = {
  fi: 'Suomi',
  sv: 'Svenska',
  en: 'English'
};

const LanguageSwitchComponent = (): ReactElement => {
  const { locale, setLocale, t } = useI18n();

  return (
    <label className="language-switch">
      <span>{t('language.label')}</span>
      <select
        aria-label={t('language.label')}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        <option value="fi">{LABELS.fi}</option>
        <option value="sv">{LABELS.sv}</option>
        <option value="en">{LABELS.en}</option>
      </select>
    </label>
  );
};

export const LanguageSwitch = memo(LanguageSwitchComponent);
