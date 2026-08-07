'use client';

import Link from 'next/link';
import { BreathingHeaderLogo } from '@/components/ui/BreathingHeaderLogo';

/**
 * Shared fight-night arena for Chess Boxing screens: RingHome plus the
 * "corner" instruction windows (bout pre-fight, workout setup entered from
 * /box). One implementation of the crowd, ring, floor, hanging sign, and
 * animations — screens compose ArenaScene inside a relative container and
 * put their content above it (z-10).
 */

/* ---------- back button (mirrors RingHome's settings gear style) ---------- */

export function ArenaBackButton({ href = '/box' }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="Back to the ring"
      className="absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 text-white/70 border border-white/15 active:translate-y-[2px] transition-transform tap-highlight"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </Link>
  );
}

/* ---------- the whole backdrop: spotlight, crowd, floor, ropes ---------- */

export function ArenaScene() {
  return (
    <>
      <div
        className="ring-breathe absolute inset-x-0 top-0 h-[340px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 70% 90% at 50% -10%, rgba(246,196,69,0.16), transparent 68%)' }}
        aria-hidden
      />
      <Crowd />
      <ChessboardFloor />
      <RingStructure />
      {/* faint arena depth at the very bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(to top, rgba(6,9,18,0.6), transparent)' }}
        aria-hidden
      />
      <style>{ARENA_CSS}</style>
    </>
  );
}

/* ---------- animation css (idle life only) ---------- */

export const ARENA_CSS = `
@keyframes ringSwing {
  0%, 100% { transform: rotate(-1.4deg); }
  50% { transform: rotate(1.4deg); }
}
@keyframes ringSheen {
  0% { transform: translateX(-140%) skewX(-20deg); }
  100% { transform: translateX(340%) skewX(-20deg); }
}
@keyframes ringBreathe {
  0%, 100% { opacity: 0.75; }
  50% { opacity: 1; }
}
@keyframes ringFlash {
  0%, 92%, 100% { opacity: 0; }
  94% { opacity: 0.9; }
  96% { opacity: 0.15; }
  98% { opacity: 0.5; }
}
.ring-swing { animation: ringSwing 5s ease-in-out infinite; transform-origin: top center; }
.ring-breathe { animation: ringBreathe 3.2s ease-in-out infinite; }
.ring-scroll { scrollbar-width: none; }
.ring-scroll::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: reduce) {
  .ring-swing, .ring-breathe { animation: none; }
  .ring-sheen-run, .ring-flash-run { animation: none !important; opacity: 0; }
}
`;

/* ---------- audience: terraced silhouettes, nosebleeds to ringside ---------- */

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
  { x: 22, d: 0, dur: 8 },
  { x: 48, d: 1.1, dur: 9 },
  { x: 92, d: 2.9, dur: 7.5 },
  { x: 128, d: 5.2, dur: 10 },
  { x: 168, d: 2.3, dur: 8.5 },
  { x: 204, d: 6.8, dur: 9.5 },
  { x: 234, d: 0.6, dur: 11 },
  { x: 258, d: 4.1, dur: 8 },
  { x: 296, d: 7.7, dur: 9 },
  { x: 320, d: 3.4, dur: 10.5 },
  { x: 338, d: 6.4, dur: 7 },
  { x: 372, d: 5.9, dur: 8.5 },
];

export function Crowd() {
  return (
    <div className="absolute inset-x-0 top-0 h-[196px] pointer-events-none z-0" aria-hidden>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(63,78,120,0.34), rgba(52,66,105,0.26) 45%, rgba(40,52,86,0.16) 78%, transparent)' }} />
      <svg viewBox="0 0 390 196" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
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
        {FLASHES.map((f, i) => {
          const cy = 8 + ((i * 37) % 140);
          return (
            <g key={f.x}>
              <circle
                className="ring-flash-run"
                cx={f.x}
                cy={cy}
                r={6}
                fill="#fff"
                opacity="0"
                style={{ animation: `ringFlash ${f.dur}s linear ${f.d}s infinite`, filter: 'blur(4px)' }}
              />
              <circle
                className="ring-flash-run"
                cx={f.x}
                cy={cy}
                r={1.8}
                fill="#fff"
                opacity="0"
                style={{ animation: `ringFlash ${f.dur}s linear ${f.d}s infinite` }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- ring floor: a chessboard receding into the dark ---------- */

export function ChessboardFloor() {
  return (
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

export function RingStructure() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[2]">
      <div className="absolute left-0 top-[128px] h-[120px] w-[7px] rounded-r bg-gradient-to-b from-[#e05252] to-[#a83232]" />
      <div className="absolute right-0 top-[128px] h-[120px] w-[7px] rounded-l bg-gradient-to-b from-[#4db4ef] to-[#1a7db0]" />
      <div className="absolute inset-x-[5px] top-[150px] space-y-[16px]">
        {[
          { c: 'bg-chess-red/75', d: 0 },
          { c: 'bg-white/30', d: 0.5 },
          { c: 'bg-chess-blue/75', d: 1 },
        ].map(({ c, d }) => (
          <div key={c} className="relative h-[4px] overflow-hidden rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            <div className={`absolute inset-0 ${c}`} />
            <span
              className="ring-sheen-run absolute inset-y-0 w-14 bg-white/50"
              style={{ animation: `ringSheen 3.6s ease-in-out ${d}s infinite` }}
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

export function GymSign() {
  return (
    <div className="pointer-events-none select-none">
      <div className="flex justify-center gap-9 px-3">
        <Chain /><Chain />
      </div>
      <div className="-mt-0.5 rounded-2xl bg-chess-red border-2 border-[#CC3939] shadow-[0_5px_0_0_#CC3939,0_14px_28px_rgba(0,0,0,0.45)] px-6 py-2.5 text-center">
        <div className="text-[12px] font-black uppercase tracking-[0.3em] text-[#ffd0d0] leading-none">Chess</div>
        <div className="text-[30px] font-black uppercase tracking-tight text-white leading-none mt-1">Boxing</div>
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
