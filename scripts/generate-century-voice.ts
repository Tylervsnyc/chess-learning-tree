/**
 * Generate Rookie voice clips for Chess Path Classics No. 7 —
 * The Game of the Century (Donald Byrne vs Bobby Fischer, New York 1956).
 * Rookie narrates the position as the storyteller (professional/measured
 * teaching register). Slower, calmer delivery: no atempo speedup.
 *
 * Star idea: the windmill — a repeating discovered check. Fischer offers his
 * queen (17...Be6), and the bishop on c4 then pins the white king to a
 * diagonal while the knight shuttles, grabbing material with each spin.
 * NOTE: the queen offer is objectively winning, NOT a gamble; the mate itself
 * comes 24 moves later — this reel ends on the winning material, not the mate.
 *
 * Output: public/remotion/century-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-century-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'century-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'hook1',
    text: 'A thirteen-year-old is about to hand a grandmaster his queen. On purpose.',
  },
  {
    id: 'setup1',
    text: 'New York, nineteen fifty-six. Bobby Fischer, thirteen, has the black pieces.',
  },
  {
    id: 'setup2',
    text: 'This game earned its own name: the Game of the Century.',
  },
  {
    id: 'attack1',
    text: 'White has just played bishop to c5, attacking Fischer’s queen on b6.',
  },
  {
    id: 'check1',
    text: 'The queen is under attack. The obvious move is to save it.',
  },
  {
    id: 'check2',
    text: 'Fischer checks first with the rook, and the king steps to f1. The queen is still hanging.',
  },
  {
    id: 'offer1',
    text: 'Then the surprise. Instead of moving the queen, Fischer plays bishop to e6, and simply lets White take it.',
  },
  {
    id: 'offer2',
    text: 'You can imagine White’s surprise. He can win the queen for only a bishop.',
  },
  {
    id: 'take1',
    text: 'So White takes. Bishop captures the queen on b6. And the machine starts turning.',
  },
  {
    id: 'take2',
    text: 'Bishop takes c4, check. The white king runs to the corner.',
  },
  {
    id: 'windmill1',
    text: 'This is a windmill. The knight checks, the king steps to f1, straight onto the bishop diagonal.',
  },
  {
    id: 'windmill2',
    text: 'The knight slides away, and the discovered check strikes. On the way it grabs the pawn on d4.',
  },
  {
    id: 'windmill3',
    text: 'Knight back, check. King back to f1. The knight jumps again, another discovered check.',
  },
  {
    id: 'windmill4',
    text: 'Every turn the king is in check, and it can never capture the knight. It just shuttles, taking as it goes.',
  },
  {
    id: 'idea1',
    text: 'That is the windmill: a discovered check that repeats. The bishop holds the king in place while the knight harvests the board.',
  },
  {
    id: 'resolve1',
    text: 'When Fischer stops, he takes the bishop back too. For one queen, he has won two bishops and a pawn.',
  },
  {
    id: 'resolve2',
    text: 'He is completely winning. It was never a gamble. Fischer had counted the material before he gave the queen.',
  },
  {
    id: 'tag1',
    text: 'Thirteen years old, a queen offered on purpose, a masterpiece. The Game of the Century.',
  },
  {
    id: 'tease1',
    text: 'Tomorrow, in part two: how Fischer turned this into checkmate. Follow Chess Path so you don’t miss it.',
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
      file: `remotion/century-voice/${seg.id}.mp3`,
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
