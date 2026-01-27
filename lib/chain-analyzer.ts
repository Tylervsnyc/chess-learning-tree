/**
 * Chain Analyzer - Move-by-move tactical analysis
 *
 * Analyzes each move's tactical purpose and traces the causal chain
 * to determine what a puzzle is REALLY teaching.
 */

import { Chess, Square, PieceSymbol, Color, Piece } from 'chess.js';

// ============================================================================
// TYPES
// ============================================================================

export interface MoveAnalysis {
  moveNumber: number;
  san: string;
  uci: string;
  piece: PieceSymbol;
  isCheck: boolean;
  isCapture: boolean;
  capturedPiece: PieceSymbol | null;

  // The ONE primary tactical theme of this move
  theme: {
    name: string;
    level: 'FORCING' | 'ENABLER' | 'MECHANISM' | 'OUTCOME';
    confidence: number;
    evidence: string;
  };

  // Causal chain
  createdOpportunity: string | null;  // What did this move set up?
  exploitedOpportunity: string | null; // What previous setup did this use?
}

export interface ChainAnalysis {
  puzzleId: string;
  fen: string;
  puzzleFen: string;
  playerColor: 'white' | 'black';
  moveCount: number;

  // Outcome
  outcome: {
    type: 'checkmate' | 'queen_win' | 'major_win' | 'minor_win' | 'pawn_win' | 'positional';
    achievedAtMove: number;
    materialGained: number;
  };

  // Move-by-move analysis
  moves: MoveAnalysis[];

  // Combination verdict
  combination: {
    isTrueCombination: boolean;
    flow: string;                    // e.g., "deflection → fork → material"
    quality: 'clean' | 'mixed' | 'ambiguous';
  };

