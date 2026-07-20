/**
 * Generate Rookie voice clips for Chess Path Classics No. 3 — the sacrifice
 * cascade study (source reel DZOMdBnIPuQ). Verified: scripts/verify-chosen-one-study.ts.
 * Long-form read per Tyler: revel in the impossibility, show the variations.
 *
 * Output: public/remotion/chosen-one-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-chosen-one-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'chosen-one-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'hook1',
    text: 'This is my favorite kind of endgame study. The kind where every single move looks like a mistake. Take your time with this one. It earns it.',
  },
  {
    id: 'setup',
    text: "Black has the only queen on the board, and the black king is buried on a4. White's idea begins... with a gift.",
  },
  {
    id: 'm1a',
    text: 'Knight takes b6. Check. And a fork. King and queen.',
  },
  {
    id: 'm1b',
    text: 'But the pawn just takes the knight. So White gave up a piece for nothing. Hold that thought.',
  },
  {
    id: 'm2a',
    text: 'Bishop c6. The same fork. King and queen, again. If the queen refuses, she is lost.',
  },
  {
    id: 'm2b',
    text: 'So the queen takes. Two pieces gone, and Black still has the queen. This should be over.',
  },
  {
    id: 'm3a',
    text: 'Now the king steps to e5. And the rook checks from behind it. A discovered check.',
  },
  {
    id: 'm3b',
    text: 'Black slides to b5, out of the rook\'s sight. And honestly? Black looks fine.',
  },
  {
    id: 'm4',
    text: 'Pawn a4. Check. And here is the first small miracle: king c5 is Black\'s only legal move. One square on the entire board.',
  },
  {
    id: 'fortA',
    text: 'Now. White CAN win the queen here. Pawn d4, check. The king steps down. And the pawn pushes on. Discovered check, and the pawn is attacking the queen.',
  },
  {
    id: 'fortB',
    text: 'The queen falls... and it is a draw. Look. The king and the bishop huddle around the pawns, and there is no way in. A fortress. Winning the queen is the wrong prize.',
  },
  {
    id: 'turn',
    text: 'So White ignores the queen... and plays for checkmate. With almost nothing.',
  },
  {
    id: 'm5',
    text: 'Pawn b4. Check. Another gift. And again, taking is Black\'s only legal move.',
  },
  {
    id: 'm6a',
    text: 'White has one piece left. So of course... rook c4. Check.',
  },
  {
    id: 'm6b',
    text: 'The bishop must take. That is three forced moves in a row. Black has had no choices for a while now. Something is very wrong.',
  },
  {
    id: 'cage',
    text: 'Now look at the black king. Pawn, pawn, queen, bishop. Walled in on every side by his own army.',
  },
  {
    id: 'mate',
    text: 'Pawn to d4. Checkmate. Two pawns. That is everything White has left, and it is exactly enough.',
  },
  {
    id: 'kick',
    text: 'Four sacrifices, one fortress dodged, and a king buried by his own pieces. Some positions you solve. This one you frame.',
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
      file: `remotion/chosen-one-voice/${seg.id}.mp3`,
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
