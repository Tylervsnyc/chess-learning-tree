import { Chess, Square, PieceSymbol } from 'chess.js';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface DifficultyFactors {
  patternVisibility: number;    // 0-100: How obvious is the tactic? (high = easy)
  candidateMoves: number;       // 0-100: How many plausible first moves? (high = hard)
  trapPotential: number;        // 0-100: Are there tempting wrong answers? (high = hard)
  calculationDepth: number;     // 0-100: Move count adjusted for forcing nature (high = hard)
  boardComplexity: number;      // 0-100: Piece count / visual noise (high = hard)
  setupRequired: number;        // 0-100: Does solution need quiet prep moves? (high = hard)
}

export interface PuzzleAnalysis {
  puzzleId: string;
  fen: string;            // Original FEN before setup move
  puzzleFen: string;      // FEN after setup move (the actual puzzle position)
  rating: number;
  lichessThemes: string[];
  setupMove: string;      // SAN of opponent's move
  lastMoveFrom: string;   // Square the last piece moved from (for highlighting)
  lastMoveTo: string;     // Square the last piece moved to (for highlighting)
  solution: string;       // SAN formatted solution
  solutionMoves: string[]; // Individual SAN moves
  playerColor: 'white' | 'black';
  outcome: 'checkmate' | 'material' | 'positional';
  predictedPrimaryTheme: string;
  reasoning: string;
  url: string;
  // Difficulty analysis (new)
  difficultyFactors: DifficultyFactors;
  trueDifficultyScore: number;  // 400-2000 scale (cognitive difficulty, not Lichess rating)
  recommendedSlot: 1 | 2 | 3 | 4 | 5 | 6;
  executingPiece: PieceSymbol | null;
  solutionOutcome: 'checkmate' | 'queen_win' | 'major_win' | 'minor_win' | 'pawn_win' | 'positional';
  difficultyReasoning: string;
}

export interface SlotAssignment {
  slot: 1 | 2 | 3 | 4 | 5 | 6;
  puzzleId: string;
  analysis: PuzzleAnalysis;
}

// Factor weights for true difficulty computation (must sum to 1.0)
const DIFFICULTY_WEIGHTS = {
  patternVisibility: 0.25,  // High visibility = easier (inverted in calculation)
  candidateMoves: 0.20,
  trapPotential: 0.20,
  calculationDepth: 0.15,
  boardComplexity: 0.10,
  setupRequired: 0.10,
};

// 6-puzzle lesson arc slot definitions
const SLOT_DEFINITIONS = [
  { slot: 1 as const, category: 'warmup', eloOffset: -125, description: 'Confidence builder' },
  { slot: 2 as const, category: 'warmup', eloOffset: -75, description: 'Reinforcement' },
  { slot: 3 as const, category: 'core', eloOffset: -25, description: 'At-level challenge' },
  { slot: 4 as const, category: 'core', eloOffset: 0, description: 'Variation or twist' },
  { slot: 5 as const, category: 'stretch', eloOffset: 50, description: 'Hidden patterns' },
  { slot: 6 as const, category: 'stretch', eloOffset: 100, description: 'Boss level' },
];

// Theme priority for checkmate puzzles
const MATE_PATTERNS = [
  'backRankMate', 'smotheredMate', 'arabianMate', 'anastasiasMate',
  'bodensMate', 'doubleBishopMate', 'hookMate', 'operaMate',
  'pillsburysMate', 'suffocationMate'
];

// Tactical themes (for material-winning puzzles)
const TACTICAL_THEMES = [
  'fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck',
  'deflection', 'attraction', 'interference', 'clearance',
  'sacrifice', 'trappedPiece', 'hangingPiece', 'capturingDefender'
];

// Themes that describe outcome, not tactic
const OUTCOME_THEMES = ['crushing', 'advantage', 'mate', 'mateIn1', 'mateIn2', 'mateIn3', 'mateIn4'];

// Themes that describe game phase, not tactic
const PHASE_THEMES = ['opening', 'middlegame', 'endgame', 'master', 'masterVsMaster'];

// Themes that describe length, not tactic
const LENGTH_THEMES = ['oneMove', 'short', 'long', 'veryLong'];

// Endgame type themes
const ENDGAME_TYPES = ['rookEndgame', 'pawnEndgame', 'bishopEndgame', 'knightEndgame', 'queenEndgame', 'queenRookEndgame'];

