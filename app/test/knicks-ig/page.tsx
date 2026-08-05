'use client';

/* ════════════════════════════════════════════════════════════════════
   KNICKS TAKEOVER — two social cards (1080 × 1350, 4:5 portrait)

   #card-ig — Instagram hype: Rookie went full Knicks for the Finals.
   #card-li — LinkedIn: "shipped while walking my dog" agentic-coding story.

   All facts from the real PR (#19, merged 9:04am ET 2026-06-11):
   8 files, 405 insertions, 233-line voice pack, auto-expires 6/19.
   Brand style matches /test/fable-day.

   Capture: "Download PNG" buttons, or ?raw=ig / ?raw=li for a native
   frame to screenshot via scripts/capture-knicks.mjs.
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';
import { KNICKS_ROOK_BLOCKS, KNICKS_BLUE, KNICKS_ORANGE } from '@/lib/knicks-finals';

const TEXT = '#2A3C45';
const MUTED = '#6b7c8a';
const FAINT = '#94a3b8';
const GREEN = '#58CC02';

// ── Knicks Rookie (the actual in-app block override) ───────────────────
function KnicksRook({ size = 30 }: { size?: number }) {
  const spacing = Math.round(size * 1.14);
  return (
    <div style={{ position: 'relative', width: spacing * 4 + size, height: spacing * 5 + size }}>
      {KNICKS_ROOK_BLOCKS.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x * spacing, top: b.y * spacing,
          width: size, height: size, borderRadius: Math.max(4, size * 0.18),
          background: getMatteBackground(b.color), boxShadow: getMatteBoxShadow(b.color, size / 14),
        }} />
      ))}
    </div>
  );
}

// ── Brand logo (classic rainbow rook + wordmark) ───────────────────────
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
function RookLogo({ size = 13 }: { size?: number }) {
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

function BrandHeader({ badge }: { badge: string }) {
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
        background: KNICKS_BLUE, color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: 1.5,
        padding: '12px 24px', borderRadius: 999, border: `4px solid ${KNICKS_ORANGE}`,
      }}>
        {badge}
      </div>
    </div>
  );
}

// ── Card 1: Instagram hype ─────────────────────────────────────────────
const IG_QUOTES = [
  { who: 'when you walk in', line: '"Let’s play. The Spurs are still finding their car in the MSG parking garage."' },
  { who: 'when she blows a lead', line: '"My lead’s gone. I blew it. I am every Spurs fan at 10pm last night."' },
  { who: 'when you checkmate her', line: '"Checkmate. 1.2 seconds on the clock, OG tips it in, YOU win."' },
];

function IgCard() {
  return (
    <div style={{
      width: 1080, height: 1350, padding: 30, boxSizing: 'border-box',
      background: `linear-gradient(150deg,${KNICKS_BLUE} 0%,#2a5cb8 55%,${KNICKS_ORANGE} 100%)`,
      fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
    }}>
      <div style={{
        width: '100%', height: '100%', background: '#eef6fc', borderRadius: 44,
        padding: '48px 56px 44px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <BrandHeader badge="FINALS TAKEOVER" />

        <h1 style={{ fontSize: 76, fontWeight: 900, color: TEXT, lineHeight: 0.98, letterSpacing: -2.5, margin: '34px 0 0' }}>
          Rookie went<br />
          <span style={{ color: KNICKS_ORANGE }}>full</span> <span style={{ color: KNICKS_BLUE }}>Knicks.</span>
        </h1>
        <p style={{ fontSize: 28, fontWeight: 600, color: MUTED, margin: '14px 0 0', lineHeight: 1.3 }}>
          They came back from 29 down. She took it personally.
        </p>

        {/* Rookie + quotes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 44, marginTop: 36, flex: 1 }}>
          <div style={{ flexShrink: 0, filter: 'drop-shadow(0 18px 30px rgba(29,66,138,0.25))' }}>
            <KnicksRook size={62} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            {IG_QUOTES.map((q) => (
              <div key={q.who} style={{
                background: '#fff', borderRadius: '24px 24px 24px 6px', padding: '20px 26px',
                boxShadow: '0 8px 22px rgba(42,60,69,0.08)', borderLeft: `8px solid ${KNICKS_ORANGE}`,
              }}>
                <div style={{ fontSize: 19, fontWeight: 800, color: KNICKS_BLUE, textTransform: 'uppercase', letterSpacing: 1 }}>{q.who}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: TEXT, lineHeight: 1.25, marginTop: 4 }}>{q.line}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: KNICKS_BLUE, borderRadius: 22, padding: '20px 30px', marginTop: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 27, fontWeight: 900, color: '#fff' }}>Live now through the Finals</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: KNICKS_ORANGE }}>then she goes back to normal. Probably.</span>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: TEXT }}>chesspath.app</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: FAINT }}>the fun way to learn chess</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 800, color: KNICKS_ORANGE, letterSpacing: 2 }}>GO NY GO NY GO</span>
        </div>
      </div>
    </div>
  );
}

// ── Card 2: LinkedIn — built on a dog walk ─────────────────────────────
const SHIP_LIST = [
  { n: '1 prompt', label: 'sent from a sidewalk', color: KNICKS_ORANGE },
  { n: '140+', label: 'new voice lines', color: KNICKS_BLUE },
  { n: '8 files', label: '405 lines of code', color: GREEN },
  { n: '0', label: 'cleanup needed — expires itself 6/19', color: '#A560E8' },
];

function LiCard() {
  return (
    <div style={{
      width: 1080, height: 1350, padding: 30, boxSizing: 'border-box',
      background: `linear-gradient(150deg,${KNICKS_BLUE} 0%,#2a5cb8 55%,${KNICKS_ORANGE} 100%)`,
      fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
    }}>
      <div style={{
        width: '100%', height: '100%', background: '#eef6fc', borderRadius: 44,
        padding: '48px 56px 44px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <BrandHeader badge="BUILT ON A DOG WALK" />

        <h1 style={{ fontSize: 62, fontWeight: 900, color: TEXT, lineHeight: 1.02, letterSpacing: -2, margin: '30px 0 0' }}>
          The Knicks won at midnight.<br />
          My app was a fan by <span style={{ color: KNICKS_ORANGE }}>9:04am.</span>
        </h1>
        <p style={{ fontSize: 27, fontWeight: 600, color: MUTED, margin: '12px 0 0', lineHeight: 1.35 }}>
          I was walking my dog. I typed one idea into my phone and an AI coding
          agent shipped the whole feature — tested, reviewed, live.
        </p>

        {/* The prompt bubble */}
        <div style={{
          alignSelf: 'flex-end', maxWidth: 760, marginTop: 30,
          background: KNICKS_BLUE, color: '#fff', borderRadius: '26px 26px 6px 26px',
          padding: '22px 30px', fontSize: 28, fontWeight: 700, lineHeight: 1.3,
          boxShadow: '0 10px 26px rgba(29,66,138,0.3)',
        }}>
          {'“'}Make Rookie a Knicks fan for the rest of the Finals.{'”'}
        </div>

        {/* Ship stats */}
        <div style={{ display: 'flex', gap: 16, marginTop: 30 }}>
          {SHIP_LIST.map((s) => (
            <div key={s.label} style={{
              flex: 1, background: '#fff', borderRadius: 22, padding: '20px 14px 16px',
              textAlign: 'center', boxShadow: '0 8px 22px rgba(42,60,69,0.08)',
              borderBottom: `6px solid ${s.color}`,
            }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: TEXT, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 19, fontWeight: 700, color: MUTED, marginTop: 6, lineHeight: 1.2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Result: the Knicks rook + a line */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 36, marginTop: 30, flex: 1,
          background: '#fff', borderRadius: 26, padding: '28px 36px',
          boxShadow: '0 8px 22px rgba(42,60,69,0.08)',
        }}>
          <div style={{ flexShrink: 0 }}>
            <KnicksRook size={36} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: KNICKS_BLUE, textTransform: 'uppercase', letterSpacing: 1 }}>
              The result — live right now
            </div>
            <div style={{ fontSize: 27, fontWeight: 700, color: TEXT, lineHeight: 1.3, marginTop: 8 }}>
              Our chess mascot in orange and blue, talking trash about the
              29-point comeback — and the whole thing un-ships itself when the
              Finals end.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: TEXT }}>chesspath.app</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: FAINT }}>the fun way to learn chess</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, color: MUTED }}>
            vibe coded with <ClaudeSpark size={26} /> <span style={{ color: TEXT, fontWeight: 900 }}>Claude Code</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Page shell ─────────────────────────────────────────────────────────
