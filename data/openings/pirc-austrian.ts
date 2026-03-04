// Pirc Defense — Austrian Attack Variation
// Standalone tree for the Austrian Attack (4.f4) line
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black.
// Main line: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Nc6 7.O-O e5 8.d5 Nd4 9.fxe5 dxe5
//
// GRID LAYOUT (10 lessons):
//   Row 6:                             pa-test-1 (col 0)
//   Row 5:                             pa-6 (col 0)
//   Row 4:                    pa-punish-Nxe5 (col 1)   pa-5 (col 0)
//   Row 3:  pa-punish-fxe5 (col -1)   pa-4 (col 0)
//   Row 2:  pa-punish-e5 (col -1)     pa-3 (col 0)
//   Row 1:                             pa-2 (col 0)
//   Row 0:                             pa-1 (col 0)
//
// ALL lines are purely horizontal or vertical. No L-shapes, no diagonals.

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const PIRC_AUSTRIAN: OpeningTree = {
  id: 'pirc-austrian',
  name: 'Austrian Attack',
  slug: 'pirc-austrian',
  description: 'The Austrian Attack — White goes all-in with f4. Learn how to strike back with e5!',
  color: '#EC4D63',
  colorDark: '#D83A52',
  completionOrder: [
    'pa-1', 'pa-2', 'pa-punish-e5', 'pa-3',
    'pa-4', 'pa-punish-fxe5', 'pa-5', 'pa-punish-Nxe5',
    'pa-6', 'pa-test-1',
    'pa-7', 'pa-8', 'pa-9',
    'pa-var-7', 'pa-var-8', 'pa-var-9', 'pa-var-10',
    'pa-var-11', 'pa-var-12', 'pa-test-2',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'pa-1',
      name: 'The Austrian Setup',
      moves: ['1.e4 d6', '2.d4 Nf6', '3.Nc3 g6'],
      description: 'The Pirc foundation — d6, Nf6, g6. White will respond with aggressive f4.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'pa-2',
      name: 'Fianchetto & Castle',
      moves: ['4.f4 Bg7', '5.Nf3 O-O'],
      description: 'White pushes f4 aggressively. Fianchetto and castle — stay calm and focused.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'pa-1',
      unlockedBy: 'pa-1',
      side: 'black',
    },
    {
      id: 'pa-3',
      name: 'Develop & Castle',
      moves: ['6.Bd3 Nc6', '7.O-O'],
      description: 'White develops to d3 and castles. Centralize your knight — the counterattack is coming.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'pa-2',
      unlockedBy: 'pa-punish-e5',
      side: 'black',
    },

    // === PUNISH: White plays e5?! prematurely (row 2, col -1) ===
    {
      id: 'pa-punish-e5',
      name: 'Punish e5?!',
      moves: ['7.e5?! dxe5', '8.fxe5 Nd5!'],
      description: 'White overextends before castling — dxe5 and Nd5 punishes immediately.',
      type: 'punish',
      row: 2,
      col: -1,
      lineFrom: 'pa-2',
      unlockedBy: 'pa-2',
      side: 'black',
    },

    {
      id: 'pa-4',
      name: 'Strike with e5!',
      moves: ['7...e5!', '8.d5 Nd4'],
      description: "The key counterattack — e5 hits White's center. White plays d5, and your Nd4 is fantastic.",
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'pa-3',
      unlockedBy: 'pa-3',
      side: 'black',
    },

    // === PUNISH: White plays fxe5? instead of d5 (row 3, col -1) ===
    {
      id: 'pa-punish-fxe5',
      name: 'Punish fxe5?',
      moves: ['8.fxe5? dxe5', '9.d5 Nd4!'],
      description: 'If White recaptures with the f-pawn instead of d5, you still get Nd4 with a great position.',
      type: 'punish',
      row: 3,
      col: -1,
      lineFrom: 'pa-3',
      unlockedBy: 'pa-4',
      side: 'black',
    },

    {
      id: 'pa-5',
      name: 'The Central Fork',
      moves: ['9.fxe5 dxe5'],
      description: 'White clears the center — your Nd4 and e5 pawn give you active, well-coordinated pieces.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'pa-4',
      unlockedBy: 'pa-punish-fxe5',
      side: 'black',
    },

    // === PUNISH: White plays Nxe5? (row 4, col 1) ===
    {
      id: 'pa-punish-Nxe5',
      name: 'Punish Nxe5?',
      moves: ['8.Nxe5? Nxe5', '9.fxe5 Nd7'],
      description: 'If White greedily takes e5 with the knight, trade it off and reroute to d7.',
      type: 'punish',
      row: 4,
      col: 1,
      lineFrom: 'pa-4',
      unlockedBy: 'pa-5',
      side: 'black',
    },

    {
      id: 'pa-6',
      name: 'Open Lines',
      moves: ['10.Bg5 c6', '11.dxc6 bxc6'],
      description: 'White pins your knight — c6 challenges the pawn chain. After bxc6 your position is active.',
      type: 'branch',
      row: 5,
      col: 0,
      lineFrom: 'pa-5',
      unlockedBy: 'pa-punish-Nxe5',
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'pa-test-1',
      name: 'Austrian Test',
      moves: [],
      description: 'Prove you know the Austrian Attack — play the main line and handle every variation.',
      type: 'test',
      row: 6,
      col: 0,
      lineFrom: 'pa-6',
      unlockedBy: 'pa-6',
      side: 'black',
    },

    // ═══════════════════════════════════════════════════════════
    // LEVEL 2 — Austrian Attack (6.e5 Nfd7 7.Be2 c5 line)
    // Main line: 4.f4 Bg7 5.Nf3 O-O 6.e5 Nfd7 7.Be2 c5 8.Be3 cxd4 9.Nxd4 Nc6
    // ═══════════════════════════════════════════════════════════

    // === L2 MAIN LINE (center trunk, col 0) ===
    {
      id: 'pa-7',
      name: 'Pirc Foundations',
      moves: ['1.e4 d6', '2.d4 Nf6', '3.Nc3 g6'],
      description: 'The Pirc setup — d6, Nf6, g6. Let White build a center, then undermine it.',
      type: 'main',
      row: 7,
      col: 0,
      lineFrom: 'pa-6',
      unlockedBy: 'pa-test-1',
      side: 'black',
    },
    {
      id: 'pa-8',
      name: 'Survive the Storm',
      moves: ['4.f4 Bg7', '5.Nf3 O-O', '6.e5 Nfd7'],
      description: 'White pushes f4 and e5. Stay calm — fianchetto, castle, retreat the knight.',
      type: 'main',
      row: 8,
      col: 0,
      lineFrom: 'pa-7',
      unlockedBy: 'pa-7',
      side: 'black',
    },
    {
      id: 'pa-9',
      name: 'Counter ...c5!',
      moves: ['7.Be2 c5', '8.Be3 cxd4', '9.Nxd4 Nc6'],
      description: 'Strike back with ...c5! Trade the center pawn and develop Nc6.',
      type: 'main',
      row: 9,
      col: 0,
      lineFrom: 'pa-8',
      unlockedBy: 'pa-8',
      side: 'black',
    },

    // === L2 BRANCH LINES (col 1) ===
    {
      id: 'pa-var-7',
      name: '2...g6 Early',
      moves: ['g6', 'Bg7', 'Nf6', 'Nbd7'],
      description: 'Play 2...g6 early — fianchetto first, delay Nf6.',
      type: 'branch',
      row: 8,
      col: 1,
      lineFrom: 'pa-7',
      unlockedBy: 'pa-9',
      side: 'black',
    },
    {
      id: 'pa-var-8',
      name: 'Caro Setup',
      moves: ['c6', 'd5', 'dxe4', 'Bf5'],
      description: 'Transpose into a Caro-Kann-like setup with c6, d5, and Bf5.',
      type: 'branch',
      row: 9,
      col: 1,
      lineFrom: 'pa-7',
      unlockedBy: 'pa-var-7',
      side: 'black',
    },
    {
      id: 'pa-var-9',
      name: '2...e5 Counter',
      moves: ['e5', 'exd4', 'Be7', 'Nf6'],
      description: "Strike immediately with 2...e5 — challenge White's center head-on.",
      type: 'branch',
      row: 10,
      col: 1,
      lineFrom: 'pa-9',
      unlockedBy: 'pa-var-8',
      side: 'black',
    },
    {
      id: 'pa-var-10',
      name: 'Sicilian Twist',
      moves: ['c5', 'd6', 'a6', 'cxd4'],
      description: 'Play 1...c5 — a Sicilian approach against the Austrian Attack.',
      type: 'branch',
      row: 12,
      col: 1,
      lineFrom: 'pa-9',
      unlockedBy: 'pa-var-9',
      side: 'black',
    },
    {
      id: 'pa-var-11',
      name: 'Solid ...e6',
      moves: ['e6', 'Nbd7', 'a6', 'Be7'],
      description: 'A solid approach — play e6, develop Nbd7, and prepare a flexible center.',
      type: 'branch',
      row: 14,
      col: 1,
      lineFrom: 'pa-9',
      unlockedBy: 'pa-var-10',
      side: 'black',
    },
    {
      id: 'pa-var-12',
      name: '3...Nc6 Active',
      moves: ['Nc6', 'Bg7', 'd5', 'Ne4'],
      description: 'Develop the knight to c6 early — more active, but riskier against f5.',
      type: 'branch',
      row: 16,
      col: 1,
      lineFrom: 'pa-9',
      unlockedBy: 'pa-var-11',
      side: 'black',
    },

    // === LEVEL 2 TEST ===
    {
      id: 'pa-test-2',
      name: 'Lvl 2 Test',
      moves: [],
      description: 'Master the 6.e5 line — play the full main line and every variation.',
      type: 'test',
      row: 17,
      col: 0,
      lineFrom: 'pa-9',
      unlockedBy: 'pa-var-12',
      side: 'black',
    },
  ],
}
