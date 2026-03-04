'use client';

import React, { useEffect, useRef } from 'react';
import {
  RookProgressAnimation,
  RookProgressAnimationRef,
  AnimationStyle,
} from '@/components/lesson/RookProgressAnimation';
import {
  RookCelebrationAnimation,
  RookCelebrationAnimationRef,
  CelebrationAnimationStyle,
} from '@/components/lesson/RookCelebrationAnimation';
import {
  RookWrongAnimation,
  RookWrongAnimationRef,
  WrongAnimationStyle,
} from '@/components/lesson/RookWrongAnimation';
import { BreathingRook } from '@/components/ui/BreathingRook';

interface PuzzleResultPopupProps {
  type: 'correct' | 'incorrect';
  message?: string;
  onContinue: () => void;
  showSolution?: boolean;
  onShowSolution?: () => void;
  // Optional rook animation props - if not provided, no animation shown
  rookAnimationStyle?: AnimationStyle;
  rookWrongStyle?: WrongAnimationStyle;
  rookProgressRef?: React.RefObject<RookProgressAnimationRef | null>;
  rookWrongRef?: React.RefObject<RookWrongAnimationRef | null>;
  rookCurrentStage?: number; // Pass current stage to maintain progress across popup mounts
  // Celebration mode: full rook with color animations instead of building layer by layer
  celebrationMode?: boolean;
  rookCelebrationStyle?: CelebrationAnimationStyle;
  rookCelebrationRef?: React.RefObject<RookCelebrationAnimationRef | null>;
  // Hide the continue/try-again button (auto-advance or auto-reset handles it)
  hideButton?: boolean;
  // Checkmate explanation props
  isCheckmate?: boolean;
  onShowCheckmateExplain?: (show: boolean) => void;
  checkmateExplainActive?: boolean;
  // Show BreathingRook (Rookie) as fallback when no rook animation provided
  showRookie?: boolean;
}

