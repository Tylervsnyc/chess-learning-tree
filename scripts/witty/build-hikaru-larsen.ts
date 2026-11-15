// Builds Hikaru's 1.b3 (Nimzo-Larsen Attack) from Hikaru Nakamura's REAL
// chess.com blitz games. WHITE opening. Pilot for player-specific openings.
//
// Data: PLAYER=hikaru npx tsx scripts/witty/fetch-archives.ts 24
//       PLAYER=hikaru TIME_CLASS=blitz npx tsx scripts/witty/line-tree.ts white "b3 e5" 14 10
// Run:  npx tsx scripts/witty/build-hikaru-larsen.ts
//
// Real data (blitz, Dec 2024 - Nov 2026): 1.b3 in 1,693 of his 3,887 White
// blitz games (44%), scoring 93%. Replies: 1...d5 29%, 1...e5 26%, 1...Nf6 24%.
// Every opponent reply below is the most common real move at that point;
// every Hikaru move is his most common choice. Game counts per ply are in
// the comments.
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })

// MAIN vs 1...e5 (441 games):
// 1.b3 e5 2.Bb2 Nc6 (90%) 3.c4 (61%) Nf6 (67%) 4.Nf3 (48%) e4 (67%)
// 5.Nd4 (100%, 52 games) Bc5 (60%) 6.Nf5 (100%) O-O (77%) 7.Ng3 (88%, 21 games)
// Re8 (81%) 8.e3 (59%) d5 (50%) 9.Bxf6 (80%, 4 of 5 games) Qxf6
const MAIN: PlySpec[] = [
  { san: 'b3', teach: "Open with 1.b3. This is Hikaru's move: he plays it in over 40% of his White blitz games.", prompt: 'Play b3.', hint: 'Pawn b2 to b3.', ok: 'b3. Black grabs the center with e5.' },
  P('e5'),
  { san: 'Bb2', teach: 'Put the bishop on b2. It looks down the long diagonal straight at e5 and g7.', prompt: 'Play Bb2.', hint: 'Bishop c1 to b2.', ok: 'Bb2. The e5 pawn is already under fire. Black defends it with Nc6.', arrow: ['b2', 'e5'] },
  P('Nc6'),
  { san: 'c4', teach: 'Grab space on the queenside with c4. Hikaru picks this most of the time here.', prompt: 'Play c4.', hint: 'Pawn c2 to c4.', ok: 'c4. Black develops the knight to f6.' },
  P('Nf6'),
  { san: 'Nf3', teach: 'Develop the knight to f3. It hits e5, which only the c6 knight defends.', prompt: 'Play Nf3.', hint: 'Knight g1 to f3.', ok: 'Nf3. Black kicks it with e4.' },
  P('e4'),
  { san: 'Nd4', teach: "Don't retreat. Jump into the center with Nd4. Hikaru played this in every one of his games here.", prompt: 'Jump to Nd4.', hint: 'Knight f3 to d4.', ok: 'Nd4. Black develops the bishop to c5, hitting your knight.' },
  P('Bc5'),
  { san: 'Nf5', teach: 'The c5 bishop attacks your knight. Hop again, to f5. From there it eyes g7 and d6.', prompt: 'Hop to Nf5.', hint: 'Knight d4 to f5.', ok: 'Nf5. Black castles.' },
  P('O-O'),
  { san: 'Ng3', teach: 'One more hop: Ng3. Now the knight attacks the e4 pawn Black pushed so far forward.', prompt: 'Play Ng3.', hint: 'Knight f5 to g3.', ok: 'Ng3. Black defends e4 with Re8.', arrow: ['g3', 'e4'] },
  P('Re8'),
  { san: 'e3', teach: 'A quiet move: e3. It stops the e-pawn from going any further and opens a path for your f1 bishop.', prompt: 'Play e3.', hint: 'Pawn e2 to e3.', ok: 'e3. Black hits back in the center with d5.' },
  P('d5'),
  { san: 'Bxf6', teach: 'Now take the f6 knight. It was defending e4. After the recapture, Nc3 hits e4 a second time.', prompt: 'Capture Bxf6.', hint: 'Bishop b2 takes f6.', ok: 'Bxf6. Black recaptures with the queen. Next comes Nc3, and e4 is under heavy pressure.' },
  P('Qxf6'),
]

