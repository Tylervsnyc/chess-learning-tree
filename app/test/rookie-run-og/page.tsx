'use client';

import { useState } from 'react';
import { BreathingRook, type RookieMood } from '@/components/ui/BreathingRook';

/**
 * OG image lab — 5 simple variations of:
 *   Rookie's Run · A daily chess roguelike
 *   + pills: Unlock powers · Clear 10 levels · New board daily
 * Each pulled by a different impeccable skill.
 */

export default function RookieRunOgPage() {
  const [scale, setScale] = useState(0.55);
  return (
    <div className="min-h-screen w-full overflow-auto bg-[oklch(0.96_0.01_85)] text-[oklch(0.2_0.02_280)]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Fraunces:opsz,wght,SOFT@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter+Tight:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/10 bg-[oklch(0.96_0.01_85)]/90 px-6 py-4 backdrop-blur">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Rookie&apos;s Run / Simple × 5
          </h1>
          <p className="text-sm text-black/60">Same content, different design pulls · 1200×630</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-black/60">scale</span>
          <input type="range" min={0.3} max={1} step={0.05} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
          <span className="w-10 font-mono text-xs">{Math.round(scale * 100)}%</span>
        </label>
      </header>

      <main className="mx-auto flex max-w-[1400px] flex-col gap-16 px-6 py-12">
        <OgCard number="01" skill="Distill" name="Stark" notes="White bg. Black ink. Outline pills. Nothing else earns the page." scale={scale}><DistillOg /></OgCard>
        <OgCard number="02" skill="Polish" name="Editorial" notes="Hairline frame, corner meta, serif italic accent, dot separator." scale={scale}><PolishOg /></OgCard>
        <OgCard number="03" skill="Quieter" name="Soft" notes="Warm cream wash, gentle pills, low-contrast type. Whispered, not shouted." scale={scale}><QuieterOg /></OgCard>
        <OgCard number="04" skill="Clarify" name="Strong hierarchy" notes="Tiny eyebrow, giant title, clean sub, pills as visual anchor." scale={scale}><ClarifyOg /></OgCard>
        <OgCard number="05" skill="Normalize" name="Brand-friendly" notes="Soft rounded everything, Chess Path warmth, subtle Rookie shadow." scale={scale}><NormalizeOg /></OgCard>
      </main>
    </div>
  );
}

