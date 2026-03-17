#!/usr/bin/env npx tsx
/**
 * WRITE-LESSONS v2 — Generate lesson content from plan.json + masters data
 *
 * Reads plan.json (from prep-from-masters.ts), computes FENs with chess.js,
 * sends a focused prompt to Claude, writes individual lesson JSON files.
 *
 * Usage:
 *   npx tsx scripts/openings/write-lessons-v2.ts --slug ruy-lopez --level 1
 *   npx tsx scripts/openings/write-lessons-v2.ts --slug ruy-lopez --level 1 --node rl-1
 */

import { Chess } from 'chess.js'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const BUILDS_DIR = join(ROOT, 'data/opening-builds')

// ═══════════════════════════════════════════
// TYPES (matching plan.json output)
// ═══════════════════════════════════════════

interface PlanMove {
  san: string
  mover: 'white' | 'black'
  moveNumber: number
  games: number
}

interface LessonPlan {
  nodeId: string
  type: 'main' | 'deviation' | 'branch' | 'test'
  title: string
  moves: PlanMove[]
  deviationMove?: string
  mainLineMove?: string
  branchGames?: number
}

interface MastersTree {
  slug: string
  level: number
  side: 'white' | 'black'
  identityMoves: string
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
  const singleNode = get('--node')
  const batchSize = parseInt(get('--batch-size') ?? '6', 10)

  if (!slug || !level) {
    console.error('Usage: write-lessons-v2.ts --slug <slug> --level <n> [--node <nodeId>]')
    process.exit(1)
  }

  return { slug, level: parseInt(level, 10), singleNode, batchSize }
}

// ═══════════════════════════════════════════
// FEN COMPUTATION
// ═══════════════════════════════════════════

interface FenMove {
  san: string
  mover: 'white' | 'black'
  moveNumber: number
  games: number
  fenBefore: string
  fenAfter: string
}

/**
 * Compute FENs for a lesson's moves, starting from the identity position.
 */
function computeFens(identityMoves: string, lessonMoves: PlanMove[], isDeviation: boolean): FenMove[] {
  const game = new Chess()

  // Play identity moves first
  const cleaned = identityMoves.trim().replace(/(\d+)\.\s+/g, '$1.')
  const tokens = cleaned.split(/\s+/)
  for (const token of tokens) {
    const numberedBlack = token.match(/^(\d+)\.\.\.(.+)$/)
    const numberedWhite = token.match(/^(\d+)\.([A-Za-z].+)$/)
    let san: string | null = null
    if (numberedBlack) san = numberedBlack[2]
    else if (numberedWhite) san = numberedWhite[2]
    else if (/^[A-Za-z]/.test(token) || token === 'O-O' || token === 'O-O-O') san = token
    if (san) game.move(san)
  }

  // For main line lessons, we need to play preceding main line moves
  // The plan gives us the moves for THIS lesson, but we need to get to
  // the right position first. For main lessons, play from identity to
  // where this lesson's moves start.
  //
  // For deviations, we also need the main line moves up to the deviation point.
  // The deviation lesson's moves start with the deviation move itself.

  const result: FenMove[] = []
  for (const m of lessonMoves) {
    const fenBefore = game.fen()
    try {
      game.move(m.san)
    } catch (e) {
      console.warn(`  Failed to play ${m.san} at ${fenBefore}: ${e}`)
      break
    }
    result.push({
      ...m,
      fenBefore,
      fenAfter: game.fen(),
    })
  }

  return result
}

/**
 * Compute FENs for the full main line (all lessons combined),
 * then slice out each lesson's portion.
 */
