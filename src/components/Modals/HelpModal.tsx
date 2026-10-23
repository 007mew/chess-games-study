import React from 'react';
import { X, BookOpen, Target, Sparkles, Keyboard, MousePointer, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#090d16] border border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#090d16]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Study Methodology & Shortcuts</h3>
              <p className="text-xs text-slate-400">Mastering chess through middlegame plans & pawn structures</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: The 4 Questions Framework */}
          <div className="bg-[#020617]/60 rounded-lg p-3 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center space-x-1.5 text-xs text-emerald-400">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>The "4 Questions" Positional Evaluation Framework</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              <li>
                <strong>Worst-Placed Piece:</strong> Find which piece has no active scope or bites on friendly pawns.
              </li>
              <li>
                <strong>Key Weaknesses:</strong> Identify backward pawns, outpost holes, and uncastled king dangers.
              </li>
              <li>
                <strong>Pawn Levers & Breaks:</strong> Thematic pawn moves (e4, c5, f5, b5) that unlock the position.
              </li>
              <li>
                <strong>Opponent's Plan (Prophylaxis):</strong> Stop your opponent's active ideas before starting your own.
              </li>
            </ol>
          </div>

          {/* Section 2: Board Markup Guide */}
          <div className="bg-[#020617]/60 rounded-lg p-3 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center space-x-1.5 text-xs text-cyan-400">
              <MousePointer className="w-4 h-4 text-cyan-400" />
              <span>Board Markup & Visual Plan Annotation</span>
            </h4>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li>
                • <strong className="text-emerald-400">Green:</strong> Strategic plans, best moves, and forward squares.
              </li>
              <li>
                • <strong className="text-rose-400">Red:</strong> Tactical threats, enemy weaknesses, and backward pawns.
              </li>
              <li>
                • <strong className="text-sky-400">Blue:</strong> Piece regrouping and maneuvering paths.
              </li>
              <li>
                • <strong className="text-amber-400">Yellow:</strong> Outposts and tactical ideas.
              </li>
              <li>
                • Click <strong>"Save to Move"</strong> on any ply to permanently attach arrows & highlights!
              </li>
            </ul>
          </div>

          {/* Section 2.5: Replay & Practice from Both Sides */}
          <div className="bg-[#020617]/60 rounded-lg p-3 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center space-x-1.5 text-xs text-emerald-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Replay & Practice Mode (Practice Both Sides)</span>
            </h4>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li>
                • <strong>Practice White:</strong> You play White's moves; opponent automatically responds with Black's moves from the master game.
              </li>
              <li>
                • <strong>Practice Black:</strong> Board flips to Black's perspective; White's moves are answered automatically so you master Black's defense.
              </li>
              <li>
                • <strong>Both Sides:</strong> Replay the entire master game move-by-move from both perspectives with optional auto-flip.
              </li>
              <li>
                • <strong>Hint System:</strong> Use Level 1 (piece highlight) or Level 2 (target arrow) whenever you need guidance.
              </li>
            </ul>
          </div>

          {/* Section 3: Keyboard Shortcuts */}
          <div className="bg-[#020617]/60 rounded-lg p-3 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center space-x-1.5 text-xs text-amber-300">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Keyboard Shortcuts</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center justify-between bg-[#090d16] px-2 py-1 rounded border border-slate-850">
                <span className="text-slate-400">Previous Move</span>
                <kbd className="px-1.5 py-0.5 bg-[#020617] border border-slate-800 rounded font-mono text-[10px]">←</kbd>
              </div>
              <div className="flex items-center justify-between bg-[#090d16] px-2 py-1 rounded border border-slate-850">
                <span className="text-slate-400">Next Move</span>
                <kbd className="px-1.5 py-0.5 bg-[#020617] border border-slate-800 rounded font-mono text-[10px]">→</kbd>
              </div>
              <div className="flex items-center justify-between bg-[#090d16] px-2 py-1 rounded border border-slate-850">
                <span className="text-slate-400">First / Last Move</span>
                <kbd className="px-1.5 py-0.5 bg-[#020617] border border-slate-800 rounded font-mono text-[10px]">↑ / ↓</kbd>
              </div>
              <div className="flex items-center justify-between bg-[#090d16] px-2 py-1 rounded border border-slate-850">
                <span className="text-slate-400">Auto-Play / Pause</span>
                <kbd className="px-1.5 py-0.5 bg-[#020617] border border-slate-800 rounded font-mono text-[10px]">Space</kbd>
              </div>
              <div className="flex items-center justify-between bg-[#090d16] px-2 py-1 rounded border border-slate-850">
                <span className="text-slate-400">Flip Board</span>
                <kbd className="px-1.5 py-0.5 bg-[#020617] border border-slate-800 rounded font-mono text-[10px]">F</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#090d16] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Got it, Let's Study
          </button>
        </div>
      </div>
    </div>
  );
};
