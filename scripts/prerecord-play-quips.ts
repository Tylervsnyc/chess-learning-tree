/**
 * Pre-record every /play quip via ElevenLabs and cache in Supabase Storage.
 *
 * Populates the `rookie-voice` bucket so there's no first-play delay at runtime.
 *
 * Run: npx tsx scripts/prerecord-play-quips.ts
 *
 * Cache key = MD5(text) + '.mp3'. Matches lib/rookie-voice-cache.ts exactly.
 * Skips items already cached (HEAD/list check — no ElevenLabs call).
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Known dotenv gotcha for this repo — use explicit path, not `import 'dotenv/config'`.
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import {
  winQuips,
  lossQuips,
  levelUpQuips,
  landingQuips,
} from '../data/quips/play-quips';

const BUCKET = 'rookie-voice';

function textToHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const elevenKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  if (!elevenKey || !voiceId) {
    console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Collect unique texts from all exports.
  const texts = new Set<string>();
  for (const q of winQuips) texts.add(q);
  for (const q of lossQuips) texts.add(q);
  for (const q of Object.values(levelUpQuips)) texts.add(q);
  for (const q of landingQuips) texts.add(q.text);

  const all = Array.from(texts);
  console.log(`Found ${all.length} unique quips to process.\n`);

  const start = Date.now();
  let generated = 0;
  let alreadyCached = 0;
  let failed = 0;
  const failures: { text: string; reason: string }[] = [];

  for (let i = 0; i < all.length; i++) {
    const text = all[i];
    const idx = `[${i + 1}/${all.length}]`;
    const hash = textToHash(text);
    const filePath = `${hash}.mp3`;
    const preview = text.length > 60 ? text.slice(0, 57) + '...' : text;

    // Cache check via download (same approach as lookupVoiceCache).
    const { data: existing } = await supabase.storage
      .from(BUCKET)
      .download(filePath);

    if (existing) {
      alreadyCached++;
      console.log(`${idx} - already cached: "${preview}"`);
      continue;
    }

    // Generate via ElevenLabs.
    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': elevenKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5',
            voice_settings: {
              stability: 0.35,
              similarity_boost: 0.55,
              style: 0.55,
            },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`ElevenLabs ${res.status}: ${errText.slice(0, 200)}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, audioBuffer, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Supabase upload: ${uploadError.message}`);
      }

      generated++;
      console.log(`${idx} + cached: "${preview}"`);
    } catch (err) {
      failed++;
      const reason = err instanceof Error ? err.message : String(err);
      failures.push({ text, reason });
      console.log(`${idx} x failed: "${preview}" — ${reason}`);
    }
  }

  const elapsedSec = ((Date.now() - start) / 1000).toFixed(1);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total unique quips: ${all.length}`);
  console.log(`Generated (new):    ${generated}`);
  console.log(`Already cached:     ${alreadyCached}`);
  console.log(`Failed:             ${failed}`);
  console.log(`Elapsed:            ${elapsedSec}s`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const f of failures) {
      console.log(`  - "${f.text.slice(0, 60)}" :: ${f.reason}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
