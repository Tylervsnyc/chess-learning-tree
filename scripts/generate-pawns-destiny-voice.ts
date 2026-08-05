/**
 * Chess Path Classics No. 8 — "Pawns of Destiny": Rookie narrates the study
 * where two pawns beat a rook by a king walk across the whole board.
 * Slower, calmer teaching delivery: no atempo speedup, higher stability.
 *
 * Line verified tablebase-perfect (Lichess 5-piece tablebase) and against
 * @pietrocheckmate's reel; every comp FEN is machine-replayed in
 * scripts/audit-classics-fens.ts.
 *
 * Output: public/remotion/pawns-destiny-voice/*.mp3 + voice-data.json
 * Usage: npx tsx scripts/generate-pawns-destiny-voice.ts [segmentId ...]
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

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'remotion', 'pawns-destiny-voice');

interface VoiceSegment {
  id: string;
  text: string;
}

const SEGMENTS: VoiceSegment[] = [
  {
    id: 'hook1',
    text: 'Two little pawns, taking on a whole rook. What comes next is pure magic. A win, conjured out of thin air.',
  },
  {
    id: 'setup1',
    text: 'Look at this a-pawn, racing to promote. White pushes it to a7. Now it is one single square from a new queen.',
  },
  {
    id: 'climb1',
    text: 'Black checks. The king steps up to escape, because stepping back down just repeats the position, and a repeat is a draw.',
  },
  {
    id: 'climb2',
    text: 'So retreating is out. Black checks again, the king climbs again. Same story, one rank higher.',
  },
  {
    id: 'clever1',
    text: 'Black has a trick too. King to b1, quietly setting a trap.',
  },
  {
    id: 'skewer1',
    text: 'Because now, why not simply make a queen? a8.',
  },
  {
    id: 'skewer2',
    text: 'The rook slides to a2. A skewer. The king has to dodge, and the brand new queen is gone.',
  },
  {
    id: 'push1',
    text: 'So White does not queen. He runs up the second pawn. h7. Now both pawns are one step from the crown.',
  },
  {
    id: 'rule1',
    text: 'Black checks forever. So here is the rule that wins. The king walks the edge, but it can never step toward the center.',
  },
  {
    id: 'rule2',
    text: 'Watch why. Say White steps toward the center, king to c3. Black checks on c2. The king runs to d3, and the rook swings up to c8. From there, one rook guards both queening squares. That is a draw.',
  },
  {
    id: 'walk1',
    text: 'So the king zig-zags up the a and b files, slipping past every check.',
  },
  {
    id: 'pivot1',
    text: 'Until the move this whole study is famous for. King to d7.',
  },
  {
    id: 'poison1',
    text: 'Now the king simply strolls away from its own a-pawn, left completely undefended.',
  },
  {
    id: 'poison2',
    text: 'But Black does not dare chase it. Stop checking for even one move, and this h-pawn queens. So the checks have to keep coming.',
  },
  {
    id: 'march1',
    text: 'So Black is trapped. Keep checking, and let the king march clean across the board.',
  },
  {
    id: 'finish1',
    text: 'And over here, the Black king is too far away to help. The checks finally run dry.',
  },
  {
    id: 'finish2',
    text: 'Out of checks at last, Black finally grabs the a-pawn. But that frees the other one. h8, a new queen, and White wins.',
  },
  {
    id: 'lesson',
    text: 'Two pawns, one rook, and a king that crossed the whole board. The king was the hero all along.',
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
      file: `remotion/pawns-destiny-voice/${seg.id}.mp3`,
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
