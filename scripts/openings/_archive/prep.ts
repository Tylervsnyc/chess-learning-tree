#!/usr/bin/env npx tsx
/**
 * Stage 1: PREP — Deterministic FEN computation + Lichess cloud eval
 *
 * Input:  --slug pirc-defense --level 2 --moves "1.e4 d6 2.d4 Nf6 ..."
 * Output: data/opening-builds/{slug}-L{level}/prep.json
 *
 * Zero LLM. chess.js for FENs, Lichess API for evals.
 */

import { Chess } from 'chess.js'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import type { PrepData, PrepPosition, LessonPlanItem } from './types'

config({ path: join(dirname(fileURLToPath(import.meta.url)), '../../.env.local') })

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const BUILDS_DIR = join(ROOT, 'data/opening-builds')
const LICHESS_TOKEN = process.env.LICHESS_TOKEN ?? ''

// ═══════════════════════════════════════════
// CLI ARGS
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
  const movesPerLesson = parseInt(get('--moves-per-lesson') ?? '3', 10)
  const minLessons = parseInt(get('--min-lessons') ?? '10', 10)
  const variationThreshold = parseInt(get('--variation-threshold') ?? '50', 10) // centipawns
  const skipEval = args.includes('--skip-eval')
  const sideOverride = get('--side') as 'white' | 'black' | undefined
  // How many half-moves define the opening identity (no deviations before this point).
  // e.g. Ruy Lopez = "1.e4 e5 2.Nf3 Nc6 3.Bb5" = 5 half-moves → --identity-moves 5
  const identityMoves = parseInt(get('--identity-moves') ?? '0', 10)

  if (!slug || !level || !moves) {
    console.error('Usage: prep.ts --slug <slug> --level <n> --moves "1.e4 d6 2.d4 Nf6 ..." [--side black] [--identity-moves 5]')
    process.exit(1)
  }

  return { slug, level: parseInt(level, 10), moves, movesPerLesson, minLessons, variationThreshold, skipEval, sideOverride, identityMoves }
}

// ═══════════════════════════════════════════
// MOVE PARSER
// ═══════════════════════════════════════════

interface ParsedMove {
  moveNumber: number
  san: string
  mover: 'white' | 'black'
}

/**
 * Parse a move string like "1.e4 d6 2.d4 Nf6 3.Nc3" into individual moves.
 * Handles: "1.e4 d5", "1. e4 d5", "1.e4 2.d4" (white-only sequence)
 */
function parseMoveString(moveStr: string): ParsedMove[] {
  const moves: ParsedMove[] = []
  // Normalize: remove extra spaces, handle "1. e4" → "1.e4"
  const cleaned = moveStr.trim().replace(/(\d+)\.\s+/g, '$1.')

  // Split into tokens
  const tokens = cleaned.split(/\s+/)
  let currentMoveNumber = 1

  for (const token of tokens) {
    // Match move number prefix: "1.e4", "1...d5", "2.Nf3"
    const numberedWhite = token.match(/^(\d+)\.([A-Za-z].+)$/)
    const numberedBlack = token.match(/^(\d+)\.\.\.(.+)$/)

    if (numberedBlack) {
      currentMoveNumber = parseInt(numberedBlack[1], 10)
      moves.push({ moveNumber: currentMoveNumber, san: numberedBlack[2], mover: 'black' })
    } else if (numberedWhite) {
      currentMoveNumber = parseInt(numberedWhite[1], 10)
      moves.push({ moveNumber: currentMoveNumber, san: numberedWhite[2], mover: 'white' })
    } else if (/^[A-Za-z]/.test(token) || token === 'O-O' || token === 'O-O-O') {
      // Bare move — determine color from context
      const lastMove = moves[moves.length - 1]
      if (lastMove?.mover === 'white') {
        moves.push({ moveNumber: currentMoveNumber, san: token, mover: 'black' })
      } else {
        currentMoveNumber = lastMove ? currentMoveNumber + 1 : currentMoveNumber
        moves.push({ moveNumber: currentMoveNumber, san: token, mover: 'white' })
      }
    }
    // Skip anything else (annotations like "!", "?", etc.)
  }

  return moves
}

