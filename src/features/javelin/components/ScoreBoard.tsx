import { memo, useMemo, type ReactElement } from 'react';
import type { HighscoreEntry } from '../game/types';
import { useI18n } from '../../../i18n/init';

type ScoreBoardProps = {
  highscores: HighscoreEntry[];
};

type ScoreBoardContentProps = {
  highscores: HighscoreEntry[];
};

const ScoreBoardContentComponent = ({ highscores }: ScoreBoardContentProps): ReactElement => {
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

  if (highscores.length === 0) {
    return <p className="scoreboard-empty">{t('scoreboard.empty')}</p>;
  }

  return (
    <ol className="scoreboard-list">
      {highscores.map((entry) => (
        <li key={entry.id} className="scoreboard-entry">
          <span>{entry.name}</span>
          <strong>{formatNumber(entry.distanceM)} m</strong>
          <time>{dateFormatter.format(new Date(entry.playedAtIso))}</time>
        </li>
      ))}
    </ol>
  );
};

export const ScoreBoardContent = memo(ScoreBoardContentComponent);

const ScoreBoardComponent = ({ highscores }: ScoreBoardProps): ReactElement => {
  const { t } = useI18n();

  return (
    <section className="card scoreboard" aria-label={t('scoreboard.title')}>
      <h3>{t('scoreboard.title')}</h3>
      <ScoreBoardContent highscores={highscores} />
    </section>
  );
};

export const ScoreBoard = memo(ScoreBoardComponent);
