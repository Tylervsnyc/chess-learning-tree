'use client';

/**
 * /test/victory-anim — 8 candidate "match complete" WINDOWS for Chess Boxing.
 * Mobile modal (not full-screen): a hero strip animates in the vintage-gym
 * register of /boxing/locker/corner-*.webp, then the real finish stats land
 * below it (mirrors FinishResult in app/workout/page.tsx and BoutResult in
 * app/box/bout/page.tsx), plus Share / Review / Done.
 * Test page only — no app deps, pure CSS keyframes.
 */

import { useEffect, useState } from 'react';

type Mode = 'puzzle' | 'play';
const ICON: Record<Mode, string> = { puzzle: '/boxing/locker/corner-puzzle.webp', play: '/boxing/locker/corner-play.webp' };

/* Realistic finish payloads (shape mirrors the real screens) */
const PUZZLE = { points: 120, right: 9, wrong: 2, bestRound: 48, punches: 86, streak: 4, lifetime: 3_240, isPersonalBest: true, previousBest: 104, rookieLine: 'Nine in a row. I have never been this calm.' };
const PLAY = { outcome: 'KO', points: 140, chess: 95, boxing: 45, moves: 31, punches: 112, roundsSurvived: 3, rating: 1287, gained: 18, streak: 4, ranked: true, rookieLine: 'This is fine. This is completely fine.' };

const OPTIONS = [
  { id: 'ko-stamp', name: '1 · KO Stamp', blurb: 'Flash + shake, "KO!" stamps down, gold stars burst.' },
  { id: 'title-belt', name: '2 · Title Belt', blurb: 'Belt swings in; the gold plate flips to your points.' },
  { id: 'fight-poster', name: '3 · Fight Poster', blurb: 'Marquee bulbs chase around WINNER on aged paper.' },
  { id: 'laurel-seal', name: '4 · Laurel Seal', blurb: 'Laurel draws leaf by leaf, icon thuds in like a stamp.' },
  { id: 'card-rays', name: '5 · Card & Rays', blurb: 'Clash-style: card rises on sunrays, coins fly, points count up.' },
  { id: 'round-card', name: '6 · Round Card', blurb: 'Ring card flips ROUND 3 → WINNER under chasing lights.' },
  { id: 'combo-bag', name: '7 · Combo Counter', blurb: 'HIT ×1…×5 with POW jolts, then KNOCKOUT.' },
  { id: 'neon-sign', name: '8 · Neon Sign', blurb: 'Neon WINNER buzzes on letter by letter.' },
] as const;
type Id = (typeof OPTIONS)[number]['id'];

export default function VictoryAnimTest() {
  const [active, setActive] = useState<Id | null>(null);
  const [mode, setMode] = useState<Mode>('puzzle');
  const [key, setKey] = useState(0);
  const fire = (id: Id) => { setActive(id); setKey((k) => k + 1); };

  return (
    <div className="h-full overflow-auto bg-[#131a2e] text-white">
      <style>{CSS}</style>
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <h1 className="text-2xl font-black uppercase tracking-tight">Victory windows</h1>
        <p className="text-sm text-white/60 mt-1">Tap one. Tap outside the window (or Done) to dismiss.</p>
        <div className="flex gap-2 mt-4">
          {(['puzzle', 'play'] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`min-h-[44px] px-4 rounded-full text-xs font-black uppercase tracking-wide ${mode === m ? 'bg-[#f6c445] text-[#3d2e00] shadow-[0_2px_0_0_#b8860b]' : 'bg-white/10 text-white/70'}`}>
              {m === 'puzzle' ? 'Puzzle finish' : 'Play (bout) finish'}
            </button>
          ))}
        </div>
        <div className="grid gap-3 mt-5">
          {OPTIONS.map((o) => (
            <button key={o.id} onClick={() => fire(o.id)}
              className="text-left rounded-2xl bg-white/5 border border-white/10 p-4 active:scale-[0.98] transition-transform">
              <div className="font-black uppercase tracking-wide text-[#f6c445]">{o.name}</div>
              <div className="text-sm text-white/65 mt-1">{o.blurb}</div>
            </button>
          ))}
        </div>
      </div>
      {active && <Window key={key} id={active} mode={mode} onClose={() => setActive(null)} />}
    </div>
  );
}

