// Rebuilds the Alien Gambit (witty-alien) from witty_alien's REAL games.
// WHITE: Caro-Kann ...Nf6, the signature 6.Nxf7!! knight sacrifice.
// Run: npx tsx scripts/witty/build-alien.ts
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })

// MAIN: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7! Kxf7
//       7.Nf3 c5 8.Ne5+ Kg8 9.Bc4+ e6 10.O-O Nc6 11.Ng6 Qxd4 12.Qe2
const MAIN: PlySpec[] = [
  { san: 'e4', teach: "Open 1.e4 — Black answers with the Caro-Kann, c6.", prompt: 'Play e4.', hint: 'Pawn e2 to e4.', ok: 'e4.' },
  P('c6'),
  { san: 'd4', teach: "Grab the center with d4.", prompt: 'Play d4.', hint: 'Pawn d2 to d4.', ok: 'd4.' },
  P('d5'),
  { san: 'Nd2', teach: "Develop the knight to d2, heading for e4.", prompt: 'Play Nd2.', hint: 'Knight b1 to d2.', ok: 'Nd2.' },
  P('dxe4'),
  { san: 'Nxe4', teach: "Recapture on e4 — the knight eyes g5 and f7.", prompt: 'Recapture Nxe4.', hint: 'Knight d2 takes e4.', ok: 'Nxe4. Black develops Nf6.' },
  P('Nf6'),
  { san: 'Ng5', teach: "Leap to g5 — the knight stares straight at f7.", prompt: 'Play Ng5.', hint: 'Knight e4 to g5.', ok: 'Ng5! Threatening f7.', arrow: ['g5', 'f7'] },
  P('h6'),
  { san: 'Nxf7', teach: "THE SACRIFICE. Black kicked with h6 — don't retreat, take f7! Nxf7 drags the king out into the open.", prompt: 'Sacrifice — Nxf7!', hint: 'Knight g5 takes f7.', ok: 'Nxf7!! The signature Alien sac. The king must take.', arrow: ['f7', 'h8'] },
  P('Kxf7'),
  { san: 'Nf3', teach: "Develop with tempo — Nf3 heads for e5 and the bare king.", prompt: 'Develop Nf3.', hint: 'Knight g1 to f3.', ok: 'Nf3. The hunt begins.' },
  P('c5'),
  { san: 'Ne5+', teach: "Check! Ne5+ forks into the attack and drives the king back.", prompt: 'Play Ne5+.', hint: 'Knight f3 to e5, check.', ok: 'Ne5+. The king scrambles.' },
  P('Kg8'),
  { san: 'Bc4+', teach: "Another check — Bc4+ rakes the a2-g8 diagonal at the king.", prompt: 'Play Bc4+.', hint: 'Bishop f1 to c4, check.', ok: 'Bc4+. Black must block with e6.' },
  P('e6'),
  { san: 'O-O', teach: "Tuck the king away and bring the rook to the open f-file with O-O.", prompt: 'Castle O-O.', hint: 'Castle kingside.', ok: 'O-O. Rook on f1, attack fully mobilized.' },
  P('Nc6'),
  { san: 'Ng6', teach: "Ng6! The knight forks the h8 rook and keeps the king pinned in the corner.", prompt: 'Play Ng6.', hint: 'Knight e5 to g6.', ok: 'Ng6. Winning the exchange while the attack rolls.', arrow: ['g6', 'h8'] },
  P('Qxd4'),
  { san: 'Qe2', teach: "Keep developing into the attack — Qe2 connects the rooks and eyes the kingside.", prompt: 'Play Qe2.', hint: 'Queen d1 to e2.', ok: "Qe2. A raging attack for the piece — Witty scores ~80% here. Unsound by the engine, brutal in bullet." },
]

