// Witty Alien — Two Knights Trap (Hikaru's Bg6# mate) Opening Tree Data
// The 2.Nc3 move order — same Nxf7! sacrifice idea, different setup.
// Hikaru Nakamura beat an FM with this exact trap.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Every move here is NOT #1 in the masters database — this is a meme/trick weapon
// just like its sibling Alien Gambit tree. We use the Lichess study annotations
// (Ishaan_Biswas, captainamogus) and the celebrity hook (Hikaru's GM-vs-FM win)
// as our authority. Lean INTO the trap framing.
//
// Sources: research/alien-gambit-{ishaan,captainamogus,mikewolf}.pgn
//          ishaan Trap-4 chapter = the Hikaru Bg6# mate
//          captainamogus chapters "9. Kg8" and "9. Ke6" = deviations
//
// WHITE OPENING: The user plays as White.
// Main line: 1.e4 c6 2.Nc3 d5 3.Nf3 dxe4 4.Nxe4 Nf6 5.Neg5 h6
//            6.Nxf7!! Kxf7 7.Ne5+ Ke8 8.Bd3 Be6 9.Bg6+ Bf7 10.Bxf7#
//
// Note: 5.Neg5 (the e-knight, not the f-knight). 8.Bd3 NOT Bc4 (Bc4 lets Qd4!
// double attack the bishop AND the knight — eval flips to -1.3).
//
// GRID LAYOUT (9 lessons):
//   Row 8:   watk-test-1 (col 0)
//   Row 7:   watk-6 (col 0)            watk-dev-Kg8 (col -1)
//   Row 6:   watk-5 (col 0)            watk-dev-Ke6 (col -1)
//   Row 5:   watk-4 (col 0)
//   Row 4:   watk-3 (col 0)
//   Row 3:   watk-2 (col 0)
//   Row 2:   watk-1 (col 0)
//
// Both deviations trigger AFTER watk-4 (after 7.Ne5+) when Black's king goes
// to Kg8 (best) or Ke6 (worst) instead of Ke8 (the trap line).
//
// All lines are purely horizontal or vertical. No diagonals.

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN_TWO_KNIGHTS: OpeningTree = {
  id: 'witty-alien-two-knights',
  name: 'Two Knights Trap',
  slug: 'witty-alien-two-knights',
  description: "Hikaru's Caro-Kann mating trap. Different move order, same Nxf7! — finished with Bg6# in a real GM-vs-FM game.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'watk-1', 'watk-2', 'watk-3', 'watk-4',
    'watk-dev-Kg8', 'watk-5',
    'watk-dev-Ke6', 'watk-6',
    'watk-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'watk-1',
      name: 'Different Move Order',
      moves: ['1.e4 c6', '2.Nc3 d5', '3.Nf3'],
      description: 'Same Caro-Kann, different White setup. Skip d4 — develop both knights first.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'watk-2',
      name: 'Same Idea',
      moves: ['3…dxe4', '4.Nxe4 Nf6'],
      description: 'Black captures, you recapture, Black develops — like the main Alien Gambit but no pawn on d4.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'watk-1',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'watk-3',
      name: 'The Jump',
      moves: ['5.Neg5 h6', '6.Nxf7!!'],
      description: 'Same sacrifice you already know — the e-knight hops to g5, Black plays h6, you take f7.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'watk-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'watk-4',
      name: 'The Check',
      moves: ['6…Kxf7', '7.Ne5+'],
      description: "The other knight checks immediately. No quiet Nf3 — Black's king has to move RIGHT NOW.",
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'watk-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'watk-5',
      name: 'The Bg6# Trap',
      moves: ['7…Ke8', '8.Bd3 Be6??', '9.Bg6+ Bf7', '10.Bxf7#'],
      description: "Hikaru's mate. When Black plays Be6 to block the bishop, the mating net snaps shut.",
      type: 'main',
      row: 6,
      col: 0,
      lineFrom: 'watk-4',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'watk-6',
      name: 'Why NOT Bc4',
      moves: ['8.Bd3 (✓)', '8.Bc4?? (✗)'],
      description: "The natural-looking Bc4 lets Black play Qd4! with a double attack. Bd3 is the only square that keeps the trap alive.",
      type: 'main',
      row: 7,
      col: 0,
      lineFrom: 'watk-5',
      unlockedBy: null,
      side: 'white',
    },

    // === DEVIATIONS (col -1) — both branch from watk-4 (after 7.Ne5+) ===
    {
      id: 'watk-dev-Kg8',
      name: 'If Kg8',
      moves: ['7…Kg8', '8.Bc4+ e6', '9.d4'],
      description: "Black's best move — runs to the corner. Bc4 with check, then build the center.",
      type: 'deviation',
      row: 7,
      col: -1,
      lineFrom: 'watk-5',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'watk-dev-Ke6',
      name: 'If Ke6??',
      moves: ['7…Ke6??', '8.d4!'],
      description: "The worst king move. d4 is the only winning answer — the king is stuck in the open.",
      type: 'deviation',
      row: 6,
      col: -1,
      lineFrom: 'watk-4',
      unlockedBy: null,
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'watk-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Two Knights Trap — main line, the Bg6# mate, and both deviations.',
      type: 'test',
      row: 8,
      col: 0,
      lineFrom: 'watk-6',
      unlockedBy: null,
      side: 'white',
    },
  ],
}
