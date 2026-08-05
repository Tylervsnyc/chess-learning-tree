'use client';

import { useRef } from 'react';

/**
 * Fourthwall hat designs — "chesspath" + Rookie, CLASSIC color scheme.
 * Matches the classic logo: flat saturated blocks + multicolor "path" letters
 * (p=yellow, a=orange, t=red, h=blue), "chess" in ink.
 *
 * Front print area: 5.5" x 2" @ 300 dpi = 1650 x 600 px.
 * Back print area:  4"  x 1" @ 300 dpi = 1200 x 300 px.
 *
 * Two variants per design:
 *   - dark  → dark ink ("chess" black), for the WHITE hat
 *   - light → light ink ("chess" white), for the DARK BLUE hat
 * The colored rook + the path letters stay full-color in both.
 */

const W = 1650;
const H = 600;

// ─── Classic brand palette (sampled from rookie-classic.png) ───
const C = {
  purple: '#7c5ba8',
  blue: '#4a90e5',
  yellow: '#f0cb3a',
  green: '#8fb35e',
  red: '#c53b36',
  orange: '#dc6e2a',
  black: '#1a1a1a',
};

// Dark blue hat swatch color (preview background only — NOT printed)
const NAVY = '#1b2a4a';

type Variant = 'dark' | 'light';
type DProps = { v: Variant };
// "chess" ink: black on the white hat, white on the dark-blue hat.
const inkFor = (v: Variant) => (v === 'dark' ? C.black : '#FFFFFF');
const subInkFor = (v: Variant) => (v === 'dark' ? '#6b7280' : '#cdd8ef');

// Per-letter colors for "path" (classic scheme).
const PATH = [
  { ch: 'p', color: C.yellow },
  { ch: 'a', color: C.orange },
  { ch: 't', color: C.red },
  { ch: 'h', color: C.blue },
];

// ─── Classic rook: 5 cols × 6 rows, exact flat colors from the logo ───
// 6-color limit: "chess" ink is the 6th color, so the rook drops PURPLE and
// uses only blue/green/yellow/orange/red. The 3 ex-purple blocks were recolored
// (balanced, no matching neighbors): crown→red, head→orange, body→yellow.
type Blk = { x: number; y: number; color: string };
const CLASSIC_ROOK: Blk[] = [
  // Row 0: crown points
  { x: 0, y: 0, color: C.red }, { x: 2, y: 0, color: C.blue }, { x: 4, y: 0, color: C.yellow },
  // Row 1: crown rim
  { x: 0, y: 1, color: C.green }, { x: 1, y: 1, color: C.red }, { x: 2, y: 1, color: C.orange }, { x: 3, y: 1, color: C.green }, { x: 4, y: 1, color: C.blue },
  // Row 2: head
  { x: 1, y: 2, color: C.orange }, { x: 2, y: 2, color: C.blue }, { x: 3, y: 2, color: C.yellow },
  // Row 3: neck
  { x: 1, y: 3, color: C.green }, { x: 2, y: 3, color: C.red }, { x: 3, y: 3, color: C.orange },
  // Row 4: body
  { x: 1, y: 4, color: C.blue }, { x: 2, y: 4, color: C.green }, { x: 3, y: 4, color: C.yellow },
  // Row 5: base
  { x: 0, y: 5, color: C.blue }, { x: 1, y: 5, color: C.yellow }, { x: 2, y: 5, color: C.blue }, { x: 3, y: 5, color: C.red }, { x: 4, y: 5, color: C.orange },
];

function RookMark({
  x, y, cell, gap = 0, mono,
}: {
  x: number; y: number; cell: number; gap?: number; mono?: string;
}) {
  const step = cell + gap;
  return (
    <g>
      {CLASSIC_ROOK.map((b, i) => (
        <rect
          key={i}
          x={x + b.x * step}
          y={y + b.y * step}
          width={cell}
          height={cell}
          rx={cell * 0.16}
          fill={mono ?? b.color}
        />
      ))}
    </g>
  );
}
const rookW = (cell: number, gap = 0) => 5 * cell + 4 * gap;
const rookH = (cell: number, gap = 0) => 6 * cell + 5 * gap;

