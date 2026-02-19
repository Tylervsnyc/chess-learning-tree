'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getRandomQuote, getTierLabel } from '@/data/celebration-quotes';
import { playCelebrationSound } from '@/lib/sounds';
import { RookCelebrationAnimation, RookCelebrationAnimationRef, CelebrationAnimationStyle } from './RookCelebrationAnimation';
import { RookWrongAnimation, RookWrongAnimationRef, WrongAnimationStyle } from './RookWrongAnimation';
import { ShareEvents } from '@/lib/analytics/posthog';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { AdSlot } from '@/components/ads/AdSlot';

const COLORS = {
  green: 'var(--color-chess-green)',
  blue: 'var(--color-chess-blue)',
};

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
}: LessonCompleteScreenProps) {
  const isPerfect = correctCount === 6;
  const didFail = correctCount <= 3;
  const canShare = !didFail && correctCount >= 4; // Scores 4/6, 5/6, 6/6
  const accuracy = Math.round((correctCount / 6) * 100);
  const rookRef = useRef<RookCelebrationAnimationRef>(null);
  const wrongRookRef = useRef<RookWrongAnimationRef>(null);
  const shareContainerRef = useRef<HTMLDivElement>(null);
  const shareImageRef = useRef<Blob | null>(null);
  const [shareFeedbackVisible, setShareFeedbackVisible] = useState(false);
  const [shareFeedbackDismissing, setShareFeedbackDismissing] = useState(false);
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
  const shareUrl = `https://chesspath.app/lesson/${lessonId}/share/${isPerfect ? 'perfect' : 'completed'}`;

  // Pre-fetch share image on mount so it's instant when user taps rook
  useEffect(() => {
    if (!canShare) return;
    const score = isPerfect ? '6/6' : '5/6';
    const ogParams = new URLSearchParams({ score, lesson: lessonName, level: getLevelKeyFromLessonId(lessonId) });
    fetch(`/api/og/lesson?${ogParams.toString()}`)
      .then(res => res.ok ? res.blob() : null)
      .then(blob => { if (blob) shareImageRef.current = blob; })
      .catch(() => {});
  }, [canShare, isPerfect, lessonName, lessonId, getLevelKeyFromLessonId]);

  // Dismiss the share toast with exit animation
  const dismissShareToast = () => {
    setShareFeedbackDismissing(true);
    setTimeout(() => {
      setShareFeedbackVisible(false);
      setShareFeedbackDismissing(false);
    }, 250); // matches toastFadeOut duration
  };

  // Handle tap on rook to share
  const handleRookShare = async () => {
    if (!canShare) return;

    ShareEvents.shareClicked('lesson', 'rook');

    // Show feedback toast
    setShareFeedbackVisible(true);
    setShareFeedbackDismissing(false);

    // Try native share with image file (instant thumbnail in share sheet)
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        const shareData: ShareData = {
          title: `${lessonName} | Chess Path`,
          text: `I ${isPerfect ? 'got a perfect score' : 'completed'} "${lessonName}" on Chess Path!`,
          url: shareUrl,
        };
        // Attach pre-fetched image if available
        if (shareImageRef.current) {
          const file = new File([shareImageRef.current], 'chess-path.png', { type: 'image/png' });
          shareData.files = [file];
        }
        await navigator.share(shareData);
        ShareEvents.shareCompleted('lesson', shareImageRef.current ? 'native_image' : 'native');
        setTimeout(dismissShareToast, 1500);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          dismissShareToast();
          return;
        }
      }
    }

    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(shareUrl);
      ShareEvents.shareCompleted('lesson', 'clipboard');
      setTimeout(dismissShareToast, 1500);
    } catch {
      // Silent fail
      dismissShareToast();
    }
  };

  return (
    <div className={`h-full flex flex-col items-center overflow-auto px-5 py-6 ${didFail ? 'bg-chess-page text-chess-text' : 'bg-chess-bg text-white'}`}>
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
                  {(isPerfect
                    ? [
                        { left: '30%', size: 7, color: '#58CC02', delay: '0s', anim: 'floatUp0', duration: '4.2s' },
                        { left: '55%', size: 6, color: '#FFC800', delay: '0.6s', anim: 'floatUp1', duration: '4.8s' },
                        { left: '70%', size: 7, color: '#1CB0F6', delay: '1.2s', anim: 'floatUp2', duration: '4s' },
                        { left: '40%', size: 6, color: '#FFC800', delay: '1.8s', anim: 'floatUp0', duration: '4.5s' },
                        { left: '60%', size: 8, color: '#FFC800', delay: '0.3s', anim: 'floatUp1', duration: '4.3s' },
                        { left: '25%', size: 6, color: '#1CB0F6', delay: '1.5s', anim: 'floatUp2', duration: '5s' },
                      ]
                    : [
                        { left: '30%', size: 7, color: '#58CC02', delay: '0s', anim: 'floatUp0', duration: '4.2s' },
                        { left: '55%', size: 6, color: '#FFC800', delay: '0.6s', anim: 'floatUp1', duration: '4.8s' },
                        { left: '70%', size: 7, color: '#1CB0F6', delay: '1.2s', anim: 'floatUp2', duration: '4s' },
                        { left: '40%', size: 6, color: '#58CC02', delay: '1.8s', anim: 'floatUp0', duration: '4.5s' },
                        { left: '60%', size: 6, color: '#FFC800', delay: '0.3s', anim: 'floatUp1', duration: '4.3s' },
                        { left: '25%', size: 6, color: '#1CB0F6', delay: '1.5s', anim: 'floatUp2', duration: '5s' },
                      ]
                  ).map((p, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        bottom: '20%',
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        backgroundColor: p.color,
                        animation: `${p.anim} ${p.duration} ease-in-out infinite`,
                        animationDelay: p.delay,
                        opacity: 0,
                        pointerEvents: 'none',
                      }}
                    />
                  ))}
                </>
              )}

              <RookCelebrationAnimation
                ref={rookRef}
                style={celebrationStyle}
                scale={1.6}
                autoPlay={true}
              />
            </div>
          )}
        </div>

        {/* Share toast pill (below the rook, not covering it) */}
        {FEATURE_FLAGS.SHOW_SHARING && canShare && shareFeedbackVisible && (
          <div className="flex justify-center -mt-1 mb-1">
            <div
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                font-bold text-sm text-white shadow-lg
                ${shareFeedbackDismissing ? 'share-toast-exit' : 'share-toast-enter'}
                ${isPerfect ? 'bg-chess-gold-dark' : 'bg-chess-green-dark'}
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Link Copied!
            </div>
          </div>
        )}

        {/* "Tap rook to share" hint — hidden when toast is showing */}
        {FEATURE_FLAGS.SHOW_SHARING && canShare && !shareFeedbackVisible && (
          <div className={`share-hint ${isPerfect ? 'share-hint-gold' : 'share-hint-green'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
