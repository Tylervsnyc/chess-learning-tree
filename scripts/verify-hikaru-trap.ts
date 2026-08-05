/**
 * Verify Nakamura's queen sacrifice vs WIM Margarita Potapova (Chess Path Classics).
 * Game: PotapovaM (2854) vs Hikaru (3406), 3+0 Thursday, chess.com, 2026-07-23.
 * PGN source: api.chess.com/pub/player/hikaru/games/2026/07 (game 179133472429).
 * Source reel: instagram.com/reels/DbVYClKRYVw/ (@sam_copeland).
 *
 * Emits every FEN for the composition. Exits non-zero on any illegal claim.
 */
import { Chess } from 'chess.js'

const MOVES =
  ('d4 Nf6 c4 e6 Nc3 Bb4 f3 c5 d5 O-O e4 b5 e5 Ne8 f4 exd5 cxd5 d6 Nf3 c4 ' +
   'a4 Nd7 Be2 bxa4 Rxa4 a5 O-O Nb6 Ra1 Bb7 Be3 dxe5 Nxe5 Nxd5 Nxd5 Bxd5 ' +
   'Bxc4 Nf6 Bf2 Rc8 Ba6 Rc7 Bb6 Rc2 Bxd8 Bc5+ Rf2 Rxf2 Bxf6 Rxb2+ Kf1 Bxg2+ Ke1 Bf2#').split(' ')

let failed = false
const out: { label: string; fen: string; from: string; to: string }[] = []

function play(chess: Chess, san: string, label?: string) {
  const mv = chess.move(san)
  if (!mv) { console.error(`ILLEGAL: ${san} at ${chess.fen()}`); failed = true; return null }
  out.push({ label: label ?? san, fen: chess.fen(), from: mv.from, to: mv.to })
  return mv
}

// ---- full game replay ----
const game = new Chess()
const fenAt: Record<number, string> = {} // fen after ply n (1-based)
MOVES.forEach((san, i) => {
  const moveNo = Math.floor(i / 2) + 1
  const label = i % 2 === 0 ? `${moveNo}.${san}` : `${moveNo}...${san}`
  play(game, san, label)
  fenAt[i + 1] = game.fen()
})
if (!game.isCheckmate()) { console.error('Final position is NOT checkmate'); failed = true }

// ---- variations (from the reel's analysis) ----
// After 22...Rc2, if White grabs the rook: 23.Qxc2 Qxb6+ forks king + hangs Ba6
const afterRc2 = fenAt[44] // 22...Rc2 is ply 44
{
  const v = new Chess(afterRc2)
  play(v, 'Qxc2', 'v1: 23.Qxc2')
  const chk = play(v, 'Qxb6+', 'v1: 23...Qxb6+')
  if (!chk || !v.inCheck()) { console.error('Qxb6+ not check'); failed = true }
  // any White reply, then Qxa6 wins the bishop
  play(v, 'Kh1', 'v1: 24.Kh1')
  play(v, 'Qxa6', 'v1: 24...Qxa6')
}

// After 23.Bxd8: the tempting 23...Bxg2? refuted — 24.Kxg2? no; reel line:
// 23...Rxg2+? 24.Kh1! Rd2+ (discovered by Bd5) 25.Nf3! blocks and White is fine
const afterBxd8 = fenAt[45]
{
  const v = new Chess(afterBxd8)
  play(v, 'Rxg2+', 'v2: 23...Rxg2+?')
  play(v, 'Kh1', 'v2: 24.Kh1!')
  play(v, 'Rd2+', 'v2: 24...Rd2+ (disc.)')
  if (!v.inCheck()) { console.error('Rd2+ not a discovered check'); failed = true }
  play(v, 'Nf3', 'v2: 25.Nf3! blocks')
  if (v.inCheck()) { console.error('Nf3 does not break the check'); failed = true }
}

// After 23...Bc5+: 24.Kh1?? Bxg2# instead of 24.Rf2
const afterBc5 = fenAt[46]
{
  const v = new Chess(afterBc5)
  play(v, 'Kh1', 'v3: 24.Kh1??')
  play(v, 'Bxg2#', 'v3: 24...Bxg2#')
  if (!v.isCheckmate()) { console.error('24...Bxg2# not mate'); failed = true }
}

// After 25...Rxb2+ (discovered check by Bc5): 26.Kh1?? Bxg2#
const afterRxb2 = fenAt[50]
{
  const v = new Chess(afterRxb2)
  if (!v.inCheck()) { console.error('25...Rxb2+ not a discovered check'); failed = true }
  play(v, 'Kh1', 'v4: 26.Kh1??')
  play(v, 'Bxg2#', 'v4: 26...Bxg2#')
  if (!v.isCheckmate()) { console.error('26...Bxg2# not mate'); failed = true }
}

console.log('---- FENs (main game from 20...Rc8, ply 40) ----')
out.forEach((s, i) => {
  if (s.label.startsWith('v') || i >= 39) console.log(`${s.label.padEnd(24)} ${s.from}->${s.to}  ${s.fen}`)
})
console.log('\nKey anchors:')
console.log('after 21.Ba6 (setup):   ', fenAt[41])
console.log('after 22...Rc2!!:       ', fenAt[44])
console.log('final mate:             ', fenAt[54])
if (failed) { console.error('\nVERIFY FAILED'); process.exit(1) }
console.log('\nALL VERIFIED')
