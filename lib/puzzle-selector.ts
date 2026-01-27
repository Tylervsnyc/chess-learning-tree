/**
 * Puzzle Selection System for Chess Path V2
 *
 * Implements educational best practices:
 * - Scaffolded difficulty (easy → hard within lesson)
 * - Solution diversity (no similar moves consecutively)
 * - No repeat puzzles in reviews
 * - Theme interleaving in mixed practice
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Puzzle {
  id: string;
  fen: string;
  moves: string[];  // UCI format: ["e2e4", "e7e5", "g1f3"]
  rating: number;
  popularity: number;
  plays: number;
  theme: string;
  themes: string[];
  url: string;
}

export interface SolutionMetadata {
  firstMovePiece: string;      // 'P', 'N', 'B', 'R', 'Q', 'K'
  firstMoveFrom: string;       // 'e2'
  firstMoveTo: string;         // 'e4'
  firstMoveFile: string;       // 'e'
  firstMoveIsCapture: boolean;
  capturedPiece?: string;      // 'P', 'N', 'B', 'R', 'Q' or undefined
}

export interface LessonSelectionCriteria {
  // Core filters
  themes: string[];              // Required themes (ANY match for mixed, ALL for focused)
  isMixedPractice: boolean;      // If true, any theme matches; if false, all must match
  excludeThemes?: string[];      // Themes to exclude

  // Rating range
  ratingMin: number;
  ratingMax: number;

  // Quality
  minPlays: number;

  // Piece filter (optional)
  pieceFilter?: 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

  // For reviews: puzzle IDs to exclude (already seen)
  excludePuzzleIds?: string[];
}

export interface SelectionResult {
  puzzles: Puzzle[];
  metadata: {
    totalCandidates: number;
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
    diversitySkips: number;
    themeDistribution: Record<string, number>;
  };
}

// ============================================================================
// SOLUTION METADATA EXTRACTION
// ============================================================================

/**
 * Parse a FEN string to get piece positions
 */
function parseFEN(fen: string): Record<string, string> {
  const pieces: Record<string, string> = {};
  const [position] = fen.split(' ');
  const rows = position.split('/');

  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    for (const char of rows[rank]) {
      if (/\d/.test(char)) {
        file += parseInt(char);
      } else {
        const square = String.fromCharCode(97 + file) + (8 - rank);
        pieces[square] = char;
        file++;
      }
    }
  }

  return pieces;
}

/**
 * Get piece type from FEN character (uppercase)
 */
function getPieceType(fenChar: string): string {
  return fenChar.toUpperCase();
}

/**
 * Extract metadata about the first move in a puzzle solution
 * Note: In Lichess puzzles, moves[0] is opponent's last move, moves[1] is player's first move
 */
export function extractSolutionMetadata(puzzle: Puzzle): SolutionMetadata {
  // Player's first move is moves[1] (moves[0] is opponent's setup move)
  const playerFirstMove = puzzle.moves[1] || puzzle.moves[0];

  const from = playerFirstMove.slice(0, 2);
  const to = playerFirstMove.slice(2, 4);

  // Parse the FEN to find what piece is moving
  // But we need to apply moves[0] first to get the correct position
  const pieces = parseFEN(puzzle.fen);

  // Apply opponent's move (moves[0]) to get position before player moves
  const opponentMove = puzzle.moves[0];
  if (opponentMove) {
    const oppFrom = opponentMove.slice(0, 2);
    const oppTo = opponentMove.slice(2, 4);
    const movingPiece = pieces[oppFrom];
    if (movingPiece) {
      delete pieces[oppFrom];
      pieces[oppTo] = movingPiece;
    }
  }

  const movingPiece = pieces[from] || 'P';
  const capturedPiece = pieces[to];

  return {
    firstMovePiece: getPieceType(movingPiece),
    firstMoveFrom: from,
    firstMoveTo: to,
    firstMoveFile: to[0],
    firstMoveIsCapture: !!capturedPiece,
    capturedPiece: capturedPiece ? getPieceType(capturedPiece) : undefined,
  };
}

// ============================================================================
// DIVERSITY CHECKING
// ============================================================================

/**
 * Check if two puzzles have similar solutions (should not be consecutive)
 *
 * DIVERSITY RULES - Puzzles are "similar" if ANY of these match:
 *
 * 1. SAME DESTINATION SQUARE - Exact same target (e.g., both Qh7)
 * 2. SAME DESTINATION RANK (for mates) - 7th/8th rank mates feel repetitive
 * 3. SAME PIECE + SAME FILE - Queen to h-file feels same as another Qh*
 * 4. SAME ORIGIN FILE - Pieces moving from same file
 * 5. SAME CAPTURE TYPE - Both capturing same piece type
 * 6. SAME DESTINATION FILE (same piece) - Qa7 and Qh7 are both "column mates"
 */
