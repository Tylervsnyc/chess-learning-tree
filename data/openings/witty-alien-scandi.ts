// Witty Alien — Scandinavian Gambit Opening Tree Data
// Witty_Alien (Bulgarian CM Volen Dyulgerov, "from the Moon") plays BLACK.
// His trick weapon: the Scandinavian Gambit — 1.e4 d5 2.exd5 c6!? offering the pawn
// to rip open lines, develop fast, and attack. A pawn-down, speed-based gambit for bullet.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Moves here are NOT ranked #1 in the masters database — this is a meme/trick weapon.
// We use Witty_Alien's actual chess.com games (2026, 60 Scandinavian Gambit games,
// 75% win rate — small sample, stated honestly in lessons) as the source of truth.
// Lean INTO the "trick weapon" framing: this is a gambit, Black is a real pawn down,
// and the whole bet is speed + activity in bullet chess.
//
// BLACK OPENING: The user plays as Black.
// Main line: 1.e4 d5 2.exd5 c6! 3.dxc6 Nxc6 4.Nf3 e5 5.Bc4 Bc5 6.O-O Qb6
//            7.Bb3 Nf6 8.d3 Bg4 9.Nc3 O-O-O ...
//
// DEVIATIONS:
//   - If White declines 3.d4 (keeps the pawn): 3...cxd5 — pawn regained, equal game
//   - If White plays 2.Nc3 (skips 2.exd5): 2...d4! 3.Nce2 e5 — Black grabs space
//
// LESSON CHUNKING RULE:
// This is a BLACK opening. User plays BLACK. Each main lesson teaches EXACTLY 3 of
// Black's moves. White's moves between = instruction steps with autoAdvance: 800.
//
// GRID LAYOUT (7 nodes):
//   Row 6:   was-test-1 (col 0)
//   Row 5:   was-3 (col 0)
//   Row 4:   was-2 (col 0)
//   Row 3:   was-1 (col 0)                 was-dev-d4 (col -1)
//   Row 2:   (trunk base)                   was-dev-Nc3 (col -1)
//   Row 1:   (starting position)
//
// All `unlockedBy: null`. All lines are purely horizontal or vertical. No diagonals.

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN_SCANDI: OpeningTree = {
  id: 'witty-alien-scandi',
  name: 'Scandinavian Gambit',
  slug: 'witty-alien-scandi',
  description: "Witty_Alien plays Black — offer the c6 pawn after 1.e4 d5 2.exd5, rip open lines, develop fast, attack. A speed gambit from the Moon.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'was-1',
    'was-2',
    'was-3',
    'was-dev-d4',
    'was-dev-Nc3',
    'was-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'was-1',
      name: 'The Pawn Offer',
      moves: ['1.e4 d5', '2.exd5 c6!', '3.dxc6 Nxc6'],
      description: "Black offers the c6 pawn to open the b- and d-files and build a development lead.",
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'was-2',
      name: 'Rapid Development',
      moves: ['4.Nf3 e5', '5.Bc4 Bc5', '6.O-O Qb6'],
      description: "Black floods the board with pieces — e5 stakes the center, Bc5 eyes f2, Qb6 attacks the bishop and pressures b2.",
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'was-1',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'was-3',
      name: 'Castle Long',
      moves: ['7.Bb3 Nf6', '8.d3 Bg4', '9.Nc3 O-O-O'],
      description: "Black pins the Nf3, then castles queenside — rook on d8, queen on b6, all pieces aimed at White's kingside.",
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'was-2',
      unlockedBy: null,
      side: 'black',
    },

    // === DEVIATIONS (col -1) ===
    {
      id: 'was-dev-d4',
      name: 'If 3.d4',
      moves: ['3.d4 cxd5'],
      description: "White keeps the pawn with 3.d4. Black recaptures — equal, comfortable game. The gambit is off but Black is fine.",
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'was-1',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'was-dev-Nc3',
      name: 'If 2.Nc3',
      moves: ['2.Nc3 d4!', '3.Nce2 e5'],
      description: "White skips 2.exd5 and plays 2.Nc3 instead. Black pushes 2...d4! to kick the knight, then grabs the center with e5.",
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'was-1',
      unlockedBy: null,
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'was-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Scandinavian Gambit — main line and every deviation.',
      type: 'test',
      row: 6,
      col: 0,
      lineFrom: 'was-3',
      unlockedBy: null,
      side: 'black',
    },
  ],
}
