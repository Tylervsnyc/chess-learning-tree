'use client';

/**
 * /test/play-gym — 5 old-school boxing-gym decor options for the /play setup
 * room (Chess Boxing shell), matched to the vintage enamel-sign corner icons.
 * Every option has a SPEED BAG (left) you can punch and a HEAVY BAG (right)
 * you can tap — both swing with real damped physics. Pick one → it becomes
 * the new GymBackdrop.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { PlayPageRookie } from '@/components/play/PlayPageRookie';

/* ─────────────────────────── physics ─────────────────────────── */

/** Damped spring oscillator. Returns angle (deg) and a hit(impulse) fn. */
function useSwing(stiffness: number, damping: number) {
  const [angle, setAngle] = useState(0);
  const st = useRef({ a: 0, v: 0, raf: 0, last: 0 });
  const tick = useCallback((t: number) => {
    const s = st.current;
    const dt = Math.min(0.032, (t - s.last) / 1000 || 0.016);
    s.last = t;
    const acc = -stiffness * s.a - damping * s.v;
    s.v += acc * dt;
    s.a += s.v * dt;
    setAngle(s.a);
    if (Math.abs(s.a) > 0.05 || Math.abs(s.v) > 0.5) s.raf = requestAnimationFrame(tick);
    else { s.a = 0; s.v = 0; s.raf = 0; setAngle(0); }
  }, [stiffness, damping]);
  const hit = useCallback((impulse: number) => {
    const s = st.current;
    s.v += impulse;
    if (!s.raf) { s.last = performance.now(); s.raf = requestAnimationFrame(tick); }
  }, [tick]);
  useEffect(() => () => cancelAnimationFrame(st.current.raf), []);
  return { angle, hit };
}

/* ─────────────────────────── bags ─────────────────────────── */

const CREAM = '#f1e6cf';
const NAVY = '#1c2b48';
const RED = '#b8352f';
const GOLD = '#d9a441';


type Palette = { leather: string; leatherDark: string; leatherLight: string; metal: string; cream: string };

function SpeedBag({ onHit }: { onHit: () => void }) {
  const { angle, hit } = useSwing(420, 5);
  const [flash, setFlash] = useState(0);
  const punch = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dir = e.clientX < r.left + r.width / 2 ? 1 : -1;
    hit(dir * 650);
    setFlash((f) => f + 1);
    onHit();
  };
  // drum sprite is 400x419 → rendered 104px wide; swivel hook sits ~60% down the sprite
  return (
    <div className="absolute left-2 top-[30px] select-none" style={{ width: 104, height: 190 }}>
      <img src="/test-assets/play-gym/speedbag-drum.webp" alt="" draggable={false} className="absolute left-0 top-0 w-[104px] drop-shadow-[0_6px_6px_rgba(0,0,0,.45)]" />
      <button
        type="button"
        aria-label="Punch the speed bag"
        onPointerDown={punch}
        className="absolute cursor-pointer touch-none"
        style={{ left: 52 - 23, top: 56, width: 46, height: 83, transformOrigin: '50% 0%', transform: `rotate(${angle}deg)` }}
      >
        <img src="/test-assets/play-gym/speedbag-bag.webp" alt="" draggable={false} className="w-[46px] h-[83px] drop-shadow-[0_8px_8px_rgba(0,0,0,.5)]" />
        {flash > 0 && (
          <span key={flash} className="absolute -right-4 top-6 text-[11px] font-black uppercase tracking-wider animate-[pgPop_.5s_ease-out_forwards]" style={{ color: CREAM, textShadow: '0 1px 0 #000', fontFamily: 'Georgia, serif' }}>
            pop
          </span>
        )}
      </button>
    </div>
  );
}

function HeavyBag({ onHit }: { onHit: () => void }) {
  const { angle, hit } = useSwing(32, 1.1);
  const tap = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dir = e.clientX < r.left + r.width / 2 ? 1 : -1;
    hit(dir * 70);
    onHit();
  };
  // sprite 400x1499 → 76px wide, 285px tall; pivot at the chain ring (top center)
  return (
    <button
      type="button"
      aria-label="Hit the heavy bag"
      onPointerDown={tap}
      className="absolute right-[4px] top-[-6px] cursor-pointer touch-none"
      style={{ width: 76, height: 285, transformOrigin: '50% 0%', transform: `rotate(${angle}deg)` }}
    >
      <img src="/test-assets/play-gym/heavybag.webp" alt="" draggable={false} className="w-[76px] h-[285px] drop-shadow-[0_18px_16px_rgba(0,0,0,.55)]" />
    </button>
  );
}

