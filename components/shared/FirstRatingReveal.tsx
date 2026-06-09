'use client';

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { BreathingRook } from '@/components/ui/BreathingRook';
import { chessPathTier, projectChessPathElo } from '@/lib/elo/chess-path-elo';
import { EloEvents } from '@/lib/analytics/posthog';

/**
 * FirstRatingReveal — the one-time ceremony a brand-new (logged-out) user sees
 * when they earn their first Chess Path ELO. The number reveals dramatically,
 * then a forward-looking projection pops in day-by-day ("here's where you head
 * if you keep showing up"), then a soft signup ask. Honest: the projection is
 * dotted + "could hit", never a promise.
 */
export function FirstRatingReveal({
  rating,
  signupHref,
  onKeepPlaying,
}: {
  rating: number;
  signupHref: string;
  onKeepPlaying: () => void;
}) {
  const projection = projectChessPathElo(rating, 5);
  const projectedEnd = projection[projection.length - 1];

  const [display, setDisplay] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [punch, setPunch] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true);
      const DURATION = 1300;
      let start: number | null = null;
      const tick = (ts: number) => {
        if (start === null) start = ts;
        const pr = Math.min(1, (ts - start) / DURATION);
        const eased = 1 - Math.pow(1 - pr, 3);
        setDisplay(Math.round(rating * eased));
        if (pr < 1) rafRef.current = requestAnimationFrame(tick);
        else {
          setPunch(true);
          confetti({ particleCount: 90, spread: 75, origin: { x: 0.5, y: 0.4 }, colors: ['#FFD43B', '#FFAA00', '#1CB0F6', '#FFFFFF'], gravity: 1.1, ticks: 220 });
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 550);
    return () => { clearTimeout(t); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [rating]);

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white px-6 pt-6 pb-6 shadow-xl">
      <style>{`
        @keyframes frrPunch { 0%{transform:scale(1)} 45%{transform:scale(1.14)} 100%{transform:scale(1)} }
        @keyframes frrHalo { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.8;transform:scale(1.08)} }
        @keyframes frrDayPop { 0%{transform:translate(-50%,-50%) scale(0)} 60%{transform:translate(-50%,-50%) scale(1.25)} 100%{transform:translate(-50%,-50%) scale(1)} }
      `}</style>

      <div className="flex flex-col items-center text-center">
        <BreathingRook size="md" mood="happy" animate />
        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-chess-blue">
          Your first chess rating
        </p>
      </div>

      {/* Number reveal */}
      <div className="relative mt-2 flex flex-col items-center">
        <div className="pointer-events-none absolute -z-0 h-24 w-24 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,200,0,0.35) 0%, rgba(255,200,0,0) 70%)', animation: revealed ? 'frrHalo 2.4s ease-in-out infinite' : undefined, opacity: revealed ? undefined : 0 }} />
        <span className="relative text-6xl font-black tabular-nums leading-none text-chess-text"
          style={{ animation: punch ? 'frrPunch .4s ease-out' : undefined }}>
          {revealed ? display.toLocaleString() : '—'}
        </span>
        <span className="mt-2 inline-flex items-center rounded-full bg-chess-blue/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-chess-blue">
          {chessPathTier(rating)}
        </span>
      </div>

      {/* Forward projection — builds day by day */}
      <div className="mt-4 rounded-2xl border border-chess-blue/15 bg-gradient-to-b from-chess-blue/[0.06] to-white p-3">
        <span className="text-[11px] font-black uppercase tracking-wide text-chess-blue">
          Where you&apos;re headed
        </span>
        <div className="mt-2">
          <ProjectionGraph projection={projection} />
        </div>
      </div>

      <p className="mt-3 text-center text-xs font-bold text-chess-text-muted">
        Do a lesson a day and you could hit <span className="text-chess-text">~{projectedEnd}</span> in 5 days.
      </p>

      <div className="mt-3 rounded-2xl bg-[#f0f4f8] px-4 py-3 text-center">
        <p className="text-[13.5px] font-medium leading-relaxed text-chess-text">
          That&apos;s the first rating I&apos;ve ever given anyone. Come back tomorrow — I want to see how high we get.
        </p>
      </div>

      <a href={signupHref}
        onClick={() => EloEvents.signupClicked('first_reveal', rating)}
        className="mt-4 block w-full rounded-2xl py-4 text-center text-base font-black text-white transition-all active:translate-y-0.5"
        style={{ background: 'linear-gradient(135deg,#FFD43B 0%,#FFAA00 100%)', boxShadow: '0 4px 0 #B8860B' }}>
        Save your rating — Sign up
      </a>
      <button onClick={() => { EloEvents.keepPlaying('first_reveal'); onKeepPlaying() }} className="mt-2 w-full py-2 text-sm font-bold text-chess-text-muted">
        Keep playing
      </button>
    </div>
  );
}

// Pops in one projected day at a time, climbing to the last day.
function ProjectionGraph({ projection }: { projection: number[] }) {
  const [revealed, setRevealed] = useState(1);
  useEffect(() => {
    setRevealed(1);
    let n = 1;
    const id = setInterval(() => {
      n += 1;
      setRevealed(n);
      if (n >= projection.length) clearInterval(id);
    }, 480);
    return () => clearInterval(id);
  }, [projection.length]);

  const W = 100, H = 46, PAD = 9, X0 = 9, X1 = W - 9;
  const lo = Math.min(...projection), hi = Math.max(...projection), span = Math.max(1, hi - lo);
  const coords = projection.map((v, i) => ({
    x: X0 + (i / (projection.length - 1)) * (X1 - X0),
    y: PAD + (1 - (v - lo) / span) * (H - PAD * 2),
  }));
  const path = coords.slice(0, revealed).map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');

  return (
    <div className="relative h-28 w-full">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <path d={path} fill="none" stroke="var(--color-chess-blue)" strokeWidth={2.5}
          strokeLinecap="round" strokeDasharray="1.5 2.5" vectorEffect="non-scaling-stroke" opacity={0.85} />
      </svg>
      {coords.map((c, i) => {
        if (i >= revealed) return null;
        const isToday = i === 0;
        const isNewest = i === revealed - 1;
        return (
          <div key={i}>
            <div
              className={`pointer-events-none absolute rounded-full ${isToday ? 'h-3 w-3 bg-chess-blue ring-2 ring-white' : 'h-2.5 w-2.5'}`}
              style={{
                left: `${(c.x / W) * 100}%`, top: `${(c.y / H) * 100}%`, transform: 'translate(-50%,-50%)',
                background: isToday ? undefined : 'var(--color-chess-blue)', opacity: isToday ? 1 : 0.7,
                boxShadow: isToday ? '0 0 0 5px rgba(28,176,246,0.18)' : (isNewest ? '0 0 0 5px rgba(255,200,0,0.25)' : undefined),
                animation: isNewest && !isToday ? 'frrDayPop .4s ease-out' : undefined,
              }}
            />
            <div className="pointer-events-none absolute text-[8.5px] font-black uppercase tracking-wide"
              style={{ left: `${(c.x / W) * 100}%`, bottom: '-1px', transform: 'translateX(-50%)', color: isToday ? 'var(--color-chess-blue)' : '#94a3b8' }}>
              Day {i + 1}
            </div>
            {isNewest && (
              <div className="pointer-events-none absolute text-[10px] font-black tabular-nums text-chess-text"
                style={{ left: `${(c.x / W) * 100}%`, top: `${(c.y / H) * 100}%`, transform: 'translate(-50%,-180%)' }}>
                {projection[i]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FirstRatingReveal;