const spec: OpeningSpec = {
  id: 'witty-alien',
  slug: 'witty-alien',
  name: 'Alien Gambit',
  description: "Witty_Alien's signature knight sacrifice against the Caro-Kann: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7!! The king is dragged out and hunted. Unsound by the engine, lethal in bullet. Built from his real games (~80% win rate).",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  playerColor: 'white',
  completionOrder: ['wa-1', 'wa-2', 'wa-3', 'wa-4', 'wa-dev-Bf5', 'wa-dev-e6', 'wa-test-1'],
  lines: [
    { id: 'wa-1', title: 'The Caro Setup', type: 'main', teachFrom: 0, row: 0, col: 0, lineFrom: null,
      intro: "The Alien Gambit — Witty's signature f7 knight sacrifice against the Caro-Kann. First, the normal setup.",
      outro: "e4, d4, Nd2 — the standard Caro setup. Black takes on e4 and develops Nf6. Now the trap springs.", plies: MAIN },
    { id: 'wa-2', title: 'The f7 Sacrifice', type: 'main', teachFrom: 6, row: 1, col: 0, lineFrom: 'wa-1',
      intro: "Recapture, jump to g5 aiming at f7, and when Black kicks with h6 — sacrifice the knight on f7.",
      outro: "Nxe4, Ng5, Nxf7!! — a whole knight for the f7 pawn and a king with no cover. Now hunt it.", plies: MAIN },
    { id: 'wa-3', title: 'The King Hunt', type: 'main', teachFrom: 12, row: 2, col: 0, lineFrom: 'wa-2',
      intro: "The king is on f7 with no shelter. Develop with checks — Nf3, Ne5+, Bc4+ — and chase it home.",
      outro: "Nf3, Ne5+, Bc4+ — every move with tempo, driving the king back and piling pieces toward it.", plies: MAIN },
    { id: 'wa-4', title: 'Cash In the Attack', type: 'main', teachFrom: 18, row: 3, col: 0, lineFrom: 'wa-3',
      intro: "King boxed in the corner. Castle to swing the rook onto the f-file, fork with Ng6, and pour the queen in.",
      outro: "O-O, Ng6, Qe2 — winning the exchange with a raging attack for the piece. ~80% in real bullet games.", plies: MAIN },

    // DEV: 5...Bf5 (14%) — no sac; win the bishop pair
    { id: 'wa-dev-Bf5', title: 'If 5...Bf5', type: 'deviation', teachFrom: 10, row: 1, col: -1, lineFrom: 'wa-2',
      intro: "Instead of h6, Black develops the bishop to f5. No sacrifice — just chase the bishop and grab the bishop pair.",
      outro: "N1f3, Nh4, Nxg6 — Black's good bishop is gone and you have a safe, pleasant edge.",
      plies: [ P('e4'), P('c6'), P('d4'), P('d5'), P('Nd2'), P('dxe4'), P('Nxe4'), P('Nf6'), P('Ng5'), P('Bf5'),
        { san: 'N1f3', teach: "Develop the second knight — no sac needed here.", prompt: 'Develop N1f3.', hint: 'Knight g1 to f3.', ok: 'N1f3.' },
        P('Nbd7'),
        { san: 'Nh4', teach: "Reroute to h4, attacking the f5 bishop.", prompt: 'Play Nh4.', hint: 'Knight f3 to h4.', ok: 'Nh4. Hunting the bishop.' },
        P('Bg6'),
        { san: 'Nxg6', teach: "Trade off Black's best piece — Nxg6.", prompt: 'Capture Nxg6.', hint: 'Knight h4 takes g6.', ok: 'Nxg6. Bishop pair won, easy game.' },
        P('hxg6') ] },

    // DEV: 5...e6 (11%) — Black blocks; classic development
    { id: 'wa-dev-e6', title: 'If 5...e6', type: 'deviation', teachFrom: 10, row: 2, col: -1, lineFrom: 'wa-2',
      intro: "Black plays e6 to keep things solid. No sac — develop classically and aim at the kingside.",
      outro: "N1f3, Bd3, Qe2 — smooth development with the bishop pointed at h7. A comfortable attacking setup.",
      plies: [ P('e4'), P('c6'), P('d4'), P('d5'), P('Nd2'), P('dxe4'), P('Nxe4'), P('Nf6'), P('Ng5'), P('e6'),
        { san: 'N1f3', teach: "Develop the second knight.", prompt: 'Develop N1f3.', hint: 'Knight g1 to f3.', ok: 'N1f3.' },
        P('Bd6'),
        { san: 'Bd3', teach: "Aim the bishop at h7 with Bd3 — the classic Caro attacking battery.", prompt: 'Develop Bd3.', hint: 'Bishop f1 to d3.', ok: 'Bd3. Pointed at the king.' },
        P('O-O'),
        { san: 'Qe2', teach: "Bring the queen to e2, supporting ideas of Ng5 and a kingside push.", prompt: 'Play Qe2.', hint: 'Queen d1 to e2.', ok: 'Qe2. Pieces poised for the attack.' },
        P('h6') ] },
  ],
  test: { id: 'wa-test-1', title: 'Lvl 1 Test', row: 4, col: 0, lineFrom: 'wa-4',
    intro: "Test time. Play the Alien Gambit — the f7 sacrifice and king hunt, plus the quiet deviations. No hints.",
    outro: "Level 1 complete. The Alien's Nxf7!! is yours. Go drag a king into the open." },
}

const { tree, lessons } = buildOpening(spec)
writeFileSync(join(process.cwd(), 'data/openings/witty-alien.ts'), serializeTree(tree, 'WITTY_ALIEN'))
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-lessons.ts'), serializeLessons(lessons, 'getWittyAlienLesson', 'WITTY_ALIEN_LESSONS'))
console.log(`Wrote alien: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
