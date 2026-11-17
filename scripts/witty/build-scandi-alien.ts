// Builds "Alien vs Scandinavian" (witty-alien-scandi-alien) from witty_alien's REAL games.
// WHITE: 1.e4 d5 2.Nc3!? — he doesn't take on d5, he invites 2...dxe4 and then
// plays the SAME Ng5 / Nxf7!! sacrifice as the Alien Gambit.
// Source: ~24.9k chess.com games, Dec 2025–Nov 2026 (rows.json, custom positions excluded).
//   1.e4 d5 2.Nc3                          1,036 games, 74%
//   2...dxe4 3.Nxe4                          503 games, 72%
//   3...Nf6 4.Ng5                            302 games, 77%
//   4...h6 5.Nxf7! Kxf7 6.Nf3                114 games, 82%   ← the signature sac
//   6...Nc6 7.d4 (35, 66%) e6 8.Bd3 (12) Bd6 9.O-O (7)   ← thin past move 7; honest
//   DEV 4...e6 5.d4 (72, 70%) Be7 6.N1f3 (24) O-O 7.Bd3 (15, 70%)
//   DEV 2...d4 3.Bc4 (340, 76%) e5 4.Qh5 (96, 91%) g6 5.Qxe5+ (39, 95%) Qe7 6.Qxh8 (11, 91%)
//       (3.Bc4 itself is a gambit: engine -2.2 after 3...dxc3 — 145 games, 72%.
//        The trap: after 3...e5? 4.Qh5! threatens Qxf7#, engine +3.4 after 4...g6.)
// Engine (app's SF18 wasm, d16): after 6.Nf3 ≈ -1.9 (unsound, like the Alien); 4...e6 line ≈ equal.
// Run: npx tsx scripts/witty/build-scandi-alien.ts
import { writeFileSync } from 'fs'
import { join } from 'path'
import { buildOpening, serializeTree, serializeLessons, type OpeningSpec, type PlySpec } from './lib/build-opening'

const P = (san: string): PlySpec => ({ san })
const t = (san: string, teach: string, prompt: string, hint: string, ok: string, extra: Partial<PlySpec> = {}): PlySpec =>
  ({ san, teach, prompt, hint, ok, ...extra })

// MAIN: 1.e4 d5 2.Nc3 dxe4 3.Nxe4 Nf6 4.Ng5 h6 5.Nxf7! Kxf7 6.Nf3 Nc6 7.d4 e6 8.Bd3 Bd6 9.O-O
const MAIN: PlySpec[] = [
  t('e4', "Open 1.e4 — Black answers with the Scandinavian, d5, hitting your pawn.", 'Play e4.', 'Pawn e2-e4.', 'e4.'), P('d5'),
  t('Nc3', "Don't take on d5. Witty plays Nc3 — defend e4 and dare Black to grab it.", 'Play Nc3.', 'Knight b1-c3.', 'Nc3. Inviting dxe4.'), P('dxe4'),
  t('Nxe4', "Recapture with the knight. Look familiar? It's the same knight on e4 as the Alien Gambit — now it eyes g5 and f7.", 'Recapture Nxe4.', 'Knight c3 takes e4.', 'Nxe4. Black develops Nf6.'), P('Nf6'),
  t('Ng5', "Leap to g5 — exactly like the Alien. The knight stares straight at f7.", 'Play Ng5.', 'Knight e4-g5.', 'Ng5! Threatening f7.', { arrow: ['g5', 'f7'] }), P('h6'),
  t('Nxf7', "THE ALIEN SAC. Black kicked with h6 — don't retreat, take f7! Nxf7 drags the king into the open.", 'Sacrifice — Nxf7!', 'Knight g5 takes f7.', 'Nxf7!! Same sac, different opening. The king must take.', { arrow: ['f7', 'h8'] }), P('Kxf7'),
  t('Nf3', "Develop with tempo toward the bare king — Nf3 heads for e5.", 'Develop Nf3.', 'Knight g1-f3.', 'Nf3. A knight down, but the hunt is on. Witty scores 82% from here.'), P('Nc6'),
  t('d4', "Grab the center with d4 — it takes e5 away from the c6 knight and opens your c1 bishop.", 'Play d4.', 'Pawn d2-d4.', 'd4.'), P('e6'),
  t('Bd3', "Aim the bishop at g6 and h7 — Bd3, pointed at the king's shelter.", 'Develop Bd3.', 'Bishop f1-d3.', 'Bd3. Pointed at the king.'), P('Bd6'),
  t('O-O', "Castle — the rook lands on the half-open f-file, right under the king.", 'Castle O-O.', 'Castle kingside.', "O-O. Every piece aimed at the king. Honest: the engine says Black is better — but bullet players rarely survive it."),
]

// DEV 4...e6 — Black blocks the diagonal; no sac yet.
const DEV_E6: PlySpec[] = [
  P('e4'), P('d5'), P('Nc3'), P('dxe4'), P('Nxe4'), P('Nf6'), P('Ng5'), P('e6'),
  t('d4', "Black played e6 instead of h6 — the f7 pawn is guarded and there's nothing to sac yet. Take the center with d4.", 'Play d4.', 'Pawn d2-d4.', 'd4.'), P('Be7'),
  t('N1f3', "Develop the second knight. Keep the g5 knight where it is — it still stares at f7 and h7.", 'Develop N1f3.', 'Knight g1-f3.', 'N1f3.'), P('O-O'),
  t('Bd3', "Bd3 — bishop and g5 knight both aim at h7. If Black ever plays h6, the Nxf7 sac is back on.", 'Develop Bd3.', 'Bishop f1-d3.', 'Bd3. A comfortable attacking setup — roughly equal by the engine.', { arrow: ['d3', 'h7'] }),
]

