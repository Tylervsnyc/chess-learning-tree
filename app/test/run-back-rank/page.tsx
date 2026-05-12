'use client';

import { useState } from 'react';

type Option = {
  id: string;
  name: string;
  blurb: string;
  squareStyle: (file: number) => React.CSSProperties;
  // Row-spanning overlay — drawn once across all 8 goal squares so sparkles
  // don't tile/repeat per square.
  rowOverlay?: React.ReactNode;
  css?: string;
};

// Pre-computed scattered sparkle positions — non-uniform, varied sizes/timing.
// Each entry is [left%, top%, size px, delayS, durS].
const SCATTER: Array<[number, number, number, number, number]> = [
  [3, 60, 2, 0.0, 2.1], [9, 22, 3, 1.3, 2.8], [14, 78, 2, 0.6, 1.9],
  [18, 38, 4, 2.0, 3.1], [23, 12, 2, 0.9, 2.4], [27, 65, 3, 1.6, 2.6],
  [33, 42, 2, 0.3, 2.0], [38, 88, 3, 2.2, 3.0], [42, 18, 5, 0.5, 3.4],
  [47, 55, 2, 1.1, 2.2], [52, 30, 3, 1.8, 2.7], [57, 72, 2, 0.4, 1.8],
  [62, 8, 3, 2.4, 2.9], [66, 48, 4, 0.7, 3.2], [71, 82, 2, 1.4, 2.3],
  [75, 25, 3, 2.1, 2.8], [79, 60, 2, 0.8, 2.0], [84, 15, 4, 1.5, 3.0],
  [88, 70, 3, 0.2, 2.5], [93, 40, 2, 1.9, 2.4], [97, 85, 3, 1.0, 2.6],
];

