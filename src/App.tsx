import React, { useState } from 'react';
import { ChessStudyProvider } from './context/ChessStudyContext';
import { Header } from './components/Header';
import { LeftColumn } from './components/LeftColumn/LeftColumn';
import { MiddleColumn } from './components/MiddleColumn/MiddleColumn';
import { StrategicNotebook } from './components/RightColumn/StrategicNotebook';
import { ImportPgnModal } from './components/Modals/ImportPgnModal';
import { ExportPgnModal } from './components/Modals/ExportPgnModal';
import { HelpModal } from './components/Modals/HelpModal';
import { EditGameModal } from './components/Modals/EditGameModal';
import { NewGameModal } from './components/Modals/NewGameModal';

export const AppContent: React.FC = () => {
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

      {/* Main 3-Column Desktop Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Library & Game Navigation (20-25%) */}
        <LeftColumn
          onOpenImport={() => setIsImportOpen(true)}
          onOpenNewGame={() => setIsNewGameOpen(true)}
          onOpenEditGame={handleOpenEditGame}
        />

        {/* Middle Column: Interactive Chessboard & Controls (45-50%) */}
        <MiddleColumn />

        {/* Right Column: Middlegame Strategic Notebook (30-35%) */}
        <StrategicNotebook />
      </div>

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
