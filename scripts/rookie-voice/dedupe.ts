/**
 * Rookie voice pipeline — DE-DUP pass.
 *
 * The mass re-voice shortened many distinct lines into near-identical twins
 * (different ids, near-same words) — so dedup can't tell them apart and they
 * fire back-to-back. This finds near-duplicate clusters and rewrites the
 * non-canonical ELIGIBLE members to be genuinely different again (frozen
 * mood/sore-loser lines are never touched, and are kept as the canonical).
 *
 * Writes data/rookie-voice/proposed.json (reuse apply.ts to apply).
 *
 * Run: npx tsx scripts/rookie-voice/dedupe.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

import { QUIP_POOL } from '@/lib/quips/quip-pool';
import { AUTHORED_LINES } from '@/lib/speech/line-pool';
import { TOUCHPOINT_LINES } from '@/lib/speech/rookie-touchpoints';
import { isFrozen, describeContext } from '@/lib/speech/voice-register';
import type { SpeechLine } from '@/lib/speech/priority-queue';

dotenv.config({ path: '.env.local' });

const MODEL = 'claude-sonnet-4-6';
const OUT_DIR = path.join(process.cwd(), 'data', 'rookie-voice');
const THRESHOLD = 0.7; // Jaccard word-overlap at/above which two lines are "twins"

const bible = fs.readFileSync(path.join(process.cwd(), '.claude', 'rookie-voice-bible.md'), 'utf8');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const authoredIds = new Set(AUTHORED_LINES.map((l) => l.id));
const touchpointIds = new Set(TOUCHPOINT_LINES.map((l) => l.id));
function sourceFor(id: string): string {
  if (authoredIds.has(id)) return 'lib/speech/line-pool.ts';
  if (touchpointIds.has(id)) return 'lib/speech/rookie-touchpoints.ts';
  return 'lib/quips/quip-pool.ts';
}

const norm = (s: string) => s.toLowerCase().replace(/\{[^}]*\}/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const wordsOf = (s: string) => new Set(norm(s).split(' ').filter(Boolean));
function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = [...a].filter((x) => b.has(x)).length;
  return inter / (a.size + b.size - inter || 1);
}

interface Node { line: SpeechLine; w: Set<string>; }

// Union-find to cluster near-duplicates.
function clusterDupes(nodes: Node[]): number[][] {
  const parent = nodes.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a: number, b: number) => { parent[find(a)] = find(b); };
  for (let i = 0; i < nodes.length; i++) {
    for (let k = i + 1; k < nodes.length; k++) {
      if (Math.abs(nodes[i].w.size - nodes[k].w.size) > 4) continue;
      if (jaccard(nodes[i].w, nodes[k].w) >= THRESHOLD) union(i, k);
    }
  }
  const groups: Record<number, number[]> = {};
  for (let i = 0; i < nodes.length; i++) (groups[find(i)] ??= []).push(i);
  return Object.values(groups).filter((g) => g.length > 1);
}

async function rewriteDistinct(line: SpeechLine, avoid: string[]): Promise<string | null> {
  const sys = `${bible}\n\nYou are de-duplicating Rookie's lines. Rewrite ONE line so it means the same kind of thing for the same moment, but is CLEARLY DIFFERENT in wording from the lines to avoid. Stay fully on-voice: over-invested, encouraging, two short sentences max, no parentheses/asterisks/decimals/emoji, no hardware metaphors or existential musing, preserve any {name}/{{user}}/{score} tokens. Return ONLY the rewritten line text, nothing else.`;
  const user = `Moment/context: ${describeContext(line)}\nCurrent line (a near-duplicate): "${line.text}"\n\nMake it clearly different in wording from ALL of these:\n${avoid.map((a) => `- "${a}"`).join('\n')}\n\nReturn only the new line.`;
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 200,
    temperature: 0.9,
    system: [{ type: 'text', text: sys, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }],
  });
  const text = resp.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('').trim();
  const cleaned = text.replace(/^["'`]|["'`]$/g, '').trim();
  return cleaned && cleaned !== line.text ? cleaned : null;
}

async function main() {
  const nodes: Node[] = QUIP_POOL.map((line) => ({ line, w: wordsOf(line.text) }));
  const clusters = clusterDupes(nodes);
  console.log(`${clusters.length} near-duplicate clusters (>=${THRESHOLD} overlap).`);

  const proposed: Array<{ id: string; sourceFile: string; oldText: string; newText: string; register: string; context: string }> = [];

  for (const cluster of clusters) {
    const members = cluster.map((i) => nodes[i].line);
    // Canonical = a frozen member if present (never rewrite frozen), else the first.
    const frozenMember = members.find((m) => isFrozen(m));
    const canonical = frozenMember ?? members[0];
    const toRewrite = members.filter((m) => m.id !== canonical.id && !isFrozen(m));
    const keptTexts = [canonical.text, ...members.filter((m) => isFrozen(m)).map((m) => m.text)];

    for (const line of toRewrite) {
      const avoid = [...new Set([...keptTexts, ...proposed.filter((p) => cluster.map((i) => nodes[i].line.id).includes(p.id)).map((p) => p.newText)])];
      const newText = await rewriteDistinct(line, avoid);
      if (newText) {
        proposed.push({ id: line.id, sourceFile: sourceFor(line.id), oldText: line.text, newText, register: 'warm', context: describeContext(line) });
        keptTexts.push(newText);
        process.stdout.write(`\r  ${proposed.length} rewrites`);
      }
    }
  }
  process.stdout.write('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'proposed.json'), JSON.stringify(proposed, null, 2));
  console.log(`Wrote ${proposed.length} de-dup rewrites to data/rookie-voice/proposed.json`);
  console.log('Sample:');
  proposed.slice(0, 12).forEach((p) => console.log(`  "${p.oldText}"\n    -> "${p.newText}"`));
}

main().catch((e) => { console.error(e); process.exit(1); });
