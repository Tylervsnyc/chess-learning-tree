'use client';

import { useEffect, useState } from 'react';
import RookieCampfire from '@/components/shared/RookieCampfire';
import type { StreakData } from '@/lib/streak-client';

/**
 * StreakHero — THE streak surface. Rookie catches fire when your streak is
 * alive, goes cold when it isn't.
 *
 * Extracted from app/profile 2026-08-25 when Chess Boxing needed a streak
 * (Tyler: "look at chesspath.app streak animations, I want to use the same
 * rules for chess boxing, same animation"). "Same rules" is the whole point,
 * so this is one component rather than a second implementation that agrees
 * today and drifts next month — the blaze curve, the lit/cold condition, the
 * copy, and the daily line all live here and nowhere else.
 *
 * The rules, unchanged from the web profile:
 *   - LIT only when the streak is loaded AND already kept today. Not "you have
 *     a streak" — the fire being out is what an unkept day should feel like.
 *   - blaze = current / 60, floored at 0.3 and capped at 1, so day one still
 *     burns and a 200-day streak isn't a bonfire.
 *   - the kept-today line is daily-stable: same line all day, different
 *     tomorrow, so it never flickers on re-render.
 *
 * `tone` only changes the frame around it. The fire is identical everywhere.
 */

// Lines shown when the streak is kept today.
const STREAK_KEPT_LINES = [
  'You kept the fire going today.',
  "Fire's still going. Nice work.",
  'Another log on the fire.',
  "Today's done — the fire stays lit.",
  "You showed up. The fire's happy.",
  'Still burning bright. See you tomorrow.',
  'One more day, one more flame.',
  'The fire lives another day.',
  "Streak's alive and the fire's roaring.",
  'You fed the fire today. Good.',
];

export function pickDailyKeptLine(): string {
  const d = new Date();
  const dayKey = d.getFullYear() * 1000 + d.getMonth() * 31 + d.getDate();
  return STREAK_KEPT_LINES[dayKey % STREAK_KEPT_LINES.length];
}

export interface StreakHeroProps {
  streak: StreakData | null;
  /**
   * 'web'  — the roomy card on /profile.
   * 'compact' — Chess Boxing's corner: same fire, smaller frame, no footer.
   */
  tone?: 'web' | 'compact';
  /** What counts toward the streak. Web spells it out; the app has less room. */
  ruleLine?: string;
}

export function StreakHero({
  streak,
  tone = 'web',
  ruleLine = 'A lesson, a game, or a puzzle — anything counts.',
}: StreakHeroProps) {
  const current = streak?.current ?? 0;
  const longest = streak?.longest ?? 0;
  const done = streak?.completedToday ?? false;
  const ready = streak !== null;

  // The line is picked once per mount so it can't change on re-render.
  const [keptLine] = useState(pickDailyKeptLine);

  // The flame animates and is mounted client-side only — server-rendering it
  // caused a hydration mismatch, and one static frame of a fire is worth
  // nothing anyway.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lit = ready && done;
  const blaze = Math.max(0.3, Math.min(1, current / 60));
  const blockSize = tone === 'web' ? 14 : 11;

  const message = !ready
    ? 'Loading your streak…'
    : done
      ? keptLine
      : current > 0
        ? "Don't let the fire go out — do anything today."
        : 'Do anything today to spark your streak.';

  return (
    <div
      className={
        tone === 'web'
          ? `relative overflow-hidden rounded-3xl p-5 shadow-sm border transition-colors text-white ${
              done
                ? 'border-chess-orange/40 bg-gradient-to-b from-[#2A3C45] via-[#33373f] to-[#3a2e26]'
                : 'border-slate-600/40 bg-gradient-to-b from-slate-700 to-slate-800'
            }`
          : `relative overflow-hidden rounded-2xl px-3.5 py-3 border transition-colors text-white ${
              done
                ? 'border-chess-orange/50 bg-gradient-to-b from-[#2A3C45] via-[#33373f] to-[#3a2e26]'
                : 'border-slate-600/50 bg-gradient-to-b from-slate-700 to-slate-800'
            }`
      }
    >
      <div className={tone === 'web' ? 'flex items-center gap-4' : 'flex items-center gap-3'}>
        <div
          className="shrink-0 flex items-end justify-center"
          style={{ width: tone === 'web' ? 88 : 66, minHeight: tone === 'web' ? 96 : 76 }}
        >
          {mounted && <RookieCampfire blockSize={blockSize} active={lit} blaze={blaze} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-black text-white tabular-nums leading-none ${
                tone === 'web' ? 'text-5xl' : 'text-4xl'
              }`}
            >
              {ready ? current : '–'}
            </span>
            <span className={`font-bold text-white/55 ${tone === 'web' ? 'text-base' : 'text-sm'}`}>
              day{current === 1 ? '' : 's'}
            </span>
            {tone === 'compact' && (
              <span className="ml-auto text-[10px] font-bold text-amber-300 whitespace-nowrap">
                Best {ready ? longest : '–'}
              </span>
            )}
          </div>
          <p
            className={`font-semibold text-white/70 leading-snug ${
              tone === 'web' ? 'text-sm mt-1.5' : 'text-[11.5px] mt-1'
            }`}
          >
            {message}
          </p>
        </div>
      </div>

      {tone === 'web' && (
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="font-semibold text-white/45">{ruleLine}</span>
          <span className="font-bold text-amber-300 whitespace-nowrap ml-2">
            Best {ready ? longest : '–'}
          </span>
        </div>
      )}
    </div>
  );
}
