/**
 * Rookie voice pipeline — STEP 3: report (the human review gate).
 *
 * Reads data/rookie-voice/proposed.json and renders data/rookie-voice/REVIEW.md:
 * grouped by source file → context, every change shown old → new, with a
 * FLAGGED section at the top for rewrites that still look risky (dropped a
 * template token, too long, or a banned word slipped through).
 *
 * Tyler reviews REVIEW.md and lists any ids to VETO. Put vetoed ids (one per
 * line, or a JSON array) in data/rookie-voice/skip.json — apply.ts honors it.
 *
 * Run: npx tsx scripts/rookie-voice/report.ts
 */

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'data', 'rookie-voice');

interface Proposed {
  id: string;
  sourceFile: string;
  oldText: string;
  newText: string;
  register: 'frozen' | 'proud' | 'warm';
  context: string;
}

const BANNED = /\b(circuits?|processing|processor|RAM|compute|cores?)\b|bigger board|the universe|atoms in the universe|pieces don'?t know/i;
const TOKEN = /\{\{?[a-zA-Z_]+\}?\}|\[SFX\]/g;

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
function tokensOf(s: string): string[] {
  return (s.match(TOKEN) || []).sort();
}
function droppedToken(oldT: string, newT: string): boolean {
  const o = tokensOf(oldT);
  const n = new Set(tokensOf(newT));
  return o.some((t) => !n.has(t));
}
function isRisky(p: Proposed): string | null {
  if (droppedToken(p.oldText, p.newText)) return 'dropped a template token';
  if (wordCount(p.newText) > 18) return 'long (>18 words)';
  if (BANNED.test(p.newText)) return 'banned word/phrase';
  return null;
}

function row(p: Proposed): string {
  return `- \`${p.id}\`\n    - old: ${p.oldText}\n    - new: **${p.newText}**`;
}

function main() {
  const proposed: Proposed[] = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'proposed.json'), 'utf8'));

  const risky = proposed.map((p) => ({ p, why: isRisky(p) })).filter((x) => x.why);

  const byFile: Record<string, Proposed[]> = {};
  for (const p of proposed) (byFile[p.sourceFile] ??= []).push(p);

  const out: string[] = [];
  out.push('# Rookie Voice — Review');
  out.push('');
  out.push(`${proposed.length} proposed rewrites. Frozen mood/sore-loser lines are NOT here (untouched).`);
  out.push('');
  out.push('**To veto any line:** add its id to `data/rookie-voice/skip.json` (a JSON array of ids). Everything not vetoed gets applied. You can also edit the `new:` text directly in `proposed.json` before applying.');
  out.push('');

  if (risky.length) {
    out.push(`## FLAGGED — eyeball these first (${risky.length})`);
    out.push('');
    out.push('Auto-flagged as possibly off (still applied unless you veto):');
    out.push('');
    for (const { p, why } of risky) {
      out.push(`- \`${p.id}\` — _${why}_`);
      out.push(`    - old: ${p.oldText}`);
      out.push(`    - new: **${p.newText}**`);
    }
    out.push('');
  }

  for (const [file, lines] of Object.entries(byFile)) {
    out.push(`## ${file} (${lines.length})`);
    out.push('');
    // group by context for scannability
    const byCtx: Record<string, Proposed[]> = {};
    for (const p of lines) (byCtx[p.context] ??= []).push(p);
    for (const [ctx, ps] of Object.entries(byCtx)) {
      out.push(`### ${ctx} (${ps.length})`);
      for (const p of ps) out.push(row(p));
      out.push('');
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, 'REVIEW.md'), out.join('\n'));
  console.log(`Wrote data/rookie-voice/REVIEW.md — ${proposed.length} changes, ${risky.length} flagged.`);
}

main();
