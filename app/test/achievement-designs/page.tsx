'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { MiniRookieIcon } from '@/components/shared/MiniRookieIcon';

/**
 * /test/achievement-designs — five visual directions for the shared
 * achievement pop-up (Chess Boxing + Rookie's Revenge), each shown at
 * S (toast) / M (card) / L (ceremony) plus what a LEVELED achievement looks
 * like when it upgrades a tier. Static mockups in phone frames so every
 * option is visible at once; pick one and we port it into AchievementPop.
 */

type Band = 'amateur' | 'contender' | 'title-shot' | 'champion' | 'undisputed';
const BAND: Record<Band, { ring: string; bg: string; text: string; label: string }> = {
  amateur: { ring: '#94A3B8', bg: '#F1F5F9', text: '#64748B', label: 'Amateur' },
  contender: { ring: '#C4763A', bg: '#FBEFE4', text: '#A05A24', label: 'Contender' },
  'title-shot': { ring: '#9DB1C7', bg: '#EEF3F8', text: '#5C7692', label: 'Title Shot' },
  champion: { ring: '#F4B40A', bg: '#FFF6DC', text: '#A67C00', label: 'Champion' },
  undisputed: { ring: '#F4B40A', bg: '#FFF1C4', label: 'Undisputed', text: '#8A5CF6' },
};
const LADDER: Band[] = ['amateur', 'contender', 'title-shot', 'champion', 'undisputed'];

