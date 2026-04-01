/**
 * Eval Zones — One Source of Truth (OSOT)
 *
 * All chess evaluation thresholds live here. Every system that cares about
 * position strength (mood, quips, speech, analysis, coaching) imports from
 * this file. Values are in PAWN UNITS (centipawns / 100).
 *
 * +1.0 = one pawn advantage, +5.0 = crushing, -3.0 = losing badly.
 */

import type { RookieMood } from '@/lib/rookie-os/types';
import { ALARM_VARIANTS, type AlarmVariant } from '@/lib/rookie-os/types';

// Re-export EvalMood for quip system compatibility
export type EvalMood = 'winning' | 'losing' | 'even' | 'desperate';

// ════════════════════════════════
// ZONE THRESHOLDS (pawn units)
// ════════════════════════════════

export const EVAL_ZONES = {
  CRUSHING:   5.0,   // +5 pawns — game is effectively over
  WINNING:    3.0,   // +3 pawns — clear win
  ADVANTAGE:  1.5,   // +1.5 pawns — solid edge
  SLIGHT:     0.5,   // +0.5 pawns — small edge
  EQUAL:      0,     // balanced position
} as const;

export type EvalZoneName = 'crushing' | 'winning' | 'advantage' | 'slight' | 'equal';

export interface EvalZoneResult {
  zone: EvalZoneName;
  /** Positive = Rookie ahead, negative = Rookie behind */
  sign: 1 | -1 | 0;
  /** Raw pawn units from Rookie's perspective */
  rookiePawns: number;
}

// ════════════════════════════════
// SWING & ALARM THRESHOLDS
// ════════════════════════════════

/** A 1-pawn eval change in a single move is notable */
export const SWING_THRESHOLD = 1.0;

/** A 2.5-pawn eval change is massive (feral/heartbroken territory) */
export const MASSIVE_SWING_THRESHOLD = 2.5;

/** Rookie is getting crushed at -5 pawns — trigger alarm animations */
export const ALARM_THRESHOLD = -5.0;

// ════════════════════════════════
// CONVERSION
// ════════════════════════════════

/** Convert centipawns to pawn units */
export function cpToPawns(cp: number): number {
  return cp / 100;
}

/** Convert pawn units to centipawns */
export function pawnsToCp(pawns: number): number {
  return pawns * 100;
}

/**
 * Get Rookie's eval in pawn units.
 * Positive = Rookie winning, negative = Rookie losing.
 */
export function getRookiePawns(
  cp: number | null,
  mate: number | null,
  rookieColor: 'white' | 'black',
): number {
  if (mate !== null) {
    // Mate: treat as extreme eval. Sign = who's mating.
    const whiteMating = mate > 0;
    const rookieMating = (whiteMating && rookieColor === 'white') || (!whiteMating && rookieColor === 'black');
    // Use distance-based magnitude: mate in 1 = 20 pawns, mate in 10 = 11 pawns
    const magnitude = 21 - Math.min(10, Math.abs(mate));
    return rookieMating ? magnitude : -magnitude;
  }

  if (cp !== null) {
    const rookieCp = rookieColor === 'white' ? cp : -cp;
    return cpToPawns(rookieCp);
  }

  return 0; // no eval = assume equal
}

// ════════════════════════════════
// ZONE CLASSIFICATION
// ════════════════════════════════

/** Classify a position into an eval zone from Rookie's perspective */
export function getEvalZone(rookiePawns: number): EvalZoneResult {
  const abs = Math.abs(rookiePawns);
  const sign = rookiePawns > 0.01 ? 1 : rookiePawns < -0.01 ? -1 : 0;

  let zone: EvalZoneName;
  if (abs >= EVAL_ZONES.CRUSHING) zone = 'crushing';
  else if (abs >= EVAL_ZONES.WINNING) zone = 'winning';
  else if (abs >= EVAL_ZONES.ADVANTAGE) zone = 'advantage';
  else if (abs >= EVAL_ZONES.SLIGHT) zone = 'slight';
  else zone = 'equal';

  return { zone, sign: sign as 1 | -1 | 0, rookiePawns };
}

/** Human-readable zone description from Rookie's perspective */
export function describeZone(rookiePawns: number): string {
  const { zone, sign } = getEvalZone(rookiePawns);

  if (sign === 0 || zone === 'equal') return 'balanced position';

  const side = sign > 0 ? 'Rookie' : 'Player';
  switch (zone) {
    case 'crushing':  return `${side} is crushing`;
    case 'winning':   return `${side} is clearly winning`;
    case 'advantage': return `${side} has a solid advantage`;
    case 'slight':    return `${side} has a slight edge`;
    default:          return 'balanced position';
  }
}

// ════════════════════════════════
// EVAL MOOD (quip system compat)
// ════════════════════════════════

