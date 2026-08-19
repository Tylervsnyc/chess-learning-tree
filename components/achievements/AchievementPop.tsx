'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * AchievementPop — THE shared achievement pop-up.
 *
 * Lives byte-identical in two repos (Chess Boxing = chess-learning-tree,
 * Rookie's Revenge = rookies-run) at components/achievements/AchievementPop.tsx.
 * It imports nothing but React on purpose: each app wraps it with a thin
 * adapter that maps its own achievement model onto `PopItem` and supplies the
 * sound / confetti / haptic side effects through `fx`. If you change this
 * file, copy it to the other repo — the look and the timing are the contract.
 *
 * Three sizes, one queue, biggest moment last:
 *   s — "the nod": edge toast (top or bottom), auto-dismisses.
 *   m — "new belt": centered card over a dark backdrop, auto-dismisses.
 *   l — "title fight": full ceremony, stays until tapped.
 *
 * Plays at most `maxPlayed` items (the biggest ones, ordered small → big);
 * the rest are reported in an overflow note so nobody is trapped in a
 * celebration chain (momentum over perfection). Everything is tappable
 * through early. Honors prefers-reduced-motion.
 */

export type PopSize = 's' | 'm' | 'l';

export interface PopAccent {
  /** Ring / glow color. */
  ring: string;
  /** Pill + tile background. */
  bg: string;
  /** Eyebrow + pill text color. */
  text: string;
}

export interface PopItem {
  id: string;
  name: string;
  /** Rookie's line — the description IS the reward. */
  line: string;
  /** Tile content: an emoji string or any node (svg glyph, image). */
  icon: ReactNode;
  /** Tiny uppercase label above the name. Defaults by size/mood. */
  eyebrow?: string;
  /** Optional rank pill under the name ("Champion · Level 8", "Tier II"). */
  tierLabel?: string | null;
  accent: PopAccent;
  size: PopSize;
  /**
   * proud = the normal celebration. roast = a Hall-of-Shame style medal:
   * no confetti by default, the adapter plays a sting instead of a clap.
   */
  mood?: 'proud' | 'roast';
  /** Shimmer sweep across the tile (reserved for the top rarity). */
  shimmer?: boolean;
}

export interface PopFx {
  /** Fired once when an item takes the stage — play sound/confetti/haptic here. */
  onShow?: (item: PopItem, ctx: { reducedMotion: boolean }) => void;
}

export interface AchievementPopProps {
  items: PopItem[];
  fx?: PopFx;
  /** Queue drained (or skipped through). Receives the ids that were PLAYED. */
  onDone?: (playedIds: string[]) => void;
  /** Max items played on screen; the rest roll into the overflow note. Default 3. */
  maxPlayed?: number;
  /** Where size-s toasts slide in from. Default 'bottom'. */
  toastEdge?: 'top' | 'bottom';
  /** Overflow note text; receives the hidden count. */
  overflowLabel?: (n: number) => string;
  /** Stacking context — z-index for the overlay layer. Default 110. */
  zIndex?: number;
  /** Display durations for the auto-advancing sizes (ms). */
  durations?: { s?: number; m?: number };
}

const SIZE_RANK: Record<PopSize, number> = { s: 0, m: 1, l: 2 };

export default function AchievementPop({
  items,
  fx,
  onDone,
  maxPlayed = 3,
  toastEdge = 'bottom',
  overflowLabel = (n) => `+${n} more in your trophy case`,
  zIndex = 110,
  durations,
}: AchievementPopProps) {
  // Order once, on mount: biggest `maxPlayed` items, played small first so the
  // ceremony builds. Refs so re-renders of the parent can't reshuffle the show.
  const orderedRef = useRef<PopItem[]>(
    [...items].sort((a, b) => SIZE_RANK[b.size] - SIZE_RANK[a.size]).slice(0, maxPlayed).reverse(),
  );
  const overflowRef = useRef(Math.max(0, items.length - maxPlayed));
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

  const skip = useCallback(() => {
    setLeaving(true);
    setTimeout(advance, 150);
  }, [advance]);

  // Side effects per step — delegated to the app.
  useEffect(() => {
    if (!current) return;
    fx?.onShow?.(current, { reducedMotion });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // S and M auto-advance; L waits for the tap.
  useEffect(() => {
    if (!current || current.size === 'l') return;
    const showMs = current.size === 's' ? (durations?.s ?? 2200) : (durations?.m ?? 2800);
    const t1 = setTimeout(() => setLeaving(true), showMs);
    const t2 = setTimeout(advance, showMs + 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [current, advance, durations]);

  // Queue drained → report what was played and hand control back.
  useEffect(() => {
    if (current || doneRef.current) return;
    doneRef.current = true;
    onDone?.(orderedRef.current.map((u) => u.id));
  }, [current, onDone]);

  if (!current) return null;

  const isLast = index === orderedRef.current.length - 1;
  const overflowNote = overflowRef.current > 0 && isLast ? overflowLabel(overflowRef.current) : null;
  const c = current.accent;
  const roast = current.mood === 'roast';
  const eyebrow =
    current.eyebrow ??
    (roast ? 'Achievement… unlocked' : current.size === 'l' ? 'Title fight unlocked' : 'Achievement unlocked');
  const anim = (name: string) => (reducedMotion ? undefined : name);

  // ── S — edge toast ─────────────────────────────────────────────────────────
  if (current.size === 's') {
    const top = toastEdge === 'top';
    return (
      <div
        className={`fixed inset-x-0 flex justify-center px-4 pointer-events-none ${
          top ? 'top-0 pt-[max(0.75rem,env(safe-area-inset-top))]' : 'bottom-0 pb-[max(1rem,env(safe-area-inset-bottom))]'
        }`}
        style={{ zIndex }}
      >
        <style>{popKeyframes}</style>
        <button
          type="button"
          onClick={skip}
          aria-live="polite"
          className="pointer-events-auto w-full max-w-xs rounded-2xl bg-chess-surface border border-slate-200 shadow-2xl px-3 py-2.5 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
          style={{
            animation: anim(
              leaving
                ? `${top ? 'popToastOutTop' : 'popToastOut'} .25s ease-in forwards`
                : `${top ? 'popToastInTop' : 'popToastIn'} .4s cubic-bezier(.2,.9,.3,1.2)`,
            ),
            opacity: reducedMotion && leaving ? 0 : undefined,
            boxShadow: `0 0 0 2px ${c.ring}22, 0 20px 40px rgba(0,0,0,0.25)`,
          }}
        >
          <PopTile icon={current.icon} accent={c} size={44} shimmer={current.shimmer} />
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wide" style={{ color: c.text }}>
              {eyebrow}
              {current.tierLabel ? ` · ${current.tierLabel}` : ''}
            </div>
            <div className="text-sm font-black text-chess-text truncate">{current.name}</div>
            <div className="text-[11px] font-semibold text-chess-text-muted leading-snug line-clamp-2">
              {current.line}
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
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{ zIndex, background: isL ? 'rgba(10,14,26,0.88)' : 'rgba(10,14,26,0.6)' }}
      onClick={skip}
      role="dialog"
      aria-live="polite"
    >
      <style>{popKeyframes}</style>
      {isL && !reducedMotion && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0 20deg, ${c.ring}14 20deg 40deg, transparent 40deg 60deg, ${c.ring}14 60deg 80deg, transparent 80deg 100deg, ${c.ring}14 100deg 120deg, transparent 120deg 140deg, ${c.ring}14 140deg 160deg, transparent 160deg 180deg, ${c.ring}14 180deg 200deg, transparent 200deg 220deg, ${c.ring}14 220deg 240deg, transparent 240deg 260deg, ${c.ring}14 260deg 280deg, transparent 280deg 300deg, ${c.ring}14 300deg 320deg, transparent 320deg 340deg, ${c.ring}14 340deg 360deg)`,
            animation: 'popRays 28s linear infinite',
            transformOrigin: '50% 50%',
            inset: '-50%',
          }}
        />
      )}
      <div
        className="relative w-full max-w-xs rounded-3xl bg-chess-surface shadow-2xl px-5 py-6 flex flex-col items-center gap-3 text-center"
        style={{
          animation: anim(leaving ? 'popCardOut .2s ease-in forwards' : 'popCardIn .5s cubic-bezier(.2,.9,.3,1.2)'),
          boxShadow: isL ? `0 0 0 3px ${c.ring}, 0 24px 60px rgba(0,0,0,0.45)` : undefined,
        }}
      >
        <div className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: c.text }}>
          {eyebrow}
        </div>
        <div style={{ animation: anim('popPunch .6s cubic-bezier(.2,.9,.3,1.4) .1s both') }}>
          <PopTile icon={current.icon} accent={c} size={isL ? 96 : 72} shimmer={current.shimmer} />
        </div>
        <div>
          <div className={`font-black text-chess-text leading-tight ${isL ? 'text-2xl' : 'text-lg'}`}>
            {current.name}
          </div>
          {current.tierLabel && (
            <div
              className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide"
              style={{ background: c.bg, color: c.text }}
            >
              {current.tierLabel}
            </div>
          )}
        </div>
        <div className="w-full rounded-xl bg-chess-page px-3 py-2 text-xs font-semibold text-chess-text leading-snug">
          {current.line}
        </div>
        <div className="text-[11px] font-bold text-chess-text-faint">
          {overflowNote ? `${overflowNote} · ` : ''}
          {isL ? 'Tap to continue' : 'Tap to skip'}
        </div>
      </div>
    </div>
  );
}

/** The round medal tile — ring + tinted disc + icon. Exported for trophy grids. */
export function PopTile({
  icon,
  accent,
  size = 56,
  locked = false,
  shimmer = false,
}: {
  icon: ReactNode;
  accent: PopAccent;
  size?: number;
  locked?: boolean;
  shimmer?: boolean;
}) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full select-none overflow-hidden"
      style={{
        width: size,
        height: size,
        background: locked ? '#F1F5F9' : accent.bg,
        boxShadow: locked ? 'inset 0 0 0 3px #E2E8F0' : `inset 0 0 0 3px ${accent.ring}`,
        fontSize: size * 0.45,
        lineHeight: 1,
      }}
      aria-hidden
    >
      {shimmer && !locked && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.75) 50%, transparent 70%)',
            backgroundSize: '250% 250%',
            animation: 'popShimmer 2.2s linear infinite',
          }}
        />
      )}
      <span className={`flex items-center justify-center ${locked ? 'grayscale opacity-40' : ''}`}>{icon}</span>
    </div>
  );
}

const popKeyframes = `
@keyframes popToastIn { 0% { opacity:0; transform: translateY(24px);} 100% { opacity:1; transform:none;} }
@keyframes popToastOut { 0% { opacity:1;} 100% { opacity:0; transform: translateY(12px);} }
@keyframes popToastInTop { 0% { opacity:0; transform: translateY(-24px);} 100% { opacity:1; transform:none;} }
@keyframes popToastOutTop { 0% { opacity:1;} 100% { opacity:0; transform: translateY(-12px);} }
@keyframes popCardIn { 0% { opacity:0; transform: scale(.7) translateY(16px);} 60% { opacity:1; transform: scale(1.05);} 100% { transform: scale(1);} }
@keyframes popCardOut { 0% { opacity:1; transform: scale(1);} 100% { opacity:0; transform: scale(.92);} }
@keyframes popPunch { 0% { transform: scale(.3); opacity:0;} 70% { transform: scale(1.15); opacity:1;} 100% { transform: scale(1);} }
@keyframes popShimmer { 0% { background-position: 200% 0;} 100% { background-position: -50% 0;} }
@keyframes popRays { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
`;
