#!/usr/bin/env npx tsx
/**
 * PREP FROM MASTERS — Generate lesson plan from downloaded masters.json
 *
 * No API calls. No LLM. Pure deterministic.
 *
 * Usage:
 *   npx tsx scripts/openings/prep-from-masters.ts \
 *     --slug ruy-lopez --level 1 [--moves-per-lesson 3] [--preview]
 *
 * Output: data/opening-builds/{slug}-L{level}/prep.json
 *         (or just prints the plan with --preview)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Chess } from 'chess.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const BUILDS_DIR = join(ROOT, 'data/opening-builds')

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

interface MastersMove {
  san: string
  uci: string
  games: number
  whiteWins: number
  draws: number
  blackWins: number
  winRate: number
  children: MastersMove[]
}

interface MastersTree {
  slug: string
  level: number
  side: 'white' | 'black'
  identityMoves: string
  downloadedAt: string
  totalApiCalls: number
  root: MastersMove[]
}

interface LessonPlan {
  nodeId: string
  type: 'main' | 'deviation' | 'branch' | 'test'
  title: string
  /** Full move sequence for this lesson (both sides) */
  moves: { san: string; mover: 'white' | 'black'; moveNumber: number; games: number }[]
  /** For deviations: what the opponent plays instead */
  deviationMove?: string
  /** For deviations: what the main line move was */
  mainLineMove?: string
  /** Games at the branch point */
  branchGames?: number
  /** Percentage of games at the branch point */
  branchPercent?: number
  /** Which main lesson this deviation branches from (1-indexed) */
  branchesFromLesson?: number
}

interface MajorVariation {
  move: string
  mainLineMove: string
  games: number
  percent: number
  moveNumber: number
  description: string
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
  const movesPerLesson = parseInt(get('--moves-per-lesson') ?? '3', 10)
  const mainLessons = parseInt(get('--main-lessons') ?? '3', 10)
  const preview = args.includes('--preview')
  const maxDeviations = parseInt(get('--max-deviations') ?? '3', 10)

  if (!slug || !level) {
    console.error('Usage: prep-from-masters.ts --slug <slug> --level <n> [--moves-per-lesson 3] [--preview]')
    process.exit(1)
  }

  return { slug, level: parseInt(level, 10), movesPerLesson, mainLessons, preview, maxDeviations }
}

// ═══════════════════════════════════════════
// SLUG PREFIX
// ═══════════════════════════════════════════

function generateSlugPrefix(slug: string): string {
  const PREFIXES: Record<string, string> = {
    'italian': 'it', 'pirc-defense': 'pi', 'pirc-austrian': 'pa',
    'ruy-lopez': 'rl', 'sicilian': 'si', 'french': 'fr',
    'london': 'ln', 'scotch': 'sc', 'caro-kann': 'ck',
    'kings-gambit': 'kg', 'kings-indian': 'ki',
  }
  return PREFIXES[slug] ?? slug.split('-').map(w => w[0]).join('')
}

// ═══════════════════════════════════════════
// EXTRACT MOVES FROM TREE
// ═══════════════════════════════════════════

interface FlatMove {
  san: string
  mover: 'white' | 'black'
  moveNumber: number
  games: number
  alternatives: { san: string; games: number; children: MastersMove[] }[]
}

/**
 * Walk the main line (always follow children[0]) and collect all moves + alternatives.
 */
/**
 * Parse identity move string into FlatMoves (no alternatives — these are fixed).
 */
function parseIdentityToFlatMoves(moveStr: string): FlatMove[] {
  const game = new Chess()
  const cleaned = moveStr.trim().replace(/(\d+)\.\s+/g, '$1.')
  const tokens = cleaned.split(/\s+/)
  const result: FlatMove[] = []
  let lastMover: 'white' | 'black' | null = null

  for (const token of tokens) {
    const numberedBlack = token.match(/^(\d+)\.\.\.(.+)$/)
    const numberedWhite = token.match(/^(\d+)\.([A-Za-z].+)$/)
    let san: string | null = null
    let mover: 'white' | 'black' = 'white'

    if (numberedBlack) {
      san = numberedBlack[2]
      mover = 'black'
    } else if (numberedWhite) {
      san = numberedWhite[2]
      mover = 'white'
    } else if (/^[A-Za-z]/.test(token) || token === 'O-O' || token === 'O-O-O') {
      san = token
      mover = lastMover === 'white' ? 'black' : 'white'
    }

    if (san) {
      const moveNumber = Math.floor(result.length / 2) + 1
      try {
        game.move(san)
        result.push({ san, mover, moveNumber, games: 0, alternatives: [] })
        lastMover = mover
      } catch { break }
    }
  }

  return result
}

