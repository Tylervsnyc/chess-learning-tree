'use client';

import Link from 'next/link';

export type SelfPromoVariant = 'default' | 'compact' | 'dark';

interface SelfPromoCardProps {
  variant?: SelfPromoVariant;
  onClick?: () => void;
}

export function SelfPromoCard({ variant = 'default', onClick }: SelfPromoCardProps) {
  if (variant === 'dark') {
    // For dark-background screens (e.g. lesson complete)
    return (
      <Link
        href="/pricing"
        onClick={onClick}
        className="block rounded-2xl p-4 transition-transform active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(206,130,255,0.10))',
          border: '1px solid rgba(255,215,0,0.25)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chess-gold/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-chess-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm">Upgrade to Premium</div>
            <div className="text-white/50 text-xs">No ads, unlimited puzzles, all levels</div>
          </div>
          <svg className="w-5 h-5 text-chess-gold/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    // Slim inline banner
    return (
      <Link
        href="/pricing"
        onClick={onClick}
        className="flex items-center gap-3 bg-chess-surface rounded-xl border border-slate-200 shadow-sm px-4 py-3 transition-transform active:scale-[0.98]"
      >
        <div className="w-8 h-8 rounded-lg bg-chess-gold/15 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-chess-gold" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-chess-text font-bold text-sm">Go Premium</div>
          <div className="text-chess-text-muted text-xs">Unlimited puzzles, no ads</div>
        </div>
        <svg className="w-4 h-4 text-chess-text-faint flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }

  // Default: full card with benefits list
  return (
    <Link
      href="/pricing"
      onClick={onClick}
      className="block bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-5 transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-chess-gold/15 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-chess-gold" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </div>
        <div>
          <div className="text-chess-text font-bold text-base">Upgrade to Premium</div>
          <div className="text-chess-text-muted text-xs">Unlock the full Chess Path experience</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-chess-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-chess-text text-sm">Unlimited puzzles every day</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-chess-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-chess-text text-sm">Ad-free experience</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-chess-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-chess-text text-sm">All levels and lessons unlocked</span>
        </div>
      </div>

      <div className="bg-chess-green text-white text-center py-2.5 rounded-xl font-bold text-sm">
        View Plans
      </div>
    </Link>
  );
}
