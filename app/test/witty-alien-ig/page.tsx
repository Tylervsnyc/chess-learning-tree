'use client';

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

// ── Instagram post (1080 x 1350, 4:5 portrait) ─────────────────────────
// Lists the four Witty Alien trick openings we teach. ChessPath brand style.
// Source of truth: data/openings/registry.ts (witty-alien block).
// Screenshot it, or hit "Download PNG" for a native-resolution export.

const PURPLE = '#8B5CF6';
const PURPLE_DARK = '#6D28D9';

const ROOK_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' }, { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' }, { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' }, { x: 3, y: 2, color: '#A560E8' },
  { x: 1, y: 3, color: '#58CC02' }, { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' }, { x: 3, y: 4, color: '#1CB0F6' },
  { x: 0, y: 5, color: '#2FCBEF' }, { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];

function RookLogo({ size = 26 }: { size?: number }) {
  const spacing = Math.round(size * 1.14);
  return (
    <div style={{ position: 'relative', width: spacing * 4 + size, height: spacing * 5 + size }}>
      {ROOK_BLOCKS.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x * spacing, top: b.y * spacing,
          width: size, height: size, borderRadius: 5,
          background: getMatteBackground(b.color), boxShadow: getMatteBoxShadow(b.color, size / 14),
        }} />
      ))}
    </div>
  );
}

const OPENINGS = [
  {
    n: '1',
    name: 'Alien Gambit',
    quote: 'MY GAMBIT, MY LEGACY',
    blurb: 'The knight sacrifice that started it all.',
  },
  {
    n: '2',
    name: 'Martian Attack',
    quote: 'ARE YOU NOT ENTERTAINED?',
    blurb: 'Pure chaos — throw everything at the king.',
  },
  {
    n: '3',
    name: 'Elephant Gambit',
    quote: 'CHA-KI CHA-KI',
    blurb: 'Offbeat, outrageous, and somehow it works.',
  },
];

export default function WittyAlienIGPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [raw, setRaw] = useState(false);

  useEffect(() => {
    setRaw(new URLSearchParams(window.location.search).has('raw'));
  }, []);

  async function download() {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 1,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'witty-alien-openings.png';
      a.click();
    } finally {
      setBusy(false);
    }
  }

  // Raw mode: native-size card only, for screenshot capture (?raw)
  if (raw) {
    return (
      <div style={{ width: 1080, height: 1350 }}>
        <Card cardRef={cardRef} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-auto bg-slate-100 flex flex-col items-center gap-5 py-8 px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={download}
          disabled={busy}
          className="rounded-xl bg-chess-green px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-chess-green-dark disabled:opacity-50"
        >
          {busy ? 'Rendering…' : 'Download PNG (1080×1350)'}
        </button>
        <span className="text-xs text-slate-500">Instagram 4:5 portrait · screenshot or download</span>
      </div>

      {/* Scaled preview wrapper — card renders at native 1080×1350 */}
      <div style={{ width: 1080 * 0.5, height: 1350 * 0.5 }}>
        <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
          <Card cardRef={cardRef} />
        </div>
      </div>
    </div>
  );
}

