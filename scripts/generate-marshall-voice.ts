/**
 * Generate Rookie voice clips for Chess Path Classics No. 5 — Marshall's Golden Queen.
 * Teaching read: calm, no atempo speedup, higher stability (matches ep 1-4).
 * Logic-first: each of the three captures is refuted ON the board, then the
 * underlying idea (queen + knight cover every escape) is named.
 *
 * Output: public/remotion/marshall-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-marshall-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'marshall-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  { id: 'hook1', text: 'Black puts his queen on a square three white pieces can capture. Every single capture loses.' },
  { id: 'setup1', text: 'Breslau, nineteen twelve. Frank Marshall, playing Black, has spent the whole game hunting the white king.' },
  { id: 'context1', text: 'He smashes a rook into h3, tearing open the cover. White swings a rook to c5, attacking Marshall\'s queen.' },
  { id: 'setup2', text: 'Everyone expects the queen to retreat. Instead, it charges forward. Queen to g3, defended by nothing.' },
  { id: 'q1', text: 'Three pieces can take it: the h-pawn, the f-pawn, or the queen. Watch what happens with each.' },
  { id: 'refA', text: 'If the h-pawn takes, the knight jumps to e2. Checkmate. The king is trapped in the corner by its own pieces.' },
  { id: 'refB', text: 'If the f-pawn takes instead: knight e2, check. The king hides on h1, and the rook slams down. Checkmate again.' },
  { id: 'refC', text: 'And if the queen takes? Knight e2 forks the king and the queen at once. Black wins the queen back, and the game.' },
  { id: 'idea1', text: 'That is the point of the sacrifice. It was never about the queen. From g3, she and the knight cover every escape the king has.' },
  { id: 'turn1', text: 'Three captures, three disasters. White had nothing left to try, and resigned.' },
  { id: 'legend1', text: 'As the story goes, the crowd was so stunned they showered the board with gold coins.' },
  { id: 'tag1', text: 'One move, offered three ways, unbeatable every way. The golden queen.' },
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
      file: `remotion/marshall-voice/${seg.id}.mp3`,
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