function CardBlock({ title, file, children }: { title: string; file: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function download() {
    if (!ref.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(ref.current, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = file;
      a.click();
    } finally {
      setBusy(false);
    }
  }

  const SCALE = 0.5;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-black text-slate-800">{title}</h2>
        <button
          onClick={download}
          disabled={busy}
          className="rounded-lg bg-chess-green px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-chess-green-dark disabled:opacity-50"
        >
          {busy ? 'Rendering…' : 'Download PNG'}
        </button>
      </div>
      <div style={{ width: 1080 * SCALE, height: 1350 * SCALE, overflow: 'hidden', borderRadius: 14, boxShadow: '0 10px 40px rgba(0,0,0,0.18)', flexShrink: 0 }}>
        <div ref={ref} style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function KnicksIgPage() {
  const [raw, setRaw] = useState<string | null>(null);

  useEffect(() => {
    setRaw(new URLSearchParams(window.location.search).get('raw'));
  }, []);

  if (raw === 'ig') {
    return <div id="card-ig" style={{ width: 1080, height: 1350 }}><IgCard /></div>;
  }
  if (raw === 'li') {
    return <div id="card-li" style={{ width: 1080, height: 1350 }}><LiCard /></div>;
  }

  return (
    <div className="min-h-screen w-full overflow-auto bg-slate-100 py-8 px-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <h1 className="text-2xl font-black text-slate-800">Knicks takeover — social cards</h1>
        <div className="flex flex-wrap justify-center gap-10">
          <CardBlock title="Instagram" file="knicks-takeover-ig.png"><IgCard /></CardBlock>
          <CardBlock title="LinkedIn" file="knicks-dogwalk-li.png"><LiCard /></CardBlock>
        </div>
        <div className="h-24" />
      </div>
    </div>
  );
}
