#!/usr/bin/env npx tsx
/**
 * Generate Rookie's voiceover for the 10s challenge ad using ElevenLabs.
 * Saves to public/rookie-ad/voice.mp3
 *
 * Usage: npx tsx scripts/generate-rookie-ad-voice.ts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local');
  process.exit(1);
}

const SCRIPT = `Isn't chess supposed to be fun? ...I'm asking genuinely. I'm a rook. I live in a chess app. And I would very much like someone to play with. I should warn you -- I don't handle losing well. At all. But that's... a future problem. Come play me?`;

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'rookie-ad');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'voice.mp3');

async function main() {
  console.log('Generating Rookie ad voiceover...');
  console.log(`Script: "${SCRIPT}"`);
  console.log(`Voice ID: ${ELEVENLABS_VOICE_ID}\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text: SCRIPT,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.45,       // slightly less stable = more expressive
          similarity_boost: 0.78,
          style: 0.35,           // some style exaggeration for the ad
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`ElevenLabs error ${res.status}: ${err}`);
    process.exit(1);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(OUTPUT_FILE, buffer);

  console.log(`Saved to ${OUTPUT_FILE} (${(buffer.length / 1024).toFixed(1)} KB)`);
  console.log('\nTo enable in the ad, uncomment the <Audio> line in RookieAdReel.tsx');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
