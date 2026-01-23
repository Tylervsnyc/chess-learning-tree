'use client';

import { useState } from 'react';
import { ChevronDownIcon, CheckIcon } from '@/components/ui/icons';

// Mock data for demonstration
const MOCK_SECTIONS = [
  {
    id: 'section-1',
    name: 'Getting Started',
    lessons: [
      { id: '1.1.1', name: 'Easy Forks', completed: true },
      { id: '1.1.2', name: 'Discovered Attacks', completed: true },
      { id: '1.1.3', name: 'Easy Skewers', completed: false, isCurrent: true },
      { id: '1.1.4', name: 'Pin Basics', completed: false },
    ],
  },
  {
    id: 'section-2',
    name: 'Mate in 1',
    lessons: [
      { id: '1.2.1', name: 'Queen Mates', completed: false },
      { id: '1.2.2', name: 'Rook Mates', completed: false },
      { id: '1.2.3', name: 'Bishop Mates', completed: false },
      { id: '1.2.4', name: 'Knight Mates', completed: false },
      { id: '1.2.5', name: 'Back Rank Mates', completed: false },
    ],
  },
  {
    id: 'section-3',
    name: 'Double Attacks',
    lessons: [
      { id: '1.3.1', name: 'Knight Forks', completed: false },
      { id: '1.3.2', name: 'Queen Forks', completed: false },
      { id: '1.3.3', name: 'Pawn Forks', completed: false },
    ],
  },
];

// Section colors
const SECTION_COLORS = [
  { main: '#58CC02', glow: '#58CC02', dark: '#3d8a01' },
  { main: '#1CB0F6', glow: '#1CB0F6', dark: '#1489bd' },
  { main: '#FF9600', glow: '#FF9600', dark: '#cc7800' },
  { main: '#FF4B4B', glow: '#FF4B4B', dark: '#cc3c3c' },
  { main: '#A560E8', glow: '#A560E8', dark: '#8449ba' },
  { main: '#00CD9C', glow: '#00CD9C', dark: '#00a37d' },
];

interface Lesson {
  id: string;
  name: string;
  completed: boolean;
  isCurrent?: boolean;
}

interface Section {
  id: string;
  name: string;
  lessons: Lesson[];
}

// Textured stone tile component
function StoneTile({
  lesson,
  index,
  sectionColor,
  isAvailable,
}: {
  lesson: Lesson;
  index: number;
  sectionColor: { main: string; glow: string; dark: string };
  isAvailable: boolean;
}) {
  const isCompleted = lesson.completed;
  const isCurrent = lesson.isCurrent;
  const isLit = isCompleted || isCurrent;
  const isDark = !isAvailable && !isCompleted;

  // Colors based on state
  const stoneColor = isDark ? '#3a3a3a' : isLit ? sectionColor.main : '#5a5a5a';
  const stoneDark = isDark ? '#252525' : isLit ? sectionColor.dark : '#3a3a3a';

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        disabled={isDark}
        className={`
          relative w-[76px] h-[76px] overflow-hidden
          transition-all duration-150
          ${isDark ? 'cursor-not-allowed' : 'cursor-pointer active:translate-y-[4px]'}
          ${!isDark ? 'hover:brightness-110' : ''}
        `}
        style={{
          background: `linear-gradient(145deg, ${stoneColor} 0%, ${stoneDark} 100%)`,
          borderRadius: '16px',
          border: `3px solid ${stoneDark}`,
          boxShadow: isLit
            ? `0 4px 0 ${stoneDark}, 0 0 16px ${sectionColor.glow}40, inset 0 2px 4px rgba(255,255,255,0.2)`
            : `0 4px 0 ${stoneDark}, inset 0 2px 4px rgba(255,255,255,0.1)`,
        }}
      >
        {/* Top highlight bevel */}
        <div
          className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,${isDark ? '0.08' : '0.2'}) 0%, transparent 100%)`,
            borderRadius: '13px 13px 0 0',
          }}
        />

        {/* Stone texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: isDark ? 0.1 : 0.15,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {isCompleted ? (
            <CheckIcon size={34} className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]" />
          ) : (
            <span
              className={`font-black text-2xl ${
                isDark ? 'text-gray-500' : isLit ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: '0 2px 3px rgba(0,0,0,0.4)',
              }}
            >
              {index + 1}
            </span>
          )}
        </div>

        {/* Glow ring for current lesson */}
        {isCurrent && (
          <div
            className="absolute -inset-1 rounded-[20px] pointer-events-none animate-pulse-glow"
            style={{
              border: `2px solid ${sectionColor.glow}`,
              boxShadow: `0 0 20px ${sectionColor.glow}80`,
            }}
          />
        )}
      </button>

      {/* Lesson name */}
      <span
        className={`text-xs text-center max-w-[90px] leading-tight font-semibold ${
          isDark ? 'text-gray-600' : isLit ? 'text-white' : 'text-gray-400'
        }`}
      >
        {lesson.name}
      </span>
    </div>
  );
}

