'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { playCelebrationSound } from '@/lib/sounds'
import { FEATURE_FLAGS } from '@/lib/config/feature-flags'
import { selectByCategory } from '@/lib/speech/priority-queue'
import { safeRenderText } from '@/lib/speech/sanitize'
import { QUIP_POOL } from '@/lib/quips/quip-pool'
import { useShareOG, type ShareOGConfig } from '@/hooks/useShareOG'
import { ActionButton } from '@/components/ui/ActionButton'
import { InteractiveRook, type InteractiveModeId } from '@/components/ui/InteractiveRook'
import { BreathingRook } from '@/components/ui/BreathingRook'
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips'
import { ShuffleBag } from '@/lib/shuffle-bag'
import { useDailyWorkout, type WorkoutActivity } from '@/hooks/useDailyWorkout'
import { useUser } from '@/hooks/useUser'
import { toneForLevel } from '@/lib/quips/tone'

// ═══════════════════════════════════════════
// ACTIVITY COMPLETE — unified post-activity screen
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

  // Share
  shareConfig?: ShareOGConfig

  // Actions
  onContinue: () => void
  onDismiss?: () => void
  onRetry?: () => void
}

// Map source → workout activity
function toWorkoutActivity(source: ActivitySource): WorkoutActivity {
  if (source === 'play') return 'play'
  if (source === 'daily') return 'daily'
  return 'tactics' // path + opening = learn/tactics
}

// Tap reaction shuffle bags (same as PlayPageRookie)
function createModeBag() {
  return new ShuffleBag(LEARN_TAP_REACTIONS.map(r => r.mode))
}
function createQuipBags() {
  const bags = new Map<InteractiveModeId, ShuffleBag<string>>()
  for (const reaction of LEARN_TAP_REACTIONS) {
    bags.set(reaction.mode, new ShuffleBag(reaction.quips))
  }
  return bags
}

