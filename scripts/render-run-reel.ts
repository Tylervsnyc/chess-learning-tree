/**
 * Render today's Rookie's Run daily Instagram reel.
 *
 * Pipeline:
 *   1. Resolve today's run via lib/run/daily.ts (or --date override).
 *   2. Build today's first level via DAILY_LEVELS / RUNS.levels.
 *   3. Generate a Rookie VO script + caption from run-reel-script.ts.
 *   4. TTS via ElevenLabs direct API (eleven_turbo_v2_5).
 *   5. Align via ElevenLabs STT scribe_v1 → word-level timings.
 *   6. Drop audio + alignment under public/run-reel/{date}/ so Remotion can
 *      read them with staticFile().
 *   7. Render the Remotion `RookiesRunDailyReel` composition.
 *   8. Write caption.txt + manifest.json next to the MP4.
 *
 * Usage:
 *   npm run reel:run                          # today (UTC)
 *   npm run reel:run -- --date=2026-05-21     # specific date
 *   npm run reel:run -- --skip-voice          # reuse cached voice + align
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { getRunIdForDate } from '../lib/run/daily';
import { RUNS, getRunById } from '../lib/run/runs';
import { buildRunReelScript } from '../remotion/lib/run-reel-script';
import { buildAutoplaySequence } from '../remotion/lib/run-autoplay';
import { FPS } from '../remotion/lib/timing';
import {
  ROOKIES_RUN_REEL_INTRO,
  ROOKIES_RUN_REEL_OUTRO,
} from '../remotion/RookiesRunDailyReel';
import type { Coord } from '../lib/run/types';

dotenv.config({ path: '.env.local' });

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUT_DIR = path.join(ROOT, 'out', 'run-reel');
const ENTRY_POINT = path.join(ROOT, 'remotion', 'index.ts');
const THEME_MUSIC_REL = '/audio/rookies-run-theme.mp3';

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVEN_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

function parseArgs() {
  const out: Record<string, string | boolean> = {};
  for (const arg of process.argv.slice(2)) {
    const kv = arg.match(/^--([\w-]+)(?:=(.+))?$/);
    if (kv) out[kv[1]] = kv[2] ?? true;
  }
  return out;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

async function generateVoice(text: string, outPath: string): Promise<void> {
  if (!ELEVEN_API_KEY || !ELEVEN_VOICE_ID) {
    throw new Error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in env');
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_API_KEY,
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
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs TTS ${res.status}: ${body}`);
  }
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

interface AlignWord {
  word: string;
  start: number;
  end: number;
  type: string;
}
interface AlignResult {
  text: string;
  words: AlignWord[];
  duration: number;
}

async function alignVoice(mp3Path: string): Promise<AlignResult> {
  if (!ELEVEN_API_KEY) {
    throw new Error('Missing ELEVENLABS_API_KEY in env');
  }
  const form = new FormData();
  const audioBlob = new Blob([fs.readFileSync(mp3Path)], { type: 'audio/mpeg' });
  form.append('file', audioBlob, path.basename(mp3Path));
  form.append('model_id', 'scribe_v1');
  form.append('timestamps_granularity', 'word');

  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': ELEVEN_API_KEY },
    body: form,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs STT ${res.status}: ${body}`);
  }
  const data = (await res.json()) as { text?: string; words?: AlignWord[] };
  const words = (data.words ?? []).map((w) => ({
    word: w.word ?? '',
    start: w.start ?? 0,
    end: w.end ?? 0,
    type: w.type ?? 'word',
  }));
  return {
    text: data.text ?? '',
    words,
    duration: words.length > 0 ? words[words.length - 1].end : 0,
  };
}

async function main() {
  const args = parseArgs();
  const date = (args.date as string) || todayUtc();
  const skipVoice = !!args['skip-voice'];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`Invalid --date: ${date}. Expected YYYY-MM-DD.`);
    process.exit(1);
  }

  // ── Resolve today's run ────────────────────────────────────────────
  const runId = getRunIdForDate(date);
  const run = getRunById(runId);
  const totalLevels = run.levels.length;

  // Build level 1 with Rookie centered (file d = 4).
  const rookieStart: Coord = { file: 4, rank: 1 };
  const firstLevel = run.levels[0](rookieStart);

  console.log(`Date:      ${date}`);
  console.log(`Run:       ${run.name} (${run.id})`);
  console.log(`Levels:    ${totalLevels}`);
  console.log(`Pieces:    ${firstLevel.pieces.length}`);
  console.log(`Hazards:   ${firstLevel.hazards?.length ?? 0}`);
  console.log(`MoveLimit: ${firstLevel.moveLimit ?? '∞'}`);

  // ── Script + caption ──────────────────────────────────────────────
  const reel = buildRunReelScript({
    date,
    runId: run.id,
    runName: run.name,
    runBlurb: run.blurb,
    firstLevel,
    totalLevels,
  });

  console.log('\n--- VO script ---');
  console.log(reel.script);
  console.log('--- end ---\n');

  // ── Output dirs ───────────────────────────────────────────────────
  const dayPublic = path.join(PUBLIC_DIR, 'run-reel', date);
  const dayOut = path.join(OUT_DIR, date);
  ensureDir(dayPublic);
  ensureDir(dayOut);

  const voicePath = path.join(dayPublic, 'voice.mp3');
  const alignPath = path.join(dayPublic, 'voice.align.json');

  // ── TTS ───────────────────────────────────────────────────────────
  if (skipVoice && fs.existsSync(voicePath)) {
    console.log(`Skipping TTS (reusing ${voicePath})`);
  } else {
    console.log('Generating Rookie voice via ElevenLabs...');
    await generateVoice(reel.script, voicePath);
  }

  // ── Alignment ─────────────────────────────────────────────────────
  if (skipVoice && fs.existsSync(alignPath)) {
    console.log(`Reusing alignment at ${alignPath}`);
  } else {
    console.log('Aligning voice via ElevenLabs STT...');
    try {
      const align = await alignVoice(voicePath);
      fs.writeFileSync(alignPath, JSON.stringify(align, null, 2));
      console.log(`  ${align.words.length} words, ${align.duration.toFixed(2)}s`);
    } catch (err) {
      console.warn('Alignment failed; continuing without word-level timings:', err);
    }
  }

  // ── Audio duration → total frames ─────────────────────────────────
  let audioSec = reel.estimatedSec;
  if (fs.existsSync(alignPath)) {
    try {
      const align = JSON.parse(fs.readFileSync(alignPath, 'utf-8')) as AlignResult;
      if (align.duration && align.duration > 1) audioSec = align.duration;
    } catch {
      // fall back to estimate
    }
  }

  const talkFrames = Math.ceil(audioSec * FPS) + Math.round(FPS * 0.3); // tail
  const durationFrames =
    ROOKIES_RUN_REEL_INTRO + talkFrames + ROOKIES_RUN_REEL_OUTRO;

  // Rescale segment timings to match the actual TTS audio duration.
  // The script generator estimates at 13 chars/sec but ElevenLabs runs faster.
  const scale = reel.estimatedSec > 0.5 ? audioSec / reel.estimatedSec : 1;
  const scaledSegments = reel.segments.map((s) => ({
    text: s.text,
    startSec: s.startSec * scale,
    endSec: s.endSec * scale,
  }));

  console.log(
    `\nAudio: ${audioSec.toFixed(2)}s (est ${reel.estimatedSec.toFixed(2)}s, scale ${scale.toFixed(2)}x) → ${durationFrames} frames total\n`,
  );

  // ── Theme music check ─────────────────────────────────────────────
  const themePath = path.join(PUBLIC_DIR, THEME_MUSIC_REL.replace(/^\//, ''));
  const themeMusicSrc = fs.existsSync(themePath) ? THEME_MUSIC_REL : undefined;
  if (!themeMusicSrc) {
    console.warn(
      `(note) no theme music found at ${themePath} — rendering without music bed.`,
    );
  }

  // ── Remotion render ───────────────────────────────────────────────
  const inputProps = {
    date,
    runName: run.name,
    audioSrc: `/run-reel/${date}/voice.mp3`,
    alignSrc: fs.existsSync(alignPath)
      ? `/run-reel/${date}/voice.align.json`
      : undefined,
    themeMusicSrc,
    captions: scaledSegments,
    durationFrames,
    pieceCounts: {
      pawn: firstLevel.pieces.filter((p) => p.type === 'pawn').length,
      knight: firstLevel.pieces.filter((p) => p.type === 'knight').length,
      bishop: firstLevel.pieces.filter((p) => p.type === 'bishop').length,
      queen: firstLevel.pieces.filter((p) => p.type === 'queen').length,
    },
    hasHazards: (firstLevel.hazards?.length ?? 0) > 0,
    moveLimit: firstLevel.moveLimit ?? null,
    enemiesPerTurn: firstLevel.enemiesPerTurn ?? null,
    totalLevels,
    autoplay: buildAutoplaySequence(firstLevel, {
      fixedStart: rookieStart,
      maxMoves: 12,
    }),
    hazards: firstLevel.hazards ?? [],
  };

  const outFile = path.join(dayOut, 'reel.mp4');
  const propsJson = JSON.stringify(inputProps).replace(/'/g, "'\\''");

  console.log(`Rendering → ${outFile}`);
  try {
    execSync(
      `npx remotion render ${shellQuote(ENTRY_POINT)} RookiesRunDailyReel ${shellQuote(outFile)} --props='${propsJson}' --config=remotion.config.ts`,
      { stdio: 'inherit', timeout: 600_000 },
    );
  } catch (err) {
    console.error('Remotion render failed:', err);
    process.exit(1);
  }

  // ── Caption + manifest ────────────────────────────────────────────
  const captionFile = path.join(dayOut, 'caption.txt');
  fs.writeFileSync(captionFile, reel.caption);

  const manifest = {
    date,
    runId: run.id,
    runName: run.name,
    script: reel.script,
    estimatedSec: reel.estimatedSec,
    audioSec,
    durationFrames,
    caption: reel.caption,
    outputs: { mp4: outFile, caption: captionFile },
  };
  fs.writeFileSync(
    path.join(dayOut, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
  );

  console.log('\nDone.');
  console.log(`  MP4:      ${outFile}`);
  console.log(`  Caption:  ${captionFile}`);
  console.log(`  Manifest: ${path.join(dayOut, 'manifest.json')}`);
  console.log('\n--- caption preview ---');
  console.log(reel.caption);
}

function shellQuote(s: string): string {
  return `'${s.replace(/'/g, "'\\''")}'`;
}

// Sanity: ensure run set isn't empty.
if (RUNS.length === 0) {
  console.error('No runs defined in lib/run/runs.ts');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
