// Builds Hikaru's anti-Caro-Kann (2.Nc3, 5.Ng3 and 7.Nf1) from Hikaru
// Nakamura's REAL chess.com blitz AND bullet games. WHITE opening.
// Bullet is included because most of his games in this line are bullet.
//
// Data: PLAYER=hikaru npx tsx scripts/witty/fetch-archives.ts 24
//       PLAYER=hikaru npx tsx scripts/witty/line-tree.ts white "e4 c6 Nc3" 14 10
//       (TIME_CLASS takes one class; the counts below combine blitz + bullet)
// Run:  npx tsx scripts/witty/build-hikaru-caro.ts
//
// Real data (blitz + bullet, Dec 2024 - Nov 2026): 125 games reach the
// 5.Ng3 position; 43 reach 7.Nf1. Every opponent reply below is the most
// common real move at that point; every Hikaru move is his most common
// choice. Game counts per ply (move-order based) are in the comments.
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })

// MAIN: 1.e4 c6 2.Nc3 d5 (93%) 3.Nf3 (96%) dxe4 (62%) 4.Nxe4 Nf6 (94%)
//       5.Ng3 (92%) h5 (44%) 6.Bc4 (100%) h4 (85%) 7.Nf1 (100%, 40 games)
//       h3 (60%) 8.g3 (100%) Bf5 (29%) 9.Ne3 (100%, 7 games) Be4
const MAIN: PlySpec[] = [
  { san: 'e4', teach: 'Open with 1.e4. Black answers with the Caro-Kann.', prompt: 'Play e4.', hint: 'Pawn e2 to e4.', ok: 'e4. Black plays c6, the Caro-Kann.' },
  P('c6'),
  { san: 'Nc3', teach: 'Skip the usual d4. Hikaru develops the knight first with Nc3.', prompt: 'Play Nc3.', hint: 'Knight b1 to c3.', ok: 'Nc3. Black plays d5 anyway.' },
  P('d5'),
  { san: 'Nf3', teach: 'Develop the second knight with Nf3. This is the Two Knights setup against the Caro-Kann.', prompt: 'Play Nf3.', hint: 'Knight g1 to f3.', ok: 'Nf3. Black takes on e4.' },
  P('dxe4'),
  { san: 'Nxe4', teach: 'Take back on e4 with the knight.', prompt: 'Capture Nxe4.', hint: 'Knight c3 takes e4.', ok: 'Nxe4. Black challenges it with Nf6.' },
  P('Nf6'),
  { san: 'Ng3', teach: 'Don\'t trade knights. Step aside to g3. Hikaru keeps more pieces on the board.', prompt: 'Play Ng3.', hint: 'Knight e4 to g3.', ok: 'Ng3. Black pushes h5, threatening to chase the knight.' },
  P('h5'),
  { san: 'Bc4', teach: 'Ignore it and develop: Bc4, aiming at f7.', prompt: 'Play Bc4.', hint: 'Bishop f1 to c4.', ok: 'Bc4. Black pushes h4, attacking your knight.', arrow: ['c4', 'f7'] },
  P('h4'),
  { san: 'Nf1', teach: "Hikaru's strangest move: back to f1! The knight is safe there and can come out again to e3. He played it every single time here.", prompt: 'Retreat Nf1.', hint: 'Knight g3 to f1.', ok: 'Nf1. Black keeps pushing with h3.' },
  P('h3'),
  { san: 'g3', teach: 'Don\'t let Black take on g2. Push past with g3. Now the h3 pawn is cut off.', prompt: 'Play g3.', hint: 'Pawn g2 to g3.', ok: 'g3. Black develops Bf5.' },
  P('Bf5'),
  { san: 'Ne3', teach: 'Bring the knight back out to e3. It hits the f5 bishop.', prompt: 'Play Ne3.', hint: 'Knight f1 to e3.', ok: 'Ne3. Black moves the bishop to e4.' },
  P('Be4'),
]

