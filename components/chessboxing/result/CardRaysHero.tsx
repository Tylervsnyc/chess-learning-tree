'use client';

/**
 * CardRaysHero — the animated strip at the top of FightResultCard.
 * Clash-Royale energy in the vintage-gym skin of /boxing/locker/corner-*.webp:
 * a trading card rises on slow-spinning sunrays, a shine sweeps it, and on a
 * WIN gold coins fly up while the points count to their total. On a loss the
 * card still rises (same ceremony, quieter) — no rays burst, no coins, no count.
 *
 * Timing contract: `HERO_DONE_MS` is when the body below should start landing.
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { playCelebrationSound } from '@/lib/sounds';

export const HERO_DONE_MS = 2100;
const COINS_AT_MS = 1200;
const COUNT_AT_MS = 1400;
const STAR = 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)';

interface Props {
  /** /boxing/locker/corner-puzzle.webp | corner-play.webp */
  icon: string;
  points: number;
  won: boolean;
  /** Small label on the card ("Round won", "Workout", "Bout") */
  kicker: string;
  /** Big word on the card ("Winner" / "Lost" / "Draw") */
  word: string;
  /** Strip height — the bout card needs 200 to fit 375×667 with no scroll. */
  height?: number;
}

export function CardRaysHero({ icon, points, won, kicker, word, height = 230 }: Props) {
  const celebrate = won && points > 0;
  return (
    <div className="relative overflow-hidden bg-[#131a2e]" style={{ height }}>
      <style>{CSS}</style>
      {won && <div className="frc-rays absolute left-1/2 top-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full" />}
      <div className="frc-grain absolute inset-0 pointer-events-none" />
      <div className="frc-card absolute left-1/2 top-1/2 w-[120px] h-[160px]">
        <div className={`absolute inset-0 rounded-xl bg-[#f3e9d2] border-4 ${won ? 'border-[#f6c445] shadow-[0_0_0_2px_#b8860b,0_16px_30px_rgba(0,0,0,.6)]' : 'border-[#1b2340] shadow-[0_16px_30px_rgba(0,0,0,.6)]'} flex flex-col items-center pt-2 overflow-hidden`}>
          {won && <div className="frc-shine absolute inset-0" />}
          <div className="text-[7px] font-black uppercase tracking-[0.3em] text-[#1b2340]/60">{kicker}</div>
          <div className="relative w-20 h-20 mt-1">
            <Image src={icon} alt="" fill sizes="80px" className="object-contain" />
          </div>
          <div className={`text-[18px] font-black uppercase leading-none tracking-tight mt-1 ${won ? 'text-[#ff4b4b]' : 'text-[#1b2340]'}`} style={{ textShadow: won ? '1px 1px 0 #1b2340' : undefined }}>
            {word}
          </div>
          {won && (
            <div className="absolute bottom-2 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="frc-pop w-3.5 h-3.5 bg-[#f6c445]" style={{ animationDelay: `${1 + i * 0.15}s`, clipPath: STAR }} />
              ))}
            </div>
          )}
        </div>
      </div>
      {celebrate && Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="frc-coin absolute left-1/2 bottom-4 w-4 h-4 rounded-full bg-[#f6c445] border-2 border-[#b8860b]" style={{ ['--x' as string]: `${(i - 6) * 26}px`, animationDelay: `${COINS_AT_MS / 1000 + i * 0.05}s` }} />
      ))}
      {celebrate ? (
        <CountUp points={points} />
      ) : (
        <div className="frc-sub absolute right-4 top-1/2 -translate-y-1/2 text-right" style={{ animationDelay: '1s' }}>
          <div className="text-[36px] font-black tabular-nums leading-none text-[#f3e9d2]/90">+{points}</div>
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#f3e9d2]/50 mt-1">points</div>
        </div>
      )}
    </div>
  );
}

function CountUp({ points }: { points: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = setTimeout(() => {
      playCelebrationSound();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 700);
        setN(Math.round(points * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, COUNT_AT_MS);
    return () => clearTimeout(t0);
  }, [points]);
  return (
    <div className="frc-sub absolute right-4 top-1/2 -translate-y-1/2 text-[44px] font-black tabular-nums text-[#f6c445]" style={{ animationDelay: `${COUNT_AT_MS / 1000}s`, textShadow: '3px 3px 0 #8a6508' }}>
      +{n}
    </div>
  );
}

const CSS = `
.frc-grain{background-image:radial-gradient(rgba(0,0,0,.18) 1px,transparent 1.2px);background-size:4px 4px;opacity:.45;mix-blend-mode:multiply}
@keyframes frc-fade{from{opacity:0}to{opacity:1}}
@keyframes frc-spin{to{transform:translate(-50%,-50%) rotate(360deg)}}
.frc-rays{background:repeating-conic-gradient(from 0deg,#f6c445 0 10deg,transparent 10deg 20deg);opacity:.15;animation:frc-spin 24s linear infinite,frc-fade .8s both}
.frc-card{animation:frc-card 1s cubic-bezier(.2,1.3,.4,1) both}
@keyframes frc-card{from{transform:translate(-90%,60%) rotate(25deg) scale(.4);opacity:0}to{transform:translate(-90%,-50%) rotate(-4deg) scale(1);opacity:1}}
.frc-shine{background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.7) 50%,transparent 65%);animation:frc-shine 1.2s 1s both}
@keyframes frc-shine{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.frc-pop{animation:frc-pop .4s cubic-bezier(.2,1.6,.4,1) both}
.frc-sub{animation:frc-pop .45s cubic-bezier(.2,1.4,.4,1) both}
@keyframes frc-pop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
.frc-coin{animation:frc-coin .9s cubic-bezier(.3,0,.2,1) both;box-shadow:0 2px 0 #8a6508}
@keyframes frc-coin{from{transform:translate(-50%,0) scale(.4);opacity:0}30%{opacity:1}to{transform:translate(calc(-50% + var(--x)),-190px) scale(1);opacity:0}}
@media (prefers-reduced-motion:reduce){.frc-card,.frc-coin,.frc-pop,.frc-sub,.frc-shine,.frc-rays{animation-duration:.01s!important;animation-delay:0s!important}}
`;
