'use client';

import { useCallback, useMemo } from 'react';
import type { AchievementUnlock } from '@/lib/achievements/types';
import { BELT_BAND_LABELS } from '@/lib/achievements/types';
import { getAchievementDef } from '@/lib/achievements/catalog';
import { BAND_COLORS } from './BeltBadge';
import AchievementPop, { type PopItem } from './AchievementPop';
import { fireConfetti } from '@/lib/confetti';
import { playWoodClap, playBoxingBell, playCelebrationSound, playErrorSound } from '@/lib/sounds';

/**
 * Chess Boxing adapter over the shared AchievementPop (the one pop-up system
 * shared with Rookie's Revenge — see AchievementPop.tsx header).
 *
 * Maps belt-band unlocks onto PopItems, supplies the boxing sound/confetti
 * palette (docs/chess-boxing-achievements-plan.md §7), and marks the PLAYED
 * medals seen when the queue drains (overflow stays unseen so the trophy
 * case keeps its "new" dot). Renders at z-[110], above the result modals at
 * z-[100], so it never adds rows to the no-scroll result cards.
 */
export default function AchievementUnlockOverlay({
  unlocks,
  onDone,
}: {
  unlocks: AchievementUnlock[];
  onDone?: () => void;
}) {
  const items = useMemo<PopItem[]>(() => unlocks.map(toPopItem), [unlocks]);

  const handleDone = useCallback(
    (playedIds: string[]) => {
      if (playedIds.length > 0) {
        fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seenIds: playedIds }),
        }).catch(() => {});
      }
      onDone?.();
    },
    [onDone],
  );

  return <AchievementPop items={items} fx={{ onShow: playFx }} onDone={handleDone} toastEdge="bottom" />;
}

function toPopItem(u: AchievementUnlock): PopItem {
  const roast = u.category === 'shame';
  return {
    id: u.id,
    name: u.name,
    line: u.description,
    icon: u.icon,
    accent: BAND_COLORS[u.band],
    size: u.size,
    mood: roast ? 'roast' : 'proud',
    shimmer: u.band === 'undisputed',
    tierLabel: roast ? null : tierLine(u),
    eyebrow: roast
      ? 'Achievement… unlocked'
      : u.size === 'l'
        ? `Title fight ${u.kind}`
        : `Achievement ${u.kind}`,
  };
}

/** Boxing fx: clap / bell / bell+fanfare by size; shame gets the error sting. */
function playFx(item: PopItem, { reducedMotion }: { reducedMotion: boolean }) {
  if (item.mood === 'roast') {
    playErrorSound();
    return;
  }
  if (item.size === 's') {
    playWoodClap();
    if (!reducedMotion) fireConfetti({ particleCount: 30, spread: 55, origin: { y: 0.8 } });
  } else if (item.size === 'm') {
    playBoxingBell();
    if (!reducedMotion) fireConfetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  } else {
    playBoxingBell();
    playCelebrationSound();
    if (!reducedMotion) {
      const colors = ['#FFD43B', '#FFAA00', '#1CB0F6', '#FFFFFF'];
      fireConfetti({ particleCount: 120, spread: 90, origin: { y: 0.55 }, colors });
      setTimeout(() => fireConfetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, colors }), 450);
    }
  }
}

function tierLine(u: AchievementUnlock): string | null {
  if (u.tier <= 0) return null;
  const def = getAchievementDef(u.id);
  const band = BELT_BAND_LABELS[u.band];
  // Level-tiered reads "Champion · Level 8"; ladders read "Contender · Tier II";
  // binary medals show their rarity band alone (amateur binaries show nothing).
  if (def?.levelTiered) return `${band} · Level ${u.tier}`;
  if (def?.thresholds && def.thresholds.length > 1) {
    const roman = ['I', 'II', 'III', 'IV', 'V'][Math.min(4, u.tier - 1)];
    return `${band} · Tier ${roman}`;
  }
  return u.band === 'amateur' ? null : band;
}