  // Final classification
  verdict: {
    primaryTheme: string;
    enablingThemes: string[];
    incidentalThemes: string[];
    teachAs: string;                 // What to label this puzzle in curriculum
    confidence: number;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
};

const HIERARCHY_LEVELS = {
  FORCING: ['check', 'capture', 'threat'],
  ENABLER: ['attraction', 'deflection', 'clearance', 'interference', 'sacrifice'],
  MECHANISM: ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck'],
  OUTCOME: ['checkmate', 'materialGain'],
};

// ============================================================================
// MAIN ANALYZER
// ============================================================================

export function analyzePuzzleChain(
  puzzleId: string,
  fen: string,
  moves: string,
  rating: number,
  themes: string
): ChainAnalysis {
  const chess = new Chess(fen);
  const moveList = moves.split(' ');
  const lichessThemes = themes.split(' ');

  // Apply setup move
  const setupUci = moveList[0];
  chess.move({
    from: setupUci.slice(0, 2) as Square,
    to: setupUci.slice(2, 4) as Square,
    promotion: setupUci.length > 4 ? setupUci[4] as 'q' | 'r' | 'b' | 'n' : undefined
  });

  const puzzleFen = chess.fen();
  const playerColor = chess.turn() === 'w' ? 'white' : 'black';

  // Analyze each player move
  const moveAnalyses: MoveAnalysis[] = [];
  let materialGained = 0;
  let lastMoveCreated: string | null = null;

  for (let i = 1; i < moveList.length; i++) {
    const isPlayerMove = (i % 2 === 1);
    const uci = moveList[i];

    // Snapshot position BEFORE move for analysis
    const positionBefore = new Chess(chess.fen());

    const moveResult = chess.move({
      from: uci.slice(0, 2) as Square,
      to: uci.slice(2, 4) as Square,
      promotion: uci.length > 4 ? uci[4] as 'q' | 'r' | 'b' | 'n' : undefined
    });

    if (!moveResult) continue;

    // Track material
    if (moveResult.captured) {
      const value = PIECE_VALUES[moveResult.captured];
      materialGained += isPlayerMove ? value : -value;
    }

    // Only analyze player moves
    if (!isPlayerMove) {
      lastMoveCreated = null;
      continue;
    }

    // Analyze this move
    const analysis = analyzeMove(
      positionBefore,
      chess,
      moveResult,
      uci,
      Math.ceil(i / 2),
      lastMoveCreated,
      moveList.slice(i + 1),
      lichessThemes
    );

    moveAnalyses.push(analysis);
    lastMoveCreated = analysis.createdOpportunity;
  }

  // Determine outcome
  const outcome = determineOutcome(chess, materialGained, moveAnalyses.length);

  // Analyze the combination / chain
  const combination = analyzeChain(moveAnalyses, outcome);

  // Final verdict
  const verdict = determineVerdict(moveAnalyses, combination, outcome, lichessThemes);

  return {
    puzzleId,
    fen,
    puzzleFen,
    playerColor: playerColor as 'white' | 'black',
    moveCount: moveAnalyses.length,
    outcome,
    moves: moveAnalyses,
    combination,
    verdict,
  };
}

// ============================================================================
// MOVE ANALYSIS
// ============================================================================

function analyzeMove(
  positionBefore: Chess,
  positionAfter: Chess,
  moveResult: ReturnType<Chess['move']>,
  uci: string,
  moveNumber: number,
  previousCreated: string | null,
  futureMoves: string[],
  lichessThemes: string[]
): MoveAnalysis {
  const san = moveResult!.san;
  const piece = moveResult!.piece;
  const isCheck = san.includes('+') || san.includes('#');
  const isCapture = !!moveResult!.captured;
  const capturedPiece = moveResult!.captured || null;
  const toSquare = uci.slice(2, 4) as Square;

  // Detect tactical patterns
  const patterns = detectPatterns(positionBefore, positionAfter, moveResult!, toSquare, futureMoves);

  // Determine the ONE primary theme
  const theme = selectPrimaryTheme(patterns, isCheck, isCapture, capturedPiece, positionAfter, lichessThemes);

  // What did this move create for future exploitation?
  const createdOpportunity = detectCreatedOpportunity(positionAfter, toSquare, futureMoves);

  // What did this move exploit from previous setup?
  const exploitedOpportunity = previousCreated;

  return {
    moveNumber,
    san,
    uci,
    piece,
    isCheck,
    isCapture,
    capturedPiece,
    theme,
    createdOpportunity,
    exploitedOpportunity,
  };
}

// ============================================================================
// PATTERN DETECTION
// ============================================================================

interface DetectedPattern {
  type: string;
  confidence: number;
  evidence: string;
}

function detectPatterns(
  before: Chess,
  after: Chess,
  move: NonNullable<ReturnType<Chess['move']>>,
  toSquare: Square,
  futureMoves: string[]
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const playerColor = before.turn();
  const opponentColor = playerColor === 'w' ? 'b' : 'w';

  // Check for FORK
  const forkResult = detectFork(after, toSquare, opponentColor);
  if (forkResult) {
    patterns.push(forkResult);
  }

  // Check for PIN
  const pinResult = detectPin(after, toSquare, opponentColor);
  if (pinResult) {
    patterns.push(pinResult);
  }

  // Check for SKEWER
  const skewerResult = detectSkewer(after, toSquare, opponentColor);
  if (skewerResult) {
    patterns.push(skewerResult);
  }

  // Check for DEFLECTION (did we attack a defender?)
  const deflectionResult = detectDeflection(before, after, move, futureMoves);
  if (deflectionResult) {
    patterns.push(deflectionResult);
  }

  // Check for DISCOVERED ATTACK
  const discoveryResult = detectDiscoveredAttack(before, after, move);
  if (discoveryResult) {
    patterns.push(discoveryResult);
  }

  // Check for ATTRACTION (forced piece to bad square)
  const attractionResult = detectAttraction(before, after, move, futureMoves);
  if (attractionResult) {
    patterns.push(attractionResult);
  }

  return patterns;
}

function detectFork(position: Chess, fromSquare: Square, opponentColor: Color): DetectedPattern | null {
  const attackedPieces = getAttackedPieces(position, fromSquare, opponentColor);

  // Fork = attacking 2+ valuable pieces
  const valuablePieces = attackedPieces.filter(p => PIECE_VALUES[p.piece.type] >= 3 || p.piece.type === 'k');

  if (valuablePieces.length >= 2) {
    const targets = valuablePieces.map(p => p.piece.type.toUpperCase()).join(', ');
    const includesKing = valuablePieces.some(p => p.piece.type === 'k');

    return {
      type: 'fork',
      confidence: includesKing ? 0.95 : 0.85,
      evidence: `Attacks ${valuablePieces.length} pieces: ${targets}`,
    };
  }

  return null;
}

function detectPin(position: Chess, fromSquare: Square, opponentColor: Color): DetectedPattern | null {
  const piece = position.get(fromSquare);
  if (!piece) return null;

  // Pins require sliding pieces (B, R, Q)
  if (!['b', 'r', 'q'].includes(piece.type)) return null;

  const directions = getSlidingDirections(piece.type);

  for (const dir of directions) {
    const pinned = findPinnedPiece(position, fromSquare, dir, opponentColor);
    if (pinned) {
      return {
        type: 'pin',
        confidence: pinned.pinnedToKing ? 0.9 : 0.75,
        evidence: `${pinned.pinnedPiece.toUpperCase()} pinned to ${pinned.pinnedTo.toUpperCase()}`,
      };
    }
  }

  return null;
}

function detectSkewer(position: Chess, fromSquare: Square, opponentColor: Color): DetectedPattern | null {
  const piece = position.get(fromSquare);
  if (!piece) return null;

  if (!['b', 'r', 'q'].includes(piece.type)) return null;

  const directions = getSlidingDirections(piece.type);

  for (const dir of directions) {
    const skewer = findSkewer(position, fromSquare, dir, opponentColor);
    if (skewer) {
      return {
        type: 'skewer',
        confidence: 0.85,
        evidence: `${skewer.front.toUpperCase()} skewered, ${skewer.behind.toUpperCase()} behind`,
      };
    }
  }

  return null;
}

function detectDeflection(
  before: Chess,
  after: Chess,
  move: NonNullable<ReturnType<Chess['move']>>,
  futureMoves: string[]
): DetectedPattern | null {
  // Did we attack/capture a piece that was defending something?
  const toSquare = move.to as Square;
  const targetPiece = before.get(toSquare);

  if (!targetPiece) {
    // We didn't capture, but did we attack a defender?
    const attackedSquares = getAttackedSquares(after, move.to as Square);
    for (const sq of attackedSquares) {
      const piece = after.get(sq as Square);
      if (piece && piece.color !== move.color) {
        const wasDefending = getDefendedSquares(before, sq as Square);
        const weExploitLater = futureMoves.some(m =>
          wasDefending.includes(m.slice(2, 4))
        );

        if (weExploitLater) {
          return {
            type: 'deflection',
            confidence: 0.8,
            evidence: `Attacks defender on ${sq}, exploited later`,
          };
        }
      }
    }
    return null;
  }

  // We captured something - was it a defender?
  const wasDefending = getDefendedSquares(before, toSquare);
  if (wasDefending.length === 0) return null;

  // Check if we exploit what it was defending
  const weExploitLater = futureMoves.some(m =>
    wasDefending.includes(m.slice(2, 4))
  );

  if (weExploitLater) {
    return {
      type: 'deflection',
      confidence: 0.85,
      evidence: `Captured defender of ${wasDefending.join(', ')}`,
    };
  }

  return null;
}

function detectDiscoveredAttack(
  before: Chess,
  after: Chess,
  move: NonNullable<ReturnType<Chess['move']>>
): DetectedPattern | null {
  const fromSquare = move.from as Square;
  const playerColor = move.color;
  const opponentColor = playerColor === 'w' ? 'b' : 'w';

  // Discovered attack: a piece moves and REVEALS an attack from a piece behind it
  // The key is that the attack must be NEW (wasn't possible before the move)

  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0],  // Rook directions
    [1, 1], [1, -1], [-1, 1], [-1, -1]  // Bishop directions
  ];

  const fromFile = fromSquare.charCodeAt(0) - 97;
  const fromRank = parseInt(fromSquare[1]) - 1;

  for (const [df, dr] of directions) {
    // Look behind the moved piece (opposite direction of movement)
    let f = fromFile - df;
    let r = fromRank - dr;

    while (f >= 0 && f < 8 && r >= 0 && r < 8) {
      const sq = (String.fromCharCode(97 + f) + (r + 1)) as Square;
      const piece = after.get(sq);

      if (piece) {
        if (piece.color === playerColor && ['b', 'r', 'q'].includes(piece.type)) {
          // Found a sliding piece behind - check if it now attacks something valuable
          // that it COULDN'T attack before (the moved piece was blocking)

          // Get attacks AFTER the move
          const attacksAfter = getAttackedPieces(after, sq, opponentColor);

          // Get attacks BEFORE the move (piece was blocking on fromSquare)
          const attacksBefore = getAttackedPieces(before, sq, opponentColor);
          const attackedBeforeSquares = new Set(attacksBefore.map(a => a.square));

          // NEW attacks = attacks that weren't possible before
          const newAttacks = attacksAfter.filter(a => !attackedBeforeSquares.has(a.square));
          const valuableNew = newAttacks.filter(a => PIECE_VALUES[a.piece.type] >= 5 || a.piece.type === 'k');

          if (valuableNew.length > 0) {
            // Also verify the discovered piece is on the line from the slider through fromSquare
            // (i.e., the moved piece was actually blocking this attack)
            const targetSquare = valuableNew[0].square;
            const targetFile = targetSquare.charCodeAt(0) - 97;
            const targetRank = parseInt(targetSquare[1]) - 1;

            // Check if fromSquare is between the slider and target
            const sliderFile = sq.charCodeAt(0) - 97;
            const sliderRank = parseInt(sq[1]) - 1;

            const onLine = isSquareBetween(sliderFile, sliderRank, fromFile, fromRank, targetFile, targetRank);

            if (onLine) {
              return {
                type: 'discoveredAttack',
                confidence: 0.85,
                evidence: `${piece.type.toUpperCase()} discovered attack on ${valuableNew.map(v => v.piece.type.toUpperCase()).join(', ')}`,
              };
            }
          }
        }
        break; // Blocked by a piece
      }

      f -= df;
      r -= dr;
    }
  }

  return null;
}

