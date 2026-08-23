import { ACHIEVEMENT_CATALOG, getAchievementDef } from './catalog';
import type { BoutFacts } from './bout-facts';
import {
  beltBandForLevel,
  beltBandForRung,
  type AchievementDef,
  type AchievementRow,
  type AchievementUnlock,
  type BeltBand,
  type CelebrationSize,
} from './types';

/**
 * Achievement detection — PURE. No I/O: the server module (server.ts) loads
 * the user's existing rows + the few aggregates an event needs, calls
 * evaluate(), and persists the writes it returns. Keeping this pure makes
 * every detector unit-testable and the backfill script able to reuse it.
 */

export type AchievementEvent =
  | {
      kind: 'bout_finished';
      outcome: 'ko_win' | 'ko_loss' | 'flag_loss' | 'draw' | 'decision_win' | 'decision_loss';
      result: 'win' | 'loss' | 'draw';
      level: number;
      ranked: boolean;
      format: string;
      roundsSurvived: number;
      boxingRounds: number;
      clockLeftSeconds: number;
      /** materialBalance(finalFen) from White's (the user's) POV; null if unknown. */
      material: number | null;
      /**
       * Chess facts from the server-side replay of the bout's SAN moves
       * (lib/achievements/bout-facts.ts). Null/absent when the client sent no
       * moves or the replay failed — chess/opening detectors just skip.
       */
      facts?: BoutFacts | null;
      /** Punches landed across the boxing rounds (Quadrant Fight); 0/absent when the camera game was off. */
      punches?: number;
      /** Judges' cards for the user, one per boxing round (0-100); empty when the camera game was off. */
      userCards?: number[];
    }
  | {
      kind: 'workout_finished';
      correct: number;
      punches: number;
      perfect: boolean;
      durationMinutes: number | null;
      bestRoundPoints: number;
      bestCombo: number;
      firedUp: boolean;
      isPersonalBest: boolean;
    };

/** Cross-row facts the detectors need beyond the event itself. */
export interface AchievementContext {
  rows: Map<string, AchievementRow>;
  /** Current do-anything streak (incl. today's just-landed unit). */
  streakCurrent: number;
  /** Days since the previous active day before today (null = first ever / unknown). */
  gapDaysBeforeToday: number | null;
  /** Local hour (0-23) at finish time in the user's timezone. */
  localHour: number;
  /** Finished bouts today with result='loss' (incl. this one). */
  boutLossesToday: number;
  /** Finished workout sessions today (incl. this one). */
  workoutsToday: number;
  /** Consecutive days (ending today) with a ranked bout WIN. */
  rankedWinDayStreak: number;
}

export interface AchievementWrite {
  achievement_id: string;
  tier: number;
  progress: number | null;
  /** True when this write is a fresh unlock or a tier upgrade (not just a counter tick). */
  celebrate: boolean;
}

export interface EvaluateResult {
  writes: AchievementWrite[];
  unlocks: AchievementUnlock[];
}

/** Display band: tier-derived for ladders, def.band (rarity) for binaries. */
function bandFor(def: AchievementDef, tier: number): BeltBand {
  if (def.levelTiered) return beltBandForLevel(tier);
  if (def.thresholds) return beltBandForRung(tier, def.thresholds.length);
  return def.band ?? 'amateur';
}

/** How big the moment plays. Shame stays small — the roast IS the celebration. */
function celebrationSize(def: AchievementDef, tier: number): CelebrationSize {
  if (def.celebration) return def.celebration;
  if (def.secret || def.category === 'shame') return 's';
  const band = bandFor(def, tier);
  if (band === 'champion' || band === 'undisputed') return 'l';
  if (band === 'contender' || band === 'title-shot') return 'm';
  return 's';
}

