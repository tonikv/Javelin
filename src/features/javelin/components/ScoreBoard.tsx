import type { ReactElement } from 'react';
import type { HighscoreEntry } from '../game/types';
import { useI18n } from '../../../i18n/init';

type ScoreBoardProps = {
  highscores: HighscoreEntry[];
};

export const ScoreBoard = ({ highscores }: ScoreBoardProps): ReactElement => {
  const { t, formatNumber, locale } = useI18n();

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
                {new Intl.DateTimeFormat(locale, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).format(new Date(entry.playedAtIso))}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
