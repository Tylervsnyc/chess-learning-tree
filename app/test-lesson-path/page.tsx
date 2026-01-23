'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckIcon, PlayIcon, LockIcon } from '@/components/ui/icons';

// Different green shade strategies
const greenStrategies = {
  lightToDark: {
    name: 'Light to Dark',
    description: 'Lighter green first, darker as you progress',
    colors: ['#7FE033', '#58CC02', '#45A001', '#2E7300'],
  },
  darkToLight: {
    name: 'Dark to Light',
    description: 'Darker first, lighter toward the end',
    colors: ['#2E7300', '#45A001', '#58CC02', '#7FE033'],
  },
  transparentToSolid: {
    name: 'Transparent to Solid',
    description: 'Same green, 40% → 100% opacity',
    colors: [
      'rgba(88, 204, 2, 0.4)',
      'rgba(88, 204, 2, 0.6)',
      'rgba(88, 204, 2, 0.8)',
      'rgba(88, 204, 2, 1)',
    ],
  },
  solidToTransparent: {
    name: 'Solid to Transparent',
    description: 'Full opacity first, fading out',
    colors: [
      'rgba(88, 204, 2, 1)',
      'rgba(88, 204, 2, 0.8)',
      'rgba(88, 204, 2, 0.6)',
      'rgba(88, 204, 2, 0.4)',
    ],
  },
  saturationGradient: {
    name: 'Saturation',
    description: 'Muted to vibrant green',
    colors: ['#7AB86E', '#69B84A', '#58CC02', '#4AE000'],
  },
  warmToCool: {
    name: 'Warm → Cool',
    description: 'Yellow-green to blue-green',
    colors: ['#8BD02A', '#58CC02', '#3EC95C', '#2DC888'],
  },
};

// Different completion indicator styles
const completionStyles = {
  goldRing: {
    name: 'Gold Ring',
    description: 'Gold ring around circle',
  },
  goldBackground: {
    name: 'Gold Background',
    description: 'Full gold gradient',
  },
  whiteCheck: {
    name: 'White Badge',
    description: 'White circle with check',
  },
  starBurst: {
    name: 'Star Burst',
    description: 'Gold star behind',
  },
  crownBadge: {
    name: 'Crown',
    description: 'Crown icon above',
  },
  shimmer: {
    name: 'Shimmer',
    description: 'Animated shine effect',
  },
};

type GreenStrategy = keyof typeof greenStrategies;
type CompletionStyle = keyof typeof completionStyles;

