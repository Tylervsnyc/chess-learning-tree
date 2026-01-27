// Curriculum V2 Design Configuration
// These design choices were finalized during the test-curriculum-layout experimentation

export const CURRICULUM_V2_CONFIG = {
  // Layout style
  lessonStyle: 'path' as const, // Duolingo-style path instead of cards

  // Button style for lesson nodes
  buttonStyle: 'flat' as const, // The "Flat" 3D puck style with subtle depth

  // Current lesson indicator
  currentLessonRing: 'pulse' as const, // Pulsing ring animation

  // Block labels between sections
  blockLabels: 'labeled' as const, // Show block names with dividers
  blockTitleAlignment: 'center' as const, // Centered block titles
  blockTitleNumber: false, // No number badge next to block title

  // Section behavior
  sectionsCollapsible: true, // Sections can expand/collapse
  lessonConnectorLines: false, // No lines connecting lessons
  lessonPattern: 'zigzag' as const, // Zigzag horizontal offset pattern

  // Review section styling
  reviewSectionColor: '#E91E63', // Hot Pink
  reviewAnimation: 'none' as const, // No animation on review sections

  // Icon styling
  iconStyle: 'solid-classic' as const, // Traditional chess piece shapes, solid fill
  iconShadowStyle: 'long' as const, // Extended shadow for dramatic 3D pop
  iconSize: 42, // Icon size in pixels

  // Module colors for regular sections (cycle through these)
  moduleColors: [
    '#58CC02', // Green
    '#1CB0F6', // Blue
    '#FF9600', // Orange
    '#FF4B4B', // Red
    '#A560E8', // Purple
    '#2FCBEF', // Cyan
    '#FFC800', // Yellow
    '#FF6B6B', // Coral
  ],

  // Completed lesson styling
  completedColor: '#FFC800', // Gold
  completedDarkColor: '#CC9E00', // Darker gold for 3D effect
  showSparkles: true, // Sparkle animation on completed lessons

  // Locked lesson styling
  lockedColor: '#E5E5E5', // Light gray
  lockedDarkColor: '#AFAFAF', // Darker gray for 3D effect

  // Button dimensions (for "flat" style)
  buttonSize: 76,
  buttonDepthY: 6, // Vertical shadow offset
  buttonDepthX: 3, // Horizontal shadow offset (creates angled view)

  // Ring dimensions for current lesson indicator
  ringSize: 96, // size + 20 to encompass 3D shadow
  ringPadding: 20,
} as const;

// Type exports for use in components
export type LessonStyle = 'cards' | 'path';
export type ButtonStyle = 'arcade' | 'clay' | 'glass' | 'candy'; // clay = flat
export type RingStyle = 'dashed' | 'pulse' | 'gradient' | 'dots';
export type BlockLabelStyle = 'none' | 'divider' | 'labeled';
export type ReviewAnimation = 'none' | 'pulse' | 'glow' | 'bounce';
export type IconStyle = 'solid-classic'; // Classic chess piece shapes with solid fill
export type IconShadowStyle = 'drop' | 'long' | 'emboss' | 'crisp'; // long = extended shadow for 3D pop
export type BlockTitleAlignment = 'left' | 'center';
export type LessonPattern = 'zigzag' | 'straight' | 'wave';

// =============================================================================
// PUZZLE VALIDATION RULES FOR MULTI-THEME COMBINATIONS
// =============================================================================
// Use these rules when vetting puzzles for curriculum placement to determine
// if a puzzle truly contains multiple tactical themes vs co-occurring noise.

/**
 * Tactical Theme Hierarchy Levels
 * A single move can only be PRIMARY at one level.
 */
export const THEME_HIERARCHY = {
  FORCING: ['check', 'capture', 'threat'] as const,
  ENABLER: ['attraction', 'deflection', 'clearance', 'destructionOfDefender', 'interference', 'sacrifice'] as const,
  MECHANISM: ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck', 'xRayAttack'] as const,
  OUTCOME: ['checkmate', 'materialGain', 'equality', 'advantage'] as const,
} as const;

