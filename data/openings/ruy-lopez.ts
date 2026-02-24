// Ruy Lopez Opening Tree Data
// Each node = a lesson teaching ~3 moves
// The tree grows as the user completes lessons

export interface OpeningNode {
  id: string
  name: string
  // Moves covered in this lesson (UCI or SAN)
  moves: string[]
  // Description shown on the node card
  description: string
  // Parent node id (null = root)
  parentId: string | null
  // Is this the main line or a branch?
  isMainLine: boolean
  // Branch direction hint: -1 = left, 0 = center (main), 1 = right
  branchDirection: 0 | -1 | 1
  // Order within siblings (for layout)
  order: number
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
}

export const RUY_LOPEZ: OpeningTree = {
  id: 'ruy-lopez',
  name: 'Ruy Lopez',
  slug: 'ruy-lopez',
  description: 'The Spanish Game — one of the oldest and most classic chess openings.',
  color: '#FF9600',
  colorDark: '#CC7800',
  nodes: [
    // === MAIN LINE ===
    {
      id: 'rl-1',
      name: 'The Opening Moves',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.Bb5'],
      description: 'Set up the Ruy Lopez with 1.e4, develop your knight, and pin with the bishop.',
      parentId: null,
      isMainLine: true,
      branchDirection: 0,
      order: 0,
      side: 'white',
    },
    {
      id: 'rl-2',
      name: 'The Morphy Defense',
      moves: ['3...a6', '4.Ba4 Nf6', '5.O-O'],
      description: 'Black challenges the bishop. White retreats and castles safely.',
      parentId: 'rl-1',
      isMainLine: true,
      branchDirection: 0,
      order: 0,
      side: 'black',
    },
    {
      id: 'rl-3',
      name: 'Building the Center',
      moves: ['5...Be7', '6.Re1 b5', '7.Bb3'],
      description: 'Both sides develop. White rook eyes the e-file, bishop retreats to safety.',
      parentId: 'rl-2',
      isMainLine: true,
      branchDirection: 0,
      order: 0,
      side: 'white',
    },
    {
      id: 'rl-4',
      name: 'The Closed Ruy Lopez',
      moves: ['7...d6', '8.c3 O-O', '9.h3'],
      description: 'The classic Closed Ruy Lopez position. White prepares d4.',
      parentId: 'rl-3',
      isMainLine: true,
      branchDirection: 0,
      order: 0,
      side: 'both',
    },

    // === LEVEL 1 TEST (unlocks after completing the main line) ===
    {
      id: 'rl-test-1',
      name: 'Level 1 Test',
      moves: [],
      description: 'Prove you know the Ruy Lopez — play the full main line and handle deviations.',
      parentId: 'rl-4',
      isMainLine: true,
      branchDirection: 0,
      order: 0,
      side: 'white',
    },

    // === BRANCH: Exchange Variation (off node 1) ===
    {
      id: 'rl-exchange-1',
      name: 'The Exchange',
      moves: ['3...a6', '4.Bxc6 dxc6'],
      description: 'White takes the knight immediately! Doubles Black\'s pawns.',
      parentId: 'rl-1',
      isMainLine: false,
      branchDirection: -1,
      order: 1,
      side: 'white',
    },
    {
      id: 'rl-exchange-2',
      name: 'Exchange Middlegame',
      moves: ['5.O-O f6', '6.d4 Bg4'],
      description: 'Black has the bishop pair. White has better pawn structure.',
      parentId: 'rl-exchange-1',
      isMainLine: false,
      branchDirection: -1,
      order: 0,
      side: 'both',
    },

    // === BRANCH: Berlin Defense (off node 1) ===
    {
      id: 'rl-berlin-1',
      name: 'The Berlin Wall',
      moves: ['3...Nf6', '4.O-O Nxe4'],
      description: 'The solid Berlin Defense — a favorite of world champions.',
      parentId: 'rl-1',
      isMainLine: false,
      branchDirection: 1,
      order: 2,
      side: 'black',
    },
    {
      id: 'rl-berlin-2',
      name: 'Berlin Endgame',
      moves: ['5.d4 Nd6', '6.Bxc6 dxc6', '7.dxe5 Nf5'],
      description: 'The famous Berlin endgame — boring to watch, tricky to play.',
      parentId: 'rl-berlin-1',
      isMainLine: false,
      branchDirection: 1,
      order: 0,
      side: 'both',
    },

    // === PUNISH: 2...f6?? (off node 1, after 2.Nf3) ===
    {
      id: 'rl-punish-f6',
      name: 'Punishing f6',
      moves: ['2...f6??', '3.Nxe5! fxe5', '4.Qh5+ g6', '5.Qxe5+'],
      description: 'Black defends e5 with f6 — a natural-looking blunder. Sacrifice the knight, win the rook.',
      parentId: 'rl-1',
      isMainLine: false,
      branchDirection: -1,
      order: 3,
      side: 'white',
    },

    // === BRANCH: Open Ruy Lopez (off node 2, after 5.O-O) ===
    {
      id: 'rl-open-1',
      name: 'The Pawn Grab',
      moves: ['5...Nxe4', '6.d4 b5', '7.Bb3 d5', '8.dxe5 Be6'],
      description: 'Black grabs the e4 pawn — but it wasn\'t free. White blows open the center.',
      parentId: 'rl-2',
      isMainLine: false,
      branchDirection: -1,
      order: 1,
      side: 'white',
    },

    // === BRANCH: Marshall Attack (off node 3) ===
    {
      id: 'rl-marshall-1',
      name: 'The Marshall Gambit',
      moves: ['7...O-O', '8.c3 d5'],
      description: 'Black sacrifices a pawn for a fierce attack on White\'s king!',
      parentId: 'rl-3',
      isMainLine: false,
      branchDirection: 1,
      order: 1,
      side: 'black',
    },
  ],
}