function computeAllFens(
  identityMoves: string,
  plan: LessonPlan[],
): Map<string, FenMove[]> {
  const result = new Map<string, FenMove[]>()

  // First: compute the full main line
  const mainLessons = plan.filter(p => p.type === 'main')
  const allMainMoves = mainLessons.flatMap(l => l.moves)

  const game = new Chess()

  // Play identity moves
  playIdentity(game, identityMoves)
  const identityFen = game.fen()

  // Play all main line moves and record FENs
  const mainFens: FenMove[] = []
  for (const m of allMainMoves) {
    const fenBefore = game.fen()
    try {
      game.move(m.san)
    } catch (e) {
      console.warn(`  Main line: failed ${m.san} at position: ${e}`)
      break
    }
    mainFens.push({ ...m, fenBefore, fenAfter: game.fen() })
  }

  // Slice main FENs per lesson
  let offset = 0
  for (const lesson of mainLessons) {
    const count = lesson.moves.length
    result.set(lesson.nodeId, mainFens.slice(offset, offset + count))
    offset += count
  }

  // For deviations: replay main line up to deviation point, then play deviation moves
  for (const lesson of plan.filter(p => p.type === 'deviation')) {
    const devGame = new Chess()
    playIdentity(devGame, identityMoves)

    // Play main line moves until we reach the deviation's move number
    // The deviation's first move replaces a main line move at that point
    const devFirstMove = lesson.moves[0]
    if (devFirstMove) {
      // Play main line moves up to (but not including) the deviation point
      for (const mf of mainFens) {
        if (mf.moveNumber === devFirstMove.moveNumber && mf.mover === devFirstMove.mover) {
          break
        }
        try { devGame.move(mf.san) } catch { break }
      }
    }

    // Now play the deviation moves
    const devFens: FenMove[] = []
    for (const m of lesson.moves) {
      const fenBefore = devGame.fen()
      try {
        devGame.move(m.san)
      } catch (e) {
        console.warn(`  Deviation ${lesson.nodeId}: failed ${m.san}: ${e}`)
        break
      }
      devFens.push({ ...m, fenBefore, fenAfter: devGame.fen() })
    }
    result.set(lesson.nodeId, devFens)
  }

  return result
}

function playIdentity(game: Chess, identityMoves: string) {
  const cleaned = identityMoves.trim().replace(/(\d+)\.\s+/g, '$1.')
  const tokens = cleaned.split(/\s+/)
  for (const token of tokens) {
    const numberedBlack = token.match(/^(\d+)\.\.\.(.+)$/)
    const numberedWhite = token.match(/^(\d+)\.([A-Za-z].+)$/)
    let san: string | null = null
    if (numberedBlack) san = numberedBlack[2]
    else if (numberedWhite) san = numberedWhite[2]
    else if (/^[A-Za-z]/.test(token) || token === 'O-O' || token === 'O-O-O') san = token
    if (san) game.move(san)
  }
}

// ═══════════════════════════════════════════
// PROMPT BUILDER
// ═══════════════════════════════════════════

