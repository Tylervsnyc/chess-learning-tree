import { Chess } from 'chess.js';
import { detectOpeningBook } from '@/lib/opening-book-detector';
import { classifyOpening } from '@/lib/opening-classifier';
import { OPENINGS_REGISTRY } from '@/data/openings/registry';

/**
 * Chess facts about a finished bout, derived SERVER-SIDE by replaying the
 * client's SAN move list through chess.js. The replay is also the validator:
 * an illegal or garbage move list yields null and the chess/opening
 * achievements simply don't fire (the bout itself is unaffected). The user is
 * ALWAYS White in a bout.
 *
 * This is what powers the "Finishing Moves" and "Openings" achievement
 * categories (docs/chess-boxing-achievements-plan.md).
 */
export interface BoutFacts {
  plies: number;
  /** Piece that delivered the final move, if that move was checkmate. */
  matingPiece: 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | null;
  isEnPassantMate: boolean;
  isCastleMate: boolean;
  isPromotionMate: boolean;
  /** Knight mate with every square around the mated king blocked by its own army. */
  isSmotheredMate: boolean;
  /** R/Q mate delivered on the mated king's back rank. */
  isBackRankMate: boolean;
  checksByUser: number;
  /** The user's queen was captured at some point. */
  userQueenLost: boolean;
  /** Rookie never captured anything of the user's. */
  userLostNothing: boolean;
  /** Rookie ended the game with only her king. */
  opponentBareKing: boolean;
  /** The user promoted at least one pawn. */
  userPromoted: boolean;
  /** The user underpromoted to a knight. */
  userUnderpromotedKnight: boolean;
  /** Top-level registry slug of the opening on the board (≥3 book half-moves). */
  openingSlug: string | null;
}

const MAX_PLIES = 400;

/** Top-level registry slugs, longest first so prefix matching is stable. */
const TOP_SLUGS = OPENINGS_REGISTRY.map((o) => o.slug).sort((a, b) => b.length - a.length);

/** ECO-classifier fallback: substring of the classified name → registry slug. */
const NAME_TO_SLUG: Array<[string, string]> = [
  ['caro-kann', 'caro-kann'],
  ['sicilian', 'sicilian'],
  ['french', 'french'],
  ['london', 'london'],
  ['italian', 'italian'],
  ['ruy lopez', 'ruy-lopez'],
  ['spanish', 'ruy-lopez'],
  ["queen's gambit", 'queens-gambit'],
  ["king's gambit", 'kings-gambit'],
  ["king's indian", 'kings-indian'],
  ['scandinavian', 'scandinavian'],
  ['petrov', 'petroff'],
  ['petroff', 'petroff'],
  ['russian game', 'petroff'],
  ['scotch', 'scotch'],
  ['slav', 'slav'],
  ['grunfeld', 'grunfeld'],
  ['grünfeld', 'grunfeld'],
  ['nimzo-indian', 'nimzo-indian'],
  ['english', 'english'],
  ['pirc', 'pirc'],
];

/** Normalize a detected (possibly variation) slug to its top-level parent. */
function parentSlug(slug: string): string | null {
  if (TOP_SLUGS.includes(slug)) return slug;
  for (const top of TOP_SLUGS) {
    if (slug.startsWith(top + '-')) return top;
  }
  return null;
}

function detectOpeningSlug(sans: string[]): string | null {
  // Our own trees first (covers Witty Alien, which no ECO database names).
  const book = detectOpeningBook(sans, 'white');
  if (book.found && book.openingSlug) {
    const parent = parentSlug(book.openingSlug);
    if (parent) return parent;
  }
  // ECO fallback for book lines our trees don't carry.
  const eco = classifyOpening(sans);
  if (eco) {
    const lower = eco.name.toLowerCase();
    for (const [needle, slug] of NAME_TO_SLUG) {
      if (lower.includes(needle)) return slug;
    }
  }
  return null;
}

export function deriveBoutFacts(moveSans: unknown): BoutFacts | null {
  if (!Array.isArray(moveSans) || moveSans.length === 0 || moveSans.length > MAX_PLIES) return null;
  const sans = moveSans.filter((s): s is string => typeof s === 'string' && s.length > 0 && s.length <= 10);
  if (sans.length !== moveSans.length) return null;

  const game = new Chess();
  let checksByUser = 0;
  let userQueenLost = false;
  let userLostNothing = true;
  let userPromoted = false;
  let userUnderpromotedKnight = false;
  let last: ReturnType<Chess['move']> | null = null;

  try {
    for (const san of sans) {
      const mv = game.move(san);
      last = mv;
      if (mv.color === 'w') {
        if (/[+#]/.test(mv.san)) checksByUser++;
        if (mv.promotion) {
          userPromoted = true;
          if (mv.promotion === 'n') userUnderpromotedKnight = true;
        }
      } else if (mv.captured) {
        userLostNothing = false;
        if (mv.captured === 'q') userQueenLost = true;
      }
    }
  } catch {
    return null; // illegal move list — no chess facts, no achievements
  }
  if (!last) return null;

  const mate = game.isCheckmate() && last.color === 'w';
  const board = game.board();

  // Rookie's remaining army (black, king excluded).
  let blackNonKing = 0;
  for (const row of board) {
    for (const sq of row) {
      if (sq && sq.color === 'b' && sq.type !== 'k') blackNonKing++;
    }
  }

  let isSmotheredMate = false;
  let isBackRankMate = false;
  if (mate) {
    const kingSq = findKing(game, 'b');
    if (kingSq) {
      if (last.piece === 'n') isSmotheredMate = smothered(game, kingSq);
      if ((last.piece === 'r' || last.piece === 'q') && kingSq[1] === '8' && last.to[1] === '8') {
        isBackRankMate = true;
      }
    }
  }

  return {
    plies: sans.length,
    matingPiece: mate ? last.piece : null,
    isEnPassantMate: mate && last.flags.includes('e'),
    isCastleMate: mate && (last.flags.includes('k') || last.flags.includes('q')),
    isPromotionMate: mate && !!last.promotion,
    isSmotheredMate,
    isBackRankMate,
    checksByUser,
    userQueenLost,
    userLostNothing,
    opponentBareKing: blackNonKing === 0,
    userPromoted,
    userUnderpromotedKnight,
    openingSlug: detectOpeningSlug(sans),
  };
}

function findKing(game: Chess, color: 'w' | 'b'): string | null {
  for (const row of game.board()) {
    for (const sq of row) {
      if (sq && sq.color === color && sq.type === 'k') return sq.square;
    }
  }
  return null;
}

/** Every square adjacent to the king is on-board-and-occupied by its own side. */
function smothered(game: Chess, kingSq: string): boolean {
  const file = kingSq.charCodeAt(0) - 97;
  const rank = Number(kingSq[1]) - 1;
  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue;
      const f = file + df;
      const r = rank + dr;
      if (f < 0 || f > 7 || r < 0 || r > 7) continue; // board edge helps the smother
      const sq = `${String.fromCharCode(97 + f)}${r + 1}`;
      const piece = game.get(sq as never);
      if (!piece || piece.color !== 'b') return false;
    }
  }
  return true;
}
