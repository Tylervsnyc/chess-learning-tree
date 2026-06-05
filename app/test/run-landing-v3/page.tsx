'use client';

import { useState } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   Rookie's Run — Landing v3
   Brown/parchment MTG vibe. Rule #1 job: make "cross 8 ranks" obvious.
   ════════════════════════════════════════════════════════════════════ */

type DesignId = 'manuscript' | 'fieldguide' | 'questbrief' | 'storybook' | 'treasuremap';

const DESIGNS: { id: DesignId; label: string; blurb: string }[] = [
  { id: 'manuscript',  label: 'Manuscript',  blurb: 'Illuminated parchment, rank-ladder diagram center stage' },
  { id: 'fieldguide',  label: 'Field Guide', blurb: 'Two-column journal — diagram + footage side by side' },
  { id: 'questbrief',  label: 'Quest Brief', blurb: 'Vertical ladder hero showing the climb, footage below' },
  { id: 'storybook',   label: 'Storybook',   blurb: 'Open-book spread with drop caps and illustration plate' },
  { id: 'treasuremap', label: 'Treasure Map',blurb: '8-band map of the realm, scrying-mirror video inset' },
];

const VIDEO_SRC = '/Gameplay/run-gameplay.mp4';
const TAGLINE = "She's got this. (She does not have this.)";

