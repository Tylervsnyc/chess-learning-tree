'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { level1, Module, LessonCriteria, Level } from '@/data/level1-curriculum';
import { level2 } from '@/data/level2-curriculum';
import { level3 } from '@/data/level3-curriculum';
import { useLessonProgress } from '@/hooks/useProgress';

const LEVELS: Level[] = [level1, level2, level3];

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
      className={`w-full text-left p-3 rounded-xl transition-all border ${
        isUnlocked
          ? 'bg-[#1A2C35] hover:bg-[#2A3C45] border-white/10 hover:border-white/20 cursor-pointer'
          : 'bg-[#0D1B21] border-white/5 cursor-not-allowed opacity-60'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
            isCompleted ? 'text-white' : isUnlocked ? 'text-white' : 'text-gray-500'
          }`}
          style={{
            backgroundColor: isCompleted ? '#58CC02' : isUnlocked ? moduleColor : '#1A2C35',
          }}
        >
          {isCompleted ? '✓' : lesson.id.split('.').slice(-1)[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
            {lesson.name}
          </div>
          <div className={`text-xs truncate ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
            {lesson.description}
          </div>
        </div>
        <div className={isUnlocked ? 'text-gray-500' : 'text-gray-700'}>
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
          backgroundColor: isExpanded ? color : '#1A2C35',
        }}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
          style={{
            backgroundColor: isModuleComplete ? '#58CC02' : isExpanded ? 'rgba(255,255,255,0.2)' : color,
            color: 'white',
          }}
        >
          {isModuleComplete ? '✓' : module.id.replace('mod-', '')}
        </div>
        <div className="flex-1 text-left">
          <div className="font-bold text-white text-lg">{module.name}</div>
          <div className={`text-sm ${isExpanded ? 'text-white/70' : 'text-gray-400'}`}>
            {completedCount}/{module.lessons.length} lessons
          </div>
        </div>
        <div className={`text-2xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {/* Lessons */}
      {isExpanded && (
        <div className="mt-2 ml-4 space-y-2">
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
    setExpandedModule('mod-1'); // Reset to first module when changing levels
  };

  // Count totals for current level
  const totalLessons = allLessonIds.length;
  const completedCount = allLessonIds.filter(id => completedLessons.includes(id)).length;

  // Don't render until progress is loaded to avoid hydration mismatch
  if (!loaded) {
    return (
      <div className="px-4 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">{currentLevel.name}</h1>
          <p className="text-gray-400">{currentLevel.ratingRange} • {totalLessons} lessons</p>
        </div>
        <div className="text-center text-gray-400 py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">

      {/* Level selector tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
        {LEVELS.map((level, index) => {
          const levelLessonIds = level.modules.flatMap(m => m.lessons.map(l => l.id));
          const levelCompletedCount = levelLessonIds.filter(id => completedLessons.includes(id)).length;
          const isSelected = index === selectedLevelIndex;

          return (
            <button
              key={level.id}
              onClick={() => handleLevelChange(index)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all border ${
                isSelected
                  ? 'bg-[#58CC02] border-[#58CC02] text-white'
                  : 'bg-[#1A2C35] border-white/10 text-gray-300 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-sm">Level {index + 1}</div>
              <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {level.ratingRange}
              </div>
              {levelCompletedCount > 0 && (
                <div className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                  {levelCompletedCount}/{levelLessonIds.length}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Level header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">{currentLevel.name}</h1>
        <p className="text-gray-400">
          {currentLevel.ratingRange} • {completedCount}/{totalLessons} lessons completed
        </p>
        {completedCount > 0 && (
          <button
            onClick={resetProgress}
            className="mt-2 text-xs text-gray-500 hover:text-gray-400 underline"
          >
            Reset progress
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-6 mx-4">
        <div className="h-2 bg-[#1A2C35] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#58CC02] transition-all duration-500"
            style={{ width: `${(completedCount / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-2">
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
