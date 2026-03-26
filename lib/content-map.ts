/**
 * Content Map — maps tactical themes to existing lessons & openings
 *
 * Used by Rookie's coaching system to recommend specific content
 * based on user weaknesses identified during post-game review.
 */

import { LEVELS, LessonCriteria } from '@/lib/curriculum-registry';
import { OPENINGS_REGISTRY } from '@/data/openings/registry';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface ContentRecommendation {
  type: 'lesson' | 'opening';
  id: string;               // Lesson ID (e.g., "2.1.1") or opening slug
  name: string;
  description: string;
  level: number;             // 1-8 for lessons, 0 for openings
  levelName: string;
  sectionName: string;
  theme: string;             // Primary theme this addresses
  piece?: string;            // Piece focus if any
  ratingRange: [number, number];
}

export interface ThemeEntry {
  theme: string;
  friendlyName: string;
  lessons: ContentRecommendation[];
  openings: ContentRecommendation[];
}

// ════════════════════════════════
// FRIENDLY THEME NAMES
// ════════════════════════════════

const THEME_NAMES: Record<string, string> = {
  fork: 'Fork',
  pin: 'Pin',
  skewer: 'Skewer',
  discoveredAttack: 'Discovered Attack',
  doubleCheck: 'Double Check',
  xRayAttack: 'X-Ray Attack',
  hangingPiece: 'Hanging Piece',
  trappedPiece: 'Trapped Piece',
  attraction: 'Attraction',
  deflection: 'Deflection',
  sacrifice: 'Sacrifice',
  clearance: 'Clearance',
  interference: 'Interference',
  intermezzo: 'Intermezzo',
  quietMove: 'Quiet Move',
  defensiveMove: 'Defensive Move',
  backRankMate: 'Back Rank Mate',
  mateIn1: 'Mate in 1',
  mateIn2: 'Mate in 2',
  mateIn3: 'Mate in 3',
  mateIn4: 'Mate in 4',
  mateIn5: 'Mate in 5',
  smotheredMate: 'Smothered Mate',
  hookMate: 'Hook Mate',
  arabianMate: 'Arabian Mate',
  doubleBishopMate: 'Double Bishop Mate',
  dovetailMate: 'Dovetail Mate',
  advancedPawn: 'Advanced Pawn',
  promotion: 'Promotion',
  underPromotion: 'Under-Promotion',
  exposedKing: 'Exposed King',
  kingsideAttack: 'Kingside Attack',
  queensideAttack: 'Queenside Attack',
  crushing: 'Crushing',
  zugzwang: 'Zugzwang',
  pawnEndgame: 'Pawn Endgame',
  rookEndgame: 'Rook Endgame',
  bishopEndgame: 'Bishop Endgame',
  knightEndgame: 'Knight Endgame',
  queenEndgame: 'Queen Endgame',
};

// Opening concepts mapped to the themes they reinforce
const OPENING_THEME_MAP: Record<string, string[]> = {
  italian: ['development', 'centerControl', 'kingsideAttack'],
  'ruy-lopez': ['pin', 'centerControl', 'development'],
  sicilian: ['counterplay', 'queensideAttack', 'sacrifice'],
  french: ['advancedPawn', 'defensiveMove', 'counterplay'],
  'caro-kann': ['defensiveMove', 'development', 'pawnEndgame'],
  london: ['development', 'centerControl', 'quietMove'],
  pirc: ['counterplay', 'kingsideAttack', 'development'],
  'kings-gambit': ['sacrifice', 'kingsideAttack', 'exposedKing'],
  scotch: ['centerControl', 'fork', 'development'],
  'kings-indian': ['kingsideAttack', 'sacrifice', 'advancedPawn'],
};

// ════════════════════════════════
// BUILD THE MAP (runs once at import)
// ════════════════════════════════

const themeMap = new Map<string, ThemeEntry>();

function ensureTheme(theme: string): ThemeEntry {
  if (!themeMap.has(theme)) {
    themeMap.set(theme, {
      theme,
      friendlyName: THEME_NAMES[theme] || theme,
      lessons: [],
      openings: [],
    });
  }
  return themeMap.get(theme)!;
}