// Check if point B is between A and C on a line
function isSquareBetween(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
  // Check if all three points are on the same line
  const crossProduct = (cx - ax) * (by - ay) - (cy - ay) * (bx - ax);
  if (Math.abs(crossProduct) > 0.01) return false; // Not on same line

  // Check if B is between A and C
  const minX = Math.min(ax, cx);
  const maxX = Math.max(ax, cx);
  const minY = Math.min(ay, cy);
  const maxY = Math.max(ay, cy);

  return bx >= minX && bx <= maxX && by >= minY && by <= maxY;
}

function detectAttraction(
  before: Chess,
  after: Chess,
  move: NonNullable<ReturnType<Chess['move']>>,
  futureMoves: string[]
): DetectedPattern | null {
  // Attraction: We forced a piece to a specific square where it's vulnerable
  // Usually involves a sacrifice

  if (!move.captured) return null; // Usually attraction involves sacrifice

  const sacrificeValue = PIECE_VALUES[move.piece];
  const capturedValue = PIECE_VALUES[move.captured];

  // Did we sacrifice (gave up more than we took)?
  if (sacrificeValue <= capturedValue) return null;

  // Check if opponent's recapture puts them on a bad square that we exploit
  if (futureMoves.length >= 2) {
    const opponentRecapture = futureMoves[0];
    const ourFollowup = futureMoves[1];

    // If our followup attacks the recapture square, it might be attraction
    if (ourFollowup && ourFollowup.slice(2, 4) === opponentRecapture?.slice(2, 4)) {
      return {
        type: 'attraction',
        confidence: 0.7,
        evidence: `Sacrifice to attract piece to vulnerable square`,
      };
    }
  }

  return null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all pieces attacked by a piece on a given square
 * Uses GEOMETRIC attacks, not legal moves (important for fork detection!)
 */
function getAttackedPieces(position: Chess, fromSquare: Square, opponentColor: Color): { square: Square; piece: Piece }[] {
  const result: { square: Square; piece: Piece }[] = [];
  const piece = position.get(fromSquare);
  if (!piece) return result;

  const file = fromSquare.charCodeAt(0) - 97;
  const rank = parseInt(fromSquare[1]) - 1;

  // Get attacked squares based on piece type (geometric, not legal moves)
  const attackedSquares = getGeometricAttacks(position, piece.type, file, rank, piece.color);

  for (const sq of attackedSquares) {
    const targetPiece = position.get(sq);
    if (targetPiece && targetPiece.color === opponentColor) {
      result.push({ square: sq, piece: targetPiece });
    }
  }

  return result;
}

/**
 * Get all squares a piece attacks geometrically (ignoring legality)
 */
function getGeometricAttacks(position: Chess, pieceType: PieceSymbol, file: number, rank: number, color: Color): Square[] {
  const squares: Square[] = [];

  const toSquare = (f: number, r: number): Square | null => {
    if (f < 0 || f > 7 || r < 0 || r > 7) return null;
    return (String.fromCharCode(97 + f) + (r + 1)) as Square;
  };

  switch (pieceType) {
    case 'n': // Knight - 8 possible squares
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [df, dr] of knightOffsets) {
        const sq = toSquare(file + df, rank + dr);
        if (sq) squares.push(sq);
      }
      break;

    case 'b': // Bishop - diagonals
      for (const [df, dr] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        let f = file + df, r = rank + dr;
        while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
          const sq = toSquare(f, r)!;
          squares.push(sq);
          if (position.get(sq)) break; // Blocked
          f += df; r += dr;
        }
      }
      break;

    case 'r': // Rook - ranks and files
      for (const [df, dr] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        let f = file + df, r = rank + dr;
        while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
          const sq = toSquare(f, r)!;
          squares.push(sq);
          if (position.get(sq)) break; // Blocked
          f += df; r += dr;
        }
      }
      break;

    case 'q': // Queen - both bishop and rook moves
      for (const [df, dr] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        let f = file + df, r = rank + dr;
        while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
          const sq = toSquare(f, r)!;
          squares.push(sq);
          if (position.get(sq)) break; // Blocked
          f += df; r += dr;
        }
      }
      break;

    case 'k': // King - 8 adjacent squares
      for (const [df, dr] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const sq = toSquare(file + df, rank + dr);
        if (sq) squares.push(sq);
      }
      break;

    case 'p': // Pawn - diagonal captures only
      const direction = color === 'w' ? 1 : -1;
      const leftCapture = toSquare(file - 1, rank + direction);
      const rightCapture = toSquare(file + 1, rank + direction);
      if (leftCapture) squares.push(leftCapture);
      if (rightCapture) squares.push(rightCapture);
      break;
  }

  return squares;
}

