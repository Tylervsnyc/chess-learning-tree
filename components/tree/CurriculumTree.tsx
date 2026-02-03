'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { level1, Module, LessonCriteria, Level } from '@/data/level1-curriculum';
import { level2 } from '@/data/level2-curriculum';
import { level3 } from '@/data/level3-curriculum';
import { level4 } from '@/data/level4-curriculum';
import { level5 } from '@/data/level5-curriculum';
import { level6 } from '@/data/level6-curriculum';
import { level7 } from '@/data/level7-curriculum';
import { level8 } from '@/data/level8-curriculum';
import { useLessonProgress } from '@/hooks/useProgress';
import { usePermissions } from '@/hooks/usePermissions';
import NextLevelCard from './NextLevelCard';
import { getLevelTestConfig } from '@/data/level-unlock-tests';

const LEVELS: Level[] = [level1, level2, level3, level4, level5, level6, level7, level8];

// Level keys for navigation (must match NavHeader LEVELS)
const LEVEL_KEYS = ['beginner', 'casual', 'club', 'tournament', 'advanced', 'expert', 'elite', 'legend'];

const MODULE_COLORS = [
  '#58CC02', // Green
  '#1CB0F6', // Blue
  '#FF9600', // Orange
  '#FF4B4B', // Red
  '#A560E8', // Purple
  '#2FCBEF', // Cyan
  '#FFC800', // Yellow
  '#FF6B6B', // Coral
];

// Helper to convert hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Generate light-to-dark shades for a module color
function getLessonColor(baseColor: string, lessonIndex: number, totalLessons: number): string {
  const hsl = hexToHSL(baseColor);
  // Start lighter (+20), end darker (-25) based on position
  const lightnessRange = 45; // Total range of lightness variation (more apparent)
  const lightnessOffset = totalLessons > 1
    ? 20 - (lessonIndex / (totalLessons - 1)) * lightnessRange
    : 0;
  const newLightness = Math.max(15, Math.min(75, hsl.l + lightnessOffset));
  return `hsl(${hsl.h}, ${hsl.s}%, ${newLightness}%)`;
}

interface LessonCardProps {
  lesson: LessonCriteria;
  moduleColor: string;
  lessonIndex: number;
  totalLessons: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isGuest?: boolean;
  isNextLesson?: boolean;
  nextLessonRef?: React.RefObject<HTMLButtonElement | null>;
}

