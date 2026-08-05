import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * /box/train — the Chess Boxing app's Train tab. A no-scroll chooser: three
 * ways to train on a rest day, all counting toward the streak. Fans out to
 * the shared activity pages (/solve, /path, /openings), which render inside
 * the shell with the tab bar and no site header.
 *
 * HARD RULE (docs/chess-boxing-app-structure.md): fits the window, never
 * scrolls — fixed column, cards flex to the leftover height.
 */

export const metadata: Metadata = {
  title: 'Train — Chess Boxing',
  description: 'Daily puzzles, tactics lessons, and openings. Rest-day work that keeps the streak alive.',
};

const OPTIONS = [
  {
    href: '/solve',
    title: 'Daily Puzzles',
    sub: 'Today’s set. Sharp, fast, scored.',
    accent: '#FF4B4B',
    shadow: '#CC3939',
    icon: TargetIcon,
  },
  {
    href: '/path',
    title: 'Tactics',
    sub: 'The lesson path — forks, pins, mates.',
    accent: '#CE82FF',
    shadow: '#a855f7',
    icon: SwordsIcon,
  },
  {
    href: '/openings',
    title: 'Openings',
    sub: 'Know the first moves cold.',
    accent: '#1CB0F6',
    shadow: '#0d7ec4',
    icon: BookIcon,
  },
] as const;

export default function BoxTrainPage() {
  return (
    <div className="h-full overflow-hidden bg-chess-page">
      <div className="max-w-lg md:max-w-xl mx-auto w-full h-full px-4 md:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex flex-col gap-3">
        <div className="text-center shrink-0 pt-1">
          <h1 className="text-2xl md:text-3xl font-black text-chess-text leading-tight">Train</h1>
          <p className="text-xs md:text-sm font-semibold text-chess-text-muted mt-0.5">
            Rest-day work. Every finish keeps the streak alive.
          </p>
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {OPTIONS.map(({ href, title, sub, accent, shadow, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 min-h-0 flex items-center gap-4 rounded-2xl bg-chess-surface border-2 px-5 active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
              style={{ borderColor: shadow, boxShadow: `0 4px 0 0 ${shadow}` }}
            >
              <span
                className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl text-white"
                style={{ background: accent }}
              >
                <Icon />
              </span>
              <span className="min-w-0">
                <span className="block text-lg md:text-xl font-black text-chess-text leading-tight">
                  {title}
                </span>
                <span className="block text-xs md:text-sm font-semibold text-chess-text-muted truncate">
                  {sub}
                </span>
              </span>
              <ChevronIcon />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Inline icons — 28px stroke style, matching the tab bar's language. */

function TargetIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

function SwordsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M16 16l4 4" />
      <path d="M19 21l2-2" />
      <path d="M14.5 6.5L18 3h3v3l-3.5 3.5" />
      <path d="M5 14l4 4" />
      <path d="M7 17l-3 3" />
      <path d="M3 21l2-2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="ml-auto shrink-0 text-chess-text-faint" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
