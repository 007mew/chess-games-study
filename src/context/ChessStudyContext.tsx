import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  ChessStudyGame,
  MoveAnnotation,
  MoveHistoryItem,
  PawnStructureType,
  BoardThemeId,
  ArrowColor,
  ArrowAnnotation,
  HighlightedSquare,
  GuessPlanState,
  ReplayPracticeState,
  ReplayPracticeSide
} from '../types/chess';
import { PRESET_GAMES } from '../data/presetGames';
import { searchBestMove, EngineEvaluation } from '../utils/chessEngine';
import { parsePgnToStudyGame, exportStudyGameToPgn } from '../utils/pgnParser';

interface ChessStudyContextType {
  games: ChessStudyGame[];
  currentGame: ChessStudyGame;
  currentPly: number;
  orientation: 'white' | 'black';
  boardTheme: BoardThemeId;
  structureFilter: PawnStructureType | 'All';
  isPlaying: boolean;
  playSpeed: number;
  isEngineEnabled: boolean;
  engineEval: EngineEvaluation | null;
  moveHistory: MoveHistoryItem[];
  currentFen: string;
  currentAnnotation: MoveAnnotation | null;
  activeArrows: ArrowAnnotation[];
  activeSquares: HighlightedSquare[];
  markupToolColor: ArrowColor;
  guessPlanState: GuessPlanState;
  replayPracticeState: ReplayPracticeState;

  // Actions
  selectGame: (gameId: string) => void;
  setStructureFilter: (filter: PawnStructureType | 'All') => void;
  goToPly: (ply: number) => void;
  nextMove: () => void;
  prevMove: () => void;
  firstMove: () => void;
  lastMove: () => void;
  flipBoard: () => void;
  setBoardTheme: (theme: BoardThemeId) => void;
  toggleAutoPlay: () => void;
  setPlaySpeed: (speed: number) => void;
  toggleEngine: () => void;

  // Replay Practice actions
  startReplayPractice: (side?: ReplayPracticeSide, fromPly?: number) => void;
  stopReplayPractice: () => void;
  setReplayPracticeSide: (side: ReplayPracticeSide) => void;
  submitReplayMove: (from: string, to: string) => boolean;
  giveReplayHint: () => void;
  skipReplayMove: () => void;
  restartReplayPractice: () => void;
  toggleReplayAutoFlip: () => void;
  setReplayOpponentDelay: (delayMs: number) => void;

  // Annotation actions
  updateNoteMarkdown: (markdown: string) => void;
  toggleThemeTag: (tag: string) => void;
  updateQuestionAnalysis: (key: 'worstPiece' | 'weakness' | 'pawnBreak' | 'prophylaxis', value: string) => void;
  addArrow: (from: string, to: string, color?: ArrowColor) => void;
  toggleSquareHighlight: (square: string, color?: string) => void;
  clearBoardMarkup: () => void;
  saveBoardMarkupToCurrentMove: () => void;
  setMarkupToolColor: (color: ArrowColor) => void;

  // Guess the Plan actions
  toggleGuessPlanMode: () => void;
  setGuessHypothesis: (hypothesis: string) => void;
  submitGuessPlanMove: (from: string, to: string) => boolean;
  revealGmMove: () => void;

  // Import / Export & Game CRUD
  importPgn: (pgnText: string, structure?: PawnStructureType) => void;
  exportCurrentGamePgn: () => string;
  resetCurrentGameToPreset: () => void;
  resetAllGamesToPresets: () => void;
  createGame: (gameData?: Partial<ChessStudyGame>) => ChessStudyGame;
  duplicateGame: (gameId: string) => ChessStudyGame;
  updateGame: (gameId: string, updates: Partial<ChessStudyGame>) => void;
  deleteGame: (gameId: string) => void;
  clearGameAnnotations: (gameId: string) => void;
  deleteCurrentMoveAnnotation: () => void;
}

const ChessStudyContext = createContext<ChessStudyContextType | null>(null);

const STORAGE_KEY_GAMES = 'gmnotes_saved_games_v1';
const STORAGE_KEY_THEME = 'gmnotes_board_theme_v1';

