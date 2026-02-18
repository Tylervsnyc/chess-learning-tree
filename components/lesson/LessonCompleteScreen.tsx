'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getRandomQuote, getTierLabel } from '@/data/celebration-quotes';
import { playCelebrationSound } from '@/lib/sounds';
import { RookCelebrationAnimation, RookCelebrationAnimationRef, CelebrationAnimationStyle } from './RookCelebrationAnimation';
import { RookWrongAnimation, RookWrongAnimationRef, WrongAnimationStyle } from './RookWrongAnimation';
import { generateLessonShareText } from '@/lib/share/generate-share-text';
import { ShareEvents } from '@/lib/analytics/posthog';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { AdSlot } from '@/components/ads/AdSlot';

const COLORS = {
  green: 'var(--color-chess-green)',
  blue: 'var(--color-chess-blue)',
};

const celebrationStyles = `
  @keyframes fadeInUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.4s ease-out forwards;
  }
  @keyframes pulseRing {
    0% { transform: scale(0.8); opacity: 0; }
    20% { opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }
  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 140px;
    margin: -70px 0 0 -70px;
    border-radius: 50%;
    border: 2px solid;
    animation: pulseRing 2s ease-out infinite;
    opacity: 0;
  }
  .pulse-ring-green {
    border-color: rgba(88, 204, 2, 0.4);
    animation-delay: 1.5s;
  }
  .pulse-ring-green:nth-child(2) {
    animation-delay: 2s;
  }
  .pulse-ring-gold {
    border-color: rgba(255, 200, 0, 0.4);
    animation-delay: 1.5s;
  }
  .pulse-ring-gold:nth-child(2) {
    animation-delay: 2s;
  }
  @keyframes hintFadeIn {
    0% { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .share-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-size: 13px;
    font-weight: 600;
    opacity: 0;
    animation: hintFadeIn 0.6s ease forwards;
    animation-delay: 1.8s;
    letter-spacing: 0.3px;
  }
  .share-hint-green {
    color: rgba(255, 255, 255, 0.5);
  }
  .share-hint-gold {
    color: rgba(255, 200, 0, 0.6);
  }
  .share-feedback {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
  }
  .share-feedback.show {
    opacity: 1;
    transform: scale(1);
  }
  .share-feedback-green {
    background: rgba(88, 204, 2, 0.9);
  }
  .share-feedback-gold {
    background: rgba(255, 200, 0, 0.92);
  }
  .share-feedback svg {
    width: 48px;
    height: 48px;
    color: white;
  }
  .share-feedback span {
    color: white;
    font-weight: 800;
    font-size: 16px;
    margin-top: 6px;
  }
  .rook-share-button {
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    transition: transform 0.15s ease;
  }
  .rook-share-button:active {
    transform: scale(0.96);
  }
`;

interface LessonCompleteScreenProps {
  correctCount: number;
  wrongCount: number;
  lessonName: string;
  lessonId: string;
  isGuest: boolean;
  getLevelKeyFromLessonId: (id: string) => string;
  streak: number;
  puzzleResults: ('correct' | 'wrong')[];
}