function flattenMainLine(
  nodes: MastersMove[],
  startMoveNum: number,
  startsWhite: boolean,
): FlatMove[] {
  if (nodes.length === 0) return []

  const main = nodes[0]
  const mover: 'white' | 'black' = startsWhite ? 'white' : 'black'
  const nextMoveNum = startsWhite ? startMoveNum : startMoveNum + 1

  const alts = nodes.slice(1).map(n => ({
    san: n.san,
    games: n.games,
    children: n.children,
  }))

  return [
    { san: main.san, mover, moveNumber: startMoveNum, games: main.games, alternatives: alts },
    ...flattenMainLine(main.children, nextMoveNum, !startsWhite),
  ]
}

/**
 * Walk a branch's main line to get continuation moves.
 */
function walkBranch(
  nodes: MastersMove[],
  startMoveNum: number,
  startsWhite: boolean,
  maxDepth: number,
): { san: string; mover: 'white' | 'black'; moveNumber: number; games: number }[] {
  if (nodes.length === 0 || maxDepth <= 0) return []
  const main = nodes[0]
  const mover: 'white' | 'black' = startsWhite ? 'white' : 'black'
  const nextMoveNum = startsWhite ? startMoveNum : startMoveNum + 1

  return [
    { san: main.san, mover, moveNumber: startMoveNum, games: main.games },
    ...walkBranch(main.children, nextMoveNum, !startsWhite, maxDepth - 1),
  ]
}

// ═══════════════════════════════════════════
// BUILD LESSON PLAN
// ═══════════════════════════════════════════

