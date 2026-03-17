#!/usr/bin/env npx tsx
/**
 * Stage 2: WRITE-TREE — Generate the opening tree file from prep.json
 *
 * Input:  --slug <slug> --level <n> [--name "Opening Name"] [--color "#hex"] [--color-dark "#hex"]
 * Output: data/opening-builds/{slug}-L{level}/{slug}.ts
 *
 * Uses a single small LLM call (`claude -p`) to name nodes and write descriptions.
 * The structure (node IDs, types, grid positions) is computed deterministically.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
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
  const name = get('--name')
  const color = get('--color') ?? '#6C63FF'
  const colorDark = get('--color-dark') ?? '#5248CC'
  const skipLlm = args.includes('--skip-llm')

  if (!slug || !level) {
    console.error('Usage: write-tree.ts --slug <slug> --level <n> [--name "Name"] [--color "#hex"]')
    process.exit(1)
  }

  return { slug, level: parseInt(level, 10), name: name ?? slugToName(slug), color, colorDark, skipLlm }
}

function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function slugToPascalCase(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function slugToConstName(slug: string): string {
  return slug.toUpperCase().replace(/-/g, '_')
}

// ═══════════════════════════════════════════
// GRID LAYOUT COMPUTATION
// ═══════════════════════════════════════════

interface TreeNode {
  id: string
  name: string
  moves: string[]
  description: string
  type: string
  row: number
  col: number
  lineFrom: string | null
  unlockedBy: string | null
  side: 'white' | 'black'
}

function computeGrid(lessonPlan: LessonPlanItem[], side: 'white' | 'black'): TreeNode[] {
  const nodes: TreeNode[] = []
  const mainNodes = lessonPlan.filter(lp => lp.type === 'main')
  const deviationNodes = lessonPlan.filter(lp => lp.type === 'deviation')
  const branchNodes = lessonPlan.filter(lp => lp.type === 'branch')
  const testNodes = lessonPlan.filter(lp => lp.type === 'test')

  // Main line: col 0, row 0..N
  for (let i = 0; i < mainNodes.length; i++) {
    const lp = mainNodes[i]
    nodes.push({
      id: lp.nodeId,
      name: lp.name ?? `Lesson ${i + 1}`,
      moves: lp.newMoves.length > 0 ? formatMoves(lp) : [],
      description: '',
      type: 'main',
      row: i,
      col: 0,
      lineFrom: i === 0 ? null : mainNodes[i - 1].nodeId,
      unlockedBy: i === 0 ? null : mainNodes[i - 1].nodeId,
      side,
    })
  }

  // Deviation: col -1, adjacent to the main node they branch from
  let deviationRow = 0
  for (let i = 0; i < deviationNodes.length; i++) {
    const lp = deviationNodes[i]
    nodes.push({
      id: lp.nodeId,
      name: lp.name ?? `If ${lp.deviationMove}`,
      moves: lp.deviationMove ? [lp.deviationMove, ...(lp.ourResponse ?? [])] : [],
      description: '',
      type: 'deviation',
      row: deviationRow,
      col: -1,
      lineFrom: i === 0 ? mainNodes[0]?.nodeId ?? null : deviationNodes[i - 1]?.nodeId ?? null,
      unlockedBy: nodes.length > 1 ? nodes[nodes.length - 1].id : null,
      side,
    })
    deviationRow++
  }

  // Branch: col 1
  let branchRow = 1
  for (const lp of branchNodes) {
    nodes.push({
      id: lp.nodeId,
      name: lp.name ?? 'Variation',
      moves: lp.newMoves,
      description: '',
      type: 'branch',
      row: branchRow,
      col: 1,
      lineFrom: mainNodes[Math.min(branchRow, mainNodes.length - 1)]?.nodeId ?? null,
      unlockedBy: nodes[nodes.length - 1]?.id ?? null,
      side,
    })
    branchRow += 2
  }

  // Test: top row, col 0
  for (const lp of testNodes) {
    const maxRow = Math.max(...nodes.map(n => n.row))
    nodes.push({
      id: lp.nodeId,
      name: lp.name ?? 'Lvl Test',
      moves: [],
      description: '',
      type: 'test',
      row: maxRow + 1,
      col: 0,
      lineFrom: mainNodes[mainNodes.length - 1]?.nodeId ?? null,
      unlockedBy: nodes[nodes.length - 1]?.id ?? null,
      side,
    })
  }

  return nodes
}

function formatMoves(lp: LessonPlanItem): string[] {
  // Format move pairs like ["3...e6", "4.Nf3 c5", "5.c3"]
  const formatted: string[] = []
  for (const pos of lp.positions) {
    const prefix = pos.mover === 'white'
      ? `${pos.moveNumber}.${pos.moveSan}`
      : `${pos.moveNumber}...${pos.moveSan}`
    formatted.push(prefix)
  }
  // Group into pairs: "1.e4 d5", "2.Nf3 Nc6"
  const pairs: string[] = []
  for (let i = 0; i < formatted.length; i += 2) {
    if (i + 1 < formatted.length) {
      pairs.push(`${formatted[i]} ${formatted[i + 1].replace(/^\d+\.\.\./, '')}`)
    } else {
      pairs.push(formatted[i])
    }
  }
  return pairs
}

// ═══════════════════════════════════════════
// LLM NAMING (optional)
// ═══════════════════════════════════════════

interface NodeNames {
  [nodeId: string]: { name: string; description: string }
}

function callLlmForNames(nodes: TreeNode[], prepData: PrepData): NodeNames {
  const nodeInfo = nodes.map(n => ({
    id: n.id,
    type: n.type,
    moves: n.moves,
  }))

  const prompt = `You are naming nodes in a chess opening tree for a learning app.

OPENING: ${prepData.meta.slug} (${prepData.meta.side})
MAIN LINE: ${prepData.meta.mainLine}

NODES:
${JSON.stringify(nodeInfo, null, 2)}

For each node, provide:
- name: ≤15 characters, catchy/descriptive (e.g., "The London Setup", "If 1...e5", "Jobava London")
- description: 1 sentence explaining what the lesson covers

Rules:
- Main line lessons: name the strategic concept being taught
- Deviation lessons: "If [move]" format (what to do if opponent plays this)
- Branch lessons: name the variation
- Test lessons: "Lvl ${prepData.meta.level} Test"

Return ONLY valid JSON: { "nodeId": { "name": "...", "description": "..." }, ... }
No markdown, no explanation, just JSON.`

  try {
    const result = execSync(
      `claude -p ${JSON.stringify(prompt)} --output-format json 2>/dev/null`,
      { encoding: 'utf-8', maxBuffer: 1024 * 1024, timeout: 60000 }
    )

    // Extract JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('⚠ LLM returned no JSON, using defaults')
      return {}
    }

    return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.warn(`⚠ LLM call failed: ${e}. Using default names.`)
    return {}
  }
}

// ═══════════════════════════════════════════
// CODE GENERATOR
// ═══════════════════════════════════════════

function generateTreeFile(
  nodes: TreeNode[],
  slug: string,
  name: string,
  color: string,
  colorDark: string,
  prepData: PrepData,
): string {
  const constName = slugToConstName(slug)
  const side = prepData.meta.side
  const completionOrder = nodes.map(n => n.id)

  const lines: string[] = []

  // Header comment
  lines.push(`// ${name} Opening Tree Data`)
  lines.push(`// Fixed grid engine: row/col positions are explicit, never computed.`)
  lines.push(`// row 0 = bottom of screen. col 0 = center trunk.`)
  lines.push(`// lineFrom = visible structural line. unlockedBy = invisible unlock logic.`)
  lines.push(`//`)
  lines.push(`// ${side.toUpperCase()} OPENING: The user is learning to play as ${side === 'white' ? 'White' : 'Black'}.`)
  lines.push(`// Main line: ${prepData.meta.mainLine}`)
  lines.push(`//`)
  lines.push(`// GRID LAYOUT:`)
  const maxRow = Math.max(...nodes.map(n => n.row))
  for (let r = maxRow; r >= 0; r--) {
    const rowNodes = nodes.filter(n => n.row === r).sort((a, b) => a.col - b.col)
    const rowStr = rowNodes.map(n => `${n.id} (col ${n.col})`).join('   ')
    lines.push(`//   Row ${r}: ${rowStr}`)
  }
  lines.push('')
  lines.push(`import type { OpeningNode, OpeningTree } from './ruy-lopez'`)
  lines.push('')
  lines.push(`export const ${constName}: OpeningTree = {`)
  lines.push(`  id: '${slug}',`)
  lines.push(`  name: '${name}',`)
  lines.push(`  slug: '${slug}',`)
  lines.push(`  description: '',`)
  lines.push(`  color: '${color}',`)
  lines.push(`  colorDark: '${colorDark}',`)
  lines.push(`  completionOrder: [`)
  // Chunk completionOrder into lines of ~4
  for (let i = 0; i < completionOrder.length; i += 4) {
    const chunk = completionOrder.slice(i, i + 4).map(id => `'${id}'`).join(', ')
    const comma = i + 4 < completionOrder.length ? ',' : ','
    lines.push(`    ${chunk}${comma}`)
  }
  lines.push(`  ],`)
  lines.push(`  nodes: [`)

  // Group by type for comments
  const grouped = {
    main: nodes.filter(n => n.type === 'main'),
    deviation: nodes.filter(n => n.type === 'deviation'),
    branch: nodes.filter(n => n.type === 'branch'),
    test: nodes.filter(n => n.type === 'test'),
  }

  const allOrdered = [...grouped.main, ...grouped.deviation, ...grouped.branch, ...grouped.test]

  let currentType = ''
  for (const node of allOrdered) {
    if (node.type !== currentType) {
      currentType = node.type
      lines.push('')
      const label = node.type === 'main' ? 'MAIN LINE (center trunk, col 0)'
        : node.type === 'deviation' ? 'DEVIATION LINES (col -1)'
        : node.type === 'branch' ? 'BRANCH LINES (col 1)'
        : 'LEVEL TEST'
      lines.push(`    // === ${label} ===`)
    }

    lines.push(`    {`)
    lines.push(`      id: '${node.id}',`)
    lines.push(`      name: '${node.name.replace(/'/g, "\\'")}',`)
    lines.push(`      moves: [${node.moves.map(m => `'${m}'`).join(', ')}],`)
    lines.push(`      description: '${node.description.replace(/'/g, "\\'")}',`)
    lines.push(`      type: '${node.type}',`)
    lines.push(`      row: ${node.row},`)
    lines.push(`      col: ${node.col},`)
    lines.push(`      lineFrom: ${node.lineFrom ? `'${node.lineFrom}'` : 'null'},`)
    lines.push(`      unlockedBy: ${node.unlockedBy ? `'${node.unlockedBy}'` : 'null'},`)
    lines.push(`      side: '${node.side}',`)
    lines.push(`    },`)
  }

  lines.push(`  ],`)
  lines.push(`}`)
  lines.push('')

  return lines.join('\n')
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  const { slug, level, name, color, colorDark, skipLlm } = parseArgs()
  const buildDir = join(BUILDS_DIR, `${slug}-L${level}`)

  console.log(`\n🌳 WRITE-TREE: ${slug} Level ${level}`)

  // Load prep.json
  const prepPath = join(buildDir, 'prep.json')
  if (!existsSync(prepPath)) {
    console.error(`❌ prep.json not found. Run prep.ts first.`)
    process.exit(1)
  }
  const prepData: PrepData = JSON.parse(readFileSync(prepPath, 'utf-8'))

  // Compute grid layout
  const nodes = computeGrid(prepData.lessonPlan, prepData.meta.side)
  console.log(`   ${nodes.length} nodes computed`)

  // Get names from LLM (or use defaults)
  if (!skipLlm) {
    console.log('   Calling LLM for node names...')
    const names = callLlmForNames(nodes, prepData)
    for (const node of nodes) {
      if (names[node.id]) {
        node.name = names[node.id].name
        node.description = names[node.id].description
      }
    }
  } else {
    console.log('   Skipping LLM (--skip-llm), using default names')
  }

  // Generate tree file
  const code = generateTreeFile(nodes, slug, name, color, colorDark, prepData)
  const outPath = join(buildDir, `${slug}.ts`)
  writeFileSync(outPath, code)

  console.log(`\n✅ Tree written to ${outPath}`)
  console.log(`   ${nodes.length} nodes`)
  for (const n of nodes) {
    console.log(`   ${n.id} [${n.type}] row=${n.row} col=${n.col} "${n.name}"`)
  }
  console.log(`\nNext: run write-lessons.ts`)
}

main().catch(e => {
  console.error('💥 Write-tree failed:', e)
  process.exit(1)
})