/* ======================= the window ======================= */
function Window({ id, mode, onClose }: { id: Id; mode: Mode; onClose: () => void }) {
  const icon = ICON[mode];
  const Hero = { 'ko-stamp': KoStamp, 'title-belt': TitleBelt, 'fight-poster': FightPoster, 'laurel-seal': LaurelSeal, 'card-rays': CardRays, 'round-card': RoundCard, 'combo-bag': ComboCounter, 'neon-sign': NeonSign }[id];
  const light = id === 'fight-poster' || id === 'laurel-seal';
  const statsDelay = HERO_DONE[id];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 va-fade" onClick={onClose}>
      <div className="va-window w-full max-w-[360px] rounded-3xl overflow-hidden bg-[#f3e9d2] text-[#1b2340] shadow-[0_30px_80px_rgba(0,0,0,.7)] border-[3px] border-[#1b2340]" onClick={(e) => e.stopPropagation()}>
        {/* hero strip */}
        <div className={`relative h-[230px] overflow-hidden ${light ? 'bg-[#f3e9d2]' : 'bg-[#131a2e]'}`}>
          <Hero icon={icon} />
        </div>
        <div className="h-[3px] bg-[#1b2340]" />
        {/* body */}
        <div className="px-4 pt-3 pb-4">
          {mode === 'puzzle' ? <PuzzleBody delay={statsDelay} /> : <PlayBody delay={statsDelay} />}
          <Actions delay={statsDelay + 0.4} onClose={onClose} mode={mode} />
        </div>
      </div>
    </div>
  );
}
const HERO_DONE: Record<Id, number> = { 'ko-stamp': 1.1, 'title-belt': 1.9, 'fight-poster': 1.2, 'laurel-seal': 1.6, 'card-rays': 2.1, 'round-card': 1.9, 'combo-bag': 2.3, 'neon-sign': 1.8 };

/* ---- stat primitives ---- */
function Stat({ v, l, delay, accent }: { v: React.ReactNode; l: string; delay: number; accent?: 'red' | 'gold' | 'blue' }) {
  const col = accent === 'red' ? 'text-[#ff4b4b]' : accent === 'gold' ? 'text-[#b8860b]' : accent === 'blue' ? 'text-[#1cb0f6]' : 'text-[#1b2340]';
  return (
    <div className="va-stat rounded-xl border-2 border-[#1b2340]/15 bg-white/60 px-2 py-2 text-center" style={{ animationDelay: `${delay}s` }}>
      <div className={`text-[22px] font-black tabular-nums leading-none ${col}`}>{v}</div>
      <div className="text-[9px] font-black uppercase tracking-[0.22em] text-[#1b2340]/55 mt-1">{l}</div>
    </div>
  );
}
function Row({ l, v, delay }: { l: string; v: React.ReactNode; delay: number }) {
  return (
    <div className="va-stat flex items-center justify-between text-[12px] font-bold py-1 border-b border-dashed border-[#1b2340]/20 last:border-0" style={{ animationDelay: `${delay}s` }}>
      <span className="text-[#1b2340]/60 uppercase tracking-[0.12em] text-[10px] font-black">{l}</span>
      <span className="tabular-nums font-black">{v}</span>
    </div>
  );
}
function Rookie({ line, delay }: { line: string; delay: number }) {
  return (
    <div className="va-stat mt-3 flex items-start gap-2 rounded-xl bg-[#1b2340] text-[#f3e9d2] px-3 py-2" style={{ animationDelay: `${delay}s` }}>
      <div className="shrink-0 w-6 h-6 rounded-md bg-[#ff4b4b] mt-[1px]" style={{ clipPath: 'polygon(15% 0,35% 0,35% 20%,65% 20%,65% 0,85% 0,85% 35%,100% 35%,100% 100%,0 100%,0 35%,15% 35%)' }} />
      <p className="text-[12px] font-semibold leading-snug">{line}</p>
    </div>
  );
}
function Ribbon({ children, delay, color = 'red' }: { children: React.ReactNode; delay: number; color?: 'red' | 'gold' }) {
  return (
    <div className="va-stat flex justify-center" style={{ animationDelay: `${delay}s` }}>
      <span className={`inline-block -mt-[22px] relative z-10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border-[3px] border-[#f3e9d2] rotate-[-2deg] ${color === 'red' ? 'bg-[#ff4b4b] text-[#f3e9d2]' : 'bg-[#f6c445] text-[#3d2e00]'}`} style={{ boxShadow: '0 3px 0 rgba(0,0,0,.25)' }}>{children}</span>
    </div>
  );
}