export function analyzePuzzle(
  puzzleId: string,
  fen: string,
  moves: string,
  rating: number,
  themes: string,
  url: string
): PuzzleAnalysis {
  const chess = new Chess(fen);
  const moveList = moves.split(' ');
  const lichessThemes = themes.split(' ');

  // Apply setup move (opponent's last move)
  const setupUci = moveList[0];
  const lastMoveFrom = setupUci.slice(0, 2);
  const lastMoveTo = setupUci.slice(2, 4);
  const setupResult = chess.move({
    from: lastMoveFrom,
    to: lastMoveTo,
    promotion: setupUci.length > 4 ? setupUci[4] : undefined
  });
  const setupMove = setupResult?.san || setupUci;

  // Capture the puzzle position (after setup move, before solution)
  const puzzleFen = chess.fen();

  // Determine player color (whoever moves after setup)
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';

  // Apply solution moves and collect SAN
  const solutionMoves: string[] = [];
  for (let i = 1; i < moveList.length; i++) {
    const uci = moveList[i];
    const result = chess.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci.length > 4 ? uci[4] : undefined
    });
    if (result) {
      solutionMoves.push(result.san);
    }
  }

  // Format solution with move numbers
  const solution = formatSolutionSan(solutionMoves, playerColor === 'black');

  // Determine outcome
  let outcome: 'checkmate' | 'material' | 'positional' = 'positional';
  if (chess.isCheckmate()) {
    outcome = 'checkmate';
  } else if (lichessThemes.some(t => ['crushing', 'advantage'].includes(t))) {
    outcome = 'material';
  }

  // Predict primary theme
  const { theme, reasoning } = predictPrimaryTheme(lichessThemes, outcome, solutionMoves);

  // === DIFFICULTY ANALYSIS ===
  // Create a fresh position at the puzzle state for difficulty analysis
  const puzzlePosition = new Chess(puzzleFen);
  const solutionUciMoves = moveList.slice(1); // UCI moves for solution

  // Compute difficulty factors
  const difficultyFactors = computeDifficultyFactors(
    puzzlePosition,
    solutionUciMoves,
    lichessThemes
  );

  // Compute true difficulty score (400-2000 scale)
  const trueDifficultyScore = computeTrueDifficulty(difficultyFactors, rating);

  // Assign recommended lesson slot
  const recommendedSlot = assignSlotByDifficulty(trueDifficultyScore, rating);

  // Identify the piece that executes the first move
  const executingPiece = getExecutingPiece(puzzlePosition, solutionUciMoves[0]);

  // Determine solution outcome (checkmate, queen win, etc.)
  const solutionOutcome = determineSolutionOutcome(puzzleFen, solutionUciMoves);

  // Generate difficulty reasoning
  const difficultyReasoning = generateDifficultyReasoning(
    difficultyFactors,
    trueDifficultyScore,
    rating
  );

  return {
    puzzleId,
    fen,
    puzzleFen,
    rating,
    lichessThemes,
    setupMove,
    lastMoveFrom,
    lastMoveTo,
    solution,
    solutionMoves,
    playerColor,
    outcome,
    predictedPrimaryTheme: theme,
    reasoning,
    url,
    // Difficulty analysis
    difficultyFactors,
    trueDifficultyScore,
    recommendedSlot,
    executingPiece,
    solutionOutcome,
    difficultyReasoning,
  };
}