const OPTIONS: Option[] = [
  {
    id: 'enchanted-dawn',
    name: '1 — Enchanted Dawn',
    blurb: 'Soft golden sunrise wash with drifting motes — dawn at the edge of the world.',
    squareStyle: () => ({
      background: 'linear-gradient(180deg, #fff1b8 0%, #ffd56a 45%, #e89c1a 100%)',
      boxShadow: 'inset 0 0 0 1px rgba(255,245,200,0.5)',
    }),
    rowOverlay: (
      <>
        <div className="rr-haze" />
        {SCATTER.map((s, i) => (
          <span
            key={i}
            className="rr-mote"
            style={{
              left: `${s[0]}%`,
              top: `${s[1]}%`,
              width: s[2],
              height: s[2],
              animationDelay: `${s[3]}s`,
              animationDuration: `${s[4] + 2}s`,
            }}
          />
        ))}
      </>
    ),
    css: `
      .rr-haze {
        position: absolute; inset: 0; pointer-events: none;
        background:
          radial-gradient(ellipse at 30% 50%, rgba(255,255,220,0.45), transparent 55%),
          radial-gradient(ellipse at 75% 40%, rgba(255,220,150,0.4), transparent 60%);
        mix-blend-mode: screen;
      }
      .rr-mote {
        position: absolute; border-radius: 50%;
        background: rgba(255,255,255,0.95);
        box-shadow: 0 0 8px 2px rgba(255,240,180,0.9);
        animation: rr-drift ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes rr-drift {
        0%, 100% { opacity: 0; transform: translate(0,0) scale(0.5); }
        50%      { opacity: 1; transform: translate(4px,-6px) scale(1); }
      }
    `,
  },
  {
    id: 'fairy-dust',
    name: '2 — Fairy Dust',
    blurb: 'Deep gold with a cloud of varied sparkles — some tiny, some bursting. Scattered, not gridded.',
    squareStyle: () => ({
      background: 'linear-gradient(180deg, #ffd86b 0%, #e8a420 55%, #9c5e0c 100%)',
      boxShadow: 'inset 0 0 18px rgba(180,100,20,0.45)',
    }),
    rowOverlay: (
      <>
        {SCATTER.map((s, i) => {
          const isBig = i % 4 === 0;
          return (
            <span
              key={i}
              className="rr-spark"
              style={{
                left: `${s[0]}%`,
                top: `${s[1]}%`,
                width: isBig ? s[2] * 2.2 : s[2],
                height: isBig ? s[2] * 2.2 : s[2],
                animationDelay: `${s[3]}s`,
                animationDuration: `${s[4]}s`,
                boxShadow: isBig
                  ? '0 0 10px 3px rgba(255,235,160,1), 0 0 22px 6px rgba(255,200,100,0.5)'
                  : '0 0 4px 1px rgba(255,235,160,0.95)',
              }}
            />
          );
        })}
      </>
    ),
    css: `
      .rr-spark {
        position: absolute; border-radius: 50%;
        background: #fffce0;
        animation: rr-twinkle-v ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes rr-twinkle-v {
        0%, 100% { opacity: 0.1; transform: scale(0.4); }
        50%      { opacity: 1;   transform: scale(1.2); }
      }
    `,
  },
  {
    id: 'aurora',
    name: '3 — Aurora Veil',
    blurb: 'Gold base with a slow shifting pastel veil + a few rare big sparkles. Magical, not busy.',
    squareStyle: () => ({
      background: 'linear-gradient(180deg, #ffe07a 0%, #f0b020 50%, #c47808 100%)',
    }),
    rowOverlay: (
      <>
        <div className="rr-aurora" />
        {SCATTER.filter((_, i) => i % 5 === 0).map((s, i) => (
          <span
            key={i}
            className="rr-star-big"
            style={{
              left: `${s[0]}%`,
              top: `${s[1]}%`,
              animationDelay: `${s[3]}s`,
            }}
          />
        ))}
      </>
    ),
    css: `
      .rr-aurora {
        position: absolute; inset: -10%; pointer-events: none;
        background:
          radial-gradient(ellipse 40% 80% at 20% 50%, rgba(180,230,255,0.35), transparent 70%),
          radial-gradient(ellipse 50% 80% at 60% 50%, rgba(255,200,230,0.3), transparent 70%),
          radial-gradient(ellipse 40% 80% at 90% 50%, rgba(255,250,180,0.35), transparent 70%);
        mix-blend-mode: screen;
        animation: rr-aurora-shift 7s ease-in-out infinite alternate;
      }
      @keyframes rr-aurora-shift {
        0%   { transform: translateX(-6%); filter: hue-rotate(0deg); }
        100% { transform: translateX(6%);  filter: hue-rotate(30deg); }
      }
      .rr-star-big {
        position: absolute; width: 6px; height: 6px; border-radius: 50%;
        background: white;
        box-shadow: 0 0 14px 3px rgba(255,240,180,1), 0 0 28px 6px rgba(255,200,100,0.6);
        animation: rr-big-twinkle 3s ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes rr-big-twinkle {
        0%, 100% { opacity: 0; transform: scale(0.3); }
        50%      { opacity: 1; transform: scale(1.3); }
      }
    `,
  },
  {
    id: 'starfield',
    name: '4 — Starfield Horizon',
    blurb: 'Twilight gold fading darker at top, dense scattered stars — stepping into a magical sky.',
    squareStyle: () => ({
      background: 'linear-gradient(180deg, #6b4a1a 0%, #c4861f 35%, #f5c14a 75%, #ffe88a 100%)',
    }),
    rowOverlay: (
      <>
        {SCATTER.map((s, i) => (
          <span
            key={i}
            className="rr-pin"
            style={{
              left: `${s[0]}%`,
              top: `${s[1] * 0.6}%`,
              width: s[2],
              height: s[2],
              animationDelay: `${s[3]}s`,
              animationDuration: `${s[4] * 1.4}s`,
            }}
          />
        ))}
        {SCATTER.filter((_, i) => i % 7 === 0).map((s, i) => (
          <span
            key={`b${i}`}
            className="rr-pin-big"
            style={{
              left: `${(s[0] + 5) % 100}%`,
              top: `${s[1] * 0.5}%`,
              animationDelay: `${s[3] + 1}s`,
            }}
          />
        ))}
      </>
    ),
    css: `
      .rr-pin {
        position: absolute; border-radius: 50%;
        background: white;
        box-shadow: 0 0 4px 1px rgba(255,250,220,0.9);
        animation: rr-pin-twk ease-in-out infinite;
        pointer-events: none;
      }
      .rr-pin-big {
        position: absolute; width: 5px; height: 5px; border-radius: 50%;
        background: white;
        box-shadow: 0 0 10px 2px rgba(255,235,160,1), 0 0 20px 4px rgba(255,180,80,0.7);
        animation: rr-pin-big-twk 3.5s ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes rr-pin-twk {
        0%, 100% { opacity: 0.15; }
        50%      { opacity: 1; }
      }
      @keyframes rr-pin-big-twk {
        0%, 100% { opacity: 0.2; transform: scale(0.6); }
        50%      { opacity: 1;   transform: scale(1.2); }
      }
    `,
  },
  {
    id: 'enchanted-grove',
    name: '5 — Enchanted Grove',
    blurb: 'Warm honey gold with rising fireflies and soft bokeh blobs — alive, lived-in magic.',
    squareStyle: () => ({
      background: 'radial-gradient(ellipse at 50% 90%, #ffd76a 0%, #d4901a 55%, #6b3a08 100%)',
    }),
    rowOverlay: (
      <>
        <div className="rr-bokeh-a" />
        <div className="rr-bokeh-b" />
        {SCATTER.filter((_, i) => i % 2 === 0).map((s, i) => (
          <span
            key={i}
            className="rr-firefly"
            style={{
              left: `${s[0]}%`,
              animationDelay: `${s[3]}s`,
              animationDuration: `${3 + (i % 4) * 0.6}s`,
            }}
          />
        ))}
      </>
    ),
    css: `
      .rr-bokeh-a, .rr-bokeh-b {
        position: absolute; inset: 0; pointer-events: none;
        mix-blend-mode: screen;
      }
      .rr-bokeh-a {
        background:
          radial-gradient(circle 8px at 18% 35%, rgba(255,230,150,0.7), transparent 70%),
          radial-gradient(circle 12px at 47% 60%, rgba(255,220,140,0.6), transparent 70%),
          radial-gradient(circle 6px at 72% 25%, rgba(255,240,180,0.8), transparent 70%),
          radial-gradient(circle 10px at 88% 70%, rgba(255,225,150,0.65), transparent 70%);
        filter: blur(1px);
        animation: rr-bokeh-shift 5s ease-in-out infinite alternate;
      }
      .rr-bokeh-b {
        background:
          radial-gradient(circle 5px at 30% 70%, rgba(255,255,220,0.85), transparent 70%),
          radial-gradient(circle 7px at 60% 30%, rgba(255,240,180,0.75), transparent 70%);
        filter: blur(0.5px);
        animation: rr-bokeh-shift 6s ease-in-out infinite alternate-reverse;
      }
      @keyframes rr-bokeh-shift {
        0%   { opacity: 0.4; transform: translateY(0); }
        100% { opacity: 1;   transform: translateY(-4px); }
      }
      .rr-firefly {
        position: absolute; bottom: -2px;
        width: 3px; height: 3px; border-radius: 50%;
        background: #fffbcc;
        box-shadow: 0 0 8px 2px rgba(255,230,140,1);
        animation: rr-firefly-rise ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes rr-firefly-rise {
        0%   { transform: translate(0, 0); opacity: 0; }
        20%  { opacity: 1; }
        50%  { transform: translate(6px, -50%); }
        100% { transform: translate(-4px, -120%); opacity: 0; }
      }
    `,
  },
];

