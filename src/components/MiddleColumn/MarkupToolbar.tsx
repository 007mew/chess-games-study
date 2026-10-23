import React from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { ArrowColor } from '../../types/chess';
import { ArrowUpRight, Trash2, Save, MousePointer } from 'lucide-react';

export const MarkupToolbar: React.FC = () => {
  const {
    markupToolColor,
    setMarkupToolColor,
    clearBoardMarkup,
    saveBoardMarkupToCurrentMove,
    activeArrows,
    activeSquares,
    currentPly,
  } = useChessStudy();

  const colorButtons: { color: ArrowColor; label: string; meaning: string; bgClass: string; borderClass: string }[] = [
    {
      color: 'green',
      label: 'Green',
      meaning: 'Strategic Plans & Best Moves',
      bgClass: 'bg-emerald-500',
      borderClass: 'border-emerald-400',
    },
    {
      color: 'red',
      label: 'Red',
      meaning: 'Threats & Weaknesses',
      bgClass: 'bg-rose-500',
      borderClass: 'border-rose-400',
    },
    {
      color: 'blue',
      label: 'Cyan',
      meaning: 'Piece Maneuvers & Regrouping',
      bgClass: 'bg-sky-400',
      borderClass: 'border-sky-400',
    },
    {
      color: 'yellow',
      label: 'Amber',
      meaning: 'Tactical Ideas & Targets',
      bgClass: 'bg-amber-400',
      borderClass: 'border-amber-400',
    },
  ];

  return (
    <div className="w-full bg-[#090d16] border border-slate-800/80 rounded-xl p-2 flex items-center justify-between text-xs select-none shadow-md">
      {/* Drawing mode & Color Palette */}
      <div className="flex items-center space-x-2">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Annotation Arrow:</span>
        </span>

        <div className="flex items-center space-x-1.5">
          {colorButtons.map((btn) => {
            const isSelected = markupToolColor === btn.color;
            return (
              <button
                key={btn.color}
                onClick={() => setMarkupToolColor(btn.color)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white ring-2 ring-emerald-500 shadow-sm'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
                title={`${btn.label} Arrow (${btn.meaning})`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${btn.bgClass}`} />
                <span className="hidden md:inline">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right-click instruction reminder */}
      <div className="text-[10px] text-slate-500 hidden xl:flex items-center space-x-1">
        <MousePointer className="w-3 h-3 text-slate-500" />
        <span>Right-click drag: Arrow • Right-click: Square</span>
      </div>

      {/* Action Buttons: Save & Clear */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={clearBoardMarkup}
          disabled={activeArrows.length === 0 && activeSquares.length === 0}
          className="flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Clear all arrows and highlights from board"
        >
          <Trash2 className="w-3 h-3 text-rose-400" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        <button
          onClick={saveBoardMarkupToCurrentMove}
          disabled={currentPly === 0}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Save current arrows and highlighted squares to this move"
        >
          <Save className="w-3 h-3" />
          <span>Save to Move</span>
        </button>
      </div>
    </div>
  );
};
