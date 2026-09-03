'use client';

/**
 * ReviewNav — the post-game review's move controls, shared by /play's
 * in-page review and components/shared/GameReview (bout review, /review).
 * ONE implementation so the two can't drift.
 *
 * Big 3D step buttons (ActionButton white / blue — green stays reserved for
 * Play Again), bold mono move label with the classification badge, a small
 * ghosted "jump to end", and the branch-aware states: amber "Trying:" label
 * that keeps its tail visible, "Back to game" in place of jump-to-end, prev at
 * the branch root exits the branch (the caller decides via onPrev).
 * ArrowLeft/ArrowRight step the review while this is mounted (ignored while
 * typing in a field).
 *
 * Module-level component on purpose: a component defined inside a parent's
 * render gets a fresh identity every render and React remounts the buttons on
 * each tap, which swallowed taps on /play (its #1 rage-clicked element).
 */

import { useEffect, useRef, useState } from 'react';
import { ActionButton } from '@/components/ui/ActionButton';
import { BADGE_SPECS } from '@/lib/review/move-badges';
import type { MoveClassification } from '@/lib/game-eval';

export interface ReviewNavProps {
  /** Mainline label, e.g. "Start" or "12... Nf6". */
  moveLabel: string;
  /** Classification badge for the shown mainline move (null = none). */
  classification?: MoveClassification | null;
  atStart: boolean;
  atEnd: boolean;
  /** "Try it" branch state (all false/empty when not branching). */
  inBranch: boolean;
  branchLineSan: string;
  branchAtTip: boolean;
  onPrev: () => void;
  onNext: () => void;
  onJumpToEnd: () => void;
  onExitBranch: () => void;
  /** Background behind the leading ellipsis of a clipped branch label. */
  ellipsisBgClass?: string;
}

// Big 3D step buttons (the Let's Play style) — the review's main controls
// should feel like the rest of the app, not a media player.
const stepBtn = 'flex-1 min-w-0 h-14 !text-2xl leading-none disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 select-none touch-manipulation';
const endBtn =
  'w-11 h-11 rounded-xl bg-chess-surface border border-chess-disabled text-chess-text font-bold text-sm flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform select-none touch-manipulation ml-4 !w-9 !h-9 text-xs text-chess-text-faint';

export function ReviewNav({
  moveLabel,
  classification = null,
  atStart,
  atEnd,
  inBranch,
  branchLineSan,
  branchAtTip,
  onPrev,
  onNext,
  onJumpToEnd,
  onExitBranch,
  ellipsisBgClass = 'bg-chess-page',
}: ReviewNavProps) {
  // Keyboard: ArrowLeft/ArrowRight step the review (branch-aware) while the
  // nav is mounted. Refs so the listener registers once.
  const keysRef = useRef({ prev: onPrev, next: onNext });
  keysRef.current = { prev: onPrev, next: onNext };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); keysRef.current.prev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); keysRef.current.next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The branch label keeps its TAIL visible (latest moves) and shows a leading
  // ellipsis only when the line really overflows the space it has.
  const branchLabelRef = useRef<HTMLSpanElement | null>(null);
  const branchLabelTextRef = useRef<HTMLSpanElement | null>(null);
  const [branchLabelClipped, setBranchLabelClipped] = useState(false);
  useEffect(() => {
    const outer = branchLabelRef.current;
    const inner = branchLabelTextRef.current;
    if (!outer || !inner) { setBranchLabelClipped(false); return; }
    const measure = () => setBranchLabelClipped(inner.offsetWidth > outer.clientWidth + 1);
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(outer);
    return () => ro?.disconnect();
  }, [branchLineSan]);

  // Bounded so a very long line stays cheap (clipped from the front, see above).
  const branchLabel = branchLineSan.length > 80 ? branchLineSan.slice(-80) : branchLineSan;

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <ActionButton
        color="white"
        size="md"
        aria-label="Previous move"
        onClick={onPrev}
        disabled={!inBranch && atStart}
        className={stepBtn}
      >
        &#9664;
      </ActionButton>
      {inBranch ? (
        <span
          ref={branchLabelRef}
          className="relative flex-1 min-w-0 max-w-[16rem] h-11 flex items-center justify-end overflow-hidden text-[11px] font-mono font-semibold text-amber-700"
          title={branchLineSan}
        >
          {branchLabelClipped && (
            <span aria-hidden className={`absolute left-0 top-0 h-full flex items-center pr-1 ${ellipsisBgClass}`}>&#8230;</span>
          )}
          <span ref={branchLabelTextRef} className="whitespace-nowrap flex-shrink-0">
            Trying: {branchLabel}
          </span>
        </span>
      ) : (
        <span className="text-sm text-chess-text font-bold min-w-[92px] text-center font-mono inline-flex items-center justify-center gap-1">
          {moveLabel}
          {classification && (
            <span
              className="inline-flex items-center justify-center rounded-full px-1.5 h-4 text-[9px] font-black not-italic"
              style={{
                backgroundColor: BADGE_SPECS[classification].circle,
                color: BADGE_SPECS[classification].text,
              }}
              title={BADGE_SPECS[classification].label}
            >
              {BADGE_SPECS[classification].glyph}
            </span>
          )}
        </span>
      )}
      <ActionButton
        color="blue"
        size="md"
        aria-label="Next move"
        onClick={onNext}
        disabled={inBranch ? branchAtTip : atEnd}
        className={stepBtn}
      >
        &#9654;
      </ActionButton>
      {inBranch ? (
        <button
          type="button"
          aria-label="Back to game"
          onClick={onExitBranch}
          className="ml-2 min-h-[44px] px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold whitespace-nowrap flex items-center justify-center active:scale-95 transition-transform select-none touch-manipulation"
        >
          Back to game
        </button>
      ) : (
        <button
          type="button"
          aria-label="Jump to end"
          onClick={onJumpToEnd}
          disabled={atEnd}
          className={endBtn}
        >
          &#9655;|
        </button>
      )}
    </div>
  );
}
