import type { ReactElement } from 'react';
import { useI18n } from '../../../../i18n/init';

type DevAdminActionsProps = {
  canApplyTuning: boolean;
  hasInputError: boolean;
  onApply: () => void;
  onResetTuningOverrides: () => void;
  onResetAll: () => void;
};

export const DevAdminActions = ({
  canApplyTuning,
  hasInputError,
  onApply,
  onResetTuningOverrides,
  onResetAll
}: DevAdminActionsProps): ReactElement => {
  const { t } = useI18n();

  return (
    <>
      {!canApplyTuning && <p className="dev-admin-note">{t('devAdmin.applyIdleOnly')}</p>}
      {hasInputError && <p className="dev-admin-error">{t('devAdmin.invalidNumber')}</p>}

      <div className="dev-admin-actions">
        <button type="button" onClick={onApply} disabled={!canApplyTuning}>
          {t('devAdmin.applyOverrides')}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={onResetTuningOverrides}
          disabled={!canApplyTuning}
        >
          {t('devAdmin.resetDifficultyDefaults')}
        </button>
        <button type="button" className="ghost" onClick={onResetAll} disabled={!canApplyTuning}>
          {t('devAdmin.resetAllOverrides')}
        </button>
      </div>
    </>
  );
};
