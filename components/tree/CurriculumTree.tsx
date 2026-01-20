'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { level1, Module, LessonCriteria, Level } from '@/data/level1-curriculum';
import { level2 } from '@/data/level2-curriculum';
import { level3 } from '@/data/level3-curriculum';
import { level4 } from '@/data/level4-curriculum';
import { level5 } from '@/data/level5-curriculum';
import { level6 } from '@/data/level6-curriculum';
import { useLessonProgress } from '@/hooks/useProgress';

const LEVELS: Level[] = [level1, level2, level3, level4, level5, level6];

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

interface LessonCardProps {
  lesson: LessonCriteria;
  moduleColor: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  isGuest?: boolean;
  isNextLesson?: boolean;
}

function LessonCard({ lesson, moduleColor, isUnlocked, isCompleted, isGuest, isNextLesson }: LessonCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isUnlocked) {
      const url = isGuest ? `/lesson/${lesson.id}?guest=true` : `/lesson/${lesson.id}`;
      router.push(url);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isUnlocked}
      className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
        isNextLesson
          ? 'animate-pulse-subtle'
          : ''
      } ${
        isUnlocked
          ? 'bg-[#1A2C35] hover:bg-[#243844] cursor-pointer'
          : 'bg-[#0D1B21] cursor-not-allowed opacity-50'
      }`}
      style={{
        borderColor: isNextLesson ? moduleColor : 'transparent',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: isCompleted ? '#58CC02' : isUnlocked ? moduleColor : '#1A2C35',
            color: '#fff',
          }}
        >
          {isCompleted ? '✓' : lesson.id.split('.').slice(-1)[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold truncate ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
            {lesson.name}
          </div>
          <div className={`text-xs truncate ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
            {lesson.description}
          </div>
        </div>
        {isNextLesson ? (
          <div
            className="px-2 py-1 rounded-lg text-xs font-bold"
            style={{ backgroundColor: moduleColor, color: '#000' }}
          >
            START
          </div>
        ) : (
          <div className={isUnlocked ? 'text-gray-500' : 'text-gray-700'}>
            {isUnlocked ? '→' : '🔒'}
          </div>
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
          {module.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              moduleColor={color}
              isUnlocked={isLessonUnlocked(lesson.id, allLessonIds)}
              isCompleted={isLessonCompleted(lesson.id)}
              isGuest={isGuest}
              isNextLesson={lesson.id === nextLessonId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CurriculumTreeProps {
  isGuest?: boolean;
  initialLevel?: number;
}

export function CurriculumTree({ isGuest = false, initialLevel = 0 }: CurriculumTreeProps) {
  const [selectedLevelIndex] = useState(initialLevel);
  const [expandedModule, setExpandedModule] = useState<string | null>('mod-1');
  const { isLessonUnlocked, isLessonCompleted, loaded, completedLessons } = useLessonProgress();

  const currentLevel = LEVELS[selectedLevelIndex];

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
          />
        ))}
      </div>
    </div>
  );
}
