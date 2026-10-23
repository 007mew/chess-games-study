import React from 'react';
import { ChessBoardView } from './ChessBoardView';
import { BoardControls } from './BoardControls';
import { MarkupToolbar } from './MarkupToolbar';
import { EvalBar } from './EvalBar';
import { GuessThePlanPanel } from './GuessThePlanPanel';
import { ReplayPracticePanel } from './ReplayPracticePanel';

export const MiddleColumn: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-3 overflow-y-auto space-y-2.5 bg-[#020617] min-h-0">
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

        {/* Engine Evaluation & Strategic Hint Bar - shifted down here */}
        <EvalBar />
      </div>
    </main>
  );
};
