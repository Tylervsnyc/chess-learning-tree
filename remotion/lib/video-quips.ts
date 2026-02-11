/**
 * ~50 themed quips for daily puzzle videos.
 * Deterministically selected based on puzzle ID.
 */

const QUIPS = [
  // General tactical
  'That piece never saw it coming!',
  'Chess is a series of surprises.',
  'The board whispers if you listen.',
  'Patience wins the position.',
  'Every pawn dreams of promotion.',

  // Aggressive
  'Attack is the best defense!',
  'The king has nowhere to hide.',
  'Checkmate is the ultimate argument.',
  'No retreat, no surrender.',
  'A sacrifice today, a victory tomorrow.',

  // Clever
  'The quiet move speaks loudest.',
  'Sometimes the best move is waiting.',
  'Chess: where time is measured in tempi.',
  'The knight always finds a way.',
  'Bishops love open diagonals.',

  // Rook-themed
  'That rook had places to be!',
  'Rooks belong on open files.',
  'Double rooks, double trouble.',
  'The rook lift strikes again.',
  'Back rank: the ultimate blind spot.',

  // Fun/casual
  'GG, well played!',
  "Didn't see that one coming!",
  'Calculated, not lucky.',
  'The position played itself!',
  'Clean technique wins games.',

  // Motivational
  'Every puzzle makes you stronger.',
  'Pattern recognition is a superpower.',
  'Think twice, move once.',
  'The best move is the one you find.',
  'Tactics flow from a strong position.',

  // Material
  'Free piece? Yes please!',
  'Material advantage = winning advantage.',
  'That trade was not equal!',
  'Winning material, one tactic at a time.',
  'The exchange was NOT fair.',

  // Checkmate patterns
  "The king's safety is everything.",
  'Mating nets are beautiful.',
  'A forced mate is pure art.',
  'The king walks into a trap.',
  'Checkmate patterns never go out of style.',

  // Endgame
  'Endgame technique on display.',
  'Pawns are the soul of chess.',
  'In the endgame, the king is a fighter.',
  'Converting advantage like a GM.',
  'Precision when it matters most.',

  // Discovery/surprise
  'The discovered attack strikes!',
  'Deflection is an underrated weapon.',
  'Pins win pieces.',
  'Forks: feeding two birds with one hand.',
  'The skewer slices through.',
];

/**
 * Pick a quip deterministically from puzzle ID.
 */
export function getQuip(puzzleId: string): string {
  let hash = 0;
  for (let i = 0; i < puzzleId.length; i++) {
    const char = puzzleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return QUIPS[Math.abs(hash) % QUIPS.length];
}

export { QUIPS };