function PuzzleBody({ delay: d }: { delay: number }) {
  const total = PUZZLE.right + PUZZLE.wrong;
  return (
    <>
      <Ribbon delay={d} color={PUZZLE.isPersonalBest ? 'gold' : 'red'}>{PUZZLE.isPersonalBest ? `New best · was ${PUZZLE.previousBest}` : 'Workout complete'}</Ribbon>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <Stat v={`+${PUZZLE.points}`} l="points" delay={d + 0.1} accent="red" />
        <Stat v={<>{PUZZLE.right}<span className="text-[13px] text-[#1b2340]/50">/{total}</span></>} l="solved" delay={d + 0.2} />
        <Stat v={PUZZLE.streak} l="day streak" delay={d + 0.3} accent="gold" />
      </div>
      <div className="mt-2 px-1">
        <Row l="Best round" v={`${PUZZLE.bestRound} pts`} delay={d + 0.35} />
        <Row l="Punches landed" v={PUZZLE.punches} delay={d + 0.4} />
        <Row l="Lifetime points" v={PUZZLE.lifetime.toLocaleString()} delay={d + 0.45} />
      </div>
      <Rookie line={PUZZLE.rookieLine} delay={d + 0.5} />
    </>
  );
}
function PlayBody({ delay: d }: { delay: number }) {
  return (
    <>
      <Ribbon delay={d}>{PLAY.outcome === 'KO' ? 'Win by knockout' : 'Win by decision'}{PLAY.ranked ? ' · Ranked' : ''}</Ribbon>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <Stat v={`+${PLAY.points}`} l="points" delay={d + 0.1} accent="red" />
        <Stat v={<>{PLAY.rating}<span className="text-[12px] text-[#2f7d4a]"> ↑{PLAY.gained}</span></>} l="rating" delay={d + 0.2} accent="blue" />
        <Stat v={PLAY.streak} l="day streak" delay={d + 0.3} accent="gold" />
      </div>
      <div className="mt-2 px-1">
        <Row l="Points split" v={<span>{PLAY.chess} chess <span className="text-[#1b2340]/40">·</span> {PLAY.boxing} boxing</span>} delay={d + 0.35} />
        <Row l="Moves" v={PLAY.moves} delay={d + 0.4} />
        <Row l="Punches landed" v={PLAY.punches} delay={d + 0.45} />
        <Row l="Rounds survived" v={`${PLAY.roundsSurvived} / 3`} delay={d + 0.5} />
      </div>
      <Rookie line={PLAY.rookieLine} delay={d + 0.55} />
    </>
  );
}
function Actions({ delay: d, onClose, mode }: { delay: number; onClose: () => void; mode: Mode }) {
  return (
    <div className="va-stat mt-3 grid grid-cols-[44px_1fr_1fr] gap-2" style={{ animationDelay: `${d}s` }}>
      <button aria-label="Share" className="min-h-[44px] rounded-xl border-2 border-[#1b2340] bg-white/70 flex items-center justify-center active:translate-y-[2px]" style={{ boxShadow: '0 3px 0 #1b2340' }}>
        <ShareIcon />
      </button>
      <button className="min-h-[44px] rounded-xl border-2 border-[#1b2340] bg-white/70 text-[11px] font-black uppercase tracking-wide active:translate-y-[2px]" style={{ boxShadow: '0 3px 0 #1b2340' }}>
        {mode === 'puzzle' ? 'Review misses' : 'Review game'}
      </button>
      <button onClick={onClose} className="min-h-[44px] rounded-xl border-2 border-[#8a1f1f] bg-[#ff4b4b] text-[#f3e9d2] text-[11px] font-black uppercase tracking-wide active:translate-y-[2px]" style={{ boxShadow: '0 3px 0 #8a1f1f' }}>
        Done
      </button>
    </div>
  );
}
function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b2340" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

/* ======================= hero strips (230px tall) ======================= */
function Grain() { return <div className="va-grain absolute inset-0 pointer-events-none" />; }
function Big({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`font-black uppercase leading-[0.85] tracking-tight text-center ${className}`} style={style}>{children}</div>;
}
const STAR = 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)';

