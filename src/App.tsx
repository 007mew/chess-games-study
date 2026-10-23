import React, { useState } from 'react';
import { ChessStudyProvider } from './context/ChessStudyContext';
import { Header } from './components/Header';
import { LeftColumn } from './components/LeftColumn/LeftColumn';
import { MiddleColumn } from './components/MiddleColumn/MiddleColumn';
import { StrategicNotebook } from './components/RightColumn/StrategicNotebook';
import { MobileNavBar, MobileTab } from './components/MobileNavBar';
import { ImportPgnModal } from './components/Modals/ImportPgnModal';
import { ExportPgnModal } from './components/Modals/ExportPgnModal';
import { HelpModal } from './components/Modals/HelpModal';
import { EditGameModal } from './components/Modals/EditGameModal';
import { NewGameModal } from './components/Modals/NewGameModal';

export const AppContent: React.FC = () => {
  const [mobileTab, setMobileTab] = useState<MobileTab>('board');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNewGameOpen, setIsNewGameOpen] = useState(false);
  const [editGameId, setEditGameId] = useState<string | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleOpenEditGame = (gameId?: string) => {
    setEditGameId(gameId);
    setIsEditOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans select-none overflow-x-hidden">
      {/* Top Header */}
      <Header
        onOpenImport={() => setIsImportOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenNewGame={() => setIsNewGameOpen(true)}
        onOpenEditGame={() => handleOpenEditGame()}
      />

      {/* Main 3-Column Desktop Layout / Adaptive Mobile Views */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: Library & Game Navigation (20-25%) */}
        <div
          className={`w-full lg:w-72 xl:w-80 shrink-0 ${
            mobileTab === 'moves' || mobileTab === 'library'
              ? 'flex flex-col'
              : 'hidden lg:flex'
          }`}
        >
          <LeftColumn
            onOpenImport={() => setIsImportOpen(true)}
            onOpenNewGame={() => setIsNewGameOpen(true)}
            onOpenEditGame={handleOpenEditGame}
            forceTab={mobileTab === 'library' ? 'library' : 'moves'}
            onSelectGame={() => setMobileTab('board')}
          />
        </div>

        {/* Middle Column: Interactive Chessboard & Controls (45-50%) */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            mobileTab === 'board' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <MiddleColumn
            onOpenNotebook={() => setMobileTab('notebook')}
            onOpenMoves={() => setMobileTab('moves')}
          />
        </div>

        {/* Right Column: Middlegame Strategic Notebook (30-35%) */}
        <div
          className={`w-full lg:w-80 xl:w-96 shrink-0 ${
            mobileTab === 'notebook' ? 'flex flex-col' : 'hidden lg:flex'
          }`}
        >
          <StrategicNotebook />
        </div>
      </div>

      {/* Mobile Persistent Bottom Navigation Bar */}
      <MobileNavBar activeTab={mobileTab} onSelectTab={setMobileTab} />

      {/* Modals */}
      <ImportPgnModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
      <ExportPgnModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <NewGameModal isOpen={isNewGameOpen} onClose={() => setIsNewGameOpen(false)} />
      <EditGameModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditGameId(undefined);
        }}
        gameId={editGameId}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ChessStudyProvider>
      <AppContent />
    </ChessStudyProvider>
  );
};

export default App;