export const ChessStudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved games from localStorage or fallback to PRESET_GAMES
  const [games, setGames] = useState<ChessStudyGame[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GAMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return PRESET_GAMES;
  });

  const [currentGameId, setCurrentGameId] = useState<string>(PRESET_GAMES[0].id);
  const [currentPly, setCurrentPly] = useState<number>(0);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [boardTheme, setBoardThemeState] = useState<BoardThemeId>(() => {
    try {
      const t = localStorage.getItem(STORAGE_KEY_THEME);
      if (t === 'neo-green' || t === 'classic-walnut' || t === 'clean-slate' || t === 'lichess-wood' || t === 'cyber-neon') {
        return t;
      }
      if (t === 'green') return 'neo-green';
      if (t === 'wood') return 'classic-walnut';
      if (t === 'slate') return 'clean-slate';
      if (t === 'midnight' || t === 'night') return 'cyber-neon';
    } catch {
      // ignore
    }
    return 'neo-green';
  });

  const [structureFilter, setStructureFilter] = useState<PawnStructureType | 'All'>('All');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1500); // ms per move
  const [isEngineEnabled, setIsEngineEnabled] = useState<boolean>(false);
  const [engineEval, setEngineEval] = useState<EngineEvaluation | null>(null);

  // Active markup tool color
  const [markupToolColor, setMarkupToolColor] = useState<ArrowColor>('green');

  // Interactive markup state for the current board
  const [activeArrows, setActiveArrows] = useState<ArrowAnnotation[]>([]);
  const [activeSquares, setActiveSquares] = useState<HighlightedSquare[]>([]);

  // Guess the Plan Training Mode
  const [guessPlanState, setGuessPlanState] = useState<GuessPlanState>({
    isActive: false,
    startPly: 20,
    currentPly: 20,
    hypothesis: '',
    feedback: 'idle',
    score: 0,
    attempts: 0,
    revealedGmMove: false,
  });

  // Replay Practice Mode (Practice from White, Black, or Both sides)
  const initialReplayPracticeState: ReplayPracticeState = useMemo(() => ({
    isActive: false,
    side: 'white',
    startPly: 0,
    currentPly: 0,
    autoFlip: true,
    opponentDelay: 500,
    totalMovesInDrill: 0,
    movesCompleted: 0,
    correctFirstTry: 0,
    attemptsCurrentMove: 0,
    currentStreak: 0,
    bestStreak: 0,
    hintLevel: 0,
    isWaitingForOpponent: false,
    isCompleted: false,
    feedback: 'idle',
    feedbackMessage: '',
    lastPlayedSan: undefined,
  }), []);

  const [replayPracticeState, setReplayPracticeState] = useState<ReplayPracticeState>(initialReplayPracticeState);
  const opponentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpponentTimer = useCallback(() => {
    if (opponentTimerRef.current) {
      clearTimeout(opponentTimerRef.current);
      opponentTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearOpponentTimer();
    };
  }, [clearOpponentTimer]);

  // Current active game object
  const currentGame = useMemo(() => {
    return games.find((g) => g.id === currentGameId) || games[0] || PRESET_GAMES[0];
  }, [games, currentGameId]);

  // Persist games to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(games));
    } catch {
      // ignore
    }
  }, [games]);

  const setBoardTheme = (theme: BoardThemeId) => {
    setBoardThemeState(theme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
  };

  // Build move history list from currentGame.pgn
  const { moveHistory, fenHistory } = useMemo(() => {
    const chess = new Chess();
    try {
      chess.loadPgn(currentGame.pgn);
    } catch {
      // fallback
    }

    const verboseHistory = chess.history({ verbose: true });
    const items: MoveHistoryItem[] = [];
    const fens: string[] = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'];

    const replayChess = new Chess();
    verboseHistory.forEach((move, idx) => {
      replayChess.move(move);
      const ply = idx + 1;
      const fen = replayChess.fen();
      fens.push(fen);

      const annotation = currentGame.annotations[ply];
      const hasAnnotation = Boolean(
        annotation &&
          (annotation.noteMarkdown?.trim() ||
            annotation.questionsAnalysis?.worstPiece ||
            annotation.questionsAnalysis?.weakness ||
            annotation.questionsAnalysis?.pawnBreak ||
            annotation.questionsAnalysis?.prophylaxis)
      );
      const hasArrows = Boolean(
        annotation &&
          ((annotation.arrows && annotation.arrows.length > 0) ||
            (annotation.highlightedSquares && annotation.highlightedSquares.length > 0))
      );
      const hasTags = Boolean(annotation && annotation.themeTags && annotation.themeTags.length > 0);

      items.push({
        ply,
        moveNumber: Math.floor(idx / 2) + 1,
        turn: idx % 2 === 0 ? 'w' : 'b',
        san: move.san,
        from: move.from,
        to: move.to,
        fen,
        hasAnnotation,
        hasArrows,
        hasTags,
      });
    });

    return { moveHistory: items, fenHistory: fens };
  }, [currentGame]);

  // Get current FEN
  const currentFen = useMemo(() => {
    return fenHistory[currentPly] || fenHistory[0];
  }, [fenHistory, currentPly]);

  // Current move annotation
  const currentAnnotation = useMemo(() => {
    return currentGame.annotations[currentPly] || null;
  }, [currentGame, currentPly]);

  // Sync markup with current move annotations whenever ply or game changes
  useEffect(() => {
    const annot = currentGame.annotations[currentPly];
    if (annot) {
      setActiveArrows(annot.arrows ? [...annot.arrows] : []);
      setActiveSquares(annot.highlightedSquares ? [...annot.highlightedSquares] : []);
    } else {
      setActiveArrows([]);
      setActiveSquares([]);
    }
  }, [currentGame, currentPly]);

  // Engine evaluation calculation when enabled
  useEffect(() => {
    if (!isEngineEnabled) {
      setEngineEval(null);
      return;
    }

    try {
      const chess = new Chess(currentFen);
      const evaluation = searchBestMove(chess, 18);
      setEngineEval(evaluation);
    } catch {
      setEngineEval(null);
    }
  }, [currentFen, isEngineEnabled]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentPly((prev) => {
        if (prev < moveHistory.length) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, playSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, moveHistory.length]);

  // Navigation handlers
  const goToPly = useCallback((ply: number) => {
    clearOpponentTimer();
    const clamped = Math.max(0, Math.min(ply, moveHistory.length));
    setCurrentPly(clamped);
    setReplayPracticeState((prev) => {
      if (!prev.isActive) return prev;
      return {
        ...prev,
        currentPly: clamped,
        attemptsCurrentMove: 0,
        hintLevel: 0,
        isWaitingForOpponent: false,
        feedback: 'idle',
      };
    });
  }, [moveHistory.length, clearOpponentTimer]);

  const nextMove = useCallback(() => {
    goToPly(currentPly + 1);
  }, [currentPly, goToPly]);

  const prevMove = useCallback(() => {
    goToPly(currentPly - 1);
  }, [currentPly, goToPly]);

  const firstMove = useCallback(() => {
    goToPly(0);
  }, [goToPly]);

  const lastMove = useCallback(() => {
    goToPly(moveHistory.length);
  }, [moveHistory.length, goToPly]);

  const flipBoard = useCallback(() => {
    setOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleEngine = useCallback(() => {
    setIsEngineEnabled((prev) => !prev);
  }, []);

  const selectGame = useCallback((gameId: string) => {
    clearOpponentTimer();
    setCurrentGameId(gameId);
    setCurrentPly(0);
    setIsPlaying(false);
    // Reset guess plan mode when changing game
    setGuessPlanState((prev: GuessPlanState) => ({
      ...prev,
      isActive: false,
      feedback: 'idle',
      hypothesis: '',
    }));
    setReplayPracticeState(initialReplayPracticeState);
  }, [clearOpponentTimer, initialReplayPracticeState]);

  // Update annotation helper
  const updateCurrentGameAnnotations = useCallback(
    (updater: (currentAnnot: MoveAnnotation) => MoveAnnotation) => {
      if (currentPly === 0) return; // Cannot annotate starting ply 0

      setGames((prevGames) =>
        prevGames.map((game) => {
          if (game.id !== currentGame.id) return game;

          const existingAnnot: MoveAnnotation = game.annotations[currentPly] || {
            ply: currentPly,
            fen: currentFen,
            themeTags: [],
            noteMarkdown: '',
            arrows: [],
            highlightedSquares: [],
          };

          const updatedAnnot = updater(existingAnnot);

          return {
            ...game,
            annotations: {
              ...game.annotations,
              [currentPly]: updatedAnnot,
            },
          };
        })
      );
    },
    [currentPly, currentFen, currentGame.id]
  );

  const updateNoteMarkdown = useCallback((markdown: string) => {
    updateCurrentGameAnnotations((annot) => ({
      ...annot,
      noteMarkdown: markdown,
    }));
  }, [updateCurrentGameAnnotations]);

  const toggleThemeTag = useCallback((tag: string) => {
    updateCurrentGameAnnotations((annot) => {
      const exists = annot.themeTags.includes(tag);
      const newTags = exists
        ? annot.themeTags.filter((t) => t !== tag)
        : [...annot.themeTags, tag];
      return { ...annot, themeTags: newTags };
    });
  }, [updateCurrentGameAnnotations]);

  const updateQuestionAnalysis = useCallback(
    (key: 'worstPiece' | 'weakness' | 'pawnBreak' | 'prophylaxis', value: string) => {
      updateCurrentGameAnnotations((annot) => ({
        ...annot,
        questionsAnalysis: {
          ...annot.questionsAnalysis,
          [key]: value,
        },
      }));
    },
    [updateCurrentGameAnnotations]
  );

  // Arrow & Square markup
  const addArrow = useCallback((from: string, to: string, color?: ArrowColor) => {
    const arrowColor = color || markupToolColor;
    setActiveArrows((prev) => {
      // If arrow exists, remove it (toggle off)
      const existingIdx = prev.findIndex((a) => a.from === from && a.to === to);
      if (existingIdx !== -1) {
        return prev.filter((_, idx) => idx !== existingIdx);
      }
      return [...prev, { from, to, color: arrowColor }];
    });
  }, [markupToolColor]);

  const toggleSquareHighlight = useCallback((square: string, color?: string) => {
    const highlightColor = color || 'rgba(234, 179, 8, 0.45)';
    setActiveSquares((prev) => {
      const existing = prev.find((s) => s.square === square);
      if (existing) {
        return prev.filter((s) => s.square !== square);
      }
      return [...prev, { square, color: highlightColor }];
    });
  }, []);

  const clearBoardMarkup = useCallback(() => {
    setActiveArrows([]);
    setActiveSquares([]);
    if (currentPly > 0) {
      updateCurrentGameAnnotations((annot) => ({
        ...annot,
        arrows: [],
        highlightedSquares: [],
      }));
    }
  }, [currentPly, updateCurrentGameAnnotations]);

  const saveBoardMarkupToCurrentMove = useCallback(() => {
    if (currentPly === 0) return;
    updateCurrentGameAnnotations((annot) => ({
      ...annot,
      arrows: [...activeArrows],
      highlightedSquares: [...activeSquares],
    }));
  }, [currentPly, activeArrows, activeSquares, updateCurrentGameAnnotations]);

  // Guess the plan training mode
  const toggleGuessPlanMode = useCallback(() => {
    setGuessPlanState((prev: GuessPlanState) => {
      const willBeActive = !prev.isActive;
      if (willBeActive) {
        // Start from move 15 (ply 30) or current ply if past move 10
        const start = currentPly >= 16 ? currentPly : 20;
        setCurrentPly(start);
        return {
          isActive: true,
          startPly: start,
          currentPly: start,
          hypothesis: '',
          feedback: 'idle',
          score: 0,
          attempts: 0,
          revealedGmMove: false,
        };
      } else {
        return { ...prev, isActive: false, feedback: 'idle' };
      }
    });
  }, [currentPly]);

  const setGuessHypothesis = useCallback((hypothesis: string) => {
    setGuessPlanState((prev: GuessPlanState) => ({ ...prev, hypothesis }));
  }, []);

  const submitGuessPlanMove = useCallback((from: string, to: string): boolean => {
    const targetMove = moveHistory[currentPly];
    if (!targetMove) return false;

    const isMatch = targetMove.from === from && targetMove.to === to;
    setGuessPlanState((prev: GuessPlanState) => ({
      ...prev,
      attempts: prev.attempts + 1,
      score: isMatch ? prev.score + 10 : prev.score,
      feedback: isMatch ? 'correct' : 'incorrect',
      feedbackMessage: isMatch
        ? `Magnificent! You correctly predicted ${targetMove.san}! GM Plan: ${
            currentAnnotation?.noteMarkdown ? 'See strategic notes' : 'Great strategic intuition.'
          }`
        : `Not quite the GM move (played ${targetMove.san}). Try another positional plan or reveal!`,
    }));

    if (isMatch) {
      // advance to next ply
      goToPly(currentPly + 1);
    }

    return isMatch;
  }, [moveHistory, currentPly, currentAnnotation, goToPly]);

  const revealGmMove = useCallback(() => {
    const targetMove = moveHistory[currentPly];
    if (!targetMove) return;

    setGuessPlanState((prev: GuessPlanState) => ({
      ...prev,
      revealedGmMove: true,
      feedback: 'idle',
      feedbackMessage: `GM played: ${targetMove.san}`,
    }));
    goToPly(currentPly + 1);
  }, [moveHistory, currentPly, goToPly]);

  // Replay Practice Mode Implementations
  const startReplayPractice = useCallback(
    (side: ReplayPracticeSide = 'white', fromPly: number = 0) => {
      clearOpponentTimer();
      setIsPlaying(false);
      // Turn off Guess the Plan mode if active
      setGuessPlanState((prev: GuessPlanState) => ({ ...prev, isActive: false }));

      const maxPly = moveHistory.length;
      let targetStartPly = Math.max(0, Math.min(fromPly, maxPly > 0 ? maxPly - 1 : 0));

      // Calculate total player moves in this drill
      let totalPlayerMoves = 0;
      for (let p = targetStartPly; p < maxPly; p++) {
        if (side === 'both') totalPlayerMoves++;
        else if (side === 'white' && p % 2 === 0) totalPlayerMoves++;
        else if (side === 'black' && p % 2 === 1) totalPlayerMoves++;
      }

      if (side === 'black') {
        setOrientation('black');
        // When practicing Black starting at ply 0, White's first move is automatically played
        if (targetStartPly === 0 && maxPly > 0) {
          targetStartPly = 1;
          setCurrentPly(1);
          const firstWhiteMove = moveHistory[0];
          setReplayPracticeState({
            isActive: true,
            side: 'black',
            startPly: 1,
            currentPly: 1,
            autoFlip: false,
            opponentDelay: 500,
            totalMovesInDrill: Math.max(1, totalPlayerMoves),
            movesCompleted: 0,
            correctFirstTry: 0,
            attemptsCurrentMove: 0,
            currentStreak: 0,
            bestStreak: 0,
            hintLevel: 0,
            isWaitingForOpponent: false,
            isCompleted: false,
            feedback: 'opponent_moved',
            feedbackMessage: `${currentGame.white} opened with ${firstWhiteMove?.san || '1. ...'}. Your turn as Black!`,
            lastPlayedSan: firstWhiteMove?.san,
          });
          return;
        }
      } else if (side === 'white') {
        setOrientation('white');
      } else {
        setOrientation(targetStartPly % 2 === 0 ? 'white' : 'black');
      }

      setCurrentPly(targetStartPly);
      setReplayPracticeState({
        isActive: true,
        side,
        startPly: targetStartPly,
        currentPly: targetStartPly,
        autoFlip: side === 'both',
        opponentDelay: 500,
        totalMovesInDrill: Math.max(1, totalPlayerMoves),
        movesCompleted: 0,
        correctFirstTry: 0,
        attemptsCurrentMove: 0,
        currentStreak: 0,
        bestStreak: 0,
        hintLevel: 0,
        isWaitingForOpponent: false,
        isCompleted: false,
        feedback: 'idle',
        feedbackMessage:
          side === 'white'
            ? `Your turn as White (${currentGame.white}). Find the master's move!`
            : side === 'black'
            ? `Your turn as Black (${currentGame.black}). Find the master's move!`
            : `Practice Both Sides: Play through the game move by move!`,
      });
    },
    [clearOpponentTimer, moveHistory, currentGame]
  );

  const stopReplayPractice = useCallback(() => {
    clearOpponentTimer();
    setReplayPracticeState((prev) => ({
      ...prev,
      isActive: false,
      feedback: 'idle',
    }));
  }, [clearOpponentTimer]);

  const setReplayPracticeSide = useCallback(
    (side: ReplayPracticeSide) => {
      startReplayPractice(side, 0);
    },
    [startReplayPractice]
  );

  const toggleReplayAutoFlip = useCallback(() => {
    setReplayPracticeState((prev) => ({ ...prev, autoFlip: !prev.autoFlip }));
  }, []);

  const setReplayOpponentDelay = useCallback((delayMs: number) => {
    setReplayPracticeState((prev) => ({ ...prev, opponentDelay: delayMs }));
  }, []);

  const restartReplayPractice = useCallback(() => {
    startReplayPractice(replayPracticeState.side, replayPracticeState.startPly);
  }, [startReplayPractice, replayPracticeState.side, replayPracticeState.startPly]);

  const giveReplayHint = useCallback(() => {
    const targetMove = moveHistory[currentPly];
    if (!targetMove) return;

    setReplayPracticeState((prev) => {
      const nextLevel = prev.hintLevel === 0 ? 1 : 2;
      const msg =
        nextLevel === 1
          ? `Hint: Look at the piece on ${targetMove.from.toUpperCase()} (${targetMove.piece ? targetMove.piece.toUpperCase() : 'Piece'})!`
          : `Solution Hint: Move ${targetMove.from.toUpperCase()} to ${targetMove.to.toUpperCase()} (${targetMove.san})!`;
      return {
        ...prev,
        hintLevel: nextLevel,
        feedback: 'idle',
        feedbackMessage: msg,
      };
    });
  }, [currentPly, moveHistory]);

  const skipReplayMove = useCallback(() => {
    const targetMove = moveHistory[currentPly];
    if (!targetMove) return;

    const nextPly = currentPly + 1;
    const isLastMove = nextPly >= moveHistory.length;

    if (isLastMove) {
      setCurrentPly(nextPly);
      setReplayPracticeState((prev) => ({
        ...prev,
        currentPly: nextPly,
        isCompleted: true,
        feedback: 'revealed',
        feedbackMessage: `Master played ${targetMove.san}. Game replay completed!`,
        lastPlayedSan: targetMove.san,
      }));
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      return;
    }

    if (replayPracticeState.side === 'white' || replayPracticeState.side === 'black') {
      setCurrentPly(nextPly);
      const oppMove = moveHistory[nextPly];
      const oppPlayerName = oppMove.turn === 'w' ? currentGame.white : currentGame.black;

      setReplayPracticeState((prev) => ({
        ...prev,
        currentPly: nextPly,
        attemptsCurrentMove: 0,
        hintLevel: 0,
        currentStreak: 0,
        isWaitingForOpponent: true,
        feedback: 'revealed',
        feedbackMessage: `Master played ${targetMove.san}. ${oppPlayerName} is responding...`,
        lastPlayedSan: targetMove.san,
      }));

      clearOpponentTimer();
      opponentTimerRef.current = setTimeout(() => {
        const afterOppPly = nextPly + 1;
        setCurrentPly(afterOppPly);
        const isFinishedAfterOpp = afterOppPly >= moveHistory.length;

        if (isFinishedAfterOpp) {
          setReplayPracticeState((prev) => ({
            ...prev,
            currentPly: afterOppPly,
            isWaitingForOpponent: false,
            isCompleted: true,
            feedback: 'correct',
            feedbackMessage: `Opponent responded with ${oppMove.san}. Game finished!`,
            lastPlayedSan: oppMove.san,
          }));
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } else {
          setReplayPracticeState((prev) => ({
            ...prev,
            currentPly: afterOppPly,
            isWaitingForOpponent: false,
            attemptsCurrentMove: 0,
            hintLevel: 0,
            feedback: 'opponent_moved',
            feedbackMessage: `${oppPlayerName} played ${oppMove.san}. Your turn!`,
            lastPlayedSan: oppMove.san,
          }));
        }
      }, replayPracticeState.opponentDelay);
    } else {
      // Both sides
      setCurrentPly(nextPly);
      if (replayPracticeState.autoFlip) {
        setOrientation(nextPly % 2 === 0 ? 'white' : 'black');
      }
      setReplayPracticeState((prev) => ({
        ...prev,
        currentPly: nextPly,
        attemptsCurrentMove: 0,
        hintLevel: 0,
        currentStreak: 0,
        feedback: 'revealed',
        feedbackMessage: `Revealed: ${targetMove.san}. Now play the next move!`,
        lastPlayedSan: targetMove.san,
      }));
    }
  }, [
    currentPly,
    moveHistory,
    currentGame,
    clearOpponentTimer,
    replayPracticeState.side,
    replayPracticeState.autoFlip,
    replayPracticeState.opponentDelay,
  ]);

  const submitReplayMove = useCallback(
    (from: string, to: string): boolean => {
      if (replayPracticeState.isWaitingForOpponent || replayPracticeState.isCompleted) {
        return false;
      }

      const targetMove = moveHistory[currentPly];
      if (!targetMove) return false;

      // Verify whose turn it is
      const isWhiteTurn = currentPly % 2 === 0;
      if (replayPracticeState.side === 'white' && !isWhiteTurn) return false;
      if (replayPracticeState.side === 'black' && isWhiteTurn) return false;

      const isMatch =
        targetMove.from.toLowerCase() === from.toLowerCase() &&
        targetMove.to.toLowerCase() === to.toLowerCase();

      if (isMatch) {
        const isFirstTry =
          replayPracticeState.attemptsCurrentMove === 0 && replayPracticeState.hintLevel === 0;
        const nextStreak = replayPracticeState.currentStreak + 1;
        const nextBestStreak = Math.max(replayPracticeState.bestStreak, nextStreak);
        const nextCorrectFirstTry = isFirstTry
          ? replayPracticeState.correctFirstTry + 1
          : replayPracticeState.correctFirstTry;
        const nextCompleted = replayPracticeState.movesCompleted + 1;
        const nextPly = currentPly + 1;
        const isLastMove = nextPly >= moveHistory.length;

        // Check if move has study annotations for strategic context
        const annot = currentGame.annotations[nextPly];
        const annotNote = annot?.noteMarkdown
          ? ` • Note: ${annot.noteMarkdown.split('\n')[0].replace(/[*#]/g, '').trim()}`
          : '';

        if (isLastMove) {
          setCurrentPly(nextPly);
          setReplayPracticeState((prev) => ({
            ...prev,
            currentPly: nextPly,
            movesCompleted: nextCompleted,
            correctFirstTry: nextCorrectFirstTry,
            currentStreak: nextStreak,
            bestStreak: nextBestStreak,
            attemptsCurrentMove: 0,
            hintLevel: 0,
            isCompleted: true,
            feedback: 'correct',
            feedbackMessage: `Magnificent! Final move ${targetMove.san} played! Game practice completed!`,
            lastPlayedSan: targetMove.san,
          }));
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          return true;
        }

        if (replayPracticeState.side === 'both') {
          setCurrentPly(nextPly);
          if (replayPracticeState.autoFlip) {
            setOrientation(nextPly % 2 === 0 ? 'white' : 'black');
          }
          setReplayPracticeState((prev) => ({
            ...prev,
            currentPly: nextPly,
            movesCompleted: nextCompleted,
            correctFirstTry: nextCorrectFirstTry,
            currentStreak: nextStreak,
            bestStreak: nextBestStreak,
            attemptsCurrentMove: 0,
            hintLevel: 0,
            feedback: 'correct',
            feedbackMessage: `Correct! ${targetMove.san} played.${annotNote}`,
            lastPlayedSan: targetMove.san,
          }));
          return true;
        }

        // Single-side mode (White or Black): Opponent responds!
        setCurrentPly(nextPly);
        const oppMove = moveHistory[nextPly];
        const oppPlayerName = oppMove.turn === 'w' ? currentGame.white : currentGame.black;

        setReplayPracticeState((prev) => ({
          ...prev,
          currentPly: nextPly,
          movesCompleted: nextCompleted,
          correctFirstTry: nextCorrectFirstTry,
          currentStreak: nextStreak,
          bestStreak: nextBestStreak,
          attemptsCurrentMove: 0,
          hintLevel: 0,
          isWaitingForOpponent: true,
          feedback: 'correct',
          feedbackMessage: `Brilliant! You found ${targetMove.san}.${annotNote} ${oppPlayerName} is responding...`,
          lastPlayedSan: targetMove.san,
        }));

        clearOpponentTimer();
        opponentTimerRef.current = setTimeout(() => {
          const afterOppPly = nextPly + 1;
          setCurrentPly(afterOppPly);
          const isFinishedAfterOpp = afterOppPly >= moveHistory.length;

          if (isFinishedAfterOpp) {
            setReplayPracticeState((prev) => ({
              ...prev,
              currentPly: afterOppPly,
              isWaitingForOpponent: false,
              isCompleted: true,
              feedback: 'correct',
              feedbackMessage: `Game complete! ${oppPlayerName} played final move ${oppMove.san}. Excellent drill!`,
              lastPlayedSan: oppMove.san,
            }));
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          } else {
            setReplayPracticeState((prev) => ({
              ...prev,
              currentPly: afterOppPly,
              isWaitingForOpponent: false,
              attemptsCurrentMove: 0,
              hintLevel: 0,
              feedback: 'opponent_moved',
              feedbackMessage: `${oppPlayerName} responded with ${oppMove.san}. Your turn!`,
              lastPlayedSan: oppMove.san,
            }));
          }
        }, replayPracticeState.opponentDelay);

        return true;
      } else {
        // Move was incorrect
        let isLegal = false;
        let legalSan = '';
        try {
          const chess = new Chess(currentFen);
          const testMove = chess.move({ from, to, promotion: 'q' });
          if (testMove) {
            isLegal = true;
            legalSan = testMove.san;
          }
        } catch {
          // not legal
        }

        setReplayPracticeState((prev) => ({
          ...prev,
          attemptsCurrentMove: prev.attemptsCurrentMove + 1,
          currentStreak: 0,
          feedback: 'incorrect',
          feedbackMessage: isLegal
            ? `"${legalSan}" is a legal chess move, but not the GM's choice. Try another plan or ask for a hint!`
            : `Illegal move. Check the square and try again!`,
        }));
        return false;
      }
    },
    [
      currentPly,
      currentFen,
      currentGame,
      moveHistory,
      clearOpponentTimer,
      replayPracticeState.isWaitingForOpponent,
      replayPracticeState.isCompleted,
      replayPracticeState.side,
      replayPracticeState.autoFlip,
      replayPracticeState.opponentDelay,
      replayPracticeState.attemptsCurrentMove,
      replayPracticeState.hintLevel,
      replayPracticeState.currentStreak,
      replayPracticeState.bestStreak,
      replayPracticeState.correctFirstTry,
      replayPracticeState.movesCompleted,
    ]
  );

  // Import / Export
  const importPgn = useCallback((pgnText: string, userStructure?: PawnStructureType) => {
    try {
      const newGame = parsePgnToStudyGame(pgnText, userStructure);
      setGames((prev) => [newGame, ...prev]);
      setCurrentGameId(newGame.id);
      setCurrentPly(0);
    } catch (err) {
      console.error('Failed to parse Pgn', err);
      alert('Could not parse PGN. Please verify the PGN format.');
    }
  }, []);

  const exportCurrentGamePgn = useCallback(() => {
    return exportStudyGameToPgn(currentGame);
  }, [currentGame]);

  const resetCurrentGameToPreset = useCallback(() => {
    const originalPreset = PRESET_GAMES.find((g) => g.id === currentGame.id);
    if (originalPreset) {
      setGames((prev) =>
        prev.map((g) => (g.id === originalPreset.id ? { ...originalPreset } : g))
      );
    }
  }, [currentGame.id]);

  const resetAllGamesToPresets = useCallback(() => {
    setGames(PRESET_GAMES);
    setCurrentGameId(PRESET_GAMES[0].id);
    setCurrentPly(0);
    try {
      localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(PRESET_GAMES));
    } catch {
      // ignore
    }
  }, []);

  const createGame = useCallback((gameData?: Partial<ChessStudyGame>): ChessStudyGame => {
    const dateStr = gameData?.date || new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const defaultPgn = `[Event "${gameData?.event || 'Middlegame Study'}"]
[Site "GrandmasterNotes"]
[Date "${dateStr}"]
[Round "1"]
[White "${gameData?.white || 'White Player'}"]
[Black "${gameData?.black || 'Black Player'}"]
[Result "${gameData?.result || '*'}"]
[ECO "${gameData?.eco || 'A00'}"]
[Opening "${gameData?.openingName || 'Standard Initial Position'}"]

*`;

    let pgnToUse = gameData?.pgn?.trim() || defaultPgn;
    try {
      const test = new Chess();
      test.loadPgn(pgnToUse);
    } catch {
      pgnToUse = defaultPgn;
    }

    const newGame: ChessStudyGame = {
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      white: gameData?.white || 'White Player',
      black: gameData?.black || 'Black Player',
      whiteElo: gameData?.whiteElo,
      blackElo: gameData?.blackElo,
      year: gameData?.year || new Date().getFullYear(),
      date: dateStr,
      event: gameData?.event || 'Middlegame Study',
      site: gameData?.site || 'GrandmasterNotes',
      round: gameData?.round,
      result: gameData?.result || '*',
      eco: gameData?.eco || 'A00',
      openingName: gameData?.openingName || 'Custom Study',
      primaryPawnStructure: gameData?.primaryPawnStructure || 'Custom',
      keyMiddlegameIdea: gameData?.keyMiddlegameIdea || '',
      pgn: pgnToUse,
      annotations: gameData?.annotations ? JSON.parse(JSON.stringify(gameData.annotations)) : {},
    };

    setGames((prev) => [newGame, ...prev]);
    setCurrentGameId(newGame.id);
    setCurrentPly(0);
    return newGame;
  }, []);

  const duplicateGame = useCallback((gameId: string): ChessStudyGame => {
    const original = games.find((g) => g.id === gameId) || currentGame;
    const duplicatedGame: ChessStudyGame = {
      ...original,
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      event: original.event.includes('(Copy)') ? original.event : `${original.event} (Copy)`,
      annotations: JSON.parse(JSON.stringify(original.annotations || {})),
    };

    setGames((prev) => {
      const idx = prev.findIndex((g) => g.id === gameId);
      if (idx !== -1) {
        const copy = [...prev];
        copy.splice(idx + 1, 0, duplicatedGame);
        return copy;
      }
      return [duplicatedGame, ...prev];
    });

    setCurrentGameId(duplicatedGame.id);
    setCurrentPly(0);
    return duplicatedGame;
  }, [games, currentGame]);

  const updateGame = useCallback((gameId: string, updates: Partial<ChessStudyGame>) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;

        let pgnToUse = updates.pgn !== undefined ? updates.pgn : g.pgn;
        if (updates.pgn !== undefined && updates.pgn.trim()) {
          try {
            const test = new Chess();
            test.loadPgn(updates.pgn);
            pgnToUse = updates.pgn;
          } catch (e) {
            console.warn('Invalid PGN update, maintaining existing game PGN', e);
            pgnToUse = g.pgn;
          }
        }

        return {
          ...g,
          ...updates,
          pgn: pgnToUse,
        };
      })
    );
  }, []);

  const deleteGame = useCallback((gameId: string) => {
    setGames((prev) => {
      if (prev.length <= 1) {
        // Fallback to initial preset so app always has at least one game
        const fallback = PRESET_GAMES[0];
        setCurrentGameId(fallback.id);
        setCurrentPly(0);
        return [fallback];
      }

      const filtered = prev.filter((g) => g.id !== gameId);

      if (gameId === currentGameId) {
        const deletedIdx = prev.findIndex((g) => g.id === gameId);
        const nextActive = filtered[Math.min(deletedIdx, filtered.length - 1)] || filtered[0];
        if (nextActive) {
          setCurrentGameId(nextActive.id);
          setCurrentPly(0);
        }
      }

      return filtered;
    });
  }, [currentGameId]);

  const clearGameAnnotations = useCallback((gameId: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;
        return {
          ...g,
          annotations: {},
        };
      })
    );
    if (currentGame.id === gameId) {
      setActiveArrows([]);
      setActiveSquares([]);
    }
  }, [currentGame.id]);

  const deleteCurrentMoveAnnotation = useCallback(() => {
    if (currentPly === 0) return;
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== currentGame.id) return g;
        const newAnnotations = { ...g.annotations };
        delete newAnnotations[currentPly];
        return {
          ...g,
          annotations: newAnnotations,
        };
      })
    );
    setActiveArrows([]);
    setActiveSquares([]);
  }, [currentPly, currentGame.id]);

  return (
    <ChessStudyContext.Provider
      value={{
        games,
        currentGame,
        currentPly,
        orientation,
        boardTheme,
        structureFilter,
        isPlaying,
        playSpeed,
        isEngineEnabled,
        engineEval,
        moveHistory,
        currentFen,
        currentAnnotation,
        activeArrows,
        activeSquares,
        markupToolColor,
        guessPlanState,
        replayPracticeState,
        selectGame,
        setStructureFilter,
        goToPly,
        nextMove,
        prevMove,
        firstMove,
        lastMove,
        flipBoard,
        setBoardTheme,
        toggleAutoPlay,
        setPlaySpeed,
        toggleEngine,
        startReplayPractice,
        stopReplayPractice,
        setReplayPracticeSide,
        submitReplayMove,
        giveReplayHint,
        skipReplayMove,
        restartReplayPractice,
        toggleReplayAutoFlip,
        setReplayOpponentDelay,
        updateNoteMarkdown,
        toggleThemeTag,
        updateQuestionAnalysis,
        addArrow,
        toggleSquareHighlight,
        clearBoardMarkup,
        saveBoardMarkupToCurrentMove,
        setMarkupToolColor,
        toggleGuessPlanMode,
        setGuessHypothesis,
        submitGuessPlanMove,
        revealGmMove,
        importPgn,
        exportCurrentGamePgn,
        resetCurrentGameToPreset,
        resetAllGamesToPresets,
        createGame,
        duplicateGame,
        updateGame,
        deleteGame,
        clearGameAnnotations,
        deleteCurrentMoveAnnotation,
      }}
    >
      {children}
    </ChessStudyContext.Provider>
  );
};

export const useChessStudy = () => {
  const context = useContext(ChessStudyContext);
  if (!context) {
    throw new Error('useChessStudy must be used within a ChessStudyProvider');
  }
  return context;
};
