import React, { useMemo } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { Trophy, ChevronDown, Sparkles } from 'lucide-react';

export const GameSelector: React.FC = () => {
  const { games, currentGame, selectGame, structureFilter } = useChessStudy();

  const filteredGames = useMemo(() => {
    if (structureFilter === 'All') return games;
    return games.filter((g) => g.primaryPawnStructure === structureFilter);
  }, [games, structureFilter]);

  return (
    <div className="p-3 border-b border-slate-800 bg-[#090d16]">
      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center justify-between">
        <span className="flex items-center space-x-1">
          <Trophy className="w-3 h-3 text-amber-400" />
          <span>Model Master Game</span>
        </span>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded font-normal">
          {currentGame.primaryPawnStructure}
        </span>
      </label>

      <div className="relative">
        <select
          value={currentGame.id}
          onChange={(e) => selectGame(e.target.value)}
          className="w-full bg-[#020617] border border-slate-800 rounded-lg px-3 py-2 pr-8 text-xs font-semibold text-slate-100 appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-colors"
        >
          {filteredGames.map((game) => (
            <option key={game.id} value={game.id}>
              {game.white} vs {game.black} ({game.year}) – {game.primaryPawnStructure}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
      </div>
    </div>
  );
};
