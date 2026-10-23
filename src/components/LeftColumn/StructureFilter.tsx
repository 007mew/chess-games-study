import React from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { PawnStructureType } from '../../types/chess';
import { Filter } from 'lucide-react';

export const StructureFilter: React.FC = () => {
  const { structureFilter, setStructureFilter, games } = useChessStudy();

  const structures: { id: PawnStructureType | 'All'; label: string; desc: string }[] = [
    { id: 'All', label: 'All Structures', desc: 'All model games' },
    { id: 'Carlsbad', label: 'Carlsbad', desc: 'Minority attack & e4 push' },
    { id: 'IQP', label: 'IQP', desc: 'Isolated Queen’s Pawn blockade' },
    { id: 'Hanging Pawns', label: 'Hanging Pawns', desc: 'c5/d5 dynamic duo' },
    { id: 'Closed', label: 'Closed Center', desc: 'French & King’s Indian pawn chains' },
    { id: 'Open', label: 'Open Center', desc: 'Rook files & King infiltration' },
    { id: 'Benoni', label: 'Benoni Wedge', desc: 'Queenside asymmetry' },
  ];

  // Count games per structure
  const getCount = (id: PawnStructureType | 'All') => {
    if (id === 'All') return games.length;
    return games.filter((g) => g.primaryPawnStructure === id).length;
  };

  return (
    <div className="p-3 border-b border-slate-800 bg-[#090d16]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Filter className="w-3 h-3 text-emerald-400" />
          <span>Pawn Structure Filter</span>
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          {games.filter((g) => structureFilter === 'All' || g.primaryPawnStructure === structureFilter).length} games
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {structures.map((s) => {
          const isSelected = structureFilter === s.id;
          const count = getCount(s.id);
          return (
            <button
              key={s.id}
              onClick={() => setStructureFilter(s.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title={s.desc}
            >
              <span>{s.label}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
