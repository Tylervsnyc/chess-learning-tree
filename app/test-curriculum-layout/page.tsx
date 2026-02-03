'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { level1V2, Block, Section, LessonCriteria, getCurriculumStats } from '@/data/staging/level1-v2-curriculum';
import { CURRICULUM_V2_CONFIG } from '@/data/curriculum-v2-config';

// Types
type PieceType = 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | 'star';
type LessonStatus = 'completed' | 'current' | 'locked';

// Clean puzzle counts from extraction (1000+ plays, single tactical theme)
// Level 1: 400-800 ELO - Updated Jan 2026
const CLEAN_PUZZLE_COUNTS: Record<string, number> = {
  // Checkmates
  mateIn1: 7742,
  backRankMate: 5575,
  mateIn2: 4294,
  // Tactics
  fork: 4361,
  crushing: 2019,
  hangingPiece: 185,
  // Endgames
  rookEndgame: 2007,
  pawnEndgame: 538,
  queenEndgame: 408,
  knightEndgame: 200,
  bishopEndgame: 201,
  // Other (not used in L1 V2)
  skewer: 1117,
  discoveredAttack: 989,
  smotheredMate: 393,
  arabianMate: 250,
  doubleBishopMate: 194,
  pin: 107,
  hookMate: 77,
  dovetailMate: 45,
};

// Get all lesson IDs in order from curriculum
function getAllLessonIdsInOrder(levelData: { blocks: Block[] }): string[] {
  const lessonIds: string[] = [];
  for (const block of levelData.blocks) {
    for (const section of block.sections) {
      for (const lesson of section.lessons) {
        lessonIds.push(lesson.id);
      }
    }
  }
  return lessonIds;
}

// Demo: first 2 lessons completed, 3rd is current, rest are locked
const DEMO_COMPLETED_COUNT = 2;

// Convert lesson to status based on global index
// This demonstrates the three visual states across the curriculum
function getLessonStatus(globalLessonIndex: number): LessonStatus {
  if (globalLessonIndex < DEMO_COMPLETED_COUNT) return 'completed';
  if (globalLessonIndex === DEMO_COMPLETED_COUNT) return 'current';
  return 'locked';
}

// Assign piece types to lessons - use pieceFilter if available, otherwise cycle
const PIECE_CYCLE: PieceType[] = ['knight', 'queen', 'rook', 'bishop', 'pawn', 'star'];

