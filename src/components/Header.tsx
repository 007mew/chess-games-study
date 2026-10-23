import React, { useState } from 'react';
import {
  BookOpen,
  Upload,
  Download,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Palette,
  Swords,
  Plus,
  Edit2,
  MoreVertical
} from 'lucide-react';
import { useChessStudy } from '../context/ChessStudyContext';
import { BOARD_THEMES } from '../utils/themes';
import { BoardThemeId } from '../types/chess';

export interface HeaderProps {
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenHelp: () => void;
  onOpenNewGame?: () => void;
  onOpenEditGame?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenExport,
  onOpenHelp,
  onOpenNewGame,
  onOpenEditGame,
}) => {
  const {
    boardTheme,
    setBoardTheme,
    guessPlanState,
    toggleGuessPlanMode,
    replayPracticeState,
    startReplayPractice,
    stopReplayPractice,
    resetCurrentGameToPreset,
    currentGame,
  } = useChessStudy();

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const themeList = Object.values(BOARD_THEMES);

  return (
    <header className="bg-[#090d16] border-b border-slate-800/80 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between sticky top-0 z-30 select-none shadow-lg">
      {/* Brand & Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold ring-1 ring-emerald-400/30 shrink-0">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center truncate">
              Grandmaster<span className="text-emerald-400">Notes</span>
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded shrink-0">
              MIDGAME STUDY
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block truncate">
            Positional plans, pawn structures & GM idea notebook
          </p>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        {/* Replay & Practice Mode Toggle */}
        <button
          onClick={() => {
            if (replayPracticeState.isActive) {
              stopReplayPractice();
            } else {
              startReplayPractice('white', 0);
            }
          }}
          className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-sm ${
            replayPracticeState.isActive
              ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-500/30 shadow-emerald-600/30'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
          }`}
          title="Practice and replay games from White, Black, or Both sides"
        >
          <Swords className={`w-3.5 h-3.5 ${replayPracticeState.isActive ? 'text-white' : 'text-emerald-400'}`} />
          <span className="hidden sm:inline">Practice</span>
          {replayPracticeState.isActive && (
            <span className="px-1 py-0.2 bg-white text-emerald-950 font-bold rounded-full text-[9px] sm:text-[10px]">
              {replayPracticeState.side === 'white'
                ? 'W'
                : replayPracticeState.side === 'black'
                ? 'B'
                : 'Both'}
            </span>
          )}
        </button>

        {/* "Guess the Plan" Solitaire Mode Button */}
        <button
          onClick={toggleGuessPlanMode}
          className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-sm ${
            guessPlanState.isActive
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-2 ring-amber-500/30'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
          }`}
          title="Toggle 'Guess the Plan' Solitaire training mode"
        >
          <Sparkles className={`w-3.5 h-3.5 ${guessPlanState.isActive ? 'text-amber-400 animate-spin' : 'text-amber-400'}`} />
          <span className="hidden md:inline">Guess Plan</span>
          {guessPlanState.isActive && (
            <span className="px-1 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[9px] sm:text-[10px]">
              ON
            </span>
          )}
        </button>

        {/* Board Theme Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu((prev) => !prev);
              setShowMobileMenu(false);
            }}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 hover:border-slate-700 transition-colors"
            title="Change Board Color Theme"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Theme</span>
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#090d16] border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 text-xs backdrop-blur-md">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800 flex items-center justify-between">
                <span>Board Themes</span>
                <span className="text-[10px] text-emerald-400 font-mono">5 styles</span>
              </div>
              {themeList.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setBoardTheme(opt.id as BoardThemeId);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                    boardTheme === opt.id ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="truncate">{opt.name}</span>
                    {boardTheme === opt.id && <span className="text-emerald-400 text-xs">●</span>}
                  </div>
                  <div className="flex w-6 h-5 rounded overflow-hidden border border-slate-700 shadow-sm shrink-0">
                    <div className="w-3 h-full" style={{ backgroundColor: opt.lightBg }} />
                    <div className="w-3 h-full" style={{ backgroundColor: opt.darkBg }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop-only action buttons */}
        <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2">
          {/* Reset annotations to preset */}
          <button
            onClick={() => {
              if (confirm(`Reset study notes for "${currentGame.white} vs ${currentGame.black}" to original model annotations?`)) {
                resetCurrentGameToPreset();
              }
            }}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Reset Game to Default Annotations"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* New Game Study */}
          {onOpenNewGame && (
            <button
              onClick={onOpenNewGame}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              title="Create a New Blank or Skeleton Study Game"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          )}

          {/* Edit Current Game Details */}
          {onOpenEditGame && (
            <button
              onClick={onOpenEditGame}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 hover:border-slate-700 transition-colors"
              title="Edit Current Game Metadata & Pawn Structure"
            >
              <Edit2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Edit</span>
            </button>
          )}

          {/* Import PGN */}
          <button
            onClick={onOpenImport}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 hover:border-slate-700 transition-colors"
            title="Import PGN File, Raw Text, or Web Link (Lichess/Chessgames)"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Import</span>
          </button>

          {/* Export Annotated PGN */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/25 transition-colors"
            title="Export Annotated PGN with ChessBase/Lichess [%csl] [%cal] Glyphs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Help / Guide */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Study Framework Guide & Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile-only overflow menu button */}
        <div className="sm:hidden relative">
          <button
            onClick={() => {
              setShowMobileMenu((prev) => !prev);
              setShowThemeMenu(false);
            }}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMobileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#090d16] border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 text-xs backdrop-blur-md space-y-0.5">
              {onOpenNewGame && (
                <button
                  onClick={() => {
                    onOpenNewGame();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>New Study Game</span>
                </button>
              )}

              {onOpenEditGame && (
                <button
                  onClick={() => {
                    onOpenEditGame();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4 text-sky-400" />
                  <span>Edit Game Details</span>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenImport();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Import PGN / Link</span>
              </button>

              <button
                onClick={() => {
                  onOpenExport();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Annotated PGN</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Reset study notes for "${currentGame.white} vs ${currentGame.black}" to original model annotations?`)) {
                    resetCurrentGameToPreset();
                  }
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Reset to Default Notes</span>
              </button>

              <div className="border-t border-slate-800 my-1" />

              <button
                onClick={() => {
                  onOpenHelp();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center space-x-2"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Study Guide & Shortcuts</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
