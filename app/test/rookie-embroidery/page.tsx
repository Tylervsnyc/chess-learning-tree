'use client';

import { useState } from 'react';
import { ROOK_BLOCKS } from '@/lib/daily-rook-blocks';

// The 15 Fourthwall thread colors (approximated from swatches)
const THREADS = {
  white:    { name: 'White',      hex: '#F5F5F2' },
  black:    { name: 'Black',      hex: '#1A1A1A' },
  grey:     { name: 'Grey',       hex: '#A6AAB0' },
  tan:      { name: 'Tan',        hex: '#9C7A4E' },
  gold:     { name: 'Gold',       hex: '#F0CB3A' },
  orange:   { name: 'Orange',     hex: '#DC6E2A' },
  pink:     { name: 'Pink',       hex: '#BD4569' },
  red:      { name: 'Red',        hex: '#C53B36' },
  maroon:   { name: 'Maroon',     hex: '#6B1818' },
  navy:     { name: 'Navy',       hex: '#2A2F5C' },
  blue:     { name: 'Blue',       hex: '#1F4E8C' },
  lightblue:{ name: 'Light Blue', hex: '#4A90E5' },
  purple:   { name: 'Purple',     hex: '#7C5BA8' },
  green:    { name: 'Green',      hex: '#2F7D4E' },
  kiwi:     { name: 'Kiwi Green', hex: '#8FB35E' },
} as const;

type ThreadKey = keyof typeof THREADS;
type Mapping = Record<string, ThreadKey>;

const ORIGINAL_KEYS = ['#1CB0F6', '#2FCBEF', '#A560E8', '#58CC02', '#FFC800', '#FF9600', '#FF6B6B', '#FF4B4B'];

interface Variant {
  name: string;
  blurb: string;
  palette: ThreadKey[]; // exactly 6
  mapping: Mapping;     // 8 originals -> threads (each thread in palette)
}

