import { Chess } from 'chess.js';
import {
  ChessStudyGame,
  MoveAnnotation,
  ArrowAnnotation,
  HighlightedSquare,
  ArrowColor,
  PawnStructureType,
} from '../types/chess';

export interface ExtractedMarkup {
  cleanComment: string;
  arrows: ArrowAnnotation[];
  highlightedSquares: HighlightedSquare[];
}

const COLOR_TO_PGN_CHAR: Record<ArrowColor, string> = {
  green: 'G',
  red: 'R',
  yellow: 'Y',
  blue: 'B',
};

const PGN_CHAR_TO_COLOR: Record<string, ArrowColor> = {
  G: 'green',
  R: 'red',
  Y: 'yellow',
  B: 'blue',
};

const COLOR_TO_SQUARE_FILL: Record<string, string> = {
  green: 'rgba(34, 197, 94, 0.45)',
  red: 'rgba(239, 68, 68, 0.45)',
  yellow: 'rgba(234, 179, 8, 0.45)',
  blue: 'rgba(59, 130, 246, 0.45)',
};

/**
 * Extracts [%csl ...] and [%cal ...] tags from comment strings
 */
export function extractMarkupFromComment(comment: string): ExtractedMarkup {
  const arrows: ArrowAnnotation[] = [];
  const highlightedSquares: HighlightedSquare[] = [];

  // Match [%csl Gc5,Rd5]
  const cslMatch = comment.match(/\[%csl\s+([^\]]+)\]/i);
  if (cslMatch && cslMatch[1]) {
    const tokens = cslMatch[1].split(/[\s,]+/);
    for (const token of tokens) {
      if (token.length >= 3) {
        const colorChar = token[0].toUpperCase();
        const sq = token.slice(1).toLowerCase();
        const colorName = PGN_CHAR_TO_COLOR[colorChar] || 'yellow';
        highlightedSquares.push({
          square: sq,
          color: COLOR_TO_SQUARE_FILL[colorName] || 'rgba(234, 179, 8, 0.4)',
        });
      }
    }
  }

  // Match [%cal Ge3e4,Re4d6]
  const calMatch = comment.match(/\[%cal\s+([^\]]+)\]/i);
  if (calMatch && calMatch[1]) {
    const tokens = calMatch[1].split(/[\s,]+/);
    for (const token of tokens) {
      if (token.length >= 5) {
        const colorChar = token[0].toUpperCase();
        const from = token.slice(1, 3).toLowerCase();
        const to = token.slice(3, 5).toLowerCase();
        const color = PGN_CHAR_TO_COLOR[colorChar] || 'green';
        arrows.push({ from, to, color });
      }
    }
  }

  // Clean the comment by removing markup tags
  const cleanComment = comment
    .replace(/\[%csl\s+[^\]]+\]/gi, '')
    .replace(/\[%cal\s+[^\]]+\]/gi, '')
    .trim();

  return { cleanComment, arrows, highlightedSquares };
}

/**
 * Generates [%csl ...] and [%cal ...] strings
 */
export function formatMarkupForPgn(
  arrows: ArrowAnnotation[],
  squares: HighlightedSquare[]
): string {
  const parts: string[] = [];

  if (squares.length > 0) {
    const cslTokens = squares.map((s) => {
      let char = 'Y';
      if (s.color.includes('34, 197, 94') || s.color === 'green') char = 'G';
      else if (s.color.includes('239, 68, 68') || s.color === 'red') char = 'R';
      else if (s.color.includes('59, 130, 246') || s.color === 'blue') char = 'B';
      return `${char}${s.square.toLowerCase()}`;
    });
    parts.push(`[%csl ${cslTokens.join(',')}]`);
  }

  if (arrows.length > 0) {
    const calTokens = arrows.map((a) => {
      const char = COLOR_TO_PGN_CHAR[a.color] || 'G';
      return `${char}${a.from.toLowerCase()}${a.to.toLowerCase()}`;
    });
    parts.push(`[%cal ${calTokens.join(',')}]`);
  }

  return parts.join(' ');
}

/**
 * Infer pawn structure from ECO or PGN text
 */
export function inferPawnStructure(eco: string, pgn: string): PawnStructureType {
  const pgnLower = pgn.toLowerCase();
  if (eco.startsWith('D35') || eco.startsWith('D36') || pgnLower.includes('carlsbad') || pgnLower.includes('exchange')) {
    return 'Carlsbad';
  }
  if (eco.startsWith('D4') || eco.startsWith('B14') || pgnLower.includes('iqp') || pgnLower.includes('isolated')) {
    return 'IQP';
  }
  if (eco.startsWith('D58') || eco.startsWith('D59') || pgnLower.includes('hanging')) {
    return 'Hanging Pawns';
  }
  if (eco.startsWith('E9') || eco.startsWith('E8') || eco.startsWith('C0') || pgnLower.includes('french') || pgnLower.includes("king's indian")) {
    return 'Closed';
  }
  if (eco.startsWith('A6') || eco.startsWith('A7') || pgnLower.includes('benoni')) {
    return 'Benoni';
  }
  if (eco.startsWith('C4') || eco.startsWith('C5') || eco.startsWith('A8')) {
    return 'Open';
  }
  return 'Custom';
}

/**
 * Parse an uploaded or pasted PGN into a ChessStudyGame
 */
