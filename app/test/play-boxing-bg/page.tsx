'use client';

/**
 * /test/play-boxing-bg — round 2 (Tyler, 2026-08-07): the REAL /play setup
 * screen (level bar, LV badge, Rookie herself, speech bubble, color picker,
 * Let's Play) rebuilt faithfully, with 5 boxing-world backgrounds behind it.
 * No chess boards, no ring — Rookie is the feature; the background is where
 * she trains, waits, and holds court. Speech bubble cycles the new boxing
 * quip set so copy + canvas get judged together.
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BreathingRook } from '@/components/ui/BreathingRook';

/* =======================================================================
   NEW BOXING QUIPS — Rookie, over-invested cornerwoman. ≤2 sentences,
   no emojis, no context assumptions.
   ======================================================================= */

const QUIPS_IDLE = [
  'Hands up. Bishops too.',
  'Footwork. Knights are ALL footwork.',
  'Protect the chin. The chin is your king.',
  'Float like a bishop. Sting like a rook.',
  'I shadowboxed some pawns this morning. They won.',
  'Work the body. The body is the center squares.',
  'My corner told me to castle. I AM my corner.',
  'Keep the guard up — f7 is a glass jaw.',
  'The rook is my haymaker. She knows it. Everyone knows it.',
  'Ring the bell whenever. I was born ready. Mostly.',
  'Breathe between moves. I would, if I breathed.',
  'Southpaw opening. Bold. I respect it and I fear it.',
];

const QUIPS_YOU_LAND = [
  'Oof. Right on the chin.',
  'That was a clean jab. I felt that in my base.',
  'The judges saw that. There are no judges. Still.',
  'Okay. OKAY. Nice combination.',
  'You are up on the cards and I hate how proud I am.',
  'That knight has a mean left hook.',
];

const QUIPS_SHE_LANDS = [
  'And THAT is why you keep your hands up.',
  'Body shot! By body I mean your pawn structure.',
  'I have been working on that one all week.',
  'Ding. That one rang YOUR bell.',
];

const QUIPS_MELTDOWN = [
  'I want a rematch. Same board. Same everything.',
  'This is fine. I am simply on the ropes. On purpose.',
  'My towel is nervous. I am NOT throwing it. But it is nervous.',
  'Saved by the bell. The bell owes me several.',
  'I am not down. I am resting against the canvas strategically.',
];

const ALL_QUIPS = [...QUIPS_IDLE, ...QUIPS_YOU_LAND, ...QUIPS_SHE_LANDS, ...QUIPS_MELTDOWN];

/* =======================================================================
   Shared animation css
   ======================================================================= */

const ANIM_CSS = `
@keyframes pbFlicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.55} 94%{opacity:1} 97%{opacity:.75} 98%{opacity:1} }
@keyframes pbSway { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2.4deg)} }
@keyframes pbSwaySlow { 0%,100%{transform:rotate(1.4deg)} 50%{transform:rotate(-1.6deg)} }
@keyframes pbBreathe { 0%,100%{opacity:.7} 50%{opacity:1} }
@keyframes pbGlow { 0%,100%{opacity:.55} 50%{opacity:1} }
@keyframes pbBlink { 0%,88%,100%{opacity:.9} 92%{opacity:.2} 96%{opacity:.9} }
@keyframes pbDust { 0%{transform:translateY(0); opacity:.4} 100%{transform:translateY(-46px); opacity:0} }
@media (prefers-reduced-motion: reduce) {
  .pb-anim, .pb-anim * { animation: none !important; }
}
`;

/* =======================================================================
   Page
   ======================================================================= */

const OPTIONS = [
  { key: 'gym', name: '1 · The Gym After Hours', desc: 'Heavy bags on chains, one bulb burning, her neon on the wall. She trains here. Now you do too.' },
  { key: 'locker', name: '2 · The Locker Room', desc: 'Her corner of the locker room — real gloves on the hook, fight card taped up, bench below. Pre-fight calm.' },
  { key: 'tunnel', name: '3 · The Walkout', desc: 'Concrete tunnel, arena burning somewhere behind her. She walked out just to meet you.' },
  { key: 'rooftop', name: '4 · Rooftop Night', desc: 'String lights and skyline. Off-the-books sparring session above the city.' },
  { key: 'presser', name: '5 · The Weigh-In', desc: 'Step-and-repeat press wall, camera flashes. Rookie at the podium, talking a big game.' },
] as const;