function predictPrimaryTheme(
  lichessThemes: string[],
  outcome: 'checkmate' | 'material' | 'positional',
  solutionMoves: string[]
): { theme: string; reasoning: string } {

  // Themes that describe LOCATION not TACTIC (these are secondary/incidental)
  const LOCATION_THEMES = ['kingsideAttack', 'queensideAttack', 'attackingF2F7'];

  // Filter out non-tactical themes AND location themes
  const tacticalThemes = lichessThemes.filter(t =>
    !OUTCOME_THEMES.includes(t) &&
    !PHASE_THEMES.includes(t) &&
    !LENGTH_THEMES.includes(t) &&
    !ENDGAME_TYPES.includes(t) &&
    !LOCATION_THEMES.includes(t)
  );

  // RULE 0: If ANY mate tag exists, this is a checkmate puzzle
  const hasMateTag = lichessThemes.some(t =>
    t === 'mate' || t.startsWith('mateIn') || MATE_PATTERNS.includes(t)
  );

  // RULE 1: Checkmate puzzles (by outcome OR by tag)
  if (outcome === 'checkmate' || hasMateTag) {
    // Look for specific mate pattern first
    const matePattern = lichessThemes.find(t => MATE_PATTERNS.includes(t));
    if (matePattern) {
      return {
        theme: matePattern,
        reasoning: `Checkmate puzzle with ${matePattern} pattern. Player is thinking about delivering this specific mate.`
      };
    }

    // Check for mateIn1
    if (lichessThemes.includes('mateIn1')) {
      return {
        theme: 'mateIn1',
        reasoning: `One-move checkmate. The only goal is finding the mating move.`
      };
    }

    // Check for mateIn2
    if (lichessThemes.includes('mateIn2')) {
      // Look for enabling tactic
      if (tacticalThemes.includes('sacrifice')) {
        return {
          theme: 'mateIn2 (sacrifice)',
          reasoning: `Mate in 2 achieved through sacrifice. The sacrifice enables the checkmate.`
        };
      }
      return {
        theme: 'mateIn2',
        reasoning: `Mate in 2 puzzle. Player must find forcing sequence to checkmate.`
      };
    }

    // Check for mateIn3+
    const mateInN = lichessThemes.find(t => t.startsWith('mateIn'));
    if (mateInN) {
      return {
        theme: mateInN,
        reasoning: `${mateInN} puzzle. Player must calculate the mating sequence.`
      };
    }

    // Generic checkmate - tactical themes are incidental
    return {
      theme: 'checkmate',
      reasoning: `Checkmate is the goal. Other tactical tags (${tacticalThemes.join(', ') || 'none'}) are incidental to delivering mate.`
    };
  }

  // RULE 2: Material-winning puzzles - the tactic that wins material is primary
  if (outcome === 'material') {
    // Promotion - only when explicitly tagged (advancedPawn is too broad)
    if (tacticalThemes.includes('promotion')) {
      return {
        theme: 'promotion',
        reasoning: `Wins material through pawn promotion. That's the key tactical idea.`
      };
    }

    // Intermezzo (zwischenzug) - in-between move, often with check
    // This is an underrated tactic that changes how players think about move order
    if (tacticalThemes.includes('intermezzo') || lichessThemes.includes('intermezzo')) {
      return {
        theme: 'intermezzo',
        reasoning: `Zwischenzug (in-between move). Instead of the expected recapture, an intermediate move (often a check) wins more material.`
      };
    }

    // Discovered attack is usually the main theme when present
    if (tacticalThemes.includes('discoveredAttack')) {
      return {
        theme: 'discoveredAttack',
        reasoning: `Discovered attack wins material. The moving piece reveals an attack from another piece.`
      };
    }

    // Attraction/Deflection - these describe the FORCING MECHANISM
    // When present, they're usually the key teaching concept
    if (tacticalThemes.includes('attraction')) {
      return {
        theme: 'attraction',
        reasoning: `Attraction tactic. Force a piece to a vulnerable square (often with check), then exploit its new position.`
      };
    }
    if (tacticalThemes.includes('deflection')) {
      return {
        theme: 'deflection',
        reasoning: `Deflection tactic. Force a defending piece away from what it's protecting.`
      };
    }

    // Fork, pin, skewer are clear primary themes
    const basicTactic = tacticalThemes.find(t => ['fork', 'pin', 'skewer'].includes(t));
    if (basicTactic) {
      return {
        theme: basicTactic,
        reasoning: `${basicTactic.charAt(0).toUpperCase() + basicTactic.slice(1)} wins material. Player thinks: "I can ${basicTactic} those pieces."`
      };
    }

    // Other advanced tactics: interference, clearance
    const advancedTactic = tacticalThemes.find(t => ['interference', 'clearance'].includes(t));
    if (advancedTactic) {
      return {
        theme: advancedTactic,
        reasoning: `${advancedTactic.charAt(0).toUpperCase() + advancedTactic.slice(1)} is the key idea that enables winning material.`
      };
    }

    // Trapped piece
    if (tacticalThemes.includes('trappedPiece')) {
      return {
        theme: 'trappedPiece',
        reasoning: `Wins material by trapping a piece with no escape.`
      };
    }

    // Hanging piece - but check if it's opponent's mistake or your tactic
    if (tacticalThemes.includes('hangingPiece')) {
      return {
        theme: 'hangingPiece',
        reasoning: `Wins hanging material. Note: this might be opponent's blunder rather than your tactic.`
      };
    }

    // Defensive move
    if (tacticalThemes.includes('defensiveMove')) {
      return {
        theme: 'defensiveMove',
        reasoning: `Defensive resource that saves material or improves position.`
      };
    }

    // Quiet move
    if (tacticalThemes.includes('quietMove')) {
      return {
        theme: 'quietMove',
        reasoning: `Quiet (non-forcing) move that creates a winning threat.`
      };
    }

    // If nothing specific, return first tactical theme
    if (tacticalThemes.length > 0) {
      return {
        theme: tacticalThemes[0],
        reasoning: `${tacticalThemes[0]} appears to be the main tactical idea.`
      };
    }
  }

  // RULE 3: Endgame technique puzzles
  const endgameType = lichessThemes.find(t => ENDGAME_TYPES.includes(t));
  if (endgameType) {
    return {
      theme: endgameType,
      reasoning: `Endgame technique puzzle. Teaches ${endgameType} principles.`
    };
  }

  // RULE 4: Pure endgame puzzle without specific type
  if (lichessThemes.includes('endgame')) {
    return {
      theme: 'endgame',
      reasoning: `Endgame puzzle teaching technique or conversion. Tags: ${lichessThemes.join(', ')}`
    };
  }

  // RULE 5: Defensive move as fallback
  if (lichessThemes.includes('defensiveMove')) {
    return {
      theme: 'defensiveMove',
      reasoning: `Defensive resource that saves material or improves position.`
    };
  }

  // RULE 6: Quiet move
  if (lichessThemes.includes('quietMove')) {
    return {
      theme: 'quietMove',
      reasoning: `Quiet (non-forcing) move that creates a winning threat.`
    };
  }

  // Fallback - use any remaining tactical theme
  if (tacticalThemes.length > 0) {
    return {
      theme: tacticalThemes[0],
      reasoning: `Best guess based on available tags: ${tacticalThemes.join(', ')}`
    };
  }

  // Last resort - describe what we have
  const nonMetaThemes = lichessThemes.filter(t =>
    !OUTCOME_THEMES.includes(t) &&
    !LENGTH_THEMES.includes(t)
  );

  if (nonMetaThemes.length > 0) {
    return {
      theme: nonMetaThemes[0],
      reasoning: `Primary theme appears to be ${nonMetaThemes[0]}. Full tags: ${lichessThemes.join(', ')}`
    };
  }

  return {
    theme: 'tactical puzzle',
    reasoning: `General tactical puzzle. Tags: ${lichessThemes.join(', ')}`
  };
}

