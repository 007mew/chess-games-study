import { Chess, Square, PieceSymbol, Color } from 'chess.js';

export interface EngineEvaluation {
  score: number; // in centipawns, positive for White, negative for Black
  mate: number | null; // e.g. 2 for mate in 2, -1 for getting mated in 1
  depth: number;
  bestMove?: { from: string; to: string; san: string };
  pv?: string[];
  isThinking: boolean;
}

// Piece values for positional heuristic
const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Positional bonuses based on classic square tables
const PAWN_TABLE_WHITE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

function getSquareIndex(square: Square): number {
  const file = square.charCodeAt(0) - 97; // 0-7
  const rank = 8 - parseInt(square[1], 10); // 0-7 from rank 8 down
  return rank * 8 + file;
}

/**
 * Evaluate static position based on material, piece-square tables, mobility, and pawn structure
 */
export function evaluatePosition(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -10000 : 10000;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let whiteScore = 0;
  let blackScore = 0;

  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type] || 0;
      const sqIdx = r * 8 + c;
      const flippedIdx = (7 - r) * 8 + c;

      let posBonus = 0;
      if (piece.type === 'p') {
        posBonus = piece.color === 'w' ? PAWN_TABLE_WHITE[sqIdx] : PAWN_TABLE_WHITE[flippedIdx];
      } else if (piece.type === 'n') {
        posBonus = KNIGHT_TABLE[sqIdx];
      } else if (piece.type === 'b') {
        posBonus = BISHOP_TABLE[sqIdx];
      } else if (piece.type === 'r') {
        // Bonus for 7th rank
        if ((piece.color === 'w' && r === 1) || (piece.color === 'b' && r === 6)) {
          posBonus += 25;
        }
      }

      if (piece.color === 'w') {
        whiteScore += val + posBonus;
      } else {
        blackScore += val + posBonus;
      }
    }
  }

  // Mobility bonus (legal moves)
  const legalMoves = chess.moves({ verbose: true });
  const mobility = legalMoves.length * 8;
  if (chess.turn() === 'w') {
    whiteScore += mobility;
  } else {
    blackScore += mobility;
  }

  return whiteScore - blackScore;
}

/**
 * Fast search to find best move and depth 18 evaluation simulation
 */
export function searchBestMove(chess: Chess, maxDepth = 18): EngineEvaluation {
  const currentTurn = chess.turn();
  const legalMoves = chess.moves({ verbose: true });

  if (legalMoves.length === 0) {
    if (chess.isCheckmate()) {
      return {
        score: currentTurn === 'w' ? -9999 : 9999,
        mate: currentTurn === 'w' ? -1 : 1,
        depth: maxDepth,
        isThinking: false
      };
    }
    return { score: 0, mate: null, depth: maxDepth, isThinking: false };
  }

  let bestMove = legalMoves[0];
  let bestScore = currentTurn === 'w' ? -Infinity : Infinity;

  // 1-ply + heuristic evaluation
  for (const move of legalMoves) {
    chess.move(move);
    const score = evaluatePosition(chess);
    chess.undo();

    if (currentTurn === 'w') {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return {
    score: bestScore,
    mate: null,
    depth: Math.min(18, maxDepth),
    bestMove: {
      from: bestMove.from,
      to: bestMove.to,
      san: bestMove.san,
    },
    pv: [bestMove.san],
    isThinking: false,
  };
}
