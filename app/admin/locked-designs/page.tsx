'use client';

import { useState } from 'react';

// ============================================================
// DESIGN OPTIONS FOR LOCKED LESSONS
// ============================================================

type LockStyle = 'subtle' | 'grayed' | 'blur' | 'overlay' | 'minimal';

const LOCK_STYLES: Record<LockStyle, { name: string; description: string }> = {
  subtle: { name: 'Subtle Lock', description: 'Dimmed with small lock icon' },
  grayed: { name: 'Grayed Out', description: 'Fully desaturated, obvious lock' },
  blur: { name: 'Blur Effect', description: 'Blurred content with lock overlay' },
  overlay: { name: 'Premium Overlay', description: 'Gold crown badge overlay' },
  minimal: { name: 'Minimal', description: 'Just the lock icon, no other changes' },
};

const MODULE_COLORS = ['#58CC02', '#1CB0F6', '#FF9600', '#A560E8'];

// Sample lesson data
interface SampleLesson {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  isNext?: boolean;
  locked?: boolean;
}

const sampleLessons: SampleLesson[] = [
  { id: '1.1.1', name: 'Easy Forks', description: 'Attack two pieces at once', completed: true },
  { id: '1.1.2', name: 'Discovered Attacks', description: 'Reveal hidden attacks', completed: true },
  { id: '1.1.3', name: 'Easy Skewers', description: 'Win the piece behind', completed: false, isNext: true },
  { id: '1.1.4', name: 'Simple Pins', description: 'Pin pieces to the king', completed: false, locked: true },
  { id: '1.1.5', name: 'Back Rank Threats', description: 'Threaten checkmate', completed: false, locked: true },
  { id: '1.1.6', name: 'Module Review', description: 'Practice all tactics', completed: false, locked: true },
];

// ============================================================
// LESSON CARD VARIANTS
// ============================================================

interface LessonCardProps {
  lesson: SampleLesson;
  moduleColor: string;
  lockStyle: LockStyle;
}

function LessonCardSubtle({ lesson, moduleColor }: Omit<LessonCardProps, 'lockStyle'>) {
  const isLocked = lesson.locked;
  const isCompleted = lesson.completed;
  const isNext = lesson.isNext;

  return (
    <button
      disabled={isLocked}
      className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
        isNext ? 'animate-pulse' : ''
      } ${
        isLocked
          ? 'bg-[#0D1B21] cursor-not-allowed opacity-60'
          : 'bg-[#1A2C35] hover:bg-[#243844] cursor-pointer'
      }`}
      style={{ borderColor: isNext ? moduleColor : 'transparent' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: isCompleted ? '#58CC02' : isLocked ? '#2A3A42' : moduleColor,
            color: isLocked ? '#5A6A72' : '#fff',
          }}
        >
          {isCompleted ? '✓' : isLocked ? '🔒' : lesson.id.split('.').pop()}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold truncate ${isLocked ? 'text-gray-500' : 'text-white'}`}>
            {lesson.name}
          </div>
          <div className={`text-xs truncate ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {lesson.description}
          </div>
        </div>
        {isNext ? (
          <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: moduleColor, color: '#000' }}>
            START
          </div>
        ) : (
          <div className={isLocked ? 'text-gray-600' : 'text-gray-500'}>
            {isLocked ? '' : '→'}
          </div>
        )}
      </div>
    </button>
  );
}

function LessonCardGrayed({ lesson, moduleColor }: Omit<LessonCardProps, 'lockStyle'>) {
  const isLocked = lesson.locked;
  const isCompleted = lesson.completed;
  const isNext = lesson.isNext;

  return (
    <button
      disabled={isLocked}
      className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
        isNext ? 'animate-pulse' : ''
      } ${
        isLocked
          ? 'bg-[#1A1A1A] cursor-not-allowed grayscale'
          : 'bg-[#1A2C35] hover:bg-[#243844] cursor-pointer'
      }`}
      style={{ borderColor: isNext ? moduleColor : 'transparent' }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
            isLocked ? 'bg-gray-700' : ''
          }`}
          style={{
            backgroundColor: isLocked ? undefined : isCompleted ? '#58CC02' : moduleColor,
            color: isLocked ? '#666' : '#fff',
          }}
        >
          {isCompleted ? '✓' : isLocked ? '🔒' : lesson.id.split('.').pop()}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold truncate ${isLocked ? 'text-gray-600' : 'text-white'}`}>
            {lesson.name}
          </div>
          <div className="text-xs truncate text-gray-500">
            {lesson.description}
          </div>
        </div>
        {isLocked && (
          <div className="px-2 py-1 rounded bg-gray-700 text-gray-400 text-xs">
            LOCKED
          </div>
        )}
        {isNext && (
          <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: moduleColor, color: '#000' }}>
            START
          </div>
        )}
      </div>
    </button>
  );
}

