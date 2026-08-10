'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AchievementUnlock } from '@/lib/achievements/types';
import { BELT_BAND_LABELS } from '@/lib/achievements/types';
import { getAchievementDef } from '@/lib/achievements/catalog';
import { AchievementTile, BAND_COLORS } from './BeltBadge';
import { fireConfetti } from '@/lib/confetti';
import { playWoodClap, playBoxingBell, playCelebrationSound, playErrorSound } from '@/lib/sounds';

/**
 * Plays a queue of fresh unlocks over the result screen, one at a time,
 * biggest moment last. Three sizes (docs/chess-boxing-achievements-plan.md §7):
 *
 *   s — "the nod": bottom toast, wood clap (shame gets the error sting —
 *       the roast IS the celebration), auto-dismisses.
 *   m — "new belt": centered card over a dark backdrop, one bell, confetti.
 *   l — "title fight": full-screen gold ceremony, bell + celebration sound,
 *       stays until tapped.
 *
 * Renders as an overlay layer (z-[110], above the result modals at z-[100])
 * so it NEVER adds rows to the no-scroll result cards. Marks everything seen
 * when the queue drains. Everything is tappable-through-early; nobody gets
 * trapped in a celebration chain (momentum over perfection).
 */
export default function AchievementUnlockOverlay({
  unlocks,
  onDone,
}: {
  unlocks: AchievementUnlock[];
  onDone?: () => void;
}) {
  // Cap the ceremony at 3 medals — the 3 biggest, played small first, big
  // finish. The rest land quietly in the trophy case (never trap someone in
  // a celebration chain — momentum over perfection).
  const orderedRef = useRef<AchievementUnlock[]>(
    [...unlocks].sort((a, b) => sizeRank(b.size) - sizeRank(a.size)).slice(0, 3).reverse(),
  );
  const overflowRef = useRef(Math.max(0, unlocks.length - 3));
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  const current = orderedRef.current[index] ?? null;

  const advance = useCallback(() => {
    setLeaving(false);
    setIndex((i) => i + 1);
  }, []);

  // Sound + confetti per step.
  useEffect(() => {
    if (!current) return;
    if (current.category === 'shame') {
      playErrorSound();
      return;
    }
    if (current.size === 's') {
      playWoodClap();
      if (!reducedMotion) fireConfetti({ particleCount: 30, spread: 55, origin: { y: 0.8 } });
    } else if (current.size === 'm') {
      playBoxingBell();
      if (!reducedMotion) fireConfetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } else {
      playBoxingBell();
      playCelebrationSound();
      if (!reducedMotion) {
        const colors = ['#FFD43B', '#FFAA00', '#1CB0F6', '#FFFFFF'];
        fireConfetti({ particleCount: 120, spread: 90, origin: { y: 0.55 }, colors });
        setTimeout(() => fireConfetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, colors }), 450);
      }
    }
  }, [current, reducedMotion]);

  // S and M auto-advance; L waits for the tap.
  useEffect(() => {
    if (!current || current.size === 'l') return;
    const showMs = current.size === 's' ? 2000 : 2800;
    const t1 = setTimeout(() => setLeaving(true), showMs);
    const t2 = setTimeout(advance, showMs + 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [current, advance]);

  // Queue drained → mark the PLAYED ones seen (overflow stays unseen so the
  // trophy case shows its "new" dot), then hand back to the result screen.
  useEffect(() => {
    if (current || doneRef.current) return;
    doneRef.current = true;
    const ids = orderedRef.current.map((u) => u.id);
    if (ids.length > 0) {
      fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seenIds: ids }),
      }).catch(() => {});
    }
    onDone?.();
  }, [current, onDone]);

  // Overflow note rides the last card/toast instead of its own step.
  const overflowNote =
    overflowRef.current > 0 && index === orderedRef.current.length - 1
      ? `+${overflowRef.current} more in your trophy case`
      : null;

  if (!current) return null;
  const c = BAND_COLORS[current.band];
  const tierLabel = tierLine(current);

  // ── S — bottom toast ───────────────────────────────────────────────────────
  if (current.size === 's') {
    return (
      <div className="fixed inset-x-0 bottom-0 z-[110] flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none">
        <style>{achKeyframes}</style>
        <button
          type="button"
          onClick={() => {
            setLeaving(true);
            setTimeout(advance, 150);
          }}
          className="pointer-events-auto w-full max-w-xs rounded-2xl bg-chess-surface border border-slate-200 shadow-2xl px-3 py-2.5 flex items-center gap-3 text-left"
          style={{
            animation: reducedMotion
              ? undefined
              : leaving
                ? 'achToastOut .25s ease-in forwards'
                : 'achToastIn .35s cubic-bezier(.2,.9,.3,1.2)',
            opacity: reducedMotion && leaving ? 0 : undefined,
          }}
        >
          <AchievementTile icon={current.icon} band={current.band} size={44} />
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: c.text }}>
              {current.category === 'shame' ? 'Achievement… unlocked' : `Achievement ${current.kind}`}
              {tierLabel ? ` · ${tierLabel}` : ''}
            </div>
            <div className="text-sm font-black text-chess-text truncate">{current.name}</div>
            <div className="text-[11px] font-semibold text-chess-text-muted leading-snug line-clamp-2">
              {current.description}
            </div>
            {overflowNote && (
              <div className="text-[10px] font-bold text-chess-text-faint mt-0.5">{overflowNote}</div>
            )}
          </div>
        </button>
      </div>
    );
  }

  // ── M and L — centered over a backdrop ────────────────────────────────────
  const isL = current.size === 'l';
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-6"
      style={{ background: isL ? 'rgba(10,14,26,0.88)' : 'rgba(10,14,26,0.6)' }}
      onClick={() => {
        setLeaving(true);
        setTimeout(advance, 150);
      }}
    >
      <style>{achKeyframes}</style>
      <div
        className="w-full max-w-xs rounded-3xl bg-chess-surface shadow-2xl px-5 py-6 flex flex-col items-center gap-3 text-center"
        style={{
          animation: reducedMotion ? undefined : 'achCardIn .5s cubic-bezier(.2,.9,.3,1.2)',
          boxShadow: isL ? `0 0 0 3px ${c.ring}, 0 24px 60px rgba(0,0,0,0.45)` : undefined,
        }}
      >
        <div
          className="text-[10px] font-black uppercase tracking-[0.25em]"
          style={{ color: c.text }}
        >
          {isL ? 'Title fight' : 'Achievement'} {current.kind === 'upgraded' ? 'upgraded' : 'unlocked'}
        </div>
        <div style={{ animation: reducedMotion ? undefined : 'achPunch .6s cubic-bezier(.2,.9,.3,1.4) .1s both' }}>
          <AchievementTile
            icon={current.icon}
            band={current.band}
            size={isL ? 96 : 72}
            shimmer={current.band === 'undisputed'}
          />
        </div>
        <div>
          <div className={`font-black text-chess-text leading-tight ${isL ? 'text-2xl' : 'text-lg'}`}>
            {current.name}
          </div>
          {tierLabel && (
            <div
              className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide"
              style={{ background: c.bg, color: c.text }}
            >
              {tierLabel}
            </div>
          )}
        </div>
        <div className="w-full rounded-xl bg-chess-page px-3 py-2 text-xs font-semibold text-chess-text leading-snug">
          {current.description}
        </div>
        <div className="text-[11px] font-bold text-chess-text-faint">
          {overflowNote ? `${overflowNote} · ` : ''}
          {isL ? 'Tap to continue' : 'Tap to skip'}
        </div>
      </div>
    </div>
  );
}