/* 1 · KO stamp */
function KoStamp({ icon }: { icon: string }) {
  return (
    <div className="va-shake absolute inset-0">
      <Grain />
      <div className="va-flash absolute inset-0 bg-[#f3e9d2]" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="va-star absolute left-1/2 top-1/2 w-2.5 h-2.5 bg-[#f6c445]" style={{ ['--a' as string]: `${i * 36}deg`, animationDelay: '0.55s', clipPath: STAR }} />
      ))}
      <img src={icon} alt="" className="va-icon-drop absolute left-4 top-1/2 -translate-y-1/2 w-24 h-24" />
      <div className="absolute right-5 top-1/2 -translate-y-1/2">
        <div className="va-stamp rotate-[-9deg] border-[5px] border-[#ff4b4b] rounded-xl px-3 py-1" style={{ boxShadow: 'inset 0 0 0 2px #131a2e, inset 0 0 0 4px #ff4b4b' }}>
          <Big className="text-[72px] text-[#ff4b4b]" style={{ textShadow: '4px 4px 0 #8a1f1f' }}>KO!</Big>
        </div>
      </div>
      <Big className="va-sub absolute inset-x-0 bottom-3 text-[12px] text-[#f3e9d2]/80 tracking-[0.4em]" style={{ animationDelay: '0.9s' }}>Match won</Big>
    </div>
  );
}

/* 2 · Title belt */
function TitleBelt({ icon }: { icon: string }) {
  return (
    <div className="absolute inset-0">
      <Grain />
      <div className="va-spot absolute inset-0" />
      <div className="va-belt absolute left-1/2 top-1/2 w-[150%] -translate-x-1/2 -translate-y-1/2">
        <div className="h-16 rounded-full bg-[#8a1f1f] border-y-[5px] border-[#5c1212] relative" style={{ boxShadow: '0 8px 0 #3d0c0c' }}>
          <div className="absolute inset-y-2 inset-x-0 border-y-2 border-dashed border-[#f6c445]/60" />
          {[22, 32, 68, 78].map((l) => <div key={l} className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#f6c445] border-[3px] border-[#b8860b] shadow-[0_2px_0_#8a6508]" style={{ left: `${l}%` }} />)}
        </div>
        <div className="va-plate absolute left-1/2 top-1/2 w-32 h-32 rounded-full bg-[#f6c445] border-[6px] border-[#b8860b] shadow-[0_6px_0_#8a6508,0_16px_30px_rgba(0,0,0,.5)]">
          <div className="va-plate-front absolute inset-1 rounded-full flex items-center justify-center"><img src={icon} alt="" className="w-24 h-24" /></div>
          <div className="va-plate-back absolute inset-1 rounded-full flex flex-col items-center justify-center text-[#3d2e00]">
            <div className="text-4xl font-black tabular-nums leading-none">+120</div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] mt-1">Points</div>
          </div>
        </div>
      </div>
      <Big className="va-sub absolute inset-x-0 bottom-2 text-[20px] text-[#f6c445]" style={{ animationDelay: '1.6s', textShadow: '2px 2px 0 #8a6508' }}>Champion</Big>
    </div>
  );
}

/* 3 · Fight poster */
function FightPoster({ icon }: { icon: string }) {
  return (
    <div className="va-poster absolute inset-0 text-[#1b2340]">
      <Grain />
      <div className="absolute inset-2 border-[3px] border-[#1b2340]" />
      <div className="absolute inset-[14px] border border-[#ff4b4b]" />
      {Array.from({ length: 24 }).map((_, i) => {
        const t = i / 24, p = t < 0.3 ? [t / 0.3, 0] : t < 0.5 ? [1, (t - 0.3) / 0.2] : t < 0.8 ? [1 - (t - 0.5) / 0.3, 1] : [0, 1 - (t - 0.8) / 0.2];
        return <div key={i} className="va-bulb absolute w-2 h-2 rounded-full bg-[#f6c445]" style={{ left: `calc(${p[0] * 100}% - 4px + ${p[0] === 0 ? 10 : p[0] === 1 ? -10 : 0}px)`, top: `calc(${p[1] * 100}% - 4px + ${p[1] === 0 ? 10 : p[1] === 1 ? -10 : 0}px)`, animationDelay: `${(i % 3) * 0.2}s` }} />;
      })}
      <div className="absolute inset-0 flex items-center justify-center gap-3 px-8">
        <img src={icon} alt="" className="va-icon-drop-plain w-24 h-24 shrink-0" style={{ animationDelay: '0.6s' }} />
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.4em]">Tonight · One night only</div>
          <Big className="va-sub text-[54px] text-[#ff4b4b] text-left" style={{ animationDelay: '0.5s', textShadow: '3px 3px 0 #1b2340' }}>Winner</Big>
          <div className="va-sub text-[10px] font-black uppercase tracking-[0.3em] mt-1" style={{ animationDelay: '0.9s' }}>By decision</div>
        </div>
      </div>
    </div>
  );
}

