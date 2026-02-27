/**
 * Context-aware quips for daily puzzle videos.
 *
 * Tone: Playful, witty, confident. Friendly trash talk, chess puns,
 * pop culture refs, heist/thievery metaphors. Kid-friendly. No violence.
 * See RULES.md §26 for full guidelines.
 *
 * Selected based on result category + puzzle theme.
 */

import type { PuzzleResult } from './describe-result';

// ─── Result-specific quips ─────────────────────────────────────────

const RESULT_QUIPS: Record<string, string[]> = {
  checkmate: [
    'Game. Set. Checkmate.',
    'And just like that… it\'s over.',
    'Nowhere left to run, Your Majesty.',
    'The king has been officially retired.',
    'Check please. Actually, checkMATE.',
    'That king needed GPS and it still wouldn\'t help.',
    'Checkmate. No takebacks.',
    'The audacity of that checkmate.',
    'I believe the technical term is "got \'em."',
    'Another king bites the dust.',
  ],
  'won-queen': [
    'One queen, coming right up.',
    'Their queen just got repossessed.',
    'Grand theft queen.',
    'The queen has left the chat.',
    'That queen had a whole life ahead of her.',
    'Imagine losing your queen like that.',
    'Queen heist: successful.',
    'Down a queen? That\'s a wrap.',
    'The queen vanished. Nothing to see here.',
    'Smooth queen snag.',
  ],
  'won-rook': [
    'That rook just got pickpocketed.',
    'One rook lighter. Tough scene.',
    'Rook? What rook? I don\'t see a rook.',
    'That rook had somewhere to be. Too bad.',
    'Clean rook snag. In and out.',
    'Grand theft rook.',
    'The rook has been relocated. Permanently.',
  ],
  'won-piece': [
    'Yoink. That piece is mine now.',
    'Free piece? Don\'t mind if I do.',
    'That piece was basically gift-wrapped.',
    'Piece acquired. Moving on.',
    'A little piece goes a long way.',
    'That piece had one job. Guard duty failed.',
    'Thank you for the generous donation.',
  ],
  'won-pawn': [
    'Every pawn dreams of becoming a queen.',
    'Small heist, big consequences.',
    'A pawn today, a queen tomorrow.',
    'That pawn was load-bearing.',
    'Never underestimate a missing pawn.',
  ],
  brilliant: [
    'The best move is the one you find.',
    'Quiet confidence wins loud games.',
    'That was smooth. Real smooth.',
    'Sometimes the best move looks boring.',
    'Calculated. Every single square.',
    'Chef\'s kiss. Immaculate technique.',
  ],
};

// ─── Theme-specific quips ──────────────────────────────────────────

