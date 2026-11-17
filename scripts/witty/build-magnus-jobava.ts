// Builds Magnus's Jobava London from Magnus Carlsen's REAL chess.com games
// (blitz, bullet and rapid; his volume is lower than Hikaru's). WHITE opening.
//
// Data: PLAYER=magnuscarlsen npx tsx scripts/witty/fetch-archives.ts 24
//       PLAYER=magnuscarlsen npx tsx scripts/witty/line-tree.ts white "d4 Nf6 Nc3 d5 Bf4" 12 10
// Run:  npx tsx scripts/witty/build-magnus-jobava.ts
//
// Real data (Dec 2024 - Nov 2026, all speeds): 85 games reach the position
// after 3.Bf4, scoring 76.5%. Every opponent reply below is the most common
// real move at that point; every Magnus move is his most common choice.
// Game counts per ply (move-order based) are in the comments.
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })

// MAIN: 1.d4 Nf6 2.Nc3 d5 3.Bf4 (100%, 63 games) a6 (38%) 4.e3 (100%) e6 (46%)
//       5.g4 (82%, 9 of 11) Bb4 (67%) 6.Bg2 (83%) c5 (80%) — then 7.g5 in 3 of 4
const MAIN: PlySpec[] = [
  { san: 'd4', teach: 'Open with 1.d4.', prompt: 'Play d4.', hint: 'Pawn d2 to d4.', ok: 'd4. Black develops Nf6.' },
  P('Nf6'),
  { san: 'Nc3', teach: 'Knight to c3, before the c-pawn moves. This is what makes it the Jobava London: the knight can jump to b5 in one move.', prompt: 'Play Nc3.', hint: 'Knight b1 to c3.', ok: 'Nc3. Black takes the center with d5.' },
  P('d5'),
  { san: 'Bf4', teach: 'Bishop out to f4, the London bishop. It eyes c7, which your knight can also reach from b5.', prompt: 'Play Bf4.', hint: 'Bishop c1 to f4.', ok: 'Bf4. Black plays a6, keeping your knight off b5.', arrow: ['f4', 'c7'] },
  P('a6'),
  { san: 'e3', teach: 'Black stopped Nb5. Play e3, backing up d4 and opening a path for the f1 bishop. One warning: with e2 empty, a Black bishop on g4 would hit your queen. If it comes, block with Be2.', prompt: 'Play e3.', hint: 'Pawn e2 to e3.', ok: 'e3. Black plays e6.' },
  P('e6'),
  { san: 'g4', teach: "Now Magnus's signature: g4! He lunges with the g-pawn in 9 of his 11 games here. Next, g5 kicks the f6 knight.", prompt: 'Lunge with g4.', hint: 'Pawn g2 to g4.', ok: 'g4. Black pins your knight with Bb4.', arrow: ['g4', 'g5'] },
  P('Bb4'),
  { san: 'Bg2', teach: 'Bishop to g2. From there it presses on d5 along the long diagonal.', prompt: 'Play Bg2.', hint: 'Bishop f1 to g2.', ok: 'Bg2. Black strikes back with c5.', arrow: ['g2', 'd5'] },
  P('c5'),
]

