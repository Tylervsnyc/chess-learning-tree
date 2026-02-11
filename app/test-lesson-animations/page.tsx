'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  RookProgressAnimation,
  RookProgressAnimationRef,
  ANIMATION_STYLES,
  AnimationStyle,
} from '@/components/lesson/RookProgressAnimation';
import {
  RookWrongAnimation,
  RookWrongAnimationRef,
  WRONG_ANIMATION_STYLES,
  WrongAnimationStyle,
} from '@/components/lesson/RookWrongAnimation';

const correctStyleKeys = Object.keys(ANIMATION_STYLES) as AnimationStyle[];
const wrongStyleKeys = Object.keys(WRONG_ANIMATION_STYLES) as WrongAnimationStyle[];

const QUIPS = [
  "Nice fork! That knight never saw it coming.",
  "Textbook pin. Opponent's piece is stuck.",
  "Clean tactic! You see the board clearly.",
  "That's how it's done! Keep it up.",
  "Boom! Material advantage secured.",
  "Perfect! Lesson complete!",
];

const WRONG_MESSAGES = [
  "Not quite. Look for forcing moves first.",
  "Oops! That piece was defended.",
  "Close, but there's a better move here.",
  "That allows a counter-attack. Try again!",
  "Almost! Check all captures first.",
];