function buildPrompt(
  lessons: LessonPlan[],
  fenMap: Map<string, FenMove[]>,
  meta: MastersTree,
): string {
  const side = meta.side
  const sideUpper = side === 'white' ? 'White' : 'Black'
  const oppSide = side === 'white' ? 'Black' : 'White'

  // Read types file for reference
  const typesPath = join(ROOT, 'types/opening-lesson.ts')
  const types = existsSync(typesPath) ? readFileSync(typesPath, 'utf-8') : ''

  // Read a template for style reference (first 70 lines of an existing lesson)
  const templatePath = join(ROOT, 'data/openings/london-lessons.ts')
  let template = ''
  if (existsSync(templatePath)) {
    const lines = readFileSync(templatePath, 'utf-8').split('\n')
    // Find the first lesson function and grab ~70 lines
    const startIdx = lines.findIndex(l => l.includes('function getLn1'))
    if (startIdx !== -1) {
      template = lines.slice(startIdx, startIdx + 70).join('\n')
    }
  }

  const lessonBlocks = lessons.map(lesson => {
    const fens = fenMap.get(lesson.nodeId) ?? []
    const moveList = fens.map(f => {
      const turn = f.mover === 'white' ? `${f.moveNumber}.` : `${f.moveNumber}...`
      const who = f.mover === side ? 'USER PLAYS' : 'OPPONENT (auto-advance)'
      return `  ${turn}${f.san} [${who}]
    FEN before: ${f.fenBefore}
    FEN after:  ${f.fenAfter}
    (${f.games >= 1000 ? `${(f.games/1000).toFixed(1)}k` : f.games} master games)`
    }).join('\n')

    let header = `--- ${lesson.nodeId} [${lesson.type.toUpperCase()}] "${lesson.title}" ---`
    if (lesson.deviationMove) {
      header += `\nOpponent plays ${lesson.deviationMove} instead of main line ${lesson.mainLineMove} (${lesson.branchGames} master games)`
    }

    return `${header}\n${moveList}`
  }).join('\n\n')

  return `You are writing interactive chess lessons for a mobile app called The Chess Path (Duolingo for chess).

OPENING: ${meta.slug} (Level ${meta.level})
SIDE: ${sideUpper} (user plays as ${sideUpper})
IDENTITY: ${meta.identityMoves}

Every move below comes from the Lichess masters database with real game counts. These are established theory — teach them with confidence.

=== TYPES (follow exactly) ===
${types}

=== STYLE REFERENCE ===
${template}

=== LESSONS TO WRITE ===
${lessonBlocks}

=== RULES ===

1. Output ONLY valid JSON. One JSON object per lesson. Separate multiple lessons with "---LESSON_SEPARATOR---".

2. Each lesson JSON:
{
  "id": "node-id",
  "title": "Lesson Title",
  "defaultOrientation": "${side}",
  "steps": [...]
}

3. Step rules:
   - ${sideUpper} moves = "play-move" steps (user drags the piece)
   - ${oppSide} moves = "instruction" steps with autoAdvance: 800 (opponent moves automatically)
   - FENs are PROVIDED above. Use fenBefore for play-move steps and instruction steps showing the opponent's move.
   - NEVER compute or guess FENs. Copy them exactly from above.
   - correctMove = SAN format (e.g., "Ba4", "O-O", "Nbd2")

4. Lesson flow:
   - Open with an instruction explaining what this lesson covers (1-2 sentences)
   - For each move pair: brief instruction context -> play-move (our move) -> auto-advance instruction (their reply)
   - For deviations: explain why opponents play this and how to respond. NOT "punish this mistake" — it's valid theory.
   - End with a short wrap-up instruction

5. Commentary style — TEACH LIKE A FRIEND WHO'S GOOD AT CHESS:
   - Casual, specific, accurate. Reference actual squares and pieces.
   - Use master game counts naturally: "This is the most popular move — over 100k master games" or "About 30k games go this way"
   - Explain the IDEA behind each move, not just "this is theory"
   - Keep prompts/feedback to 1-2 sentences. No filler.
   - wrongFeedback should point toward the right idea, not just "Try again"
   - NO generic praise: always say WHY the move is good

6. JSON validity: escape quotes, no trailing commas, no comments.

Output ONLY the lesson JSONs, nothing else.`
}

// ═══════════════════════════════════════════
// LLM CALL
// ═══════════════════════════════════════════

function callLlm(prompt: string, label: string): string {
  console.log(`  Calling Claude for ${label}...`)

  const tmpPath = join(BUILDS_DIR, '.tmp-prompt.txt')
  writeFileSync(tmpPath, prompt)

  try {
    const result = execSync(
      `cat ${JSON.stringify(tmpPath)} | claude -p --output-format text 2>/dev/null`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024, timeout: 300000 }
    )
    return result
  } catch (e) {
    throw new Error(`LLM call failed for ${label}: ${e}`)
  }
}