function buildPlan(
  data: MastersTree,
  movesPerLesson: number,
  mainLessons: number,
  maxDeviations: number,
): LessonPlan[] {
  const prefix = generateSlugPrefix(data.slug)
  const plan: LessonPlan[] = []

  // Parse identity moves to know where we start
  const identityHalfMoves = countIdentityHalfMoves(data.identityMoves)
  const startMoveNum = Math.floor(identityHalfMoves / 2) + 1
  const startsWhite = identityHalfMoves % 2 === 0

  // Build identity moves as FlatMoves (lesson 1 starts from move 1)
  const identityFlat = parseIdentityToFlatMoves(data.identityMoves)

  // Flatten the masters tree (continues after identity)
  const mastersFlat = flattenMainLine(data.root, startMoveNum, startsWhite)

  // Combine: identity moves + masters continuation = full main line
  const allMoves = [...identityFlat, ...mastersFlat]

  // Filter to "our" moves (the side we're teaching)
  const ourMoveIndices: number[] = []
  for (let i = 0; i < allMoves.length; i++) {
    if (allMoves[i].mover === data.side) {
      ourMoveIndices.push(i)
    }
  }

  // Cap to mainLessons worth of our moves
  const maxOurMoves = mainLessons * movesPerLesson
  const cappedIndices = ourMoveIndices.slice(0, maxOurMoves)
  // Track how far into the main line this level goes (for deviation filtering)
  const lastMainIdx = cappedIndices.length > 0 ? cappedIndices[cappedIndices.length - 1] : 0

  // Chunk our moves into lessons
  let lessonNum = 1
  for (let i = 0; i < cappedIndices.length; i += movesPerLesson) {
    const chunkIndices = cappedIndices.slice(i, i + movesPerLesson)
    const firstIdx = Math.max(0, chunkIndices[0] - 1) // include opponent's preceding move
    const lastIdx = chunkIndices[chunkIndices.length - 1]

    const lessonMoves = allMoves.slice(firstIdx, lastIdx + 1).map(m => ({
      san: m.san,
      mover: m.mover,
      moveNumber: m.moveNumber,
      games: m.games,
    }))

    plan.push({
      nodeId: `${prefix}-${lessonNum}`,
      type: 'main',
      title: `Main Line ${lessonNum}`,
      moves: lessonMoves,
    })
    lessonNum++
  }

  // Find all deviations (opponent plays something different)
  interface DeviationCandidate {
    moveIdx: number
    mainSan: string
    altSan: string
    altGames: number
    totalGamesAtPosition: number
    altChildren: MastersMove[]
    moveNumber: number
    mover: 'white' | 'black'
    /** Which main lesson (1-indexed) this deviation falls within */
    lessonNum: number
    /** Percentage of games at this branch point */
    percent: number
  }

  // Build a map of moveIdx -> which lesson it belongs to
  const moveIdxToLesson = new Map<number, number>()
  let lessonIdx = 1
  for (let i = 0; i < cappedIndices.length; i += movesPerLesson) {
    const chunkIndices = cappedIndices.slice(i, i + movesPerLesson)
    const firstIdx = Math.max(0, chunkIndices[0] - 1)
    const lastIdx = chunkIndices[chunkIndices.length - 1]
    for (let j = firstIdx; j <= lastIdx; j++) {
      moveIdxToLesson.set(j, lessonIdx)
    }
    lessonIdx++
  }

  const candidates: DeviationCandidate[] = []
  for (let i = 0; i <= lastMainIdx; i++) {
    const m = allMoves[i]
    // We want deviations where the OPPONENT plays something different
    if (m.mover === data.side) continue
    const totalGames = m.games + m.alternatives.reduce((sum, a) => sum + a.games, 0)
    for (const alt of m.alternatives) {
      if (alt.games >= 100) {
        const percent = totalGames > 0 ? Math.round((alt.games / totalGames) * 100) : 0
        const lesson = moveIdxToLesson.get(i) ?? 1
        candidates.push({
          moveIdx: i,
          mainSan: m.san,
          altSan: alt.san,
          altGames: alt.games,
          totalGamesAtPosition: totalGames,
          altChildren: alt.children,
          moveNumber: m.moveNumber,
          mover: m.mover,
          lessonNum: lesson,
          percent,
        })
      }
    }
  }

  // Classify: major (>= 20%) vs minor (< 20%)
  const majorVariations: MajorVariation[] = []
  const minorCandidates: DeviationCandidate[] = []

  for (const c of candidates) {
    if (c.percent >= 20) {
      const turn = c.mover === 'white' ? `${c.moveNumber}.` : `${c.moveNumber}...`
      majorVariations.push({
        move: c.altSan,
        mainLineMove: c.mainSan,
        games: c.altGames,
        percent: c.percent,
        moveNumber: c.moveNumber,
        description: `${turn}${c.altSan} instead of ${turn}${c.mainSan} (${c.percent}%, ${c.altGames} games)`,
      })
    } else if (c.lessonNum > 1) {
      // Minor variations: skip lesson 1 (no deviations from the first lesson)
      minorCandidates.push(c)
    }
  }

  // Sort minors by games (most popular first)
  minorCandidates.sort((a, b) => b.altGames - a.altGames)

  // Select 2-4 minors, spread across the line (don't cluster at same move)
  const usedMoveNums = new Set<number>()
  const selected: DeviationCandidate[] = []
  for (const c of minorCandidates) {
    if (selected.length >= maxDeviations) break
    if (usedMoveNums.has(c.moveNumber)) continue
    usedMoveNums.add(c.moveNumber)
    selected.push(c)
  }

  // Sort selected by position in the line
  selected.sort((a, b) => a.moveIdx - b.moveIdx)

  for (const dev of selected) {
    const turn = dev.mover === 'white' ? `${dev.moveNumber}.` : `${dev.moveNumber}...`

    // The deviation move itself
    const devMove = {
      san: dev.altSan,
      mover: dev.mover,
      moveNumber: dev.moveNumber,
      games: dev.altGames,
    }

    // Follow the continuation (our response + further play)
    const nextMoveNum = dev.mover === 'white' ? dev.moveNumber : dev.moveNumber + 1
    const continuation = walkBranch(dev.altChildren, nextMoveNum, dev.mover !== 'white', 10)

    const devId = `${prefix}-dev-${dev.altSan.replace(/[+#!?x]/g, '')}`
    plan.push({
      nodeId: devId,
      type: 'deviation',
      title: `After ${turn}${dev.altSan}`,
      deviationMove: dev.altSan,
      mainLineMove: dev.mainSan,
      branchGames: dev.altGames,
      branchPercent: dev.percent,
      branchesFromLesson: dev.lessonNum,
      moves: [devMove, ...continuation],
    })
  }

  // Add test node
  plan.push({
    nodeId: `${prefix}-test-1`,
    type: 'test',
    title: 'Level Test',
    moves: [],
  })

  return { plan, majorVariations }
}