export function evaluate(event: AchievementEvent, ctx: AchievementContext): EvaluateResult {
  const writes: AchievementWrite[] = [];
  const unlocks: AchievementUnlock[] = [];

  /** Binary achievement: unlock once, never upgrades. */
  const grant = (id: string, when: boolean) => {
    if (!when || ctx.rows.has(id)) return;
    push(id, 1, null, 'unlocked');
  };

  /** Count ladder: add delta to progress; tier = highest threshold reached. */
  const count = (id: string, delta: number) => {
    if (delta <= 0) return;
    const def = getAchievementDef(id);
    if (!def?.thresholds) return;
    const row = ctx.rows.get(id);
    const progress = (row?.progress ?? 0) + delta;
    const tier = def.thresholds.filter((t) => progress >= t).length;
    if (tier === 0) {
      // Below the first rung: persist the counter silently so it's never lost.
      if (row || progress > 0) writes.push({ achievement_id: id, tier: 0, progress, celebrate: false });
      return;
    }
    const prevTier = row?.tier ?? 0;
    if (tier > prevTier) push(id, tier, progress, prevTier === 0 ? 'unlocked' : 'upgraded');
    else writes.push({ achievement_id: id, tier: prevTier, progress, celebrate: false });
  };

  /** Level ladder (1-10): tier = highest value ever; upgrades re-celebrate. */
  const highWater = (id: string, value: number, when = true) => {
    if (!when || value <= 0) return;
    const row = ctx.rows.get(id);
    const prevTier = row?.tier ?? 0;
    if (value > prevTier) push(id, value, row?.progress ?? null, prevTier === 0 ? 'unlocked' : 'upgraded');
  };

  const push = (id: string, tier: number, progress: number | null, kind: 'unlocked' | 'upgraded') => {
    const def = getAchievementDef(id);
    if (!def) return;
    writes.push({ achievement_id: id, tier, progress, celebrate: true });
    unlocks.push({
      id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      category: def.category,
      tier,
      band: bandFor(def, tier),
      kind,
      size: celebrationSize(def, tier),
      secret: def.secret === true,
    });
  };

  if (event.kind === 'bout_finished') {
    const won = event.result === 'win';
    const wentDistance =
      event.boxingRounds > 0 &&
      event.roundsSurvived >= event.boxingRounds &&
      (event.outcome === 'decision_win' || event.outcome === 'decision_loss' || event.outcome === 'draw');

    grant('bout-first-blood', won);
    count('bout-ko-artist', event.outcome === 'ko_win' ? 1 : 0);
    grant('bout-went-the-distance', wentDistance);
    count('bout-judges-favorite', event.outcome === 'decision_win' ? 1 : 0);
    grant('bout-hometown-decision', event.outcome === 'decision_win' && event.material === 0);
    grant('bout-meltdown-button', event.outcome === 'ko_win' && event.material !== null && event.material < 0);
    grant('bout-buzzer-beater', event.outcome === 'ko_win' && event.clockLeftSeconds < 10);
    grant('bout-and-still', event.ranked && won && ctx.rankedWinDayStreak >= 5);
    grant('bout-championship-rounds', event.format === 'championship');
    highWater('bout-up-the-ladder', event.level, won);
    count('bout-sparring-partner', event.ranked ? 0 : 1);

    grant('shame-glass-jaw', event.outcome === 'ko_loss' && event.roundsSurvived === 0);
    grant('shame-flagged', event.outcome === 'flag_loss');
    grant('shame-full-carlsberg', ctx.boutLossesToday >= 5);

    // ── Chess facts (need the replayed move list; skip when absent) ─────────
    const f = event.facts;
    if (f) {
      const koWin = event.outcome === 'ko_win';
      const mate = koWin ? f.matingPiece : null;
      grant('mate-her-majesty', mate === 'q');
      grant('mate-the-lawnmower', mate === 'r');
      grant('mate-long-distance-call', mate === 'b');
      grant('mate-the-horse-kick', mate === 'n');
      grant('mate-pawnbroker', mate === 'p' && !f.isPromotionMate);
      grant('mate-the-quiet-step', mate === 'k' && !f.isCastleMate);
      grant('mate-castle-doctrine', koWin && f.isCastleMate);
      grant('mate-the-sneak', koWin && f.isEnPassantMate);
      grant('mate-coronation-day', koWin && f.isPromotionMate);
      grant('mate-philidors-ghost', koWin && f.isSmotheredMate);
      grant('mate-back-rank-business', koWin && f.isBackRankMate);
      grant('chess-speedrun', koWin && f.plies <= 20);
      grant('chess-the-marathon', f.plies >= 120);
      grant('chess-never-needed-her', koWin && f.userQueenLost);
      grant('chess-untouchable', koWin && f.userLostNothing);
      grant('chess-total-demolition', koWin && f.opponentBareKing);
      grant('chess-field-promotion', won && f.userPromoted);
      grant('chess-the-long-con', won && f.userUnderpromotedKnight);
      grant('chess-harassment-campaign', f.checksByUser >= 10);

      // Opening belts: win a bout with the opening on the board; the belt is
      // the Rookie level beaten, upgrading forever (same ladder as the plan).
      if (won && f.openingSlug) {
        highWater(`opening-${f.openingSlug}`, event.level);
      }
    }
  } else {
    count('puzzle-grinder', event.correct);
    grant('puzzle-combo-meal', event.bestCombo >= 8);
    if (event.perfect && event.durationMinutes) {
      // Tier = the duration band of the longest flawless session (8/16/24/32).
      highWater('puzzle-flawless', Math.max(1, Math.min(4, Math.round(event.durationMinutes / 8))));
    }
    grant('training-fired-up', event.firedUp);
    count('training-thousand-fists', event.punches);
    count('training-new-belt-day', event.isPersonalBest ? 1 : 0);
    grant('training-round-of-your-life', event.bestRoundPoints >= 500);
    grant('training-double-shift', ctx.workoutsToday >= 2);
    // 'shame-three-strikes' is RETIRED: the 3-wrong round-ending rule is gone,
    // so nothing can set it any more. Existing holders keep the medal; the
    // catalog entry stays so their profile still renders it.
  }

  // Dedication — fires on any finished unit.
  {
    const def = getAchievementDef('dedication-the-regular');
    if (def?.thresholds) {
      const row = ctx.rows.get('dedication-the-regular');
      const high = Math.max(row?.progress ?? 0, ctx.streakCurrent);
      const tier = def.thresholds.filter((t) => high >= t).length;
      const prevTier = row?.tier ?? 0;
      if (tier > prevTier) push('dedication-the-regular', tier, high, prevTier === 0 ? 'unlocked' : 'upgraded');
      else if (high > (row?.progress ?? 0) && row) {
        writes.push({ achievement_id: 'dedication-the-regular', tier: prevTier, progress: high, celebrate: false });
      }
    }
  }
  grant('dedication-comeback-kid', ctx.gapDaysBeforeToday !== null && ctx.gapDaysBeforeToday >= 7);
  grant('dedication-night-shift', ctx.localHour >= 0 && ctx.localHour < 4);

  return { writes, unlocks };
}

/** Sanity: every id the engine references exists in the catalog (dev aid). */
export function catalogIds(): string[] {
  return ACHIEVEMENT_CATALOG.map((d) => d.id);
}
