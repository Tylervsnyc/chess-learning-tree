// Rebuilds Bonjour, Danish, Englund, Scandi from witty_alien's REAL games.
// Run: npx tsx scripts/witty/build-batch.ts
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })
const t = (san: string, teach: string, prompt: string, hint: string, ok: string, extra: Partial<PlySpec> = {}): PlySpec =>
  ({ san, teach, prompt, hint, ok, ...extra })

// ════════ BONJOUR — Alien sac vs the French (2,427 games, ~76%) ════════
// 1.e4 e6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7! Kxf7 7.Nf3 Bd6
// 8.Bd3 Rf8 9.O-O Kg8 10.Re1 Nc6 11.c3 Re8 12.Ne5
const BONJOUR: PlySpec[] = [
  t('e4', "Open 1.e4 — Black plays the French with e6.", 'Play e4.', 'Pawn e2-e4.', 'e4.'), P('e6'),
  t('d4', "Take the center with d4.", 'Play d4.', 'Pawn d2-d4.', 'd4.'), P('d5'),
  t('Nd2', "Develop Nd2, heading to e4.", 'Play Nd2.', 'Knight b1-d2.', 'Nd2.'), P('dxe4'),
  t('Nxe4', "Recapture — the knight eyes g5 and f7.", 'Recapture Nxe4.', 'Knight d2xe4.', 'Nxe4.'), P('Nf6'),
  t('Ng5', "Jump to g5, aiming at f7.", 'Play Ng5.', 'Knight e4-g5.', 'Ng5!', { arrow: ['g5', 'f7'] }), P('h6'),
  t('Nxf7', "THE SACRIFICE — same as the Alien, now against the French. Nxf7 rips the king out.", 'Sacrifice Nxf7!', 'Knight g5xf7.', 'Nxf7!! King in the open.', { arrow: ['f7', 'h8'] }), P('Kxf7'),
  t('Nf3', "Develop with tempo toward the bare king.", 'Develop Nf3.', 'Knight g1-f3.', 'Nf3.'), P('Bd6'),
  t('Bd3', "Aim the bishop at h7 — the attacking battery.", 'Develop Bd3.', 'Bishop f1-d3.', 'Bd3.'), P('Rf8'),
  t('O-O', "Castle — rook swings to the open f-file.", 'Castle O-O.', 'Castle kingside.', 'O-O.'), P('Kg8'),
  t('Re1', "Pile the rook onto the e-file behind Black's weak e6 pawn.", 'Play Re1.', 'Rook f1-e1.', 'Re1.'), P('Nc6'),
  t('c3', "Solidify the center with c3, keeping all attackers aimed at the king.", 'Play c3.', 'Pawn c2-c3.', 'c3.'), P('Re8'),
  t('Ne5', "Ne5! The knight crashes in. A raging attack for the piece — ~76% in real games.", 'Play Ne5.', 'Knight f3-e5.', 'Ne5! Unsound by the engine, brutal in bullet.'), P('Bxe5'),
]

// ════════ DANISH — two-pawn gambit (1,406 games) ════════
// 1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2 Bb4+ 6.Nc3 Nf6 7.Nf3 O-O 8.O-O Bxc3 9.Bxc3
const DANISH: PlySpec[] = [
  t('e4', "Open 1.e4 e5.", 'Play e4.', 'Pawn e2-e4.', 'e4.'), P('e5'),
  t('d4', "Strike the center — d4, offering the pawn.", 'Play d4.', 'Pawn d2-d4.', 'd4.'), P('exd4'),
  t('c3', "The Danish! Offer a SECOND pawn with c3 to blast open lines for your bishops.", 'Play c3.', 'Pawn c2-c3.', 'c3! Two pawns for a furious initiative.'), P('dxc3'),
  t('Bc4', "Aim the bishop at f7 — Bc4, the classic Danish battery.", 'Develop Bc4.', 'Bishop f1-c4.', 'Bc4.', { arrow: ['c4', 'f7'] }), P('cxb2'),
  t('Bxb2', "Recapture on b2 — now both bishops rake the long diagonals at Black's king.", 'Play Bxb2.', 'Bishop c1xb2.', 'Bxb2. Two raking bishops for two pawns.', { arrow: ['b2', 'g7'] }), P('Bb4+'),
  t('Nc3', "Block the check with Nc3 — developing toward the king.", 'Play Nc3.', 'Knight b1-c3.', 'Nc3.'), P('Nf6'),
  t('Nf3', "Develop the last knight, eyeing e5 and g5.", 'Develop Nf3.', 'Knight g1-f3.', 'Nf3.'), P('O-O'),
  t('O-O', "Castle and bring the rook toward the center. The gambit pieces are all firing.", 'Castle O-O.', 'Castle kingside.', 'O-O. Full development, two raking bishops, open lines — the Danish dream. Honest: ~50%, but a nightmare to face in bullet.'), P('Bxc3'),
  t('Bxc3', "Recapture toward the center, keeping the dark-square bishop aimed at g7.", 'Play Bxc3.', 'Bishop b2xc3.', 'Bxc3.'), P('Nxe4'),
]

