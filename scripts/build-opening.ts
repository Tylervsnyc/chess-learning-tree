#!/usr/bin/env npx tsx
/**
 * Opening Lesson Build Pipeline — CLI Orchestrator
 *
 * Usage:
 *   npm run build-opening -- --slug pirc-defense --level 2 --moves "1.e4 d6 2.d4 Nf6 ..."
 *   npm run build-opening -- --slug pirc-defense --level 2 --stage prep
 *   npm run build-opening -- --slug pirc-defense --level 2 --stage lessons --node pi-punish-Nd5
 *   npm run build-opening -- --slug pirc-defense --level 2 --from assemble
 *
 * Pipeline stages:
 *   1. prep        — FENs + Lichess evals → prep.json
 *   2. tree        — Generate tree file (small LLM call)
 *   3. lessons     — Write lesson content (LLM, batched)
 *   4. assemble    — Combine lessons → TypeScript file
 *   5. validate    — Structural checks
 *   6. wire        — Update imports/registry
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SCRIPTS_DIR = join(__dirname, 'openings')

const STAGES = ['prep', 'tree', 'lessons', 'assemble', 'validate', 'wire'] as const
type Stage = typeof STAGES[number]

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
  const stage = get('--stage') as Stage | undefined
  const from = get('--from') as Stage | undefined
  const node = get('--node')
  const name = get('--name')
  const color = get('--color')
  const colorDark = get('--color-dark')
  const movesPerLesson = get('--moves-per-lesson')
  const batchSize = get('--batch-size')
  const skipEval = args.includes('--skip-eval')
  const skipLlm = args.includes('--skip-llm')
  const dry = args.includes('--dry')
  const side = get('--side')
  const identityMoves = get('--identity-moves')

  if (!slug || !level) {
    console.error(`
Opening Lesson Build Pipeline

Usage:
  npm run build-opening -- --slug <slug> --level <n> --moves "1.e4 d6 ..."

Options:
  --slug <slug>             Opening slug (e.g., pirc-defense)
  --level <n>               Level number
  --moves "..."             Main line moves (required for prep stage)
  --stage <stage>           Run only one stage: ${STAGES.join(', ')}
  --from <stage>            Resume from a stage
  --node <nodeId>           Re-run a single lesson node (with --stage lessons)
  --name "Opening Name"     Opening display name
  --color "#hex"            Tree color
  --color-dark "#hex"       Dark tree color
  --moves-per-lesson <n>    Moves per lesson (default: 3)
  --batch-size <n>          Lessons per LLM batch (default: 5)
  --skip-eval               Skip Lichess eval lookups in prep
  --skip-llm                Skip LLM call in tree generation
  --dry                     Dry run for wire stage
`)
    process.exit(1)
  }

  // Validate stage names
  if (stage && !STAGES.includes(stage)) {
    console.error(`❌ Unknown stage: ${stage}. Valid: ${STAGES.join(', ')}`)
    process.exit(1)
  }
  if (from && !STAGES.includes(from)) {
    console.error(`❌ Unknown stage: ${from}. Valid: ${STAGES.join(', ')}`)
    process.exit(1)
  }

  return { slug, level, moves, stage, from, node, name, color, colorDark, movesPerLesson, batchSize, skipEval, skipLlm, dry, side, identityMoves }
}

// ═══════════════════════════════════════════
// STAGE RUNNERS
// ═══════════════════════════════════════════

function runStage(stage: Stage, args: ReturnType<typeof parseArgs>): boolean {
  const { slug, level, moves, node, name, color, colorDark, movesPerLesson, batchSize, skipEval, skipLlm, dry, side, identityMoves } = args

  const baseArgs = `--slug ${slug} --level ${level}`
  let cmd: string

  switch (stage) {
    case 'prep': {
      if (!moves) {
        console.error('❌ --moves required for prep stage')
        return false
      }
      const extras = [
        movesPerLesson ? `--moves-per-lesson ${movesPerLesson}` : '',
        skipEval ? '--skip-eval' : '',
        side ? `--side ${side}` : '',
        identityMoves ? `--identity-moves ${identityMoves}` : '',
      ].filter(Boolean).join(' ')
      cmd = `npx tsx ${join(SCRIPTS_DIR, 'prep.ts')} ${baseArgs} --moves ${JSON.stringify(moves)} ${extras}`
      break
    }
    case 'tree': {
      const extras = [
        name ? `--name ${JSON.stringify(name)}` : '',
        color ? `--color "${color}"` : '',
        colorDark ? `--color-dark "${colorDark}"` : '',
        skipLlm ? '--skip-llm' : '',
      ].filter(Boolean).join(' ')
      cmd = `npx tsx ${join(SCRIPTS_DIR, 'write-tree.ts')} ${baseArgs} ${extras}`
      break
    }
    case 'lessons': {
      const extras = [
        node ? `--node ${node}` : '',
        batchSize ? `--batch-size ${batchSize}` : '',
      ].filter(Boolean).join(' ')
      cmd = `npx tsx ${join(SCRIPTS_DIR, 'write-lessons.ts')} ${baseArgs} ${extras}`
      break
    }
    case 'assemble':
      cmd = `npx tsx ${join(SCRIPTS_DIR, 'assemble.ts')} ${baseArgs}`
      break
    case 'validate':
      cmd = `npx tsx ${join(SCRIPTS_DIR, 'validate.ts')} ${baseArgs}`
      break
    case 'wire': {
      cmd = `npx tsx ${join(SCRIPTS_DIR, 'wire.ts')} ${baseArgs}${dry ? ' --dry' : ''}`
      break
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  STAGE: ${stage.toUpperCase()}`)
  console.log(`${'═'.repeat(60)}`)

  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit', timeout: 600000 })
    return true
  } catch {
    console.error(`\n❌ Stage ${stage} failed`)
    return false
  }
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

function main() {
  const args = parseArgs()

  console.log(`\n🏗️  Opening Build Pipeline: ${args.slug} Level ${args.level}`)

  // Determine which stages to run
  let stagesToRun: Stage[]

  if (args.stage) {
    stagesToRun = [args.stage]
  } else if (args.from) {
    const startIdx = STAGES.indexOf(args.from)
    stagesToRun = STAGES.slice(startIdx) as Stage[]
  } else {
    stagesToRun = [...STAGES]
  }

  console.log(`   Stages: ${stagesToRun.join(' → ')}`)

  // Check prerequisites
  if (stagesToRun[0] === 'prep' && !args.moves) {
    console.error('❌ --moves required when starting from prep stage')
    process.exit(1)
  }

  // Run stages
  for (const stage of stagesToRun) {
    const success = runStage(stage, args)
    if (!success) {
      console.error(`\n💥 Pipeline stopped at stage: ${stage}`)
      console.error(`   Fix the issue and resume with: --from ${stage}`)
      process.exit(1)
    }

    // Pause point after prep — let human review
    if (stage === 'prep' && stagesToRun.length > 1) {
      console.log(`\n⏸  Review prep.json before continuing.`)
      console.log(`   Resume with: --from tree`)
      if (!args.stage) {
        // If running full pipeline, continue automatically
        console.log(`   (Continuing automatically since full pipeline was requested)`)
      }
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  ✅ PIPELINE COMPLETE: ${args.slug} Level ${args.level}`)
  console.log(`${'═'.repeat(60)}`)
}

main()
