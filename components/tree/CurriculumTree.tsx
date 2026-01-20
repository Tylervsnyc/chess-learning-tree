'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { level1, Module, LessonCriteria, Level } from '@/data/level1-curriculum';
import { level2 } from '@/data/level2-curriculum';
import { level3 } from '@/data/level3-curriculum';
import { useLessonProgress } from '@/hooks/useProgress';

const LEVELS: Level[] = [level1, level2, level3];

// Bold Primary palette with neon glow
const COLORS = {
  bg: '#131F24',
  surface: '#1A2C35',
  primary: '#58CC02',   // Green
  secondary: '#FF4B4B', // Red
  accent1: '#1CB0F6',   // Blue
  accent2: '#FFC800',   // Yellow
  accent3: '#FF9600',   // Orange
};

const GLOW = 0; // Flat - no glow

// Module colors cycle through the palette
const MODULE_COLORS = [
  COLORS.primary,   // Green
  COLORS.accent1,   // Blue
  COLORS.accent3,   // Orange
  COLORS.secondary, // Red
  COLORS.accent2,   // Yellow
];

// Glow helper functions
const boxGlow = (color: string, intensity = GLOW) =>
  `0 0 ${intensity}px ${color}50, 0 0 ${intensity * 2}px ${color}25`;

const textGlow = (color: string, intensity = GLOW / 2) =>
  `0 0 ${intensity}px ${color}`;

const subtleGlow = (color: string) =>
  `0 0 ${GLOW / 3}px ${color}40, inset 0 0 ${GLOW / 2}px ${color}15`;

interface LessonCardProps {
  lesson: LessonCriteria;
  moduleColor: string;
  isUnlocked: boolean;
  isCompleted: boolean;
}

