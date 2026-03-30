/**
 * Opening Classifier — deterministic ECO classification from move list.
 *
 * Uses the Lichess openings database (3600+ entries) for longest-prefix matching.
 * No LLM call needed — this is pure string matching.
 *
 * @see CHE-200 https://linear.app/chesspathapp/issue/CHE-200
 */

import openingsDb from '@/data/openings-eco/openings-db.json';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

interface OpeningEntry {
  eco: string;
  name: string;
  moves: string[];
}

export interface OpeningClassification {
  eco: string;
  name: string;
  matchedMoves: number;
}

// ════════════════════════════════
// CLASSIFIER
// ════════════════════════════════

const DB = openingsDb as OpeningEntry[];

/**
 * Normalize a SAN move for comparison.
 * Strips check/mate/annotation symbols.
 */
function normalize(san: string): string {
  return san.replace(/[+#!?]/g, '').trim();
}

/**
 * Classify the opening from a list of SAN moves.
 * Returns the longest matching opening, or null if under 4 half-moves.
 *
 * @param moves - SAN moves from the game (both sides, in order)
 */
export function classifyOpening(moves: string[]): OpeningClassification | null {
  if (moves.length < 4) return null;

  let best: { entry: OpeningEntry; matched: number } | null = null;

  for (const entry of DB) {
    // Skip entries longer than the game so far
    if (entry.moves.length > moves.length) continue;

    let matched = 0;
    let match = true;
    for (let i = 0; i < entry.moves.length; i++) {
      if (normalize(moves[i]) !== normalize(entry.moves[i])) {
        match = false;
        break;
      }
      matched++;
    }

    if (match && matched > 0 && (!best || matched > best.matched)) {
      best = { entry, matched };
    }
  }

  if (!best) return null;

  return {
    eco: best.entry.eco,
    name: best.entry.name,
    matchedMoves: best.matched,
  };
}
