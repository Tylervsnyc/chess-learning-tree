'use client';

import type { CardId } from '@/lib/run/cards';

interface CardIconProps {
  cardId: CardId;
  size?: number;
}

/**
 * Inline SVG icons per card. Stroke-only so they inherit currentColor and
 * scale cleanly at any size.
 */
export function CardIcon({ cardId, size = 24 }: CardIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (cardId) {
    case 'move-bishop':
      // Two crossed diagonal arrows.
      return (
        <svg {...common}>
          <path d="M4 4l16 16" />
          <path d="M20 4L4 20" />
          <path d="M4 4h5M4 4v5" />
          <path d="M20 4h-5M20 4v5" />
          <path d="M4 20h5M4 20v-5" />
          <path d="M20 20h-5M20 20v-5" />
        </svg>
      );
    case 'move-knight':
      // L-shape path.
      return (
        <svg {...common}>
          <path d="M6 4v10h12" />
          <circle cx="6" cy="4" r="1.5" fill="currentColor" />
          <path d="M15 11l3 3-3 3" />
        </svg>
      );
    case 'queen-mode':
      // Crown with three points.
      return (
        <svg {...common}>
          <path d="M3 17l2-9 4 5 3-8 3 8 4-5 2 9z" />
          <path d="M4 20h16" />
        </svg>
      );
    case 'bomb':
      // Round bomb with fuse spark.
      return (
        <svg {...common}>
          <circle cx="11" cy="14" r="6" />
          <path d="M15 9l2-2" />
          <path d="M17 7l1.5-1.5M18.5 9l1.5-1.5M16 4l.5 2" />
        </svg>
      );
    case 'freeze':
      // Six-point snowflake.
      return (
        <svg {...common}>
          <path d="M12 2v20" />
          <path d="M3.34 7l17.32 10" />
          <path d="M20.66 7L3.34 17" />
          <path d="M9 4l3 2 3-2M9 20l3-2 3 2" />
          <path d="M4 10l1 2-1 2M20 10l-1 2 1 2" />
        </svg>
      );
    case 'telekinesis':
      // Swap arrows.
      return (
        <svg {...common}>
          <path d="M7 7h12l-3-3M17 17H5l3 3" />
          <circle cx="4" cy="7" r="2" />
          <circle cx="20" cy="17" r="2" />
        </svg>
      );
  }
}