export type ThemeLevel = keyof typeof THEME_HIERARCHY;
export type ForcingTheme = typeof THEME_HIERARCHY.FORCING[number];
export type EnablerTheme = typeof THEME_HIERARCHY.ENABLER[number];
export type MechanismTheme = typeof THEME_HIERARCHY.MECHANISM[number];
export type OutcomeTheme = typeof THEME_HIERARCHY.OUTCOME[number];
export type TacticalTheme = ForcingTheme | EnablerTheme | MechanismTheme | OutcomeTheme;

/**
 * Puzzle Validation Rules
 *
 * RULE 1: Each Move Lives at ONE Level
 * A single move can only be PRIMARY at one level of the hierarchy.
 * Example: If a move is check AND fork, check is the forcing tool and fork is the mechanism.
 * The insight is the fork.
 *
 * RULE 2: Valid Combinations Span Levels or Are Sequential
 * VALID - Different levels:
 *   Move 1: ENABLER (deflection) → Move 2: MECHANISM (fork)
 *   The deflection enabled the fork. This is a true combination.
 * VALID - Same level, different moves:
 *   Move 1: MECHANISM (fork) → Move 3: MECHANISM (discovered attack)
 *   Fork capture creates discovered attack. They're sequential.
 * INVALID - Same level, same move:
 *   Move 1 tagged as both "fork" AND "pin"
 *   Both are mechanisms. A move can't be two mechanisms. One is noise.
 *
 * RULE 3: Forcing Moves Are Tools, Not Themes
 * Check, capture, and threat are HOW you accomplish things, not WHAT you accomplish.
 * Don't teach check as a separate theme unless the puzzle is specifically about
 * the POWER of check (e.g., double check where only king moves are legal).
 *
 * RULE 4: Outcomes Absorb Everything
 * If the puzzle ends in checkmate, everything else was just how you got there.
 * Don't tag "fork" if the fork includes the king and it's mate—that's just mate.
 *
 * RULE 5: Enablers Must Enable Something
 * If "deflection" is tagged but nothing was enabled by it, it's noise.
 * Always ask: "What did this enabler enable?"
 *
 * RULE 6: For Valid Multi-Theme Combinations, Trace the Flow
 * You must be able to draw the path connecting the themes:
 *   Move 1: [FORCING or ENABLER] → enables → Move 2: [MECHANISM] → achieves → Outcome
 */

export const PUZZLE_VALIDATION_RULES = {
  /**
   * Get the hierarchy level for a given theme
   */
  getThemeLevel: (theme: string): ThemeLevel | null => {
    const normalizedTheme = theme.toLowerCase().replace(/[-_\s]/g, '');
    for (const [level, themes] of Object.entries(THEME_HIERARCHY)) {
      if ((themes as readonly string[]).some(t => t.toLowerCase() === normalizedTheme)) {
        return level as ThemeLevel;
      }
    }
    return null;
  },

  /**
   * Check if two themes are at the same hierarchy level
   */
  areSameLevel: (theme1: string, theme2: string): boolean => {
    const level1 = PUZZLE_VALIDATION_RULES.getThemeLevel(theme1);
    const level2 = PUZZLE_VALIDATION_RULES.getThemeLevel(theme2);
    return level1 !== null && level2 !== null && level1 === level2;
  },

  /**
   * Validation Decision Tree:
   * - Same level + same move = INVALID (one is noise)
   * - Different levels OR sequential moves = VALID combination
   * - Themes present but flow doesn't connect = co-occurrence, not combination
   */
  isValidMultiThemeCombination: (themes: string[], moveCount: number = 1): {
    valid: boolean;
    reason: string;
    primaryTheme?: string;
    secondaryThemes?: string[];
  } => {
    if (themes.length < 2) {
      return { valid: true, reason: 'Single theme puzzle', primaryTheme: themes[0] };
    }

    const themeLevels = themes.map(t => ({
      theme: t,
      level: PUZZLE_VALIDATION_RULES.getThemeLevel(t)
    }));

    // Group themes by level
    const byLevel: Record<string, string[]> = {};
    for (const { theme, level } of themeLevels) {
      if (level) {
        byLevel[level] = byLevel[level] || [];
        byLevel[level].push(theme);
      }
    }

    // Check for multiple mechanisms in a single-move puzzle
    if (moveCount === 1 && byLevel.MECHANISM && byLevel.MECHANISM.length > 1) {
      return {
        valid: false,
        reason: `Multiple mechanisms (${byLevel.MECHANISM.join(', ')}) on single move - one is noise`,
        primaryTheme: byLevel.MECHANISM[0],
      };
    }

    // Check for outcome absorption
    if (byLevel.OUTCOME?.includes('checkmate')) {
      const mechanisms = byLevel.MECHANISM || [];
      if (mechanisms.length > 0) {
        return {
          valid: true,
          reason: 'Outcome (checkmate) absorbs mechanism - categorize as checkmate',
          primaryTheme: 'checkmate',
          secondaryThemes: mechanisms,
        };
      }
    }

    // Valid: themes span different levels
    const levels = Object.keys(byLevel);
    if (levels.length > 1) {
      // Prioritize: MECHANISM > ENABLER > FORCING > OUTCOME for primary theme
      const priorityOrder: ThemeLevel[] = ['MECHANISM', 'ENABLER', 'OUTCOME', 'FORCING'];
      for (const level of priorityOrder) {
        if (byLevel[level]?.length) {
          return {
            valid: true,
            reason: `Valid combination spanning ${levels.join(' → ')}`,
            primaryTheme: byLevel[level][0],
            secondaryThemes: themes.filter(t => t !== byLevel[level][0]),
          };
        }
      }
    }

    // Multiple moves can have same-level themes if sequential
    if (moveCount > 1 && byLevel.MECHANISM && byLevel.MECHANISM.length > 1) {
      return {
        valid: true,
        reason: 'Sequential mechanisms across multiple moves',
        primaryTheme: byLevel.MECHANISM[0],
        secondaryThemes: byLevel.MECHANISM.slice(1),
      };
    }

    return {
      valid: false,
      reason: 'Themes do not form a connected tactical flow',
      primaryTheme: themes[0],
    };
  },
} as const;