export function ActivityComplete({
  source,
  mode,
  correctCount,
  totalCount = 6,
  outcome,
  activityName,
  playerName,
  accentColor,
  shareConfig,
  onContinue,
  onDismiss,
  onRetry,
}: ActivityCompleteProps) {
  const [entered, setEntered] = useState(false)
  const [tapQuip, setTapQuip] = useState<string | null>(null)
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Interactive rook state
  const modeBagRef = useRef(createModeBag())
  const quipBagsRef = useRef(createQuipBags())
  const [interactiveMode, setInteractiveMode] = useState<InteractiveModeId>(() => modeBagRef.current.draw())
  const quipsUsedRef = useRef(0)
  const quipLockRef = useRef<NodeJS.Timeout | null>(null)

  // ─── Derived state ───
  const hasScore = correctCount !== undefined
  const isPerfect = hasScore && correctCount === totalCount
  const didFail = hasScore && correctCount <= Math.floor(totalCount / 2)
  const isWin = source === 'play' && (outcome === 'win')
  const isLoss = source === 'play' && (outcome === 'loss' || outcome === 'resign')
  const shouldCelebrate = source === 'play' ? isWin : !didFail
  const canShare = !!shareConfig

  // ─── Daily workout ───
  const workoutActivity = toWorkoutActivity(source)
  const { status: workoutStatus } = useDailyWorkout(workoutActivity)
  const { attitudeLevel } = useUser()
  const tone = toneForLevel(attitudeLevel ?? 3)

  // Mark the current activity as done too (it just completed)
  const workoutPlay = workoutStatus.play || workoutActivity === 'play'
  const workoutLearn = workoutStatus.tactics || workoutActivity === 'tactics'
  const workoutDaily = workoutStatus.daily || workoutActivity === 'daily'

  // ─── Transition line ───
  const transitionLine = useMemo(() => {
    const category = source === 'path' || source === 'opening'
      ? 'transition:learn'
      : source === 'play'
        ? 'transition:play'
        : 'transition:daily'
    return selectByCategory(QUIP_POOL, category, undefined, playerName ?? undefined, { tone })?.text ?? null
  }, [source, playerName, tone])

  // ─── Share hook ───
  const { share, feedbackState } = useShareOG(canShare ? shareConfig : undefined)

  // ─── Tap interaction ───
  const handleInteraction = useCallback(() => {
    if (quipsUsedRef.current >= 3) return
    if (quipLockRef.current) return

    const bag = quipBagsRef.current.get(interactiveMode)
    if (!bag) return

    quipsUsedRef.current += 1
    const quip = bag.draw()
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    setTapQuip(quip)
    tapTimerRef.current = setTimeout(() => setTapQuip(null), 4000)

    quipLockRef.current = setTimeout(() => { quipLockRef.current = null }, 4000)
  }, [interactiveMode])

  // Auto-shuffle mode after 20s idle
  useEffect(() => {
    const timer = setTimeout(() => {
      quipsUsedRef.current = 0
      if (quipLockRef.current) { clearTimeout(quipLockRef.current); quipLockRef.current = null }
      setInteractiveMode(modeBagRef.current.draw())
    }, 20000)
    return () => clearTimeout(timer)
  }, [interactiveMode])

  // ─── Confetti + sound ───
  const celebratedRef = useRef(false)
  useEffect(() => {
    if (!shouldCelebrate || celebratedRef.current) return
    celebratedRef.current = true
    const count = isPerfect || isWin ? 100 : (hasScore && correctCount! >= 5) ? 60 : 40
    const colors = isPerfect || isWin
      ? ['#FFC800', '#FFAA00', '#FFFFFF']
      : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF']
    confetti({ particleCount: count, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors, gravity: 1.2, ticks: 200 })
    confetti({ particleCount: count, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors, gravity: 1.2, ticks: 200 })
    if (source !== 'play') playCelebrationSound(correctCount)
  }, [])

  // ─── Entrance ───
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true))
    })
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
      if (quipLockRef.current) clearTimeout(quipLockRef.current)
    }
  }, [])

  const handleContinue = () => {
    onContinue()
  }

  const rawDisplayLine = tapQuip || transitionLine || (shouldCelebrate ? 'Nice.' : 'We\'ll get it next time.')
  const displayLine = safeRenderText(rawDisplayLine, 'ActivityComplete.displayLine')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{
        backgroundColor: entered ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
        transition: 'background-color 0.3s ease',
      }}
      onClick={() => {
        if (mode === 'dismissible') {
          onDismiss?.()
        } else {
          // Terminal (path/openings): backdrop = continue/retry
          if (didFail && onRetry) onRetry()
          else handleContinue()
        }
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm flex flex-col items-center overflow-auto max-h-[95vh] rounded-2xl px-6 pt-6 pb-5 ${
          shouldCelebrate ? 'celebratory-glow' : ''
        }`}
        style={{
          backgroundColor: '#ffffff',
          boxShadow: shouldCelebrate
            ? undefined
            : '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
          opacity: entered ? 1 : 0,
          transform: entered ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          transition: 'opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* ─── Corner buttons (share + dismiss) ─── */}
        <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
          {FEATURE_FLAGS.SHOW_SHARING && canShare && (
            <button
              onClick={share}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all active:scale-90"
              style={{
                color: '#ffffff',
                backgroundColor: feedbackState === 'success' ? 'var(--color-chess-green-dark)' : 'var(--color-chess-green)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {feedbackState === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                )}
              </svg>
            </button>
          )}
          {mode === 'dismissible' && onDismiss && (
            <button
              onClick={onDismiss}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 text-chess-text-muted hover:text-chess-text transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ─── Title + name + result card ─── */}
        <div
          className="w-full rounded-xl px-4 py-2 text-center mt-1"
          style={{ backgroundColor: '#f0f4f8' }}
        >
          <h2 className="text-[15px] font-black text-chess-text leading-tight">
            {didFail
              ? 'Not Quite!'
              : source === 'play'
                ? (isWin ? 'You Win!' : outcome === 'draw' ? 'Draw!' : 'Good Game!')
                : source === 'daily'
                  ? (isPerfect ? 'Perfect Run!' : 'Challenge Complete!')
                  : activityName
                    ? 'Lesson Complete!'
                    : 'Nice Work!'}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs text-chess-text-muted truncate">
              {activityName
                ?? (source === 'play' ? 'Play Rookie'
                  : source === 'daily' ? 'Daily Challenge'
                  : null)}
            </span>
            {hasScore && (
              <>
                <span className="text-chess-text-faint">·</span>
                <span className="text-xs font-bold text-chess-text">
                  {correctCount}/{totalCount}
                </span>
              </>
            )}
            {source === 'play' && outcome && (
              <>
                <span className="text-chess-text-faint">·</span>
                <span className="text-xs font-bold text-chess-text">
                  {isWin ? 'Victory' : outcome === 'draw' ? 'Stalemate' : 'Defeated'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ─── Interactive Rookie ─── */}
        <div className="flex flex-col items-center">
          <div
            onPointerDown={handleInteraction}
            className="relative my-1 flex items-center justify-center overflow-hidden"
            style={{ width: 180, height: 180 }}
          >
            <InteractiveRook mode={interactiveMode} blockSize={24} />
          </div>
        </div>

        {/* ─── Speech bubble ─── */}
        <div className="relative w-full mt-2 mb-4">
          <div
            className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 rounded-[2px]"
            style={{ backgroundColor: '#f0f4f8', boxShadow: '-1px -1px 2px rgba(0,0,0,0.03)' }}
          />
          <div
            className="relative rounded-2xl px-5 py-3 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#f0f4f8', height: 72 }}
          >
            <p
              key={tapQuip || transitionLine}
              className="text-chess-text text-[14px] leading-relaxed font-medium text-center line-clamp-3"
            >
              {displayLine}
            </p>
          </div>
        </div>

        {/* ─── Buttons ─── */}
        <div className="w-full flex flex-col gap-2.5">
          {didFail && onRetry ? (
            <>
              <ActionButton color="green" size="lg" onClick={onRetry} className="w-full">
                Try Again
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton
                color={accentColor ? 'orange' : (isPerfect || isWin ? 'gold' : 'green')}
                size="lg"
                onClick={handleContinue}
                className="w-full"
              >
                Continue
              </ActionButton>

              {mode === 'dismissible' && onDismiss && (
                <ActionButton color={source === 'play' ? 'blue' : source === 'daily' ? 'orange' : 'green'} size="md" onClick={onDismiss} className="w-full">
                  {source === 'play' ? 'Review Game' : 'Review Puzzles'}
                </ActionButton>
              )}
            </>
          )}

          {/* ─── Daily Workout: 3-part button ─── */}
          {/* Completed slots become gold "trophy" cells with a check overlay.
              Incomplete slots keep their original brand color. */}
          {(() => {
            const GOLD_BG = 'linear-gradient(135deg, #FFD43B 0%, #FFAA00 100%)'
            const GOLD_SHADOW = 'inset 0 0 0 1px rgba(255,255,255,0.55), 0 2px 8px rgba(255,170,0,0.35)'
            const CheckBadge = () => (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )
            return (
              <div className="w-full flex rounded-2xl overflow-hidden" style={{ height: 52 }}>
                {/* Play */}
                <Link
                  href="/play"
                  className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all active:brightness-90"
                  style={{
                    background: workoutPlay ? GOLD_BG : '#1CB0F6',
                    boxShadow: workoutPlay ? GOLD_SHADOW : undefined,
                    color: '#ffffff',
                    pointerEvents: workoutPlay ? 'none' : undefined,
                  }}
                >
                  {workoutPlay ? <CheckBadge /> : <span className="scale-75 origin-center"><BreathingRook size="xs" mood="happy" /></span>}
                  Play
                </Link>
                {/* Learn */}
                <Link
                  href="/path"
                  className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all active:brightness-90 border-x-2 border-white/30"
                  style={{
                    background: workoutLearn ? GOLD_BG : '#58CC02',
                    boxShadow: workoutLearn ? GOLD_SHADOW : undefined,
                    color: '#ffffff',
                    pointerEvents: workoutLearn ? 'none' : undefined,
                  }}
                >
                  {workoutLearn ? <CheckBadge /> : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                  Learn
                </Link>
                {/* Run */}
                <Link
                  href="/run"
                  className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all active:brightness-90"
                  style={{
                    background: workoutDaily ? GOLD_BG : '#FF9500',
                    boxShadow: workoutDaily ? GOLD_SHADOW : undefined,
                    color: '#ffffff',
                    pointerEvents: workoutDaily ? 'none' : undefined,
                  }}
                >
                  {workoutDaily ? <CheckBadge /> : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  )}
                  Run
                </Link>
              </div>
            )
          })()}
        </div>
      </div>

    </div>
  )
}
