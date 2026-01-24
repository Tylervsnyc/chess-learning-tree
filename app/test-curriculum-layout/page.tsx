'use client';

import { useState } from 'react';
import Link from 'next/link';

// Module colors from the actual app - these stay the same for regular sections
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

// Review section color options to test
const REVIEW_COLORS = {
  A: '#9B59B6', // Purple
  B: '#F39C12', // Amber
  C: '#E91E63', // Hot Pink
  D: '#00CED1', // Teal
  E: '#FF6B6B', // Coral
};

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// Helper to convert hex to HSL for lesson shading
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function getLessonColor(baseColor: string, lessonIndex: number, totalLessons: number): string {
  const hsl = hexToHSL(baseColor);
  const lightnessRange = 45;
  const lightnessOffset = totalLessons > 1
    ? 20 - (lessonIndex / (totalLessons - 1)) * lightnessRange
    : 0;
  const newLightness = Math.max(15, Math.min(75, hsl.l + lightnessOffset));
  return `hsl(${hsl.h}, ${hsl.s}%, ${newLightness}%)`;
}

// Sample curriculum with the proposed structure
const proposedCurriculum = {
  name: 'Level 1: Foundations',
  ratingRange: '400-800',
  sections: [
    // Block 1
    {
      id: 'sec-1',
      name: 'Mate in 1: Major Pieces',
      isReview: false,
      lessons: [
        { id: '1.1.1', name: 'Queen Mate: Easy', description: 'Checkmate with the queen - easiest' },
        { id: '1.1.2', name: 'Queen Mate: Medium', description: 'Checkmate with the queen - medium' },
        { id: '1.1.3', name: 'Rook Mate: Easy', description: 'Checkmate with the rook - easiest' },
        { id: '1.1.4', name: 'Rook Mate: Medium', description: 'Checkmate with the rook - medium' },
      ],
    },
    {
      id: 'sec-2',
      name: 'Mate in 1: Minor Pieces',
      isReview: false,
      lessons: [
        { id: '1.2.1', name: 'Bishop Mate', description: 'Checkmate with the bishop' },
        { id: '1.2.2', name: 'Knight Mate', description: 'Checkmate with the knight' },
        { id: '1.2.3', name: 'Pawn Mate', description: 'Checkmate with a pawn' },
      ],
    },
    {
      id: 'sec-3',
      name: 'Back Rank Mate',
      isReview: false,
      lessons: [
        { id: '1.3.1', name: 'Back Rank in 1: Easy', description: 'Back rank checkmate - easiest' },
        { id: '1.3.2', name: 'Back Rank in 1: Hard', description: 'Back rank checkmate - harder' },
        { id: '1.3.3', name: 'Back Rank in 2: Easy', description: 'Two-move back rank mate' },
        { id: '1.3.4', name: 'Back Rank in 2: Hard', description: 'Two-move back rank - harder' },
      ],
    },
    {
      id: 'sec-4',
      name: 'Review',
      isReview: true,
      lessons: [
        { id: '1.4.1', name: 'Mixed Mate in 1', description: 'Any piece, any pattern' },
        { id: '1.4.2', name: 'Mixed Back Rank', description: 'Back rank variations' },
        { id: '1.4.3', name: 'Challenge Round 1', description: 'Test your skills' },
        { id: '1.4.4', name: 'Challenge Round 2', description: 'Final challenge' },
      ],
    },
    // Block 2
    {
      id: 'sec-5',
      name: 'Knight Forks',
      isReview: false,
      lessons: [
        { id: '1.5.1', name: 'Knight Forks: Easy', description: 'Attack two pieces - easy' },
        { id: '1.5.2', name: 'Knight Forks: Medium', description: 'Attack two pieces - medium' },
        { id: '1.5.3', name: 'Knight Forks: Hard', description: 'Attack two pieces - hard' },
        { id: '1.5.4', name: 'Royal Knight Forks', description: 'Fork the king and queen' },
      ],
    },
    {
      id: 'sec-6',
      name: 'Other Forks',
      isReview: false,
      lessons: [
        { id: '1.6.1', name: 'Pawn Forks', description: 'Attack two pieces with a pawn' },
        { id: '1.6.2', name: 'Bishop Forks', description: 'Attack two pieces with a bishop' },
        { id: '1.6.3', name: 'Rook Forks', description: 'Attack two pieces with a rook' },
        { id: '1.6.4', name: 'Queen Forks', description: 'Attack two pieces with the queen' },
      ],
    },
    {
      id: 'sec-7',
      name: 'Skewers',
      isReview: false,
      lessons: [
        { id: '1.7.1', name: 'Skewers: Easy', description: 'Basic skewer patterns' },
        { id: '1.7.2', name: 'Skewers: Medium', description: 'Intermediate skewers' },
        { id: '1.7.3', name: 'Skewers: Hard', description: 'Advanced skewers' },
      ],
    },
    {
      id: 'sec-8',
      name: 'Review',
      isReview: true,
      lessons: [
        { id: '1.8.1', name: 'Mixed Forks', description: 'Any piece, any fork' },
        { id: '1.8.2', name: 'Mixed Skewers', description: 'Skewer practice' },
        { id: '1.8.3', name: 'Fork or Skewer?', description: 'Identify the tactic' },
        { id: '1.8.4', name: 'Challenge Round', description: 'Final challenge' },
      ],
    },
  ],
};

