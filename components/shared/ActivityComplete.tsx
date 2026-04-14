'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { getTierLabel } from '@/data/celebration-quotes'
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
import { FEATURE_FLAGS } from '@/lib/config/feature-flags'
import { selectByCategory } from '@/lib/speech/priority-queue'
import { TOUCHPOINT_LINES } from '@/lib/speech/rookie-touchpoints'
import { useShareOG, type ShareOGConfig } from '@/hooks/useShareOG'
import { SignupPrompt } from '@/components/onboarding/SignupPrompt'
import { ActionButton } from '@/components/ui/ActionButton'
import Link from 'next/link'

// ═══════════════════════════════════════════
// ACTIVITY COMPLETE — unified post-activity screen
// Replaces LessonComplete + RookiePopup
// ═══════════════════════════════════════════

export type ActivitySource = 'play' | 'daily' | 'path' | 'opening'

export interface ActivityCompleteProps {
  source: ActivitySource
  mode: 'dismissible' | 'terminal'

  // Score (path/daily)
  correctCount?: number
  totalCount?: number

  // Outcome (play)
  outcome?: 'win' | 'loss' | 'draw' | 'resign'

  // Context
  activityName?: string
  playerName?: string
  accentColor?: string
  isGuest?: boolean

  // Share
  shareConfig?: ShareOGConfig

  // Actions
  onContinue: () => void
  onDismiss?: () => void
  onRetry?: () => void
}

const PARTICLES = [
  { left: '30%', size: 7, color: '#58CC02', delay: '0s', anim: 'floatUp0', duration: '4.2s' },
  { left: '55%', size: 6, color: '#FFC800', delay: '0.6s', anim: 'floatUp1', duration: '4.8s' },
  { left: '70%', size: 7, color: '#1CB0F6', delay: '1.2s', anim: 'floatUp2', duration: '4s' },
  { left: '40%', size: 6, color: '#58CC02', delay: '1.8s', anim: 'floatUp0', duration: '4.5s' },
  { left: '60%', size: 6, color: '#FFC800', delay: '0.3s', anim: 'floatUp1', duration: '4.3s' },
  { left: '25%', size: 6, color: '#1CB0F6', delay: '1.5s', anim: 'floatUp2', duration: '5s' },
]

