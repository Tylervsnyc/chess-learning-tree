/**
 * Opening Book Detector — finds where a player left known opening theory.
 *
 * Matches game moves against all opening trees in the app.
 * Returns the opening name, how far they got, where they deviated,
 * and which opening lesson to recommend.
 */

import { TREE_LOOKUP } from '@/lib/opening-trees';
import type { OpeningTree, OpeningNode } from '@/data/openings/ruy-lopez';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface BookDetectionResult {
  /** Did we find a matching opening at all? */
  found: boolean;
  /** Opening name (e.g., "Italian Game") */
  openingName: string;
  /** Opening slug for linking (e.g., "italian") */
  openingSlug: string;
  /** How many half-moves matched book theory */
  bookMoves: number;
  /** The move number where player left book (1-indexed, full moves) */
  deviationMoveNumber: number;
  /** What the book move was at the deviation point */
  bookMoveSan: string | null;
  /** What the player actually played */
  playerMoveSan: string | null;
  /** Which side the opening is for */
  side: 'white' | 'black';
  /** The node they were in when they deviated */
  lastBookNode: string | null;
  /** The node they should learn next (lesson recommendation) */
  recommendedNodeId: string | null;
  /** The recommended node's name */
  recommendedNodeName: string | null;
}

// ════════════════════════════════
// MOVE PARSING
// ════════════════════════════════

/**
 * Parse opening tree move strings into flat SAN arrays.
 * Input:  ['1.e4 e5', '2.Nf3 Nc6', '3.Bc4']
 * Output: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4']
 */
function parseTreeMoves(movePairs: string[]): string[] {
  const sans: string[] = [];
  for (const pair of movePairs) {
    // Remove move numbers: "1.e4 e5" → "e4 e5", "3...Bc5" → "Bc5"
    const cleaned = pair
      .replace(/\d+\.\.\./g, '')     // "3...Bc5" → "Bc5"
      .replace(/\d+\./g, '')          // "1.e4" → "e4"
      .trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    sans.push(...parts);
  }
  return sans;
}

/**
 * Build a flat move sequence for each opening by concatenating
 * main line nodes in order.
 */
interface OpeningLine {
  slug: string;
  name: string;
  side: 'white' | 'black';
  moves: string[];        // flat SAN sequence
  nodes: { nodeId: string; nodeName: string; startIndex: number }[];
}

function buildOpeningLines(): OpeningLine[] {
  const lines: OpeningLine[] = [];

  for (const [slug, tree] of Object.entries(TREE_LOOKUP)) {
    // Get main line nodes in completion order
    const mainNodes = tree.completionOrder
      .map(id => tree.nodes.find(n => n.id === id))
      .filter((n): n is OpeningNode => !!n && n.type === 'main');

    if (mainNodes.length === 0) continue;

    const moves: string[] = [];
    const nodes: { nodeId: string; nodeName: string; startIndex: number }[] = [];

    for (const node of mainNodes) {
      const startIndex = moves.length;
      const nodeMoves = parseTreeMoves(node.moves);
      moves.push(...nodeMoves);
      nodes.push({ nodeId: node.id, nodeName: node.name, startIndex });
    }

    lines.push({
      slug,
      name: tree.name,
      side: mainNodes[0].side === 'black' ? 'black' : 'white',
      moves,
      nodes,
    });
  }

  return lines;
}

// Build once at module load
const OPENING_LINES = buildOpeningLines();

// ════════════════════════════════
// DETECTION
// ════════════════════════════════

/**
 * Normalize a SAN move for comparison.
 * Strips check/mate symbols and trailing annotations.
 */
function normalizeSan(san: string): string {
  return san.replace(/[+#!?]/g, '').trim();
}

/**
 * Detect which opening was played and where the player deviated.
 *
 * @param gameMoves - array of SAN moves from the game (both sides)
 * @param playerColor - which color the player was
 */
export function detectOpeningBook(
  gameMoves: string[],
  playerColor: 'white' | 'black',
): BookDetectionResult {
  let bestMatch: { line: OpeningLine; matchCount: number } | null = null;

  for (const line of OPENING_LINES) {
    // Match as many moves as possible
    let matched = 0;
    const maxCheck = Math.min(gameMoves.length, line.moves.length);

    for (let i = 0; i < maxCheck; i++) {
      if (normalizeSan(gameMoves[i]) === normalizeSan(line.moves[i])) {
        matched++;
      } else {
        break;
      }
    }

    // Need at least 3 half-moves to count as a real match
    if (matched >= 3 && (!bestMatch || matched > bestMatch.matchCount)) {
      bestMatch = { line, matchCount: matched };
    }
  }

  if (!bestMatch) {
    return {
      found: false,
      openingName: '',
      openingSlug: '',
      bookMoves: 0,
      deviationMoveNumber: 1,
      bookMoveSan: null,
      playerMoveSan: gameMoves[0] || null,
      side: playerColor,
      lastBookNode: null,
      recommendedNodeId: null,
      recommendedNodeName: null,
    };
  }

  const { line, matchCount } = bestMatch;
  const deviationIndex = matchCount; // 0-indexed half-move where they diverged

  // Last matched full move number (e.g., 5 half-moves matched = "through move 3" since move 3 white was last)
  const lastMatchedFullMove = Math.ceil(matchCount / 2);

  // The full move number where deviation happened
  const deviationFullMove = Math.ceil((deviationIndex + 1) / 2);

  // Was it the player who deviated?
  // Half-move index 0,2,4... = white's moves; 1,3,5... = black's moves
  const deviationIsWhite = deviationIndex % 2 === 0;
  const playerDeviatedHere = (playerColor === 'white' && deviationIsWhite) ||
                              (playerColor === 'black' && !deviationIsWhite);

  // Find which node they were in at the deviation
  let lastNode = line.nodes[0];
  let nextNode: typeof lastNode | null = null;
  for (let i = 0; i < line.nodes.length; i++) {
    if (line.nodes[i].startIndex <= matchCount) {
      lastNode = line.nodes[i];
      nextNode = line.nodes[i + 1] || null;
    }
  }

  // If they matched all moves of this line, they completed it — no deviation
  const isComplete = matchCount >= line.moves.length;
  // If game is shorter than the line but all game moves match, it's not a deviation
  const gameEndedInBook = matchCount >= gameMoves.length && matchCount < line.moves.length;

  return {
    found: true,
    openingName: line.name,
    openingSlug: line.slug,
    bookMoves: matchCount,
    deviationMoveNumber: (isComplete || gameEndedInBook) ? 0 : deviationFullMove,
    bookMoveSan: (isComplete || gameEndedInBook) ? null : (line.moves[deviationIndex] || null),
    playerMoveSan: (isComplete || gameEndedInBook) ? null : (gameMoves[deviationIndex] || null),
    side: line.side,
    lastBookNode: lastNode.nodeId,
    recommendedNodeId: (isComplete || gameEndedInBook) ? null : (nextNode?.nodeId || lastNode.nodeId),
    recommendedNodeName: (isComplete || gameEndedInBook) ? null : (nextNode?.nodeName || lastNode.nodeName),
  };
}
