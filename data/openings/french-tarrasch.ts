// French Tarrasch Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black in the French Tarrasch.
// Main line: 1.e4 e6 2.d4 d5 3.Nd2 c5
//            4.exd5 Qxd5 5.Ngf3 cxd4 6.Bc4 Qd6
//            7.O-O Nf6 8.Nb3 Nc6 9.Nbxd4 Nxd4
//            10.Nxd4 a6 11.Re1 Qc7 12.Bb3 Bd6
//
// GRID LAYOUT (8 nodes):
//   Row 5:                                ft-test-1 (col 0)
//   Row 4:                                ft-4 (col 0)
//   Row 3:   ft-dev-Qe2 (col -1)     ft-3 (col 0)
//   Row 2:   ft-dev-dc5 (col -1)     ft-2 (col 0)
//   Row 1:   ft-dev-c3 (col -1)
//   Row 0:                            ft-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const FRENCH_TARRASCH: OpeningTree = {
  id: 'french-tarrasch',
  name: 'French Tarrasch',
  slug: 'french-tarrasch',
  description: 'Meet 3.Nd2 with c5, recapture on d5 with the queen, and develop piece by piece into a solid position.',
  color: '#F59E0B',
  colorDark: '#D97706',
  completionOrder: [
    'ft-1', 'ft-2', 'ft-dev-dc5',
    'ft-3', 'ft-dev-Qe2', 'ft-4', 'ft-dev-c3', 'ft-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'ft-1',
      name: 'The Tarrasch Setup',
      moves: ['1.e4 e6', '2.d4 d5', '3.Nd2 c5'],
      description: 'Play e6, d5, and strike with c5 against the Tarrasch Variation.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'ft-2',
      name: 'Queen to the Center',
      moves: ['4.exd5 Qxd5', '5.Ngf3 cxd4', '6.Bc4 Qd6'],
      description: 'Recapture on d5 with the queen, break the center open, and dodge the bishop.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'ft-1',
      unlockedBy: 'ft-1',
      side: 'black',
    },
    {
      id: 'ft-3',
      name: 'Knights and Exchanges',
      moves: ['7.O-O Nf6', '8.Nb3 Nc6', '9.Nbxd4 Nxd4'],
      description: 'Develop both knights, reclaim the d4 pawn, and simplify the position.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'ft-2',
      unlockedBy: 'ft-dev-dc5',
      side: 'black',
    },
    {
      id: 'ft-4',
      name: 'Solid Development',
      moves: ['10.Nxd4 a6', '11.Re1 Qc7', '12.Bb3 Bd6'],
      description: 'Secure the queenside, relocate the queen, and develop the bishop.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'ft-3',
      unlockedBy: 'ft-dev-Qe2',
      side: 'black',
    },

    // === DEVIATIONS ===
    {
      id: 'ft-dev-dc5',
      name: 'Dev 5.dxc5',
      moves: ['5.dxc5 Bxc5', '6.Ngf3 Nf6', '7.Bc4 Qc6'],
      description: 'White captures on c5 — take back with the bishop and develop naturally.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'ft-2',
      unlockedBy: 'ft-2',
      side: 'black',
    },
    {
      id: 'ft-dev-Qe2',
      name: 'Dev 7.Qe2',
      moves: ['7.Qe2 Nf6', '8.Nb3 Nc6', '9.Bg5 a6'],
      description: 'White plays Qe2 instead of castling — develop and prepare queenside expansion.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'ft-3',
      unlockedBy: 'ft-3',
      side: 'black',
    },
    {
      id: 'ft-dev-c3',
      name: 'Dev 11.c3',
      moves: ['11.c3 Qc7', '12.Qe2 Bd6', '13.h3 O-O'],
      description: 'White plays c3 instead of Re1 — relocate the queen and castle safely.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'ft-4',
      unlockedBy: 'ft-4',
      side: 'black',
    },

    // === LEVEL TEST ===
    {
      id: 'ft-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Prove you know the French Tarrasch — main line and all deviations.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'ft-4',
      unlockedBy: 'ft-dev-c3',
      side: 'black',
    },
  ] as OpeningNode[],
}
