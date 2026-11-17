// Builds Magnus's French Defence from Magnus Carlsen's REAL chess.com games
// (blitz, bullet and rapid). BLACK opening.
//
// Data: PLAYER=magnuscarlsen npx tsx scripts/witty/fetch-archives.ts 24
//       PLAYER=magnuscarlsen npx tsx scripts/witty/line-tree.ts black "e4 e6 d4 d5 e5" 14 10
// Run:  npx tsx scripts/witty/build-magnus-french.ts
//
// Real data (Dec 2024 - Nov 2026, all speeds): 127 games with 1.e4 e6,
// scoring 75.6%. Main line is the Advance (3.e5), White's most common 3rd
// move. Every opponent reply below is the most common real move at that
// point; every Magnus move is his most common choice. Game counts per ply
// (move-order based) are in the comments.
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })

// MAIN: 1.e4 e6 2.d4 (84%) d5 (97%) 3.e5 (33%) c5 (97%) 4.c3 (79%) Nc6 (85%)
//       5.Nf3 (100%) Bd7 (86%) 6.Be2 (74%) cxd4 (86%) 7.cxd4 Nge7 (100%, 12 games)
//       8.Na3 (58%) Nf5 (100%) 9.Nc2 (100%) Be7 (100%, 7 games) 10.O-O
const MAIN: PlySpec[] = [
  P('e4'),
  { san: 'e6', teach: 'Answer 1.e4 with e6, the French Defence. Magnus plays it in about one game in seven against 1.e4.', prompt: 'Play e6.', hint: 'Pawn e7 to e6.', ok: 'e6. White takes the center with d4.' },
  P('d4'),
  { san: 'd5', teach: 'Strike at e4 with d5.', prompt: 'Play d5.', hint: 'Pawn d7 to d5.', ok: 'd5. White pushes past with e5, the Advance Variation.' },
  P('e5'),
  { san: 'c5', teach: "White's pawns point at your kingside. Hit the base of the chain right away: c5 attacks d4.", prompt: 'Play c5.', hint: 'Pawn c7 to c5.', ok: 'c5. White backs up d4 with c3.', arrow: ['c5', 'd4'] },
  P('c3'),
  { san: 'Nc6', teach: 'Develop Nc6. A second attacker on d4.', prompt: 'Play Nc6.', hint: 'Knight b8 to c6.', ok: 'Nc6. White develops Nf3.' },
  P('Nf3'),
  { san: 'Bd7', teach: "Magnus's quiet move: Bd7. The bishop gets out, and the c-file is ready for your rook.", prompt: 'Play Bd7.', hint: 'Bishop c8 to d7.', ok: 'Bd7. White develops Be2.' },
  P('Be2'),
  { san: 'cxd4', teach: 'Trade on d4. That opens the c-file.', prompt: 'Capture cxd4.', hint: 'Pawn c5 takes d4.', ok: 'cxd4. White takes back.' },
  P('cxd4'),
  { san: 'Nge7', teach: 'Knight to e7. It is heading for f5, where it will hit d4.', prompt: 'Play Nge7.', hint: 'Knight g8 to e7.', ok: 'Nge7. White develops Na3.' },
  P('Na3'),
  { san: 'Nf5', teach: 'Nf5. Now both your knights attack d4.', prompt: 'Play Nf5.', hint: 'Knight e7 to f5.', ok: 'Nf5. White guards d4 with Nc2.', arrow: ['f5', 'd4'] },
  P('Nc2'),
  { san: 'Be7', teach: 'Develop Be7 and get ready to castle.', prompt: 'Play Be7.', hint: 'Bishop f8 to e7.', ok: 'Be7. White castles.' },
  P('O-O'),
]

