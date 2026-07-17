/**
 * Generate Rookie voice clips for the Saavedra reel — the position told
 * from HER point of view (she is the black rook, and she lost).
 * Calls ElevenLabs TTS, saves MP3s, and pre-computes per-frame
 * amplitude data for rook talk animation.
 *
 * Output: public/remotion/saavedra-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-saavedra-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'saavedra-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'hook1',
    text: 'I need to tell you about the most frustrating game of my entire life.',
  },
  {
    id: 'hook2',
    text: 'I had a draw. A guaranteed draw. Against one pawn. I am still not over it.',
  },
  {
    id: 'thatsme',
    text: 'Wait. See me there? That is me!',
  },
  {
    id: 'sorry',
    text: 'Sorry. Okay. Like I was saying.',
  },
  {
    id: 'setup1',
    text: 'Me, a whole rook, against one little pawn. My job could not be simpler.',
  },
  {
    id: 'setup2',
    text: 'The pawn runs, I throw myself in front of it. Half a point. Rooks are built for this.',
  },
  {
    id: 'push',
    text: 'Pawn to c7. Fine. Check. Obviously.',
  },
  {
    id: 'trap1a',
    text: 'And I had an answer for everything. Chase me? I drop to d1, and I wait.',
  },
  {
    id: 'trap1b',
    text: 'The second that queen appears. Rook c1. Check. Skewer. Goodbye, queen.',
  },
  {
    id: 'trap2a',
    text: 'Hide next to the pawn? I slide to d7. Pin. Promoting is now against the rules.',
  },
  {
    id: 'trap2b',
    text: 'I made queening illegal. You are welcome.',
  },
  {
    id: 'walk1',
    text: 'But this king... walks. I check. He steps down. I check. He steps down.',
  },
  {
    id: 'walk2',
    text: 'Every single step deleted one of my tricks. I hated it. It was beautiful. I hated it.',
  },
  {
    id: 'master1',
    text: 'Fine. My masterpiece. Rook to d4. The quietest move I have ever played.',
  },
  {
    id: 'master2',
    text: 'Go ahead. Make your queen. Rook c4, check. The queen has to take me. Stalemate.',
  },
  {
    id: 'master3',
    text: 'I planned my own funeral, and it was perfect.',
  },
  {
    id: 'betray1',
    text: 'And then... he did not make a queen. He made a rook. A ROOK!',
  },
  {
    id: 'betray2',
    text: 'My whole plan needed a queen. A rook just takes me, and it is not even stalemate. And now a8 is checkmate?!',
  },
  {
    id: 'end1',
    text: 'I blocked on a4. King b3. Attacking me. Threatening mate on c1.',
  },
  {
    id: 'end2',
    text: 'I checked everything twice. There was nothing.',
  },
  {
    id: 'kick1',
    text: 'I played a perfect game, and I lost to the greatest move in chess history.',
  },
  {
    id: 'kick2',
    text: 'And the worst part? It was one of us. I cannot even be mad. I am a little mad.',
  },
  {
    id: 'cta',
    text: 'It has been one hundred and thirty years. Come play me. Chess path dot app.',
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
      file: `remotion/saavedra-voice/${seg.id}.mp3`,
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
