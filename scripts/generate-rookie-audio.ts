/**
 * Pre-generate Rookie quip audio files using ElevenLabs TTS.
 *
 * Usage: npx tsx scripts/generate-rookie-audio.ts
 *
 * Reads all authored lines from lib/speech/line-pool.ts, generates mp3 files
 * via the shared voice cache (lib/rookie-voice-cache.ts).
 *
 * Safe to re-run — skips files that already exist in cache.
 *
 * Optional: pass common player names to pre-generate personalized quips.
 *   npx tsx scripts/generate-rookie-audio.ts --names Tyler,Alex,Sam
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { AUTHORED_LINES } from '../lib/speech/line-pool';

import {
  lookupVoiceCache,
  generateAndCache,
} from '../lib/rookie-voice-cache';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local');
  process.exit(1);
}

const PIECE_NAMES = ['pawn', 'knight', 'bishop', 'rook', 'queen'];
const DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Expand {piece} and {name} placeholders into concrete strings */
function expandLine(text: string, names: string[]): string[] {
  let variants = [text];

  // Expand {piece}
  if (text.includes('{piece}')) {
    variants = variants.flatMap(v =>
      PIECE_NAMES.map(p => v.replace(/\{piece\}/g, p))
    );
  }

  // Expand {name}
  if (text.includes('{name}')) {
    const nameList = names.length > 0 ? names : ['friend'];
    variants = variants.flatMap(v =>
      nameList.map(n => v.replace(/\{name\}/g, n))
    );
  }

  return variants;
}

function collectAllQuips(names: string[]): string[] {
  const all = AUTHORED_LINES.flatMap(line => expandLine(line.text, names));
  return [...new Set(all)];
}

function parseArgs(): { names: string[] } {
  const idx = process.argv.indexOf('--names');
  if (idx === -1 || !process.argv[idx + 1]) return { names: [] };
  return { names: process.argv[idx + 1].split(',').map(n => n.trim()).filter(Boolean) };
}

async function main() {
  const { names } = parseArgs();

  if (names.length > 0) {
    console.log(`Pre-generating for names: ${names.join(', ')}`);
  }

  const quips = collectAllQuips(names);
  console.log(`Found ${quips.length} unique quips to process.\n`);

  let generated = 0;
  let cached = 0;

  for (let i = 0; i < quips.length; i++) {
    const text = quips[i];
    const label = text.length > 60 ? text.slice(0, 60) + '...' : text;

    const existing = lookupVoiceCache(text);
    if (existing.hit) {
      cached++;
      console.log(`[${i + 1}/${quips.length}] CACHED: ${label}`);
      continue;
    }

    console.log(`[${i + 1}/${quips.length}] GENERATING: ${label}`);

    try {
      await generateAndCache(text, ELEVENLABS_API_KEY!, ELEVENLABS_VOICE_ID!);
      generated++;
    } catch (err) {
      console.error(`  ERROR: ${err}`);
    }

    if (i < quips.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nDone! Generated: ${generated}, Already cached: ${cached}, Total: ${quips.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
