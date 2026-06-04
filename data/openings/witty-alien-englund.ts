// Witty Alien — Englund Gambit (...d6 regaining system) Opening Tree Data
// Witty_Alien's signature weapon vs 1.d4 — 570 real chess.com games, 65% win rate.
// He plays BLACK. This is his real ...d6 regaining system, NOT the famous
// queen-check cheapo trap.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Moves here are NOT ranked #1 in the masters database — this is a meme/trick weapon.
// Source of truth: Witty_Alien's real chess.com games (2026), 570 Englund Gambit
// games at 65% win rate. The ...d6 system (243 games) is his actual repertoire;
// the famous Qe7/Qb4+ cheapo trap is briefly mentioned but NOT the main teaching.
//
// BLACK OPENING: The user plays as Black.
// Main line (Branch A, 3.exd6 Bxd6): 1.d4 e5 2.dxe5 d6! 3.exd6 Bxd6
//             then ...Nf6, ...O-O, ...Nc6 — roughly equal, full compensation.
// Main line (Branch B, 3.Nf3 Nc6 4.Bg5): 4.Bg5 f6! 5.exf6 Nxf6 — f-file open,
//             full development regained. 32 games, 69% win rate.
// Deviation (2.c4): 2...exd4 3.Qxd4 Nc6! 4.Qd1 Nf6 — tempo on the queen,
//             easy free development. 111 games, 65%.
//
// GRID LAYOUT (8 lessons + 1 test node):
//   Row 7:   wae-test-1 (col 0)
//   Row 6:   wae-a3 (col 0)              wae-b3 (col -1)
//   Row 5:   wae-a2 (col 0)              wae-b2 (col -1)
//   Row 4:   wae-a1 (col 0)              wae-b1 (col -1)
//   Row 3:   wae-2 (col 0)
//   Row 2:   wae-dev-c4 (col -1)
//   Row 1:   wae-1 (col 0)
//   Row 0:   (empty)
//
// All lines are purely horizontal or vertical. No diagonals.
// All `unlockedBy: null` (Tyler-approved sandbox — every lesson always available).

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN_ENGLUND: OpeningTree = {
  id: 'witty-alien-englund',
  name: 'Englund Gambit',
  slug: 'witty-alien-englund',
  description: "Witty_Alien's signature weapon vs 1.d4 — 570 games, 65% win rate. Gambit a pawn immediately and grab the bishop pair, rapid development, and full compensation.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'wae-1',
    'wae-2',
    'wae-dev-c4',
    'wae-a1',
    'wae-a2',
    'wae-a3',
    'wae-b1',
    'wae-b2',
    'wae-b3',
    'wae-test-1',
  ],
  nodes: [
    // === INTRO NODE (bottom of trunk) ===
    {
      id: 'wae-1',
      name: 'The Gambit',
      moves: ['1.d4 e5!'],
      description: "Witty_Alien's signature weapon: 1...e5 vs 1.d4. Sacrifice immediately, grab development, and make the position messy. 570 real games, 65% win rate.",
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'wae-2',
      name: 'The ...d6 System',
      moves: ['2.dxe5 d6!'],
      description: "White takes; Black plays d6! immediately offering to regain the pawn with active piece play. 243 games. This is his real repertoire — NOT the Qe7/Qb4+ cheapo.",
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'wae-1',
      unlockedBy: null,
      side: 'black',
    },

    // === DEVIATION (col -1): 2.c4 exd4 3.Qxd4 Nc6 4.Qd1 Nf6 ===
    {
      id: 'wae-dev-c4',
      name: 'If White plays c4',
      moves: ['2.c4 exd4', '3.Qxd4 Nc6!', '4.Qd1 Nf6'],
      description: "White avoids dxe5 with c4. Black recaptures on d4, hits the queen with Nc6!, and develops freely. 111 games, 65%.",
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'wae-1',
      unlockedBy: null,
      side: 'black',
    },

    // === BRANCH A (col 0): 3.exd6 Bxd6 — White gives back pawn ===
    {
      id: 'wae-a1',
      name: 'A: Bishop on d6',
      moves: ['3.exd6 Bxd6'],
      description: "White gives back the pawn immediately (76 games). Black recaptures with the bishop — beautifully active on d6, aimed at h2. Roughly equal; Black has full compensation.",
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'wae-2',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'wae-a2',
      name: 'A: Fast Development',
      moves: ['4.Nf3 Nf6', '5.e3 O-O'],
      description: "Develop fast. Nf6, castle — Black gets the king safe while the bishop sits on d6 aiming at h2. White can barely do anything about it.",
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'wae-a1',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'wae-a3',
      name: 'A: Complete the Setup',
      moves: ['6.Be2 Nc6'],
      description: "Nc6 completes Black's setup — both knights out, castled, bishop on d6 eyeing the kingside. Roughly equal but fun to play.",
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'wae-a2',
      unlockedBy: null,
      side: 'black',
    },

    // === BRANCH B (col -1): 3.Nf3 Nc6 4.Bg5 f6! 5.exf6 Nxf6 — White holds pawn ===
    {
      id: 'wae-b1',
      name: 'B: Nc6 — Hold the Tension',
      moves: ['3.Nf3 Nc6', '4.Bg5 f6!'],
      description: "White holds the e5 pawn and plays Bg5. Black develops Nc6, then hits f6! — kick the bishop and blast open the f-file to regain the pawn. 32 games, 69%.",
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'wae-2',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'wae-b2',
      name: 'B: Recapture and Develop',
      moves: ['5.exf6 Nxf6', '6.e3 Be7'],
      description: "Nxf6 regains the pawn, reopens the f-file. Then Be7 — develop normally. Black has full piece activity; the extra f-file pressure is a bonus.",
      type: 'deviation',
      row: 5,
      col: -1,
      lineFrom: 'wae-b1',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'wae-b3',
      name: 'B: Castle and Press',
      moves: ['7.Be2 O-O'],
      description: "Castle into safety. Black has equal material, the f-file half-open, and active pieces. 69% win rate over 32 real Witty games.",
      type: 'deviation',
      row: 6,
      col: -1,
      lineFrom: 'wae-b2',
      unlockedBy: null,
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'wae-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Englund Gambit — the d6 system, both branches, and the c4 deviation.',
      type: 'test',
      row: 7,
      col: 0,
      lineFrom: 'wae-a3',
      unlockedBy: null,
      side: 'black',
    },
  ],
}
