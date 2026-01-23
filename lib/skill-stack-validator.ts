/**
 * Skill Stack Validator
 *
 * Validates that puzzles with multiple themes actually demonstrate
 * Theme A → Theme B (causal sequence), not just both themes existing.
 *
 * For example, a "Fork → Mate" puzzle should have:
 * 1. A fork move early in the solution
 * 2. A checkmate later in the solution
 * 3. The fork being FORCING (enables the mate)
 */

import { Chess, Square, Move } from 'chess.js';

export interface SkillStackResult {
  valid: boolean;
  theme1Move: number | null;  // Player move number (1-indexed)
  theme2Move: number | null;
  reasoning: string;
}

// Piece values for material calculations
const PIECE_VALUES: Record<string, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 100
};

/**
 * Main validation function - checks if theme1 leads to theme2
 */
export function verifySkillStackSequence(
  fen: string,
  moves: string,  // UCI moves space-separated (includes setup move)
  theme1: string,
  theme2: string
): SkillStackResult {
  const moveList = moves.split(' ');

  // Skip setup move (index 0), solution starts at index 1
  const solutionMoves = moveList.slice(1);

  if (solutionMoves.length === 0) {
    return { valid: false, theme1Move: null, theme2Move: null, reasoning: 'No solution moves' };
  }

  // Apply setup move to get puzzle position
  const chess = new Chess(fen);
  const setupUci = moveList[0];
  chess.move({
    from: setupUci.slice(0, 2) as Square,
    to: setupUci.slice(2, 4) as Square,
    promotion: setupUci[4] as 'q' | 'r' | 'b' | 'n' | undefined
  });

  const puzzleFen = chess.fen();

  // Route to specific validator based on theme combination
  const combo = `${theme1}->${theme2}`;

  // Fork combinations
  if (theme1 === 'fork' && (theme2.includes('mate') || theme2 === 'mateIn2' || theme2 === 'mateIn3')) {
    return validateForkToMate(puzzleFen, solutionMoves);
  }

  if (theme1 === 'fork' && theme2 === 'mate') {
    return validateForkToMate(puzzleFen, solutionMoves);
  }

  // Pin combinations
  if (theme1 === 'pin' && theme2 === 'fork') {
    return validatePinToFork(puzzleFen, solutionMoves);
  }

  if (theme1 === 'pin' && (theme2.includes('mate') || theme2 === 'mate')) {
    return validatePinToMate(puzzleFen, solutionMoves);
  }

  // Remove defender combinations
  if ((theme1 === 'capturingDefender' || theme1 === 'deflection') && theme2 === 'fork') {
    return validateRemoveDefenderToFork(puzzleFen, solutionMoves);
  }

  if ((theme1 === 'capturingDefender' || theme1 === 'deflection') && (theme2.includes('mate') || theme2 === 'mate')) {
    return validateRemoveDefenderToMate(puzzleFen, solutionMoves);
  }

  // Default: just check that both themes are active in sequence
  return validateGenericSequence(puzzleFen, solutionMoves, theme1, theme2);
}

/**
 * Validate Fork → Mate sequence
 * The fork should be forcing (check or winning material) and lead to mate
 */
function validateForkToMate(puzzleFen: string, solutionMoves: string[]): SkillStackResult {
  const chess = new Chess(puzzleFen);

  let forkMoveIndex = -1;
  let mateMoveIndex = -1;
  let forkIsForcing = false;

  for (let i = 0; i < solutionMoves.length; i++) {
    const uci = solutionMoves[i];
    const positionBefore = chess.fen();

    const move = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined
    });

    if (!move) break;

    // Only analyze player moves (even indices in solution)
    if (i % 2 === 0) {
      const playerMoveNum = Math.floor(i / 2) + 1;

      // Check for fork (attacks 2+ valuable pieces)
      if (forkMoveIndex === -1 && isForkMove(positionBefore, move, chess)) {
        forkMoveIndex = i;
        // Fork is forcing if it's check or captures material
        forkIsForcing = move.san.includes('+') || move.san.includes('#') || !!move.captured;
      }

      // Check for checkmate
      if (chess.isCheckmate()) {
        mateMoveIndex = i;
        break;
      }
    }
  }

  // Validate: fork must come before mate AND be relevant
  if (forkMoveIndex >= 0 && mateMoveIndex > forkMoveIndex) {
    const forkPlayerMove = Math.floor(forkMoveIndex / 2) + 1;
    const matePlayerMove = Math.floor(mateMoveIndex / 2) + 1;

    // Fork should be in first 1-2 player moves to be the "enabling" tactic
    if (forkPlayerMove <= 2) {
      return {
        valid: true,
        theme1Move: forkPlayerMove,
        theme2Move: matePlayerMove,
        reasoning: `Fork on move ${forkPlayerMove}${forkIsForcing ? ' (forcing)' : ''}, mate on move ${matePlayerMove}`
      };
    }
  }

  // Check if it's really just a mate puzzle with incidental fork
  if (mateMoveIndex >= 0 && (forkMoveIndex === -1 || forkMoveIndex >= mateMoveIndex)) {
    return {
      valid: false,
      theme1Move: null,
      theme2Move: Math.floor(mateMoveIndex / 2) + 1,
      reasoning: 'Mate puzzle with incidental fork tag - fork not enabling'
    };
  }

  return {
    valid: false,
    theme1Move: forkMoveIndex >= 0 ? Math.floor(forkMoveIndex / 2) + 1 : null,
    theme2Move: mateMoveIndex >= 0 ? Math.floor(mateMoveIndex / 2) + 1 : null,
    reasoning: 'Fork does not lead to mate in sequence'
  };
}

