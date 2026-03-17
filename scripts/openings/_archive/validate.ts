#!/usr/bin/env npx tsx
/**
 * Stage 5: VALIDATE — Structural checks on assembled lesson files
 *
 * Input:  --slug <slug> --level <n>
 *         Reads: data/opening-builds/{slug}-L{level}/prep.json
 *                data/openings/{slug}-lessons.ts (or assembled output)
 *
 * Output: Pass/fail report (stdout)
 * Zero LLM.
 */

import { Chess } from 'chess.js'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { pathToFileURL } from 'url'
import type { PrepData } from './types'

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
  const lessonsFile = get('--file') // Optional: validate a specific file

  if (!slug) {
    console.error('Usage: validate.ts --slug <slug> [--level <n>] [--file <path>]')
    process.exit(1)
  }

  return { slug, level: level ? parseInt(level, 10) : undefined, lessonsFile }
}

// ═══════════════════════════════════════════
// VALIDATION CHECKS
// ═══════════════════════════════════════════

interface ValidationResult {
  nodeId: string
  passed: boolean
  totalSteps: number
  playMoves: number
  errors: string[]
  warnings: string[]
}

interface LessonData {
  id: string
  title: string
  defaultOrientation: 'white' | 'black'
  steps: StepData[]
}

interface StepData {
  type: string
  fen?: string
  text?: string
  correctMove?: string
  prompt?: string
  hint?: string
  correctFeedback?: string
  wrongFeedback?: string
  highlightSquares?: string[]
  autoAdvance?: number
  question?: string
  options?: string[]
  correctIndex?: number
  explanation?: string
  acceptMoves?: string[]
}