function countIdentityHalfMoves(moveStr: string): number {
  const game = new Chess()
  const cleaned = moveStr.trim().replace(/(\d+)\.\s+/g, '$1.')
  const tokens = cleaned.split(/\s+/)
  let count = 0

  for (const token of tokens) {
    const numberedBlack = token.match(/^(\d+)\.\.\.(.+)$/)
    const numberedWhite = token.match(/^(\d+)\.([A-Za-z].+)$/)

    let san: string | null = null
    if (numberedBlack) san = numberedBlack[2]
    else if (numberedWhite) san = numberedWhite[2]
    else if (/^[A-Za-z]/.test(token) || token === 'O-O' || token === 'O-O-O') san = token

    if (san) {
      try { game.move(san); count++ } catch { break }
    }
  }

  return count
}

// ═══════════════════════════════════════════
// DISPLAY
// ═══════════════════════════════════════════

function fmtGames(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`
}

function displayPlan(plan: LessonPlan[], majorVariations: MajorVariation[], data: MastersTree) {
  console.log(`\n${data.slug.toUpperCase()} Level ${data.level} — Lesson Plan`)
  console.log(`Side: ${data.side}`)
  console.log(`Identity: ${data.identityMoves}`)
  console.log(`${'='.repeat(60)}\n`)

  for (const lesson of plan) {
    if (lesson.type === 'test') {
      console.log(`  [TEST] ${lesson.nodeId} — ${lesson.title}`)
      console.log()
      continue
    }

    const typeTag = lesson.type.toUpperCase().padEnd(9)
    console.log(`  [${typeTag}] ${lesson.nodeId} — ${lesson.title}`)

    if (lesson.deviationMove) {
      const pct = lesson.branchPercent ? ` ${lesson.branchPercent}%` : ''
      const fromLesson = lesson.branchesFromLesson ? ` (branches from lesson ${lesson.branchesFromLesson})` : ''
      console.log(`           Opponent plays ${lesson.deviationMove} instead of ${lesson.mainLineMove} (${fmtGames(lesson.branchGames!)} games,${pct})${fromLesson}`)
    }

    // Print moves in a readable format
    let line = '           '
    for (const m of lesson.moves) {
      const turn = m.mover === 'white' ? `${m.moveNumber}.` : ''
      const moveStr = `${turn}${m.san}`
      if (line.length + moveStr.length > 80) {
        console.log(line)
        line = '           '
      }
      line += moveStr + ' '
    }
    if (line.trim()) console.log(line)

    // Show game counts for first and last move
    if (lesson.moves.length > 0) {
      const first = lesson.moves[0]
      const last = lesson.moves[lesson.moves.length - 1]
      console.log(`           (${fmtGames(first.games)} → ${fmtGames(last.games)} master games)`)
    }
    console.log()
  }

  const mainCount = plan.filter(p => p.type === 'main').length
  const devCount = plan.filter(p => p.type === 'deviation').length
  console.log(`Total: ${mainCount} main + ${devCount} minor deviations + 1 test = ${plan.length} lessons`)

  // Display major variations (need their own levels)
  if (majorVariations.length > 0) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`MAJOR VARIATIONS (>= 20% — need dedicated levels):`)
    console.log(`${'='.repeat(60)}`)
    for (const mv of majorVariations) {
      console.log(`  ${mv.description}`)
    }
  }
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

function main() {
  const { slug, level, movesPerLesson, mainLessons, preview, maxDeviations } = parseArgs()

  const mastersPath = join(BUILDS_DIR, `${slug}-L${level}`, 'masters.json')
  if (!existsSync(mastersPath)) {
    console.error(`No masters.json found at ${mastersPath}`)
    console.error(`Run download-masters.ts first.`)
    process.exit(1)
  }

  const data: MastersTree = JSON.parse(readFileSync(mastersPath, 'utf-8'))
  const { plan, majorVariations } = buildPlan(data, movesPerLesson, mainLessons, maxDeviations)

  displayPlan(plan, majorVariations, data)

  if (!preview) {
    const buildDir = join(BUILDS_DIR, `${slug}-L${level}`)
    const outPath = join(buildDir, 'plan.json')
    writeFileSync(outPath, JSON.stringify(plan, null, 2) + '\n')
    console.log(`\nSaved to ${outPath}`)

    // Save roadmap of major variations
    if (majorVariations.length > 0) {
      const roadmapPath = join(buildDir, 'roadmap.json')
      writeFileSync(roadmapPath, JSON.stringify(majorVariations, null, 2) + '\n')
      console.log(`Roadmap saved to ${roadmapPath}`)
    }
  }
}

main()
