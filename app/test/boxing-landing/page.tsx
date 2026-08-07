'use client';

/**
 * /test/boxing-landing — round 5 (Tyler, 2026-08-07): Living Ring refinements.
 *  - Ring floor is subtly a chessboard (perspective checker under the rankings)
 *  - Real art: locker gloves.webp + piece-bn.webp on the corner buttons
 *  - Real logo: BreathingHeaderLogo (gradient "path") in the sign
 *  - Crowd: near silhouettes behind the ropes + a dimmer distant band, with
 *    occasional camera flashes
 *  - Rankings: fixed-height windows that scroll independently, more fighters
 */

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { BreathingHeaderLogo } from '@/components/ui/BreathingHeaderLogo';

/* ---------- mock leaderboard data ---------- */

const GLOBAL_ROWS = [
  { rank: 1, name: 'IronPawn', pts: 2140 },
  { rank: 2, name: 'CheckHook', pts: 1985 },
  { rank: 3, name: 'MateInFour', pts: 1870 },
  { rank: 4, name: 'JabSacrifice', pts: 1760 },
  { rank: 5, name: 'SouthpawSicilian', pts: 1655 },
  { rank: 6, name: 'RopeADoper', pts: 1590 },
  { rank: 7, name: 'BackRankBruiser', pts: 1470 },
  { rank: 8, name: 'GambitGlover', pts: 1385 },
  { rank: 12, name: 'You', pts: 1240, me: true },
  { rank: 13, name: 'PinCushion', pts: 1180 },
  { rank: 14, name: 'FeintPhilidor', pts: 1120 },
];

const SQUAD_ROWS = [
  { rank: 1, name: 'CheckHook', pts: 1985 },
  { rank: 2, name: 'You', pts: 1240, me: true },
  { rank: 3, name: 'RookNRoll', pts: 1105 },
  { rank: 4, name: 'EnPassGang', pts: 940 },
  { rank: 5, name: 'CastleGuard', pts: 720 },
  { rank: 6, name: 'PawnStorm', pts: 610 },
];

type Row = { rank: number; name: string; pts: number; me?: boolean };
type Period = 'daily' | 'weekly' | 'monthly';

/* Same fighters, different windows — daily is a sparse morning board, monthly
   is the deep one. Mock only; real data keys off /api/leaderboard?period=. */
const BOARDS: Record<Period, { global: Row[]; squad: Row[]; resets: string }> = {
  daily: {
    global: [
      { rank: 1, name: 'CheckHook', pts: 320 },
      { rank: 2, name: 'RopeADoper', pts: 285 },
      { rank: 3, name: 'You', pts: 240, me: true },
      { rank: 4, name: 'IronPawn', pts: 195 },
      { rank: 5, name: 'PinCushion', pts: 140 },
    ],
    squad: [
      { rank: 1, name: 'You', pts: 240, me: true },
      { rank: 2, name: 'CheckHook', pts: 320 - 95 },
      { rank: 3, name: 'RookNRoll', pts: 110 },
    ],
    resets: '9h 12m',
  },
  weekly: { global: GLOBAL_ROWS, squad: SQUAD_ROWS, resets: '2d 14h' },
  monthly: {
    global: [
      { rank: 1, name: 'IronPawn', pts: 9840 },
      { rank: 2, name: 'MateInFour', pts: 9210 },
      { rank: 3, name: 'CheckHook', pts: 8760 },
      { rank: 4, name: 'SouthpawSicilian', pts: 7420 },
      { rank: 5, name: 'BackRankBruiser', pts: 6980 },
      { rank: 6, name: 'JabSacrifice', pts: 6540 },
      { rank: 7, name: 'GambitGlover', pts: 5870 },
      { rank: 8, name: 'RopeADoper', pts: 5390 },
      { rank: 9, name: 'You', pts: 5120, me: true },
      { rank: 10, name: 'FeintPhilidor', pts: 4880 },
      { rank: 11, name: 'PinCushion', pts: 4410 },
      { rank: 12, name: 'CastleGuard', pts: 3960 },
    ],
    squad: [
      { rank: 1, name: 'CheckHook', pts: 8760 },
      { rank: 2, name: 'You', pts: 5120, me: true },
      { rank: 3, name: 'EnPassGang', pts: 4230 },
      { rank: 4, name: 'RookNRoll', pts: 3890 },
      { rank: 5, name: 'CastleGuard', pts: 2540 },
      { rank: 6, name: 'PawnStorm', pts: 1730 },
    ],
    resets: '11d 6h',
  },
};

