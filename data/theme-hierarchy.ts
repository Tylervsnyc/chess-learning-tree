/**
 * Theme Hierarchy - Chess Tactics Taxonomy
 *
 * This file defines the hierarchical structure of chess tactical themes,
 * mapping Lichess puzzle themes to a pedagogical framework.
 *
 * The hierarchy (from top to bottom):
 * 1. OUTCOMES - Why you win (the goal)
 * 2. MECHANISMS - The tactical patterns that create two problems at once
 * 3. ENABLERS - Moves that set up the mechanisms
 * 4. FORCING MOVES - What makes tactics work (opponent must respond)
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type HierarchyLevel = 'outcome' | 'mechanism' | 'enabler' | 'forcing';

export interface ThemeDefinition {
  id: string;                     // Our internal ID (camelCase)
  lichessTag: string;             // Lichess puzzle database tag
  name: string;                   // Human-readable name
  description: string;            // What this theme means
  level: HierarchyLevel;          // Where it fits in the hierarchy
  leadsTo?: string[];             // Which outcomes this can achieve (for mechanisms)
  setsUp?: string[];              // Which mechanisms this enables (for enablers)
  requiresForcing?: boolean;      // Does this typically involve a forcing move?
}

export interface ThemeCombination {
  enabler: string;                // The enabler theme ID
  mechanism: string;              // The mechanism theme ID
  outcome?: string;               // Optional: specific outcome achieved
  description: string;            // How they combine
  lichessTags: string[];          // Lichess tags that would match this combo
}

// =============================================================================
// OUTCOMES - Why You Win
// =============================================================================

export const OUTCOMES: Record<string, ThemeDefinition> = {
  // Checkmate - the ultimate goal
  mate: {
    id: 'mate',
    lichessTag: 'mate',
    name: 'Checkmate',
    level: 'outcome',
    description: 'The ultimate goal - trap the enemy king with no escape.',
  },
  mateIn1: {
    id: 'mateIn1',
    lichessTag: 'mateIn1',
    name: 'Mate in 1',
    level: 'outcome',
    description: 'Deliver checkmate in a single move.',
  },
  mateIn2: {
    id: 'mateIn2',
    lichessTag: 'mateIn2',
    name: 'Mate in 2',
    level: 'outcome',
    description: 'Force checkmate in exactly two moves.',
  },
  mateIn3: {
    id: 'mateIn3',
    lichessTag: 'mateIn3',
    name: 'Mate in 3',
    level: 'outcome',
    description: 'Force checkmate in exactly three moves.',
  },
  mateIn4: {
    id: 'mateIn4',
    lichessTag: 'mateIn4',
    name: 'Mate in 4',
    level: 'outcome',
    description: 'Force checkmate in exactly four moves.',
  },
  mateIn5: {
    id: 'mateIn5',
    lichessTag: 'mateIn5',
    name: 'Mate in 5',
    level: 'outcome',
    description: 'Force checkmate in exactly five moves.',
  },

  // Checkmate Pattern Types
  backRankMate: {
    id: 'backRankMate',
    lichessTag: 'backRankMate',
    name: 'Back Rank Mate',
    level: 'outcome',
    description: 'Checkmate the king trapped on the back rank by its own pawns.',
  },
  smotheredMate: {
    id: 'smotheredMate',
    lichessTag: 'smotheredMate',
    name: 'Smothered Mate',
    level: 'outcome',
    description: 'Knight checkmates a king completely surrounded by its own pieces.',
  },
  hookMate: {
    id: 'hookMate',
    lichessTag: 'hookMate',
    name: 'Hook Mate',
    level: 'outcome',
    description: 'Checkmate with rook and knight, rook on file adjacent to king.',
  },
  arabianMate: {
    id: 'arabianMate',
    lichessTag: 'arabianMate',
    name: 'Arabian Mate',
    level: 'outcome',
    description: 'Checkmate with rook and knight on the edge of the board.',
  },
  anastasiasMate: {
    id: 'anastasiasMate',
    lichessTag: 'anastasiasMate',
    name: "Anastasia's Mate",
    level: 'outcome',
    description: 'Knight and rook checkmate against a king stuck on the edge.',
  },
  bodensMate: {
    id: 'bodensMate',
    lichessTag: 'bodensMate',
    name: "Boden's Mate",
    level: 'outcome',
    description: 'Two bishops checkmate diagonally, often after queen sacrifice.',
  },
  doubleBishopMate: {
    id: 'doubleBishopMate',
    lichessTag: 'doubleBishopMate',
    name: 'Double Bishop Mate',
    level: 'outcome',
    description: 'Two bishops deliver checkmate together.',
  },
  dovetailMate: {
    id: 'dovetailMate',
    lichessTag: 'dovetailMate',
    name: 'Dovetail Mate',
    level: 'outcome',
    description: 'Queen checkmates with king escape blocked by its own pieces in a dovetail shape.',
  },
  operaMate: {
    id: 'operaMate',
    lichessTag: 'operaMate',
    name: 'Opera Mate',
    level: 'outcome',
    description: 'Rook (or queen) and bishop checkmate on the back rank.',
  },
  pillsburysMate: {
    id: 'pillsburysMate',
    lichessTag: 'pillsburysMate',
    name: "Pillsbury's Mate",
    level: 'outcome',
    description: 'Rook and bishop back rank checkmate pattern.',
  },
  vukovicMate: {
    id: 'vukovicMate',
    lichessTag: 'vukovicMate',
    name: "Vukovic Mate",
    level: 'outcome',
    description: 'Rook and knight checkmate, knight controls escape squares.',
  },

  // Endgame - converting advantage
  endgame: {
    id: 'endgame',
    lichessTag: 'endgame',
    name: 'Endgame',
    level: 'outcome',
    description: 'Win or draw in a simplified position.',
  },
  rookEndgame: {
    id: 'rookEndgame',
    lichessTag: 'rookEndgame',
    name: 'Rook Endgame',
    level: 'outcome',
    description: 'Win in a rook and pawn ending.',
  },
  pawnEndgame: {
    id: 'pawnEndgame',
    lichessTag: 'pawnEndgame',
    name: 'Pawn Endgame',
    level: 'outcome',
    description: 'Win with just kings and pawns.',
  },
  queenEndgame: {
    id: 'queenEndgame',
    lichessTag: 'queenEndgame',
    name: 'Queen Endgame',
    level: 'outcome',
    description: 'Win in a queen ending.',
  },
  bishopEndgame: {
    id: 'bishopEndgame',
    lichessTag: 'bishopEndgame',
    name: 'Bishop Endgame',
    level: 'outcome',
    description: 'Win in a bishop and pawn ending.',
  },
  knightEndgame: {
    id: 'knightEndgame',
    lichessTag: 'knightEndgame',
    name: 'Knight Endgame',
    level: 'outcome',
    description: 'Win in a knight and pawn ending.',
  },
  queenRookEndgame: {
    id: 'queenRookEndgame',
    lichessTag: 'queenRookEndgame',
    name: 'Queen vs Rook Endgame',
    level: 'outcome',
    description: 'Win with queen vs rook.',
  },

  // Winning Material
  winningMaterial: {
    id: 'winningMaterial',
    lichessTag: 'crushing',
    name: 'Winning Material',
    level: 'outcome',
    description: 'Win significant material advantage.',
  },
  hangingPiece: {
    id: 'hangingPiece',
    lichessTag: 'hangingPiece',
    name: 'Hanging Piece',
    level: 'outcome',
    description: 'Capture an undefended piece for free.',
  },
  trappedPiece: {
    id: 'trappedPiece',
    lichessTag: 'trappedPiece',
    name: 'Trapped Piece',
    level: 'outcome',
    description: 'Win a piece that has no safe squares to escape.',
  },
  promotion: {
    id: 'promotion',
    lichessTag: 'promotion',
    name: 'Promotion',
    level: 'outcome',
    description: 'Promote a pawn to a stronger piece (usually queen).',
  },
  underPromotion: {
    id: 'underPromotion',
    lichessTag: 'underPromotion',
    name: 'Under-Promotion',
    level: 'outcome',
    description: 'Promote to a knight, bishop, or rook instead of queen.',
  },

  // Defensive outcomes
  defensiveMove: {
    id: 'defensiveMove',
    lichessTag: 'defensiveMove',
    name: 'Defensive Move',
    level: 'outcome',
    description: 'Find the move that saves a difficult position.',
  },
  equality: {
    id: 'equality',
    lichessTag: 'equality',
    name: 'Equality',
    level: 'outcome',
    description: 'Hold the position to a draw or equal game.',
  },
};

// =============================================================================
// MECHANISMS - Tactical Patterns (Create Two Problems at Once)
// =============================================================================

export const MECHANISMS: Record<string, ThemeDefinition> = {
  fork: {
    id: 'fork',
    lichessTag: 'fork',
    name: 'Fork',
    level: 'mechanism',
    description: 'One piece attacks two or more enemy pieces simultaneously.',
    leadsTo: ['winningMaterial', 'mate', 'hangingPiece'],
  },
  pin: {
    id: 'pin',
    lichessTag: 'pin',
    name: 'Pin',
    level: 'mechanism',
    description: 'Attack a piece that cannot move without exposing a more valuable piece behind it.',
    leadsTo: ['winningMaterial', 'mate', 'trappedPiece'],
  },
  skewer: {
    id: 'skewer',
    lichessTag: 'skewer',
    name: 'Skewer',
    level: 'mechanism',
    description: 'Attack a valuable piece; when it moves, capture the piece behind it.',
    leadsTo: ['winningMaterial'],
  },
  discoveredAttack: {
    id: 'discoveredAttack',
    lichessTag: 'discoveredAttack',
    name: 'Discovered Attack',
    level: 'mechanism',
    description: 'Move one piece to reveal an attack from another piece behind it.',
    leadsTo: ['winningMaterial', 'mate'],
  },
  discoveredCheck: {
    id: 'discoveredCheck',
    lichessTag: 'discoveredCheck',
    name: 'Discovered Check',
    level: 'mechanism',
    description: 'Discovered attack where the revealed attack is check.',
    leadsTo: ['winningMaterial', 'mate'],
  },
  doubleCheck: {
    id: 'doubleCheck',
    lichessTag: 'doubleCheck',
    name: 'Double Check',
    level: 'mechanism',
    description: 'Both the moving piece and the revealed piece give check - king must move.',
    leadsTo: ['mate', 'winningMaterial'],
  },
  exposedKing: {
    id: 'exposedKing',
    lichessTag: 'exposedKing',
    name: 'Exposed King',
    level: 'mechanism',
    description: 'Attack a king with poor pawn cover or exposed position.',
    leadsTo: ['mate', 'winningMaterial'],
  },
};

// =============================================================================
// ENABLERS - Moves That Set Up Mechanisms
// =============================================================================

export const ENABLERS: Record<string, ThemeDefinition> = {
  attraction: {
    id: 'attraction',
    lichessTag: 'attraction',
    name: 'Attraction',
    level: 'enabler',
    description: 'Lure an enemy piece to a vulnerable square (often with a sacrifice).',
    setsUp: ['fork', 'pin', 'skewer', 'discoveredAttack', 'mate'],
    requiresForcing: true,
  },
  deflection: {
    id: 'deflection',
    lichessTag: 'deflection',
    name: 'Deflection',
    level: 'enabler',
    description: 'Force a defender away from protecting something important.',
    setsUp: ['fork', 'pin', 'mate', 'winningMaterial'],
    requiresForcing: true,
  },
  clearance: {
    id: 'clearance',
    lichessTag: 'clearance',
    name: 'Clearance',
    level: 'enabler',
    description: 'Move a piece out of the way to open a line or square for another piece.',
    setsUp: ['discoveredAttack', 'mate', 'fork', 'skewer'],
    requiresForcing: true,
  },
  capturingDefender: {
    id: 'capturingDefender',
    lichessTag: 'capturingDefender',
    name: 'Capturing Defender',
    level: 'enabler',
    description: 'Capture the piece that was defending something important.',
    setsUp: ['hangingPiece', 'mate', 'winningMaterial'],
    requiresForcing: true,
  },
  interference: {
    id: 'interference',
    lichessTag: 'interference',
    name: 'Interference',
    level: 'enabler',
    description: 'Block the line between an enemy piece and what it defends.',
    setsUp: ['mate', 'winningMaterial', 'pin'],
    requiresForcing: false,
  },
  overloading: {
    id: 'overloading',
    lichessTag: 'overloading',
    name: 'Overloading',
    level: 'enabler',
    description: 'Force a piece to defend too many things at once.',
    setsUp: ['deflection', 'winningMaterial'],
    requiresForcing: true,
  },
  xRayAttack: {
    id: 'xRayAttack',
    lichessTag: 'xRayAttack',
    name: 'X-Ray Attack',
    level: 'enabler',
    description: 'Attack through an enemy piece to threaten something behind it.',
    setsUp: ['skewer', 'pin', 'mate'],
    requiresForcing: false,
  },
  intermezzo: {
    id: 'intermezzo',
    lichessTag: 'intermezzo',
    name: 'Zwischenzug (Intermezzo)',
    level: 'enabler',
    description: 'An in-between move that must be answered before the expected reply.',
    setsUp: ['winningMaterial', 'mate', 'fork'],
    requiresForcing: true,
  },
  sacrifice: {
    id: 'sacrifice',
    lichessTag: 'sacrifice',
    name: 'Sacrifice',
    level: 'enabler',
    description: 'Give up material to achieve a greater goal.',
    setsUp: ['attraction', 'deflection', 'mate', 'fork', 'pin'],
    requiresForcing: true,
  },
  quietMove: {
    id: 'quietMove',
    lichessTag: 'quietMove',
    name: 'Quiet Move',
    level: 'enabler',
    description: 'A non-capture, non-check move that creates an unstoppable threat.',
    setsUp: ['mate', 'trappedPiece', 'winningMaterial'],
    requiresForcing: false,
  },
  advancedPawn: {
    id: 'advancedPawn',
    lichessTag: 'advancedPawn',
    name: 'Advanced Pawn',
    level: 'enabler',
    description: 'Use an advanced pawn to create threats or promote.',
    setsUp: ['promotion', 'deflection'],
    requiresForcing: false,
  },
};

// =============================================================================
// FORCING MOVES - What Makes Tactics Work
// =============================================================================

export const FORCING_MOVES: Record<string, ThemeDefinition> = {
  check: {
    id: 'check',
    lichessTag: 'check',
    name: 'Check',
    level: 'forcing',
    description: 'Attack the king - opponent must respond to the check.',
  },
  capture: {
    id: 'capture',
    lichessTag: 'capture',
    name: 'Capture',
    level: 'forcing',
    description: 'Take a piece - opponent often must recapture.',
  },
  threat: {
    id: 'threat',
    lichessTag: 'threat',
    name: 'Threat',
    level: 'forcing',
    description: 'Create a threat that must be addressed (mate threat, piece attack).',
  },
  zugzwang: {
    id: 'zugzwang',
    lichessTag: 'zugzwang',
    name: 'Zugzwang',
    level: 'forcing',
    description: 'Put the opponent in a position where any move worsens their position.',
  },
};

// =============================================================================
// GAME PHASE / CONTEXT TAGS (not tactical, but used in Lichess)
// =============================================================================

export const CONTEXT_TAGS: Record<string, ThemeDefinition> = {
  opening: {
    id: 'opening',
    lichessTag: 'opening',
    name: 'Opening',
    level: 'outcome', // Not really, but we need a level
    description: 'Puzzle from the opening phase of the game.',
  },
  middlegame: {
    id: 'middlegame',
    lichessTag: 'middlegame',
    name: 'Middlegame',
    level: 'outcome',
    description: 'Puzzle from the middlegame.',
  },
  kingsideAttack: {
    id: 'kingsideAttack',
    lichessTag: 'kingsideAttack',
    name: 'Kingside Attack',
    level: 'outcome',
    description: 'Attack focused on the kingside.',
  },
  queensideAttack: {
    id: 'queensideAttack',
    lichessTag: 'queensideAttack',
    name: 'Queenside Attack',
    level: 'outcome',
    description: 'Attack focused on the queenside.',
  },
  castling: {
    id: 'castling',
    lichessTag: 'castling',
    name: 'Castling',
    level: 'outcome',
    description: 'Puzzle involves castling.',
  },
  enPassant: {
    id: 'enPassant',
    lichessTag: 'enPassant',
    name: 'En Passant',
    level: 'outcome',
    description: 'Puzzle involves an en passant capture.',
  },
  // Puzzle metadata
  oneMove: {
    id: 'oneMove',
    lichessTag: 'oneMove',
    name: 'One Move',
    level: 'outcome',
    description: 'Solution is a single move.',
  },
  short: {
    id: 'short',
    lichessTag: 'short',
    name: 'Short',
    level: 'outcome',
    description: 'Short puzzle (2-3 moves).',
  },
  long: {
    id: 'long',
    lichessTag: 'long',
    name: 'Long',
    level: 'outcome',
    description: 'Long puzzle (4+ moves).',
  },
  veryLong: {
    id: 'veryLong',
    lichessTag: 'veryLong',
    name: 'Very Long',
    level: 'outcome',
    description: 'Very long puzzle (6+ moves).',
  },
  master: {
    id: 'master',
    lichessTag: 'master',
    name: 'Master Game',
    level: 'outcome',
    description: 'Puzzle from a master-level game.',
  },
  masterVsMaster: {
    id: 'masterVsMaster',
    lichessTag: 'masterVsMaster',
    name: 'Master vs Master',
    level: 'outcome',
    description: 'Puzzle from a game between two masters.',
  },
  superGM: {
    id: 'superGM',
    lichessTag: 'superGM',
    name: 'Super GM',
    level: 'outcome',
    description: 'Puzzle from a super grandmaster game.',
  },
};

// =============================================================================
// VALID THEME COMBINATIONS
// =============================================================================

/**
 * Valid combinations where an enabler sets up a mechanism to achieve an outcome.
 * These represent meaningful "compound tactics" in the Lichess database.
 */
