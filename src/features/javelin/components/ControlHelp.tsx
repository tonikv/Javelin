import { useMemo, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';

export const ControlHelp = (): ReactElement => {
  const { t } = useI18n();
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  return (
    <section className="card control-help" aria-label={t('help.title')}>
      <h3>{t('help.title')}</h3>
      <ul>
        {isTouchDevice ? (
          <>
            <li>{t('help.touch1')}</li>
            <li>{t('help.touch2')}</li>
            <li>{t('help.touch3')}</li>
            <li>{t('help.touch4')}</li>
          </>
        ) : (
          <>
            <li>{t('help.mouse1')}</li>
            <li>{t('help.mouse2')}</li>
            <li>{t('help.mouse3')}</li>
            <li>{t('help.mouse4')}</li>
            <li>{t('help.kbd1')}</li>
            <li>{t('help.kbd2')}</li>
            <li>{t('help.kbd3')}</li>
            <li>{t('help.kbd4')}</li>
          </>
        )}
      </ul>
    </section>
  );
};
