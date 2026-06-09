/**
 * Rookie voice pipeline — STEP 4: apply (codemod by exact string).
 *
 * Reads data/rookie-voice/proposed.json, skips any ids in skip.json, and for
 * each remaining change replaces the OLD string literal with the NEW one in its
 * source file. Matching accounts for JS quote style + escaping, and requires the
 * old literal to appear EXACTLY ONCE in the file (else it's skipped and reported
 * for manual handling — never a risky guess).
 *
 * Run: npx tsx scripts/rookie-voice/apply.ts [--dry]
 * Then: npm run check
 */

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'data', 'rookie-voice');
const dry = process.argv.includes('--dry');

interface Proposed {
  id: string;
  sourceFile: string;
  oldText: string;
  newText: string;
}

const esc = {
  '"': (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
  "'": (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"),
  '`': (s: string) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'),
} as const;
type Quote = keyof typeof esc;
const QUOTES: Quote[] = ['"', "'", '`'];

/** Find the quote style under which `text` appears exactly once in `content`. */
function locate(content: string, text: string): { quote: Quote; literal: string } | null {
  const hits: Array<{ quote: Quote; literal: string }> = [];
  for (const q of QUOTES) {
    const literal = q + esc[q](text) + q;
    if (content.split(literal).length - 1 === 1) hits.push({ quote: q, literal });
  }
  return hits.length === 1 ? hits[0] : null;
}

function main() {
  const proposed: Proposed[] = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'proposed.json'), 'utf8'));
  const skipPath = path.join(OUT_DIR, 'skip.json');
  const skip = new Set<string>(
    fs.existsSync(skipPath) ? (JSON.parse(fs.readFileSync(skipPath, 'utf8')) as string[]) : [],
  );

  // Group by file so we edit each file's content once, in memory.
  const byFile: Record<string, Proposed[]> = {};
  for (const p of proposed) if (!skip.has(p.id)) (byFile[p.sourceFile] ??= []).push(p);

  let applied = 0;
  const manual: Array<{ id: string; file: string; reason: string }> = [];

  for (const [file, changes] of Object.entries(byFile)) {
    const abs = path.join(process.cwd(), file);
    let content = fs.readFileSync(abs, 'utf8');
    for (const c of changes) {
      if (c.oldText === c.newText) continue;
      const found = locate(content, c.oldText);
      if (!found) {
        manual.push({ id: c.id, file, reason: 'old text not found uniquely (0 or >1 matches)' });
        continue;
      }
      const replacement = found.quote + esc[found.quote](c.newText) + found.quote;
      content = content.replace(found.literal, replacement);
      applied++;
    }
    if (!dry) fs.writeFileSync(abs, content);
  }

  console.log(`${dry ? '[DRY] ' : ''}Applied ${applied} rewrites across ${Object.keys(byFile).length} files.`);
  if (skip.size) console.log(`Skipped ${skip.size} vetoed id(s).`);
  if (manual.length) {
    console.log(`\n${manual.length} need manual handling (not applied):`);
    for (const m of manual) console.log(`  ${m.id} (${m.file}) — ${m.reason}`);
    fs.writeFileSync(path.join(OUT_DIR, 'manual.json'), JSON.stringify(manual, null, 2));
  }
  if (!dry) console.log('\nNow run: npm run check');
}

main();
