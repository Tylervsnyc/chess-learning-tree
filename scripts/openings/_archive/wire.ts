#!/usr/bin/env npx tsx
/**
 * Stage 6: WIRE — Copy assembled file and update imports/registry
 *
 * Input:  --slug <slug> --level <n> [--dry]
 * Output: Updates to existing files + copies assembled lessons
 *
 * Zero LLM. File copy + text insertion.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

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
  const dry = args.includes('--dry')

  if (!slug || !level) {
    console.error('Usage: wire.ts --slug <slug> --level <n> [--dry]')
    process.exit(1)
  }

  return { slug, level: parseInt(level, 10), dry }
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
// WIRING OPERATIONS
// ═══════════════════════════════════════════

interface WireAction {
  file: string
  action: string
  detail: string
}

function planWiring(slug: string, level: number, buildDir: string): WireAction[] {
  const actions: WireAction[] = []
  const pascalName = slugToPascalCase(slug)
  const constName = slugToConstName(slug)
  const lessonsFile = `data/openings/${slug}-lessons.ts`
  const treeFile = `data/openings/${slug}.ts`
  const treeLookupFile = 'lib/opening-trees.ts'
  const lessonPage = 'app/openings/[slug]/[lessonId]/page.tsx'

  // 1. Copy assembled lessons file
  const assembledPath = join(buildDir, `${slug}-lessons.ts`)
  if (existsSync(assembledPath)) {
    const destPath = join(ROOT, lessonsFile)
    if (existsSync(destPath)) {
      actions.push({
        file: lessonsFile,
        action: 'OVERWRITE',
        detail: `Replace existing lessons file with assembled output`,
      })
    } else {
      actions.push({
        file: lessonsFile,
        action: 'CREATE',
        detail: `Copy assembled lessons file`,
      })
    }
  }

  // 2. Copy tree file (if new opening)
  const builtTreePath = join(buildDir, `${slug}.ts`)
  const existingTreePath = join(ROOT, treeFile)
  if (existsSync(builtTreePath) && !existsSync(existingTreePath)) {
    actions.push({
      file: treeFile,
      action: 'CREATE',
      detail: `Copy generated tree file`,
    })

    // 3. Add to TREE_LOOKUP (only for new openings)
    actions.push({
      file: treeLookupFile,
      action: 'INSERT',
      detail: `Add '${slug}': ${constName} to TREE_LOOKUP + import`,
    })
  }

  // 4. Check lesson page imports
  const pageContent = readFileSync(join(ROOT, lessonPage), 'utf-8')
  const importName = `get${pascalName}Lesson`
  if (!pageContent.includes(importName)) {
    actions.push({
      file: lessonPage,
      action: 'INSERT',
      detail: `Add import { ${importName} } and add to lookups Record`,
    })
  }

  return actions
}

function executeWiring(slug: string, level: number, buildDir: string, dry: boolean): boolean {
  const pascalName = slugToPascalCase(slug)
  const constName = slugToConstName(slug)
  let success = true

  // 1. Copy assembled lessons
  const assembledPath = join(buildDir, `${slug}-lessons.ts`)
  const lessonsDestPath = join(ROOT, `data/openings/${slug}-lessons.ts`)
  if (existsSync(assembledPath)) {
    if (dry) {
      console.log(`   [DRY] Would copy ${assembledPath} → ${lessonsDestPath}`)
    } else {
      copyFileSync(assembledPath, lessonsDestPath)
      console.log(`   ✓ Copied lessons file`)
    }
  } else {
    console.error(`   ❌ Assembled file not found: ${assembledPath}`)
    return false
  }

  // 2. Copy tree file (if new)
  const builtTreePath = join(buildDir, `${slug}.ts`)
  const treeDestPath = join(ROOT, `data/openings/${slug}.ts`)
  if (existsSync(builtTreePath) && !existsSync(treeDestPath)) {
    if (dry) {
      console.log(`   [DRY] Would copy ${builtTreePath} → ${treeDestPath}`)
    } else {
      copyFileSync(builtTreePath, treeDestPath)
      console.log(`   ✓ Copied tree file`)
    }

    // 3. Add to TREE_LOOKUP
    const treeLookupPath = join(ROOT, 'lib/opening-trees.ts')
    if (existsSync(treeLookupPath)) {
      let content = readFileSync(treeLookupPath, 'utf-8')

      // Add import
      const importLine = `import { ${constName} } from '@/data/openings/${slug}'`
      if (!content.includes(importLine)) {
        // Insert after last import
        const lastImportIdx = content.lastIndexOf('import ')
        const endOfLine = content.indexOf('\n', lastImportIdx)
        if (dry) {
          console.log(`   [DRY] Would add import: ${importLine}`)
        } else {
          content = content.slice(0, endOfLine + 1) + importLine + '\n' + content.slice(endOfLine + 1)
        }
      }

      // Add to TREE_LOOKUP
      const lookupEntry = `  '${slug}': ${constName},`
      if (!content.includes(lookupEntry)) {
        const lookupEnd = content.indexOf('}', content.indexOf('TREE_LOOKUP'))
        if (lookupEnd !== -1) {
          if (dry) {
            console.log(`   [DRY] Would add to TREE_LOOKUP: ${lookupEntry}`)
          } else {
            content = content.slice(0, lookupEnd) + lookupEntry + '\n' + content.slice(lookupEnd)
          }
        }
      }

      if (!dry) {
        writeFileSync(treeLookupPath, content)
        console.log(`   ✓ Updated tree lookup`)
      }
    }
  }

  // 4. Update lesson page
  const lessonPagePath = join(ROOT, 'app/openings/[slug]/[lessonId]/page.tsx')
  let pageContent = readFileSync(lessonPagePath, 'utf-8')
  const importName = `get${pascalName}Lesson`

  if (!pageContent.includes(importName)) {
    // Add import after last opening lesson import
    const importLine = `import { ${importName} } from '@/data/openings/${slug}-lessons'`
    const lastOpeningImport = pageContent.lastIndexOf("from '@/data/openings/")
    if (lastOpeningImport !== -1) {
      const endOfLine = pageContent.indexOf('\n', lastOpeningImport)
      if (dry) {
        console.log(`   [DRY] Would add import: ${importLine}`)
      } else {
        pageContent = pageContent.slice(0, endOfLine + 1) + importLine + '\n' + pageContent.slice(endOfLine + 1)
      }
    }

    // Add to lookups Record
    const lookupEntry = `      '${slug}': ${importName},`
    // Find the lookups object — look for the closing brace of the Record
    const lookupsStart = pageContent.indexOf("'ruy-lopez': getRuyLopezLesson")
    if (lookupsStart !== -1) {
      const lookupsEnd = pageContent.indexOf('}', lookupsStart)
      if (lookupsEnd !== -1 && !pageContent.includes(`'${slug}':`)) {
        if (dry) {
          console.log(`   [DRY] Would add to lookups: ${lookupEntry}`)
        } else {
          pageContent = pageContent.slice(0, lookupsEnd) + lookupEntry + '\n    ' + pageContent.slice(lookupsEnd)
        }
      }
    }

    if (!dry) {
      writeFileSync(lessonPagePath, pageContent)
      console.log(`   ✓ Updated lesson page`)
    }
  } else {
    console.log(`   ✓ Lesson page already has ${importName}`)
  }

  return success
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  const { slug, level, dry } = parseArgs()
  const buildDir = join(BUILDS_DIR, `${slug}-L${level}`)

  console.log(`\n🔌 WIRE: ${slug} Level ${level}${dry ? ' (DRY RUN)' : ''}`)

  // Plan
  const actions = planWiring(slug, level, buildDir)
  if (actions.length === 0) {
    console.log('   Nothing to wire — all imports already exist')
    return
  }

  console.log(`\n   Planned actions:`)
  for (const a of actions) {
    console.log(`   ${a.action} ${a.file} — ${a.detail}`)
  }

  if (dry) {
    console.log(`\n   Dry run complete. Remove --dry to execute.`)
    return
  }

  console.log('')

  // Execute
  const success = executeWiring(slug, level, buildDir, dry)

  if (!success) {
    console.error('\n❌ Wiring had errors')
    process.exit(1)
  }

  // Run type check
  console.log('\n   Running npm run check...')
  try {
    execSync('npm run check', { cwd: ROOT, stdio: 'inherit', timeout: 120000 })
    console.log('\n✅ Wiring complete — npm run check passed')
  } catch {
    console.error('\n❌ npm run check failed — review the wired files')
    process.exit(1)
  }
}

main().catch(e => {
  console.error('💥 Wire failed:', e)
  process.exit(1)
})