function getPieceForLesson(lesson: LessonCriteria, lessonIndex: number, sectionIndex: number): PieceType {
  // Use the lesson's pieceFilter if specified
  if (lesson.pieceFilter) {
    return lesson.pieceFilter as PieceType;
  }
  // Otherwise cycle through pieces
  return PIECE_CYCLE[(lessonIndex + sectionIndex * 2) % PIECE_CYCLE.length];
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function darkenColor(hex: string, amount: number = 0.25): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) * (1 - amount));
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) * (1 - amount));
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) * (1 - amount));
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export default function TestCurriculumLayout() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '1.1': true, // Start with first section expanded
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Track global section index for color cycling
  let globalSectionIndex = 0;

  return (
    <div className="min-h-screen bg-[#eef6fc] text-[#3c3c3c]">
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
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-black/5 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Link href="/" className="text-[#afafaf] hover:text-[#3c3c3c]">
            <ChevronLeft />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-[#3c3c3c]">Curriculum V2 Preview</h1>
            <p className="text-xs text-[#afafaf]">Duolingo-style path with finalized design</p>
          </div>
        </div>
      </div>

      {/* Path Preview */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* V2 Summary Card */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-black/5 shadow-sm">
          <h3 className="font-black text-lg mb-2 text-[#3c3c3c]">Chess Path V2</h3>
          <p className="text-sm text-[#6b6b6b] mb-3">
            "How to Lose Friends and Infuriate People"
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#f5f5f5] rounded-lg p-2">
              <div className="text-[#58CC02] font-bold text-lg">3</div>
              <div className="text-[#afafaf]">Levels</div>
            </div>
            <div className="bg-[#f5f5f5] rounded-lg p-2">
              <div className="text-[#1CB0F6] font-bold text-lg">90K+</div>
              <div className="text-[#afafaf]">Clean Puzzles</div>
            </div>
            <div className="bg-[#f5f5f5] rounded-lg p-2">
              <div className="text-[#FF9600] font-bold text-lg">95%</div>
              <div className="text-[#afafaf]">Confidence</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-[#afafaf]">
            L1: 1000+ plays • L2/L3: 3000+ plays • Single tactical theme
          </div>
        </div>

        {/* Level Header */}
        <div className="mb-6 text-center">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600] mb-4" />
          <h2 className="text-2xl font-black text-[#3c3c3c]">Level 1: How to Lose Friends</h2>
          <p className="text-[#afafaf]">400-800 ELO • ...and Infuriate People</p>
        </div>

        {/* Blocks */}
        {level1V2.blocks.map((block, blockIndex) => (
          <BlockView
            key={block.id}
            block={block}
            blockIndex={blockIndex}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            getGlobalSectionIndex={() => {
              // Calculate the global section index based on previous blocks
              const previousSections = level1V2.blocks
                .slice(0, blockIndex)
                .reduce((sum, b) => sum + b.sections.length, 0);
              return previousSections;
            }}
            getGlobalLessonIndex={() => {
              // Calculate the global lesson index based on previous blocks
              let lessonCount = 0;
              for (let i = 0; i < blockIndex; i++) {
                for (const section of level1V2.blocks[i].sections) {
                  lessonCount += section.lessons.length;
                }
              }
              return lessonCount;
            }}
          />
        ))}

        {/* Clean Puzzle Availability */}
        <div className="mt-12 p-4 rounded-xl bg-white border border-black/5 shadow-sm">
          <h3 className="font-bold mb-3 text-[#3c3c3c]">Clean Puzzle Inventory (Level 1)</h3>
          <p className="text-xs text-[#afafaf] mb-3">1000+ plays, single tactical theme, 400-800 ELO</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(CLEAN_PUZZLE_COUNTS)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([theme, count]) => (
                <div key={theme} className="flex justify-between">
                  <span className="text-[#6b6b6b]">{theme}</span>
                  <span className={count > 100 ? 'text-[#58CC02]' : 'text-[#FF9600]'}>
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* V2 Changes Summary */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-black/5 shadow-sm">
          <h3 className="font-bold mb-3 text-[#3c3c3c]">V2 Changes</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-[#58CC02]">✓</span>
              <span className="text-[#4b4b4b]">Start at 1.1.1 (no diagnostic)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#58CC02]">✓</span>
              <span className="text-[#4b4b4b]">3 levels only (400-800, 800-1000, 1000-1200)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#58CC02]">✓</span>
              <span className="text-[#4b4b4b]">Optional 10-question quiz to skip levels</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#58CC02]">✓</span>
              <span className="text-[#4b4b4b]">Clean puzzles: 1000+ plays, single theme</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#cfcfcf]">○</span>
              <span className="text-[#afafaf]">Anonymous: 2 lessons → sign up</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#cfcfcf]">○</span>
              <span className="text-[#afafaf]">Free: 2 lessons/day</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#cfcfcf]">○</span>
              <span className="text-[#afafaf]">Premium: unlimited</span>
            </div>
          </div>
        </div>

        {/* Design Choices Summary */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-black/5 shadow-sm">
          <h3 className="font-bold mb-3 text-[#3c3c3c]">Locked-in Design Choices</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#afafaf]">Lesson Style</span>
              <span className="text-[#4b4b4b]">Duolingo Path</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#afafaf]">Button Style</span>
              <span className="text-[#4b4b4b]">Flat (3D Puck)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#afafaf]">Current Indicator</span>
              <span className="text-[#4b4b4b]">Pulse Ring</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#afafaf]">Block Labels</span>
              <span className="text-[#4b4b4b]">With Names</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#afafaf]">Icon Style</span>
              <span className="text-[#4b4b4b]">Solid Classic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#afafaf]">Icon Shadow</span>
              <span className="text-[#4b4b4b]">Long Shadow</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#afafaf]">Completed</span>
              <span className="text-[#4b4b4b]">Gold + Sparkles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Block View - shows the block title and its sections
function BlockView({
  block,
  blockIndex,
  expandedSections,
  toggleSection,
  getGlobalSectionIndex,
  getGlobalLessonIndex,
}: {
  block: Block;
  blockIndex: number;
  expandedSections: Record<string, boolean>;
  toggleSection: (id: string) => void;
  getGlobalSectionIndex: () => number;
  getGlobalLessonIndex: () => number;
}) {
  const baseGlobalIndex = getGlobalSectionIndex();
  const baseGlobalLessonIndex = getGlobalLessonIndex();

  return (
    <div className="mb-8">
      {/* Block Title - The funny name */}
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
        // Calculate global lesson offset for this section
        let globalLessonOffset = baseGlobalLessonIndex;
        for (let i = 0; i < sectionIndex; i++) {
          globalLessonOffset += block.sections[i].lessons.length;
        }
        return (
          <SectionView
            key={section.id}
            section={section}
            sectionIndex={globalIndex}
            globalLessonOffset={globalLessonOffset}
            isExpanded={expandedSections[section.id] || false}
            onToggle={() => toggleSection(section.id)}
          />
        );
      })}
    </div>
  );
}

// Section View - collapsible section with lessons
function SectionView({
  section,
  sectionIndex,
  globalLessonOffset,
  isExpanded,
  onToggle,
}: {
  section: Section;
  sectionIndex: number;
  globalLessonOffset: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const sectionColor = section.isReview
    ? CURRICULUM_V2_CONFIG.reviewSectionColor
    : CURRICULUM_V2_CONFIG.moduleColors[sectionIndex % CURRICULUM_V2_CONFIG.moduleColors.length];

  return (
    <div className="mb-3">
      {/* Section Header - Rectangle button */}
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

      {/* Lessons - shown when expanded */}
      {isExpanded && (
        <div className="mt-4 flex flex-col items-center">
          {section.lessons.map((lesson, lessonIndex) => {
            const globalLessonIndex = globalLessonOffset + lessonIndex;
            const status = getLessonStatus(globalLessonIndex);
            const piece = getPieceForLesson(lesson, lessonIndex, sectionIndex);

            // Zigzag pattern
            const patternPosition = lessonIndex % 4;
            let xOffset = 0;
            if (patternPosition === 0) xOffset = -50;
            else if (patternPosition === 1) xOffset = 0;
            else if (patternPosition === 2) xOffset = 50;
            else xOffset = 0;

            return (
              <div
                key={lesson.id}
                className="mb-6"
                style={{ transform: `translateX(${xOffset}px)` }}
              >
                <LessonButton
                  lesson={lesson}
                  piece={piece}
                  status={status}
                  sectionColor={sectionColor}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Lesson Button Component - the 3D puck
function LessonButton({
  lesson,
  piece,
  status,
  sectionColor,
}: {
  lesson: LessonCriteria;
  piece: PieceType;
  status: LessonStatus;
  sectionColor: string;
}) {
  const size = CURRICULUM_V2_CONFIG.buttonSize;
  const depthY = CURRICULUM_V2_CONFIG.buttonDepthY;
  const depthX = CURRICULUM_V2_CONFIG.buttonDepthX;

  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';

  // Determine colors
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
  } else {
    topColor = sectionColor;
    bottomColor = darkenColor(sectionColor, 0.35);
    iconColor = 'white';
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${isLocked ? 'opacity-60' : ''}`}
        style={{ width: size + depthX, height: size + depthY }}
      >
        {/* Pulse ring for current */}
        {isCurrent && (
          <>
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
            <div
              className="absolute rounded-full"
              style={{
                width: size + 12,
                height: size + 12,
                top: -3 + depthY / 2,
                left: -3 + depthX / 2,
                border: `2px solid ${sectionColor}`,
                opacity: 0.4,
              }}
            />
          </>
        )}

        {/* Bottom edge - 3D shadow */}
        <div
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            top: depthY,
            left: depthX,
            backgroundColor: bottomColor,
          }}
        />

        {/* Top face */}
        <div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: size,
            height: size,
            top: 0,
            left: 0,
            backgroundColor: topColor,
          }}
        >
          {isCompleted && CURRICULUM_V2_CONFIG.showSparkles && <Sparkles />}
          {isLocked ? (
            <LockIcon size={30} color={iconColor} />
          ) : (
            getIconLongShadow(piece, iconColor, CURRICULUM_V2_CONFIG.iconSize)
          )}
        </div>
      </div>

      {/* Lesson name below button */}
      <div
        className={`mt-2 text-xs text-center max-w-[120px] leading-tight font-semibold ${
          isLocked ? 'text-[#cfcfcf]' : 'text-[#4b4b4b]'
        }`}
      >
        {lesson.name}
      </div>
    </div>
  );
}

function Sparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
      <div
        className="absolute w-2 h-2"
        style={{
          top: '15%',
          left: '20%',
          animation: 'sparkle 2s ease-in-out infinite',
          animationDelay: '0s',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"/>
        </svg>
      </div>
      <div
        className="absolute w-1.5 h-1.5"
        style={{
          top: '60%',
          right: '15%',
          animation: 'sparkle 2s ease-in-out infinite',
          animationDelay: '0.7s',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"/>
        </svg>
      </div>
      <div
        className="absolute w-1 h-1"
        style={{
          top: '30%',
          right: '25%',
          animation: 'sparkle-2 1.5s ease-in-out infinite',
          animationDelay: '1.2s',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <circle cx="12" cy="12" r="12"/>
        </svg>
      </div>
      <div
        className="absolute w-1 h-1"
        style={{
          bottom: '25%',
          left: '30%',
          animation: 'sparkle-2 1.8s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <circle cx="12" cy="12" r="12"/>
        </svg>
      </div>
    </div>
  );
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

// Long Shadow - the chosen style
function getIconLongShadow(piece: PieceType, color: string, size: number) {
  const data = PIECE_PATHS[piece];
  const layers = 4;

  return (
    <svg width={size} height={size} viewBox={data.viewBox}>
      {/* Multiple shadow layers for long shadow effect */}
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