function LessonCard({ lesson, moduleColor, isUnlocked, isCompleted }: LessonCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isUnlocked) {
      router.push(`/lesson/${lesson.id}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isUnlocked}
      className="w-full text-left p-3 rounded-xl transition-all border"
      style={{
        backgroundColor: isUnlocked ? COLORS.surface : '#0D1B21',
        borderColor: isUnlocked
          ? isCompleted ? `${COLORS.primary}60` : `${moduleColor}40`
          : 'rgba(255,255,255,0.05)',
        boxShadow: isUnlocked && !isCompleted ? subtleGlow(moduleColor) : 'none',
        opacity: isUnlocked ? 1 : 0.5,
        cursor: isUnlocked ? 'pointer' : 'not-allowed',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: isCompleted ? COLORS.primary : isUnlocked ? moduleColor : COLORS.surface,
            color: isCompleted || isUnlocked ? COLORS.bg : '#666',
            boxShadow: isCompleted
              ? boxGlow(COLORS.primary, GLOW / 2)
              : isUnlocked ? boxGlow(moduleColor, GLOW / 3) : 'none',
          }}
        >
          {isCompleted ? '✓' : lesson.id.split('.').slice(-1)[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-medium truncate"
            style={{
              color: isUnlocked ? '#fff' : '#666',
              textShadow: isUnlocked && !isCompleted ? textGlow(moduleColor, 8) : 'none',
            }}
          >
            {lesson.name}
          </div>
          <div className="text-xs truncate" style={{ color: isUnlocked ? '#9CA3AF' : '#555' }}>
            {lesson.description}
          </div>
        </div>
        <div style={{ color: isUnlocked ? moduleColor : '#444' }}>
          {isUnlocked ? '→' : '🔒'}
        </div>
      </div>
    </button>
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
}

function ModuleSection({
  module,
  isExpanded,
  onToggle,
  colorIndex,
  allLessonIds,
  isLessonUnlocked,
  isLessonCompleted,
}: ModuleSectionProps) {
  const color = MODULE_COLORS[colorIndex % MODULE_COLORS.length];

  // Count completed lessons in this module
  const completedCount = module.lessons.filter(l => isLessonCompleted(l.id)).length;
  const isModuleComplete = completedCount === module.lessons.length;

  return (
    <div className="mb-4">
      {/* Module header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all"
        style={{
          backgroundColor: isExpanded ? color : COLORS.surface,
          boxShadow: isExpanded ? boxGlow(color) : 'none',
          border: isExpanded ? 'none' : `1px solid ${color}30`,
        }}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
          style={{
            backgroundColor: isModuleComplete
              ? COLORS.primary
              : isExpanded ? 'rgba(0,0,0,0.25)' : color,
            color: 'white',
            boxShadow: isModuleComplete
              ? boxGlow(COLORS.primary, GLOW / 2)
              : !isExpanded ? boxGlow(color, GLOW / 3) : 'none',
          }}
        >
          {isModuleComplete ? '✓' : module.id.replace('mod-', '')}
        </div>
        <div className="flex-1 text-left">
          <div
            className="font-bold text-lg"
            style={{
              color: 'white',
              textShadow: isExpanded ? 'none' : textGlow(color, 10),
            }}
          >
            {module.name}
          </div>
          <div style={{ color: isExpanded ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}>
            {completedCount}/{module.lessons.length} lessons
          </div>
        </div>
        <div
          className={`text-2xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: isExpanded ? 'white' : color }}
        >
          ▼
        </div>
      </button>

      {/* Lessons */}
      {isExpanded && (
        <div className="mt-3 ml-4 space-y-2">
          {module.lessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              moduleColor={color}
              isUnlocked={isLessonUnlocked(lesson.id, allLessonIds)}
              isCompleted={isLessonCompleted(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CurriculumTree() {
  const router = useRouter();
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);
  const [expandedModule, setExpandedModule] = useState<string | null>('mod-1');
  const { isLessonUnlocked, isLessonCompleted, loaded, completedLessons, resetProgress } = useLessonProgress();

  const currentLevel = LEVELS[selectedLevelIndex];

  // Get all lesson IDs in order for the current level
  const allLessonIds = useMemo(() => {
    return currentLevel.modules.flatMap(m => m.lessons.map(l => l.id));
  }, [currentLevel]);

  const handleToggle = (moduleId: string) => {
    setExpandedModule(prev => (prev === moduleId ? null : moduleId));
  };

  const handleLevelChange = (index: number) => {
    setSelectedLevelIndex(index);
    setExpandedModule('mod-1');
  };

  // Count totals for current level
  const totalLessons = allLessonIds.length;
  const completedCount = allLessonIds.filter(id => completedLessons.includes(id)).length;

  // Level tab colors
  const levelColors = [COLORS.primary, COLORS.accent1, COLORS.accent3];

  // Don't render until progress is loaded
  if (!loaded) {
    return (
      <div className="px-4 pb-20">
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: COLORS.primary, textShadow: textGlow(COLORS.primary) }}
          >
            {currentLevel.name}
          </h1>
          <p style={{ color: '#9CA3AF' }}>{currentLevel.ratingRange} • {totalLessons} lessons</p>
        </div>
        <div className="text-center py-8" style={{ color: '#9CA3AF' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      {/* Title */}
      <h1
        className="text-center text-2xl font-bold mb-4 tracking-wide"
        style={{
          color: COLORS.primary,
          textShadow: textGlow(COLORS.primary),
        }}
      >
        THE CHESS PATH
      </h1>

      {/* Level selector tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        {LEVELS.map((level, index) => {
          const levelLessonIds = level.modules.flatMap(m => m.lessons.map(l => l.id));
          const levelCompletedCount = levelLessonIds.filter(id => completedLessons.includes(id)).length;
          const isSelected = index === selectedLevelIndex;
          const tabColor = levelColors[index % levelColors.length];

          return (
            <button
              key={level.id}
              onClick={() => handleLevelChange(index)}
              className="flex-shrink-0 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: isSelected ? tabColor : COLORS.surface,
                color: isSelected ? COLORS.bg : tabColor,
                border: `2px solid ${isSelected ? tabColor : `${tabColor}50`}`,
                boxShadow: isSelected ? boxGlow(tabColor) : 'none',
                textShadow: !isSelected ? textGlow(tabColor, 6) : 'none',
              }}
            >
              <div className="font-bold text-sm">Level {index + 1}</div>
              <div
                className="text-xs"
                style={{ opacity: isSelected ? 0.9 : 0.7 }}
              >
                {level.ratingRange}
              </div>
              {levelCompletedCount > 0 && (
                <div className="text-xs mt-1" style={{ opacity: 0.8 }}>
                  {levelCompletedCount}/{levelLessonIds.length}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Level header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white">{currentLevel.name}</h2>
        <p style={{ color: '#9CA3AF' }}>
          {currentLevel.ratingRange} • {completedCount}/{totalLessons} lessons completed
        </p>
        {completedCount > 0 && (
          <button
            onClick={resetProgress}
            className="mt-2 text-xs underline transition-colors"
            style={{ color: '#666' }}
          >
            Reset progress
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-6 mx-4">
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: COLORS.surface }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(completedCount / totalLessons) * 100}%`,
              backgroundColor: COLORS.primary,
              boxShadow: completedCount > 0 ? `0 0 ${GLOW}px ${COLORS.primary}80` : 'none',
            }}
          />
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-3">
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
          />
        ))}
      </div>
    </div>
  );
}
