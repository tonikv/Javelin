import { memo, useMemo, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';

type ControlHelpContentProps = {
  isTouchDevice?: boolean;
};

export const detectTouchDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const ControlHelpContentComponent = ({ isTouchDevice }: ControlHelpContentProps): ReactElement => {
  const { t } = useI18n();
  const useTouchHelp = useMemo(() => isTouchDevice ?? detectTouchDevice(), [isTouchDevice]);
  const helpItems = useMemo(
    () =>
      useTouchHelp
        ? [t('help.touch1'), t('help.touch2'), t('help.touch3'), t('help.touch4')]
        : [
            t('help.mouse1'),
            t('help.mouse2'),
            t('help.mouse3'),
            t('help.mouse4'),
            t('help.kbd1'),
            t('help.kbd2'),
            t('help.kbd3'),
            t('help.kbd4')
          ],
    [t, useTouchHelp]
  );

  return (
    <ul className="control-help-list">
      {helpItems.map((item, index) => (
        <li key={`${index}-${item}`}>{item}</li>
      ))}
    </ul>
  );
};

export const ControlHelpContent = memo(ControlHelpContentComponent);

const ControlHelpComponent = (): ReactElement => {
  const { t } = useI18n();

  return (
    <section className="card control-help" aria-label={t('help.title')}>
      <h3>{t('help.title')}</h3>
      <ControlHelpContent />
    </section>
  );
};

export const ControlHelp = memo(ControlHelpComponent);
