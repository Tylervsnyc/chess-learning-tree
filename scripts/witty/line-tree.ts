// Builds the REAL repertoire tree from witty_alien's games: from a move prefix,
// walk the most-common continuation, showing every child above a frequency
// threshold with game counts + his win rate. This is the core of the skill —
// the lesson's opponent replies should be the dominant real moves here.
//
// Usage: npx tsx scripts/witty/line-tree.ts <color> "e4 e5 Nf3 d5" [depth=14] [minPct=8]
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const DIR = join(process.cwd(), 'data', 'witty-games')
const USER = 'witty_alien'
const DRAWS = new Set(['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'])
const outcome = (res: string) => (res === 'win' ? 'W' : DRAWS.has(res) ? 'D' : 'L')

const wantColor = (process.argv[2] ?? 'black').toLowerCase().startsWith('w') ? 'white' : 'black'
const prefix = (process.argv[3] ?? '').trim().split(/\s+/).filter(Boolean)
const maxDepth = parseInt(process.argv[4] ?? '14', 10)
const minPct = parseFloat(process.argv[5] ?? '8')

function sans(pgn: string, max = 20): string[] {
  const i = pgn.lastIndexOf('\n\n')
  let mt = i >= 0 ? pgn.slice(i + 2) : pgn
  mt = mt.replace(/\{[^}]*\}/g, ' ').replace(/\$\d+/g, ' ')
  const out: string[] = []
  for (const tok of mt.split(/\s+/)) {
    if (!tok) continue
    if (/^\d+\.(\.\.)?$/.test(tok)) continue
    if (tok === '1-0' || tok === '0-1' || tok === '1/2-1/2' || tok === '*') break
    out.push(tok.replace(/^\d+\.+/, ''))
    if (out.length >= max) break
  }
  return out.filter(Boolean)
}

// collect all of witty's games of the chosen color that start with prefix
const lines: { moves: string[]; o: string }[] = []
for (const f of readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const { games } = JSON.parse(readFileSync(join(DIR, f), 'utf8'))
  for (const g of games) {
    if (!g.pgn) continue
    const isWhite = g.white?.username?.toLowerCase() === USER
    const isBlack = g.black?.username?.toLowerCase() === USER
    if (wantColor === 'white' ? !isWhite : !isBlack) continue
    const m = sans(g.pgn, maxDepth + 2)
    if (m.length < prefix.length) continue
    if (prefix.some((p, i) => m[i] !== p)) continue
    lines.push({ moves: m, o: outcome((wantColor === 'white' ? g.white : g.black).result) })
  }
}

console.log(`\n${wantColor.toUpperCase()} repertoire from: ${prefix.join(' ') || '(start)'}  —  ${lines.length} games\n`)

type Node = { moves: { moves: string[]; o: string }[] }
function walk(games: { moves: string[]; o: string }[], depth: number, indent: string) {
  if (depth >= maxDepth || games.length === 0) return
  const ply = prefix.length + depth
  const sideToMove = ply % 2 === 0 ? 'white' : 'black'
  // group by next move
  const groups = new Map<string, { moves: string[]; o: string }[]>()
  for (const g of games) {
    const mv = g.moves[ply]
    if (!mv) continue
    if (!groups.has(mv)) groups.set(mv, [])
    groups.get(mv)!.push(g)
  }
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length)
  const total = games.length
  let shown = 0
  for (const [mv, gs] of sorted) {
    const pct = (gs.length / total) * 100
    if (pct < minPct && shown >= 1) continue // always show the top child; others must clear threshold
    shown++
    const w = gs.filter(g => g.o === 'W').length
    const wr = Math.round((w / gs.length) * 100)
    const who = sideToMove === wantColor ? '*' : ' ' // * = the player's own move
    const moveNo = Math.floor(ply / 2) + 1
    const label = sideToMove === 'white' ? `${moveNo}.${mv}` : `${moveNo}...${mv}`
    console.log(`${indent}${who} ${label.padEnd(10)} ${gs.length} games (${pct.toFixed(0)}%), ${wr}% W`)
    // recurse only down the dominant child of each shown branch
    walk(gs, depth + 1, indent + '   ')
  }
}
walk(lines, 0, '')
