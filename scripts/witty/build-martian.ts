// Rebuilds the Martian Gambit (witty-alien-martian) from witty_alien's REAL
// games. WHITE opening: the Caro-Kann ...Bf5 line with the Ne6 + Nxf7 double
// knight sacrifice. Run: npx tsx scripts/witty/build-martian.ts
// Real data (24mo): main double-sac line scores ~85% over hundreds of games.
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })

// MAIN: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Bf5 5.Ng5 Bg6 6.N1f3 h6
//       7.Ne6! fxe6 8.Ne5 Bf7 9.Bc4 Nf6 10.Qd3 Nbd7 11.Nxf7! Kxf7 12.Qf5
const MAIN: PlySpec[] = [
  { san: 'e4', teach: "Open 1.e4. Witty's whole arsenal starts here.", prompt: 'Play e4.', hint: 'Pawn e2 to e4.', ok: 'e4. Black answers the Caro-Kann way with c6.' },
  P('c6'),
  { san: 'd4', teach: "Take the full center with d4.", prompt: 'Play d4.', hint: 'Pawn d2 to d4.', ok: 'd4. A big center.' },
  P('d5'),
  { san: 'Nd2', teach: "Develop the knight to d2 — Witty's move order, heading for e4.", prompt: 'Play Nd2.', hint: 'Knight b1 to d2.', ok: 'Nd2. Black grabs on e4.' },
  P('dxe4'),
  { san: 'Nxe4', teach: "Recapture on e4. The knight already eyes g5 and the soft f7 square.", prompt: 'Recapture — Nxe4.', hint: 'Knight d2 takes e4.', ok: 'Nxe4. Now Black pins hopes on the Bf5 developing move.' },
  P('Bf5'),
  { san: 'Ng5', teach: "Ignore the attack on the knight — lunge to g5! It threatens f7 and e6 already.", prompt: 'Jump to Ng5.', hint: 'Knight e4 to g5.', ok: 'Ng5! The Martian is airborne.', arrow: ['g5', 'f7'] },
  P('Bg6'),
  { san: 'N1f3', teach: "Bring the second knight out with N1f3 — both knights now point at the kingside.", prompt: 'Develop N1f3.', hint: 'Knight g1 to f3.', ok: 'N1f3. Two knights loaded.' },
  P('h6'),
  { san: 'Ne6', teach: "THE SACRIFICE. Don't retreat from h6 — plunge into e6! If Black takes (fxe6), the f7 pawn is gone and the king is naked.", prompt: 'Sacrifice — Ne6!', hint: 'Knight g5 to e6.', ok: 'Ne6!! The first knight goes in. Black almost has to take.', arrow: ['e6', 'f7'] },
  P('fxe6'),
  { san: 'Ne5', teach: "The SECOND knight leaps to e5 — hitting g6 and crashing toward f7. The attack rolls.", prompt: 'Leap to Ne5.', hint: 'Knight f3 to e5.', ok: 'Ne5. Both knights have invaded.' },
  P('Bf7'),
  { san: 'Bc4', teach: "Pile on with the bishop — Bc4 nails the e6/f7 weak squares. Everything aims at the king.", prompt: 'Develop Bc4.', hint: 'Bishop f1 to c4.', ok: 'Bc4. The crosshairs are set.' },
  P('Nf6'),
  { san: 'Qd3', teach: "Bring the queen into the hunt — Qd3, eyeing the f5-h7 route to the king.", prompt: 'Play Qd3.', hint: 'Queen d1 to d3.', ok: 'Qd3. The whole army is attacking.' },
  P('Nbd7'),
  { san: 'Nxf7', teach: "THE SECOND SACRIFICE — Nxf7! Rip the king out into the open. After Kxf7 it walks into a storm.", prompt: 'Sacrifice — Nxf7!', hint: 'Knight e5 takes f7.', ok: 'Nxf7!! The king is dragged out.', arrow: ['f7', 'd6'] },
  P('Kxf7'),
  { san: 'Qf5', teach: "Qf5! The queen joins with threats raining on the exposed king. This is the Martian's payoff.", prompt: 'Play Qf5.', hint: 'Queen d3 to f5.', ok: "Qf5. A winning attack for two knights — Witty scores ~85% from here. Unsound by the engine, lethal in bullet." },
  P('Nc5'),
]

