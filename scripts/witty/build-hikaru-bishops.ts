// Builds Hikaru's Bishop's Opening from Hikaru Nakamura's REAL chess.com
// blitz games. WHITE opening.
//
// Data: PLAYER=hikaru npx tsx scripts/witty/fetch-archives.ts 24
//       PLAYER=hikaru TIME_CLASS=blitz npx tsx scripts/witty/line-tree.ts white "e4 e5 Bc4" 12 10
// Run:  npx tsx scripts/witty/build-hikaru-bishops.ts
//
// Real data (blitz, Dec 2024 - Nov 2026): 140 games with 1.e4 e5 2.Bc4,
// scoring 90%. Every opponent reply below is the most common real move at
// that point; every Hikaru move is his most common choice. Game counts per
// ply are in the comments.
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })

// MAIN: 1.e4 e5 2.Bc4 Nf6 (74%) 3.d3 (98%) Nc6 (43%) 4.Nc3 (89%) Bb4 (46%)
//       5.Ne2 (56%, 10 games) d5 (80%) 6.exd5 (100%) Nxd5 7.O-O (100%, 8 games) Be6
const MAIN: PlySpec[] = [
  { san: 'e4', teach: 'Open with 1.e4.', prompt: 'Play e4.', hint: 'Pawn e2 to e4.', ok: 'e4. Black answers e5.' },
  P('e5'),
  { san: 'Bc4', teach: "Skip Nf3 and put the bishop on c4 right away. Hikaru plays this in about half his blitz games after 1.e4 e5.", prompt: 'Play Bc4.', hint: 'Bishop f1 to c4.', ok: 'Bc4. The bishop already eyes f7. Black develops Nf6.', arrow: ['c4', 'f7'] },
  P('Nf6'),
  { san: 'd3', teach: 'Black\'s knight attacks e4. Defend it calmly with d3.', prompt: 'Play d3.', hint: 'Pawn d2 to d3.', ok: 'd3. Black develops Nc6.' },
  P('Nc6'),
  { san: 'Nc3', teach: 'Develop Nc3. Your f-pawn stays free, because the other knight hasn\'t gone to f3 yet.', prompt: 'Play Nc3.', hint: 'Knight b1 to c3.', ok: 'Nc3. Black pins it with Bb4.' },
  P('Bb4'),
  { san: 'Ne2', teach: "Hikaru's knight goes to e2, not f3. If Black ever takes on c3, this knight can recapture and keep your pawns healthy.", prompt: 'Play Ne2.', hint: 'Knight g1 to e2.', ok: 'Ne2. Black strikes in the center with d5.' },
  P('d5'),
  { san: 'exd5', teach: 'Take on d5.', prompt: 'Capture exd5.', hint: 'Pawn e4 takes d5.', ok: 'exd5. Black takes back with the knight.' },
  P('Nxd5'),
  { san: 'O-O', teach: 'Castle. Your king is safe and your pieces are out. Now you can start using the c4 bishop.', prompt: 'Castle.', hint: 'King e1 to g1.', ok: 'O-O. Black develops Be6 to block your bishop.' },
  P('Be6'),
]

