import React, { useState, useMemo } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { PawnStructureType } from '../../types/chess';
import {
  Search,
  Plus,
  Upload,
  Edit2,
  Copy,
  Trash2,
  Trophy,
  Filter,
  RotateCcw,
  CheckCircle2,
  Swords,
  BookOpen,
  X
} from 'lucide-react';

interface GameLibraryProps {
  onOpenNewGame: () => void;
  onOpenImport: () => void;
  onOpenEditGame: (gameId: string) => void;
  onSelectGameAndStudy: (gameId: string) => void;
}

export const GameLibrary: React.FC<GameLibraryProps> = ({
  onOpenNewGame,
  onOpenImport,
  onOpenEditGame,
  onSelectGameAndStudy,
}) => {
  const {
    games,
    currentGame,
    selectGame,
    structureFilter,
    setStructureFilter,
    duplicateGame,
    deleteGame,
    resetAllGamesToPresets,
  } = useChessStudy();

  const [searchQuery, setSearchQuery] = useState('');

  const structureOptions: { id: PawnStructureType | 'All'; label: string }[] = [
    { id: 'All', label: 'All' },
    { id: 'Carlsbad', label: 'Carlsbad' },
    { id: 'IQP', label: 'IQP' },
    { id: 'Hanging Pawns', label: 'Hanging' },
    { id: 'Closed', label: 'Closed' },
    { id: 'Open', label: 'Open' },
    { id: 'Benoni', label: 'Benoni' },
    { id: 'Custom', label: 'Custom' },
  ];

  // Filter games by structure and search query
  const filteredGames = useMemo(() => {
    let result = games;
    if (structureFilter !== 'All') {
      result = result.filter((g) => g.primaryPawnStructure === structureFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.white.toLowerCase().includes(q) ||
          g.black.toLowerCase().includes(q) ||
          g.event.toLowerCase().includes(q) ||
          g.openingName.toLowerCase().includes(q) ||
          g.eco.toLowerCase().includes(q) ||
          g.year.toString().includes(q) ||
          (g.keyMiddlegameIdea && g.keyMiddlegameIdea.toLowerCase().includes(q))
      );
    }
    return result;
  }, [games, structureFilter, searchQuery]);

  const countForStructure = (id: PawnStructureType | 'All') => {
    if (id === 'All') return games.length;
    return games.filter((g) => g.primaryPawnStructure === id).length;
  };

  const handleDelete = (e: React.MouseEvent, gameId: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Delete study game "${title}"?`)) {
      deleteGame(gameId);
    }
  };

  const handleDuplicate = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    duplicateGame(gameId);
  };

  const handleEdit = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    onOpenEditGame(gameId);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] select-none">
      {/* Top Action Bar */}
      <div className="p-2.5 border-b border-slate-800 bg-[#090d16] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Study Library
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
              {games.length}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onOpenNewGame}
              className="flex items-center space-x-1 px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors shadow-sm"
              title="Create a new study game"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
            <button
              onClick={onOpenImport}
              className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-[11px] font-medium border border-slate-800 transition-colors"
              title="Import PGN or Web Link"
            >
              <Upload className="w-3 h-3 text-sky-400" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players, events, ECO..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Structure filter pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-thin">
          {structureOptions.map((opt) => {
            const isSelected = structureFilter === opt.id;
            const count = countForStructure(opt.id);
            if (count === 0 && opt.id !== 'All') return null;

            return (
              <button
                key={opt.id}
                onClick={() => setStructureFilter(opt.id)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap shrink-0 transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[9px] px-1 rounded-full ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Cards List */}
      <div className="flex-1 overflow-y-auto p-2 pb-10 lg:pb-2 space-y-2">
        {filteredGames.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 space-y-2">
            <p>No games found matching criteria.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-emerald-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredGames.map((game) => {
            const isCurrent = game.id === currentGame.id;
            const notesCount = Object.keys(game.annotations || {}).length;

            return (
              <div
                key={game.id}
                onClick={() => onSelectGameAndStudy(game.id)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all relative group ${
                  isCurrent
                    ? 'bg-emerald-950/30 border-emerald-500/80 ring-1 ring-emerald-500/40 shadow-md'
                    : 'bg-[#090d16] border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                {/* Top Row: Players & Result */}
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-slate-200 truncate pr-2 flex items-center space-x-1.5">
                    <span className="truncate max-w-[95px]">{game.white}</span>
                    <span className="text-slate-500 text-[10px] font-normal">vs</span>
                    <span className="truncate max-w-[95px]">{game.black}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${
                      game.result === '1-0'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : game.result === '0-1'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                        : 'bg-slate-800 text-amber-300 border border-slate-700'
                    }`}
                  >
                    {game.result}
                  </span>
                </div>

                {/* Sub row: Event, Year, ECO */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <div className="truncate max-w-[150px]">{game.event} ({game.year})</div>
                  <div className="font-mono text-emerald-400 font-semibold">{game.eco}</div>
                </div>

                {/* Structure badge & Annotations pill */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    {game.primaryPawnStructure}
                  </span>

                  <div className="flex items-center space-x-1">
                    {notesCount > 0 && (
                      <span className="text-[10px] text-amber-300 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded-full">
                        {notesCount} {notesCount === 1 ? 'note' : 'notes'}
                      </span>
                    )}

                    {/* Quick action buttons */}
                    <div className="flex items-center space-x-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleEdit(e, game.id)}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-emerald-300 transition-colors"
                        title="Edit metadata"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(e, game.id)}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-sky-300 transition-colors"
                        title="Duplicate study"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, game.id, `${game.white} vs ${game.black}`)}
                        className="p-1 rounded hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete game"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer bar */}
      <div className="p-2 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
        <button
          onClick={() => {
            if (window.confirm('Reset all games to the default grandmaster study collection? Any custom added games will be replaced.')) {
              resetAllGamesToPresets();
            }
          }}
          className="flex items-center space-x-1 text-slate-500 hover:text-slate-300 transition-colors"
          title="Restore factory default preset games"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Presets</span>
        </button>

        <span className="font-mono text-[10px] text-slate-500">
          Showing {filteredGames.length} of {games.length}
        </span>
      </div>
    </div>
  );
};
