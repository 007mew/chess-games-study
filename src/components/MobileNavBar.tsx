import React from 'react';
import { useChessStudy } from '../context/ChessStudyContext';
import { LayoutGrid, ListOrdered, BookOpen, FolderKanban } from 'lucide-react';

export type MobileTab = 'board' | 'moves' | 'notebook' | 'library';

interface MobileNavBarProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ activeTab, onSelectTab }) => {
  const { games, currentAnnotation, replayPracticeState, guessPlanState } = useChessStudy();

  // Count answered questions / notes for current ply
  const notesCount = [
    Boolean(currentAnnotation?.noteMarkdown?.trim()),
    Boolean(currentAnnotation?.questionsAnalysis?.worstPiece?.trim()),
    Boolean(currentAnnotation?.questionsAnalysis?.weakness?.trim()),
    Boolean(currentAnnotation?.questionsAnalysis?.pawnBreak?.trim()),
    Boolean(currentAnnotation?.questionsAnalysis?.prophylaxis?.trim()),
  ].filter(Boolean).length;

  const isDrillActive = replayPracticeState.isActive || guessPlanState.isActive;

  const tabs: { id: MobileTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; dot?: boolean }[] = [
    {
      id: 'board',
      label: 'Board',
      icon: LayoutGrid,
      dot: isDrillActive,
    },
    {
      id: 'moves',
      label: 'Moves',
      icon: ListOrdered,
    },
    {
      id: 'notebook',
      label: 'Notebook',
      icon: BookOpen,
      badge: notesCount > 0 ? notesCount : undefined,
    },
    {
      id: 'library',
      label: 'Library',
      icon: FolderKanban,
      badge: games.length,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-t border-slate-800 px-3 py-1 flex items-center justify-around shadow-2xl select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center relative transition-all rounded-lg ${
              isActive
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />

              {/* Pulsing indicator for active drill */}
              {tab.dot && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}

              {/* Numeric badge */}
              {tab.badge !== undefined && (
                <span
                  className={`absolute -top-1.5 -right-3 px-1 py-0.2 rounded-full text-[9px] font-mono font-bold leading-tight ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {tab.label}
            </span>

            {/* Active indicator bar */}
            {isActive && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
