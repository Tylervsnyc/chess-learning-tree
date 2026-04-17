/**
 * Remove orphan mp3s from manifest, local disk, and Supabase Storage.
 * An orphan = a manifest key that doesn't match any current AUTHORED_LINES
 * text (template) or Tyler-substituted version.
 *
 * Usage:
 *   npx tsx scripts/cleanup-voice-orphans.ts          # dry run
 *   npx tsx scripts/cleanup-voice-orphans.ts --apply  # actually delete
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { AUTHORED_LINES } from '../lib/speech/line-pool';

const BUCKET = 'rookie-voice';
const MANIFEST_PATH = path.join(__dirname, '..', 'public', 'rookie-voice', 'manifest.json');
const VOICE_DIR = path.join(__dirname, '..', 'public', 'rookie-voice');
const APPLY = process.argv.includes('--apply');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const manifest: Record<string, string> = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  const validKeys = new Set<string>();
  for (const line of AUTHORED_LINES) {
    validKeys.add(line.text);
    if (line.text.includes('{name}')) {
      validKeys.add(line.text.replace(/\{name\}/g, 'Tyler'));
    }
  }

  const orphans: { key: string; file: string }[] = [];
  const kept: Record<string, string> = {};
  for (const [key, file] of Object.entries(manifest)) {
    if (validKeys.has(key)) kept[key] = file;
    else orphans.push({ key, file });
  }

  console.log(`Manifest entries: ${Object.keys(manifest).length}`);
  console.log(`Valid (match current lines): ${Object.keys(kept).length}`);
  console.log(`Orphans: ${orphans.length}\n`);
  console.log('First 5 orphans:');
  for (const o of orphans.slice(0, 5)) console.log(`  - "${o.key.slice(0, 70)}" → ${o.file}`);

  if (!APPLY) {
    console.log('\n(dry run — pass --apply to actually delete)');
    return;
  }

  console.log('\nDeleting...');
  let localDeleted = 0;
  let localMissing = 0;
  for (const o of orphans) {
    const p = path.join(VOICE_DIR, o.file);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      localDeleted++;
    } else {
      localMissing++;
    }
  }
  console.log(`Local: deleted ${localDeleted}, already missing ${localMissing}`);

  const files = orphans.map(o => o.file);
  const CHUNK = 100;
  let remoteDeleted = 0;
  for (let i = 0; i < files.length; i += CHUNK) {
    const slice = files.slice(i, i + CHUNK);
    const { data, error } = await supabase.storage.from(BUCKET).remove(slice);
    if (error) console.log(`  Supabase error on chunk ${i}: ${error.message}`);
    else remoteDeleted += data?.length || 0;
  }
  console.log(`Supabase: deleted ${remoteDeleted}`);

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(kept, null, 2));
  console.log(`Manifest rewritten with ${Object.keys(kept).length} entries.`);
}

main().catch(e => { console.error(e); process.exit(1); });
