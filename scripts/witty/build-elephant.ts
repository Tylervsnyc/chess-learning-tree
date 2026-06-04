// Rebuilds the Elephant Gambit (witty-alien-elephant) from witty_alien's REAL
// games. Run: npx tsx scripts/witty/build-elephant.ts
// Real data (24mo, 5,622 Elephant games, 67% W). Main line is his actual
// fast-development gambit — NOT the fabricated Qxd5 queen-hang.
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

// ── MAIN LINE (shared by we-1/we-2/we-3) ──────────────────────────────
// 1.e4 e5 2.Nf3 d5 3.exd5 e4 4.Qe2 Nf6 5.Nc3 Be7 6.Nxe4 O-O 7.Nxf6+ Bxf6 8.d4 Bf5 9.Be3 Re8
const MAIN: PlySpec[] = [
  { san: 'e4' },
  { san: 'e5', teach: "Answer 1.e4 the classic way — stake your own center with e5.", prompt: 'Play e5.', hint: 'Pawn e7 to e5.', ok: 'e5. Now White develops, and the Elephant trap is one move away.' },
  { san: 'Nf3' },
  { san: 'd5', teach: "Here's the Elephant. Most players develop a piece — Witty shoves the d-pawn to d5 and offers it as a gambit.", prompt: 'Push d5 — the Elephant Gambit.', hint: 'Pawn d7 to d5.', ok: 'd5! The Elephant Gambit. White almost always grabs it.', arrow: ['d5', 'e4'] },
  { san: 'exd5' },
  { san: 'e4', teach: "Don't recapture. Ignore the pawn and kick the knight — push e4.", prompt: 'Play e4 — kick the f3-knight.', hint: 'Pawn e5 to e4.', ok: "e4! The Paulsen Countergambit. One pawn for a big lead in development. This is the whole idea.", arrow: ['e4', 'f3'] },
  { san: 'Qe2' },
  { san: 'Nf6', teach: "Develop and keep the e4 pawn defended — Nf6 guards e4 and eyes d5.", prompt: 'Develop Nf6.', hint: 'Knight g8 to f6.', ok: 'Nf6. Knight out, e4 still held. White usually plays Nc3 here.' },
  { san: 'Nc3' },
  { san: 'Be7', teach: "Just keep developing — Be7, ready to castle. Do NOT grab d5 with the queen here: after Nc3 the queen would hang.", prompt: 'Develop Be7.', hint: 'Bishop f8 to e7.', ok: 'Be7. Calm. White takes the e4 pawn next — let them.' },
  { san: 'Nxe4' },
  { san: 'O-O', teach: "White grabbed the pawn with Nxe4. Don't chase it — castle. Your lead in development is the whole point.", prompt: 'Castle kingside.', hint: 'O-O.', ok: 'O-O! King safe. White trades on f6 next and you get the bishop pair.' },
  { san: 'Nxf6+' },
  { san: 'Bxf6', teach: "Recapture with the bishop. Now you have the bishop pair and a big development lead for one pawn.", prompt: 'Take with the bishop — Bxf6.', hint: 'Bishop e7 takes f6.', ok: 'Bxf6. Bishop pair, fast pieces, open lines. Real compensation.' },
  { san: 'd4' },
  { san: 'Bf5', teach: "Develop the light bishop to f5 — it rakes the b1-h7 diagonal and hits c2.", prompt: 'Develop Bf5.', hint: 'Bishop c8 to f5.', ok: 'Bf5. Both bishops blazing.' },
  { san: 'Be3' },
  { san: 'Re8', teach: "Rook to e8 — pile on the half-open e-file behind White's queen. The Elephant's dream position.", prompt: 'Rook to e8.', hint: 'Rook f8 to e8.', ok: "Re8. Every piece active, White still untangling. Down a pawn, easier to play — and Witty wins 67% of these." },
]

// shared deviation prefix builders
const P = (san: string): PlySpec => ({ san })

