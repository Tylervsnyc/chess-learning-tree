'use client';

import { useState } from 'react';
import { ROOK_BLOCKS, ROOK_FILL_ORDER } from '@/lib/daily-rook-blocks';

// ── Mock Data ────────────────────────────────────────────────────────────
const MOCK_RESULTS = [
  true, true, true, false, true,
  true, false, true,
  true, true, true,
  true, true, true,
  true, true, true, true, true,
  true, true, false,
];

const MOCK_SCORE = 18;
const MOCK_TIME = '3:45';
const MOCK_NAME = 'TacticQueen';
const MOCK_BEAT_PCT = 72;
const MOCK_DATE = 'Feb 7, 2026';

// ── Grid Positions (fill order: bottom-to-top) ──────────────────────────
const GRID_POSITIONS = ROOK_FILL_ORDER.map(idx => ROOK_BLOCKS[idx]);

function getBlockColor(x: number, y: number): string {
  const block = ROOK_BLOCKS.find(b => b.x === x && b.y === y);
  return block?.color || '#58CC02';
}

// ── Light Rook Grid ─────────────────────────────────────────────────────
function RookGrid({
  results,
  blockSize,
  gap,
}: {
  results: boolean[];
  blockSize: number;
  gap: number;
}) {
  const COLS = 5;
  const ROWS = 6;
  const r = Math.round(blockSize * 0.18);
  const d = Math.round(blockSize * 0.06);

  return (
    <div
      className="relative"
      style={{
        width: COLS * blockSize + (COLS - 1) * gap,
        height: ROWS * blockSize + (ROWS - 1) * gap + d,
      }}
    >
      {GRID_POSITIONS.map((block, i) => {
        const ok = results[i] ?? false;
        const c = getBlockColor(block.x, block.y);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: block.x * (blockSize + gap),
              top: block.y * (blockSize + gap),
              width: blockSize,
              height: blockSize,
              borderRadius: r,
              backgroundColor: ok ? c : '#dce8f0',
              border: ok ? 'none' : '1px solid #c5d4de',
              boxShadow: ok
                ? `0 ${d}px 0 rgba(0,0,0,0.2), 0 ${d + 4}px 12px ${c}30`
                : `0 ${d}px 0 rgba(0,0,0,0.06)`,
              backgroundImage: ok
                ? 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)'
                : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: blockSize * 0.3,
                fontWeight: 900,
                color: ok ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.1)',
                textShadow: ok ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Tiny chesspath wordmark ──────────────────────────────────────────────
function Logo() {
  const s = 5;
  const sp = 6;
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative" style={{ width: sp * 4 + s, height: sp * 5 + s }}>
        {ROOK_BLOCKS.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x * sp,
              top: b.y * sp,
              width: s,
              height: s,
              borderRadius: 1,
              backgroundColor: b.color,
            }}
          />
        ))}
      </div>
      <div className="flex items-baseline">
        <span className="text-[13px] font-bold text-[#2A3C45]">chess</span>
        <span
          className="text-[13px] font-bold"
          style={{
            backgroundImage: 'linear-gradient(90deg, #FFC800 0%, #FF6B6B 45%, #1CB0F6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          path
        </span>
      </div>
    </div>
  );
}

