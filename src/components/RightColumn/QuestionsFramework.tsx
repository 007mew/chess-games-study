import React, { useState } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertTriangle,
  Target,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const QuestionsFramework: React.FC = () => {
  const { currentAnnotation, updateQuestionAnalysis, currentPly } = useChessStudy();

  const [openSection, setOpenSection] = useState<'worst' | 'weakness' | 'lever' | 'prophylaxis' | null>('worst');

  const questions = [
    {
      id: 'worst' as const,
      key: 'worstPiece' as const,
      title: '1. Worst-Placed Piece',
      subtitle: 'Identify friendly or enemy pieces lacking scope & activity',
      icon: Target,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      value: currentAnnotation?.questionsAnalysis?.worstPiece || '',
      suggestions: [
        'Passive c8/c1 bishop biting on pawn chain',
        'Offside knight on the rim (a5/h5/h4)',
        'Rooks disconnected on back rank',
        'Queen misplaced in line of enemy rook',
        'Overworked piece pinned to defense',
      ],
      placeholder: 'e.g. Black’s bishop on c8 is completely passive behind the e6-d5 pawn chain...',
    },
    {
      id: 'weakness' as const,
      key: 'weakness' as const,
      title: '2. Key Weaknesses',
      subtitle: 'Target holes, backward pawns, and exposed king shelter',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      value: currentAnnotation?.questionsAnalysis?.weakness || '',
      suggestions: [
        'Backward c6 pawn on half-open c-file',
        'Weak d5 outpost square in front of IQP',
        'Weakened dark-square complex around king',
        'Pawn holes on d4 / e4 / d5 / e5',
        'Exposed king due to f-pawn or g-pawn push',
      ],
      placeholder: 'e.g. The d5 square cannot be defended by any Black pawn, creating a permanent hole...',
    },
    {
      id: 'lever' as const,
      key: 'pawnBreak' as const,
      title: '3. Pawn Levers & Breaks',
      subtitle: 'Identify the thematic pawn break opening lines',
      icon: Sparkles,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      value: currentAnnotation?.questionsAnalysis?.pawnBreak || '',
      suggestions: [
        'Thematic e3-e4 central strike',
        'c4-c5 break against the base of pawn chain',
        'f7-f5 kingside avalanche',
        'b4-b5 minority attack lever',
        'd4-d5 central liquidation',
      ],
      placeholder: 'e.g. White prepares e3-e4 to blast open the center and mobilize the d3 bishop...',
    },
    {
      id: 'prophylaxis' as const,
      key: 'prophylaxis' as const,
      title: "4. Opponent's Plan (Prophylaxis)",
      subtitle: 'Anticipate enemy threats & counterplay beforehand',
      icon: ShieldAlert,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      value: currentAnnotation?.questionsAnalysis?.prophylaxis || '',
      suggestions: [
        'Opponent wants to jump knight to c4 / e4',
        'Opponent prepares ...c5 or ...e5 counter-strike',
        'Opponent seeks queen trade to neutralize pressure',
        'Prophylactic Kh1/Kh8 sidestepping check tactics',
        'a3/h3 preventing pin from Bg4/Ng4',
      ],
      placeholder: 'e.g. Black intends ...Nc4 to clamp down on the queenside, so White plays b3 first...',
    },
  ];

  const handleApplySuggestion = (key: 'worstPiece' | 'weakness' | 'pawnBreak' | 'prophylaxis', text: string) => {
    const currentVal = currentAnnotation?.questionsAnalysis?.[key] || '';
    const newVal = currentVal ? `${currentVal} • ${text}` : text;
    updateQuestionAnalysis(key, newVal);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strategic Framework ("The 4 Questions")</span>
        </h3>
        {currentPly === 0 && (
          <span className="text-[10px] text-amber-400 italic">Select a move to record answers</span>
        )}
      </div>

      <div className="space-y-1.5">
        {questions.map((q) => {
          const isOpen = openSection === q.id;
          const Icon = q.icon;
          const hasContent = Boolean(q.value.trim());

          return (
            <div
              key={q.id}
              className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60 transition-colors"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : q.id)}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${q.bgColor}`}>
                    <Icon className={`w-3.5 h-3.5 ${q.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-200">{q.title}</span>
                      {hasContent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">{q.subtitle}</p>
                  </div>
                </div>

                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
                  {/* Quick suggestion chips */}
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block mb-1">
                      Quick Ideas (Click to insert):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {q.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplySuggestion(q.key, sug)}
                          disabled={currentPly === 0}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-emerald-950 hover:text-emerald-200 text-slate-300 border border-slate-700 hover:border-emerald-700 transition-colors disabled:opacity-40"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Textarea */}
                  <textarea
                    rows={2}
                    value={q.value}
                    disabled={currentPly === 0}
                    onChange={(e) => updateQuestionAnalysis(q.key, e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
