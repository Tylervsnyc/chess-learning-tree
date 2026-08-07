import { ImageResponse } from 'next/og';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { decode } from 'fast-png';
import { FightNightCard, type FightNightFrame } from '@/lib/og/fight-night';

/**
 * Animated Fight Night share GIF (540x959, 9:16) — the last moves before the
 * final bell play out on the card, checkmate stamp + flashbulbs on the last
 * frame. Node runtime: satori renders each frame to PNG, fast-png decodes,
 * gifenc assembles. Design approved on /test/box-share (2026-08-07).
 *
 * Query params:
 *   f        — repeated, one per frame: "<fen>|<last>|<stamp>"
 *              (last = "h5f7" or empty; stamp = "1" or empty)
 *   outcome / username / rounds / moves / clock — as /api/og/bout
 */

export const maxDuration = 60;

const S = 1.8; // 300x533 design space -> 540x959
const W = Math.round(300 * S);
const H = Math.round(533 * S);
const MOVE_DELAY_MS = 1100;
const END_DELAY_MS = 2600;
const MAX_FRAMES = 8;

function fmtClock(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

function parseFrames(raw: string[]): FightNightFrame[] {
  const frames: FightNightFrame[] = [];
  for (const item of raw.slice(0, MAX_FRAMES)) {
    const [fen, last, stamp] = item.split('|');
    if (!fen || !/^[prnbqkPRNBQK1-8/]+$/.test(fen.split(/\s/)[0])) continue;
    frames.push({
      fen,
      last: last && /^[a-h][1-8][a-h][1-8]$/.test(last) ? last : undefined,
      stamp: stamp === '1',
    });
  }
  return frames;
}

/** fast-png can hand back RGB or RGBA (8 or 16 bit) — gifenc wants 8-bit RGBA. */
function toRGBA(png: ReturnType<typeof decode>): Uint8Array {
  const { width, height, channels, depth } = png;
  const src = depth === 16 ? new Uint8Array(png.data.length) : (png.data as Uint8Array);
  if (depth === 16) {
    const d16 = png.data as Uint16Array;
    for (let i = 0; i < d16.length; i++) src[i] = d16[i] >> 8;
  }
  if (channels === 4) return src;
  const out = new Uint8Array(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    out[p * 4] = src[p * channels];
    out[p * 4 + 1] = src[p * channels + (channels > 2 ? 1 : 0)];
    out[p * 4 + 2] = src[p * channels + (channels > 2 ? 2 : 0)];
    out[p * 4 + 3] = 255;
  }
  return out;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const frames = parseFrames(searchParams.getAll('f'));
  if (frames.length === 0) {
    return new Response('no valid frames', { status: 400 });
  }
  const outcome = searchParams.get('outcome') || 'decision_win';
  const username = (searchParams.get('username') || '').slice(0, 20);
  const rounds = Math.max(0, Math.min(9, parseInt(searchParams.get('rounds') || '0', 10) || 0));
  const moves = Math.max(0, parseInt(searchParams.get('moves') || '0', 10) || 0);
  const clock = fmtClock(Math.max(0, parseInt(searchParams.get('clock') || '0', 10) || 0));

  const gif = GIFEncoder();
  for (let i = 0; i < frames.length; i++) {
    const img = new ImageResponse(
      (
        <FightNightCard
          frame={frames[i]}
          outcome={outcome}
          username={username}
          moves={moves}
          rounds={rounds}
          clock={clock}
          s={S}
          flashSeed={i}
        />
      ),
      { width: W, height: H },
    );
    const rgba = toRGBA(decode(await img.arrayBuffer()));
    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    gif.writeFrame(index, W, H, {
      palette,
      delay: i === frames.length - 1 ? END_DELAY_MS : MOVE_DELAY_MS,
      ...(i === 0 ? { repeat: 0 } : {}),
    });
  }
  gif.finish();

  return new Response(new Uint8Array(gif.bytes()), {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