const spec: OpeningSpec = {
  id: 'hikaru-larsen',
  slug: 'hikaru-larsen',
  name: "Hikaru's 1.b3",
  description: "Hikaru Nakamura's favorite blitz weapon: 1.b3, the Nimzo-Larsen Attack. He has played it in 1,693 blitz games on chess.com over the last two years and scored 93%. Every line here comes from those games.",
  color: '#14B8A6',
  colorDark: '#0F766E',
  playerColor: 'white',
  completionOrder: ['hl-1', 'hl-2', 'hl-3', 'hl-dev-3g6', 'hl-dev-1d5', 'hl-dev-1nf6', 'hl-test-1'],
  lines: [
    { id: 'hl-1', title: 'The Larsen Setup', type: 'main', teachFrom: 0, row: 0, col: 0, lineFrom: null,
      intro: "Hikaru's 1.b3, the Nimzo-Larsen Attack. He has played it in 1,693 blitz games on chess.com over the last two years and scored 93%. Every move here comes from those games.",
      outro: 'b3, Bb2, c4. The bishop owns the long diagonal and you have space on the queenside. Next, Black pushes e4 and your knight starts hopping.', plies: MAIN },
    { id: 'hl-2', title: 'Knight Hops', type: 'main', teachFrom: 6, row: 1, col: 0, lineFrom: 'hl-1',
      intro: "Black's knight lands on f6. You develop yours, Black pushes e4 to kick it, and instead of retreating your knight goes forward.",
      outro: 'Nf3, Nd4, Nf5. Three knight moves, each one dodging an attack and getting more active. Next, the knight goes after the e4 pawn.', plies: MAIN },
    { id: 'hl-3', title: 'Win the e4 Fight', type: 'main', teachFrom: 12, row: 2, col: 0, lineFrom: 'hl-2',
      intro: "Black's e4 pawn is far from home. Your knight swings to g3 to attack it, and the b2 bishop removes one of its defenders.",
      outro: "Ng3, e3, Bxf6. You gave up the long bishop to win the fight for e4. In Hikaru's games, Nc3 comes next and the knight takes back on e4.", plies: MAIN },

    // DEV: 3...g6 (19% after 3.c4, 45 games) — Hikaru fianchettoes too.
    // 4.g3 (80%) Bg7 (100%) 5.Bg2 (100%) Nge7 (72%) 6.Nc3 (100%) O-O (81%) — 96% score
    { id: 'hl-dev-3g6', title: 'If 3...g6', type: 'deviation', teachFrom: 6, row: 1, col: -1, lineFrom: 'hl-1',
      intro: 'Black answers c4 with g6, getting ready to put a bishop on g7. Hikaru copies the idea on his side of the board.',
      outro: 'g3, Bg2, Nc3. Both your bishops sit on long diagonals and you control d5. Hikaru scores 96% from here.',
      plies: [ P('b3'), P('e5'), P('Bb2'), P('Nc6'), P('c4'), P('g6'),
        { san: 'g3', teach: 'Copy the idea with g3. It makes room for your other bishop.', prompt: 'Play g3.', hint: 'Pawn g2 to g3.', ok: 'g3. Black puts the bishop on g7.' },
        P('Bg7'),
        { san: 'Bg2', teach: 'Bishop to g2. Now both your bishops sit on long diagonals.', prompt: 'Play Bg2.', hint: 'Bishop f1 to g2.', ok: 'Bg2. Black develops with Nge7.' },
        P('Nge7'),
        { san: 'Nc3', teach: 'Develop Nc3. Together with c4 and the g2 bishop it controls d5, the key square in the center.', prompt: 'Play Nc3.', hint: 'Knight b1 to c3.', ok: 'Nc3. Black castles.' },
        P('O-O') ] },

    // DEV: 1...d5 (29%, 495 games) 2.Bb2 Nf6 (36%) 3.d3 (71%) c5 (29%)
    // 4.Nd2 (62%) Nc6 (96%) 5.Ngf3 (82%) g6 (39%)
    { id: 'hl-dev-1d5', title: 'If 1...d5', type: 'deviation', teachFrom: 4, row: 1, col: 1, lineFrom: 'hl-1',
      intro: "Black's most common answer to 1.b3 is 1...d5. Hikaru doesn't race for the center with pawns. He builds a small, solid setup and lets Black come to him.",
      outro: 'd3, Nd2, Ngf3. A compact setup that controls e4, while the b2 bishop does the long-range work.',
      plies: [ P('b3'), P('d5'), P('Bb2'), P('Nf6'),
        { san: 'd3', teach: "Play d3. It covers e4, so Black's knight can't jump there.", prompt: 'Play d3.', hint: 'Pawn d2 to d3.', ok: 'd3. Black takes space with c5.' },
        P('c5'),
        { san: 'Nd2', teach: 'Knight to d2, not c3. It also covers e4 and keeps your c-pawn free to move.', prompt: 'Play Nd2.', hint: 'Knight b1 to d2.', ok: 'Nd2. Black develops with Nc6.' },
        P('Nc6'),
        { san: 'Ngf3', teach: 'Bring out the other knight: Ngf3.', prompt: 'Play Ngf3.', hint: 'Knight g1 to f3.', ok: 'Ngf3. Black plays g6.' },
        P('g6') ] },

    // DEV: 1...Nf6 (24%, 407 games) 2.Bb2 g6 (59%) 3.d4 (56%) Bg7 (99%)
    // 4.Nf3 (83%) O-O (78%) 5.e3 (91%) d6 (39%)
    { id: 'hl-dev-1nf6', title: 'If 1...Nf6 2.Bb2 g6', type: 'deviation', teachFrom: 4, row: 2, col: 1, lineFrom: 'hl-1',
      intro: 'Against 1...Nf6 and 2...g6, Black wants the g7 bishop to fight your b2 bishop. Hikaru switches plans and takes the center with d4.',
      outro: 'd4, Nf3, e3. A solid center that blunts the g7 bishop. From here Hikaru plays Be2 and castles.',
      plies: [ P('b3'), P('Nf6'), P('Bb2'), P('g6'),
        { san: 'd4', teach: 'Push d4. The bishop Black is about to put on g7 will run into this pawn.', prompt: 'Play d4.', hint: 'Pawn d2 to d4.', ok: 'd4. Black puts the bishop on g7 anyway.' },
        P('Bg7'),
        { san: 'Nf3', teach: 'Develop Nf3. It guards d4 and covers e5.', prompt: 'Play Nf3.', hint: 'Knight g1 to f3.', ok: 'Nf3. Black castles.' },
        P('O-O'),
        { san: 'e3', teach: 'Play e3. Your center is solid, and the f1 bishop can come out.', prompt: 'Play e3.', hint: 'Pawn e2 to e3.', ok: 'e3. Black plays d6.' },
        P('d6') ] },
  ],
  test: { id: 'hl-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'hl-3',
    intro: "Test time. Play Hikaru's 1.b3: the main line against 1...e5 plus the three key replies. No hints.",
    outro: "Level 1 complete. You can now play Hikaru's 1.b3 against Black's three most common replies." },
}

const { tree, lessons } = buildOpening(spec)
const opts = { script: 'scripts/witty/build-hikaru-larsen.ts', source: "hikaru's real chess.com blitz games" }
writeFileSync(join(process.cwd(), 'data/openings/hikaru-larsen.ts'), serializeTree(tree, 'HIKARU_LARSEN', opts))
writeFileSync(join(process.cwd(), 'data/openings/hikaru-larsen-lessons.ts'), serializeLessons(lessons, 'getHikaruLarsenLesson', 'HIKARU_LARSEN_LESSONS', opts))
console.log(`Wrote hikaru-larsen: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