/* 4 · Laurel seal */
function LaurelSeal({ icon }: { icon: string }) {
  return (
    <div className="absolute inset-0">
      <Grain />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] h-[210px]">
        <svg viewBox="-110 -110 220 220" className="absolute inset-0 w-full h-full">
          {([-1, 1] as const).map((side) => Array.from({ length: 14 }).map((_, i) => (
            <ellipse key={side + '' + i} className="va-leaf" cx={0} cy={-92} rx={7} ry={16} fill="#2f7d4a" stroke="#1d5432" strokeWidth={1.5}
              transform={`scale(${side},1) rotate(${-100 + i * 15})`} style={{ animationDelay: `${0.07 * i}s`, transformOrigin: '0 0' }} />
          )))}
          <circle r={74} fill="none" stroke="#ff4b4b" strokeWidth={5} strokeDasharray="6 8" className="va-spin-slow" />
        </svg>
        <img src={icon} alt="" className="va-stamp-thud absolute inset-0 m-auto w-24 h-24" style={{ animationDelay: '1s' }} />
      </div>
      <Big className="va-sub absolute left-3 bottom-3 text-[20px] text-[#1b2340] text-left" style={{ animationDelay: '1.4s', textShadow: '2px 2px 0 #ff4b4b' }}>Victory</Big>
      <div className="va-sub absolute right-3 bottom-4 text-[8px] font-black uppercase tracking-[0.35em] text-[#1b2340]/60" style={{ animationDelay: '1.4s' }}>Certified</div>
    </div>
  );
}

