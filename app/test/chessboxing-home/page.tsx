'use client';

import { useState } from 'react';
/**
 * Chess Boxing home-screen concepts. Focus: THE LOCKER, animated —
 * door swings open on load, a chess piece moves on the board, gloves
 * swing when tapped. GPT style renders slot in below
 * (scripts/generate-home-concepts.ts).
 */

const NAVY_DEEP = '#101a33';
const RED = '#e5484d';

function Glove({ x, y, s, angle = 0 }: { x: number; y: number; s: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s / 100})`}>
      <rect x={-36} y={-88} width={72} height={68} rx={32} fill={RED} />
      <ellipse cx={32} cy={-38} rx={16} ry={21} fill={RED} />
      <path d="M -24 -74 Q 0 -87 24 -74" stroke="rgba(0,0,0,0.2)" strokeWidth={6} fill="none" strokeLinecap="round" />
      <rect x={-22} y={-24} width={44} height={24} rx={8} fill="#f4f6fb" />
    </g>
  );
}

function Tag({ x, y, text, active }: { x: number; y: number; text: string; active: boolean }) {
  return (
    <g style={{ transition: 'opacity 0.2s', opacity: active ? 1 : 0.75 }}>
      <rect x={x - 26} y={y - 9} width={52} height={18} rx={9} fill={active ? RED : 'rgba(0,0,0,0.55)'} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={9.5} fontWeight={800} fill="#fff"
        style={{ fontFamily: 'inherit', letterSpacing: 1 }}>{text}</text>
    </g>
  );
}

const LOCKER_KEYFRAMES = `
  @keyframes lockerDoorOpen {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(-108deg); }
  }
  @keyframes lockerInteriorLight {
    0% { filter: brightness(0.45); }
    100% { filter: brightness(1); }
  }
  @keyframes gloveIdleSway {
    0%, 100% { transform: rotate(-1.6deg); }
    50% { transform: rotate(1.6deg); }
  }
  @keyframes glovePunchSwing {
    0% { transform: rotate(0deg); }
    18% { transform: rotate(13deg); }
    42% { transform: rotate(-10deg); }
    64% { transform: rotate(6deg); }
    82% { transform: rotate(-3deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes piecePatrol {
    0%, 14% { transform: translate(0, 0); }
    18% { transform: translate(0, -4px); }
    24% { transform: translate(22px, -4px); }
    28%, 60% { transform: translate(22px, 0); }
    64% { transform: translate(22px, -4px); }
    70% { transform: translate(0, -4px); }
    74%, 100% { transform: translate(0, 0); }
  }
  @keyframes pieceNod {
    0%, 86%, 100% { transform: translate(0, 0); }
    90% { transform: translate(0, -2.5px); }
    94% { transform: translate(0, 0); }
  }
`;

// ─── The Locker, animated ───
function AnimatedLocker() {
  const [hover, setHover] = useState<'fight' | 'train' | null>(null);
  const [punchId, setPunchId] = useState(0);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '200 / 260' }}>
      <style>{LOCKER_KEYFRAMES}</style>

      {/* interior (lights up as door opens) */}
      <svg viewBox="0 0 200 260" width="100%" style={{ display: 'block', animation: 'lockerInteriorLight 0.9s ease-out 0.5s both' }}>
        <rect width={200} height={260} fill="#232c42" />
        <rect width={200} height={70} fill="#1c2438" />
        {/* locker body */}
        <rect x={30} y={20} width={140} height={228} rx={6} fill="#3c4a6b" />
        <rect x={30} y={20} width={140} height={228} rx={6} fill="none" stroke="#2a3552" strokeWidth={3} />
        <rect x={36} y={140} width={128} height={5} fill="#2a3552" />

        {/* gloves hanging from hook (FIGHT) — idle sway + punch swing on tap */}
        <g
          onMouseEnter={() => setHover('fight')} onMouseLeave={() => setHover(null)}
          onClick={() => setPunchId((p) => p + 1)}
          style={{ cursor: 'pointer', transition: 'filter 0.2s', filter: hover === 'fight' ? 'brightness(1.25)' : 'none' }}
        >
          <circle cx={100} cy={62} r={3} fill="#8d99b5" />
          <g
            key={punchId}
            style={{
              transformOrigin: '100px 62px',
              animation: punchId > 0
                ? 'glovePunchSwing 1.1s cubic-bezier(0.22, 1, 0.36, 1)'
                : 'gloveIdleSway 3.4s ease-in-out 1.6s infinite',
            }}
          >
            <line x1={100} y1={62} x2={92} y2={78} stroke="#8d99b5" strokeWidth={2} />
            <line x1={100} y1={62} x2={108} y2={78} stroke="#8d99b5" strokeWidth={2} />
            <Glove x={88} y={128} s={52} angle={-8} />
            <Glove x={112} y={130} s={52} angle={10} />
          </g>
          <Tag x={100} y={152} text="FIGHT" active={hover === 'fight'} />
        </g>

        {/* chess set on shelf (TRAIN) — one piece patrols, another nods */}
        <g
          onMouseEnter={() => setHover('train')} onMouseLeave={() => setHover(null)}
          style={{ cursor: 'pointer', transition: 'filter 0.2s', filter: hover === 'train' ? 'brightness(1.25)' : 'none' }}
        >
          {(() => {
            const bx = 56; const by = 172; const w = 88; const sq = w / 4;
            return (
              <g>
                <rect x={bx - 2} y={by - 2} width={w + 4} height={w * 0.62 + 4} rx={2} fill="#6b4a2f" />
                {Array.from({ length: 8 }, (_, i) => {
                  const cx = i % 4;
                  const cy = Math.floor(i / 4);
                  return (
                    <rect key={i} x={bx + cx * sq} y={by + cy * sq * 0.62} width={sq} height={sq * 0.62}
                      fill={(cx + cy) % 2 === 0 ? '#b58863' : '#f0d9b5'} />
                  );
                })}
                {/* white piece patrols two squares */}
                <g style={{ animation: 'piecePatrol 7s ease-in-out 2s infinite' }}>
                  <ellipse cx={bx + 0.6 * sq} cy={by - 1} rx={2.6} ry={1.2} fill="#e8e4da" />
                  <rect x={bx + 0.6 * sq - 1.6} y={by - 9} width={3.2} height={8.5} rx={1.4} fill="#e8e4da" />
                  <circle cx={bx + 0.6 * sq} cy={by - 10} r={2} fill="#e8e4da" />
                </g>
                {/* black piece nods back */}
                <g style={{ animation: 'pieceNod 7s ease-in-out 2s infinite' }}>
                  <ellipse cx={bx + 3.1 * sq} cy={by - 1} rx={2.6} ry={1.2} fill="#22293a" />
                  <rect x={bx + 3.1 * sq - 1.6} y={by - 9} width={3.2} height={8.5} rx={1.4} fill="#22293a" />
                  <circle cx={bx + 3.1 * sq} cy={by - 10} r={2} fill="#22293a" />
                </g>
              </g>
            );
          })()}
          <Tag x={100} y={224} text="TRAIN" active={hover === 'train'} />
        </g>

        {/* bottom dressing */}
        <ellipse cx={58} cy={240} rx={13} ry={5} fill="#e8e4da" />
        <ellipse cx={58} cy={236} rx={9} ry={3.5} fill="#d6d0c2" />
        <rect x={140} y={230} width={9} height={16} rx={3} fill={RED} />
      </svg>

      {/* the DOOR — HTML overlay so it can swing in 3D */}
      <div style={{ position: 'absolute', inset: 0, perspective: '700px', pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            left: '15%', top: '7.7%', width: '70%', height: '87.7%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            animation: 'lockerDoorOpen 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0.5s both',
          }}
        >
          {/* front face (closed locker) */}
          <div
            style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              background: 'linear-gradient(105deg, #4a5a80 0%, #3c4a6b 55%, #33405e 100%)',
              borderRadius: 6, border: '2px solid #2a3552',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            {/* vents */}
            <div style={{ marginTop: '9%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 44, height: 4, borderRadius: 2, background: '#2a3552' }} />
              ))}
            </div>
            {/* handle */}
            <div style={{ position: 'absolute', right: '9%', top: '46%', width: 7, height: 26, borderRadius: 4, background: '#8d99b5' }} />
            {/* nameplate */}
            <div style={{ position: 'absolute', top: '30%', padding: '3px 10px', borderRadius: 4, background: '#2a3552', color: '#c9d4ea', fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>
              YOU
            </div>
          </div>
          {/* back face (inside of door, tally-mark streak) */}
          <div
            style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: '#465579', borderRadius: 6, border: '2px solid #2a3552',
            }}
          >
            <svg viewBox="0 0 140 228" width="100%" height="100%">
              <g stroke="#c9d4ea" strokeWidth={2} strokeLinecap="round" opacity={0.9}>
                {[0, 1, 2, 3].map((i) => <line key={i} x1={46 + i * 9} y1={40} x2={46 + i * 9} y2={68} />)}
                <line x1={40} y1={68} x2={80} y2={40} />
                {[0, 1].map((i) => <line key={`b${i}`} x1={46 + i * 9} y1={86} x2={46 + i * 9} y2={114} />)}
              </g>
              <text x={70} y={140} textAnchor="middle" fontSize={11} fontWeight={800} fill="#c9d4ea" opacity={0.7} style={{ letterSpacing: 1 }}>
                DAY 6
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

const STYLES = ['flat', 'render3d', 'realistic'] as const;
const SCENES = ['locker', 'corner'] as const;

export default function ChessBoxingHomePage() {
  const [replayId, setReplayId] = useState(0);
  return (
    <div className="h-full overflow-auto bg-[#0f1524] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold">Chess Boxing — home: The Locker (animated)</h1>
        <p className="mt-1 text-sm text-white/60">
          Door swings open on load (tally streak inside), a piece patrols the board, tap the gloves to swing them.
        </p>
        <button
          onClick={() => setReplayId((r) => r + 1)}
          className="mt-4 rounded-lg bg-[#e5484d] px-4 py-2 text-sm font-semibold hover:brightness-110"
        >
          Replay door
        </button>

        <div className="mx-auto mt-6 max-w-[340px] overflow-hidden rounded-2xl ring-1 ring-white/10">
          <AnimatedLocker key={replayId} />
        </div>

        <h2 className="mt-14 text-lg font-bold">Locker v2 — GPT redraw of the vector scene (same vibe, more detail)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {['ref', '1', '2', '3'].map((v) => (
            <div key={v}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/test-assets/home-locker-v2-${v}.png`}
                alt={`locker v2 ${v}`}
                className="w-full rounded-xl bg-white/5 ring-1 ring-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
              />
              <div className="mt-1 text-center text-xs text-white/40">{v === 'ref' ? 'reference (vector)' : `redraw ${v}`}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-lg font-bold">GPT style explorations</h2>
        <p className="mt-1 text-sm text-white/60">
          Generated by <code className="rounded bg-white/10 px-1.5 py-0.5">scripts/generate-home-concepts.ts</code>.
        </p>
        <div className="mt-6 space-y-8">
          {SCENES.map((scene) => (
            <div key={scene}>
              <h3 className="font-semibold capitalize">{scene}</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {STYLES.map((style) => (
                  <div key={style}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/test-assets/home-${scene}-${style}.png`}
                      alt={`${scene} ${style}`}
                      className="w-full rounded-xl bg-white/5 ring-1 ring-white/10"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
                    />
                    <div className="mt-1 text-center text-xs text-white/40">{style}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
