import React from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';
import { Cpu, Brain } from 'lucide-react';

export const EvalBar: React.FC = () => {
  const { isEngineEnabled, toggleEngine, engineEval } = useChessStudy();

  // Score display helper
  const renderScore = () => {
    if (!engineEval) return '0.0';
    if (engineEval.mate !== null) {
      return `M${Math.abs(engineEval.mate)}`;
    }
    const val = (engineEval.score / 100).toFixed(1);
    return Number(val) > 0 ? `+${val}` : val;
  };

  // Eval percentage for the bar (clamped between 5% and 95%)
  const getWhitePercentage = () => {
    if (!engineEval) return 50;
    if (engineEval.mate !== null) {
      return engineEval.mate > 0 ? 98 : 2;
    }
    const cp = engineEval.score;
    const clampedCp = Math.max(-1000, Math.min(1000, cp));
    const winProb = 1 / (1 + Math.pow(10, -clampedCp / 400));
    return Math.max(5, Math.min(95, winProb * 100));
  };

  const whitePercent = getWhitePercentage();

  return (
    <div className="w-full bg-[#090d16] border border-slate-800/80 rounded-xl p-2.5 shadow-md text-xs select-none">
      {!isEngineEnabled ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
              <Brain className="w-3.5 h-3.5" />
            </span>
            <div className="text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400 sm:hidden">Independent Mode</span>
              <span className="font-semibold text-emerald-400 hidden sm:inline">Independent Thinking Mode</span>
              <span className="text-slate-400 hidden sm:inline ml-1.5">• Engine paused for human judgment</span>
            </div>
          </div>
          <button
            onClick={toggleEngine}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition-colors"
            title="Toggle Engine Analysis"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enable Engine</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header row: Status + Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleEngine}
                className="px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
                title="Pause Engine"
              >
                <Cpu className="w-3 h-3 text-rose-400" />
                <span>Engine Active</span>
              </button>
              {engineEval && (
                <span className="text-slate-400 text-[10px] font-mono">
                  Depth {engineEval.depth}/18
                </span>
              )}
            </div>

            {engineEval && (
              <div className="font-mono text-xs">
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    engineEval.score >= 0
                      ? 'bg-slate-900 text-slate-100 border border-slate-800'
                      : 'bg-slate-900 text-rose-400 border border-rose-800/40'
                  }`}
                >
                  {renderScore()}
                </span>
              </div>
            )}
          </div>

          {/* Horizontal Eval Bar */}
          <div className="relative h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            {/* White side */}
            <div
              className="bg-slate-200 transition-all duration-300 h-full"
              style={{ width: `${whitePercent}%` }}
            />
            {/* Black side */}
            <div
              className="bg-slate-950 transition-all duration-300 h-full"
              style={{ width: `${100 - whitePercent}%` }}
            />
            {/* Center line marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-500 -translate-x-1/2 z-10" />
          </div>

          {/* Engine recommendation hint */}
          {engineEval?.bestMove && (
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
              <span className="text-slate-400">
                Recommended:{' '}
                <strong className="text-emerald-400 font-mono font-semibold">{engineEval.bestMove.san}</strong> (
                {engineEval.bestMove.from} → {engineEval.bestMove.to})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">depth capped @ 18</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