const spec: OpeningSpec = {
  id: 'witty-alien-martian',
  slug: 'witty-alien-martian',
  name: 'Martian Gambit',
  description: "Witty_Alien's two-knight sacrifice against the Caro-Kann ...Bf5: 5.Ng5, 7.Ne6!! and 11.Nxf7!! tear open the king. Unsound by the engine, lethal in bullet. Built from his real games (~85% win rate).",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  playerColor: 'white',
  completionOrder: ['wam-1', 'wam-2', 'wam-3', 'wam-4', 'wam-dev-5e6', 'wam-dev-5h6', 'wam-dev-8Bf5', 'wam-test-1'],
  lines: [
    { id: 'wam-1', title: 'The Caro Setup', type: 'main', teachFrom: 0, row: 0, col: 0, lineFrom: null,
      intro: "The Martian Gambit — Witty's two-knight sacrifice against the Caro-Kann. It starts as a normal opening; the fireworks come later.",
      outro: "e4, d4, Nd2 — the standard Caro setup. Now Black takes on e4 and the real plan begins.", plies: MAIN },
    { id: 'wam-2', title: 'Both Knights Loaded', type: 'main', teachFrom: 6, row: 1, col: 0, lineFrom: 'wam-1',
      intro: "Black develops the bishop to f5. Instead of retreating, you throw the knight to g5 and bring the second one out — both aimed at f7.",
      outro: "Nxe4, Ng5, N1f3 — two knights pointed straight at the Black king. Next: the sacrifice.", plies: MAIN },
    { id: 'wam-3', title: 'The First Sacrifice', type: 'main', teachFrom: 12, row: 2, col: 0, lineFrom: 'wam-2',
      intro: "Black kicks with h6. This is the moment — don't retreat. Sacrifice the knight on e6 and rip the king's cover off.",
      outro: "Ne6!!, Ne5, Bc4 — a knight sacrificed, the f7 pawn gone, every piece swarming the king. One sac to go.", plies: MAIN },
    { id: 'wam-4', title: 'The Second Sacrifice', type: 'main', teachFrom: 18, row: 3, col: 0, lineFrom: 'wam-3',
      intro: "The attack is loaded. Bring the queen in, then sacrifice the SECOND knight on f7 to drag the king into a mating net.",
      outro: "Qd3, Nxf7!!, Qf5 — two knights gone, a winning attack in return. The Martian double-sac, ~85% in real bullet games.", plies: MAIN },

    // DEV: 5...e6 (20%) — Black blocks instead of Bg6
    { id: 'wam-dev-5e6', title: 'If 5...e6', type: 'deviation', teachFrom: 10, row: 1, col: -1, lineFrom: 'wam-2',
      intro: "Instead of Bg6, Black plays e6 to blunt the attack. No sac here — just win the bishop pair cleanly.",
      outro: "N1f3, Nh4, Nxg6 — you trade off Black's good bishop and keep a pleasant, safe edge.",
      plies: [ P('e4'), P('c6'), P('d4'), P('d5'), P('Nd2'), P('dxe4'), P('Nxe4'), P('Bf5'), P('Ng5'), P('e6'),
        { san: 'N1f3', teach: "Develop the second knight. No sacrifice this time — Black blocked with e6.", prompt: 'Develop N1f3.', hint: 'Knight g1 to f3.', ok: 'N1f3. Solid development.' },
        P('Nd7'),
        { san: 'Nh4', teach: "Reroute the knight to h4 — it attacks the Bg6 and angles for f5.", prompt: 'Play Nh4.', hint: 'Knight f3 to h4.', ok: 'Nh4. Hunting the bishop.' },
        P('Bg6'),
        { san: 'Nxg6', teach: "Trade off Black's good light-squared bishop — Nxg6.", prompt: 'Capture Nxg6.', hint: 'Knight h4 takes g6.', ok: 'Nxg6. Bishop pair won, comfortable game.' },
        P('hxg6') ] },

    // DEV: 5...h6 (12%) — kicks the g5 knight early; same Nxf7 idea
    { id: 'wam-dev-5h6', title: 'If 5...h6', type: 'deviation', teachFrom: 10, row: 2, col: -1, lineFrom: 'wam-2',
      intro: "Black kicks the knight immediately with h6. Same answer as the Alien Gambit — sacrifice on f7!",
      outro: "Nxf7!, Nf3, Nh4 — same knight sac, same exposed king. You're playing the Alien from a Bf5 start.",
      plies: [ P('e4'), P('c6'), P('d4'), P('d5'), P('Nd2'), P('dxe4'), P('Nxe4'), P('Bf5'), P('Ng5'), P('h6'),
        { san: 'Nxf7', teach: "Don't retreat — sacrifice! Nxf7 drags the king out, exactly like the Alien Gambit.", prompt: 'Sacrifice Nxf7!', hint: 'Knight g5 takes f7.', ok: 'Nxf7!! King in the open.', arrow: ['f7', 'd6'] },
        P('Kxf7'),
        { san: 'Nf3', teach: "Develop with tempo — Nf3 heads into the attack on the bare king.", prompt: 'Develop Nf3.', hint: 'Knight g1 to f3.', ok: 'Nf3. Pieces pour in.' },
        P('Nd7'),
        { san: 'Nh4', teach: "Swing the knight toward f5 and the king — Nh4.", prompt: 'Play Nh4.', hint: 'Knight f3 to h4.', ok: 'Nh4. The hunt continues for two pawns and an open king.' },
        P('Bh7') ] },

    // DEV: 8...Bf5 (38%) — Black retreats the bishop after the Ne6 sac
    { id: 'wam-dev-8Bf5', title: 'If 8...Bf5', type: 'deviation', teachFrom: 16, row: 3, col: -1, lineFrom: 'wam-3',
      intro: "After the Ne6 sac and Ne5, Black retreats the bishop to f5 instead of f7. Kick it and keep the attack rolling.",
      outro: "g4, Bc4, Qe2 — the bishop is chased to h7 and out of play while your attack builds. ~86% here.",
      plies: [ P('e4'), P('c6'), P('d4'), P('d5'), P('Nd2'), P('dxe4'), P('Nxe4'), P('Bf5'), P('Ng5'), P('Bg6'),
        P('N1f3'), P('h6'), P('Ne6'), P('fxe6'), P('Ne5'), P('Bf5'),
        { san: 'g4', teach: "Kick the bishop with the g-pawn — g4 drives it to the edge.", prompt: 'Play g4.', hint: 'Pawn g2 to g4.', ok: 'g4. The bishop runs.' },
        P('Bh7'),
        { san: 'Bc4', teach: "Develop the bishop to c4, hammering e6 and f7.", prompt: 'Develop Bc4.', hint: 'Bishop f1 to c4.', ok: 'Bc4. Crosshairs on the king again.' },
        P('Nd7'),
        { san: 'Qe2', teach: "Bring the queen to e2 — supporting the knight and the attack.", prompt: 'Play Qe2.', hint: 'Queen d1 to e2.', ok: 'Qe2. Black is buried, bishop on h7 out of play.' },
        P('Nxe5') ] },
  ],
  test: { id: 'wam-test-1', title: 'Lvl 1 Test', row: 4, col: 0, lineFrom: 'wam-4',
    intro: "Test time. Play the Martian — the double-knight sacrifice main line plus the key deviations. No hints.",
    outro: "Level 1 complete. The Martian's double sac is yours: Ne6!!, Nxf7!! and a winning attack. Go scare someone in bullet." },
}

const { tree, lessons } = buildOpening(spec)
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-martian.ts'), serializeTree(tree, 'WITTY_ALIEN_MARTIAN'))
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-martian-lessons.ts'), serializeLessons(lessons, 'getWittyAlienMartianLesson', 'WITTY_ALIEN_MARTIAN_LESSONS'))
console.log(`Wrote martian: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
