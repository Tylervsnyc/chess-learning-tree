/**
 * Generate Rookie voice clips for Chess Path Classics — The Smothered Mate.
 * Modeled on the proven GothamChess arc (paradox hook, double-check cliffhanger,
 * queen-sac spike, real mate) + our teach-the-logic layer (why the queen dies:
 * to decoy the rook and seal the king's own escape; why only a knight can finish).
 * Teaching read: calm, no atempo speedup, higher stability (matches the series).
 *
 * Output: public/remotion/smothered-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-smothered-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'smothered-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  { id: 'hook1', text: 'This might be the prettiest checkmate in chess. A single knight traps a king using the king\'s own army.' },
  { id: 'setup1', text: 'The black king is tucked safe in the corner, guarded by its own rook and pawns. Watch White take it apart.' },
  { id: 'm1', text: 'Knight to f7. Check. The king has exactly one square: g8.' },
  { id: 'm2', text: 'Knight to h6. And this is a double check, from the knight and the queen at once.' },
  { id: 'teach1', text: 'You cannot block two checks at the same time. So the king must move, and its only square is back to h8.' },
  { id: 'setup2', text: 'The king is almost boxed in. But g8 is still open, one escape hatch left.' },
  { id: 'star1', text: 'So White throws away the queen. Queen to g8, check. The rook is forced to capture it.' },
  { id: 'teach2', text: 'That is the whole idea. The queen dies on purpose, to drag Black\'s own rook onto g8, sealing the last escape.' },
  { id: 'mate1', text: 'Knight to f7. Checkmate. Look: every escape is blocked by Black\'s own pieces.' },
  { id: 'idea1', text: 'This is a smothered mate. A knight\'s check can never be blocked, and boxed in by his own army, the king cannot run.' },
  { id: 'tag1', text: 'A queen thrown away so one knight can finish. One of the most satisfying patterns in all of chess.' },
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
      file: `remotion/smothered-voice/${seg.id}.mp3`,
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
