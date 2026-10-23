import React, { useState, useEffect } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { PawnStructureType, ChessStudyGame } from '../../types/chess';
import {
  X,
  Save,
  Trash2,
  Copy,
  RotateCcw,
  Sparkles,
  Swords,
  Calendar,
  Layers,
  FileCode,
  AlertCircle,
  Check
} from 'lucide-react';

interface EditGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId?: string;
}

export const EditGameModal: React.FC<EditGameModalProps> = ({
  isOpen,
  onClose,
  gameId,
}) => {
  const { games, currentGame, updateGame, deleteGame, duplicateGame, clearGameAnnotations } = useChessStudy();

  const targetGame = (gameId ? games.find((g) => g.id === gameId) : null) || currentGame;

  const [white, setWhite] = useState('');
  const [black, setBlack] = useState('');
  const [whiteElo, setWhiteElo] = useState('');
  const [blackElo, setBlackElo] = useState('');
  const [event, setEvent] = useState('');
  const [site, setSite] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [date, setDate] = useState('');
  const [result, setResult] = useState<'1-0' | '0-1' | '1/2-1/2' | '*'>('*');
  const [eco, setEco] = useState('A00');
  const [openingName, setOpeningName] = useState('');
  const [primaryPawnStructure, setPrimaryPawnStructure] = useState<PawnStructureType>('Custom');
  const [keyMiddlegameIdea, setKeyMiddlegameIdea] = useState('');
  const [pgnText, setPgnText] = useState('');
  const [showPgnSection, setShowPgnSection] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (targetGame) {
      setWhite(targetGame.white || '');
      setBlack(targetGame.black || '');
      setWhiteElo(targetGame.whiteElo || '');
      setBlackElo(targetGame.blackElo || '');
      setEvent(targetGame.event || '');
      setSite(targetGame.site || '');
      setYear(targetGame.year || new Date().getFullYear());
      setDate(targetGame.date || '');
      setResult(targetGame.result || '*');
      setEco(targetGame.eco || 'A00');
      setOpeningName(targetGame.openingName || '');
      setPrimaryPawnStructure(targetGame.primaryPawnStructure || 'Custom');
      setKeyMiddlegameIdea(targetGame.keyMiddlegameIdea || '');
      setPgnText(targetGame.pgn || '');
      setSavedSuccess(false);
    }
  }, [targetGame, isOpen]);

  if (!isOpen || !targetGame) return null;

  const structures: PawnStructureType[] = [
    'Carlsbad',
    'IQP',
    'Hanging Pawns',
    'Closed',
    'Open',
    'Benoni',
    'Custom',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGame(targetGame.id, {
      white: white.trim() || 'White',
      black: black.trim() || 'Black',
      whiteElo: whiteElo.trim() || undefined,
      blackElo: blackElo.trim() || undefined,
      event: event.trim() || 'Study Game',
      site: site.trim() || undefined,
      year: Number(year) || new Date().getFullYear(),
      date: date.trim() || undefined,
      result,
      eco: eco.trim() || 'A00',
      openingName: openingName.trim() || `${white} vs ${black}`,
      primaryPawnStructure,
      keyMiddlegameIdea: keyMiddlegameIdea.trim(),
      pgn: pgnText.trim() || targetGame.pgn,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    const confirmText = `Are you sure you want to delete "${targetGame.white} vs ${targetGame.black}"?\nThis action cannot be undone.`;
    if (window.confirm(confirmText)) {
      deleteGame(targetGame.id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    duplicateGame(targetGame.id);
    onClose();
  };

  const handleClearAnnotations = () => {
    if (window.confirm(`Clear all custom annotations and markup for "${targetGame.white} vs ${targetGame.black}"?`)) {
      clearGameAnnotations(targetGame.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#090d16]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <span>Edit Study Game</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#020617] text-slate-400 border border-slate-800">
                  ID: {targetGame.id.slice(0, 12)}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Update game metadata, pawn structure classification, and key middlegame idea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Players Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-[#020617]/60 p-3.5 rounded-xl border border-slate-800/80">
            {/* White */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block" />
                <span>White Player</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={white}
                  onChange={(e) => setWhite(e.target.value)}
                  placeholder="e.g. Garry Kasparov"
                  className="flex-1 bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <input
                  type="text"
                  value={whiteElo}
                  onChange={(e) => setWhiteElo(e.target.value)}
                  placeholder="Elo"
                  className="w-16 bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-center"
                />
              </div>
            </div>

            {/* Black */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-600 inline-block" />
                <span>Black Player</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={black}
                  onChange={(e) => setBlack(e.target.value)}
                  placeholder="e.g. Anatoly Karpov"
                  className="flex-1 bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <input
                  type="text"
                  value={blackElo}
                  onChange={(e) => setBlackElo(e.target.value)}
                  placeholder="Elo"
                  className="w-16 bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-center"
                />
              </div>
            </div>
          </div>

          {/* Event, Year, Result */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Event / Tournament</label>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="e.g. World Championship Match"
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10) || new Date().getFullYear())}
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Result</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value as any)}
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
              >
                <option value="1-0">1-0 (White won)</option>
                <option value="0-1">0-1 (Black won)</option>
                <option value="1/2-1/2">1/2-1/2 (Draw)</option>
                <option value="*">* (Ongoing/Study)</option>
              </select>
            </div>
          </div>

          {/* Opening & Structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1 space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Pawn Structure</label>
              <select
                value={primaryPawnStructure}
                onChange={(e) => setPrimaryPawnStructure(e.target.value as PawnStructureType)}
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {structures.map((s) => (
                  <option key={s} value={s}>
                    {s} Structure
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">ECO Code</label>
              <input
                type="text"
                value={eco}
                onChange={(e) => setEco(e.target.value)}
                placeholder="e.g. D35"
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Opening Name</label>
              <input
                type="text"
                value={openingName}
                onChange={(e) => setOpeningName(e.target.value)}
                placeholder="e.g. Queen's Gambit Declined: Carlsbad"
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Core Middlegame Idea */}
          <div className="space-y-1.5 bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl">
            <label className="text-[11px] font-bold text-amber-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Middlegame Idea (Thematic Blueprint)</span>
            </label>
            <textarea
              rows={2}
              value={keyMiddlegameIdea}
              onChange={(e) => setKeyMiddlegameIdea(e.target.value)}
              placeholder="e.g. White initiates minority attack with b4-b5 to soften c6 pawn, then infiltrates the c-file..."
              className="w-full bg-[#090d16] border border-amber-900/40 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Collapsible Raw PGN Editor */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#020617]/50">
            <button
              type="button"
              onClick={() => setShowPgnSection((prev) => !prev)}
              className="w-full px-3 py-2 text-left flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                <span>Raw PGN Notation & Header Tags</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {showPgnSection ? 'Hide PGN' : 'View / Edit Moves'}
              </span>
            </button>

            {showPgnSection && (
              <div className="p-3 border-t border-slate-800 space-y-2">
                <p className="text-[10px] text-slate-400">
                  Editing moves here will reload the game move history while preserving compatible move notes.
                </p>
                <textarea
                  rows={6}
                  value={pgnText}
                  onChange={(e) => setPgnText(e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
                  placeholder="Paste or edit PGN..."
                />
              </div>
            )}
          </div>

          {/* Danger Zone: Clear Annotations & Delete Game */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDuplicate}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center space-x-1.5 transition-colors"
                title="Duplicate this study game"
              >
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span>Duplicate</span>
              </button>

              <button
                type="button"
                onClick={handleClearAnnotations}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center space-x-1.5 transition-colors"
                title="Clear all annotations on this game"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Clear Notes</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs flex items-center space-x-1.5 transition-colors"
              title="Delete this game from your study library"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Delete Game</span>
            </button>
          </div>

          {/* Actions Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
