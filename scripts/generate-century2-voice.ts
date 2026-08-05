/**
 * Generate Rookie voice clips for Chess Path Classics No. 7, PART 2 —
 * The Game of the Century (Donald Byrne vs Bobby Fischer, New York 1956).
 *
 * Part 1 covered the queen offer + the windmill (ends at 23...axb6). Part 2
 * covers the REST of the game: Fischer converts the extra material (moves 24-34,
 * compressed) and then hunts the white king across the board with a mating net
 * (35...Bc5+ ... 41...Rc2#). Star idea: the MATING NET — two bishops and a
 * knight take away every escape square so a lone rook can deliver mate.
 *
 * Professional/measured teaching register. NO atempo speedup. Captions use
 * square notation ("c5", "f1") per Tyler's rule — squares read fine in TTS.
 *
 * Output: public/remotion/century2-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-century2-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'century2-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'recap1',
    text: 'Part one: Fischer offered his queen, and a windmill won him a rook, two bishops, and a pawn.',
  },
  {
    id: 'recap2',
    text: 'He is completely winning. But winning is not finishing. Watch how Fischer ends it.',
  },
  {
    id: 'consolidate1',
    text: 'First, the technique. Fischer trades pieces and takes pawns, converting his edge into a clean, winning position.',
  },
  {
    id: 'turn1',
    text: 'Soon White has only a lonely king on the kingside. Now Fischer turns to hunt it.',
  },
  {
    id: 'net_intro',
    text: 'Here is the star idea: a mating net. Two bishops and a knight take away every escape square.',
  },
  {
    id: 'hunt1',
    text: 'Bishop to c5, check. The king steps to f1.',
  },
  {
    id: 'hunt2',
    text: 'Knight to g3, check. The king walks to e1.',
  },
  {
    id: 'hunt3',
    text: 'Bishop to b4, check. The king is pushed to d1.',
  },
  {
    id: 'hunt4',
    text: 'Bishop to b3, check. The king slides to c1.',
  },
  {
    id: 'hunt5',
    text: 'Knight to e2, then to c3, checking again. The king is boxed into the corner.',
  },
  {
    id: 'net1',
    text: 'Look at the corner. The knight covers b1 and d1. Only the second rank is still open.',
  },
  {
    id: 'mate1',
    text: 'Rook to c2. Checkmate. The rook seals the last squares while the knight guards the rest.',
  },
  {
    id: 'tag1',
    text: 'One queen, given up on purpose, twenty-four moves earlier. It was never a gamble. The Game of the Century.',
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
      file: `remotion/century2-voice/${seg.id}.mp3`,
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
