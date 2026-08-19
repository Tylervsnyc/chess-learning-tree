'use client';

import type { BeltBand } from '@/lib/achievements/types';
import { PopTile, type PopAccent } from './AchievementPop';

/**
 * Belt-band visuals shared by the trophy case and the unlock overlay.
 * No binary assets — a colored ring + emoji tile keeps Phase 1 asset-free
 * (the 512px WebP belt art is Phase 2).
 */
export const BAND_COLORS: Record<BeltBand, PopAccent> = {
  amateur: { ring: '#94A3B8', bg: '#F1F5F9', text: '#64748B' },
  contender: { ring: '#C4763A', bg: '#FBEFE4', text: '#A05A24' },
  'title-shot': { ring: '#9DB1C7', bg: '#EEF3F8', text: '#5C7692' },
  champion: { ring: '#F4B40A', bg: '#FFF6DC', text: '#A67C00' },
  undisputed: { ring: '#F4B40A', bg: '#FFF1C4', text: '#8A5CF6' },
};

/** Belt-band medal tile — the shared PopTile wearing a band color. */
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
  return (
    <PopTile
      icon={secret && locked ? '❓' : icon}
      accent={BAND_COLORS[band]}
      size={size}
      locked={locked}
      shimmer={shimmer}
    />
  );
}
