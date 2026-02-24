// Ruy Lopez Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.

export type NodeType = 'main' | 'branch' | 'punish' | 'test'

export interface OpeningNode {
  id: string
  name: string
  // Moves covered in this lesson (SAN notation)
  moves: string[]
  // Description shown on the node card
  description: string
  // Node type determines color and icon
  type: NodeType
  // Grid row (0 = bottom of screen, grows upward)
  row: number
  // Grid column (0 = center trunk, negative = left, positive = right)
  col: number
  // Which node to draw a visible line FROM (null = root, no line)
  lineFrom: string | null
  // Which node(s) must be completed to reveal this node (null = always visible)
  unlockedBy: string | string[] | null
  // Side to play: 'white' | 'black' | 'both'
  side: 'white' | 'black' | 'both'
}

export interface OpeningTree {
  id: string
  name: string
  slug: string
  description: string
  // Color for the opening's theme
  color: string
  colorDark: string
  nodes: OpeningNode[]
  // Pedagogically-ordered completion sequence
  completionOrder: string[]
}

export const RUY_LOPEZ: OpeningTree = {
  id: 'ruy-lopez',
  name: 'Ruy Lopez',
  slug: 'ruy-lopez',
  description: 'The Spanish Game — one of the oldest and most classic chess openings.',
  color: '#FF9600',
  colorDark: '#CC7800',
  completionOrder: [
    'rl-1', 'rl-2', 'rl-3', 'rl-punish-f6', 'rl-exchange-1',
    'rl-exchange-2', 'rl-berlin-1', 'rl-berlin-2', 'rl-open-1',
    'rl-4', 'rl-marshall-1', 'rl-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'rl-1',
      name: 'The Opening Moves',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.Bb5'],
      description: 'Set up the Ruy Lopez with 1.e4, develop your knight, and pin with the bishop.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'rl-2',
      name: 'The Morphy Defense',
      moves: ['3...a6', '4.Ba4 Nf6', '5.O-O'],
      description: 'Black challenges the bishop. White retreats and castles safely.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'rl-1',
      unlockedBy: 'rl-1',
      side: 'black',
    },
    {
      id: 'rl-3',
      name: 'Building the Center',
      moves: ['5...Be7', '6.Re1 b5', '7.Bb3'],
      description: 'Both sides develop. White rook eyes the e-file, bishop retreats to safety.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'rl-2',
      unlockedBy: 'rl-2',
      side: 'white',
    },
    {
      id: 'rl-4',
      name: 'The Closed Ruy Lopez',
      moves: ['7...d6', '8.c3 O-O', '9.h3'],
      description: 'The classic Closed Ruy Lopez position. White prepares d4.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'rl-3',
      unlockedBy: 'rl-open-1',
      side: 'both',
    },

    // === PUNISH: 2...f6?? (same row as main-1, col 1) ===
    {
      id: 'rl-punish-f6',
      name: 'Punishing f6',
      moves: ['2...f6??', '3.Nxe5! fxe5', '4.Qh5+ g6', '5.Qxe5+'],
      description: 'Black defends e5 with f6 — a natural-looking blunder. Sacrifice the knight, win the rook.',
      type: 'punish',
      row: 0,
      col: 1,
      lineFrom: 'rl-1',
      unlockedBy: 'rl-3',
      side: 'white',
    },

    // === EXCHANGE VARIATION (same row as main-2, col -1) ===
    {
      id: 'rl-exchange-1',
      name: 'The Exchange',
      moves: ['3...a6', '4.Bxc6 dxc6'],
      description: 'White takes the knight immediately! Doubles Black\'s pawns.',
      type: 'branch',
      row: 1,
      col: -1,
      lineFrom: 'rl-2',
      unlockedBy: 'rl-punish-f6',
      side: 'white',
    },

    // === EXCHANGE MIDDLEGAME / PUNISH 2 (above exchange-1, col -1) ===
    {
      id: 'rl-exchange-2',
      name: 'Exchange Middlegame',
      moves: ['5.O-O f6', '6.d4 Bg4'],
      description: 'Black has the bishop pair. White has better pawn structure.',
      type: 'punish',
      row: 2,
      col: -1,
      lineFrom: 'rl-exchange-1',
      unlockedBy: 'rl-exchange-1',
      side: 'both',
    },

    // === BERLIN DEFENSE (same row as main-2, col 1) ===
    {
      id: 'rl-berlin-1',
      name: 'The Berlin Wall',
      moves: ['3...Nf6', '4.O-O Nxe4'],
      description: 'The solid Berlin Defense — a favorite of world champions.',
      type: 'branch',
      row: 1,
      col: 1,
      lineFrom: 'rl-2',
      unlockedBy: 'rl-exchange-2',
      side: 'black',
    },

    // === BERLIN ENDGAME (above berlin-1, col 1) ===
    {
      id: 'rl-berlin-2',
      name: 'Berlin Endgame',
      moves: ['5.d4 Nd6', '6.Bxc6 dxc6', '7.dxe5 Nf5'],
      description: 'Chase the knight, trade into the famous Berlin Endgame.',
      type: 'branch',
      row: 2,
      col: 1,
      lineFrom: 'rl-berlin-1',
      unlockedBy: 'rl-berlin-1',
      side: 'white',
    },

    // === OPEN RUY LOPEZ (branches from rl-2 after 5.O-O, col 2) ===
    {
      id: 'rl-open-1',
      name: 'The Pawn Grab',
      moves: ['5...Nxe4'],
      description: 'Black grabs the e4 pawn — the Open Ruy Lopez. White gets it back with interest.',
      type: 'branch',
      row: 2,
      col: 2,
      lineFrom: 'rl-2',
      unlockedBy: 'rl-berlin-2',
      side: 'white',
    },

    // === MARSHALL ATTACK (same row as main-4, col 1) ===
    {
      id: 'rl-marshall-1',
      name: 'The Marshall Gambit',
      moves: ['7...O-O', '8.c3 d5'],
      description: 'Black sacrifices a pawn for a fierce attack on White\'s king!',
      type: 'branch',
      row: 3,
      col: 1,
      lineFrom: 'rl-4',
      unlockedBy: 'rl-4',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'rl-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Ruy Lopez — play the full main line and handle deviations.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'rl-4',
      unlockedBy: 'rl-marshall-1',
      side: 'both',
    },
  ],
}
