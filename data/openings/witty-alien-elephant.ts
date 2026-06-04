// Witty Alien — Elephant Gambit Opening Tree Data
// Witty_Alien's #1 trick weapon as Black: 1.e4 e5 2.Nf3 d5 — the Elephant Gambit.
//
// ⚠️  OPENING-RULES.md HARD RULE #0 EXCEPTION (Tyler-approved):
// Moves here need NOT be #1 in the masters database — this is a trick weapon.
// We use Witty_Alien's real chess.com games (2026, 1,024 Elephant Gambit games)
// as the source of truth: frequencies, win rates, what opponents actually play.
// He plays it as BLACK in 74% of his e4-facing games.
//
// Sources: Witty_Alien chess.com game data (Jan–Mar 2026)
//          chess.js FEN generation script (scripts/_gen-elephant-fens.mjs, now deleted)
//
// BLACK OPENING: The user plays as Black. Black moves = play-move.
// White moves = instruction with autoAdvance: 800.
//
// Main line: 1.e4 e5 2.Nf3 d5 (Elephant Gambit!) 3.exd5 e4! (Paulsen Countergambit)
//            4.Qe2 Nf6 5.d3 Qxd5! (snatch the pawn, centralize the queen)
//            6.Nbd2 Be7 7.dxe4 Nxe4 8.Nxe4 O-O 9.Nc3 Nc6 10.Bf4 Re8
//            (queen on d5 eyes the e2-queen; Re8 piles on the half-open e-file)
//
// LESSON CHUNKING RULE (Tyler-explicit):
// EVERY main lesson teaches EXACTLY 3 black moves.
// White moves between them are instruction steps with autoAdvance: 800.
//
// GRID LAYOUT (8 lesson nodes + 1 test node):
//   Row 5:   we-test-1 (col 0)
//   Row 4:   we-5 (col 0)              we-dev-Nxe5 (col -1)
//   Row 3:   we-4 (col 0)              we-dev-Nc3 (col -1)
//   Row 2:   we-3 (col 0)              we-dev-Nd4 (col -1)
//   Row 1:   we-2 (col 0)
//   Row 0:   we-1 (col 0)
//
// Main trunk: col 0 (row 0 at bottom, increasing up)
// Deviations: col -1, branching from the main node they depart from
// All lines purely horizontal or vertical. No diagonals.
//
// All `unlockedBy: null` (sandbox — every lesson always available).

import type { OpeningTree } from './ruy-lopez'