const FONT = "'DMSansHat', 'DM Sans', system-ui, sans-serif";

// "path" with each letter its classic color. mono overrides all to one ink.
function PathTspans({ mono }: { mono?: string }) {
  return (
    <>
      {PATH.map((l) => (
        <tspan key={l.ch} fill={mono ?? l.color}>{l.ch}</tspan>
      ))}
    </>
  );
}
function PathTspansCaps({ mono }: { mono?: string }) {
  return (
    <>
      {PATH.map((l) => (
        <tspan key={l.ch} fill={mono ?? l.color}>{l.ch.toUpperCase()}</tspan>
      ))}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// A — One word: rook + "chesspath" (matches the classic logo)
// ────────────────────────────────────────────────────────────
function DesignA({ v }: DProps) {
  const ink = inkFor(v);
  const cell = 76;
  const gap = 12;
  const rW = rookW(cell, gap);
  const rH = rookH(cell, gap);
  const rx = 85;
  const ry = (H - rH) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <RookMark x={rx} y={ry} cell={cell} gap={gap} />
      <text
        x={rx + rW + 55}
        y={H / 2}
        fontFamily={FONT}
        fontSize={192}
        fontWeight={800}
        dominantBaseline="central"
        letterSpacing={-5}
      >
        <tspan fill={ink}>chess</tspan>
        <PathTspans />
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// B — Two words: rook + "chess path" (spaced)
// ────────────────────────────────────────────────────────────
function DesignB({ v }: DProps) {
  const ink = inkFor(v);
  const cell = 58;
  const gap = 12;
  const rW = rookW(cell, gap);
  const rH = rookH(cell, gap);
  const rx = 150;
  const ry = (H - rH) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <RookMark x={rx} y={ry} cell={cell} gap={gap} />
      <text
        x={rx + rW + 70}
        y={H / 2}
        fontFamily={FONT}
        fontSize={150}
        fontWeight={800}
        dominantBaseline="central"
        letterSpacing={-2}
      >
        <tspan fill={ink}>chess </tspan>
        <PathTspans />
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// C — Stacked caps: rook + CHESS / PATH (PATH multicolor)
// ────────────────────────────────────────────────────────────
function DesignC({ v }: DProps) {
  const ink = inkFor(v);
  const cell = 72;
  const gap = 12;
  const rW = rookW(cell, gap);
  const rH = rookH(cell, gap);
  const ry = (H - rH) / 2;
  // Rookie centered in the LEFT half, CHESS/PATH centered in the RIGHT half.
  const rx = W / 4 - rW / 2;
  const cx = (3 * W) / 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <RookMark x={rx} y={ry} cell={cell} gap={gap} />
      <text
        x={cx}
        y={H / 2 - 22}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={200}
        fontWeight={800}
        dominantBaseline="alphabetic"
        letterSpacing={6}
        fill={ink}
      >
        CHESS
      </text>
      <text
        x={cx}
        y={H / 2 + 185}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={200}
        fontWeight={800}
        dominantBaseline="alphabetic"
        letterSpacing={20}
      >
        <PathTspansCaps />
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// D — Centered emblem: rook on top, "chesspath" below
// ────────────────────────────────────────────────────────────
function DesignD({ v }: DProps) {
  const ink = inkFor(v);
  const cell = 44;
  const gap = 12;
  const rW = rookW(cell, gap);
  const rH = rookH(cell, gap);
  const rx = (W - rW) / 2;
  const ry = 70;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <RookMark x={rx} y={ry} cell={cell} gap={gap} />
      <text
        x={W / 2}
        y={ry + rH + 60}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={150}
        fontWeight={800}
        dominantBaseline="central"
        letterSpacing={-2}
      >
        <tspan fill={ink}>chess</tspan>
        <PathTspans />
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// E — Wordmark-forward: big "chesspath", small rook tucked left
// ────────────────────────────────────────────────────────────
function DesignE({ v }: DProps) {
  const ink = inkFor(v);
  const cell = 40;
  const gap = 12;
  const rW = rookW(cell, gap);
  const rH = rookH(cell, gap);
  const rx = 120;
  const ry = (H - rH) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <RookMark x={rx} y={ry} cell={cell} gap={gap} />
      <text
        x={rx + rW + 50}
        y={H / 2}
        fontFamily={FONT}
        fontSize={185}
        fontWeight={800}
        dominantBaseline="central"
        letterSpacing={-7}
      >
        <tspan fill={ink}>chess</tspan>
        <PathTspans />
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// F — Tonal / single-color (embroidery-friendly): one ink, no multicolor
// ────────────────────────────────────────────────────────────
function DesignF({ v }: DProps) {
  const ink = inkFor(v);
  const cell = 58;
  const gap = 12;
  const rW = rookW(cell, gap);
  const rH = rookH(cell, gap);
  const rx = 170;
  const ry = (H - rH) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <RookMark x={rx} y={ry} cell={cell} gap={gap} mono={ink} />
      <text
        x={rx + rW + 80}
        y={H / 2}
        fontFamily={FONT}
        fontSize={150}
        fontWeight={800}
        dominantBaseline="central"
        letterSpacing={-2}
        fill={ink}
      >
        chess path
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// BACK OF HAT — "chesspath" wordmark, multicolor "path"
// ────────────────────────────────────────────────────────────
const BW = 1200;
const BH = 300;
function BackWordmark({ v }: DProps) {
  const ink = inkFor(v);
  return (
    <svg viewBox={`0 0 ${BW} ${BH}`} width="100%" style={{ display: 'block' }}>
      <text
        x={BW / 2}
        y={BH / 2}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={150}
        fontWeight={800}
        dominantBaseline="central"
        letterSpacing={-4}
      >
        <tspan fill={ink}>chess</tspan>
        <PathTspans />
      </text>
    </svg>
  );
}

// Back variant with the URL — 4" wide fits "chesspath.app" single-line, stitch-safe.
function BackWordmarkUrl({ v }: DProps) {
  const ink = inkFor(v);
  return (
    <svg viewBox={`0 0 ${BW} ${BH}`} width="100%" style={{ display: 'block' }}>
      <text
        x={BW / 2}
        y={BH / 2}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={132}
        fontWeight={800}
        dominantBaseline="central"
        letterSpacing={-4}
      >
        <tspan fill={ink}>chess</tspan>
        <PathTspans />
        <tspan fill={ink}>.app</tspan>
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// SIDE OF HAT — 2"x1" = 600x300. Icon / very short mark only.
// ────────────────────────────────────────────────────────────
const SW = 600;
const SH = 300;

// 1) Rookie alone, centered (full color blocks)
function SideRook({ v: _v }: DProps) {
  const cell = 30;
  const gap = 12;
  const rW = rookW(cell, gap);
  const rH = rookH(cell, gap);
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" style={{ display: 'block' }}>
      <RookMark x={(SW - rW) / 2} y={(SH - rH) / 2} cell={cell} gap={gap} />
    </svg>
  );
}

// 2) Stacked CHESS / PATH caps (caps clear the 0.25" min; lowercase wouldn't)
function SideStack({ v }: DProps) {
  const ink = inkFor(v);
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" style={{ display: 'block' }}>
      <text x={SW / 2} y={128} textAnchor="middle" fontFamily={FONT} fontSize={108} fontWeight={800} dominantBaseline="alphabetic" letterSpacing={2} fill={ink}>
        CHESS
      </text>
      <text x={SW / 2} y={258} textAnchor="middle" fontFamily={FONT} fontSize={108} fontWeight={800} dominantBaseline="alphabetic" letterSpacing={10}>
        <PathTspansCaps />
      </text>
    </svg>
  );
}

// 3) Tonal rook — single ink color
function SideRookTonal({ v }: DProps) {
  const ink = inkFor(v);
  const cell = 30;
  const gap = 12;
  const rW = rookW(cell, gap);
  const rH = rookH(cell, gap);
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" style={{ display: 'block' }}>
      <RookMark x={(SW - rW) / 2} y={(SH - rH) / 2} cell={cell} gap={gap} mono={ink} />
    </svg>
  );
}

// 4) chesspath.app — single line (fills width; letters end up ~0.2", borderline)
function SideUrlOne({ v }: DProps) {
  const ink = inkFor(v);
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" style={{ display: 'block' }}>
      <text x={SW / 2} y={SH / 2} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800} dominantBaseline="central" letterSpacing={-2}>
        <tspan fill={ink}>chess</tspan>
        <PathTspans />
        <tspan fill={ink}>.app</tspan>
      </text>
    </svg>
  );
}

// 5) chesspath.app — two lines so letters clear the 0.25" min
function SideUrlTwo({ v }: DProps) {
  const ink = inkFor(v);
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" style={{ display: 'block' }}>
      <text x={SW / 2} y={118} textAnchor="middle" fontFamily={FONT} fontSize={118} fontWeight={800} dominantBaseline="central" letterSpacing={-4}>
        <tspan fill={ink}>chess</tspan>
        <PathTspans />
      </text>
      <text x={SW / 2} y={222} textAnchor="middle" fontFamily={FONT} fontSize={92} fontWeight={800} dominantBaseline="central" letterSpacing={0} fill={ink}>
        .app
      </text>
    </svg>
  );
}

const SIDES = [
  { id: 'rook', name: 'Rookie (full color)', Comp: SideRook },
  { id: 'stack', name: 'Stacked CHESS / PATH', Comp: SideStack },
  { id: 'tonal', name: 'Rookie (tonal, 1 color)', Comp: SideRookTonal },
  { id: 'url1', name: 'chesspath.app — one line (~0.2", borderline)', Comp: SideUrlOne },
  { id: 'url2', name: 'chesspath.app — two lines (stitch-safe)', Comp: SideUrlTwo },
];

const DESIGNS = [
  { id: 'A', name: 'One word (classic)', Comp: DesignA, note: 'Rook + “chesspath”, multicolor path. Matches the classic logo.' },
  { id: 'B', name: 'Two words', Comp: DesignB, note: 'Rook + “chess path” with a space.' },
  { id: 'C', name: 'Stacked caps', Comp: DesignC, note: 'Big CHESS / PATH — PATH in the four classic colors.' },
  { id: 'D', name: 'Centered emblem', Comp: DesignD, note: 'Rook on top, “chesspath” centered below. Badge feel.' },
  { id: 'E', name: 'Wordmark-forward', Comp: DesignE, note: 'Tight one-word “chesspath”, small rook.' },
  { id: 'F', name: 'Tonal (embroidery)', Comp: DesignF, note: 'Single-color rook + text — best for stitched hats.' },
];

// ─── Export helpers ───────────────────────────────────────────
const PPM_300 = 11811; // 300 DPI in pixels/meter

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Base64-embed the bundled DM Sans woff2 so the rasterized SVG has the real font.
let _fontCss: string | null = null;
async function fontFaceCss(): Promise<string> {
  if (_fontCss) return _fontCss;
  const buf = await fetch('/fonts/dm-sans.woff2').then((r) => r.arrayBuffer());
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const dataUrl = `data:font/woff2;base64,${btoa(bin)}`;
  _fontCss = `@font-face{font-family:'DMSansHat';src:url(${dataUrl}) format('woff2');font-weight:400 800;font-style:normal;}`;
  return _fontCss;
}

function downloadSvg(el: SVGSVGElement | null, w: number, h: number, filename: string) {
  if (!el) return;
  const clone = el.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  triggerDownload(
    new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }),
    filename,
  );
}

async function rasterize(
  el: SVGSVGElement, w: number, h: number, bg?: string,
): Promise<HTMLCanvasElement> {
  const clone = el.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = await fontFaceCss();
  clone.insertBefore(style, clone.firstChild);

  const svgStr = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }));
  const img = new Image();
  img.width = w;
  img.height = h;
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(url);
  return canvas;
}

