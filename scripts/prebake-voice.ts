/**
 * Pre-generate and cache TTS for all authored lines.
 *
 * Generates audio for each line with {name} = "Tyler" AND the raw template,
 * then uploads to Supabase Storage + updates the local manifest.
 *
 * Usage: npx tsx scripts/prebake-voice.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { AUTHORED_LINES } from '../lib/speech/line-pool';

const BUCKET = 'rookie-voice';
const MANIFEST_PATH = path.join(__dirname, '..', 'public', 'rookie-voice', 'manifest.json');
const VOICE_DIR = path.join(__dirname, '..', 'public', 'rookie-voice');

const API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!API_KEY || !VOICE_ID) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function textToHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

// Rate limiting — ElevenLabs has limits
const DELAY_MS = 500;
const MAX_RETRIES = 3;
const retries = new Map<number, number>();
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function generateTTS(text: string): Promise<Buffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
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
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${body}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  // Expand each line into the text(s) the runtime will actually speak.
  // SFX lines like "Hi. [SFX] Bye." are split by useRookieQuipQueue and
  // speakQuip is called on each half — cache the halves, NEVER the full
  // string (TTS would literally say "open bracket S F X close bracket").
  const expandLine = (raw: string): string[] => {
    if (!raw.includes('[SFX]')) return [raw];
    return raw
      .split('[SFX]')
      .map(s => s.trim())
      .filter(Boolean);
  };

  const templates: string[] = AUTHORED_LINES.flatMap(l => expandLine(l.text));

  console.log(`Found ${AUTHORED_LINES.length} authored lines (${templates.length} after [SFX] expansion)`);

  // Load existing manifest
  let manifest: Record<string, string> = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  }

  // Build list of texts to generate:
  // 1. Template text (for voiceKey lookup)
  // 2. "Tyler" substituted version (for direct text lookup)
  const toGenerate: { text: string; label: string }[] = [];

  for (const tmpl of templates) {
    // Template version
    if (!manifest[tmpl]) {
      toGenerate.push({ text: tmpl, label: `template` });
    }

    // Tyler version
    if (tmpl.includes('{name}')) {
      const tyler = tmpl.replace(/\{name\}/g, 'Tyler');
      if (!manifest[tyler]) {
        toGenerate.push({ text: tyler, label: `tyler` });
      }
    }
  }

  console.log(`Already cached: ${templates.length * 2 - toGenerate.length}`);
  console.log(`Need to generate: ${toGenerate.length}`);

  if (toGenerate.length === 0) {
    console.log('Nothing to do!');
    return;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < toGenerate.length; i++) {
    const { text, label } = toGenerate[i];
    const hash = textToHash(text);
    const filename = `${hash}.mp3`;

    process.stdout.write(`[${i + 1}/${toGenerate.length}] (${label}) ${text.slice(0, 50)}...`);

    try {
      const audioBuffer = await generateTTS(text);

      // Save locally
      const localPath = path.join(VOICE_DIR, filename);
      fs.writeFileSync(localPath, audioBuffer);

      // Upload to Supabase
      await supabase.storage
        .from(BUCKET)
        .upload(filename, audioBuffer, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      // Update manifest
      manifest[text] = filename;

      success++;
      console.log(` OK (${(audioBuffer.length / 1024).toFixed(1)}KB)`);
    } catch (err: unknown) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(` FAILED: ${msg.slice(0, 80)}`);

      // If rate limited, retry with exponential backoff (cap at MAX_RETRIES)
      if (msg.includes('429')) {
        const n = (retries.get(i) ?? 0) + 1;
        if (n > MAX_RETRIES) {
          console.log(`  Rate limited ${MAX_RETRIES}x, giving up on this line.`);
        } else {
          retries.set(i, n);
          const backoff = 10000 * Math.pow(2, n - 1);
          console.log(`  Rate limited, waiting ${backoff / 1000}s (retry ${n}/${MAX_RETRIES})...`);
          await sleep(backoff);
          i--;
          failed--;
          continue;
        }
      }
    }

    await sleep(DELAY_MS);

    // Save manifest every 20 lines in case of crash
    if (success % 20 === 0) {
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    }
  }

  // Final save
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\nDone! ${success} generated, ${failed} failed.`);
  console.log(`Manifest now has ${Object.keys(manifest).length} entries.`);
}

main().catch(console.error);
