'use client';

import React from 'react';
import { NodeStatus, Lesson } from '@/types/curriculum';
import { CrownIcon, LockIcon, StarIcon } from '@/components/ui/icons';
import { ProgressRing } from './ProgressRing';

interface LessonNodeProps {
  lesson: Lesson;
  status: NodeStatus;
  progress?: number; // 0-100, only for in_progress state
  isExpanded: boolean;
  onClick: () => void;
}

export function LessonNode({
  lesson,
  status,
  progress = 0,
  isExpanded,
  onClick,
}: LessonNodeProps) {
  const nodeSize = 72;

  const getNodeStyles = () => {
    switch (status) {
      case 'completed':
        return {
          container: 'gold-gradient node-shadow-lg',
          icon: <CrownIcon size={28} className="text-white drop-shadow-md" />,
        };
      case 'in_progress':
        return {
          container: 'bg-[#1CB0F6] node-shadow-lg',
          icon: <StarIcon size={28} className="text-white" />,
        };
      case 'available':
        return {
          container: 'bg-[#58CC02] node-shadow-lg animate-[pulse-glow_2s_ease-in-out_infinite]',
          icon: <StarIcon size={28} className="text-white" />,
        };
      case 'locked':
      default:
        return {
          container: 'bg-[#4B4B4B] node-shadow',
          icon: <LockIcon size={24} className="text-gray-400" />,
        };
    }
  };

  const styles = getNodeStyles();
  const isInteractive = status !== 'locked';

  return (
    <button
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      className={`
        relative flex flex-col items-center
        tap-highlight transition-all duration-200
        ${isInteractive ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-not-allowed'}
        ${isExpanded ? 'scale-110' : ''}
      `}
      aria-label={`${lesson.name} - ${status}`}
    >
      {/* Progress ring for in_progress state */}
      {status === 'in_progress' && (
        <div className="absolute" style={{ width: nodeSize + 8, height: nodeSize + 8 }}>
          <ProgressRing
            progress={progress}
            size={nodeSize + 8}
            strokeWidth={4}
            backgroundColor="#1A2C35"
            progressColor="#58CC02"
          />
        </div>
      )}

      {/* Node circle */}
      <div
        className={`
          flex items-center justify-center rounded-full
          transition-all duration-200
          ${styles.container}
          ${isExpanded ? 'ring-4 ring-white/30' : ''}
        `}
        style={{ width: nodeSize, height: nodeSize }}
      >
        {styles.icon}
      </div>

      {/* Lesson name */}
      <span
        className={`
          mt-2 text-sm font-medium text-center max-w-[100px] leading-tight
          ${status === 'locked' ? 'text-gray-500' : 'text-white'}
        `}
      >
        {lesson.name}
      </span>

      {/* Lesson number badge */}
      <span
        className={`
          absolute -top-1 -right-1 w-6 h-6 rounded-full
          flex items-center justify-center text-xs font-bold
          ${status === 'completed' ? 'bg-white text-[#B8860B]' : ''}
          ${status === 'in_progress' ? 'bg-white text-[#1CB0F6]' : ''}
          ${status === 'available' ? 'bg-white text-[#58CC02]' : ''}
          ${status === 'locked' ? 'bg-gray-600 text-gray-400' : ''}
        `}
      >
        {lesson.order}
      </span>
    </button>
  );
}
