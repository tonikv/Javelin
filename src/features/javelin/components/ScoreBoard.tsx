import { memo, useMemo, type ReactElement } from 'react';
import type { HighscoreEntry } from '../game/types';
import { useI18n } from '../../../i18n/init';

type ScoreBoardProps = {
  highscores: HighscoreEntry[];
};

const ScoreBoardComponent = ({ highscores }: ScoreBoardProps): ReactElement => {
  const { t, formatNumber, locale } = useI18n();
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
    [locale]
  );

  return (
    <section className="card scoreboard" aria-label={t('scoreboard.title')}>
      <h3>{t('scoreboard.title')}</h3>
      {highscores.length === 0 ? (
        <p>{t('scoreboard.empty')}</p>
      ) : (
        <ol>
          {highscores.map((entry) => (
            <li key={entry.id}>
              <span>{entry.name}</span>
              <strong>{formatNumber(entry.distanceM)} m</strong>
              <time>
                {dateFormatter.format(new Date(entry.playedAtIso))}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export const ScoreBoard = memo(ScoreBoardComponent);
