'use client';

import { BreathingRook, type RookieMood } from '@/components/ui/BreathingRook';

/**
 * RookieBubble — Rookie rook + speech bubble with caret.
 *
 * The standard pattern for Rookie speaking to the user.
 * Used in: /play (game commentary), onboarding, tutorials, empty states.
 *
 * Usage:
 *   <RookieBubble mood="happy">
 *     Nice fork! I didn't even see that coming.
 *   </RookieBubble>
 *
 *   <RookieBubble mood="defeated" direction="up" centered>
 *     Well. That happened.
 *   </RookieBubble>
 */

interface RookieBubbleProps {
  children: React.ReactNode;
  /** Rookie's mood (tints the rook) */
  mood?: RookieMood;
  /** Rook size */
  size?: 'xs' | 'sm' | 'md';
  /** Caret direction — where the bubble points relative to Rookie */
  direction?: 'right' | 'up';
  /** Center the bubble text */
  centered?: boolean;
  /** Additional className on outer container */
  className?: string;
}

export function RookieBubble({
  children,
  mood = 'neutral',
  size = 'sm',
  direction = 'right',
  centered = false,
  className = '',
}: RookieBubbleProps) {
  if (direction === 'up') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="mb-2">
          <BreathingRook size={size} mood={mood} animate />
        </div>
        <div className="relative w-full">
          <div
            className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 rounded-[2px]"
            style={{ boxShadow: '-1px -1px 2px rgba(0,0,0,0.03)' }}
          />
          <div className="relative bg-white rounded-2xl px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]">
            <div className={`text-chess-text text-[14px] leading-relaxed font-medium ${centered ? 'text-center' : ''}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: horizontal layout (rook left, bubble right)
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <div className="flex-shrink-0 pt-0.5">
        <BreathingRook size={size} mood={mood} animate />
      </div>
      <div className="flex-1 min-w-0 relative">
        <div
          className="absolute top-3 -left-[6px] w-2.5 h-2.5 bg-white rotate-45 rounded-[2px]"
          style={{ boxShadow: '-1px 1px 2px rgba(0,0,0,0.04)' }}
        />
        <div className="relative bg-white rounded-xl px-3.5 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]">
          <div className={`text-chess-text text-[13px] leading-relaxed font-medium ${centered ? 'text-center' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
