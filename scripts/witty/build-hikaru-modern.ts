// Builds Hikaru's ...a6 Modern from Hikaru Nakamura's REAL chess.com blitz
// games. BLACK opening (vs 1.e4, plus 1.d4).
//
// Data: PLAYER=hikaru npx tsx scripts/witty/fetch-archives.ts 24
//       PLAYER=hikaru TIME_CLASS=blitz npx tsx scripts/witty/line-tree.ts black "e4 g6 d4 Bg7 Nc3 a6" 12 10
// Run:  npx tsx scripts/witty/build-hikaru-modern.ts
//
// Real data (blitz, Dec 2024 - Nov 2026): 181 games reach 1.e4 g6 2.d4 Bg7
// 3.Nc3 a6, scoring 91%. Every opponent reply below is the most common real
// move at that point; every Hikaru move is his most common choice. Game
// counts per ply are in the comments.
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })

// MAIN (move order 1.e4 g6 2.d4 Bg7 3.Nc3 a6: 152 games):
// 4.Be3 (34%) d6 (83%) 5.Qd2 (47%) Nd7 (75%) 6.O-O-O (33%) b5 (100%, 5 games) 7.f3 (60%) Bb7
const MAIN: PlySpec[] = [
  P('e4'),
  { san: 'g6', teach: "Answer 1.e4 with g6. This is Hikaru's most common reply to 1.e4 in blitz.", prompt: 'Play g6.', hint: 'Pawn g7 to g6.', ok: 'g6. White takes the full center with d4.' },
  P('d4'),
  { san: 'Bg7', teach: 'Put the bishop on g7. It aims down the long diagonal at d4 and the whole White center.', prompt: 'Play Bg7.', hint: 'Bishop f8 to g7.', ok: 'Bg7. White develops with Nc3.', arrow: ['g7', 'd4'] },
  P('Nc3'),
  { san: 'a6', teach: "Now Hikaru's signature: a6. It gets ready for b5, grabbing space on the queenside before you even develop a knight.", prompt: 'Play a6.', hint: 'Pawn a7 to a6.', ok: 'a6. White develops the bishop to e3.' },
  P('Be3'),
  { san: 'd6', teach: 'Play d6. It controls e5 and opens a path for your c8 bishop.', prompt: 'Play d6.', hint: 'Pawn d7 to d6.', ok: 'd6. White brings the queen to d2.' },
  P('Qd2'),
  { san: 'Nd7', teach: 'Knight to d7, not f6. It keeps the g7 bishop\'s diagonal open and can jump to b6 later.', prompt: 'Play Nd7.', hint: 'Knight b8 to d7.', ok: 'Nd7. White castles queenside.' },
  P('O-O-O'),
  { san: 'b5', teach: 'White\'s king just went to the queenside. Push b5 and start the attack right there.', prompt: 'Play b5.', hint: 'Pawn b7 to b5.', ok: 'b5. Your pawns are already marching at the White king. Next comes Bb7.' },
  P('f3'),
  P('Bb7'),
]