const VARIANTS: Variant[] = [
  {
    name: 'Classic',
    blurb: 'The chosen Rookie. Resolver auto-breaks the kiwi/kiwi conflicts in row 1 and row 4 into light blue.',
    palette: ['lightblue', 'purple', 'kiwi', 'gold', 'orange', 'red'],
    mapping: {
      '#1CB0F6': 'purple', '#2FCBEF': 'lightblue', '#A560E8': 'gold',
      '#58CC02': 'kiwi', '#FFC800': 'red', '#FF9600': 'orange',
      '#FF6B6B': 'kiwi', '#FF4B4B': 'kiwi',
    },
  },
  {
    name: 'Earthy',
    blurb: 'Tan + maroon + forest green. Looks great on cream too.',
    palette: ['blue', 'maroon', 'green', 'gold', 'tan', 'red'],
    mapping: {
      '#1CB0F6': 'blue', '#2FCBEF': 'blue', '#A560E8': 'maroon',
      '#58CC02': 'green', '#FFC800': 'gold', '#FF9600': 'tan',
      '#FF6B6B': 'red', '#FF4B4B': 'red',
    },
  },
  {
    name: 'Americana',
    blurb: 'Navy + red + gold + tan. Vintage varsity feel.',
    palette: ['navy', 'red', 'gold', 'tan', 'kiwi', 'maroon'],
    mapping: {
      '#1CB0F6': 'navy', '#2FCBEF': 'navy', '#A560E8': 'maroon',
      '#58CC02': 'kiwi', '#FFC800': 'gold', '#FF9600': 'tan',
      '#FF6B6B': 'red', '#FF4B4B': 'red',
    },
  },
  {
    name: 'Cyberpunk',
    blurb: 'Hot pink + purple + black + kiwi. Neon-on-night vibe.',
    palette: ['pink', 'purple', 'black', 'kiwi', 'gold', 'lightblue'],
    mapping: {
      '#1CB0F6': 'lightblue', '#2FCBEF': 'lightblue', '#A560E8': 'purple',
      '#58CC02': 'kiwi', '#FFC800': 'gold', '#FF9600': 'pink',
      '#FF6B6B': 'pink', '#FF4B4B': 'black',
    },
  },
  {
    name: 'Forest',
    blurb: 'Two greens + tan + maroon + gold. Mossy, woodsy.',
    palette: ['green', 'kiwi', 'tan', 'gold', 'maroon', 'navy'],
    mapping: {
      '#1CB0F6': 'navy', '#2FCBEF': 'navy', '#A560E8': 'maroon',
      '#58CC02': 'green', '#FFC800': 'gold', '#FF9600': 'tan',
      '#FF6B6B': 'maroon', '#FF4B4B': 'kiwi',
    },
  },
  {
    name: 'Tropical',
    blurb: 'Pink + orange + gold + kiwi + light blue. Beach Rookie.',
    palette: ['pink', 'orange', 'gold', 'kiwi', 'lightblue', 'purple'],
    mapping: {
      '#1CB0F6': 'lightblue', '#2FCBEF': 'lightblue', '#A560E8': 'purple',
      '#58CC02': 'kiwi', '#FFC800': 'gold', '#FF9600': 'orange',
      '#FF6B6B': 'pink', '#FF4B4B': 'pink',
    },
  },
  {
    name: 'Pride',
    blurb: 'Full rainbow — red, orange, gold, kiwi, light blue, purple.',
    palette: ['red', 'orange', 'gold', 'kiwi', 'lightblue', 'purple'],
    mapping: {
      '#1CB0F6': 'lightblue', '#2FCBEF': 'lightblue', '#A560E8': 'purple',
      '#58CC02': 'kiwi', '#FFC800': 'gold', '#FF9600': 'orange',
      '#FF6B6B': 'red', '#FF4B4B': 'red',
    },
  },
  {
    name: 'Stealth',
    blurb: 'Black, grey, navy, white, with gold + maroon accents.',
    palette: ['black', 'grey', 'navy', 'white', 'gold', 'maroon'],
    mapping: {
      '#1CB0F6': 'navy', '#2FCBEF': 'grey', '#A560E8': 'black',
      '#58CC02': 'grey', '#FFC800': 'gold', '#FF9600': 'maroon',
      '#FF6B6B': 'maroon', '#FF4B4B': 'black',
    },
  },
  {
    name: 'Berry',
    blurb: 'Purple + pink + maroon + gold. Jewel-toned.',
    palette: ['purple', 'pink', 'maroon', 'gold', 'kiwi', 'navy'],
    mapping: {
      '#1CB0F6': 'navy', '#2FCBEF': 'purple', '#A560E8': 'purple',
      '#58CC02': 'kiwi', '#FFC800': 'gold', '#FF9600': 'pink',
      '#FF6B6B': 'pink', '#FF4B4B': 'maroon',
    },
  },
  {
    name: 'Retro 70s',
    blurb: 'Orange, gold, tan, maroon, kiwi. Wood-paneled basement Rookie.',
    palette: ['orange', 'gold', 'tan', 'maroon', 'kiwi', 'green'],
    mapping: {
      '#1CB0F6': 'green', '#2FCBEF': 'kiwi', '#A560E8': 'maroon',
      '#58CC02': 'kiwi', '#FFC800': 'gold', '#FF9600': 'orange',
      '#FF6B6B': 'tan', '#FF4B4B': 'maroon',
    },
  },
  {
    name: 'Ocean',
    blurb: 'Navy + blue + light blue + white. Cool and watery.',
    palette: ['navy', 'blue', 'lightblue', 'white', 'kiwi', 'gold'],
    mapping: {
      '#1CB0F6': 'lightblue', '#2FCBEF': 'blue', '#A560E8': 'navy',
      '#58CC02': 'kiwi', '#FFC800': 'gold', '#FF9600': 'white',
      '#FF6B6B': 'lightblue', '#FF4B4B': 'navy',
    },
  },
  {
    name: 'Candy',
    blurb: 'Pink, light blue, gold, kiwi, purple, orange. Sugary.',
    palette: ['pink', 'lightblue', 'gold', 'kiwi', 'purple', 'orange'],
    mapping: {
      '#1CB0F6': 'lightblue', '#2FCBEF': 'lightblue', '#A560E8': 'purple',
      '#58CC02': 'kiwi', '#FFC800': 'gold', '#FF9600': 'orange',
      '#FF6B6B': 'pink', '#FF4B4B': 'pink',
    },
  },
];

