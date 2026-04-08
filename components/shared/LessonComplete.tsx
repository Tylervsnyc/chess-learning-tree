'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { SignupPrompt } from '@/components/onboarding/SignupPrompt'
import confetti from 'canvas-confetti'
import { getRandomQuote, getTierLabel } from '@/data/celebration-quotes'
import { playCelebrationSound } from '@/lib/sounds'
import {
  RookCelebrationAnimation,
  RookCelebrationAnimationRef,
  CelebrationAnimationStyle,
} from '@/components/lesson/RookCelebrationAnimation'
import {
  RookWrongAnimation,
  RookWrongAnimationRef,
  WrongAnimationStyle,
} from '@/components/lesson/RookWrongAnimation'
import { ShareEvents } from '@/lib/analytics/posthog'
import { FEATURE_FLAGS } from '@/lib/config/feature-flags'
import { AdSlot } from '@/components/ads/AdSlot'
import { RookiePopup } from '@/components/shared/DailyRitual'

// ═══════════════════════════════════════════
// SHARED LESSON COMPLETE — always a modal card
// Used by both /learn and /openings
// ═══════════════════════════════════════════

interface ShareConfig {
  shareUrl: string           // e.g. https://chesspath.app/openings/italian/it-1/share/completed
  ogEndpoint: string         // e.g. '/api/og/opening'
  ogParams: Record<string, string>
  source: 'lesson' | 'daily_challenge' | 'opening'
}

interface LessonCompleteProps {
  // ─── Score (pass correctCount to show score + confetti) ───
  correctCount?: number
  totalPuzzles?: number

  // ─── Text (shown when no score) ───
  title?: string
  subtitle?: string

  // ─── Shared ───
  lessonName: string
  lessonId: string
  onContinue: () => void
  onRetry?: () => void

  // ─── Optional features ───
  isGuest?: boolean
  getLevelKeyFromLessonId?: (id: string) => string
  accentColor?: string
  shareConfig?: ShareConfig
}

const PARTICLES = [
  { left: '30%', size: 7, color: '#58CC02', delay: '0s', anim: 'floatUp0', duration: '4.2s' },
  { left: '55%', size: 6, color: '#FFC800', delay: '0.6s', anim: 'floatUp1', duration: '4.8s' },
  { left: '70%', size: 7, color: '#1CB0F6', delay: '1.2s', anim: 'floatUp2', duration: '4s' },
  { left: '40%', size: 6, color: '#58CC02', delay: '1.8s', anim: 'floatUp0', duration: '4.5s' },
  { left: '60%', size: 6, color: '#FFC800', delay: '0.3s', anim: 'floatUp1', duration: '4.3s' },
  { left: '25%', size: 6, color: '#1CB0F6', delay: '1.5s', anim: 'floatUp2', duration: '5s' },
]