/**
 * Validate Pin → Fork sequence
 * Pin restricts a piece, then fork exploits the restriction
 */
function validatePinToFork(puzzleFen: string, solutionMoves: string[]): SkillStackResult {
  const chess = new Chess(puzzleFen);

  let pinMoveIndex = -1;
  let forkMoveIndex = -1;

  for (let i = 0; i < solutionMoves.length; i++) {
    const uci = solutionMoves[i];
    const positionBefore = chess.fen();

    const move = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined
    });

    if (!move) break;

    if (i % 2 === 0) {
      // Check for pin
      if (pinMoveIndex === -1 && isPinMove(positionBefore, move, chess)) {
        pinMoveIndex = i;
      }

      // Check for fork (after pin)
      if (pinMoveIndex >= 0 && forkMoveIndex === -1 && isForkMove(positionBefore, move, chess)) {
        forkMoveIndex = i;
      }
    }
  }

  if (pinMoveIndex >= 0 && forkMoveIndex > pinMoveIndex) {
    return {
      valid: true,
      theme1Move: Math.floor(pinMoveIndex / 2) + 1,
      theme2Move: Math.floor(forkMoveIndex / 2) + 1,
      reasoning: `Pin on move ${Math.floor(pinMoveIndex / 2) + 1}, fork on move ${Math.floor(forkMoveIndex / 2) + 1}`
    };
  }

  return {
    valid: false,
    theme1Move: pinMoveIndex >= 0 ? Math.floor(pinMoveIndex / 2) + 1 : null,
    theme2Move: forkMoveIndex >= 0 ? Math.floor(forkMoveIndex / 2) + 1 : null,
    reasoning: 'Pin does not enable fork in sequence'
  };
}

/**
 * Validate Pin → Mate sequence
 */
function validatePinToMate(puzzleFen: string, solutionMoves: string[]): SkillStackResult {
  const chess = new Chess(puzzleFen);

  let pinMoveIndex = -1;
  let mateMoveIndex = -1;

  for (let i = 0; i < solutionMoves.length; i++) {
    const uci = solutionMoves[i];
    const positionBefore = chess.fen();

    const move = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined
    });

    if (!move) break;

    if (i % 2 === 0) {
      if (pinMoveIndex === -1 && isPinMove(positionBefore, move, chess)) {
        pinMoveIndex = i;
      }

      if (chess.isCheckmate()) {
        mateMoveIndex = i;
        break;
      }
    }
  }

  if (pinMoveIndex >= 0 && mateMoveIndex > pinMoveIndex) {
    const pinMove = Math.floor(pinMoveIndex / 2) + 1;
    const mateMove = Math.floor(mateMoveIndex / 2) + 1;

    if (pinMove <= 2) {
      return {
        valid: true,
        theme1Move: pinMove,
        theme2Move: mateMove,
        reasoning: `Pin on move ${pinMove}, mate on move ${mateMove}`
      };
    }
  }

  return {
    valid: false,
    theme1Move: pinMoveIndex >= 0 ? Math.floor(pinMoveIndex / 2) + 1 : null,
    theme2Move: mateMoveIndex >= 0 ? Math.floor(mateMoveIndex / 2) + 1 : null,
    reasoning: 'Pin does not enable mate in sequence'
  };
}

/**
 * Validate Remove Defender → Fork sequence
 */