const spec: OpeningSpec = {
  id: 'witty-alien-elephant',
  slug: 'witty-alien-elephant',
  name: 'Elephant Gambit',
  description: "Witty_Alien's #1 weapon as Black — 1.e4 e5 2.Nf3 d5, the Elephant Gambit. Offer the pawn, kick the knight, then develop like lightning. 5,622 real games, 67% win rate.",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  completionOrder: ['we-1', 'we-2', 'we-3', 'we-dev-Nxe5', 'we-dev-d4', 'we-dev-Nc3', 'we-dev-Nd4', 'we-dev-Ng1', 'we-test-1'],
  lines: [
    // MAIN — three nodes, same line, different teach windows
    { id: 'we-1', title: 'The Elephant Gambit', type: 'main', teachFrom: 1, row: 0, col: 0, lineFrom: null,
      intro: "Welcome to the Elephant Gambit — Witty_Alien's favorite weapon as Black, in nearly half his games against 1.e4. Offer a pawn, ignore it, kick the knight.",
      outro: "e5, d5, e4 — three moves, one idea: give the pawn, seize tempo. The Elephant is on the board.", plies: MAIN },
    { id: 'we-2', title: 'Develop and Castle', type: 'main', teachFrom: 7, row: 1, col: 0, lineFrom: 'we-1',
      intro: "4.Qe2 pins your e4 pawn. No problem — you develop fast and let White waste time holding the extra pawn.",
      outro: "Nf6, Be7, O-O. King safe, pieces out, White tangled around the extra pawn. This is the gambit working.", plies: MAIN },
    { id: 'we-3', title: 'Bishop Pair and the e-file', type: 'main', teachFrom: 13, row: 2, col: 0, lineFrom: 'we-2',
      intro: "White won the gambit pawn but had to trade on f6 — handing you the bishop pair. Now cash in your lead: bishops out, rook on the e-file.",
      outro: "Bxf6, Bf5, Re8 — bishop pair, open diagonals, pressure down the e-file for one pawn. Witty converts this 67% of the time.", plies: MAIN },

    // DEVIATION: 3.Nxe5 (1,200 games, the critical test)
    { id: 'we-dev-Nxe5', title: 'If 3.Nxe5', type: 'deviation', teachFrom: 5, row: 0, col: -1, lineFrom: 'we-1',
      intro: "The honest test: instead of taking d5, White grabs the e5 pawn with 3.Nxe5. You're genuinely a pawn down — bet everything on fast development.",
      outro: "3.Nxe5 is the real test — be honest, you're a pawn down. After Nf6, Qxd5, Nc6 and ...Qh5 you have furious activity. Witty wins 64% of these. In bullet. Respect the line.",
      plies: [ P('e4'), P('e5'), P('Nf3'), P('d5'), P('Nxe5'),
        { san: 'Nf6', teach: "Don't panic. Nf6 develops and hits the e4 pawn. Witty plays this in 98% of these games.", prompt: 'Develop Nf6.', hint: 'Knight g8 to f6.', ok: 'Nf6! Speed is your compensation for the pawn.', arrow: ['f6', 'e4'] },
        P('exd5'),
        { san: 'Qxd5', teach: "Take the d5 pawn back with the queen and centralize — now you're only down one, with a big lead in development.", prompt: 'Recapture — Qxd5.', hint: 'Queen takes d5.', ok: "Qxd5! Queen centralized, you're right back in it." },
        P('Nf3'),
        { san: 'Nc6', teach: "Develop with tempo. Then ...Qh5 swings the queen at White's king and you're flying.", prompt: 'Develop Nc6.', hint: 'Knight b8 to c6.', ok: "Nc6. Down a pawn, but every piece screams toward White's king." },
        P('Nc3'), P('Qh5') ] },

    // DEVIATION: 3.d4 (580 games)
    { id: 'we-dev-d4', title: 'If 3.d4', type: 'deviation', teachFrom: 5, row: 1, col: -1, lineFrom: 'we-1',
      intro: "3.d4 grabs the center instead of a pawn. You develop with tempo and snatch the e4 pawn — a Petroff-style gambit.",
      outro: "Nf6, Nxe4, Bd6 — active pieces for the pawn, and White's big center is loose. Comfortable.",
      plies: [ P('e4'), P('e5'), P('Nf3'), P('d5'), P('d4'),
        { san: 'Nf6', teach: "Develop with tempo — Nf6 hits the e4 pawn.", prompt: 'Develop Nf6.', hint: 'Knight g8 to f6.', ok: 'Nf6. Pressure on e4 right away.' },
        P('Nxe5'),
        { san: 'Nxe4', teach: "Snatch the e4 pawn with the knight. You get active pieces for the pawn.", prompt: 'Take e4 — Nxe4.', hint: 'Knight f6 takes e4.', ok: 'Nxe4! Knight in the center, fully in the game.' },
        P('Bd3'),
        { san: 'Bd6', teach: "Develop the bishop to d6, hitting the Ne5. White's center looks big but it's loose.", prompt: 'Develop Bd6.', hint: 'Bishop f8 to d6.', ok: "Bd6. Pieces flying out, White still has to prove that center." },
        ] },

    // DEVIATION: 3.Nc3 (403 games)
    { id: 'we-dev-Nc3', title: 'If 3.Nc3', type: 'deviation', teachFrom: 5, row: 2, col: -1, lineFrom: 'we-1',
      intro: "3.Nc3 attacks your d5 pawn. Don't defend it — push past and gain space.",
      outro: "d4, f6, Be6 — a huge pawn wedge in the center. A great version for Black.",
      plies: [ P('e4'), P('e5'), P('Nf3'), P('d5'), P('Nc3'),
        { san: 'd4', teach: "Nc3 hits d5 — so push past it! d4 grabs space and kicks the knight.", prompt: 'Push d4.', hint: 'Pawn d5 to d4.', ok: 'd4! Space gained, knight kicked.', arrow: ['d4', 'c3'] },
        P('Ne2'),
        { san: 'f6', teach: "Prop up your big center. f6 supports e5 so it can never be challenged.", prompt: 'Play f6.', hint: 'Pawn f7 to f6.', ok: 'f6. The e5/d4 duo is rock solid.' },
        P('d3'),
        { san: 'Be6', teach: "Develop the bishop to e6, guarding d5 and c4 and finishing your space grab.", prompt: 'Develop Be6.', hint: 'Bishop c8 to e6.', ok: 'Be6. A monster center — Black is very comfortable.' },
        ] },

    // DEVIATION: 4.Nd4 (691 games)
    { id: 'we-dev-Nd4', title: 'If 4.Nd4', type: 'deviation', teachFrom: 7, row: 1, col: 1, lineFrom: 'we-2',
      intro: "Instead of 4.Qe2, White retreats the knight to d4 — passive. Take the pawn back immediately, the queen even hits the knight.",
      outro: "Qxd5, Qe5, Nf6 — pawn back, queen dominating, easy development. 73% for you over 691 games.",
      plies: [ P('e4'), P('e5'), P('Nf3'), P('d5'), P('exd5'), P('e4'), P('Nd4'),
        { san: 'Qxd5', teach: "The d5 pawn is free AND the Nd4 is loose. Take it — Qxd5 hits the knight.", prompt: 'Take — Qxd5.', hint: 'Queen takes d5.', ok: 'Qxd5! Pawn back, queen centralized, knight attacked.', arrow: ['d5', 'd4'] },
        P('Nb3'),
        { san: 'Qe5', teach: "Center the queen on e5 — it defends your e4 pawn and keeps White cramped.", prompt: 'Play Qe5.', hint: 'Queen d5 to e5.', ok: 'Qe5. The queen owns the center.' },
        P('Nc3'),
        { san: 'Nf6', teach: "Develop with tempo. Bc5 or Bd6 and castle next — you're just better.", prompt: 'Develop Nf6.', hint: 'Knight g8 to f6.', ok: "Nf6. You're a pawn up on development and pressing." },
        ] },

    // DEVIATION: 4.Ng1 (351 games) — teaches the queen DODGE that the old lesson skipped
    { id: 'we-dev-Ng1', title: 'If 4.Ng1', type: 'deviation', teachFrom: 7, row: 2, col: 1, lineFrom: 'we-2',
      intro: "White's knight crawls all the way back to g1 — totally passive. Grab the free pawn and dominate.",
      outro: "Qxd5, Qe5, Nf6 — and notice: when Nc3 hit your queen, you simply stepped to e5. Always move the attacked queen. 85% for you here.",
      plies: [ P('e4'), P('e5'), P('Nf3'), P('d5'), P('exd5'), P('e4'), P('Ng1'),
        { san: 'Qxd5', teach: "The knight went home to g1 — snatch d5 for free with the queen.", prompt: 'Take — Qxd5.', hint: 'Queen takes d5.', ok: 'Qxd5! Free pawn, monster queen, White undeveloped.' },
        P('Nc3'),
        { san: 'Qe5', teach: "Nc3 hits your queen — just glide to e5. Still centralized, still defending e4. Move the attacked queen, never abandon it.", prompt: 'Step to Qe5.', hint: 'Queen d5 to e5.', ok: 'Qe5. Queen sidesteps and stays strong.' },
        P('Qe2'),
        { san: 'Nf6', teach: "Develop, castle, win. White is in a hole.", prompt: 'Develop Nf6.', hint: 'Knight g8 to f6.', ok: 'Nf6. Comfortable, and ahead on development.' },
        ] },
  ],
  test: { id: 'we-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'we-3',
    intro: "Test time. Play the Elephant — the main line plus every deviation White can throw at you. No hints.",
    outro: "Level 1 complete. The real Elephant is in your head: the development gambit main line, the 3.Nxe5 test, and the sidelines. Go play it." },
}

const { tree, lessons } = buildOpening({ ...spec, playerColor: 'black' })
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-elephant.ts'), serializeTree(tree, 'WITTY_ALIEN_ELEPHANT'))
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-elephant-lessons.ts'), serializeLessons(lessons, 'getWittyAlienElephantLesson', 'WITTY_ALIEN_ELEPHANT_LESSONS'))
console.log('Wrote witty-alien-elephant.ts + witty-alien-elephant-lessons.ts')
console.log(`Nodes: ${tree.nodes.length}, lessons: ${Object.keys(lessons).length}`)