export function PuzzleResultPopup({
  type,
  message,
  onContinue,
  showSolution,
  onShowSolution,
  rookAnimationStyle,
  rookWrongStyle,
  rookProgressRef,
  rookWrongRef,
  rookCurrentStage = 0,
  celebrationMode = false,
  rookCelebrationStyle,
  rookCelebrationRef,
  hideButton = false,
  isCheckmate,
  onShowCheckmateExplain,
  checkmateExplainActive,
  showRookie = false,
}: PuzzleResultPopupProps) {
  const isCorrect = type === 'correct';
  const displayMessage = message || (isCorrect ? 'Excellent!' : "Oops, that's not correct");

  // Local refs if external ones not provided
  const localCorrectRef = useRef<RookProgressAnimationRef>(null);
  const localCelebrationRef = useRef<RookCelebrationAnimationRef>(null);
  const localWrongRef = useRef<RookWrongAnimationRef>(null);
  const correctRef = rookProgressRef || localCorrectRef;
  const celebrationRef = rookCelebrationRef || localCelebrationRef;
  const wrongRef = rookWrongRef || localWrongRef;

  // Trigger animation when popup mounts
  useEffect(() => {
    if (isCorrect && celebrationMode && rookCelebrationStyle) {
      setTimeout(() => celebrationRef.current?.triggerAnimation(), 150);
    } else if (isCorrect && rookAnimationStyle) {
      setTimeout(() => correctRef.current?.triggerNextStage(), 150);
    } else if (!isCorrect && rookWrongStyle) {
      setTimeout(() => wrongRef.current?.triggerAnimation(), 250);
    }
  }, [isCorrect, celebrationMode, rookCelebrationStyle, rookAnimationStyle, rookWrongStyle, correctRef, celebrationRef, wrongRef]);

  // Auto-show checkmate highlights on mount (parent controls initial state)
  useEffect(() => {
    if (isCorrect && isCheckmate && onShowCheckmateExplain && !checkmateExplainActive) {
      onShowCheckmateExplain(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount — parent owns the state after that

  const showRookAnimation = (isCorrect && (rookAnimationStyle || rookCelebrationStyle)) || (!isCorrect && rookWrongStyle);
  const showRook = showRookAnimation || showRookie;

  return (
    <div
      className={`
        w-full z-50
        py-2.5 pr-4
        rounded-b-2xl
        ${isCorrect ? 'bg-chess-correct-bg' : 'bg-chess-wrong-bg'}
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
            {isCorrect && celebrationMode && rookCelebrationStyle ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <RookCelebrationAnimation
                  ref={celebrationRef}
                  style={rookCelebrationStyle}
                  scale={0.7}
                  autoPlay={false}
                />
              </div>
            ) : isCorrect && rookAnimationStyle ? (
              <RookProgressAnimation
                ref={correctRef}
                style={rookAnimationStyle}
                currentStage={rookCurrentStage}
                scale={0.7}
                showProgress={false}
                showLabel={false}
                compact
              />
            ) : !isCorrect && rookWrongStyle ? (
              <RookWrongAnimation
                ref={wrongRef}
                style={rookWrongStyle}
                scale={0.7}
                visibleStages={6}
                compact
              />
            ) : showRookie ? (
              <BreathingRook size="sm" />
            ) : null}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Message + Why button row */}
          <div className="flex items-center gap-2 mb-1.5">
            <p
              className={`font-bold leading-tight flex-1 ${isCorrect ? 'text-chess-green-dark' : 'text-chess-red'}`}
              style={{ fontSize: 15 }}
            >
              {displayMessage}
            </p>
            {isCorrect && isCheckmate && onShowCheckmateExplain && (
              <button
                onClick={() => {
                  onShowCheckmateExplain(!checkmateExplainActive);
                }}
                className="flex-shrink-0 text-[12px] font-semibold px-2.5 py-0.5 rounded-full transition-all active:scale-95"
                style={{
                  color: checkmateExplainActive ? '#FFFFFF' : '#46A302',
                  backgroundColor: checkmateExplainActive ? '#46A302' : 'rgba(88, 204, 2, 0.12)',
                  border: '1px solid rgba(88, 204, 2, 0.3)',
                }}
              >
                WHY?
              </button>
            )}
          </div>

          {/* Checkmate legend + Continue button */}
          {checkmateExplainActive && (
            <div
              className="flex items-center gap-3 mb-1.5 text-[11px] text-chess-green-dark"
              style={{ animation: 'legendFadeIn 0.25s ease-out' }}
            >
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5" style={{ backgroundColor: 'rgba(255, 0, 0, 0.6)' }} />
                Attacked Square
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5" style={{ backgroundColor: 'rgba(255, 255, 0, 0.7)' }} />
                Blocked by own pieces
              </span>
            </div>
          )}

          {/* Button row */}
          {!hideButton && (
            <>
              {!isCorrect && !showSolution && onShowSolution ? (
                <button
                  onClick={onShowSolution}
                  className="w-full py-1.5 bg-chess-red text-white font-bold rounded-xl uppercase tracking-wide text-[13px] shadow-[0_3px_0_var(--color-chess-red-shadow)] active:translate-y-[1px] active:shadow-[0_2px_0_var(--color-chess-red-shadow)] transition-all"
                >
                  Try Again
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={onContinue}
                    className={`
                      flex-1 py-1.5 font-bold rounded-xl uppercase tracking-wide text-[13px] transition-all
                      active:translate-y-[1px]
                      ${isCorrect
                        ? 'bg-chess-green text-white shadow-[0_3px_0_var(--color-chess-green-dark)] active:shadow-[0_2px_0_var(--color-chess-green-dark)]'
                        : 'bg-chess-red text-white shadow-[0_3px_0_var(--color-chess-red-shadow)] active:shadow-[0_2px_0_var(--color-chess-red-shadow)]'
                      }
                    `}
                  >
                    Continue
                  </button>
                </div>
              )}
            </>
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
        @keyframes legendFadeIn {
          0% {
            opacity: 0;
            max-height: 0;
          }
          100% {
            opacity: 1;
            max-height: 60px;
          }
        }
      `}</style>
    </div>
  );
}
