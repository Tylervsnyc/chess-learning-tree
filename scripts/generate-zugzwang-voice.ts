/**
 * Generate Rookie voice clips for Chess Path Classics No. 2 — the Gurvich
 * zugzwang study (A. Gurvich, 1959). Verified line: scripts/verify-gurvich-study.ts.
 * Calm teaching read: no atempo speedup, higher stability.
 *
 * Output: public/remotion/zugzwang-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-zugzwang-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'zugzwang-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'hook1',
    text: 'In this study, White does not win by attacking. White wins by taking away every move Black has. It is called zugzwang.',
  },
  {
    id: 'hook2',
    text: 'A. Gurvich composed it in nineteen fifty nine. Watch the trap being built.',
  },
  {
    id: 'm1',
    text: 'White starts with rook c7. Taking is not an option. After king takes, the bishop takes on e8, and White wins easily.',
  },
  {
    id: 'm2',
    text: 'So Black finds the best defense. Rook g8, preparing rook g5. Check. A fork of the king and the bishop.',
  },
  {
    id: 'fake',
    text: 'If the rook simply runs, the fork lands, the bishop falls, and the game is a draw.',
  },
  {
    id: 'm3',
    text: 'Instead, White plays rook c4. A quiet move that seems to ignore the fork completely.',
  },
  {
    id: 'm4',
    text: 'Black takes the bait. Check. And the king calmly steps to e6, giving up the bishop on purpose.',
  },
  {
    id: 'm5',
    text: 'Black wins the bishop... and that is exactly what White wanted.',
  },
  {
    id: 'reveal',
    text: 'Pawn to h4. Now look at that rook. It cannot go down. The pawn is guarded by c4. It cannot go up. Its own pawn is in the way.',
  },
  {
    id: 'cage',
    text: 'And every square on the fifth rank is covered. The pawn. The rook. The king. The pawn again. A perfect cage.',
  },
  {
    id: 'zz',
    text: 'Black\'s pawns cannot move. So only the king can. This is zugzwang. It is your turn, and every move makes things worse.',
  },
  {
    id: 'mate',
    text: 'King e8 is the only square. Rook c8. Checkmate. The buried rook cannot help. Its own pawn seals the file.',
  },
  {
    id: 'kick1',
    text: 'Black spent the whole study hunting that bishop. Capturing it was the trap.',
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
      file: `remotion/zugzwang-voice/${seg.id}.mp3`,
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