const spec: OpeningSpec = {
  id: 'hikaru-caro',
  slug: 'hikaru-caro',
  name: "Hikaru's Anti-Caro",
  description: "Hikaru Nakamura's strange answer to the Caro-Kann: 2.Nc3, 3.Nf3, 5.Ng3 and, when Black pushes the h-pawn, the knight retreat 7.Nf1. He reached 5.Ng3 in 125 blitz and bullet games on chess.com over the last two years. Every line here comes from those games.",
  color: '#14B8A6',
  colorDark: '#0F766E',
  playerColor: 'white',
  completionOrder: ['hc-1', 'hc-2', 'hc-3', 'hc-dev-5g6', 'hc-dev-5bg4', 'hc-dev-3bg4', 'hc-test-1'],
  lines: [
    { id: 'hc-1', title: 'Two Knights', type: 'main', teachFrom: 0, row: 0, col: 0, lineFrom: null,
      intro: "Hikaru's answer to the Caro-Kann. He skips d4 and brings both knights out first. Every move here comes from his real blitz and bullet games.",
      outro: 'e4, Nc3, Nf3. Two knights out, and Black has given up the center by taking on e4.', plies: MAIN },
    { id: 'hc-2', title: 'Knight to g3', type: 'main', teachFrom: 6, row: 1, col: 0, lineFrom: 'hc-1',
      intro: 'Take back on e4, then avoid the knight trade. Black will try to chase your knight with the h-pawn.',
      outro: 'Nxe4, Ng3, Bc4. Black pushes h4 to kick the knight. Next comes Hikaru\'s strangest move.', plies: MAIN },
    { id: 'hc-3', title: 'The Nf1 Retreat', type: 'main', teachFrom: 12, row: 2, col: 0, lineFrom: 'hc-2',
      intro: 'Black\'s h-pawn hits your knight on g3. Hikaru doesn\'t go forward. He goes all the way back to f1.',
      outro: 'Nf1, g3, Ne3. The knight went back and came out again, and Black\'s h3 pawn is stuck far from home.', plies: MAIN },

    // DEV: 5...g6 (20%, 22 games): 6.Bc4 (100%) Bg7 7.O-O (86%) O-O 8.Re1 (84%) Nbd7
    { id: 'hc-dev-5g6', title: 'If 5...g6', type: 'deviation', teachFrom: 10, row: 1, col: -1, lineFrom: 'hc-2',
      intro: 'Black fianchettoes with g6 instead of pushing the h-pawn. Develop simply and castle.',
      outro: 'Bc4, O-O, Re1. Everything is developed and the rook backs up a future push in the center.',
      plies: [ P('e4'), P('c6'), P('Nc3'), P('d5'), P('Nf3'), P('dxe4'), P('Nxe4'), P('Nf6'), P('Ng3'), P('g6'),
        { san: 'Bc4', teach: 'Develop Bc4, aiming at f7.', prompt: 'Play Bc4.', hint: 'Bishop f1 to c4.', ok: 'Bc4. Black puts the bishop on g7.' },
        P('Bg7'),
        { san: 'O-O', teach: 'Castle.', prompt: 'Castle.', hint: 'King e1 to g1.', ok: 'O-O. Black castles too.' },
        P('O-O'),
        { san: 'Re1', teach: 'Put the rook on e1, the open file.', prompt: 'Play Re1.', hint: 'Rook f1 to e1.', ok: 'Re1. Black develops Nbd7.' },
        P('Nbd7') ] },

    // DEV: 5...Bg4 (20%, 22 games): 6.Bc4 (77%) e6 (65%) 7.h3 (100%) Bxf3 8.Qxf3 (100%) Nbd7
    { id: 'hc-dev-5bg4', title: 'If 5...Bg4', type: 'deviation', teachFrom: 10, row: 2, col: -1, lineFrom: 'hc-2',
      intro: 'Black pins your f3 knight with Bg4. Develop, then ask the bishop what it wants with h3.',
      outro: 'Bc4, h3, Qxf3. You get the bishop pair and your queen is active. Hikaru scored 100% in these games.',
      plies: [ P('e4'), P('c6'), P('Nc3'), P('d5'), P('Nf3'), P('dxe4'), P('Nxe4'), P('Nf6'), P('Ng3'), P('Bg4'),
        { san: 'Bc4', teach: 'Develop Bc4 anyway. If Black takes on f3 instead of e6, just take back with the queen.', prompt: 'Play Bc4.', hint: 'Bishop f1 to c4.', ok: 'Bc4. Black plays e6.' },
        P('e6'),
        { san: 'h3', teach: 'Kick the bishop with h3.', prompt: 'Play h3.', hint: 'Pawn h2 to h3.', ok: 'h3. Black trades the bishop for your knight.' },
        P('Bxf3'),
        { san: 'Qxf3', teach: 'Take back with the queen. Now you have both bishops.', prompt: 'Capture Qxf3.', hint: 'Queen d1 takes f3.', ok: 'Qxf3. Black develops Nbd7.' },
        P('Nbd7') ] },

    // DEV: 3...Bg4 (22%, 45 games): 4.h3 (100%) Bxf3 (87%) 5.Qxf3 (100%) e6 (87%) 6.g3 (65%) Nf6 7.Bg2
    { id: 'hc-dev-3bg4', title: 'If 3...Bg4', type: 'deviation', teachFrom: 6, row: 1, col: 1, lineFrom: 'hc-1',
      intro: 'Black pins the f3 knight right away. Hikaru kicks it immediately, takes back with the queen, and fianchettoes.',
      outro: 'h3, Qxf3, g3. Next comes Bg2, and you have the bishop pair.',
      plies: [ P('e4'), P('c6'), P('Nc3'), P('d5'), P('Nf3'), P('Bg4'),
        { san: 'h3', teach: 'Kick the bishop with h3.', prompt: 'Play h3.', hint: 'Pawn h2 to h3.', ok: 'h3. Black takes your knight.' },
        P('Bxf3'),
        { san: 'Qxf3', teach: 'Take back with the queen.', prompt: 'Capture Qxf3.', hint: 'Queen d1 takes f3.', ok: 'Qxf3. Black plays e6.' },
        P('e6'),
        { san: 'g3', teach: 'Play g3, making room for the bishop on g2.', prompt: 'Play g3.', hint: 'Pawn g2 to g3.', ok: 'g3. Black develops Nf6.' },
        P('Nf6'), P('Bg2') ] },
  ],
  test: { id: 'hc-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'hc-3',
    intro: "Test time. Play Hikaru's Anti-Caro: the Nf1 main line plus Black's three key alternatives. No hints.",
    outro: "Level 1 complete. You can now play Hikaru's Anti-Caro, Nf1 retreat included." },
}

const { tree, lessons } = buildOpening(spec)
const opts = { script: 'scripts/witty/build-hikaru-caro.ts', source: "hikaru's real chess.com blitz and bullet games" }
writeFileSync(join(process.cwd(), 'data/openings/hikaru-caro.ts'), serializeTree(tree, 'HIKARU_CARO', opts))
writeFileSync(join(process.cwd(), 'data/openings/hikaru-caro-lessons.ts'), serializeLessons(lessons, 'getHikaruCaroLesson', 'HIKARU_CARO_LESSONS', opts))
console.log(`Wrote hikaru-caro: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