const THEME_QUIPS: Record<string, string[]> = {
  fork: [
    'Two pieces, one move. Pick your favorite.',
    'That fork was chef\'s kiss.',
    'Double trouble incoming.',
    'Fork in the road: both paths are bad.',
    'Two targets, one very bad day.',
    'Dinner is served. Fork and all.',
  ],
  pin: [
    'That piece isn\'t going anywhere.',
    'Pinned. Stuck. Out of options.',
    'The definition of "between a rock and a hard place."',
    'That pin is doing heavy lifting.',
    'Can\'t move, won\'t move, shouldn\'t move.',
  ],
  skewer: [
    'Step aside or lose what\'s behind you.',
    'The X-ray sees everything.',
    'Skewered right through. Like a kebab.',
    'Front piece or back piece — your call.',
  ],
  sacrifice: [
    'Give a piece, take the whole game.',
    'Material is temporary. Victory is forever.',
    'Sometimes you gotta spend pieces to make pieces.',
    'The ol\' bait and switch.',
    'Sacrifice now, celebrate later.',
  ],
  discoveredAttack: [
    'Surprise! There was another piece behind that one.',
    'The hidden threat was there all along.',
    'Move one piece, reveal another. Sneaky.',
    'Two-for-one special.',
  ],
  backRankMate: [
    'That back rank was wide open. Oops.',
    'Should\'ve made luft.',
    'Back rank awareness: zero.',
    'Note to self: push that h-pawn.',
    'Classic back rank. Never gets old.',
  ],
  smotheredMate: [
    'Surrounded by friends, still got mated.',
    'The knight delivers. Special delivery.',
    'Smothered mate. The fanciest finish.',
    'That knight just walked in and ended it.',
  ],
  kingsideAttack: [
    'Kingside: breached.',
    'That king was never safe over there.',
    'Kingside assault. No survivors (pieces, that is).',
    'Storm the kingside. Works every time.',
  ],
  queensideAttack: [
    'Queenside pressure finally pays off.',
    'The flank attack lands.',
    'Came from the side. Didn\'t see it coming.',
  ],
  deflection: [
    'That defender had one job. ONE JOB.',
    'Lure the guard away, grab the goods.',
    'The key defender got pulled off duty.',
    'Classic misdirection.',
  ],
  attraction: [
    'Took the bait. Hook, line, and sinker.',
    'Come a little closer… gotcha.',
    'The perfect trap. They walked right in.',
    'Lured in like a moth to a flame.',
  ],
  hangingPiece: [
    'That piece was just… sitting there. Unguarded.',
    'Free real estate.',
    'Finders keepers.',
    'Always check for undefended pieces. Always.',
  ],
  trappedPiece: [
    'Nowhere to go. Nowhere to hide.',
    'That piece is stuck. Completely stuck.',
    'Trapped like a chess piece in a corner. Wait.',
  ],
  intermezzo: [
    'Wait — not done yet!',
    'The in-between move changes everything.',
    'Zwischenzug! (Fun to say. Brutal to face.)',
  ],
  quietMove: [
    'The quiet move speaks loudest.',
    'Subtle but devastating.',
    'Not flashy. Just correct.',
  ],
  clearance: [
    'Clear the lane, make the play.',
    'Make way for the real threat!',
  ],
  endgame: [
    'Endgame technique: flawless.',
    'Clean conversion. Textbook.',
    'Technique over fireworks.',
  ],
  mateIn1: [
    'One move. Lights out.',
    'Mate in one. Blink and you miss it.',
    'The simplest mates hit hardest.',
  ],
  mateIn2: [
    'Two moves. No escape route.',
    'Forced mate. Nothing they can do.',
    'Calculated two moves ahead. Just enough.',
  ],
  mateIn3: [
    'Three moves deep. Beautiful.',
    'Saw it coming from three moves away.',
    'Long calculation, sweet payoff.',
  ],
};

// ─── Quip selection ────────────────────────────────────────────────

// Generic Lichess meta-themes that don't describe the actual tactic
const IGNORE_THEMES = new Set([
  'crushing', 'advantage', 'short', 'long', 'veryLong', 'oneMove',
  'master', 'masterVsMaster', 'superGM', 'opening', 'middlegame', 'endgame',
]);

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Pick a quip that matches the puzzle's theme and result.
 *
 * Priority:
 * 1. Theme-specific quip (skips generic meta-themes like "crushing", "short")
 * 2. Result-specific quip (always matches — accurate to what happened)
 *
 * Pass `primaryTheme` to prioritize a specific theme.
 */
export function getVideoQuip(
  puzzleId: string,
  result: PuzzleResult,
  themes: string[],
  primaryTheme?: string,
): string {
  const hash = hashString(puzzleId);

  // Put primary theme first if provided
  const orderedThemes = primaryTheme
    ? [primaryTheme, ...themes.filter(t => t !== primaryTheme)]
    : themes;

  // Try theme-specific quips (skip generic meta-themes)
  for (const theme of orderedThemes) {
    if (IGNORE_THEMES.has(theme)) continue;
    const quips = THEME_QUIPS[theme];
    if (quips && quips.length > 0) {
      return quips[(hash + theme.length) % quips.length];
    }
  }

  // Fall back to result-specific quips (always accurate)
  const resultQuips = RESULT_QUIPS[result.category] || RESULT_QUIPS.brilliant;
  return resultQuips[hash % resultQuips.length];
}

export { RESULT_QUIPS, THEME_QUIPS };
