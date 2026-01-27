'use client';

import { useState } from 'react';
import Link from 'next/link';
import { level1V2 } from '@/data/staging/level1-v2-curriculum';
import { level2V2 } from '@/data/staging/level2-v2-curriculum';
import { level3V2 } from '@/data/staging/level3-v2-curriculum';

const PUZZLES_PER_LESSON = 6;

const LEVELS = [
  { data: level1V2, color: '#58CC02', name: 'Level 1' },
  { data: level2V2, color: '#1CB0F6', name: 'Level 2' },
  { data: level3V2, color: '#CE82FF', name: 'Level 3' },
];

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function StagingAdminPage() {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  const currentLevel = LEVELS[selectedLevel];

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  };

  const resetProgress = () => {
    localStorage.removeItem('staging-user-level');
    localStorage.removeItem('staging-user-elo');
    localStorage.removeItem('staging-completed-lessons');
    localStorage.removeItem('staging-diagnostic-complete');
    alert('Progress reset! Refresh the page.');
  };

  // Count stats
  const stats = LEVELS.map(level => {
    let lessonCount = 0;
    let sectionCount = 0;
    let puzzleCount = 0;

    level.data.blocks.forEach(block => {
      block.sections.forEach(section => {
        sectionCount++;
        section.lessons.forEach(() => {
          lessonCount++;
          puzzleCount += PUZZLES_PER_LESSON;
        });
      });
    });

    return { lessonCount, sectionCount, puzzleCount };
  });

  const totalStats = stats.reduce(
    (acc, s) => ({
      lessonCount: acc.lessonCount + s.lessonCount,
      sectionCount: acc.sectionCount + s.sectionCount,
      puzzleCount: acc.puzzleCount + s.puzzleCount,
    }),
    { lessonCount: 0, sectionCount: 0, puzzleCount: 0 }
  );

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/staging" className="text-gray-400 hover:text-white">
            <ChevronLeft />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">V2 Curriculum Admin</h1>
            <p className="text-xs text-gray-400">View all lessons and blocks</p>
          </div>
          <button
            onClick={resetProgress}
            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30"
          >
            Reset Progress
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-[#1A2C35] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-white">{LEVELS.length}</div>
            <div className="text-xs text-gray-400">Levels</div>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#58CC02]">{totalStats.sectionCount}</div>
            <div className="text-xs text-gray-400">Sections</div>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#1CB0F6]">{totalStats.lessonCount}</div>
            <div className="text-xs text-gray-400">Lessons</div>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#CE82FF]">{totalStats.puzzleCount}</div>
            <div className="text-xs text-gray-400">Puzzles</div>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex gap-2 mb-6">
          {LEVELS.map((level, i) => (
            <button
              key={i}
              onClick={() => setSelectedLevel(i)}
              className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
                selectedLevel === i
                  ? 'text-white'
                  : 'bg-[#1A2C35] text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: selectedLevel === i ? level.color : undefined,
              }}
            >
              {level.name}
            </button>
          ))}
        </div>

        {/* Level Info */}
        <div className="bg-[#1A2C35] rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black" style={{ color: currentLevel.color }}>
              {currentLevel.data.name}
            </h2>
            <span className="text-sm text-gray-400">{currentLevel.data.ratingRange} ELO</span>
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-gray-400">
              {stats[selectedLevel].sectionCount} sections
            </span>
            <span className="text-gray-400">
              {stats[selectedLevel].lessonCount} lessons
            </span>
            <span className="text-gray-400">
              {stats[selectedLevel].puzzleCount} puzzles
            </span>
          </div>
        </div>

        {/* Blocks */}
        {currentLevel.data.blocks.map((block, blockIndex) => (
          <div key={block.id} className="mb-4">
            <button
              onClick={() => toggleBlock(block.id)}
              className="w-full bg-[#1A2C35] rounded-xl p-4 text-left hover:bg-[#243a47] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: currentLevel.color }}
                    >
                      {blockIndex + 1}
                    </span>
                    <h3 className="font-bold">{block.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-8">{block.description}</p>
                </div>
                <span className={`text-xl transition-transform ${expandedBlocks[block.id] ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </div>
            </button>

            {expandedBlocks[block.id] && (
              <div className="mt-2 space-y-2 pl-4">
                {block.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="bg-[#0D1A1F] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">§{sectionIndex + 1}</span>
                        <h4 className="font-bold text-sm">{section.name}</h4>
                        {section.isReview && (
                          <span className="px-2 py-0.5 bg-[#FFC800]/20 text-[#FFC800] rounded text-xs">
                            Review
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{section.lessons.length} lessons</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{section.description}</p>

                    {/* Lessons */}
                    <div className="space-y-1">
                      {section.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/staging/lesson/${lesson.id}`}
                          className="flex items-center justify-between p-2 bg-[#1A2C35] rounded-lg hover:bg-[#243a47] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-mono w-10">{lesson.id}</span>
                            <span className="text-sm">{lesson.name}</span>
                            {lesson.pieceFilter && (
                              <span className="text-xs text-gray-500">({lesson.pieceFilter})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{lesson.requiredTags[0]}</span>
                            <span>•</span>
                            <span>{lesson.ratingMin}-{lesson.ratingMax}</span>
                            <span>•</span>
                            <span>{PUZZLES_PER_LESSON}p</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-sm font-bold text-gray-400 mb-3">QUICK LINKS</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/staging"
              className="px-4 py-2 bg-[#1A2C35] rounded-lg text-sm hover:bg-[#243a47]"
            >
              Landing Page
            </Link>
            <Link
              href="/staging/onboarding"
              className="px-4 py-2 bg-[#1A2C35] rounded-lg text-sm hover:bg-[#243a47]"
            >
              Onboarding
            </Link>
            <Link
              href="/staging/learn?level=1"
              className="px-4 py-2 bg-[#1A2C35] rounded-lg text-sm hover:bg-[#243a47]"
            >
              Level 1
            </Link>
            <Link
              href="/staging/learn?level=2"
              className="px-4 py-2 bg-[#1A2C35] rounded-lg text-sm hover:bg-[#243a47]"
            >
              Level 2
            </Link>
            <Link
              href="/staging/learn?level=3"
              className="px-4 py-2 bg-[#1A2C35] rounded-lg text-sm hover:bg-[#243a47]"
            >
              Level 3
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
