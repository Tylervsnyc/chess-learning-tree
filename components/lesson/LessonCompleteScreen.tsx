'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const COLORS = {
  green: '#58CC02',
  blue: '#1CB0F6',
};

const celebrationStyles = `
  @keyframes scaleIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes fadeInUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes checkDraw {
    0% { stroke-dashoffset: 24; }
    100% { stroke-dashoffset: 0; }
  }
  .animate-scaleIn {
    animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.4s ease-out forwards;
  }
  .animate-checkDraw {
    stroke-dasharray: 24;
    stroke-dashoffset: 24;
    animation: checkDraw 0.4s ease-out 0.3s forwards;
  }
`;

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path className="animate-checkDraw" d="M5 12l5 5L19 7" />
  </svg>
);

const TrophyIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-1.1 0-2-.9-2-2v-1h4v1c0 1.1-.9 2-2 2zm6-11h-1V5c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H6c-1.1 0-2 .9-2 2v2c0 1.54 1.12 2.82 2.58 3.07.73 1.03 1.86 1.73 3.16 1.9.14.27.26.55.26.85V15H8v2h8v-2h-2v-.18c0-.3.12-.58.26-.85 1.3-.17 2.43-.87 3.16-1.9C18.88 11.82 20 10.54 20 9V7c0-1.1-.9-2-2-2zM6 9V8h1v2.07c-.58-.2-1-.76-1-1.07zm12 0c0 .31-.42.87-1 1.07V8h1v1z"/>
  </svg>
);

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
  const message = isPerfect ? 'Perfect!' : correctCount >= 5 ? 'Great work!' : 'Lesson complete';

  // Single satisfying confetti burst on mount
  useEffect(() => {
    confetti({
      particleCount: isPerfect ? 80 : 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'],
      gravity: 1.2,
      ticks: 200,
    });
    confetti({
      particleCount: isPerfect ? 80 : 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF'],
      gravity: 1.2,
      ticks: 200,
    });
  }, [isPerfect]);

  return (
    <div className="min-h-screen bg-[#131F24] text-white flex flex-col">
      <style>{celebrationStyles}</style>
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="max-w-sm w-full">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="animate-scaleIn w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: isPerfect ? '#FFC800' : COLORS.green }}
            >
              {isPerfect ? (
                <TrophyIcon className="w-12 h-12 text-white" />
              ) : (
                <CheckIcon className="w-12 h-12 text-white" />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold text-white mb-1 animate-fadeInUp"
              style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
            >
              {message}
            </h1>
            <p
              className="text-gray-400 animate-fadeInUp"
              style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
            >
              {lessonName}
            </p>
          </div>

          {/* Stats cards */}
          <div
            className="grid grid-cols-2 gap-3 mb-8 animate-fadeInUp"
            style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
          >
            <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: COLORS.green }}>
                {correctCount}/6
              </div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: accuracy === 100 ? '#FFC800' : COLORS.blue }}>
                {accuracy}%
              </div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={() => window.location.href = isGuest
              ? `/learn?guest=true&level=${getLevelKeyFromLessonId(lessonId)}`
              : `/learn?level=${getLevelKeyFromLessonId(lessonId)}`
            }
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
    </div>
  );
}