export const THEME_COMBINATIONS: ThemeCombination[] = [
  // Attraction enables various mechanisms
  {
    enabler: 'attraction',
    mechanism: 'fork',
    description: 'Lure a piece to a square where it can be forked.',
    lichessTags: ['attraction', 'fork'],
  },
  {
    enabler: 'attraction',
    mechanism: 'pin',
    description: 'Lure a piece to a square where it becomes pinned.',
    lichessTags: ['attraction', 'pin'],
  },
  {
    enabler: 'attraction',
    mechanism: 'skewer',
    description: 'Lure a piece to a line where it can be skewered.',
    lichessTags: ['attraction', 'skewer'],
  },
  {
    enabler: 'attraction',
    mechanism: 'discoveredAttack',
    outcome: 'mate',
    description: 'Lure the king to a square for discovered check/mate.',
    lichessTags: ['attraction', 'discoveredAttack'],
  },

  // Deflection combinations
  {
    enabler: 'deflection',
    mechanism: 'fork',
    outcome: 'winningMaterial',
    description: 'Deflect a defender to set up a fork.',
    lichessTags: ['deflection', 'fork'],
  },
  {
    enabler: 'deflection',
    mechanism: 'pin',
    description: 'Deflect a piece to create or exploit a pin.',
    lichessTags: ['deflection', 'pin'],
  },
  {
    enabler: 'deflection',
    mechanism: 'exposedKing',
    outcome: 'mate',
    description: 'Deflect the defender of the king to deliver mate.',
    lichessTags: ['deflection', 'backRankMate'],
  },

  // Sacrifice combinations
  {
    enabler: 'sacrifice',
    mechanism: 'fork',
    description: 'Sacrifice to set up a winning fork.',
    lichessTags: ['sacrifice', 'fork'],
  },
  {
    enabler: 'sacrifice',
    mechanism: 'discoveredAttack',
    outcome: 'mate',
    description: 'Sacrifice to enable a discovered check and mate.',
    lichessTags: ['sacrifice', 'discoveredAttack'],
  },
  {
    enabler: 'sacrifice',
    mechanism: 'doubleCheck',
    outcome: 'mate',
    description: 'Sacrifice to deliver double check and mate.',
    lichessTags: ['sacrifice', 'doubleCheck'],
  },
  {
    enabler: 'sacrifice',
    mechanism: 'exposedKing',
    outcome: 'backRankMate',
    description: 'Sacrifice on the back rank to deliver mate.',
    lichessTags: ['sacrifice', 'backRankMate'],
  },
  {
    enabler: 'sacrifice',
    mechanism: 'exposedKing',
    outcome: 'smotheredMate',
    description: 'Queen sacrifice to enable smothered mate.',
    lichessTags: ['sacrifice', 'smotheredMate'],
  },

  // Clearance combinations
  {
    enabler: 'clearance',
    mechanism: 'discoveredAttack',
    description: 'Clear a line to enable discovered attack.',
    lichessTags: ['clearance', 'discoveredAttack'],
  },
  {
    enabler: 'clearance',
    mechanism: 'fork',
    description: 'Clear a square for a forking piece.',
    lichessTags: ['clearance', 'fork'],
  },

  // Intermezzo combinations
  {
    enabler: 'intermezzo',
    mechanism: 'fork',
    description: 'In-between move that forks before recapturing.',
    lichessTags: ['intermezzo', 'fork'],
  },
  {
    enabler: 'intermezzo',
    mechanism: 'discoveredCheck',
    description: 'In-between discovered check before recapturing.',
    lichessTags: ['intermezzo', 'discoveredCheck'],
  },

  // Quiet move combinations
  {
    enabler: 'quietMove',
    mechanism: 'fork',
    outcome: 'mate',
    description: 'Quiet move that threatens unstoppable fork or mate.',
    lichessTags: ['quietMove', 'fork'],
  },
  {
    enabler: 'quietMove',
    mechanism: 'pin',
    outcome: 'winningMaterial',
    description: 'Quiet move that sets up a winning pin.',
    lichessTags: ['quietMove', 'pin'],
  },
];