// ── Inline hearts ───────────────────────────────────────────────────────
function Hearts({ lives = 2, max = 3, size = 14 }: { lives?: number; max?: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width={size} height={size} fill={i < lives ? '#FF4B4B' : '#c5d4de'} viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
}

// ── Rule pills ──────────────────────────────────────────────────────────
function Rules() {
  const pills = [
    { label: '22 puzzles', color: '#1CB0F6' },
    { label: '5 min', color: '#FF9600' },
    { label: '3 lives', color: '#FF6B6B' },
    { label: 'Easy→Hard', color: '#A560E8' },
  ];
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {pills.map(p => (
        <div
          key={p.label}
          className="px-3 py-1 rounded-full flex items-center justify-center"
          style={{ background: `${p.color}15` }}
        >
          <span className="text-[11px] font-black leading-none text-center" style={{ color: p.color }}>{p.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Shared card wrapper: header + card slot + rook ──────────────────────
const CARD_STYLE = {
  background: '#fff',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: '1px solid rgba(0,0,0,0.05)',
};

function StoryShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#eef6fc' }}>
      <div className="w-full h-1" style={{ background: 'linear-gradient(90deg, #FF9600, #FF6B6B, #A560E8, #1CB0F6)' }} />

      <div className="flex flex-col items-center px-5 pt-4">
        <Logo />

        {/* Title */}
        <div className="mt-3 flex flex-col items-center">
          <div
            className="inline-block rounded-lg border border-[#FF9600]/30 text-lg px-4 py-1.5"
            style={{ background: 'linear-gradient(135deg, rgba(255,150,0,0.1), rgba(255,107,107,0.1))' }}
          >
            <span
              className="font-black tracking-widest text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #FF9600, #FF6B6B, #FF9600)' }}
            >
              THE DAILY ROOK
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#6b7c8a] italic mt-1">
            Build the Rook. Improve at Chess.
          </span>
        </div>

        <div className="text-[#6b7c8a] text-[10px] mt-1.5">{MOCK_DATE}</div>
        <div className="mt-3"><Rules /></div>

        {/* Card slot */}
        {children}
      </div>

      <div className="flex-1 flex items-center justify-center">
        <RookGrid results={MOCK_RESULTS} blockSize={50} gap={6} />
      </div>

      <div className="py-2 text-center">
        <span className="text-[9px] text-black/15 tracking-wider">chesspath.app</span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// V1: "Left-Right Split"
// Score + label left-aligned, player stats right-aligned, single row
// ═════════════════════════════════════════════════════════════════════════
function Variant1() {
  return (
    <StoryShell>
      <div className="mt-3 w-full rounded-xl px-4 py-3 flex items-center justify-between" style={CARD_STYLE}>
        {/* Left: score */}
        <div>
          <span className="text-3xl font-black text-[#FF9600]">{MOCK_SCORE}</span>
          <div className="text-[11px] font-black text-[#2A3C45] -mt-0.5">puzzles solved!</div>
        </div>
        {/* Right: player info */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[#2A3C45] font-bold text-xs">{MOCK_NAME}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#6b7c8a] text-[11px] font-semibold">{MOCK_TIME}</span>
            <Hearts lives={2} size={11} />
          </div>
          <span className="text-[10px] font-bold text-[#58CC02]">Beat {MOCK_BEAT_PCT}%</span>
        </div>
      </div>
    </StoryShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// V2: "Bold Score + Stacked Right"
// Giant score number left, "puzzles solved!" under it, right column stacked
// ═════════════════════════════════════════════════════════════════════════
function Variant2() {
  return (
    <StoryShell>
      <div className="mt-3 w-full rounded-xl px-4 py-3 flex items-center justify-between" style={CARD_STYLE}>
        {/* Left: big score + label */}
        <div>
          <span className="text-4xl font-black text-[#FF9600] leading-none">{MOCK_SCORE}</span>
          <div className="text-[10px] font-extrabold text-[#2A3C45]/60 mt-0.5">puzzles solved!</div>
        </div>
        {/* Right: stacked stats */}
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[#2A3C45] font-black text-sm">{MOCK_NAME}</span>
          <span className="text-[#6b7c8a] text-[11px] font-bold">{MOCK_TIME}</span>
          <Hearts lives={2} size={12} />
          <span className="text-[10px] font-extrabold text-[#58CC02]">Beat {MOCK_BEAT_PCT}%</span>
        </div>
      </div>
    </StoryShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// V3: "Score + Divider"
// Score left, vertical divider, right side compact
// ═════════════════════════════════════════════════════════════════════════
function Variant3() {
  return (
    <StoryShell>
      <div className="mt-3 w-full rounded-xl px-4 py-3 flex items-center gap-3" style={CARD_STYLE}>
        {/* Left: score block */}
        <div className="text-center">
          <span className="text-3xl font-black text-[#FF9600] leading-none">{MOCK_SCORE}</span>
          <div className="text-[9px] font-extrabold text-[#2A3C45]/50 mt-0.5">SOLVED</div>
        </div>
        {/* Divider */}
        <div className="w-px self-stretch bg-[#dce8f0]" />
        {/* Right: info rows */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[#2A3C45] font-bold text-xs">{MOCK_NAME}</span>
            <Hearts lives={2} size={11} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6b7c8a] text-[11px] font-semibold">{MOCK_TIME}</span>
            <span className="text-[10px] font-bold text-[#58CC02]">Beat {MOCK_BEAT_PCT}%</span>
          </div>
        </div>
      </div>
    </StoryShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// V4: "Two Rows"
// Row 1: score + label left, name + hearts right
// Row 2: beat% left, time right
// ═════════════════════════════════════════════════════════════════════════
function Variant4() {
  return (
    <StoryShell>
      <div className="mt-3 w-full rounded-xl px-4 py-3 flex flex-col gap-1.5" style={CARD_STYLE}>
        {/* Row 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#FF9600]">{MOCK_SCORE}</span>
            <span className="text-[11px] font-black text-[#2A3C45]">puzzles solved!</span>
          </div>
          <Hearts lives={2} size={12} />
        </div>
        {/* Thin divider */}
        <div className="w-full h-px bg-[#eef6fc]" />
        {/* Row 2 */}
        <div className="flex items-center justify-between">
          <span className="text-[#2A3C45] font-bold text-xs">{MOCK_NAME}</span>
          <div className="flex items-center gap-2">
            <span className="text-[#6b7c8a] text-[11px] font-semibold">{MOCK_TIME}</span>
            <span className="text-[10px] font-extrabold text-[#58CC02]">Beat {MOCK_BEAT_PCT}%</span>
          </div>
        </div>
      </div>
    </StoryShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// V5: "Score Badge Left"
// Orange circle badge left with score, right side stacked text
// ═════════════════════════════════════════════════════════════════════════
function Variant5() {
  return (
    <StoryShell>
      <div className="mt-3 w-full rounded-xl px-4 py-3 flex items-center gap-3" style={CARD_STYLE}>
        {/* Left: circle badge */}
        <div
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FF9600, #FF6B6B)',
            boxShadow: '0 3px 0 rgba(204,102,0,0.35)',
          }}
        >
          <span className="text-xl font-black text-white leading-none">{MOCK_SCORE}</span>
          <span className="text-[7px] font-bold text-white/50">SOLVED</span>
        </div>
        {/* Right: stacked info */}
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-[#2A3C45] font-black text-sm">{MOCK_NAME}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#6b7c8a] text-[11px] font-semibold">{MOCK_TIME}</span>
            <Hearts lives={2} size={11} />
          </div>
          <span className="text-[10px] font-extrabold text-[#58CC02]">Beat {MOCK_BEAT_PCT}% of players</span>
        </div>
      </div>
    </StoryShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// TEST PAGE
// ═════════════════════════════════════════════════════════════════════════
const VARIANTS = [
  { name: 'Left-Right Split', component: Variant1 },
  { name: 'Bold + Stack', component: Variant2 },
  { name: 'Score + Divider', component: Variant3 },
  { name: 'Two Rows', component: Variant4 },
  { name: 'Score Badge', component: Variant5 },
];

export default function TestStoryCardsPage() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (selectedIdx !== null) {
    const Variant = VARIANTS[selectedIdx].component;
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-black/80">
          <button onClick={() => setSelectedIdx(null)} className="text-white/60 text-sm font-medium">
            Back
          </button>
          <span className="text-white font-bold text-sm">
            {VARIANTS[selectedIdx].name} — V{selectedIdx + 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
              className="text-white/40 text-sm px-2"
            >
              Prev
            </button>
            <button
              onClick={() => setSelectedIdx(Math.min(VARIANTS.length - 1, selectedIdx + 1))}
              className="text-white/40 text-sm px-2"
            >
              Next
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div
            className="rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
            style={{ width: 360, height: 640 }}
          >
            <Variant />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-black">Daily Rook — Card Layout Variations</h1>
        <p className="text-white/40 text-sm mt-1">
          Same card, 5 different info layouts. Tap to preview full-size.
        </p>
      </div>

      <div className="px-6 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {VARIANTS.map((v, i) => {
            const Comp = v.component;
            return (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className="group relative"
              >
                <div
                  className="rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 group-hover:ring-white/30 transition-all group-hover:scale-[1.02]"
                  style={{ aspectRatio: '9/16' }}
                >
                  <div className="w-full h-full">
                    <Comp />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-white/80 font-bold text-xs">{v.name}</div>
                  <div className="text-white/30 text-[10px]">V{i + 1}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