export function LessonCompleteScreen({
  correctCount,
  lessonName,
  lessonId,
  isGuest,
  getLevelKeyFromLessonId,
  streak,
  puzzleResults,
}: LessonCompleteScreenProps) {
  const isPerfect = correctCount === 6;
  const didFail = correctCount <= 3;
  const canShare = !didFail && correctCount >= 4; // Scores 4/6, 5/6, 6/6
  const accuracy = Math.round((correctCount / 6) * 100);
  const rookRef = useRef<RookCelebrationAnimationRef>(null);
  const wrongRookRef = useRef<RookWrongAnimationRef>(null);
  const shareContainerRef = useRef<HTMLDivElement>(null);
  const [shareFeedbackVisible, setShareFeedbackVisible] = useState(false);
  // Pick a random celebration animation style (used when passing)
  const celebrationStyle: CelebrationAnimationStyle = useMemo(() => {
    const styles: CelebrationAnimationStyle[] = ['sparkleBurst', 'wave', 'radiate', 'ripple', 'cascade', 'bloom'];
    return styles[Math.floor(Math.random() * styles.length)];
  }, []);

  // Pick a random wrong animation style (used when failing)
  const wrongStyle: WrongAnimationStyle = useMemo(() => {
    const styles: WrongAnimationStyle[] = ['powerDown', 'shortCircuit', 'pixelFade', 'shrink', 'signalLoss'];
    return styles[Math.floor(Math.random() * styles.length)];
  }, []);

  // Get a random quote (memoized so it doesn't change on re-render)
  const quote = useMemo(() => getRandomQuote(correctCount), [correctCount]);
  const tierLabel = didFail ? 'Not Quite' : getTierLabel(correctCount);

  // Confetti burst and sound on mount (only when passing)
  useEffect(() => {
    if (didFail) return;

    // Confetti
    confetti({
      particleCount: isPerfect ? 100 : correctCount >= 5 ? 60 : 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: isPerfect
        ? ['#FFC800', 'var(--color-chess-gold)', '#FFAA00', '#FFFFFF']
        : ['var(--color-chess-green)', 'var(--color-chess-blue)', '#FF9600', '#FFFFFF'],
      gravity: 1.2,
      ticks: 200,
    });
    confetti({
      particleCount: isPerfect ? 100 : correctCount >= 5 ? 60 : 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: isPerfect
        ? ['#FFC800', 'var(--color-chess-gold)', '#FFAA00', '#FFFFFF']
        : ['var(--color-chess-green)', 'var(--color-chess-blue)', '#FF9600', '#FFFFFF'],
      gravity: 1.2,
      ticks: 200,
    });

    // Sound
    playCelebrationSound(correctCount);
  }, [isPerfect, correctCount, didFail]);

  // Wrong rook animation on mount (only when failing)
  useEffect(() => {
    if (!didFail) return;

    wrongRookRef.current?.showFull();
    const timer = setTimeout(() => {
      wrongRookRef.current?.triggerAnimation();
    }, 600);

    return () => clearTimeout(timer);
  }, [didFail]);

  // Build share URL for tap-to-share
  const levelNumber = parseInt(lessonId.split('.')[0], 10);
  const lessonNumber = parseInt(lessonId.split('.')[1], 10);
  const shareUrl = `https://chesspath.app/lesson/${lessonId}?score=${correctCount}%2F6&accuracy=${accuracy}${streak > 0 ? `&streak=${streak}` : ''}`;

  // Handle tap on rook to share
  const handleRookShare = async () => {
    if (!canShare) return;

    ShareEvents.shareClicked('lesson', 'rook');

    // Show feedback overlay
    setShareFeedbackVisible(true);

    // Try native share first
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `${lessonName} | Chess Path`,
          text: `I scored ${correctCount}/6 on "${lessonName}" on Chess Path!`,
          url: shareUrl,
        });
        ShareEvents.shareCompleted('lesson', 'native');
        setTimeout(() => setShareFeedbackVisible(false), 1500);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setShareFeedbackVisible(false);
          return;
        }
      }
    }

    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(shareUrl);
      ShareEvents.shareCompleted('lesson', 'clipboard');
      setTimeout(() => setShareFeedbackVisible(false), 1500);
    } catch {
      // Silent fail
      setShareFeedbackVisible(false);
    }
  };

  return (
    <div className={`h-full flex flex-col items-center overflow-auto px-5 py-6 ${didFail ? 'bg-chess-page text-chess-text' : 'bg-chess-bg text-white'}`}>
      <style>{celebrationStyles}</style>
      <div className="max-w-sm w-full">
        {/* Animated Rook */}
        <div className="flex items-center justify-center" style={{ height: didFail ? '200px' : '180px' }}>
          {didFail ? (
            <RookWrongAnimation
              ref={wrongRookRef}
              style={wrongStyle}
              scale={1.6}
              visibleStages={6}
              compact
            />
          ) : (
            <div
              ref={shareContainerRef}
              className={canShare ? 'rook-share-button relative' : 'relative'}
              onClick={canShare ? handleRookShare : undefined}
              role={canShare ? 'button' : undefined}
              tabIndex={canShare ? 0 : undefined}
              onKeyDown={canShare ? (e) => e.key === 'Enter' && handleRookShare() : undefined}
            >
              {canShare && (
                <>
                  <div className={`pulse-ring ${isPerfect ? 'pulse-ring-gold' : 'pulse-ring-green'}`} />
                  <div className={`pulse-ring ${isPerfect ? 'pulse-ring-gold' : 'pulse-ring-green'}`} />
                </>
              )}

              <RookCelebrationAnimation
                ref={rookRef}
                style={celebrationStyle}
                scale={1.6}
                autoPlay={true}
              />

              {canShare && (
                <div
                  className={`share-feedback ${shareFeedbackVisible ? 'show' : ''} ${
                    isPerfect ? 'share-feedback-gold' : 'share-feedback-green'
                  }`}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Link copied!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* "Tap rook to share" hint */}
        {FEATURE_FLAGS.SHOW_SHARING && canShare && (
          <div className={`share-hint ${isPerfect ? 'share-hint-gold' : 'share-hint-green'}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Tap rook to share
          </div>
        )}

        {/* Score + tier */}
        <div className="text-center mb-2">
          <div
            className="text-4xl font-black mb-1 animate-fadeInUp"
            style={{
              color: didFail ? 'var(--color-chess-red)' : isPerfect ? '#FFC800' : COLORS.green,
              animationFillMode: 'backwards',
            }}
          >
            {correctCount}/6
          </div>
          <div
            className={`text-sm uppercase tracking-wider animate-fadeInUp ${didFail ? 'text-chess-text-muted' : 'text-chess-text-muted'}`}
            style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
          >
            {tierLabel}
          </div>
        </div>

        {/* Funny quote */}
        <div
          className="text-center mb-4 animate-fadeInUp"
          style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
        >
          <p className={`text-lg font-medium italic ${didFail ? 'text-chess-text' : 'text-white'}`}>
            &ldquo;{quote}&rdquo;
          </p>
        </div>


        {/* Premium upsell / ad slot */}
        <div
          className="mb-4 animate-fadeInUp"
          style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
        >
          <AdSlot position="after-lesson" />
        </div>

        {/* Buttons */}
        {didFail ? (
          <div
            className="flex flex-col gap-3 animate-fadeInUp"
            style={{ animationDelay: '0.45s', animationFillMode: 'backwards' }}
          >
            <button
              onClick={() => { window.location.href = `/lesson/${lessonId}`; }}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:translate-y-[2px]"
              style={{
                backgroundColor: COLORS.green,
                boxShadow: '0 4px 0 var(--color-chess-green-shadow)',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => {
                window.location.href = isGuest
                  ? `/learn?guest=true&level=${getLevelKeyFromLessonId(lessonId)}`
                  : `/learn?level=${getLevelKeyFromLessonId(lessonId)}`;
              }}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-chess-text-muted border-2 border-slate-200 bg-chess-surface transition-all active:translate-y-[1px] active:bg-slate-50"
            >
              Back to Learn
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              window.location.href = isGuest
                ? `/learn?guest=true&level=${getLevelKeyFromLessonId(lessonId)}`
                : `/learn?level=${getLevelKeyFromLessonId(lessonId)}`;
            }}
            className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:translate-y-[2px] animate-fadeInUp"
            style={{
              backgroundColor: COLORS.green,
              boxShadow: '0 4px 0 var(--color-chess-green-shadow)',
              animationDelay: '0.45s',
              animationFillMode: 'backwards',
            }}
          >
            Continue
          </button>
        )}

        {/* Guest signup prompt */}
        {isGuest && (
          <div
            className={`mt-4 rounded-2xl p-4 animate-fadeInUp ${didFail ? 'bg-chess-surface border border-slate-200' : 'bg-chess-bg-light'}`}
            style={{ animationDelay: '0.55s', animationFillMode: 'backwards' }}
          >
            <p className={`text-sm mb-3 text-center ${didFail ? 'text-chess-text-muted' : 'text-chess-text-muted'}`}>Create a free account to save progress</p>
            <div className="flex gap-3">
              <Link
                href="/auth/signup?from=lesson"
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white text-center bg-chess-text hover:brightness-110 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white text-center bg-chess-text hover:brightness-110 transition-colors"
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
