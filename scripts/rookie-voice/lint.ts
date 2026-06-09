/**
 * Rookie voice lint — the permanent regression guard.
 *
 * Asserts every ENCOURAGE-ELIGIBLE Rookie line stays on-voice: short, no
 * hardware metaphors, no existential musing, no dash-cutoffs, no decimals/emoji.
 * Frozen mood / sore-loser lines (spicy or losing/desperate) are exempt — they
 * carry Rookie's moods and are allowed to be scrappy. Also checks ids are unique.
 *
 * Wired into `npm run check`. Exits non-zero on any violation so the voice can
 * never silently drift again — no more hand-auditing lines.
 *
 * Run: npx tsx scripts/rookie-voice/lint.ts
 */

import { QUIP_POOL } from '@/lib/quips/quip-pool';
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips';
import { isFrozen } from '@/lib/speech/voice-register';
import type { SpeechLine } from '@/lib/speech/priority-queue';

const CHECKS: Array<{ name: string; re: RegExp }> = [
  { name: 'hardware metaphor', re: /\b(circuits?|processor|processors|\bRAM\b|cores?)\b/i },
  { name: 'existential musing', re: /bigger board|the universe|atoms in the universe|pieces don'?t know|version of this game|neither of us exist|find (it|that) calming/i },
  { name: 'dash-cutoff', re: /\bI (felt|feel)\s*[—-]\s*(anyway|never)|[—-]\s*anyway\b/i },
  { name: 'decimal number', re: /\d+\.\d+/ },
  { name: 'TTS-breaking char (parens/asterisk)', re: /[()*]/ },
  { name: 'emoji', re: /\p{Extended_Pictographic}/u },
];

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// Generous hard cap — on-voice lines are ~8 words; this only catches genuinely
// runaway paragraphs so the build gate never false-fails legit short fragments.
const MAX_WORDS = 30;

interface Violation { id: string; text: string; problem: string; }

function check(line: Pick<SpeechLine, 'id' | 'text' | 'conditions'>, violations: Violation[]) {
  if (isFrozen(line)) return; // moods / sore-loser register exempt
  const t = line.text;
  if (wordCount(t) > MAX_WORDS) violations.push({ id: line.id, text: t, problem: `over ${MAX_WORDS} words` });
  for (const c of CHECKS) if (c.re.test(t)) violations.push({ id: line.id, text: t, problem: c.name });
}

function main() {
  const violations: Violation[] = [];

  // unique ids across the runtime pool
  const seen = new Map<string, number>();
  for (const l of QUIP_POOL) seen.set(l.id, (seen.get(l.id) ?? 0) + 1);
  const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([id]) => id);
  if (dupes.length) console.error(`Duplicate line ids: ${dupes.join(', ')}`);

  for (const l of QUIP_POOL) check(l, violations);
  // tap reactions (bare strings, always eligible)
  for (const r of LEARN_TAP_REACTIONS) {
    r.quips.forEach((q, i) => check({ id: `tap_${r.mode}_${i + 1}`, text: q }, violations));
  }

  if (violations.length || dupes.length) {
    console.error(`\nRookie voice lint FAILED — ${violations.length} line violation(s):\n`);
    for (const v of violations) console.error(`  [${v.problem}] ${v.id}: ${v.text}`);
    console.error('\nFix the line, or if it is intentional mood/sore-loser content, tag it tone:\'spicy\' or evalMoods:[\'losing\'/\'desperate\'].');
    process.exit(1);
  }
  console.log(`Rookie voice lint passed — ${QUIP_POOL.length} pool lines + tap reactions clean.`);
}

main();
