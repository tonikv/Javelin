/**
 * Highscore save form with in-component name state and sanitization.
 * Emits a normalized player name to the parent submit handler.
 */
import { useState, type FormEvent, type ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import { normalizePlayerNameInput, validatePlayerName } from '../highscores/nameModeration';

type SaveScoreFormProps = {
  onSave: (name: string) => void;
  defaultName: string;
};

export const SaveScoreForm = ({ onSave, defaultName }: SaveScoreFormProps): ReactElement => {
  const { t } = useI18n();
  const initialName = normalizePlayerNameInput(defaultName).padEnd(3, 'A').slice(0, 3);
  const [nameInput, setNameInput] = useState(initialName);
  const [validationError, setValidationError] = useState<'length' | 'blocked' | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const error = validatePlayerName(nameInput);
    if (error !== null) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    onSave(nameInput);
  };

  return (
    <form className="save-form" onSubmit={onSubmit}>
      <label>
        {t('scoreboard.name')}
        <input
          minLength={3}
          maxLength={3}
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          value={nameInput}
          onChange={(event) => {
            setNameInput(normalizePlayerNameInput(event.target.value));
            if (validationError !== null) {
              setValidationError(validatePlayerName(normalizePlayerNameInput(event.target.value)));
            }
          }}
        />
      </label>
      {validationError && (
        <p className="save-form-error" role="alert">
          {validationError === 'blocked' ? t('scoreboard.nameErrorBlocked') : t('scoreboard.nameErrorLength')}
        </p>
      )}
      <button type="submit">{t('action.saveScore')}</button>
    </form>
  );
};
