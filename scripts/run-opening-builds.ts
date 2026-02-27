#!/usr/bin/env npx tsx
/**
 * Opening Build Runner
 * Reads the build queue, picks the next pending item, and invokes `claude -p`
 * to build the opening lessons automatically.
 *
 * Usage:
 *   npm run build-openings          # Process 1 item (default)
 *   npm run build-openings -- -n 3  # Process up to 3 items
 *   npm run build-openings -- --dry # Dry run — show what would build
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { OpeningBuildItem, BuildQueueData } from '../types/build-queue'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const QUEUE_PATH = join(ROOT, 'data/build-queue.json')
const LOGS_DIR = join(ROOT, 'logs/builds')

// --- CLI Args ---
const args = process.argv.slice(2)
const maxItems = (() => {
  const idx = args.indexOf('-n')
  return idx !== -1 ? parseInt(args[idx + 1], 10) || 1 : 1
})()
const dryRun = args.includes('--dry')

// --- Queue I/O ---
function readQueue(): BuildQueueData {
  return JSON.parse(readFileSync(QUEUE_PATH, 'utf-8'))
}

function writeQueue(data: BuildQueueData) {
  writeFileSync(QUEUE_PATH, JSON.stringify(data, null, 2) + '\n')
}

// --- ID Prefix ---
const SLUG_TO_PREFIX: Record<string, string> = {
  'italian': 'it',
  'pirc-defense': 'pi',
  'ruy-lopez': 'rl',
  'sicilian': 'si',
  'french': 'fr',
  'london': 'ln',
  'scotch': 'sc',
  'caro-kann': 'ck',
  'kings-gambit': 'kg',
  'kings-indian': 'ki',
}

function getIdPrefix(slug: string): string {
  return SLUG_TO_PREFIX[slug] || slug.slice(0, 2)
}

// --- Prompt Construction ---
function buildPrompt(item: OpeningBuildItem): string {
  const prefix = getIdPrefix(item.slug)

  if (item.type === 'level') {
    return [
      `Extend the ${item.name.replace(/ Level \d/, '')} tree from node "${item.extendsFrom}".`,
      `This is Level ${item.level}. Add ~10 new nodes: continue main line deeper + 2-3 branches + punish nodes.`,
      `End with a test node (id: ${prefix}-test-${item.level}).`,
      `Side: ${item.side.toUpperCase()}. Main line: ${item.mainLine}.`,
      `Follow existing tree patterns in data/openings/${item.slug.replace('-defense', '')}.ts.`,
      `Create lessons file, update tree, wire lookups, run npm run check.`,
    ].join(' ')
  }

  // Variation build
  return [
    `Build ${item.variationName} for ${item.name.includes('Sicilian') ? 'Sicilian Defense' : item.slug.replace(/-/g, ' ')}.`,
    `${item.side.toUpperCase()}.`,
    `Main line: ${item.mainLine}.`,
    `New tree + lessons files. 3 moves/lesson, 10 nodes.`,
    `Follow sicilian/london patterns. Create all files, update lookups, npm run check.`,
  ].join(' ')
}

// --- Main ---
async function main() {
  console.log('=== Opening Build Runner ===\n')

  // Ensure logs directory exists
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true })
  }

  const queue = readQueue()

  // Find next pending items, sorted by priority then addedAt
  const pending = queue.items
    .filter(i => i.status === 'pending')
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      return a.addedAt.localeCompare(b.addedAt)
    })

  if (pending.length === 0) {
    console.log('No pending builds. Queue is empty or all items are in progress.')
    return
  }

  console.log(`Found ${pending.length} pending builds. Processing up to ${maxItems}.\n`)

  const toProcess = pending.slice(0, maxItems)
  let successes = 0
  let failures = 0

  for (const item of toProcess) {
    const prompt = buildPrompt(item)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const logFile = `${item.id}-${timestamp}.log`
    const logPath = join(LOGS_DIR, logFile)

    console.log(`--- Building: ${item.name} (${item.id}) ---`)
    console.log(`  Type: ${item.type}${item.level ? ` L${item.level}` : ''}`)
    console.log(`  Side: ${item.side}`)
    console.log(`  Priority: ${item.priority}`)

    if (dryRun) {
      console.log(`  Prompt: ${prompt}`)
      console.log(`  [DRY RUN — skipping]\n`)
      continue
    }

    // Mark as building
    item.status = 'building'
    item.startedAt = new Date().toISOString()
    writeQueue(queue)

    const startTime = Date.now()

    try {
      // Construct the claude CLI command
      const escapedPrompt = prompt.replace(/"/g, '\\"')
      const systemSuffix = 'Read .claude/agents/openings-curriculum-agent.md and execute. Do not ask questions — just build it.'
      const cmd = `claude -p "${escapedPrompt}" --dangerously-skip-permissions --append-system-prompt "${systemSuffix}"`

      console.log(`  Running claude -p...`)

      const output = execSync(cmd, {
        cwd: ROOT,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
        timeout: 15 * 60 * 1000,     // 15 min timeout per build
      })

      // Save log
      writeFileSync(logPath, `=== ${item.name} ===\nPrompt: ${prompt}\n\n${output}`)

      const durationSeconds = Math.round((Date.now() - startTime) / 1000)

      // Mark as needs-review
      item.status = 'needs-review'
      item.completedAt = new Date().toISOString()
      item.durationSeconds = durationSeconds
      item.logFile = logFile
      writeQueue(queue)

      console.log(`  Done in ${durationSeconds}s — needs review`)
      console.log(`  Log: ${logPath}\n`)
      successes++
    } catch (err: unknown) {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000)
      const errorMessage = err instanceof Error ? err.message : String(err)

      // Save error log
      writeFileSync(logPath, `=== ${item.name} (FAILED) ===\nPrompt: ${prompt}\n\nError: ${errorMessage}`)

      item.status = 'failed'
      item.completedAt = new Date().toISOString()
      item.durationSeconds = durationSeconds
      item.error = errorMessage.slice(0, 500)
      item.logFile = logFile
      writeQueue(queue)

      console.log(`  FAILED after ${durationSeconds}s: ${errorMessage.slice(0, 200)}`)
      console.log(`  Log: ${logPath}\n`)
      failures++
    }
  }

  if (!dryRun) {
    console.log(`\n=== Summary ===`)
    console.log(`Processed: ${successes + failures}`)
    console.log(`Successes: ${successes}`)
    console.log(`Failures: ${failures}`)
    console.log(`Remaining: ${pending.length - toProcess.length}`)
  }
}

main().catch(console.error)