export const WITTY_ALIEN_ELEPHANT: OpeningTree = {
  id: 'witty-alien-elephant',
  name: 'Elephant Gambit',
  slug: 'witty-alien-elephant',
  description: "Witty_Alien's #1 trick weapon as Black — 1.e4 e5 2.Nf3 d5, the Elephant Gambit. Offer a pawn, kick the knight, snatch it back with the queen. 74% win rate over 1,024 real games.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: [
    'we-1', 'we-2', 'we-3',
    'we-dev-Nd4',
    'we-4',
    'we-dev-Nc3',
    'we-5',
    'we-dev-Nxe5',
    'we-test-1',
  ],
  nodes: [
    // === MAIN LINE (center trunk, col 0) ===
    {
      id: 'we-1',
      name: 'The Elephant Gambit',
      moves: ['1.e4 e5', '2.Nf3 d5!?', '3.exd5 e4!'],
      description: "Play e5, offer d5 as a gambit, then ignore the pawn and kick the f3-knight with e4. That's the Paulsen Countergambit — the core idea.",
      type: 'main',
      row: 0,
      col: 0,
      lineFrom: null,
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'we-2',
      name: 'The Point',
      moves: ['4.Qe2 Nf6', '5.d3 Qxd5!', '6.Nbd2 Be7'],
      description: "Develop Nf6, then when White plays 5.d3 to dissolve your e4, grab the d5 pawn back with the queen. Centralized queen, e-file pressure on Qe2. Then develop Be7.",
      type: 'main',
      row: 1,
      col: 0,
      lineFrom: 'we-1',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'we-3',
      name: 'Recapture and Castle',
      moves: ['7.dxe4 Nxe4', '8.Nxe4 O-O', '9.Nc3 Nc6'],
      description: "When White dissolves e4, recapture with the knight and centralize. Trade it off if they push, then castle. Complete your development with Nc6.",
      type: 'main',
      row: 2,
      col: 0,
      lineFrom: 'we-2',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'we-4',
      name: 'Pile on the e-file',
      moves: ['10.Qd3 Re8', '11.Be2 Bg4', '12.O-O Qe6'],
      description: "Stack the rook on e8 — the whole point. Then pin the Nf3 with Bg4 and centralize the queen on e6. White's king position and Qe2 awkwardness are your reward.",
      type: 'main',
      row: 3,
      col: 0,
      lineFrom: 'we-3',
      unlockedBy: null,
      side: 'black',
    },
    {
      id: 'we-5',
      name: 'Keep the Pressure',
      moves: ['13.h3 Bh5', '14.Nd5 Qd6', '15.Nxe7+ Rxe7'],
      description: "Retreat the bishop, regroup the queen. When White's knight invades e7, swap it off with the rook and keep the open e-file. Roughly equal — but White has the harder game.",
      type: 'main',
      row: 4,
      col: 0,
      lineFrom: 'we-4',
      unlockedBy: null,
      side: 'black',
    },

    // === DEVIATIONS (col -1) ===
    // Dev 1: 4.Nd4 instead of 4.Qe2 — 108 games, 76%
    {
      id: 'we-dev-Nd4',
      name: 'If 4.Nd4',
      moves: ['4.Nd4 Qxd5', '5.Nb3 Bc5', '6.Nc3 Nf6'],
      description: "If White retreats to Nd4 instead of Qe2, snatch d5 immediately — the queen sits on d5 hitting the knight. Develop Bc5 and Nf6, castle, and White has no grip.",
      type: 'deviation',
      row: 2,
      col: -1,
      lineFrom: 'we-2',
      unlockedBy: null,
      side: 'black',
    },
    // Dev 2: 5.Nc3 instead of 5.d3 — 121 games, 69%
    {
      id: 'we-dev-Nc3',
      name: 'If 5.Nc3',
      moves: ['5.Nc3 Be7', '6.Nxe4 Nxe4', '7.d3 Nf6'],
      description: "If White plays 5.Nc3 to defend the d5 pawn, just develop Be7 and prepare to castle. Trade off the e4 knight, then retreat Nf6 and O-O. 69% win rate — slightly trickier but still comfortable.",
      type: 'deviation',
      row: 3,
      col: -1,
      lineFrom: 'we-3',
      unlockedBy: null,
      side: 'black',
    },
    // Dev 3: 3.Nxe5 instead of 3.exd5 — 67% (honest: lowest scorer)
    {
      id: 'we-dev-Nxe5',
      name: 'If 3.Nxe5',
      moves: ['3.Nxe5 Nf6!', '4.Nc3 Bd6', '5.d4 O-O'],
      description: "The critical test — White grabs e5 immediately. Honest: Black is a pawn down, betting on fast development. Play Nf6 hitting e4, Bd6 hitting the knight, then castle and pile on with Re8. Witty's lowest-scoring line at 67% — White has the material, Black has the momentum.",
      type: 'deviation',
      row: 4,
      col: -1,
      lineFrom: 'we-4',
      unlockedBy: null,
      side: 'black',
    },

    // === LEVEL 1 TEST (top of tree, col 0) ===
    {
      id: 'we-test-1',
      name: 'Lvl 1 Test',
      moves: [],
      description: 'Play the full Elephant Gambit — main line and every deviation.',
      type: 'test',
      row: 5,
      col: 0,
      lineFrom: 'we-5',
      unlockedBy: null,
      side: 'black',
    },
  ],
}