/* 5 · Card & rays */
function CardRays({ icon }: { icon: string }) {
  return (
    <div className="absolute inset-0">
      <div className="va-rays absolute left-1/2 top-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <Grain />
      <div className="va-card absolute left-1/2 top-1/2 w-[120px] h-[160px]">
        <div className="absolute inset-0 rounded-xl bg-[#f3e9d2] border-4 border-[#f6c445] shadow-[0_0_0_2px_#b8860b,0_16px_30px_rgba(0,0,0,.6)] flex flex-col items-center pt-2 overflow-hidden">
          <div className="va-shine absolute inset-0" />
          <div className="text-[7px] font-black uppercase tracking-[0.3em] text-[#1b2340]/60">Round won</div>
          <img src={icon} alt="" className="w-20 h-20 mt-1" />
          <Big className="text-[18px] text-[#ff4b4b] mt-1" style={{ textShadow: '1px 1px 0 #1b2340' }}>Winner</Big>
          <div className="absolute bottom-2 flex gap-1">{[0, 1, 2].map((i) => <div key={i} className="va-pop w-3.5 h-3.5 bg-[#f6c445]" style={{ animationDelay: `${1 + i * 0.15}s`, clipPath: STAR }} />)}</div>
        </div>
      </div>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="va-coin absolute left-1/2 bottom-4 w-4 h-4 rounded-full bg-[#f6c445] border-2 border-[#b8860b]" style={{ ['--x' as string]: `${(i - 6) * 26}px`, animationDelay: `${1.2 + i * 0.05}s` }} />
      ))}
      <CountUp className="va-sub absolute right-4 top-1/2 -translate-y-1/2 text-[44px] font-black tabular-nums text-[#f6c445]" delay={1.4} />
    </div>
  );
}
function CountUp({ className, delay }: { className: string; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = setTimeout(() => {
      const start = performance.now();
      const tick = (t: number) => { const p = Math.min(1, (t - start) / 700); setN(Math.round(120 * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(t0);
  }, [delay]);
  return <div className={className} style={{ animationDelay: `${delay}s`, textShadow: '3px 3px 0 #8a6508' }}>+{n}</div>;
}

/* 6 · Round card */
function RoundCard({ icon }: { icon: string }) {
  return (
    <div className="absolute inset-0">
      <Grain />
      <div className="absolute top-0 inset-x-0 flex justify-around px-3 pt-2">
        {Array.from({ length: 9 }).map((_, i) => <div key={i} className="va-ringlight w-2.5 h-2.5 rounded-full bg-[#f3e9d2]" style={{ animationDelay: `${i * 0.1}s` }} />)}
      </div>
      <div className="absolute inset-x-0 top-[22px] h-[2px] bg-[#ff4b4b]" /><div className="absolute inset-x-0 top-[28px] h-[2px] bg-[#f3e9d2]" /><div className="absolute inset-x-0 top-[34px] h-[2px] bg-[#1cb0f6]" />
      <div className="va-roundcard absolute left-1/2 top-[54%] w-[130px] h-[150px]" style={{ perspective: '800px' }}>
        <div className="va-flip relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 rounded-lg bg-[#f3e9d2] border-4 border-[#1b2340] flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
            <div className="text-[8px] font-black uppercase tracking-[0.4em] text-[#1b2340]/60">Round</div>
            <div className="text-[84px] font-black leading-none text-[#1b2340]">3</div>
          </div>
          <div className="absolute inset-0 rounded-lg bg-[#ff4b4b] border-4 border-[#f3e9d2] flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <img src={icon} alt="" className="w-16 h-16" />
            <Big className="text-[24px] text-[#f3e9d2] mt-1" style={{ textShadow: '2px 2px 0 #8a1f1f' }}>Winner</Big>
            <div className="text-[7px] font-black uppercase tracking-[0.3em] text-[#f3e9d2]/80 mt-1">Unanimous</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 7 · Combo counter */
function ComboCounter({ icon }: { icon: string }) {
  const [hits, setHits] = useState(0);
  const [jolt, setJolt] = useState(0);
  useEffect(() => {
    const ids = [0, 1, 2, 3, 4].map((i) => setTimeout(() => { setHits(i + 1); setJolt((j) => j + 1); }, 400 + i * 320));
    return () => ids.forEach(clearTimeout);
  }, []);
  const done = hits >= 5;
  const POW = 'polygon(50% 0,63% 25%,90% 10%,80% 38%,100% 50%,80% 62%,90% 90%,63% 75%,50% 100%,37% 75%,10% 90%,20% 62%,0 50%,20% 38%,10% 10%,37% 25%)';
  return (
    <div key={jolt} className={`absolute inset-0 ${hits ? 'va-jolt' : ''}`}>
      <Grain />
      <div className="absolute left-5 top-1/2 -translate-y-1/2">
        <img src={icon} alt="" className={`w-24 h-24 ${hits && !done ? 'va-punch' : ''} ${done ? 'va-icon-bounce' : ''}`} />
        {hits > 0 && !done && <div key={hits} className="va-pow absolute -right-4 -top-2 w-14 h-14 bg-[#f6c445] flex items-center justify-center text-[#8a1f1f] font-black text-[13px]" style={{ clipPath: POW }}>POW</div>}
      </div>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-right">
        {!done ? (
          <>
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-[#f3e9d2]/60">Combo</div>
            <div key={hits} className="va-pop text-[84px] font-black leading-none text-[#f6c445] tabular-nums" style={{ textShadow: '4px 4px 0 #8a6508' }}>×{hits}</div>
          </>
        ) : (
          <div className="va-pop">
            <Big className="text-[40px] text-[#ff4b4b] text-right" style={{ textShadow: '3px 3px 0 #8a1f1f' }}>Knock<br />out</Big>
          </div>
        )}
      </div>
    </div>
  );
}

/* 8 · Neon sign */
function NeonSign({ icon }: { icon: string }) {
  return (
    <div className="absolute inset-0 bg-[#07091a]">
      <Grain />
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg,transparent 0 28px,rgba(255,255,255,.03) 28px 30px)' }} />
      <img src={icon} alt="" className="va-neon-glow absolute left-4 top-1/2 -translate-y-1/2 w-24 h-24" style={{ animationDelay: '1.5s' }} />
      <div className="absolute right-4 top-[38%] -translate-y-1/2 flex gap-[2px]">
        {'WINNER'.split('').map((ch, i) => <span key={i} className="va-neon text-[44px] font-black leading-none text-[#ffb4b4]" style={{ animationDelay: `${0.2 + i * 0.2}s` }}>{ch}</span>)}
      </div>
      <div className="va-neon absolute right-4 top-[64%] text-[10px] font-black uppercase tracking-[0.4em] text-[#9be3ff]" style={{ animationDelay: '1.6s', ['--glow' as string]: '#1cb0f6' }}>There is no tomorrow</div>
    </div>
  );
}

/* ======================= CSS ======================= */
const CSS = `
.va-fade{animation:va-fade .25s both}
@keyframes va-fade{from{opacity:0}to{opacity:1}}
.va-window{animation:va-window .45s cubic-bezier(.2,1.3,.4,1) both}
@keyframes va-window{from{transform:translateY(40px) scale(.9);opacity:0}to{transform:none;opacity:1}}
.va-stat{animation:va-up .45s cubic-bezier(.2,1.3,.4,1) both}
@keyframes va-up{from{transform:translateY(14px);opacity:0}to{transform:none;opacity:1}}

.va-grain{background-image:radial-gradient(rgba(0,0,0,.18) 1px,transparent 1.2px);background-size:4px 4px;opacity:.45;mix-blend-mode:multiply}
.va-spot{background:radial-gradient(circle at 50% 40%,rgba(246,196,69,.28),transparent 60%);animation:va-fade .6s both}

.va-shake{animation:va-shake .5s .5s cubic-bezier(.36,.07,.19,.97) both}
@keyframes va-shake{10%,90%{transform:translate3d(-2px,0,0)}20%,80%{transform:translate3d(4px,0,0)}30%,50%,70%{transform:translate3d(-7px,0,0)}40%,60%{transform:translate3d(7px,0,0)}}
.va-flash{animation:va-flash .5s .5s both}
@keyframes va-flash{0%{opacity:0}10%{opacity:.9}100%{opacity:0}}
.va-stamp{animation:va-stamp .45s .25s cubic-bezier(.2,1.4,.4,1) both}
@keyframes va-stamp{from{transform:rotate(-9deg) scale(4);opacity:0}60%{opacity:1}to{transform:rotate(-9deg) scale(1);opacity:1}}
.va-star{animation:va-star .9s ease-out both}
@keyframes va-star{from{transform:rotate(var(--a)) translateY(0) scale(.2);opacity:1}to{transform:rotate(var(--a)) translateY(-120px) scale(1.2);opacity:0}}
.va-icon-drop{animation:va-drop .6s cubic-bezier(.2,1.5,.4,1) both}
@keyframes va-drop{from{transform:translateY(-50%) translateX(-40px) scale(.6);opacity:0}to{transform:translateY(-50%) translateX(0) scale(1);opacity:1}}
.va-icon-drop-plain{animation:va-drop-plain .6s cubic-bezier(.2,1.5,.4,1) both}
@keyframes va-drop-plain{from{transform:translateY(-30px) scale(.6);opacity:0}to{transform:none;opacity:1}}
.va-sub{animation:va-pop .45s cubic-bezier(.2,1.4,.4,1) both}
.va-pop{animation:va-pop .4s cubic-bezier(.2,1.6,.4,1) both}
@keyframes va-pop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}

.va-belt{animation:va-belt 1.1s cubic-bezier(.2,1.2,.4,1) both}
@keyframes va-belt{from{transform:translate(-50%,-220%) rotate(-12deg)}60%{transform:translate(-50%,-50%) rotate(4deg)}80%{transform:translate(-50%,-50%) rotate(-2deg)}to{transform:translate(-50%,-50%) rotate(0)}}
.va-plate{animation:va-plate 1.4s 1.1s both;transform-style:preserve-3d}
@keyframes va-plate{0%{transform:translate(-50%,-50%) rotateY(0)}40%,60%{transform:translate(-50%,-50%) rotateY(180deg) scale(1.15)}100%{transform:translate(-50%,-50%) rotateY(180deg) scale(1)}}
.va-plate-front,.va-plate-back{backface-visibility:hidden}
.va-plate-back{transform:rotateY(180deg)}

.va-poster{animation:va-unroll .7s cubic-bezier(.2,1.2,.4,1) both;transform-origin:top}
@keyframes va-unroll{from{transform:scaleY(.02);opacity:0}40%{opacity:1}to{transform:scaleY(1);opacity:1}}
.va-bulb{animation:va-bulb .6s .8s infinite}
@keyframes va-bulb{0%,100%{opacity:.25;box-shadow:none}50%{opacity:1;box-shadow:0 0 8px #f6c445,0 0 14px #ff9b2b}}

.va-leaf{animation:va-leaf .35s cubic-bezier(.2,1.4,.4,1) both;transform-box:fill-box}
@keyframes va-leaf{from{opacity:0;scale:0}to{opacity:1;scale:1}}
.va-spin-slow{animation:va-spin 20s linear infinite;transform-origin:center}
@keyframes va-spin{to{transform:rotate(360deg)}}
.va-stamp-thud{animation:va-thud .4s cubic-bezier(.2,1.6,.4,1) both}
@keyframes va-thud{from{transform:scale(3) rotate(15deg);opacity:0}50%{opacity:1}to{transform:scale(1) rotate(-6deg)}}

.va-rays{background:repeating-conic-gradient(from 0deg,#f6c445 0 10deg,transparent 10deg 20deg);opacity:.15;animation:va-spin 24s linear infinite,va-fade .8s both}
.va-card{animation:va-card 1s cubic-bezier(.2,1.3,.4,1) both}
@keyframes va-card{from{transform:translate(-90%,60%) rotate(25deg) scale(.4);opacity:0}to{transform:translate(-90%,-50%) rotate(-4deg) scale(1);opacity:1}}
.va-shine{background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.7) 50%,transparent 65%);animation:va-shine 1.2s 1s both}
@keyframes va-shine{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.va-coin{animation:va-coin .9s cubic-bezier(.3,0,.2,1) both;box-shadow:0 2px 0 #8a6508}
@keyframes va-coin{from{transform:translate(-50%,0) scale(.4);opacity:0}30%{opacity:1}to{transform:translate(calc(-50% + var(--x)),-190px) scale(1);opacity:0}}

.va-ringlight{animation:va-ringlight 1s infinite}
@keyframes va-ringlight{0%,100%{opacity:.2}50%{opacity:1;box-shadow:0 0 10px #fff}}
.va-roundcard{animation:va-sweep .8s cubic-bezier(.2,1.1,.4,1) both}
@keyframes va-sweep{from{transform:translate(-200%,-50%) rotate(-15deg)}to{transform:translate(-50%,-50%) rotate(0)}}
.va-flip{animation:va-flip .7s 1.1s cubic-bezier(.6,0,.2,1) both}
@keyframes va-flip{from{transform:rotateY(0)}to{transform:rotateY(180deg)}}

.va-jolt{animation:va-jolt .25s cubic-bezier(.36,.07,.19,.97)}
@keyframes va-jolt{25%{transform:translate(-5px,3px)}50%{transform:translate(5px,-3px)}75%{transform:translate(-3px,2px)}}
.va-punch{animation:va-punch .3s cubic-bezier(.2,1.4,.4,1)}
@keyframes va-punch{30%{transform:rotate(-12deg) scale(1.15)}}
.va-icon-bounce{animation:va-bounce .6s cubic-bezier(.2,1.5,.4,1) both}
@keyframes va-bounce{from{transform:scale(.7)}to{transform:scale(1.1)}}
.va-pow{animation:va-pow .3s ease-out both}
@keyframes va-pow{from{transform:scale(0) rotate(40deg);opacity:0}to{transform:scale(1) rotate(12deg);opacity:1}}

.va-neon{--glow:#ff4b4b;opacity:0;animation:va-neon .9s both;text-shadow:0 0 6px #fff,0 0 14px var(--glow),0 0 30px var(--glow),0 0 60px var(--glow)}
@keyframes va-neon{0%{opacity:0}10%{opacity:.6}15%{opacity:0}30%{opacity:.8}35%{opacity:.1}45%{opacity:1}55%{opacity:.4}60%,100%{opacity:1}}
.va-neon-glow{animation:va-fade 1s both;filter:drop-shadow(0 0 14px rgba(255,75,75,.8)) drop-shadow(0 0 40px rgba(255,75,75,.5))}
`;