function validateLesson(lesson: LessonData, prepData: PrepData | null): ValidationResult {
  const result: ValidationResult = {
    nodeId: lesson.id,
    passed: true,
    totalSteps: lesson.steps.length,
    playMoves: 0,
    errors: [],
    warnings: [],
  }

  // Check minimum steps
  if (lesson.steps.length < 6) {
    result.errors.push(`Only ${lesson.steps.length} steps — BELOW MINIMUM (6)`)
  }

  // Count play-move steps
  const playMoveSteps = lesson.steps.filter(s => s.type === 'play-move')
  result.playMoves = playMoveSteps.length

  if (playMoveSteps.length < 3) {
    result.errors.push(`Only ${playMoveSteps.length} play-move steps — BELOW MINIMUM (3)`)
  }

  // Validate each step
  for (let i = 0; i < lesson.steps.length; i++) {
    const step = lesson.steps[i]
    const stepLabel = `Step ${i + 1} (${step.type})`

    // Every step needs a FEN
    if (!step.fen) {
      result.errors.push(`${stepLabel}: missing FEN`)
      continue
    }

    // Validate FEN is parseable
    try {
      new Chess(step.fen)
    } catch {
      result.errors.push(`${stepLabel}: invalid FEN "${step.fen}"`)
    }

    // play-move specific checks
    if (step.type === 'play-move') {
      if (!step.prompt) result.errors.push(`${stepLabel}: missing prompt`)
      if (!step.hint) result.errors.push(`${stepLabel}: missing hint`)
      if (!step.correctFeedback) result.errors.push(`${stepLabel}: missing correctFeedback`)
      if (!step.wrongFeedback) result.errors.push(`${stepLabel}: missing wrongFeedback`)

      // Verify correctMove is legal
      if (step.correctMove && step.fen) {
        try {
          const game = new Chess(step.fen)
          const move = game.move(step.correctMove)
          if (!move) {
            result.errors.push(`${stepLabel}: "${step.correctMove}" is illegal at FEN`)
          }
        } catch {
          result.errors.push(`${stepLabel}: "${step.correctMove}" throws error`)
        }
      }

      // Check acceptMoves are also legal
      if (step.acceptMoves) {
        for (const am of step.acceptMoves) {
          try {
            const game = new Chess(step.fen!)
            const move = game.move(am)
            if (!move) {
              result.errors.push(`${stepLabel}: acceptMove "${am}" is illegal at FEN`)
            }
          } catch {
            result.errors.push(`${stepLabel}: acceptMove "${am}" throws error`)
          }
        }
      }
    }

    // instruction specific checks
    if (step.type === 'instruction') {
      if (!step.text) result.errors.push(`${stepLabel}: missing text`)
    }

    // quiz specific checks
    if (step.type === 'quiz') {
      if (!step.question) result.errors.push(`${stepLabel}: missing question`)
      if (!step.options || step.options.length < 2) result.errors.push(`${stepLabel}: needs ≥2 options`)
      if (step.correctIndex === undefined) result.errors.push(`${stepLabel}: missing correctIndex`)
      if (!step.explanation) result.errors.push(`${stepLabel}: missing explanation`)
    }

    // Check for placeholder text
    const textFields = [step.text, step.prompt, step.hint, step.correctFeedback, step.wrongFeedback, step.explanation]
    for (const field of textFields) {
      if (field && /\b(TODO|stub|placeholder|FIXME)\b/i.test(field)) {
        result.errors.push(`${stepLabel}: contains placeholder text "${field.slice(0, 50)}"`)
      }
    }
  }

  // Cross-check FENs against prep.json if available
  if (prepData) {
    const planItem = prepData.lessonPlan.find(lp => lp.nodeId === lesson.id)
    if (planItem) {
      // Verify play-move FENs match prep data positions
      for (const step of playMoveSteps) {
        if (step.fen) {
          const prepPos = prepData.positions.find(p => p.fen === step.fen)
          if (!prepPos) {
            // Not necessarily an error — could be a branch/deviation position
            const anyKnownFen = prepData.positions.some(p => p.fen === step.fen)
            if (!anyKnownFen) {
              result.warnings.push(`play-move FEN not in prep.json (could be deviation branch): ${step.fen.split(' ')[0]}...`)
            }
          }
        }
      }
    }
  }

  result.passed = result.errors.length === 0
  return result
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  const { slug, level, lessonsFile } = parseArgs()

  console.log(`\n🔍 VALIDATE: ${slug}${level ? ` Level ${level}` : ''}`)

  // Load prep.json if available
  let prepData: PrepData | null = null
  if (level) {
    const prepPath = join(BUILDS_DIR, `${slug}-L${level}`, 'prep.json')
    if (existsSync(prepPath)) {
      prepData = JSON.parse(readFileSync(prepPath, 'utf-8'))
      console.log(`   Loaded prep.json (${prepData!.positions.length} positions)`)
    }
  }

  // Find the lessons file — check build dir first, then data/openings/
  const buildPath = level ? join(BUILDS_DIR, `${slug}-L${level}`, `${slug}-lessons.ts`) : null
  const filePath = lessonsFile
    ?? (buildPath && existsSync(buildPath) ? buildPath : join(ROOT, `data/openings/${slug}-lessons.ts`))
  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }
  console.log(`   Validating: ${filePath}`)

  // Dynamic import the file
  let lessonsModule: Record<string, unknown>
  try {
    lessonsModule = await import(pathToFileURL(filePath).href)
  } catch (e) {
    console.error(`❌ Failed to import: ${e}`)
    process.exit(1)
  }

  // Find the getLessonFunction
  const getLessonFnName = Object.keys(lessonsModule).find(k => k.startsWith('get') && k.endsWith('Lesson'))
  if (!getLessonFnName) {
    console.error('❌ No get*Lesson function found in exports')
    process.exit(1)
  }

  const getLesson = lessonsModule[getLessonFnName] as (id: string) => LessonData | null

  // Find all lesson IDs — look for exported constants that look like lessons
  const lessonIds: string[] = []
  for (const [key, value] of Object.entries(lessonsModule)) {
    if (key === 'default' || key === getLessonFnName) continue
    const val = value as Record<string, unknown>
    if (val && typeof val === 'object' && 'id' in val && 'steps' in val) {
      lessonIds.push(val.id as string)
    }
  }

  // Also check via prep.json completionOrder if available
  if (prepData) {
    for (const lp of prepData.lessonPlan) {
      if (!lessonIds.includes(lp.nodeId) && lp.type !== 'test') {
        // Try fetching via getLesson
        const lesson = getLesson(lp.nodeId)
        if (lesson) {
          lessonIds.push(lp.nodeId)
        } else {
          console.error(`❌ Missing lesson for planned node: ${lp.nodeId}`)
        }
      }
    }
  }

  if (lessonIds.length === 0) {
    console.error('❌ No lessons found to validate')
    process.exit(1)
  }

  console.log(`   Found ${lessonIds.length} lessons to validate\n`)

  // Validate each lesson
  const results: ValidationResult[] = []
  let allPassed = true

  for (const id of lessonIds) {
    const lesson = getLesson(id)
    if (!lesson) {
      results.push({
        nodeId: id,
        passed: false,
        totalSteps: 0,
        playMoves: 0,
        errors: ['Lesson not found via getLesson()'],
        warnings: [],
      })
      allPassed = false
      continue
    }

    const result = validateLesson(lesson, prepData)
    results.push(result)
    if (!result.passed) allPassed = false
  }

  // Print results table
  console.log('─'.repeat(70))
  for (const r of results) {
    const icon = r.passed ? '✓' : '✗'
    const stats = `(${r.totalSteps} steps, ${r.playMoves} play-moves)`
    const errSuffix = r.errors.length > 0 ? ` — ${r.errors.length} ERROR(S)` : ''
    const warnSuffix = r.warnings.length > 0 ? ` — ${r.warnings.length} warning(s)` : ''
    console.log(`${icon} ${r.nodeId} ${stats}${errSuffix}${warnSuffix}`)

    for (const err of r.errors) {
      console.log(`    ❌ ${err}`)
    }
    for (const warn of r.warnings) {
      console.log(`    ⚠  ${warn}`)
    }
  }
  console.log('─'.repeat(70))

  if (allPassed) {
    console.log(`\n✅ All ${results.length} lessons passed validation`)
  } else {
    const failCount = results.filter(r => !r.passed).length
    console.log(`\n❌ ${failCount}/${results.length} lessons FAILED validation`)
    process.exit(1)
  }
}

main().catch(e => {
  console.error('💥 Validate failed:', e)
  process.exit(1)
})
