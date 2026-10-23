import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useChessStudy } from '../../context/ChessStudyContext';
import { Sparkles, CheckCircle2, AlertCircle, Eye, Trophy } from 'lucide-react';

export const GuessThePlanPanel: React.FC = () => {
  const {
    guessPlanState,
    setGuessHypothesis,
    revealGmMove,
    moveHistory,
    currentPly,
    toggleGuessPlanMode,
    currentAnnotation,
  } = useChessStudy();

  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  if (!guessPlanState.isActive) return null;

  const targetMove = moveHistory[currentPly];
  const isWhite = currentPly % 2 === 0;
  const sideToMove = isWhite ? 'White' : 'Black';
  const moveNumber = Math.floor(currentPly / 2) + 1;

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (guessPlanState.feedback === 'correct' && lastFeedback !== 'correct') {
    triggerConfetti();
    setLastFeedback('correct');
  }

  return (
    <div className="w-full bg-[#090d16] border border-amber-500/40 rounded-xl p-3.5 shadow-xl select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
              <span>"Guess the Plan" Solitaire Training</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                Move {moveNumber} ({sideToMove})
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Formulate the master's positional plan, then play the move on the board!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono">
            <span className="text-slate-400">Score: </span>
            <span className="text-amber-400 font-bold">{guessPlanState.score} pts</span>
          </div>

          <button
            onClick={toggleGuessPlanMode}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline"
          >
            Exit Mode
          </button>
        </div>
      </div>

      {/* Plan Hypothesis Input */}
      <div className="mt-2 space-y-2">
        <label className="text-[11px] font-medium text-slate-300 block">
          Step 1: Write your 1-sentence hypothesis of {sideToMove}'s plan:
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={guessPlanState.hypothesis}
            onChange={(e) => setGuessHypothesis(e.target.value)}
            placeholder={`e.g., "${sideToMove} initiates the pawn break e4 to soften the d5 weakness and mobilize the knight..."`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Step 2: Drag and drop the piece on the board above to play your chosen move!
        </p>
      </div>

      {/* Feedback & Result Card */}
      {guessPlanState.feedback !== 'idle' && (
        <div
          className={`mt-3 p-2.5 rounded-lg border text-xs flex items-start space-x-2.5 ${
            guessPlanState.feedback === 'correct'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          {guessPlanState.feedback === 'correct' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 space-y-1">
            <div className="font-semibold">
              {guessPlanState.feedback === 'correct'
                ? 'Excellent Strategic Move!'
                : 'Not the Grandmaster Move'}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {guessPlanState.feedbackMessage}
            </p>
            {guessPlanState.feedback === 'correct' && currentAnnotation?.noteMarkdown && (
              <div className="mt-1.5 p-2 bg-[#090d16] rounded border border-emerald-500/20 text-[11px] text-slate-300">
                <span className="font-bold text-amber-300 block mb-0.5">GM Insight:</span>
                <span className="line-clamp-2">{currentAnnotation.noteMarkdown.slice(0, 150)}...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action footer */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">
          Attempts: {guessPlanState.attempts}
        </span>

        <button
          onClick={revealGmMove}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs font-medium"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reveal GM Move ({targetMove?.san})</span>
        </button>
      </div>
    </div>
  );
};