function Card({ cardRef }: { cardRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={cardRef}
      id="ig-card"
      style={{
        width: 1080,
        height: 1350,
        display: 'flex',
        flexDirection: 'column',
        padding: 28,
        background: `linear-gradient(150deg, ${PURPLE} 0%, ${PURPLE_DARK} 45%, #4C1D95 100%)`,
        fontFamily: 'var(--font-body), system-ui, sans-serif',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#eef6fc',
          borderRadius: 40,
          padding: '44px 48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* faint knight glyph in the backdrop */}
        <div style={{ position: 'absolute', bottom: -150, left: -60, fontSize: 420, color: 'rgba(139,92,246,0.06)', fontWeight: 900, lineHeight: 1 }}>♞</div>

        {/* Knight mascot reacting (floated top-right) */}
        <div style={{
          position: 'absolute', top: 40, right: 48, zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          {/* speech bubble */}
          <div style={{
            position: 'relative', background: 'white', borderRadius: 24, padding: '16px 30px',
            boxShadow: '0 8px 22px rgba(76,29,149,0.18), 0 0 0 3px rgba(139,92,246,0.07)',
            fontSize: 46, fontWeight: 900, color: PURPLE_DARK, whiteSpace: 'nowrap',
          }}>
            Brilliant! Imor-TAL
            <div style={{
              position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0, borderLeft: '13px solid transparent',
              borderRight: '13px solid transparent', borderTop: '18px solid white',
            }} />
          </div>
          {/* knight */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 220, height: 220, borderRadius: 999, background: 'rgba(139,92,246,0.14)', flexShrink: 0,
          }}>
            <span style={{ display: 'flex', fontSize: 188, lineHeight: 1, color: PURPLE, marginTop: -14 }}>♞</span>
          </div>
        </div>

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <RookLogo size={20} />
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 800, fontSize: 34, color: '#2A3C45' }}>chess</span>
              <span style={{
                fontWeight: 800, fontSize: 34,
                backgroundImage: 'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 45%, #FF6B6B 58%, #1CB0F6 78%, #1CB0F6 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}>path</span>
            </div>
          </div>
        </div>

        {/* Title block */}
        <div style={{ marginTop: 22, position: 'relative' }}>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 900, color: '#2A3C45', letterSpacing: 2, marginLeft: 4 }}>
            THE
          </div>
          <div style={{ display: 'flex', fontSize: 132, fontWeight: 900, color: PURPLE, letterSpacing: -4, lineHeight: 0.92, marginTop: -4 }}>
            WITTY
          </div>
          <div style={{ display: 'flex', fontSize: 132, fontWeight: 900, color: PURPLE, letterSpacing: -4, lineHeight: 0.92 }}>
            ALIEN
          </div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 900, color: '#2A3C45', letterSpacing: -1, lineHeight: 1.05, marginTop: 14 }}>
            Learn his crazy repertoire — <span style={{ color: PURPLE, marginLeft: 12 }}>free</span>
          </div>
          <div style={{ display: 'flex', fontSize: 25, fontWeight: 500, color: '#6b7c8a', marginTop: 14, maxWidth: 900, lineHeight: 1.4 }}>
            Witty Alien is one of the most entertaining streamers alive — original openings, hilarious
            personality. But you could never play them yourself, right? WRONG. Learn his most-played
            openings, pulled straight from his own games (with his blessing :-). Is this not why you are here?
          </div>
        </div>

        {/* Opening cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 26 }}>
          {OPENINGS.map((o) => (
            <div key={o.n} style={{
              display: 'flex', alignItems: 'center', gap: 22,
              background: 'white', borderRadius: 24, padding: '22px 26px',
              boxShadow: '0 6px 18px rgba(76,29,149,0.08), 0 0 0 3px rgba(139,92,246,0.06)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                background: `linear-gradient(150deg, ${PURPLE}, ${PURPLE_DARK})`,
                color: 'white', fontWeight: 900, fontSize: 34,
              }}>
                {o.n}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 6 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: '#2A3C45', letterSpacing: -0.5 }}>{o.name}</span>
                <span style={{ fontSize: 23, fontWeight: 500, color: '#6b7c8a' }}>{o.blurb}</span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', flexShrink: 0, maxWidth: 320,
                background: 'rgba(139,92,246,0.10)', borderRadius: 14, padding: '12px 20px',
                fontSize: 24, fontWeight: 900, color: PURPLE_DARK,
                fontStyle: 'italic', letterSpacing: 0.3, textAlign: 'right',
              }}>
                &ldquo;{o.quote}&rdquo;
              </div>
            </div>
          ))}
        </div>

        {/* CTA footer */}
        <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 30, fontWeight: 900, color: '#2A3C45' }}>Play them today, free.</span>
            <span style={{ fontSize: 25, fontWeight: 800, color: PURPLE, whiteSpace: 'nowrap' }}>chesspath.app/openings/witty-alien</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#58CC02', color: 'white', fontWeight: 900, fontSize: 28,
            padding: '18px 40px', borderRadius: 999,
            boxShadow: '0 5px 0 #46A302',
          }}>
            Start playing →
          </div>
        </div>
      </div>
    </div>
  );
}