// Section component (expandable)
function SectionCard({
  section,
  index,
  isExpanded,
  onToggle,
}: {
  section: Section;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const sectionColor = SECTION_COLORS[index % SECTION_COLORS.length];
  const completedCount = section.lessons.filter((l) => l.completed).length;
  const totalCount = section.lessons.length;
  const isComplete = completedCount === totalCount;

  const currentLessonIndex = section.lessons.findIndex((l) => l.isCurrent);
  const hasCurrentLesson = currentLessonIndex !== -1;

  const getIsAvailable = (lessonIndex: number) => {
    const lesson = section.lessons[lessonIndex];
    if (lesson.completed) return true;
    if (lesson.isCurrent) return true;
    if (hasCurrentLesson) {
      return lessonIndex <= currentLessonIndex;
    }
    return false;
  };

  const getXOffset = (lessonIndex: number) => {
    const pattern = [0, 60, 0, -60];
    return pattern[lessonIndex % 4];
  };

  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 rounded-2xl flex items-center justify-between transition-all duration-300"
        style={{
          background: isExpanded
            ? `linear-gradient(135deg, ${sectionColor.main} 0%, ${sectionColor.dark} 100%)`
            : 'linear-gradient(135deg, #1e3a44 0%, #1A2C35 50%, #162730 100%)',
          boxShadow: isExpanded
            ? `
              0 6px 0 ${sectionColor.dark}cc,
              0 10px 20px rgba(0,0,0,0.3),
              inset 0 2px 4px rgba(255,255,255,0.2)
            `
            : `
              0 6px 0 #0f1a1f,
              0 10px 20px rgba(0,0,0,0.3),
              inset 0 2px 4px rgba(255,255,255,0.05)
            `,
          borderLeft: !isExpanded ? `4px solid ${sectionColor.main}` : undefined,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white"
            style={{
              background: isExpanded
                ? 'rgba(255,255,255,0.2)'
                : `linear-gradient(135deg, ${sectionColor.main} 0%, ${sectionColor.dark} 100%)`,
              boxShadow: isExpanded
                ? 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)'
                : `0 4px 0 ${sectionColor.dark}, inset 0 2px 4px rgba(255,255,255,0.2)`,
            }}
          >
            {isComplete ? <CheckIcon size={24} className="text-white" /> : index + 1}
          </div>

          <div className="text-left">
            <h3 className="font-bold text-white text-lg">{section.name}</h3>
            <p className={`text-sm ${isExpanded ? 'text-white/70' : 'text-gray-400'}`}>
              {completedCount}/{totalCount} lessons
            </p>
          </div>
        </div>

        <div
          className="transition-transform duration-300"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronDownIcon size={28} className={isExpanded ? 'text-white' : 'text-gray-400'} />
        </div>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
        `}
      >
        <div
          className="px-4 py-8 rounded-2xl relative"
          style={{
            background: `linear-gradient(180deg, #0a1418 0%, #0d1a1f 50%, #0a1418 100%)`,
            boxShadow: `
              inset 0 2px 20px rgba(0,0,0,0.5),
              inset 0 0 60px ${sectionColor.main}10
            `,
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, ${sectionColor.main}15 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, ${sectionColor.main}10 0%, transparent 50%)
              `,
            }}
          />

          <div className="flex flex-col items-center gap-4 relative">
            {section.lessons.map((lesson, lessonIndex) => {
              const xOffset = getXOffset(lessonIndex);
              const isAvailable = getIsAvailable(lessonIndex);

              return (
                <div
                  key={lesson.id}
                  style={{ transform: `translateX(${xOffset}px)` }}
                  className="transition-transform duration-300"
                >
                  <StoneTile
                    lesson={lesson}
                    index={lessonIndex}
                    sectionColor={sectionColor}
                    isAvailable={isAvailable}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stone Path View
function StonePathView() {
  const [expandedSection, setExpandedSection] = useState<string | null>('section-1');

  const handleToggle = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {MOCK_SECTIONS.map((section, index) => (
        <SectionCard
          key={section.id}
          section={section}
          index={index}
          isExpanded={expandedSection === section.id}
          onToggle={() => handleToggle(section.id)}
        />
      ))}
      <div className="h-20" />
    </div>
  );
}

// ============================================================================
// BUTTON DESIGNS TAB - Textured Cobblestone Variations
// ============================================================================

// Textured stone button component
function TexturedStoneButton({
  children,
  color,
  darkColor,
  label,
  glow = false,
}: {
  children: React.ReactNode;
  color: string;
  darkColor: string;
  label: string;
  glow?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">{label}</p>
      <button
        className="relative px-8 py-4 font-bold text-white transition-all duration-150 active:translate-y-[4px] overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${color} 0%, ${darkColor} 100%)`,
          borderRadius: '12px',
          border: `3px solid ${darkColor}`,
          boxShadow: glow
            ? `0 4px 0 ${darkColor}, 0 0 16px ${color}40, inset 0 2px 4px rgba(255,255,255,0.2)`
            : `0 4px 0 ${darkColor}, inset 0 2px 4px rgba(255,255,255,0.15)`,
        }}
      >
        <span className="relative z-10">{children}</span>
        {/* Top highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
            borderRadius: '9px 9px 0 0',
          }}
        />
        {/* Stone texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </button>
    </div>
  );
}

function ButtonDesignsView() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="space-y-6">

        {/* Gray - Unlit/Default */}
        <TexturedStoneButton
          label="01 — Gray (Unlit)"
          color="#5a5a5a"
          darkColor="#3a3a3a"
        >
          Continue
        </TexturedStoneButton>

        {/* Green - Primary/Active */}
        <TexturedStoneButton
          label="02 — Green (Active)"
          color="#58CC02"
          darkColor="#3d8a01"
          glow
        >
          Start Lesson
        </TexturedStoneButton>

        {/* Green Light to Dark */}
        <TexturedStoneButton
          label="03 — Green (Light)"
          color="#7de332"
          darkColor="#58CC02"
          glow
        >
          Lesson 1
        </TexturedStoneButton>

        <TexturedStoneButton
          label="04 — Green (Mid)"
          color="#58CC02"
          darkColor="#3d9102"
          glow
        >
          Lesson 2
        </TexturedStoneButton>

        <TexturedStoneButton
          label="05 — Green (Dark)"
          color="#3d9102"
          darkColor="#2d6a01"
          glow
        >
          Lesson 3
        </TexturedStoneButton>

        {/* Blue */}
        <TexturedStoneButton
          label="06 — Blue"
          color="#1CB0F6"
          darkColor="#1489bd"
          glow
        >
          Info
        </TexturedStoneButton>

        {/* Blue gradient */}
        <TexturedStoneButton
          label="07 — Blue (Dark)"
          color="#1489bd"
          darkColor="#0e6080"
          glow
        >
          Lesson 2
        </TexturedStoneButton>

        {/* Orange */}
        <TexturedStoneButton
          label="08 — Orange"
          color="#FF9600"
          darkColor="#cc7800"
          glow
        >
          Retry
        </TexturedStoneButton>

        {/* Purple */}
        <TexturedStoneButton
          label="09 — Purple"
          color="#A560E8"
          darkColor="#8449ba"
          glow
        >
          Challenge
        </TexturedStoneButton>

        {/* Teal */}
        <TexturedStoneButton
          label="10 — Teal"
          color="#00CD9C"
          darkColor="#00a37d"
          glow
        >
          Practice
        </TexturedStoneButton>

        {/* Red */}
        <TexturedStoneButton
          label="11 — Red"
          color="#FF4B4B"
          darkColor="#cc3c3c"
          glow
        >
          Reset
        </TexturedStoneButton>

        {/* Disabled */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">12 — Disabled</p>
          <button
            disabled
            className="relative px-8 py-4 font-bold text-gray-500 cursor-not-allowed overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #2d2d2d 0%, #1d1d1d 100%)',
              borderRadius: '12px',
              border: '3px solid #1a1a1a',
              boxShadow: '0 4px 0 #111',
              opacity: 0.5,
            }}
          >
            <span className="relative z-10">Locked</span>
            <div
              className="absolute inset-0 opacity-[0.1] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          </button>
        </div>

      </div>
      <div className="h-20" />
    </div>
  );
}

