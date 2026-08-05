/**
 * Generate Rookie voice clips for the Opera Game reel.
 * Calls ElevenLabs TTS, saves MP3s, and pre-computes per-frame
 * amplitude data for rook talk animation.
 *
 * Output: public/remotion/opera-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-opera-voice.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;
const FPS = 30;
const SAMPLE_RATE = 44100;

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'opera-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'hook',
    text: 'The Knicks are champions! I am so happy I am showing you my favorite game ever. Watch this.',
  },
  {
    id: 'opening',
    text: 'White builds a whole team. Black just grabs free stuff. Championship habits, people.',
  },
  {
    id: 'sac1',
    text: 'Black pokes the bishop. So Morphy sacrifices the knight!',
  },
  {
    id: 'pin',
    text: 'Bishop takes, check. The knight has to block. Now it is pinned. See the X?',
  },
  {
    id: 'pile',
    text: 'Castle. More heat. Black defends. The rook grabs the knight anyway!',
  },
  {
    id: 'squeeze2',
    text: 'Second rook attacks. Queen trade? Nope. Take with check. Knight recaptures.',
  },
  {
    id: 'findit',
    text: 'This is the moment. Can you find the winning move for White? Pause it now.',
  },
  {
    id: 'queensac',
    text: 'Queen to b8! Goodbye, queen. The door to d8 swings open.',
  },
  {
    id: 'mate',
    text: 'Knight takes. Forced. Rook to d8. Checkmate. Buzzer-beater. The banner goes up.',
  },
  {
    id: 'cta',
    text: 'Finished by a rook. Obviously. Orange and blue, champions forever. Come play me.',
  },
];

async function generateAudio(text: string): Promise<Buffer> {
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
    throw new Error(`ElevenLabs TTS error ${res.status}: ${await res.text()}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

function analyzeAmplitude(mp3Path: string): number[] {
  const rawPath = mp3Path.replace('.mp3', '.raw');

  execSync(
    `ffmpeg -y -i "${mp3Path}" -f f32le -ar ${SAMPLE_RATE} -ac 1 "${rawPath}"`,
    { stdio: 'pipe' },
  );

  const rawData = fs.readFileSync(rawPath);
  const samples = new Float32Array(
    rawData.buffer,
    rawData.byteOffset,
    rawData.byteLength / 4,
  );

  const samplesPerFrame = Math.floor(SAMPLE_RATE / FPS);
  const numFrames = Math.ceil(samples.length / samplesPerFrame);
  const amplitudes: number[] = [];

  let smoothed = 0;
  for (let f = 0; f < numFrames; f++) {
    const start = f * samplesPerFrame;
    const end = Math.min(start + samplesPerFrame, samples.length);

    let sumSq = 0;
    for (let i = start; i < end; i++) {
      sumSq += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sumSq / (end - start));
    const amplified = Math.min(1, rms * 4);

    const diff = amplified - smoothed;
    const rate = diff > 0 ? 0.6 : 0.15;
    smoothed += diff * rate;

    amplitudes.push(Math.round(smoothed * 1000) / 1000);
  }

  fs.unlinkSync(rawPath);

  return amplitudes;
}

async function main() {
  if (!API_KEY || !VOICE_ID) {
    console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const only = process.argv.slice(2);
  const jsonPathExisting = path.join(OUTPUT_DIR, 'voice-data.json');
  const existing: Record<string, unknown> = {};
  if (only.length && fs.existsSync(jsonPathExisting)) {
    for (const seg of JSON.parse(fs.readFileSync(jsonPathExisting, 'utf8')).segments) {
      existing[seg.id] = seg;
    }
  }

  const voiceData: {
    segments: {
      id: string;
      file: string;
      text: string;
      durationFrames: number;
      amplitudes: number[];
    }[];
  } = { segments: [] };

  for (const seg of SEGMENTS) {
    if (only.length && !only.includes(seg.id) && existing[seg.id]) {
      voiceData.segments.push(existing[seg.id] as (typeof voiceData.segments)[number]);
      console.log(`Keeping: ${seg.id}`);
      continue;
    }
    console.log(`Generating: ${seg.id} — "${seg.text}"`);
    const audio = await generateAudio(seg.text);
    const filePath = path.join(OUTPUT_DIR, `${seg.id}.mp3`);
    fs.writeFileSync(filePath, audio);

    // Tighten pacing: 8% faster, pitch preserved
    const fastPath = filePath.replace('.mp3', '.fast.mp3');
    execSync(`ffmpeg -y -i "${filePath}" -filter:a "atempo=1.08" -b:a 192k "${fastPath}"`, { stdio: 'pipe' });
    fs.renameSync(fastPath, filePath);

    const amplitudes = analyzeAmplitude(filePath);
    voiceData.segments.push({
      id: seg.id,
      file: `remotion/opera-voice/${seg.id}.mp3`,
      text: seg.text,
      durationFrames: amplitudes.length,
      amplitudes,
    });
    console.log(`  → ${(amplitudes.length / FPS).toFixed(1)}s`);
  }

  const jsonPath = path.join(OUTPUT_DIR, 'voice-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(voiceData));
  console.log(`\nWrote ${jsonPath}`);
  const totalSec = voiceData.segments.reduce((s, x) => s + x.durationFrames, 0) / FPS;
  console.log(`Total voice: ${totalSec.toFixed(1)}s across ${voiceData.segments.length} segments`);
}

main();