// ═══════════════════════════════════════════
// FEN COMPUTATION
// ═══════════════════════════════════════════

interface ComputedPosition {
  fenBefore: string
  fenAfter: string
  san: string
  uci: string
  moveNumber: number
  mover: 'white' | 'black'
  /** All UCI moves up to and including this one */
  uciHistory: string[]
}

function computePositions(parsedMoves: ParsedMove[]): ComputedPosition[] {
  const game = new Chess()
  const positions: ComputedPosition[] = []
  const uciHistory: string[] = []

  for (const pm of parsedMoves) {
    const fenBefore = game.fen()
    try {
      const result = game.move(pm.san)
      if (!result) {
        console.error(`❌ Illegal move: ${pm.san} at position ${fenBefore}`)
        process.exit(1)
      }
      const uci = `${result.from}${result.to}${result.promotion ?? ''}`
      uciHistory.push(uci)
      positions.push({
        fenBefore,
        fenAfter: game.fen(),
        san: result.san,
        uci,
        moveNumber: pm.moveNumber,
        mover: pm.mover,
        uciHistory: [...uciHistory],
      })
    } catch (e) {
      console.error(`❌ Move error: ${pm.san} — ${e}`)
      process.exit(1)
    }
  }

  return positions
}

// ═══════════════════════════════════════════
// LICHESS CLOUD EVAL
// ═══════════════════════════════════════════

const LICHESS_EVAL_URL = 'https://lichess.org/api/cloud-eval'
const LICHESS_MASTERS_URL = 'https://explorer.lichess.org/masters'

// ═══════════════════════════════════════════
// LICHESS MASTERS EXPLORER
// ═══════════════════════════════════════════

interface MastersMove {
  uci: string
  san: string
  white: number
  draws: number
  black: number
}

interface MastersResponse {
  white: number
  draws: number
  black: number
  moves: MastersMove[]
}

/**
 * Fetch top moves from Lichess masters database for a given position.
 * Uses UCI play string format: e2e4,e7e5,g1f3,...
 */
async function fetchMastersExplorer(uciMoves: string[]): Promise<MastersResponse | null> {
  const play = uciMoves.join(',')
  const url = `${LICHESS_MASTERS_URL}?play=${play}`

  const headers: Record<string, string> = { 'Accept': 'application/json' }
  if (LICHESS_TOKEN) {
    headers['Authorization'] = `Bearer ${LICHESS_TOKEN}`
  }

  try {
    const res = await fetch(url, { headers })
    if (!res.ok) {
      console.warn(`  ⚠ Masters API ${res.status} for play=${play.slice(0, 40)}...`)
      return null
    }
    return await res.json() as MastersResponse
  } catch (e) {
    console.warn(`  ⚠ Masters fetch error: ${e}`)
    return null
  }
}

function totalGames(m: MastersMove): number {
  return m.white + m.draws + m.black
}

