'use client';

import { useState, useEffect } from 'react';
import { LessonCompleteScreen } from '@/components/lesson/LessonCompleteScreen';

export default function TestCelebrationPage() {
  const [correctCount, setCorrectCount] = useState(6);
  const [key, setKey] = useState(0);
  const [showScreen, setShowScreen] = useState(true);

  const [mounted, setMounted] = useState(false);

  // Wait for client mount to avoid hydration mismatch from Math.random() in quotes
  useEffect(() => { setMounted(true); }, []);

  const reload = (count: number) => {
    setShowScreen(false);
    setCorrectCount(count);
    setTimeout(() => {
      setKey(k => k + 1);
      setShowScreen(true);
    }, 50);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating controls */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1A2C35]/95 backdrop-blur border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
        {[0, 2, 4, 5, 6].map(n => (
          <button
            key={n}
            onClick={() => reload(n)}
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              correctCount === n
                ? 'bg-[#58CC02] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {n}/6
          </button>
        ))}
        <div className="w-px h-5 bg-gray-600 mx-1" />
        <button
          onClick={() => reload(correctCount)}
          className="px-3 py-1 rounded text-sm font-bold text-gray-400 hover:text-white"
        >
          Replay
        </button>
      </div>

      {/* Actual LessonCompleteScreen - rendered exactly like the real lesson page */}
      {showScreen && (
        <LessonCompleteScreen
          key={key}
          correctCount={correctCount}
          wrongCount={6 - correctCount}
          lessonName="Test Lesson: Fork Fundamentals"
          lessonId="1.1.1"
          isGuest={false}
          getLevelKeyFromLessonId={() => '1'}
        />
      )}
    </>
  );
}
