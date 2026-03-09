// Ruy Lopez Opening Tree Data — v2 (Predict/Reveal format)
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7
//            6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Na5 10.Bc2 c5 11.d4 Qc7 12.Nbd2
//
// 3 White moves per lesson. 4 main + 4 deviations + 1 test = 9 nodes.
//
// GRID LAYOUT:
//   Row 4: rl-test-1 (col 0)
//   Row 3: rl-4 (col 0)              rl-dev-Re8 (col -1)
//   Row 2: rl-3 (col 0)
//   Row 1: rl-dev-f5 (col -1)   rl-2 (col 0)   rl-dev-d6 (col 1)   rl-dev-b5 (col 2)
//   Row 0: rl-1 (col 0)

export type NodeType = 'main' | 'branch' | 'deviation' | 'test'

export interface OpeningNode {
  id: string
  name: string
  moves: string[]
  description: string
  type: NodeType
  row: number
  col: number
  lineFrom: string | null
  unlockedBy: string | string[] | null
  side: 'white' | 'black' | 'both'
}

export interface OpeningTree {
  id: string
  name: string
  slug: string
  description: string
  color: string
  colorDark: string
  nodes: OpeningNode[]
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
    'rl-1', 'rl-2', 'rl-dev-f5', 'rl-dev-d6', 'rl-dev-b5',
    'rl-3', 'rl-4', 'rl-dev-Re8', 'rl-test-1',
  ],
  nodes: [

    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'rl-1',
      name: 'Opening Moves',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.Bb5'],
      description: 'Control the center, develop your knight, and pin with the bishop.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'rl-2',
      name: 'Morphy Defense',
      moves: ['3...a6', '4.Ba4 Nf6', '5.O-O Be7', '6.Re1'],
      description: 'Black challenges the bishop. Retreat, castle, and put the rook on e1.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'rl-1',
      unlockedBy: 'rl-1',
      side: 'white',
    },
    {
      id: 'rl-3',
      name: 'Closed Setup',
      moves: ['6...b5', '7.Bb3 d6', '8.c3 O-O', '9.h3'],
      description: 'Tuck the bishop away, build a pawn center, and make a luft.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'rl-2',
      unlockedBy: 'rl-dev-b5',
      side: 'white',
    },
    {
      id: 'rl-4',
      name: 'The Chigorin',
      moves: ['9...Na5', '10.Bc2 c5', '11.d4 Qc7', '12.Nbd2'],
      description: 'Save the bishop, strike the center with d4, and develop the last piece.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'rl-3',
      unlockedBy: 'rl-3',
      side: 'white',
    },

    // === MINOR VARIATIONS (deviations) ===
    {
      id: 'rl-dev-f5',
      name: 'If 3...f5',
      moves: ['3...f5', '4.Nc3'],
      description: 'Black pushes f5 early. Develop the knight and win the pawn back.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'rl-2',
      unlockedBy: 'rl-2',
      side: 'white',
    },
    {
      id: 'rl-dev-d6',
      name: 'If 4...d6',
      moves: ['4...d6', '5.O-O'],
      description: 'Black plays the solid d6. Just castle and keep developing.',
      type: 'deviation',
      row: 1,
      col: 1,
      lineFrom: 'rl-2',
      unlockedBy: 'rl-dev-f5',
      side: 'white',
    },
    {
      id: 'rl-dev-b5',
      name: 'If 5...b5',
      moves: ['5...b5', '6.Bb3'],
      description: 'Black chases the bishop before developing. Retreat and keep building.',
      type: 'deviation',
      row: 1,
      col: 2,
      lineFrom: 'rl-2',
      unlockedBy: 'rl-dev-d6',
      side: 'white',
    },
    {
      id: 'rl-dev-Re8',
      name: 'If 9...Re8',
      moves: ['9...Re8', '10.d4'],
      description: 'Black keeps the knight on c6. Strike the center immediately with d4.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'rl-4',
      unlockedBy: 'rl-4',
      side: 'white',
    },

    // === LEVEL TEST ===
    {
      id: 'rl-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Ruy Lopez main line from memory.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'rl-4',
      unlockedBy: 'rl-dev-Re8',
      side: 'white',
    },
  ],
}
