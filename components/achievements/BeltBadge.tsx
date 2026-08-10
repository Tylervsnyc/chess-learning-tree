'use client';

import type { BeltBand } from '@/lib/achievements/types';

/**
 * Belt-band visuals shared by the trophy case and the unlock overlay.
 * No binary assets — a colored ring + emoji tile keeps Phase 1 asset-free
 * (the 512px WebP belt art is Phase 2).
 */
export const BAND_COLORS: Record<BeltBand, { ring: string; bg: string; text: string }> = {
  amateur: { ring: '#94A3B8', bg: '#F1F5F9', text: '#64748B' },
  contender: { ring: '#C4763A', bg: '#FBEFE4', text: '#A05A24' },
  'title-shot': { ring: '#9DB1C7', bg: '#EEF3F8', text: '#5C7692' },
  champion: { ring: '#F4B40A', bg: '#FFF6DC', text: '#A67C00' },
  undisputed: { ring: '#F4B40A', bg: '#FFF1C4', text: '#8A5CF6' },
};

export function AchievementTile({
  icon,
  band,
  size = 56,
  locked = false,
  secret = false,
  shimmer = false,
}: {
  icon: string;
  band: BeltBand;
  size?: number;
  locked?: boolean;
  secret?: boolean;
  shimmer?: boolean;
}) {
  const c = BAND_COLORS[band];
  return (
    <div
      className="relative flex items-center justify-center rounded-full select-none"
      style={{
        width: size,
        height: size,
        background: locked ? '#F1F5F9' : c.bg,
        boxShadow: locked ? 'inset 0 0 0 3px #E2E8F0' : `inset 0 0 0 3px ${c.ring}`,
        fontSize: size * 0.45,
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
            animation: 'achShimmer 2.2s linear infinite',
          }}
        />
      )}
      <span className={locked ? 'grayscale opacity-40' : ''}>{secret && locked ? '❓' : icon}</span>
    </div>
  );
}