function crc32(b: Uint8Array, start: number, end: number): number {
  let c = 0xffffffff;
  for (let i = start; i < end; i++) {
    c ^= b[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngWithDpi(png: Uint8Array, ppm: number): Uint8Array {
  const phys = new Uint8Array(21);
  const dv = new DataView(phys.buffer);
  dv.setUint32(0, 9);
  phys.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  dv.setUint32(8, ppm);
  dv.setUint32(12, ppm);
  phys[16] = 1; // unit = meter
  dv.setUint32(17, crc32(phys, 4, 17));
  const out = new Uint8Array(png.length + 21);
  out.set(png.subarray(0, 33), 0); // sig + IHDR
  out.set(phys, 33);
  out.set(png.subarray(33), 33 + 21);
  return out;
}

function jpegWithDpi(jpg: Uint8Array, dpi: number): Uint8Array {
  if (jpg[2] === 0xff && jpg[3] === 0xe0) {
    jpg[13] = 1;
    jpg[14] = (dpi >> 8) & 0xff;
    jpg[15] = dpi & 0xff;
    jpg[16] = (dpi >> 8) & 0xff;
    jpg[17] = dpi & 0xff;
  }
  return jpg;
}

async function downloadPng(el: SVGSVGElement | null, w: number, h: number, filename: string) {
  if (!el) return;
  const canvas = await rasterize(el, w, h);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
  if (!blob) return;
  const out = pngWithDpi(new Uint8Array(await blob.arrayBuffer()), PPM_300);
  triggerDownload(new Blob([out.buffer as ArrayBuffer], { type: 'image/png' }), filename);
}

async function downloadJpg(
  el: SVGSVGElement | null, w: number, h: number, bg: string, filename: string,
) {
  if (!el) return;
  const canvas = await rasterize(el, w, h, bg);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.95));
  if (!blob) return;
  const out = jpegWithDpi(new Uint8Array(await blob.arrayBuffer()), 300);
  triggerDownload(new Blob([out.buffer as ArrayBuffer], { type: 'image/jpeg' }), filename);
}

function HatSwatch({
  Comp, variant, bg, label, filename, w = W, h = H,
}: {
  Comp: (p: DProps) => React.JSX.Element;
  variant: Variant;
  bg: string;
  label: string;
  filename: string;
  w?: number;
  h?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const svg = () => ref.current?.querySelector('svg') ?? null;
  const btn = 'rounded-md px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50';
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => downloadPng(svg(), w, h, `${filename}.png`)}
            className={`${btn} bg-emerald-600 hover:bg-emerald-500`}
            title="Transparent PNG @ 300 DPI — recommended for upload"
          >
            ↓ PNG
          </button>
          <button
            onClick={() => downloadJpg(svg(), w, h, bg, `${filename}.jpg`)}
            className={`${btn} bg-slate-700 hover:bg-slate-600`}
            title="JPG @ 300 DPI (flat hat-color background)"
          >
            ↓ JPG
          </button>
          <button
            onClick={() => downloadSvg(svg(), w, h, `${filename}.svg`)}
            className={`${btn} bg-slate-400 hover:bg-slate-300`}
            title="Vector source"
          >
            SVG
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/10"
        style={{ background: bg, aspectRatio: `${w} / ${h}` }}
      >
        <Comp v={variant} />
      </div>
    </div>
  );
}