function formatSolutionSan(moves: string[], startsAsBlack: boolean): string {
  if (moves.length === 0) return '';

  const parts: string[] = [];
  let moveNum = 1;
  let isWhiteMove = !startsAsBlack;

  for (let i = 0; i < moves.length; i++) {
    const san = moves[i];
    if (isWhiteMove) {
      parts.push(`${moveNum}.${san}`);
    } else {
      if (i === 0 && startsAsBlack) {
        parts.push(`${moveNum}...${san}`);
      } else {
        parts.push(san);
      }
      moveNum++;
    }
    isWhiteMove = !isWhiteMove;
  }

  return parts.join(' ');
}

// ============================================================================
// DIFFICULTY ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Compute all 6 difficulty factors for a puzzle
 */
function computeDifficultyFactors(
  position: Chess,
  solutionMoves: string[],
  themes: string[]
): DifficultyFactors {
  return {
    patternVisibility: computePatternVisibility(position, solutionMoves, themes),
    candidateMoves: computeCandidateMoves(position, solutionMoves[0]),
    trapPotential: computeTrapPotential(position, solutionMoves[0], themes),
    calculationDepth: computeCalculationDepth(position, solutionMoves),
    boardComplexity: computeBoardComplexity(position),
    setupRequired: computeSetupRequired(position, solutionMoves),
  };
}

/**
 * Pattern Visibility (25% weight)
 * High score = pattern is obvious (checks, captures) = EASIER
 * Low score = pattern is hidden (quiet moves) = HARDER
 */
function computePatternVisibility(
  position: Chess,
  solutionMoves: string[],
  themes: string[]
): number {
  let score = 50; // Baseline

  const firstMoveUci = solutionMoves[0];
  if (!firstMoveUci) return score;

  const testPosition = new Chess(position.fen());
  const firstMove = testPosition.move({
    from: firstMoveUci.slice(0, 2) as Square,
    to: firstMoveUci.slice(2, 4) as Square,
    promotion: firstMoveUci.length > 4 ? firstMoveUci[4] as 'q' | 'r' | 'b' | 'n' : undefined
  });

  if (!firstMove) return score;

  // Checks are very visible (+30)
  if (firstMove.san.includes('+') || firstMove.san.includes('#')) {
    score += 30;
  }

  // Captures are visible (+20)
  if (firstMove.captured) {
    score += 20;
  }

  // Quiet moves are harder to see (-20)
  if (!firstMove.captured && !firstMove.san.includes('+')) {
    score -= 20;
  }

  // Adjust for theme-specific visibility
  score = adjustForThemeVisibility(score, themes);

  // Adjust for geometric visibility (fork/pin alignment)
  score = adjustForTacticVisibility(score, position, firstMoveUci, themes);

  return Math.max(0, Math.min(100, score));
}

/**
 * Candidate Moves (20% weight)
 * High score = many plausible alternatives = HARDER
 * Low score = few alternatives = EASIER
 */
