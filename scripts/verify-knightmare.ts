/**
 * Verify the "Knightmare" two-knights zugzwang study (Chess Path Classics).
 * Source reel: instagram.com/reels/DY6tklioZID/ (@pietrocheckmate, "Knightmare.")
 *
 * White: Ka8, Nb7, Pa7 · Black: Kf7, Ne6, Nc4 · Black to move, Black wins.
 * Main line: 1...Nc7+ 2.Kb8 Na6+ 3.Kc8 Ke8!! 4.a8=N Ke7!! zugzwang, mate follows.
 * Emits every FEN for the composition. Exits non-zero on any illegal claim.
 */
import { Chess } from 'chess.js'

const START = 'K7/PN3k2/4n3/8/2n5/8/8/8 b - - 0 1'

let failed = false
const out: { label: string; fen: string; from: string; to: string }[] = []

function play(chess: Chess, san: string, label?: string) {
  const mv = chess.move(san)
  if (!mv) {
    console.error(`ILLEGAL: ${san} at ${chess.fen()}`)
    failed = true
    return null
  }
  out.push({ label: label ?? san, fen: chess.fen(), from: mv.from, to: mv.to })
  return mv
}

// ---- main line ----
const main = new Chess(START)
play(main, 'Nc7+', '1...Nc7+')
play(main, 'Kb8', '2.Kb8')
play(main, 'Na6+', '2...Na6+')

// variation: 3.Ka8?? Nb6#
const vKa8 = new Chess(main.fen())
play(vKa8, 'Ka8', '3.Ka8??')
play(vKa8, 'Nb6#', '3...Nb6#')
if (!vKa8.isCheckmate()) { console.error('3...Nb6# is NOT mate'); failed = true }

play(main, 'Kc8', '3.Kc8')

// variation: immediate 3...Nb6+? is NOT mate — king escapes
const vNb6 = new Chess(main.fen())
const m = vNb6.move('Nb6+')
if (!m) { console.error('3...Nb6+ illegal?'); failed = true }
if (vNb6.isCheckmate()) { console.error('3...Nb6+ should NOT be mate'); failed = true }
console.log('3...Nb6+? escapes:', vNb6.moves().join(' '))
out.push({ label: '3...Nb6+? (fails)', fen: vNb6.fen(), from: m!.from, to: m!.to })

play(main, 'Ke8', '3...Ke8!!')

// variation: 4.a8=Q?? Nb6#
const vQ = new Chess(main.fen())
play(vQ, 'a8=Q', '4.a8=Q??')
play(vQ, 'Nb6#', '4...Nb6#')
if (!vQ.isCheckmate()) { console.error('4...Nb6# (after a8=Q) is NOT mate'); failed = true }

play(main, 'a8=N', '4.a8=N!')

// after 4.a8=N, immediate 4...Nb6+ must NOT work (a8 knight covers b6)
const vNb6b = new Chess(main.fen())
if (vNb6b.moves().includes('Nb6+') || vNb6b.moves().includes('Nb6#')) {
  const chk = new Chess(main.fen())
  chk.move('Nb6')
  console.log('note: 4...Nb6 possible but answered by', chk.moves().filter(s => s.startsWith('N')).join(' '))
}

play(main, 'Ke7', '4...Ke7!!')

// ---- zugzwang: every White move must allow a forced mate (depth <= 2 for Black) ----
const zug = main.fen()
console.log('\nZUGZWANG position:', zug)
for (const wm of new Chess(zug).moves()) {
  const c = new Chess(zug)
  c.move(wm)
  // black mate in 1?
  const mate1 = c.moves().find(bm => { const t = new Chess(c.fen()); t.move(bm); return t.isCheckmate() })
  if (mate1) { console.log(`  ${wm} -> ${mate1}#`); continue }
  // black mate in 2 (forced)?
  let found: string | null = null
  for (const bm of c.moves()) {
    const c2 = new Chess(c.fen())
    c2.move(bm)
    if (c2.isCheckmate()) { found = bm; break }
    const wReplies = c2.moves()
    if (wReplies.length === 0) continue
    const allMated = wReplies.every(wr => {
      const c3 = new Chess(c2.fen())
      c3.move(wr)
      return c3.moves().some(bm2 => { const t = new Chess(c3.fen()); t.move(bm2); return t.isCheckmate() })
    })
    if (allMated) { found = `${bm} then mate-in-1 vs all` ; break }
  }
  if (found) console.log(`  ${wm} -> ${found}`)
  else { console.error(`  ${wm} -> NO FORCED MATE FOUND (depth 2)`); failed = true }
}

// demo mates for the comp (the two shown in the reel)
const d1 = new Chess(zug); play(d1, 'Nc7', '5.Nc7 (a8 knight moves)'); play(d1, 'Nb6#', '5...Nb6#')
if (!d1.isCheckmate()) { console.error('demo 1 not mate'); failed = true }
const d2 = new Chess(zug); play(d2, 'Nc5', '5.Nc5 (b7 knight moves)')
const d2mate = new Chess(d2.fen()).moves().find(bm => { const t = new Chess(d2.fen()); t.move(bm); return t.isCheckmate() })
console.log('after 5.Nc5 mate-in-1:', d2mate ?? 'none (deeper)')

console.log('\n---- FENs ----')
for (const s of out) console.log(`${s.label.padEnd(22)} ${s.from}->${s.to}  ${s.fen}`)
if (failed) { console.error('\nVERIFY FAILED'); process.exit(1) }
console.log('\nALL VERIFIED')