// DEV 2...d4 — the Qh5 trap.
const DEV_D4: PlySpec[] = [
  P('e4'), P('d5'), P('Nc3'), P('d4'),
  t('Bc4', "Black pushes d4 and hits your knight. Witty doesn't move it — Bc4! aims at f7 and offers the knight. (Honest: if Black just takes dxc3, it's a real gambit — engine says Black is better.)", 'Play Bc4.', 'Bishop f1-c4.', 'Bc4! Pointed at f7.', { arrow: ['c4', 'f7'] }), P('e5'),
  t('Qh5', "Black got greedy with e5 — now Qh5! threatens Qxf7 checkmate AND hits the e5 pawn.", 'Play Qh5.', 'Queen d1-h5.', 'Qh5! Mate on f7 is threatened.', { arrow: ['h5', 'f7'] }), P('g6'),
  t('Qxe5+', "g6 stops the mate and kicks the queen — but it leaves e5 hanging. Qxe5+ with check, and the queen also stares at the h8 rook.", 'Take with check — Qxe5+.', 'Queen h5 takes e5.', 'Qxe5+! Check — and a fork on h8.', { arrow: ['e5', 'h8'] }), P('Qe7'),
  t('Qxh8', "Black blocks with the queen. The rook in the corner is free — grab it! Qxh8.", 'Grab the rook — Qxh8.', 'Queen e5 takes h8.', "Qxh8! A whole rook up. Witty wins 91% of the games where Black falls for 3...e5."),
  P('dxc3'),
]

const spec: OpeningSpec = {
  id: 'witty-alien-scandi-alien',
  slug: 'witty-alien-scandi-alien',
  name: 'Alien vs Scandinavian',
  description: "Witty_Alien's answer to 1...d5: skip 2.exd5, play 2.Nc3 and invite 2...dxe4 — then the SAME Ng5 / Nxf7!! sacrifice as the Alien Gambit. Plus the Qh5 trap if Black pushes 2...d4. Built from his real games (1,036 games, ~74%).",
  color: '#8B5CF6',
  colorDark: '#6D28D9',
  playerColor: 'white',
  completionOrder: ['wsa-1', 'wsa-2', 'wsa-3', 'wsa-dev-e6', 'wsa-dev-d4', 'wsa-test-1'],
  lines: [
    { id: 'wsa-1', title: 'Invite the Capture', type: 'main', teachFrom: 0, row: 0, col: 0, lineFrom: null, plies: MAIN,
      intro: "Black plays the Scandinavian, 1...d5. Witty doesn't trade — he plays 2.Nc3 and lets Black take on e4.",
      outro: "e4, Nc3, Nxe4 — your knight sits on e4, the exact spot it reaches in the Alien Gambit. You know what's next." },
    { id: 'wsa-2', title: 'The Alien Sac Returns', type: 'main', teachFrom: 6, row: 1, col: 0, lineFrom: 'wsa-1', plies: MAIN,
      intro: "Same plan as the Alien Gambit: jump to g5, and when Black kicks with h6 — sacrifice on f7.",
      outro: "Ng5, Nxf7!!, Nf3 — a knight for a pawn and a naked king. Witty scores 82% in these 114 games." },
    { id: 'wsa-3', title: 'Aim Everything at the King', type: 'main', teachFrom: 12, row: 2, col: 0, lineFrom: 'wsa-2', plies: MAIN,
      intro: "King on f7, no shelter. Take the center, aim the bishop, and castle the rook onto the f-file.",
      outro: "d4, Bd3, O-O — every piece pointed at the king. Unsound by the engine, brutal in bullet." },
    { id: 'wsa-dev-e6', title: 'If 4...e6', type: 'deviation', teachFrom: 8, row: 1, col: -1, lineFrom: 'wsa-2', plies: DEV_E6,
      intro: "Instead of h6, Black plays e6 and guards f7. No sacrifice — build the attack and wait for h6.",
      outro: "d4, N1f3, Bd3 — solid and aimed at h7. If Black ever plays h6, Nxf7 is back on the menu." },
    { id: 'wsa-dev-d4', title: 'The Qh5 Trap (2...d4)', type: 'deviation', teachFrom: 4, teachCount: 4, row: 0, col: -1, lineFrom: 'wsa-1', plies: DEV_D4,
      intro: "Sometimes Black skips dxe4 and pushes 2...d4, hitting your knight. Witty answers Bc4 — and if Black gets greedy with e5, the queen comes in.",
      outro: "Bc4, Qh5, Qxe5+, Qxh8 — a rook up by move six. 91% for Witty when Black walks into it." },
  ],
  test: { id: 'wsa-test-1', title: 'Lvl 1 Test', row: 3, col: 0, lineFrom: 'wsa-3',
    intro: "Test time. Play the Alien vs the Scandinavian — the f7 sac, the 4...e6 setup, and the Qh5 trap. No hints.",
    outro: "Level 1 complete. 1...d5 doesn't save them from the Alien." },
}

const { tree, lessons } = buildOpening(spec)
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-scandi-alien.ts'), serializeTree(tree, 'WITTY_ALIEN_SCANDI_ALIEN'))
writeFileSync(join(process.cwd(), 'data/openings/witty-alien-scandi-alien-lessons.ts'), serializeLessons(lessons, 'getWittyAlienScandiAlienLesson', 'WITTY_ALIEN_SCANDI_ALIEN_LESSONS'))
console.log(`Wrote scandi-alien: ${tree.nodes.length} nodes, ${Object.keys(lessons).length} lessons`)
