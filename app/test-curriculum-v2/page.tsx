'use client';

import React, { useState } from 'react';
import { level1V2, getCurriculumStats, Block, Section, LessonCriteria } from '@/data/staging/level1-v2-curriculum';

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

const REVIEW_COLOR = '#E91E63'; // Hot Pink

// Helper to convert hex to HSL
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

interface LessonCardProps {
  lesson: LessonCriteria;
  sectionColor: string;
  lessonIndex: number;
  totalLessons: number;
}

function LessonCard({ lesson, sectionColor, lessonIndex, totalLessons }: LessonCardProps) {
  const lessonColor = getLessonColor(sectionColor, lessonIndex, totalLessons);
  const lessonNumber = lesson.id.split('.').pop();

  return (
    <div className="w-full text-left p-3 rounded-xl bg-[#1A2C35] border-2 border-transparent">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: lessonColor, color: '#fff' }}
        >
          {lessonNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate text-white text-sm">
            {lesson.name}
          </div>
          <div className="text-xs truncate text-gray-400">
            {lesson.description}
          </div>
        </div>
        <div className="text-gray-500">→</div>
      </div>
    </div>
  );
}

interface SectionViewProps {
  section: Section;
  sectionIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function SectionView({ section, sectionIndex, isExpanded, onToggle }: SectionViewProps) {
  const color = section.isReview ? REVIEW_COLOR : MODULE_COLORS[sectionIndex % MODULE_COLORS.length];
  const sectionNumber = sectionIndex + 1;

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
            backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : color,
            color: 'white',
          }}
        >
          {section.isReview ? '★' : sectionNumber}
        </div>
        <div className="flex-1 text-left">
          <div className="font-bold text-white">{section.name}</div>
          <div className={`text-xs ${isExpanded ? 'text-white/70' : 'text-gray-400'}`}>
            {section.lessons.length} lessons • {section.description}
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

interface BlockViewProps {
  block: Block;
  blockIndex: number;
  globalSectionOffset: number;
}

function BlockView({ block, blockIndex, globalSectionOffset }: BlockViewProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="mb-8">
      {/* Block Header */}
      <div className="mb-4 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">
            {blockIndex + 1}
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{block.name}</h2>
            <p className="text-xs text-gray-400">{block.description}</p>
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
      </div>

      {/* Sections */}
      <div>
        {block.sections.map((section, sectionIndex) => (
          <SectionView
            key={section.id}
            section={section}
            sectionIndex={globalSectionOffset + sectionIndex}
            isExpanded={expandedSection === section.id}
            onToggle={() => setExpandedSection(prev => prev === section.id ? null : section.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function TestCurriculumV2Page() {
  const stats = getCurriculumStats();

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-black">Level 1 V2: Skill-Stacking</h1>
          <p className="text-sm text-gray-400">New curriculum methodology preview</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#0D1A1F] border-b border-white/10 px-4 py-3">
        <div className="max-w-lg mx-auto flex justify-between text-center">
          <div>
            <div className="text-xl font-bold text-[#58CC02]">{stats.blocks}</div>
            <div className="text-xs text-gray-400">Blocks</div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#1CB0F6]">{stats.totalSections}</div>
            <div className="text-xs text-gray-400">Sections</div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#FF9600]">{stats.totalLessons}</div>
            <div className="text-xs text-gray-400">Lessons</div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#FF4B4B]">{stats.totalPuzzles}</div>
            <div className="text-xs text-gray-400">Puzzles</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: MODULE_COLORS[0] }} />
            <span className="text-gray-400">Content Section</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: REVIEW_COLOR }} />
            <span className="text-gray-400">Review Section</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">★ = Skill Stack</span>
          </div>
        </div>
      </div>

      {/* Curriculum Tree */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Gradient accent */}
        <div className="h-1 -mx-4 mb-6 bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]" />

        {/* Level header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-white">{level1V2.name}</h1>
            <span className="text-sm text-gray-400">{level1V2.ratingRange} ELO</span>
          </div>
        </div>

        {/* Blocks */}
        {level1V2.blocks.map((block, blockIndex) => {
          // Calculate global section offset for coloring
          const globalSectionOffset = level1V2.blocks
            .slice(0, blockIndex)
            .reduce((sum, b) => sum + b.sections.filter(s => !s.isReview).length, 0);

          return (
            <BlockView
              key={block.id}
              block={block}
              blockIndex={blockIndex}
              globalSectionOffset={globalSectionOffset}
            />
          );
        })}

        {/* Summary */}
        <div className="mt-8 p-4 bg-[#1A2C35] rounded-2xl">
          <h3 className="font-bold text-white mb-3">Curriculum Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Blocks:</span>
              <span className="text-white font-bold">{stats.blocks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Content Sections:</span>
              <span className="text-white font-bold">{stats.contentSections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Review Sections:</span>
              <span className="text-[#E91E63] font-bold">{stats.reviewSections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Lessons:</span>
              <span className="text-white font-bold">{stats.totalLessons}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Puzzles (6/lesson):</span>
              <span className="text-white font-bold">{stats.totalPuzzles}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Lessons/Section:</span>
              <span className="text-white font-bold">{stats.averageLessonsPerSection}</span>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="mt-4 p-4 bg-[#0D1A1F] rounded-2xl border border-white/10">
          <h3 className="font-bold text-white mb-3">Skill-Stacking Methodology</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• <span className="text-white">Block 1:</span> Mate in 1 → Mate in 2 (set up the mate)</li>
            <li>• <span className="text-white">Block 2:</span> Forks → Fork to Mate (fork leads to checkmate)</li>
            <li>• <span className="text-white">Block 3:</span> Pins → Pin to Fork/Mate (pin enables tactic)</li>
            <li>• <span className="text-white">Block 4:</span> RTD → RTD to Fork/Mate (remove then strike)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
