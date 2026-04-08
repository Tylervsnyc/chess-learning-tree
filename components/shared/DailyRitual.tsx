'use client';

import Link from 'next/link';
import { BreathingRook } from '@/components/ui/BreathingRook';

type Activity = 'play' | 'tactics' | 'daily';

const CONTINUE_CONFIG: Record<Activity, { label: string; href: string }> = {
  play: { label: 'Play Again', href: '/play' },
  tactics: { label: 'Next Lesson', href: '/' },
  daily: { label: 'Back to Home', href: '/' },
};

interface RookiePopupProps {
  justCompleted: Activity;
  /** Rookie's line — pass from parent or falls back to default */
  line?: string;
}

export function RookiePopup({ justCompleted, line }: RookiePopupProps) {
  const continueAction = CONTINUE_CONFIG[justCompleted];

  return (
    <div className="w-full max-w-sm mx-auto mt-4">
      <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-lg overflow-hidden p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <BreathingRook size="sm" mood="happy" animate />
          </div>
          <p className="text-sm text-chess-text leading-snug font-medium flex-1 pt-1">
            {line ?? "Nice work."}
          </p>
        </div>

        <div className="mt-3">
          <Link
            href={continueAction.href}
            className="block w-full py-2.5 rounded-xl bg-chess-green text-white font-bold text-center text-sm transition-all hover:brightness-110 shadow-[0_2px_0_var(--color-chess-green-shadow)] active:translate-y-[1px] active:shadow-none"
          >
            {continueAction.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
