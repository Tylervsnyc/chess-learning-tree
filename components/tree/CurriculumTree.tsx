'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { level1, Module, LessonCriteria } from '@/data/level1-curriculum';
import { useLessonProgress } from '@/hooks/useProgress';

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
  const [expandedModule, setExpandedModule] = useState<string | null>('mod-1');
  const { isLessonUnlocked, isLessonCompleted, loaded, completedLessons, resetProgress } = useLessonProgress();

  // Get all lesson IDs in order
  const allLessonIds = useMemo(() => {
    return level1.modules.flatMap(m => m.lessons.map(l => l.id));
  }, []);

  const handleToggle = (moduleId: string) => {
    setExpandedModule(prev => (prev === moduleId ? null : moduleId));
  };

  // Count totals
  const totalLessons = allLessonIds.length;
  const completedCount = completedLessons.length;

  // Don't render until progress is loaded to avoid hydration mismatch
  if (!loaded) {
    return (
      <div className="px-4 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">{level1.name}</h1>
          <p className="text-gray-400">{level1.ratingRange} • {totalLessons} lessons</p>
        </div>
        <div className="text-center text-gray-400 py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      {/* Top buttons */}
      <div className="flex justify-between items-center mb-2">
        {/* Daily Challenge button */}
        <button
          onClick={() => router.push('/daily-challenge')}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
        >
          <span className="text-lg">⚡</span>
          <span>Daily Challenge</span>
        </button>

        {/* Profile button */}
        <button
          onClick={() => router.push('/profile')}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="View Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Level header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">{level1.name}</h1>
        <p className="text-gray-400">
          {level1.ratingRange} • {completedCount}/{totalLessons} lessons completed
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
        {level1.modules.map((module, index) => (
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
