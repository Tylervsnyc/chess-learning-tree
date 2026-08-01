/**
 * Combo Coach voice clips (WORKOUT_COMBO_CALLS) — Rookie's combo calls for
 * the Chess Boxing workout. Atomic per-move clips ("one" … "six", "slip",
 * "roll") so any combo can be composed client-side, plus curriculum teach
 * clips and a few hype lines. Curriculum lives in lib/workout/combo-coach.ts.
 *
 * Output: public/audio/combo-coach/*.mp3
 * Usage:  npx tsx scripts/generate-combo-voice.ts [clipId ...]
 *         (no args = generate everything missing; ids = force-regenerate those)
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'audio', 'combo-coach');

interface Clip {
  id: string;
  text: string;
  /** Punchy call vs calm teaching read. */
  register: 'call' | 'teach';
}

const CLIPS: Clip[] = [
  // Atomic calls — one word, sharp.
  { id: 'one', text: 'One!', register: 'call' },
  { id: 'two', text: 'Two!', register: 'call' },
  { id: 'three', text: 'Three!', register: 'call' },
  { id: 'four', text: 'Four!', register: 'call' },
  { id: 'five', text: 'Five!', register: 'call' },
  { id: 'six', text: 'Six!', register: 'call' },
  { id: 'slip', text: 'Slip!', register: 'call' },
  { id: 'roll', text: 'Roll!', register: 'call' },

  // Round open
  { id: 'handsup', text: 'Hands up. Here we go.', register: 'call' },

  // Occasional hype between combos (short — never blocks the next call)
  { id: 'hype1', text: 'Sharp. Again.', register: 'call' },
  { id: 'hype2', text: 'I would not want to be a heavy bag right now.', register: 'call' },
  { id: 'hype3', text: 'Keep that rhythm.', register: 'call' },

  // Curriculum teach clips (played once, first segment after each unlock)
  {
    id: 'teach-1-2',
    text: 'Boxers number their punches. One is the jab. Lead hand, straight out, snap it back. Two is the cross. Your power hand. I call the numbers, you throw them.',
    register: 'teach',
  },
  {
    id: 'teach-3',
    text: 'New punch. Three is the lead hook. Swing your front hand around, like you are slamming a door.',
    register: 'teach',
  },
  {
    id: 'teach-4',
    text: 'Four is the rear hook. Same door, other hand. Turn your hips into it.',
    register: 'teach',
  },
  {
    id: 'teach-5-6',
    text: 'Five and six are the uppercuts. Lead, then rear. Drop the hand and drive up, like you are lifting a piece off the board.',
    register: 'teach',
  },
  {
    id: 'teach-slip',
    text: 'Defense time. When I say slip, bend your knees and dip your head off the line. A punch you are not there for is a punch that missed.',
    register: 'teach',
  },
  {
    id: 'teach-roll',
    text: 'When I say roll, sink under the punch and come up on the other side. Smooth. Like a rook sliding behind a pawn.',
    register: 'teach',
  },
];

async function generateAudio(text: string, register: Clip['register']): Promise<Buffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings:
        register === 'call'
          ? // Punchy coach call — more energy than the teaching read
            { stability: 0.35, similarity_boost: 0.6, style: 0.6 }
          : // Calm teaching delivery (same as the Classics narration)
            { stability: 0.45, similarity_boost: 0.55, style: 0.45 },
    }),
  });

  if (!res.ok) {
    throw new Error(`ElevenLabs TTS error ${res.status}: ${await res.text()}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!API_KEY || !VOICE_ID) {
    console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const only = process.argv.slice(2);

  for (const clip of CLIPS) {
    const filePath = path.join(OUTPUT_DIR, `${clip.id}.mp3`);
    const forced = only.includes(clip.id);
    if (!forced && only.length === 0 && fs.existsSync(filePath)) {
      console.log(`Exists:     ${clip.id}`);
      continue;
    }
    if (only.length && !forced) continue;
    console.log(`Generating: ${clip.id} — "${clip.text}"`);
    const audio = await generateAudio(clip.text, clip.register);
    fs.writeFileSync(filePath, audio);
  }

  console.log(`Done → ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
