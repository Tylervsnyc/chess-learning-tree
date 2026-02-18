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
  const accuracy = Math.round((correctCount / 6) * 100);
  const rookRef = useRef<RookCelebrationAnimationRef>(null);
  const wrongRookRef = useRef<RookWrongAnimationRef>(null);
  const [textCopied, setTextCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
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

  // Build OG image URL for inline display
  const levelKey = getLevelKeyFromLessonId(lessonId);
  const ogParams = new URLSearchParams({
    score: `${correctCount}/6`,
    lesson: lessonName,
    level: levelKey,
    accuracy: String(accuracy),
  });
  if (streak > 0) ogParams.set('streak', String(streak));

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
            <RookCelebrationAnimation
              ref={rookRef}
              style={celebrationStyle}
              scale={1.6}
              autoPlay={true}
            />
          )}
        </div>

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

        {/* OG Share Card */}
        {FEATURE_FLAGS.SHOW_SHARING && (
          <div
            className="mb-4 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-fadeInUp"
            style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}
          >
            <img
              src={`/api/og/lesson?${ogParams.toString()}`}
              alt={`${lessonName} - ${correctCount}/6`}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Share buttons */}
        {FEATURE_FLAGS.SHOW_SHARING && (
          <div
            className="flex gap-3 mb-4 animate-fadeInUp"
            style={{ animationDelay: '0.38s', animationFillMode: 'backwards' }}
          >
            {/* Share Results - text share */}
            <button
              onClick={async () => {
                ShareEvents.shareClicked('lesson', 'text');
                const shareText = generateLessonShareText({
                  puzzleResults,
                  correctCount,
                  lessonName,
                  streak,
                });
                try {
                  await navigator.clipboard.writeText(shareText);
                  setTextCopied(true);
                  ShareEvents.shareCompleted('lesson', 'clipboard');
                  setTimeout(() => setTextCopied(false), 2000);
                } catch {
                  // Silent fail
                }
              }}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, var(--color-chess-blue), #0A9FE0)', boxShadow: '0 4px 0 #0077A3' }}
            >
              {textCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Share Results
                </>
              )}
            </button>

            {/* Share Link */}
            <button
              onClick={async () => {
                ShareEvents.shareClicked('lesson', 'link');
                const shareUrl = `https://chesspath.app/lesson/${lessonId}?score=${correctCount}%2F6&accuracy=${accuracy}${streak > 0 ? `&streak=${streak}` : ''}`;

                if (typeof navigator !== 'undefined' && 'share' in navigator) {
                  try {
                    await navigator.share({
                      title: `${lessonName} | Chess Path`,
                      text: `I scored ${correctCount}/6 on "${lessonName}" on Chess Path!`,
                      url: shareUrl,
                    });
                    ShareEvents.shareCompleted('lesson', 'native');
                    return;
                  } catch (err) {
                    if (err instanceof Error && err.name === 'AbortError') return;
                  }
                }

                try {
                  await navigator.clipboard.writeText(shareUrl);
                  setLinkCopied(true);
                  ShareEvents.shareCompleted('lesson', 'clipboard');
                  setTimeout(() => setLinkCopied(false), 2000);
                } catch {
                  // Silent fail
                }
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${didFail ? 'text-chess-text' : 'text-white'}`}
              style={didFail
                ? { background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.12)' }
                : { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }
              }
            >
              {linkCopied ? (
                <>
                  <svg className="w-4 h-4 text-chess-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-chess-green">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Share Link
                </>
              )}
            </button>
          </div>
        )}

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
