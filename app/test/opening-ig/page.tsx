'use client';

/* ════════════════════════════════════════════════════════════════════
   OPENING SPARRING — Instagram card (1080 × 1350, 4:5 portrait)
   "Learn an opening, then play Rookie — she plays YOUR opening back."
   Brand style matches /test/fable-day and /test/streak-ig.

   Capture: "Download PNG", or ?raw=1 for a native frame (#card).
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { defaultPieces } from 'react-chessboard';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

const TEXT = '#2A3C45';
const MUTED = '#6b7c8a';
const FAINT = '#94a3b8';
const GREEN = '#58CC02';
const BLUE = '#1CB0F6';
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
        background: GREEN, color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: 1.5,
        padding: '12px 26px', borderRadius: 999, boxShadow: '0 6px 16px rgba(88,204,2,0.35)',
      }}>
        100% FREE
      </div>
    </div>
  );
}

// ── Static board from FEN (Italian Game after 3.Bc4) ──────────────────
const ITALIAN_FEN = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R';
const LIGHT_SQ = '#edeed1';
const DARK_SQ = '#779952';
const LAST_MOVE = ['f1', 'c4']; // Rookie's last move: the Italian bishop

function fenToGrid(fen: string): (string | null)[][] {
  return fen.split('/').map((rank) => {
    const row: (string | null)[] = [];
    for (const ch of rank) {
      if (/\d/.test(ch)) for (let i = 0; i < Number(ch); i++) row.push(null);
      else row.push((ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase());
    }
    return row;
  });
}

function StaticBoard({ size = 560 }: { size?: number }) {
  const grid = fenToGrid(ITALIAN_FEN);
  const sq = size / 8;
  return (
    <div style={{
      width: size, height: size, borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 14px 36px rgba(42,60,69,0.18)', flexShrink: 0,
      display: 'grid', gridTemplateColumns: `repeat(8, ${sq}px)`,
    }}>
      {grid.flatMap((row, r) =>
        row.map((piece, c) => {
          const square = 'abcdefgh'[c] + (8 - r);
          const isDark = (r + c) % 2 === 1;
          const highlighted = LAST_MOVE.includes(square);
          const Piece = piece ? defaultPieces[piece] : null;
          return (
            <div key={square} style={{
              width: sq, height: sq, position: 'relative',
              background: isDark ? DARK_SQ : LIGHT_SQ,
            }}>
              {highlighted && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,200,0,0.5)' }} />
              )}
              {Piece && (
                <div style={{ position: 'absolute', inset: sq * 0.04 }}>
                  <Piece svgStyle={{ width: '100%', height: '100%' }} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── Steps ──────────────────────────────────────────────────────────────
const STEPS = [
  { n: '1', color: GREEN, title: 'Learn an opening', body: 'Real lines and variations, move by move.' },
  { n: '2', color: BLUE, title: 'Challenge Rookie', body: 'Hit Play and pick your color.' },
  { n: '3', color: PURPLE, title: 'She plays it back', body: 'Your latest opening — until you own it.' },
];

// ── The card ───────────────────────────────────────────────────────────
function OpeningCard() {
  return (
    <div style={{
      width: 1080, height: 1350, padding: 30, boxSizing: 'border-box',
      background: 'linear-gradient(150deg,#58CC02 0%,#1CB0F6 50%,#A560E8 100%)',
      fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
    }}>
      <div style={{
        width: '100%', height: '100%', background: '#eef6fc', borderRadius: 44,
        padding: '48px 56px 44px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <BrandHeader />

        <div style={{ fontSize: 21, fontWeight: 800, color: BLUE, letterSpacing: 3.5, margin: '30px 0 0' }}>
          PART 01
        </div>
        <h1 style={{ fontSize: 72, fontWeight: 900, color: TEXT, lineHeight: 1.02, letterSpacing: -2.5, margin: '10px 0 0' }}>
          How you actually improve
        </h1>
        <p style={{ fontSize: 34, fontWeight: 800, color: MUTED, margin: '16px 0 0', lineHeight: 1.25 }}>
          Whatever you study, Rookie plays it with you.
        </p>

        {/* Steps row */}
        <div style={{ display: 'flex', gap: 16, marginTop: 26 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{
              flex: 1, background: '#fff', borderRadius: 22, padding: '18px 20px 16px',
              boxShadow: '0 8px 22px rgba(42,60,69,0.08)', borderBottom: `6px solid ${s.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: s.color, color: '#fff',
                  fontSize: 24, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.n}</div>
                <div style={{ fontSize: 25, fontWeight: 900, color: TEXT }}>{s.title}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: MUTED, marginTop: 8, lineHeight: 1.25 }}>{s.body}</div>
            </div>
          ))}
        </div>

        {/* Hero: board + lesson card + Rookie bubble */}
        <div style={{ display: 'flex', gap: 26, marginTop: 28, alignItems: 'center' }}>
          <StaticBoard size={540} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Your last lesson */}
            <div style={{
              background: '#fff', borderRadius: 22, padding: '22px 26px',
              boxShadow: '0 8px 22px rgba(42,60,69,0.08)',
            }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: FAINT, letterSpacing: 2 }}>YOUR LAST LESSON</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: TEXT, marginTop: 4 }}>Italian Game</div>
              <div style={{
                display: 'flex', gap: 10, marginTop: 12, fontSize: 22, fontWeight: 800, color: TEXT, flexWrap: 'wrap',
              }}>
                {['1. e4 e5', '2. Nf3 Nc6', '3. Bc4'].map((m) => (
                  <span key={m} style={{ background: '#eef6fc', borderRadius: 10, padding: '6px 12px' }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Rookie speech bubble */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
              <RookLogo size={11} />
              <div style={{
                flex: 1, background: TEXT, color: '#fff', borderRadius: '22px 22px 22px 6px',
                padding: '20px 24px', fontSize: 25, fontWeight: 700, lineHeight: 1.3,
                boxShadow: '0 8px 22px rgba(42,60,69,0.18)',
              }}>
                The Italian? I&apos;ve been waiting all day to play this with you.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 14, marginTop: 'auto',
        }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: TEXT }}>chesspath.app</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: MUTED }}>· the fun way to learn chess</span>
        </div>
      </div>
    </div>
  );
}

export default function OpeningIgPage() {
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
      a.download = 'opening-sparring-ig.png';
      a.click();
    } finally {
      setBusy(false);
    }
  }

  if (raw) {
    return <div id="card" style={{ width: 1080, height: 1350 }}><OpeningCard /></div>;
  }

  const SCALE = 0.55;
  return (
    <div className="min-h-screen w-full overflow-auto bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-800">Opening sparring — IG card</h1>
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
            <OpeningCard />
          </div>
        </div>
        <div className="h-24" />
      </div>
    </div>
  );
}
