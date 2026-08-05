/**
 * Generate Rookie voice clips for Chess Path Classics — Hikaru's Queen Sacrifice.
 * Game: PotapovaM (2854) vs Hikaru (3406), 3+0 Thursday, chess.com, 2026-07-23.
 * Modeled on @sam_copeland's reel (instagram.com/reels/DbVYClKRYVw): trap ->
 * refutation-of-the-obvious -> exact move order -> quiet horror -> mate. No
 * lines reused. Chess verified by scripts/verify-hikaru-trap.ts (PGN from the
 * chess.com API, game 179133472429).
 *
 * Output: public/remotion/hikaru-trap-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-hikaru-trap-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'hikaru-trap-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  { id: 'hook1', text: 'Hikaru Nakamura just played one of the most beautiful queen sacrifices of the year. And it starts with a move that looks like a mistake.' },
  { id: 'setup1', text: 'Hikaru has black against a two thousand eight hundred rated master. Three-minute blitz. White\'s bishop slides to a6 — and Hikaru sees his chance. Rook c7.' },
  { id: 'bait1', text: 'White pounces. Bishop b6 — pinning the rook against the queen.' },
  { id: 'star1', text: 'And this is the trap. Rook c2. Hikaru sacrifices two pieces with one move — the rook and the queen are both hanging.' },
  { id: 'why1', text: 'Because if the queen takes that rook, queen b6 is check — straight down the long diagonal — and the loose bishop on a6 falls next.' },
  { id: 'accept1', text: 'So White accepts the queen instead. Bishop takes d8.' },
  { id: 'wrong1', text: 'First, an interesting variation. Rook takes g2, check. King h1. Rook d2, discovered check. And knight f3 blocks everything — White would be fine.' },
  { id: 'key1', text: 'Hikaru\'s move order is exact. First, bishop c5. Check.' },
  { id: 'key2', text: 'If the king runs to the corner, bishop takes g2 is checkmate. So White must block with the rook — and Hikaru takes it.' },
  { id: 'calm1', text: 'Count it. Hikaru has given his queen and a knight for one rook — White even grabs another piece, bishop takes f6.' },
  { id: 'storm1', text: 'Rook takes b2 — and look. The bishop on c5 gives a discovered check.' },
  { id: 'run1', text: 'The corner is checkmate again — bishop takes g2. So the king runs the other way. King f1.' },
  { id: 'chase1', text: 'Bishop takes g2 anyway. Check. The king runs to e1, its very last square.' },
  { id: 'mate1', text: 'Bishop to f2. Checkmate. Two bishops and one rook — no queen required.' },
  { id: 'lesson1', text: 'That is the real idea. A discovered check makes one move do two jobs. Every capture Hikaru made was also an attack on the king.' },
  { id: 'tag1', text: 'Nakamura against Potapova, chess dot com blitz, July twenty twenty-six. Maybe the queen sacrifice of the year.' },
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
      file: `remotion/hikaru-trap-voice/${seg.id}.mp3`,
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
