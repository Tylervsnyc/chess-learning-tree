'use client';

/**
 * GymBackdrop — "Blue Corner" background for the /play setup screen inside the
 * Chess Boxing shell. Picked by Tyler from /test/play-gym (2026-08-22).
 *
 * Painted set (gpt-image-1, vintage enamel-sign style, matches the corner
 * icons on RingHome): navy plank wall, gold-leaf laurel wreath, cream canvas
 * floor, corner post. On top: the hanging "THERE IS NO TOMORROW" sign, a
 * SPEED BAG (top-left) you can punch and a HEAVY BAG (top-right) you can tap —
 * both swing on a damped spring. Plus a staging layer so Rookie's bright pixel
 * squares stay the focal point against a painted wall: overall dim, a dark
 * band behind her, a warm breathing spotlight, a floor shadow, and a vignette.
 *
 * Render absolutely inside a relative dark container (bg-[#10162a]); screen
 * content goes above it with z-10. The wrapper is pointer-events-none; only
 * the two bags opt back in.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const CSS = `
@keyframes gymBreathe { 0%,100%{opacity:.72} 50%{opacity:1} }
@keyframes gymPop { 0%{opacity:1; transform:translateY(0) scale(.8)} 100%{opacity:0; transform:translateY(-18px) scale(1.3)} }
@media (prefers-reduced-motion: reduce) { .gym-anim, .gym-anim * { animation: none !important; } }
`;

/** Damped spring oscillator — angle in degrees plus hit(impulse). */
function useSwing(stiffness: number, damping: number) {
  const [angle, setAngle] = useState(0);
  const st = useRef({ a: 0, v: 0, raf: 0, last: 0 });
  const tick = useCallback((t: number) => {
    const s = st.current;
    const dt = Math.min(0.032, (t - s.last) / 1000 || 0.016);
    s.last = t;
    s.v += (-stiffness * s.a - damping * s.v) * dt;
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
  useEffect(() => {
    const s = st.current;
    return () => cancelAnimationFrame(s.raf);
  }, []);
  return { angle, hit };
}

function sideOf(e: React.PointerEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return e.clientX < r.left + r.width / 2 ? 1 : -1;
}

function SpeedBag() {
  const { angle, hit } = useSwing(420, 5);
  const [pop, setPop] = useState(0);
  return (
    <div className="absolute left-2 top-[68px] select-none" style={{ width: 104, height: 150 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/boxing/gym/speedbag-drum.webp" alt="" draggable={false} className="absolute left-0 top-0 w-[104px] drop-shadow-[0_6px_6px_rgba(0,0,0,.45)]" />
      <button
        type="button"
        aria-label="Punch the speed bag"
        onPointerDown={(e) => { hit(sideOf(e) * 650); setPop((n) => n + 1); }}
        className="absolute pointer-events-auto cursor-pointer touch-none"
        style={{ left: 29, top: 56, width: 46, height: 83, transformOrigin: '50% 0%', transform: `rotate(${angle}deg)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/boxing/gym/speedbag-bag.webp" alt="" draggable={false} className="w-[46px] h-[83px] drop-shadow-[0_8px_8px_rgba(0,0,0,.5)]" />
        {pop > 0 && (
          <span key={pop} className="absolute -right-4 top-6 text-[11px] font-black uppercase tracking-wider text-[#f1e6cf]" style={{ textShadow: '0 1px 0 #000', fontFamily: 'Georgia, serif', animation: 'gymPop .5s ease-out forwards' }}>
            pop
          </span>
        )}
      </button>
    </div>
  );
}

function HeavyBag() {
  const { angle, hit } = useSwing(32, 1.1);
  return (
    <button
      type="button"
      aria-label="Hit the heavy bag"
      onPointerDown={(e) => hit(sideOf(e) * 70)}
      className="absolute right-[4px] top-[46px] pointer-events-auto cursor-pointer touch-none"
      style={{ width: 76, height: 285, transformOrigin: '50% 0%', transform: `rotate(${angle}deg)` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/boxing/gym/heavybag.webp" alt="" draggable={false} className="w-[76px] h-[285px] drop-shadow-[0_18px_16px_rgba(0,0,0,.55)]" />
    </button>
  );
}

export function GymBackdrop() {
  return (
    <div className="gym-anim absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <style>{CSS}</style>
      {/* painted set */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/boxing/gym/blue-corner.webp" alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
      {/* staging — dim, dark band behind Rookie, warm pool, cone, vignette */}
      <div className="absolute inset-0" style={{ background: 'rgba(14,10,8,.28)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 66% 40% at 50% 47%, rgba(10,7,6,.5), transparent 72%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 38% 22% at 50% 46%, rgba(255,210,140,.30), transparent 70%)', animation: 'gymBreathe 6s ease-in-out infinite' }} />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[260px] h-[420px]" style={{ background: 'linear-gradient(to bottom, rgba(255,230,190,.10), transparent 85%)', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)' }} />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 90px 30px rgba(8,5,4,.6)' }} />
      <div className="absolute inset-x-0 bottom-0 h-36" style={{ background: 'linear-gradient(to top, rgba(6,4,3,.8), transparent)' }} />
      {/* hanging sign */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/boxing/gym/sign-no-tomorrow.webp" alt="" draggable={false} className="absolute left-1/2 -translate-x-1/2 w-[108px] drop-shadow-[0_8px_10px_rgba(0,0,0,.5)]" style={{ top: '8.5%' }} />
      {/* the bags — the only interactive bits */}
      <SpeedBag />
      <HeavyBag />
    </div>
  );
}