const spec: OpeningSpec = {
  id: 'hikaru-modern',
  slug: 'hikaru-modern',
  name: "Hikaru's ...a6 Modern",
  description: "Hikaru Nakamura's go-to answer to 1.e4 in blitz: 1...g6, 2...Bg7 and the odd-looking 3...a6. He reached this position in 181 blitz games on chess.com over the last two years and scored 91%. Every line here comes from those games.",
  color: '#14B8A6',
  colorDark: '#0F766E',
  playerColor: 'black',
  completionOrder: ['hm-1', 'hm-2', 'hm-dev-4f4', 'hm-dev-3nf3', 'hm-dev-1d4', 'hm-test-1'],
  lines: [
    { id: 'hm-1', title: 'The ...a6 Modern', type: 'main', teachFrom: 1, row: 0, col: 0, lineFrom: null,
      intro: "Hikaru's answer to 1.e4: g6, Bg7, and then a6. He reached this position in 181 blitz games over the last two years and scored 91%.",
      outro: 'g6, Bg7, a6. You let White build a big center, then get ready to hit it from the side with b5.', plies: MAIN },
    { id: 'hm-2', title: 'Queenside Rush', type: 'main', teachFrom: 7, row: 1, col: 0, lineFrom: 'hm-1',
      intro: 'White sets up Be3 and Qd2, the most common plan against you. Develop quietly, and when White castles queenside, go straight at that king.',
      outro: 'd6, Nd7, b5. Your pawns are heading for the White king. In Hikaru\'s games, Bb7 comes next to add the bishop to the attack.', plies: MAIN },

    // DEV: 4.f4 (25 games): 4...c6 (92%) 5.Nf3 (91%) d5 (100%) 6.e5 (90%) Bg4 (100%) 7.h3 Bxf3 8.Qxf3 e6 — 95% score
    { id: 'hm-dev-4f4', title: 'If 4.f4', type: 'deviation', teachFrom: 7, row: 1, col: -1, lineFrom: 'hm-1',
      intro: 'White goes aggressive with f4, grabbing even more center. Hikaru switches plans and hits back with c6 and d5.',
      outro: 'c6, d5, Bg4. After 7.h3 Hikaru trades the bishop for the f3 knight and plays e6: a locked center where White\'s big pawns can\'t move.',
      plies: [ P('e4'), P('g6'), P('d4'), P('Bg7'), P('Nc3'), P('a6'), P('f4'),
        { san: 'c6', teach: 'Play c6. It prepares d5 to challenge the e4 pawn.', prompt: 'Play c6.', hint: 'Pawn c7 to c6.', ok: 'c6. White develops Nf3.' },
        P('Nf3'),
        { san: 'd5', teach: 'Now strike: d5, hitting e4.', prompt: 'Play d5.', hint: 'Pawn d7 to d5.', ok: 'd5. White pushes past with e5.' },
        P('e5'),
        { san: 'Bg4', teach: 'Pin the f3 knight with Bg4. That knight is the piece holding White\'s center together.', prompt: 'Play Bg4.', hint: 'Bishop c8 to g4.', ok: 'Bg4. White kicks it with h3.' },
        P('h3'), P('Bxf3'), P('Qxf3'), P('e6') ] },

    // DEV: 3.Nf3 (119 games): 3...a6 (34%) 4.Bd3 (43%) d6 (94%) 5.O-O (63%) Nc6 (70%) 6.c3 (86%) e5
    { id: 'hm-dev-3nf3', title: 'If 3.Nf3', type: 'deviation', teachFrom: 5, row: 2, col: -1, lineFrom: 'hm-1',
      intro: 'White plays Nf3 instead of Nc3. Hikaru plays a6 anyway, then builds up to hit the center with e5.',
      outro: 'a6, d6, Nc6. Next Hikaru strikes in the center with e5.',
      plies: [ P('e4'), P('g6'), P('d4'), P('Bg7'), P('Nf3'),
        { san: 'a6', teach: 'Same idea against Nf3: a6.', prompt: 'Play a6.', hint: 'Pawn a7 to a6.', ok: 'a6. White develops Bd3.' },
        P('Bd3'),
        { san: 'd6', teach: 'Play d6, covering e5.', prompt: 'Play d6.', hint: 'Pawn d7 to d6.', ok: 'd6. White castles.' },
        P('O-O'),
        { san: 'Nc6', teach: 'Develop Nc6. It puts more pressure on d4 and supports e5.', prompt: 'Play Nc6.', hint: 'Knight b8 to c6.', ok: 'Nc6. White props up d4 with c3.' },
        P('c3'), P('e5') ] },

    // DEV: 1.d4 (1,208 Black blitz games vs 1.d4; 1...g6 in 600): 1...g6 2.c4 (36%) Bg7 (92%) 3.Nc3 (44%) d6 (64%) 4.e4 (61%) Nd7
    { id: 'hm-dev-1d4', title: 'Against 1.d4', type: 'deviation', teachFrom: 1, row: 2, col: 1, lineFrom: 'hm-1',
      intro: 'Hikaru plays the same setup against 1.d4. Half his blitz games against 1.d4 start with 1...g6.',
      outro: 'g6, Bg7, d6. The same Modern shape against 1.d4. When White plays e4, Hikaru goes Nd7, just like the main line.',
      plies: [ P('d4'),
        { san: 'g6', teach: 'Against 1.d4, same first move: g6.', prompt: 'Play g6.', hint: 'Pawn g7 to g6.', ok: 'g6. White takes space with c4.' },
        P('c4'),
        { san: 'Bg7', teach: 'Bishop to g7, aiming at d4.', prompt: 'Play Bg7.', hint: 'Bishop f8 to g7.', ok: 'Bg7. White develops Nc3.' },
        P('Nc3'),
        { san: 'd6', teach: 'Play d6. Same Modern shape as against 1.e4.', prompt: 'Play d6.', hint: 'Pawn d7 to d6.', ok: 'd6. White grabs the center with e4.' },
        P('e4'), P('Nd7') ] },
  ],
  test: { id: 'hm-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'hm-2',
    intro: "Test time. Play Hikaru's ...a6 Modern: the main line plus White's three most common alternatives. No hints.",
    outro: "Level 1 complete. You can now play Hikaru's Modern against 1.e4 and 1.d4." },
}

const { tree, lessons } = buildOpening(spec)
const opts = { script: 'scripts/witty/build-hikaru-modern.ts', source: "hikaru's real chess.com blitz games" }
writeFileSync(join(process.cwd(), 'data/openings/hikaru-modern.ts'), serializeTree(tree, 'HIKARU_MODERN', opts))
writeFileSync(join(process.cwd(), 'data/openings/hikaru-modern-lessons.ts'), serializeLessons(lessons, 'getHikaruModernLesson', 'HIKARU_MODERN_LESSONS', opts))
console.log(`Wrote hikaru-modern: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
