import React from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { Tag, Layers, RefreshCw, Zap } from 'lucide-react';

export const TaggingSystem: React.FC = () => {
  const { currentAnnotation, toggleThemeTag, currentPly } = useChessStudy();

  const activeTags = currentAnnotation?.themeTags || [];

  const categories = [
    {
      name: 'Pawn Structure',
      icon: Layers,
      color: 'text-sky-400',
      activeColor: 'bg-sky-600 text-white border-sky-400',
      tags: [
        'Carlsbad',
        'IQP',
        'Hanging Pawns',
        'Pawn Chain Base',
        'Passed Pawn Creation',
        'Doubled Pawns',
        'Open File',
      ],
    },
    {
      name: 'Positional Maneuvers',
      icon: RefreshCw,
      color: 'text-emerald-400',
      activeColor: 'bg-emerald-600 text-white border-emerald-400',
      tags: [
        'Knight Outpost',
        'Bad Bishop Trade',
        'Rook on 7th',
        'Rook Lift',
        'Prophylaxis',
        'Piece Regrouping',
        'King Walk',
      ],
    },
    {
      name: 'Strategic Plans',
      icon: Zap,
      color: 'text-amber-400',
      activeColor: 'bg-amber-600 text-white border-amber-400',
      tags: [
        'Minority Attack',
        'Opposite-Side Castling Storm',
        'Center Liquidate',
        'Endgame Transition',
        'King Hunt',
        'Blockade',
      ],
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Thematic Idea Tagging System</span>
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">
          {activeTags.length} active tag{activeTags.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1.5">
                <Icon className={`w-3 h-3 ${cat.color}`} />
                <span>{cat.name}</span>
              </span>

              <div className="flex flex-wrap gap-1.5">
                {cat.tags.map((tag) => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={currentPly === 0}
                      onClick={() => toggleThemeTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                        isActive
                          ? `${cat.activeColor} shadow-md ring-1 ring-white/20`
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {tag}
                      {isActive && <span className="ml-1 text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
