/**
 * Generate Rookie voice clips for Chess Path Classics — The Two Knights.
 * Modeled on @pietrocheckmate's "Knightmare." (instagram.com/reels/DY6tklioZID,
 * 40.7K likes): fake-out before every payoff, rule taught mid-story, the
 * emotional beat on the defender's realization. Structure adapted, no lines
 * reused. Chess verified by scripts/verify-knightmare.ts.
 *
 * Output: public/remotion/knightmare-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-knightmare-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'knightmare-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  { id: 'hook1', text: 'Two knights alone can never force checkmate. It is a dead draw. So how does Black win this game with exactly two knights?' },
  { id: 'setup1', text: 'White is one move from a brand-new queen. Black cannot stop the pawn. So Black attacks the king instead. Knight to c7. Check.' },
  { id: 'chase1', text: 'The king steps to b8. And the same knight comes back around. Knight a6. Check again.' },
  { id: 'fork1', text: 'Now the king must choose. Hide in the corner, or run out into the open.' },
  { id: 'trap1', text: 'The corner loses on the spot. Knight b6 — checkmate. The knights seal the dark squares, and the king\'s own army blocks the rest.' },
  { id: 'reset1', text: 'So the king runs. King c8. And now White really is about to queen — and it looks like the attack has failed.' },
  { id: 'dream1', text: 'Black dreams of knight b6, check, trapping the king again. But look. The king would simply slip away to d8. The net has a hole.' },
  { id: 'star1', text: 'So Black plays the quiet star move. King e8. No check. No capture. Just one small king step.' },
  { id: 'teach1', text: 'That step closes the net. The black king now guards d8 and d7 himself. Knight b6 would be checkmate — so the pawn is frozen.' },
  { id: 'trap2', text: 'If White queens anyway — knight b6. Checkmate. The brand-new queen watches from the corner. She never gets to move.' },
  { id: 'twist1', text: 'But White finds the only defense on the board. The pawn becomes a knight — the one piece that covers b6.' },
  { id: 'zug1', text: 'Two knights against two knights. Saved? No. Black plays king e7 — and White is in zugzwang. Every legal move loses.' },
  { id: 'zug2', text: 'Move the new knight — knight b6 is mate. Move the old one — knight d6 is mate. Six legal moves. Six checkmates.' },
  { id: 'lesson1', text: 'That is the real idea. Two knights cannot chase a king down. But they can build a cage — and let zugzwang finish the job.' },
  { id: 'tag1', text: 'A queen stopped by one quiet king step, and a knight born straight into zugzwang. A little masterpiece.' },
  { id: 'cta', text: 'Chess Path Classics. Come learn with me at chess path dot app.' },
];

async function generateAudio(text: string): Promise<Buffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: { stability: 0.45, similarity_boost: 0.55, style: 0.45 },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs TTS error ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

function analyzeAmplitude(mp3Path: string): number[] {
  const rawPath = mp3Path.replace('.mp3', '.raw');
  execSync(`ffmpeg -y -i "${mp3Path}" -f f32le -ar ${SAMPLE_RATE} -ac 1 "${rawPath}"`, { stdio: 'pipe' });
  const rawData = fs.readFileSync(rawPath);
  const samples = new Float32Array(rawData.buffer, rawData.byteOffset, rawData.byteLength / 4);
  const samplesPerFrame = Math.floor(SAMPLE_RATE / FPS);
  const numFrames = Math.ceil(samples.length / samplesPerFrame);
  const amplitudes: number[] = [];
  let smoothed = 0;
  for (let f = 0; f < numFrames; f++) {
    const start = f * samplesPerFrame;
    const end = Math.min(start + samplesPerFrame, samples.length);
    let sumSq = 0;
    for (let i = start; i < end; i++) sumSq += samples[i] * samples[i];
    const rms = Math.sqrt(sumSq / (end - start));
    const amplified = Math.min(1, rms * 4);
    const diff = amplified - smoothed;
    smoothed += diff * (diff > 0 ? 0.6 : 0.15);
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
    for (const seg of JSON.parse(fs.readFileSync(jsonPathExisting, 'utf8')).segments) existing[seg.id] = seg;
  }

  const voiceData: { segments: { id: string; file: string; text: string; durationFrames: number; amplitudes: number[] }[] } = { segments: [] };

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
    const amplitudes = analyzeAmplitude(filePath);
    voiceData.segments.push({
      id: seg.id,
      file: `remotion/knightmare-voice/${seg.id}.mp3`,
      text: seg.text,
      durationFrames: amplitudes.length,
      amplitudes,
    });
    console.log(`  → ${(amplitudes.length / FPS).toFixed(1)}s`);
  }

  const jsonPath = path.join(OUTPUT_DIR, 'voice-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(voiceData));
  const totalSec = voiceData.segments.reduce((s, x) => s + x.durationFrames, 0) / FPS;
  console.log(`\nWrote ${jsonPath}\nTotal voice: ${totalSec.toFixed(1)}s across ${voiceData.segments.length} segments`);
}

main();
