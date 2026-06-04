// Analyzes cached witty_alien games to fact-check what he actually plays.
// Focus: as Black vs 1.e4 — how often the Elephant Gambit (1.e4 e5 2.Nf3 d5)
// shows up, his real results, and the real opponent replies + his follow-ups.
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const DIR = join(process.cwd(), 'data', 'witty-games')
const USER = 'witty_alien'

const DRAWS = new Set(['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'])
const outcome = (res: string) => (res === 'win' ? 'W' : DRAWS.has(res) ? 'D' : 'L')

// Extract SAN move list from a chess.com PGN movetext (strip comments/numbers).
function sans(pgn: string, max = 16): string[] {
  const i = pgn.lastIndexOf('\n\n')
  let mt = i >= 0 ? pgn.slice(i + 2) : pgn
  mt = mt.replace(/\{[^}]*\}/g, ' ').replace(/\$\d+/g, ' ')
  const out: string[] = []
  for (const tok of mt.split(/\s+/)) {
    if (!tok) continue
    if (/^\d+\.(\.\.)?$/.test(tok)) continue       // "1." or "1..."
    if (/^\d+\.\.\.?/.test(tok)) { const m = tok.replace(/^\d+\.+/, ''); if (m) out.push(m); continue }
    if (tok === '1-0' || tok === '0-1' || tok === '1/2-1/2' || tok === '*') break
    out.push(tok)
    if (out.length >= max) break
  }
  return out
}

type Rec = { w: number; d: number; l: number }
const rec = (): Rec => ({ w: 0, d: 0, l: 0 })
const add = (r: Rec, o: string) => { o === 'W' ? r.w++ : o === 'D' ? r.d++ : r.l++ }
const fmt = (r: Rec) => { const n = r.w + r.d + r.l; return `${n} games, ${n ? Math.round((r.w / n) * 100) : 0}% W (${r.w}/${r.d}/${r.l})` }

let asBlackVsE4 = 0
const reply1 = new Map<string, Rec>()        // his move 1 as Black vs e4
const elephant = rec()                         // 1.e4 e5 2.Nf3 d5
const elephantW3 = new Map<string, Rec>()      // White's 3rd move in Elephant
const elephantReplies = new Map<string, Rec>() // his move after White's 3rd

for (const f of readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const { games } = JSON.parse(readFileSync(join(DIR, f), 'utf8'))
  for (const g of games) {
    if (!g.pgn) continue
    const wuser = g.white?.username?.toLowerCase()
    const buser = g.black?.username?.toLowerCase()
    const wittyBlack = buser === USER
    const wittyWhite = wuser === USER
    if (!wittyBlack && !wittyWhite) continue
    const m = sans(g.pgn, 8)
    if (m.length < 2) continue

    if (wittyBlack && m[0] === 'e4') {
      asBlackVsE4++
      const o = outcome(g.black.result)
      const key = m[1] ?? '(none)'
      if (!reply1.has(key)) reply1.set(key, rec())
      add(reply1.get(key)!, o)
      // Elephant: 1.e4 e5 2.Nf3 d5
      if (m[1] === 'e5' && m[2] === 'Nf3' && m[3] === 'd5') {
        add(elephant, o)
        const w3 = m[4] ?? '(end)'
        if (!elephantW3.has(w3)) elephantW3.set(w3, rec())
        add(elephantW3.get(w3)!, o)
        const b3 = m[5] ?? '(end)'
        if (!elephantReplies.has(`${w3} -> ${b3}`)) elephantReplies.set(`${w3} -> ${b3}`, rec())
        add(elephantReplies.get(`${w3} -> ${b3}`)!, o)
      }
    }
  }
}

const top = (map: Map<string, Rec>, n = 8) =>
  [...map.entries()].sort((a, b) => (b[1].w + b[1].d + b[1].l) - (a[1].w + a[1].d + a[1].l)).slice(0, n)

console.log(`\n=== witty_alien as BLACK vs 1.e4: ${asBlackVsE4} games ===`)
console.log('His first move (1...?):')
for (const [k, r] of top(reply1)) console.log(`  1...${k.padEnd(5)} ${fmt(r)}`)

console.log(`\n=== ELEPHANT GAMBIT (1.e4 e5 2.Nf3 d5): ${fmt(elephant)} ===`)
const eN = elephant.w + elephant.d + elephant.l
console.log(`  = ${asBlackVsE4 ? ((eN / asBlackVsE4) * 100).toFixed(1) : 0}% of his Black-vs-e4 games`)
console.log('White\'s 3rd move in the Elephant:')
for (const [k, r] of top(elephantW3)) console.log(`  3.${k.padEnd(6)} ${fmt(r)}`)
console.log('Most common continuations (White 3rd -> his reply):')
for (const [k, r] of top(elephantReplies, 12)) console.log(`  ${k.padEnd(20)} ${fmt(r)}`)
