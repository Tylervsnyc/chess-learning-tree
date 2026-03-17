#!/usr/bin/env npx tsx
/**
 * DOWNLOAD MASTERS — Fetch the complete move tree from Lichess masters DB
 *
 * Downloads once, builds forever. Every move is real master game data.
 *
 * Usage:
 *   npx tsx scripts/openings/download-masters.ts \
 *     --slug italian --level 1 --side white \
 *     --moves "1.e4 e5 2.Nf3 Nc6 3.Bc4"
 *
 * Output: data/opening-builds/{slug}-L{level}/masters.json
 *
 * The output contains:
 *   - Main line: follows #1 move from identity point, 20+ half-moves deep
 *   - Deviations: opponent's #2/#3 moves at each branch, each followed 6 moves deep
 *   - Variations: our #2 alternative moves where viable, each followed 6 moves deep
 */

import { Chess } from 'chess.js'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '../../.env.local') })

const LICHESS_TOKEN = process.env.LICHESS_TOKEN ?? ''
const ROOT = join(__dirname, '../..')
const BUILDS_DIR = join(ROOT, 'data/opening-builds')

const LICHESS_MASTERS_URL = 'https://explorer.lichess.org/masters'

// How deep to follow the main line (half-moves past identity)
const MAIN_LINE_DEPTH = 40
// How deep to follow deviations/variations (half-moves)
const BRANCH_DEPTH = 12
// Min master games for a move to be worth recording
const MIN_GAMES = 50
// How many alternative moves to record at each position
const MAX_ALTERNATIVES = 3

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

export interface MastersMove {
  san: string
  uci: string
  games: number
  whiteWins: number
  draws: number
  blackWins: number
  winRate: number // from white's perspective
  children: MastersMove[]
}

export interface MastersTree {
  slug: string
  level: number
  side: 'white' | 'black'
  identityMoves: string    // the moves that define this opening
  downloadedAt: string
  totalApiCalls: number
  /** The full move tree. Each entry is a top-level continuation from the identity position. */
  root: MastersMove[]
}

// ═══════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════

function parseArgs() {
  const args = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const idx = args.indexOf(flag)
    return idx !== -1 ? args[idx + 1] : undefined
  }

  const slug = get('--slug')
  const level = get('--level')
  const moves = get('--moves')
  const side = (get('--side') ?? 'white') as 'white' | 'black'
  const mainDepth = parseInt(get('--depth') ?? String(MAIN_LINE_DEPTH), 10)
  const branchDepth = parseInt(get('--branch-depth') ?? String(BRANCH_DEPTH), 10)

  if (!slug || !level || !moves) {
    console.error('Usage: download-masters.ts --slug <slug> --level <n> --moves "1.e4 e5 ..." --side white|black')
    process.exit(1)
  }

  return { slug, level: parseInt(level, 10), moves, side, mainDepth, branchDepth }
}

// ═══════════════════════════════════════════
// LICHESS MASTERS API
// ═══════════════════════════════════════════

let apiCalls = 0

interface ExplorerResponse {
  white: number
  draws: number
  black: number
  moves: {
    uci: string
    san: string
    white: number
    draws: number
    black: number
  }[]
}