export default function HatDesignsPage() {
  return (
    <div className="h-full overflow-auto bg-slate-100 px-5 py-8">
      {/* Real DM Sans so 700/800 render true bold on screen + in export */}
      <style>{`@font-face{font-family:'DMSansHat';src:url(/fonts/dm-sans.woff2) format('woff2');font-weight:400 800;font-style:normal;font-display:swap;}`}</style>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Hat designs — classic chesspath scheme
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Classic color scheme, <b>6-color limit</b>: blue·green·yellow·orange·red + 1 ink for
          “chess” (black on white hat, white on dark hat). <b>Purple is dropped</b> — the 3
          purple rook blocks recolored into the other 5. “path” = p·a·t·h yellow·orange·red·blue.
          Front <b>5.5″×2″ (1650×600)</b>. Variations A–F are different ways to write it.
        </p>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-amber-200">
          <b>Upload to Fourthwall:</b> use <b>↓ PNG</b> — transparent, 300 DPI, well under
          25 MB. Hat-color backgrounds here are preview only (not in the PNG). <b>↓ JPG</b>
          bakes the hat color in — mockups only.
        </p>

        <div className="mt-8 flex flex-col gap-10">
          {DESIGNS.map(({ id, name, Comp, note }) => (
            <section key={id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">{id}. {name}</h2>
                <p className="text-sm text-slate-500">{note}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <HatSwatch Comp={Comp} variant="dark" bg="#FFFFFF" label="White hat" filename={`chesspath-hat-${id}-white`} />
                <HatSwatch Comp={Comp} variant="light" bg={NAVY} label="Dark blue hat" filename={`chesspath-hat-${id}-navy`} />
              </div>
            </section>
          ))}
        </div>

        {/* Back of hat */}
        <h2 className="mt-12 text-xl font-extrabold text-slate-900">Back of hat — wordmark</h2>
        <p className="mb-4 mt-1 text-sm text-slate-600">
          Just “chesspath”, multicolor path. 4″×1″ (1200×300).
        </p>
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-slate-900">chesspath</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <HatSwatch Comp={BackWordmark} variant="dark" bg="#FFFFFF" label="White hat" filename="chesspath-back-white" w={BW} h={BH} />
            <HatSwatch Comp={BackWordmark} variant="light" bg={NAVY} label="Dark blue hat" filename="chesspath-back-navy" w={BW} h={BH} />
          </div>
          <h3 className="mb-3 mt-6 text-base font-bold text-slate-900">chesspath.app (fits single-line here)</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <HatSwatch Comp={BackWordmarkUrl} variant="dark" bg="#FFFFFF" label="White hat" filename="chesspath-back-url-white" w={BW} h={BH} />
            <HatSwatch Comp={BackWordmarkUrl} variant="light" bg={NAVY} label="Dark blue hat" filename="chesspath-back-url-navy" w={BW} h={BH} />
          </div>
        </section>

        {/* Sides of hat */}
        <h2 className="mt-12 text-xl font-extrabold text-slate-900">Sides of hat — small mark</h2>
        <p className="mb-4 mt-1 text-sm text-slate-600">
          2″×1″ (600×300). Too small for the wordmark at a stitchable size — icon or short
          caps only.
        </p>
        <div className="flex flex-col gap-8">
          {SIDES.map(({ id, name, Comp }) => (
            <section key={id} className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-bold text-slate-900">{name}</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <HatSwatch Comp={Comp} variant="dark" bg="#FFFFFF" label="White hat" filename={`chesspath-side-${id}-white`} w={SW} h={SH} />
                <HatSwatch Comp={Comp} variant="light" bg={NAVY} label="Dark blue hat" filename={`chesspath-side-${id}-navy`} w={SW} h={SH} />
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          PNG exports carry a real 300-DPI tag. Embroidery can’t do per-letter color —
          use a tonal design if stitched.
        </p>
      </div>
    </div>
  );
}
