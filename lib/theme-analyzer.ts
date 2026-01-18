import { Chess } from 'chess.js';

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
}

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
    url
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
