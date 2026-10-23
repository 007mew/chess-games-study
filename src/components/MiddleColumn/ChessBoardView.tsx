import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessStudy } from '../../context/ChessStudyContext';
import { ArrowColor } from '../../types/chess';
import { BOARD_THEMES } from '../../utils/themes';

export const ChessBoardView: React.FC = () => {
  const {
    currentFen,
    orientation,
    boardTheme,
    activeArrows,
    activeSquares,
    toggleSquareHighlight,
    markupToolColor,
    guessPlanState,
    submitGuessPlanMove,
    replayPracticeState,
    submitReplayMove,
    moveHistory,
    currentPly,
  } = useChessStudy();

  const containerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState<number>(460);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // Measure container width responsively for crisp mobile & desktop rendering
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        if (clientWidth > 0) {
          setBoardWidth(clientWidth);
        }
      }
    };

    updateSize();

    // ResizeObserver for instant container-aware resize (window resize, orientation change, layout shift)
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      const observer = new ResizeObserver(() => updateSize());
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Clear selected tap-to-move square when FEN or ply changes
  useEffect(() => {
    setSelectedSquare(null);
  }, [currentFen, currentPly]);

  // Active theme definition from BOARD_THEMES
  const currentTheme = useMemo(() => {
    return BOARD_THEMES[boardTheme] || BOARD_THEMES['neo-green'];
  }, [boardTheme]);

  // Convert active arrows to react-chessboard arrow format [from, to, colorHex]
  const formattedArrows: any = useMemo(() => {
    const colorHexMap: Record<ArrowColor, string> = {
      green: '#10b981', // emerald
      red: '#ef4444',   // rose/red
      blue: '#38bdf8',  // sky/cyan
      yellow: '#f59e0b', // amber
    };

    const arrows = activeArrows.map((a) => [a.from, a.to, (colorHexMap as any)[a.color] || '#10b981']);

    // Show hint arrow during Replay Practice if hint level >= 2
    if (replayPracticeState.isActive && replayPracticeState.hintLevel >= 2) {
      const target = moveHistory[currentPly];
      if (target) {
        arrows.push([target.from, target.to, '#f59e0b']);
      }
    }

    return arrows;
  }, [activeArrows, replayPracticeState.isActive, replayPracticeState.hintLevel, moveHistory, currentPly]);

  // Convert active squares to react-chessboard square styles
  const formattedSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    activeSquares.forEach((s) => {
      styles[s.square] = {
        backgroundColor: s.color,
        borderRadius: '4px',
      };
    });

    // Show selected square for tap-to-move on mobile
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(16, 185, 129, 0.45)',
        borderRadius: '4px',
        boxShadow: 'inset 0 0 0 3px rgba(16, 185, 129, 0.95)',
      };
    }

    // Show piece highlight during Replay Practice if hint level >= 1
    if (replayPracticeState.isActive && replayPracticeState.hintLevel >= 1) {
      const target = moveHistory[currentPly];
      if (target) {
        styles[target.from] = {
          backgroundColor: 'rgba(245, 158, 11, 0.45)',
          borderRadius: '4px',
          boxShadow: 'inset 0 0 0 3px rgba(245, 158, 11, 0.95)',
        };
      }
    }

    return styles;
  }, [activeSquares, selectedSquare, replayPracticeState.isActive, replayPracticeState.hintLevel, moveHistory, currentPly]);

  // Handle piece drop (for Replay Practice and Guess the Plan modes)
  const onPieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    setSelectedSquare(null);
    if (replayPracticeState.isActive) {
      return submitReplayMove(sourceSquare, targetSquare);
    }
    if (guessPlanState.isActive) {
      return submitGuessPlanMove(sourceSquare, targetSquare);
    }
    return false;
  };

  // Tap-to-move / Click-to-move support (especially convenient for mobile touch)
  const onSquareClick = (square: string) => {
    if (selectedSquare) {
      if (selectedSquare === square) {
        // Deselect if tapping same square
        setSelectedSquare(null);
        return;
      }
      // Attempt move from selectedSquare to square
      const moved = onPieceDrop(selectedSquare, square);
      if (moved) {
        setSelectedSquare(null);
        return;
      }
    }

    // Otherwise select the square to start a move
    if (replayPracticeState.isActive || guessPlanState.isActive) {
      setSelectedSquare(square);
    }
  };

  // Handle right-click on squares for highlighting
  const onSquareRightClick = (square: string) => {
    const colorMap: Record<ArrowColor, string> = {
      green: 'rgba(34, 197, 94, 0.5)',
      red: 'rgba(239, 68, 68, 0.5)',
      blue: 'rgba(56, 189, 248, 0.5)',
      yellow: 'rgba(234, 179, 8, 0.5)',
    };
    toggleSquareHighlight(square, colorMap[markupToolColor]);
  };

  // Convert tool color name to hex for react-chessboard arrow drawing
  const currentArrowColorHex = useMemo(() => {
    switch (markupToolColor) {
      case 'red':
        return '#ef4444';
      case 'blue':
        return '#38bdf8';
      case 'yellow':
        return '#f59e0b';
      case 'green':
      default:
        return '#10b981';
    }
  }, [markupToolColor]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center w-full max-w-[min(100%,540px)] xl:max-w-[580px] aspect-square mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-700/60 bg-[#090d16] transition-all duration-300 touch-none select-none ${
        currentTheme.borderClass || ''
      }`}
    >
      <Chessboard
        boardWidth={boardWidth}
        position={currentFen}
        boardOrientation={orientation}
        customDarkSquareStyle={{ backgroundColor: currentTheme.darkBg }}
        customLightSquareStyle={{ backgroundColor: currentTheme.lightBg }}
        customArrows={formattedArrows as any}
        customSquareStyles={formattedSquareStyles}
        customArrowColor={currentArrowColorHex}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        animationDuration={200}
        showBoardNotation={true}
        arePremovesAllowed={false}
      />
    </div>
  );
};
