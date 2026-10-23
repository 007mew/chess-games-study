import React, { useState } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { QuestionsFramework } from './QuestionsFramework';
import { TaggingSystem } from './TaggingSystem';
import { NoteEditor } from './NoteEditor';
import {
  BookOpen,
  Copy,
  Check,
  Compass,
  FileText,
  Target,
  Trash2,
  Tag
} from 'lucide-react';

export const StrategicNotebook: React.FC = () => {
  const {
    currentPly,
    moveHistory,
    currentFen,
    currentAnnotation,
    activeArrows,
    activeSquares,
    deleteCurrentMoveAnnotation,
  } = useChessStudy();

  const [activeTab, setActiveTab] = useState<'notes' | 'questions'>('notes');
  const [copiedFen, setCopiedFen] = useState(false);

  const currentMoveItem = currentPly > 0 ? moveHistory[currentPly - 1] : null;
  const isWhite = currentPly % 2 === 1;
  const moveNumber = currentMoveItem ? currentMoveItem.moveNumber : 0;
  const san = currentMoveItem ? currentMoveItem.san : 'Start';

  const copyFenToClipboard = () => {
    navigator.clipboard.writeText(currentFen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  // Count answered questions
  const answeredQuestionsCount = [
    currentAnnotation?.questionsAnalysis?.worstPiece,
    currentAnnotation?.questionsAnalysis?.weakness,
    currentAnnotation?.questionsAnalysis?.pawnBreak,
    currentAnnotation?.questionsAnalysis?.prophylaxis,
  ].filter((v) => Boolean(v && v.trim())).length;

  const activeTagsCount = currentAnnotation?.themeTags?.length || 0;
  const hasNotes = Boolean(currentAnnotation?.noteMarkdown?.trim());

  const handleClearCurrentPlyAnnotation = () => {
    if (window.confirm(`Clear all notes, tags, and strategic questions for Move ${moveNumber} (${san})?`)) {
      deleteCurrentMoveAnnotation();
    }
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex flex-col border-l border-slate-800 bg-[#090d16] h-[calc(100vh-53px)] select-none shrink-0 overflow-hidden">
      {/* Position Header Banner */}
      <div className="p-3 border-b border-slate-800 bg-[#090d16] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Middlegame Notebook
                </h2>
                {currentPly > 0 && (
                  <span className="text-[10px] bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                    Move {moveNumber} {isWhite ? '(W)' : '(B)'}: {san}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                {currentPly === 0
                  ? 'Initial starting position'
                  : `Ply ${currentPly} • Turn: ${isWhite ? 'Black' : 'White'} to respond`}
              </p>
            </div>
          </div>

          {/* Copy FEN button */}
          <button
            onClick={copyFenToClipboard}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono border border-slate-700 transition-colors"
            title="Copy FEN to clipboard"
          >
            {copiedFen ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-sans">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>FEN</span>
              </>
            )}
          </button>
        </div>

        {/* Board markup indicators & Clear move notes */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5">
            <Compass className="w-3 h-3 text-emerald-400" />
            <span>
              Markup:{' '}
              <strong className="text-emerald-300">{activeArrows.length} arrows</strong>,{' '}
              <strong className="text-amber-300">{activeSquares.length} squares</strong>
            </span>
          </div>

          {(hasNotes || answeredQuestionsCount > 0 || activeTagsCount > 0) && (
            <button
              onClick={handleClearCurrentPlyAnnotation}
              className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition-colors"
              title="Delete annotations for this specific move"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Ply</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-[#090d16] p-1.5 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'notes'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Middlegame Markdown Notes & Thematic Tags"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes & Tags</span>
          {(hasNotes || activeTagsCount > 0) && (
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-sm" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'questions'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="The 4 Questions: Worst piece, weaknesses, levers, prophylaxis"
        >
          <Target className="w-3.5 h-3.5" />
          <span>4 Questions</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              answeredQuestionsCount > 0
                ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {answeredQuestionsCount}/4
          </span>
        </button>
      </div>

      {/* Scrollable Tab Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'notes' ? (
          <>
            {/* Thematic Tags */}
            <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 shadow-sm">
              <TaggingSystem />
            </section>

            {/* Markdown Note Editor */}
            <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 shadow-sm">
              <NoteEditor />
            </section>
          </>
        ) : (
          /* The 4 Strategic Questions Framework */
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 shadow-sm">
            <QuestionsFramework />
          </section>
        )}
      </div>
    </aside>
  );
};
