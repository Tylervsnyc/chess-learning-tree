'use client';

import { useCallback, useMemo } from 'react';
import type { AchievementUnlock } from '@/lib/achievements/types';
import { BELT_BAND_LABELS, beltBandForLevel, beltBandForRung } from '@/lib/achievements/types';
import type { BeltBand } from '@/lib/achievements/types';
import { getAchievementDef } from '@/lib/achievements/catalog';
import { BAND_COLORS } from './BeltBadge';
import AchievementPop, { type PopItem } from './AchievementPop';
import { fireConfetti } from '@/lib/confetti';
import { playAchievementSfx, type AchievementSfxKind } from '@/lib/sounds';

/**
 * Chess Boxing adapter over the shared AchievementPop (the one pop-up system
 * shared with Rookie's Revenge — see AchievementPop.tsx header).
 *
 * Maps belt-band unlocks onto PopItems, supplies the boxing sound/confetti
 * palette (docs/chess-boxing-achievements-plan.md §7), and marks the PLAYED
 * medals seen when the queue drains (overflow stays unseen so the trophy
 * case keeps its "new" dot AND the finish routes replay it next session —
 * nothing is missed forever). Renders at z-[110], above the result modals at
 * z-[100], so it never adds rows to the no-scroll result cards.
 */
export default function AchievementUnlockOverlay({
  unlocks,
  onDone,
  sfxFile,
}: {
  unlocks: AchievementUnlock[];
  onDone?: () => void;
  /** Audition only (/test/achievement-sfx): play this file instead of the chosen variant. */
  sfxFile?: string;
}) {
  const items = useMemo<PopItem[]>(() => unlocks.map(toPopItem), [unlocks]);
  // PopItem is shared with Rookie's Revenge and carries no unlock `kind`, so
  // the upgrade sound is looked up by id here instead of widening the contract.
  const upgradedIds = useMemo(() => new Set(unlocks.filter((u) => u.kind === 'upgraded').map((u) => u.id)), [unlocks]);
  const onShow = useCallback(
    (item: PopItem, ctx: { reducedMotion: boolean }) => playFx(item, ctx, upgradedIds.has(item.id), sfxFile),
    [upgradedIds, sfxFile],
  );

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

  // HARD CAP: at most 2 medals play per finish (Tyler, 2026-08-24). Anything
  // beyond that stays unseen and drips out 2 per session via the backlog
  // replay in lib/achievements/server.ts — a first workout that earns 11
  // becomes a reason to come back 5 more times, not one overwhelming stack.
  return (
    <AchievementPop
      items={items}
      fx={{ onShow }}
      onDone={handleDone}
      toastEdge="bottom"
      maxPlayed={2}
      durations={{ s: 1900, m: 2600 }}
    />
  );
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
    ladder: roast ? undefined : ladderFor(u),
    eyebrow: roast
      ? 'Achievement… unlocked'
      : u.size === 'l'
        ? `Title fight ${u.kind}`
        : `Achievement ${u.kind}`,
  };
}

/** Which SFX plays for a pop (single source — the audition page uses the same rule). */
export function sfxKindFor(item: Pick<PopItem, 'size' | 'mood'>, upgraded: boolean): AchievementSfxKind {
  if (item.mood === 'roast') return 'shame';
  if (upgraded) return 'upgrade';
  return item.size === 's' ? 'toast' : item.size === 'm' ? 'plaque' : 'ceremony';
}

/** Boxing fx: vintage-gym SFX by moment (lib/sounds ACHIEVEMENT_SFX_FILES) + confetti by size. */
function playFx(item: PopItem, { reducedMotion }: { reducedMotion: boolean }, upgraded: boolean, sfxFile?: string) {
  playAchievementSfx(sfxKindFor(item, upgraded), sfxFile);
  if (item.mood === 'roast' || reducedMotion) return;
  if (item.size === 's') {
    fireConfetti({ particleCount: 30, spread: 55, origin: { y: 0.8 } });
  } else if (item.size === 'm') {
    fireConfetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  } else {
    const colors = ['#FFD43B', '#FFAA00', '#1CB0F6', '#FFFFFF'];
    fireConfetti({ particleCount: 120, spread: 90, origin: { y: 0.55 }, colors });
    setTimeout(() => fireConfetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, colors }), 450);
  }
}

const BANDS: BeltBand[] = ['amateur', 'contender', 'title-shot', 'champion', 'undisputed'];

/** Belt-notch strip for leveled medals: one notch per rung (ladders) or per belt band (level-tiered). */
function ladderFor(u: AchievementUnlock): PopItem['ladder'] {
  if (u.tier <= 0) return undefined;
  const def = getAchievementDef(u.id);
  if (def?.levelTiered) {
    return { filled: BANDS.indexOf(beltBandForLevel(u.tier)) + 1, total: 5, labels: BANDS.map((b) => BELT_BAND_LABELS[b]) };
  }
  if (def?.thresholds && def.thresholds.length > 1) {
    const n = def.thresholds.length;
    return {
      filled: Math.min(n, u.tier),
      total: n,
      labels: def.thresholds.map((_, i) => BELT_BAND_LABELS[beltBandForRung(i + 1, n)]),
    };
  }
  return undefined;
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
