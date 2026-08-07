/**
 * On-device Fight Night share GIF — draws the same card as the server routes
 * (lib/og/fight-night.tsx) on a canvas and encodes with gifenc, so a share
 * takes ~a second of local CPU instead of ~40s of serverless satori renders.
 *
 * Import this module lazily (dynamic import at the result screen) — it pulls
 * the 56KB piece-sprite module and must never ride in a page bundle.
 *
 * Design parity: all geometry/colors come from lib/og/fight-night-data (the
 * 300x533 design space at scale S) — if you change the card, change it there
 * so satori and canvas stay identical.
 */

import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { PIECE_DATA_URIS } from '@/lib/og/chess-pieces';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';
import { BOARD_COLORS } from '@/lib/puzzle-utils';
import {
  CROWD_ROWS,
  END_TICKS,
  END_TICK_MS,
  HEADLINES,
  MOVE_TICKS,
  MOVE_TICK_MS,
  crowdJitter,
  lastSquares,
  parseBoard,
  pieceCode,
  tickFlashes,
  type FightNightBout,
  type FightNightFrame,
} from '@/lib/og/fight-night-data';

const S = 1.8;
const W = Math.round(300 * S);
const H = Math.round(533 * S);
const FONT = '"DM Sans", system-ui, -apple-system, sans-serif';

type Ctx = CanvasRenderingContext2D;

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

let pieceCache: Promise<Record<string, HTMLImageElement>> | null = null;
function loadPieces(): Promise<Record<string, HTMLImageElement>> {
  pieceCache ??= Promise.all(
    Object.entries(PIECE_DATA_URIS).map(
      ([code, uri]) =>
        new Promise<[string, HTMLImageElement]>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve([code, img]);
          img.onerror = () => reject(new Error(`piece ${code}`));
          img.src = uri;
        }),
    ),
  ).then(Object.fromEntries);
  return pieceCache;
}

/* ── layers ── */

