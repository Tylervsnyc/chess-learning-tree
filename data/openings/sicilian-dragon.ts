// Sicilian Dragon Opening Tree Data
// Fixed grid engine: row/col positions are explicit, never computed.
// row 0 = bottom of screen. col 0 = center trunk.
// lineFrom = visible structural line. unlockedBy = invisible unlock logic.
// RULE: unlockedBy follows completionOrder exactly (each node unlocked by
// the previous one). This guarantees ONE current lesson at all times.
//
// BLACK OPENING: The user is learning to play as Black in the Sicilian Dragon.
// Main line (Yugoslav Attack): 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6
//            6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6 9.O-O-O d5
//            10.exd5 Nxd5 11.Nxc6 bxc6 12.Bd4 e5
//
// GRID LAYOUT (8 nodes):
//   Row 4:                                sd-test-1 (col 0)
//   Row 3:   sd-dev-Qe1 (col -1)     sd-4 (col 0)
//   Row 2:   sd-dev-g4 (col -1)      sd-3 (col 0)
//   Row 1:   sd-dev-Be2 (col -1)     sd-2 (col 0)
//   Row 0:                            sd-1 (col 0)

import type { OpeningNode, OpeningTree } from './ruy-lopez'

export const SICILIAN_DRAGON: OpeningTree = {
  id: 'sicilian-dragon',
  name: 'Sicilian Dragon',
  slug: 'sicilian-dragon',
  description: 'The Dragon — fianchetto the bishop and breathe fire down the long diagonal.',
  color: '#E74C3C',
  colorDark: '#C0392B',
  completionOrder: [
    'sd-1', 'sd-2', 'sd-dev-Be2',
    'sd-3', 'sd-dev-g4', 'sd-4', 'sd-dev-Qe1',
    'sd-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'sd-1',
      name: 'The Sicilian Move',
      moves: ['1.e4 c5', '2.Nf3 d6', '3.d4 cxd4'],
      description: 'The Sicilian move order — c5, d6, and cxd4 to open the c-file.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'sd-2',
      name: 'Enter the Dragon',
      moves: ['4.Nxd4 Nf6', '5.Nc3 g6', '6.Be3 Bg7'],
      description: 'Play g6 and fianchetto the bishop to g7 — the Dragon setup.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'sd-1',
      unlockedBy: 'sd-1',
      side: 'black',
    },
    {
      id: 'sd-3',
      name: 'The Yugoslav Attack',
      moves: ['7.f3 O-O', '8.Qd2 Nc6', '9.O-O-O d5'],
      description: 'Castle, develop the knight, and strike the center with d5.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'sd-2',
      unlockedBy: 'sd-dev-Be2',
      side: 'black',
    },
    {
      id: 'sd-4',
      name: 'The Central Break',
      moves: ['10.exd5 Nxd5', '11.Nxc6 bxc6', '12.Bd4 e5'],
      description: 'Recapture on d5, take back on c6, and push e5 to kick the bishop.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'sd-3',
      unlockedBy: 'sd-dev-g4',
      side: 'black',
    },

    // === DEVIATION: 6.Be2 (instead of 6.Be3) ===
    {
      id: 'sd-dev-Be2',
      name: 'Dev 6.Be2',
      moves: ['6.Be2 Bg7', '7.O-O O-O', '8.Bg5 Nc6'],
      description: 'White plays Be2 instead of Be3 — fianchetto, castle, and develop naturally.',
      type: 'deviation',
      row: 1,
      col: -1,
      lineFrom: 'sd-2',
      unlockedBy: 'sd-2',
      side: 'black',
    },

    // === DEVIATION: 9.g4 (instead of 9.O-O-O) ===
    {
      id: 'sd-dev-g4',
      name: 'Dev 9.g4',
      moves: ['9.g4 Be6', '10.Nxe6 fxe6', '11.O-O-O Ne5'],
      description: 'White pushes g4 aggressively — activate the bishop, recapture, and centralize the knight.',
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'sd-3',
      unlockedBy: 'sd-3',
      side: 'black',
    },

    // === DEVIATION: 10.Qe1 (instead of 10.exd5) ===
    {
      id: 'sd-dev-Qe1',
      name: 'Dev 10.Qe1',
      moves: ['10.Qe1 e5', '11.Nxc6 bxc6', '12.exd5 Nxd5'],
      description: 'White sidesteps with Qe1 — push e5 to grab space, recapture, and centralize.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'sd-4',
      unlockedBy: 'sd-4',
      side: 'black',
    },

    // === LEVEL 1 TEST ===
    {
      id: 'sd-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Dragon main line and handle every deviation.',
      type: 'test',
      row: 4,
      col: 0,
      lineFrom: 'sd-4',
      unlockedBy: 'sd-dev-Qe1',
      side: 'black',
    },
  ],
}