type OptionKey = (typeof OPTIONS)[number]['key'];

export default function PlayBoxingBgTest() {
  return (
    <div className="h-full overflow-auto bg-[#0b101e] py-10">
      <style>{ANIM_CSS}</style>
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-2xl font-black text-white">/play with Rookie — boxing backgrounds</h1>
        <p className="mt-1 text-sm text-white/60 max-w-2xl">
          The real play setup screen — Rookie, bubble, color picker, Let&apos;s Play — over five
          boxing-world canvases. No boards, no ring. Bubbles cycle the new boxing quips.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {OPTIONS.map((o, i) => (
            <div key={o.key} className="w-[340px]">
              <div className="h-[720px] rounded-[2rem] border-4 border-white/15 overflow-hidden shadow-2xl bg-black">
                <Phone option={o.key} quipOffset={i * 6} />
              </div>
              <div className="mt-3 px-1">
                <div className="text-sm font-black text-white">{o.name}</div>
                <div className="mt-0.5 text-xs text-white/55 leading-relaxed">{o.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <QuipSheet />
      </div>
    </div>
  );
}

/* =======================================================================
   Phone = background + the faithful /play setup chrome
   ======================================================================= */

function Phone({ option, quipOffset }: { option: OptionKey; quipOffset: number }) {
  return (
    <div className="pb-anim relative h-full overflow-hidden flex flex-col bg-[#10162a]">
      {option === 'gym' && <GymBackground />}
      {option === 'locker' && <LockerBackground />}
      {option === 'tunnel' && <TunnelBackground />}
      {option === 'rooftop' && <RooftopBackground />}
      {option === 'presser' && <PresserBackground />}
      {/* spotlight pooling on Rookie in every scene — she is the feature */}
      <div
        className="absolute inset-x-0 top-[8%] h-[52%] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 38%, rgba(255,225,170,0.14), transparent 72%)', animation: 'pbBreathe 6s ease-in-out infinite' }}
      />
      <SetupScreen quipOffset={quipOffset} />
    </div>
  );
}

/* =======================================================================
   The /play setup screen, replicated from app/play/page.tsx (dark-adapted:
   same surfaces — white bubble, green CTA — with light labels).
   ======================================================================= */

function SetupScreen({ quipOffset }: { quipOffset: number }) {
  const [qi, setQi] = useState(quipOffset % ALL_QUIPS.length);
  const [color, setColor] = useState<'white' | 'black'>('white');
  useEffect(() => {
    const t = setInterval(() => setQi((i) => (i + 1) % ALL_QUIPS.length), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative z-10 h-full flex flex-col">
      {/* Top: level progress bar */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <MockLevelBar level={4} />
      </div>

      {/* Main content — mirrors the real layout */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
        <div className="w-full max-w-sm mx-auto space-y-5">
          {/* Level badge + Rookie */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(88,204,2,0.22), rgba(88,204,2,0.10))',
                border: '1px solid rgba(88,204,2,0.45)',
              }}
            >
              <span className="text-chess-green font-black text-sm">LV. 4</span>
              <span className="text-white/50 font-semibold text-xs">&middot;</span>
              <span className="text-white/70 font-semibold text-xs">Club Player</span>
            </div>

            <div className="my-1 drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]">
              <BreathingRook size="lg" animate />
            </div>

            {/* Speech bubble — same white surface as production */}
            <div className="relative w-full h-[88px]">
              <div
                className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-[2px]"
                style={{ boxShadow: '-1px -1px 2px rgba(0,0,0,0.03)' }}
              />
              <div className="relative bg-white rounded-2xl px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.03)] h-full flex items-center justify-center">
                <p key={qi} className="text-chess-text text-[14px] leading-relaxed font-medium text-center line-clamp-3">
                  {ALL_QUIPS[qi]}
                </p>
              </div>
            </div>
          </div>

          {/* Match note */}
          <div className="flex justify-center">
            <span className="text-xs text-white/60 font-semibold text-center">
              Rookie matches your rating automatically
            </span>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wide mb-1.5 block">
              Your color
            </label>
            <div className="flex gap-2">
              {(['white', 'black'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    color === c
                      ? c === 'white'
                        ? 'bg-white text-chess-text ring-2 ring-chess-green shadow-md'
                        : 'bg-gray-800 text-white ring-2 ring-chess-green shadow-md'
                      : 'bg-white/10 text-white/60 border border-white/15'
                  }`}
                >
                  {c === 'white' ? 'White' : 'Black'}
                </button>
              ))}
            </div>
          </div>

          {/* Play button — untouched from production */}
          <button className="w-full py-4 bg-chess-green text-white font-bold rounded-xl text-lg shadow-[0_4px_0_var(--color-chess-green-dark)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-chess-green-dark)] transition-all">
            Let&apos;s Play
          </button>
        </div>
      </div>
    </div>
  );
}

/** Simplified stand-in for LevelProgressBar: numbered pips + green fill. */
function MockLevelBar({ level }: { level: number }) {
  const LEVELS = 10;
  const pct = ((level - 0.4) / LEVELS) * 100;
  return (
    <div className="w-full">
      <div className="relative h-4 mb-1">
        {Array.from({ length: LEVELS }, (_, i) => (
          <span
            key={i}
            className={`absolute -translate-x-1/2 text-[10px] font-bold tabular-nums ${
              i + 1 === level ? 'text-chess-green' : i + 1 < level ? 'text-white/70' : 'text-white/30'
            }`}
            style={{ left: `${((i + 0.5) / LEVELS) * 100}%` }}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <div className="relative h-3.5 rounded-full overflow-hidden bg-black/40 ring-1 ring-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct}%`, background: 'linear-gradient(to right, #58cc02, #76d925)' }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
          style={{ width: `${pct}%`, background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 50%)' }}
        />
      </div>
    </div>
  );
}

/* =======================================================================
   Backgrounds — Rookie's world, no boards, no ring
   ======================================================================= */

/* --------------------------- 1 · gym after hours ---------------------- */

function GymBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #141c33 0%, #10162a 55%, #0b101e 100%)' }} />
      {/* cinderblock wall */}
      <div
        className="absolute inset-x-0 top-0 h-[55%] opacity-[0.13]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0 24px, rgba(255,255,255,0.35) 24px 25px), repeating-linear-gradient(90deg, transparent 0 50px, rgba(255,255,255,0.25) 50px 51px)',
        }}
      />
      {/* neon */}
      <div className="absolute top-[54px] left-1/2 -translate-x-1/2 whitespace-nowrap" style={{ animation: 'pbFlicker 7s linear infinite' }}>
        <span
          className="text-[13px] font-black uppercase tracking-[0.42em] text-[#ff7a7a]"
          style={{ textShadow: '0 0 8px rgba(255,90,90,0.9), 0 0 22px rgba(255,60,60,0.55)' }}
        >
          there is no tomorrow
        </span>
      </div>
      {/* bulb */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-7 bg-black/60" />
      <div className="absolute left-1/2 top-7 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#ffd98a] shadow-[0_0_16px_6px_rgba(255,200,110,0.5)]" style={{ animation: 'pbGlow 4s ease-in-out infinite' }} />
      {/* heavy bags framing the edges */}
      <HeavyBag left="-14px" delay={0} h={170} />
      <HeavyBag left="292px" delay={1.6} h={140} slow />
      {/* chalk dust */}
      {[20, 46, 64, 80, 33].map((x, i) => (
        <span
          key={x}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${x}%`, top: `${42 + ((i * 11) % 26)}%`, width: 2, height: 2, animation: `pbDust ${6 + i}s linear ${i * 0.9}s infinite` }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-44" style={{ background: 'linear-gradient(to top, rgba(4,7,14,0.85), transparent)' }} />
    </div>
  );
}

function HeavyBag({ left, delay, h, slow }: { left: string; delay: number; h: number; slow?: boolean }) {
  // Drawn as one SVG so chain, straps, and bag stay a single hanging object.
  const bagTop = 58; // below chain + ring + straps
  const bagH = h;
  const total = bagTop + bagH + 8;
  return (
    <div
      className="absolute top-0 drop-shadow-[0_16px_20px_rgba(0,0,0,0.55)]"
      style={{ left, transformOrigin: 'top center', animation: `${slow ? 'pbSwaySlow' : 'pbSway'} ${slow ? 7.5 : 6}s ease-in-out ${delay}s infinite` }}
    >
      <svg width={76} height={total} viewBox={`0 0 76 ${total}`} aria-hidden>
        <defs>
          <linearGradient id={`pbBag-${left}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5c1e1e" />
            <stop offset="0.3" stopColor="#8a2f2f" />
            <stop offset="0.55" stopColor="#963933" />
            <stop offset="0.8" stopColor="#61201f" />
            <stop offset="1" stopColor="#401414" />
          </linearGradient>
        </defs>
        {/* chain links */}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={38} cy={8 + i * 9} rx={3.2} ry={4.6} fill="none" stroke="#8b98ab" strokeWidth="2" opacity={0.85} />
        ))}
        {/* mounting ring */}
        <circle cx={38} cy={36} r={5} fill="none" stroke="#a8b4c4" strokeWidth="2.6" />
        {/* four leather straps converging from the ring to the bag collar */}
        {[14, 28, 48, 62].map((x) => (
          <path key={x} d={`M38 39 L${x} ${bagTop + 4}`} stroke="#2e1010" strokeWidth="4.5" strokeLinecap="round" />
        ))}
        {/* top collar */}
        <rect x={10} y={bagTop} width={56} height={9} rx={4.5} fill="#331111" />
        {/* body: cylinder, slight bulge toward the bottom */}
        <path
          d={`M12 ${bagTop + 7}
              C 10 ${bagTop + bagH * 0.45}, 9 ${bagTop + bagH * 0.75}, 13 ${bagTop + bagH - 12}
              Q 15 ${bagTop + bagH}, 26 ${bagTop + bagH + 3}
              Q 38 ${bagTop + bagH + 6}, 50 ${bagTop + bagH + 3}
              Q 61 ${bagTop + bagH}, 63 ${bagTop + bagH - 12}
              C 67 ${bagTop + bagH * 0.75}, 66 ${bagTop + bagH * 0.45}, 64 ${bagTop + 7}
              Z`}
          fill={`url(#pbBag-${left})`}
        />
        {/* vertical seams */}
        {[24, 38, 52].map((x) => (
          <path
            key={x}
            d={`M${x} ${bagTop + 9} C ${x - 1} ${bagTop + bagH * 0.5}, ${x - 1} ${bagTop + bagH * 0.75}, ${x} ${bagTop + bagH - 4}`}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1.4"
            fill="none"
          />
        ))}
        {/* stitched band where fists land */}
        <path d={`M12 ${bagTop + bagH * 0.42} Q 38 ${bagTop + bagH * 0.46} 64 ${bagTop + bagH * 0.42}`} stroke="rgba(0,0,0,0.3)" strokeWidth="5" fill="none" />
        <path d={`M12 ${bagTop + bagH * 0.42} Q 38 ${bagTop + bagH * 0.46} 64 ${bagTop + bagH * 0.42}`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        {/* warm highlight on the bulb side */}
        <path
          d={`M20 ${bagTop + 10} C 17 ${bagTop + bagH * 0.4}, 17 ${bagTop + bagH * 0.7}, 21 ${bagTop + bagH - 14}`}
          stroke="rgba(255,205,130,0.28)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          style={{ filter: 'blur(2px)' }}
        />
        {/* scuffs */}
        <ellipse cx={44} cy={bagTop + bagH * 0.55} rx={7} ry={3.5} fill="rgba(0,0,0,0.18)" />
        <ellipse cx={30} cy={bagTop + bagH * 0.68} rx={5} ry={2.6} fill="rgba(0,0,0,0.15)" />
      </svg>
    </div>
  );
}

/* ----------------------------- 2 · locker room ------------------------ */

function LockerBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #1a2338 0%, #141c30 55%, #0d1322 100%)' }} />
      {/* bank of lockers across the top half */}
      <div className="absolute inset-x-0 top-0 h-[46%] flex">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 relative border-r border-black/40" style={{ background: 'linear-gradient(to bottom, #23304d, #1b2540)' }}>
            {/* vents */}
            <div className="absolute top-[16%] inset-x-[22%] space-y-1.5">
              {[0, 1, 2].map((v) => (
                <div key={v} className="h-[3px] rounded bg-black/35" />
              ))}
            </div>
            {/* handle */}
            <div className="absolute top-[46%] right-[16%] w-[5px] h-6 rounded bg-black/45" />
            {/* number plate */}
            <div className="absolute top-[6%] left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/35 text-[8px] font-black text-white/50 tabular-nums">
              {i + 6}
            </div>
          </div>
        ))}
      </div>
      {/* real gloves hanging off locker #2 */}
      <div className="absolute top-[10%] left-[30%]" style={{ transformOrigin: 'top center', animation: 'pbSwaySlow 8s ease-in-out infinite' }}>
        <div className="w-[2px] h-8 bg-black/50 mx-auto" />
        <div className="relative w-16 h-16 drop-shadow-[0_8px_12px_rgba(0,0,0,0.55)]">
          <Image src="/boxing/locker/gloves.webp" alt="" fill sizes="64px" className="object-cover object-[50%_22%] scale-[1.3]" />
        </div>
      </div>
      {/* fight card taped to locker #4 */}
      <div className="absolute top-[13%] right-[7%] w-[74px] rotate-[3deg] rounded-sm bg-[#f3ead8] shadow-[0_6px_12px_rgba(0,0,0,0.45)] px-1.5 py-2 text-center">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2.5 bg-white/60 rotate-[-4deg]" />
        <div className="text-[6.5px] font-black uppercase tracking-[0.3em] text-[#8a2f2f]">Tonight</div>
        <div className="mt-0.5 text-[8.5px] font-black uppercase leading-tight text-[#2b2018]">You<br />vs<br />Rookie</div>
      </div>
      {/* bench line */}
      <div className="absolute inset-x-[6%] top-[46%] h-2 rounded bg-[#3a2c1c] shadow-[0_6px_10px_rgba(0,0,0,0.4)]" />
      <div className="absolute left-[12%] top-[47%] w-1.5 h-10 bg-[#2a2015]" />
      <div className="absolute right-[12%] top-[47%] w-1.5 h-10 bg-[#2a2015]" />
      {/* rolled towel on the bench */}
      <div className="absolute left-[20%] top-[43.5%] w-10 h-3.5 rounded-full bg-gradient-to-b from-white to-[#cdd7e3] shadow-md" />
      <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: 'linear-gradient(to top, rgba(5,8,16,0.85), transparent)' }} />
    </div>
  );
}