/* ════════════════════════════════════════════════════════════════════════
   Global styles
   ════════════════════════════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=EB+Garamond:ital,wght@0,500;0,700;1,500;1,700&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&display=swap');

      .font-display { font-family: 'Cinzel', 'Trajan Pro', 'Georgia', serif; letter-spacing: 0.02em; }
      .font-body    { font-family: 'EB Garamond', 'Garamond', 'Georgia', serif; }
      .font-fell    { font-family: 'IM Fell English', 'EB Garamond', serif; }
      .font-fell-sc { font-family: 'IM Fell English SC', 'Cinzel', serif; }

      .parchment-grain {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch' seed='4'/><feColorMatrix values='0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0 0.05  0 0 0 0.14 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        background-size: 200px 200px;
      }
      .leather-grain {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch' seed='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        background-size: 160px 160px;
      }
      .map-grain {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch' seed='9'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.28  0 0 0 0 0.1  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        background-size: 220px 220px;
      }

      /* Climbing pawn — slow, looping */
      @keyframes climbRanks {
        0%   { transform: translateY(0); opacity: 0.95; }
        85%  { transform: translateY(-100%); opacity: 1; }
        88%  { opacity: 0; }
        100% { transform: translateY(0); opacity: 0; }
      }
      .climb { animation: climbRanks 5.5s cubic-bezier(0.5, 0, 0.5, 1) infinite; }

      @keyframes pulseFlag {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(240,196,106,0.55)); }
        50%      { transform: scale(1.06); filter: drop-shadow(0 0 10px rgba(240,196,106,0.95)); }
      }
      .pulse-flag { animation: pulseFlag 2.4s ease-in-out infinite; transform-origin: center bottom; }

      @keyframes dotMarch {
        0%   { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -16; }
      }
      .dot-march { animation: dotMarch 1.6s linear infinite; }

      @keyframes pageEntry {
        0%   { opacity: 0; transform: translateY(12px) scale(0.99); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      .page-entry { animation: pageEntry 600ms ease-out backwards; }

      .embossed-text {
        color: #f3e0b5;
        text-shadow: 0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(255,220,160,0.18);
      }
      .ink-text {
        color: #2a1505;
      }
      .ink-text-soft { color: #5a3a14; }

      .gold-foil {
        background: linear-gradient(180deg, #f5d27a 0%, #b8862a 48%, #7a4a12 52%, #b8862a 100%);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 1px 0 rgba(0,0,0,0.25);
      }

      /* Wax-seal CTA */
      @keyframes sealPulse {
        0%, 100% { box-shadow: inset 0 0 0 1px #6b1a05, inset 0 2px 3px rgba(255,200,160,0.6), inset 0 -3px 5px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.6), 0 4px 12px rgba(120,30,10,0.4); }
        50%      { box-shadow: inset 0 0 0 1px #6b1a05, inset 0 2px 3px rgba(255,200,160,0.6), inset 0 -3px 5px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.6), 0 4px 22px rgba(180,50,20,0.6); }
      }
      .wax-seal {
        background: radial-gradient(circle at 35% 28%, #d44a2e 0%, #8a1a12 70%, #4a0e08 100%);
        animation: sealPulse 3.2s ease-in-out infinite;
      }
    `}</style>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */
export default function RunLandingV3Page() {
  const [design, setDesign] = useState<DesignId>('questbrief');
  const current = DESIGNS.find((d) => d.id === design)!;

  return (
    <div
      className="min-h-screen w-full overflow-auto font-body"
      style={{
        background:
          'radial-gradient(ellipse at 50% -20%, #3a2412 0%, #1a0e05 55%, #0a0604 100%)',
      }}
    >
      <GlobalStyles />

      {/* Switcher */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-[#0a0604]/85 border-b border-[#b8923a]/25">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <p className="font-display text-[11px] tracking-[0.42em] uppercase text-[#d8b76a] mb-3">
            Rookie&apos;s Run · Landing v3 · Brown Vibes
          </p>
          <div className="flex flex-wrap gap-2">
            {DESIGNS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDesign(d.id)}
                className={`px-3.5 py-2 rounded-sm text-[11px] font-display tracking-[0.18em] uppercase transition-all ${
                  design === d.id
                    ? 'bg-[#f0c46a] text-[#1a0d05] shadow-[inset_0_1px_0_rgba(255,240,200,0.7),inset_0_-1px_0_rgba(0,0,0,0.3)]'
                    : 'bg-transparent text-[#d8b76a]/80 border border-[#b8923a]/35 hover:border-[#f0c46a]/70 hover:text-[#f0c46a]'
                }`}
                title={d.blurb}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#b8923a]/55 mt-2 italic font-fell">{current.blurb}</p>
        </div>
      </div>

      {/* Stage */}
      <div className="mx-auto max-w-[420px] px-3 py-8 flex flex-col gap-5">
        <div key={design} className="page-entry">
          {design === 'manuscript'  && <Manuscript />}
          {design === 'fieldguide'  && <FieldGuide />}
          {design === 'questbrief'  && <QuestBrief />}
          {design === 'storybook'   && <Storybook />}
          {design === 'treasuremap' && <TreasureMap />}
        </div>

        <OtherRunsPanel />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SHARED — The hero diagram. This is the thing that teaches the rule.
   ════════════════════════════════════════════════════════════════════ */

/** Horizontal 8-rank diagram with a pawn climbing from rank 1 → rank 8 on loop. */
function RankLadderHorizontal({ width = 360 }: { width?: number }) {
  const height = 120;
  const rankH = height / 8;
  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full">
        {/* Alternating rank bands */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x="0" y={i * rankH} width={width} height={rankH}
            fill={i % 2 === 0 ? '#e3cf95' : '#d4bd7e'}
          />
        ))}
        {/* Rank numbers down the left */}
        {Array.from({ length: 8 }, (_, i) => (
          <text
            key={i}
            x="8" y={(7 - i) * rankH + rankH / 2 + 3}
            fontSize="8" fontFamily="Cinzel" fill="#7a4a12" fontWeight="700"
          >
            {i + 1}
          </text>
        ))}
        {/* Labels */}
        <text x={width - 8} y={7 * rankH + rankH / 2 + 3} fontSize="9" fontFamily="Cinzel"
              fill="#7a4a12" fontWeight="900" textAnchor="end" letterSpacing="1.5">
          START
        </text>
        <text x={width - 8} y={rankH / 2 + 3} fontSize="9" fontFamily="Cinzel"
              fill="#8a1a12" fontWeight="900" textAnchor="end" letterSpacing="1.5">
          GOAL
        </text>
        {/* Dashed climbing path */}
        <line
          x1={width / 2} y1={7 * rankH + rankH / 2}
          x2={width / 2} y2={rankH / 2}
          stroke="#8a1a12" strokeWidth="1.5" strokeDasharray="3 5"
          className="dot-march"
        />
        {/* Goal flag at top */}
        <g className="pulse-flag" transform={`translate(${width / 2 - 4}, ${rankH / 2 - 6})`}>
          <rect x="0" y="0" width="1.5" height="10" fill="#2a1505" />
          <path d="M 1.5 0 L 9 2 L 1.5 4 Z" fill="#c8332a" />
        </g>
        {/* Climbing pawn */}
        <g style={{
              transform: `translate(${width / 2 - 5}px, ${6.5 * rankH}px)`,
              transformOrigin: 'center',
            }}>
          <g className="climb">
            <circle cx="5" cy="5" r="4" fill="#1a0e05" stroke="#f3e0b5" strokeWidth="0.8" />
            <circle cx="5" cy="5" r="1.5" fill="#f0c46a" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** Vertical, tall rank-ladder hero (for QuestBrief) */
function RankLadderVertical({ height = 280 }: { height?: number }) {
  const width = 60;
  const rankH = height / 8;
  return (
    <div className="relative" style={{ width, height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x="0" y={i * rankH} width={width} height={rankH}
            fill={i % 2 === 0 ? '#e3cf95' : '#c8ad6a'}
            stroke="#6b4a1a" strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <text
            key={i}
            x="6" y={(7 - i) * rankH + rankH / 2 + 4}
            fontSize="11" fontFamily="Cinzel" fill="#7a4a12" fontWeight="700"
          >
            {i + 1}
          </text>
        ))}
        {/* climbing dotted line */}
        <line
          x1={width / 2 + 4} y1={7 * rankH + rankH / 2}
          x2={width / 2 + 4} y2={rankH / 2}
          stroke="#8a1a12" strokeWidth="1.8" strokeDasharray="3 5" className="dot-march"
        />
        {/* Flag at top */}
        <g className="pulse-flag" transform={`translate(${width / 2}, ${rankH / 2 - 9})`}>
          <rect x="0" y="0" width="2" height="14" fill="#2a1505" />
          <path d="M 2 0 L 14 3 L 2 6 Z" fill="#c8332a" />
        </g>
        {/* Climbing pawn */}
        <g style={{ transform: `translate(${width / 2 - 2}px, ${6.5 * rankH}px)` }}>
          <g className="climb">
            <circle cx="6" cy="6" r="5" fill="#1a0e05" stroke="#f3e0b5" strokeWidth="1" />
            <circle cx="6" cy="6" r="2" fill="#f0c46a" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** Reusable gameplay video framed in brown */
function GameplayFrame({ heightClass = 'h-[150px]', rounded = 'rounded-[3px]' }: { heightClass?: string; rounded?: string }) {
  return (
    <div className={`relative ${heightClass} ${rounded} overflow-hidden`}
         style={{ boxShadow: 'inset 0 0 0 1px #b8862a, inset 0 0 0 2px #2a1505, 0 4px 16px rgba(0,0,0,0.5)' }}>
      <video src={VIDEO_SRC} autoPlay loop muted playsInline
             className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)' }} />
    </div>
  );
}

/** Shared "Other runs" panel — kept as-is */
function OtherRunsPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md overflow-hidden border border-[#b8923a]/25 bg-[#1a0e05]/70 backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <span className="font-display text-[11px] tracking-[0.3em] uppercase text-[#d8b76a]">Other Runs</span>
        <span className={`text-[#b8923a] text-xs transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-3 pb-3 grid grid-cols-2 gap-2">
            {['Plus', 'Bridge', 'Pawn Wall', 'Iron Curtain'].map((n) => (
              <div key={n} className="rounded border border-[#b8923a]/25 bg-[#2a1808]/70 px-3 py-2">
                <p className="font-display text-[12px] text-[#f0c46a] tracking-wide">{n}</p>
                <p className="text-[10px] text-[#b8923a]/60 italic font-fell">10 levels</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SHARED — Play button (wax-seal)
   ════════════════════════════════════════════════════════════════════ */
function WaxSealButton({ label = "Play Today's Run" }: { label?: string }) {
  return (
    <button
      type="button"
      className="relative w-full flex items-center gap-3 px-4 py-3 rounded-sm overflow-hidden group active:translate-y-px transition-transform"
      style={{
        background: 'linear-gradient(180deg, #c9a14a 0%, #7a5212 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,245,210,0.75), inset 0 -2px 0 rgba(60,30,4,0.55), inset 0 0 0 1px #2a1505, 0 4px 12px rgba(0,0,0,0.5)',
      }}
    >
      <span className="wax-seal w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-[14px] text-[#f3e0b5] shrink-0">
        ▶
      </span>
      <span className="font-display font-black text-[13px] tracking-[0.22em] uppercase ink-text">
        {label}
      </span>
      <span className="ml-auto text-[#2a1505]/70 font-fell italic text-[10px]">one run · today</span>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   1. MANUSCRIPT — illuminated parchment, ladder diagram center stage
   ════════════════════════════════════════════════════════════════════ */
function Manuscript() {
  return (
    <div
      className="relative rounded-md p-5 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #f3e3b8 0%, #e3cf95 100%)',
        boxShadow: 'inset 0 0 0 1px #6b4a1a, inset 0 0 0 4px #f3e3b8, inset 0 0 0 5px #6b4a1a, 0 24px 60px -14px rgba(0,0,0,0.7)',
      }}
    >
      <div className="absolute inset-0 parchment-grain pointer-events-none" />

      {/* Header */}
      <div className="relative text-center mb-3">
        <p className="font-fell-sc text-[10px] tracking-[0.35em] text-[#7a4a12] uppercase">Chapter I</p>
        <h1 className="font-display text-[26px] font-black mt-0.5 ink-text leading-none">
          Rookie&apos;s Run
        </h1>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span className="h-px w-12 bg-[#7a4a12]/45" />
          <span className="text-[#7a4a12] text-[10px]">✦</span>
          <span className="h-px w-12 bg-[#7a4a12]/45" />
        </div>
      </div>

      {/* THE TEACHING DIAGRAM */}
      <div className="relative rounded border-2 border-[#7a4a12]/35 p-3 bg-[#f8efd6]/60">
        <p className="font-display text-[10px] tracking-[0.28em] uppercase text-[#7a4a12] mb-2 text-center">
          The Crossing
        </p>
        <RankLadderHorizontal />
        <p className="font-fell italic text-[12px] ink-text-soft text-center mt-2 leading-snug">
          Walk Rookie from rank 1 to rank 8. Each crossing earns the next level.
        </p>
      </div>

      {/* Footage */}
      <div className="relative mt-3">
        <GameplayFrame heightClass="h-[140px]" />
        <p className="font-fell italic text-[10px] ink-text-soft text-center mt-1">
          — a vision of one such crossing —
        </p>
      </div>

      {/* Rules */}
      <ol className="relative mt-3 space-y-1.5">
        {[
          { n: 'I',   t: 'Cross the board.',          s: 'Reach rank 8 to clear the level.' },
          { n: 'II',  t: 'Capture to charge tempo.',  s: 'Pieces taken fuel new abilities.' },
          { n: 'III', t: 'Show no mercy.',            s: 'One run a day. Make it count.' },
        ].map((r) => (
          <li key={r.n} className="flex items-baseline gap-3 border-b border-[#7a4a12]/15 pb-1.5 last:border-b-0">
            <span className="font-display font-black text-[#8a1a12] w-5 shrink-0 text-[13px]">{r.n}.</span>
            <div>
              <p className="font-fell font-bold text-[13px] ink-text leading-tight">{r.t}</p>
              <p className="font-fell text-[11px] ink-text-soft italic leading-snug">{r.s}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* CTA */}
      <div className="relative mt-4">
        <WaxSealButton />
      </div>

      <p className="relative text-center font-fell italic text-[10.5px] ink-text-soft mt-3">
        &ldquo;{TAGLINE}&rdquo;
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   2. FIELD GUIDE — two-column journal
   ════════════════════════════════════════════════════════════════════ */
function FieldGuide() {
  return (
    <div
      className="relative rounded-md overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #2a1808 0%, #1a0d05 100%)',
        boxShadow: 'inset 0 0 0 1px #6b4a1a, inset 0 0 0 3px #2a1808, inset 0 0 0 4px #b8923a, 0 24px 60px -14px rgba(0,0,0,0.85)',
      }}
    >
      <div className="absolute inset-0 leather-grain pointer-events-none opacity-50" />

      {/* Header strip */}
      <div className="relative px-5 pt-4 pb-3 border-b border-[#b8923a]/35">
        <p className="font-fell-sc text-[10px] tracking-[0.4em] text-[#d8b76a] uppercase">Field Guide · Entry № 1</p>
        <h1 className="font-display text-[24px] font-black embossed-text leading-none mt-1">
          Rookie&apos;s Run
        </h1>
        <p className="font-fell italic text-[11px] text-[#b8923a] mt-0.5">
          A study of the eight-rank crossing.
        </p>
      </div>

      {/* Body — parchment inset */}
      <div className="relative m-3 rounded-sm p-4"
           style={{
             background: 'linear-gradient(180deg, #f3e3b8 0%, #e3cf95 100%)',
             boxShadow: 'inset 0 0 0 1px #6b4a1a',
           }}>
        <div className="absolute inset-0 parchment-grain pointer-events-none" />

        {/* Two-column observation + diagram */}
        <div className="relative grid grid-cols-[1fr_auto] gap-3 items-center">
          <div>
            <p className="font-fell-sc text-[9px] tracking-[0.3em] uppercase text-[#8a1a12] mb-1">
              Observation
            </p>
            <p className="font-fell text-[12.5px] ink-text leading-snug">
              The rook begins at <b>rank 1</b>. To advance, she must reach <b>rank 8</b> alive.
            </p>
            <p className="font-fell italic text-[11px] ink-text-soft mt-1.5">
              Eight squares. Many obstacles.
            </p>
          </div>
          {/* Mini vertical ladder beside */}
          <div className="shrink-0">
            <RankLadderVertical height={120} />
          </div>
        </div>

        {/* Footage plate */}
        <div className="relative mt-3 border-2 border-[#7a4a12]/40 rounded-sm p-1.5 bg-[#1a0e05]/80">
          <p className="font-fell-sc text-[9px] tracking-[0.3em] uppercase text-[#d8b76a] mb-1 text-center">
            Plate I — A Crossing Observed
          </p>
          <GameplayFrame heightClass="h-[130px]" rounded="rounded-[1px]" />
        </div>

        {/* Rules as field notes */}
        <div className="relative mt-3 space-y-1">
          {[
            { n: 1, t: 'Cross 8 ranks. ',   s: 'Each rank cleared brings the next level closer.' },
            { n: 2, t: 'Capture for tempo. ',s: 'A taken piece is a charged ability.' },
            { n: 3, t: 'Show no mercy. ',    s: 'One attempt per day.' },
          ].map((r) => (
            <div key={r.n} className="flex items-baseline gap-2">
              <span className="font-display font-black ink-text text-[11px]">§{r.n}</span>
              <p className="font-fell text-[12px] leading-snug">
                <b className="ink-text">{r.t}</b>
                <span className="ink-text-soft italic">{r.s}</span>
              </p>
            </div>
          ))}
        </div>

        <p className="relative font-fell italic text-[10.5px] ink-text-soft text-right mt-3 border-t border-[#7a4a12]/25 pt-2">
          &ldquo;{TAGLINE}&rdquo; — Rookie
        </p>
      </div>

      <div className="relative px-3 pb-4">
        <WaxSealButton label="Begin the Crossing" />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   3. QUEST BRIEF — vertical ladder hero
   ════════════════════════════════════════════════════════════════════ */
function QuestBrief() {
  return (
    <div
      className="relative rounded-md p-4 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #2a1808 0%, #150a04 100%)',
        boxShadow: 'inset 0 0 0 1px #b8923a, inset 0 0 0 2px #2a1808, inset 0 0 0 4px #6b4a1a, 0 24px 60px -14px rgba(0,0,0,0.85)',
      }}
    >
      <div className="absolute inset-0 leather-grain pointer-events-none opacity-60" />

      {/* Title */}
      <div className="relative text-center">
        <p className="font-fell-sc text-[10px] tracking-[0.4em] text-[#d8b76a] uppercase">Today&apos;s Quest</p>
        <h1 className="font-display text-[28px] font-black gold-foil leading-none mt-1">
          Rookie&apos;s Run
        </h1>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span className="h-px w-10 bg-[#b8923a]/45" />
          <span className="text-[#f0c46a] text-[10px]">✦</span>
          <span className="h-px w-10 bg-[#b8923a]/45" />
        </div>
      </div>

      {/* THE HERO: ladder + footage side by side */}
      <div className="relative mt-3 grid grid-cols-[auto_1fr] gap-3 items-stretch">
        {/* Vertical 8-rank ladder */}
        <div className="rounded-sm p-2"
             style={{
               background: 'linear-gradient(180deg, #f3e3b8 0%, #d4bd7e 100%)',
               boxShadow: 'inset 0 0 0 1px #6b4a1a, inset 0 0 0 2px #2a1808'
             }}>
          <RankLadderVertical height={220} />
        </div>

        {/* Right: instructions stacked */}
        <div className="flex flex-col gap-2.5">
          <div className="rounded-sm px-3 py-2"
               style={{ background: 'linear-gradient(180deg, #8a1a12 0%, #4a0e08 100%)',
                        boxShadow: 'inset 0 1px 0 rgba(255,200,160,0.4), inset 0 -1px 0 rgba(0,0,0,0.6)' }}>
            <p className="font-fell-sc text-[9px] tracking-[0.3em] uppercase text-[#f0c46a]">Objective</p>
            <p className="font-display font-black text-[15px] embossed-text leading-tight mt-0.5">
              Reach rank 8.
            </p>
            <p className="font-fell italic text-[11px] text-[#f3e0b5]/85 leading-snug">
              Cross all eight ranks. Survive.
            </p>
          </div>

          <GameplayFrame heightClass="h-[120px]" />

          <div className="rounded-sm px-3 py-2 bg-[#1a0e05]/70 border border-[#b8923a]/30">
            <p className="font-fell-sc text-[9px] tracking-[0.3em] uppercase text-[#d8b76a]">Rules</p>
            <ol className="font-fell text-[11.5px] text-[#f3e0b5] mt-1 space-y-0.5">
              <li><b className="text-[#f0c46a]">1.</b> Capture to charge tempo.</li>
              <li><b className="text-[#f0c46a]">2.</b> One run per day.</li>
              <li><b className="text-[#f0c46a]">3.</b> Show no mercy.</li>
            </ol>
          </div>
        </div>
      </div>

      <p className="relative text-center font-fell italic text-[11px] text-[#b8923a]/80 mt-3">
        &ldquo;{TAGLINE}&rdquo;
      </p>

      <div className="relative mt-3">
        <WaxSealButton />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   4. STORYBOOK — open-book spread, big illuminated drop cap
   ════════════════════════════════════════════════════════════════════ */
function Storybook() {
  return (
    <div className="relative">
      {/* Book outer cover */}
      <div
        className="relative rounded-md p-2.5 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3a2010 0%, #1a0d05 100%)',
          boxShadow: 'inset 0 0 0 1px #6b4a1a, inset 0 0 0 3px #3a2010, inset 0 0 0 4px #b8923a, 0 24px 60px -14px rgba(0,0,0,0.9)',
        }}
      >
        <div className="absolute inset-0 leather-grain pointer-events-none opacity-70" />

        {/* Pages */}
        <div
          className="relative rounded-sm overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #f8efd6 0%, #e3cf95 100%)',
            boxShadow: 'inset 0 0 0 1px #6b4a1a, inset 4px 0 12px -6px rgba(80,40,0,0.25), inset -4px 0 12px -6px rgba(80,40,0,0.25)',
          }}
        >
          <div className="absolute inset-0 parchment-grain pointer-events-none" />
          {/* center book gutter shadow */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 pointer-events-none"
               style={{ background: 'radial-gradient(ellipse at center, rgba(80,40,0,0.35) 0%, transparent 70%)' }} />

          {/* Header */}
          <div className="relative text-center px-5 pt-4">
            <p className="font-fell-sc text-[10px] tracking-[0.35em] text-[#7a4a12] uppercase">A Tale</p>
            <h1 className="font-display text-[22px] font-black ink-text leading-none mt-1">
              Rookie&apos;s Run
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-px w-10 bg-[#7a4a12]/45" />
              <span className="text-[#7a4a12] text-[9px]">❧</span>
              <span className="h-px w-10 bg-[#7a4a12]/45" />
            </div>
          </div>

          {/* Spread */}
          <div className="relative px-4 py-3 grid grid-cols-2 gap-4">
            {/* Left page — illuminated drop cap + story */}
            <div>
              <p className="font-fell text-[12.5px] ink-text leading-snug">
                <span
                  className="float-left mr-1.5 font-display font-black text-[48px] leading-[0.85] ink-text"
                  style={{ color: '#8a1a12', textShadow: '0 1px 0 rgba(255,220,160,0.6)' }}
                >
                  R
                </span>
                ookie walks an eight-rank crossing. Begin at <b>1</b>, reach <b>8</b>, and the next level opens.
              </p>
              <p className="font-fell italic text-[11px] ink-text-soft mt-2 leading-snug">
                She insists she does not need help. She does.
              </p>

              {/* mini horizontal ladder */}
              <div className="mt-2.5 rounded-sm border border-[#7a4a12]/35 p-1.5 bg-[#f8efd6]/80">
                <RankLadderHorizontal />
              </div>
            </div>

            {/* Right page — illustration plate */}
            <div>
              <p className="font-fell-sc text-[9px] tracking-[0.3em] uppercase text-[#7a4a12] mb-1 text-center">
                Plate I
              </p>
              <GameplayFrame heightClass="h-[120px]" rounded="rounded-[2px]" />
              <p className="font-fell italic text-[10px] ink-text-soft text-center mt-1 leading-snug">
                Rookie at the crossing.
              </p>

              {/* Rules — compact */}
              <ol className="mt-2 font-fell text-[10.5px] ink-text leading-tight space-y-0.5">
                <li><b className="text-[#8a1a12]">i.</b> Cross 8 ranks.</li>
                <li><b className="text-[#8a1a12]">ii.</b> Capture for tempo.</li>
                <li><b className="text-[#8a1a12]">iii.</b> One run a day.</li>
              </ol>
            </div>
          </div>

          {/* Footer line */}
          <div className="relative px-5 pb-4 pt-1">
            <div className="h-px bg-[#7a4a12]/30 mb-2" />
            <p className="font-fell italic text-[11px] ink-text-soft text-center">
              &ldquo;{TAGLINE}&rdquo;
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <WaxSealButton label="Turn the Page" />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   5. TREASURE MAP — 8 horizontal "bands" stacked as the realm
   ════════════════════════════════════════════════════════════════════ */
function TreasureMap() {
  const bands = [
    { n: 8, label: 'The Throne',     accent: '#8a1a12', goal: true },
    { n: 7, label: 'Ridge of Spires' },
    { n: 6, label: 'The Bone March' },
    { n: 5, label: 'Iron River' },
    { n: 4, label: 'Wolfwood' },
    { n: 3, label: 'Ash Plains' },
    { n: 2, label: 'Hearth Lane' },
    { n: 1, label: 'Home',           accent: '#2a5a18', start: true },
  ];

  return (
    <div
      className="relative rounded-md overflow-hidden p-2"
      style={{
        background: 'linear-gradient(180deg, #3a2010 0%, #1a0d05 100%)',
        boxShadow: 'inset 0 0 0 1px #6b4a1a, inset 0 0 0 3px #3a2010, inset 0 0 0 4px #b8923a, 0 24px 60px -14px rgba(0,0,0,0.9)',
      }}
    >
      {/* Parchment map */}
      <div
        className="relative rounded-sm p-4"
        style={{
          background: 'linear-gradient(180deg, #e6c577 0%, #c8a85a 50%, #a88536 100%)',
          boxShadow: 'inset 0 0 0 1px #6b4a1a, inset 0 0 40px rgba(80,40,0,0.4)',
        }}
      >
        <div className="absolute inset-0 map-grain pointer-events-none opacity-80" />

        {/* Title */}
        <div className="relative text-center mb-2">
          <p className="font-fell-sc text-[9px] tracking-[0.4em] text-[#3a1a05] uppercase">A Mappe of</p>
          <h1 className="font-display text-[22px] font-black ink-text leading-none">
            Rookie&apos;s Run
          </h1>
          <p className="font-fell italic text-[10.5px] ink-text-soft mt-0.5">
            from <b>Home</b> to <b>The Throne</b> — eight ranks
          </p>
        </div>

        {/* Realm bands */}
        <div className="relative rounded-sm overflow-hidden border-2 border-[#3a1a05]/55">
          {bands.map((b) => (
            <div
              key={b.n}
              className="flex items-center justify-between px-2.5 py-1.5 border-b last:border-b-0 border-[#3a1a05]/25 relative"
              style={{
                background: b.goal
                  ? 'linear-gradient(90deg, #8a1a12 0%, #c8332a 50%, #8a1a12 100%)'
                  : b.start
                  ? 'linear-gradient(90deg, #4a6a28 0%, #6b8a3a 50%, #4a6a28 100%)'
                  : 'transparent',
                color: b.goal || b.start ? '#f3e0b5' : '#2a1505',
              }}
            >
              <span className={`font-display font-black text-[11px] w-5 ${b.goal || b.start ? 'embossed-text' : 'ink-text'}`}>
                {b.n}
              </span>
              <span className={`font-fell text-[12.5px] flex-1 ${b.goal || b.start ? 'embossed-text font-bold' : 'ink-text'}`}>
                {b.label}
              </span>
              {b.goal && (
                <span className="pulse-flag text-[#f0c46a] text-[12px]">⚑</span>
              )}
              {b.start && (
                <span className="text-[#f0c46a] text-[10px] font-display tracking-[0.2em]">YOU</span>
              )}
            </div>
          ))}
          {/* climbing dotted path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <line x1="78" y1="92" x2="78" y2="8" stroke="#3a1a05" strokeWidth="0.6"
                  strokeDasharray="2 3" className="dot-march" />
          </svg>
        </div>

        {/* Scrying mirror — circular video inset */}
        <div className="relative mt-3 flex items-center gap-3">
          <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden shrink-0"
               style={{
                 boxShadow: 'inset 0 0 0 2px #2a1505, inset 0 0 0 4px #b8923a, inset 0 0 0 5px #2a1505, 0 4px 12px rgba(0,0,0,0.6)',
               }}>
            <video src={VIDEO_SRC} autoPlay loop muted playsInline
                   className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.45) 100%)' }} />
          </div>
          <div>
            <p className="font-fell-sc text-[9px] tracking-[0.3em] uppercase ink-text-soft">Scrying Glass</p>
            <p className="font-fell italic text-[11.5px] ink-text leading-snug">
              A vision of the crossing.
              <br />
              Capture for tempo. One run per day.
            </p>
          </div>
        </div>

        <p className="relative font-fell italic text-[10.5px] ink-text-soft text-center mt-3 border-t border-[#3a1a05]/30 pt-2">
          &ldquo;{TAGLINE}&rdquo;
        </p>
      </div>

      <div className="px-1.5 pt-3 pb-1">
        <WaxSealButton label="Set Forth" />
      </div>
    </div>
  );
}
