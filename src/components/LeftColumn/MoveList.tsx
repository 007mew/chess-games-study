import React, { useEffect, useRef } from 'react';
import { useChessStudy } from '../../context/ChessStudyContext';

export const MoveList: React.FC = () => {
  const { moveHistory, currentPly, goToPly } = useChessStudy();
  const activeMoveRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Group moves into pairs (White move, Black move)
  const movePairs: {
    moveNumber: number;
    white?: (typeof moveHistory)[0];
    black?: (typeof moveHistory)[0];
  }[] = [];

  for (let i = 0; i < moveHistory.length; i += 2) {
    const white = moveHistory[i];
    const black = moveHistory[i + 1];
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white,
      black,
    });
  }

  // Scroll active move into view smoothly
  useEffect(() => {
    if (activeMoveRef.current && containerRef.current) {
      activeMoveRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentPly]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16]">
      <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
        <span>Move List Tree</span>
        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-normal">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Notes</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>Arrows</span>
          </span>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-2 pb-10 lg:pb-2 space-y-0.5 text-xs font-mono select-none">
        {/* Starting position row */}
        <div
          onClick={() => goToPly(0)}
          className={`flex items-center px-2 py-1 rounded-md cursor-pointer transition-colors ${
            currentPly === 0
              ? 'bg-emerald-600/25 text-emerald-300 font-bold border border-emerald-500/40'
              : 'hover:bg-slate-900/60 text-slate-400'
          }`}
        >
          <span className="w-8 text-[11px] text-slate-500">0.</span>
          <span className="text-[11px]">Start Position</span>
        </div>

        {movePairs.map((pair) => {
          const isWhiteActive = pair.white?.ply === currentPly;
          const isBlackActive = pair.black?.ply === currentPly;

          return (
            <div
              key={pair.moveNumber}
              className={`flex items-center rounded-md transition-colors text-xs ${
                isWhiteActive || isBlackActive ? 'bg-slate-900/90' : 'hover:bg-slate-900/40'
              }`}
            >
              {/* Move Number */}
              <span className="w-9 px-1.5 py-1 text-slate-500 font-semibold text-[11px] text-right">
                {pair.moveNumber}.
              </span>

              {/* White Move */}
              {pair.white ? (
                <div
                  ref={isWhiteActive ? activeMoveRef : null}
                  onClick={() => goToPly(pair.white!.ply)}
                  className={`flex-1 flex items-center justify-between px-2 py-1 rounded cursor-pointer font-medium transition-all ${
                    isWhiteActive
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="tracking-wide">{pair.white.san}</span>
                  <div className="flex items-center space-x-1">
                    {pair.white.hasAnnotation && (
                      <span
                        title="Contains Strategic Notes"
                        className={`w-2 h-2 rounded-full ${
                          isWhiteActive ? 'bg-amber-300' : 'bg-emerald-400'
                        }`}
                      />
                    )}
                    {pair.white.hasArrows && (
                      <span
                        title="Contains Board Arrows / Highlights"
                        className={`w-2 h-2 rounded-full ${
                          isWhiteActive ? 'bg-amber-300' : 'bg-amber-400'
                        }`}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Black Move */}
              {pair.black ? (
                <div
                  ref={isBlackActive ? activeMoveRef : null}
                  onClick={() => goToPly(pair.black!.ply)}
                  className={`flex-1 flex items-center justify-between px-2 py-1 rounded cursor-pointer font-medium transition-all ml-1 ${
                    isBlackActive
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="tracking-wide">{pair.black.san}</span>
                  <div className="flex items-center space-x-1">
                    {pair.black.hasAnnotation && (
                      <span
                        title="Contains Strategic Notes"
                        className={`w-2 h-2 rounded-full ${
                          isBlackActive ? 'bg-amber-300' : 'bg-emerald-400'
                        }`}
                      />
                    )}
                    {pair.black.hasArrows && (
                      <span
                        title="Contains Board Arrows / Highlights"
                        className={`w-2 h-2 rounded-full ${
                          isBlackActive ? 'bg-amber-300' : 'bg-amber-400'
                        }`}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
