// Witty Alien — Alien Gambit (main line) Opening Tree Data
// Bulgarian streamer Witty_Alien's signature knight sacrifice vs the Caro-Kann.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Every move here is NOT #1 in the masters database — this is a meme/trick weapon.
// We use the Lichess all-games winrate (60% White over 150k+ games at 6.Nxf7)
// and the cited Lichess study annotations as our authority. Lean INTO the
// "trick weapon" framing — this is a streamer's sacrifice, not master theory.
//
// Sources: research/alien-gambit-{ishaan,mikewolf,captainamogus,oneandonly}.pgn
//
// WHITE OPENING: The user plays as White.
// Main line: 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6 5.Ng5 h6
//            6.Nxf7!! Kxf7 7.Nf3 Nbd7 8.Bd3 e6 9.O-O Bd6
//            10.Re1 Re8 11.Ne5+ Bxe5 12.dxe5 Nd5 13.Qh5+
//            Kg8 14.Bxh6!! gxh6 15.Qg6+ Kh8 16.Qh7#
//
// GRID LAYOUT (11 lessons):
//   Row 7:   wa-test-1 (col 0)
//   Row 6:   wa-7 (col 0)
//   Row 5:   wa-6 (col 0)              wa-dev-c5 (col -1)
//   Row 4:   wa-5 (col 0)              wa-dev-Bf5 (col -1)
//   Row 3:   wa-4 (col 0)              wa-dev-Bg4 (col -1)
//   Row 2:   wa-3 (col 0)
//   Row 1:   wa-2 (col 0)
//   Row 0:   wa-1 (col 0)
//
// All deviations trigger AFTER wa-3 (after 7.Nf3) when Black chooses a different
// move than 7…Nbd7 — Bg4 (pin attempt), Bf5 (develop), c5 (the actual refutation).
// We visually pair each deviation with a main-line row, but all branch from wa-3.
//
// All lines are purely horizontal or vertical. No diagonals.

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN: OpeningTree = {
  id: 'witty-alien',
  name: 'Alien Gambit',
  slug: 'witty-alien',
  description: "Witty_Alien's trick weapon vs the Caro-Kann — sacrifice the knight on f7, drag the king out, attack.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'wa-1', 'wa-2', 'wa-3',
    'wa-dev-Bg4', 'wa-4',
    'wa-dev-Bf5', 'wa-5',
    'wa-dev-c5', 'wa-6',
    'wa-7', 'wa-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'wa-1',
      name: 'The Setup',
      moves: ['1.e4 c6', '2.d4 d5', '3.Nc3 dxe4'],
      description: 'Enter the Caro-Kann main line. Knight to c3 invites Black to capture.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-2',
      name: 'Bait the Knight',
      moves: ['4.Nxe4 Nf6', '5.Ng5 h6'],
      description: "Recapture, jump to g5 attacking f7. Black thinks h6 just kicks the knight away.",
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'wa-1',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-3',
      name: 'The Sacrifice',
      moves: ['6.Nxf7!! Kxf7', '7.Nf3'],
      description: "The signature move. Knight for two pawns and an exposed king.",
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'wa-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-4',
      name: 'Load the Diagonal',
      moves: ['7…Nbd7', '8.Bd3 e6', '9.O-O'],
      description: 'Develop with tempo, aim Bd3 at h7, castle into the attack.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-5',
      name: 'Open the f-file',
      moves: ['9…Bd6', '10.Re1 Re8', '11.Ne5+'],
      description: 'Rook on e1, knight check forces a critical decision.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'wa-4',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-6',
      name: 'Win the Tempo',
      moves: ['11…Bxe5', '12.dxe5 Nd5', '13.Qh5+'],
      description: "After Bxe5, you recapture with the pawn and the queen joins with check.",
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'wa-5',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-7',
      name: 'The Bxh6 Brilliancy',
      moves: ['13…Kg8', '14.Bxh6!! gxh6', '15.Qg6+ → mate'],
      description: "The don't-boo-spam-the-brilliant-emote moment. Find the mating net.",
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'wa-6',
      unlockedBy: null,
      side: 'white',
    },

    // === DEVIATIONS (col -1) — all branch from wa-3 (after 7.Nf3) ===
    {
      id: 'wa-dev-Bg4',
      name: 'If Bg4',
      moves: ['7…Bg4', '8.Ne5+ Ke8', '9.Nxg4'],
      description: 'Black tries to pin your knight. Jump to e5 with check — Black has to move the king and you win the bishop.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'wa-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-dev-Bf5',
      name: 'If Bf5',
      moves: ['7…Bf5', '8.Ne5+ Kg8', '9.Bc4+ e6', '10.g4! → g6#'],
      description: 'Black develops the bishop. Chase it across the board with a pawn storm that ends in a pawn mate.',
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'wa-4',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wa-dev-c5',
      name: 'If c5',
      moves: ['7…c5', '8.c3 Nc6', '9.Bd3'],
      description: "The actual refutation. Give back the piece, keep developing — equal but practical chances.",
      type: 'deviation',
      row: 5,
      col: -1,
      lineFrom: 'wa-5',
      unlockedBy: null,
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'wa-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Alien Gambit — main line and every deviation.',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'wa-7',
      unlockedBy: null,
      side: 'white',
    },
  ],
}
