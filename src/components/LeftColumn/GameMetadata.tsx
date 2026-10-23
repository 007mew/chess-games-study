import React, { useState } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import {
  Lightbulb,
  Calendar,
  Swords,
  Shuffle,
  Edit2,
  FolderKanban,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface GameMetadataProps {
  onOpenEdit?: () => void;
  onSwitchToLibrary?: () => void;
}

export const GameMetadata: React.FC<GameMetadataProps> = ({
  onOpenEdit,
  onSwitchToLibrary,
}) => {
  const { currentGame, startReplayPractice } = useChessStudy();
  const [ideaExpanded, setIdeaExpanded] = useState(true);

  return (
    <div className="p-2.5 border-b border-slate-800 bg-[#090d16] text-xs space-y-2 select-none">
      {/* Top action row: Switch game & Edit game */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSwitchToLibrary}
          className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition-colors"
          title="Browse & switch games in library"
        >
          <FolderKanban className="w-3 h-3 text-emerald-400" />
          <span>Switch Game</span>
        </button>

        <button
          onClick={onOpenEdit}
          className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition-colors"
          title="Edit game metadata, players & structure"
        >
          <Edit2 className="w-3 h-3 text-sky-400" />
          <span>Edit Game</span>
        </button>
      </div>

      {/* Player matchup card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between font-semibold text-slate-200">
          <div className="flex items-center space-x-1.5 truncate max-w-[120px]">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 shrink-0" />
            <span className="truncate">{currentGame.white}</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-bold shrink-0 border border-slate-700/60">
            {currentGame.result}
          </span>
          <div className="flex items-center space-x-1.5 truncate max-w-[120px]">
            <span className="truncate">{currentGame.black}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-600 shrink-0" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/60">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{currentGame.year}</span>
          </span>
          <span className="truncate max-w-[130px] text-slate-400" title={currentGame.event}>
            {currentGame.event}
          </span>
          <span className="font-mono text-emerald-400 font-semibold">{currentGame.eco}</span>
        </div>
      </div>

      {/* Opening & Structure Badge */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 truncate max-w-[170px]" title={currentGame.openingName}>
          {currentGame.openingName}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
          {currentGame.primaryPawnStructure} Structure
        </span>
      </div>

      {/* Core Middlegame Idea Callout (Collapsible) */}
      {currentGame.keyMiddlegameIdea && (
        <div className="bg-amber-950/20 border border-amber-800/30 rounded-lg p-2 text-[11px] text-amber-200/90">
          <div
            onClick={() => setIdeaExpanded((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-1.5 font-bold text-amber-300 text-[10px] uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Middlegame Plan</span>
            </div>
            {ideaExpanded ? (
              <ChevronUp className="w-3 h-3 text-amber-400/70" />
            ) : (
              <ChevronDown className="w-3 h-3 text-amber-400/70" />
            )}
          </div>
          {ideaExpanded && (
            <p className="mt-1 leading-relaxed text-amber-100/90 text-[11px]">
              {currentGame.keyMiddlegameIdea}
            </p>
          )}
        </div>
      )}

      {/* Replay Practice Drill row */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-1.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
          <Swords className="w-3 h-3 text-emerald-400" />
          <span>Practice:</span>
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => startReplayPractice('white', 0)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors"
            title="Drill moves as White"
          >
            White
          </button>
          <button
            onClick={() => startReplayPractice('black', 0)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors"
            title="Drill moves as Black"
          >
            Black
          </button>
          <button
            onClick={() => startReplayPractice('both', 0)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition-colors flex items-center space-x-1"
            title="Drill both sides"
          >
            <Shuffle className="w-2.5 h-2.5" />
            <span>Both</span>
          </button>
        </div>
      </div>
    </div>
  );
};
