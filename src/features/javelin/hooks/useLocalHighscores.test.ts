import { describe, expect, it } from 'vitest';
import { insertHighscoreSorted, pruneHighscores } from './useLocalHighscores';
import type { HighscoreEntry } from '../game/types';

const makeEntry = (name: string, distanceM: number, playedAtIso: string): HighscoreEntry => ({
  id: `${name}-${distanceM}`,
  name,
  distanceM,
  playedAtIso,
  locale: 'fi',
  windMs: 0
});

describe('highscore helpers', () => {
  it('inserts entries sorted by distance desc', () => {
    const list = [
      makeEntry('A', 72.1, '2026-02-21T09:00:00.000Z'),
      makeEntry('B', 66.3, '2026-02-21T09:01:00.000Z')
    ];
    const next = insertHighscoreSorted(list, makeEntry('C', 78.5, '2026-02-21T09:02:00.000Z'));
    expect(next.map((entry) => entry.name)).toEqual(['C', 'A', 'B']);
  });

  it('breaks ties with earliest timestamp first', () => {
    const list = [makeEntry('A', 70, '2026-02-21T10:00:00.000Z')];
    const next = insertHighscoreSorted(list, makeEntry('B', 70, '2026-02-21T09:00:00.000Z'));
    expect(next[0].name).toBe('B');
  });

  it('prunes to max size', () => {
    const list = Array.from({ length: 15 }, (_, index) =>
      makeEntry(`${index}`, 95 - index, `2026-02-21T09:${String(index).padStart(2, '0')}:00.000Z`)
    );
    expect(pruneHighscores(list, 10)).toHaveLength(10);
  });
});