/* ---------- animation css (idle life only) ---------- */

const ANIM_CSS = `
@keyframes brSwing {
  0%, 100% { transform: rotate(-1.4deg); }
  50% { transform: rotate(1.4deg); }
}
@keyframes brSheen {
  0% { transform: translateX(-140%) skewX(-20deg); }
  100% { transform: translateX(340%) skewX(-20deg); }
}
@keyframes brBreathe {
  0%, 100% { opacity: 0.75; }
  50% { opacity: 1; }
}
@keyframes brFlash {
  0%, 92%, 100% { opacity: 0; }
  94% { opacity: 0.9; }
  96% { opacity: 0.15; }
  98% { opacity: 0.5; }
}
.br-swing { animation: brSwing 5s ease-in-out infinite; transform-origin: top center; }
.br-breathe { animation: brBreathe 3.2s ease-in-out infinite; }
.br-scroll { scrollbar-width: none; }
.br-scroll::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: reduce) {
  .br-swing, .br-breathe { animation: none; }
  .br-sheen-run, .br-flash { animation: none !important; opacity: 0; }
}
`;

export default function BoxingLandingTest() {
  return (
    <div className="h-full overflow-auto bg-[#0b101e] py-10">
      <style>{ANIM_CSS}</style>
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-2xl font-black text-white">Living Ring — with crowd + chessboard canvas</h1>
        <p className="mt-1 text-sm text-white/60 max-w-2xl">
          Real gloves + knight art, real logo, chessboard ring floor, audience behind the
          ropes, and independently scrolling ranking windows.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="w-[390px] h-[820px] rounded-[2.2rem] border-4 border-white/15 overflow-hidden shadow-2xl bg-black">
            <LivingRing />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   LIVING RING — fight night, seen from your corner.
   ========================================================================= */

function LivingRing() {
  const [period, setPeriod] = useState<Period>('weekly');
  const board = BOARDS[period];
  return (
    <div className="h-full text-white flex flex-col relative overflow-hidden bg-[#131a2e]">
      {/* spotlight from above — one warm cone, breathing very slowly */}
      <div
        className="br-breathe absolute inset-x-0 top-0 h-[340px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 70% 90% at 50% -10%, rgba(246,196,69,0.16), transparent 68%)' }}
      />

      <Crowd />
      <ChessboardFloor />
      <RingStructure />

      {/* faint arena depth at the very bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(to top, rgba(6,9,18,0.6), transparent)' }}
      />

      {/* ---- sign ---- */}
      <div className="pt-[max(0.9rem,env(safe-area-inset-top))] flex justify-center relative z-10">
        <div className="br-swing"><GymSign /></div>
      </div>

      {/* ---- the two corners + VS coin ---- */}
      <div className="relative z-10 mt-8 px-5">
        <div className="grid grid-cols-2 gap-4">
          <CornerButton
            href="/workout"
            corner="red"
            title="Puzzle"
            sub="Boxing"
            tagIcon={<TrophyIcon className="w-3 h-3" />}
            tag="Ranked"
            icon={
              <div className="mx-auto w-[64px] h-[58px] relative">
                <Image
                  src="/boxing/locker/gloves.webp"
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover object-[50%_22%] scale-[1.35] drop-shadow-[0_3px_2px_rgba(0,0,0,0.35)]"
                />
              </div>
            }
          />
          <CornerButton
            href="/play"
            corner="blue"
            title="Play"
            sub="Boxing"
            tag="vs Rookie"
            icon={
              <div className="mx-auto w-[64px] h-[58px] relative">
                <Image
                  src="/boxing/locker/piece-bn.webp"
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain drop-shadow-[0_3px_2px_rgba(0,0,0,0.35)]"
                />
              </div>
            }
          />
        </div>
        {/* VS coin overlapping both corners */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-[#f6c445] border-[3px] border-[#b8860b] shadow-[0_3px_0_0_#8a6508] flex items-center justify-center rotate-[-8deg]">
            <span className="text-[15px] font-black text-[#3d2e00] tracking-tight">VS</span>
          </div>
        </div>
      </div>

      {/* ---- canvas apron trim ---- */}
      <div
        className="relative z-10 mt-7 mx-5 h-2 rounded-full overflow-hidden opacity-60"
        style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 8px, transparent 8px 16px)' }}
      />

      {/* ---- rankings ---- */}
      <div className="mt-4 flex-1 min-h-0 px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] relative z-10 flex flex-col">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-white/20" />
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
            <LiveDot /> The Rankings
          </span>
          <span className="h-px w-8 bg-white/20" />
        </div>

        {/* the two windows fill the remaining height and scroll on their own */}
        <div className="mt-3 flex-1 min-h-0 grid grid-cols-2 gap-3">
          <Board title="Global" color="red" rows={board.global} />
          <Board title="Squad" color="blue" rows={board.squad} />
        </div>

        {/* period toggle + reset countdown */}
        <div className="pt-3 flex flex-col items-center gap-2">
          <PeriodToggle period={period} onChange={setPeriod} />
          <div className="flex items-center justify-center gap-2 text-[10.5px] font-bold text-white/45">
            <BellIcon className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest">Board resets in</span>
            <span className="font-black text-white/80 tabular-nums">{board.resets}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- audience: near silhouettes + a distant dimmer band ---------- */

/* Terraced crowd: every row from the nosebleeds (top, tiny, blurred) down to
   ringside (big, sharp). Heads get bigger and darker as they get closer. */
const CROWD_ROWS = [
  { y: 10, r: 3, sp: 13, off: 0, fill: '#121b30', op: 0.6, blur: 1.5 },
  { y: 24, r: 3.4, sp: 14, off: 7, fill: '#121b30', op: 0.62, blur: 1.5 },
  { y: 40, r: 3.8, sp: 15, off: 3, fill: '#111a2e', op: 0.65, blur: 1.4 },
  { y: 57, r: 4.3, sp: 17, off: 9, fill: '#111a2e', op: 0.68, blur: 1.3 },
  { y: 75, r: 4.8, sp: 18, off: 5, fill: '#101828', op: 0.7, blur: 1.2 },
  { y: 94, r: 5.4, sp: 20, off: 11, fill: '#101828', op: 0.72, blur: 1.2 },
  { y: 114, r: 6, sp: 22, off: 4, fill: '#0e1526', op: 0.78, blur: 1.1 },
  { y: 135, r: 7, sp: 24, off: 12, fill: '#0e1526', op: 0.85, blur: 1 },
  { y: 158, r: 9, sp: 27, off: 6, fill: '#0a101f', op: 1, blur: 0 },
];
const FLASHES = [
  { x: 22, y: 12, d: 0, dur: 8 },
  { x: 48, y: 20, d: 1.1, dur: 9 },
  { x: 92, y: 8, d: 2.9, dur: 7.5 },
  { x: 128, y: 24, d: 5.2, dur: 10 },
  { x: 168, y: 10, d: 2.3, dur: 8.5 },
  { x: 204, y: 26, d: 6.8, dur: 9.5 },
  { x: 234, y: 6, d: 0.6, dur: 11 },
  { x: 258, y: 20, d: 4.1, dur: 8 },
  { x: 296, y: 12, d: 7.7, dur: 9 },
  { x: 320, y: 28, d: 3.4, dur: 10.5 },
  { x: 338, y: 8, d: 6.4, dur: 7 },
  { x: 372, y: 18, d: 5.9, dur: 8.5 },
];

function Crowd() {
  return (
    <div className="absolute inset-x-0 top-0 h-[196px] pointer-events-none z-0" aria-hidden>
      {/* faint arena glow the silhouettes read against */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(63,78,120,0.34), rgba(52,66,105,0.26) 45%, rgba(40,52,86,0.16) 78%, transparent)' }} />
      <svg viewBox="0 0 390 196" className="absolute inset-0 w-full h-full">
        {/* terraced rows, nosebleeds to ringside */}
        {CROWD_ROWS.map((row, ri) => {
          const heads: number[] = [];
          for (let x = row.off - row.sp; x <= 390 + row.sp; x += row.sp) heads.push(x);
          return (
            <g key={row.y} fill={row.fill} opacity={row.op} style={row.blur ? { filter: `blur(${row.blur}px)` } : undefined}>
              {heads.map((x, i) => {
                const jx = x + (((i + ri) % 3) - 1) * 2;
                const jy = row.y + (((i * 2 + ri) % 4) - 1.5) * 1.6;
                return (
                  <g key={x}>
                    <circle cx={jx} cy={jy} r={row.r} />
                    <rect
                      x={jx - row.r * 1.2}
                      y={jy + row.r * 0.75}
                      width={row.r * 2.4}
                      height={row.r * 2.2}
                      rx={row.r * 0.9}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
        {/* camera flashes — hot points with soft halos, scattered over the whole crowd */}
        {FLASHES.map((f, i) => {
          const cy = 8 + ((i * 37) % 140);
          return (
            <g key={f.x}>
              <circle
                className="br-flash"
                cx={f.x}
                cy={cy}
                r={6}
                fill="#fff"
                opacity="0"
                style={{ animation: `brFlash ${f.dur}s linear ${f.d}s infinite`, filter: 'blur(4px)' }}
              />
              <circle
                className="br-flash"
                cx={f.x}
                cy={cy}
                r={1.8}
                fill="#fff"
                opacity="0"
                style={{ animation: `brFlash ${f.dur}s linear ${f.d}s infinite` }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- ring floor: a chessboard receding into the dark ---------- */

function ChessboardFloor() {
  return (
    // Starts right at the bottom rope (~y198) — the whole canvas is the board.
    <div className="absolute inset-x-0 bottom-0 top-[198px] pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[-30%] w-[220%] h-[150%]"
        style={{
          background:
            'repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, rgba(0,0,0,0.06) 0% 50%) 0 0 / 96px 96px',
          transform: 'perspective(520px) rotateX(58deg)',
          transformOrigin: 'top center',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 82%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 82%, transparent)',
        }}
      />
    </div>
  );
}

/* ---------- ring structure: posts, turnbuckles, ropes ---------- */

function RingStructure() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[2]">
      {/* corner posts */}
      <div className="absolute left-0 top-[128px] h-[120px] w-[7px] rounded-r bg-gradient-to-b from-[#e05252] to-[#a83232]" />
      <div className="absolute right-0 top-[128px] h-[120px] w-[7px] rounded-l bg-gradient-to-b from-[#4db4ef] to-[#1a7db0]" />
      {/* ropes with traveling sheen, anchored by turnbuckles */}
      <div className="absolute inset-x-[5px] top-[150px] space-y-[16px]">
        {[
          { c: 'bg-chess-red/75', d: 0 },
          { c: 'bg-white/30', d: 0.5 },
          { c: 'bg-chess-blue/75', d: 1 },
        ].map(({ c, d }) => (
          <div key={c} className="relative h-[4px] overflow-hidden rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            <div className={`absolute inset-0 ${c}`} />
            <span
              className="br-sheen-run absolute inset-y-0 w-14 bg-white/50"
              style={{ animation: `brSheen 3.6s ease-in-out ${d}s infinite` }}
            />
            <span className="absolute left-0 inset-y-0 w-2 rounded-full bg-[#94a3b8]" />
            <span className="absolute right-0 inset-y-0 w-2 rounded-full bg-[#94a3b8]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- sign (locker language) with the real logo ---------- */

function GymSign() {
  return (
    <div className="pointer-events-none select-none">
      <div className="flex justify-center gap-9 px-3">
        <Chain /><Chain />
      </div>
      <div className="-mt-0.5 rounded-2xl bg-chess-red border-2 border-[#CC3939] shadow-[0_5px_0_0_#CC3939,0_14px_28px_rgba(0,0,0,0.45)] px-6 py-2.5 text-center">
        <div className="text-[12px] font-black uppercase tracking-[0.3em] text-[#ffd0d0] leading-none">Chess</div>
        <div className="text-[30px] font-black uppercase tracking-tight text-white leading-none mt-1">Boxing</div>
        {/* by chesspath — the real wordmark, "path" carries the gradient */}
        <div className="mt-1.5 flex items-center justify-center gap-1.5 bg-white/95 rounded-lg px-2.5 py-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-chess-text-muted leading-none">by</span>
          <BreathingHeaderLogo className="!w-[76px]" />
        </div>
      </div>
    </div>
  );
}

function Chain() {
  return (
    <div className="flex flex-col items-center gap-[1px]">
      <span className="w-[3px] h-[5px] rounded-full border border-[#94a3b8]" />
      <span className="w-[3px] h-[5px] rounded-full border border-[#94a3b8]" />
    </div>
  );
}

/* ---------- corner buttons ---------- */

function CornerButton({
  href, corner, title, sub, tag, tagIcon, icon,
}: {
  href: string; corner: 'red' | 'blue'; title: string; sub: string; tag: string; tagIcon?: React.ReactNode; icon: React.ReactNode;
}) {
  const red = corner === 'red';
  return (
    <Link
      href={href}
      className={`group block rounded-2xl px-3 pt-4 pb-3.5 text-center text-white border-2 transition-transform active:translate-y-[5px] active:shadow-none ${
        red
          ? 'bg-chess-red border-[#e86060] shadow-[0_5px_0_0_#CC3939,0_12px_24px_rgba(255,75,75,0.22)]'
          : 'bg-chess-blue border-[#54c2f8] shadow-[0_5px_0_0_#0d7ec4,0_12px_24px_rgba(28,176,246,0.22)]'
      }`}
    >
      {icon}
      <div className="mt-2 text-[19px] font-black uppercase leading-[0.95] tracking-tight">
        {title}<br />{sub}
      </div>
      <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[9.5px] font-black uppercase tracking-[0.14em] ${
        red ? 'bg-[#a32b2b] text-[#ffd7a1]' : 'bg-[#116b9c] text-[#d8f1ff]'
      }`}>
        {tagIcon}{tag}
      </div>
    </Link>
  );
}

/* ---------- period toggle: fight-card segmented control ---------- */

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

function PeriodToggle({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  return (
    <div className="flex rounded-full bg-white/[0.07] border border-white/15 p-[3px]" role="tablist" aria-label="Ranking period">
      {PERIODS.map(({ key, label }) => {
        const active = key === period;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`min-h-[34px] px-4 rounded-full text-[11px] font-black uppercase tracking-wide transition-colors tap-highlight ${
              active
                ? 'bg-[#f6c445] text-[#3d2e00] shadow-[0_2px_0_0_#b8860b]'
                : 'text-white/55 active:text-white/85'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- leaderboards: fixed windows, inner scroll ---------- */

function Board({ title, color, rows }: { title: string; color: 'red' | 'blue'; rows: Row[] }) {
  const red = color === 'red';
  return (
    <div className="h-full min-h-0 flex flex-col rounded-2xl bg-white/[0.05] border border-white/10 overflow-hidden backdrop-blur-[2px]">
      <div className={`shrink-0 px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.22em] ${
        red ? 'bg-chess-red/25 text-[#ff9d9d]' : 'bg-chess-blue/25 text-[#8fd6fb]'
      }`}>
        {title}
      </div>
      {/* the scrolling window */}
      <div className="br-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 py-2 space-y-1">
        {rows.map((r) => (r.me ? <MeRow key={r.rank} r={r} /> : <BoardRow key={r.rank} r={r} />))}
      </div>
      {/* bottom fade hints there's more to scroll */}
      <div className="relative shrink-0 h-0">
        <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#1a2138] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function BoardRow({ r }: { r: Row }) {
  return (
    <div className="flex items-center gap-2 px-1.5 py-[7px] text-white/90">
      <RankBadge rank={r.rank} />
      <span className="flex-1 truncate text-[12.5px] font-bold">{r.name}</span>
      <span className="text-[11px] font-black tabular-nums text-white/55">{fmtPts(r.pts)}</span>
    </div>
  );
}

/** Your row — a gold pill with a slow repeating sheen. */
function MeRow({ r }: { r: Row }) {
  return (
    <div className="relative overflow-hidden flex items-center gap-2 px-1.5 py-1.5 rounded-xl bg-chess-gold/[0.16] border border-chess-gold/50 text-chess-gold">
      <span
        className="br-sheen-run absolute inset-y-0 w-10 bg-white/20"
        style={{ animation: 'brSheen 3.2s ease-in-out 1.5s infinite' }}
      />
      <span className="w-6 text-center text-[13px] font-black tabular-nums">{r.rank}</span>
      <span className="flex-1 truncate text-[12.5px] font-black">{r.name}</span>
      <span className="text-[11px] font-black tabular-nums">{fmtPts(r.pts)}</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return <span className="w-6 text-center text-[13px] font-black tabular-nums text-white/40">{rank}</span>;
  }
  const medal =
    rank === 1
      ? 'bg-[#f6c445] text-[#3d2e00] border-[#b8860b]'
      : rank === 2
        ? 'bg-[#cbd5e1] text-[#334155] border-[#94a3b8]'
        : 'bg-[#d9955c] text-[#4a2a10] border-[#a5642f]';
  return (
    <span className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center text-[11px] font-black ${medal}`}>
      {rank}
    </span>
  );
}

function fmtPts(pts: number) {
  return pts >= 1000 ? `${(pts / 1000).toFixed(1)}k` : String(pts);
}

/* ---------- tiny icons ---------- */

function LiveDot() {
  return <span className="inline-block w-1.5 h-1.5 rounded-full bg-chess-green animate-pulse" />;
}

function TrophyIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4a2 2 0 0 0 2 5M17 6h3a2 2 0 0 1-2 5" />
    </svg>
  );
}

function BellIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3a6 6 0 0 0-6 6c0 4-1.5 5.5-2 6h16c-.5-.5-2-2-2-6a6 6 0 0 0-6-6Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}
