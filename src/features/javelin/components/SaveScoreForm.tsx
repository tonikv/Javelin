/**
 * Highscore save form with in-component name state and sanitization.
 * Emits a normalized player name to the parent submit handler.
 */
import { useState, type FormEvent, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';

type SaveScoreFormProps = {
  onSave: (name: string) => void;
  defaultName: string;
};

export const SaveScoreForm = ({ onSave, defaultName }: SaveScoreFormProps): ReactElement => {
  const { t } = useI18n();
  const [nameInput, setNameInput] = useState('AAA');

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const normalizedName = nameInput.trim().slice(0, 10) || defaultName;
    onSave(normalizedName);
  };

  return (
    <form className="save-form" onSubmit={onSubmit}>
      <label>
        {t('scoreboard.name')}
        <input
          minLength={3}
          maxLength={10}
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value.toUpperCase())}
        />
      </label>
      <button type="submit">{t('action.saveScore')}</button>
    </form>
  );
};
