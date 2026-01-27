'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { level1V2, Block, Section, LessonCriteria } from '@/data/staging/level1-v2-curriculum';
import { level2V2 } from '@/data/staging/level2-v2-curriculum';
import { level3V2 } from '@/data/staging/level3-v2-curriculum';
import { CURRICULUM_V2_CONFIG } from '@/data/curriculum-v2-config';

const PREVIEW_STORAGE_KEY = 'preview-completed-lessons';

// Types
type PieceType = 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | 'star';
type LessonStatus = 'completed' | 'current' | 'locked';

// Get level data
function getLevelData(level: number) {
  switch (level) {
    case 1: return level1V2;
    case 2: return level2V2;
    case 3: return level3V2;
    default: return level1V2;
  }
}

function getLevelColor(level: number): string {
  switch (level) {
    case 1: return '#58CC02';
    case 2: return '#1CB0F6';
    case 3: return '#CE82FF';
    default: return '#58CC02';
  }
}

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

// Determine lesson status based on progress
// - Completed lessons = gold
// - First incomplete lesson = current (normal color with pulse ring)
// - Future lessons = locked (gray)
function getLessonStatus(
  lessonId: string,
  completedLessons: string[],
  allLessonIds: string[]
): LessonStatus {
  if (completedLessons.includes(lessonId)) return 'completed';

  // Find the first incomplete lesson (the "current" one)
  const firstIncompleteLessonId = allLessonIds.find(id => !completedLessons.includes(id));

  if (lessonId === firstIncompleteLessonId) return 'current';
  return 'locked';
}

// Assign piece types to lessons - use pieceFilter if available
const PIECE_CYCLE: PieceType[] = ['knight', 'queen', 'rook', 'bishop', 'pawn', 'star'];

function getPieceForLesson(lesson: LessonCriteria, lessonIndex: number, sectionIndex: number): PieceType {
  if (lesson.pieceFilter) {
    return lesson.pieceFilter as PieceType;
  }
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

// Chess piece icon paths - detailed classic style
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

// Long Shadow icon style
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

export default function PreviewLearnPage() {
  const searchParams = useSearchParams();
  const levelParam = searchParams.get('level');
  const level = levelParam ? parseInt(levelParam) : 1;

  const levelData = getLevelData(level);
  const levelColor = getLevelColor(level);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sec-1': true,
  });

  // Track completed lessons in localStorage only (no auth)
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(PREVIEW_STORAGE_KEY);
    if (stored) {
      setCompletedLessons(JSON.parse(stored));
    }
  }, []);

  // Get all lesson IDs in order to determine current/locked status
  const allLessonIds = getAllLessonIdsInOrder(levelData);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  let globalSectionIndex = 0;

  return (
    <div className="min-h-screen text-[#3c3c3c]">
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
      <div className="bg-white border-b border-black/5 px-4 py-3 sticky top-7 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Link href="/preview" className="text-[#afafaf] hover:text-[#3c3c3c]">
            <ChevronLeft />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: levelColor }}>{levelData.name}</h1>
            <p className="text-xs text-[#afafaf]">{levelData.ratingRange} ELO</p>
          </div>
          {/* Preview badge */}
          <div className="px-2 py-1 bg-[#CE82FF]/20 text-[#CE82FF] text-xs font-bold rounded">
            PREVIEW
          </div>
          {/* Level selector */}
          <div className="flex gap-1">
            {[1, 2, 3].map(l => (
              <Link
                key={l}
                href={`/preview/learn?level=${l}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  l === level ? 'text-white' : 'text-[#afafaf] bg-white border border-black/10'
                }`}
                style={{ backgroundColor: l === level ? getLevelColor(l) : undefined }}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum Path */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {levelData.blocks.map((block, blockIndex) => {
          const baseGlobalIndex = globalSectionIndex;
          globalSectionIndex += block.sections.length;

          return (
            <BlockView
              key={block.id}
              block={block}
              blockIndex={blockIndex}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              baseGlobalIndex={baseGlobalIndex}
              completedLessons={completedLessons}
              allLessonIds={allLessonIds}
              levelColor={levelColor}
            />
          );
        })}
      </div>
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
}: {
  block: Block;
  blockIndex: number;
  expandedSections: Record<string, boolean>;
  toggleSection: (id: string) => void;
  baseGlobalIndex: number;
  completedLessons: string[];
  allLessonIds: string[];
  levelColor: string;
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
}: {
  section: Section;
  sectionIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  completedLessons: string[];
  allLessonIds: string[];
}) {
  const sectionColor = section.isReview
    ? CURRICULUM_V2_CONFIG.reviewSectionColor
    : CURRICULUM_V2_CONFIG.moduleColors[sectionIndex % CURRICULUM_V2_CONFIG.moduleColors.length];

  return (
    <div className="mb-3">
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

      {/* Lessons */}
      {isExpanded && (
        <div className="mt-4 flex flex-col items-center">
          {section.lessons.map((lesson, lessonIndex) => {
            const status = getLessonStatus(lesson.id, completedLessons, allLessonIds);
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

// Lesson Button
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

  const buttonContent = (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105 transition-transform'}`}
        style={{ width: size + depthX, height: size + depthY }}
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
              style={{
                top: -5,
                right: 5,
                fontSize: 14,
                animation: 'sparkle 2s ease-in-out infinite',
              }}
            >
              ✦
            </div>
            <div
              className="absolute text-yellow-200"
              style={{
                bottom: 10,
                left: -5,
                fontSize: 10,
                animation: 'sparkle 2s ease-in-out infinite 0.7s',
              }}
            >
              ✦
            </div>
          </>
        )}

        {/* 3D Button */}
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

      {/* Lesson name */}
      <div className="mt-2 text-center max-w-[100px]">
        <div className="text-xs font-medium text-[#3c3c3c] truncate">{lesson.name}</div>
      </div>
    </div>
  );

  if (isLocked) {
    return buttonContent;
  }

  return (
    <Link href={`/preview/lesson/${lesson.id}`}>
      {buttonContent}
    </Link>
  );
}
