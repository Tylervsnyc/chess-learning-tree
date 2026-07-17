/**
 * Generate Rookie voice clips for the Saavedra TEACHING reel — Rookie
 * narrates the position as the storyteller (no "I am the rook" bit).
 * Slower, calmer delivery: no atempo speedup, higher stability.
 *
 * Segment ids intentionally match the POV reel's board choreography
 * (minus thatsme/sorry) so SaavedraReel's STATES/ARROWS apply unchanged.
 *
 * Output: public/remotion/saavedra-teach-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-saavedra-teach-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'saavedra-teach-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'hook1',
    text: 'This is one of the most famous endgame studies in chess. White is down a full rook... and wins.',
  },
  {
    id: 'hook2',
    text: 'It is called the Saavedra position, published in 1895. Here is how it works.',
  },
  {
    id: 'setup1',
    text: 'White has one pawn. Black has a rook. On paper, this should be a draw.',
  },
  {
    id: 'setup2',
    text: 'Black has a simple plan: if the pawn ever promotes, the rook sacrifices itself for it. King against king is a draw.',
  },
  {
    id: 'push',
    text: 'White begins with pawn to c7, one square from promotion. And Black checks.',
  },
  {
    id: 'trap1a',
    text: 'Now White has to be careful. Chase the rook, and it drops all the way to d1. And waits.',
  },
  {
    id: 'trap1b',
    text: 'Promote, and rook c1, check, wins the new queen with a skewer. Draw.',
  },
  {
    id: 'trap2a',
    text: 'Hide beside the pawn instead? Rook d7 pins it against the king. Promoting is now illegal.',
  },
  {
    id: 'walk1',
    text: 'So here is the real idea, and it is the best part of the study. The king walks down the board. King b5. Check.',
  },
  {
    id: 'walk2',
    text: 'Every time the rook checks, the king steps one square lower. b4. b3. Always staying beside the rook, chasing it down the board.',
  },
  {
    id: 'walk3',
    text: 'And then the quiet star move: king c2. The checks are gone. d1 is covered. Every rook trick is off the board. Almost.',
  },
  {
    id: 'master1',
    text: 'Black finds the best defense. Rook d4. A quiet move, with a deep idea behind it.',
  },
  {
    id: 'master2',
    text: 'Because if White promotes to a queen... rook c4, check. The queen must capture. And that is stalemate. Draw.',
  },
  {
    id: 'master3',
    text: 'Black is ready to give up the whole rook for half a point.',
  },
  {
    id: 'betray1',
    text: 'So White promotes to a rook instead. An underpromotion.',
  },
  {
    id: 'betray2',
    text: 'A rook cannot be skewered here. Capturing on c4 is no longer stalemate. And rook a8 threatens checkmate.',
  },
  {
    id: 'end1',
    text: 'Black blocks with rook a4. King b3. Attacking the rook, and threatening mate on c1.',
  },
  {
    id: 'end2',
    text: 'Black cannot defend against both. The rook is lost, and White wins.',
  },
  {
    id: 'kick1',
    text: 'One pawn against a rook... won with a king walk and an underpromotion.',
  },
  {
    id: 'kick2',
    text: 'That is why players have studied this position for one hundred and thirty years.',
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
      file: `remotion/saavedra-teach-voice/${seg.id}.mp3`,
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