function LessonCardBlur({ lesson, moduleColor }: Omit<LessonCardProps, 'lockStyle'>) {
  const isLocked = lesson.locked;
  const isCompleted = lesson.completed;
  const isNext = lesson.isNext;

  return (
    <div className="relative">
      <button
        disabled={isLocked}
        className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
          isNext ? 'animate-pulse' : ''
        } ${
          isLocked
            ? 'bg-[#1A2C35] cursor-not-allowed blur-[2px]'
            : 'bg-[#1A2C35] hover:bg-[#243844] cursor-pointer'
        }`}
        style={{ borderColor: isNext ? moduleColor : 'transparent' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{
              backgroundColor: isCompleted ? '#58CC02' : moduleColor,
              color: '#fff',
            }}
          >
            {isCompleted ? '✓' : lesson.id.split('.').pop()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate text-white">{lesson.name}</div>
            <div className="text-xs truncate text-gray-400">{lesson.description}</div>
          </div>
          {isNext && (
            <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: moduleColor, color: '#000' }}>
              START
            </div>
          )}
        </div>
      </button>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 px-3 py-2 rounded-lg flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span className="text-white text-sm font-semibold">Complete previous lesson</span>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonCardOverlay({ lesson, moduleColor }: Omit<LessonCardProps, 'lockStyle'>) {
  const isLocked = lesson.locked;
  const isCompleted = lesson.completed;
  const isNext = lesson.isNext;

  return (
    <div className="relative">
      <button
        disabled={isLocked}
        className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
          isNext ? 'animate-pulse' : ''
        } ${
          isLocked
            ? 'bg-[#1A2C35] cursor-not-allowed'
            : 'bg-[#1A2C35] hover:bg-[#243844] cursor-pointer'
        }`}
        style={{
          borderColor: isNext ? moduleColor : isLocked ? '#FFD70050' : 'transparent',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm relative"
            style={{
              backgroundColor: isCompleted ? '#58CC02' : isLocked ? '#3A4A52' : moduleColor,
              color: isLocked ? '#8A9AA2' : '#fff',
            }}
          >
            {isCompleted ? '✓' : isLocked ? '🔒' : lesson.id.split('.').pop()}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold truncate ${isLocked ? 'text-gray-400' : 'text-white'}`}>
              {lesson.name}
            </div>
            <div className="text-xs truncate text-gray-500">{lesson.description}</div>
          </div>
          {isNext && (
            <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: moduleColor, color: '#000' }}>
              START
            </div>
          )}
        </div>
      </button>
      {isLocked && (
        <div className="absolute top-1 right-1">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 rounded text-[10px] font-bold text-black flex items-center gap-1">
            <span>👑</span> PREMIUM
          </div>
        </div>
      )}
    </div>
  );
}

function LessonCardMinimal({ lesson, moduleColor }: Omit<LessonCardProps, 'lockStyle'>) {
  const isLocked = lesson.locked;
  const isCompleted = lesson.completed;
  const isNext = lesson.isNext;

  return (
    <button
      disabled={isLocked}
      className={`w-full text-left p-3 rounded-xl transition-all border-2 ${
        isNext ? 'animate-pulse' : ''
      } ${
        isLocked
          ? 'bg-[#1A2C35] cursor-not-allowed'
          : 'bg-[#1A2C35] hover:bg-[#243844] cursor-pointer'
      }`}
      style={{ borderColor: isNext ? moduleColor : 'transparent' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: isCompleted ? '#58CC02' : moduleColor,
            color: '#fff',
          }}
        >
          {isCompleted ? '✓' : lesson.id.split('.').pop()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate text-white">{lesson.name}</div>
          <div className="text-xs truncate text-gray-400">{lesson.description}</div>
        </div>
        {isLocked ? (
          <div className="text-gray-500 text-xl">🔒</div>
        ) : isNext ? (
          <div className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: moduleColor, color: '#000' }}>
            START
          </div>
        ) : (
          <div className="text-gray-500">→</div>
        )}
      </div>
    </button>
  );
}

// ============================================================
// MODULE COMPONENT
// ============================================================

interface ModuleProps {
  title: string;
  color: string;
  expanded: boolean;
  onToggle: () => void;
  lessons: SampleLesson[];
  lockStyle: LockStyle;
  completedCount: number;
  isLocked?: boolean;
}

function Module({ title, color, expanded, onToggle, lessons, lockStyle, completedCount, isLocked }: ModuleProps) {
  const LessonCard = {
    subtle: LessonCardSubtle,
    grayed: LessonCardGrayed,
    blur: LessonCardBlur,
    overlay: LessonCardOverlay,
    minimal: LessonCardMinimal,
  }[lockStyle];

  return (
    <div className={`mb-3 ${isLocked ? 'opacity-60' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all"
        style={{ backgroundColor: expanded ? color : '#1A2C35' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
          style={{
            backgroundColor: expanded ? 'rgba(255,255,255,0.2)' : color,
            color: 'white',
          }}
        >
          {isLocked ? '🔒' : completedCount === lessons.length ? '✓' : '1'}
        </div>
        <div className="flex-1 text-left">
          <div className="font-bold text-white">{title}</div>
          <div className={`text-xs ${expanded ? 'text-white/70' : 'text-gray-400'}`}>
            {completedCount}/{lessons.length} complete
          </div>
        </div>
        <div
          className={`text-xl transition-transform ${expanded ? 'rotate-180' : ''}`}
          style={{ color: expanded ? 'rgba(255,255,255,0.7)' : color }}
        >
          ▾
        </div>
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 pl-2">
          {lessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} moduleColor={color} />
          ))}
        </div>
      )}
    </div>
  );
}