export function parsePgnToStudyGame(
  pgnText: string,
  userStructure?: PawnStructureType
): ChessStudyGame {
  const chess = new Chess();
  chess.loadPgn(pgnText);

  // Extract header tags
  const headers = chess.header();
  const white = headers['White'] || 'White';
  const black = headers['Black'] || 'Black';
  const event = headers['Event'] || 'Casual Study';
  const date = headers['Date'] || '';
  const yearMatch = date.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
  const rawResult = headers['Result'];
  const result = (rawResult === '1-0' || rawResult === '0-1' || rawResult === '1/2-1/2') ? rawResult : '*';
  const eco = headers['ECO'] || 'A00';
  const openingName = headers['Opening'] || `${white} vs ${black}`;

  // Analyze moves to extract comments & markup
  const annotations: Record<number, MoveAnnotation> = {};
  const moveHistory = chess.history({ verbose: true });

  // Replay moves to get FEN and comments
  const replayChess = new Chess();
  moveHistory.forEach((move, index) => {
    replayChess.move(move);
    const ply = index + 1;
    // Check if comments exist for this move
    const comments = chess.getComments();
    const matchingCommentObj = comments.find((c) => c.fen === replayChess.fen());
    const rawComment = matchingCommentObj ? matchingCommentObj.comment : '';

    if (rawComment) {
      const { cleanComment, arrows, highlightedSquares } = extractMarkupFromComment(rawComment);
      if (cleanComment || arrows.length > 0 || highlightedSquares.length > 0) {
        annotations[ply] = {
          ply,
          fen: replayChess.fen(),
          themeTags: [],
          noteMarkdown: cleanComment,
          arrows,
          highlightedSquares,
        };
      }
    }
  });

  // Infer pawn structure if not provided
  const structure: PawnStructureType = userStructure || inferPawnStructure(eco, pgnText);

  return {
    id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    white,
    black,
    year,
    event,
    result,
    eco,
    openingName,
    primaryPawnStructure: structure,
    pgn: pgnText,
    annotations,
    round: headers['Round'] || undefined,
    site: headers['Site'] || undefined,
  };
}

/**
 * Serialize a ChessStudyGame with all notes, 4-questions, and [%csl]/[%cal] into standard PGN string
 */
export function exportStudyGameToPgn(game: ChessStudyGame): string {
  const chess = new Chess();
  try {
    chess.loadPgn(game.pgn);
  } catch {
    return game.pgn;
  }

  chess.deleteComments();

  // Create a new chess instance, replay moves, and attach comments
  const exportChess = new Chess();
  const headers = chess.header();
  for (const [k, v] of Object.entries(headers)) {
    if (v) exportChess.header(k, v);
  }
  exportChess.header('StudyStructure', game.primaryPawnStructure);

  const history = chess.history({ verbose: true });
  history.forEach((move, idx) => {
    exportChess.move(move);
    const ply = idx + 1;
    const annotation = game.annotations[ply];
    if (annotation) {
      const commentSections: string[] = [];

      // Notes
      if (annotation.noteMarkdown?.trim()) {
        commentSections.push(annotation.noteMarkdown.trim());
      }

      // 4 Questions Strategic Framework
      if (annotation.questionsAnalysis) {
        const q = annotation.questionsAnalysis;
        const qLines: string[] = [];
        if (q.worstPiece) qLines.push(`[Worst Piece]: ${q.worstPiece}`);
        if (q.weakness) qLines.push(`[Key Weakness]: ${q.weakness}`);
        if (q.pawnBreak) qLines.push(`[Pawn Break]: ${q.pawnBreak}`);
        if (q.prophylaxis) qLines.push(`[Prophylaxis]: ${q.prophylaxis}`);
        if (qLines.length > 0) {
          commentSections.push(`Strategic Framework:\n${qLines.join('\n')}`);
        }
      }

      // Theme tags
      if (annotation.themeTags && annotation.themeTags.length > 0) {
        commentSections.push(`Themes: ${annotation.themeTags.join(', ')}`);
      }

      // Board Markup [%csl] [%cal]
      const markup = formatMarkupForPgn(
        annotation.arrows || [],
        annotation.highlightedSquares || []
      );
      if (markup) {
        commentSections.push(markup);
      }

      if (commentSections.length > 0) {
        exportChess.setComment(commentSections.join('\n\n'));
      }
    }
  });

  return exportChess.pgn();
}

/**
 * Splits a multi-game PGN string into individual PGN game strings
 */
export function splitMultiGamePgn(multiPgn: string): string[] {
  const games: string[] = [];
  const lines = multiPgn.split(/\r?\n/);
  let currentGameLines: string[] = [];
  let inHeader = false;

  for (const line of lines) {
    const isTagLine = line.trim().startsWith('[');
    if (isTagLine && !inHeader && currentGameLines.length > 0) {
      const prevText = currentGameLines.join('\n').trim();
      if (prevText.includes('1.') || prevText.includes('1-0') || prevText.includes('0-1')) {
        games.push(prevText);
        currentGameLines = [];
      }
    }

    if (isTagLine) {
      inHeader = true;
    } else if (line.trim().length > 0) {
      inHeader = false;
    }

    currentGameLines.push(line);
  }

  if (currentGameLines.length > 0) {
    const finalGame = currentGameLines.join('\n').trim();
    if (finalGame) games.push(finalGame);
  }

  return games.length > 0 ? games : [multiPgn.trim()];
}