const spec: OpeningSpec = {
  id: 'hikaru-bishops',
  slug: 'hikaru-bishops',
  name: "Hikaru's Bishop's Opening",
  description: "Hikaru Nakamura's quiet weapon against 1...e5: 2.Bc4, the Bishop's Opening. He played it in 140 blitz games on chess.com over the last two years and scored 90%. Every line here comes from those games.",
  color: '#14B8A6',
  colorDark: '#0F766E',
  playerColor: 'white',
  completionOrder: ['hb-1', 'hb-2', 'hb-dev-3c6', 'hb-dev-4bc5', 'hb-test-1'],
  lines: [
    { id: 'hb-1', title: "The Bishop's Opening", type: 'main', teachFrom: 0, row: 0, col: 0, lineFrom: null,
      intro: "Hikaru's 2.Bc4, the Bishop's Opening. He played it in 140 blitz games over the last two years and scored 90%. Every move here comes from those games.",
      outro: 'e4, Bc4, d3. A quiet, solid start with the bishop pointed at f7. Next, Hikaru develops his knights in an unusual way.', plies: MAIN },
    { id: 'hb-2', title: 'Knight to e2', type: 'main', teachFrom: 6, row: 1, col: 0, lineFrom: 'hb-1',
      intro: 'Black pins your c3 knight with Bb4. Hikaru answers with a knight move most players would never think of.',
      outro: 'Nc3, Ne2, exd5. In Hikaru\'s games, he castles next and the position is calm and comfortable for White.', plies: MAIN },

    // DEV: 3...c6 (29%, 30 games): 4.Nf3 (87%) d5 (88%) 5.Bb3 (100%) Bd6 (39%) 6.Nc3 (100%) d4 7.Ne2
    { id: 'hb-dev-3c6', title: 'If 3...c6', type: 'deviation', teachFrom: 6, row: 1, col: -1, lineFrom: 'hb-1',
      intro: 'Black plays c6, getting ready for d5 to kick your bishop. Hikaru develops and steps the bishop back before it gets hit.',
      outro: 'Nf3, Bb3, Nc3. The bishop is tucked on b3, still aiming at f7. Hikaru scored 100% in his 30 blitz games from 3...c6.',
      plies: [ P('e4'), P('e5'), P('Bc4'), P('Nf6'), P('d3'), P('c6'),
        { san: 'Nf3', teach: 'Develop Nf3. It attacks e5.', prompt: 'Play Nf3.', hint: 'Knight g1 to f3.', ok: 'Nf3. Black pushes d5, attacking your bishop.' },
        P('d5'),
        { san: 'Bb3', teach: 'Move the bishop back to b3. It stays on the diagonal aiming at f7.', prompt: 'Play Bb3.', hint: 'Bishop c4 to b3.', ok: 'Bb3. Black develops Bd6.' },
        P('Bd6'),
        { san: 'Nc3', teach: 'Develop Nc3, adding pressure to d5.', prompt: 'Play Nc3.', hint: 'Knight b1 to c3.', ok: 'Nc3. Black pushes d4 to kick the knight.' },
        P('d4'), P('Ne2') ] },

    // DEV: 4...Bc5 (26% after 4.Nc3, 10 games): 5.h3 (80%) d6 (100%) 6.Nge2 (100%) Na5 (63%) 7.O-O (80%) Nxc4 8.dxc4
    { id: 'hb-dev-4bc5', title: 'If 4...Bc5', type: 'deviation', teachFrom: 8, row: 2, col: -1, lineFrom: 'hb-1',
      intro: 'Black develops the bishop to c5 instead of pinning. Hikaru plays h3 first, keeping Black\'s bishop off g4, then the same Ne2 idea.',
      outro: 'h3, Nge2, O-O. If Black takes your bishop with Nxc4, take back with the d-pawn and you are still solid.',
      plies: [ P('e4'), P('e5'), P('Bc4'), P('Nf6'), P('d3'), P('Nc6'), P('Nc3'), P('Bc5'),
        { san: 'h3', teach: 'Play h3. It keeps Black\'s bishop and knight off g4.', prompt: 'Play h3.', hint: 'Pawn h2 to h3.', ok: 'h3. Black plays d6.' },
        P('d6'),
        { san: 'Nge2', teach: 'Same idea as the main line: the knight goes to e2.', prompt: 'Play Nge2.', hint: 'Knight g1 to e2.', ok: 'Nge2. Black goes after your bishop with Na5.' },
        P('Na5'),
        { san: 'O-O', teach: 'Castle. If Black takes the bishop, you recapture with the d-pawn.', prompt: 'Castle.', hint: 'King e1 to g1.', ok: 'O-O. Black takes the bishop with Nxc4.' },
        P('Nxc4'), P('dxc4') ] },
  ],
  test: { id: 'hb-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'hb-2',
    intro: "Test time. Play Hikaru's Bishop's Opening: the main line plus Black's two key alternatives. No hints.",
    outro: "Level 1 complete. You can now play Hikaru's Bishop's Opening." },
}

const { tree, lessons } = buildOpening(spec)
const opts = { script: 'scripts/witty/build-hikaru-bishops.ts', source: "hikaru's real chess.com blitz games" }
writeFileSync(join(process.cwd(), 'data/openings/hikaru-bishops.ts'), serializeTree(tree, 'HIKARU_BISHOPS', opts))
writeFileSync(join(process.cwd(), 'data/openings/hikaru-bishops-lessons.ts'), serializeLessons(lessons, 'getHikaruBishopsLesson', 'HIKARU_BISHOPS_LESSONS', opts))
console.log(`Wrote hikaru-bishops: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