function computeCandidateMoves(position: Chess, correctMoveUci: string): number {
  const allMoves = position.moves({ verbose: true });
  let plausibleCount = 0;

  for (const move of allMoves) {
    // Checks are always plausible
    const testPos = new Chess(position.fen());
    testPos.move(move);
    if (testPos.isCheck()) {
      plausibleCount++;
      continue;
    }

    // Captures of equal or higher value pieces are plausible
    if (move.captured) {
      const capturedValue = pieceValue(move.captured);
      const movingValue = pieceValue(move.piece);
      if (capturedValue >= movingValue || capturedValue >= 3) {
        plausibleCount++;
        continue;
      }
    }

    // Attacks on high-value targets are plausible
    if (attacksHighValueTarget(position, move)) {
      plausibleCount++;
    }
  }

  // Convert to 0-100 scale
  // 1-2 candidates = easy (20-30), 3-5 = medium (40-60), 6+ = hard (70-100)
  if (plausibleCount <= 2) return 25;
  if (plausibleCount <= 4) return 50;
  if (plausibleCount <= 6) return 70;
  return Math.min(100, 70 + (plausibleCount - 6) * 5);
}

/**
 * Trap Potential (20% weight)
 * High score = tempting wrong moves exist = HARDER
 * Low score = no traps = EASIER
 */
function computeTrapPotential(
  position: Chess,
  correctMoveUci: string,
  themes: string[]
): number {
  let score = 20; // Baseline

  const allMoves = position.moves({ verbose: true });
  const correctFrom = correctMoveUci?.slice(0, 2);
  const correctTo = correctMoveUci?.slice(2, 4);

  let temptingTraps = 0;

  for (const move of allMoves) {
    // Skip the correct move
    if (move.from === correctFrom && move.to === correctTo) continue;

    // Queen captures are tempting
    if (move.captured === 'q') {
      temptingTraps += 30;
      continue;
    }

    // Checks that aren't the answer are tempting
    const testPos = new Chess(position.fen());
    testPos.move(move);
    if (testPos.isCheck()) {
      temptingTraps += 20;
      continue;
    }

    // High-value captures that aren't the answer
    if (move.captured && pieceValue(move.captured) >= 5) {
      temptingTraps += 15;
    }
  }

  score += Math.min(60, temptingTraps);

  // Themes that suggest traps
  if (themes.includes('sacrifice')) score += 15;
  if (themes.includes('deflection')) score += 10;
  if (themes.includes('quietMove')) score += 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculation Depth (15% weight)
 * Adjusted for forcing vs quiet nature of moves
 * High score = long/quiet calculation = HARDER
 */
function computeCalculationDepth(position: Chess, solutionMoves: string[]): number {
  const playerMoveCount = Math.ceil(solutionMoves.length / 2);
  let forcingCount = 0;

  const testPos = new Chess(position.fen());

  for (let i = 0; i < solutionMoves.length; i++) {
    const uci = solutionMoves[i];
    const move = testPos.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci.length > 4 ? uci[4] as 'q' | 'r' | 'b' | 'n' : undefined
    });

    if (!move) break;

    // Player's moves (even indices)
    if (i % 2 === 0) {
      if (move.san.includes('+') || move.san.includes('#') || move.captured) {
        forcingCount++;
      }
    }
  }

  // Base score from move count: 1 move = 20, 2 = 40, 3 = 55, 4+ = 65+
  let score = Math.min(80, 20 + (playerMoveCount - 1) * 15);

  // Adjust for forcing nature: highly forcing = easier (-15), quiet = harder (+15)
  const forcingRatio = playerMoveCount > 0 ? forcingCount / playerMoveCount : 0;
  score += Math.round((0.5 - forcingRatio) * 30);

  return Math.max(0, Math.min(100, score));
}

/**
 * Board Complexity (10% weight)
 * Based on piece count / visual noise
 * High score = busy board = HARDER
 */
function computeBoardComplexity(position: Chess): number {
  const board = position.board();
  let pieceCount = 0;

  for (const row of board) {
    for (const square of row) {
      if (square) pieceCount++;
    }
  }

  // 2-6 pieces = simple (20), 7-12 = medium (40-50), 13-20 = complex (60-70), 21+ = very complex
  if (pieceCount <= 6) return 20;
  if (pieceCount <= 12) return 30 + (pieceCount - 6) * 3;
  if (pieceCount <= 20) return 50 + (pieceCount - 12) * 3;
  return Math.min(100, 75 + (pieceCount - 20) * 2);
}

/**
 * Setup Required (10% weight)
 * Does the solution need quiet preparatory moves?
 * High score = needs setup = HARDER
 */
