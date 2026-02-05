'use client';

import React, { useEffect, useRef } from 'react';
import { ShareButton } from '@/components/share/ShareButton';
import {
  RookProgressAnimation,
  RookProgressAnimationRef,
  AnimationStyle,
} from '@/components/lesson/RookProgressAnimation';
import {
  RookWrongAnimation,
  RookWrongAnimationRef,
  WrongAnimationStyle,
} from '@/components/lesson/RookWrongAnimation';

interface PuzzleShareData {
  fen: string;
  playerColor: 'white' | 'black';
  lastMoveFrom?: string;
  lastMoveTo?: string;
  solutionMoves: string[]; // UCI format
}

interface PuzzleResultPopupProps {
  type: 'correct' | 'incorrect';
  message?: string;
  onContinue: () => void;
  showSolution?: boolean;
  onShowSolution?: () => void;
  puzzleShareData?: PuzzleShareData;
  // Optional rook animation props - if not provided, no animation shown
  rookAnimationStyle?: AnimationStyle;
  rookWrongStyle?: WrongAnimationStyle;
  rookProgressRef?: React.RefObject<RookProgressAnimationRef | null>;
  rookWrongRef?: React.RefObject<RookWrongAnimationRef | null>;
  rookCurrentStage?: number; // Pass current stage to maintain progress across popup mounts
}

export function PuzzleResultPopup({
  type,
  message,
  onContinue,
  showSolution,
  onShowSolution,
  puzzleShareData,
  rookAnimationStyle,
  rookWrongStyle,
  rookProgressRef,
  rookWrongRef,
  rookCurrentStage = 0,
}: PuzzleResultPopupProps) {
  const isCorrect = type === 'correct';
  const displayMessage = message || (isCorrect ? 'Excellent!' : "Oops, that's not correct");

  // Local refs if external ones not provided
  const localCorrectRef = useRef<RookProgressAnimationRef>(null);
  const localWrongRef = useRef<RookWrongAnimationRef>(null);
  const correctRef = rookProgressRef || localCorrectRef;
  const wrongRef = rookWrongRef || localWrongRef;

  // Trigger animation when popup mounts
  useEffect(() => {
    if (isCorrect && rookAnimationStyle) {
      setTimeout(() => correctRef.current?.triggerNextStage(), 150);
    } else if (!isCorrect && rookWrongStyle) {
      setTimeout(() => wrongRef.current?.triggerAnimation(), 250);
    }
  }, [isCorrect, rookAnimationStyle, rookWrongStyle, correctRef, wrongRef]);

  const showRook = (isCorrect && rookAnimationStyle) || (!isCorrect && rookWrongStyle);

  return (
    <div
      className={`
        w-full z-50
        py-2.5 pr-4
        rounded-b-2xl
        ${isCorrect ? 'bg-[#D7FFB8]' : 'bg-[#FFDFE0]'}
      `}
      style={{
        animation: isCorrect ? 'slideUpBounce 0.3s ease-out' : 'fadeIn 0.2s ease-out',
        paddingLeft: isCorrect ? 16 : 6,
      }}
    >
      <div
        className="max-w-lg mx-auto flex items-center"
        style={{ gap: showRook ? (isCorrect ? 12 : 22) : 0 }}
      >
        {/* Rook animation slot */}
        {showRook && (
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 66, height: 80 }}
          >
            {isCorrect && rookAnimationStyle ? (
              <RookProgressAnimation
                ref={correctRef}
                style={rookAnimationStyle}
                currentStage={rookCurrentStage}
                scale={0.7}
                showProgress={false}
                showLabel={false}
                compact
              />
            ) : rookWrongStyle ? (
              <RookWrongAnimation
                ref={wrongRef}
                style={rookWrongStyle}
                scale={0.7}
                visibleStages={6}
                compact
              />
            ) : null}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Message */}
          <p
            className={`font-bold leading-tight mb-1.5 ${isCorrect ? 'text-[#458500]' : 'text-[#cd2929]'}`}
            style={{ fontSize: 15 }}
          >
            {displayMessage}
          </p>

          {/* Button row */}
          {!isCorrect && !showSolution && onShowSolution ? (
            <button
              onClick={onShowSolution}
              className="w-full py-1.5 bg-[#FF4B4B] text-white font-bold rounded-xl uppercase tracking-wide text-[13px] shadow-[0_3px_0_#CC3939] active:translate-y-[1px] active:shadow-[0_2px_0_#CC3939] transition-all"
            >
              Try Again
            </button>
          ) : (
            <div className="flex gap-2">
              {isCorrect && puzzleShareData && (
                <div className="relative flex-shrink-0">
                  <ShareButton
                    fen={puzzleShareData.fen}
                    playerColor={puzzleShareData.playerColor}
                    lastMoveFrom={puzzleShareData.lastMoveFrom}
                    lastMoveTo={puzzleShareData.lastMoveTo}
                  />
                </div>
              )}
              <button
                onClick={onContinue}
                className={`
                  flex-1 py-1.5 font-bold rounded-xl uppercase tracking-wide text-[13px] transition-all
                  active:translate-y-[1px]
                  ${isCorrect
                    ? 'bg-[#58CC02] text-white shadow-[0_3px_0_#46A302] active:shadow-[0_2px_0_#46A302]'
                    : 'bg-[#FF4B4B] text-white shadow-[0_3px_0_#CC3939] active:shadow-[0_2px_0_#CC3939]'
                  }
                `}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUpBounce {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          70% {
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
