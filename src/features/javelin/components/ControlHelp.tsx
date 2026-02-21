import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';

export const ControlHelp = (): ReactElement => {
  const { t } = useI18n();

  return (
    <section className="card control-help" aria-label={t('help.title')}>
      <h3>{t('help.title')}</h3>
      <ul>
        <li>{t('help.mouse1')}</li>
        <li>{t('help.mouse2')}</li>
        <li>{t('help.mouse3')}</li>
        <li>{t('help.kbd1')}</li>
        <li>{t('help.kbd2')}</li>
        <li>{t('help.kbd3')}</li>
      </ul>
    </section>
  );
};
