'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lesson, NodeStatus } from '@/types/curriculum';
import { ThemeItem } from './ThemeItem';
import { getThemeProgress } from '@/data/progress';

interface ThemeListProps {
  lesson: Lesson;
  status: NodeStatus;
  isExpanded: boolean;
  completedThemes: string[];
}

export function ThemeList({ lesson, status, isExpanded, completedThemes }: ThemeListProps) {
  const router = useRouter();

  if (!isExpanded) return null;

  // Determine which themes are available based on lesson status
  const getThemeAvailability = (themeId: string, index: number) => {
    if (status === 'locked') return false;
    if (status === 'completed') return true;
    if (status === 'available' || status === 'in_progress') {
      // First uncompleted theme is available, or if all previous are completed
      const completedCount = completedThemes.filter(id =>
        id.startsWith(lesson.id)
      ).length;
      return index <= completedCount;
    }
    return false;
  };

  return (
    <div
      className={`
        mt-4 w-full max-w-sm mx-auto
        bg-[#1A2C35] rounded-2xl p-2
        border border-white/10
        animate-[expand_0.3s_ease-out]
        overflow-hidden
      `}
    >
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2">
          {lesson.name} Themes
        </h3>
        <div className="space-y-1">
          {lesson.themes.map((theme, index) => (
            <ThemeItem
              key={theme.id}
              theme={theme}
              progress={getThemeProgress(theme.id)}
              isAvailable={getThemeAvailability(theme.id, index)}
              onClick={() => {
                router.push(`/puzzle/${theme.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
