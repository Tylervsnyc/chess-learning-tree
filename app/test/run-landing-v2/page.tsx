'use client';

import { useState } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   Rookie's Run — Landing Screen, MTG Card Edition
   Five frame eras, each with looping gameplay video as the art window.
   ════════════════════════════════════════════════════════════════════ */

type DesignId = 'classic' | 'modern' | 'borderless' | 'mythic' | 'planeswalker';

const DESIGNS: { id: DesignId; label: string; era: string; blurb: string }[] = [
  { id: 'classic',      label: 'Classic',      era: 'Alpha · 1993',     blurb: 'Vintage parchment, hand-set serifs, P/T box' },
  { id: 'modern',       label: 'Modern',       era: '8th Edition · 2003', blurb: 'Refined gold-on-black, sharper geometry' },
  { id: 'borderless',   label: 'Borderless',   era: 'Showcase',         blurb: 'Full-art video, translucent name plates' },
  { id: 'mythic',       label: 'Mythic Foil',  era: 'Foil treatment',   blurb: 'Holographic prism + drifting particles' },
  { id: 'planeswalker', label: 'Planeswalker', era: 'Lorwyn+ · 2007',   blurb: 'Multi-pane, loyalty-badge abilities' },
];

const RULES = [
  'Reach the 8th rank.',
  'Capture to charge tempo.',
  'Show no mercy.',
];

const TAGLINE = '"She\'s got this. (She does not have this.)"';
const VIDEO_SRC = '/Gameplay/run-gameplay.mp4';

