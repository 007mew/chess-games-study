import { PawnStructureType } from '../types/chess';
import { inferPawnStructure } from './pgnParser';

/**
 * Classify pawn structure based on PGN text, ECO code, or FEN string.
 */
export function classifyPawnStructure(pgnOrFen: string): PawnStructureType {
  if (!pgnOrFen) return 'Custom';

  // Check if text is a PGN with ECO header
  const ecoMatch = pgnOrFen.match(/\[ECO\s+"([^"]+)"\]/i);
  const eco = ecoMatch ? ecoMatch[1].trim() : '';

  // Use inferPawnStructure logic
  const inferred = inferPawnStructure(eco, pgnOrFen);
  if (inferred && inferred !== 'Custom') {
    return inferred;
  }

  const lower = pgnOrFen.toLowerCase();
  if (lower.includes('carlsbad') || lower.includes('minority attack')) return 'Carlsbad';
  if (lower.includes('iqp') || lower.includes('isolani') || lower.includes('isolated queen')) return 'IQP';
  if (lower.includes('hanging pawn')) return 'Hanging Pawns';
  if (lower.includes('french') || lower.includes("king's indian") || lower.includes('caro-kann advance')) return 'Closed';
  if (lower.includes('benoni') || lower.includes('benko')) return 'Benoni';
  if (lower.includes('open') || lower.includes('sicilian open') || lower.includes('scotch')) return 'Open';

  return 'Custom';
}
