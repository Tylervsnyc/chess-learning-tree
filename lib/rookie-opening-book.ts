/**
 * Rookie Reactive Opening Book
 *
 * Instead of pre-picking one opening, Rookie reacts to the player's actual
 * moves using a move-sequence trie built from all opening trees.
 *
 * Prefers openings the player has studied (via useOpeningProgress) so Rookie
 * tests them on what they've learned.
 */

import { Chess } from 'chess.js';
import { TREE_LOOKUP } from '@/lib/opening-trees';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface ReactiveBookResult {
  inBook: boolean;
  moveSan: string | null;
  moveUci: string | null;
  matchedSlug: string | null;
  matchedName: string | null;
}

interface BookLine {
  slug: string;
  name: string;
  side: 'white' | 'black';
  moves: string[]; // flat SAN sequence (both sides interleaved)
}

interface TrieNode {
  children: Map<string, TrieNode>;
  slugs: string[]; // opening slugs that pass through this node
}

// ════════════════════════════════
// MOVE PARSING
// ════════════════════════════════

function parseTreeMoves(movePairs: string[]): string[] {
  const sans: string[] = [];
  for (const pair of movePairs) {
    const cleaned = pair
      .replace(/\d+\.\.\./g, '')
      .replace(/\d+\./g, '')
      .trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    sans.push(...parts);
  }
  return sans;
}

function normalizeSan(san: string): string {
  return san.replace(/[+#!?]/g, '').trim();
}

// ════════════════════════════════
// BUILD BOOK LINES (cached at module load)
// ════════════════════════════════

function buildBookLines(): Map<string, BookLine> {
  const lines = new Map<string, BookLine>();

  for (const [slug, tree] of Object.entries(TREE_LOOKUP)) {
    const mainNodes = tree.completionOrder
      .map(id => tree.nodes.find(n => n.id === id))
      .filter((n): n is NonNullable<typeof n> => !!n && n.type === 'main');

    if (mainNodes.length === 0) continue;

    const moves: string[] = [];
    for (const node of mainNodes) {
      moves.push(...parseTreeMoves(node.moves));
    }

    const side = mainNodes[0].side === 'black' ? 'black' : 'white';
    lines.set(slug, { slug, name: tree.name, side, moves });
  }

  return lines;
}

const BOOK_LINES = buildBookLines();

// ════════════════════════════════
// BUILD TRIE (cached at module load)
// ════════════════════════════════

function buildTrie(): TrieNode {
  const root: TrieNode = { children: new Map(), slugs: [] };

  for (const [slug, line] of BOOK_LINES) {
    let node = root;
    for (const move of line.moves) {
      const key = normalizeSan(move);
      let child = node.children.get(key);
      if (!child) {
        child = { children: new Map(), slugs: [] };
        node.children.set(key, child);
      }
      node = child;
      if (!node.slugs.includes(slug)) {
        node.slugs.push(slug);
      }
    }
  }

  return root;
}

const BOOK_TRIE = buildTrie();

// ════════════════════════════════
// SLUG → NAME LOOKUP
// ════════════════════════════════

function getOpeningName(slug: string): string | null {
  return BOOK_LINES.get(slug)?.name ?? null;
}

// ════════════════════════════════
// PUBLIC API
// ════════════════════════════════

/**
 * Get the next book move for Rookie based on the actual game moves played.
 *
 * Walks the trie with the game's move history, then picks Rookie's next move
 * preferring openings the player has studied (so Rookie tests them).
 *
 * @param fen - Current board position (for SAN→UCI conversion)
 * @param gameMovesSan - All moves played so far, both sides interleaved
 * @param rookieColor - Which color Rookie is playing
 * @param studiedSlugs - Opening slugs the player has studied, ordered by recency (most recent first)
 */
export function getReactiveBookMove(
  fen: string,
  gameMovesSan: string[],
  rookieColor: 'white' | 'black',
  studiedSlugs?: string[],
): ReactiveBookResult {
  const noBook: ReactiveBookResult = {
    inBook: false,
    moveSan: null,
    moveUci: null,
    matchedSlug: null,
    matchedName: null,
  };

  // Walk the trie with moves played so far
  let node = BOOK_TRIE;
  for (const move of gameMovesSan) {
    const child = node.children.get(normalizeSan(move));
    if (!child) return noBook; // player deviated from all known lines
    node = child;
  }

  // Check if it's Rookie's turn
  const nextMoveIndex = gameMovesSan.length;
  const nextMoveIsWhite = nextMoveIndex % 2 === 0;
  const isRookieTurn =
    (rookieColor === 'white' && nextMoveIsWhite) ||
    (rookieColor === 'black' && !nextMoveIsWhite);

  if (!isRookieTurn) {
    // Still in book, but it's the player's turn
    const slug = node.slugs[0] ?? null;
    return {
      inBook: true,
      moveSan: null,
      moveUci: null,
      matchedSlug: slug,
      matchedName: slug ? getOpeningName(slug) : null,
    };
  }

  // Enumerate candidate moves for Rookie
  if (node.children.size === 0) return noBook; // book exhausted

  // Pick the best candidate move based on studied openings
  let bestMove: string | null = null;
  let bestSlug: string | null = null;
  let bestPriority = Infinity; // lower = better (index in studiedSlugs)

  for (const [moveSan, child] of node.children) {
    if (studiedSlugs) {
      for (const slug of child.slugs) {
        const idx = studiedSlugs.indexOf(slug);
        if (idx !== -1 && idx < bestPriority) {
          bestPriority = idx;
          bestMove = moveSan;
          bestSlug = slug;
        }
      }
    }
  }

  // No studied match — pick randomly
  if (!bestMove) {
    const candidates = Array.from(node.children.keys());
    bestMove = candidates[Math.floor(Math.random() * candidates.length)];
    const child = node.children.get(bestMove)!;
    bestSlug = child.slugs[0] ?? null;
  }

  // Convert SAN to UCI
  const chess = new Chess(fen);
  const legalMoves = chess.moves({ verbose: true });
  const match = legalMoves.find(m => normalizeSan(m.san) === normalizeSan(bestMove!));

  if (!match) {
    // Book move isn't legal (shouldn't happen, but safety)
    return noBook;
  }

  const uci = match.from + match.to + (match.promotion || '');

  return {
    inBook: true,
    moveSan: match.san,
    moveUci: uci,
    matchedSlug: bestSlug,
    matchedName: bestSlug ? getOpeningName(bestSlug) : null,
  };
}