/**
 * Quick Reference: Validation Checklist
 * 1. Can I assign each tagged theme to a different move OR different level?
 * 2. Can I trace a flow from forcing → enabler → mechanism → outcome?
 * 3. Does each enabler actually enable something in the flow?
 * 4. Is the outcome absorbing a mechanism?
 */
export const VALIDATION_CHECKLIST = [
  'Each tagged theme maps to different move OR different hierarchy level',
  'Can trace flow: FORCING → ENABLER → MECHANISM → OUTCOME',
  'Each enabler actually enables something downstream',
  'Check if outcome absorbs the mechanism (mate absorbs fork-with-king)',
] as const;

// =============================================================================
// CURRICULUM STRUCTURE VALIDATION RULES
// =============================================================================
// Rules for building lessons to ensure variety and good learning experience

export interface LessonForValidation {
  id: string;
  name: string;
  pieceFilter?: 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  requiredTags: string[];
  isMixedPractice?: boolean;
}

export interface SectionForValidation {
  id: string;
  name: string;
  lessons: LessonForValidation[];
}

export interface BlockForValidation {
  id: string;
  name: string;
  sections: SectionForValidation[];
}

export interface LevelForValidation {
  id: string;
  name: string;
  blocks: BlockForValidation[];
}

export interface ValidationIssue {
  rule: string;
  severity: 'error' | 'warning';
  location: string;
  message: string;
  suggestion?: string;
}

/**
 * Curriculum Structure Rules
 * These rules ensure variety and prevent repetitive lesson sequences
 */
export const CURRICULUM_STRUCTURE_RULES = {
  /**
   * RULE 1: No consecutive lessons with same piece filter
   * Prevents: Queen, Queen, Queen, Queen in a row
   * Allows: Queen, Rook, Queen, Knight (interleaved)
   */
  MAX_CONSECUTIVE_SAME_PIECE: 1,

  /**
   * RULE 2: No consecutive lessons with identical required tags
   * Prevents: mateIn1, mateIn1, mateIn1, mateIn1 (same tags)
   * Allows: mateIn1+queen, mateIn1+rook (different combinations)
   */
  MAX_CONSECUTIVE_SAME_TAGS: 2,

  /**
   * RULE 3: Within a section, aim for piece variety
   * A 4-lesson section should have at least this many unique pieces
   */
  MIN_UNIQUE_PIECES_PER_SECTION: 2,

  /**
   * RULE 4: Review sections should mix themes
   * Review sections must be marked as mixed practice
   */
  REVIEW_MUST_BE_MIXED: true,
} as const;

