/**
 * Rookie voice pipeline — STEP 1: extract.
 *
 * Imports the live line pools, classifies each line via the shared
 * voice-register, and writes:
 *   data/rookie-voice/eligible.json  — lines we may warm up (sent to the LLM)
 *   data/rookie-voice/frozen.json    — mood / sore-loser lines (audit trail; never sent)
 *
 * Run: npx tsx scripts/rookie-voice/extract.ts
 */

import fs from 'node:fs';
import path from 'node:path';

import { QUIP_POOL } from '@/lib/quips/quip-pool';
import { AUTHORED_LINES } from '@/lib/speech/line-pool';
import { TOUCHPOINT_LINES } from '@/lib/speech/rookie-touchpoints';
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips';
import { isFrozen, register, describeContext } from '@/lib/speech/voice-register';

export interface VoiceRecord {
  id: string;
  sourceFile: string;
  oldText: string;
  register: 'frozen' | 'proud' | 'warm';
  context: string;
}

const OUT_DIR = path.join(process.cwd(), 'data', 'rookie-voice');

const authoredIds = new Set(AUTHORED_LINES.map((l) => l.id));
const touchpointIds = new Set(TOUCHPOINT_LINES.map((l) => l.id));

/** Map a runtime line id back to the source file whose array literally holds its text. */
function sourceFor(id: string): string {
  if (authoredIds.has(id)) return 'lib/speech/line-pool.ts';
  if (touchpointIds.has(id)) return 'lib/speech/rookie-touchpoints.ts';
  // Everything else in QUIP_POOL is a generated PLAY_LINE (play_win_*, play_loss_*,
  // play_levelup_*, play_landing_*…). Its text lives as a bare string in quip-pool.ts.
  return 'lib/quips/quip-pool.ts';
}

const eligible: VoiceRecord[] = [];
const frozen: VoiceRecord[] = [];

for (const line of QUIP_POOL) {
  const rec: VoiceRecord = {
    id: line.id,
    sourceFile: sourceFor(line.id),
    oldText: line.text,
    register: register(line),
    context: describeContext(line),
  };
  if (isFrozen(line)) frozen.push({ ...rec, register: 'frozen' });
  else eligible.push(rec);
}

// Interactive Rook tap easter eggs — bare strings, no conditions → all warm-eligible.
for (const reaction of LEARN_TAP_REACTIONS) {
  reaction.quips.forEach((quip, i) => {
    eligible.push({
      id: `tap_${reaction.mode}_${i + 1}`,
      sourceFile: 'data/quips/learn-tap-quips.ts',
      oldText: quip,
      register: 'warm',
      context: `interactive Rook tap reaction (${reaction.label} mode)`,
    });
  });
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'eligible.json'), JSON.stringify(eligible, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'frozen.json'), JSON.stringify(frozen, null, 2));

const byFile: Record<string, number> = {};
for (const r of eligible) byFile[r.sourceFile] = (byFile[r.sourceFile] ?? 0) + 1;

console.log(`Eligible: ${eligible.length}  |  Frozen: ${frozen.length}`);
console.log('Eligible by file:');
for (const [f, n] of Object.entries(byFile)) console.log(`  ${n.toString().padStart(4)}  ${f}`);
console.log(`\nWrote ${path.join('data', 'rookie-voice')}/eligible.json + frozen.json`);