// ════════ ENGLUND — his 2...d6 gambit vs 1.d4 (2,193 games, ~50% honest) ════════
// 1.d4 e5 2.dxe5 d6 3.Nf3 Nc6 4.Bg5 f6 5.exf6 Nxf6 6.Nc3 Be7 7.e3 O-O 8.Bc4+ Kh8 9.O-O Qe8
const ENGLUND: PlySpec[] = [
  P('d4'),
  t('e5', "Witty's gambit vs 1.d4 — e5! Offer the pawn to rip the game open.", 'Play e5.', 'Pawn e7-e5.', 'e5! The gambit.'), P('dxe5'),
  t('d6', "Offer a second pawn with d6 — open lines and a development lead are the goal.", 'Play d6.', 'Pawn d7-d6.', 'd6! Prying the position open.'), P('Nf3'),
  t('Nc6', "Develop with tempo — Nc6 eyes the e5 pawn.", 'Develop Nc6.', 'Knight b8-c6.', 'Nc6.'), P('Bg5'),
  t('f6', "Strike the center back — f6 challenges the e5 pawn and opens the f-file.", 'Play f6.', 'Pawn f7-f6.', 'f6.'), P('exf6'),
  t('Nxf6', "Recapture and develop — Nxf6, knight into the game.", 'Play Nxf6.', 'Knight takes f6.', 'Nxf6. Down a pawn, but flying out.'), P('Nc3'),
  t('Be7', "Develop the bishop and prepare to castle.", 'Develop Be7.', 'Bishop f8-e7.', 'Be7.'), P('e3'),
  t('O-O', "Castle — king safe, rook toward the open f-file.", 'Castle O-O.', 'Castle kingside.', 'O-O. Honest: roughly equal by the engine — but you have all the activity.'), P('Bc4+'),
  t('Kh8', "Tuck the king to h8, off the check and ready to push the f-file.", 'Play Kh8.', 'King g8-h8.', 'Kh8.'), P('O-O'),
  t('Qe8', "Lift the queen toward the kingside — Qe8, heading for h5/g6.", 'Play Qe8.', 'Queen d8-e8.', 'Qe8. The attack gathers.'), P('Nd5'),
]

// ════════ SCANDI — double-pawn gambit (354 games, ~73%+) ════════
// 1.e4 d5 2.exd5 c6 3.dxc6 e5 4.cxb7 Bxb7 5.Nc3 Bc5 6.d3 Nf6
const SCANDI: PlySpec[] = [
  P('e4'),
  t('d5', "The Scandinavian — d5, hitting e4 at once.", 'Play d5.', 'Pawn d7-d5.', 'd5.'), P('exd5'),
  t('c6', "The gambit! c6 offers a pawn to blow the center open.", 'Play c6.', 'Pawn c7-c6.', 'c6! Offering the pawn.'), P('dxc6'),
  t('e5', "Keep gambiting — e5 grabs the center and ignores the c6 pawn. Pure development for material.", 'Play e5.', 'Pawn e7-e5.', 'e5! A second pawn offered for a huge lead.'), P('cxb7'),
  t('Bxb7', "Recapture the b7 pawn — the bishop rakes the long diagonal at g2 and the king.", 'Play Bxb7.', 'Bishop c8xb7.', 'Bxb7. Two pawns down, but every piece comes out screaming.', { arrow: ['b7', 'g2'] }), P('Nc3'),
  t('Bc5', "Develop the bishop to c5, hitting f2 — both bishops now point at the king.", 'Develop Bc5.', 'Bishop f8-c5.', 'Bc5.', { arrow: ['c5', 'f2'] }), P('d3'),
  t('Nf6', "Develop with tempo — Nf6 eyes e4 and g4. Down two pawns, but Witty scores ~73% on raw activity.", 'Develop Nf6.', 'Knight g8-f6.', 'Nf6. Unsound by the engine, lethal in bullet.'), P('Be3'),
]

