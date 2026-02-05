'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getRandomQuote, getTierLabel } from '@/data/celebration-quotes';
import { playCelebrationSound } from '@/lib/sounds';
import { RookCelebrationAnimation, RookCelebrationAnimationRef, CelebrationAnimationStyle } from './RookCelebrationAnimation';

const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
};

const celebrationStyles = `
  @keyframes fadeInUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.4s ease-out forwards;
  }
`;

interface LessonCompleteScreenProps {
  correctCount: number;
  wrongCount: number;
  lessonName: string;
  lessonId: string;
  isGuest: boolean;
  getLevelKeyFromLessonId: (id: string) => string;
}

export function LessonCompleteScreen({
  correctCount,
  lessonName,
  lessonId,
  isGuest,
  getLevelKeyFromLessonId,
}: LessonCompleteScreenProps) {
  const isPerfect = correctCount === 6;
  const accuracy = Math.round((correctCount / 6) * 100);
  const rookRef = useRef<RookCelebrationAnimationRef>(null);

  // Pick a random celebration animation style - always celebrate!
  const celebrationStyle: CelebrationAnimationStyle = useMemo(() => {
    const styles: CelebrationAnimationStyle[] = ['sparkleBurst', 'wave', 'radiate', 'ripple', 'cascade', 'bloom'];
    return styles[Math.floor(Math.random() * styles.length)];
  }, []);

  // Get a random quote (memoized so it doesn't change on re-render)
  const quote = useMemo(() => getRandomQuote(correctCount), [correctCount]);
  const tierLabel = getTierLabel(correctCount);

  // Confetti burst and sound on mount
  useEffect(() => {
    // Confetti
    confetti({
      particleCount: isPerfect ? 100 : correctCount >= 5 ? 60 : 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: isPerfect
        ? ['#FFC800', '#FFD700', '#FFAA00', '#FFFFFF']
        : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'],
      gravity: 1.2,
      ticks: 200,
    });
    confetti({
      particleCount: isPerfect ? 100 : correctCount >= 5 ? 60 : 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: isPerfect
        ? ['#FFC800', '#FFD700', '#FFAA00', '#FFFFFF']
        : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'],
      gravity: 1.2,
      ticks: 200,
    });

    // Sound
    playCelebrationSound(correctCount);
  }, [isPerfect, correctCount]);

  return (
    <div className="h-full bg-[#131F24] text-white flex flex-col items-center justify-center overflow-hidden px-5">
      <style>{celebrationStyles}</style>
      <div className="max-w-sm w-full">
        {/* Animated Rook */}
        <div className="flex items-center justify-center" style={{ height: '220px' }}>
          <RookCelebrationAnimation
            ref={rookRef}
            style={celebrationStyle}
            scale={1.8}
            autoPlay={true}
          />
        </div>

        {/* Score display */}
        <div className="text-center mb-3">
          <div
            className="text-5xl font-black mb-1 animate-fadeInUp"
            style={{
              color: isPerfect ? '#FFC800' : COLORS.green,
              animationFillMode: 'backwards',
            }}
          >
            {correctCount}/6
          </div>
          <div
            className="text-sm text-gray-400 uppercase tracking-wider animate-fadeInUp"
            style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
          >
            {tierLabel}
          </div>
        </div>

        {/* Funny quote */}
        <div
          className="text-center mb-5 animate-fadeInUp"
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          <p className="text-xl text-white font-medium italic">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        {/* Stats cards */}
        <div
          className="grid grid-cols-2 gap-3 mb-5 animate-fadeInUp"
          style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
        >
          <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: COLORS.green }}>
              {correctCount}
            </div>
            <div className="text-sm text-gray-400">First try</div>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: accuracy === 100 ? '#FFC800' : COLORS.blue }}>
              {accuracy}%
            </div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
        </div>

        {/* Lesson name */}
        <div
          className="text-center text-gray-500 text-sm mb-4 animate-fadeInUp"
          style={{ animationDelay: '0.35s', animationFillMode: 'backwards' }}
        >
          {lessonName}
        </div>

        {/* Continue button */}
        <button
          onClick={() => {
            window.location.href = isGuest
              ? `/learn?guest=true&level=${getLevelKeyFromLessonId(lessonId)}`
              : `/learn?level=${getLevelKeyFromLessonId(lessonId)}`;
          }}
          className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_#3d8c01] animate-fadeInUp"
          style={{
            backgroundColor: COLORS.green,
            animationDelay: '0.4s',
            animationFillMode: 'backwards',
          }}
        >
          Continue
        </button>

        {/* Guest signup prompt */}
        {isGuest && (
          <div
            className="mt-4 bg-[#1A2C35] rounded-xl p-4 animate-fadeInUp"
            style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
          >
            <p className="text-gray-400 text-sm mb-3 text-center">Create a free account to save progress</p>
            <div className="flex gap-3">
              <Link
                href="/auth/signup?from=lesson"
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white text-center bg-[#2A3C45] hover:bg-[#3A4C55] transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white text-center bg-[#2A3C45] hover:bg-[#3A4C55] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