/**
 * Validate a single section for curriculum rules
 */
function validateSection(
  section: SectionForValidation,
  blockId: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const lessons = section.lessons;

  // Track consecutive same piece
  let consecutiveSamePiece = 1;
  let lastPieceFilter: string | undefined = lessons[0]?.pieceFilter;

  // Track consecutive same tags
  let consecutiveSameTags = 1;
  let lastTags = lessons[0]?.requiredTags?.join(',') || '';

  // Track unique pieces in section
  const uniquePieces = new Set<string>();
  if (lessons[0]?.pieceFilter) uniquePieces.add(lessons[0].pieceFilter);

  for (let i = 1; i < lessons.length; i++) {
    const lesson = lessons[i];
    const prevLesson = lessons[i - 1];

    // Check piece filter
    if (lesson.pieceFilter) {
      uniquePieces.add(lesson.pieceFilter);
    }

    // Rule 1: Consecutive same piece filter
    if (lesson.pieceFilter && lesson.pieceFilter === lastPieceFilter) {
      consecutiveSamePiece++;
      if (consecutiveSamePiece > CURRICULUM_STRUCTURE_RULES.MAX_CONSECUTIVE_SAME_PIECE) {
        issues.push({
          rule: 'MAX_CONSECUTIVE_SAME_PIECE',
          severity: 'error',
          location: `${blockId} > ${section.id} > lessons ${i} and ${i + 1}`,
          message: `${consecutiveSamePiece} consecutive lessons with pieceFilter="${lesson.pieceFilter}"`,
          suggestion: `Interleave with different pieces. Consider: ${
            ['queen', 'rook', 'bishop', 'knight', 'pawn']
              .filter(p => p !== lesson.pieceFilter)
              .slice(0, 2)
              .join(', ')
          }`,
        });
      }
    } else {
      consecutiveSamePiece = 1;
      lastPieceFilter = lesson.pieceFilter;
    }

    // Rule 2: Consecutive same required tags
    const currentTags = lesson.requiredTags?.join(',') || '';
    if (currentTags === lastTags && currentTags !== '') {
      consecutiveSameTags++;
      if (consecutiveSameTags > CURRICULUM_STRUCTURE_RULES.MAX_CONSECUTIVE_SAME_TAGS) {
        issues.push({
          rule: 'MAX_CONSECUTIVE_SAME_TAGS',
          severity: 'warning',
          location: `${blockId} > ${section.id} > lessons ${i} and ${i + 1}`,
          message: `${consecutiveSameTags} consecutive lessons with same tags: [${currentTags}]`,
          suggestion: 'Vary the required tags or add piece filters to differentiate',
        });
      }
    } else {
      consecutiveSameTags = 1;
      lastTags = currentTags;
    }
  }

  // Rule 3: Minimum unique pieces per section
  const pieceLessons = lessons.filter(l => l.pieceFilter);
  if (pieceLessons.length >= 3 && uniquePieces.size < CURRICULUM_STRUCTURE_RULES.MIN_UNIQUE_PIECES_PER_SECTION) {
    issues.push({
      rule: 'MIN_UNIQUE_PIECES_PER_SECTION',
      severity: 'warning',
      location: `${blockId} > ${section.id}`,
      message: `Section has ${pieceLessons.length} piece-filtered lessons but only ${uniquePieces.size} unique piece(s)`,
      suggestion: 'Add variety by using different piece filters',
    });
  }

  // Rule 4: Review sections should be mixed practice
  const isReviewSection = section.name.toLowerCase().includes('review') ||
                          section.id.toLowerCase().includes('review');
  if (isReviewSection && CURRICULUM_STRUCTURE_RULES.REVIEW_MUST_BE_MIXED) {
    const nonMixedLessons = lessons.filter(l => !l.isMixedPractice);
    if (nonMixedLessons.length > 0) {
      issues.push({
        rule: 'REVIEW_MUST_BE_MIXED',
        severity: 'warning',
        location: `${blockId} > ${section.id}`,
        message: `Review section has ${nonMixedLessons.length} lessons not marked as mixed practice`,
        suggestion: 'Set isMixedPractice: true for review lessons',
      });
    }
  }

  return issues;
}

