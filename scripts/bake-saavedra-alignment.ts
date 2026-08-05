/**
 * Bake word-aligned speech envelopes into the Saavedra voice-data files.
 *
 * For each clip: run scripts/voice/align-voice.py (ElevenLabs STT, word
 * timestamps) unless <clip>.mp3.align.json already exists, then compute a
 * per-frame envelope with the same word gate RookieVoicePost uses
 * (60ms attack, hold through the word, 100ms release) and write it as
 * `env` on each segment in voice-data.json.
 *
 * VideoRookie pulses on this envelope — one beat per spoken word — instead
 * of the RMS amplitude track, which reads as noise rather than syllables.
 *
 * Usage: npx tsx scripts/bake-saavedra-alignment.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const FPS = 30;
const VOICE_DIRS = [
  'public/remotion/saavedra-voice',
  'public/remotion/saavedra-teach-voice',
  'public/remotion/zugzwang-voice',
  'public/remotion/chosen-one-voice',
  'public/remotion/immortal-voice',
  'public/remotion/marshall-voice',
  'public/remotion/smothered-voice',
  'public/remotion/legal-voice',
  'public/remotion/century-voice',
  'public/remotion/century2-voice',
  'public/remotion/pawns-destiny-voice',
  'public/remotion/krk-voice',
  'public/remotion/knightmare-voice',
  'public/remotion/hikaru-trap-voice',
];

interface AlignedWord {
  word: string;
  start: number;
  end: number;
  type: string;
}

// Same shape as RookieVoicePost's alignedEnvelope()
function envelopeAt(words: AlignedWord[], t: number): number {
  for (const w of words) {
    if (w.type !== 'word') continue;
    if (t < w.start - 0.04 || t > w.end + 0.12) continue;
    if (t < w.start) return Math.max(0, 1 - (w.start - t) / 0.06);
    if (t < w.end) return 1;
    return Math.max(0, 1 - (t - w.end) / 0.1);
  }
  return 0;
}

const PYTHON = path.join(process.cwd(), 'scripts', 'voice', '.venv', 'bin', 'python');
const ALIGN_PY = path.join(process.cwd(), 'scripts', 'voice', 'align-voice.py');

for (const dir of VOICE_DIRS) {
  const jsonPath = path.join(process.cwd(), dir, 'voice-data.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  for (const seg of data.segments) {
    const mp3 = path.join(process.cwd(), 'public', seg.file);
    const alignPath = `${mp3}.align.json`;

    if (!fs.existsSync(alignPath)) {
      console.log(`Aligning ${seg.file} ...`);
      execSync(`"${PYTHON}" "${ALIGN_PY}" "${mp3}"`, { stdio: 'pipe' });
    }

    const words: AlignedWord[] = JSON.parse(fs.readFileSync(alignPath, 'utf8')).words;
    const env: number[] = [];
    for (let f = 0; f < seg.durationFrames; f++) {
      env.push(Math.round(envelopeAt(words, (f + 0.5) / FPS) * 1000) / 1000);
    }
    seg.env = env;
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data));
  console.log(`Baked env into ${jsonPath} (${data.segments.length} segments)`);
}
