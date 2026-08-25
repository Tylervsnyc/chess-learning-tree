/**
 * FightStats — what one Quadrant Fight boxing round reports to its parent.
 * Shared contract between components/box/QuadrantFight.tsx (producer) and the
 * bout / workout pages + lib/bout/bout.ts scoring (consumers).
 */
/**
 * THE Quadrant Fight opt-in key. The camera game is gated only by this
 * localStorage flag (default off) — never by a feature flag — so both launch
 * points (the workout's exercise segments and the bout's boxing rounds) MUST
 * read and write this one constant. Do not re-declare the string literal.
 */
export const QUAD_FIGHT_KEY = 'cp_quadrant_fight_optin';

export interface FightStats {
  punchesLanded: number;
  /** @deprecated always 0 since the HP/knockdown removal (2026-08-21) — random blocks are gone. */
  punchesBlocked: number;
  punchesMissed: number;
  dodgesMade: number;
  hitsTaken: number;
  powerLanded: number;
  doublesLanded: number;
  combosLanded: number;
  /** @deprecated always 0 since the HP/knockdown removal (2026-08-21). */
  knockdownsScored: number;
  /** @deprecated always 0 since the HP/knockdown removal (2026-08-21). */
  knockdownsTaken: number;
  bestStreak: number;
  /** @deprecated always 0 since the HP/knockdown removal (2026-08-21). */
  damageDealt: number;
  /** @deprecated always 0 since the HP/knockdown removal (2026-08-21). */
  damageTaken: number;
  /** = punchesLanded + dodgesMade (total clean actions) — the counts ARE the score. */
  score: number;
  durationMs: number;
}

export function emptyFightStats(durationMs = 0): FightStats {
  return {
    punchesLanded: 0, punchesBlocked: 0, punchesMissed: 0, dodgesMade: 0, hitsTaken: 0,
    powerLanded: 0, doublesLanded: 0, combosLanded: 0, knockdownsScored: 0, knockdownsTaken: 0,
    bestStreak: 0, damageDealt: 0, damageTaken: 0, score: 0, durationMs,
  };
}