// Locked module variant
function LockedModule({ title, color, lockStyle }: { title: string; color: string; lockStyle: LockStyle }) {
  const variants = {
    subtle: (
      <div className="mb-3 opacity-50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A2C35]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gray-700 text-gray-500">
            🔒
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-gray-500">{title}</div>
            <div className="text-xs text-gray-600">Complete previous module</div>
          </div>
          <div className="text-xl text-gray-600">▾</div>
        </div>
      </div>
    ),
    grayed: (
      <div className="mb-3 grayscale">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A1A1A]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gray-800 text-gray-600">
            🔒
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-gray-600">{title}</div>
            <div className="text-xs text-gray-700">LOCKED</div>
          </div>
          <div className="px-2 py-1 rounded bg-gray-800 text-gray-500 text-xs">LOCKED</div>
        </div>
      </div>
    ),
    blur: (
      <div className="mb-3 relative">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A2C35] blur-[2px]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: color }}>
            2
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-white">{title}</div>
            <div className="text-xs text-gray-400">0/6 complete</div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/70 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <span className="text-white font-semibold">Complete Module 1</span>
          </div>
        </div>
      </div>
    ),
    overlay: (
      <div className="mb-3 relative">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A2C35] border-2 border-yellow-500/30">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gray-700 text-gray-400">
            🔒
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-gray-400">{title}</div>
            <div className="text-xs text-gray-500">Unlock with Premium</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-lg text-xs font-bold text-black flex items-center gap-1">
            <span>👑</span> UPGRADE
          </div>
        </div>
      </div>
    ),
    minimal: (
      <div className="mb-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A2C35]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: color }}>
            2
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-white">{title}</div>
            <div className="text-xs text-gray-400">0/6 complete</div>
          </div>
          <div className="text-2xl">🔒</div>
        </div>
      </div>
    ),
  };

  return variants[lockStyle];
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function LockedDesignsPage() {
  const [selectedStyle, setSelectedStyle] = useState<LockStyle>('subtle');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'module-1': true,
    'module-2': false,
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Locked Lesson Designs</h1>
        <p className="text-gray-400 mb-6">
          Compare different visual treatments for locked lessons and modules
        </p>

        {/* Style Selector */}
        <div className="bg-[#1A2C35] rounded-xl p-4 mb-6">
          <h2 className="font-semibold mb-3">Select Lock Style</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LOCK_STYLES) as LockStyle[]).map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedStyle === style
                    ? 'bg-[#58CC02] text-black font-bold'
                    : 'bg-[#0D1A1F] text-gray-400 hover:text-white'
                }`}
              >
                {LOCK_STYLES[style].name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{LOCK_STYLES[selectedStyle].description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expanded Module */}
          <div className="bg-[#0D1A1F] rounded-xl p-4">
            <h3 className="font-semibold mb-4 text-gray-400">Expanded Module (with locked lessons)</h3>
            <Module
              title="Module 1: Getting Started"
              color={MODULE_COLORS[0]}
              expanded={true}
              onToggle={() => {}}
              lessons={sampleLessons}
              lockStyle={selectedStyle}
              completedCount={2}
            />
          </div>

          {/* Collapsed Module */}
          <div className="bg-[#0D1A1F] rounded-xl p-4">
            <h3 className="font-semibold mb-4 text-gray-400">Collapsed Modules</h3>
            <Module
              title="Module 1: Getting Started"
              color={MODULE_COLORS[0]}
              expanded={false}
              onToggle={() => toggleModule('module-1')}
              lessons={sampleLessons}
              lockStyle={selectedStyle}
              completedCount={2}
            />
            <LockedModule
              title="Module 2: Tactical Patterns"
              color={MODULE_COLORS[1]}
              lockStyle={selectedStyle}
            />
          </div>

          {/* All Styles Comparison - Lessons */}
          <div className="bg-[#0D1A1F] rounded-xl p-4">
            <h3 className="font-semibold mb-4 text-gray-400">All Styles - Locked Lesson</h3>
            <div className="space-y-4">
              {(Object.keys(LOCK_STYLES) as LockStyle[]).map(style => {
                const Card = {
                  subtle: LessonCardSubtle,
                  grayed: LessonCardGrayed,
                  blur: LessonCardBlur,
                  overlay: LessonCardOverlay,
                  minimal: LessonCardMinimal,
                }[style];
                return (
                  <div key={style}>
                    <div className="text-xs text-gray-500 mb-1">{LOCK_STYLES[style].name}</div>
                    <Card
                      lesson={{ ...sampleLessons[3], locked: true }}
                      moduleColor={MODULE_COLORS[0]}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Styles Comparison - Modules */}
          <div className="bg-[#0D1A1F] rounded-xl p-4">
            <h3 className="font-semibold mb-4 text-gray-400">All Styles - Locked Module</h3>
            <div className="space-y-4">
              {(Object.keys(LOCK_STYLES) as LockStyle[]).map(style => (
                <div key={style}>
                  <div className="text-xs text-gray-500 mb-1">{LOCK_STYLES[style].name}</div>
                  <LockedModule
                    title="Module 2: Tactical Patterns"
                    color={MODULE_COLORS[1]}
                    lockStyle={style}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Preview */}
          <div className="lg:col-span-2 bg-[#0D1A1F] rounded-xl p-4">
            <h3 className="font-semibold mb-4 text-gray-400">
              Interactive Preview - {LOCK_STYLES[selectedStyle].name}
            </h3>
            <div className="max-w-md mx-auto">
              <div className="h-1 mb-4 bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

              <Module
                title="Module 1: Getting Started"
                color={MODULE_COLORS[0]}
                expanded={expandedModules['module-1']}
                onToggle={() => toggleModule('module-1')}
                lessons={sampleLessons}
                lockStyle={selectedStyle}
                completedCount={2}
              />

              <LockedModule
                title="Module 2: Tactical Patterns"
                color={MODULE_COLORS[1]}
                lockStyle={selectedStyle}
              />

              <LockedModule
                title="Module 3: Checkmate Patterns"
                color={MODULE_COLORS[2]}
                lockStyle={selectedStyle}
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-[#1A2C35] rounded-xl p-4">
          <h3 className="font-semibold mb-3">Lesson States</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#58CC02] flex items-center justify-center text-white font-bold">✓</div>
              <span className="text-gray-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#58CC02] flex items-center justify-center text-white font-bold">3</div>
              <span className="text-gray-400">Next (Available)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500">🔒</div>
              <span className="text-gray-400">Locked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-black font-bold">👑</div>
              <span className="text-gray-400">Premium Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
