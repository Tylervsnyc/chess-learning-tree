'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { fireConfetti } from '@/lib/confetti'
import { playCelebrationSound } from '@/lib/sounds'
import { FEATURE_FLAGS } from '@/lib/config/feature-flags'
import { selectByCategory } from '@/lib/speech/priority-queue'
import { safeRenderText } from '@/lib/speech/sanitize'
import { getQuipPool } from '@/lib/quips/load-quip-pool'
import { useShareOG, type ShareOGConfig } from '@/hooks/useShareOG'
import { ActionButton } from '@/components/ui/ActionButton'
import { InteractiveRook, type InteractiveModeId } from '@/components/ui/InteractiveRook'
import { BreathingRook } from '@/components/ui/BreathingRook'
import { LEARN_TAP_REACTIONS } from '@/data/quips/learn-tap-quips'
import { ShuffleBag } from '@/lib/shuffle-bag'
import { useDailyWorkout, type WorkoutActivity } from '@/hooks/useDailyWorkout'
import { getStreak } from '@/lib/streak-client'
import { useUser } from '@/hooks/useUser'
import { toneForLevel } from '@/lib/quips/tone'
import { StreakComplete } from '@/components/shared/StreakComplete'
import { DailyWorkoutCelebration } from '@/components/shared/DailyWorkoutCelebration'
import { FirstRatingReveal } from '@/components/shared/FirstRatingReveal'
import { shareWorkoutStreak } from '@/lib/daily-workout/share'
import { EloEvents } from '@/lib/analytics/posthog'
import { ChessPathEloGraph } from '@/components/profile/ChessPathEloGraph'
import { chessPathEloSeries, chessPathToday, chessPathSessionSeries, chessPathSession, type ChessPathPoint } from '@/lib/elo/chess-path-elo'

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

  /** Test-only: inject a Chess Path ELO series instead of fetching the live one. */
  debugEloPoints?: ChessPathPoint[]
  /** Test-only: force the streak pre-step to celebrate this streak number. */
  debugStreak?: number
  /** Test-only: render the logged-out (anon) signup-teaser layout. */
  debugAnon?: boolean
  /** Test-only: force the first-rating ceremony for new users. */
  debugFirstReveal?: boolean
}

