import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChessStudy } from '../../context/ChessStudyContext';
import {
  FileText,
  Eye,
  Edit3,
  Bold,
  Italic,
  List,
  Quote,
  Heading2,
  Sparkles,
  Check
} from 'lucide-react';

export const NoteEditor: React.FC = () => {
  const { currentAnnotation, updateNoteMarkdown, currentPly } = useChessStudy();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [templateSelected, setTemplateSelected] = useState<string>('');

  const currentNote = currentAnnotation?.noteMarkdown || '';

  const noteTemplates = [
    {
      title: "Why did White/Black choose this move over the engine's top choice?",
      body: `### Positional Rationale vs Engine Calculation
- **GM Choice:** Practical plan simplifying calculation and targeting structural weaknesses.
- **Engine Line:** Demands sharp tactical acrobatics that offer no human strategic comfort.
- **Key Takeaway:** Humans rely on pawn skeletons and outposts to navigate complex middlegames.`,
    },
    {
      title: "Positional Evaluation: Pawn Structure & Imbalances",
      body: `### Positional Evaluation & Imbalances
1. **Material:** Equal.
2. **Pawn Structure:** Asymmetry created by pawn breaks; notice the half-open files.
3. **Outposts:** Key square identified for piece anchorage.
4. **Plan:** Target the backward pawn and restrict enemy mobility.`,
    },
    {
      title: "Critical Turning Point & Plan Execution",
      body: `### Critical Turning Point
Here the game transitions from maneuvering to dynamic breakthrough!
- **Breakthrough Move:**
- **Tactical Justification:**
- **Outcome:** Enemy army is paralyzed and forced into passive defense.`,
    },
    {
      title: "Prophylaxis: Defusing Opponent's Counterplay",
      body: `### Prophylactic Defense
Before launching their own offensive, the master defuses the opponent's only active plan.
- **Threat Anticipated:**
- **Prophylactic Measure:**
- **Consequence:** Opponent is left with zero active plans.`,
    },
  ];

  const handleInsertTemplate = (templateBody: string) => {
    const updated = currentNote ? `${currentNote}\n\n${templateBody}` : templateBody;
    updateNoteMarkdown(updated);
  };

  const handleInsertText = (before: string, after: string = '') => {
    const updated = `${currentNote}${before}${after}`;
    updateNoteMarkdown(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Middlegame Markdown Notes</span>
        </h3>

        {/* Tab switch */}
        <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center space-x-1 transition-colors ${
              activeTab === 'edit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center space-x-1 transition-colors ${
              activeTab === 'preview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Templates Dropdown & Formatting Toolbar */}
      {activeTab === 'edit' && (
        <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          {/* Markdown formatting quick buttons */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleInsertText('**', '**')}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('*', '*')}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n### ')}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
              title="Heading (### Title)"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n- ')}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
              title="Bullet list (- Item)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n> ')}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
              title="Quote (> Quote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            {/* Chess glyph inserts */}
            <div className="flex items-center space-x-0.5 pl-1 border-l border-slate-700">
              <button
                type="button"
                onClick={() => handleInsertText('!')}
                className="px-1 py-0.5 rounded text-[10px] font-mono hover:bg-slate-800 text-emerald-400 font-bold"
                title="Good move (!)"
              >
                !
              </button>
              <button
                type="button"
                onClick={() => handleInsertText('!!')}
                className="px-1 py-0.5 rounded text-[10px] font-mono hover:bg-slate-800 text-cyan-400 font-bold"
                title="Brilliant move (!!)"
              >
                !!
              </button>
              <button
                type="button"
                onClick={() => handleInsertText('?')}
                className="px-1 py-0.5 rounded text-[10px] font-mono hover:bg-slate-800 text-rose-400 font-bold"
                title="Mistake (?)"
              >
                ?
              </button>
              <button
                type="button"
                onClick={() => handleInsertText('±')}
                className="px-1 py-0.5 rounded text-[10px] font-mono hover:bg-slate-800 text-amber-400 font-bold"
                title="White is clearly better (±)"
              >
                ±
              </button>
            </div>
          </div>

          {/* Template insert dropdown */}
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <select
              value={templateSelected}
              onChange={(e) => {
                const tmpl = noteTemplates.find((t) => t.title === e.target.value);
                if (tmpl) {
                  handleInsertTemplate(tmpl.body);
                }
                setTemplateSelected('');
              }}
              disabled={currentPly === 0}
              className="bg-slate-800 text-[11px] text-slate-300 border border-slate-700 rounded px-2 py-1 outline-none cursor-pointer disabled:opacity-40"
            >
              <option value="">Insert Note Template...</option>
              {noteTemplates.map((t) => (
                <option key={t.title} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      {activeTab === 'edit' ? (
        <div className="relative">
          <textarea
            rows={7}
            value={currentNote}
            disabled={currentPly === 0}
            onChange={(e) => updateNoteMarkdown(e.target.value)}
            placeholder={
              currentPly === 0
                ? 'Select a move in the move list to add your strategic notes...'
                : 'Write your strategic analysis for this move (Markdown supported: **bold**, - lists, ### headers)...'
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          />
          {currentPly > 0 && currentNote.trim() && (
            <div className="absolute right-2.5 bottom-2.5 text-[10px] text-emerald-400 flex items-center space-x-1 pointer-events-none bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <Check className="w-3 h-3" />
              <span>Saved</span>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[170px] max-h-[300px] overflow-y-auto bg-slate-900/80 border border-slate-700/80 rounded-lg p-3.5 text-xs text-slate-200 prose prose-invert max-w-none prose-sm">
          {currentNote.trim() ? (
            <ReactMarkdown>{currentNote}</ReactMarkdown>
          ) : (
            <p className="text-slate-500 italic text-center py-6">
              No notes for this move yet. Switch to "Edit" tab to formulate your ideas.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
