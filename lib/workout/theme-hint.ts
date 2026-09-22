/**
 * Theme hint — the one "what to look for" label a beginner sees on the first
 * puzzles of a Puzzle Boxing workout ("Fork", "Mate in 1").
 *
 * Lichess theme arrays mix one or two instructive tags with noise (length,
 * phase, eval, source). This picks the MOST instructive tag by a fixed
 * priority and returns its friendly name, or null when nothing is worth
 * saying — never a guess, never a noise tag.
 *
 * Deliberately standalone: the friendly names mirror lib/content-map.ts
 * THEME_NAMES, but that module builds the whole curriculum at import time and
 * must not ship in the workout bundle.
 */

/** Priority order, most instructive first. Anything not listed is never shown. */
const HINT_PRIORITY: ReadonlyArray<readonly [string, string]> = [
  // Named mating patterns — the most specific thing you can tell a beginner.
  ['smotheredMate', 'Smothered Mate'],
  ['backRankMate', 'Back Rank Mate'],
  ['arabianMate', 'Arabian Mate'],
  ['hookMate', 'Hook Mate'],
  ['doubleBishopMate', 'Double Bishop Mate'],
  ['dovetailMate', 'Dovetail Mate'],
  ['anastasiaMate', 'Anastasia Mate'],
  ['bodenMate', 'Boden Mate'],
  // Mate-in-N.
  ['mateIn1', 'Mate in 1'],
  ['mateIn2', 'Mate in 2'],
  ['mateIn3', 'Mate in 3'],
  ['mateIn4', 'Mate in 4'],
  ['mateIn5', 'Mate in 5'],
  // Core tactics.
  ['fork', 'Fork'],
  ['pin', 'Pin'],
  ['skewer', 'Skewer'],
  ['discoveredAttack', 'Discovered Attack'],
  ['doubleCheck', 'Double Check'],
  ['hangingPiece', 'Hanging Piece'],
  ['trappedPiece', 'Trapped Piece'],
  ['xRayAttack', 'X-Ray Attack'],
  // Supporting ideas.
  ['deflection', 'Deflection'],
  ['attraction', 'Attraction'],
  ['sacrifice', 'Sacrifice'],
  ['clearance', 'Clearance'],
  ['interference', 'Interference'],
  ['intermezzo', 'In-Between Move'],
  ['capturingDefender', 'Remove the Defender'],
  ['promotion', 'Promotion'],
  ['underPromotion', 'Under-Promotion'],
  ['advancedPawn', 'Advanced Pawn'],
  ['exposedKing', 'Exposed King'],
  ['kingsideAttack', 'Kingside Attack'],
  ['queensideAttack', 'Queenside Attack'],
  ['quietMove', 'Quiet Move'],
  ['defensiveMove', 'Defensive Move'],
  ['zugzwang', 'Zugzwang'],
];

/** How many puzzles into a session the hint is shown (1-based puzzle numbers 1..N). */
export const THEME_HINT_PUZZLES = 10;

/** Friendly name of the most instructive theme, or null if there isn't one. */
export function themeHint(themes: readonly string[] | undefined | null): string | null {
  if (!themes?.length) return null;
  const tags = new Set(themes);
  for (const [tag, name] of HINT_PRIORITY) {
    if (tags.has(tag)) return name;
  }
  return null;
}