async function fetchCloudEval(fen: string): Promise<PrepPosition['eval']> {
  const url = `${LICHESS_EVAL_URL}?fen=${encodeURIComponent(fen)}&multiPv=3`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`  ⚠ No cloud eval for: ${fen.split(' ').slice(0, 2).join(' ')}...`)
        return null
      }
      console.warn(`  ⚠ Lichess ${res.status} for: ${fen.split(' ').slice(0, 2).join(' ')}...`)
      return null
    }

    const data = await res.json()
    const pvs = data.pvs || []

    const topMoves = pvs.slice(0, 3).map((pv: { moves: string; cp?: number; mate?: number }) => {
      const san = pv.moves.split(' ')[0] // First move in UCI — we'll convert below
      const cp = pv.mate !== undefined ? (pv.mate > 0 ? 10000 : -10000) : (pv.cp ?? 0)
      return { san, cp }
    })

    // Convert UCI moves to SAN
    const game = new Chess(fen)
    const sanTopMoves = topMoves.map((tm: { san: string; cp: number }) => {
      try {
        // Lichess returns UCI (e.g., "e2e4"), we need SAN (e.g., "e4")
        const from = tm.san.slice(0, 2)
        const to = tm.san.slice(2, 4)
        const promotion = tm.san[4]
        const tempGame = new Chess(fen)
        const move = tempGame.move({ from, to, promotion })
        return { san: move ? move.san : tm.san, cp: tm.cp }
      } catch {
        return { san: tm.san, cp: tm.cp }
      }
    })

    const mainCp = pvs[0]?.mate !== undefined
      ? (pvs[0].mate > 0 ? 10000 : -10000)
      : (pvs[0]?.cp ?? 0)

    return { cp: mainCp, topMoves: sanTopMoves }
  } catch (e) {
    console.warn(`  ⚠ Lichess fetch error: ${e}`)
    return null
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ═══════════════════════════════════════════
// LESSON PLAN GENERATION
// ═══════════════════════════════════════════

function generateSlugPrefix(slug: string): string {
  // Common prefix mappings
  const PREFIXES: Record<string, string> = {
    'italian': 'it',
    'pirc-defense': 'pi',
    'pirc-austrian': 'pa',
    'ruy-lopez': 'rl',
    'sicilian': 'si',
    'french': 'fr',
    'london': 'ln',
    'scotch': 'sc',
    'caro-kann': 'ck',
    'kings-gambit': 'kg',
    'kings-indian': 'ki',
  }
  return PREFIXES[slug] ?? slug.split('-').map(w => w[0]).join('')
}

async function buildLessonPlan(
  positions: ComputedPosition[],
  prepPositions: PrepPosition[],
  slug: string,
  side: 'white' | 'black',
  movesPerLesson: number,
  minLessons: number,
  variationThreshold: number,
): Promise<LessonPlanItem[]> {
  const prefix = generateSlugPrefix(slug)
  const plan: LessonPlanItem[] = []

  // Filter to only "our" moves (the side we're teaching)
  const ourMoves = positions.filter(p => p.mover === side)

  // Chunk our moves into lessons of `movesPerLesson`
  let lessonNum = 1
  for (let i = 0; i < ourMoves.length; i += movesPerLesson) {
    const chunk = ourMoves.slice(i, i + movesPerLesson)
    const nodeId = `${prefix}-${lessonNum}`

    // Get all positions (including opponent responses) for this chunk
    const firstIdx = positions.indexOf(chunk[0])
    const lastIdx = positions.indexOf(chunk[chunk.length - 1])
    const lessonPositions = prepPositions.slice(firstIdx, lastIdx + 1)

    plan.push({
      nodeId,
      type: 'main',
      newMoves: chunk.map(c => c.san),
      positions: lessonPositions,
    })
    lessonNum++
  }

  // Find deviation candidates from masters data
  // Strategy: pick the BEST deviation per position, then select top 2-3 across positions.
  // This ensures diversity (deviations from different points in the line).
  const MAX_DEVIATIONS = 3
  const bestPerPosition: { pos: PrepPosition; candidate: PrepPosition['deviationCandidates'][0]; posIdx: number }[] = []

  for (let i = 0; i < prepPositions.length; i++) {
    const pos = prepPositions[i]
    if (pos.deviationCandidates.length > 0 && pos.mover !== side) {
      // Pick the most popular deviation at this position
      const best = pos.deviationCandidates.reduce((a, b) => a.masterGames > b.masterGames ? a : b)
      bestPerPosition.push({ pos, candidate: best, posIdx: i })
    }
  }

  // Sort by position index descending — prefer deviations LATER in the line
  // (early deviations like 1...e6 are less relevant to a specific opening)
  bestPerPosition.sort((a, b) => b.posIdx - a.posIdx)

  // Take top N deviations
  const selectedDeviations = bestPerPosition.slice(0, MAX_DEVIATIONS)
  for (const { pos, candidate } of selectedDeviations) {
    const devId = `${prefix}-dev-${candidate.move.replace(/[+#!?]/g, '')}`
    if (!plan.some(p => p.nodeId === devId)) {
      plan.push({
        nodeId: devId,
        type: 'deviation',
        deviationMove: candidate.move,
        newMoves: [],
        ourResponse: candidate.ourBestResponse ? [candidate.ourBestResponse] : [],
        positions: [pos],
      })
    }
  }

  // Find variation candidates to reach minLessons target
  // Look for positions where OUR side has a reasonable #2 move
  const nonTestCount = plan.length // current main + deviation count (test not added yet)
  const variationsNeeded = Math.max(0, minLessons - nonTestCount - 1) // -1 for test node

  if (variationsNeeded > 0) {
    console.log(`\n🔀 Need ${variationsNeeded} variation(s) to reach ${minLessons} lessons`)

    // Rank variation candidates by how interesting they are (smallest eval diff = most viable)
    // We need to look at positions where it's OUR TURN (before our move) to find alternatives.
    // That means: look at positions where the PREVIOUS move was by the opponent.
    // The eval for that previous position's FEN tells us what moves are available for our side.
    interface VariationCandidate {
      posIdx: number
      altMove: string
      cpDiff: number
      fenBefore: string // FEN where it's our turn (before our move was played)
      moveNumber: number
    }
    const candidates: VariationCandidate[] = []

    for (let i = 0; i < prepPositions.length; i++) {
      const pos = prepPositions[i]
      // We want positions where OUR side just moved — the eval of the position BEFORE
      // this move was played shows what alternatives WE had
      if (pos.mover !== side) continue

      // Get the FEN before our move (where it's our turn to choose)
      const fenBefore = i > 0 ? prepPositions[i - 1].fen : positions[i].fenBefore

      // Fetch eval for the "before" position to see our alternatives
      const beforeEval = await fetchCloudEval(fenBefore)
      if (beforeEval) await sleep(1100)
      if (!beforeEval || beforeEval.topMoves.length < 2) continue

      // The top move should be what we actually played
      const bestCp = beforeEval.topMoves[0].cp
      for (let j = 1; j < beforeEval.topMoves.length; j++) {
        const alt = beforeEval.topMoves[j]
        const diff = Math.abs(alt.cp - bestCp)
        // Skip if it's the same move we're already teaching
        if (alt.san === pos.moveSan) continue
        if (diff <= variationThreshold) {
          candidates.push({
            posIdx: i,
            altMove: alt.san,
            cpDiff: diff,
            fenBefore,
            moveNumber: pos.moveNumber,
          })
        }
      }
    }

    // Sort by eval diff (most viable = smallest diff first)
    candidates.sort((a, b) => a.cpDiff - b.cpDiff)

    console.log(`   Found ${candidates.length} variation candidate(s) within ${variationThreshold}cp threshold`)

    // Build variation lessons — fetch follow-up moves from Lichess
    let branchNum = 1
    let variationsBuilt = 0
    for (const cand of candidates) {
      if (variationsBuilt >= variationsNeeded) break
      console.log(`   Building variation: ${cand.moveNumber}.${side === 'black' ? '..' : ''}${cand.altMove} (${cand.cpDiff}cp from best)`)

      // Play the alternative move to get the resulting FEN
      const varPositions: PrepPosition[] = []
      const game = new Chess(cand.fenBefore)

      try {
        const altResult = game.move(cand.altMove)
        if (!altResult) continue

        // First position: our alternative move
        const altEval = await fetchCloudEval(game.fen())
        if (altEval) await sleep(1100)
        varPositions.push({
          fen: game.fen(),
          moveSan: altResult.san,
          moveNumber: cand.moveNumber,
          mover: side,
          eval: altEval,
          deviationCandidates: [],
        })

        // Follow up with more moves (opponent best + our best, alternating)
        const movesToFetch = movesPerLesson * 2 // enough for ~3 of our moves
        let currentMoveNum = cand.moveNumber
        for (let m = 0; m < movesToFetch; m++) {
          const currentFen = game.fen()
          const evalData = await fetchCloudEval(currentFen)
          if (evalData) await sleep(1100)

          if (!evalData || evalData.topMoves.length === 0) break

          const bestMove = evalData.topMoves[0].san
          try {
            const moveResult = game.move(bestMove)
            if (!moveResult) break

            // Determine who just moved based on whose turn it is NOW
            const whoJustMoved: 'white' | 'black' = game.turn() === 'w' ? 'black' : 'white'
            if (whoJustMoved === 'white') currentMoveNum++ // increment after white moves
            varPositions.push({
              fen: game.fen(),
              moveSan: moveResult.san,
              moveNumber: currentMoveNum,
              mover: whoJustMoved,
              eval: await fetchCloudEval(game.fen()),
              deviationCandidates: [],
            })
            await sleep(1100)
          } catch {
            break
          }
        }

        // Only add if we got enough positions for a real lesson
        const ourVarMoves = varPositions.filter(p => p.mover === side)
        if (ourVarMoves.length >= 2) {
          const branchId = `${prefix}-var-${branchNum}`
          plan.push({
            nodeId: branchId,
            type: 'branch',
            newMoves: ourVarMoves.map(p => p.moveSan),
            positions: varPositions,
          })
          console.log(`   ✓ ${branchId}: ${varPositions.length} positions, ${ourVarMoves.length} of our moves`)
          branchNum++
          variationsBuilt++
        } else {
          console.log(`   ⚠ Skipped — only ${ourVarMoves.length} of our moves in follow-up`)
        }
      } catch (e) {
        console.warn(`   ⚠ Failed to build variation: ${e}`)
      }
    }

    // If still short, widen the threshold and log a warning
    const finalNonTest = plan.length
    if (finalNonTest + 1 < minLessons) {
      console.warn(`\n⚠ Only ${finalNonTest + 1} lessons (target: ${minLessons}). Consider:`)
      console.warn(`   --variation-threshold ${variationThreshold + 50} (widen search)`)
      console.warn(`   --moves-per-lesson 2 (more main line chunks)`)
      console.warn(`   Or manually add variation lines to prep.json`)
    }
  }

  // Add a test node at the end
  plan.push({
    nodeId: `${prefix}-test-1`,
    type: 'test',
    newMoves: [],
    positions: [],
  })

  return plan
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  const { slug, level, moves, movesPerLesson, minLessons, variationThreshold, skipEval, sideOverride, identityMoves } = parseArgs()

  console.log(`\n🔧 PREP: ${slug} Level ${level}`)
  console.log(`   Moves: ${moves}`)
  console.log(`   Moves/lesson: ${movesPerLesson}`)
  if (skipEval) console.log(`   ⚠ Skipping Lichess evals (--skip-eval)`)

  // 1. Parse moves
  const parsedMoves = parseMoveString(moves)
  console.log(`\n📋 Parsed ${parsedMoves.length} half-moves`)

  // Determine side from first move (or override)
  const side = sideOverride ?? (parsedMoves[0]?.mover === 'white' ? 'white' : 'black')
  console.log(`   Side: ${side}`)

  // 2. Compute FENs
  const computed = computePositions(parsedMoves)
  console.log(`✅ Computed ${computed.length} positions`)

  // 3. Fetch Lichess evals
  const prepPositions: PrepPosition[] = []

  for (let i = 0; i < computed.length; i++) {
    const cp = computed[i]
    const evalData = skipEval ? null : await fetchCloudEval(cp.fenAfter)

    // Find deviation candidates from masters DB at opponent move positions
    // Skip positions within the identity window — those are different openings, not deviations
    const deviationCandidates: PrepPosition['deviationCandidates'] = []
    if (!skipEval && cp.mover !== side && i >= identityMoves) {
      // At this position, the opponent just moved. Check what alternatives existed.
      // Use the UCI history BEFORE this move to query masters explorer.
      const uciBeforeThisMove = i > 0 ? computed[i - 1].uciHistory : []
      const mastersData = await fetchMastersExplorer(uciBeforeThisMove)
      if (mastersData) await sleep(1100)

      if (mastersData && mastersData.moves.length >= 2) {
        const totalAll = mastersData.moves.reduce((sum, m) => sum + totalGames(m), 0)
        const mainMove = mastersData.moves[0] // #1 = main line (what we teach)

        for (let j = 1; j < Math.min(4, mastersData.moves.length); j++) {
          const alt = mastersData.moves[j]
          const games = totalGames(alt)
          const pct = (games / totalAll) * 100

          // Must have 100+ master games OR 5%+ of total
          if (games >= 100 || pct >= 5) {
            // Fetch one level deeper: our best response to this deviation
            const deviationUci = [...uciBeforeThisMove, alt.uci]
            const responseData = await fetchMastersExplorer(deviationUci)
            if (responseData) await sleep(1100)

            const ourBestResponse = responseData?.moves?.[0]?.san ?? '?'

            deviationCandidates.push({
              move: alt.san,
              masterGames: games,
              ourBestResponse,
            })
          }
        }
      }
    }

    prepPositions.push({
      fen: cp.fenAfter,
      moveSan: cp.san,
      moveNumber: cp.moveNumber,
      mover: cp.mover,
      eval: evalData,
      deviationCandidates,
    })

    if (!skipEval) {
      const evalStr = evalData ? `${evalData.cp! >= 0 ? '+' : ''}${(evalData.cp! / 100).toFixed(1)}` : '?'
      const devStr = deviationCandidates.length > 0 ? ` 🔀 dev: ${deviationCandidates.map(d => `${d.move}(${d.masterGames}g)`).join(',')}` : ''
      console.log(`   ${cp.moveNumber}.${cp.mover === 'black' ? '..' : ''}${cp.san} → ${evalStr}${devStr}`)

      // Rate limit: 1 req/sec for Lichess API
      if (i < computed.length - 1) await sleep(1100)
    }
  }

  // 4. Verify our moves are #1
  let moveWarnings = 0
  for (const pos of prepPositions) {
    if (pos.eval && pos.eval.topMoves.length > 0) {
      if (pos.eval.topMoves[0].san !== pos.moveSan) {
        console.warn(`  ⚠ Move ${pos.moveNumber}.${pos.mover === 'black' ? '..' : ''}${pos.moveSan} is NOT #1 in Lichess eval (top: ${pos.eval.topMoves[0].san})`)
        moveWarnings++
      }
    }
  }

  if (moveWarnings > 0) {
    console.warn(`\n⚠ ${moveWarnings} move(s) are not #1 in Lichess eval. Review prep.json before continuing.`)
  }

  // 5. Build lesson plan
  const lessonPlan = await buildLessonPlan(computed, prepPositions, slug, side, movesPerLesson, minLessons, variationThreshold)
  console.log(`\n📚 Lesson plan: ${lessonPlan.length} nodes`)
  for (const lp of lessonPlan) {
    const movesStr = lp.newMoves.length > 0 ? lp.newMoves.join(' ') : '(test)'
    console.log(`   ${lp.nodeId} [${lp.type}] ${movesStr}`)
  }

  // 6. Write output
  const outDir = join(BUILDS_DIR, `${slug}-L${level}`)
  mkdirSync(outDir, { recursive: true })
  mkdirSync(join(outDir, 'lessons'), { recursive: true })

  const prepData: PrepData = {
    meta: {
      slug,
      level,
      side,
      mainLine: moves,
      generatedAt: new Date().toISOString(),
    },
    positions: prepPositions,
    lessonPlan,
  }

  const outPath = join(outDir, 'prep.json')
  writeFileSync(outPath, JSON.stringify(prepData, null, 2) + '\n')
  console.log(`\n✅ Written to ${outPath}`)
  console.log(`\nNext: review prep.json, then run write-tree.ts`)
}

main().catch(e => {
  console.error('💥 Prep failed:', e)
  process.exit(1)
})