/* ─────────────────────────── shared sign ─────────────────────────── */

function EnamelSign({ text, bg, fg, border, top = 30 }: { text: string; bg: string; fg: string; border: string; top?: number }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-[5]" style={{ top }}>
      <div className="w-[2px] h-4 mx-auto" style={{ background: border }} />
      <div className="rounded-[6px] px-3 py-[6px] border-[3px] shadow-[0_4px_0_rgba(0,0,0,.45)] whitespace-nowrap" style={{ background: bg, borderColor: border }}>
        <div className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: fg, fontFamily: 'Georgia, "Times New Roman", serif' }}>{text}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────── variants ─────────────────────────── */


const P_RED: Palette = { leather: '#a83a33', leatherDark: '#3b1412', leatherLight: '#e07a6e', metal: '#c8ccd2', cream: CREAM };
const P_TAN: Palette = { leather: '#b8794a', leatherDark: '#4a2a15', leatherLight: '#e6b07e', metal: '#b9bec6', cream: CREAM };
const P_NAVY: Palette = { leather: '#27426e', leatherDark: '#0f1c33', leatherLight: '#6f93c7', metal: '#cfd4da', cream: CREAM };
const P_BLACK: Palette = { leather: '#2a2622', leatherDark: '#0c0a08', leatherLight: '#6e645a', metal: '#d8c38a', cream: CREAM };

type Variant = { id: number; name: string; note: string; palette: Palette; img: string; sign: { bg: string; fg: string; border: string; top: number }; pool: string };

const VARIANTS: Variant[] = [
  { id: 1, name: 'Blue Corner — Canvas', note: 'Cream canvas floor, corner post right, stool left.', palette: P_BLACK, img: 'blue-1', sign: { bg: CREAM, fg: NAVY, border: GOLD, top: 6 }, pool: 'rgba(255,210,140,.30)' },
  { id: 2, name: 'Blue Corner — Hardwood', note: 'Dark hardwood, hanging gloves, towel hook, extra-large wreath.', palette: P_BLACK, img: 'blue-2', sign: { bg: CREAM, fg: NAVY, border: GOLD, top: 6 }, pool: 'rgba(255,210,140,.30)' },
  { id: 3, name: 'Blue Corner — Bulbs', note: 'String bulbs, red apron stripe, corner post.', palette: P_BLACK, img: 'blue-3', sign: { bg: CREAM, fg: NAVY, border: GOLD, top: 6 }, pool: 'rgba(255,210,140,.30)' },
  { id: 4, name: 'Blue Corner — Weathered', note: 'Chipped planks, single bulb over the wreath, concrete floor.', palette: P_BLACK, img: 'blue-4', sign: { bg: CREAM, fg: NAVY, border: GOLD, top: 6 }, pool: 'rgba(255,210,140,.30)' },
  { id: 5, name: 'Blue Corner — Wainscot', note: 'Cream rail, ropes both sides, gold star studs.', palette: P_BLACK, img: 'blue-5', sign: { bg: CREAM, fg: NAVY, border: GOLD, top: 6 }, pool: 'rgba(255,210,140,.30)' },
];

