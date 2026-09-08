'use client';

/**
 * ProLockedLine — the ONE "Rookie's words are for Pro" row (Gate B).
 *
 * Shown in place of Rookie's commentary wherever the server withheld it
 * (post-game review moves past the free window, workout-report misses 2+, the
 * coaching drawer teaser). A gold Pro pill + one short Rookie line; tapping
 * opens the paywall via the caller's `requirePro(...)`. Only ever rendered
 * behind FEATURE_FLAGS.PRO — the callers never mount it with the flag off.
 */

export const PRO_LOCKED_LINE = 'The rest of my notes are for Pro.';

export function ProPill({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
        tone === 'dark' ? 'bg-chess-gold/30 text-chess-gold' : 'bg-chess-gold/25 text-chess-gold-dark'
      }`}
    >
      Pro
    </span>
  );
}

export function ProLockedLine({
  onTap,
  tone = 'light',
  className = '',
}: {
  onTap: () => void;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onTap();
      }}
      className={`flex w-full items-center gap-2 text-left min-h-[44px] tap-highlight ${className}`}
      aria-label={`${PRO_LOCKED_LINE} Go Pro`}
    >
      <ProPill tone={tone} />
      <span className={`text-[13px] leading-snug font-medium ${tone === 'dark' ? 'text-white' : 'text-chess-text'}`}>
        {PRO_LOCKED_LINE}
      </span>
    </button>
  );
}