function computeSetupRequired(position: Chess, solutionMoves: string[]): number {
  if (solutionMoves.length === 0) return 0;

  let quietSetupMoves = 0;
  const testPos = new Chess(position.fen());

  // Check first 1-2 player moves (indices 0, 2)
  for (let i = 0; i < Math.min(3, solutionMoves.length); i += 2) {
    const uci = solutionMoves[i];
    const move = testPos.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci.length > 4 ? uci[4] as 'q' | 'r' | 'b' | 'n' : undefined
    });

    if (!move) break;

    // Quiet move = no check, no capture
    if (!move.san.includes('+') && !move.san.includes('#') && !move.captured) {
      quietSetupMoves++;
    }

    // Apply opponent response if exists
    if (i + 1 < solutionMoves.length) {
      const respUci = solutionMoves[i + 1];
      testPos.move({
        from: respUci.slice(0, 2) as Square,
        to: respUci.slice(2, 4) as Square,
        promotion: respUci.length > 4 ? respUci[4] as 'q' | 'r' | 'b' | 'n' : undefined
      });
    }
  }

  return quietSetupMoves > 1 ? 60 : quietSetupMoves > 0 ? 30 : 10;
}

// ============================================================================
// TRUE DIFFICULTY SCORE COMPUTATION
// ============================================================================

/**
 * Compute true cognitive difficulty score (400-2000 scale)
 * This differs from Lichess rating by accounting for pattern visibility,
 * traps, and forcing nature of moves.
 */
function computeTrueDifficulty(factors: DifficultyFactors, lichessRating: number): number {
  // Compute weighted difficulty score (0-100)
  // Note: patternVisibility is INVERTED (high visibility = low difficulty)
  const difficultyScore =
    (100 - factors.patternVisibility) * DIFFICULTY_WEIGHTS.patternVisibility +
    factors.candidateMoves * DIFFICULTY_WEIGHTS.candidateMoves +
    factors.trapPotential * DIFFICULTY_WEIGHTS.trapPotential +
    factors.calculationDepth * DIFFICULTY_WEIGHTS.calculationDepth +
    factors.boardComplexity * DIFFICULTY_WEIGHTS.boardComplexity +
    factors.setupRequired * DIFFICULTY_WEIGHTS.setupRequired;

  // Map 0-100 difficulty to 400-2000 ELO range
  const baseTrueDifficulty = 400 + (difficultyScore / 100) * 1600;

  // Blend with Lichess rating: 70% computed, 30% Lichess
  // This anchors our estimate while allowing significant correction
  const trueDifficulty = baseTrueDifficulty * 0.7 + lichessRating * 0.3;

  return Math.round(Math.max(400, Math.min(2000, trueDifficulty)));
}

// ============================================================================
// SLOT ASSIGNMENT
// ============================================================================

/**
 * Assign recommended lesson slot based on difficulty gap
 * (how much true difficulty differs from Lichess rating)
 */
function assignSlotByDifficulty(trueDifficulty: number, lichessRating: number): 1 | 2 | 3 | 4 | 5 | 6 {
  const difficultyGap = trueDifficulty - lichessRating;

  // Puzzles where true difficulty << Lichess = good warmups
  if (difficultyGap <= -150) return 1;
  if (difficultyGap <= -75) return 2;
  if (difficultyGap <= -25) return 3;
  if (difficultyGap <= 25) return 4;
  if (difficultyGap <= 75) return 5;
  return 6;
}

/**
 * Assign slot based on target lesson ELO (for selectLessonPuzzles)
 */
export function assignSlotForLesson(
  trueDifficultyScore: number,
  targetElo: number
): 1 | 2 | 3 | 4 | 5 | 6 {
  const diff = trueDifficultyScore - targetElo;

  if (diff <= -100) return 1;
  if (diff <= -50) return 2;
  if (diff <= 0) return 3;
  if (diff <= 25) return 4;
  if (diff <= 75) return 5;
  return 6;
}

// ============================================================================
// LESSON PUZZLE SELECTION
// ============================================================================

interface AnalyzedPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;
  rating: number;
  themes: string;
  url: string;
  analysis: PuzzleAnalysis;
}

/**
 * Select optimal 6 puzzles for a lesson arc
 * Ensures proper difficulty progression and piece diversity
 */
