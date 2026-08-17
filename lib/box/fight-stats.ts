/**
 * FightStats — what one Quadrant Fight boxing round reports to its parent.
 * Shared contract between components/box/QuadrantFight.tsx (producer) and the
 * bout / workout pages + lib/bout/bout.ts scoring (consumers).
 */
export interface FightStats {
  punchesLanded: number;
  punchesBlocked: number;
  punchesMissed: number;
  dodgesMade: number;
  hitsTaken: number;
  powerLanded: number;
  doublesLanded: number;
  combosLanded: number;
  knockdownsScored: number;
  knockdownsTaken: number;
  bestStreak: number;
  damageDealt: number;
  damageTaken: number;
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
