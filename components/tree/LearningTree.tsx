'use client';

import React, { useState } from 'react';
import { curriculum } from '@/data/curriculum';
import { getLessonStatus, getLessonCompletionPercent, mockUserProgress } from '@/data/progress';
import { LessonNode } from './LessonNode';
import { ThemeList } from './ThemeList';

// Position pattern for zigzag: center, right, center, left, center, right...
type Position = 'left' | 'center' | 'right';

function getNodePosition(index: number): Position {
  const pattern: Position[] = ['center', 'right', 'center', 'left'];
  return pattern[index % 4];
}

function getPositionOffset(position: Position): string {
  switch (position) {
    case 'left':
      return 'ml-0 mr-auto';
    case 'right':
      return 'ml-auto mr-0';
    case 'center':
    default:
      return 'mx-auto';
  }
}

export function LearningTree() {
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  const handleNodeClick = (lessonId: string) => {
    setExpandedLessonId(prev => (prev === lessonId ? null : lessonId));
  };

  // Get completed themes for a lesson
  const getCompletedThemes = (lessonId: string): string[] => {
    const progress = mockUserProgress.find(p => p.lessonId === lessonId);
    return progress?.themesCompleted ?? [];
  };

  return (
    <div className="relative w-full px-8 pb-20">
      {/* SVG for connection lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {curriculum.slice(0, -1).map((lesson, index) => {
          const currentPos = getNodePosition(index);
          const nextPos = getNodePosition(index + 1);
          const currentStatus = getLessonStatus(lesson.id);
          const nextLesson = curriculum[index + 1];
          const nextStatus = getLessonStatus(nextLesson.id);

          // Calculate x positions (percentage-based)
          const getXPercent = (pos: Position) => {
            switch (pos) {
              case 'left': return 25;
              case 'right': return 75;
              default: return 50;
            }
          };

          const x1 = getXPercent(currentPos);
          const x2 = getXPercent(nextPos);

          // Y positions based on index (each node ~160px apart)
          const y1 = 80 + index * 180;
          const y2 = 80 + (index + 1) * 180;

          // Determine line color based on completion
          const isCompleted = currentStatus === 'completed' && nextStatus !== 'locked';

          return (
            <path
              key={`line-${lesson.id}`}
              d={`M ${x1}% ${y1} Q ${(x1 + x2) / 2}% ${(y1 + y2) / 2} ${x2}% ${y2}`}
              className={`connection-line ${isCompleted ? 'connection-line-completed' : ''}`}
              strokeWidth="3"
            />
          );
        })}
      </svg>

      {/* Lesson nodes */}
      <div className="relative" style={{ zIndex: 1 }}>
        {curriculum.map((lesson, index) => {
          const status = getLessonStatus(lesson.id);
          const position = getNodePosition(index);
          const progress = getLessonCompletionPercent(lesson.id);
          const isExpanded = expandedLessonId === lesson.id;
          const completedThemes = getCompletedThemes(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`
                flex flex-col items-center
                ${index > 0 ? 'mt-20' : ''}
              `}
            >
              {/* Node container with position */}
              <div
                className={`
                  w-full max-w-[280px]
                  ${getPositionOffset(position)}
                `}
              >
                <div className="flex justify-center">
                  <LessonNode
                    lesson={lesson}
                    status={status}
                    progress={progress}
                    isExpanded={isExpanded}
                    onClick={() => handleNodeClick(lesson.id)}
                  />
                </div>
              </div>

              {/* Theme list (centered below the node) */}
              <ThemeList
                lesson={lesson}
                status={status}
                isExpanded={isExpanded}
                completedThemes={completedThemes}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
