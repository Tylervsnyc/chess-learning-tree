'use client';

import { useState, useEffect, useRef } from 'react';
import { ROOK_BLOCKS, getMatteBackground } from '@/lib/daily-rook-blocks';

/* ════════════════════════════════════════════════════════════════════
   STREAK WINDOW — 5 DESIGNS, REAL FIRE
   Two fire engines:
   • <TurbFlame/>  — SVG feTurbulence + feDisplacementMap. Animated Perlin
                     noise distorts a flame shape so it licks & dances.
   • <BlobFlame/>  — layered blurred CSS teardrops (classic candle flame).
   Data shape matches profile: { current, longest, completedToday }
   Tokens: page #eef6fc · surface #fff · text #2A3C45 · orange #FF9500
   ════════════════════════════════════════════════════════════════════ */

type StreakProps = { current: number; longest: number; done: boolean };

/* ─────────────────────────────────────────────────────────────────────
   FIRE ENGINE A — TurbFlame (the realistic one)
   Unique `id` per instance so filters don't collide.
   ───────────────────────────────────────────────────────────────────── */
function TurbFlame({
  id,
  size = 64,
  active = true,
  intensity = 26,
}: {
  id: string;
  size?: number;
  active?: boolean;
  intensity?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 100 125"
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="80%" r="62%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="26%" stopColor="#ffd24d" />
          <stop offset="58%" stopColor="#ff8a00" />
          <stop offset="100%" stopColor="#e22a00" />
        </radialGradient>
        <filter id={`${id}-fire`} x="-70%" y="-70%" width="240%" height="240%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.016 0.04"
            numOctaves="3"
            seed="7"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="5.5s"
              values="0.016 0.04; 0.02 0.06; 0.016 0.04"
              repeatCount="indefinite"
            />
            <animate
              attributeName="seed"
              dur="2.4s"
              values="1; 9; 1"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={intensity}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* soft glow */}
      {active && (
        <ellipse
          cx="50"
          cy="78"
          rx="26"
          ry="34"
          fill="#ff8a00"
          opacity="0.35"
          filter={`url(#${id}-glow)`}
        />
      )}

      {/* outer flame */}
      <g filter={active ? `url(#${id}-fire)` : undefined}>
        <path
          d="M50 6 C60 38 84 50 84 84 a34 34 0 0 1 -68 0 C16 56 32 52 37 34 c5 11 2 20 9 24 C51 50 43 28 50 6 Z"
          fill={active ? `url(#${id}-core)` : '#cbd5e1'}
        />
        {/* inner bright core */}
        {active && (
          <path
            d="M50 44 C55 60 64 64 64 82 a14 14 0 0 1 -28 0 C36 70 44 64 50 44 Z"
            fill="#fff3b0"
            opacity="0.9"
          />
        )}
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   FIRE ENGINE B — BlobFlame (layered blurred teardrops)
   ───────────────────────────────────────────────────────────────────── */
function BlobFlame({ size = 64, active = true }: { size?: number; active?: boolean }) {
  if (!active) {
    return (
      <div style={{ width: size, height: size }} className="flex items-end justify-center">
        <div
          className="bg-slate-300"
          style={{
            width: size * 0.5,
            height: size * 0.62,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}
        />
      </div>
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-end justify-center"
    >
      {/* base glow */}
      <div
        className="absolute bottom-1 rounded-full bg-orange-500/30 blur-md animate-[glowpulse_1.4s_ease-in-out_infinite]"
        style={{ width: size * 0.7, height: size * 0.5 }}
      />
      {[
        { c: '#e22a00', w: 0.62, h: 0.92, b: 'blur-[2px]', d: '0s', dur: '1.7s' },
        { c: '#ff7a00', w: 0.5, h: 0.78, b: 'blur-[1.5px]', d: '0.2s', dur: '1.3s' },
        { c: '#ffc23d', w: 0.36, h: 0.6, b: 'blur-[1px]', d: '0.1s', dur: '0.9s' },
        { c: '#fff4c2', w: 0.2, h: 0.36, b: '', d: '0.3s', dur: '0.7s' },
      ].map((f, i) => (
        <div
          key={i}
          className={`absolute bottom-1 ${f.b}`}
          style={{
            width: size * f.w,
            height: size * f.h,
            background: f.c,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transformOrigin: 'bottom center',
            animation: `flameLick ${f.dur} ease-in-out ${f.d} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   FIRE ENGINE C — RookieCampfire
   Rookie's OWN blocks flicker into fire (red at the base → yellow at the
   top), rising and shimmering. Ported from the "Campfire" effect on the
   /test-rook-animations screen. When the streak isn't kept today she
   cools to her normal block colors ("no fire today").
   `blaze` 0..1 scales how intense the fire is (driven off streak length).
   ───────────────────────────────────────────────────────────────────── */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function RookieCampfire({
  blockSize = 16,
  active = true,
  blaze = 0.6, // 0..1 — fire intensity, grows with streak
}: {
  blockSize?: number;
  active?: boolean;
  blaze?: number;
}) {
  const [t, setT] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    start.current = performance.now();
    const tick = (now: number) => {
      setT((now - start.current) / 1000);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  const gap = Math.max(1, Math.round(blockSize * 0.15));
  const radius = Math.max(1, Math.round(blockSize * 0.14));
  const gridWidth = 5 * blockSize + 4 * gap;
  const gridHeight = 6 * blockSize + 5 * gap;
  const scale = blockSize / 14;
  const sh = (v: number) => `${(v * scale).toFixed(2)}px`;
  const insetShadow = `inset 0 ${sh(0.75)} 0 rgba(0,0,0,0.15), inset 0 -${sh(0.75)} 0 rgba(255,255,255,0.15)`;
  const amp = 0.4 + blaze * 0.8; // motion amplitude scales with streak

  return (
    <div style={{ position: 'relative', width: gridWidth, height: gridHeight, transform: 'translate3d(0,0,0)' }}>
      {ROOK_BLOCKS.map((block) => {
        const { x, y } = block;
        const blockIdx = x + y * 5;
        const baseLeft = x * (blockSize + gap);
        const baseTop = y * (blockSize + gap);

        let bg = block.color;
        let brightness = 1;
        let offX = 0;
        let offY = 0;
        let blkScale = 1;

        if (active) {
          // ── Campfire (from /test-rook-animations) ──
          const flameHeight = 1 - y / 5; // hotter toward the top
          const flicker = seededRandom(Math.floor(t * 12) + blockIdx) * 0.4;
          brightness = 0.5 + flameHeight * 0.8 + flicker;
          offY = -flameHeight * Math.sin(t * 3 + x * 2) * 8 * amp;
          offX = Math.sin(t * 2 + y * 1.5 + x) * flameHeight * 5 * amp;
          const fireHue = flameHeight * 50; // 0 red → 50 yellow-orange
          bg = hslToHex(fireHue + flicker * 20, 90 - flameHeight * 20, 30 + flameHeight * 30 + flicker * 15);
          blkScale = 1 + flameHeight * Math.sin(t * 4 + blockIdx) * 0.1 * amp;
        } else {
          brightness = 0.85; // cooled to her normal self, slightly dim
        }

        return (
          <div
            key={`${x},${y}`}
            style={{
              position: 'absolute',
              left: baseLeft + offX,
              top: baseTop + offY,
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              background: getMatteBackground(bg),
              boxShadow: insetShadow,
              transform: `scale(${blkScale})`,
              filter: `brightness(${brightness})`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DESIGN 1 — "Living Flame" (TurbFlame hero, light card)
   ───────────────────────────────────────────────────────────────────── */
function Design1({ current, longest, done }: StreakProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 border shadow-sm transition-colors ${
        done
          ? 'border-orange-300/50 bg-gradient-to-br from-orange-50 via-amber-50/40 to-white'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="relative flex items-center gap-5">
        <div
          className={`relative w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 ${
            done ? 'bg-orange-100/70' : 'bg-slate-100'
          }`}
        >
          <TurbFlame id="d1" size={58} active={done} intensity={26} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-[#2A3C45] tabular-nums leading-none">
              {current}
            </span>
            <span className="text-base font-bold text-slate-500">
              day{current === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-2 leading-snug">
            {done
              ? 'The fire is fed. See you tomorrow.'
              : 'Do anything today to keep it burning.'}
          </p>
        </div>
      </div>
      <div className="mt-5 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-400">A lesson, game, or puzzle counts.</span>
        <span className="font-bold text-slate-500 whitespace-nowrap">Best {longest}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DESIGN 2 — "Ember Counter" (dark card, TurbFlame + drifting embers)
   ───────────────────────────────────────────────────────────────────── */
function Design2({ current, longest, done }: StreakProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 shadow-lg bg-gradient-to-br from-[#2A3C45] to-[#16242c] text-white">
      {done &&
        [0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="pointer-events-none absolute bottom-6 w-1.5 h-1.5 rounded-full bg-orange-400 animate-[ember_3.5s_linear_infinite]"
            style={{ left: `${10 + i * 6}%`, animationDelay: `${i * 0.7}s`, opacity: 0.8 }}
          />
        ))}
      <div className="relative flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-300/80">
            {done ? 'Streak Alive' : 'Streak'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              key={current}
              className="text-7xl font-black tabular-nums leading-none bg-gradient-to-b from-amber-200 via-orange-400 to-orange-600 bg-clip-text text-transparent animate-[popnum_0.5s_cubic-bezier(0.34,1.56,0.64,1)]"
            >
              {current}
            </span>
            <span className="text-lg font-bold text-white/50">
              day{current === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        <TurbFlame id="d2" size={72} active={done} intensity={30} />
      </div>
      <div className="relative mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="font-semibold text-white/40">
          {done ? 'Showed up today.' : 'Do anything to light it.'}
        </span>
        <span className="font-bold text-amber-300 whitespace-nowrap">Best {longest}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DESIGN 3 — "Week Ring" (animated ring + TurbFlame center)
   ───────────────────────────────────────────────────────────────────── */
function Design3({ current, longest, done }: StreakProps) {
  const days = Array.from({ length: 7 }, (_, i) => 6 - i < Math.min(current, 7));
  const hit = days.filter(Boolean).length;
  const pct = hit / 7;
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <div
      className={`rounded-3xl p-6 border shadow-sm ${
        done ? 'border-orange-200 bg-orange-50/40' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r={R} fill="none" stroke="#e2e8f0" strokeWidth="7" />
            <circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              stroke="url(#g3)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C}
              style={{ animation: 'ring 1.1s ease-out forwards', ['--dash' as string]: `${C * (1 - pct)}` }}
            />
            <defs>
              <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFB020" />
                <stop offset="100%" stopColor="#FF7A00" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <TurbFlame id="d3" size={42} active={done} intensity={20} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-[#2A3C45] tabular-nums leading-none">
              {current}
            </span>
            <span className="text-base font-bold text-slate-500">
              day{current === 1 ? '' : 's'}
            </span>
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {days.map((d, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  d ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-300'
                }`}
                style={d ? { animation: `pop 0.3s ease-out ${0.6 + i * 0.06}s both` } : undefined}
              >
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-400">
          {done ? 'Today is locked in.' : 'Keep the week unbroken.'}
        </span>
        <span className="font-bold text-slate-500 whitespace-nowrap">Best {longest}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DESIGN 4 — "Rookie's Torch" (rook holding a BlobFlame)
   ───────────────────────────────────────────────────────────────────── */
function Design4({ current, longest, done }: StreakProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 border shadow-sm ${
        done ? 'border-orange-200 bg-gradient-to-br from-amber-50 to-white' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className={`relative w-20 h-20 rounded-3xl flex items-center justify-center ${done ? 'bg-orange-100' : 'bg-slate-100'}`}>
            <div className={done ? 'animate-[bob_2.4s_ease-in-out_infinite]' : ''}>
              <svg viewBox="0 0 48 48" className="w-12 h-12">
                <rect x="13" y="10" width="4" height="6" rx="1" fill={done ? '#FF9500' : '#cbd5e1'} />
                <rect x="22" y="10" width="4" height="6" rx="1" fill={done ? '#FF9500' : '#cbd5e1'} />
                <rect x="31" y="10" width="4" height="6" rx="1" fill={done ? '#FF9500' : '#cbd5e1'} />
                <path d="M13 15h22v14c0 5-3 8-11 8s-11-3-11-8V15Z" fill={done ? '#FFB84D' : '#e2e8f0'} />
                <circle cx="20" cy="26" r="2.4" fill="#2A3C45" />
                <circle cx="28" cy="26" r="2.4" fill="#2A3C45" />
                <path d="M21 32c1.5 1.4 4.5 1.4 6 0" stroke="#2A3C45" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            {/* real flame badge */}
            <div className="absolute -top-3 -right-2">
              <BlobFlame size={30} active={done} />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-[#2A3C45] tabular-nums leading-none">
              {current}
            </span>
            <span className="text-base font-bold text-slate-500">
              day{current === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-sm font-bold text-orange-500/90 mt-1.5 leading-snug">
            {done
              ? '"We did it again! My circuits are toasty."'
              : current > 0
                ? '"Don\'t leave me hanging — one thing today?"'
                : '"Let\'s start something. I\'ll keep count."'}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-400">Anything counts — Rookie's watching.</span>
        <span className="font-bold text-slate-500 whitespace-nowrap">Best {longest}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DESIGN 5 — "Momentum Bar" (BlobFlame + milestone bar)
   ───────────────────────────────────────────────────────────────────── */
function Design5({ current, longest, done }: StreakProps) {
  const milestones = [7, 14, 30, 60, 100, 365];
  const next = milestones.find((m) => m > current) ?? current + 50;
  const prev = [0, ...milestones].reverse().find((m) => m <= current) ?? 0;
  const pct = Math.min(100, ((current - prev) / (next - prev)) * 100);
  return (
    <div className="rounded-3xl p-6 border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-6xl font-black tabular-nums leading-none ${done ? 'text-orange-500' : 'text-[#2A3C45]'}`}>
            {current}
          </span>
          <div className="leading-tight">
            <div className="text-base font-bold text-slate-500">day{current === 1 ? '' : 's'}</div>
            <div className="text-xs font-semibold text-slate-400">streak</div>
          </div>
        </div>
        <BlobFlame size={56} active={done} />
      </div>
      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
        <span className="text-slate-400">{current} days</span>
        <span className="text-orange-500">Next: {next}</span>
      </div>
      <div className="relative h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
          style={{ width: 0, animation: `bar 1.1s ease-out forwards`, ['--w' as string]: `${pct}%` }}
        >
          <div className="absolute inset-0 animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      </div>
      <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-400">
          {done ? 'Momentum locked for today.' : `${next - current} days to your next badge.`}
        </span>
        <span className="font-bold text-slate-500 whitespace-nowrap">Best {longest}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DESIGN 6 — "Rookie on Fire" (Rookie's blocks become the flame)
   The fire intensity grows with the streak.
   ───────────────────────────────────────────────────────────────────── */
function Design6({ current, longest, done }: StreakProps) {
  // map streak 0..60 -> blaze 0.3..1
  const blaze = Math.max(0.3, Math.min(1, current / 60));
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 border shadow-sm transition-colors ${
        done
          ? 'border-orange-300/50 bg-gradient-to-b from-[#2A3C45] via-[#33373f] to-[#3a2e26] text-white'
          : 'border-slate-200 bg-gradient-to-b from-slate-700 to-slate-800 text-white'
      }`}
    >
      {/* embers + ground glow behind Rookie */}
      {done && (
        <>
          <div
            className="absolute rounded-[50%] bg-orange-500/25 blur-2xl animate-[glowpulse_1.6s_ease-in-out_infinite]"
            style={{ width: 130, height: 90, left: 14, bottom: 24 }}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="pointer-events-none absolute rounded-full bg-amber-300 animate-[campEmber_2.8s_linear_infinite]"
              style={{
                width: 3,
                height: 3,
                left: `${14 + i * 5}%`,
                bottom: 56,
                animationDelay: `${i * 0.5}s`,
                boxShadow: '0 0 5px 1px rgba(255,180,60,0.9)',
              }}
            />
          ))}
        </>
      )}
      <div className="relative flex items-center gap-4">
        <div className="shrink-0 flex items-end justify-center" style={{ width: 96 }}>
          <RookieCampfire blockSize={15} active={done} blaze={blaze} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black tabular-nums leading-none">{current}</span>
            <span className="text-base font-bold text-white/55">day{current === 1 ? '' : 's'}</span>
          </div>
          <p className="text-sm font-semibold text-white/70 mt-2 leading-snug">
            {done
              ? "Rookie's on fire. Keep her burning."
              : current > 0
                ? 'She cooled off — do anything to reignite.'
                : 'Light the spark. Start your streak.'}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="font-semibold text-white/45">A lesson, game, or puzzle keeps her lit.</span>
        <span className="font-bold text-amber-300 whitespace-nowrap">Best {longest}</span>
      </div>
    </div>
  );
}

// ── Page shell ───────────────────────────────────────────────────────
const DESIGNS = [
  { id: 1, name: 'Living Flame', sub: 'Turbulence fire — licks & dances', C: Design1 },
  { id: 2, name: 'Ember Counter', sub: 'Dark card, turbulence fire + embers', C: Design2 },
  { id: 3, name: 'Week Ring', sub: 'Ring + turbulence fire core', C: Design3 },
  { id: 4, name: "Rookie's Torch", sub: 'Rook + layered blob flame', C: Design4 },
  { id: 5, name: 'Momentum Bar', sub: 'Blob flame + milestone bar', C: Design5 },
  { id: 6, name: 'Rookie on Fire', sub: "Rookie's blocks flicker into flame (from /test-rook-animations)", C: Design6 },
];

export default function StreakWindowTest() {
  const [current, setCurrent] = useState(12);
  const [done, setDone] = useState(true);
  const longest = Math.max(current, 23);
  const [remount, setRemount] = useState(0);

  return (
    <div className="min-h-screen w-full overflow-auto bg-[#eef6fc] font-[var(--font-body,DM_Sans,sans-serif)]">
      <style>{keyframes}</style>
      <div className="mx-auto max-w-md px-4 py-8">
        <h1 className="text-2xl font-black text-[#2A3C45]">Streak Window — Real Fire</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Turbulence (SVG Perlin noise) + blob flames. Toggle/replay below.
        </p>

        <div className="mt-5 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#2A3C45]">Completed today</span>
            <button
              onClick={() => setDone((d) => !d)}
              className={`relative w-12 h-7 rounded-full transition-colors ${done ? 'bg-orange-400' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${done ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm font-bold text-[#2A3C45]">
              <span>Streak</span>
              <span className="tabular-nums text-orange-500">{current} days</span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              className="w-full mt-1 accent-orange-500"
            />
          </div>
          <button
            onClick={() => setRemount((r) => r + 1)}
            className="w-full rounded-xl bg-[#2A3C45] text-white text-sm font-bold py-2.5 active:scale-95 transition-transform"
          >
            ↻ Replay animations
          </button>
        </div>

        <div className="mt-6 space-y-8" key={remount}>
          {DESIGNS.map(({ id, name, sub, C }) => (
            <div key={id}>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xs font-black text-white bg-[#2A3C45] rounded-full w-5 h-5 flex items-center justify-center">
                  {id}
                </span>
                <span className="text-sm font-black text-[#2A3C45]">{name}</span>
                <span className="text-xs font-semibold text-slate-400">{sub}</span>
              </div>
              <C current={current} longest={longest} done={done} />
            </div>
          ))}
        </div>
        <div className="h-16" />
      </div>
    </div>
  );
}

const keyframes = `
@keyframes flameLick {
  0%,100% { transform: scaleY(1) scaleX(1) translateX(0) rotate(0deg); }
  25% { transform: scaleY(1.12) scaleX(0.92) translateX(-1px) rotate(-2deg); }
  50% { transform: scaleY(0.94) scaleX(1.06) translateX(1px) rotate(2deg); }
  75% { transform: scaleY(1.08) scaleX(0.95) translateX(-0.5px) rotate(-1deg); }
}
@keyframes glowpulse {
  0%,100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(1.12); }
}
@keyframes ember {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.9; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-80px) translateX(10px); opacity: 0; }
}
@keyframes popnum {
  0% { transform: scale(0.4); opacity: 0; }
  60% { transform: scale(1.12); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes bob {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(-3deg); }
}
@keyframes ring { to { stroke-dashoffset: var(--dash); } }
@keyframes pop {
  0% { transform: scale(0); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
@keyframes bar { to { width: var(--w); } }
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
@keyframes campEmber {
  0%   { transform: translate(0,0) scale(1); opacity: 0; }
  15%  { opacity: 1; }
  80%  { opacity: 0.7; }
  100% { transform: translate(var(--ex,6px), -64px) scale(0.4); opacity: 0; }
}
@keyframes emberGlow {
  0%,100% { opacity: 0.5; transform: scale(0.9); }
  50%     { opacity: 1;   transform: scale(1.15); }
}
@keyframes twinkle {
  0%,100% { opacity: 0.2; }
  50%     { opacity: 0.9; }
}
`;