/* ----------------------------- 3 · the walkout ------------------------ */

function TunnelBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0d1322 0%, #101a30 45%, #0a0f1c 100%)' }} />
      {/* arena mouth glowing behind her head-height */}
      <div
        className="absolute left-1/2 top-[9%] -translate-x-1/2 w-[52%] h-[15%] rounded-t-[3rem]"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,236,180,0.9), rgba(255,214,130,0.45) 45%, rgba(120,140,200,0.12) 75%, transparent)',
          filter: 'blur(2px)',
          animation: 'pbBreathe 5s ease-in-out infinite',
        }}
      />
      {/* converging walls */}
      <svg viewBox="0 0 340 720" className="absolute inset-0 w-full h-full opacity-60">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} stroke="rgba(148,163,184,0.28)" strokeWidth={1.5 - i * 0.25} fill="none">
            <line x1={-40 - i * 45} y1={720} x2={122 - i * 12} y2={130} />
            <line x1={380 + i * 45} y1={720} x2={218 + i * 12} y2={130} />
          </g>
        ))}
        {/* ceiling strips */}
        {[0, 1, 2, 3, 4].map((i) => {
          const w = 160 - i * 26;
          return (
            <rect
              key={i}
              x={170 - w / 2}
              y={196 - i * 34}
              width={w}
              height={5 - i * 0.7}
              rx={2}
              fill="#cfe3ff"
              opacity={0.5 - i * 0.07}
              style={{ animation: `pbBlink ${6 + i * 1.7}s linear ${i * 0.8}s infinite` }}
            />
          );
        })}
      </svg>
      {/* stenciled wall text */}
      <div className="absolute top-[30%] left-2.5 -rotate-90 origin-top-left text-[9px] font-black uppercase tracking-[0.5em] text-white/15">
        Fighters only
      </div>
      <div className="absolute top-[30%] right-2.5 rotate-90 origin-top-right text-[9px] font-black uppercase tracking-[0.5em] text-white/15">
        Bout 12
      </div>
      <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: 'linear-gradient(to top, rgba(5,8,16,0.9), transparent)' }} />
    </div>
  );
}