export function LessonComplete({
  correctCount,
  totalPuzzles = 6,
  title,
  subtitle,
  lessonName,
  lessonId,
  onContinue,
  onRetry,
  isGuest = false,
  getLevelKeyFromLessonId,
  accentColor,
  shareConfig,
}: LessonCompleteProps) {
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const hasScore = correctCount !== undefined
  const isPerfect = hasScore && correctCount === totalPuzzles
  const didFail = hasScore && correctCount <= Math.floor(totalPuzzles / 2)
  const canShare = shareConfig ? !didFail : (hasScore && !didFail && correctCount! >= 4)

  const rookRef = useRef<RookCelebrationAnimationRef>(null)
  const wrongRookRef = useRef<RookWrongAnimationRef>(null)
  const shareImageRef = useRef<Blob | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const [shareFeedbackVisible, setShareFeedbackVisible] = useState(false)
  const [shareFeedbackDismissing, setShareFeedbackDismissing] = useState(false)

  const celebrationStyle: CelebrationAnimationStyle = useMemo(() => {
    const styles: CelebrationAnimationStyle[] = ['sparkleBurst', 'wave', 'radiate', 'ripple', 'cascade', 'bloom']
    return styles[Math.floor(Math.random() * styles.length)]
  }, [])

  const wrongStyle: WrongAnimationStyle = useMemo(() => {
    const styles: WrongAnimationStyle[] = ['powerDown', 'shortCircuit', 'pixelFade', 'shrink', 'signalLoss']
    return styles[Math.floor(Math.random() * styles.length)]
  }, [])

  const quote = useMemo(
    () => getRandomQuote(correctCount ?? totalPuzzles, totalPuzzles),
    [hasScore, correctCount, totalPuzzles],
  )
  const tierLabel = hasScore ? (didFail ? 'Not Quite' : getTierLabel(correctCount!, totalPuzzles)) : undefined

  // ─── Confetti + sound (pass only) ───
  useEffect(() => {
    if (didFail) return
    if (!hasScore && !shareConfig) return
    const count = isPerfect || !hasScore ? 100 : correctCount! >= 5 ? 60 : 40
    const colors = isPerfect || !hasScore
      ? ['#FFC800', '#FFAA00', '#FFFFFF']
      : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF']
    confetti({ particleCount: count, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors, gravity: 1.2, ticks: 200 })
    confetti({ particleCount: count, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors, gravity: 1.2, ticks: 200 })
    playCelebrationSound(correctCount)
  }, [isPerfect, correctCount, didFail, hasScore, shareConfig])

  // ─── Wrong rook animation ───
  useEffect(() => {
    if (!didFail) return
    wrongRookRef.current?.showFull()
    const timer = setTimeout(() => wrongRookRef.current?.triggerAnimation(), 600)
    return () => clearTimeout(timer)
  }, [didFail])

  // ─── Modal entrance ───
  useEffect(() => {
    if (!modalRef.current) return
    const el = modalRef.current
    el.style.opacity = '0'
    el.style.transform = 'scale(0.95)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
      el.style.opacity = '1'
      el.style.transform = 'scale(1)'
    })
  }, [])

  // ─── Share pre-fetch ───
  useEffect(() => {
    if (!canShare) return
    let endpoint: string
    let params: URLSearchParams

    if (shareConfig) {
      endpoint = shareConfig.ogEndpoint
      params = new URLSearchParams(shareConfig.ogParams)
    } else if (getLevelKeyFromLessonId) {
      endpoint = '/api/og/lesson'
      const score = isPerfect ? '6/6' : '5/6'
      params = new URLSearchParams({ score, lesson: lessonName, level: getLevelKeyFromLessonId(lessonId) })
    } else {
      return
    }

    fetch(`${endpoint}?${params.toString()}`)
      .then(res => res.ok ? res.blob() : null)
      .then(blob => { if (blob) shareImageRef.current = blob })
      .catch(() => {})
  }, [canShare, isPerfect, lessonName, lessonId, getLevelKeyFromLessonId, shareConfig])

  const dismissShareToast = () => {
    setShareFeedbackDismissing(true)
    setTimeout(() => { setShareFeedbackVisible(false); setShareFeedbackDismissing(false) }, 250)
  }

  const handleRookShare = async () => {
    if (!canShare) return
    const source = shareConfig?.source ?? 'lesson'
    ShareEvents.shareClicked(source, 'rook')
    setShareFeedbackVisible(true)
    setShareFeedbackDismissing(false)
    const url = shareConfig?.shareUrl
      ?? `https://chesspath.app/lesson/${lessonId}/share/${isPerfect ? 'perfect' : 'completed'}`

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        const shareData: ShareData = {
          title: `${lessonName} | Chess Path`,
          text: `I completed "${lessonName}" on Chess Path!`,
          url,
        }
        if (shareImageRef.current) {
          shareData.files = [new File([shareImageRef.current], 'chess-path.png', { type: 'image/png' })]
        }
        await navigator.share(shareData)
        ShareEvents.shareCompleted(source, shareImageRef.current ? 'native_image' : 'native')
        setTimeout(dismissShareToast, 1500)
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') { dismissShareToast(); return }
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      ShareEvents.shareCompleted(source, 'clipboard')
      setTimeout(dismissShareToast, 1500)
    } catch {
      ShareEvents.shareFailed(source, 'clipboard_failed')
      dismissShareToast()
    }
  }

  // Button color
  const btnColor = accentColor || 'var(--color-chess-green)'

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-chess-surface rounded-2xl mx-6 py-8 px-6 text-center max-w-sm w-full shadow-xl flex flex-col items-center overflow-auto max-h-[90vh]">
        {/* ─── Rook ─── */}
        <div className="flex items-center justify-center" style={{ height: 160 }}>
          {didFail ? (
            <RookWrongAnimation
              ref={wrongRookRef}
              style={wrongStyle}
              scale={1.4}
              visibleStages={6}
              compact
            />
          ) : (
            <div
              className={canShare ? 'rook-share-button relative' : 'relative'}
              onClick={canShare ? handleRookShare : undefined}
              role={canShare ? 'button' : undefined}
              tabIndex={canShare ? 0 : undefined}
              onKeyDown={canShare ? (e) => e.key === 'Enter' && handleRookShare() : undefined}
            >
              {canShare && PARTICLES.map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute', bottom: '20%', left: p.left,
                    width: p.size, height: p.size, borderRadius: '50%',
                    backgroundColor: p.color,
                    animation: `${p.anim} ${p.duration} ease-in-out infinite`,
                    animationDelay: p.delay, opacity: 0, pointerEvents: 'none',
                  }}
                />
              ))}
              <RookCelebrationAnimation
                ref={rookRef}
                style={celebrationStyle}
                scale={1.4}
                autoPlay={true}
              />
            </div>
          )}
        </div>

        {/* ─── Content ─── */}
        <div className="mt-4 w-full">
          {/* Share toast */}
          {FEATURE_FLAGS.SHOW_SHARING && canShare && shareFeedbackVisible && (
            <div className="flex justify-center mb-2">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white shadow-lg ${shareFeedbackDismissing ? 'share-toast-exit' : 'share-toast-enter'} ${isPerfect ? 'bg-chess-gold-dark' : 'bg-chess-green-dark'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Link Copied!
              </div>
            </div>
          )}

          {/* Share hint */}
          {FEATURE_FLAGS.SHOW_SHARING && canShare && !shareFeedbackVisible && (
            <div className={`share-hint ${isPerfect ? 'share-hint-gold' : 'share-hint-green'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Tap rook to share
            </div>
          )}

          {/* Score */}
          {hasScore && (
            <div className="text-center mb-3">
              <div
                className="text-4xl font-black mb-1"
                style={{ color: didFail ? 'var(--color-chess-red)' : isPerfect ? '#FFC800' : 'var(--color-chess-green)' }}
              >
                {correctCount}/{totalPuzzles}
              </div>
              {tierLabel && (
                <div className="text-sm uppercase tracking-wider text-chess-text-muted">
                  {tierLabel}
                </div>
              )}
            </div>
          )}

          {/* Title + subtitle (openings) */}
          {title && (
            <h2 className={`text-xl font-bold text-chess-text ${subtitle ? 'mb-1' : 'mb-3'}`}>{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-chess-text-muted mb-3">{subtitle}</p>
          )}

          {/* Quote */}
          <p className="text-sm font-medium italic text-chess-text mb-5">
            &ldquo;{quote}&rdquo;
          </p>

          {/* Ad slot (learn page) */}
          {hasScore && !didFail && (
            <div className="mb-4">
              <AdSlot position="after-lesson" />
            </div>
          )}

          {/* Buttons */}
          {didFail && onRetry ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={onRetry}
                className="w-full py-3 rounded-xl font-bold text-white text-base active:brightness-90 transition-all"
                style={{ backgroundColor: btnColor }}
              >
                Try Again
              </button>
              <button
                onClick={onContinue}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-chess-text-muted border-2 border-slate-200 bg-chess-surface transition-all active:translate-y-[1px] active:bg-slate-50"
              >
                Back to Learn
              </button>
            </div>
          ) : (
            <button
              onClick={isGuest ? () => setShowSignupPrompt(true) : onContinue}
              className="w-full py-3 rounded-xl font-bold text-white text-base active:brightness-90 transition-all"
              style={{ backgroundColor: btnColor }}
            >
              Continue
            </button>
          )}

          {/* Daily ritual */}
          {!isGuest && !didFail && <RookiePopup justCompleted="tactics" />}

          {/* Guest signup prompt (full-screen overlay) */}
          {isGuest && showSignupPrompt && (
            <SignupPrompt onDismiss={() => { setShowSignupPrompt(false); onContinue(); }} />
          )}
        </div>
      </div>
    </div>
  )
}
