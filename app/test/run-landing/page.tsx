'use client';

import { useState } from 'react';
import { RookiesRunLogo } from '@/components/run/RookiesRunLogo';

type DesignId = 'arcade' | 'storybook' | 'terminal' | 'magazine' | 'minimal';

const DESIGNS: { id: DesignId; label: string; blurb: string }[] = [
  { id: 'arcade', label: '1. Arcade', blurb: 'Pixel cabinet, neon, INSERT COIN' },
  { id: 'storybook', label: '2. Storybook', blurb: 'Picture book, Rookie front and center' },
  { id: 'terminal', label: '3. Terminal', blurb: 'Dark roguelike monospace' },
  { id: 'magazine', label: '4. Magazine', blurb: 'Editorial big type, tactile' },
  { id: 'minimal', label: '5. Minimal', blurb: 'Apple-clean, lots of whitespace' },
];

const RULES = [
  { n: 1, title: 'Reach the 8th rank.', sub: 'Get Rookie across the board, one square at a time.' },
  { n: 2, title: 'Capture to charge tempo.', sub: 'Take pieces. Tempo unlocks new abilities.' },
  { n: 3, title: 'Show no mercy.', sub: 'One run a day. Make it count.' },
];

export default function RunLandingTestPage() {
  const [design, setDesign] = useState<DesignId>('arcade');

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white overflow-auto">
      {/* Top switcher */}
      <div className="sticky top-0 z-20 bg-neutral-950/95 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
            Rookie&apos;s Run — landing screen options
          </p>
          <div className="flex flex-wrap gap-2">
            {DESIGNS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDesign(d.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                  design === d.id
                    ? 'bg-white text-neutral-900 border-white'
                    : 'bg-transparent text-white/80 border-white/20 hover:border-white/50'
                }`}
                title={d.blurb}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-white/50 mt-2">
            {DESIGNS.find((d) => d.id === design)?.blurb}
          </p>
        </div>
      </div>

      {/* Preview frame — phone-ish */}
      <div className="mx-auto max-w-[420px] px-3 py-6">
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {design === 'arcade' && <ArcadeDesign />}
          {design === 'storybook' && <StorybookDesign />}
          {design === 'terminal' && <TerminalDesign />}
          {design === 'magazine' && <MagazineDesign />}
          {design === 'minimal' && <MinimalDesign />}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared: "Other runs" drop-down placeholder (keeps current behavior)
   ────────────────────────────────────────────────────────────────────── */
function OtherRunsPanel({ tone = 'dark' }: { tone?: 'dark' | 'light' | 'paper' | 'neon' }) {
  const [open, setOpen] = useState(false);
  const palette =
    tone === 'light'
      ? { bg: 'bg-black/5', text: 'text-neutral-900', sub: 'text-neutral-600', chip: 'bg-white border border-black/10' }
      : tone === 'paper'
      ? { bg: 'bg-[#1a0d05]/10', text: 'text-[#1a0d05]', sub: 'text-[#5a3a14]', chip: 'bg-[#f3e5c2] border border-[#6b4a1a]/40' }
      : tone === 'neon'
      ? { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-100', sub: 'text-fuchsia-300/70', chip: 'bg-black/40 border border-fuchsia-400/40' }
      : { bg: 'bg-white/5', text: 'text-white', sub: 'text-white/60', chip: 'bg-white/10 border border-white/15' };

  return (
    <div className={`${palette.bg} rounded-xl overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 ${palette.text}`}
      >
        <span className="text-sm font-bold">Other runs</span>
        <span className={`text-xs ${palette.sub} transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-3 pb-3 grid grid-cols-2 gap-2">
          {['Plus', 'Bridge', 'Pawn Wall', 'Iron Curtain'].map((n) => (
            <div key={n} className={`${palette.chip} rounded-lg px-3 py-2`}>
              <p className={`text-xs font-bold ${palette.text}`}>{n}</p>
              <p className={`text-[10px] ${palette.sub}`}>10 levels</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   1. ARCADE — pixel cabinet, neon, INSERT COIN energy
   ────────────────────────────────────────────────────────────────────── */
function ArcadeDesign() {
  return (
    <div
      className="relative min-h-[720px] p-5 flex flex-col gap-5"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #2a0a3a 0%, #0a0014 70%), #0a0014',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div className="relative flex justify-center pt-4">
        <div style={{ filter: 'drop-shadow(0 0 18px rgba(255,80,200,0.6))' }}>
          <RookiesRunLogo scale={0.55} />
        </div>
      </div>

      <div className="relative text-center">
        <p className="text-[10px] tracking-[0.4em] text-fuchsia-300/80">HIGH SCORE: STREAK 12</p>
        <h1
          className="text-3xl font-black mt-2 text-cyan-300"
          style={{ textShadow: '0 0 12px rgba(0,220,255,0.7), 0 0 2px #fff' }}
        >
          DAILY RUN
        </h1>
      </div>

      <div className="relative flex flex-col gap-2">
        {RULES.map((r) => (
          <div
            key={r.n}
            className="flex items-center gap-3 px-3 py-2 rounded border border-fuchsia-400/40 bg-black/40"
          >
            <span className="text-cyan-300 text-sm font-black">0{r.n}</span>
            <span className="text-sm text-fuchsia-100 font-bold">{r.title}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="relative mt-2 py-4 rounded text-base font-black tracking-[0.3em] text-black"
        style={{
          background: 'linear-gradient(180deg, #ffd84d 0%, #ff8a00 100%)',
          boxShadow: '0 0 24px rgba(255,180,0,0.6), inset 0 -3px 0 rgba(0,0,0,0.3)',
        }}
      >
        ▶ PRESS START
      </button>
      <p className="relative text-center text-[10px] tracking-[0.3em] text-fuchsia-300/60 animate-pulse -mt-2">
        INSERT COIN · 1 RUN PER DAY
      </p>

      <div className="relative">
        <OtherRunsPanel tone="neon" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   2. STORYBOOK — picture-book illustration, big Rookie energy
   ────────────────────────────────────────────────────────────────────── */
function StorybookDesign() {
  return (
    <div className="relative min-h-[720px] p-5 flex flex-col gap-4 bg-[#fef6e4] text-[#1a1207]">
      {/* Sky scene */}
      <div className="rounded-2xl overflow-hidden relative h-[220px] bg-gradient-to-b from-[#a7d8ff] via-[#ffd6a5] to-[#fef6e4]">
        <div className="absolute top-3 right-4 w-10 h-10 rounded-full bg-[#fff3b0] shadow-[0_0_30px_rgba(255,200,100,0.6)]" />
        <div className="absolute bottom-3 left-4 right-4 h-2 rounded bg-[#8b5e34]/70" />
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <RookiesRunLogo scale={0.55} />
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#a85a2a]">Chapter Today</p>
        <h1 className="text-3xl font-black leading-tight mt-1">
          Rookie&apos;s Daily Run
        </h1>
        <p className="text-sm mt-1.5 italic text-[#5a3a14]">
          &quot;She&apos;s got this. (She does not have this.)&quot;
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {RULES.map((r) => (
          <div key={r.n} className="flex items-start gap-3">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
              style={{ background: '#e85a4f' }}
            >
              {r.n}
            </span>
            <div>
              <p className="text-sm font-black leading-tight">{r.title}</p>
              <p className="text-xs text-[#5a3a14] leading-snug">{r.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-1 py-3.5 rounded-xl text-base font-black text-white tracking-wide"
        style={{
          background: 'linear-gradient(180deg, #e85a4f 0%, #c83a2f 100%)',
          boxShadow: '0 6px 0 #8a1a12, 0 10px 20px rgba(0,0,0,0.15)',
        }}
      >
        Play Today&apos;s Run →
      </button>

      <OtherRunsPanel tone="paper" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   3. TERMINAL — dark roguelike monospace
   ────────────────────────────────────────────────────────────────────── */
function TerminalDesign() {
  return (
    <div
      className="min-h-[720px] p-5 flex flex-col gap-4 bg-black text-green-300"
      style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
    >
      <div className="text-[11px] text-green-500/70">
        <p>$ rookie --daily 2026-05-26</p>
        <p className="text-green-300/50">loading run...</p>
      </div>

      <div className="border border-green-500/40 rounded p-3">
        <pre className="text-[10px] text-green-400 leading-tight whitespace-pre">{`
   ┌──────────────────────────┐
   │   ROOKIE'S RUN  v1.0     │
   │   daily / roguelike      │
   └──────────────────────────┘
`}</pre>
        <div className="flex justify-center -mt-1">
          <div style={{ filter: 'hue-rotate(80deg) saturate(0.5) brightness(1.1)' }}>
            <RookiesRunLogo scale={0.4} />
          </div>
        </div>
      </div>

      <div className="text-sm leading-relaxed">
        <p className="text-green-500/80">## OBJECTIVE</p>
        {RULES.map((r) => (
          <p key={r.n} className="text-green-200">
            <span className="text-green-500">[{r.n}]</span> {r.title}
          </p>
        ))}
      </div>

      <div className="text-[11px] text-green-500/60 border-t border-green-500/20 pt-3">
        <p>streak: ████░░░░░░ 4 days</p>
        <p>seed:   2026-05-26</p>
        <p>runs:   1 / day</p>
      </div>

      <button
        type="button"
        className="mt-auto py-3 rounded border-2 border-green-400 bg-green-500/10 text-green-200 font-black tracking-[0.2em] hover:bg-green-500/20"
      >
        &gt; BEGIN RUN _
      </button>

      <OtherRunsPanel tone="dark" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   4. MAGAZINE — editorial, big type, tactile paper
   ────────────────────────────────────────────────────────────────────── */
function MagazineDesign() {
  return (
    <div className="min-h-[720px] p-5 flex flex-col gap-5 bg-[#f5f1ea] text-[#1a1207]">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#5a3a14] border-b border-[#1a1207]/20 pb-2">
        <span>Vol. 01 · Daily</span>
        <span>05 / 26 / 26</span>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#e85a4f]">Today&apos;s Feature</p>
        <h1
          className="text-[56px] leading-[0.85] font-black mt-2 tracking-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Rookie&apos;s
          <br />
          <span className="italic">Run.</span>
        </h1>
        <p className="text-sm leading-snug mt-3 text-[#3a2a14]">
          One board. Three rules. A rook who insists she does not need your help — and obviously does.
        </p>
      </div>

      <div className="flex justify-center my-1">
        <RookiesRunLogo scale={0.5} />
      </div>

      <div className="flex flex-col divide-y divide-[#1a1207]/15 border-y border-[#1a1207]/15">
        {RULES.map((r) => (
          <div key={r.n} className="flex items-baseline gap-3 py-2.5">
            <span
              className="text-2xl font-black text-[#e85a4f] shrink-0 w-8"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {r.n}
            </span>
            <div>
              <p className="text-sm font-black">{r.title}</p>
              <p className="text-xs text-[#5a3a14]">{r.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="py-3.5 rounded-none bg-[#1a1207] text-[#f5f1ea] text-sm font-black tracking-[0.25em] uppercase"
      >
        Play Today&apos;s Run
      </button>

      <OtherRunsPanel tone="light" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   5. MINIMAL — Apple-clean, lots of whitespace
   ────────────────────────────────────────────────────────────────────── */
function MinimalDesign() {
  return (
    <div className="min-h-[720px] p-6 flex flex-col gap-7 bg-white text-neutral-900">
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>May 26</span>
        <span>Streak · 4 🔥</span>
      </div>

      <div className="flex flex-col items-center gap-4 mt-4">
        <RookiesRunLogo scale={0.55} />
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight">Rookie&apos;s Run</h1>
          <p className="text-sm text-neutral-500 mt-1">A daily chess roguelike.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {RULES.map((r) => (
          <div key={r.n} className="flex items-start gap-4">
            <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500 shrink-0">
              {r.n}
            </span>
            <div>
              <p className="text-sm font-bold leading-tight">{r.title}</p>
              <p className="text-xs text-neutral-500 leading-snug">{r.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          className="py-4 rounded-2xl bg-neutral-900 text-white text-base font-bold"
        >
          Play Today&apos;s Run
        </button>
        <OtherRunsPanel tone="light" />
      </div>
    </div>
  );
}
