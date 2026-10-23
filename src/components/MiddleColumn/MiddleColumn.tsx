import React from 'react';
import { ChessBoardView } from './ChessBoardView';
import { BoardControls } from './BoardControls';
import { MarkupToolbar } from './MarkupToolbar';
import { EvalBar } from './EvalBar';
import { GuessThePlanPanel } from './GuessThePlanPanel';
import { ReplayPracticePanel } from './ReplayPracticePanel';
import { useChessStudy } from '../../context/ChessStudyContext';
import { BookOpen, ListOrdered, Sparkles } from 'lucide-react';

interface MiddleColumnProps {
  onOpenNotebook?: () => void;
  onOpenMoves?: () => void;
}

export const MiddleColumn: React.FC<MiddleColumnProps> = ({
  onOpenNotebook,
  onOpenMoves,
}) => {
  const { currentGame, currentPly, currentAnnotation } = useChessStudy();

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-3 pb-24 lg:pb-4 overflow-y-auto space-y-2.5 bg-[#020617] min-h-0 w-full">
      {/* "Replay & Practice" Drill Banner (only visible when practice drill is active) */}
      <div className="w-full max-w-[540px] xl:max-w-[580px]">
        <ReplayPracticePanel />
      </div>

      {/* "Guess the Plan" Banner (only visible when Guess the Plan is active) */}
      <div className="w-full max-w-[540px] xl:max-w-[580px]">
        <GuessThePlanPanel />
      </div>

      {/* The Chessboard: shifted directly to the top */}
      <div className="w-full flex justify-center">
        <ChessBoardView />
      </div>

      {/* Control Dock Below the Board */}
      <div className="w-full max-w-[540px] xl:max-w-[580px] space-y-2">
        {/* Navigation & Playback Controls */}
        <BoardControls />

        {/* Board Markup Toolbar */}
        <MarkupToolbar />

        {/* Engine Evaluation & Strategic Hint Bar */}
        <EvalBar />

        {/* Mobile-only Quick-Link Status Card */}
        <div className="lg:hidden w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                {currentPly === 0 ? 'Start Position' : `Ply ${currentPly}`}
              </span>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[190px]">
                {currentGame.white} vs {currentGame.black}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {currentGame.primaryPawnStructure}
            </span>
          </div>

          {/* Quick note snippet if notes exist on this move */}
          {currentAnnotation?.noteMarkdown && (
            <div className="p-2 rounded-lg bg-[#020617] border border-slate-800 text-[11px] text-slate-300">
              <div className="flex items-center space-x-1 text-emerald-400 font-semibold mb-0.5 text-[10px]">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Move Note Preview:</span>
              </div>
              <p className="line-clamp-2 text-slate-300 font-sans italic">
                "{currentAnnotation.noteMarkdown.split('\n')[0].replace(/[*#]/g, '').trim()}"
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-0.5">
            {onOpenNotebook && (
              <button
                type="button"
                onClick={onOpenNotebook}
                className="flex-1 py-2 px-2.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open GM Notes & Plans</span>
              </button>
            )}
            {onOpenMoves && (
              <button
                type="button"
                onClick={onOpenMoves}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Move Tree</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