export function selectLessonPuzzles(
  candidates: Array<{
    puzzleId: string;
    fen: string;
    moves: string;
    rating: number;
    themes: string;
    url: string;
  }>,
  targetElo: number
): SlotAssignment[] {
  // Analyze all candidates
  const analyzed: AnalyzedPuzzle[] = candidates.map(p => ({
    ...p,
    analysis: analyzePuzzle(p.puzzleId, p.fen, p.moves, p.rating, p.themes, p.url),
  }));

  // For each slot, find best-fit puzzles
  const slotCandidates = new Map<1 | 2 | 3 | 4 | 5 | 6, AnalyzedPuzzle[]>();

  for (const slot of [1, 2, 3, 4, 5, 6] as const) {
    const slotDef = SLOT_DEFINITIONS.find(s => s.slot === slot)!;
    const targetForSlot = targetElo + slotDef.eloOffset;

    // Score each puzzle for this slot (lower = better fit)
    const scored = analyzed.map(item => ({
      ...item,
      slotScore: Math.abs(item.analysis.trueDifficultyScore - targetForSlot),
    }));

    scored.sort((a, b) => a.slotScore - b.slotScore);
    slotCandidates.set(slot, scored);
  }

  // Select puzzles with diversity constraints
  const selected: SlotAssignment[] = [];
  const usedPuzzleIds = new Set<string>();
  const recentPieces: (PieceSymbol | null)[] = [];

  for (const slot of [1, 2, 3, 4, 5, 6] as const) {
    const candidates = slotCandidates.get(slot)!;

    for (const candidate of candidates) {
      if (usedPuzzleIds.has(candidate.puzzleId)) continue;

      // Check slot-specific criteria
      if (!meetsSlotCriteria(slot, candidate.analysis)) continue;

      // Piece diversity: avoid same piece 3x in a row
      if (recentPieces.length >= 2) {
        const lastTwo = recentPieces.slice(-2);
        if (lastTwo.every(p => p === candidate.analysis.executingPiece)) {
          continue;
        }
      }

      // Slot 6 special: must end with checkmate or queen win
      if (slot === 6) {
        const outcome = candidate.analysis.solutionOutcome;
        if (outcome !== 'checkmate' && outcome !== 'queen_win') {
          continue;
        }
      }

      // Accept this puzzle
      selected.push({
        slot,
        puzzleId: candidate.puzzleId,
        analysis: candidate.analysis,
      });
      usedPuzzleIds.add(candidate.puzzleId);
      recentPieces.push(candidate.analysis.executingPiece);
      break;
    }
  }

  // Fallback: fill missing slots without strict criteria
  if (selected.length < 6) {
    for (const slot of [1, 2, 3, 4, 5, 6] as const) {
      if (selected.find(s => s.slot === slot)) continue;

      const candidates = slotCandidates.get(slot)!;
      for (const candidate of candidates) {
        if (usedPuzzleIds.has(candidate.puzzleId)) continue;

        selected.push({
          slot,
          puzzleId: candidate.puzzleId,
          analysis: candidate.analysis,
        });
        usedPuzzleIds.add(candidate.puzzleId);
        break;
      }
    }
  }

  selected.sort((a, b) => a.slot - b.slot);
  return selected;
}

/**
 * Check if puzzle meets criteria for a given slot
 */
function meetsSlotCriteria(slot: 1 | 2 | 3 | 4 | 5 | 6, analysis: PuzzleAnalysis): boolean {
  const { difficultyFactors: f, lichessThemes } = analysis;

  // Warmup slots (1-2): obvious patterns, few candidates, no traps, short
  if (slot === 1 || slot === 2) {
    if (f.patternVisibility < 50) return false;
    if (f.candidateMoves > 50) return false;
    if (f.trapPotential > 40) return false;
    if (f.calculationDepth > 40) return false;
    // Pure theme only
    if (countSecondaryThemes(lichessThemes) > 1) return false;
  }

  // Core slots (3-4): at-level, may have variations
  if (slot === 3 || slot === 4) {
    if (f.calculationDepth > 60) return false;
    if (countSecondaryThemes(lichessThemes) > 2) return false;
  }

  // Stretch slots (5-6): no strict restrictions (challenging is good)
  return true;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function pieceValue(piece: string): number {
  const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  return values[piece.toLowerCase()] || 0;
}

function attacksHighValueTarget(
  position: Chess,
  move: { from: Square; to: Square; piece: string; promotion?: string }
): boolean {
  try {
    const testPos = new Chess(position.fen());
    const result = testPos.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion as 'q' | 'r' | 'b' | 'n' | undefined
    });
    if (!result) return false;

    const attacks = testPos.moves({ verbose: true });
    return attacks.some(m =>
      m.from === move.to && (m.captured === 'q' || m.captured === 'k')
    );
  } catch {
    return false;
  }
}

function getExecutingPiece(position: Chess, moveUci: string): PieceSymbol | null {
  if (!moveUci) return null;
  const from = moveUci.slice(0, 2) as Square;
  const piece = position.get(from);
  return piece?.type || null;
}

function determineSolutionOutcome(
  puzzleFen: string,
  solutionMoves: string[]
): 'checkmate' | 'queen_win' | 'major_win' | 'minor_win' | 'pawn_win' | 'positional' {
  const chess = new Chess(puzzleFen);
  let materialGained = 0;

  // Play through solution, tracking captures
  for (let i = 0; i < solutionMoves.length; i++) {
    const uci = solutionMoves[i];
    const result = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci.length > 4 ? uci[4] as 'q' | 'r' | 'b' | 'n' : undefined
    });
    if (!result) break;

    // Track material (player moves = even indices)
    if (result.captured) {
      const value = pieceValue(result.captured);
      if (i % 2 === 0) {
        materialGained += value; // Player captured
      } else {
        materialGained -= value; // Opponent captured
      }
    }

    // Promotion bonus
    if (result.promotion && i % 2 === 0) {
      materialGained += pieceValue(result.promotion) - 1; // Gain piece minus pawn
    }
  }

  if (chess.isCheckmate()) return 'checkmate';
  if (materialGained >= 9) return 'queen_win';
  if (materialGained >= 5) return 'major_win';
  if (materialGained >= 3) return 'minor_win';
  if (materialGained >= 1) return 'pawn_win';
  return 'positional';
}