// =============================================================================
// MECHANISM TO OUTCOME MAPPINGS
// =============================================================================

/**
 * Defines which mechanisms typically lead to which outcomes.
 */
export const MECHANISM_OUTCOMES: Record<string, string[]> = {
  fork: ['winningMaterial', 'hangingPiece', 'mate', 'mateIn1', 'mateIn2'],
  pin: ['winningMaterial', 'trappedPiece', 'mate', 'mateIn1', 'mateIn2'],
  skewer: ['winningMaterial'],
  discoveredAttack: ['winningMaterial', 'mate', 'mateIn1', 'mateIn2', 'mateIn3'],
  discoveredCheck: ['winningMaterial', 'mate', 'mateIn1', 'mateIn2'],
  doubleCheck: ['mate', 'mateIn1', 'mateIn2', 'winningMaterial'],
  exposedKing: ['mate', 'backRankMate', 'smotheredMate', 'arabianMate', 'hookMate'],
};

/**
 * Defines which enablers typically set up which mechanisms.
 */
export const ENABLER_MECHANISMS: Record<string, string[]> = {
  attraction: ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck'],
  deflection: ['fork', 'pin', 'exposedKing', 'discoveredAttack'],
  clearance: ['discoveredAttack', 'discoveredCheck', 'fork', 'skewer'],
  capturingDefender: ['hangingPiece', 'mate', 'winningMaterial'],
  interference: ['pin', 'mate', 'winningMaterial'],
  overloading: ['deflection', 'winningMaterial'],
  xRayAttack: ['skewer', 'pin', 'mate'],
  intermezzo: ['fork', 'discoveredCheck', 'winningMaterial'],
  sacrifice: ['attraction', 'deflection', 'clearance', 'fork', 'pin', 'mate'],
  quietMove: ['mate', 'trappedPiece', 'fork', 'pin'],
  advancedPawn: ['promotion', 'deflection', 'fork'],
};