function sizeRank(s: 's' | 'm' | 'l'): number {
  return s === 's' ? 0 : s === 'm' ? 1 : 2;
}

function tierLine(u: AchievementUnlock): string | null {
  if (u.tier <= 0) return null;
  if (u.category === 'shame') return null;
  const def = getAchievementDef(u.id);
  const band = BELT_BAND_LABELS[u.band];
  // Level-tiered reads "Champion · Level 8"; ladders read "Contender · Tier II";
  // binary medals show their rarity band alone (amateur binaries show nothing).
  if (def?.levelTiered) return `${band} · Level ${u.tier}`;
  if (def?.thresholds && def.thresholds.length > 1) {
    const roman = ['I', 'II', 'III', 'IV', 'V'][Math.min(4, u.tier - 1)];
    return `${band} · Tier ${roman}`;
  }
  return u.band === 'amateur' ? null : band;
}

const achKeyframes = `
@keyframes achToastIn { 0% { opacity:0; transform: translateY(24px);} 100% { opacity:1; transform:none;} }
@keyframes achToastOut { 0% { opacity:1;} 100% { opacity:0; transform: translateY(12px);} }
@keyframes achCardIn { 0% { opacity:0; transform: scale(.7) translateY(16px);} 60% { opacity:1; transform: scale(1.05);} 100% { transform: scale(1);} }
@keyframes achPunch { 0% { transform: scale(.3); opacity:0;} 70% { transform: scale(1.15); opacity:1;} 100% { transform: scale(1);} }
@keyframes achShimmer { 0% { background-position: 200% 0;} 100% { background-position: -50% 0;} }
`;
