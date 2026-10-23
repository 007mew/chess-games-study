import React, { useState } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { GameMetadata } from './GameMetadata';
import { MoveList } from './MoveList';
import { GameLibrary } from './GameLibrary';
import { Swords, FolderKanban } from 'lucide-react';

interface LeftColumnProps {
  onOpenImport: () => void;
  onOpenNewGame: () => void;
  onOpenEditGame: (gameId?: string) => void;
}

export const LeftColumn: React.FC<LeftColumnProps> = ({
  onOpenImport,
  onOpenNewGame,
  onOpenEditGame,
}) => {
  const { games, selectGame, currentGame } = useChessStudy();
  const [activeTab, setActiveTab] = useState<'moves' | 'library'>('moves');

  const handleSelectGameAndStudy = (gameId: string) => {
    selectGame(gameId);
    setActiveTab('moves');
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex flex-col border-r border-slate-800 bg-[#090d16] h-[calc(100vh-53px)] select-none shrink-0 overflow-hidden">
      {/* Top Segmented Tabs: Move Tree vs Study Library */}
      <div className="flex border-b border-slate-800 bg-[#090d16] p-1.5 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('moves')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'moves'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="View move tree and notations for current game"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Move Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'library'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Browse, search, edit and manage game collection"
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Library</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'library'
                ? 'bg-emerald-800 text-emerald-100'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {games.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'moves' ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <GameMetadata
            onOpenEdit={() => onOpenEditGame(currentGame.id)}
            onSwitchToLibrary={() => setActiveTab('library')}
          />
          <MoveList />
        </div>
      ) : (
        <GameLibrary
          onOpenNewGame={onOpenNewGame}
          onOpenImport={onOpenImport}
          onOpenEditGame={(id) => onOpenEditGame(id)}
          onSelectGameAndStudy={handleSelectGameAndStudy}
        />
      )}
    </aside>
  );
};