function OgCard({
  number, skill, name, notes, scale, children,
}: { number: string; skill: string; name: string; notes: string; scale: number; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-[auto_1fr] gap-6">
      <div className="flex flex-col items-end pr-4 text-right" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
        <div className="text-[10px] tracking-[0.3em] text-black/40">OG · {number}</div>
        <div
          className="mt-1 inline-block self-end rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ background: 'oklch(0.18 0.02 280)', color: 'oklch(0.97 0.04 85)' }}
        >
          /{skill.toLowerCase()}
        </div>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight">{name}</h2>
        <p className="mt-3 max-w-[14ch] text-sm leading-snug text-black/60">{notes}</p>
        <div className="mt-4 text-[10px] tracking-[0.2em] text-black/30">1200 × 630</div>
      </div>
      <div
        className="relative overflow-hidden rounded-md shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25),0_8px_20px_-8px_rgba(0,0,0,0.15)] ring-1 ring-black/10"
        style={{ width: 1200 * scale, height: 630 * scale }}
      >
        <div style={{ width: 1200, height: 630, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </section>
  );
}

function RookieAt({ size, mood = 'neutral' }: { size: number; mood?: RookieMood }) {
  const baseWidth = 5 * 36 + 4 * Math.max(1, Math.round(36 * 0.15));
  const factor = size / baseWidth;
  return (
    <div className="relative inline-block" style={{ width: size, height: size * (241 / 204) }}>
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${factor})`, transformOrigin: 'top left' }}>
        <BreathingRook size="xl" mood={mood} animate />
      </div>
    </div>
  );
}

/* ============================================================
   01 · DISTILL — stark
   ============================================================ */
function DistillOg() {
  return (
    <div
      className="relative flex h-[630px] w-[1200px] flex-col items-center justify-center"
      style={{ background: 'oklch(0.99 0 0)', fontFamily: 'Inter Tight, sans-serif' }}
    >
      <RookieAt size={240} />

      <h1
        className="mt-10 text-[88px] font-extrabold leading-[0.95] tracking-[-0.04em]"
        style={{ color: 'oklch(0.14 0.01 280)' }}
      >
        Rookie&apos;s Run
      </h1>
      <p
        className="mt-1 text-[32px] font-medium leading-tight tracking-[-0.02em]"
        style={{ color: 'oklch(0.45 0.04 280)' }}
      >
        A daily chess roguelike.
      </p>

      <div className="mt-10 flex items-center gap-3">
        {['Unlock powers', 'Clear 10 levels', 'New board daily'].map((p) => (
          <div
            key={p}
            className="rounded-full border px-4 py-2 text-[18px] font-semibold tracking-tight"
            style={{ borderColor: 'oklch(0.14 0.01 280 / 0.2)', color: 'oklch(0.2 0.01 280)' }}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   02 · POLISH — editorial
   ============================================================ */
function PolishOg() {
  return (
    <div
      className="relative flex h-[630px] w-[1200px] flex-col items-center justify-center"
      style={{ background: 'oklch(0.98 0.01 85)', fontFamily: 'Inter Tight, sans-serif' }}
    >
      <div className="absolute inset-x-20 top-20 h-px" style={{ background: 'oklch(0.18 0.02 280 / 0.18)' }} />
      <div className="absolute inset-x-20 bottom-20 h-px" style={{ background: 'oklch(0.18 0.02 280 / 0.18)' }} />

      <div className="absolute left-20 top-[68px] text-[12px] font-bold uppercase tracking-[0.35em]" style={{ color: 'oklch(0.45 0.04 280)' }}>
        Vol. 001
      </div>
      <div className="absolute right-20 top-[68px] text-[12px] font-bold uppercase tracking-[0.35em]" style={{ color: 'oklch(0.45 0.04 280)' }}>
        chesspath.app / run
      </div>

      <RookieAt size={200} />

      <h1
        className="mt-8 text-[88px] font-extrabold leading-[0.92] tracking-[-0.04em]"
        style={{ color: 'oklch(0.14 0.02 280)' }}
      >
        Rookie&apos;s Run
      </h1>

      <div className="my-3 flex items-center gap-2">
        <div className="h-px w-10" style={{ background: 'oklch(0.45 0.04 280 / 0.5)' }} />
        <div className="h-1 w-1 rounded-full" style={{ background: 'oklch(0.45 0.04 280 / 0.6)' }} />
        <div className="h-px w-10" style={{ background: 'oklch(0.45 0.04 280 / 0.5)' }} />
      </div>

      <p
        className="text-[30px] leading-tight tracking-[-0.015em]"
        style={{ color: 'oklch(0.32 0.04 280)', fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 500 }}
      >
        A daily chess roguelike.
      </p>

      <div className="mt-8 flex items-center gap-3">
        {['Unlock powers', 'Clear 10 levels', 'New board daily'].map((p) => (
          <div
            key={p}
            className="rounded-full px-4 py-1.5 text-[17px] font-semibold tracking-tight"
            style={{ background: 'oklch(0.18 0.02 280)', color: 'oklch(0.97 0.04 85)' }}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   03 · QUIETER — soft
   ============================================================ */
function QuieterOg() {
  return (
    <div
      className="relative flex h-[630px] w-[1200px] flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, oklch(0.97 0.03 85) 0%, oklch(0.94 0.05 75) 100%)',
        fontFamily: 'Inter Tight, sans-serif',
      }}
    >
      <RookieAt size={210} />

      <h1
        className="mt-9 text-[76px] font-bold leading-[0.95] tracking-[-0.035em]"
        style={{ color: 'oklch(0.28 0.04 60)' }}
      >
        Rookie&apos;s Run
      </h1>
      <p
        className="mt-2 text-[28px] font-medium leading-tight tracking-[-0.015em]"
        style={{ color: 'oklch(0.45 0.06 60)' }}
      >
        A daily chess roguelike.
      </p>

      <div className="mt-9 flex items-center gap-3">
        {['Unlock powers', 'Clear 10 levels', 'New board daily'].map((p) => (
          <div
            key={p}
            className="rounded-full px-4 py-2 text-[17px] font-semibold tracking-tight"
            style={{ background: 'oklch(1 0 0 / 0.7)', color: 'oklch(0.35 0.05 60)', backdropFilter: 'blur(6px)' }}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   04 · CLARIFY — strong hierarchy
   ============================================================ */
function ClarifyOg() {
  return (
    <div
      className="relative flex h-[630px] w-[1200px] flex-col items-center justify-center"
      style={{ background: 'oklch(0.98 0.01 85)', fontFamily: 'Inter Tight, sans-serif' }}
    >
      <div className="text-[15px] font-bold tracking-[0.35em]" style={{ color: 'oklch(0.5 0.1 60)' }}>
        A DAILY CHESS ROGUELIKE
      </div>

      <h1
        className="mt-3 text-[150px] font-black leading-[0.88] tracking-[-0.05em]"
        style={{ color: 'oklch(0.14 0.02 280)' }}
      >
        Rookie&apos;s Run
      </h1>

      <div className="my-5">
        <RookieAt size={170} />
      </div>

      <div className="flex items-center gap-3">
        {[
          { label: 'Unlock powers', dot: 'oklch(0.7 0.18 75)' },
          { label: 'Clear 10 levels', dot: 'oklch(0.62 0.2 30)' },
          { label: 'New board daily', dot: 'oklch(0.55 0.16 260)' },
        ].map((p) => (
          <div
            key={p.label}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[19px] font-semibold tracking-tight"
            style={{ borderColor: 'oklch(0.18 0.02 280 / 0.15)', color: 'oklch(0.2 0.02 280)' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: p.dot }} />
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   05 · NORMALIZE — brand-friendly
   ============================================================ */
function NormalizeOg() {
  return (
    <div
      className="relative flex h-[630px] w-[1200px] flex-col items-center justify-center"
      style={{ background: 'oklch(0.98 0.02 85)', fontFamily: 'Inter Tight, sans-serif' }}
    >
      {/* very subtle warm wash bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{ background: 'radial-gradient(60% 100% at 50% 100%, oklch(0.93 0.09 80) 0%, transparent 70%)' }}
      />

      <div className="relative flex flex-col items-center">
        <RookieAt size={220} />
        {/* soft ground shadow */}
        <div
          className="-mt-2 h-[18px] w-[160px] rounded-full blur-md"
          style={{ background: 'oklch(0.55 0.12 60 / 0.35)' }}
        />
      </div>

      <h1
        className="mt-6 text-[84px] font-extrabold leading-[0.95] tracking-[-0.035em]"
        style={{ color: 'oklch(0.18 0.03 280)' }}
      >
        Rookie&apos;s Run
      </h1>
      <p
        className="mt-1 text-[30px] font-semibold leading-tight tracking-[-0.015em]"
        style={{ color: 'oklch(0.45 0.06 60)' }}
      >
        A daily chess roguelike.
      </p>

      <div className="mt-8 flex items-center gap-3">
        {[
          { label: 'Unlock powers', bg: 'oklch(0.94 0.1 90)', fg: 'oklch(0.3 0.1 70)' },
          { label: 'Clear 10 levels', bg: 'oklch(0.92 0.1 35)', fg: 'oklch(0.32 0.14 30)' },
          { label: 'New board daily', bg: 'oklch(0.93 0.08 230)', fg: 'oklch(0.3 0.12 240)' },
        ].map((p) => (
          <div
            key={p.label}
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-center text-[18px] font-bold leading-none tracking-tight"
            style={{ background: p.bg, color: p.fg }}
          >
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}
