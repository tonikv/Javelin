import type { ReactElement } from 'react';
import { useMediaQuery } from '../../app/useMediaQuery';
import { useI18n } from '../../i18n/init';
import { DevAdminPanel } from './components/DevAdminPanel';
import { GameActions } from './components/GameActions';
import { GameCanvas } from './components/GameCanvas';
import { HudPanel } from './components/HudPanel';
import { ResultPanel } from './components/ResultPanel';
import { ScoreboardPanel } from './components/ScoreboardPanel';
import { TopBar } from './components/TopBar';
import { useJavelinSession } from './hooks/useJavelinSession';
import { useLeaderboardController } from './hooks/useLeaderboardController';

export const JavelinPage = (): ReactElement => {
  const { t, locale } = useI18n();
  const isCompactLayout = useMediaQuery('(max-width: 1023px)');
  const {
    state,
    dispatch,
    difficultyUnlocks,
    devAdmin,
    resultMessage,
    resultStatusMessage,
    isFoulMessage,
    resultThrowSpecs
  } = useJavelinSession();

  const leaderboard = useLeaderboardController({
    dispatch,
    locale,
    state,
    t,
    isGlobalSubmitBlocked: devAdmin.isGlobalSubmitBlocked
  });

  return (
    <main className="page">
      <TopBar appTitle={t('app.title')} gameTitle={t('javelin.title')} />

      <section className="layout">
        <div className="main-column">
          <HudPanel state={state} />
          <GameCanvas state={state} dispatch={dispatch} />
          <GameActions state={state} dispatch={dispatch} difficultyUnlocks={difficultyUnlocks} />
          {devAdmin.enabled && (
            <DevAdminPanel
              settings={devAdmin.settings}
              canApplyTuning={devAdmin.canApplyTuning}
              onSetUnlockAllDifficulties={devAdmin.setUnlockAllDifficulties}
              onResetUnlockProgression={devAdmin.resetUnlockProgression}
              onApplyTuningOverrides={devAdmin.applyTuningOverrides}
              onResetTuningOverrides={devAdmin.resetTuningOverrides}
              onResetAll={devAdmin.resetAll}
            />
          )}

          <ResultPanel
            state={state}
            resultMessage={resultMessage}
            resultStatusMessage={resultStatusMessage}
            isFoulMessage={isFoulMessage}
            resultThrowSpecs={resultThrowSpecs}
            canSaveScore={leaderboard.canSaveScore}
            defaultName={t('scoreboard.defaultName')}
            onSaveScore={leaderboard.saveScore}
            shouldShowGlobalBlockedNote={leaderboard.shouldShowGlobalBlockedNote}
            showHighscoreBadge={leaderboard.showHighscoreBadge}
            globalSubmitBlockedLabel={t('scoreboard.globalSubmitDisabledDev')}
            highscoreBadgeLabel={t('result.highscore')}
          />
        </div>

        <ScoreboardPanel
          highscores={leaderboard.displayedHighscores}
          mode={leaderboard.leaderboardMode}
          onModeChange={leaderboard.setLeaderboardMode}
          onResetLocalScores={leaderboard.clearLocalHighscores}
          onRefreshGlobalScores={() => {
            void leaderboard.refreshGlobalHighscores();
          }}
          isGlobalLoading={leaderboard.isGlobalLoading}
          isGlobalAvailable={leaderboard.isGlobalAvailable}
          globalHasError={leaderboard.hasGlobalError}
          globalErrorKind={leaderboard.globalErrorKind}
          scoreboardTitle={leaderboard.scoreboardTitle}
          scoreboardEmptyMessage={leaderboard.scoreboardEmptyMessage}
          isCompactLayout={isCompactLayout}
        />
      </section>
    </main>
  );
};
