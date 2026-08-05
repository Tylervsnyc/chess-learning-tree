/**
 * Generate Rookie voice clips for Chess Path Classics No. 4 — The Immortal Game.
 * Teaching read: calm, no atempo speedup, higher stability (matches ep 1-3).
 *
 * Output: public/remotion/immortal-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-immortal-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'immortal-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  { id: 'hook1', text: 'White is about to give away his queen, both rooks, and a bishop. It ends in checkmate... for White.' },
  { id: 'setup1', text: 'London, eighteen fifty-one. Adolf Anderssen has the white pieces, in a game so famous it earned a name: the Immortal.' },
  { id: 'setup2', text: 'Black keeps grabbing material. Anderssen never stops to take anything back.' },
  { id: 'build1', text: 'He plays for one thing only: every piece pointing at the black king.' },
  { id: 'sac1', text: 'Bishop to d6, ignoring his own rook. Black takes the rook. Anderssen just pushes a pawn.' },
  { id: 'sac2', text: "Now the queen sits in. Black's queen roams to a1 and swallows the other rook, far from home." },
  { id: 'turn1', text: 'Black is up a queen and two rooks. It looks completely lost for White.' },
  { id: 'strike1', text: 'Then the knight strikes. Knight takes g7, and the king is chased to d8.' },
  { id: 'plan1', text: "Now look at what White wants. Bishop to e7 would be checkmate. See how the king is boxed in, every square covered or blocked." },
  { id: 'guard1', text: 'But one piece stops it: the black knight on g8 defends e7. Play the bishop there now, and the knight simply takes it.' },
  { id: 'overload1', text: 'So White overloads that knight. Queen to f6, check. Now it cannot guard e7 and answer the check at the same time.' },
  { id: 'deflect1', text: 'The knight is forced to take the queen. And the moment it moves, e7 is left undefended.' },
  { id: 'mate1', text: 'Bishop e7. Checkmate. The king never had a square to run to.' },
  { id: 'idea1', text: 'That is the real idea here: an overload. The knight had two jobs, and it could only do one.' },
  { id: 'tag1', text: 'A queen and two rooks given away, and the mate built on one overworked knight. That is the Immortal.' },
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
      file: `remotion/immortal-voice/${seg.id}.mp3`,
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
