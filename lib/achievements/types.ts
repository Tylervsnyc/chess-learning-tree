/**
 * Achievements — shared types (Phase 1: Chess Boxing).
 *
 * An achievement is Rookie noticing something specific about your fighting
 * career and being unreasonably invested in it. Dungeon-Crawler-Carl energy:
 * the description IS the reward. Cosmetic only — achievements never gate
 * gameplay (same rule as Chess Path ELO, RULES §20).
 *
 * Plan: docs/chess-boxing-achievements-plan.md
 */

/** Boxing belt bands — the display language for tiers. */
export type BeltBand = 'amateur' | 'contender' | 'title-shot' | 'champion' | 'undisputed';

export type AchievementCategory =
  | 'bout'
  | 'puzzle'
  | 'training'
  | 'dedication'
  | 'shame';

/** How big the unlock moment plays (see AchievementUnlockOverlay). */
export type CelebrationSize = 's' | 'm' | 'l';

export interface AchievementDef {
  /** Stable forever — stored in user_achievements.achievement_id. */
  id: string;
  category: AchievementCategory;
  name: string;
  /** Rookie's line. May contain {tier} / {threshold} placeholders. */
  description: string;
  /** Emoji tile icon (no binary assets in Phase 1). */
  icon: string;
  /**
   * Count ladder — progress thresholds for tiers I/II/III/IV. Absent for
   * binary achievements and for level-tiered ones (levelTiered below).
   */
  thresholds?: number[];
  /**
   * Tier = the Rookie level (1-10) the thing was done at; upgrades to the
   * highest level ever. Displayed as belt bands (L1-2 Amateur … L9-10
   * Undisputed).
   */
  levelTiered?: boolean;
  /** Hidden as "???" in the trophy case until unlocked. */
  secret?: boolean;
}

/** One user's stored state for one achievement (user_achievements row). */
export interface AchievementRow {
  achievement_id: string;
  tier: number;
  progress: number | null;
  unlocked_at: string;
  upgraded_at: string | null;
  seen: boolean;
}

/** A fresh unlock or tier upgrade, returned by the finish routes. */
export interface AchievementUnlock {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: number;
  band: BeltBand;
  kind: 'unlocked' | 'upgraded';
  size: CelebrationSize;
  secret: boolean;
}

/** Rookie level (1-10) → belt band. Count ladders map rung 1..n the same way. */
export function beltBandForLevel(level: number): BeltBand {
  if (level >= 9) return 'undisputed';
  if (level >= 7) return 'champion';
  if (level >= 5) return 'title-shot';
  if (level >= 3) return 'contender';
  return 'amateur';
}

/** Count-ladder rung (1-based) → belt band, spread across the ladder length. */
export function beltBandForRung(rung: number, ladderLength: number): BeltBand {
  if (ladderLength <= 1) return 'champion';
  const bands: BeltBand[] = ['amateur', 'contender', 'title-shot', 'champion', 'undisputed'];
  const idx = Math.round(((rung - 1) / (ladderLength - 1)) * (bands.length - 1));
  return bands[Math.max(0, Math.min(bands.length - 1, idx))];
}

export const BELT_BAND_LABELS: Record<BeltBand, string> = {
  amateur: 'Amateur',
  contender: 'Contender',
  'title-shot': 'Title Shot',
  champion: 'Champion',
  undisputed: 'Undisputed',
};