// =============================================================================
// COMPLETE LICHESS TAG MAPPING
// =============================================================================

/**
 * Complete mapping of all known Lichess puzzle tags to our internal IDs.
 * This includes all themes, contexts, and metadata tags.
 */
export const LICHESS_TAG_TO_ID: Record<string, string> = {
  // Outcomes - Checkmate
  mate: 'mate',
  mateIn1: 'mateIn1',
  mateIn2: 'mateIn2',
  mateIn3: 'mateIn3',
  mateIn4: 'mateIn4',
  mateIn5: 'mateIn5',
  backRankMate: 'backRankMate',
  smotheredMate: 'smotheredMate',
  hookMate: 'hookMate',
  arabianMate: 'arabianMate',
  anastasiasMate: 'anastasiasMate',
  bodensMate: 'bodensMate',
  doubleBishopMate: 'doubleBishopMate',
  dovetailMate: 'dovetailMate',
  operaMate: 'operaMate',
  pillsburysMate: 'pillsburysMate',
  vukovicMate: 'vukovicMate',

  // Outcomes - Endgame
  endgame: 'endgame',
  rookEndgame: 'rookEndgame',
  pawnEndgame: 'pawnEndgame',
  queenEndgame: 'queenEndgame',
  bishopEndgame: 'bishopEndgame',
  knightEndgame: 'knightEndgame',
  queenRookEndgame: 'queenRookEndgame',

  // Outcomes - Material
  crushing: 'winningMaterial',
  hangingPiece: 'hangingPiece',
  trappedPiece: 'trappedPiece',
  promotion: 'promotion',
  underPromotion: 'underPromotion',

  // Outcomes - Defensive
  defensiveMove: 'defensiveMove',
  equality: 'equality',

  // Mechanisms
  fork: 'fork',
  pin: 'pin',
  skewer: 'skewer',
  discoveredAttack: 'discoveredAttack',
  discoveredCheck: 'discoveredCheck',
  doubleCheck: 'doubleCheck',
  exposedKing: 'exposedKing',

  // Enablers
  attraction: 'attraction',
  deflection: 'deflection',
  clearance: 'clearance',
  capturingDefender: 'capturingDefender',
  interference: 'interference',
  overloading: 'overloading',
  xRayAttack: 'xRayAttack',
  intermezzo: 'intermezzo',
  zwischenzug: 'intermezzo', // Alternative name
  sacrifice: 'sacrifice',
  quietMove: 'quietMove',
  advancedPawn: 'advancedPawn',

  // Forcing
  check: 'check',
  zugzwang: 'zugzwang',

  // Context / Metadata
  opening: 'opening',
  middlegame: 'middlegame',
  kingsideAttack: 'kingsideAttack',
  queensideAttack: 'queensideAttack',
  castling: 'castling',
  enPassant: 'enPassant',
  oneMove: 'oneMove',
  short: 'short',
  long: 'long',
  veryLong: 'veryLong',
  master: 'master',
  masterVsMaster: 'masterVsMaster',
  superGM: 'superGM',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all themes at a specific hierarchy level.
 */
export function getThemesByLevel(level: HierarchyLevel): ThemeDefinition[] {
  const allThemes = {
    outcome: OUTCOMES,
    mechanism: MECHANISMS,
    enabler: ENABLERS,
    forcing: FORCING_MOVES,
  };

  return Object.values(allThemes[level]);
}

/**
 * Get a theme definition by its ID.
 */
export function getThemeById(id: string): ThemeDefinition | undefined {
  return (
    OUTCOMES[id] ||
    MECHANISMS[id] ||
    ENABLERS[id] ||
    FORCING_MOVES[id] ||
    CONTEXT_TAGS[id]
  );
}

/**
 * Get a theme definition by its Lichess tag.
 */
export function getThemeByLichessTag(tag: string): ThemeDefinition | undefined {
  const id = LICHESS_TAG_TO_ID[tag];
  if (!id) return undefined;
  return getThemeById(id);
}

/**
 * Get all outcomes a mechanism can lead to.
 */
export function getMechanismOutcomes(mechanismId: string): string[] {
  return MECHANISM_OUTCOMES[mechanismId] || [];
}

/**
 * Get all mechanisms an enabler can set up.
 */
export function getEnablerMechanisms(enablerId: string): string[] {
  return ENABLER_MECHANISMS[enablerId] || [];
}

/**
 * Find valid combinations for a given enabler.
 */
export function getCombinationsForEnabler(enablerId: string): ThemeCombination[] {
  return THEME_COMBINATIONS.filter((combo) => combo.enabler === enablerId);
}

/**
 * Find valid combinations for a given mechanism.
 */
export function getCombinationsForMechanism(mechanismId: string): ThemeCombination[] {
  return THEME_COMBINATIONS.filter((combo) => combo.mechanism === mechanismId);
}

/**
 * Check if a combination of Lichess tags represents a valid compound tactic.
 */
export function isValidCombination(tags: string[]): ThemeCombination | undefined {
  return THEME_COMBINATIONS.find((combo) =>
    combo.lichessTags.every((tag) => tags.includes(tag))
  );
}

/**
 * Parse Lichess theme string into structured theme data.
 * Example: "fork attraction mateIn2 middlegame" -> categorized themes
 */
export function parseThemes(themeString: string): {
  outcomes: string[];
  mechanisms: string[];
  enablers: string[];
  forcing: string[];
  context: string[];
} {
  const themes = themeString.split(' ').filter(Boolean);
  const result = {
    outcomes: [] as string[],
    mechanisms: [] as string[],
    enablers: [] as string[],
    forcing: [] as string[],
    context: [] as string[],
  };

  for (const theme of themes) {
    const id = LICHESS_TAG_TO_ID[theme];
    if (!id) continue;

    if (OUTCOMES[id]) result.outcomes.push(id);
    else if (MECHANISMS[id]) result.mechanisms.push(id);
    else if (ENABLERS[id]) result.enablers.push(id);
    else if (FORCING_MOVES[id]) result.forcing.push(id);
    else if (CONTEXT_TAGS[id]) result.context.push(id);
  }

  return result;
}

/**
 * Get all Lichess tags as an array.
 */
export function getAllLichessTags(): string[] {
  return Object.keys(LICHESS_TAG_TO_ID);
}

/**
 * Get all theme IDs (our internal identifiers).
 */
export function getAllThemeIds(): string[] {
  return [
    ...Object.keys(OUTCOMES),
    ...Object.keys(MECHANISMS),
    ...Object.keys(ENABLERS),
    ...Object.keys(FORCING_MOVES),
    ...Object.keys(CONTEXT_TAGS),
  ];
}
