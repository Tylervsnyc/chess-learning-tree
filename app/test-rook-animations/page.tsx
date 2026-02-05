'use client';

import React, { useRef, useState } from 'react';
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
import { PuzzleResultPopup } from '@/components/puzzle/PuzzleResultPopup';

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

export default function TestRookAnimationsPage() {
  const correctRef = useRef<RookProgressAnimationRef>(null);
  const wrongRef = useRef<RookWrongAnimationRef>(null);

  const [correctStyle, setCorrectStyle] = useState<AnimationStyle>('lightning');
  const [wrongStyle, setWrongStyle] = useState<WrongAnimationStyle>('powerDown');
  const [correctStage, setCorrectStage] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showPopup, setShowPopup] = useState<'correct' | 'wrong' | null>(null);

  const handleTriggerCorrect = () => {
    if (correctStage >= 6) return;
    setCorrectStage(prev => prev + 1);
    setShowPopup('correct');
  };

  const handleTriggerWrong = () => {
    setWrongCount(prev => prev + 1);
    wrongRef.current?.reset();
    setShowPopup('wrong');
  };

  const handleReset = () => {
    correctRef.current?.reset();
    wrongRef.current?.reset();
    setCorrectStage(0);
    setWrongCount(0);
    setShowPopup(null);
  };

  const handleContinue = () => {
    setShowPopup(null);
  };

  const isComplete = correctStage >= 6;

  return (
    <div className="h-full overflow-y-auto bg-[#0d1518] text-white">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Animation Test</h1>
            <p className="text-xs text-gray-500 mt-0.5">Preview popup animations</p>
          </div>
          <a
            href="/learn"
            className="text-sm text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            ← Back
          </a>
        </div>

        {/* Style Selectors - Compact pills */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <select
              value={correctStyle}
              onChange={(e) => {
                setCorrectStyle(e.target.value as AnimationStyle);
                correctRef.current?.reset();
                setCorrectStage(0);
                setShowPopup(null);
              }}
              className="w-full bg-[#58CC02]/10 text-[#58CC02] px-3 py-2 rounded-xl text-sm font-medium border border-[#58CC02]/20 outline-none cursor-pointer hover:bg-[#58CC02]/15 transition-colors"
            >
              {correctStyleKeys.map((key) => (
                <option key={key} value={key} className="bg-[#131F24] text-white">
                  {ANIMATION_STYLES[key].emoji} {ANIMATION_STYLES[key].name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              value={wrongStyle}
              onChange={(e) => {
                setWrongStyle(e.target.value as WrongAnimationStyle);
                wrongRef.current?.reset();
              }}
              className="w-full bg-[#FF4B4B]/10 text-[#FF4B4B] px-3 py-2 rounded-xl text-sm font-medium border border-[#FF4B4B]/20 outline-none cursor-pointer hover:bg-[#FF4B4B]/15 transition-colors"
            >
              {wrongStyleKeys.map((key) => (
                <option key={key} value={key} className="bg-[#131F24] text-white">
                  {WRONG_ANIMATION_STYLES[key].emoji} {WRONG_ANIMATION_STYLES[key].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Board + Popup Container */}
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Mini Chessboard */}
          <div className="aspect-square w-full grid grid-cols-8 grid-rows-8">
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

          {/* Popup Area */}
          {showPopup === 'correct' && (
            <PuzzleResultPopup
              key={`correct-${correctStage}`}
              type="correct"
              message={QUIPS[correctStage - 1] || QUIPS[0]}
              onContinue={handleContinue}
              rookAnimationStyle={correctStyle}
              rookProgressRef={correctRef}
              rookCurrentStage={correctStage - 1}
            />
          )}
          {showPopup === 'wrong' && (
            <PuzzleResultPopup
              key={`wrong-${wrongCount}`}
              type="incorrect"
              message="Close, but there's a better move here."
              onContinue={handleContinue}
              showSolution={true}
              rookWrongStyle={wrongStyle}
              rookWrongRef={wrongRef}
            />
          )}

          {/* Placeholder when no popup */}
          {showPopup === null && (
            <div className="bg-[#1a2830] px-4 py-5 text-center border-t border-white/5">
              <p className="text-gray-500 text-sm">
                {isComplete ? '✨ All 6 stages complete!' : 'Tap a button below to test'}
              </p>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#58CC02] to-[#7ED321] transition-all duration-500 ease-out"
              style={{ width: `${(correctStage / 6) * 100}%` }}
            />
          </div>
          <span className="text-sm font-mono text-gray-500 tabular-nums w-10 text-right">
            {correctStage}/6
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={handleTriggerCorrect}
            disabled={isComplete}
            className={`
              py-3.5 font-bold rounded-xl uppercase tracking-wide transition-all text-sm
              ${isComplete
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-[#58CC02] text-white shadow-[0_4px_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_#46A302] hover:brightness-110'
              }
            `}
          >
            {isComplete ? 'Complete!' : 'Correct'}
          </button>
          <button
            onClick={handleTriggerWrong}
            className="py-3.5 bg-[#FF4B4B] text-white font-bold rounded-xl uppercase tracking-wide shadow-[0_4px_0_#CC3939] active:translate-y-[2px] active:shadow-[0_2px_0_#CC3939] transition-all text-sm hover:brightness-110"
          >
            Wrong
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="w-full mt-3 py-2.5 text-gray-500 font-medium rounded-xl hover:bg-white/5 hover:text-gray-300 transition-all text-sm"
        >
          Reset All
        </button>

        {/* Stats */}
        {(correctStage > 0 || wrongCount > 0) && (
          <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#58CC02]" />
              <span>{correctStage} correct</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF4B4B]" />
              <span>{wrongCount} wrong</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