const LIGHT = '#f0d9b5';
const DARK = '#b58863';

function MiniBoard({ option }: { option: Option }) {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        width: '100%',
        maxWidth: 360,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
      }}
    >
      {option.css ? <style>{option.css}</style> : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
        }}
      >
        {Array.from({ length: 64 }).map((_, idx) => {
          const row = Math.floor(idx / 8);
          const file = idx % 8;
          const isGoal = row === 0;
          const isLight = (row + file) % 2 === 0;
          const base: React.CSSProperties = isGoal
            ? option.squareStyle(file)
            : { background: isLight ? LIGHT : DARK };
          return <div key={idx} style={base} />;
        })}
      </div>
      {/* Row overlay: positioned over the top 1/8 of the board, spans full width
          so sparkles don't tile per square. */}
      {option.rowOverlay ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '12.5%',
            pointerEvents: 'none',
          }}
        >
          {option.rowOverlay}
        </div>
      ) : null}
    </div>
  );
}

export default function RunBackRankTestPage() {
  const [pick, setPick] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full overflow-auto bg-stone-900 text-stone-100">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-2xl font-bold mb-1">Rookie&apos;s Run — Back Rank Designs v2</h1>
        <p className="text-stone-400 mb-8">
          Five magical-land treatments for the goal rank. Sparkles span the full row (not tile-repeated).
          Tap one to mark your pick.
        </p>

        <div className="grid gap-8 sm:grid-cols-2">
          {OPTIONS.map((opt) => {
            const selected = pick === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setPick(opt.id)}
                className={`text-left rounded-2xl p-4 transition-all ${
                  selected
                    ? 'bg-amber-500/15 ring-2 ring-amber-400'
                    : 'bg-stone-800/60 hover:bg-stone-800 ring-1 ring-stone-700'
                }`}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-lg font-semibold">{opt.name}</h2>
                  {selected ? (
                    <span className="text-xs uppercase tracking-wider text-amber-300">Picked</span>
                  ) : null}
                </div>
                <MiniBoard option={opt} />
                <p className="text-sm text-stone-400 mt-3">{opt.blurb}</p>
              </button>
            );
          })}
        </div>

        {pick ? (
          <div className="mt-10 rounded-xl bg-amber-500/10 ring-1 ring-amber-400/40 p-4 text-sm">
            You picked <span className="font-semibold text-amber-200">{pick}</span>. Tell Claude to
            apply this to <code>components/run/Board.tsx</code>.
          </div>
        ) : null}
      </div>
    </div>
  );
}
