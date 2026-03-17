#!/usr/bin/env npx tsx
/**
 * View a downloaded masters.json in readable format.
 * Usage: npx tsx scripts/openings/view-masters.ts data/opening-builds/ruy-lopez-L1/masters.json
 */

import { readFileSync } from 'fs'

const file = process.argv[2]
if (!file) {
  console.error('Usage: view-masters.ts <path-to-masters.json>')
  process.exit(1)
}

interface MNode {
  san: string
  uci: string
  games: number
  whiteWins: number
  draws: number
  blackWins: number
  winRate: number
  children: MNode[]
}

interface MTree {
  slug: string
  level: number
  side: string
  identityMoves: string
  downloadedAt: string
  totalApiCalls: number
  root: MNode[]
}

const data: MTree = JSON.parse(readFileSync(file, 'utf-8'))

function fmtGames(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`
}

// Walk the tree and collect the main line + all branches
interface Line {
  label: string
  moves: string  // "3...a6 4.Ba4 Nf6 5.O-O ..."
  games: string  // game count at leaf
  depth: number  // how many half-moves
}

function walkMainLine(nodes: MNode[], moveNum: number, isWhite: boolean): string[] {
  if (nodes.length === 0) return []
  const main = nodes[0]
  const turn = isWhite ? `${moveNum}.` : `${moveNum}...`
  const rest = walkMainLine(main.children, isWhite ? moveNum : moveNum + 1, !isWhite)
  return [`${turn}${main.san}`, ...rest]
}

function collectBranches(
  nodes: MNode[],
  moveNum: number,
  isWhite: boolean,
  pathSoFar: string[],
  results: Line[],
) {
  if (nodes.length === 0) return

  const main = nodes[0]
  const turn = isWhite ? `${moveNum}.` : `${moveNum}...`
  const nextNum = isWhite ? moveNum : moveNum + 1

  // Record alternatives
  for (let i = 1; i < nodes.length; i++) {
    const alt = nodes[i]
    const altTurn = `${turn}${alt.san}`
    // Follow this branch's main line
    const continuation = walkMainLine(alt.children, nextNum, !isWhite)
    const fullLine = [...pathSoFar, altTurn, ...continuation].join(' ')
    const leafGames = getLeafGames(alt)
    results.push({
      label: `Instead of ${turn}${main.san}`,
      moves: fullLine,
      games: fmtGames(alt.games),
      depth: 1 + countMainDepth(alt.children),
    })
  }

  // Recurse into main line
  collectBranches(
    main.children,
    nextNum,
    !isWhite,
    [...pathSoFar, `${turn}${main.san}`],
    results,
  )
}

function countMainDepth(nodes: MNode[]): number {
  if (nodes.length === 0) return 0
  return 1 + countMainDepth(nodes[0].children)
}

function getLeafGames(node: MNode): number {
  if (node.children.length === 0) return node.games
  return getLeafGames(node.children[0])
}

function countTotalNodes(nodes: MNode[]): number {
  let c = 0
  for (const n of nodes) {
    c++
    c += countTotalNodes(n.children)
  }
  return c
}

// Header
console.log(`\nRuy Lopez Masters Data`)
console.log(`======================`)
console.log(`Identity: ${data.identityMoves}`)
console.log(`Side: ${data.side}`)
console.log(`Downloaded: ${data.downloadedAt}`)
console.log(`Total positions: ${countTotalNodes(data.root)}`)
console.log()

// The identity is 3.Bb5 = 5 half-moves, so next move is black move 3
const startMoveNum = 3
const startsWhite = false // black moves next after 3.Bb5

// Main line
console.log(`MAIN LINE`)
console.log(`---------`)
const mainMoves = walkMainLine(data.root, startMoveNum, startsWhite)
// Print in chunks of ~8 moves per line for readability
const CHUNK = 8
for (let i = 0; i < mainMoves.length; i += CHUNK) {
  console.log('  ' + mainMoves.slice(i, i + CHUNK).join(' '))
}
const mainDepth = countMainDepth(data.root)
console.log(`  (${mainDepth} half-moves deep, ${fmtGames(data.root[0]?.games ?? 0)} games at start)`)

// Branches
console.log(`\nBRANCHES & DEVIATIONS`)
console.log(`---------------------`)

const branches: Line[] = []
collectBranches(data.root, startMoveNum, startsWhite, [], branches)

// Group by where they branch
for (const b of branches) {
  console.log(`\n  ${b.label} (${b.games} games, ${b.depth} moves deep):`)
  // Print the move sequence, breaking at reasonable width
  const words = b.moves.split(' ')
  let line = '    '
  for (const w of words) {
    if (line.length + w.length > 90) {
      console.log(line)
      line = '    '
    }
    line += w + ' '
  }
  if (line.trim()) console.log(line)
}

console.log(`\n\nTotal: ${branches.length} branches/deviations captured`)