// ============================================================================
// MAIN PAGE WITH TABS
// ============================================================================

export default function TestSectionsPage() {
  const [activeTab, setActiveTab] = useState<'path' | 'buttons'>('path');

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div
          className="border-b border-white/10 px-4 py-4 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1e3a44 0%, #1A2C35 100%)',
          }}
        >
          <h1 className="text-xl font-bold text-white">Design Lab</h1>
          <p className="text-sm text-gray-400">Component experiments</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 px-4 py-3 bg-[#0d1a1f] border-b border-white/5">
          <button
            onClick={() => setActiveTab('path')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'path'
                ? 'bg-[#58CC02] text-white shadow-lg shadow-[#58CC02]/30'
                : 'bg-[#1A2C35] text-gray-400 hover:text-white hover:bg-[#243942]'
            }`}
          >
            Stone Path
          </button>
          <button
            onClick={() => setActiveTab('buttons')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'buttons'
                ? 'bg-[#1CB0F6] text-white shadow-lg shadow-[#1CB0F6]/30'
                : 'bg-[#1A2C35] text-gray-400 hover:text-white hover:bg-[#243942]'
            }`}
          >
            Button Designs
          </button>
        </div>

        {/* Content */}
        {activeTab === 'path' ? <StonePathView /> : <ButtonDesignsView />}
      </div>

      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
