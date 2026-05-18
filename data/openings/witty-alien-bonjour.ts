// Witty Alien — Bonjour Variation Opening Tree Data
// Witty_Alien's Alien Gambit applied to the French Defense ("Bonjour" = the French greeting).
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Every move here is NOT #1 in the masters database — this is a meme/trick weapon,
// even less sound than the Caro-Kann original by engine eval. We use the Lichess
// all-games winrate (the source study cites 53% White over 15,000+ games at 6.Nxf7)
// and the cited Lichess study annotations as our authority. Lean INTO the
// "trick weapon" framing — this is Witty_Alien's gambit, not master theory.
//
// Sources (verified):
//   - https://lichess.org/study/HdOBd71d (AquaBlaze47, "Alien Gambit: Bonjour Variation" chapter)
//   - https://lichess.org/study/4w4FSB7u (Chess_In_Fire, 9 French Defense / Bonjour chapters
//     including the full mating sequence and c5 refutation)
//
// WHITE OPENING: The user plays as White.
// Main line: 1.e4 e6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nf6 5.Ng5 h6
//            6.Nxf7!! Kxf7 7.Nf3 Nbd7 8.Bd3 Bd6 9.O-O Re8
//            10.Re1 Kg8 11.Ne5 Bxe5 12.dxe5 Nd5 13.Qg4 Kh8
//            14.Bxh6!! gxh6 15.Qg6 Nf8 16.Qxh6+ Kg8 17.Re4 Kf7
//            18.Rg4 Ng6 19.Qxg6+ Ke7 20.Qg7#
//
// Key differences from the Caro-Kann Alien Gambit:
//   - e6 is already played (locks in Black's light-squared bishop, good for us)
//   - c4 diagonal is blocked by e6 (so Bc4+ trick from main Alien is unavailable)
//   - Black often manually castles (Kg8) before piece trades, so the attack shifts
//     to Qg4 (not Qh5+) — but the Bxh6 brilliancy still works
//
// GRID LAYOUT (9 lessons):
//   Row 6:   wab-test-1 (col 0)
//   Row 5:   wab-6 (col 0)
//   Row 4:   wab-5 (col 0)              wab-dev-c5 (col -1)
//   Row 3:   wab-4 (col 0)              wab-dev-Nc6 (col -1)
//   Row 2:   wab-3 (col 0)
//   Row 1:   wab-2 (col 0)
//   Row 0:   wab-1 (col 0)
//
// All deviations trigger AFTER wab-3 (after 7.Nf3) when Black chooses Nc6 or c5.
// All lines are purely horizontal or vertical. No diagonals.

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN_BONJOUR: OpeningTree = {
  id: 'witty-alien-bonjour',
  name: 'Bonjour Variation',
  slug: 'witty-alien-bonjour',
  description: "Witty_Alien's Alien Gambit applied to the French Defense. Same Nxf7 sacrifice, new opening.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'wab-1', 'wab-2', 'wab-3',
    'wab-dev-Nc6', 'wab-4',
    'wab-dev-c5', 'wab-5',
    'wab-6', 'wab-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'wab-1',
      name: 'Bonjour, France',
      moves: ['1.e4 e6', '2.d4 d5', '3.Nc3 dxe4'],
      description: 'Witty\'s third Alien — same sac, different opening. Black plays the French; you trick them into the Rubinstein.',
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wab-2',
      name: 'Bait the Knight',
      moves: ['4.Nxe4 Nf6', '5.Ng5 h6'],
      description: 'Recapture, jump to g5 attacking f7. Black thinks h6 just kicks the knight away.',
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'wab-1',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wab-3',
      name: 'The Sacrifice',
      moves: ['6.Nxf7!! Kxf7', '7.Nf3'],
      description: 'Same Alien Gambit knight sac. The French version scores 53% over 15,000+ Lichess games.',
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'wab-2',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wab-4',
      name: 'Manual Castle',
      moves: ['7…Nbd7', '8.Bd3 Bd6', '9.O-O Re8', '10.Re1 Kg8'],
      description: 'Black walks the king to g8 by hand — Re8, then Kg8. You develop and aim Bd3 at h7.',
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'wab-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wab-5',
      name: 'Setup the Attack',
      moves: ['11.Ne5 Bxe5', '12.dxe5 Nd5', '13.Qg4 Kh8'],
      description: 'Force the trade on e5, lift the queen to g4. Black plays Kh8 to defend h6 — it does not save them.',
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'wab-4',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wab-6',
      name: 'The Bxh6 Brilliancy',
      moves: ['14.Bxh6!! gxh6', '15.Qg6 Nf8', '16.Qxh6+ → mate in 4'],
      description: "Same dark-square bishop sac as the Caro-Kann main line. Rook lift to g4 finishes the king.",
      type: 'main',
      row: 5,
      col: 0,
      lineFrom: 'wab-5',
      unlockedBy: null,
      side: 'white',
    },

    // === DEVIATIONS (col -1) — all branch from wab-3 (after 7.Nf3) ===
    {
      id: 'wab-dev-Nc6',
      name: 'If Nc6',
      moves: ['7…Nc6', '8.Bd3 Nxd4??', '9.Nxd4 Qxd4??', '10.Bg6+!! Kxg6', '11.Qxd4'],
      description: 'Black grabs the d4 pawn — both knight and queen blunder into a Bg6+ deflection. You win the queen.',
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'wab-3',
      unlockedBy: null,
      side: 'white',
    },
    {
      id: 'wab-dev-c5',
      name: 'If c5',
      moves: ['7…c5', '8.Ne5+ Kg8', '9.Bd3'],
      description: 'The actual refutation. c5 hits d4 and threatens to free the queen. Tuck the king in with Ne5+ and develop.',
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'wab-4',
      unlockedBy: null,
      side: 'white',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'wab-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Bonjour Variation — main line and every deviation.',
      type: 'test',
      row: 6,
      col: 0,
      lineFrom: 'wab-6',
      unlockedBy: null,
      side: 'white',
    },
  ],
}
