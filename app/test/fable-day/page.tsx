'use client';

/* ════════════════════════════════════════════════════════════════════
   FABLE LAUNCH DAY — LinkedIn card (1080 × 1350, 4:5 portrait)
   "What we shipped on chesspath.app the day Claude Fable 5 launched."
   All numbers pulled from real git history for 2026-06-09 — no inflation.
   Brand style matches /test/streak-ig.

   Capture: "Download PNG", or ?raw=1 for a native frame (#card) to
   screenshot via scripts/capture-fable-day.mjs.
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

const TEXT = '#2A3C45';
const MUTED = '#6b7c8a';
const FAINT = '#94a3b8';
const GREEN = '#58CC02';
const BLUE = '#1CB0F6';
const YELLOW = '#FFC800';
const ORANGE = '#FF9600';
const RED = '#FF4B4B';
const PURPLE = '#A560E8';

// ── Brand logo (rook block sprite + wordmark) ──────────────────────────
const LOGO_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' }, { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' }, { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' }, { x: 3, y: 2, color: '#A560E8' },
  { x: 1, y: 3, color: '#58CC02' }, { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' }, { x: 3, y: 4, color: '#1CB0F6' },
  { x: 0, y: 5, color: '#2FCBEF' }, { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];
function RookLogo({ size = 14 }: { size?: number }) {
  const spacing = Math.round(size * 1.14);
  return (
    <div style={{ position: 'relative', width: spacing * 4 + size, height: spacing * 5 + size }}>
      {LOGO_BLOCKS.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x * spacing, top: b.y * spacing,
          width: size, height: size, borderRadius: 4,
          background: getMatteBackground(b.color), boxShadow: getMatteBoxShadow(b.color, size / 14),
        }} />
      ))}
    </div>
  );
}

// Anthropic's Claude spark (coral starburst), drawn as SVG spokes.
const SPARK_LENGTHS = [46, 39, 45, 41, 46, 38, 44, 42, 46, 39, 45, 40];
function ClaudeSpark({ size = 30, color = '#D97757' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ flexShrink: 0 }}>
      {SPARK_LENGTHS.map((len, i) => {
        const a = (i / SPARK_LENGTHS.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={Math.cos(a) * 8} y1={Math.sin(a) * 8}
            x2={Math.cos(a) * len} y2={Math.sin(a) * len}
            stroke={color} strokeWidth={11} strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function BrandHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <RookLogo size={13} />
        <div style={{ display: 'flex', alignItems: 'baseline', fontWeight: 800, fontSize: 36, letterSpacing: -0.5 }}>
          <span style={{ color: TEXT }}>chess</span>
          <span style={{
            backgroundImage: 'linear-gradient(90deg,#FFC800,#FF6B6B,#1CB0F6)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>path</span>
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: TEXT, color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: 1.5,
        padding: '12px 24px 12px 18px', borderRadius: 999,
      }}>
        <ClaudeSpark size={32} />
        <span>CLAUDE FABLE 5 · LAUNCH DAY</span>
      </div>
    </div>
  );
}

// ── The card ───────────────────────────────────────────────────────────
const STATS = [
  { n: '36', label: 'commits', color: BLUE },
  { n: '19', label: 'issues closed', color: GREEN },
  { n: '154', label: 'files changed', color: ORANGE },
  { n: '~14k', label: 'lines touched', color: PURPLE },
];

const TIMELINE = [
  {
    time: '10:48', color: BLUE, title: 'Chess Path ELO',
    body: 'A rating that climbs right in the win popup — day-by-day graph and all.',
  },
  {
    time: '12:54', color: RED, title: 'Rookie got a voice transplant',
    body: 'Our AI mascot is now unreasonably invested in YOUR chess. Still a sore loser.',
  },
  {
    time: '13:12', color: YELLOW, title: 'First-rating ceremony',
    body: 'New players get their number revealed like a trophy. Then we ask them to save it.',
  },
  {
    time: '14:29', color: GREEN, title: 'Performance blitz',
    body: '12.4MB of ability art down to 152KB. Roughly 300KB lighter on every page.',
  },
  {
    time: '14:27', color: PURPLE, title: 'A morning-brief bot',
    body: 'It reads 4 daily reports overnight and Slacks me one prioritized plan at 7:30am.',
  },
  {
    time: '15:48', color: ORANGE, title: 'Repaired 68 broken streaks',
    body: 'Found a ghost-streak bug, fixed the data for every affected player.',
  },
];

function FableCard() {
  return (
    <div style={{
      width: 1080, height: 1350, padding: 30, boxSizing: 'border-box',
      background: 'linear-gradient(150deg,#1CB0F6 0%,#A560E8 50%,#FF6B6B 100%)',
      fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
    }}>
      <div style={{
        width: '100%', height: '100%', background: '#eef6fc', borderRadius: 44,
        padding: '48px 56px 44px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <BrandHeader />

        <h1 style={{ fontSize: 64, fontWeight: 900, color: TEXT, lineHeight: 1.0, letterSpacing: -2, margin: '28px 0 0' }}>
          New model day = ship day.
        </h1>
        <p style={{ fontSize: 27, fontWeight: 600, color: MUTED, margin: '10px 0 0', lineHeight: 1.3 }}>
          One workday on chesspath.app with Claude Code, the morning Fable 5 dropped.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              flex: 1, background: '#fff', borderRadius: 22, padding: '18px 10px 14px',
              textAlign: 'center', boxShadow: '0 8px 22px rgba(42,60,69,0.08)',
              borderBottom: `6px solid ${s.color}`,
            }}>
              <div style={{ fontSize: 50, fontWeight: 900, color: TEXT, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: MUTED, marginTop: 5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 18 }}>
          {TIMELINE.map((t) => (
            <div key={t.title} style={{
              display: 'flex', alignItems: 'center', gap: 20, background: '#fff',
              borderRadius: 20, padding: '14px 24px', boxShadow: '0 6px 18px rgba(42,60,69,0.06)',
            }}>
              <div style={{
                flexShrink: 0, width: 90, textAlign: 'center', fontSize: 24, fontWeight: 900,
                color: t.color === YELLOW ? TEXT : '#fff', background: t.color, borderRadius: 12, padding: '7px 0',
              }}>{t.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 27, fontWeight: 900, color: TEXT }}>{t.title}</div>
                <div style={{ fontSize: 21, fontWeight: 500, color: MUTED, marginTop: 1, lineHeight: 1.25 }}>{t.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: TEXT }}>chesspath.app</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: FAINT }}>the fun way to learn chess</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, color: MUTED }}>
            vibe coded with <ClaudeSpark size={26} /> <span style={{ color: TEXT, fontWeight: 900 }}>Claude Fable 5</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FableDayPage() {
  const [raw, setRaw] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setRaw(new URLSearchParams(window.location.search).has('raw'));
  }, []);

  async function download() {
    if (!ref.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(ref.current, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'fable-launch-day.png';
      a.click();
    } finally {
      setBusy(false);
    }
  }

  if (raw) {
    return <div id="card" style={{ width: 1080, height: 1350 }}><FableCard /></div>;
  }

  const SCALE = 0.55;
  return (
    <div className="min-h-screen w-full overflow-auto bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-800">Fable launch day — LinkedIn card</h1>
          <button
            onClick={download}
            disabled={busy}
            className="rounded-lg bg-chess-green px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-chess-green-dark disabled:opacity-50"
          >
            {busy ? 'Rendering…' : 'Download PNG'}
          </button>
          <a href="?raw=1" target="_blank" className="text-xs font-semibold text-chess-blue underline">raw ↗</a>
        </div>
        <div style={{ width: 1080 * SCALE, height: 1350 * SCALE, overflow: 'hidden', borderRadius: 14, boxShadow: '0 10px 40px rgba(0,0,0,0.18)', flexShrink: 0 }}>
          <div ref={ref} style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
            <FableCard />
          </div>
        </div>
        <div className="h-24" />
      </div>
    </div>
  );
}
