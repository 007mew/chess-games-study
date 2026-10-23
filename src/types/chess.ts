export type PawnStructureType =
  | 'Carlsbad'
  | 'IQP'
  | 'Hanging Pawns'
  | 'Closed'
  | 'Open'
  | 'Benoni'
  | 'Custom';

export type ArrowColor = 'green' | 'red' | 'blue' | 'yellow';

export interface ArrowAnnotation {
  from: string;
  to: string;
  color: ArrowColor;
}

export type BoardArrow = ArrowAnnotation;

export interface HighlightedSquare {
  square: string;
  color: string;
}

export interface StrategicQuestionsAnalysis {
  worstPiece?: string;
  weakness?: string;
  pawnBreak?: string;
  prophylaxis?: string;
}

export interface MoveAnnotation {
  ply: number;
  fen: string;
  themeTags: string[];
  noteMarkdown: string;
  questionsAnalysis?: StrategicQuestionsAnalysis;
  arrows: ArrowAnnotation[];
  highlightedSquares: HighlightedSquare[];
}

export interface ChessStudyGame {
  id: string;
  white: string;
  black: string;
  whiteElo?: string;
  blackElo?: string;
  year: number;
  date?: string;
  event: string;
  site?: string;
  round?: string;
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  eco: string;
  openingName: string;
  primaryPawnStructure: PawnStructureType;
  keyMiddlegameIdea?: string;
  pgn: string;
  sourceUrl?: string;
  annotations: Record<number, MoveAnnotation>;
}

export interface MoveHistoryItem {
  ply: number;
  moveNumber: number;
  turn: 'w' | 'b';
  san: string;
  from: string;
  to: string;
  fen: string;
  captured?: string;
  piece?: string;
  isCheck?: boolean;
  isCheckmate?: boolean;
  comment?: string;
  hasAnnotation?: boolean;
  hasArrows?: boolean;
  hasTags?: boolean;
}

export type ParsedMove = MoveHistoryItem;

export interface GuessPlanState {
  isActive: boolean;
  startPly: number;
  currentPly: number;
  hypothesis: string;
  feedback: 'idle' | 'correct' | 'incorrect';
  score: number;
  attempts: number;
  revealedGmMove: boolean;
  feedbackMessage?: string;
}

export type GuessThePlanState = GuessPlanState;

export type ReplayPracticeSide = 'white' | 'black' | 'both';

export interface ReplayPracticeState {
  isActive: boolean;
  side: ReplayPracticeSide;
  startPly: number;
  currentPly: number;
  autoFlip: boolean;
  opponentDelay: number;
  totalMovesInDrill: number;
  movesCompleted: number;
  correctFirstTry: number;
  attemptsCurrentMove: number;
  currentStreak: number;
  bestStreak: number;
  hintLevel: number; // 0 = none, 1 = piece square, 2 = target arrow
  isWaitingForOpponent: boolean;
  isCompleted: boolean;
  feedback: 'idle' | 'correct' | 'incorrect' | 'opponent_moved' | 'revealed';
  feedbackMessage?: string;
  lastPlayedSan?: string;
}

export type BoardThemeId =
  | 'neo-green'
  | 'classic-walnut'
  | 'clean-slate'
  | 'lichess-wood'
  | 'cyber-neon';

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  lightBg: string;
  darkBg: string;
  lightText: string;
  darkText: string;
  borderClass?: string;
}

export type BoardThemeLegacy = 'wood' | 'slate' | 'midnight' | 'green' | 'night';
export type BoardThemeName = BoardThemeId | BoardThemeLegacy;
