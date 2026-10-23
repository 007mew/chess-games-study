import React, { useEffect } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Pause,
  RotateCw,
  Gauge
} from 'lucide-react';

export const BoardControls: React.FC = () => {
  const {
    currentPly,
    moveHistory,
    firstMove,
    prevMove,
    nextMove,
    lastMove,
    flipBoard,
    isPlaying,
    toggleAutoPlay,
    playSpeed,
    setPlaySpeed,
  } = useChessStudy();

  const totalMoves = moveHistory.length;
  const currentMoveNum = currentPly === 0 ? 0 : Math.floor((currentPly - 1) / 2) + 1;
  const currentTurn = currentPly === 0 ? 'Start' : currentPly % 2 === 1 ? 'White' : 'Black';

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevMove();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextMove();
          break;
        case 'ArrowUp':
          e.preventDefault();
          firstMove();
          break;
        case 'ArrowDown':
          e.preventDefault();
          lastMove();
          break;
        case ' ':
          e.preventDefault();
          toggleAutoPlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          flipBoard();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevMove, nextMove, firstMove, lastMove, toggleAutoPlay, flipBoard]);

  return (
    <div className="w-full bg-[#090d16] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between select-none shadow-md">
      {/* Current Move & Turn Indicator */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="font-mono bg-slate-900/90 px-2 py-1 rounded-md text-emerald-400 font-semibold border border-slate-800">
          Ply {currentPly} / {totalMoves}
        </span>
        <span className="text-slate-400 hidden sm:inline">
          {currentPly === 0 ? 'Starting Position' : `Move ${currentMoveNum} (${currentTurn})`}
        </span>
      </div>

      {/* Main Navigation Buttons */}
      <div className="flex items-center space-x-1">
        <button
          onClick={firstMove}
          disabled={currentPly === 0}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 transition-colors"
          title="First Move (Up Arrow)"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={prevMove}
          disabled={currentPly === 0}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 transition-colors"
          title="Previous Move (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={toggleAutoPlay}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
            isPlaying
              ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
          }`}
          title="Auto-Play Game (Spacebar)"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          onClick={nextMove}
          disabled={currentPly >= totalMoves}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 transition-colors"
          title="Next Move (Right Arrow)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={lastMove}
          disabled={currentPly >= totalMoves}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 transition-colors"
          title="Last Move (Down Arrow)"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Speed & Flip Controls */}
      <div className="flex items-center space-x-2">
        {/* Play Speed selector */}
        <div className="flex items-center space-x-1 bg-slate-900/80 border border-slate-800 rounded-md px-1.5 py-0.5 text-[11px] text-slate-300">
          <Gauge className="w-3 h-3 text-slate-400" />
          <select
            value={playSpeed}
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
            className="bg-transparent text-slate-300 outline-none cursor-pointer text-xs"
            title="Auto-play pace"
          >
            <option value={800} className="bg-slate-900">Fast (0.8s)</option>
            <option value={1500} className="bg-slate-900">Normal (1.5s)</option>
            <option value={3000} className="bg-slate-900">Study (3.0s)</option>
          </select>
        </div>

        {/* Flip Board button */}
        <button
          onClick={flipBoard}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          title="Flip Board View ('F' key)"
        >
          <RotateCw className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
