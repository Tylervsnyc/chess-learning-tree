// Scotch Game Opening Tree Data — v2 (Predict/Reveal format)
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
//
// WHITE OPENING: The user is learning to play as White.
// Main line: 1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7
//            7.Qe2 Nd5 8.c4 Ba6 9.b3 g6 10.f4 d6 11.Qf2 Nf6 12.Be2
//            12...dxe5 13.O-O Ne4 14.Qe1 O-O-O 15.Nc3 Nc5 16.fxe5 Bg7
//            17.Na4 Nxa4 18.Bg4+ Kb8 19.bxa4 Qxe5 20.Rb1+ Ka8 21.Bf3
//
// 3 White moves per lesson.
// L1: 3 main + 2 deviations + 1 test = 6 nodes.
// L2: 3 main + 2 deviations + 1 test = 6 nodes.
//
// GRID LAYOUT:
//   Row 7: sc-test-2 (col 0)
//   Row 6: sc-6 (col 0)
//   Row 5: sc-dev-nc5 (col -1)   sc-5 (col 0)   sc-dev-qc5 (col 1)
//   Row 4: sc-4 (col 0)
//   Row 3: sc-test-1 (col 0)
//   Row 2: sc-3 (col 0)
//   Row 1: sc-dev-nb6 (col -1)   sc-2 (col 0)   sc-dev-ooo (col 1)
//   Row 0: sc-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SCOTCH_GAME: OpeningTree = {
  id: 'scotch',
  name: 'Scotch Game',
  slug: 'scotch',
  description: 'Open the center with d4 and seize the initiative from move 3.',
  color: '#A855F7',
  colorDark: '#7C3AED',
  completionOrder: [
    'sc-1', 'sc-2', 'sc-dev-nb6', 'sc-dev-ooo',
    'sc-3', 'sc-test-1',
    'sc-4', 'sc-5', 'sc-dev-nc5', 'sc-dev-qc5',
    'sc-6', 'sc-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sc-1',
      name: 'The Scotch Gambit',
      moves: ['1.e4 e5', '2.Nf3 Nc6', '3.d4 exd4', '4.Nxd4 Nf6', '5.Nxc6 bxc6', '6.e5'],
      description: 'Recapture with the knight, trade on c6, and push e5 to seize space.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'sc-2',
      name: 'The Center Push',
      moves: ['6...Qe7', '7.Qe2 Nd5', '8.c4 Ba6', '9.b3'],
      description: 'Meet the queen with Qe2, kick the knight with c4, and solidify with b3.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sc-1',
      unlockedBy: 'sc-1',
      side: 'white',
    },
    {
      id: 'sc-3',
      name: 'The Buildup',
      moves: ['9...g6', '10.f4 d6', '11.Qf2 Nf6', '12.Be2'],
      description: 'Push f4 to support e5, reposition the queen, and develop the bishop.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sc-2',
      unlockedBy: 'sc-dev-ooo',
      side: 'white',
    },

    // === DEVIATION: 8...Nb6 instead of 8...Ba6 (col -1, row 1) ===
    {
      id: 'sc-dev-nb6',
      name: 'If 8...Nb6',
      moves: ['8...Nb6', '9.Nc3 Qe6', '10.Qe4 g6', '11.Bd3'],
      description: 'Black retreats the knight to b6. Develop Nc3, centralize the queens, and plant Bd3.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'sc-2',
      unlockedBy: 'sc-2',
      side: 'white',
    },

    // === DEVIATION: 9...O-O-O instead of 9...g6 (col 1, row 1) ===
    {
      id: 'sc-dev-ooo',
      name: 'If 9...O-O-O',
      moves: ['9...O-O-O', '10.g3 g5', '11.Bb2 Bg7', '12.Nd2'],
      description: 'Black castles queenside. Fianchetto prep with g3, develop Bb2, and bring in the knight.',
      type: 'deviation',
      row: 1,
      col: 1,
      lineFrom: 'sc-2',
      unlockedBy: 'sc-dev-nb6',
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'sc-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the Scotch — play the main line and handle every deviation.',
      type: 'test',
      row: 3,
      col: 0,
      lineFrom: 'sc-3',
      unlockedBy: 'sc-3',
      side: 'white',
    },

    // ═══════════════════════════════════════════════════════════
    // LEVEL 2
    // ═══════════════════════════════════════════════════════════

    // === MAIN LINE L2 (center trunk, col 0) ===
    {
      id: 'sc-4',
      name: 'Castle & Regroup',
      moves: ['12...dxe5', '13.O-O Ne4', '14.Qe1 O-O-O', '15.Nc3'],
      description: 'Castle kingside, retreat the queen to e1, and develop the knight to c3.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'sc-test-1',
      unlockedBy: 'sc-test-1',
      side: 'white',
    },
    {
      id: 'sc-5',
      name: 'The Knight Swap',
      moves: ['15...Nc5', '16.fxe5 Bg7', '17.Na4 Nxa4', '18.Bg4+'],
      description: 'Recapture on e5, trade knights on a4, and check with the bishop.',
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'sc-4',
      unlockedBy: 'sc-4',
      side: 'white',
    },
    {
      id: 'sc-6',
      name: 'The Rook Lift',
      moves: ['18...Kb8', '19.bxa4 Qxe5', '20.Rb1+ Ka8', '21.Bf3'],
      description: 'Recapture on a4, check with the rook, and activate the bishop on f3.',
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'sc-5',
      unlockedBy: 'sc-dev-qc5',
      side: 'white',
    },

    // === DEVIATION: 14...Nc5 instead of 14...O-O-O (col -1, row 5) ===
    {
      id: 'sc-dev-nc5',
      name: 'If 14...Nc5',
      moves: ['14...Nc5', '15.Bb2 O-O-O', '16.fxe5 Bg7', '17.Nd2'],
      description: 'Black retreats the knight early. Develop the bishop, recapture, and bring in the knight.',
      type: 'deviation',
      row: 5,
      col: -1,
      lineFrom: 'sc-5',
      unlockedBy: 'sc-5',
      side: 'white',
    },

    // === DEVIATION: 14...Qc5+ instead of 14...O-O-O (col 1, row 5) ===
    {
      id: 'sc-dev-qc5',
      name: 'If 14...Qc5+',
      moves: ['14...Qc5+', '15.Kh1 Qd4', '16.Bf3 Qxa1', '17.Qxe4'],
      description: 'Black checks and grabs the rook. Sidestep, activate the bishop, and win the knight.',
      type: 'deviation',
      row: 5,
      col: 1,
      lineFrom: 'sc-5',
      unlockedBy: 'sc-dev-nc5',
      side: 'white',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'sc-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Play the full Scotch middlegame — main line and handle both deviations.',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'sc-6',
      unlockedBy: 'sc-6',
      side: 'white',
    },
  ],
}