export default function TestLessonPathPage() {
  const [selectedGreenStrategy, setSelectedGreenStrategy] = useState<GreenStrategy>('lightToDark');
  const [selectedCompletionStyle, setSelectedCompletionStyle] = useState<CompletionStyle>('goldRing');
  const [firstLessonCompleted, setFirstLessonCompleted] = useState(false);

  const lessons = [
    { id: 1, name: 'Hanging Pieces', status: firstLessonCompleted ? 'completed' : 'available', progress: 3 },
    { id: 2, name: 'Undefended Pieces', status: 'available', progress: 0 },
    { id: 3, name: 'Counting Attackers', status: 'locked', progress: 0 },
    { id: 4, name: 'Piece Values', status: 'locked', progress: 0 },
  ];

  const currentColors = greenStrategies[selectedGreenStrategy].colors;

  const getStatusIcon = (status: string, lessonIndex: number, color: string) => {
    if (status === 'completed') {
      return renderCompletedIcon(lessonIndex, color);
    }
    if (status === 'available') {
      return (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: color }}
        >
          <PlayIcon size={18} className="text-white" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
        <LockIcon size={16} className="text-gray-400" />
      </div>
    );
  };

  const renderCompletedIcon = (lessonIndex: number, color: string) => {
    switch (selectedCompletionStyle) {
      case 'goldRing':
        return (
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#1A2C35]"
              style={{ backgroundColor: color }}
            >
              <CheckIcon size={18} className="text-white" />
            </div>
          </div>
        );
      case 'goldBackground':
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center shadow-lg">
            <CheckIcon size={18} className="text-white drop-shadow" />
          </div>
        );
      case 'whiteCheck':
        return (
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <PlayIcon size={18} className="text-white opacity-30" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md">
              <CheckIcon size={12} className="text-[#58CC02]" />
            </div>
          </div>
        );
      case 'starBurst':
        return (
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="absolute w-10 h-10">
              <polygon
                points="20,2 24,15 38,15 27,23 31,36 20,28 9,36 13,23 2,15 16,15"
                fill="#FFD700"
                className="animate-pulse"
              />
            </svg>
            <div
              className="relative w-7 h-7 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: color }}
            >
              <CheckIcon size={16} className="text-white" />
            </div>
          </div>
        );
      case 'crownBadge':
        return (
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <CheckIcon size={18} className="text-white" />
            </div>
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="#FFD700">
                <path d="M0 10L2 4L5 6L8 0L11 6L14 4L16 10V12H0V10Z" />
              </svg>
            </div>
          </div>
        );
      case 'shimmer':
        return (
          <div className="relative overflow-visible">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: color }}
            >
              <CheckIcon size={18} className="text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
        );
      default:
        return (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <CheckIcon size={18} className="text-white" />
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-[#131F24] text-white flex">
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Left side - Controls */}
      <div className="w-1/2 border-r border-white/10 p-6 overflow-y-auto">
        <Link href="/learn" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
          ← Back to Learn
        </Link>

        <h1 className="text-2xl font-bold mb-2">Lesson Path Design</h1>
        <p className="text-gray-400 text-sm mb-6">Test different visual styles for lesson progression</p>

        {/* Green Strategy Selector */}
        <div className="mb-6">
          <h2 className="font-bold mb-3">Green Shade Strategy</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(greenStrategies).map(([key, strategy]) => (
              <button
                key={key}
                onClick={() => setSelectedGreenStrategy(key as GreenStrategy)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedGreenStrategy === key
                    ? 'bg-[#58CC02]/20 ring-2 ring-[#58CC02]'
                    : 'bg-[#1A2C35] hover:bg-[#2A3C45]'
                }`}
              >
                <div className="font-medium text-sm">{strategy.name}</div>
                <div className="text-xs text-gray-400 mb-2">{strategy.description}</div>
                <div className="flex gap-1">
                  {strategy.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Completion Style Selector */}
        <div className="mb-6">
          <h2 className="font-bold mb-3">Completion Indicator</h2>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(completionStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setSelectedCompletionStyle(key as CompletionStyle)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedCompletionStyle === key
                    ? 'bg-[#58CC02]/20 ring-2 ring-[#58CC02]'
                    : 'bg-[#1A2C35] hover:bg-[#2A3C45]'
                }`}
              >
                <div className="font-medium text-sm">{style.name}</div>
                <div className="text-xs text-gray-400">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle first lesson completion */}
        <div className="mb-6 bg-[#1A2C35] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">First Lesson Completed</div>
              <div className="text-sm text-gray-400">Toggle to see completion style</div>
            </div>
            <button
              onClick={() => setFirstLessonCompleted(!firstLessonCompleted)}
              className={`w-14 h-8 rounded-full transition-all ${
                firstLessonCompleted ? 'bg-[#58CC02]' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                  firstLessonCompleted ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Current Values */}
        <div className="bg-[#0D1A1F] rounded-xl p-4 border border-white/10">
          <h2 className="font-bold mb-3">Current Rule</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Strategy:</span>
              <span>{greenStrategies[selectedGreenStrategy].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Completion:</span>
              <span>{completionStyles[selectedCompletionStyle].name}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-gray-400">Color values:</div>
            <div className="flex gap-2 mt-2">
              {currentColors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-8 h-8 rounded-full mx-auto border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-[10px] text-gray-500 mt-1">L{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="w-1/2 flex items-center justify-center bg-[#131F24]">
        <div className="w-full max-w-md px-6">
          {/* Module Header */}
          <div className="bg-[#1A2C35] rounded-t-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#58CC02] flex items-center justify-center text-2xl">
                ♟️
              </div>
              <div>
                <div className="font-bold text-lg">Capturing Basics</div>
                <div className="text-sm text-gray-400">Level 1 · Foundations</div>
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="bg-[#1A2C35] rounded-b-2xl border-t border-white/10">
            {lessons.map((lesson, index) => {
              const color = lesson.status === 'locked' ? '#4B4B4B' : currentColors[index];
              const isAvailable = lesson.status !== 'locked';

              return (
                <div
                  key={lesson.id}
                  className={`
                    flex items-center gap-3 p-4 transition-all
                    ${index < lessons.length - 1 ? 'border-b border-white/5' : ''}
                    ${isAvailable ? 'hover:bg-white/5' : 'opacity-60'}
                    ${lesson.status === 'completed' ? 'bg-[#58CC02]/10' : ''}
                  `}
                >
                  {getStatusIcon(lesson.status, index, color)}

                  <div className="flex-1">
                    <span
                      className={`text-sm font-medium ${
                        lesson.status === 'completed'
                          ? 'text-[#58CC02]'
                          : isAvailable
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {lesson.name}
                    </span>
                    {lesson.status === 'available' && (
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: i < lesson.progress ? color : '#374151',
                            }}
                          />
                        ))}
                        <span className="ml-2 text-xs text-gray-400">
                          {lesson.progress}/5
                        </span>
                      </div>
                    )}
                  </div>

                  {isAvailable && lesson.status !== 'completed' && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-gray-400"
                    >
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          {/* Start Button Preview */}
          <button className="w-full mt-4 py-4 rounded-xl font-bold text-white bg-[#58CC02] shadow-[0_4px_0_#3d8c01]">
            Start Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