function LessonCard({ lesson, moduleColor, lessonIndex, totalLessons, isUnlocked, isCompleted, isGuest, isNextLesson, nextLessonRef }: LessonCardProps) {
  const router = useRouter();
  const isLocked = !isUnlocked;

  // Get light-to-dark shade based on lesson position
  const lessonColor = getLessonColor(moduleColor, lessonIndex, totalLessons);

  const handleClick = () => {
    if (isUnlocked) {
      const url = isGuest ? `/lesson/${lesson.id}?guest=true` : `/lesson/${lesson.id}`;
      router.push(url);
    }
  };

  // Render the lesson square with white badge for completed lessons
  const renderLessonSquare = () => {
    if (isCompleted) {
      // White badge completion indicator
      return (
        <div className="relative">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm opacity-60"
            style={{ backgroundColor: lessonColor, color: '#fff' }}
          >
            {lesson.id.split('.').slice(-1)[0]}
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="text-[#58CC02] text-xs font-bold">✓</span>
          </div>
        </div>
      );
    }

    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
        style={{ backgroundColor: lessonColor, color: '#fff' }}
      >
        {lesson.id.split('.').slice(-1)[0]}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        ref={isNextLesson ? nextLessonRef : undefined}
        onClick={handleClick}
        disabled={isLocked}
        className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
          isNextLesson ? 'animate-pulse-subtle' : ''
        } ${
          isLocked
            ? 'bg-[#1A2C35] cursor-not-allowed blur-[2px]'
            : 'bg-[#1A2C35] hover:bg-[#243844] cursor-pointer'
        }`}
        style={{
          borderColor: isNextLesson ? lessonColor : 'transparent',
        }}
      >
        <div className="flex items-center gap-3">
          {renderLessonSquare()}
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate text-white">
              {lesson.name}
            </div>
            <div className="text-xs truncate text-gray-400">
              {lesson.description}
            </div>
          </div>
          {isNextLesson && (
            <div
              className="px-2 py-1 rounded-lg text-xs font-bold"
              style={{ backgroundColor: lessonColor, color: '#000' }}
            >
              START
            </div>
          )}
          {!isLocked && !isNextLesson && (
            <div className="text-gray-500">→</div>
          )}
        </div>
        <style jsx>{`
          @keyframes pulse-subtle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }
          .animate-pulse-subtle {
            animation: pulse-subtle 2s ease-in-out infinite;
          }
        `}</style>
      </button>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <div className="bg-black/60 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-base">🔒</span>
            <span className="text-white text-xs font-medium">Complete previous lesson</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface ModuleSectionProps {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
  colorIndex: number;
  allLessonIds: string[];
  isLessonUnlocked: (id: string, all: string[]) => boolean;
  isLessonCompleted: (id: string) => boolean;
  isGuest?: boolean;
  nextLessonId?: string | null;
  nextLessonRef?: React.RefObject<HTMLButtonElement | null>;
}

function ModuleSection({
  module,
  isExpanded,
  onToggle,
  colorIndex,
  allLessonIds,
  isLessonUnlocked,
  isLessonCompleted,
  isGuest,
  nextLessonId,
  nextLessonRef,
}: ModuleSectionProps) {
  const color = MODULE_COLORS[colorIndex % MODULE_COLORS.length];
  const completedCount = module.lessons.filter(l => isLessonCompleted(l.id)).length;
  const isModuleComplete = completedCount === module.lessons.length;

  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all"
        style={{
          backgroundColor: isExpanded ? color : '#1A2C35',
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
          style={{
            backgroundColor: isModuleComplete ? '#58CC02' : isExpanded ? 'rgba(255,255,255,0.2)' : color,
            color: 'white',
          }}
        >
          {isModuleComplete ? '✓' : module.id.replace('mod-', '')}
        </div>
        <div className="flex-1 text-left">
          <div className="font-bold text-white">{module.name}</div>
          <div className={`text-xs ${isExpanded ? 'text-white/70' : 'text-gray-400'}`}>
            {completedCount}/{module.lessons.length} complete
          </div>
        </div>
        <div
          className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: isExpanded ? 'rgba(255,255,255,0.7)' : color }}
        >
          ▾
        </div>
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2 pl-2">
          {module.lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              moduleColor={color}
              lessonIndex={index}
              totalLessons={module.lessons.length}
              isUnlocked={isLessonUnlocked(lesson.id, allLessonIds)}
              isCompleted={isLessonCompleted(lesson.id)}
              isGuest={isGuest}
              isNextLesson={lesson.id === nextLessonId}
              nextLessonRef={nextLessonRef}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Skip Quiz Banner Component
function SkipQuizBanner({ currentLevel, isGuest }: { currentLevel: number; isGuest?: boolean }) {
  const router = useRouter();
  const { canSkipLevels, tier } = usePermissions();

  // Only show skip options if user can skip AND is on level 0 (beginner)
  // In V2, levels are 0=400-800, 1=800-1000, 2=1000-1200
  if (currentLevel >= 2 || isGuest) return null;

  // For anonymous users, show teaser
  if (!canSkipLevels) {
    return (
      <div className="mb-4 p-3 rounded-xl bg-[#1A2C35] border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">Ready to skip ahead?</p>
            <p className="text-xs text-white/40">Sign up to take the level skip quiz</p>
          </div>
          <button
            onClick={() => router.push('/auth/signup')}
            className="px-4 py-2 bg-[#1CB0F6] text-white text-sm font-bold rounded-lg hover:bg-[#1A9FE0] transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // For logged-in users, show skip quiz options
  const skipOptions = currentLevel === 0
    ? [
        { level: 2, label: 'Skip to Level 2', sublabel: '800-1000 ELO' },
        { level: 3, label: 'Skip to Level 3', sublabel: '1000-1200 ELO' },
      ]
    : [
        { level: 3, label: 'Skip to Level 3', sublabel: '1000-1200 ELO' },
      ];

  return (
    <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#1A2C35] to-[#1A2C35]/80 border border-[#1CB0F6]/30">
      <p className="text-sm text-white/70 mb-2">Already know this? Take a quiz to skip ahead:</p>
      <div className="flex gap-2">
        {skipOptions.map(opt => (
          <button
            key={opt.level}
            onClick={() => router.push(`/skip-quiz/${opt.level}`)}
            className="flex-1 px-3 py-2 bg-[#1CB0F6]/20 hover:bg-[#1CB0F6]/30 border border-[#1CB0F6]/40 rounded-lg text-left transition-colors"
          >
            <div className="text-sm font-bold text-[#1CB0F6]">{opt.label}</div>
            <div className="text-xs text-white/40">{opt.sublabel}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface CurriculumTreeProps {
  isGuest?: boolean;
  initialLevel?: number;
}

export function CurriculumTree({ isGuest = false, initialLevel = 0 }: CurriculumTreeProps) {
  const { isLessonUnlocked, isLessonCompleted, loaded, completedLessons, isLevelUnlocked } = useLessonProgress();
  const nextLessonRef = useRef<HTMLButtonElement | null>(null);
  const hasInitializedRef = useRef(false);

  const currentLevel = LEVELS[initialLevel];

  const allLessonIds = useMemo(() => {
    return currentLevel.modules.flatMap(m => m.lessons.map(l => l.id));
  }, [currentLevel]);

  // Find the first incomplete lesson (next lesson to start)
  const nextLessonId = useMemo(() => {
    for (const lessonId of allLessonIds) {
      if (!completedLessons.includes(lessonId)) {
        return lessonId;
      }
    }
    return null; // All lessons completed
  }, [allLessonIds, completedLessons]);

  // Find which module contains the next lesson
  const moduleContainingNextLesson = useMemo(() => {
    if (!nextLessonId) return 'mod-1';
    for (const module of currentLevel.modules) {
      if (module.lessons.some(l => l.id === nextLessonId)) {
        return module.id;
      }
    }
    return 'mod-1';
  }, [nextLessonId, currentLevel.modules]);

  // Start with null - will be set after data loads
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Set expanded module ONLY after data has loaded
  useEffect(() => {
    if (loaded && !hasInitializedRef.current) {
      setExpandedModule(moduleContainingNextLesson);
      hasInitializedRef.current = true;
    }
  }, [loaded, moduleContainingNextLesson]);

  // Update expanded module when level changes
  useEffect(() => {
    if (loaded) {
      setExpandedModule(moduleContainingNextLesson);
      hasInitializedRef.current = true;
    }
  }, [initialLevel]);

  // NOTE: Per RULES.md Section 5, NO scrolling on section expand/collapse.
  // Scroll behavior is handled ONLY in /app/learn/page.tsx via ?scrollTo= param.

  const handleToggle = (moduleId: string) => {
    setExpandedModule(prev => (prev === moduleId ? null : moduleId));
  };

  if (!loaded) {
    return (
      <div className="px-4 py-6">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      {/* Gradient accent */}
      <div className="h-1 -mx-4 mb-4 bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

      {/* Level header - compact */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-white">{currentLevel.name}</h1>
          <span className="text-sm text-gray-400">{currentLevel.ratingRange}</span>
        </div>
      </div>

      {/* Skip Quiz Links - V2 */}
      <SkipQuizBanner currentLevel={initialLevel} isGuest={isGuest} />

      {/* Modules */}
      <div>
        {currentLevel.modules.map((module, index) => (
          <ModuleSection
            key={module.id}
            module={module}
            isExpanded={expandedModule === module.id}
            onToggle={() => handleToggle(module.id)}
            colorIndex={index}
            allLessonIds={allLessonIds}
            isLessonUnlocked={isLessonUnlocked}
            isLessonCompleted={isLessonCompleted}
            isGuest={isGuest}
            nextLessonId={nextLessonId}
            nextLessonRef={nextLessonRef}
          />
        ))}
      </div>

      {/* Next Level Card - show if there's a next level */}
      {initialLevel < LEVELS.length - 1 && !isGuest && (() => {
        const nextLevelIndex = initialLevel + 1;
        const nextLevel = LEVELS[nextLevelIndex];
        const transition = `${initialLevel + 1}-${nextLevelIndex + 1}`;
        const testConfig = getLevelTestConfig(transition);

        // Only show if test config exists for this transition
        if (!testConfig) return null;

        return (
          <NextLevelCard
            currentLevel={initialLevel + 1}
            nextLevelName={nextLevel.name}
            nextLevelKey={LEVEL_KEYS[nextLevelIndex]}
            isUnlocked={isLevelUnlocked(nextLevelIndex + 1)}
          />
        );
      })()}
    </div>
  );
}
