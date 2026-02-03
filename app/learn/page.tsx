'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { LEVELS, getAllLessonIds, getLevelLessonIds, Block, Section, LessonCriteria } from '@/lib/curriculum-registry';
import { level1V2 } from '@/data/staging/level1-v2-curriculum';
import { CURRICULUM_V2_CONFIG } from '@/data/curriculum-v2-config';
import { useLessonProgress } from '@/hooks/useProgress';
import { useUser } from '@/hooks/useUser';
import { StreakCelebrationPopup } from '@/components/streak/StreakCelebrationPopup';

// Types
type PieceType = 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | 'star';
type LessonStatus = 'completed' | 'current' | 'unlocked' | 'locked';

// Check if a level is completed
function isLevelCompleted(levelNum: number, completedLessons: string[]): boolean {
  const levelLessonIds = getLevelLessonIds(levelNum);
  return levelLessonIds.every(id => completedLessons.includes(id));
}

// Determine lesson status - uses isLessonUnlocked from hook (ONE source of truth)
// overrideCurrentId: When navigating from a completed lesson, show this as "current" instead of first gap
function getLessonStatus(
  lessonId: string,
  completedLessons: string[],
  allLessonIds: string[],
  isUnlockedFn: (lessonId: string, allLessonIds: string[]) => boolean,
  overrideCurrentId: string | null = null
): LessonStatus {
  // Completed lessons are always completed
  if (completedLessons.includes(lessonId)) return 'completed';

  // Use the hook's unlock function (respects unlockedLevels, startingLessonId, etc.)
  const isUnlocked = isUnlockedFn(lessonId, allLessonIds);

  if (!isUnlocked) return 'locked';

  // If we have an override (from URL scrollTo), use that as current
  if (overrideCurrentId && lessonId === overrideCurrentId) {
    return 'current';
  }

  // Find the first unlocked but incomplete lesson (current) - only if no override
  if (!overrideCurrentId) {
    const firstCurrent = allLessonIds.find(id => {
      if (completedLessons.includes(id)) return false;
      return isUnlockedFn(id, allLessonIds);
    });

    if (lessonId === firstCurrent) return 'current';
  }

  // Unlocked but not the first current - show as unlocked (clickable but not highlighted)
  return 'unlocked';
}

// Assign piece types to lessons
const PIECE_CYCLE: PieceType[] = ['knight', 'queen', 'rook', 'bishop', 'pawn', 'star'];

function getPieceForLesson(lesson: LessonCriteria, lessonIndex: number, sectionIndex: number): PieceType {
  if (lesson.pieceFilter) {
    return lesson.pieceFilter as PieceType;
  }

  // Smothered mates are always delivered by knights
  const hasSmotheredMate = lesson.requiredTags?.some(tag =>
    tag.toLowerCase().includes('smother')
  );
  if (hasSmotheredMate) {
    return 'knight';
  }

  return PIECE_CYCLE[(lessonIndex + sectionIndex * 2) % PIECE_CYCLE.length];
}

function darkenColor(hex: string, amount: number = 0.25): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) * (1 - amount));
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) * (1 - amount));
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) * (1 - amount));
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Chess piece icon paths
type CircleElement = { type: 'circle'; cx: number; cy: number; r: number };
type PathElement = { type: 'path'; d: string };
type PolygonElement = { type: 'polygon'; points: string };
type PieceElement = CircleElement | PathElement | PolygonElement;

const PIECE_PATHS: Record<PieceType, { viewBox: string; elements: PieceElement[] }> = {
  queen: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'circle', cx: 6, cy: 12, r: 3 },
      { type: 'circle', cx: 14, cy: 9, r: 3 },
      { type: 'circle', cx: 22.5, cy: 8, r: 3 },
      { type: 'circle', cx: 31, cy: 9, r: 3 },
      { type: 'circle', cx: 39, cy: 12, r: 3 },
      { type: 'path', d: 'M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z' },
      { type: 'path', d: 'M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z' },
    ],
  },
  rook: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M9 39h27v-3H9v3zM12 36v-4h21v4H12zM14 29.5v-13h17v13H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11zM12.5 32l1.5-2.5h17l1.5 2.5z' },
    ],
  },
  bishop: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z' },
      { type: 'path', d: 'M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z' },
      { type: 'circle', cx: 22.5, cy: 8, r: 3 },
    ],
  },
  knight: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21' },
      { type: 'path', d: 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3' },
    ],
  },
  pawn: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z' },
    ],
  },
  star: {
    viewBox: '0 0 24 24',
    elements: [
      { type: 'polygon', points: '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26' },
    ],
  },
};