function drawCrowdBand(ctx: Ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 300 * S, 150 * S);
  ctx.clip();

  const glow = ctx.createLinearGradient(0, 0, 0, 150 * S);
  glow.addColorStop(0, 'rgba(63,78,120,0.46)');
  glow.addColorStop(0.45, 'rgba(52,66,105,0.35)');
  glow.addColorStop(0.78, 'rgba(40,52,86,0.22)');
  glow.addColorStop(1, 'rgba(19,26,46,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 300 * S, 150 * S);

  // gold spotlight
  ctx.fillStyle = 'rgba(246,196,69,0.12)';
  ctx.beginPath();
  ctx.ellipse(150 * S, 20 * S, 120 * S, 80 * S, 0, 0, Math.PI * 2);
  ctx.fill();

  CROWD_ROWS.forEach((row, ri) => {
    ctx.fillStyle = row.fill;
    for (let x = row.off - row.sp, i = 0; x <= 300 + row.sp; x += row.sp, i++) {
      const { dx, dy } = crowdJitter(i, ri);
      const jx = (x + dx) * S;
      const jy = (row.y + dy) * S;
      ctx.globalAlpha = row.op;
      ctx.beginPath();
      ctx.arc(jx, jy, row.r * S, 0, Math.PI * 2);
      ctx.fill();
      rr(ctx, jx - row.r * 1.2 * S, jy + row.r * 0.75 * S, row.r * 2.4 * S, row.r * 2.2 * S, row.r * 0.9 * S);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;

  const fade = ctx.createLinearGradient(0, 100 * S, 0, 150 * S);
  fade.addColorStop(0, 'rgba(19,26,46,0)');
  fade.addColorStop(1, '#131a2e');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 100 * S, 300 * S, 50 * S);
  ctx.restore();
}

function drawFlashes(ctx: Ctx, seed: number, lit: boolean) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 300 * S, 150 * S);
  ctx.clip();
  for (const f of tickFlashes(seed, lit)) {
    ctx.save();
    ctx.shadowColor = `rgba(255,255,255,${lit ? 0.65 : 0.5})`;
    ctx.shadowBlur = (lit ? 11 : 8) * S;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.arc(f.x * S, f.y * S, (f.size / 2) * S, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawBrand(ctx: Ctx) {
  const bs = 7 * S;
  const gap = bs * 1.16;
  const logoW = 4 * gap + bs;
  const logoH = 5 * gap + bs;
  // centered pair: logo + text block (approx widths tuned to satori output)
  const textW = 118 * S;
  const totalW = logoW + 8 * S + textW;
  const x0 = (300 * S - totalW) / 2;
  const y0 = 16 * S + (34 * S - logoH) / 2;
  for (const b of ROOK_BLOCKS) {
    ctx.fillStyle = b.color;
    rr(ctx, x0 + b.x * gap, y0 + b.y * gap, bs, bs, bs * 0.2);
    ctx.fill();
  }
  const tx = x0 + logoW + 8 * S;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 ${17 * S}px ${FONT}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Chess Boxing', tx, 16 * S + 16 * S);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `700 ${8.5 * S}px ${FONT}`;
  drawTracked(ctx, 'FIGHT NIGHT', tx, 16 * S + 27 * S, 0.18 * 8.5 * S);
}

/** Letter-spaced text (canvas has no letter-spacing in all engines). */
function drawTracked(ctx: Ctx, text: string, x: number, y: number, track: number) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + track;
  }
}

function drawTrackedCentered(ctx: Ctx, text: string, cxr: number, y: number, track: number) {
  let w = -track;
  for (const ch of text) w += ctx.measureText(ch).width + track;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  drawTracked(ctx, text, cxr - w / 2, y, track);
  ctx.textAlign = prev;
}

function drawTape(ctx: Ctx, username: string) {
  const y = 62 * S;
  const h = 34 * S;
  const gapX = 8 * S;
  const w = (300 * S - 32 * S - gapX) / 2;
  const corners: { x: number; name: string; tag: string; bg: string; border: string; shadow: string; tagColor: string }[] = [
    { x: 16 * S, name: username || 'You', tag: 'RED CORNER', bg: '#FF4B4B', border: '#e86060', shadow: '#CC3939', tagColor: '#ffd7a1' },
    { x: 16 * S + w + gapX, name: 'Rookie', tag: 'BLUE CORNER', bg: '#1CB0F6', border: '#54c2f8', shadow: '#0d7ec4', tagColor: '#d8f1ff' },
  ];
  for (const c of corners) {
    ctx.fillStyle = c.shadow;
    rr(ctx, c.x, y + 4 * S, w, h, 12 * S);
    ctx.fill();
    ctx.fillStyle = c.bg;
    rr(ctx, c.x, y, w, h, 12 * S);
    ctx.fill();
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 2 * S;
    rr(ctx, c.x + S, y + S, w - 2 * S, h - 2 * S, 11 * S);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${13 * S}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(c.name.toUpperCase(), c.x + w / 2, y + 15 * S);
    ctx.fillStyle = c.tagColor;
    ctx.font = `900 ${8 * S}px ${FONT}`;
    drawTrackedCentered(ctx, c.tag, c.x + w / 2, y + 27 * S, 0.14 * 8 * S);
  }
  // VS coin
  const cx = 150 * S;
  const cy = y + h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-8 * Math.PI) / 180);
  ctx.fillStyle = '#8a6508';
  ctx.beginPath();
  ctx.arc(0, 3 * S, 17 * S, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f6c445';
  ctx.beginPath();
  ctx.arc(0, 0, 17 * S, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 3 * S;
  ctx.beginPath();
  ctx.arc(0, 0, 15.5 * S, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#3d2e00';
  ctx.font = `900 ${12 * S}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('VS', 0, 4 * S);
  ctx.restore();
}

const SQ = Math.round((252 * S) / 8);
const BOARD_W = SQ * 8;
const BOARD_X = Math.round((300 * S - BOARD_W) / 2);
const BOARD_Y = Math.round(112 * S);

function drawBoard(
  ctx: Ctx,
  pieces: Record<string, HTMLImageElement>,
  frame: FightNightFrame,
) {
  // gold ropes
  ctx.save();
  ctx.shadowColor = 'rgba(246,196,69,0.25)';
  ctx.shadowBlur = 24 * S;
  ctx.fillStyle = '#f6c445';
  rr(ctx, BOARD_X - 2 * S, BOARD_Y - 2 * S, BOARD_W + 4 * S, BOARD_W + 4 * S, 14 * S);
  ctx.fill();
  ctx.restore();

  ctx.save();
  rr(ctx, BOARD_X, BOARD_Y, BOARD_W, BOARD_W, 12 * S);
  ctx.clip();
  const board = parseBoard(frame.fen);
  const hl = lastSquares(frame.last);
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const x = BOARD_X + c * SQ;
      const y = BOARD_Y + r * SQ;
      ctx.fillStyle = (r + c) % 2 ? BOARD_COLORS.dark : BOARD_COLORS.light;
      ctx.fillRect(x, y, SQ, SQ);
      const sqName = String.fromCharCode(97 + c) + (8 - r);
      if (hl.has(sqName)) {
        ctx.fillStyle = 'rgba(246,196,69,0.55)';
        ctx.fillRect(x, y, SQ, SQ);
      }
      const piece = board[r][c];
      if (piece) ctx.drawImage(pieces[pieceCode(piece)], x, y, SQ, SQ);
    }
  }
  ctx.restore();

  if (frame.stamp) {
    ctx.save();
    ctx.translate(BOARD_X + BOARD_W / 2, BOARD_Y + BOARD_W / 2);
    ctx.rotate((-8 * Math.PI) / 180);
    ctx.font = `900 ${19 * S}px ${FONT}`;
    const track = 0.1 * 19 * S;
    ctx.textAlign = 'center';
    let tw = -track;
    for (const ch of 'CHECKMATE') tw += ctx.measureText(ch).width + track;
    const pw = tw + 28 * S;
    const ph = 19 * S + 10 * S + 7 * S;
    ctx.fillStyle = 'rgba(13,26,31,0.85)';
    rr(ctx, -pw / 2, -ph / 2, pw, ph, 10 * S);
    ctx.fill();
    ctx.strokeStyle = '#FF4B4B';
    ctx.lineWidth = 3.5 * S;
    rr(ctx, -pw / 2, -ph / 2, pw, ph, 10 * S);
    ctx.stroke();
    ctx.fillStyle = '#FF4B4B';
    drawTrackedCentered(ctx, 'CHECKMATE', 0, 6.5 * S, track);
    ctx.restore();
  }
}

function drawResultAndStats(ctx: Ctx, bout: FightNightBout) {
  const head = HEADLINES[bout.outcome] || { big: 'BOUT', rest: 'complete', win: false };
  const by = BOARD_Y + BOARD_W + 2 * S;

  // headline (rotated -2deg around its center)
  ctx.save();
  ctx.font = `900 ${30 * S}px ${FONT}`;
  const bigW = ctx.measureText(head.big).width;
  ctx.font = `900 ${17 * S}px ${FONT}`;
  const restW = ctx.measureText(head.rest.toUpperCase()).width;
  const totalW = bigW + 7 * S + restW;
  ctx.translate(150 * S, by + 30 * S);
  ctx.rotate((-2 * Math.PI) / 180);
  ctx.textAlign = 'left';
  ctx.fillStyle = head.win ? '#f6c445' : '#FF4B4B';
  ctx.font = `900 ${30 * S}px ${FONT}`;
  ctx.fillText(head.big, -totalW / 2, 0);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 ${17 * S}px ${FONT}`;
  ctx.fillText(head.rest.toUpperCase(), -totalW / 2 + bigW + 7 * S, 0);
  ctx.restore();

  // stats row + CTA pinned to the bottom, same as the satori card
  const ctaH = 30 * S;
  const ctaY = 533 * S - 10 * S - ctaH;
  const statH = 30 * S;
  const statY = ctaY - 8 * S - statH;
  const gap = 6 * S;
  const w = (300 * S - 32 * S - gap * 2) / 3;
  const stats: [string, string][] = [
    [String(bout.moves), 'MOVES'],
    [bout.rounds > 0 ? `R${bout.rounds}` : '—', 'ROUND'],
    [bout.clock, 'CLOCK LEFT'],
  ];
  stats.forEach(([v, l], i) => {
    const x = 16 * S + i * (w + gap);
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    rr(ctx, x, statY, w, statH, 8 * S);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1 * S;
    rr(ctx, x, statY, w, statH, 8 * S);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${15 * S}px ${FONT}`;
    ctx.fillText(v, x + w / 2, statY + 15 * S);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = `900 ${7.5 * S}px ${FONT}`;
    drawTrackedCentered(ctx, l, x + w / 2, statY + 25 * S, 0.16 * 7.5 * S);
  });

  ctx.fillStyle = '#b8860b';
  rr(ctx, 16 * S, ctaY + 3 * S, 300 * S - 32 * S, ctaH, 12 * S);
  ctx.fill();
  ctx.fillStyle = '#f6c445';
  rr(ctx, 16 * S, ctaY, 300 * S - 32 * S, ctaH, 12 * S);
  ctx.fill();
  ctx.fillStyle = '#3d2e00';
  ctx.font = `900 ${11 * S}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('BOX + SOLVE AT CHESSPATH.APP', 150 * S, ctaY + 19 * S);
}

/* ── the GIF ── */

export async function renderFightNightGif(
  frames: FightNightFrame[],
  bout: FightNightBout,
): Promise<Blob> {
  const pieces = await loadPieces();
  try {
    // Make sure the brand font is in before we rasterize text.
    await (document.fonts?.load(`900 ${17 * S}px "DM Sans"`) ?? Promise.resolve());
  } catch {
    // system-ui fallback is fine
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('no canvas 2d context');

  // Static chrome per board state; flashes vary per tick.
  const gif = GIFEncoder();
  let palette: number[][] | null = null;
  let seed = 0;
  for (let i = 0; i < frames.length; i++) {
    const isEnd = i === frames.length - 1;
    const nTicks = isEnd ? END_TICKS : MOVE_TICKS;

    // base card for this board state, kept off to the side and re-stamped
    ctx.fillStyle = '#131a2e';
    ctx.fillRect(0, 0, W, H);
    drawCrowdBand(ctx);
    drawBrand(ctx);
    drawTape(ctx, bout.username);
    drawBoard(ctx, pieces, frames[i]);
    drawResultAndStats(ctx, bout);
    const base = ctx.getImageData(0, 0, W, H);

    for (let t = 0; t < nTicks; t++) {
      ctx.putImageData(base, 0, 0);
      drawFlashes(ctx, seed++, !!frames[i].stamp);
      const { data } = ctx.getImageData(0, 0, W, H);
      // One palette for the whole GIF — the card's colors (gold, corner red/
      // blue, board greens, white) are all present from the first frame.
      palette ??= quantize(data, 256);
      const index = applyPalette(data, palette);
      gif.writeFrame(index, W, H, {
        palette,
        delay: isEnd ? END_TICK_MS : MOVE_TICK_MS,
        ...(seed === 1 ? { repeat: 0 } : {}),
      });
    }
  }
  gif.finish();
  return new Blob([new Uint8Array(gif.bytes())], { type: 'image/gif' });
}
