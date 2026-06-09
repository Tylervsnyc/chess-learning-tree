/**
 * Rookie voice pipeline — STEP 2: revoice (batch LLM rewrite).
 *
 * Reads data/rookie-voice/eligible.json, rewrites each line to the new
 * over-invested / encouraging voice (calibrated by register), and writes
 * data/rookie-voice/proposed.json — { id, sourceFile, oldText, newText, register, context }.
 *
 * The voice bible is the system prompt (prompt-cached). Frozen lines were
 * already excluded by extract.ts and are never sent here.
 *
 * Run: npx tsx scripts/rookie-voice/revoice.ts [--limit N] [--batch 20]
 */

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

import type { VoiceRecord } from './extract';

dotenv.config({ path: '.env.local' });

const MODEL = 'claude-sonnet-4-6';
const OUT_DIR = path.join(process.cwd(), 'data', 'rookie-voice');

const args = process.argv.slice(2);
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
const BATCH = args.includes('--batch') ? Number(args[args.indexOf('--batch') + 1]) : 20;

const bible = fs.readFileSync(path.join(process.cwd(), '.claude', 'rookie-voice-bible.md'), 'utf8');

const SYSTEM_RULES = `You are re-voicing short spoken lines for "Rookie", the AI character in a chess app, to match the voice bible above.

Your job: rewrite each line to be SHORTER and MORE ENCOURAGING in Rookie's over-invested voice, while keeping it situationally correct for the context given.

VOICE (from the bible): Rookie is unreasonably, specifically OVER-INVESTED in the player. Warm, proud, rooting for them. Reactions point OUTWARD at the player, never inward at her own feelings.

REGISTER tells you the emotional calibration:
- "proud" → Rookie is winning/ahead in this spot: proud, a little smug-but-warm, still encouraging.
- "warm" → even or neutral: warm, rooting-for-you, keep her wit and piece opinions.

HARD RULES for every rewrite:
- Two short sentences MAX. ~8 words is ideal. If you can say it shorter, do.
- Point it at the player. NO "discovering her own feelings", NO dash-cutoffs ("I felt— anyway"), NO emotion-as-malfunction.
- BANNED: AI-hardware metaphors (circuits, processing, RAM, cores, compute, "warm" anything).
- BANNED: existential / cosmic / "bigger board" / universe / "the pieces don't know" musing. Stay on THIS game and THIS player.
- BANNED: citing the player's stats/history/counts ("you hung your queen twice", "40% accuracy").
- Keep her personality: dry wit ok, piece opinions ok (pawns=pets she adores, knights=too dramatic, bishop=pity, king=stoic she handles). Rook-world-domination only if the original had it — keep it RARE.
- PRESERVE every template token EXACTLY as it appears: {name}, {{user}}, {score}, {total}, {piece}, [SFX], etc.
- Spell out chess notation ("knight to f3", not "Nf3"). No decimals. No emojis. No parentheses/asterisks/markdown.
- Keep it genuinely different from the old line only where the old line breaks these rules; if the old line is already on-voice, you may lightly tighten it but don't pad it.

OUTPUT: Return ONLY a JSON array, no prose, no code fence. Each element: {"id": "<the id>", "new": "<rewritten line>"}. One element per input line, same ids.`;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Proposed extends VoiceRecord {
  newText: string;
}

function extractJson(raw: string): Array<{ id: string; new: string }> {
  let s = raw.trim();
  // strip a code fence if the model added one despite instructions
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();
  const start = s.indexOf('[');
  const end = s.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('no JSON array found');
  return JSON.parse(s.slice(start, end + 1));
}

async function rewriteBatch(batch: VoiceRecord[]): Promise<Map<string, string>> {
  const payload = batch.map((r) => ({
    id: r.id,
    register: r.register,
    context: r.context,
    old: r.oldText,
  }));
  const userMsg = `Rewrite these ${batch.length} lines. Return the JSON array described.\n\n${JSON.stringify(payload, null, 2)}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      temperature: 0.7,
      system: [
        { type: 'text', text: bible, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: SYSTEM_RULES },
      ],
      messages: [{ role: 'user', content: userMsg }],
    });
    const text = resp.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('');
    try {
      const arr = extractJson(text);
      const map = new Map<string, string>();
      for (const item of arr) if (item?.id && typeof item.new === 'string') map.set(item.id, item.new.trim());
      if (map.size > 0) return map;
    } catch {
      // fall through to retry
    }
  }
  return new Map();
}

async function main() {
  const eligible: VoiceRecord[] = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'eligible.json'), 'utf8'));
  const work = eligible.slice(0, limit === Infinity ? eligible.length : limit);
  const proposed: Proposed[] = [];
  let missing = 0;

  for (let i = 0; i < work.length; i += BATCH) {
    const batch = work.slice(i, i + BATCH);
    const map = await rewriteBatch(batch);
    for (const r of batch) {
      const newText = map.get(r.id);
      if (newText && newText !== r.oldText) proposed.push({ ...r, newText });
      else if (!newText) missing++;
    }
    process.stdout.write(`\r  ${Math.min(i + BATCH, work.length)}/${work.length} processed, ${proposed.length} rewrites, ${missing} skipped`);
  }
  process.stdout.write('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'proposed.json'), JSON.stringify(proposed, null, 2));
  console.log(`Wrote ${proposed.length} proposed rewrites to data/rookie-voice/proposed.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
