/**
 * Chess Path Classics No. 10 — "King and Rook Checkmate".
 *
 * MODELED ON GothamChess's "How to Checkmate with King and Rook Easily"
 * (TikTok, ~142K likes): cage → squeeze to the edge → "don't check until it's
 * checkmate" → corner mate. Rebuilt in Rookie's voice; no lines reused.
 *
 * Star idea = the BACKWARDS waiting move Rf1 (the rook retreats down the board
 * to lose a tempo) because the immediate Rf8+ hangs the rook (Kxf8 = draw).
 * Full line is Stockfish-perfect; every comp FEN is machine-replayed in
 * scripts/audit-classics-fens.ts.
 *
 * Output: public/remotion/krk-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-krk-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'krk-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'hook1',
    text: 'Can you checkmate with just a king and a rook? It is always a win. Here is the whole method, start to finish.',
  },
  {
    id: 'cage1',
    text: 'Step one: build a cage. The rook cuts the board in half. The black king is trapped on this side and cannot cross the line.',
  },
  {
    id: 'squeeze1',
    text: 'Step two: squeeze. Bring your king up, and keep the rook in front of the enemy king, herding it toward the edge.',
  },
  {
    id: 'push1',
    text: 'Every rook check shoves the king back a rank. And your own king climbs right up alongside it.',
  },
  {
    id: 'push2',
    text: 'One more check, and the king is pinned against the very back rank. Almost there.',
  },
  {
    id: 'corner1',
    text: 'Now bring your king in front, taking the opposition. The black king is forced over into the corner.',
  },
  {
    id: 'trap1',
    text: 'But do not rush. Rook f8 looks like checkmate. Except the king simply takes the rook, and the whole win is gone.',
  },
  {
    id: 'secret1',
    text: 'So here is the secret. Do not check. Send the rook all the way back, rook f1. A quiet waiting move that hands the turn to Black.',
  },
  {
    id: 'secret2',
    text: 'Now the king has nowhere to go but the corner. And this time, the rook is out of its reach.',
  },
  {
    id: 'mate1',
    text: 'The rook comes home. Rook f8. Checkmate.',
  },
  {
    id: 'lesson1',
    text: 'Remember one word: zugzwang. When it is your opponent to move, and every single move makes things worse, you have already won.',
  },
  {
    id: 'cta',
    text: 'Chess Path Classics. Come learn with me at chess path dot app.',
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
        // Calmer, more even teaching delivery than the POV reel
        stability: 0.45,
        similarity_boost: 0.55,
        style: 0.45,
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
    // No atempo speedup — natural pace for the teaching read

    const amplitudes = analyzeAmplitude(filePath);
    voiceData.segments.push({
      id: seg.id,
      file: `remotion/krk-voice/${seg.id}.mp3`,
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