export default function TestLessonAnimationsPage() {
  const correctRef = useRef<RookProgressAnimationRef>(null);
  const wrongRef = useRef<RookWrongAnimationRef>(null);

  // Lesson state
  const [lessonStarted, setLessonStarted] = useState(false);
  const [correctStage, setCorrectStage] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showPopup, setShowPopup] = useState<'correct' | 'wrong' | null>(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  // Animation styles for this "lesson" - cycle through in order
  const [lessonNumber, setLessonNumber] = useState(0);
  const correctStyle = correctStyleKeys[lessonNumber % correctStyleKeys.length];
  const wrongStyle = wrongStyleKeys[wrongCount % wrongStyleKeys.length];

  // Trigger correct animation when popup shows
  useEffect(() => {
    if (showPopup === 'correct') {
      setTimeout(() => {
        correctRef.current?.triggerNextStage();
      }, 100);
    }
  }, [showPopup]);

  // Trigger wrong animation when popup shows
  useEffect(() => {
    if (showPopup === 'wrong') {
      setTimeout(() => {
        wrongRef.current?.triggerAnimation();
      }, 300);
    }
  }, [showPopup, wrongCount]);

  const handleCorrect = () => {
    if (correctStage >= 6) return;
    setCorrectStage(prev => prev + 1);
    setShowPopup('correct');

    if (correctStage + 1 >= 6) {
      setLessonComplete(true);
    }
  };

  const handleWrong = () => {
    setWrongCount(prev => prev + 1);
    wrongRef.current?.reset(); // Reset so it shows full rook before animating
    setShowPopup('wrong');
  };

  const handleContinue = () => {
    setShowPopup(null);
  };

  const handleTryAgain = () => {
    setShowPopup(null);
  };

  const handleStartLesson = () => {
    setLessonStarted(true);
  };

  const handleNewLesson = () => {
    correctRef.current?.reset();
    wrongRef.current?.reset();
    setCorrectStage(0);
    setWrongCount(0);
    setShowPopup(null);
    setLessonComplete(false);
    setLessonNumber(prev => prev + 1);
  };

  const handleRestart = () => {
    correctRef.current?.reset();
    wrongRef.current?.reset();
    setCorrectStage(0);
    setWrongCount(0);
    setShowPopup(null);
    setLessonComplete(false);
  };

  // Pre-lesson screen
  if (!lessonStarted) {
    return (
      <div className="h-full bg-[#131F24] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Test Lesson Animations</h1>
          <p className="text-gray-400 mb-6">
            This simulates how the rook animations will work in actual lessons.
          </p>
          <div className="bg-[#1A2C35] rounded-xl p-4 mb-6 text-left text-sm">
            <p className="text-gray-300 mb-2"><strong>How it works:</strong></p>
            <ul className="text-gray-400 space-y-1">
              <li>• Each lesson uses ONE correct animation style (cycles through 10)</li>
              <li>• Each wrong answer uses a DIFFERENT wrong animation (cycles through 5)</li>
              <li>• Click "Correct" or "Wrong" to simulate puzzle outcomes</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Lesson #{lessonNumber + 1} will use: <span className="text-[#58CC02]">{ANIMATION_STYLES[correctStyle].emoji} {ANIMATION_STYLES[correctStyle].name}</span>
          </p>
          <button
            onClick={handleStartLesson}
            className="w-full py-4 bg-[#58CC02] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all"
          >
            Start Lesson
          </button>
          <a href="/learn" className="block mt-4 text-gray-500 hover:text-white text-sm">
            ← Back to Learn
          </a>
        </div>
      </div>
    );
  }

  // Lesson complete screen
  if (lessonComplete && showPopup === null) {
    return (
      <div className="h-full bg-[#131F24] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-sm text-center">
          <div className="text-6xl font-black mb-2 text-[#58CC02]">6/6</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-6">
            Lesson Complete!
          </div>

          <div className="bg-[#1A2C35] rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm">
              Wrong attempts: <span className="text-[#FF4B4B] font-bold">{wrongCount}</span>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Animation used: <span className="text-[#58CC02]">{ANIMATION_STYLES[correctStyle].emoji} {ANIMATION_STYLES[correctStyle].name}</span>
            </p>
          </div>

          <button
            onClick={handleNewLesson}
            className="w-full py-4 bg-[#58CC02] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all mb-3"
          >
            Start New Lesson
          </button>
          <button
            onClick={handleRestart}
            className="w-full py-3 bg-[#1A2C35] text-gray-400 font-bold rounded-xl border border-gray-700 hover:text-white transition-colors"
          >
            Restart Same Lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#eef6fc] text-[#3c3c3c] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#eef6fc] border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => setLessonStarted(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          {/* Progress bar */}
          <div className="flex-1 mx-4">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#58CC02] transition-all duration-300"
                style={{ width: `${(correctStage / 6) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {correctStage}/6
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pt-2 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Info bar */}
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-600">
              Style: {ANIMATION_STYLES[correctStyle].emoji} {ANIMATION_STYLES[correctStyle].name}
            </span>
            <span className="text-gray-600">
              Wrong: {wrongCount} ({WRONG_ANIMATION_STYLES[wrongStyle].name})
            </span>
          </div>

          {/* Chessboard */}
          <div className="relative">
            <div
              className="aspect-square w-full grid grid-cols-8 grid-rows-8 overflow-hidden"
              style={{ borderRadius: '8px 8px 0 0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}
            >
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isLight = (row + col) % 2 === 0;
                return (
                  <div
                    key={i}
                    className={isLight ? 'bg-[#edeed1]' : 'bg-[#779952]'}
                  />
                );
              })}
            </div>

            {/* Simulate buttons on top of board when no popup */}
            {showPopup === null && (
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/20 rounded-t-lg">
                <button
                  onClick={handleCorrect}
                  disabled={correctStage >= 6}
                  className="px-8 py-4 bg-[#58CC02] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all disabled:opacity-50"
                >
                  Correct
                </button>
                <button
                  onClick={handleWrong}
                  className="px-8 py-4 bg-[#FF4B4B] text-white font-bold rounded-xl text-lg shadow-[0_4px_0_#CC3B3B] active:translate-y-[2px] active:shadow-[0_2px_0_#CC3B3B] transition-all"
                >
                  Wrong
                </button>
              </div>
            )}
          </div>

          {/* CORRECT POPUP */}
          {showPopup === 'correct' && (
            <div className="w-full bg-[#D7FFB8] px-4 py-2.5 rounded-b-2xl animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0">
                  <RookProgressAnimation
                    ref={correctRef}
                    style={correctStyle}
                    scale={0.8}
                    showProgress={false}
                    showLabel={false}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-full bg-[#58CC02] flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <span className="text-base font-bold text-[#58CC02]">
                      {correctStage}/6 Correct
                    </span>
                  </div>
                  <p className="text-[#3d7a00] font-semibold text-lg">
                    {QUIPS[correctStage - 1] || QUIPS[0]}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-shrink-0 w-11 h-11 bg-white/50 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#3d7a00">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                  </svg>
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 py-2.5 bg-[#58CC02] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* WRONG POPUP */}
          {showPopup === 'wrong' && (
            <div className="w-full bg-[#FFDFE0] px-4 py-2.5 rounded-b-2xl animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0">
                  <RookWrongAnimation
                    ref={wrongRef}
                    style={wrongStyle}
                    scale={0.8}
                    visibleStages={6}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-full bg-[#FF4B4B] flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </div>
                    <span className="text-base font-bold text-[#FF4B4B]">
                      Not Quite!
                    </span>
                  </div>
                  <p className="text-[#8B0000] font-semibold text-lg">
                    {WRONG_MESSAGES[(wrongCount - 1) % WRONG_MESSAGES.length]}
                  </p>
                </div>
              </div>

              <button
                onClick={handleTryAgain}
                className="w-full py-2.5 bg-[#FF4B4B] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#CC3939] active:translate-y-[2px] active:shadow-[0_2px_0_#CC3939] transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Placeholder when no popup */}
          {showPopup === null && (
            <div className="w-full bg-gray-100 px-4 py-4 rounded-b-2xl text-center text-gray-400">
              Click Correct or Wrong to simulate a puzzle result
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