// Funny block names
const BLOCK_NAMES = [
  "The 'Oops, You're Dead' Collection",
  "The Fork Awakens",
];

type LabelStyle = 'none' | 'divider' | 'labeled';
type ReviewColorOption = 'A' | 'B' | 'C' | 'D' | 'E';
type AnimationOption = 'none' | 'pulse' | 'glow' | 'bounce';

export default function TestCurriculumLayout() {
  const [labelStyle, setLabelStyle] = useState<LabelStyle>('labeled');
  const [reviewColor, setReviewColor] = useState<ReviewColorOption>('C');
  const [reviewAnimation, setReviewAnimation] = useState<AnimationOption>('none');
  const [expandedSection, setExpandedSection] = useState<string | null>('sec-1');

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Animation keyframes */}
      <style>{`
        @keyframes review-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes review-glow {
          0%, 100% { box-shadow: 0 0 8px var(--glow-color); }
          50% { box-shadow: 0 0 20px var(--glow-color), 0 0 30px var(--glow-color); }
        }
        @keyframes review-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>

      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Link href="/" className="text-white/60 hover:text-white">
            <ChevronLeft />
          </Link>
          <h1 className="text-lg font-semibold">Curriculum Layout Test</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-[57px] z-40 bg-[#0D1A1F] border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 space-y-3">
          {/* Block label style */}
          <div>
            <div className="text-xs text-white/50 mb-2">BLOCK LABELS</div>
            <div className="flex gap-2">
              {[
                { id: 'none', label: 'None' },
                { id: 'divider', label: 'Divider Only' },
                { id: 'labeled', label: 'With Names' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLabelStyle(opt.id as LabelStyle)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    labelStyle === opt.id
                      ? 'bg-[#58CC02] text-black'
                      : 'bg-[#1A2C35] text-white/70 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Review color */}
          <div>
            <div className="text-xs text-white/50 mb-2">REVIEW SECTION COLOR</div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'A', label: 'Purple', color: REVIEW_COLORS.A },
                { id: 'B', label: 'Amber', color: REVIEW_COLORS.B },
                { id: 'C', label: 'Hot Pink', color: REVIEW_COLORS.C },
                { id: 'D', label: 'Teal', color: REVIEW_COLORS.D },
                { id: 'E', label: 'Coral', color: REVIEW_COLORS.E },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setReviewColor(opt.id as ReviewColorOption)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    reviewColor === opt.id
                      ? 'ring-2 ring-white'
                      : ''
                  }`}
                  style={{ backgroundColor: opt.color }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Review animation */}
          <div>
            <div className="text-xs text-white/50 mb-2">REVIEW ANIMATION</div>
            <div className="flex gap-2">
              {[
                { id: 'none', label: 'None' },
                { id: 'pulse', label: 'Pulse' },
                { id: 'glow', label: 'Glow' },
                { id: 'bounce', label: 'Bounce' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setReviewAnimation(opt.id as AnimationOption)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    reviewAnimation === opt.id
                      ? 'bg-[#E91E63] text-white'
                      : 'bg-[#1A2C35] text-white/70 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Display */}
      <div className="max-w-lg mx-auto px-4 pb-20">
        {/* Gradient accent */}
        <div className="h-1 -mx-4 my-4 bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

        {/* Level header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-white">{proposedCurriculum.name}</h1>
            <span className="text-sm text-gray-400">{proposedCurriculum.ratingRange}</span>
          </div>
        </div>

        {/* Sections grouped by blocks */}
        <CurriculumView
          labelStyle={labelStyle}
          reviewColor={REVIEW_COLORS[reviewColor]}
          reviewAnimation={reviewAnimation}
          expandedSection={expandedSection}
          onToggle={(id) => setExpandedSection(prev => prev === id ? null : id)}
        />
      </div>
    </div>
  );
}

function CurriculumView({
  labelStyle,
  reviewColor,
  reviewAnimation,
  expandedSection,
  onToggle,
}: {
  labelStyle: LabelStyle;
  reviewColor: string;
  reviewAnimation: AnimationOption;
  expandedSection: string | null;
  onToggle: (id: string) => void;
}) {
  const sections = proposedCurriculum.sections;

  // Group into blocks of 4 (3 content + 1 review)
  const blocks = [
    { name: BLOCK_NAMES[0], sections: sections.slice(0, 4) },
    { name: BLOCK_NAMES[1], sections: sections.slice(4, 8) },
  ];

  return (
    <div>
      {blocks.map((block, blockIndex) => (
        <div key={blockIndex}>
          {/* Block label */}
          {labelStyle === 'labeled' && (
            <div className="flex items-center gap-3 mb-4 mt-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider px-2">
                {block.name}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          )}

          {labelStyle === 'divider' && blockIndex > 0 && (
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          )}

          {/* Sections in this block */}
          {block.sections.map((section, sectionIndex) => {
            // Regular sections use rotating MODULE_COLORS, review sections use selected review color
            const colorIndex = blockIndex * 3 + sectionIndex; // Skip review in color rotation
            const sectionColor = section.isReview
              ? reviewColor
              : MODULE_COLORS[colorIndex % MODULE_COLORS.length];

            return (
              <SectionCard
                key={section.id}
                section={section}
                color={sectionColor}
                reviewAnimation={section.isReview ? reviewAnimation : 'none'}
                isExpanded={expandedSection === section.id}
                onToggle={() => onToggle(section.id)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function SectionCard({
  section,
  color,
  reviewAnimation,
  isExpanded,
  onToggle,
}: {
  section: typeof proposedCurriculum.sections[0];
  color: string;
  reviewAnimation: AnimationOption;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Animation style for the icon
  const getAnimationStyle = (): React.CSSProperties => {
    if (isExpanded || reviewAnimation === 'none') return {};

    const baseStyle: React.CSSProperties = {
      '--glow-color': color,
    } as React.CSSProperties;

    switch (reviewAnimation) {
      case 'pulse':
        return { ...baseStyle, animation: 'review-pulse 2s ease-in-out infinite' };
      case 'glow':
        return { ...baseStyle, animation: 'review-glow 2s ease-in-out infinite' };
      case 'bounce':
        return { ...baseStyle, animation: 'review-bounce 1s ease-in-out infinite' };
      default:
        return {};
    }
  };

  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all"
        style={{
          backgroundColor: isExpanded ? color : '#1A2C35',
        }}
      >
        {/* Section icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
          style={{
            backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : color,
            color: 'white',
            ...getAnimationStyle(),
          }}
        >
          {section.isReview ? '★' : section.id.replace('sec-', '')}
        </div>

        {/* Section info */}
        <div className="flex-1 text-left">
          <div className="font-bold text-white">{section.name}</div>
          <div className={`text-xs ${isExpanded ? 'text-white/70' : 'text-gray-400'}`}>
            {section.lessons.length} lessons
          </div>
        </div>

        {/* Arrow */}
        <div
          className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: isExpanded ? 'rgba(255,255,255,0.7)' : color }}
        >
          ▾
        </div>
      </button>

      {/* Expanded lessons */}
      {isExpanded && (
        <div className="mt-2 space-y-2 pl-2">
          {section.lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              sectionColor={color}
              lessonIndex={index}
              totalLessons={section.lessons.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LessonCard({
  lesson,
  sectionColor,
  lessonIndex,
  totalLessons,
}: {
  lesson: { id: string; name: string; description: string };
  sectionColor: string;
  lessonIndex: number;
  totalLessons: number;
}) {
  const lessonColor = getLessonColor(sectionColor, lessonIndex, totalLessons);

  return (
    <button className="w-full text-left p-3 rounded-xl transition-all bg-[#1A2C35] hover:bg-[#243844] cursor-pointer border-2 border-transparent">
      <div className="flex items-center gap-3">
        {/* Lesson number square */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: lessonColor, color: '#fff' }}
        >
          {lesson.id.split('.').slice(-1)[0]}
        </div>

        {/* Lesson info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate text-white">{lesson.name}</div>
          <div className="text-xs truncate text-gray-400">{lesson.description}</div>
        </div>

        {/* Arrow */}
        <div className="text-gray-500">→</div>
      </div>
    </button>
  );
}
