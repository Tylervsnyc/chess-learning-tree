/**
 * Lichess puzzle theme → the FIRST Chess Path lesson that teaches it.
 *
 * Used by the Chess Boxing miss report to deep-link "Learn why in Chess Path"
 * at the exact lesson. A static map on purpose: the real lookup lives in the
 * curriculum registry, which is 272K of level data the Chess Boxing bundle
 * must NOT ship (the 1.0.6 slim-down drops the lesson routes entirely).
 *
 * GENERATED — regenerate after the curriculum changes:
 *   npx tsx -e "import { LEVELS } from './lib/curriculum-registry';
 *     const m: Record<string,string> = {};
 *     for (const { data } of LEVELS as any) for (const b of data.blocks)
 *       for (const s of b.sections) for (const l of s.lessons) {
 *         if (l.isMixedPractice) continue;
 *         for (const t of l.requiredTags ?? []) if (!m[t]) m[t] = l.id; }
 *     console.log(JSON.stringify(m));"
 */
export const THEME_LESSON: Record<string, string> = {
  mateIn1: '1.1.1',
  backRankMate: '1.2.1',
  smotheredMate: '1.2.2',
  arabianMate: '1.2.3',
  hookMate: '1.2.4',
  mateIn2: '1.3.1',
  mateIn3: '1.3.4',
  hangingPiece: '1.5.1',
  crushing: '1.5.2',
  fork: '1.6.1',
  skewer: '1.7.1',
  rookEndgame: '1.9.1',
  pawnEndgame: '1.10.1',
  promotion: '1.10.3',
  deflection: '1.11.1',
  trappedPiece: '1.11.2',
  knightEndgame: '1.11.3',
  bishopEndgame: '1.11.4',
  pin: '2.5.1',
  discoveredAttack: '2.9.1',
  attraction: '3.2.1',
  clearance: '3.3.1',
  interference: '3.3.3',
  sacrifice: '3.5.1',
  kingsideAttack: '4.1.2',
  exposedKing: '4.3.1',
  mateIn4: '4.5.1',
  quietMove: '4.6.1',
  advancedPawn: '4.10.3',
  mateIn5: '5.1.1',
  doubleCheck: '5.2.1',
  defensiveMove: '5.5.1',
  queenEndgame: '5.11.3',
  intermezzo: '6.2.1',
  xRayAttack: '6.3.1',
  queensideAttack: '8.11.2',
};

/** Themes that describe the outcome, not the idea — only used as a last resort. */
const GENERIC = new Set(['crushing']);

/**
 * Web path for the lesson that teaches the most specific theme in `themes`,
 * or the lesson tree when none of them map.
 */
export function lessonPathForThemes(themes: readonly string[] | undefined): string {
  let fallback: string | null = null;
  for (const t of themes ?? []) {
    const id = THEME_LESSON[t];
    if (!id) continue;
    if (!GENERIC.has(t)) return `/lesson/${id}`;
    fallback ??= `/lesson/${id}`;
  }
  return fallback ?? '/path';
}
