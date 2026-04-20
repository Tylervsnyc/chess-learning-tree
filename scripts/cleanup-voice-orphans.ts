/**
 * Remove orphan mp3s from Supabase Storage.
 *
 * An orphan here = an mp3 whose hash matches a BROKEN pre-rendered text:
 * specifically, any QUIP_POOL line that contains a non-{name} placeholder
 * ({openingName}, {lessonName}, {score}, {total}, etc.) whose naive
 * strip-and-render produces grammatically broken audio that will never
 * match the real runtime key (runtime substitutes the real value first).
 *
 * Safe by default — conservative scope. Does NOT delete recordings for
 * personalized {name} variants, in-game beat lines, or any fully-rendered
 * text that matches a valid runtime key.
 *
 * Usage:
 *   npx tsx scripts/cleanup-voice-orphans.ts          # dry run
 *   npx tsx scripts/cleanup-voice-orphans.ts --apply  # actually delete
 */

import dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import { QUIP_POOL } from '../lib/quips/quip-pool';
import { renderLine } from '../lib/speech/sanitize';

const BUCKET = 'rookie-voice';
const APPLY = process.argv.includes('--apply');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function textToHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

async function main() {
  // Identify BROKEN pre-rendered texts: QUIP_POOL entries whose text contains
  // a placeholder other than {name}, rendered through the same strip path
  // the prerecord script used.
  const OTHER_PLACEHOLDER = /\{(?!name\})[a-zA-Z_][a-zA-Z0-9_]*\}/;
  const brokenHashes = new Set<string>();
  const brokenSamples: string[] = [];
  for (const line of QUIP_POOL) {
    if (!OTHER_PLACEHOLDER.test(line.text)) continue;
    const rendered = renderLine(line.text, null);
    if (rendered.trim().length === 0) continue;
    const h = textToHash(rendered);
    if (!brokenHashes.has(h)) {
      brokenHashes.add(h);
      if (brokenSamples.length < 10) brokenSamples.push(rendered);
    }
  }

  console.log(`Broken pre-rendered texts (hash count): ${brokenHashes.size}`);
  console.log('First 10 samples:');
  for (const s of brokenSamples) console.log(`  - "${s.slice(0, 80)}"`);

  if (brokenHashes.size === 0) {
    console.log('\nNothing to clean up.');
    return;
  }

  // Convert to filenames
  const filesToDelete = Array.from(brokenHashes).map(h => `${h}.mp3`);

  if (!APPLY) {
    console.log(`\n(dry run — pass --apply to actually delete ${filesToDelete.length} mp3s from Supabase)`);
    return;
  }

  console.log(`\nDeleting ${filesToDelete.length} orphan mp3s from Supabase...`);
  const CHUNK = 100;
  let deleted = 0;
  for (let i = 0; i < filesToDelete.length; i += CHUNK) {
    const slice = filesToDelete.slice(i, i + CHUNK);
    const { data, error } = await supabase.storage.from(BUCKET).remove(slice);
    if (error) console.log(`  Error on chunk ${i}: ${error.message}`);
    else deleted += data?.length || 0;
  }
  console.log(`Supabase: deleted ${deleted}`);
}

main().catch(e => { console.error(e); process.exit(1); });