export function areSolutionsSimilar(
  meta1: SolutionMetadata,
  meta2: SolutionMetadata
): boolean {
  // Rule 1: EXACT same destination square (e.g., both Qh7)
  if (meta1.firstMoveTo === meta2.firstMoveTo) {
    return true;
  }

  // Rule 2: Same piece type + same destination RANK (back rank mates, 7th rank, etc.)
  // This catches Qh7# vs Qa7# - both are "7th rank queen moves"
  if (meta1.firstMovePiece === meta2.firstMovePiece &&
      meta1.firstMoveTo[1] === meta2.firstMoveTo[1]) {
    return true;
  }

  // Rule 3: Same piece type + same destination FILE
  if (meta1.firstMovePiece === meta2.firstMovePiece &&
      meta1.firstMoveFile === meta2.firstMoveFile) {
    return true;
  }

  // Rule 4: Same origin file (pieces moving from same column)
  if (meta1.firstMoveFrom[0] === meta2.firstMoveFrom[0]) {
    return true;
  }

  // Rule 5: Both captures of same piece type
  if (meta1.firstMoveIsCapture && meta2.firstMoveIsCapture &&
      meta1.capturedPiece === meta2.capturedPiece) {
    return true;
  }

  return false;
}

// ============================================================================
// DIFFICULTY TIERING
// ============================================================================

interface DifficultyTiers {
  tier1: Puzzle[];  // Easy (bottom 30%)
  tier2: Puzzle[];  // Medium (middle 40%)
  tier3: Puzzle[];  // Hard (top 30%)
}

/**
 * Split puzzles into difficulty tiers based on rating
 */
export function splitIntoTiers(
  puzzles: Puzzle[],
  ratingMin: number,
  ratingMax: number
): DifficultyTiers {
  const range = ratingMax - ratingMin;
  const tier1Max = ratingMin + range * 0.3;
  const tier2Max = ratingMin + range * 0.7;

  const tier1: Puzzle[] = [];
  const tier2: Puzzle[] = [];
  const tier3: Puzzle[] = [];

  for (const puzzle of puzzles) {
    if (puzzle.rating < tier1Max) {
      tier1.push(puzzle);
    } else if (puzzle.rating < tier2Max) {
      tier2.push(puzzle);
    } else {
      tier3.push(puzzle);
    }
  }

  // Sort each tier by rating for consistent selection
  tier1.sort((a, b) => a.rating - b.rating);
  tier2.sort((a, b) => a.rating - b.rating);
  tier3.sort((a, b) => a.rating - b.rating);

  return { tier1, tier2, tier3 };
}

// ============================================================================
// MAIN SELECTION ALGORITHM
// ============================================================================

/**
 * Select 6 puzzles for a lesson with proper difficulty curve and diversity
 */