// Index all lessons across all levels
for (const levelConfig of LEVELS) {
  const levelNum = levelConfig.level;
  const levelName = levelConfig.data.name;

  for (const block of levelConfig.data.blocks) {
    for (const section of block.sections) {
      for (const lesson of section.lessons) {
        const themes = lesson.isMixedPractice && lesson.mixedThemes
          ? lesson.mixedThemes
          : lesson.requiredTags;

        for (const theme of themes) {
          const entry = ensureTheme(theme);
          entry.lessons.push({
            type: 'lesson',
            id: lesson.id,
            name: lesson.name,
            description: lesson.description,
            level: levelNum,
            levelName,
            sectionName: section.name,
            theme,
            piece: lesson.pieceFilter,
            ratingRange: [lesson.ratingMin, lesson.ratingMax],
          });
        }
      }
    }
  }
}

// Index openings
if (typeof OPENINGS_REGISTRY !== 'undefined') {
  try {
    for (const opening of OPENINGS_REGISTRY) {
      if (!opening.hasData) continue;
      const themes = OPENING_THEME_MAP[opening.slug] || ['development'];

      for (const theme of themes) {
        const entry = ensureTheme(theme);
        entry.openings.push({
          type: 'opening',
          id: opening.slug,
          name: opening.name,
          description: opening.subtitle,
          level: 0,
          levelName: 'Openings',
          sectionName: opening.category,
          theme,
          ratingRange: [400, 1600],
        });
      }
    }
  } catch {
    // Registry may not be available in all contexts
  }
}

// ════════════════════════════════
// PUBLIC API
// ════════════════════════════════

/** Get all content for a specific theme */
export function getContentForTheme(theme: string): ThemeEntry | null {
  return themeMap.get(theme) || null;
}

/** Get all available themes */
export function getAllThemes(): string[] {
  return Array.from(themeMap.keys());
}

/** Get the friendly display name for a theme */
export function getThemeName(theme: string): string {
  return THEME_NAMES[theme] || theme;
}

/**
 * Get personalized recommendations based on weak themes.
 *
 * @param weakThemes - themes the user struggled with, ordered by weakness
 * @param completedLessonIds - lessons the user already completed (to filter out)
 * @param maxPerTheme - max recommendations per theme (default 2)
 * @returns recommendations sorted by relevance
 */
export function getRecommendations(
  weakThemes: string[],
  completedLessonIds: Set<string> = new Set(),
  maxPerTheme = 2,
): ContentRecommendation[] {
  const results: ContentRecommendation[] = [];

  for (const theme of weakThemes) {
    const entry = themeMap.get(theme);
    if (!entry) continue;

    // Filter out completed lessons, prefer lower levels first (easier content)
    const available = entry.lessons
      .filter(l => !completedLessonIds.has(l.id))
      .sort((a, b) => a.level - b.level || a.ratingRange[0] - b.ratingRange[0]);

    const picked = available.slice(0, maxPerTheme);
    results.push(...picked);

    // Add one opening recommendation if relevant
    if (entry.openings.length > 0) {
      results.push(entry.openings[0]);
    }
  }

  return results;
}

/**
 * Get a Rookie-style recommendation message for a weak theme.
 * Returns null if no content exists for this theme.
 */
export function getRookieRecommendation(
  theme: string,
  completedLessonIds: Set<string> = new Set(),
): { message: string; lessonId: string; lessonName: string } | null {
  const entry = themeMap.get(theme);
  if (!entry) return null;

  const available = entry.lessons
    .filter(l => !completedLessonIds.has(l.id))
    .sort((a, b) => a.level - b.level || a.ratingRange[0] - b.ratingRange[0]);

  if (available.length === 0) return null;

  const lesson = available[0];
  const themeName = entry.friendlyName.toLowerCase();

  return {
    message: `I have a lesson on ${themeName}s. ${lesson.name} in ${lesson.sectionName}. Want to try it?`,
    lessonId: lesson.id,
    lessonName: lesson.name,
  };
}
