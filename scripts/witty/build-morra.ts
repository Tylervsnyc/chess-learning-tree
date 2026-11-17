// Builds the Smith-Morra Gambit (witty-alien-morra) from witty_alien's REAL games.
// WHITE vs the Sicilian: 1.e4 c5 2.d4 cxd4 3.c3 — a pawn for development.
// Source: ~24.9k chess.com games, Dec 2025–Nov 2026 (rows.json, custom positions excluded).
//   1.e4 c5 2.d4 cxd4 3.c3                 1,934 games, 57%  ← his 2nd most played weapon,
//                                                              his LOWEST scoring. Honest.
//   3...dxc3 4.Nxc3                           685 games, 55%
//   4...Nc6 5.Nf3                             366 games, 53%
//   5...e6 6.Bc4                              187 games, 53%
//   6...Bb4 7.O-O (65, 54%) Nge7 8.Re1 (22, 64%) O-O 9.e5 (10, 70%)
//       (8.e5 is played slightly more — 25 games — but scores 48%; Re1 first scores better.)
//   DEV 3...Nf6 4.e5 Nd5 (320, 51%) 5.Nf3 (167) Nc6 6.cxd4 (44, 49%) d6
//   DEV 3...d3 4.Bxd3 (309, 56%) Nc6 5.c4 (187, 53%) g6 6.Nc3 (88, 56%) Bg7
//   DEV 3...Nc6 4.Nf3 (157, 70%) d5 5.exd5 (54, 69%) Qxd5 6.cxd4 (53, 69%) Bg4
// Engine (app's SF18 wasm, d16): main line ≈ -0.3 (a pawn down, fair compensation);
// all three deviations ≈ +0.1 to +0.8 for White.
// Run: npx tsx scripts/witty/build-morra.ts
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })
const t = (san: string, teach: string, prompt: string, hint: string, ok: string, extra: Partial<PlySpec> = {}): PlySpec =>
  ({ san, teach, prompt, hint, ok, ...extra })

// MAIN: 1.e4 c5 2.d4 cxd4 3.c3 dxc3 4.Nxc3 Nc6 5.Nf3 e6 6.Bc4 Bb4 7.O-O Nge7 8.Re1 O-O 9.e5
const MAIN: PlySpec[] = [
  t('e4', "Open 1.e4 — Black plays the Sicilian, c5.", 'Play e4.', 'Pawn e2-e4.', 'e4.'), P('c5'),
  t('d4', "Strike the center right away — d4, offering a trade.", 'Play d4.', 'Pawn d2-d4.', 'd4.'), P('cxd4'),
  t('c3', "The Smith-Morra! c3 offers a pawn. If Black takes, your knight comes out with tempo and the lines fly open.", 'Play c3.', 'Pawn c2-c3.', 'c3! The gambit.'), P('dxc3'),
  t('Nxc3', "Recapture with the knight — a pawn down, but already a piece ahead in development.", 'Recapture Nxc3.', 'Knight b1 takes c3.', 'Nxc3.'), P('Nc6'),
  t('Nf3', "Develop the other knight — Nf3 covers d4 and e5.", 'Develop Nf3.', 'Knight g1-f3.', 'Nf3.'), P('e6'),
  t('Bc4', "Bc4 — the bishop rakes the a2-g8 diagonal, straight at f7 and e6.", 'Develop Bc4.', 'Bishop f1-c4.', 'Bc4. Three pieces out; Black has one.', { arrow: ['c4', 'f7'] }), P('Bb4'),
  t('O-O', "Black pins your knight with Bb4. Don't panic — castle and get the king safe first.", 'Castle O-O.', 'Castle kingside.', 'O-O.'), P('Nge7'),
  t('Re1', "Re1 — the rook backs up the e-pawn and gets ready to push it.", 'Play Re1.', 'Rook f1-e1.', 'Re1. The e-file is yours.'), P('O-O'),
  t('e5', "Now push e5! It grabs space, takes f6 and d6 from Black's pieces, and cramps the kingside.", 'Push e5.', 'Pawn e4-e5.', "e5! Space and pressure for the pawn. Honest: the engine calls it about even — the Morra is Witty's lowest-scoring weapon (57%), but Black has to know a lot of theory."),
]

const PREFIX = [P('e4'), P('c5'), P('d4'), P('cxd4'), P('c3')]

// DEV 3...Nf6 — Black declines and hits e4.
const DEV_NF6: PlySpec[] = [
  ...PREFIX, P('Nf6'),
  t('e5', "Black ignores the gambit and attacks e4 with Nf6. Push past it — e5 kicks the knight away.", 'Push e5.', 'Pawn e4-e5.', 'e5! The knight has to move.'), P('Nd5'),
  t('Nf3', "Develop Nf3 — it defends e5 and eyes the d4 pawn.", 'Develop Nf3.', 'Knight g1-f3.', 'Nf3.'), P('Nc6'),
  t('cxd4', "Just take the pawn back — cxd4. No gambit at all: you have the big center and Black's knight is floating on d5.", 'Recapture cxd4.', 'Pawn c3 takes d4.', 'cxd4. Big center, material level.'), P('d6'),
]