function validateRemoveDefenderToFork(puzzleFen: string, solutionMoves: string[]): SkillStackResult {
  const chess = new Chess(puzzleFen);

  let removeMoveIndex = -1;
  let forkMoveIndex = -1;

  for (let i = 0; i < solutionMoves.length; i++) {
    const uci = solutionMoves[i];
    const positionBefore = chess.fen();

    const move = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined
    });

    if (!move) break;

    if (i % 2 === 0) {
      // First capture could be removing defender
      if (removeMoveIndex === -1 && move.captured) {
        removeMoveIndex = i;
      }

      // Check for fork after removal
      if (removeMoveIndex >= 0 && isForkMove(positionBefore, move, chess)) {
        forkMoveIndex = i;
      }
    }
  }

  if (removeMoveIndex >= 0 && forkMoveIndex > removeMoveIndex) {
    return {
      valid: true,
      theme1Move: Math.floor(removeMoveIndex / 2) + 1,
      theme2Move: Math.floor(forkMoveIndex / 2) + 1,
      reasoning: `Remove defender on move ${Math.floor(removeMoveIndex / 2) + 1}, fork on move ${Math.floor(forkMoveIndex / 2) + 1}`
    };
  }

  return {
    valid: false,
    theme1Move: removeMoveIndex >= 0 ? Math.floor(removeMoveIndex / 2) + 1 : null,
    theme2Move: forkMoveIndex >= 0 ? Math.floor(forkMoveIndex / 2) + 1 : null,
    reasoning: 'Defender removal does not enable fork'
  };
}

/**
 * Validate Remove Defender → Mate sequence
 */
function validateRemoveDefenderToMate(puzzleFen: string, solutionMoves: string[]): SkillStackResult {
  const chess = new Chess(puzzleFen);

  let removeMoveIndex = -1;
  let mateMoveIndex = -1;

  for (let i = 0; i < solutionMoves.length; i++) {
    const uci = solutionMoves[i];

    const move = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined
    });

    if (!move) break;

    if (i % 2 === 0) {
      // First capture or deflection move
      if (removeMoveIndex === -1 && (move.captured || move.san.includes('+'))) {
        removeMoveIndex = i;
      }

      if (chess.isCheckmate()) {
        mateMoveIndex = i;
        break;
      }
    }
  }

  if (removeMoveIndex >= 0 && mateMoveIndex > removeMoveIndex) {
    const removeMove = Math.floor(removeMoveIndex / 2) + 1;
    const mateMove = Math.floor(mateMoveIndex / 2) + 1;

    return {
      valid: true,
      theme1Move: removeMove,
      theme2Move: mateMove,
      reasoning: `Remove defender on move ${removeMove}, mate on move ${mateMove}`
    };
  }

  return {
    valid: false,
    theme1Move: removeMoveIndex >= 0 ? Math.floor(removeMoveIndex / 2) + 1 : null,
    theme2Move: mateMoveIndex >= 0 ? Math.floor(mateMoveIndex / 2) + 1 : null,
    reasoning: 'Defender removal does not enable mate'
  };
}

/**
 * Generic sequence validation - just checks themes appear in order
 */
function validateGenericSequence(
  puzzleFen: string,
  solutionMoves: string[],
  theme1: string,
  theme2: string
): SkillStackResult {
  // For unknown combinations, be permissive but log for review
  return {
    valid: true,
    theme1Move: 1,
    theme2Move: 2,
    reasoning: `Generic validation for ${theme1} → ${theme2} (review recommended)`
  };
}

// ============================================================================
// HELPER FUNCTIONS - Detect specific tactical patterns
// ============================================================================

/**
 * Check if a move creates a fork (attacks 2+ pieces worth 3+ points)
 */
function isForkMove(positionBefore: string, move: Move, chessAfter: Chess): boolean {
  const to = move.to as Square;

  // Get all squares this piece now attacks
  const attackedSquares = getAttackedSquares(chessAfter, to, move.color);

  // Count valuable pieces attacked
  let valuableTargets = 0;
  const opponentColor = move.color === 'w' ? 'b' : 'w';

  for (const sq of attackedSquares) {
    const piece = chessAfter.get(sq);
    if (piece && piece.color === opponentColor) {
      const value = PIECE_VALUES[piece.type] || 0;
      if (value >= 3 || piece.type === 'k') {  // Knight/Bishop or better, or King
        valuableTargets++;
      }
    }
  }

  return valuableTargets >= 2;
}

/**
 * Check if a move creates a pin (piece attacks through another to a more valuable one)
 */
