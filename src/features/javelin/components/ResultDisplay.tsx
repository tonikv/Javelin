/**
 * Result message and throw-spec presentation for the current round.
 * Purely visual component that consumes already-derived result data.
 */
import type { ReactElement } from 'react';
import { useI18n } from '../../../i18n/init';
import type { ResultThrowSpecs } from '../hooks/useResultMessage';

type ResultDisplayProps = {
  resultMessage: string;
  resultStatusMessage: string | null;
  isFoulMessage: boolean;
  resultThrowSpecs: ResultThrowSpecs | null;
};

export const ResultDisplay = ({
  resultMessage,
  resultStatusMessage,
  isFoulMessage,
  resultThrowSpecs
}: ResultDisplayProps): ReactElement => {
  const { t, formatNumber } = useI18n();

  return (
    <>
      <p
        className={`result-live ${isFoulMessage ? 'is-foul' : ''}`}
        aria-live="polite"
      >
        {resultMessage}
      </p>
      {resultStatusMessage && (
        <p className={`result-note ${isFoulMessage ? 'is-foul' : ''}`}>{resultStatusMessage}</p>
      )}
      {resultThrowSpecs !== null && (
        <div className="result-specs">
          <span className="score-chip">
            {t('spec.wind')}:{' '}
            {resultThrowSpecs.windMs >= 0 ? '+' : ''}
            {formatNumber(resultThrowSpecs.windMs)} m/s
          </span>
          <span className="score-chip">
            {t('spec.angle')}: {formatNumber(resultThrowSpecs.angleDeg, 0)}°
          </span>
          <span className="score-chip">
            {t('spec.launchSpeed')}: {formatNumber(resultThrowSpecs.launchSpeedMs)} m/s
          </span>
        </div>
      )}
    </>
  );
};