function renderPieceElements(piece: PieceType, fill: string, transform?: string) {
  const data = PIECE_PATHS[piece];
  return data.elements.map((el, i) => {
    if (el.type === 'circle') {
      return <circle key={i} fill={fill} transform={transform} cx={el.cx} cy={el.cy} r={el.r} />;
    } else if (el.type === 'path') {
      return <path key={i} fill={fill} transform={transform} d={el.d} />;
    } else if (el.type === 'polygon') {
      return <polygon key={i} fill={fill} transform={transform} points={el.points} />;
    }
    return null;
  });
}

function getIconLongShadow(piece: PieceType, color: string, size: number) {
  const data = PIECE_PATHS[piece];
  const layers = 4;

  return (
    <svg width={size} height={size} viewBox={data.viewBox}>
      {Array.from({ length: layers }).map((_, i) => (
        <g key={i} opacity={0.15 - i * 0.03}>
          {renderPieceElements(piece, '#000', `translate(${(layers - i) * 0.8}, ${(layers - i) * 0.8})`)}
        </g>
      ))}
      <g>{renderPieceElements(piece, color)}</g>
    </svg>
  );
}

function LockIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Sparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
      <div className="absolute w-2 h-2" style={{ top: '15%', left: '20%', animation: 'sparkle 2s ease-in-out infinite' }}>
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"/>
        </svg>
      </div>
      <div className="absolute w-1.5 h-1.5" style={{ top: '60%', right: '15%', animation: 'sparkle 2s ease-in-out infinite', animationDelay: '0.7s' }}>
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"/>
        </svg>
      </div>
    </div>
  );
}