// DEV 3...d3 — Black returns the pawn to stop Nxc3.
const DEV_D3: PlySpec[] = [
  ...PREFIX, P('d3'),
  t('Bxd3', "Black gives the pawn straight back with d3 so your knight can't use c3. Take it with the bishop — Bxd3.", 'Take Bxd3.', 'Bishop f1 takes d3.', 'Bxd3. Material level, bishop developed.'), P('Nc6'),
  t('c4', "c4! Pawns on c4 and e4 clamp down on d5 — Black's best freeing square.", 'Push c4.', 'Pawn c3-c4.', 'c4. The clamp.'), P('g6'),
  t('Nc3', "Develop Nc3 — another guard on d5. Black's dragon bishop has nothing to bite on.", 'Develop Nc3.', 'Knight b1-c3.', 'Nc3. A big, comfortable space edge — engine +0.8.'), P('Bg7'),
]

// DEV 3...Nc6 — Black develops instead of taking.
const DEV_NC6: PlySpec[] = [
  ...PREFIX, P('Nc6'),
  t('Nf3', "Black develops instead of grabbing. Develop too — Nf3 hits the d4 pawn a second time.", 'Develop Nf3.', 'Knight g1-f3.', 'Nf3.'), P('d5'),
  t('exd5', "Black strikes with d5. Trade — exd5 pulls the queen out early.", 'Take exd5.', 'Pawn e4 takes d5.', 'exd5. Here comes the queen.'), P('Qxd5'),
  t('cxd4', "Win your pawn back — cxd4. Next, Nc3 will kick the queen and gain another tempo.", 'Recapture cxd4.', 'Pawn c3 takes d4.', 'cxd4. Big center, and the queen is a target. Witty scores 70% vs 3...Nc6.'), P('Bg4'),
]

const spec: OpeningSpec = {
  id: 'witty-alien-morra',
  slug: 'witty-alien-morra',
  name: 'Smith-Morra Gambit',
  description: "Witty_Alien's gambit vs the Sicilian: 1.e4 c5 2.d4 cxd4 3.c3! A pawn for fast development and open lines. His 2nd most-played weapon (1,934 games) — and honestly his lowest scoring (~57%). Built from his real games.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  playerColor: 'white',
  completionOrder: ['wmo-1', 'wmo-2', 'wmo-3', 'wmo-dev-Nf6', 'wmo-dev-d3', 'wmo-dev-Nc6', 'wmo-test-1'],
  lines: [
    { id: 'wmo-1', title: 'The Gambit Pawn', type: 'main', teachFrom: 0, row: 0, col: 0, lineFrom: null, plies: MAIN,
      intro: "The Smith-Morra Gambit — against the Sicilian, Witty throws a pawn at Black on move 3 to rip the center open.",
      outro: "e4, d4, c3 — the pawn is offered. Most Black players grab it." },
    { id: 'wmo-2', title: 'Development Storm', type: 'main', teachFrom: 6, row: 1, col: 0, lineFrom: 'wmo-1', plies: MAIN,
      intro: "Black took the pawn. Now cash it in for development — knight, knight, bishop, all with purpose.",
      outro: "Nxc3, Nf3, Bc4 — three pieces out while Black is still shuffling pawns." },
    { id: 'wmo-3', title: 'Castle and Push', type: 'main', teachFrom: 12, row: 2, col: 0, lineFrom: 'wmo-2', plies: MAIN,
      intro: "Black pins with Bb4. Castle, put the rook on e1, and push e5 into Black's camp.",
      outro: "O-O, Re1, e5 — space and pressure for your pawn. Witty's real games split here: about even, so play fast." },
    { id: 'wmo-dev-Nf6', title: 'If 3...Nf6', type: 'deviation', teachFrom: 6, row: 0, col: -1, lineFrom: 'wmo-1', plies: DEV_NF6,
      intro: "Black declines with 3...Nf6, hitting e4. No gambit needed — kick the knight and take the center.",
      outro: "e5, Nf3, cxd4 — the pawn is back and you own the center. If Black hits it with d6, trade on d6." },
    { id: 'wmo-dev-d3', title: 'If 3...d3', type: 'deviation', teachFrom: 6, row: 1, col: -1, lineFrom: 'wmo-1', plies: DEV_D3,
      intro: "Black hands the pawn back with 3...d3 so your knight can't come to c3. Take it and build a clamp.",
      outro: "Bxd3, c4, Nc3 — the Maroczy-style bind. Black has nowhere good to break." },
    { id: 'wmo-dev-Nc6', title: 'If 3...Nc6', type: 'deviation', teachFrom: 6, row: 2, col: -1, lineFrom: 'wmo-1', plies: DEV_NC6,
      intro: "Black develops with 3...Nc6 and doesn't take. Develop, trade on d5, and win your pawn back.",
      outro: "Nf3, exd5, cxd4 — the pawn is back, the center is yours, and Nc3 will chase the queen. 70% for Witty." },
  ],
  test: { id: 'wmo-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'wmo-3',
    intro: "Test time. Play the Smith-Morra — the main gambit line plus the three ways Black declines. No hints.",
    outro: "Level 1 complete. One pawn, open lines, a Sicilian player who's out of book." },
}

const { tree, lessons } = buildOpening(spec)
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-morra.ts'), serializeTree(tree, 'WITTY_ALIEN_MORRA'))
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-morra-lessons.ts'), serializeLessons(lessons, 'getWittyAlienMorraLesson', 'WITTY_ALIEN_MORRA_LESSONS'))
console.log(`Wrote morra: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