// Map source → workout activity. 'daily' (Rookie's Run) is no longer a
// workout pillar, so it doesn't count toward either Play or Learn.
function toWorkoutActivity(source: ActivitySource): WorkoutActivity | undefined {
  if (source === 'play') return 'play'
  if (source === 'daily') return undefined
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
  debugEloPoints,
  debugStreak,
  debugAnon,
  debugFirstReveal,
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
  const { attitudeLevel, user, loading: userLoading } = useUser()
  const tone = toneForLevel(attitudeLevel ?? 3)

  // ─── Chess Path ELO (CHE-370, CHE-385) ───
  // One source of truth: the headline number is the API's `current` — the same
  // value the profile shows — and the graph plots the honest day-by-day series
  // across the whole journey (real movement, dips included, never a ratchet).
  const [eloPoints, setEloPoints] = useState<ChessPathPoint[] | null>(null)
  const [eloCurrent, setEloCurrent] = useState<number | null>(null)
  const [eloLoaded, setEloLoaded] = useState(false)
  // Intent: as soon as we know we'll try the chart, commit to that layout (drop
  // Rookie, reserve space) so the popup doesn't flicker when data lands.
  const chartIntent = !didFail && !debugAnon && (!!debugEloPoints || (FEATURE_FLAGS.CHESS_PATH_ELO && !!user))
  useEffect(() => {
    if (!chartIntent) return
    if (debugEloPoints) {
      setEloPoints(debugEloPoints.length >= 2 ? debugEloPoints : [])
      setEloLoaded(true)
      return
    }
    let cancelled = false
    fetch('/api/profile/elo')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return
        const pts = data?.series ? chessPathEloSeries(data.series) : []
        setEloPoints(pts.length >= 2 ? pts : [])
        setEloCurrent(typeof data?.current === 'number' ? data.current : null)
        setEloLoaded(true)
      })
      .catch(() => { if (!cancelled) { setEloPoints([]); setEloLoaded(true) } })
    return () => { cancelled = true }
  }, [chartIntent, debugEloPoints])
  const hasChart = chartIntent && !!eloPoints && eloPoints.length >= 2
  const eloToday = hasChart ? chessPathToday(eloPoints!) : null
  const chartLoading = chartIntent && !eloLoaded

  // ─── Logged-out signup teaser (CHE-370): within-session climb ───
  // A first-session visitor only has "today", so we plot the per-puzzle climb
  // from their local attempts and pitch "Sign up to save your rating."
  const isAnon = !userLoading && !user
  const [sessionPoints, setSessionPoints] = useState<ChessPathPoint[] | null>(null)
  const [revealedBefore, setRevealedBefore] = useState(true) // assume seen until localStorage says otherwise (avoid ceremony flash)
  useEffect(() => {
    if (didFail) return
    if ((debugAnon || debugFirstReveal) && debugEloPoints) {
      setSessionPoints(debugEloPoints)
      setRevealedBefore(!debugFirstReveal)
      return
    }
    if (!FEATURE_FLAGS.CHESS_PATH_ELO || !isAnon) return
    try {
      setRevealedBefore(localStorage.getItem('cp_elo_revealed') === '1')
      const raw = localStorage.getItem('chess-learning-progress')
      if (!raw) return
      const attempts = (JSON.parse(raw)?.puzzleAttempts ?? []) as Array<{ rating?: number; correct: boolean; timestamp: number }>
      const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)
      const todays = attempts.filter((a) => a.timestamp >= startOfToday.getTime())
      const pts = chessPathSessionSeries(todays)
      if (pts.length >= 2) setSessionPoints(pts)
    } catch { /* ignore */ }
  }, [isAnon, didFail, debugAnon, debugFirstReveal, debugEloPoints])
  const anonRating = sessionPoints && sessionPoints.length >= 2 ? chessPathSession(sessionPoints).current : null
  // First time a new (logged-out) user earns a rating → the ceremony.
  const firstReveal = !didFail && (!!debugFirstReveal || (isAnon && anonRating != null && !revealedBefore))
  // Returning logged-out user → the quieter within-session climb.
  const anonChart = !firstReveal && !didFail && !!sessionPoints && sessionPoints.length >= 2 && (isAnon || !!debugAnon)
  const sessionNow = anonChart ? chessPathSession(sessionPoints!) : null
  // Remember we showed the ceremony so next time they get the within-session view.
  useEffect(() => {
    if (firstReveal && !debugFirstReveal) {
      try { localStorage.setItem('cp_elo_revealed', '1') } catch { /* ignore */ }
    }
  }, [firstReveal, debugFirstReveal])
  const signupHref = `/auth/signup?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`

  // Rookie shows unless we're committing to (or loading) a chart. If the
  // logged-in chart turns out empty, we fall back to Rookie.
  const showRookie = (!chartIntent && !anonChart) || (chartIntent && eloLoaded && !hasChart && !anonChart)

  // Mark the current activity as done too (it just completed)
  const workoutPlay = workoutStatus.play || workoutActivity === 'play'
  const workoutLearn = workoutStatus.tactics || workoutActivity === 'tactics'

  // ─── Transition line ───
  // Pool loads on demand (CHE-373) — the line fills in once the chunk arrives.
  const [transitionLine, setTransitionLine] = useState<string | null>(null)
  useEffect(() => {
    const category = source === 'path' || source === 'opening'
      ? 'transition:learn'
      : source === 'play'
        ? 'transition:play'
        : 'transition:daily'
    let cancelled = false
    getQuipPool()
      .then((pool) => {
        if (cancelled) return
        setTransitionLine(selectByCategory(pool, category, undefined, playerName ?? undefined, { tone })?.text ?? null)
      })
      .catch(() => { if (!cancelled) setTransitionLine(null) })
    return () => { cancelled = true }
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

  // ─── Streak pre-step (CHE-370): the streak window plays BEFORE this popup ───
  // On a finished unit we atomically claim the day; if this is the first finish
  // today (streak just extended) we celebrate it first, then reveal the popup.
  // The claim is atomic + idempotent, so the DailyWorkoutWatcher backstop can't
  // double-fire.
  type StreakPhase = 'await' | 'celebrate' | 'main'
  const [streakPhase, setStreakPhase] = useState<StreakPhase>(
    debugStreak != null ? 'celebrate' : 'await',
  )
  const [streakNum, setStreakNum] = useState<number>(debugStreak ?? 0)
  const streakRanRef = useRef(false)
  useEffect(() => {
    if (streakRanRef.current) return
    streakRanRef.current = true
    if (debugStreak != null) return // already 'celebrate'
    if (didFail || !user) { setStreakPhase('main'); return } // no streak on fail / logged out

    let cancelled = false
    const tz = typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      : 'UTC'
    // fresh: this poll exists to catch the just-landed completion write — a
    // cached read would miss it. The result updates the shared streak cache,
    // so the badge/watcher see the new streak without their own scan.
    const fetchStreak = async () => getStreak({ fresh: true })
    const claim = async (streak: number) => {
      try {
        const r = await fetch(`/api/workout/celebrate?tz=${encodeURIComponent(tz)}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ streak }),
        })
        if (!r.ok) return false
        return !!(await r.json()).claimed
      } catch { return false }
    }
    const run = async () => {
      // Bounded poll for the completion write to land (~0, 700, 1400ms).
      for (let i = 0; i < 3 && !cancelled; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 700))
        const data = await fetchStreak()
        if (cancelled) return
        if (data?.completedToday) {
          const claimed = await claim(data.current)
          if (cancelled) return
          if (claimed) { setStreakNum(data.current); setStreakPhase('celebrate') }
          else setStreakPhase('main') // already claimed elsewhere → don't double-celebrate
          return
        }
      }
      if (!cancelled) setStreakPhase('main')
    }
    run()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── PostHog: fire once when the ELO surface actually shows (per mode) ───
  const eloTrackedRef = useRef(false)
  useEffect(() => {
    if (eloTrackedRef.current || streakPhase !== 'main') return
    if (firstReveal && anonRating != null) {
      eloTrackedRef.current = true
      EloEvents.revealed('first_reveal', { rating: anonRating })
    } else if (anonChart && sessionNow) {
      eloTrackedRef.current = true
      EloEvents.revealed('session', { rating: sessionNow.current, gained: sessionNow.gained })
    } else if (hasChart && eloToday) {
      eloTrackedRef.current = true
      EloEvents.revealed('daily', { rating: eloToday.current, gained: eloToday.gainedToday })
    }
  }, [streakPhase, firstReveal, anonChart, hasChart, anonRating, sessionNow, eloToday])

  // ─── Confetti + sound (fires when the popup itself appears) ───
  const celebratedRef = useRef(false)
  useEffect(() => {
    if (streakPhase !== 'main' || !shouldCelebrate || celebratedRef.current) return
    celebratedRef.current = true
    const count = isPerfect || isWin ? 100 : (hasScore && correctCount! >= 5) ? 60 : 40
    const colors = isPerfect || isWin
      ? ['#FFC800', '#FFAA00', '#FFFFFF']
      : ['#58CC02', '#1CB0F6', '#FF9600', '#FFFFFF']
    fireConfetti({ particleCount: count, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors, gravity: 1.2, ticks: 200 })
    fireConfetti({ particleCount: count, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors, gravity: 1.2, ticks: 200 })
    if (source !== 'play') playCelebrationSound(correctCount)
  }, [streakPhase])

  // ─── Entrance (when the popup itself appears, i.e. after any streak step) ───
  useEffect(() => {
    if (streakPhase !== 'main') return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true))
    })
  }, [streakPhase])

  // Timer cleanup on unmount
  useEffect(() => () => {
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    if (quipLockRef.current) clearTimeout(quipLockRef.current)
  }, [])

  const handleContinue = () => {
    onContinue()
  }

  const rawDisplayLine = tapQuip || transitionLine || (shouldCelebrate ? 'Nice.' : 'We\'ll get it next time.')
  const displayLine = safeRenderText(rawDisplayLine, 'ActivityComplete.displayLine')

  return (
    <>
    {/* Streak window plays first when the streak just extended */}
    <DailyWorkoutCelebration
      streak={streakNum}
      open={streakPhase === 'celebrate'}
      onClose={() => setStreakPhase('main')}
      onShare={() => shareWorkoutStreak(streakNum)}
    />
    {/* First-rating ceremony for brand-new logged-out users */}
    {streakPhase === 'main' && firstReveal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <FirstRatingReveal rating={anonRating ?? 0} signupHref={signupHref} onKeepPlaying={handleContinue} />
      </div>
    )}
    {streakPhase === 'main' && !firstReveal && (
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
          className="w-full rounded-xl px-4 py-2 mt-1 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#f0f4f8' }}
        >
          {/* Little Rookie, inline — only in the chart-hero layout (no big rook) */}
          {(chartIntent || anonChart) && (
            <span className="shrink-0 -my-1">
              <BreathingRook size="xs" mood="happy" animate />
            </span>
          )}
          <div className="text-center min-w-0">
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
        </div>

        {/* ─── Interactive Rookie (hidden when the ELO chart is the hero) ─── */}
        {showRookie && (
          <div className="flex flex-col items-center">
            <div
              onPointerDown={handleInteraction}
              className="relative my-1 flex items-center justify-center overflow-hidden"
              style={{ width: 180, height: 180 }}
            >
              <InteractiveRook mode={interactiveMode} blockSize={24} />
            </div>
          </div>
        )}

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

        {/* ─── Chess Path ELO — the rising "days of effort" line (CHE-370) ─── */}
        {chartIntent && chartLoading && (
          <div className="w-full mb-4 rounded-2xl border border-chess-blue/15 bg-gradient-to-b from-chess-blue/[0.06] to-white p-3">
            <div className="h-3 w-24 animate-pulse rounded bg-chess-blue/15" />
            <div className="mt-2 h-7 w-20 animate-pulse rounded bg-chess-blue/15" />
            <div className="mt-2 h-24 w-full animate-pulse rounded-lg bg-chess-blue/10" />
          </div>
        )}
        {hasChart && eloToday && (
          <div className="w-full mb-4 rounded-2xl border border-chess-blue/15 bg-gradient-to-b from-chess-blue/[0.06] to-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wide text-chess-blue">
                Chess Path ELO
              </span>
              {eloToday.gainedToday > 0 && (
                <span className="text-sm font-black text-emerald-500">+{eloToday.gainedToday} today</span>
              )}
            </div>
            <div className="mt-0.5 text-3xl font-black tabular-nums leading-none text-chess-text">
              {(eloCurrent ?? eloToday.current).toLocaleString()}
            </div>
            <div className="mt-2">
              <ChessPathEloGraph points={eloPoints!} heightClass="h-24" />
            </div>
          </div>
        )}

        {/* ─── Chess Path ELO — within-session climb for logged-out users ─── */}
        {anonChart && sessionNow && (
          <div className="w-full mb-4 rounded-2xl border border-chess-blue/15 bg-gradient-to-b from-chess-blue/[0.06] to-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wide text-chess-blue">
                Chess Path ELO
              </span>
              {sessionNow.gained > 0 && (
                <span className="text-sm font-black text-emerald-500">+{sessionNow.gained} this session</span>
              )}
            </div>
            <div className="mt-0.5 text-3xl font-black tabular-nums leading-none text-chess-text">
              {sessionNow.current.toLocaleString()}
            </div>
            <div className="mt-2">
              <ChessPathEloGraph points={sessionPoints!} heightClass="h-24" todayLabel="Now" />
            </div>
          </div>
        )}

        {/* ─── Daily streak (folded in — replaces the separate modal). Compact
            (one-line chip) when the ELO chart is the hero — still claims. ─── */}
        {FEATURE_FLAGS.STREAK_ON_COMPLETE && !didFail && (
          <div className="w-full mb-4">
            <StreakComplete compact={chartIntent} />
          </div>
        )}

        {/* ─── Buttons ─── */}
        <div className="w-full flex flex-col gap-2.5">
          {anonChart ? (
            <>
              {/* Soft signup capture — never trap them, but pitch saving the rating */}
              <Link
                href={signupHref}
                onClick={() => EloEvents.signupClicked('session', sessionNow?.current)}
                className="w-full rounded-2xl py-4 text-center text-base font-black text-white transition-all active:translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,#FFD43B 0%,#FFAA00 100%)', boxShadow: '0 4px 0 #B8860B' }}
              >
                Save your rating — Sign up
              </Link>
              <button onClick={() => { EloEvents.keepPlaying('session'); handleContinue() }} className="w-full py-2 text-sm font-bold text-chess-text-muted">
                Keep playing
              </button>
            </>
          ) : (
          <>
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

          {/* ─── Daily Workout: 2-part button ─── */}
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
                  className="flex-1 min-w-0 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all active:brightness-90"
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
                  className="flex-1 min-w-0 flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all active:brightness-90 border-l-2 border-white"
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
              </div>
            )
          })()}
          </>
          )}
        </div>
      </div>

    </div>
    )}
    </>
  )
}