const spec: OpeningSpec = {
  id: 'magnus-jobava',
  slug: 'magnus-jobava',
  name: "Magnus's Jobava London",
  description: "Magnus Carlsen's favorite surprise weapon with White: the Jobava London, 1.d4, 2.Nc3 and 3.Bf4. He reached it in 85 games on chess.com over the last two years and scored 77%. Every line here comes from those games.",
  color: '#2563EB',
  colorDark: '#1D4ED8',
  playerColor: 'white',
  completionOrder: ['mj-1', 'mj-2', 'mj-dev-3c5', 'mj-dev-3g6', 'mj-dev-4h6', 'mj-test-1'],
  lines: [
    { id: 'mj-1', title: 'The Jobava Setup', type: 'main', teachFrom: 0, row: 0, col: 0, lineFrom: null,
      intro: "Magnus's Jobava London. He reached this setup in 85 games on chess.com over the last two years and scored 77%. Every move here comes from those games.",
      outro: 'd4, Nc3, Bf4. Knight and bishop both aim at c7, which is why Black plays a6. Next, Magnus goes after the kingside.', plies: MAIN },
    { id: 'mj-2', title: 'The g4 Lunge', type: 'main', teachFrom: 6, row: 1, col: 0, lineFrom: 'mj-1',
      intro: 'Black has stopped your knight with a6 and played a solid e6. Magnus answers by throwing his g-pawn up the board.',
      outro: 'e3, g4, Bg2. In Magnus\'s games, g5 comes next, kicking the f6 knight away from the center.', plies: MAIN },

    // DEV: 3...c5 (29%, 18 games): 4.e3 (100%) cxd4 (94%) 5.exd4 (100%) Bg4 (53%) 6.Be2 (88%) Bxe2 7.Qxe2
    { id: 'mj-dev-3c5', title: 'If 3...c5', type: 'deviation', teachFrom: 6, row: 1, col: 1, lineFrom: 'mj-1',
      intro: 'Black hits your center right away with c5. Magnus keeps it simple.',
      outro: 'e3, exd4, Be2. The bishops come off and your queen lands on e2. Magnus scored 87% in the 26 games that reached 4.e3 here.',
      plies: [ P('d4'), P('Nf6'), P('Nc3'), P('d5'), P('Bf4'), P('c5'),
        { san: 'e3', teach: 'Play e3, backing up d4. Magnus played it every time here.', prompt: 'Play e3.', hint: 'Pawn e2 to e3.', ok: 'e3. Black trades on d4.' },
        P('cxd4'),
        { san: 'exd4', teach: 'Take back with the e-pawn. That opens a path for your f1 bishop.', prompt: 'Capture exd4.', hint: 'Pawn e3 takes d4.', ok: 'exd4. Black develops Bg4, attacking your queen.' },
        P('Bg4'),
        { san: 'Be2', teach: "Black's bishop on g4 attacks your queen. Block it with Be2.", prompt: 'Play Be2.', hint: 'Bishop f1 to e2.', ok: 'Be2. Black trades bishops.' },
        P('Bxe2'), P('Qxe2') ] },

    // DEV: 3...g6 (16%, 10 games): 4.e3 (80%) Bg7 (75%) 5.Nb5 (50%) Na6 (100%) 6.h3 (100%) O-O
    { id: 'mj-dev-3g6', title: 'If 3...g6', type: 'deviation', teachFrom: 6, row: 1, col: -1, lineFrom: 'mj-1',
      intro: "Black fianchettoes with g6 and doesn't stop Nb5. Time for the classic Jobava trick.",
      outro: 'e3, Nb5, h3. Black had to defend c7 with Na6, a clumsy square for a knight.',
      plies: [ P('d4'), P('Nf6'), P('Nc3'), P('d5'), P('Bf4'), P('g6'),
        { san: 'e3', teach: 'Play e3 first. Watch for a Black bishop on g4 hitting your queen now that e2 is empty; if it comes, block with Be2.', prompt: 'Play e3.', hint: 'Pawn e2 to e3.', ok: 'e3. Black puts the bishop on g7.' },
        P('Bg7'),
        { san: 'Nb5', teach: 'The Jobava trick: Nb5! With the f4 bishop behind it, the knight threatens Nxc7+, forking king and rook.', prompt: 'Jump to Nb5.', hint: 'Knight c3 to b5.', ok: 'Nb5. Black has to defend c7 with Na6.', arrow: ['b5', 'c7'] },
        P('Na6'),
        { san: 'h3', teach: 'Play h3. If Black ever attacks your bishop with Nh5, it has a safe square on h2.', prompt: 'Play h3.', hint: 'Pawn h2 to h3.', ok: 'h3. Black castles.' },
        P('O-O') ] },

    // DEV: 4...h6 (42% after 4.e3, 10 games): 5.h4 (80%) c5 (88%) 6.Nf3 (100%) Bg4
    { id: 'mj-dev-4h6', title: 'If 4...h6', type: 'deviation', teachFrom: 6, row: 2, col: 1, lineFrom: 'mj-1',
      intro: 'Black plays h6, so a g4-g5 lunge would meet resistance. Magnus pushes the other pawn instead.',
      outro: 'e3, h4, Nf3. If Black ever plays g5, your h-pawn is ready to take.',
      plies: [ P('d4'), P('Nf6'), P('Nc3'), P('d5'), P('Bf4'), P('a6'),
        { san: 'e3', teach: 'Same start: e3. If a Black bishop ever lands on g4, block with Be2.', prompt: 'Play e3.', hint: 'Pawn e2 to e3.', ok: 'e3. Black plays h6.' },
        P('h6'),
        { san: 'h4', teach: 'Push the h-pawn: h4. If Black plays g5 to chase your bishop, you take with the h-pawn.', prompt: 'Play h4.', hint: 'Pawn h2 to h4.', ok: 'h4. Black hits the center with c5.' },
        P('c5'),
        { san: 'Nf3', teach: 'Develop Nf3, guarding d4.', prompt: 'Play Nf3.', hint: 'Knight g1 to f3.', ok: 'Nf3. Black pins it with Bg4.' },
        P('Bg4') ] },
  ],
  test: { id: 'mj-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'mj-2',
    intro: "Test time. Play Magnus's Jobava London: the g4 main line plus Black's three key alternatives. No hints.",
    outro: "Level 1 complete. You can now play Magnus's Jobava London." },
}

const { tree, lessons } = buildOpening(spec)
const opts = { script: 'scripts/witty/build-magnus-jobava.ts', source: "magnuscarlsen's real chess.com games (blitz, bullet, rapid)" }
writeFileSync(join(process.cwd(), 'data/openings/magnus-jobava.ts'), serializeTree(tree, 'MAGNUS_JOBAVA', opts))
writeFileSync(join(process.cwd(), 'data/openings/magnus-jobava-lessons.ts'), serializeLessons(lessons, 'getMagnusJobavaLesson', 'MAGNUS_JOBAVA_LESSONS', opts))
console.log(`Wrote magnus-jobava: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
