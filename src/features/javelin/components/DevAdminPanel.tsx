import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import type { DifficultyGameplayTuningOverrides } from '../game/tuning';
import type { DevAdminSettings } from '../hooks/useDevAdminSettings';
import { DevAdminActions } from './devAdmin/DevAdminActions';
import { DifficultyTuningSection } from './devAdmin/DifficultyTuningSection';
import { useDevAdminDraft } from './devAdmin/useDevAdminDraft';

type DevAdminPanelProps = {
  settings: DevAdminSettings;
  canApplyTuning: boolean;
  onSetUnlockAllDifficulties: (enabled: boolean) => void;
  onResetUnlockProgression: () => void;
  onApplyTuningOverrides: (overrides: DifficultyGameplayTuningOverrides) => void;
  onResetTuningOverrides: () => void;
  onResetAll: () => void;
};

export const DevAdminPanel = ({
  settings,
  canApplyTuning,
  onSetUnlockAllDifficulties,
  onResetUnlockProgression,
  onApplyTuningOverrides,
  onResetTuningOverrides,
  onResetAll
}: DevAdminPanelProps): ReactElement => {
  const { t } = useI18n();
  const { draft, hasInputError, updateDraftField, updateTempoCurvePoint, applyDraft } =
    useDevAdminDraft({ settings });

  return (
    <section className="card dev-admin-panel" aria-label={t('devAdmin.title')}>
      <h3>{t('devAdmin.title')}</h3>
      <p className="dev-admin-note">{t('devAdmin.devOnlyNote')}</p>

      <label className="dev-admin-toggle">
        <input
          type="checkbox"
          checked={settings.unlockAllDifficulties}
          onChange={(event) => onSetUnlockAllDifficulties(event.target.checked)}
        />
        {t('devAdmin.unlockAll')}
      </label>

      <div className="dev-admin-actions">
        <button type="button" className="ghost" onClick={onResetUnlockProgression}>
          {t('devAdmin.resetUnlockProgression')}
        </button>
      </div>

      <DifficultyTuningSection
        draft={draft}
        updateDraftField={updateDraftField}
        updateTempoCurvePoint={updateTempoCurvePoint}
      />

      <DevAdminActions
        canApplyTuning={canApplyTuning}
        hasInputError={hasInputError}
        onApply={() => applyDraft(onApplyTuningOverrides)}
        onResetTuningOverrides={onResetTuningOverrides}
        onResetAll={onResetAll}
      />
    </section>
  );
};
