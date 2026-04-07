'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { playButtonClick } from '@/lib/sounds';
import { darken } from '@/lib/daily-rook-blocks';

/**
 * ActionButton — The Duolingo-style 3D button used across Chess Path.
 *
 * Colors match the Rookie rook block palette exactly.
 * 3D depth via boxShadow, press effect via active:translateY.
 * Always plays a click sound on press.
 *
 * Usage:
 *   <ActionButton color="green" size="lg">Start Learning</ActionButton>
 *   <ActionButton color="blue" size="md">Continue</ActionButton>
 *   <ActionButton color="white" size="sm">Skip</ActionButton>
 */

type ButtonColor = 'green' | 'blue' | 'cyan' | 'purple' | 'gold' | 'orange' | 'coral' | 'red' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg';

// Rook block palette — same 8 colors as Rookie's blocks
const ROOK_COLORS = {
  green:  '#58CC02',
  blue:   '#1CB0F6',
  cyan:   '#2FCBEF',
  purple: '#A560E8',
  gold:   '#FFC800',
  orange: '#FF9600',
  coral:  '#FF6B6B',
  red:    '#FF4B4B',
} as const;

const COLOR_MAP: Record<ButtonColor, { bg: string; shadow: string; text: string }> = {
  green:  { bg: ROOK_COLORS.green,  shadow: darken(ROOK_COLORS.green, 18),  text: 'white' },
  blue:   { bg: ROOK_COLORS.blue,   shadow: darken(ROOK_COLORS.blue, 18),   text: 'white' },
  cyan:   { bg: ROOK_COLORS.cyan,   shadow: darken(ROOK_COLORS.cyan, 18),   text: 'white' },
  purple: { bg: ROOK_COLORS.purple, shadow: darken(ROOK_COLORS.purple, 18), text: 'white' },
  gold:   { bg: ROOK_COLORS.gold,   shadow: darken(ROOK_COLORS.gold, 18),   text: '#2A3C45' },
  orange: { bg: ROOK_COLORS.orange, shadow: darken(ROOK_COLORS.orange, 18), text: 'white' },
  coral:  { bg: ROOK_COLORS.coral,  shadow: darken(ROOK_COLORS.coral, 18),  text: 'white' },
  red:    { bg: ROOK_COLORS.red,    shadow: darken(ROOK_COLORS.red, 18),    text: 'white' },
  white:  { bg: '#ffffff',          shadow: '#d1d9e0',                       text: '#2A3C45' },
};

const SIZE_MAP: Record<ButtonSize, { padding: string; fontSize: string; radius: string; shadowDepth: number }> = {
  sm: { padding: '8px 16px', fontSize: '13px', radius: '12px', shadowDepth: 3 },
  md: { padding: '12px 20px', fontSize: '15px', radius: '14px', shadowDepth: 4 },
  lg: { padding: '16px 24px', fontSize: '17px', radius: '16px', shadowDepth: 5 },
};

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  size?: ButtonSize;
  /** Fill parent width */
  fullWidth?: boolean;
  /** Disable click sound */
  silent?: boolean;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton(
    { color = 'green', size = 'md', fullWidth = false, silent = false, onClick, className = '', style, children, ...rest },
    ref,
  ) {
    const colors = COLOR_MAP[color];
    const sizing = SIZE_MAP[size];

    return (
      <button
        ref={ref}
        onClick={(e) => {
          if (!silent) playButtonClick();
          onClick?.(e);
        }}
        className={`font-bold transition-all active:translate-y-[2px] text-center ${fullWidth ? 'w-full' : ''} ${className}`}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          boxShadow: `0 ${sizing.shadowDepth}px 0 ${colors.shadow}`,
          padding: sizing.padding,
          fontSize: sizing.fontSize,
          borderRadius: sizing.radius,
          ...style,
        }}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