function parseLlmOutput(output: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = []
  const chunks = output.split('---LESSON_SEPARATOR---')

  for (const chunk of chunks) {
    const trimmed = chunk.trim()
    if (!trimmed) continue
    const jsonStart = trimmed.indexOf('{')
    const jsonEnd = trimmed.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) continue

    try {
      results.push(JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)))
    } catch (e) {
      console.warn(`  Failed to parse JSON: ${e}`)
    }
  }

  // Fallback: try as array
  if (results.length === 0) {
    const arrayMatch = output.match(/\[[\s\S]*\]/)
    if (arrayMatch) {
      try {
        const arr = JSON.parse(arrayMatch[0])
        if (Array.isArray(arr)) return arr
      } catch { /* skip */ }
    }
  }

  return results
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

function main() {
  const { slug, level, singleNode, batchSize } = parseArgs()
  const buildDir = join(BUILDS_DIR, `${slug}-L${level}`)

  console.log(`\nWRITE-LESSONS v2: ${slug} Level ${level}`)

  // Load plan.json
  const planPath = join(buildDir, 'plan.json')
  if (!existsSync(planPath)) {
    console.error(`No plan.json found. Run prep-from-masters.ts first.`)
    process.exit(1)
  }
  const plan: LessonPlan[] = JSON.parse(readFileSync(planPath, 'utf-8'))

  // Load masters.json for metadata
  const mastersPath = join(buildDir, 'masters.json')
  if (!existsSync(mastersPath)) {
    console.error(`No masters.json found.`)
    process.exit(1)
  }
  const masters: MastersTree = JSON.parse(readFileSync(mastersPath, 'utf-8'))

  // Filter to non-test lessons
  let lessonsToWrite = plan.filter(p => p.type !== 'test')
  if (singleNode) {
    lessonsToWrite = lessonsToWrite.filter(p => p.nodeId === singleNode)
    if (lessonsToWrite.length === 0) {
      console.error(`Node not found: ${singleNode}`)
      process.exit(1)
    }
  }

  console.log(`  ${lessonsToWrite.length} lessons to write`)

  // Compute FENs for all lessons
  const fenMap = computeAllFens(masters.identityMoves, plan)

  // Verify FENs computed
  for (const lesson of lessonsToWrite) {
    const fens = fenMap.get(lesson.nodeId)
    if (!fens || fens.length === 0) {
      console.warn(`  Warning: no FENs computed for ${lesson.nodeId}`)
    } else {
      console.log(`  ${lesson.nodeId}: ${fens.length} moves with FENs`)
    }
  }

  // Ensure output dir
  const lessonsDir = join(buildDir, 'lessons')
  mkdirSync(lessonsDir, { recursive: true })

  // Batch and process
  const batches: LessonPlan[][] = []
  for (let i = 0; i < lessonsToWrite.length; i += batchSize) {
    batches.push(lessonsToWrite.slice(i, i + batchSize))
  }

  console.log(`  ${batches.length} batch(es)\n`)

  let totalWritten = 0

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b]
    const label = batch.map(l => l.nodeId).join(', ')

    const prompt = buildPrompt(batch, fenMap, masters)
    let output: string

    try {
      output = callLlm(prompt, label)
    } catch (e) {
      console.error(`  Failed: ${e}`)
      continue
    }

    const lessons = parseLlmOutput(output)
    console.log(`  Parsed ${lessons.length} lessons`)

    for (const lesson of lessons) {
      const id = (lesson as { id?: string }).id
      if (!id) continue

      const outPath = join(lessonsDir, `${id}.json`)
      writeFileSync(outPath, JSON.stringify(lesson, null, 2) + '\n')
      const steps = (lesson as { steps?: unknown[] }).steps ?? []
      console.log(`  ${id}: ${steps.length} steps -> ${outPath}`)
      totalWritten++
    }
  }

  console.log(`\nDone. ${totalWritten} lessons written to ${lessonsDir}`)
}

main()