const spec: OpeningSpec = {
  id: 'magnus-french',
  slug: 'magnus-french',
  name: "Magnus's French",
  description: "Magnus Carlsen's French Defence against 1.e4. He played it in 127 games on chess.com over the last two years and scored 76%. Every line here comes from those games.",
  color: '#2563EB',
  colorDark: '#1D4ED8',
  playerColor: 'black',
  completionOrder: ['mf-1', 'mf-2', 'mf-3', 'mf-dev-4nf3', 'mf-dev-3nc3', 'mf-test-1'],
  lines: [
    { id: 'mf-1', title: 'The French', type: 'main', teachFrom: 1, row: 0, col: 0, lineFrom: null,
      intro: "Magnus's French Defence. He played it in 127 games on chess.com over the last two years and scored 76%. Every move here comes from those games.",
      outro: 'e6, d5, c5. White grabbed space with e5, and you are already attacking the base of the pawn chain. One warning: with your e-pawn moved, a White bishop on g5 would hit your queen. If it comes, block with Be7.', plies: MAIN },
    { id: 'mf-2', title: 'Pressure on d4', type: 'main', teachFrom: 7, row: 1, col: 0, lineFrom: 'mf-1',
      intro: 'White defends d4 with c3 and Nf3. Keep piling up on it, Magnus style.',
      outro: 'Nc6, Bd7, cxd4. The c-file is open and d4 is the target.', plies: MAIN },
    { id: 'mf-3', title: 'The Knight on f5', type: 'main', teachFrom: 13, row: 2, col: 0, lineFrom: 'mf-2',
      intro: 'Your other knight joins the attack on d4 by a roundabout route: e7, then f5.',
      outro: 'Nge7, Nf5, Be7. Both knights hit d4 and you are about to castle. Magnus scored 88% in the 16 games that reached 7...Nge7.', plies: MAIN },

    // DEV: 4.Nf3 (21%, 7 games): 4...Nc6 (100%) 5.Bd3 (100%) cxd4 (100%) 6.O-O (100%) Nge7 (57%)
    { id: 'mf-dev-4nf3', title: 'If 4.Nf3', type: 'deviation', teachFrom: 7, row: 1, col: -1, lineFrom: 'mf-1',
      intro: 'White skips c3, plays Nf3 and Bd3, and offers the d4 pawn. Magnus takes it.',
      outro: 'Nc6, cxd4, Nge7. You are a pawn up, and the knight is heading for f5 or g6.',
      plies: [ P('e4'), P('e6'), P('d4'), P('d5'), P('e5'), P('c5'), P('Nf3'),
        { san: 'Nc6', teach: 'Develop Nc6, attacking d4 again.', prompt: 'Play Nc6.', hint: 'Knight b8 to c6.', ok: 'Nc6. White plays Bd3 instead of defending d4.' },
        P('Bd3'),
        { san: 'cxd4', teach: 'White left d4 hanging. Take it.', prompt: 'Capture cxd4.', hint: 'Pawn c5 takes d4.', ok: 'cxd4. White castles.' },
        P('O-O'),
        { san: 'Nge7', teach: 'Develop Nge7. It can go to g6 or f5 next.', prompt: 'Play Nge7.', hint: 'Knight g8 to e7.', ok: 'Nge7. A pawn up, with a solid position.' } ] },

    // DEV: 3.Nc3 (32%, 33 games): Magnus splits 3...Bb4 (12) and 3...Nf6 (11).
    // 3...Nf6 4.Bg5 (55%) dxe4 (100%) 5.Nxe4 Be7 (100%) 6.Bxf6 (67%) gxf6 (100%, 4 games)
    { id: 'mf-dev-3nc3', title: 'If 3.Nc3', type: 'deviation', teachFrom: 5, row: 1, col: 1, lineFrom: 'mf-1',
      intro: 'Against 3.Nc3, Magnus splits almost evenly between Bb4 and Nf6. This is the Nf6 line, where he gives up the center for quick development.',
      outro: 'Nf6, dxe4, Be7. If White takes on f6, Magnus takes back with the g-pawn and gets the bishop pair.',
      plies: [ P('e4'), P('e6'), P('d4'), P('d5'), P('Nc3'),
        { san: 'Nf6', teach: 'Develop Nf6, adding a second attacker on e4.', prompt: 'Play Nf6.', hint: 'Knight g8 to f6.', ok: 'Nf6. White pins it with Bg5.' },
        P('Bg5'),
        { san: 'dxe4', teach: 'Take on e4. This releases the tension and the pin matters less.', prompt: 'Capture dxe4.', hint: 'Pawn d5 takes e4.', ok: 'dxe4. White takes back with the knight.' },
        P('Nxe4'),
        { san: 'Be7', teach: 'Develop Be7, unpinning the knight.', prompt: 'Play Be7.', hint: 'Bishop f8 to e7.', ok: 'Be7. White takes on f6.' },
        P('Bxf6'), P('gxf6') ] },
  ],
  test: { id: 'mf-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'mf-3',
    intro: "Test time. Play Magnus's French: the Advance main line plus 4.Nf3 and 3.Nc3. No hints.",
    outro: "Level 1 complete. You can now play Magnus's French." },
}

const { tree, lessons } = buildOpening(spec)
const opts = { script: 'scripts/witty/build-magnus-french.ts', source: "magnuscarlsen's real chess.com games (blitz, bullet, rapid)" }
writeFileSync(join(process.cwd(), 'data/openings/magnus-french.ts'), serializeTree(tree, 'MAGNUS_FRENCH', opts))
writeFileSync(join(process.cwd(), 'data/openings/magnus-french-lessons.ts'), serializeLessons(lessons, 'getMagnusFrenchLesson', 'MAGNUS_FRENCH_LESSONS', opts))
console.log(`Wrote magnus-french: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