// No-adjacent-repeat resolver
function resolveBlocks(mapping: Mapping, palette: ThreadKey[]): Map<string, ThreadKey> {
  const assigned = new Map<string, ThreadKey>();
  for (const b of ROOK_BLOCKS) {
    const key = `${b.x},${b.y}`;
    const preferred = mapping[b.color];
    const neighborThreads = new Set<ThreadKey>();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const n = assigned.get(`${b.x + dx},${b.y + dy}`);
      if (n) neighborThreads.add(n);
    }
    if (!neighborThreads.has(preferred)) {
      assigned.set(key, preferred);
      continue;
    }
    const fallback = palette.find((p) => !neighborThreads.has(p)) ?? preferred;
    assigned.set(key, fallback);
  }
  return assigned;
}

// Random shuffle: assign each original color to a random thread from the palette,
// guaranteeing every thread in the palette is used at least once.
function shuffleMapping(palette: ThreadKey[]): Mapping {
  const slots = [...ORIGINAL_KEYS];
  // Shuffle slots
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  const mapping: Mapping = {} as Mapping;
  // First N slots get each palette color (so all 6 are used)
  palette.forEach((thread, i) => {
    mapping[slots[i]] = thread;
  });
  // Remaining slots get a random thread
  for (let i = palette.length; i < slots.length; i++) {
    mapping[slots[i]] = palette[Math.floor(Math.random() * palette.length)];
  }
  return mapping;
}

// Pick the first thread from priority list that's in the variant's palette
function pickFirst(palette: ThreadKey[], priority: ThreadKey[]): ThreadKey {
  for (const p of priority) if (palette.includes(p)) return p;
  return palette[0];
}

// Approximate the chesspath gradient (gold → coral → cyan) using available threads
function getWordmarkColors(palette: ThreadKey[]) {
  return {
    chess: pickFirst(palette, ['black', 'navy', 'maroon', 'purple', 'blue', 'green', 'grey']),
    p:     pickFirst(palette, ['gold', 'orange', 'tan', 'kiwi']),
    a:     pickFirst(palette, ['orange', 'red', 'pink', 'gold', 'maroon', 'tan']),
    t:     pickFirst(palette, ['red', 'pink', 'maroon', 'purple', 'orange']),
    h:     pickFirst(palette, ['lightblue', 'blue', 'navy', 'purple', 'kiwi']),
  };
}

async function svgToPng(svg: string, w: number, h: number, fileName: string) {
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 4;
      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('toBlob failed')); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        resolve();
      }, 'image/png');
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