/* ---------------------------- 4 · rooftop night ----------------------- */

function RooftopBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #171233 0%, #241a44 40%, #131327 70%, #0c0f1c 100%)' }} />
      {[12, 30, 52, 68, 85, 22, 60, 92, 42, 76].map((x, i) => (
        <span
          key={`${x}-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${x}%`,
            top: `${2 + ((i * 17) % 12)}%`,
            width: i % 3 === 0 ? 2 : 1.5,
            height: i % 3 === 0 ? 2 : 1.5,
            opacity: 0.7,
            animation: `pbBreathe ${3 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
      <div className="absolute right-[10%] top-[3.5%] w-7 h-7 rounded-full bg-[#f5edd8] shadow-[0_0_24px_8px_rgba(245,237,216,0.25)]" />
      {/* skyline */}
      <svg viewBox="0 0 340 120" className="absolute inset-x-0 top-[13%] w-full" preserveAspectRatio="none">
        {[
          'M0 120 V64 h22 V44 h16 V120', 'M44 120 V80 h26 V120', 'M76 120 V36 h14 v-10 h6 v10 h12 V120',
          'M114 120 V70 h30 V120', 'M150 120 V50 h20 V120', 'M176 120 V84 h24 V120',
          'M206 120 V30 h10 v-8 h5 v8 h13 V120', 'M240 120 V66 h26 V120', 'M272 120 V46 h18 V120', 'M296 120 V76 h44 V120',
        ].map((d, i) => (
          <path key={i} d={d} fill={i % 2 ? '#0e1526' : '#121b30'} />
        ))}
        {Array.from({ length: 26 }, (_, i) => (
          <rect
            key={i}
            x={14 + ((i * 37) % 310)}
            y={44 + ((i * 23) % 64)}
            width={2.6}
            height={3.6}
            fill="#ffd98a"
            opacity={0.75}
            style={{ animation: `pbBlink ${7 + (i % 5)}s linear ${i * 0.6}s infinite` }}
          />
        ))}
      </svg>
      {/* string lights */}
      <svg viewBox="0 0 340 90" className="absolute inset-x-0 top-[4%] w-full">
        {[{ y: 6, sag: 26, n: 7 }, { y: 36, sag: 20, n: 6 }].map(({ y, sag, n }) => (
          <g key={y}>
            <path d={`M-5 ${y} Q 170 ${y + sag} 345 ${y}`} stroke="rgba(0,0,0,0.55)" strokeWidth="1.6" fill="none" />
            {Array.from({ length: n }, (_, i) => {
              const t = (i + 0.5) / n;
              const x = -5 + 350 * t;
              const by = y + sag * 2 * t * (1 - t) * 2;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={by + 4}
                  r={3}
                  fill="#ffdf9e"
                  style={{ animation: `pbGlow ${3.5 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`, filter: 'drop-shadow(0 0 5px rgba(255,215,140,0.9))' }}
                />
              );
            })}
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(to top, rgba(6,8,16,0.85), transparent)' }} />
    </div>
  );
}

/* ------------------------- 5 · the weigh-in presser -------------------- */

const PRESSER_FLASHES = [
  { x: '8%', y: '20%', d: 0, dur: 7 },
  { x: '86%', y: '14%', d: 2.2, dur: 9 },
  { x: '16%', y: '48%', d: 4.6, dur: 8 },
  { x: '90%', y: '42%', d: 1.4, dur: 10 },
  { x: '50%', y: '10%', d: 6.1, dur: 8.5 },
];

function PresserBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #1c2440 0%, #161e36 60%, #0e1425 100%)' }} />
      {/* step-and-repeat wall: alternating wordmarks on a diagonal grid */}
      <div className="absolute inset-0 opacity-[0.6]">
        {Array.from({ length: 9 }, (_, row) => (
          <div
            key={row}
            className="absolute inset-x-0 flex justify-around whitespace-nowrap"
            style={{ top: `${row * 11.5 + (row % 2 ? 2.5 : 0)}%`, paddingLeft: row % 2 ? 34 : 0 }}
          >
            {Array.from({ length: 3 }, (_, col) => (
              <span
                key={col}
                className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                  (row + col) % 2 ? 'text-white/[0.10]' : 'text-[#ff7a7a]/[0.16]'
                }`}
              >
                {(row + col) % 2 ? 'chesspath' : 'chess boxing'}
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* camera flashes from the press pit */}
      {PRESSER_FLASHES.map((f) => (
        <span key={f.x + f.y}>
          <span
            className="absolute rounded-full bg-white"
            style={{ left: f.x, top: f.y, width: 5, height: 5, opacity: 0, filter: 'blur(3px)', animation: `pbBlink ${f.dur}s linear ${f.d}s infinite reverse` }}
          />
        </span>
      ))}
      {/* podium hint at the bottom: mic silhouettes rising into frame */}
      <div className="absolute bottom-0 inset-x-0 h-24" style={{ background: 'linear-gradient(to top, rgba(6,9,18,0.9), transparent)' }} />
      {[38, 50, 62].map((x, i) => (
        <div key={x} className="absolute bottom-0" style={{ left: `${x}%` }}>
          <div className="w-[3px] h-12 bg-black/70 mx-auto" style={{ transform: `rotate(${(i - 1) * 9}deg)`, transformOrigin: 'bottom center' }} />
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-5 rounded-full bg-[#1f2937] border border-black/60"
            style={{ transform: `rotate(${(i - 1) * 9}deg)` }}
          />
        </div>
      ))}
    </div>
  );
}

/* =======================================================================
   Quip sheet for copy review
   ======================================================================= */

function QuipSheet() {
  const groups = [
    { title: 'Idle / thinking', lines: QUIPS_IDLE },
    { title: 'You land one (you capture)', lines: QUIPS_YOU_LAND },
    { title: 'She lands one (Rookie captures)', lines: QUIPS_SHE_LANDS },
    { title: 'Meltdown (she is losing)', lines: QUIPS_MELTDOWN },
  ];
  return (
    <div className="mt-14 mb-10 max-w-3xl mx-auto">
      <h2 className="text-lg font-black text-white">The new boxing quips</h2>
      <p className="mt-1 text-xs text-white/55">Full set, by register — the same lines the bubbles cycle.</p>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title} className="rounded-2xl bg-white/[0.05] border border-white/10 p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#f6c445]">{g.title}</div>
            <ul className="mt-3 space-y-2">
              {g.lines.map((l) => (
                <li key={l} className="text-[13px] font-medium text-white/85 leading-snug">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