// Locked Level Card - shows between levels
function LockedLevelCard({
  levelNum,
  levelData,
  levelColor,
  darkColor,
  isUnlocked,
  prevLevelCompleted,
  isLoggedIn,
}: {
  levelNum: number;
  levelData: typeof level1V2;
  levelColor: string;
  darkColor: string;
  isUnlocked: boolean;
  prevLevelCompleted: boolean;
  isLoggedIn: boolean;
}) {
  const testTransition = `${levelNum - 1}-${levelNum}`;

  if (isUnlocked) {
    return null; // Don't show card if level is unlocked
  }

  return (
    <div className="my-8">
      {/* Connector line */}
      <div className="flex justify-center mb-4">
        <div className="w-1 h-8 bg-gray-300 rounded-full" />
      </div>

      {/* Level card */}
      <div
        className="mx-4 rounded-2xl p-6 text-center relative overflow-hidden"
        style={{ backgroundColor: '#E5E7EB' }}
      >
        {/* Lock overlay pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)`,
          }} />
        </div>

        <div className="relative">
          {/* Level badge */}
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: levelColor, opacity: 0.5 }}
          >
            <LockIcon size={32} color="white" />
          </div>

          {/* Level name */}
          <h3 className="text-xl font-black text-gray-500 mb-1">
            Level {levelNum}
          </h3>
          <p className="text-sm text-gray-400 mb-1">
            {levelData.name}
          </p>
          <p className="text-xs text-gray-400 mb-4">
            {levelData.ratingRange} ELO
          </p>

          {/* Unlock options */}
          <div className="space-y-2">
            {isLoggedIn ? (
              <>
                {prevLevelCompleted ? (
                  <p className="text-sm text-gray-500 mb-3">
                    Complete Level {levelNum - 1} to unlock, or take the test
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">
                    Complete Level {levelNum - 1} or take the placement test
                  </p>
                )}

                <Link
                  href={`/level-test/${testTransition}`}
                  className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                  style={{
                    backgroundColor: levelColor,
                    boxShadow: `0 4px 0 ${darkColor}`,
                  }}
                >
                  Take Level {levelNum} Test
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  Sign in to take the placement test and unlock this level
                </p>

                <Link
                  href="/auth/login?redirect=/learn"
                  className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                  style={{
                    backgroundColor: levelColor,
                    boxShadow: `0 4px 0 ${darkColor}`,
                  }}
                >
                  Sign In to Take Test
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to find which section contains a lesson
function findSectionForLesson(lessonId: string): string | null {
  for (const { data } of LEVELS) {
    for (const block of data.blocks) {
      for (const section of block.sections) {
        if (section.lessons.some(l => l.id === lessonId)) {
          return section.id;
        }
      }
    }
  }
  return null;
}

export default function LearnPage() {
  const searchParams = useSearchParams();
  const scrollToLessonId = searchParams.get('scrollTo');

  // Track completed lessons and unlocked levels
  const {
    completedLessons,
    unlockedLevels,
    unlockLevel,
    startingLessonId,
    isLessonUnlocked,
    loaded: progressLoaded,
    currentStreak,
    streakJustExtended,
    previousStreak,
    dismissStreakCelebration,
  } = useLessonProgress();

  // Get all lesson IDs for determining current lesson
  const allLessonIds = useMemo(() => getAllLessonIds(), []);

  // Initialize expanded sections with the target section
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '1.1': true, // First section of level 1
  });

  // Check if user is logged in - wait for loading to complete
  const { user, profile, loading: userLoading } = useUser();
  // While loading, assume logged in to avoid flash of "sign in" text
  const isLoggedIn = userLoading ? true : !!user;
  // Wait for profile to load before checking admin status
  // If user exists but profile is null, profile is still loading
  const isProfileLoading = !!user && !profile;
  // Admin users have unrestricted access to all lessons and levels
  // While loading, default to false (secure default) - show loading state instead of flash
  const isAdmin = profile?.is_admin ?? false;

  // Find the current lesson (first unlocked but not completed)
  const currentLessonId = useMemo(() => {
    for (const lessonId of allLessonIds) {
      if (!completedLessons.includes(lessonId)) {
        // Check if this is the first lesson or if previous lesson is completed
        const idx = allLessonIds.indexOf(lessonId);
        if (idx === 0) return lessonId;
        if (startingLessonId) {
          const startingIdx = allLessonIds.indexOf(startingLessonId);
          if (startingIdx >= 0 && idx <= startingIdx) return lessonId;
        }
        const prevId = allLessonIds[idx - 1];
        if (completedLessons.includes(prevId)) return lessonId;
      }
    }
    return allLessonIds[allLessonIds.length - 1]; // All completed, show last
  }, [allLessonIds, completedLessons, startingLessonId]);

  // SCROLL BEHAVIOR (RULES.md Section 5) - ONE useEffect, ONE place
  // - URL has scrollTo: Expand section, scroll to that lesson
  // - Fresh visit (no param): Expand section, scroll to current lesson
  // - Section expand/collapse: NO scrolling (handled by toggleSection)
  useEffect(() => {
    if (!progressLoaded) return;

    const targetLessonId = scrollToLessonId || currentLessonId;
    console.log('[DEBUG learn] scrollToLessonId:', scrollToLessonId, 'currentLessonId:', currentLessonId, 'targetLessonId:', targetLessonId, 'startingLessonId:', startingLessonId);
    if (!targetLessonId) return;

    const sectionId = findSectionForLesson(targetLessonId);
    if (sectionId) {
      setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
    }

    // Wait for the element to exist (section needs to expand and render)
    // Poll every 50ms for up to 500ms
    let attempts = 0;
    const maxAttempts = 10;
    const pollForElement = () => {
      const element = document.getElementById(`lesson-${targetLessonId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(pollForElement, 50);
      } else {
        console.warn('[DEBUG learn] Could not find element for lesson:', targetLessonId);
      }
    };
    setTimeout(pollForElement, 50);
  }, [scrollToLessonId, progressLoaded, currentLessonId]);

  // Auto-unlock next level when current level is completed
  useEffect(() => {
    // Check all levels except the last (which has no next level)
    for (let level = 1; level <= LEVELS.length - 1; level++) {
      const nextLevel = level + 1;
      const levelCompleted = isLevelCompleted(level, completedLessons);
      const nextLevelUnlocked = unlockedLevels.includes(nextLevel);

      if (levelCompleted && !nextLevelUnlocked) {
        unlockLevel(nextLevel);
      }
    }
  }, [completedLessons, unlockedLevels, unlockLevel]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Show loading skeleton while auth or progress is loading to prevent flash
  if (userLoading || isProfileLoading || !progressLoaded) {
    return (
      <div className="min-h-screen bg-[#eef6fc] text-[#3c3c3c] pb-20">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Skeleton level header */}
          <div className="h-24 bg-gray-200 rounded-2xl animate-pulse mb-6" />
          {/* Skeleton sections */}
          {[1, 2, 3].map(i => (
            <div key={i} className="mb-4">
              <div className="h-16 bg-gray-200 rounded-2xl animate-pulse mb-2" />
              <div className="flex justify-center gap-4 mt-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef6fc] text-[#3c3c3c] pb-20">
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes sparkle-2 {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes pulse-ring-scale {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 0.4; }
        }
        @keyframes shimmer {
          0% { transform: skewX(-20deg) translateX(-150%); }
          100% { transform: skewX(-20deg) translateX(250%); }
        }
        .level-card-hover:hover .level-card-main {
          transform: translate(-2px, -2px);
        }
        .level-card-hover:hover .level-layer-1 {
          transform: translate(10px, 10px);
        }
        .level-card-hover:hover .level-layer-2 {
          transform: translate(5px, 5px);
        }
        .level-card-hover:hover .shimmer-effect {
          animation: shimmer 1.5s ease-in-out;
        }
      `}</style>


      {/* Curriculum Path - All Levels */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {LEVELS.map(({ level, data, color, darkColor }) => {
          // Admins have all levels unlocked
          const isLevelUnlocked = isAdmin || unlockedLevels.includes(level);
          const prevLevelCompleted = level === 1 || isLevelCompleted(level - 1, completedLessons);

          // For level 1, always show. For others, show locked card if not unlocked
          if (level > 1 && !isLevelUnlocked) {
            return (
              <LockedLevelCard
                key={`locked-${level}`}
                levelNum={level}
                levelData={data}
                levelColor={color}
                darkColor={darkColor}
                isUnlocked={isLevelUnlocked}
                prevLevelCompleted={prevLevelCompleted}
                isLoggedIn={isLoggedIn}
              />
            );
          }

          // Track section index per level (resets for each level)
          let levelSectionIndex = 0;

          return (
            <div key={level}>
              {/* Connector line between levels */}
              {level > 1 && (
                <div className="flex justify-center mb-4">
                  <div className="w-1 h-8 rounded-full" style={{ backgroundColor: color }} />
                </div>
              )}

              {/* Sticky Level Header - Design 3: Floating Layered Card */}
              <div className="sticky top-10 z-40 -mx-4 px-4 py-3 mb-6">
                <div className="relative level-card-hover group cursor-default">
                  {/* Back layers for 3D depth effect */}
                  <div
                    className="absolute inset-0 rounded-2xl transition-transform duration-300 level-layer-1"
                    style={{
                      backgroundColor: color,
                      transform: 'translate(8px, 8px)',
                      opacity: 0.25,
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl transition-transform duration-300 level-layer-2"
                    style={{
                      backgroundColor: color,
                      transform: 'translate(4px, 4px)',
                      opacity: 0.45,
                    }}
                  />

                  {/* Main card */}
                  <div
                    className="relative rounded-2xl p-4 border-2 transition-transform duration-300 level-card-main overflow-hidden"
                    style={{
                      backgroundColor: '#1A2C35',
                      borderColor: color,
                      boxShadow: `0 12px 24px rgba(0,0,0,0.3)`,
                    }}
                  >
                    {/* Corner accent */}
                    <div
                      className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, transparent 50%, ${color}25 50%)`,
                        borderTopRightRadius: '1rem',
                      }}
                    />

                    {/* Shimmer effect on hover */}
                    <div
                      className="absolute inset-0 bg-white/10 shimmer-effect pointer-events-none"
                      style={{ transform: 'skewX(-20deg) translateX(-150%)' }}
                    />

                    <div className="flex items-center gap-3 relative z-10">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-xl relative overflow-hidden"
                        style={{
                          backgroundColor: color,
                          boxShadow: `4px 4px 0 ${color}50`,
                        }}
                      >
                        <span className="relative z-10">L{level}</span>
                      </div>
                      <div>
                        <div className="text-sm uppercase tracking-wider font-semibold" style={{ color }}>
                          Level {level}
                        </div>
                        <h2 className="text-xl font-bold text-white">{data.name}</h2>
                        <p className="text-xs text-white/50">{data.ratingRange} ELO</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level Blocks */}
              {data.blocks.map((block, blockIndex) => {
                const baseLevelIndex = levelSectionIndex;
                levelSectionIndex += block.sections.length;

                return (
                  <BlockView
                    key={block.id}
                    block={block}
                    blockIndex={blockIndex}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                    baseGlobalIndex={baseLevelIndex}
                    completedLessons={completedLessons}
                    allLessonIds={allLessonIds}
                    levelColor={color}
                    isAdmin={isAdmin}
                    isLessonUnlocked={isLessonUnlocked}
                    overrideCurrentId={scrollToLessonId}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Streak Celebration Popup */}
      <StreakCelebrationPopup
        isOpen={streakJustExtended}
        previousStreak={previousStreak}
        newStreak={currentStreak}
        onClose={dismissStreakCelebration}
      />
    </div>
  );
}

// Block View
function BlockView({
  block,
  blockIndex,
  expandedSections,
  toggleSection,
  baseGlobalIndex,
  completedLessons,
  allLessonIds,
  levelColor,
  isAdmin,
  isLessonUnlocked,
  overrideCurrentId,
}: {
  block: Block;
  blockIndex: number;
  expandedSections: Record<string, boolean>;
  toggleSection: (id: string) => void;
  baseGlobalIndex: number;
  completedLessons: string[];
  allLessonIds: string[];
  levelColor: string;
  isAdmin: boolean;
  isLessonUnlocked: (lessonId: string, allLessonIds: string[]) => boolean;
  overrideCurrentId: string | null;
}) {
  return (
    <div className="mb-8">
      {/* Block Title */}
      <div className="mb-4 px-2 text-center">
        <div className="mb-2">
          <h2 className="text-lg font-black text-[#3c3c3c]">{block.name}</h2>
          <p className="text-xs text-[#afafaf]">{block.description}</p>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* Sections */}
      {block.sections.map((section, sectionIndex) => {
        const globalIndex = baseGlobalIndex + sectionIndex;
        return (
          <SectionView
            key={section.id}
            section={section}
            sectionIndex={globalIndex}
            isExpanded={expandedSections[section.id] || false}
            onToggle={() => toggleSection(section.id)}
            completedLessons={completedLessons}
            allLessonIds={allLessonIds}
            isAdmin={isAdmin}
            isLessonUnlocked={isLessonUnlocked}
            overrideCurrentId={overrideCurrentId}
          />
        );
      })}
    </div>
  );
}

// Section View
function SectionView({
  section,
  sectionIndex,
  isExpanded,
  onToggle,
  completedLessons,
  allLessonIds,
  isAdmin,
  isLessonUnlocked,
  overrideCurrentId,
}: {
  section: Section;
  sectionIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  completedLessons: string[];
  allLessonIds: string[];
  isAdmin: boolean;
  isLessonUnlocked: (lessonId: string, allLessonIds: string[]) => boolean;
  overrideCurrentId: string | null;
}) {
  const router = useRouter();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const sectionColor = section.isReview
    ? CURRICULUM_V2_CONFIG.reviewSectionColor
    : CURRICULUM_V2_CONFIG.moduleColors[sectionIndex % CURRICULUM_V2_CONFIG.moduleColors.length];

  // Clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        setSelectedLessonId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Clear selection when section collapses
  useEffect(() => {
    if (!isExpanded) {
      setSelectedLessonId(null);
    }
  }, [isExpanded]);

  // Toggle lesson selection (show/hide popup)
  const handleLessonSelect = useCallback((lessonId: string) => {
    setSelectedLessonId(prev => prev === lessonId ? null : lessonId);
  }, []);

  // Navigate to lesson when Start button is clicked
  const handleLessonStart = useCallback((lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  }, [router]);

  return (
    <div className="mb-3" ref={sectionRef}>
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all"
        style={{
          backgroundColor: isExpanded ? sectionColor : 'white',
          boxShadow: isExpanded ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
          style={{
            backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : sectionColor,
            color: 'white',
          }}
        >
          {section.isReview ? '★' : sectionIndex + 1}
        </div>
        <div className="flex-1 text-left">
          <div className={`font-bold ${isExpanded ? 'text-white' : 'text-[#3c3c3c]'}`}>{section.name}</div>
          <div className={`text-xs ${isExpanded ? 'text-white/70' : 'text-[#afafaf]'}`}>
            {section.lessons.length} lessons • {section.description}
          </div>
        </div>
        <div
          className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: isExpanded ? 'rgba(255,255,255,0.7)' : sectionColor }}
        >
          ▾
        </div>
      </button>

      {/* Lessons - Evenly Spaced Row */}
      {isExpanded && (
        <div className="mt-4 px-2">
          <div className="flex flex-row justify-evenly items-start">
            {section.lessons.map((lesson, lessonIndex) => {
              // Admins see locked lessons as unlocked (clickable) instead of locked
              const baseStatus = getLessonStatus(lesson.id, completedLessons, allLessonIds, isLessonUnlocked, overrideCurrentId);
              const status = isAdmin && baseStatus === 'locked' ? 'unlocked' : baseStatus;
              const piece = getPieceForLesson(lesson, lessonIndex, sectionIndex);

              return (
                <div
                  key={lesson.id}
                  id={`lesson-${lesson.id}`}
                >
                  <LessonButton
                    lesson={lesson}
                    piece={piece}
                    status={status}
                    sectionColor={sectionColor}
                    isSelected={selectedLessonId === lesson.id}
                    onSelect={() => handleLessonSelect(lesson.id)}
                    onStart={() => handleLessonStart(lesson.id)}
                    lessonIndex={lessonIndex}
                    totalLessons={section.lessons.length}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Lesson Button
function LessonButton({
  lesson,
  piece,
  status,
  sectionColor,
  isSelected,
  onSelect,
  onStart,
  lessonIndex,
  totalLessons,
}: {
  lesson: LessonCriteria;
  piece: PieceType;
  status: LessonStatus;
  sectionColor: string;
  isSelected: boolean;
  onSelect: () => void;
  onStart: () => void;
  lessonIndex: number;
  totalLessons: number;
}) {
  const size = CURRICULUM_V2_CONFIG.buttonSize;
  const depthY = CURRICULUM_V2_CONFIG.buttonDepthY;
  const depthX = CURRICULUM_V2_CONFIG.buttonDepthX;

  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isUnlocked = status === 'unlocked';
  const isLocked = status === 'locked';

  let topColor: string;
  let bottomColor: string;
  let iconColor: string;

  if (isCompleted) {
    topColor = CURRICULUM_V2_CONFIG.completedColor;
    bottomColor = CURRICULUM_V2_CONFIG.completedDarkColor;
    iconColor = '#B8860B';
  } else if (isLocked) {
    topColor = CURRICULUM_V2_CONFIG.lockedColor;
    bottomColor = CURRICULUM_V2_CONFIG.lockedDarkColor;
    iconColor = '#9CA3AF';
  } else if (isUnlocked) {
    topColor = sectionColor;
    bottomColor = darkenColor(sectionColor, 0.35);
    iconColor = 'white';
  } else {
    topColor = sectionColor;
    bottomColor = darkenColor(sectionColor, 0.35);
    iconColor = 'white';
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStart();
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Icon button */}
      <div
        className={`relative ${isLocked ? 'opacity-60' : ''} cursor-pointer`}
        style={{ width: size + depthX, height: size + depthY, opacity: isUnlocked && !isCurrent ? 0.75 : 1 }}
        onClick={handleClick}
      >
        {/* Pulse ring for current */}
        {isCurrent && (
          <div
            className="absolute rounded-full"
            style={{
              width: CURRICULUM_V2_CONFIG.ringSize,
              height: CURRICULUM_V2_CONFIG.ringSize,
              top: (size - CURRICULUM_V2_CONFIG.ringSize) / 2 + depthY / 2,
              left: (size - CURRICULUM_V2_CONFIG.ringSize) / 2 + depthX / 2,
              border: `3px solid ${sectionColor}`,
              opacity: 0.6,
              animation: 'pulse-ring-scale 1.5s ease-in-out infinite',
            }}
          />
        )}

        {/* Sparkles for completed */}
        {isCompleted && CURRICULUM_V2_CONFIG.showSparkles && (
          <>
            <div
              className="absolute text-yellow-300"
              style={{ top: -5, right: 5, fontSize: 14, animation: 'sparkle 2s ease-in-out infinite' }}
            >
              ✦
            </div>
            <div
              className="absolute text-yellow-200"
              style={{ bottom: 10, left: -5, fontSize: 10, animation: 'sparkle 2s ease-in-out infinite 0.7s' }}
            >
              ✦
            </div>
          </>
        )}

        {/* 3D Button */}
        <div
          className="absolute rounded-full"
          style={{ width: size, height: size, top: depthY, left: depthX, backgroundColor: bottomColor }}
        />
        <div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: size, height: size, top: 0, left: 0, backgroundColor: topColor }}
        >
          {isCompleted && CURRICULUM_V2_CONFIG.showSparkles && <Sparkles />}
          {isLocked ? (
            <LockIcon size={30} color={iconColor} />
          ) : (
            getIconLongShadow(piece, iconColor, CURRICULUM_V2_CONFIG.iconSize)
          )}
        </div>
      </div>

      {/* Popup card below icon */}
      {isSelected && (() => {
        // Edge-aware positioning: prevent popup from going off-screen on mobile
        // Left-edge lessons: shift popup right, Right-edge lessons: shift popup left
        const isLeftEdge = lessonIndex === 0;
        const isRightEdge = lessonIndex === totalLessons - 1;

        // Popup transform: -50% centers it, -15% shifts right, -85% shifts left
        const popupTransform = isLeftEdge ? 'translateX(-15%)'
          : isRightEdge ? 'translateX(-85%)'
          : 'translateX(-50%)';

        // Arrow position matches: 15% for left, 85% for right, 50% for center
        const arrowLeft = isLeftEdge ? '15%' : isRightEdge ? '85%' : '50%';

        return (
        <div
          className="z-50"
          style={{
            position: 'absolute',
            top: size + depthY + 12,
            left: '50%',
            transform: popupTransform,
          }}
        >
          {/* Arrow pointing up */}
          <div
            className="w-4 h-4"
            style={{
              position: 'absolute',
              top: -8,
              left: arrowLeft,
              transform: 'translateX(-50%) rotate(45deg)',
              backgroundColor: isLocked ? '#374151' : sectionColor,
            }}
          />

          {/* Card content */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{
              width: '200px',
              backgroundColor: '#1A2C35',
              border: `3px solid ${isLocked ? '#374151' : sectionColor}`,
            }}
          >
            {/* Header with color */}
            <div
              className="px-4 py-3 text-center"
              style={{ backgroundColor: isLocked ? '#374151' : sectionColor }}
            >
              <div className="text-white font-bold text-sm">
                {lesson.name}
              </div>
              {isCompleted && (
                <div className="text-white/80 text-xs mt-0.5">✓ Completed</div>
              )}
              {isCurrent && (
                <div className="text-white/80 text-xs mt-0.5">Up next</div>
              )}
            </div>

            {/* Body */}
            <div className="p-4">
              {isLocked ? (
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-3">
                    Complete previous lessons to unlock
                  </div>
                  <div className="w-full py-2.5 rounded-xl font-bold text-sm bg-gray-600 text-gray-400 cursor-not-allowed">
                    Locked
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleStartClick}
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
                  style={{
                    backgroundColor: sectionColor,
                    boxShadow: `0 4px 0 ${darkenColor(sectionColor, 0.3)}`,
                  }}
                >
                  {isCompleted ? 'Practice Again' : 'Start Lesson'}
                </button>
              )}
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
