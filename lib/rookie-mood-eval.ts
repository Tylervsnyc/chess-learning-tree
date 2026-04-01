/**
 * Eval-driven mood mapping for Rookie.
 *
 * Converts Stockfish evaluation into Rookie's baseline mood.
 * This runs during the game at low depth (~8-10) for real-time mood.
 * Event-based moods (captures, checks) override as short-term reactions.
 *
 * All percentages are from ROOKIE's perspective (high = Rookie winning).
 */

import { RookieMood, ALARM_VARIANTS, type AlarmVariant } from '@/lib/rookie-os/types';
import { evalToWinPercent, winPercentForColor } from '@/lib/game-eval';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface EvalMoodResult {
  mood: RookieMood;
  reason: string;         // human-readable reason (for quip triggers)
  rookieWinPercent: number;
  isSwing: boolean;       // large eval change from previous position
  swingDirection: 'better' | 'worse' | null;
  /** Random alarm animation variant when Rookie is 8+ pawns behind */
  alarmVariant: AlarmVariant | null;
}

// ════════════════════════════════
// MOOD ZONES — from Rookie's perspective
// ════════════════════════════════

// Win% thresholds (Rookie's perspective: 50 = equal, 100 = Rookie winning)
const ZONES = {
  dominating: 75,   // Rookie clearly winning
  comfortable: 60,  // Rookie has a nice edge
  slight: 55,       // Small Rookie advantage
  equal: 45,        // Roughly equal
  uncomfortable: 35,// Player has a nice edge
  losing: 20,       // Rookie clearly losing
  hopeless: 10,     // Rookie is toast
} as const;

// Swing threshold: a 15% win% change in one move is notable
const SWING_THRESHOLD = 15;
// Massive swing: 30%+ is game-changing (feral/heartbroken territory)
const MASSIVE_SWING_THRESHOLD = 30;
// Alarm threshold: 800cp behind = 8 pawns. Through the sigmoid this is ~5% win.
// Use 12% as the threshold to catch "clearly crushed" territory.
const ALARM_WIN_PERCENT = 12;

function pickAlarmVariant(): AlarmVariant {
  return ALARM_VARIANTS[Math.floor(Math.random() * ALARM_VARIANTS.length)];
}

// ════════════════════════════════
// MAPPING
// ════════════════════════════════

/**
 * Map a Stockfish eval to Rookie's mood.
 *
 * @param cp - centipawns from Stockfish (positive = white advantage)
 * @param mate - mate in N (positive = white mates)
 * @param rookieColor - which color Rookie is playing
 * @param prevRookieWinPercent - previous position's win% for swing detection (optional)
 */
export function evalToRookieMood(
  cp: number | null,
  mate: number | null,
  rookieColor: 'white' | 'black',
  prevRookieWinPercent?: number,
): EvalMoodResult {
  // Get win% from Rookie's perspective
  const whiteWp = evalToWinPercent(cp, mate);
  const rookieWp = winPercentForColor(whiteWp, rookieColor);

  // Detect swings
  let isSwing = false;
  let swingDirection: 'better' | 'worse' | null = null;

  if (prevRookieWinPercent !== undefined) {
    const delta = rookieWp - prevRookieWinPercent;
    if (Math.abs(delta) >= SWING_THRESHOLD) {
      isSwing = true;
      swingDirection = delta > 0 ? 'better' : 'worse';
    }
  }

  // Swing moods override zone-based moods
  if (isSwing) {
    const delta = prevRookieWinPercent !== undefined ? Math.abs(rookieWp - prevRookieWinPercent) : 0;
    const isMassive = delta >= MASSIVE_SWING_THRESHOLD;

    if (swingDirection === 'better') {
      return {
        mood: isMassive ? 'feral' : 'excited',
        reason: isMassive ? 'MASSIVE swing — lost all composure' : 'Big swing in my favor',
        rookieWinPercent: rookieWp,
        isSwing: true,
        swingDirection: 'better',
        alarmVariant: null,
      };
    } else {
      // Massive swing INTO alarm territory = pick an alarm variant
      const inAlarmZone = rookieWp < ALARM_WIN_PERCENT;
      return {
        mood: isMassive ? 'heartbroken' : 'surprised',
        reason: isMassive ? 'Devastating collapse' : 'Wait what just happened',
        rookieWinPercent: rookieWp,
        isSwing: true,
        swingDirection: 'worse',
        alarmVariant: inAlarmZone ? pickAlarmVariant() : null,
      };
    }
  }

  // Zone-based mood
  let mood: RookieMood;
  let reason: string;

  if (mate !== null) {
    // Mate on the board
    const rookieMating = (mate > 0 && rookieColor === 'white') || (mate < 0 && rookieColor === 'black');
    if (rookieMating) {
      mood = 'smug';
      reason = `Checkmate in ${Math.abs(mate)}`;
    } else {
      mood = 'panicking';
      reason = `Getting mated in ${Math.abs(mate)}`;
    }
  } else if (rookieWp >= ZONES.dominating) {
    mood = 'smug';
    reason = 'Clearly winning';
  } else if (rookieWp >= ZONES.comfortable) {
    mood = 'happy';
    reason = 'Nice advantage';
  } else if (rookieWp >= ZONES.slight) {
    mood = 'scheming';
    reason = 'Slight edge, plotting';
  } else if (rookieWp >= ZONES.equal) {
    mood = 'neutral';
    reason = 'Position is balanced';
  } else if (rookieWp >= ZONES.uncomfortable) {
    mood = 'nervous';
    reason = 'Losing ground';
  } else if (rookieWp >= ZONES.losing) {
    mood = 'panicking';
    reason = 'In serious trouble';
  } else {
    mood = 'defeated';
    reason = 'This is hopeless';
  }

  // Alarm variant when Rookie is getting crushed (8+ pawns behind)
  const alarmVariant = rookieWp < ALARM_WIN_PERCENT ? pickAlarmVariant() : null;

  return {
    mood,
    reason,
    rookieWinPercent: rookieWp,
    isSwing: false,
    swingDirection: null,
    alarmVariant,
  };
}