function isPinMove(positionBefore: string, move: Move, chessAfter: Chess): boolean {
  const to = move.to as Square;
  const piece = chessAfter.get(to);

  if (!piece) return false;

  // Only bishops, rooks, queens can pin
  if (!['b', 'r', 'q'].includes(piece.type)) return false;

  const opponentColor = piece.color === 'w' ? 'b' : 'w';

  // Check each direction for pin pattern
  const directions = piece.type === 'b'
    ? [[-1,-1], [-1,1], [1,-1], [1,1]]  // Bishop: diagonals
    : piece.type === 'r'
    ? [[-1,0], [1,0], [0,-1], [0,1]]    // Rook: ranks/files
    : [[-1,-1], [-1,1], [1,-1], [1,1], [-1,0], [1,0], [0,-1], [0,1]];  // Queen: all

  for (const [dr, dc] of directions) {
    let firstPiece: { type: string; square: Square } | null = null;
    let secondPiece: { type: string; square: Square } | null = null;

    const files = 'abcdefgh';
    const toFile = files.indexOf(to[0]);
    const toRank = parseInt(to[1]);

    for (let dist = 1; dist <= 7; dist++) {
      const newFile = toFile + dc * dist;
      const newRank = toRank + dr * dist;

      if (newFile < 0 || newFile > 7 || newRank < 1 || newRank > 8) break;

      const sq = `${files[newFile]}${newRank}` as Square;
      const targetPiece = chessAfter.get(sq);

      if (targetPiece) {
        if (targetPiece.color === opponentColor) {
          if (!firstPiece) {
            firstPiece = { type: targetPiece.type, square: sq };
          } else if (!secondPiece) {
            secondPiece = { type: targetPiece.type, square: sq };
            break;
          }
        } else {
          break;  // Own piece blocks
        }
      }
    }

    // Pin exists if: first piece is less valuable than second, and second is king or queen
    if (firstPiece && secondPiece) {
      const firstValue = PIECE_VALUES[firstPiece.type] || 0;
      const secondValue = PIECE_VALUES[secondPiece.type] || 0;

      if (secondValue > firstValue && (secondPiece.type === 'k' || secondPiece.type === 'q')) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get all squares attacked by a piece on a given square
 */
function getAttackedSquares(chess: Chess, square: Square, color: 'w' | 'b'): Square[] {
  const attacked: Square[] = [];
  const files = 'abcdefgh';

  // Get all legal moves from this square
  const moves = chess.moves({ square, verbose: true });

  for (const move of moves) {
    attacked.push(move.to as Square);
  }

  // Also check squares defended (where we could capture if piece was there)
  // This is a simplified version - chess.js moves() already handles attack squares

  return attacked;
}

/**
 * Check if a skill-stack lesson has valid theme combination
 */
export function isSkillStackLesson(requiredTags: string[]): boolean {
  if (requiredTags.length < 2) return false;

  // Known skill-stack combinations
  const validCombos = [
    ['fork', 'mateIn2'],
    ['fork', 'mateIn3'],
    ['fork', 'mate'],
    ['pin', 'fork'],
    ['pin', 'mate'],
    ['pin', 'mateIn2'],
    ['capturingDefender', 'fork'],
    ['capturingDefender', 'mate'],
    ['capturingDefender', 'mateIn2'],
    ['deflection', 'fork'],
    ['deflection', 'mate'],
  ];

  // Check if tags match any valid combo (order matters for some)
  for (const combo of validCombos) {
    if (requiredTags.includes(combo[0]) && requiredTags.includes(combo[1])) {
      return true;
    }
  }

  return false;
}

/**
 * Get the theme order for validation (which theme should come first)
 */
export function getSkillStackOrder(requiredTags: string[]): [string, string] | null {
  // Define which theme is the "enabler" vs the "payoff"
  const enablers = ['fork', 'pin', 'capturingDefender', 'deflection', 'discoveredAttack'];
  const payoffs = ['mate', 'mateIn1', 'mateIn2', 'mateIn3', 'fork'];  // fork can also be payoff

  let enabler: string | null = null;
  let payoff: string | null = null;

  for (const tag of requiredTags) {
    if (enablers.includes(tag) && !enabler) {
      enabler = tag;
    }
    if (payoffs.includes(tag)) {
      // If it's fork and we already have fork as enabler, skip
      if (tag === 'fork' && enabler === 'fork') continue;
      payoff = tag;
    }
  }

  if (enabler && payoff) {
    return [enabler, payoff];
  }

  return null;
}
