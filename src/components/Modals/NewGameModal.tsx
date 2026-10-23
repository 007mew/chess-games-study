import React, { useState } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { PawnStructureType } from '../../types/chess';
import {
  X,
  PlusCircle,
  Sparkles,
  Swords,
  BookOpen,
  Layers,
  FileCode,
  Check
} from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameCreated?: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onGameCreated,
}) => {
  const { createGame } = useChessStudy();

  const [white, setWhite] = useState('White Player');
  const [black, setBlack] = useState('Black Player');
  const [event, setEvent] = useState('Middlegame Study');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [result, setResult] = useState<'1-0' | '0-1' | '1/2-1/2' | '*'>('*');
  const [eco, setEco] = useState('A00');
  const [openingName, setOpeningName] = useState('Custom Position');
  const [primaryPawnStructure, setPrimaryPawnStructure] = useState<PawnStructureType>('Custom');
  const [keyMiddlegameIdea, setKeyMiddlegameIdea] = useState('');
  const [pgnText, setPgnText] = useState('');

  if (!isOpen) return null;

  const templates: {
    name: string;
    desc: string;
    structure: PawnStructureType;
    white: string;
    black: string;
    event: string;
    eco: string;
    opening: string;
    idea: string;
    pgn: string;
  }[] = [
    {
      name: 'Blank Board',
      desc: 'Start clean from move 1',
      structure: 'Custom',
      white: 'White Player',
      black: 'Black Player',
      event: 'Personal Study',
      eco: 'A00',
      opening: 'Custom Position',
      idea: 'Explore middlegame ideas and pawn transitions.',
      pgn: '',
    },
    {
      name: 'Carlsbad Model',
      desc: 'Minority attack on queenside',
      structure: 'Carlsbad',
      white: 'Model White',
      black: 'Model Black',
      event: 'Carlsbad Pawn Structure Study',
      eco: 'D35',
      opening: "Queen's Gambit Exchange: Carlsbad",
      idea: 'Prepare b4-b5 minority attack against c6/d5 backward pawn base.',
      pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5 5. Bg5 c6 6. e3 Be7 7. Bd3 O-O *',
    },
    {
      name: 'IQP Model',
      desc: 'Isolated Queen’s Pawn dynamic play',
      structure: 'IQP',
      white: 'Model White',
      black: 'Model Black',
      event: 'IQP Tactical & Positional Drill',
      eco: 'D41',
      opening: 'Semi-Tarrasch / Panov IQP',
      idea: 'White utilizes active piece outposts (Ne5, d5 break) before Black blockades.',
      pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3 c5 5. cxd5 Nxd5 6. e3 Nc6 7. Bd3 cxd4 8. exd4 *',
    },
    {
      name: 'Closed Center',
      desc: 'Locked chains & pawn breaks',
      structure: 'Closed',
      white: 'Model White',
      black: 'Model Black',
      event: 'Closed Center Middlegame Study',
      eco: 'E90',
      opening: "King's Indian / French Classical",
      idea: 'Opposite wing attacks with locked center (f4-f5 vs c4-c5).',
      pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. d5 *',
    },
  ];

  const applyTemplate = (t: (typeof templates)[0]) => {
    setWhite(t.white);
    setBlack(t.black);
    setEvent(t.event);
    setPrimaryPawnStructure(t.structure);
    setEco(t.eco);
    setOpeningName(t.opening);
    setKeyMiddlegameIdea(t.idea);
    setPgnText(t.pgn);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createGame({
      white: white.trim() || 'White Player',
      black: black.trim() || 'Black Player',
      event: event.trim() || 'Middlegame Study',
      year: Number(year) || new Date().getFullYear(),
      result,
      eco: eco.trim() || 'A00',
      openingName: openingName.trim() || `${white} vs ${black}`,
      primaryPawnStructure,
      keyMiddlegameIdea: keyMiddlegameIdea.trim(),
      pgn: pgnText.trim() || undefined,
    });

    if (onGameCreated) {
      onGameCreated();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#090d16]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Create New Study Game</h3>
              <p className="text-xs text-slate-400">
                Start from a blank board or initialize a positional pawn skeleton
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

        {/* Body */}
        <form onSubmit={handleCreate} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Quick-Start Template Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Quick Start Skeletons:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    primaryPawnStructure === t.structure && openingName === t.opening
                      ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40'
                      : 'bg-[#020617]/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-200 text-xs flex items-center justify-between">
                    <span>{t.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#020617] text-emerald-400 font-mono border border-slate-800">
                      {t.structure}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Players */}
          <div className="grid grid-cols-2 gap-3 bg-[#020617]/60 p-3 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block" />
                <span>White Player</span>
              </label>
              <input
                type="text"
                value={white}
                onChange={(e) => setWhite(e.target.value)}
                placeholder="White Player"
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-600 inline-block" />
                <span>Black Player</span>
              </label>
              <input
                type="text"
                value={black}
                onChange={(e) => setBlack(e.target.value)}
                placeholder="Black Player"
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Event, Structure, Year */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Event / Study Name</label>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="Middlegame Study"
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Pawn Structure</label>
              <select
                value={primaryPawnStructure}
                onChange={(e) => setPrimaryPawnStructure(e.target.value as PawnStructureType)}
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Carlsbad">Carlsbad</option>
                <option value="IQP">IQP</option>
                <option value="Hanging Pawns">Hanging Pawns</option>
                <option value="Closed">Closed</option>
                <option value="Open">Open</option>
                <option value="Benoni">Benoni</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Key Middlegame Idea */}
          <div className="space-y-1 bg-amber-950/20 border border-amber-900/30 p-2.5 rounded-xl">
            <label className="text-[11px] font-bold text-amber-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Middlegame Idea / Study Goal</span>
            </label>
            <textarea
              rows={2}
              value={keyMiddlegameIdea}
              onChange={(e) => setKeyMiddlegameIdea(e.target.value)}
              placeholder="e.g. Focus on knight outpost on d5 and minority attack on queenside..."
              className="w-full bg-[#090d16] border border-amber-900/40 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Optional PGN Moves */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Optional Starting PGN / Moves</span>
              <span className="text-[10px] text-slate-500">(Leave blank for empty starting position)</span>
            </label>
            <textarea
              rows={3}
              value={pgnText}
              onChange={(e) => setPgnText(e.target.value)}
              placeholder="e.g. 1. d4 Nf6 2. c4 e6 ..."
              className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Actions */}
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
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Game</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