/**
 * Map Rookie's pawn eval to EvalMood for the quip/speech system.
 * Drop-in replacement for the old win%-based getEvalMood.
 */
export function getEvalMood(rookiePawns: number): EvalMood {
  if (rookiePawns >= EVAL_ZONES.ADVANTAGE) return 'winning';
  if (rookiePawns >= -EVAL_ZONES.ADVANTAGE) return 'even';
  if (rookiePawns >= -EVAL_ZONES.WINNING) return 'losing';
  return 'desperate';
}

// ════════════════════════════════
// ROOKIE MOOD MAPPING
// ════════════════════════════════

export interface EvalMoodResult {
  mood: RookieMood;
  reason: string;
  rookiePawns: number;
  /** Win% kept for downstream consumers (analysis, eval bar) */
  rookieWinPercent: number;
  /** Rookie jumped 2+ zones in her favor — show "excited" */
  isComeback: boolean;
  alarmVariant: AlarmVariant | null;
}

export function pickAlarmVariant(): AlarmVariant {
  return ALARM_VARIANTS[Math.floor(Math.random() * ALARM_VARIANTS.length)];
}

/**
 * Map a Stockfish eval to Rookie's mood using pawn-unit zones.
 *
 * @param cp - centipawns from Stockfish (positive = white advantage)
 * @param mate - mate in N (positive = white mates)
 * @param rookieColor - which color Rookie is playing
 * @param prevRookiePawns - previous position's pawn eval for swing detection
 * @param whiteWinPercent - pre-computed win% for downstream consumers
 */
export function evalToRookieMood(
  cp: number | null,
  mate: number | null,
  rookieColor: 'white' | 'black',
  prevRookiePawns?: number,
  whiteWinPercent?: number,
): EvalMoodResult {
  const rookiePawns = getRookiePawns(cp, mate, rookieColor);

  // Win% for downstream (eval bar, analysis) — passed through, not used for mood
  const rookieWp = whiteWinPercent !== undefined
    ? (rookieColor === 'white' ? whiteWinPercent : 100 - whiteWinPercent)
    : 50;

  // ── Comeback detection: did Rookie jump 2+ mood zones in her favor? ──
  // Mood zones from Rookie's perspective (worst to best):
  //   defeated(-5) → panicking(-3) → nervous(-1.5) → neutral(0) → scheming(+0.5) → happy(+1.5) → smug(+3)
  // A jump of 2+ steps (e.g. panicking → neutral) triggers "excited"
  let isComeback = false;

  if (prevRookiePawns !== undefined) {
    const moodRank = (p: number): number => {
      if (p <= -EVAL_ZONES.WINNING) return 0;   // defeated
      if (p <= -EVAL_ZONES.ADVANTAGE) return 1;  // panicking
      if (p <= -EVAL_ZONES.SLIGHT) return 2;     // nervous
      if (p <= EVAL_ZONES.SLIGHT) return 3;       // neutral
      if (p <= EVAL_ZONES.ADVANTAGE) return 4;    // scheming
      if (p <= EVAL_ZONES.WINNING) return 5;      // happy
      return 6;                                    // smug
    };
    const improvement = moodRank(rookiePawns) - moodRank(prevRookiePawns);
    if (improvement >= 2) {
      isComeback = true;
    }
  }

  // ── Zone-based mood (pawn units) ──
  let mood: RookieMood;
  let reason: string;

  if (mate !== null) {
    const rookieMating = rookiePawns > 0;
    if (rookieMating) {
      mood = 'smug';
      reason = `Checkmate in ${Math.abs(mate)}`;
    } else {
      mood = 'panicking';
      reason = `Getting mated in ${Math.abs(mate)}`;
    }
  } else if (rookiePawns >= EVAL_ZONES.WINNING) {
    mood = 'smug';
    reason = 'Clearly winning';
  } else if (rookiePawns >= EVAL_ZONES.ADVANTAGE) {
    mood = 'happy';
    reason = 'Nice advantage';
  } else if (rookiePawns >= EVAL_ZONES.SLIGHT) {
    mood = 'scheming';
    reason = 'Slight edge, plotting';
  } else if (rookiePawns >= -EVAL_ZONES.SLIGHT) {
    mood = 'neutral';
    reason = 'Position is balanced';
  } else if (rookiePawns >= -EVAL_ZONES.ADVANTAGE) {
    mood = 'nervous';
    reason = 'Losing ground';
  } else if (rookiePawns >= -EVAL_ZONES.WINNING) {
    mood = 'panicking';
    reason = 'In serious trouble';
  } else {
    mood = 'defeated';
    reason = 'This is hopeless';
  }

  const alarmVariant = rookiePawns <= ALARM_THRESHOLD ? pickAlarmVariant() : null;

  return {
    mood,
    reason,
    rookiePawns,
    rookieWinPercent: rookieWp,
    isComeback,
    alarmVariant,
  };
}