export function ActivityComplete({
  source,
  mode,
  correctCount,
  totalCount = 6,
  outcome,
  activityName,
  playerName,
  accentColor,
  isGuest = false,
  shareConfig,
  onContinue,
  onDismiss,
  onRetry,
}: ActivityCompleteProps) {
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [entered, setEntered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const rookRef = useRef<RookCelebrationAnimationRef>(null)
  const wrongRookRef = useRef<RookWrongAnimationRef>(null)

  // ─── Derived state ───
  const hasScore = correctCount !== undefined
  const isPerfect = hasScore && correctCount === totalCount
  const didFail = hasScore && correctCount <= Math.floor(totalCount / 2)
  const isWin = source === 'play' && (outcome === 'win')
  const isLoss = source === 'play' && (outcome === 'loss' || outcome === 'resign')
  const shouldCelebrate = source === 'play' ? isWin : !didFail
  const canShare = shareConfig && shouldCelebrate

  const tierLabel = hasScore
    ? (didFail ? 'Not Quite' : getTierLabel(correctCount!, totalCount))
    : undefined

  // ─── Transition line (Rookie's "what's next" suggestion) ───
  const transitionLine = useMemo(() => {
    const category = source === 'path' || source === 'opening'
      ? 'transition:learn'
      : source === 'play'
        ? 'transition:play'
        : 'transition:daily'
    return selectByCategory(TOUCHPOINT_LINES, category, undefined, playerName ?? undefined)?.text ?? null
  }, [source, playerName])

  // ─── Animation styles ───
  const celebrationStyle: CelebrationAnimationStyle = useMemo(() => {
    const styles: CelebrationAnimationStyle[] = ['sparkleBurst', 'wave', 'radiate', 'ripple', 'cascade', 'bloom']
    return styles[Math.floor(Math.random() * styles.length)]
  }, [])

  const wrongStyle: WrongAnimationStyle = useMemo(() => {
    const styles: WrongAnimationStyle[] = ['powerDown', 'shortCircuit', 'pixelFade', 'shrink', 'signalLoss']
    return styles[Math.floor(Math.random() * styles.length)]
  }, [])

  // ─── Share hook ───
  const { share, feedbackState } = useShareOG(canShare ? shareConfig : undefined)

  // ─── Confetti + sound ───
  useEffect(() => {
    if (!shouldCelebrate) return
    const count = isPerfect || isWin ? 100 : (hasScore && correctCount! >= 5) ? 60 : 40
    const colors = isPerfect || isWin
      ? ['#FFC800', '#FFAA00', '#FFFFFF']
      : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF']
    confetti({ particleCount: count, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors, gravity: 1.2, ticks: 200 })
    confetti({ particleCount: count, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors, gravity: 1.2, ticks: 200 })
    if (source !== 'play') playCelebrationSound(correctCount)
  }, [])

  // ─── Wrong rook animation ───
  useEffect(() => {
    if (shouldCelebrate) return
    wrongRookRef.current?.showFull()
    const timer = setTimeout(() => wrongRookRef.current?.triggerAnimation(), 600)
    return () => clearTimeout(timer)
  }, [])

  // ─── Entrance animation ───
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true))
    })
  }, [])

  const handleContinue = () => {
    if (isGuest) {
      setShowSignupPrompt(true)
    } else {
      onContinue()
    }
  }

  // Pick button color for ActionButton
  const primaryButtonColor = accentColor
    ? undefined // fall back to inline style for custom accent
    : shouldCelebrate
      ? (isPerfect || isWin ? 'gold' : 'green')
      : 'green'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{
        backgroundColor: entered ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Card */}
      <div
        ref={cardRef}
        className={`relative w-full max-w-sm text-center flex flex-col items-center overflow-auto max-h-[90vh] rounded-2xl px-6 pt-8 pb-6 ${
          shouldCelebrate ? 'celebratory-glow' : ''
        }`}
        style={{
          backgroundColor: '#ffffff',
          boxShadow: shouldCelebrate
            ? undefined // celebratory-glow handles it
            : '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
          opacity: entered ? 1 : 0,
          transform: entered ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          transition: 'opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* ─── Dismiss X (dismissible mode) ─── */}
        {mode === 'dismissible' && onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-chess-text-muted hover:text-chess-text transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* ─── Rook animation ─── */}
        <div className="flex items-center justify-center mb-2" style={{ height: 160 }}>
          {!shouldCelebrate ? (
            <RookWrongAnimation
              ref={wrongRookRef}
              style={wrongStyle}
              scale={1.4}
              visibleStages={6}
              compact
            />
          ) : (
            <div
              className={canShare ? 'rook-share-button relative cursor-pointer' : 'relative'}
              onClick={canShare ? share : undefined}
              role={canShare ? 'button' : undefined}
              tabIndex={canShare ? 0 : undefined}
              onKeyDown={canShare ? (e) => e.key === 'Enter' && share() : undefined}
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

        {/* ─── Share button ─── */}
        {FEATURE_FLAGS.SHOW_SHARING && canShare && (
          <button
            onClick={share}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 mb-1"
            style={{
              color: feedbackState === 'success'
                ? '#ffffff'
                : isPerfect || isWin ? '#d4a800' : 'var(--color-chess-green-dark)',
              backgroundColor: feedbackState === 'success'
                ? (isPerfect || isWin ? 'var(--color-chess-gold-dark)' : 'var(--color-chess-green-dark)')
                : (isPerfect || isWin ? 'rgba(255,200,0,0.12)' : 'rgba(88,204,2,0.12)'),
            }}
          >
            {feedbackState === 'success' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Shared!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </>
            )}
          </button>
        )}

        {/* ─── Score display (path/daily) ─── */}
        {hasScore && (
          <div className="mb-3 mt-2">
            <div
              className="text-5xl font-black tracking-tight"
              style={{ color: didFail ? 'var(--color-chess-red)' : isPerfect ? '#FFC800' : 'var(--color-chess-green)' }}
            >
              {correctCount}<span className="text-2xl font-bold opacity-40">/{totalCount}</span>
            </div>
            {tierLabel && (
              <div
                className="text-sm font-black uppercase tracking-widest mt-1"
                style={{ color: didFail ? 'var(--color-chess-red)' : isPerfect ? '#d4a800' : 'var(--color-chess-green-dark)' }}
              >
                {tierLabel}
              </div>
            )}
          </div>
        )}

        {/* ─── Play outcome headline ─── */}
        {source === 'play' && outcome && !hasScore && (
          <div className="mb-3 mt-2">
            <div
              className="text-3xl font-black tracking-tight"
              style={{ color: isWin ? 'var(--color-chess-green)' : isLoss ? 'var(--color-chess-red)' : 'var(--color-chess-orange)' }}
            >
              {outcome === 'win' ? 'You Win!' : outcome === 'loss' ? 'Good Game' : outcome === 'draw' ? 'Draw!' : 'Good Game'}
            </div>
          </div>
        )}

        {/* ─── Opening title ─── */}
        {!hasScore && !outcome && activityName && (
          <div className="mb-3 mt-2">
            <h2 className="text-xl font-black text-chess-text">Lesson Complete!</h2>
            <p className="text-sm text-chess-text-muted mt-1">{activityName}</p>
          </div>
        )}

        {/* ─── Rookie's transition line ─── */}
        {transitionLine && (
          <p className="text-[13px] leading-relaxed font-medium italic text-chess-text-muted mb-5 px-2">
            &ldquo;{transitionLine}&rdquo;
          </p>
        )}

        {/* ─── Buttons ─── */}
        <div className="w-full flex flex-col gap-2.5">
          {didFail && onRetry ? (
            <>
              <ActionButton color="green" size="lg" onClick={onRetry} className="w-full">
                Try Again
              </ActionButton>
              <ActionButton color="white" size="md" onClick={onContinue} className="w-full">
                Back to Learn
              </ActionButton>
            </>
          ) : (
            <>
              {accentColor ? (
                <button
                  onClick={handleContinue}
                  className="w-full py-3.5 rounded-2xl font-bold text-white text-base transition-all active:translate-y-[2px]"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 4px 0 color-mix(in srgb, ${accentColor} 80%, black)`,
                  }}
                >
                  Continue
                </button>
              ) : (
                <ActionButton
                  color={primaryButtonColor as 'green' | 'gold'}
                  size="lg"
                  onClick={handleContinue}
                  className="w-full"
                >
                  Continue
                </ActionButton>
              )}
              {mode === 'dismissible' && onDismiss && (
                <ActionButton color="white" size="md" onClick={onDismiss} className="w-full">
                  {source === 'play' ? 'Review Game' : 'Review Puzzles'}
                </ActionButton>
              )}
            </>
          )}

          {/* Play Rookie link (non-play sources only) */}
          {source !== 'play' && shouldCelebrate && (
            <Link
              href="/play"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-chess-blue hover:text-chess-blue-dark transition-colors pt-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Play Rookie
            </Link>
          )}
        </div>
      </div>

      {/* ─── Guest signup prompt ─── */}
      {isGuest && showSignupPrompt && (
        <SignupPrompt
          source="lesson_complete"
          onDismiss={() => { setShowSignupPrompt(false); onContinue(); }}
        />
      )}
    </div>
  )
}