function getAttackedSquares(position: Chess, fromSquare: Square): string[] {
  const piece = position.get(fromSquare);
  if (!piece) return [];

  const file = fromSquare.charCodeAt(0) - 97;
  const rank = parseInt(fromSquare[1]) - 1;

  return getGeometricAttacks(position, piece.type, file, rank, piece.color);
}

function getDefendedSquares(position: Chess, defenderSquare: Square): string[] {
  const piece = position.get(defenderSquare);
  if (!piece) return [];

  const defended: string[] = [];
  const testPos = new Chess(position.fen());

  // Remove the defender and see what becomes undefended
  // This is a simplification - we check what squares this piece attacks
  // that contain friendly pieces

  const moves = position.moves({ square: defenderSquare, verbose: true });
  for (const move of moves) {
    const target = position.get(move.to as Square);
    if (target && target.color === piece.color) {
      defended.push(move.to);
    }
  }

  return defended;
}

function getSlidingDirections(pieceType: string): [number, number][] {
  if (pieceType === 'r') return [[0, 1], [0, -1], [1, 0], [-1, 0]];
  if (pieceType === 'b') return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  if (pieceType === 'q') return [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  return [];
}

function findPinnedPiece(
  position: Chess,
  fromSquare: Square,
  direction: [number, number],
  opponentColor: Color
): { pinnedPiece: string; pinnedTo: string; pinnedToKing: boolean } | null {
  const [df, dr] = direction;
  const fromFile = fromSquare.charCodeAt(0) - 97;
  const fromRank = parseInt(fromSquare[1]) - 1;

  let f = fromFile + df;
  let r = fromRank + dr;
  let firstPiece: { type: string; square: string } | null = null;

  while (f >= 0 && f < 8 && r >= 0 && r < 8) {
    const sq = (String.fromCharCode(97 + f) + (r + 1)) as Square;
    const piece = position.get(sq);

    if (piece) {
      if (piece.color === opponentColor) {
        if (!firstPiece) {
          firstPiece = { type: piece.type, square: sq };
        } else {
          // Found second piece - is it more valuable or king?
          if (piece.type === 'k' || PIECE_VALUES[piece.type as PieceSymbol] > PIECE_VALUES[firstPiece.type as PieceSymbol]) {
            return {
              pinnedPiece: firstPiece.type,
              pinnedTo: piece.type,
              pinnedToKing: piece.type === 'k',
            };
          }
          break;
        }
      } else {
        break; // Own piece blocks
      }
    }

    f += df;
    r += dr;
  }

  return null;
}

function findSkewer(
  position: Chess,
  fromSquare: Square,
  direction: [number, number],
  opponentColor: Color
): { front: string; behind: string } | null {
  const [df, dr] = direction;
  const fromFile = fromSquare.charCodeAt(0) - 97;
  const fromRank = parseInt(fromSquare[1]) - 1;

  let f = fromFile + df;
  let r = fromRank + dr;
  let firstPiece: { type: string; square: string } | null = null;

  while (f >= 0 && f < 8 && r >= 0 && r < 8) {
    const sq = (String.fromCharCode(97 + f) + (r + 1)) as Square;
    const piece = position.get(sq);

    if (piece) {
      if (piece.color === opponentColor) {
        if (!firstPiece) {
          firstPiece = { type: piece.type, square: sq };
        } else {
          // Skewer: first piece is MORE valuable than second
          if (piece.type === 'k' || PIECE_VALUES[firstPiece.type as PieceSymbol] > PIECE_VALUES[piece.type as PieceSymbol]) {
            // This is a pin, not skewer
            break;
          }
          if (PIECE_VALUES[firstPiece.type as PieceSymbol] >= PIECE_VALUES[piece.type as PieceSymbol]) {
            return {
              front: firstPiece.type,
              behind: piece.type,
            };
          }
          break;
        }
      } else {
        break;
      }
    }

    f += df;
    r += dr;
  }

  return null;
}

// ============================================================================
// THEME SELECTION
// ============================================================================

function selectPrimaryTheme(
  patterns: DetectedPattern[],
  isCheck: boolean,
  isCapture: boolean,
  capturedPiece: PieceSymbol | null,
  position: Chess,
  lichessThemes: string[]
): MoveAnalysis['theme'] {
  // Checkmate is always primary
  if (position.isCheckmate()) {
    return {
      name: 'checkmate',
      level: 'OUTCOME',
      confidence: 1.0,
      evidence: 'Checkmate delivered',
    };
  }

  // If we detected patterns, pick the most confident one
  if (patterns.length > 0) {
    // Sort by confidence
    patterns.sort((a, b) => b.confidence - a.confidence);
    const best = patterns[0];

    return {
      name: best.type,
      level: getThemeLevel(best.type),
      confidence: best.confidence,
      evidence: best.evidence,
    };
  }

  // Check is forcing but not a theme in itself
  if (isCheck) {
    return {
      name: 'check',
      level: 'FORCING',
      confidence: 0.9,
      evidence: 'Delivers check',
    };
  }

  // Capture of valuable piece
  if (isCapture && capturedPiece && PIECE_VALUES[capturedPiece] >= 3) {
    return {
      name: 'capture',
      level: 'FORCING',
      confidence: 0.8,
      evidence: `Captures ${capturedPiece.toUpperCase()}`,
    };
  }

  // Default: quiet move / unclear
  return {
    name: 'quiet',
    level: 'FORCING',
    confidence: 0.5,
    evidence: 'Quiet move - purpose unclear from analysis',
  };
}

function getThemeLevel(theme: string): 'FORCING' | 'ENABLER' | 'MECHANISM' | 'OUTCOME' {
  if (HIERARCHY_LEVELS.OUTCOME.includes(theme)) return 'OUTCOME';
  if (HIERARCHY_LEVELS.MECHANISM.includes(theme)) return 'MECHANISM';
  if (HIERARCHY_LEVELS.ENABLER.includes(theme)) return 'ENABLER';
  return 'FORCING';
}

function detectCreatedOpportunity(
  position: Chess,
  moveToSquare: Square,
  futureMoves: string[]
): string | null {
  // What new tactical opportunity did this move create?

  // Check if we created a fork threat
  const piece = position.get(moveToSquare);
  if (!piece) return null;

  // For now, simple heuristic: if next move exploits same piece, we created something
  if (futureMoves.length > 0) {
    const nextOurMove = futureMoves.length > 1 ? futureMoves[1] : null;
    if (nextOurMove && nextOurMove.slice(0, 2) === moveToSquare) {
      return `Set up ${piece.type.toUpperCase()} for next move`;
    }
  }

  return null;
}

// ============================================================================
// CHAIN ANALYSIS
// ============================================================================

function determineOutcome(
  position: Chess,
  materialGained: number,
  moveCount: number
): ChainAnalysis['outcome'] {
  if (position.isCheckmate()) {
    return { type: 'checkmate', achievedAtMove: moveCount, materialGained };
  }

  if (materialGained >= 9) return { type: 'queen_win', achievedAtMove: moveCount, materialGained };
  if (materialGained >= 5) return { type: 'major_win', achievedAtMove: moveCount, materialGained };
  if (materialGained >= 3) return { type: 'minor_win', achievedAtMove: moveCount, materialGained };
  if (materialGained >= 1) return { type: 'pawn_win', achievedAtMove: moveCount, materialGained };

  return { type: 'positional', achievedAtMove: moveCount, materialGained };
}

function analyzeChain(
  moves: MoveAnalysis[],
  outcome: ChainAnalysis['outcome']
): ChainAnalysis['combination'] {
  if (moves.length === 0) {
    return { isTrueCombination: false, flow: 'empty', quality: 'ambiguous' };
  }

  if (moves.length === 1) {
    return {
      isTrueCombination: false,
      flow: moves[0].theme.name,
      quality: moves[0].theme.confidence > 0.7 ? 'clean' : 'ambiguous',
    };
  }

  // Multiple moves - check if different themes form a chain
  const themes = moves.map(m => m.theme.name).filter(t => t !== 'check' && t !== 'capture' && t !== 'quiet');
  const uniqueThemes = [...new Set(themes)];

  if (uniqueThemes.length <= 1) {
    // Same theme repeated or no clear themes
    return {
      isTrueCombination: false,
      flow: uniqueThemes[0] || 'unclear',
      quality: 'mixed',
    };
  }

  // Check if themes span different hierarchy levels
  const levels = uniqueThemes.map(t => getThemeLevel(t));
  const uniqueLevels = [...new Set(levels)];

  if (uniqueLevels.length > 1) {
    // Themes at different levels = potential true combination
    const flow = moves
      .filter(m => m.theme.name !== 'check' && m.theme.name !== 'capture' && m.theme.name !== 'quiet')
      .map(m => m.theme.name)
      .join(' → ');

    const avgConfidence = moves.reduce((sum, m) => sum + m.theme.confidence, 0) / moves.length;

    return {
      isTrueCombination: true,
      flow: flow + ' → ' + outcome.type,
      quality: avgConfidence > 0.75 ? 'clean' : avgConfidence > 0.6 ? 'mixed' : 'ambiguous',
    };
  }

  return {
    isTrueCombination: false,
    flow: themes.join(' → '),
    quality: 'mixed',
  };
}

function determineVerdict(
  moves: MoveAnalysis[],
  combination: ChainAnalysis['combination'],
  outcome: ChainAnalysis['outcome'],
  lichessThemes: string[]
): ChainAnalysis['verdict'] {
  // If checkmate, that's always the primary theme
  if (outcome.type === 'checkmate') {
    const enablingThemes = moves
      .filter(m => m.theme.level === 'ENABLER' || m.theme.level === 'MECHANISM')
      .map(m => m.theme.name);

    return {
      primaryTheme: 'checkmate',
      enablingThemes: [...new Set(enablingThemes)],
      incidentalThemes: [],
      teachAs: detectMatePattern(lichessThemes) || 'checkmate',
      confidence: 0.95,
    };
  }

  // For material wins, the mechanism that won material is primary
  const mechanisms = moves.filter(m => m.theme.level === 'MECHANISM');
  const enablers = moves.filter(m => m.theme.level === 'ENABLER');

  if (mechanisms.length > 0) {
    const primaryMech = mechanisms.reduce((best, m) =>
      m.theme.confidence > best.theme.confidence ? m : best
    );

    return {
      primaryTheme: primaryMech.theme.name,
      enablingThemes: enablers.map(e => e.theme.name),
      incidentalThemes: [],
      teachAs: combination.isTrueCombination ? combination.flow : primaryMech.theme.name,
      confidence: primaryMech.theme.confidence,
    };
  }

  if (enablers.length > 0) {
    const primaryEnabler = enablers[0];
    return {
      primaryTheme: primaryEnabler.theme.name,
      enablingThemes: [],
      incidentalThemes: [],
      teachAs: primaryEnabler.theme.name,
      confidence: primaryEnabler.theme.confidence,
    };
  }

  // Fallback
  return {
    primaryTheme: 'tactical',
    enablingThemes: [],
    incidentalThemes: [],
    teachAs: outcome.type === 'positional' ? 'positional' : 'material',
    confidence: 0.5,
  };
}

function detectMatePattern(themes: string[]): string | null {
  const patterns = [
    'backRankMate', 'smotheredMate', 'hookMate', 'arabianMate', 'anastasiasMate',
    'bodensMate', 'doubleBishopMate', 'operaMate', 'pillsburysMate', 'suffocationMate',
  ];

  return themes.find(t => patterns.includes(t)) || null;
}