/* ───────── Shared CSS injected once for fonts + noise textures ───────── */
function GlobalCardStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=EB+Garamond:ital,wght@0,500;0,700;1,500&family=IM+Fell+English:ital@0;1&display=swap');

      .font-display { font-family: 'Cinzel', 'Trajan Pro', 'Georgia', serif; letter-spacing: 0.02em; }
      .font-body    { font-family: 'EB Garamond', 'Garamond', 'Georgia', serif; }
      .font-fell    { font-family: 'IM Fell English', 'EB Garamond', serif; }

      /* Card stock paper grain — SVG turbulence as background image */
      .card-grain {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        background-size: 200px 200px;
      }

      .parchment-grain {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch' seed='4'/><feColorMatrix values='0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0 0.05  0 0 0 0.12 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        background-size: 180px 180px;
      }

      /* Embossed type-line */
      .emboss-dark {
        background: linear-gradient(180deg, #1f1108 0%, #100804 100%);
        box-shadow:
          inset 0 1px 0 rgba(220,180,110,0.32),
          inset 0 -1px 0 rgba(0,0,0,0.6),
          inset 0 0 0 1px rgba(140,98,40,0.55);
      }
      .emboss-gold {
        background:
          linear-gradient(180deg, #f5cf6e 0%, #b8862a 48%, #7a5212 52%, #b8862a 100%);
        box-shadow:
          inset 0 1px 0 rgba(255,240,200,0.7),
          inset 0 -1px 0 rgba(0,0,0,0.45);
      }

      /* Card entry */
      @keyframes cardLand {
        0%   { opacity: 0; transform: perspective(900px) rotateX(14deg) translateY(28px) scale(0.96); }
        100% { opacity: 1; transform: perspective(900px) rotateX(0) translateY(0) scale(1); }
      }
      .card-land { animation: cardLand 700ms cubic-bezier(0.2, 0.85, 0.25, 1) backwards; }

      /* Sheen sweep across art */
      @keyframes sheenSweep {
        0%   { transform: translateX(-140%) skewX(-22deg); opacity: 0; }
        18%  { opacity: 0.65; }
        100% { transform: translateX(260%) skewX(-22deg); opacity: 0; }
      }
      .sheen { animation: sheenSweep 2.6s ease-out 0.8s 1 backwards; }

      /* Foil — slow drifting prism */
      @keyframes foilDrift {
        0%   { background-position: 0% 50%, 0 0; }
        100% { background-position: 100% 50%, 0 0; }
      }
      .foil-prism {
        background:
          conic-gradient(from 220deg at 50% 50%,
            #ff5e8a 0deg, #ffb84d 50deg, #c4ff5e 110deg,
            #5eeaff 170deg, #8a5eff 230deg, #ff5ec4 290deg, #ff5e8a 360deg),
          radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 60%);
        background-size: 220% 220%, 100% 100%;
        mix-blend-mode: color-dodge;
        opacity: 0.45;
        animation: foilDrift 9s ease-in-out infinite alternate;
        filter: blur(2px);
      }
      .foil-prism-strong {
        background:
          conic-gradient(from 0deg at 50% 50%,
            #ff7ab0 0deg, #ffc56b 60deg, #d6ff7a 120deg,
            #7aeaff 180deg, #b07aff 240deg, #ff7ad6 300deg, #ff7ab0 360deg);
        background-size: 200% 200%;
        mix-blend-mode: overlay;
        opacity: 0.65;
        animation: foilDrift 7s linear infinite;
      }

      /* Mythic gem rotation */
      @keyframes gemSpark {
        0%, 100% { box-shadow: 0 0 0 1px #2a1505, inset 0 -2px 4px rgba(0,0,0,0.45), inset 0 2px 2px rgba(255,255,255,0.7), 0 0 14px rgba(255,140,40,0.55); }
        50%      { box-shadow: 0 0 0 1px #2a1505, inset 0 -2px 4px rgba(0,0,0,0.45), inset 0 2px 2px rgba(255,255,255,0.9), 0 0 22px rgba(255,180,80,0.85); }
      }
      .mythic-gem { animation: gemSpark 2.4s ease-in-out infinite; }

      /* Particle drift */
      @keyframes particleDrift {
        0%   { transform: translate(0,0); opacity: 0; }
        20%  { opacity: 0.9; }
        80%  { opacity: 0.9; }
        100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
      }
      .particle { animation: particleDrift var(--dur, 6s) linear infinite; animation-delay: var(--delay, 0s); }

      /* Loyalty badge press */
      .loyalty {
        background:
          radial-gradient(circle at 35% 30%, #f5e2a8 0%, #b8862a 55%, #6b3e0a 100%);
        box-shadow:
          inset 0 1px 0 rgba(255,240,200,0.7),
          inset 0 -2px 3px rgba(0,0,0,0.5),
          0 1px 2px rgba(0,0,0,0.6);
      }

      .ink-press { color: #1a0e05; text-shadow: 0 1px 0 rgba(255,250,230,0.35); }

      /* Beveled brown frame (classic) */
      .classic-frame {
        background:
          linear-gradient(180deg, #4a2c12 0%, #2a1808 100%);
        box-shadow:
          inset 0 0 0 2px #6b4a1a,
          inset 0 0 0 3px #2a1808,
          inset 0 0 0 5px #b8923a,
          inset 0 0 0 6px #2a1808,
          0 24px 70px -16px rgba(0,0,0,0.85),
          0 8px 18px -6px rgba(0,0,0,0.5);
      }

      /* Modern thin gold frame */
      .modern-frame {
        background: linear-gradient(180deg, #161210 0%, #0a0806 100%);
        box-shadow:
          inset 0 0 0 1px #c9a14a,
          inset 0 0 0 2px #1a120a,
          inset 0 0 0 3px #c9a14a,
          0 24px 60px -14px rgba(0,0,0,0.8);
      }

      /* Borderless deep frame */
      .borderless-frame {
        box-shadow:
          inset 0 0 0 1px rgba(255,220,160,0.18),
          0 24px 60px -14px rgba(0,0,0,0.85);
      }

      /* Mythic frame — heavy gold */
      .mythic-frame {
        background:
          linear-gradient(135deg, #2a1808 0%, #4a2c12 50%, #1a0d05 100%);
        box-shadow:
          inset 0 0 0 1px #2a1505,
          inset 0 0 0 2px #f0c46a,
          inset 0 0 0 3px #6b3e0a,
          inset 0 0 0 4px #f0c46a,
          inset 0 0 0 6px #2a1505,
          0 30px 80px -16px rgba(0,0,0,0.9);
      }

      /* Planeswalker dark frame */
      .pw-frame {
        background:
          linear-gradient(180deg, #1a1408 0%, #0a0604 100%);
        box-shadow:
          inset 0 0 0 1px #6b4a1a,
          inset 0 0 0 2px #0a0604,
          inset 0 0 0 4px #b8923a,
          inset 0 0 0 5px #0a0604,
          0 24px 60px -14px rgba(0,0,0,0.85);
      }
    `}</style>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */
export default function RunLandingV2Page() {
  const [design, setDesign] = useState<DesignId>('mythic');
  const current = DESIGNS.find((d) => d.id === design)!;

  return (
    <div
      className="min-h-screen w-full overflow-auto font-body"
      style={{
        background:
          'radial-gradient(ellipse at 50% -10%, #1a3a28 0%, #0a1810 50%, #050a07 100%)',
      }}
    >
      <GlobalCardStyles />

      {/* Top switcher */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-[#050a07]/85 border-b border-[#b8923a]/20">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <div className="flex items-baseline justify-between gap-4 mb-3">
            <p className="font-display text-[11px] tracking-[0.42em] uppercase text-[#d8b76a]">
              Rookie&apos;s Run — Card Frame Studies
            </p>
            <p className="text-[10px] text-[#b8923a]/60 italic">{current.era}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DESIGNS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDesign(d.id)}
                className={`px-3.5 py-2 rounded-sm text-[11px] font-display tracking-[0.18em] uppercase transition-all ${
                  design === d.id
                    ? 'bg-[#f0c46a] text-[#1a0d05] shadow-[inset_0_1px_0_rgba(255,240,200,0.7),inset_0_-1px_0_rgba(0,0,0,0.3)]'
                    : 'bg-transparent text-[#d8b76a]/80 border border-[#b8923a]/40 hover:border-[#f0c46a]/70 hover:text-[#f0c46a]'
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

      {/* Card stage */}
      <div className="mx-auto max-w-[420px] px-3 py-10 flex flex-col gap-6">
        <div key={design} className="card-land">
          {design === 'classic'      && <ClassicCard />}
          {design === 'modern'       && <ModernCard />}
          {design === 'borderless'   && <BorderlessCard />}
          {design === 'mythic'       && <MythicCard />}
          {design === 'planeswalker' && <PlaneswalkerCard />}
        </div>

        {/* Drop-down panel for other runs — kept exactly as today's behavior */}
        <OtherRunsPanel />

        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-[#b8923a]/40 font-display mt-2">
          ◆ Daily Run · 05 / 26 / 26 ◆
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SHARED — gameplay video art
   ════════════════════════════════════════════════════════════════════ */
function GameplayArt({ rounded = 'rounded-[3px]', overlay = true }: { rounded?: string; overlay?: boolean }) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${rounded}`}>
      <video
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay && (
        <>
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,0.45) 100%)' }} />
          {/* One-time sheen sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="sheen absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SHARED — Other runs collapsible
   ════════════════════════════════════════════════════════════════════ */
function OtherRunsPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md overflow-hidden border border-[#b8923a]/25 bg-[#0a1810]/60 backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 group"
      >
        <span className="font-display text-[11px] tracking-[0.3em] uppercase text-[#d8b76a]">
          Other Runs
        </span>
        <span className={`text-[#b8923a] text-xs transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-3 pb-3 grid grid-cols-2 gap-2">
            {['Plus', 'Bridge', 'Pawn Wall', 'Iron Curtain'].map((n) => (
              <div key={n} className="rounded border border-[#b8923a]/25 bg-[#1a1408]/70 px-3 py-2">
                <p className="font-display text-[12px] text-[#f0c46a] tracking-wide">{n}</p>
                <p className="text-[10px] text-[#b8923a]/60 italic">10 levels</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   1. CLASSIC — Alpha / 1993
   ════════════════════════════════════════════════════════════════════ */
function ClassicCard() {
  return (
    <div className="classic-frame relative rounded-[14px] p-[10px] aspect-[5/7] flex flex-col">
      {/* Card grain on whole card */}
      <div className="absolute inset-0 card-grain rounded-[14px] pointer-events-none opacity-50" />

      {/* Title bar */}
      <div className="relative emboss-dark rounded-[3px] px-3 py-1.5 flex items-center justify-between gap-2">
        <h2 className="font-display text-[15px] font-black text-[#f3e0b5] truncate">
          Rookie&apos;s Run
        </h2>
        <ManaCost letter="R" />
      </div>

      {/* Art frame — beveled brown */}
      <div className="relative mt-1.5 rounded-[3px] p-[3px]"
           style={{
             background: 'linear-gradient(180deg, #6b4a1a 0%, #2a1808 100%)',
             boxShadow: 'inset 0 1px 0 rgba(255,220,150,0.35), inset 0 -1px 0 rgba(0,0,0,0.6)'
           }}>
        <div className="relative h-[170px] rounded-[2px] overflow-hidden">
          <GameplayArt rounded="rounded-[2px]" />
        </div>
      </div>

      {/* Type line */}
      <div className="relative emboss-dark mt-1.5 rounded-[3px] px-3 py-1 flex items-center justify-between">
        <p className="font-display text-[10.5px] tracking-[0.18em] uppercase text-[#f3e0b5]">
          Daily — Roguelike Run
        </p>
        <span className="text-[#d8b76a] text-[10px]">✦</span>
      </div>

      {/* Text box — parchment */}
      <div className="relative mt-1.5 flex-1 rounded-[3px] px-3 py-2.5 flex flex-col"
           style={{
             background: 'linear-gradient(180deg, #f3e3b8 0%, #e3cf95 100%)',
             boxShadow: 'inset 0 0 0 1px #6b4a1a, inset 0 2px 6px rgba(80,40,0,0.18)'
           }}>
        <div className="absolute inset-0 parchment-grain rounded-[3px] pointer-events-none" />

        <ol className="relative font-fell text-[14px] leading-snug text-[#1a0e05] space-y-1.5">
          {RULES.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#7a4a12] font-bold">{i + 1}.</span>
              <span>{r}</span>
            </li>
          ))}
        </ol>

        <div className="relative mt-auto pt-2">
          <div className="h-px bg-[#6b4a1a]/30 mb-1.5" />
          <p className="font-fell italic text-[11.5px] leading-snug text-[#5a3a14]">
            {TAGLINE}
          </p>
        </div>
      </div>

      {/* Begin button + P/T box */}
      <div className="relative mt-1.5 flex items-stretch gap-1.5">
        <BeginButton variant="classic" />
        <PTBox />
      </div>

      {/* Artist credit / set */}
      <p className="relative mt-1 text-center text-[8.5px] tracking-[0.18em] uppercase text-[#d8b76a]/70 font-display">
        Illus. Rookie · ◆ RUN · 001/365
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   2. MODERN — 8th Edition / 2003
   ════════════════════════════════════════════════════════════════════ */
function ModernCard() {
  return (
    <div className="modern-frame relative rounded-[14px] p-[8px] aspect-[5/7] flex flex-col">
      <div className="absolute inset-0 card-grain rounded-[14px] pointer-events-none opacity-30" />

      {/* Title strip — slim gold */}
      <div className="relative emboss-gold rounded-[2px] px-3 py-1.5 flex items-center justify-between gap-2">
        <h2 className="font-display text-[15.5px] font-black tracking-wide ink-press">
          Rookie&apos;s Run
        </h2>
        <ManaCost letter="R" variant="modern" />
      </div>

      {/* Art */}
      <div className="relative mt-1.5 rounded-[2px] h-[178px] overflow-hidden"
           style={{ boxShadow: 'inset 0 0 0 1px #b8923a, inset 0 0 0 2px #1a120a' }}>
        <GameplayArt rounded="rounded-[2px]" />
      </div>

      {/* Type line */}
      <div className="relative emboss-gold mt-1.5 rounded-[2px] px-3 py-1 flex items-center justify-between">
        <p className="font-display text-[10.5px] tracking-[0.2em] uppercase ink-press">
          Daily — Roguelike Run
        </p>
        <SetSymbol />
      </div>

      {/* Text box — cream with subtle gradient */}
      <div className="relative mt-1.5 flex-1 rounded-[2px] px-3.5 py-3 flex flex-col"
           style={{
             background: 'linear-gradient(180deg, #f8efd6 0%, #ecdfba 100%)',
             boxShadow: 'inset 0 0 0 1px #6b4a1a'
           }}>
        <div className="absolute inset-0 parchment-grain rounded-[2px] pointer-events-none opacity-70" />

        <div className="relative font-body text-[13.5px] leading-relaxed text-[#1a0e05] space-y-2">
          {RULES.map((r, i) => (
            <p key={i} className="flex gap-2.5">
              <span className="font-display text-[#7a4a12] font-bold w-3 shrink-0">{i + 1}</span>
              <span>{r}</span>
            </p>
          ))}
        </div>

        <div className="relative mt-auto pt-2 border-t border-[#6b4a1a]/25">
          <p className="font-body italic text-[12px] leading-snug text-[#5a3a14]">
            {TAGLINE}
          </p>
        </div>
      </div>

      <div className="relative mt-1.5 flex items-stretch gap-1.5">
        <BeginButton variant="modern" />
        <PTBox compact />
      </div>

      <p className="relative mt-1 text-center text-[8.5px] tracking-[0.2em] uppercase text-[#d8b76a]/60 font-display">
        ◆ RUN · 001 · Daily Edition
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   3. BORDERLESS — Showcase, video edge-to-edge
   ════════════════════════════════════════════════════════════════════ */
function BorderlessCard() {
  return (
    <div className="borderless-frame relative rounded-[16px] overflow-hidden aspect-[5/7] flex flex-col">
      {/* Full-card video */}
      <div className="absolute inset-0">
        <GameplayArt rounded="rounded-[16px]" overlay={false} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.92) 100%)' }} />
      </div>

      {/* Top name plate */}
      <div className="relative px-4 pt-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-[22px] leading-[0.95] font-black text-white"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
            Rookie&apos;s
            <br />
            <span className="italic font-display tracking-wide">Run</span>
          </h2>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm border border-[#d8b76a]/40">
            <span className="w-1 h-1 rounded-full bg-[#f0c46a]" />
            <p className="font-display text-[9px] tracking-[0.3em] uppercase text-[#f0c46a]">
              Daily — Roguelike
            </p>
          </div>
        </div>
        <ManaCost letter="R" variant="borderless" />
      </div>

      <div className="flex-1" />

      {/* Bottom text plate */}
      <div className="relative px-4 pb-4">
        <div className="rounded-sm backdrop-blur-md bg-black/45 border border-[#d8b76a]/25 px-4 py-3">
          <ol className="space-y-1.5 mb-3">
            {RULES.map((r, i) => (
              <li key={i} className="flex gap-2.5 items-baseline">
                <span className="font-display text-[10px] text-[#f0c46a] tracking-wider w-3 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-body text-[13.5px] text-white/95 leading-snug">{r}</span>
              </li>
            ))}
          </ol>
          <div className="h-px bg-gradient-to-r from-transparent via-[#d8b76a]/45 to-transparent mb-2" />
          <p className="font-body italic text-[11.5px] text-[#f0c46a]/85 leading-snug">
            {TAGLINE}
          </p>
        </div>

        <div className="mt-2.5 flex items-stretch gap-1.5">
          <BeginButton variant="borderless" />
          <PTBox compact dark />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   4. MYTHIC FOIL — holographic showcase
   ════════════════════════════════════════════════════════════════════ */
function MythicCard() {
  return (
    <div className="mythic-frame relative rounded-[14px] p-[9px] aspect-[5/7] flex flex-col">
      {/* Card-wide foil prism (subtle base layer) */}
      <div className="absolute inset-0 foil-prism rounded-[14px] pointer-events-none" />
      <div className="absolute inset-0 card-grain rounded-[14px] pointer-events-none opacity-30 mix-blend-overlay" />

      {/* Title — gold foil */}
      <div className="relative emboss-gold rounded-[2px] px-3 py-1.5 flex items-center justify-between gap-2 overflow-hidden">
        {/* Title bar foil sweep */}
        <div className="absolute inset-0 foil-prism-strong pointer-events-none" />
        <h2 className="relative font-display text-[15.5px] font-black tracking-wide ink-press z-10">
          Rookie&apos;s Run
        </h2>
        <MythicGem />
      </div>

      {/* Art */}
      <div className="relative mt-1.5 rounded-[2px] h-[182px] overflow-hidden"
           style={{ boxShadow: 'inset 0 0 0 1px #f0c46a, inset 0 0 0 2px #2a1505, inset 0 0 0 3px #f0c46a' }}>
        <GameplayArt rounded="rounded-[2px]" />
        {/* Drifting sparkle particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { l: '15%', t: '30%', dx: '40px', dy: '-60px', dur: '7s', delay: '0s' },
            { l: '60%', t: '55%', dx: '-30px', dy: '-70px', dur: '8s', delay: '1.2s' },
            { l: '40%', t: '80%', dx: '50px', dy: '-90px', dur: '9s', delay: '2.8s' },
            { l: '85%', t: '25%', dx: '-40px', dy: '-50px', dur: '6.5s', delay: '0.6s' },
            { l: '25%', t: '65%', dx: '30px', dy: '-80px', dur: '7.5s', delay: '3.4s' },
          ].map((p, i) => (
            <span
              key={i}
              className="particle absolute w-[3px] h-[3px] rounded-full bg-white"
              style={{
                left: p.l, top: p.t,
                ['--dx' as never]: p.dx, ['--dy' as never]: p.dy,
                ['--dur' as never]: p.dur, ['--delay' as never]: p.delay,
                boxShadow: '0 0 8px rgba(255,220,150,0.95), 0 0 2px rgba(255,255,255,1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Type line */}
      <div className="relative emboss-gold mt-1.5 rounded-[2px] px-3 py-1 flex items-center justify-between overflow-hidden">
        <div className="absolute inset-0 foil-prism-strong pointer-events-none" />
        <p className="relative font-display text-[10.5px] tracking-[0.22em] uppercase ink-press z-10">
          Legendary Daily — Roguelike Run
        </p>
        <span className="relative text-[#1a0e05] text-[11px] z-10">✦</span>
      </div>

      {/* Text box */}
      <div className="relative mt-1.5 flex-1 rounded-[2px] px-3.5 py-3 flex flex-col"
           style={{
             background: 'linear-gradient(180deg, #f8efd6 0%, #ecdfba 100%)',
             boxShadow: 'inset 0 0 0 1px #b8862a, inset 0 0 0 2px #2a1505'
           }}>
        <div className="absolute inset-0 parchment-grain rounded-[2px] pointer-events-none opacity-60" />
        <div className="absolute inset-0 foil-prism rounded-[2px] pointer-events-none opacity-40" />

        <div className="relative font-body text-[13.5px] leading-relaxed text-[#1a0e05] space-y-2">
          {RULES.map((r, i) => (
            <p key={i} className="flex gap-2.5">
              <span className="font-display text-[#7a4a12] font-bold w-3 shrink-0">{i + 1}</span>
              <span>{r}</span>
            </p>
          ))}
        </div>

        <div className="relative mt-auto pt-2 border-t border-[#6b4a1a]/30">
          <p className="font-body italic text-[12px] leading-snug text-[#5a3a14]">
            {TAGLINE}
          </p>
        </div>
      </div>

      <div className="relative mt-1.5 flex items-stretch gap-1.5">
        <BeginButton variant="mythic" />
        <PTBox />
      </div>

      <p className="relative mt-1 text-center text-[8.5px] tracking-[0.22em] uppercase text-[#f0c46a]/75 font-display">
        ✦ Mythic · RUN · 001/365 ✦
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   5. PLANESWALKER — multi-pane ability list with loyalty counters
   ════════════════════════════════════════════════════════════════════ */
function PlaneswalkerCard() {
  const loyalties = ['+1', '-2', '-7'];

  return (
    <div className="pw-frame relative rounded-[14px] p-[9px] aspect-[5/7] flex flex-col">
      <div className="absolute inset-0 card-grain rounded-[14px] pointer-events-none opacity-30" />

      {/* Title */}
      <div className="relative emboss-dark rounded-[2px] px-3 py-1.5 flex items-center justify-between gap-2">
        <h2 className="font-display text-[14.5px] font-black text-[#f3e0b5] truncate">
          Rookie, the Daily Runner
        </h2>
        <ManaCost letter="R" />
      </div>

      {/* Art — taller, character-portrait orientation */}
      <div className="relative mt-1.5 rounded-[2px] h-[200px] overflow-hidden"
           style={{ boxShadow: 'inset 0 0 0 1px #b8923a, inset 0 0 0 2px #0a0604' }}>
        <GameplayArt rounded="rounded-[2px]" />
        {/* Nameplate stripe overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-black/85 to-transparent" />
        <p className="absolute bottom-1.5 left-2 font-display text-[9px] tracking-[0.3em] uppercase text-[#f0c46a]">
          ◆ Plane of Eight Ranks
        </p>
      </div>

      {/* Type line */}
      <div className="relative emboss-dark mt-1.5 rounded-[2px] px-3 py-1">
        <p className="font-display text-[10px] tracking-[0.22em] uppercase text-[#f3e0b5]">
          Legendary Planeswalker — Rookie
        </p>
      </div>

      {/* Ability list — each rule prefixed with a loyalty badge */}
      <div className="relative mt-1.5 flex-1 rounded-[2px] px-2.5 py-2.5 flex flex-col"
           style={{
             background: 'linear-gradient(180deg, #f3e3b8 0%, #e3cf95 100%)',
             boxShadow: 'inset 0 0 0 1px #6b4a1a'
           }}>
        <div className="absolute inset-0 parchment-grain rounded-[2px] pointer-events-none" />

        <div className="relative flex flex-col gap-1.5">
          {RULES.map((r, i) => (
            <div key={i} className="flex items-start gap-2 border-b border-[#6b4a1a]/15 pb-1.5 last:border-b-0">
              <div className="loyalty w-9 h-9 shrink-0 flex items-center justify-center"
                   style={{ clipPath: 'polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)' }}>
                <span className="font-display text-[12px] font-black ink-press leading-none">
                  {loyalties[i]}
                </span>
              </div>
              <p className="font-fell text-[12.5px] text-[#1a0e05] leading-snug pt-1">{r}</p>
            </div>
          ))}
        </div>

        <p className="relative mt-auto pt-1.5 font-fell italic text-[10.5px] text-[#5a3a14] leading-snug">
          {TAGLINE}
        </p>
      </div>

      {/* Bottom: loyalty start counter (becomes the Begin button) */}
      <div className="relative mt-1.5 flex items-stretch gap-1.5">
        <BeginButton variant="pw" />
        <StartingLoyalty />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SHARED ATOMS
   ════════════════════════════════════════════════════════════════════ */

function ManaCost({ letter = 'R', variant = 'classic' }: { letter?: string; variant?: 'classic' | 'modern' | 'borderless' }) {
  const isLight = variant === 'borderless';
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-display font-black text-[13px]"
      style={{
        background: 'radial-gradient(circle at 35% 28%, #fff2d1 0%, #f0a445 38%, #a8421a 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,250,220,0.85), inset 0 -2px 3px rgba(0,0,0,0.45), 0 0 0 1px ' +
          (isLight ? 'rgba(0,0,0,0.6)' : '#3a1a08') +
          ', 0 1px 3px rgba(0,0,0,0.5)',
        color: '#3a0d05',
        textShadow: '0 1px 0 rgba(255,200,160,0.5)',
      }}
    >
      {letter}
    </div>
  );
}

function SetSymbol() {
  return (
    <div className="w-4 h-4 flex items-center justify-center"
         style={{
           background: 'linear-gradient(135deg, #f0c46a 0%, #7a4a12 100%)',
           clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
           boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.45)'
         }}
    />
  );
}

function MythicGem() {
  return (
    <div className="mythic-gem w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-display font-black text-[13px] relative"
         style={{
           background: 'radial-gradient(circle at 35% 28%, #fff2d1 0%, #ff8a3a 35%, #d23510 80%, #6b1a05 100%)',
           color: '#2a0d05',
         }}>
      <span className="relative z-10">R</span>
      <div className="absolute inset-0 foil-prism-strong rounded-full pointer-events-none opacity-70" />
    </div>
  );
}

function BeginButton({ variant }: { variant: 'classic' | 'modern' | 'borderless' | 'mythic' | 'pw' }) {
  const isClassic = variant === 'classic';
  const isMythic = variant === 'mythic';
  const isPw = variant === 'pw';

  return (
    <button
      type="button"
      className="relative flex-1 py-2.5 rounded-[3px] font-display font-black text-[13px] tracking-[0.24em] uppercase overflow-hidden transition-all active:translate-y-px ink-press group"
      style={{
        background: isMythic
          ? 'linear-gradient(180deg, #ffd874 0%, #d49a2a 50%, #7a4a12 100%)'
          : isPw
          ? 'linear-gradient(180deg, #c9a14a 0%, #7a5212 100%)'
          : 'linear-gradient(180deg, #d8b76a 0%, #8a5e1a 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,245,210,0.8), inset 0 -2px 0 rgba(60,30,4,0.55), inset 0 0 0 1px #2a1505, 0 2px 6px rgba(0,0,0,0.5)',
      }}
    >
      {/* Sheen */}
      <span className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute -inset-y-2 -left-1/3 w-1/3 bg-white/40 blur-[2px] transition-transform duration-700 group-hover:translate-x-[420%]"
              style={{ transform: 'skewX(-22deg) translateX(0)' }} />
      </span>
      {isMythic && <span className="absolute inset-0 foil-prism-strong pointer-events-none rounded-[3px]" />}
      <span className="relative z-10">{isClassic ? 'Begin Run' : "Play Today's Run"}</span>
    </button>
  );
}

function PTBox({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
    <div
      className={`relative shrink-0 ${compact ? 'px-2.5 py-1.5' : 'px-3 py-2'} rounded-[3px] flex items-center justify-center font-display font-black tabular-nums ${compact ? 'text-[12px]' : 'text-[13px]'} text-[#f3e0b5]`}
      style={{
        background: dark
          ? 'linear-gradient(180deg, rgba(20,12,4,0.85) 0%, rgba(8,4,2,0.95) 100%)'
          : 'linear-gradient(180deg, #2a1808 0%, #100804 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(220,180,110,0.32), inset 0 -1px 0 rgba(0,0,0,0.6), inset 0 0 0 1px ' +
          (dark ? 'rgba(216,183,106,0.5)' : '#8a5e1a'),
        minWidth: compact ? 44 : 50,
      }}
    >
      8/8
    </div>
  );
}

function StartingLoyalty() {
  return (
    <div className="relative shrink-0 w-12 h-12 flex items-center justify-center"
         style={{
           clipPath: 'polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)',
           background: 'linear-gradient(180deg, #1a1408 0%, #0a0604 100%)',
           boxShadow: 'inset 0 0 0 2px #f0c46a'
         }}>
      <span className="font-display font-black text-[18px] text-[#f0c46a]">5</span>
    </div>
  );
}