async function downloadRookiePng(mapping: Mapping, palette: ThreadKey[], variantName: string) {
  const resolved = resolveBlocks(mapping, palette);
  const blockSize = 56;
  const gap = 8;
  const w = 5 * blockSize + 4 * gap;
  const h = 6 * blockSize + 5 * gap;
  const blocksSvg = ROOK_BLOCKS.map((b) => {
    const tk = resolved.get(`${b.x},${b.y}`)!;
    const x = b.x * (blockSize + gap);
    const y = b.y * (blockSize + gap);
    return `<rect x="${x}" y="${y}" width="${blockSize}" height="${blockSize}" rx="8" fill="${THREADS[tk].hex}"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${blocksSvg}</svg>`;
  await svgToPng(svg, w, h, `rookie-${variantName.toLowerCase().replace(/\s+/g, '-')}.png`);
}

async function downloadWordmarkPng(palette: ThreadKey[], variantName: string) {
  const wm = getWordmarkColors(palette);
  const fontSize = 96;
  const w = 720;
  const h = Math.round(fontSize * 1.2);
  const textY = h * 0.82;
  const textSvg = `<text x="${w / 2}" y="${textY}" text-anchor="middle" font-family="system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-3">` +
    `<tspan fill="${THREADS.black.hex}">chess</tspan>` +
    `<tspan fill="${THREADS[wm.p].hex}">p</tspan>` +
    `<tspan fill="${THREADS[wm.a].hex}">a</tspan>` +
    `<tspan fill="${THREADS[wm.t].hex}">t</tspan>` +
    `<tspan fill="${THREADS[wm.h].hex}">h</tspan>` +
    `</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${textSvg}</svg>`;
  await svgToPng(svg, w, h, `chesspath-${variantName.toLowerCase().replace(/\s+/g, '-')}.png`);
}

const BLOCK = 28;
const GAP = 4;
const GRID_W = 5 * BLOCK + 4 * GAP;
const GRID_H = 6 * BLOCK + 5 * GAP;

function Rookie({ mapping, palette }: { mapping: Mapping; palette: ThreadKey[] }) {
  const resolved = resolveBlocks(mapping, palette);
  return (
    <div style={{ position: 'relative', width: GRID_W, height: GRID_H }}>
      {ROOK_BLOCKS.map((b) => {
        const threadKey = resolved.get(`${b.x},${b.y}`)!;
        return (
          <div
            key={`${b.x},${b.y}`}
            style={{
              position: 'absolute',
              left: b.x * (BLOCK + GAP),
              top: b.y * (BLOCK + GAP),
              width: BLOCK,
              height: BLOCK,
              background: THREADS[threadKey].hex,
              borderRadius: 4,
              boxShadow: 'inset 0 1.5px 0 rgba(0,0,0,0.18), inset 0 -1.5px 0 rgba(255,255,255,0.18)',
            }}
          />
        );
      })}
    </div>
  );
}

function PaletteSwatches({ palette }: { palette: ThreadKey[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {palette.map((k) => (
        <div key={k} className="flex items-center gap-1.5 text-xs text-slate-700">
          <span
            className="inline-block w-4 h-4 rounded-full border border-black/20"
            style={{ background: THREADS[k].hex }}
          />
          {THREADS[k].name}
        </div>
      ))}
    </div>
  );
}

export default function RookieEmbroideryPage() {
  // Per-variant override mapping (set by Shuffle button)
  const [overrides, setOverrides] = useState<Record<string, Mapping>>({});

  return (
    <div className="overflow-auto h-full bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Rookie Embroidery — 6-color palettes</h1>
          <p className="text-sm text-slate-600 mt-1">
            12 palette options, all on white. Hit <em>Shuffle</em> on any to remix which original color
            zone gets which thread (no-adjacent-repeat rule still applies).
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VARIANTS.map((v) => {
            const mapping = overrides[v.name] ?? v.mapping;
            return (
              <div key={v.name} className="p-5 bg-white rounded-lg border border-slate-200 flex flex-col">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{v.name}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{v.blurb}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                      onClick={() =>
                        setOverrides((prev) => ({ ...prev, [v.name]: shuffleMapping(v.palette) }))
                      }
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                    >
                      Shuffle
                    </button>
                    <button
                      onClick={() => downloadRookiePng(mapping, v.palette, v.name)}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      ↓ Rookie
                    </button>
                    <button
                      onClick={() => downloadWordmarkPng(v.palette, v.name)}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      ↓ chesspath
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <PaletteSwatches palette={v.palette} />
                </div>
                <div className="flex flex-col items-center gap-3 py-4 bg-white border border-slate-100 rounded-md">
                  <Rookie mapping={mapping} palette={v.palette} />
                  {(() => {
                    const wm = getWordmarkColors(v.palette);
                    return (
                      <div
                        style={{
                          fontFamily: 'DM Sans, Inter, system-ui, sans-serif',
                          fontWeight: 800,
                          fontSize: 28,
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                        }}
                      >
                        <span style={{ color: THREADS.black.hex }}>chess</span>
                        <span style={{ color: THREADS[wm.p].hex }}>p</span>
                        <span style={{ color: THREADS[wm.a].hex }}>a</span>
                        <span style={{ color: THREADS[wm.t].hex }}>t</span>
                        <span style={{ color: THREADS[wm.h].hex }}>h</span>
                      </div>
                    );
                  })()}
                </div>
                {overrides[v.name] && (
                  <button
                    onClick={() =>
                      setOverrides((prev) => {
                        const next = { ...prev };
                        delete next[v.name];
                        return next;
                      })
                    }
                    className="mt-2 text-[11px] text-slate-500 hover:text-slate-900 self-start"
                  >
                    ↺ reset
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
