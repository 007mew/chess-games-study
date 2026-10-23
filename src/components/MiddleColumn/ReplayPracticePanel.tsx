import React, { useMemo } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import {
  Swords,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Eye,
  RotateCcw,
  Trophy,
  Flame,
  Clock,
  ArrowRight,
  Shuffle,
  X,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ReplayPracticeSide } from '../../types/chess';

export const ReplayPracticePanel: React.FC = () => {
  const {
    replayPracticeState,
    currentGame,
    moveHistory,
    currentPly,
    stopReplayPractice,
    setReplayPracticeSide,
    giveReplayHint,
    skipReplayMove,
    restartReplayPractice,
    toggleReplayAutoFlip,
    setReplayOpponentDelay,
    currentAnnotation,
    startReplayPractice,
  } = useChessStudy();

  if (!replayPracticeState.isActive) return null;

  const totalMoves = moveHistory.length;
  const currentMoveNum = currentPly === 0 ? 1 : Math.floor(currentPly / 2) + 1;
  const isWhiteTurn = currentPly % 2 === 0;
  const turnColor = isWhiteTurn ? 'White' : 'Black';
  const playerOnTurn = isWhiteTurn ? currentGame.white : currentGame.black;
  const targetMove = moveHistory[currentPly];

  // Determine if it is the human user's turn
  const isUserTurn =
    !replayPracticeState.isWaitingForOpponent &&
    !replayPracticeState.isCompleted &&
    (replayPracticeState.side === 'both' ||
      (replayPracticeState.side === 'white' && isWhiteTurn) ||
      (replayPracticeState.side === 'black' && !isWhiteTurn));

  // Calculate drill progress
  const progressPercent = useMemo(() => {
    if (replayPracticeState.totalMovesInDrill <= 0) return 0;
    return Math.min(
      100,
      Math.round((replayPracticeState.movesCompleted / replayPracticeState.totalMovesInDrill) * 100)
    );
  }, [replayPracticeState.movesCompleted, replayPracticeState.totalMovesInDrill]);

  // Calculate 1st try accuracy
  const accuracyPercent = useMemo(() => {
    if (replayPracticeState.movesCompleted === 0) return 100;
    return Math.round(
      (replayPracticeState.correctFirstTry / Math.max(1, replayPracticeState.movesCompleted)) * 100
    );
  }, [replayPracticeState.movesCompleted, replayPracticeState.correctFirstTry]);

  return (
    <div className="w-full bg-[#090d16] border border-emerald-500/40 rounded-xl p-3 sm:p-4 shadow-xl select-none transition-all">
      {/* Top Header: Title, Matchup, Stats & Exit */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                Replay & Practice Mode
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {replayPracticeState.side === 'white'
                  ? 'Playing White'
                  : replayPracticeState.side === 'black'
                  ? 'Playing Black'
                  : 'Playing Both Sides'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentGame.white} vs. {currentGame.black} ({currentGame.year})
            </p>
          </div>
        </div>

        {/* Stats Chips & Exit */}
        <div className="flex items-center space-x-2">
          {/* Accuracy Chip */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono"
            title="First-try accuracy"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-semibold">{accuracyPercent}%</span>
          </div>

          {/* Streak Chip */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono"
            title={`Current streak: ${replayPracticeState.currentStreak} (Best: ${replayPracticeState.bestStreak})`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-orange-400 font-bold">{replayPracticeState.currentStreak}</span>
          </div>

          {/* Exit Button */}
          <button
            onClick={stopReplayPractice}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Exit Replay Practice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side Selector Bar: "Practice from both sides" */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-[10px] text-slate-400 px-2 font-medium">Practice Side:</span>

          {/* White Button */}
          <button
            onClick={() => setReplayPracticeSide('white')}
            className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-all ${
              replayPracticeState.side === 'white'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300 inline-block shadow-sm" />
            <span>White ({currentGame.white.split(' ').pop()})</span>
          </button>

          {/* Black Button */}
          <button
            onClick={() => setReplayPracticeSide('black')}
            className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-all ${
              replayPracticeState.side === 'black'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-500 inline-block shadow-sm" />
            <span>Black ({currentGame.black.split(' ').pop()})</span>
          </button>

          {/* Both Sides Button */}
          <button
            onClick={() => setReplayPracticeSide('both')}
            className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center space-x-1.5 transition-all ${
              replayPracticeState.side === 'both'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Both Sides</span>
          </button>
        </div>

        {/* Start Position Jump */}
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => startReplayPractice(replayPracticeState.side, 0)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/80 transition-colors"
            title="Start practice from Move 1"
          >
            Move 1
          </button>
          <button
            onClick={() => startReplayPractice(replayPracticeState.side, 20)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/80 transition-colors"
            title="Start practice from Middlegame (Move 10)"
          >
            Move 10
          </button>
          <button
            onClick={restartReplayPractice}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors"
            title="Restart current drill"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
          <span>
            Move {currentMoveNum} of {Math.ceil(totalMoves / 2)} (Ply {currentPly}/{totalMoves})
          </span>
          <span className="font-semibold text-emerald-400">
            {replayPracticeState.movesCompleted} / {replayPracticeState.totalMovesInDrill} moves completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-[#020617] h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Turn & Status Alert Bar */}
      <div className="mt-3">
        {replayPracticeState.isCompleted ? (
          /* Completion Victory Card */
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/50 text-xs shadow-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                <h4 className="font-bold text-sm text-emerald-300">
                  Game Practice Completed! 🎉
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 text-[11px]">
                {accuracyPercent}% Final Accuracy
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Brilliant work! You completed the full drill for{' '}
              <strong className="text-white">
                {replayPracticeState.side === 'white'
                  ? `White (${currentGame.white})`
                  : replayPracticeState.side === 'black'
                  ? `Black (${currentGame.black})`
                  : 'Both White & Black'}
              </strong>
              . You tested positional intuition, tactical foresight, and deep grandmaster plans.
            </p>

            {/* Quick Switch Side CTA */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs">
                {replayPracticeState.side === 'white' && (
                  <button
                    onClick={() => setReplayPracticeSide('black')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-colors"
                  >
                    <span>Now Practice from Black's side ({currentGame.black})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {replayPracticeState.side === 'black' && (
                  <button
                    onClick={() => setReplayPracticeSide('white')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-colors"
                  >
                    <span>Now Practice from White's side ({currentGame.white})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {replayPracticeState.side === 'both' && (
                  <button
                    onClick={() => setReplayPracticeSide('white')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-colors"
                  >
                    <span>Practice White Only</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={restartReplayPractice}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                >
                  Practice Again
                </button>
                <button
                  onClick={stopReplayPractice}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                >
                  Return to Study Mode
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Ongoing Turn Banner */
          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              replayPracticeState.isWaitingForOpponent
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : isUserTurn
                ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {replayPracticeState.isWaitingForOpponent ? (
                <Clock className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
              ) : isUserTurn ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              ) : (
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              )}

              <div>
                <div className="font-semibold flex items-center space-x-1.5">
                  <span>
                    {replayPracticeState.isWaitingForOpponent
                      ? `${playerOnTurn} is making their move...`
                      : isUserTurn
                      ? `Your Turn: Play ${turnColor}'s move (${playerOnTurn})`
                      : `${turnColor} to move (${playerOnTurn})`}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-700 rounded text-slate-300">
                    Move {currentMoveNum}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {replayPracticeState.feedbackMessage ||
                    'Drag and drop the piece on the board to execute the master move.'}
                </p>
              </div>
            </div>

            {/* Hint & Skip Buttons */}
            {isUserTurn && (
              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                <button
                  onClick={giveReplayHint}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    replayPracticeState.hintLevel > 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title={
                    replayPracticeState.hintLevel === 0
                      ? 'Hint 1: Highlight piece to move'
                      : 'Hint 2: Show arrow to target square'
                  }
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {replayPracticeState.hintLevel === 0
                      ? 'Hint'
                      : replayPracticeState.hintLevel === 1
                      ? 'Target Arrow'
                      : 'Full Hint'}
                  </span>
                </button>

                <button
                  onClick={skipReplayMove}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  title="Reveal the master's move and advance"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reveal Move</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Strategic Note Callout (if active move has study annotations) */}
      {currentAnnotation && currentAnnotation.noteMarkdown && (
        <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-[11px] text-emerald-200/90 flex items-start space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="overflow-hidden">
            <span className="font-bold text-emerald-300 block mb-0.5">Master Strategic Idea:</span>
            <span className="line-clamp-2 text-slate-300">
              {currentAnnotation.noteMarkdown.split('\n')[0].replace(/[*#]/g, '').trim()}
            </span>
          </div>
        </div>
      )}

      {/* Settings Row: Opponent Speed & Auto-Flip */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          {/* Opponent response delay */}
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Opponent Pace:</span>
            <select
              value={replayPracticeState.opponentDelay}
              onChange={(e) => setReplayOpponentDelay(Number(e.target.value))}
              className="bg-slate-800 text-slate-200 rounded px-1.5 py-0.5 border border-slate-700 text-[10px] outline-none cursor-pointer"
            >
              <option value={300}>Instant (0.3s)</option>
              <option value={600}>Normal (0.6s)</option>
              <option value={1200}>Deliberate (1.2s)</option>
            </select>
          </div>

          {/* Auto-flip toggle for both sides */}
          {replayPracticeState.side === 'both' && (
            <label className="flex items-center space-x-1.5 cursor-pointer hover:text-slate-300">
              <input
                type="checkbox"
                checked={replayPracticeState.autoFlip}
                onChange={toggleReplayAutoFlip}
                className="rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span>Auto-flip board on turn</span>
            </label>
          )}
        </div>

        <span className="text-slate-500 hidden sm:inline">
          Press 'F' anytime to flip board perspective manually
        </span>
      </div>
    </div>
  );
};