const SAMPLE = {
  s: { icon: '🥊', name: 'First Blood', line: "Your first win. I'm framing this. I already framed it.", band: 'amateur' as Band },
  m: { icon: '💥', name: 'KO Artist', line: 'Checkmate is just a KO where the referee is math.', band: 'contender' as Band, tier: 'Tier II' },
  l: { icon: '🪜', name: 'Up the Ladder', line: 'I stopped going easy on you several levels ago. This is concerning.', band: 'champion' as Band, tier: 'Level 8' },
  lv: { icon: '🛡️', name: 'Iron Chin', line: 'Twenty-five bouts without quitting. Your chin is a structural material now.', from: 2, to: 3, progress: [25, 50] as [number, number] },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AchievementDesignsPage() {
  const [dark, setDark] = useState(false);
  return (
    <main className="h-full overflow-auto bg-chess-page text-chess-text">
      <div className="mx-auto w-full max-w-[1420px] px-4 py-6 pb-24">
        <h1 className="text-2xl font-black">Achievement pop-up — design options</h1>
        <p className="text-sm text-chess-text-muted mt-1 max-w-2xl">
          Same content in every option: a small nod, a medium card, the big ceremony, and a <b>leveled</b> achievement
          upgrading from Tier II to Tier III (belt bands Amateur → Contender → Title Shot → Champion → Undisputed).
          Phone frames are 320px wide — 2×2 per option.
        </p>
        <label className="mt-3 inline-flex items-center gap-2 text-xs font-bold">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> Dark backdrop behind toasts
        </label>

        <OptionSection
          n="A"
          title="Current — clean medal"
          blurb="What's shipped today. White surface, belt ring, Rookie's line in a tinted box. Leveled = band pill + 'upgraded' eyebrow."
          dark={dark}
          s={<A_Toast />}
          m={<A_Card size="m" />}
          l={<A_Card size="l" />}
          lv={<A_Leveled />}
        />
        <OptionSection
          n="B"
          title="Ringside — dark + gold foil"
          blurb="Night-arena feel: navy card, foil-gold medal with ribbon, serif-ish caps. Leveled = belt strip that fills one more notch."
          dark={dark}
          s={<B_Toast />}
          m={<B_Card size="m" />}
          l={<B_Card size="l" />}
          lv={<B_Leveled />}
        />
        <OptionSection
          n="C"
          title="Fight poster — ticket stub"
          blurb="Cream paper, red ink, punched ticket edge, big condensed type. Leveled = a stamped 'II → III' with a tally strip."
          dark={dark}
          s={<C_Toast />}
          m={<C_Card size="m" />}
          l={<C_Card size="l" />}
          lv={<C_Leveled />}
        />
        <OptionSection
          n="D"
          title="Rookie says — speech bubble"
          blurb="Rookie herself delivers it. The line is the hero; the medal is a small chip. Leveled = she literally re-pins the badge one notch higher."
          dark={dark}
          s={<D_Toast />}
          m={<D_Card size="m" />}
          l={<D_Card size="l" />}
          lv={<D_Leveled />}
        />
        <OptionSection
          n="E"
          title="Belt bar — progress-first"
          blurb="Built around the ladder: every pop shows where you are on the 5-band belt. Best for leveled achievements; binary ones show a single filled notch."
          dark={dark}
          s={<E_Toast />}
          m={<E_Card size="m" />}
          l={<E_Card size="l" />}
          lv={<E_Leveled />}
        />

        <section className="mt-10 rounded-2xl bg-chess-surface border border-slate-200 p-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-chess-text-muted">How leveled achievements work</h2>
          <p className="text-sm mt-2 leading-relaxed">
            Two kinds: <b>count ladders</b> (10 / 25 / 50 / 100 bouts → Tier I–IV) and <b>level-tiered</b> (done at Rookie level 1–10;
            upgrades to the highest ever). Both map onto the five belt bands for color. An upgrade pops with the
            <i> upgraded</i> eyebrow, the new band color, and the previous tier ghosted so the jump reads.
          </p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {LADDER.map((b, i) => (
              <div key={b} className="flex items-center gap-2">
                <span className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide" style={{ background: BAND[b].bg, color: BAND[b].text, boxShadow: `inset 0 0 0 2px ${BAND[b].ring}` }}>
                  {BAND[b].label}
                </span>
                {i < LADDER.length - 1 && <span className="text-chess-text-faint">→</span>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

function OptionSection({ n, title, blurb, dark, s, m, l, lv }: { n: string; title: string; blurb: string; dark: boolean; s: ReactNode; m: ReactNode; l: ReactNode; lv: ReactNode }) {
  return (
    <section className="mt-8">
      <div className="flex items-baseline gap-3">
        <span className="w-8 h-8 rounded-full bg-chess-text text-white font-black flex items-center justify-center text-sm">{n}</span>
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      <p className="text-xs text-chess-text-muted mt-1 max-w-2xl">{blurb}</p>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 justify-items-center">
        <Phone label="S — toast" dark={dark} edge>{s}</Phone>
        <Phone label="M — card" dark>{m}</Phone>
        <Phone label="L — ceremony" dark strong>{l}</Phone>
        <Phone label="Leveled — Tier II → III" dark>{lv}</Phone>
      </div>
    </section>
  );
}

function Phone({ label, children, dark, strong, edge }: { label: string; children: ReactNode; dark?: boolean; strong?: boolean; edge?: boolean }) {
  return (
    <div className="shrink-0">
      <div className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted mb-1">{label}</div>
      <div
        className="relative w-[320px] h-[600px] rounded-[28px] overflow-hidden border border-slate-300 shadow-md"
        style={{ background: '#eef6fc' }}
      >
        {/* fake app chrome */}
        <div className="absolute inset-x-0 top-0 h-10 bg-white/80 border-b border-slate-200" />
        <div className="absolute left-4 right-4 top-16 h-3 rounded bg-white/70" />
        <div className="absolute left-4 w-2/3 top-22 h-3 rounded bg-white/70" style={{ top: 88 }} />
        <div className="absolute left-4 right-4 top-28 aspect-square rounded-xl bg-white/70" />
        {/* backdrop */}
        <div className="absolute inset-0" style={{ background: strong ? 'rgba(10,14,26,0.88)' : dark && !edge ? 'rgba(10,14,26,0.6)' : 'transparent' }} />
        <div className={`absolute inset-0 flex ${edge ? 'items-end' : 'items-center'} justify-center p-4`}>{children}</div>
      </div>
    </div>
  );
}

function Medal({ icon, band, size = 64, dark }: { icon: string; band: Band; size?: number; dark?: boolean }) {
  const c = BAND[band];
  return (
    <div
      className="flex items-center justify-center rounded-full select-none"
      style={{ width: size, height: size, background: dark ? '#1b2333' : c.bg, boxShadow: `inset 0 0 0 3px ${c.ring}`, fontSize: size * 0.45, lineHeight: 1 }}
    >
      {icon}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A — current (clean medal)
// ---------------------------------------------------------------------------

function A_Toast() {
  const c = BAND[SAMPLE.s.band];
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-2xl px-3 py-2.5 flex items-center gap-3">
      <Medal icon={SAMPLE.s.icon} band={SAMPLE.s.band} size={44} />
      <div className="min-w-0">
        <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: c.text }}>Achievement unlocked</div>
        <div className="text-sm font-black truncate">{SAMPLE.s.name}</div>
        <div className="text-[11px] font-semibold text-chess-text-muted leading-snug">{SAMPLE.s.line}</div>
      </div>
    </div>
  );
}
function A_Card({ size }: { size: 'm' | 'l' }) {
  const d = size === 'l' ? SAMPLE.l : SAMPLE.m;
  const c = BAND[d.band];
  const L = size === 'l';
  return (
    <div className="w-full rounded-3xl bg-white shadow-2xl px-5 py-6 flex flex-col items-center gap-3 text-center" style={{ boxShadow: L ? `0 0 0 3px ${c.ring}, 0 24px 60px rgba(0,0,0,.45)` : undefined }}>
      <div className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: c.text }}>{L ? 'Title fight unlocked' : 'Achievement unlocked'}</div>
      <Medal icon={d.icon} band={d.band} size={L ? 96 : 72} />
      <div>
        <div className={`font-black leading-tight ${L ? 'text-2xl' : 'text-lg'}`}>{d.name}</div>
        <div className="mt-1 inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide" style={{ background: c.bg, color: c.text }}>{c.label} · {d.tier}</div>
      </div>
      <div className="w-full rounded-xl bg-chess-page px-3 py-2 text-xs font-semibold leading-snug">{d.line}</div>
      <div className="text-[11px] font-bold text-chess-text-faint">{L ? 'Tap to continue' : 'Tap to skip'}</div>
    </div>
  );
}
function A_Leveled() {
  const from = LADDER[SAMPLE.lv.from - 1], to = LADDER[SAMPLE.lv.to - 1];
  const c = BAND[to];
  return (
    <div className="w-full rounded-3xl bg-white shadow-2xl px-5 py-6 flex flex-col items-center gap-3 text-center">
      <div className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: c.text }}>Achievement upgraded</div>
      <div className="flex items-center gap-3">
        <div className="opacity-40 scale-75"><Medal icon={SAMPLE.lv.icon} band={from} size={72} /></div>
        <span className="text-xl font-black text-chess-text-faint">→</span>
        <Medal icon={SAMPLE.lv.icon} band={to} size={72} />
      </div>
      <div>
        <div className="font-black text-lg leading-tight">{SAMPLE.lv.name}</div>
        <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide" style={{ background: c.bg, color: c.text }}>
          <span className="line-through opacity-50">{BAND[from].label} · II</span> {c.label} · III
        </div>
      </div>
      <div className="w-full rounded-xl bg-chess-page px-3 py-2 text-xs font-semibold leading-snug">{SAMPLE.lv.line}</div>
      <div className="w-full">
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden"><div className="h-full rounded-full" style={{ width: '50%', background: c.ring }} /></div>
        <div className="text-[10px] font-bold text-chess-text-faint mt-1">25 / 50 to Tier IV</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// B — Ringside (dark + gold foil)
// ---------------------------------------------------------------------------

const FOIL = 'linear-gradient(135deg,#f7d774 0%,#e9b53a 40%,#fff0b8 55%,#d39a1e 100%)';
const NAVY = '#0f1729';
function FoilMedal({ icon, size = 64, band }: { icon: string; size?: number; band: Band }) {
  const gold = band === 'champion' || band === 'undisputed';
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-4 h-5 -mb-2" style={{ background: gold ? '#b3261e' : BAND[band].ring, clipPath: 'polygon(0 0,100% 0,100% 100%,50% 70%,0 100%)' }} />
      <div className="relative flex items-center justify-center rounded-full" style={{ width: size, height: size, background: gold ? FOIL : `linear-gradient(135deg,${BAND[band].ring},${BAND[band].bg})`, boxShadow: '0 6px 18px rgba(0,0,0,.5), inset 0 0 0 2px rgba(255,255,255,.35)', fontSize: size * 0.42, lineHeight: 1 }}>
        <div className="absolute inset-[6px] rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.25)' }} />
        <span className="relative">{icon}</span>
      </div>
    </div>
  );
}
const capsB: CSSProperties = { letterSpacing: '0.3em', color: '#e9b53a' };
function B_Toast() {
  return (
    <div className="w-full rounded-2xl px-3 py-2.5 flex items-center gap-3 shadow-2xl" style={{ background: NAVY, border: '1px solid rgba(233,181,58,.45)' }}>
      <FoilMedal icon={SAMPLE.s.icon} size={40} band={SAMPLE.s.band} />
      <div className="min-w-0 text-white">
        <div className="text-[9px] font-black uppercase" style={capsB}>Unlocked</div>
        <div className="text-sm font-black truncate">{SAMPLE.s.name}</div>
        <div className="text-[11px] font-medium text-white/70 leading-snug">{SAMPLE.s.line}</div>
      </div>
    </div>
  );
}
function B_Card({ size }: { size: 'm' | 'l' }) {
  const d = size === 'l' ? SAMPLE.l : SAMPLE.m;
  const L = size === 'l';
  return (
    <div className="w-full rounded-3xl px-5 py-6 flex flex-col items-center gap-3 text-center text-white" style={{ background: `radial-gradient(120% 80% at 50% 0%, #1c2a4a 0%, ${NAVY} 60%)`, boxShadow: `0 0 0 ${L ? 2 : 1}px rgba(233,181,58,.6), 0 24px 60px rgba(0,0,0,.6)` }}>
      <div className="text-[10px] font-black uppercase" style={capsB}>{L ? 'Title fight' : 'Achievement'}</div>
      <FoilMedal icon={d.icon} size={L ? 96 : 72} band={d.band} />
      <div className={`font-black leading-tight ${L ? 'text-2xl' : 'text-lg'}`} style={{ background: FOIL, WebkitBackgroundClip: 'text', color: 'transparent' }}>{d.name}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-white/60">{BAND[d.band].label} · {d.tier}</div>
      <div className="w-full border-t border-white/10 pt-3 text-xs font-medium text-white/80 leading-snug italic">“{d.line}”</div>
      <div className="text-[10px] font-bold text-white/40">{L ? 'Tap to continue' : 'Tap to skip'}</div>
    </div>
  );
}
function BeltStrip({ filled, dark }: { filled: number; dark?: boolean }) {
  return (
    <div className="flex w-full gap-1">
      {LADDER.map((b, i) => (
        <div key={b} className="flex-1 h-2.5 rounded-sm" style={{ background: i < filled ? (i === filled - 1 ? FOIL : BAND[b].ring) : dark ? 'rgba(255,255,255,.12)' : '#E2E8F0' }} />
      ))}
    </div>
  );
}
function B_Leveled() {
  const to = LADDER[SAMPLE.lv.to - 1];
  return (
    <div className="w-full rounded-3xl px-5 py-6 flex flex-col items-center gap-3 text-center text-white" style={{ background: NAVY, boxShadow: '0 0 0 1px rgba(233,181,58,.6), 0 24px 60px rgba(0,0,0,.6)' }}>
      <div className="text-[10px] font-black uppercase" style={capsB}>Belt upgraded</div>
      <FoilMedal icon={SAMPLE.lv.icon} size={72} band={to} />
      <div className="font-black text-lg leading-tight">{SAMPLE.lv.name}</div>
      <div className="w-full">
        <BeltStrip filled={SAMPLE.lv.to} dark />
        <div className="flex justify-between text-[8px] font-black uppercase tracking-wider mt-1 text-white/50"><span>Amateur</span><span style={{ color: '#e9b53a' }}>Title Shot ✓</span><span>Undisputed</span></div>
      </div>
      <div className="text-xs font-medium text-white/80 leading-snug italic">“{SAMPLE.lv.line}”</div>
      <div className="text-[10px] font-bold text-white/40">25 / 50 to the next notch</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C — Fight poster / ticket stub
// ---------------------------------------------------------------------------

const CREAM = '#fbf3e2', INK = '#b3261e', INKDARK = '#2a1a12';
const stubEdge: CSSProperties = { backgroundImage: 'radial-gradient(circle at 0 50%, transparent 6px, #fbf3e2 6.5px)', backgroundSize: '100% 16px' };
function Stamp({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <span className={`inline-block font-black uppercase ${small ? 'text-[9px] px-1.5' : 'text-[11px] px-2'} py-0.5 rounded-sm`} style={{ border: `2px solid ${INK}`, color: INK, transform: 'rotate(-4deg)', letterSpacing: '.15em' }}>
      {children}
    </span>
  );
}
const poster: CSSProperties = { fontFamily: 'Impact, "Arial Narrow", "DM Sans", sans-serif', letterSpacing: '.02em', textTransform: 'uppercase' };
function C_Toast() {
  return (
    <div className="w-full flex shadow-2xl rounded-lg overflow-hidden" style={{ background: CREAM, color: INKDARK }}>
      <div className="w-12 flex items-center justify-center text-2xl border-r-2 border-dashed" style={{ borderColor: INK + '55' }}>{SAMPLE.s.icon}</div>
      <div className="min-w-0 px-3 py-2">
        <div className="flex items-center gap-2"><Stamp small>Unlocked</Stamp><span className="text-[9px] font-black uppercase tracking-widest opacity-60">Amateur</span></div>
        <div className="text-base leading-tight" style={poster}>{SAMPLE.s.name}</div>
        <div className="text-[11px] font-semibold opacity-80 leading-snug">{SAMPLE.s.line}</div>
      </div>
    </div>
  );
}
function C_Card({ size }: { size: 'm' | 'l' }) {
  const d = size === 'l' ? SAMPLE.l : SAMPLE.m;
  const L = size === 'l';
  return (
    <div className="w-full rounded-lg shadow-2xl px-5 py-5 flex flex-col items-center text-center" style={{ background: CREAM, color: INKDARK, ...stubEdge, boxShadow: L ? `0 0 0 4px ${INK}, 0 0 0 7px ${CREAM}, 0 24px 60px rgba(0,0,0,.5)` : undefined }}>
      <div className="w-full flex justify-between text-[9px] font-black uppercase tracking-[.25em] opacity-60 border-b pb-2" style={{ borderColor: INK + '44' }}><span>Chess Boxing</span><span>No. 0042</span></div>
      <div className="mt-3 text-5xl">{d.icon}</div>
      <div className={`mt-2 leading-[.95] ${L ? 'text-4xl' : 'text-3xl'}`} style={{ ...poster, color: INK }}>{d.name}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[.3em]">{BAND[d.band].label} · {d.tier}</div>
      <div className="mt-3 text-xs font-semibold leading-snug max-w-[26ch]">{d.line}</div>
      <div className="mt-3"><Stamp>{L ? 'Title fight' : 'Achievement'}</Stamp></div>
      <div className="mt-3 w-full border-t border-dashed pt-2 text-[9px] font-black uppercase tracking-[.3em] opacity-50" style={{ borderColor: INK + '66' }}>Admit one · tap to continue</div>
    </div>
  );
}
function C_Leveled() {
  return (
    <div className="w-full rounded-lg shadow-2xl px-5 py-5 flex flex-col items-center text-center" style={{ background: CREAM, color: INKDARK, ...stubEdge }}>
      <div className="w-full flex justify-between text-[9px] font-black uppercase tracking-[.25em] opacity-60 border-b pb-2" style={{ borderColor: INK + '44' }}><span>Chess Boxing</span><span>Upgrade</span></div>
      <div className="mt-3 text-4xl">{SAMPLE.lv.icon}</div>
      <div className="mt-1 text-3xl leading-[.95]" style={{ ...poster, color: INK }}>{SAMPLE.lv.name}</div>
      <div className="mt-3 flex items-center gap-3" style={poster}>
        <span className="text-2xl opacity-40 line-through">II</span>
        <span className="text-xs opacity-60">→</span>
        <span className="text-4xl" style={{ color: INK }}>III</span>
      </div>
      <div className="text-[10px] font-black uppercase tracking-[.3em]">Title Shot</div>
      {/* tally strip */}
      <div className="mt-3 flex gap-[3px] items-end" aria-hidden>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="w-[3px] rounded-sm" style={{ height: (i + 1) % 5 === 0 ? 18 : 14, background: INK, opacity: 0.85, transform: (i + 1) % 5 === 0 ? 'rotate(-20deg) translateX(-8px)' : undefined }} />
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={'g' + i} className="w-[3px] rounded-sm" style={{ height: 14, background: INK, opacity: 0.15 }} />
        ))}
      </div>
      <div className="mt-1 text-[9px] font-black uppercase tracking-[.25em] opacity-60">25 of 50 bouts</div>
      <div className="mt-3 text-xs font-semibold leading-snug max-w-[26ch]">{SAMPLE.lv.line}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// D — Rookie says (speech bubble)
// ---------------------------------------------------------------------------

function RookieHead({ size = 40 }: { size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, background: '#1CB0F6', boxShadow: '0 4px 12px rgba(28,176,246,.4)' }}>
      <MiniRookieIcon size={size * 0.6} active gold={false} />
    </div>
  );
}
function Chip({ icon, band, label }: { icon: string; band: Band; label: string }) {
  const c = BAND[band];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide" style={{ background: c.bg, color: c.text, boxShadow: `inset 0 0 0 1.5px ${c.ring}` }}>
      <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[12px]">{icon}</span>{label}
    </span>
  );
}
function D_Toast() {
  return (
    <div className="w-full flex items-end gap-2">
      <RookieHead size={36} />
      <div className="flex-1 rounded-2xl rounded-bl-sm bg-white shadow-2xl border border-slate-200 px-3 py-2.5">
        <div className="text-sm font-bold leading-snug">{SAMPLE.s.line}</div>
        <div className="mt-1.5"><Chip icon={SAMPLE.s.icon} band={SAMPLE.s.band} label={SAMPLE.s.name} /></div>
      </div>
    </div>
  );
}
function D_Card({ size }: { size: 'm' | 'l' }) {
  const d = size === 'l' ? SAMPLE.l : SAMPLE.m;
  const L = size === 'l';
  const c = BAND[d.band];
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <RookieHead size={L ? 72 : 56} />
      <div className="relative w-full rounded-3xl bg-white shadow-2xl px-5 py-5 text-center" style={{ boxShadow: L ? `0 0 0 3px ${c.ring}, 0 24px 60px rgba(0,0,0,.45)` : undefined }}>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" style={{ boxShadow: L ? `-2px -2px 0 1px ${c.ring}` : undefined }} />
        <div className={`font-black leading-snug ${L ? 'text-xl' : 'text-base'}`}>{d.line}</div>
        <div className="mt-3 flex flex-col items-center gap-1.5">
          <Chip icon={d.icon} band={d.band} label={d.name} />
          <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: c.text }}>{c.label} · {d.tier}{L ? ' · Title fight' : ''}</div>
        </div>
        <div className="mt-3 text-[10px] font-bold text-chess-text-faint">{L ? 'Tap to continue' : 'Tap to skip'}</div>
      </div>
    </div>
  );
}
function D_Leveled() {
  const from = LADDER[SAMPLE.lv.from - 1], to = LADDER[SAMPLE.lv.to - 1];
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <RookieHead size={56} />
      <div className="relative w-full rounded-3xl bg-white shadow-2xl px-5 py-5 text-center">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
        <div className="font-black text-base leading-snug">{SAMPLE.lv.line}</div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="opacity-40"><Chip icon={SAMPLE.lv.icon} band={from} label="II" /></span>
          <span className="text-chess-text-faint font-black">→</span>
          <Chip icon={SAMPLE.lv.icon} band={to} label={`${SAMPLE.lv.name} · III`} />
        </div>
        <div className="mt-2 text-[10px] font-black uppercase tracking-widest" style={{ color: BAND[to].text }}>{BAND[to].label} · upgraded</div>
        <div className="mt-3 h-1.5 rounded-full bg-slate-200 overflow-hidden"><div className="h-full" style={{ width: '50%', background: BAND[to].ring }} /></div>
        <div className="text-[10px] font-bold text-chess-text-faint mt-1">25 / 50 · halfway to Tier IV</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// E — Belt bar (progress-first)
// ---------------------------------------------------------------------------

function BeltBar({ filled, big }: { filled: number; big?: boolean }) {
  return (
    <div className="w-full">
      <div className="flex w-full rounded-full overflow-hidden" style={{ height: big ? 14 : 10, background: '#E2E8F0' }}>
        {LADDER.map((b, i) => (
          <div key={b} className="flex-1" style={{ background: i < filled ? BAND[b].ring : 'transparent', borderRight: i < 4 ? '2px solid #fff' : undefined }} />
        ))}
      </div>
      <div className="mt-1 flex justify-between">
        {LADDER.map((b, i) => (
          <span key={b} className="text-[7px] font-black uppercase tracking-wider" style={{ color: i < filled ? BAND[b].text : '#CBD5E1', width: '20%', textAlign: i === 0 ? 'left' : i === 4 ? 'right' : 'center' }}>{BAND[b].label}</span>
        ))}
      </div>
    </div>
  );
}
function E_Toast() {
  const c = BAND[SAMPLE.s.band];
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-2xl px-3 py-2.5">
      <div className="flex items-center gap-3">
        <Medal icon={SAMPLE.s.icon} band={SAMPLE.s.band} size={40} />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: c.text }}>Unlocked · {c.label}</div>
          <div className="text-sm font-black truncate">{SAMPLE.s.name}</div>
        </div>
      </div>
      <div className="mt-2"><BeltBar filled={1} /></div>
    </div>
  );
}
function E_Card({ size }: { size: 'm' | 'l' }) {
  const d = size === 'l' ? SAMPLE.l : SAMPLE.m;
  const L = size === 'l';
  const c = BAND[d.band];
  const filled = LADDER.indexOf(d.band) + 1;
  return (
    <div className="w-full rounded-3xl bg-white shadow-2xl px-5 py-6 flex flex-col items-center gap-3 text-center" style={{ boxShadow: L ? `0 0 0 3px ${c.ring}, 0 24px 60px rgba(0,0,0,.45)` : undefined }}>
      <div className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: c.text }}>{L ? 'New belt' : 'Achievement'}</div>
      <Medal icon={d.icon} band={d.band} size={L ? 88 : 64} />
      <div className={`font-black leading-tight ${L ? 'text-2xl' : 'text-lg'}`}>{d.name}</div>
      <BeltBar filled={filled} big={L} />
      <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: c.text }}>{c.label} · {d.tier}</div>
      <div className="w-full rounded-xl bg-chess-page px-3 py-2 text-xs font-semibold leading-snug">{d.line}</div>
    </div>
  );
}
function E_Leveled() {
  const to = LADDER[SAMPLE.lv.to - 1];
  const c = BAND[to];
  return (
    <div className="w-full rounded-3xl bg-white shadow-2xl px-5 py-6 flex flex-col items-center gap-3 text-center">
      <div className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: c.text }}>Belt upgraded</div>
      <Medal icon={SAMPLE.lv.icon} band={to} size={64} />
      <div className="font-black text-lg leading-tight">{SAMPLE.lv.name}</div>
      <div className="w-full relative">
        <BeltBar filled={3} big />
        <div className="absolute -top-4 text-[9px] font-black uppercase tracking-wider" style={{ left: '50%', transform: 'translateX(-50%)', color: c.text }}>▼ new</div>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
        <span className="text-chess-text-faint line-through">Tier II</span><span style={{ color: c.text }}>Tier III</span>
      </div>
      <div className="w-full">
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden"><div className="h-full" style={{ width: '50%', background: c.ring }} /></div>
        <div className="text-[10px] font-bold text-chess-text-faint mt-1">25 / 50 bouts · next: Champion</div>
      </div>
      <div className="w-full rounded-xl bg-chess-page px-3 py-2 text-xs font-semibold leading-snug">{SAMPLE.lv.line}</div>
    </div>
  );
}