/** Staging: what makes Rookie read as the star against a busy painted wall. */
function Stage({ v }: { v: Variant }) {
  return (
    <>
      <img src={`/test-assets/play-gym/${v.img}.webp`} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      {/* dim the whole scene a touch so saturated pixels win */}
      <div className="absolute inset-0" style={{ background: 'rgba(14,10,8,.28)' }} />
      {/* darken the center band where Rookie + bubble live */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 66% 40% at 50% 47%, rgba(10,7,6,.5), transparent 72%)' }} />
      {/* warm spotlight pool behind Rookie */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 38% 22% at 50% 46%, ${v.pool}, transparent 70%)`, animation: 'pgBreathe 6s ease-in-out infinite' }} />
      {/* cone from above */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[260px] h-[420px]" style={{ background: 'linear-gradient(to bottom, rgba(255,230,190,.10), transparent 85%)', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)' }} />
      {/* floor shadow so she is grounded */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[404px] w-[170px] h-[26px] rounded-full" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,.55), transparent 70%)' }} />
      {/* vignette + bottom fade */}
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 90px 30px rgba(8,5,4,.6)' }} />
      <div className="absolute inset-x-0 bottom-0 h-36" style={{ background: 'linear-gradient(to top, rgba(6,4,3,.8), transparent)' }} />
      <EnamelSign text="There is no tomorrow" {...v.sign} />
    </>
  );
}

/* ─────────────────────────── frame ─────────────────────────── */

const CSS = `
@keyframes pgBreathe { 0%,100%{opacity:.75} 50%{opacity:1} }
@keyframes pgGlow { 0%,100%{opacity:.55} 50%{opacity:1} }
@keyframes pgPop { 0%{opacity:1; transform:translateY(0) scale(.8)} 100%{opacity:0; transform:translateY(-18px) scale(1.3)} }
`;

function Phone({ v, picked, onPick }: { v: Variant; picked: boolean; onPick: () => void }) {
  const [hits, setHits] = useState(0);
  const [quip, setQuip] = useState('');
  const bump = () => setHits((h) => h + 1);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative w-[390px] h-[720px] rounded-[28px] overflow-hidden border-4 ${picked ? 'border-[#f6c445]' : 'border-white/15'}`} style={{ background: '#10162a' }}>
        <div className="absolute inset-0 pointer-events-none"><Stage v={v} /></div>
        <SpeedBag onHit={bump} />
        <HeavyBag onHit={bump} />
        {/* the REAL /play setup content: level badge + Rookie + bubble + CTA */}
        <div className="absolute inset-x-0 top-[215px] flex flex-col items-center px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(88,204,2,0.22), rgba(88,204,2,0.10))', border: '1px solid rgba(88,204,2,0.45)' }}>
            <span className="text-chess-green font-black text-sm">LV. 3</span>
            <span className="font-semibold text-xs text-white/50">&middot;</span>
            <span className="font-semibold text-xs text-white/70">Scrapper</span>
          </div>
          <div className="mt-2"><PlayPageRookie onQuip={setQuip} /></div>
          <div className="relative w-full h-[72px] mt-2 pointer-events-none">
            <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#f6efe0] rotate-45 rounded-[2px]" />
            <div className="relative rounded-2xl px-5 py-3 h-full bg-[#f6efe0] flex items-center justify-center">
              <p className="text-chess-text text-[14px] leading-relaxed font-medium text-center line-clamp-2">{quip || "Gloves on. Let's go."}</p>
            </div>
          </div>
          <div className="mt-4 w-full h-[52px] rounded-2xl bg-chess-red border-2 border-[#e86060] shadow-[0_5px_0_0_#CC3939] flex items-center justify-center text-white font-black uppercase tracking-wide pointer-events-none">Fight Rookie</div>
        </div>
        <div className="absolute bottom-3 left-0 right-0 text-center text-[11px] text-white/80 pointer-events-none">
          hits: <b className="text-[#f6c445]">{hits}</b> — punch the speed bag · tap the heavy bag
        </div>
      </div>
      <button onClick={onPick} className={`w-[390px] text-left rounded-xl px-3 py-2 ${picked ? 'bg-[#f6c445] text-black' : 'bg-white/5 text-white'}`}>
        <div className="font-black">#{v.id} {v.name}</div>
        <div className="text-[12px] opacity-75">{v.note}</div>
      </button>
    </div>
  );
}

export default function PlayGymTest() {
  const [picked, setPicked] = useState(1);
  return (
    <div className="h-full overflow-auto bg-[#0b101e] text-white p-6">
      <style>{CSS}</style>
      <h1 className="text-2xl font-black">/play gym — Blue Corner variations</h1>
      <p className="text-white/60 text-sm mt-1">Each frame is the /play setup room. Speed bag (left) springs when you punch it; heavy bag (right) swings when you tap it. Pick a number.</p>
      <div className="mt-6 flex flex-wrap gap-8">
        {VARIANTS.map((v) => <Phone key={v.id} v={v} picked={picked === v.id} onPick={() => setPicked(v.id)} />)}
      </div>
      <div className="h-12" />
    </div>
  );
}