function adjustForThemeVisibility(score: number, themes: string[]): number {
  // Highly visible themes
  if (themes.includes('mateIn1')) score += 15;
  if (themes.includes('backRankMate')) score += 10;
  if (themes.includes('hangingPiece')) score += 15;

  // Hidden pattern themes
  if (themes.includes('quietMove')) score -= 25;
  if (themes.includes('defensiveMove')) score -= 15;
  if (themes.includes('zugzwang')) score -= 20;
  if (themes.includes('interference')) score -= 15;

  return score;
}

function adjustForTacticVisibility(
  score: number,
  position: Chess,
  firstMoveUci: string,
  themes: string[]
): number {
  if (themes.includes('fork')) {
    score = adjustForForkVisibility(score, position, firstMoveUci);
  }
  if (themes.includes('pin') || themes.includes('skewer')) {
    score = adjustForPinVisibility(score, firstMoveUci);
  }
  return score;
}

/**
 * Adjust fork visibility based on target alignment
 * Royal forks (attacking king) are very visible
 */
function adjustForForkVisibility(
  score: number,
  position: Chess,
  firstMoveUci: string
): number {
  const to = firstMoveUci.slice(2, 4) as Square;
  const piece = position.get(firstMoveUci.slice(0, 2) as Square);

  if (!piece) return score;

  // Knight forks are generally visible
  if (piece.type === 'n') {
    const testPos = new Chess(position.fen());
    testPos.move({
      from: firstMoveUci.slice(0, 2) as Square,
      to: to,
      promotion: firstMoveUci.length > 4 ? firstMoveUci[4] as 'q' | 'r' | 'b' | 'n' : undefined
    });

    // Check if fork includes king
    const attacks = testPos.moves({ square: to, verbose: true });
    const attacksKing = attacks.some(m => {
      const target = testPos.get(m.to as Square);
      return target?.type === 'k';
    });

    if (attacksKing) score += 15; // Royal fork is very visible
  }

  return score;
}

/**
 * Adjust pin/skewer visibility
 * Rank/file pins are more visible than diagonal
 */
function adjustForPinVisibility(score: number, firstMoveUci: string): number {
  const from = firstMoveUci.slice(0, 2);
  const to = firstMoveUci.slice(2, 4);

  // Same file or rank = more visible
  if (from[0] === to[0] || from[1] === to[1]) {
    score += 10;
  } else {
    score -= 5; // Diagonal = less visible
  }

  return score;
}

function countSecondaryThemes(themes: string[]): number {
  const PRIMARY_THEMES = [
    'fork', 'pin', 'skewer', 'mateIn1', 'mateIn2', 'mateIn3',
    'backRankMate', 'discoveredAttack', 'deflection', 'attraction'
  ];
  const META_THEMES = [
    'crushing', 'advantage', 'mate', 'short', 'long', 'veryLong',
    'middlegame', 'endgame', 'opening', 'master'
  ];

  let count = 0;
  for (const theme of themes) {
    if (!PRIMARY_THEMES.includes(theme) && !META_THEMES.includes(theme)) {
      count++;
    }
  }
  return count;
}

function generateDifficultyReasoning(
  factors: DifficultyFactors,
  trueDifficulty: number,
  lichessRating: number
): string {
  const parts: string[] = [];

  const ratingDiff = trueDifficulty - lichessRating;
  if (ratingDiff < -100) {
    parts.push(`Easier than Lichess rating (${trueDifficulty} vs ${lichessRating}).`);
  } else if (ratingDiff > 100) {
    parts.push(`Harder than Lichess rating (${trueDifficulty} vs ${lichessRating}).`);
  }

  if (factors.patternVisibility >= 70) {
    parts.push('Obvious pattern (check/capture).');
  } else if (factors.patternVisibility <= 30) {
    parts.push('Hidden pattern (quiet move).');
  }

  if (factors.candidateMoves >= 70) {
    parts.push('Many plausible alternatives.');
  } else if (factors.candidateMoves <= 30) {
    parts.push('Few candidate moves.');
  }

  if (factors.trapPotential >= 60) {
    parts.push('Contains tempting traps.');
  }

  if (factors.calculationDepth >= 60) {
    parts.push('Requires deep calculation.');
  }

  return parts.join(' ') || 'Standard difficulty.';
}