type Build = { spec: OpeningSpec; tree: string; getter: string; record: string; slug: string }
const builds: Build[] = [
  { slug: 'witty-alien-bonjour', tree: 'WITTY_ALIEN_BONJOUR', getter: 'getWittyAlienBonjourLesson', record: 'WITTY_ALIEN_BONJOUR_LESSONS', spec: {
    id: 'witty-alien-bonjour', slug: 'witty-alien-bonjour', name: 'Bonjour Variation', playerColor: 'white',
    description: "Witty_Alien's Nxf7 knight sacrifice against the French Defense — 'Bonjour!' as the king gets dragged out. Built from his real games (~76% win rate).",
    color: '#8B5CF6', colorDark: '#6D28D9', completionOrder: ['wab-1','wab-2','wab-3','wab-4','wab-test-1'],
    lines: [
      { id:'wab-1', title:'The French Setup', type:'main', teachFrom:0, row:0, col:0, lineFrom:null, plies:BONJOUR,
        intro:"The Bonjour Variation — the Alien Gambit's Nxf7 sacrifice, now against the French Defense.", outro:"e4, d4, Nd2 — the setup. Black develops Nf6 and the sac is loaded." },
      { id:'wab-2', title:'Bonjour! (the f7 sac)', type:'main', teachFrom:6, row:1, col:0, lineFrom:'wab-1', plies:BONJOUR,
        intro:"Recapture, leap to g5, and when Black plays h6 — sacrifice on f7. Bonjour!", outro:"Nxe4, Ng5, Nxf7!! — a knight for the f7 pawn and a naked king." },
      { id:'wab-3', title:'Develop the Attack', type:'main', teachFrom:12, row:2, col:0, lineFrom:'wab-2', plies:BONJOUR,
        intro:"King on f7. Pour pieces in — Nf3, Bd3 at h7, then castle to open the f-file.", outro:"Nf3, Bd3, O-O — every piece aimed at the king, rook on the open file." },
      { id:'wab-4', title:'Crash Through', type:'main', teachFrom:18, row:3, col:0, lineFrom:'wab-3', plies:BONJOUR,
        intro:"Stack the e-file, solidify, and crash in with Ne5.", outro:"Re1, c3, Ne5 — a winning attack for the piece. ~76% in real games." },
    ],
    test: { id:'wab-test-1', title:'Lvl 1 Test', row:4, col:0, lineFrom:'wab-4', intro:"Test time. Play the Bonjour — the f7 sac vs the French. No hints.", outro:"Level 1 complete. Bonjour!" },
  }},
  { slug: 'witty-alien-danish', tree: 'WITTY_ALIEN_DANISH', getter: 'getWittyAlienDanishLesson', record: 'WITTY_ALIEN_DANISH_LESSONS', spec: {
    id: 'witty-alien-danish', slug: 'witty-alien-danish', name: 'Danish Gambit', playerColor: 'white',
    description: "Witty_Alien's two-pawn Danish Gambit: 1.e4 e5 2.d4 exd4 3.c3! Sacrifice two pawns for two raking bishops and a furious initiative. Built from his real games.",
    color: '#8B5CF6', colorDark: '#6D28D9', completionOrder: ['wd-1','wd-2','wd-3','wd-dev-d5','wd-test-1'],
    lines: [
      { id:'wd-1', title:'Two Pawns, Two Bishops', type:'main', teachFrom:0, row:0, col:0, lineFrom:null, plies:DANISH,
        intro:"The Danish Gambit — sacrifice not one but TWO pawns to rip open lines for your bishops.", outro:"e4, d4, c3 — two pawns offered. Black grabs; you build." },
      { id:'wd-2', title:'The Raking Bishops', type:'main', teachFrom:6, row:1, col:0, lineFrom:'wd-1', plies:DANISH,
        intro:"Develop the bishops onto their killer diagonals — Bc4 at f7, Bxb2 at g7.", outro:"Bc4, Bxb2, Nc3 — both bishops raking straight at the Black king." },
      { id:'wd-3', title:'Mobilize', type:'main', teachFrom:12, row:2, col:0, lineFrom:'wd-2', plies:DANISH,
        intro:"Finish development and castle — every piece firing at the king for your two pawns.", outro:"Nf3, O-O, Bxc3 — full mobilization. Honest: ~50%, but brutal to face in bullet." },
      { id:'wd-dev-d5', title:'If 3...d5', type:'deviation', teachFrom:6, row:1, col:-1, lineFrom:'wd-1',
        intro:"Solid players decline the gambit with 3...d5. No problem — push past with e5 and keep a space edge.",
        outro:"e5, Nf3, Bd3 — Black declined, but you have more space and easy development.",
        plies:[ P('e4'),P('e5'),P('d4'),P('exd4'),P('c3'),P('d5'),
          t('e5',"Black declines with d5 — push past it. e5 grabs space and keeps the initiative.",'Play e5.','Pawn e4-e5.','e5! Space and initiative.'), P('dxc3'),
          t('Nf3',"Develop with tempo — Nf3.",'Develop Nf3.','Knight g1-f3.','Nf3.'), P('Nc6'),
          t('Bd3',"Aim the bishop at the kingside — Bd3.",'Develop Bd3.','Bishop f1-d3.','Bd3. Comfortable space and development.'), P('Bg4') ] },
    ],
    test: { id:'wd-test-1', title:'Lvl 1 Test', row:3, col:0, lineFrom:'wd-3', intro:"Test time. Play the Danish two-pawn gambit. No hints.", outro:"Level 1 complete. Two pawns, two bishops, one furious attack." },
  }},
  { slug: 'witty-alien-englund', tree: 'WITTY_ALIEN_ENGLUND', getter: 'getWittyAlienEnglundLesson', record: 'WITTY_ALIEN_ENGLUND_LESSONS', spec: {
    id: 'witty-alien-englund', slug: 'witty-alien-englund', name: 'Englund Gambit', playerColor: 'black',
    description: "Witty_Alien's gambit against 1.d4 — 1...e5! and 2...d6, offering pawns to blow the position open and play on development. Honest: roughly equal, but a fighting weapon.",
    color: '#8B5CF6', colorDark: '#6D28D9', completionOrder: ['weng-1','weng-2','weng-3','weng-dev-c4','weng-test-1'],
    lines: [
      { id:'weng-1', title:'The 1...e5 Gambit', type:'main', teachFrom:1, row:0, col:0, lineFrom:null, plies:ENGLUND,
        intro:"Witty's answer to 1.d4 — strike with e5 and offer a second pawn with d6 to pry the game open.", outro:"e5, d6, Nc6 — two pawns offered for fast, open development." },
      { id:'weng-2', title:'Open the Center', type:'main', teachFrom:7, row:1, col:0, lineFrom:'weng-1', plies:ENGLUND,
        intro:"Hit back at the e5 pawn with f6, recapture, and develop the bishop.", outro:"f6, Nxf6, Be7 — the center is open and your pieces are out." },
      { id:'weng-3', title:'Castle and Press', type:'main', teachFrom:13, row:2, col:0, lineFrom:'weng-2', plies:ENGLUND,
        intro:"Castle, tuck the king, and lift the queen toward the kingside.", outro:"O-O, Kh8, Qe8 — honest, it's roughly equal, but all the activity is yours." },
      { id:'weng-dev-c4', title:'If 2.c4', type:'deviation', teachFrom:3, row:0, col:-1, lineFrom:'weng-1',
        intro:"Instead of taking on e5, White plays 2.c4. Grab the d4 pawn and develop with tempo against the early queen.",
        outro:"exd4, Nc6, Nf6 — you win a tempo on White's queen and come out comfortable.",
        plies:[ P('d4'),P('e5'),P('c4'),
          t('exd4',"White played 2.c4. Take the center pawn — exd4.",'Play exd4.','Pawn e5xd4.','exd4. A pawn in hand.'), P('Qxd4'),
          t('Nc6',"Develop AND hit the queen — Nc6 gains a tempo.",'Develop Nc6.','Knight b8-c6.','Nc6! The queen must move.', { arrow:['c6','d4'] }), P('Qd1'),
          t('Nf6',"Keep developing. The queen got chased home; you're already comfortable.",'Develop Nf6.','Knight g8-f6.','Nf6. Easy, active game.'), P('Nc3') ] },
    ],
    test: { id:'weng-test-1', title:'Lvl 1 Test', row:3, col:0, lineFrom:'weng-3', intro:"Test time. Play Witty's Englund. No hints.", outro:"Level 1 complete. A fighting gambit vs 1.d4." },
  }},
  { slug: 'witty-alien-scandi', tree: 'WITTY_ALIEN_SCANDI', getter: 'getWittyAlienScandiLesson', record: 'WITTY_ALIEN_SCANDI_LESSONS', spec: {
    id: 'witty-alien-scandi', slug: 'witty-alien-scandi', name: 'Scandinavian Gambit', playerColor: 'black',
    description: "Witty_Alien's wild double-pawn Scandinavian: 1.e4 d5 2.exd5 c6! 3.dxc6 e5! Give up TWO pawns for a colossal lead in development. Built from his real games (~73%).",
    color: '#8B5CF6', colorDark: '#6D28D9', completionOrder: ['wsc-1','wsc-2','wsc-dev-Nc3','wsc-test-1'],
    lines: [
      { id:'wsc-1', title:'Two Pawns for a Storm', type:'main', teachFrom:1, row:0, col:0, lineFrom:null, plies:SCANDI,
        intro:"The Scandinavian Gambit — answer 1.e4 with d5, then sacrifice TWO pawns (c6 and the center) for a colossal development lead.", outro:"d5, c6, e5 — two pawns offered, the board blown wide open." },
      { id:'wsc-2', title:'Pieces Screaming Out', type:'main', teachFrom:7, row:1, col:0, lineFrom:'wsc-1', plies:SCANDI,
        intro:"Recapture on b7 with the bishop and pour every piece toward the king.", outro:"Bxb7, Bc5, Nf6 — two pawns down, but Witty wins ~73% on raw activity. Unsound, lethal in bullet." },
      { id:'wsc-dev-Nc3', title:'If 3.Nc3', type:'deviation', teachFrom:5, row:0, col:-1, lineFrom:'wsc-1',
        intro:"White declines the second pawn with 3.Nc3, holding d5. No sac here — just develop and win the pawn back.",
        outro:"Nf6, cxd5, Nc6 — you regain the pawn with a free, comfortable game.",
        plies:[ P('e4'),P('d5'),P('exd5'),P('c6'),P('Nc3'),
          t('Nf6',"White holds d5 with Nc3. Develop and attack it — Nf6.",'Develop Nf6.','Knight g8-f6.','Nf6. Pressuring d5.'), P('d4'),
          t('cxd5',"Win your pawn back — cxd5.",'Play cxd5.','Pawn c6xd5.','cxd5. Material restored.'), P('Nf3'),
          t('Nc6',"Develop with tempo — Nc6. A clean, equal game.",'Develop Nc6.','Knight b8-c6.','Nc6. Comfortable.') ] },
    ],
    test: { id:'wsc-test-1', title:'Lvl 1 Test', row:2, col:0, lineFrom:'wsc-2', intro:"Test time. Play the Scandinavian double-pawn gambit. No hints.", outro:"Level 1 complete. Two pawns gone, a storm in return." },
  }},
]

for (const b of builds) {
  const { tree, lessons } = buildOpening(b.spec)
  writeFileSync(join(process.cwd(), `data/openings/${b.slug}.ts`), serializeTree(tree, b.tree))
  writeFileSync(join(process.cwd(), `data/openings/${b.slug}-lessons.ts`), serializeLessons(lessons, b.getter, b.record))
  console.log(`Wrote ${b.slug}: ${tree.nodes.length} nodes`)
}