async function fetchMasters(uciMoves: string[]): Promise<ExplorerResponse | null> {
  const play = uciMoves.join(',')
  const url = `${LICHESS_MASTERS_URL}?play=${play}&topGames=0`

  try {
    apiCalls++
    const headers: Record<string, string> = { 'Accept': 'application/json' }
    if (LICHESS_TOKEN) headers['Authorization'] = `Bearer ${LICHESS_TOKEN}`
    const res = await fetch(url, { headers })

    if (res.status === 429) {
      // Rate limited — back off and retry
      console.warn('  Rate limited, waiting 5s...')
      await sleep(5000)
      apiCalls++
      const retry = await fetch(url, { headers })
      if (!retry.ok) return null
      return await retry.json() as ExplorerResponse
    }

    if (!res.ok) return null
    return await res.json() as ExplorerResponse
  } catch (e) {
    console.warn(`  Fetch error: ${e}`)
    return null
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ═══════════════════════════════════════════
// MOVE PARSER (reused from prep.ts)
// ═══════════════════════════════════════════

function parseMoveString(moveStr: string): { san: string; mover: 'white' | 'black' }[] {
  const moves: { san: string; mover: 'white' | 'black' }[] = []
  const cleaned = moveStr.trim().replace(/(\d+)\.\s+/g, '$1.')
  const tokens = cleaned.split(/\s+/)
  let lastMover: 'white' | 'black' | null = null

  for (const token of tokens) {
    const numberedBlack = token.match(/^(\d+)\.\.\.(.+)$/)
    const numberedWhite = token.match(/^(\d+)\.([A-Za-z].+)$/)

    if (numberedBlack) {
      moves.push({ san: numberedBlack[2], mover: 'black' })
      lastMover = 'black'
    } else if (numberedWhite) {
      moves.push({ san: numberedWhite[2], mover: 'white' })
      lastMover = 'white'
    } else if (/^[A-Za-z]/.test(token) || token === 'O-O' || token === 'O-O-O') {
      const mover = lastMover === 'white' ? 'black' : 'white'
      moves.push({ san: token, mover })
      lastMover = mover
    }
  }

  return moves
}

function movesToUci(moveStr: string): string[] {
  const game = new Chess()
  const parsed = parseMoveString(moveStr)
  const uciMoves: string[] = []

  for (const pm of parsed) {
    const result = game.move(pm.san)
    if (!result) {
      console.error(`Illegal move: ${pm.san} at ${game.fen()}`)
      process.exit(1)
    }
    uciMoves.push(`${result.from}${result.to}${result.promotion ?? ''}`)
  }

  return uciMoves
}

// ═══════════════════════════════════════════
// TREE CRAWLER
// ═══════════════════════════════════════════

/**
 * Recursively crawl the masters explorer, building a move tree.
 *
 * @param uciPath - UCI moves played so far
 * @param depth - how many more half-moves to explore
 * @param maxAlts - how many alternative moves to follow at this level
 * @param isMainLine - true if we're on the main line (follow deeper)
 * @param side - which side we're teaching
 */
async function crawl(
  uciPath: string[],
  depth: number,
  maxAlts: number,
  isMainLine: boolean,
  side: 'white' | 'black',
  branchDepth: number,
): Promise<MastersMove[]> {
  if (depth <= 0) return []

  const data = await fetchMasters(uciPath)
  await sleep(200) // gentle rate limiting

  if (!data || data.moves.length === 0) return []

  const results: MastersMove[] = []
  const totalGames = data.moves.reduce((sum, m) => sum + m.white + m.draws + m.black, 0)

  // Determine whose turn it is
  const turnIsWhite = uciPath.length % 2 === 0
  const turnIsSide = (turnIsWhite && side === 'white') || (!turnIsWhite && side === 'black')

  // How many moves to explore at this position
  const movesToExplore = isMainLine ? Math.min(maxAlts + 1, data.moves.length) : 1

  for (let i = 0; i < movesToExplore && i < data.moves.length; i++) {
    const m = data.moves[i]
    const games = m.white + m.draws + m.black

    if (games < MIN_GAMES) continue

    const winRate = totalGames > 0
      ? Math.round(((m.white + m.draws * 0.5) / (m.white + m.draws + m.black)) * 1000) / 10
      : 50

    const node: MastersMove = {
      san: m.san,
      uci: m.uci,
      games,
      whiteWins: m.white,
      draws: m.draws,
      blackWins: m.black,
      winRate,
      children: [],
    }

    // Determine how deep to follow this continuation
    const isTop = i === 0
    let childDepth: number
    let childAlts: number

    if (isTop && isMainLine) {
      // Main line: keep going deep, keep exploring alternatives
      childDepth = depth - 1
      childAlts = MAX_ALTERNATIVES
    } else {
      // Branch: follow only the top move, limited depth
      childDepth = Math.min(depth - 1, branchDepth)
      childAlts = 0 // branches don't spawn sub-branches
    }

    if (childDepth > 0) {
      node.children = await crawl(
        [...uciPath, m.uci],
        childDepth,
        childAlts,
        isTop && isMainLine,
        side,
        branchDepth,
      )
    }

    results.push(node)
  }

  return results
}

// ═══════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════

function countNodes(nodes: MastersMove[]): number {
  let count = 0
  for (const n of nodes) {
    count++
    count += countNodes(n.children)
  }
  return count
}

function printTree(nodes: MastersMove[], indent = '', moveNum = 1, isWhiteTurn = true): void {
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    const prefix = isWhiteTurn ? `${moveNum}.` : `${moveNum}...`
    const tag = i === 0 ? '' : ` [alt ${i}]`
    const gameStr = n.games >= 1000 ? `${(n.games / 1000).toFixed(1)}k` : `${n.games}`
    console.log(`${indent}${prefix}${n.san} (${gameStr} games, ${n.winRate}% white)${tag}`)

    const nextMoveNum = isWhiteTurn ? moveNum : moveNum + 1
    if (n.children.length > 0) {
      printTree(n.children, i === 0 ? indent : indent + '  ', nextMoveNum, !isWhiteTurn)
    }
  }
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  const { slug, level, moves, side, mainDepth, branchDepth } = parseArgs()

  console.log(`\nDownloading masters data: ${slug} Level ${level}`)
  console.log(`  Identity moves: ${moves}`)
  console.log(`  Side: ${side}`)
  console.log(`  Main line depth: ${mainDepth} half-moves`)
  console.log(`  Branch depth: ${branchDepth} half-moves`)

  // Convert identity moves to UCI
  const identityUci = movesToUci(moves)
  console.log(`  Identity = ${identityUci.length} half-moves\n`)

  // Crawl from the identity position
  console.log('Fetching from Lichess masters database...\n')
  const root = await crawl(identityUci, mainDepth, MAX_ALTERNATIVES, true, side, branchDepth)

  const totalNodes = countNodes(root)
  console.log(`\nDone. ${totalNodes} positions, ${apiCalls} API calls.\n`)

  // Print the tree
  const identityParsed = parseMoveString(moves)
  const startMoveNum = Math.ceil(identityUci.length / 2) + 1
  const startsWhite = identityUci.length % 2 === 0
  printTree(root, '  ', startsWhite ? startMoveNum : startMoveNum - 1, startsWhite)

  // Save
  const tree: MastersTree = {
    slug,
    level,
    side,
    identityMoves: moves,
    downloadedAt: new Date().toISOString(),
    totalApiCalls: apiCalls,
    root,
  }

  const outDir = join(BUILDS_DIR, `${slug}-L${level}`)
  mkdirSync(outDir, { recursive: true })
  const outPath = join(outDir, 'masters.json')
  writeFileSync(outPath, JSON.stringify(tree, null, 2) + '\n')
  console.log(`\nSaved to ${outPath}`)
}

main().catch(e => {
  console.error('Failed:', e)
  process.exit(1)
})