/**
 * Validate an entire curriculum level for structure rules
 */
export function validateCurriculumStructure(level: LevelForValidation): {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  summary: string;
} {
  const allIssues: ValidationIssue[] = [];

  for (const block of level.blocks) {
    for (const section of block.sections) {
      const sectionIssues = validateSection(section, block.id);
      allIssues.push(...sectionIssues);
    }

    // Also check across section boundaries within a block
    const allLessonsInBlock: LessonForValidation[] = [];
    for (const section of block.sections) {
      allLessonsInBlock.push(...section.lessons);
    }

    // Check last lesson of one section vs first of next
    for (let s = 0; s < block.sections.length - 1; s++) {
      const lastLesson = block.sections[s].lessons[block.sections[s].lessons.length - 1];
      const firstLesson = block.sections[s + 1].lessons[0];

      if (lastLesson?.pieceFilter && lastLesson.pieceFilter === firstLesson?.pieceFilter) {
        allIssues.push({
          rule: 'CROSS_SECTION_PIECE_VARIETY',
          severity: 'warning',
          location: `${block.id} > between ${block.sections[s].id} and ${block.sections[s + 1].id}`,
          message: `Last lesson of section and first lesson of next both use pieceFilter="${lastLesson.pieceFilter}"`,
          suggestion: 'Reorder lessons at section boundaries for variety',
        });
      }
    }
  }

  const errors = allIssues.filter(i => i.severity === 'error');
  const warnings = allIssues.filter(i => i.severity === 'warning');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: errors.length === 0
      ? `✓ Curriculum structure valid (${warnings.length} warnings)`
      : `✗ ${errors.length} errors, ${warnings.length} warnings`,
  };
}

/**
 * Helper: Suggest an interleaved lesson order
 * Given a list of lessons, returns a reordered list that maximizes variety
 */
export function suggestInterleavedOrder(lessons: LessonForValidation[]): LessonForValidation[] {
  if (lessons.length <= 2) return lessons;

  // Group lessons by piece filter
  const byPiece: Record<string, LessonForValidation[]> = { 'none': [] };
  for (const lesson of lessons) {
    const key = lesson.pieceFilter || 'none';
    if (!byPiece[key]) byPiece[key] = [];
    byPiece[key].push(lesson);
  }

  // Interleave: pick from each group in round-robin fashion
  const result: LessonForValidation[] = [];
  const pieceTypes = Object.keys(byPiece).filter(k => byPiece[k].length > 0);
  let pieceIndex = 0;

  while (result.length < lessons.length) {
    // Find next piece type with remaining lessons
    let found = false;
    for (let i = 0; i < pieceTypes.length; i++) {
      const idx = (pieceIndex + i) % pieceTypes.length;
      const pieceType = pieceTypes[idx];
      if (byPiece[pieceType].length > 0) {
        result.push(byPiece[pieceType].shift()!);
        pieceIndex = (idx + 1) % pieceTypes.length;
        found = true;
        break;
      }
    }
    if (!found) break;
  }

  return result;
}

/**
 * Run validation and print results (for CLI/debugging)
 */
export function printValidationReport(level: LevelForValidation): void {
  const result = validateCurriculumStructure(level);

  console.log('\n' + '='.repeat(60));
  console.log(`CURRICULUM VALIDATION: ${level.name}`);
  console.log('='.repeat(60));
  console.log(result.summary);

  if (result.errors.length > 0) {
    console.log('\n❌ ERRORS (must fix):');
    for (const error of result.errors) {
      console.log(`  [${error.rule}] ${error.location}`);
      console.log(`    ${error.message}`);
      if (error.suggestion) console.log(`    💡 ${error.suggestion}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (should fix):');
    for (const warning of result.warnings) {
      console.log(`  [${warning.rule}] ${warning.location}`);
      console.log(`    ${warning.message}`);
      if (warning.suggestion) console.log(`    💡 ${warning.suggestion}`);
    }
  }

  console.log('='.repeat(60) + '\n');
}
