#!/usr/bin/env npx tsx
/**
 * Stage 3: WRITE-LESSONS — LLM agents write lesson content, batched
 *
 * Input:  --slug <slug> --level <n> [--node <nodeId>] [--batch-size 5]
 * Output: data/opening-builds/{slug}-L{level}/lessons/{nodeId}.json per lesson
 *
 * Strategy: Split lessons into 2 batches, run sequentially (could be parallelized later).
 * Each batch gets a focused prompt with only its assigned lessons' data.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { PrepData, LessonPlanItem } from './types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const BUILDS_DIR = join(ROOT, 'data/opening-builds')

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
  const singleNode = get('--node') // Re-run just one lesson
  const batchSize = parseInt(get('--batch-size') ?? '5', 10)

  if (!slug || !level) {
    console.error('Usage: write-lessons.ts --slug <slug> --level <n> [--node <nodeId>] [--batch-size 5]')
    process.exit(1)
  }

  return { slug, level: parseInt(level, 10), singleNode, batchSize }
}

// ═══════════════════════════════════════════
// PROMPT BUILDER
// ═══════════════════════════════════════════

function buildLessonPrompt(
  lessons: LessonPlanItem[],
  prepData: PrepData,
  treePath: string,
): string {
  const side = prepData.meta.side
  const sideUpper = side === 'white' ? 'White' : 'Black'
  const oppSide = side === 'white' ? 'Black' : 'White'

  // Read template: first 200 lines of london-lessons.ts
  const templatePath = join(ROOT, 'data/openings/london-lessons.ts')
  let template = ''
  if (existsSync(templatePath)) {
    template = readFileSync(templatePath, 'utf-8').split('\n').slice(0, 200).join('\n')
  }

  // Read types
  const typesPath = join(ROOT, 'types/opening-lesson.ts')
  const types = existsSync(typesPath) ? readFileSync(typesPath, 'utf-8') : ''

  // Read tree file for context
  let treeContent = ''
  if (existsSync(treePath)) {
    treeContent = readFileSync(treePath, 'utf-8')
  }

  // Build per-lesson context
  const lessonContexts = lessons.map(lp => {
    const positions = lp.positions.map(p => {
      const evalStr = p.eval ? `eval: ${p.eval.cp! >= 0 ? '+' : ''}${(p.eval.cp! / 100).toFixed(1)}` : 'eval: unknown'
      return `  FEN: ${p.fen}\n  Move: ${p.moveNumber}.${p.mover === 'black' ? '..' : ''}${p.moveSan} (${p.mover}) ${evalStr}`
    }).join('\n')

    return `
--- ${lp.nodeId} [${lp.type}] ---
Moves to teach: ${lp.newMoves.join(', ') || '(none — test node)'}
${lp.deviationMove ? `Opponent plays: ${lp.deviationMove}\nOur best response: ${(lp.ourResponse ?? []).join(' ')}` : ''}
Positions:
${positions}
`
  }).join('\n')

  return `You are writing interactive chess lessons for a mobile learning app (like Duolingo for chess).

OPENING: ${prepData.meta.slug}
SIDE: ${sideUpper} (user plays as ${sideUpper})
MAIN LINE: ${prepData.meta.mainLine}

=== TYPES (follow exactly) ===
${types}

=== TEMPLATE (follow this pattern exactly) ===
${template}

=== TREE FILE (for context — node relationships) ===
${treeContent}

=== YOUR ASSIGNED LESSONS ===
${lessonContexts}

=== RULES ===

1. Output ONLY valid JSON. One JSON object per lesson. Separate multiple lessons with a line containing only "---LESSON_SEPARATOR---".

2. Each lesson JSON shape:
{
  "id": "node-id",
  "title": "Lesson Title",
  "defaultOrientation": "${side}",
  "steps": [...]
}

3. Step rules:
   - MINIMUM 6 steps total per lesson, MINIMUM 3 play-move steps
   - ${sideUpper} moves = "play-move" steps (user plays these)
   - ${oppSide} moves = "instruction" steps with autoAdvance: 800
   - Each play-move MUST have: prompt, hint, correctFeedback, wrongFeedback
   - Teach steps: highlightSquares = [from, to] squares
   - IMPORTANT: FENs are PROVIDED in the positions above. Use them EXACTLY. Do NOT compute FENs yourself.
   - correctMove must be in SAN format (e.g., "e4", "Nf3", "Bb5", "O-O")

4. Lesson structure:
   - Start with an instruction explaining what this lesson covers
   - For each move: brief instruction → play-move → opponent auto-advance
   - For deviation lessons: "Here's what to do if they play X instead" — explain why it's a common alternative, then teach our best response from the masters database. NOT "punish this bad move."
   - End with a congratulatory instruction

5. Writing style — TEACH LIKE A FRIEND AT A COFFEE SHOP:
   - Talk like you're explaining chess to a friend over coffee — casual, fun, accurate
   - Be specific about squares and pieces: "the bishop eyes h7" not "attacking the kingside"
   - Use eval scores HONESTLY: +0.3 = "slightly better", +1.0 = "clearly ahead", +2.0+ = "winning". Don't say "crushing" for +0.3.
   - Keep feedback to 1-2 punchy sentences. No filler.
   - wrongFeedback should redirect to the correct idea with a reason, not just "Try again"
   - NO generic phrases: "Great move!", "Well done!", "Excellent!" — always reference WHAT makes it good

6. JSON validity:
   - Escape quotes in strings
   - No trailing commas
   - No comments

Output ONLY the lesson JSONs, nothing else.`
}

// ═══════════════════════════════════════════
// LLM CALL
// ═══════════════════════════════════════════

function callLlm(prompt: string, batchLabel: string): string {
  console.log(`   📝 Calling LLM for batch: ${batchLabel}...`)

  // Write prompt to temp file to avoid arg length limits
  const tmpPromptPath = join(BUILDS_DIR, '.tmp-prompt.txt')
  writeFileSync(tmpPromptPath, prompt)

  try {
    const result = execSync(
      `cat ${JSON.stringify(tmpPromptPath)} | claude -p --output-format text 2>/dev/null`,
      {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB
        timeout: 300000, // 5 minutes
      }
    )
    return result
  } catch (e) {
    throw new Error(`LLM call failed for ${batchLabel}: ${e}`)
  }
}

function parseLlmOutput(output: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = []

  // Split by separator
  const chunks = output.split('---LESSON_SEPARATOR---')

  for (const chunk of chunks) {
    const trimmed = chunk.trim()
    if (!trimmed) continue

    // Find JSON in the chunk
    const jsonStart = trimmed.indexOf('{')
    const jsonEnd = trimmed.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) continue

    try {
      const json = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1))
      results.push(json)
    } catch (e) {
      console.warn(`   ⚠ Failed to parse lesson JSON: ${e}`)
      // Try to extract JSON blocks individually
      const matches = trimmed.match(/\{[\s\S]*?\n\}/g)
      if (matches) {
        for (const match of matches) {
          try {
            results.push(JSON.parse(match))
          } catch {
            // Skip malformed
          }
        }
      }
    }
  }

  // If separator didn't work, try parsing as a single JSON array or sequential objects
  if (results.length === 0) {
    // Try as array
    const arrayMatch = output.match(/\[[\s\S]*\]/)
    if (arrayMatch) {
      try {
        const arr = JSON.parse(arrayMatch[0])
        if (Array.isArray(arr)) return arr
      } catch {
        // Not a valid array
      }
    }

    // Try finding individual JSON objects by looking for {"id": patterns
    const objectPattern = /\{"id"\s*:\s*"[^"]+[\s\S]*?\n\s*\}/g
    const objects = output.match(objectPattern)
    if (objects) {
      for (const obj of objects) {
        try {
          results.push(JSON.parse(obj))
        } catch {
          // Skip
        }
      }
    }
  }

  return results
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  const { slug, level, singleNode, batchSize } = parseArgs()
  const buildDir = join(BUILDS_DIR, `${slug}-L${level}`)

  console.log(`\n📝 WRITE-LESSONS: ${slug} Level ${level}`)

  // Load prep.json
  const prepPath = join(buildDir, 'prep.json')
  if (!existsSync(prepPath)) {
    console.error(`❌ prep.json not found. Run prep.ts first.`)
    process.exit(1)
  }
  const prepData: PrepData = JSON.parse(readFileSync(prepPath, 'utf-8'))

  // Find tree file
  const treePath = join(buildDir, `${slug}.ts`)

  // Filter lessons to build
  let lessonsToWrite = prepData.lessonPlan.filter(lp => lp.type !== 'test')

  if (singleNode) {
    lessonsToWrite = lessonsToWrite.filter(lp => lp.nodeId === singleNode)
    if (lessonsToWrite.length === 0) {
      console.error(`❌ Node not found in lesson plan: ${singleNode}`)
      process.exit(1)
    }
    console.log(`   Re-running single node: ${singleNode}`)
  }

  console.log(`   ${lessonsToWrite.length} lessons to write`)

  // Ensure output dir
  const lessonsDir = join(buildDir, 'lessons')
  mkdirSync(lessonsDir, { recursive: true })

  // Batch and process
  const batches: LessonPlanItem[][] = []
  for (let i = 0; i < lessonsToWrite.length; i += batchSize) {
    batches.push(lessonsToWrite.slice(i, i + batchSize))
  }

  console.log(`   Split into ${batches.length} batch(es) of ~${batchSize}`)

  let totalWritten = 0
  let totalFailed = 0

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b]
    const batchLabel = `Batch ${b + 1}/${batches.length} (${batch.map(l => l.nodeId).join(', ')})`

    const prompt = buildLessonPrompt(batch, prepData, treePath)
    let output: string

    try {
      output = callLlm(prompt, batchLabel)
    } catch (e) {
      console.error(`   ❌ ${batchLabel} failed: ${e}`)
      totalFailed += batch.length
      continue
    }

    // Parse output
    const lessons = parseLlmOutput(output)
    console.log(`   📋 Parsed ${lessons.length} lessons from ${batchLabel}`)

    // Write individual lesson files
    for (const lesson of lessons) {
      const id = (lesson as { id?: string }).id
      if (!id) {
        console.warn('   ⚠ Lesson missing id, skipping')
        totalFailed++
        continue
      }

      const outPath = join(lessonsDir, `${id}.json`)
      writeFileSync(outPath, JSON.stringify(lesson, null, 2) + '\n')
      const steps = (lesson as { steps?: unknown[] }).steps ?? []
      const playMoves = steps.filter((s: unknown) => (s as { type: string }).type === 'play-move').length
      console.log(`   ✓ ${id} → ${outPath} (${steps.length} steps, ${playMoves} play-moves)`)
      totalWritten++
    }

    // Check for missing lessons
    for (const lp of batch) {
      if (!lessons.some(l => (l as { id?: string }).id === lp.nodeId)) {
        console.warn(`   ⚠ Missing output for ${lp.nodeId} — re-run with --node ${lp.nodeId}`)
        totalFailed++
      }
    }
  }

  console.log(`\n${totalWritten > 0 ? '✅' : '❌'} Written: ${totalWritten}, Failed: ${totalFailed}`)

  if (totalFailed > 0) {
    console.log(`\nTo re-run failed lessons individually:`)
    for (const lp of lessonsToWrite) {
      const path = join(lessonsDir, `${lp.nodeId}.json`)
      if (!existsSync(path)) {
        console.log(`  npx tsx scripts/openings/write-lessons.ts --slug ${slug} --level ${level} --node ${lp.nodeId}`)
      }
    }
  }

  console.log(`\nNext: run assemble.ts`)
}

main().catch(e => {
  console.error('💥 Write-lessons failed:', e)
  process.exit(1)
})