export function selectPuzzlesForLesson(
  candidates: Puzzle[],
  criteria: LessonSelectionCriteria
): SelectionResult {
  // Step 1: Filter candidates
  let filtered = candidates;

  // Filter by rating
  filtered = filtered.filter(p =>
    p.rating >= criteria.ratingMin && p.rating <= criteria.ratingMax
  );

  // Filter by plays
  filtered = filtered.filter(p => p.plays >= criteria.minPlays);

  // Filter by themes
  if (criteria.isMixedPractice) {
    // ANY theme must match
    filtered = filtered.filter(p =>
      criteria.themes.some(theme => p.themes.includes(theme))
    );
  } else {
    // ALL themes must match (for focused lessons, usually just one theme)
    filtered = filtered.filter(p =>
      criteria.themes.every(theme => p.themes.includes(theme))
    );
  }

  // Exclude themes
  if (criteria.excludeThemes?.length) {
    filtered = filtered.filter(p =>
      !criteria.excludeThemes!.some(theme => p.themes.includes(theme))
    );
  }

  // Exclude already-seen puzzles (for reviews)
  if (criteria.excludePuzzleIds?.length) {
    const excludeSet = new Set(criteria.excludePuzzleIds);
    filtered = filtered.filter(p => !excludeSet.has(p.id));
  }

  // Filter by piece (if specified)
  if (criteria.pieceFilter) {
    const pieceMap: Record<string, string> = {
      'queen': 'Q',
      'rook': 'R',
      'bishop': 'B',
      'knight': 'N',
      'pawn': 'P',
    };
    const targetPiece = pieceMap[criteria.pieceFilter];

    filtered = filtered.filter(p => {
      const meta = extractSolutionMetadata(p);
      return meta.firstMovePiece === targetPiece;
    });
  }

  const totalCandidates = filtered.length;

  // Step 2: Split into difficulty tiers
  const tiers = splitIntoTiers(filtered, criteria.ratingMin, criteria.ratingMax);

  // Step 3: Select with diversity
  const selected: Puzzle[] = [];
  const selectedMeta: SolutionMetadata[] = [];
  let diversitySkips = 0;

  // For mixed practice, track theme distribution
  const themeDistribution: Record<string, number> = {};

  /**
   * Select one puzzle from a tier, respecting diversity
   */
  function selectFromTier(
    tier: Puzzle[],
    preferredTheme?: string
  ): Puzzle | null {
    // Shuffle tier for randomness (but within rating band)
    const shuffled = [...tier].sort(() => Math.random() - 0.5);

    // If mixed practice with preferred theme, prioritize that theme
    if (preferredTheme) {
      shuffled.sort((a, b) => {
        const aHas = a.themes.includes(preferredTheme) ? 0 : 1;
        const bHas = b.themes.includes(preferredTheme) ? 0 : 1;
        return aHas - bHas;
      });
    }

    for (const puzzle of shuffled) {
      // Skip if already selected
      if (selected.some(s => s.id === puzzle.id)) continue;

      // Check diversity against previous puzzle
      if (selectedMeta.length > 0) {
        const newMeta = extractSolutionMetadata(puzzle);
        const prevMeta = selectedMeta[selectedMeta.length - 1];

        if (areSolutionsSimilar(prevMeta, newMeta)) {
          diversitySkips++;
          continue;
        }
      }

      return puzzle;
    }

    // If no diverse option found, just pick first available
    for (const puzzle of shuffled) {
      if (!selected.some(s => s.id === puzzle.id)) {
        return puzzle;
      }
    }

    return null;
  }

  // Determine theme order for mixed practice (interleave themes)
  let themeOrder: (string | undefined)[] = [undefined, undefined, undefined, undefined, undefined, undefined];

  if (criteria.isMixedPractice && criteria.themes.length > 1) {
    // Interleave themes: [A, B, C, A, B, C] or similar
    themeOrder = [];
    for (let i = 0; i < 6; i++) {
      themeOrder.push(criteria.themes[i % criteria.themes.length]);
    }
  }

  // Selection pattern: 2 from tier1, 2 from tier2, 2 from tier3
  const selectionPattern: [Puzzle[], number][] = [
    [tiers.tier1, 0],  // Puzzle 1: easy, theme[0]
    [tiers.tier1, 1],  // Puzzle 2: easy, theme[1]
    [tiers.tier2, 2],  // Puzzle 3: medium, theme[2]
    [tiers.tier2, 3],  // Puzzle 4: medium, theme[3]
    [tiers.tier3, 4],  // Puzzle 5: hard, theme[4]
    [tiers.tier3, 5],  // Puzzle 6: hard, theme[5]
  ];

  for (const [tier, themeIndex] of selectionPattern) {
    const preferredTheme = themeOrder[themeIndex];
    const puzzle = selectFromTier(tier, preferredTheme);

    if (puzzle) {
      selected.push(puzzle);
      selectedMeta.push(extractSolutionMetadata(puzzle));

      // Track theme distribution
      const primaryTheme = puzzle.theme || puzzle.themes[0];
      themeDistribution[primaryTheme] = (themeDistribution[primaryTheme] || 0) + 1;
    }
  }

  // If we didn't get 6 puzzles, try to fill from any tier
  while (selected.length < 6) {
    const allRemaining = [...tiers.tier1, ...tiers.tier2, ...tiers.tier3]
      .filter(p => !selected.some(s => s.id === p.id));

    if (allRemaining.length === 0) break;

    const puzzle = selectFromTier(allRemaining);
    if (puzzle) {
      selected.push(puzzle);
      selectedMeta.push(extractSolutionMetadata(puzzle));

      const primaryTheme = puzzle.theme || puzzle.themes[0];
      themeDistribution[primaryTheme] = (themeDistribution[primaryTheme] || 0) + 1;
    } else {
      break;
    }
  }

  return {
    puzzles: selected,
    metadata: {
      totalCandidates,
      tier1Count: tiers.tier1.length,
      tier2Count: tiers.tier2.length,
      tier3Count: tiers.tier3.length,
      diversitySkips,
      themeDistribution,
    },
  };
}

// ============================================================================
// REVIEW LESSON HELPER
// ============================================================================

/**
 * Select puzzles for a review lesson with theme interleaving and no repeats
 */
export function selectPuzzlesForReview(
  puzzlesByTheme: Record<string, Puzzle[]>,
  criteria: LessonSelectionCriteria
): SelectionResult {
  // Combine all puzzles
  const allPuzzles: Puzzle[] = [];

  for (const theme of criteria.themes) {
    const puzzles = puzzlesByTheme[theme] || [];
    allPuzzles.push(...puzzles);
  }

  // Use the main selection algorithm
  return selectPuzzlesForLesson(allPuzzles, criteria);
}
