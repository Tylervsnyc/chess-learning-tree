'use client';

/**
 * GymBackdrop — "The Gym After Hours" background for the /play setup screen
 * inside the Chess Boxing shell (picked by Tyler from /test/play-boxing-bg,
 * 2026-08-07). Heavy bags on chains framing the edges, one warm bulb, the
 * "THERE IS NO TOMORROW" neon, cinderblock wall, chalk dust, and a soft spotlight
 * pooling where Rookie stands. Pure CSS/SVG — no assets, no state.
 *
 * The two bags are painted sprites (gpt-image-1, vintage enamel style, same as
 * the RingHome corner icons) and are HITTABLE: the speed bag (left) springs
 * when punched, the heavy bag (right) swings on its chain when tapped. Both
 * run a damped spring. The wrapper is pointer-events-none; only the bags opt in.
 *
 * Render absolutely inside a relative dark container (bg-[#10162a]); put the
 * screen content above it with z-10.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { playBagSfx } from '@/lib/sounds';

const GYM_CSS = `
@keyframes cbgPop { 0%{opacity:1; transform:translateY(0) scale(.8)} 100%{opacity:0; transform:translateY(-18px) scale(1.3)} }
@keyframes cbgFlicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.55} 94%{opacity:1} 97%{opacity:.75} 98%{opacity:1} }
@keyframes cbgBreathe { 0%,100%{opacity:.7} 50%{opacity:1} }
@keyframes cbgGlow { 0%,100%{opacity:.55} 50%{opacity:1} }
@keyframes cbgDust { 0%{transform:translateY(0); opacity:.4} 100%{transform:translateY(-46px); opacity:0} }
@keyframes cbgRing { 0%{opacity:.85; transform:translate(-50%,-50%) scale(.25)} 100%{opacity:0; transform:translate(-50%,-50%) scale(1.9)} }
@keyframes cbgFlash { 0%{opacity:.9} 100%{opacity:0} }
@keyframes cbgPuff { 0%{opacity:.7; transform:translate(-50%,-50%) scale(.4)} 100%{opacity:0; transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.5)} }
@keyframes cbgSquashS { 0%{transform:scale(1,1)} 22%{transform:scale(1.22,.8)} 55%{transform:scale(.92,1.09)} 100%{transform:scale(1,1)} }
@keyframes cbgSquashH { 0%{transform:scale(1,1)} 18%{transform:scale(1.13,.93)} 52%{transform:scale(.95,1.04)} 100%{transform:scale(1,1)} }
@media (prefers-reduced-motion: reduce) {
  .cbg-anim, .cbg-anim * { animation: none !important; }
}
`;

export function GymBackdrop() {
  return (
    <div className="cbg-anim absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <style>{GYM_CSS}</style>
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
      <div className="absolute top-[54px] left-1/2 -translate-x-1/2 whitespace-nowrap" style={{ animation: 'cbgFlicker 7s linear infinite' }}>
        <span
          className="text-[12px] font-black uppercase tracking-[0.3em] text-[#ff7a7a]"
          style={{ textShadow: '0 0 8px rgba(255,90,90,0.9), 0 0 22px rgba(255,60,60,0.55)' }}
        >
          there is no tomorrow
        </span>
      </div>
      {/* bulb */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-7 bg-black/60" />
      <div
        className="absolute left-1/2 top-7 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#ffd98a] shadow-[0_0_16px_6px_rgba(255,200,110,0.5)]"
        style={{ animation: 'cbgGlow 4s ease-in-out infinite' }}
      />
      {/* the bags — painted sprites, hittable */}
      <SpeedBag />
      <HeavyBag />
      {/* chalk dust */}
      {[20, 46, 64, 80, 33].map((x, i) => (
        <span
          key={x}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${x}%`, top: `${42 + ((i * 11) % 26)}%`, width: 2, height: 2, animation: `cbgDust ${6 + i}s linear ${i * 0.9}s infinite` }}
        />
      ))}
      {/* spotlight pooling on Rookie */}
      <div
        className="absolute inset-x-0 top-[8%] h-[52%]"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 38%, rgba(255,225,170,0.14), transparent 72%)', animation: 'cbgBreathe 6s ease-in-out infinite' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-44" style={{ background: 'linear-gradient(to top, rgba(4,7,14,0.85), transparent)' }} />
    </div>
  );
}

/** Damped spring oscillator — angle in degrees, live velocity, plus hit(impulse). */
function useSwing(stiffness: number, damping: number) {
  const [angle, setAngle] = useState(0);
  const [vel, setVel] = useState(0);
  const st = useRef({ a: 0, v: 0, raf: 0, last: 0 });
  const tick = useCallback((t: number) => {
    const s = st.current;
    const dt = Math.min(0.032, (t - s.last) / 1000 || 0.016);
    s.last = t;
    s.v += (-stiffness * s.a - damping * s.v) * dt;
    s.a += s.v * dt;
    setAngle(s.a);
    setVel(s.v);
    if (Math.abs(s.a) > 0.05 || Math.abs(s.v) > 0.5) s.raf = requestAnimationFrame(tick);
    else { s.a = 0; s.v = 0; s.raf = 0; setAngle(0); setVel(0); }
  }, [stiffness, damping]);
  const hit = useCallback((impulse: number) => {
    const s = st.current;
    s.v += impulse;
    if (!s.raf) { s.last = performance.now(); s.raf = requestAnimationFrame(tick); }
  }, [tick]);
  useEffect(() => {
    const s = st.current;
    return () => cancelAnimationFrame(s.raf);
  }, []);
  return { angle, vel, hit };
}

type Impact = { id: number; x: number; y: number };

/**
 * Impact bursts (ring + dust puffs) that live for ~450ms at the exact point
 * the finger landed. Capped so a rapid-fire flurry can't grow unbounded.
 */
function useImpacts() {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);
  const add = useCallback((x: number, y: number) => {
    const id = nextId.current++;
    setImpacts((list) => [...list.slice(-4), { id, x, y }]);
    const t = window.setTimeout(() => setImpacts((list) => list.filter((p) => p.id !== id)), 480);
    timers.current.push(t);
  }, []);
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  return { impacts, add };
}

/** Ring + dust puffs drawn at an impact point. */
function ImpactBurst({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <span className="absolute pointer-events-none" style={{ left: x, top: y }}>
      <span
        className="absolute rounded-full border-2 border-[#ffe6b0]"
        style={{ width: 34 * scale, height: 34 * scale, left: 0, top: 0, animation: 'cbgRing .42s ease-out forwards' }}
      />
      {[[-1, -0.9], [1, -0.7], [-0.6, 0.9], [0.9, 0.8]].map(([dx, dy], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#f3e7cd]"
          style={{
            width: 5 * scale,
            height: 5 * scale,
            ['--dx' as string]: `${dx * 26 * scale}px`,
            ['--dy' as string]: `${dy * 22 * scale}px`,
            animation: `cbgPuff .45s ease-out ${i * 0.02}s forwards`,
          }}
        />
      ))}
    </span>
  );
}

function hitInfo(e: React.PointerEvent) {
  const el = e.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  // Off-centre taps hit harder and push the bag away from the finger.
  const off = (x - r.width / 2) / (r.width / 2);
  return { x, y, dir: off < 0 ? 1 : -1, power: Math.min(1, 0.55 + Math.abs(off) * 0.6) };
}

function buzz(ms: number) {
  try { navigator.vibrate?.(ms); } catch { /* unsupported */ }
}

/**
 * Speed bag — rattles fast off the drum board. Every punch: a hard squash,
 * a motion-blur ghost while it's moving, an impact ring + dust at the finger,
 * and a flash on the board it slaps against.
 */
function SpeedBag() {
  const { angle, vel, hit } = useSwing(900, 4.2);
  const { impacts, add } = useImpacts();
  const [pop, setPop] = useState(0);
  const moving = Math.abs(vel) > 40;

  const punch = (e: React.PointerEvent) => {
    const { x, y, dir, power } = hitInfo(e);
    hit(dir * (620 + power * 520));
    add(x, y);
    setPop((n) => n + 1);
    buzz(12);
    void playBagSfx('speedbag', power);
  };

  return (
    <div className="absolute left-2 top-[84px] select-none" style={{ width: 104, height: 150 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/boxing/gym/speedbag-drum.webp" alt="" draggable={false} className="absolute left-0 top-0 w-[104px] drop-shadow-[0_6px_6px_rgba(0,0,0,.45)]" />
      {/* board flash — the drum lights up each time the bag slaps it */}
      {pop > 0 && (
        <span
          key={`flash-${pop}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: 14, top: 6, width: 76, height: 44,
            background: 'radial-gradient(ellipse at center, rgba(255,226,170,0.55), transparent 70%)',
            animation: 'cbgFlash .3s ease-out forwards',
          }}
        />
      )}
      <div
        className="absolute"
        style={{ left: 29, top: 56, width: 46, height: 83, transformOrigin: '50% 0%', transform: `rotate(${angle}deg)` }}
      >
        {/* motion-blur ghost — only while it's actually rattling */}
        {moving && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/boxing/gym/speedbag-bag.webp"
            alt=""
            draggable={false}
            className="absolute left-0 top-0 w-[46px] h-[83px] pointer-events-none"
            style={{ opacity: 0.35, transform: `rotate(${Math.max(-9, Math.min(9, -vel * 0.045))}deg)`, filter: 'blur(2px)' }}
          />
        )}
        <button
          type="button"
          aria-label="Punch the speed bag"
          onPointerDown={punch}
          className="absolute left-0 top-0 w-[46px] h-[83px] pointer-events-auto cursor-pointer touch-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`bag-${pop}`}
            src="/boxing/gym/speedbag-bag.webp"
            alt=""
            draggable={false}
            className="w-[46px] h-[83px] drop-shadow-[0_8px_8px_rgba(0,0,0,.5)]"
            style={{ transformOrigin: '50% 15%', animation: pop > 0 ? 'cbgSquashS .26s ease-out' : undefined }}
          />
          {impacts.map((p) => (
            <ImpactBurst key={p.id} x={p.x} y={p.y} scale={0.8} />
          ))}
          {pop > 0 && (
            <span key={pop} className="absolute -right-4 top-6 text-[11px] font-black uppercase tracking-wider text-[#f1e6cf]" style={{ textShadow: '0 1px 0 #000', animation: 'cbgPop .5s ease-out forwards' }}>
              pop
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Heavy bag — swings slow and heavy on its chain. Every punch: a deep squash
 * at the strike point, a dust burst, a chain that rattles ahead of the bag,
 * and a trailing lean so the bottom lags behind the top like real weight.
 */
function HeavyBag() {
  const { angle, vel, hit } = useSwing(32, 1.1);
  const { impacts, add } = useImpacts();
  const [thud, setThud] = useState(0);
  // Bottom of the bag lags the top — sell the mass.
  const lag = Math.max(-7, Math.min(7, -vel * 0.55));

  const punch = (e: React.PointerEvent) => {
    const { x, y, dir, power } = hitInfo(e);
    hit(dir * (60 + power * 55));
    add(x, y);
    setThud((n) => n + 1);
    buzz(28);
    void playBagSfx('heavybag', power);
  };

  return (
    <div
      className="absolute right-[2px] top-[40px]"
      style={{ width: 76, height: 285, transformOrigin: '50% 0%', transform: `rotate(${angle}deg)` }}
    >
      {/* chain link glints — rattle a touch harder than the bag itself */}
      <span
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[3px] h-6 rounded-full bg-[#cfd6e4]/25"
        style={{ transform: `translateX(-50%) rotate(${lag * -0.6}deg)`, transformOrigin: '50% 0%' }}
      />
      <button
        type="button"
        aria-label="Hit the heavy bag"
        onPointerDown={punch}
        className="absolute left-0 top-0 w-[76px] h-[285px] pointer-events-auto cursor-pointer touch-none"
        style={{ transform: `skewX(${lag * 0.35}deg)`, transformOrigin: '50% 0%' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`hb-${thud}`}
          src="/boxing/gym/heavybag.webp"
          alt=""
          draggable={false}
          className="w-[76px] h-[285px] drop-shadow-[0_18px_16px_rgba(0,0,0,.55)]"
          style={{ transformOrigin: '50% 20%', animation: thud > 0 ? 'cbgSquashH .3s ease-out' : undefined }}
        />
        {impacts.map((p) => (
          <ImpactBurst key={p.id} x={p.x} y={p.y} scale={1.15} />
        ))}
      </button>
    </div>
  );
}
