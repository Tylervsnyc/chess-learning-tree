#!/usr/bin/env npx tsx
/**
 * Stage 4: ASSEMBLE — Combine lesson JSONs into a single TypeScript file
 *
 * Input:  --slug <slug> --level <n>
 *         Reads: data/opening-builds/{slug}-L{level}/prep.json
 *                data/opening-builds/{slug}-L{level}/lessons/*.json
 *                data/openings/{slug}.ts (tree file for completionOrder)
 *
 * Output: data/opening-builds/{slug}-L{level}/assembled-lessons.ts
 * Zero LLM. Pure template + data merge.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { PrepData, LessonJson, LessonStepJson } from './types'

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

  if (!slug || !level) {
    console.error('Usage: assemble.ts --slug <slug> --level <n>')
    process.exit(1)
  }

  return { slug, level: parseInt(level, 10) }
}

// ═══════════════════════════════════════════
// NAME GENERATION
// ═══════════════════════════════════════════

function slugToPascalCase(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function slugToConstPrefix(slug: string): string {
  return slug.toUpperCase().replace(/-/g, '_')
}

function nodeIdToConstName(nodeId: string): string {
  return nodeId.toUpperCase().replace(/-/g, '_')
}

// ═══════════════════════════════════════════
// FEN DICT BUILDER
// ═══════════════════════════════════════════

function buildFenDict(lessons: LessonJson[], prepData: PrepData): Map<string, string> {
  const fenMap = new Map<string, string>()
  const usedNames = new Set<string>()

  // First, name FENs from prep positions (main line gets clean names)
  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  fenMap.set(startFen, 'start')
  usedNames.add('start')

  for (const pos of prepData.positions) {
    if (fenMap.has(pos.fen)) continue
    const name = `after_${pos.moveSan.replace(/[+#!?=]/g, '').replace(/O-O-O/g, 'OOO').replace(/O-O/g, 'OO')}_m${pos.moveNumber}`
    const uniqueName = usedNames.has(name) ? `${name}_${pos.mover[0]}` : name
    fenMap.set(pos.fen, uniqueName)
    usedNames.add(uniqueName)
  }

  // Then name FENs from lessons that aren't in prep (deviation branches, etc.)
  let extraIdx = 0
  for (const lesson of lessons) {
    const prefix = lesson.id.replace(/-/g, '_')
    for (const step of lesson.steps) {
      if (step.fen && !fenMap.has(step.fen)) {
        extraIdx++
        const name = `${prefix}_pos${extraIdx}`
        fenMap.set(step.fen, name)
        usedNames.add(name)
      }
    }
  }

  return fenMap
}

// ═══════════════════════════════════════════
// CODE GENERATOR
// ═══════════════════════════════════════════

function generateStepCode(step: LessonStepJson, fenDict: Map<string, string>, indent: string): string {
  const fenRef = fenDict.get(step.fen) ? `FEN.${fenDict.get(step.fen)}` : `'${step.fen}'`

  if (step.type === 'instruction') {
    const parts = [
      `${indent}{`,
      `${indent}  type: 'instruction',`,
      `${indent}  fen: ${fenRef},`,
      `${indent}  text: ${JSON.stringify(step.text)},`,
    ]
    if (step.autoAdvance) parts.push(`${indent}  autoAdvance: ${step.autoAdvance},`)
    if (step.highlightSquares?.length) {
      parts.push(`${indent}  highlightSquares: [${step.highlightSquares.map(s => `'${s}'`).join(', ')}],`)
    }
    if (step.arrow) {
      parts.push(`${indent}  arrow: ['${step.arrow[0]}', '${step.arrow[1]}'],`)
    }
    parts.push(`${indent}},`)
    return parts.join('\n')
  }

  if (step.type === 'play-move') {
    const parts = [
      `${indent}{`,
      `${indent}  type: 'play-move',`,
      `${indent}  fen: ${fenRef},`,
      `${indent}  correctMove: '${step.correctMove}',`,
      `${indent}  prompt: ${JSON.stringify(step.prompt)},`,
      `${indent}  hint: ${JSON.stringify(step.hint)},`,
      `${indent}  correctFeedback: ${JSON.stringify(step.correctFeedback)},`,
      `${indent}  wrongFeedback: ${JSON.stringify(step.wrongFeedback)},`,
    ]
    if (step.highlightSquares?.length) {
      parts.push(`${indent}  highlightSquares: [${step.highlightSquares.map(s => `'${s}'`).join(', ')}],`)
    }
    if (step.acceptMoves?.length) {
      parts.push(`${indent}  acceptMoves: [${step.acceptMoves.map(m => `'${m}'`).join(', ')}],`)
    }
    parts.push(`${indent}},`)
    return parts.join('\n')
  }

  if (step.type === 'quiz') {
    return [
      `${indent}{`,
      `${indent}  type: 'quiz',`,
      `${indent}  fen: ${fenRef},`,
      `${indent}  question: ${JSON.stringify(step.question)},`,
      `${indent}  options: [${step.options.map(o => JSON.stringify(o)).join(', ')}],`,
      `${indent}  correctIndex: ${step.correctIndex},`,
      `${indent}  explanation: ${JSON.stringify(step.explanation)},`,
      `${indent}},`,
    ].join('\n')
  }

  // Fallback
  return `${indent}${JSON.stringify(step)},`
}

function generateTypeScript(
  lessons: LessonJson[],
  fenDict: Map<string, string>,
  slug: string,
  prepData: PrepData,
): string {
  const pascalName = slugToPascalCase(slug)
  const lines: string[] = []

  // Header
  lines.push(`import type { OpeningLesson } from '@/types/opening-lesson'`)
  lines.push('')
  lines.push(`// ═══════════════════════════════════════════════════════════`)
  lines.push(`// ${slug.toUpperCase().replace(/-/g, ' ')} LESSONS`)
  lines.push(`//`)
  lines.push(`// ${prepData.meta.side.toUpperCase()} OPENING: User plays as ${prepData.meta.side === 'white' ? 'White' : 'Black'}.`)
  lines.push(`// FENs pre-computed and validated with chess.js.`)
  lines.push(`// Main line: ${prepData.meta.mainLine}`)
  lines.push(`// ═══════════════════════════════════════════════════════════`)
  lines.push('')

  // FEN dictionary
  lines.push('const FEN = {')
  for (const [fen, name] of fenDict) {
    lines.push(`  ${name}: ${' '.repeat(Math.max(0, 16 - name.length))}'${fen}',`)
  }
  lines.push('}')
  lines.push('')

  // Each lesson
  for (const lesson of lessons) {
    const constName = nodeIdToConstName(lesson.id)
    lines.push(`// ═══════════════════════════════════════════════════════════`)
    lines.push(`// ${lesson.title.toUpperCase()}`)
    lines.push(`// ═══════════════════════════════════════════════════════════`)
    lines.push('')
    lines.push(`export const ${constName}: OpeningLesson = {`)
    lines.push(`  id: '${lesson.id}',`)
    lines.push(`  title: ${JSON.stringify(lesson.title)},`)
    lines.push(`  defaultOrientation: '${lesson.defaultOrientation}',`)
    lines.push(`  steps: [`)

    for (const step of lesson.steps) {
      lines.push(generateStepCode(step, fenDict, '    '))
    }

    lines.push(`  ],`)
    lines.push(`}`)
    lines.push('')
  }

  // Lookup function
  lines.push(`// ═══════════════════════════════════════════════════════════`)
  lines.push(`// LOOKUP`)
  lines.push(`// ═══════════════════════════════════════════════════════════`)
  lines.push('')
  lines.push(`const LESSONS: Record<string, OpeningLesson> = {`)
  for (const lesson of lessons) {
    const constName = nodeIdToConstName(lesson.id)
    lines.push(`  '${lesson.id}': ${constName},`)
  }
  lines.push(`}`)
  lines.push('')
  lines.push(`export function get${pascalName}Lesson(id: string): OpeningLesson | null {`)
  lines.push(`  return LESSONS[id] ?? null`)
  lines.push(`}`)
  lines.push('')

  return lines.join('\n')
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  const { slug, level } = parseArgs()
  const buildDir = join(BUILDS_DIR, `${slug}-L${level}`)

  console.log(`\n🔨 ASSEMBLE: ${slug} Level ${level}`)

  // Load prep.json
  const prepPath = join(buildDir, 'prep.json')
  if (!existsSync(prepPath)) {
    console.error(`❌ prep.json not found: ${prepPath}`)
    process.exit(1)
  }
  const prepData: PrepData = JSON.parse(readFileSync(prepPath, 'utf-8'))

  // Load lesson JSONs
  const lessonsDir = join(buildDir, 'lessons')
  if (!existsSync(lessonsDir)) {
    console.error(`❌ Lessons directory not found: ${lessonsDir}`)
    process.exit(1)
  }

  const lessonFiles = readdirSync(lessonsDir).filter(f => f.endsWith('.json')).sort()
  if (lessonFiles.length === 0) {
    console.error('❌ No lesson JSON files found')
    process.exit(1)
  }

  console.log(`   Found ${lessonFiles.length} lesson files`)

  const lessons: LessonJson[] = []
  for (const file of lessonFiles) {
    const path = join(lessonsDir, file)
    try {
      const lesson: LessonJson = JSON.parse(readFileSync(path, 'utf-8'))
      lessons.push(lesson)
      console.log(`   ✓ ${file} (${lesson.steps.length} steps)`)
    } catch (e) {
      console.error(`   ❌ Failed to parse ${file}: ${e}`)
      process.exit(1)
    }
  }

  // Sort by completionOrder from prep.json lessonPlan
  const orderMap = new Map(prepData.lessonPlan.map((lp, i) => [lp.nodeId, i]))
  lessons.sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999))

  // Build FEN dictionary
  const fenDict = buildFenDict(lessons, prepData)
  console.log(`   FEN dictionary: ${fenDict.size} unique positions`)

  // Generate TypeScript
  const tsCode = generateTypeScript(lessons, fenDict, slug, prepData)

  // Write output
  const outPath = join(buildDir, `${slug}-lessons.ts`)
  writeFileSync(outPath, tsCode)
  console.log(`\n✅ Assembled to ${outPath}`)
  console.log(`   ${lessons.length} lessons, ${fenDict.size} FENs`)
  console.log(`\nNext: run validate.ts, then wire.ts`)
}

main().catch(e => {
  console.error('💥 Assemble failed:', e)
  process.exit(1)
})
