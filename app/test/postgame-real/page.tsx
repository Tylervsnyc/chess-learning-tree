'use client'

/**
 * Post-game popup, driven by a REAL game.
 *
 * The game and its grades come from data/test/postgame-real-game.ts, baked by
 * `npx tsx scripts/bake-postgame-game.ts --session=<id> --depth=10` — the same
 * analyzeGameMoves + applyBookMoves the app runs, at the same depth 10 that
 * /play uses live. So these are the numbers this game actually produces, not
 * hand-picked ones. Depth 10 because that's what /play evaluates at during
 * play; the popup shows that instant analysis.
 *
 * Replay re-mounts the popup so every animation fires again from scratch.
 */

import { useState } from 'react'
import { ActivityComplete } from '@/components/shared/ActivityComplete'
import { REAL_GAME, REAL_GAME_STATS } from '@/data/test/postgame-real-game'
import { warmupAudio } from '@/lib/sounds'
import type { ChessPathPoint } from '@/lib/elo/chess-path-elo'

/** A plausible rising line so the ELO chart animation can be seen too. */
const DEBUG_ELO: ChessPathPoint[] = [
  { date: '2026-08-27', elo: 1180, active: true },
  { date: '2026-08-28', elo: 1204, active: true },
  { date: '2026-08-29', elo: 1204, active: false },
  { date: '2026-08-30', elo: 1231, active: true },
  { date: '2026-08-31', elo: 1259, active: true },
  { date: '2026-09-01', elo: 1259, active: false },
  { date: '2026-09-02', elo: 1288, active: true },
]

export default function PostgameRealTestPage() {
  const [run, setRun] = useState(0)     // bump = fresh mount = animations replay
  const [open, setOpen] = useState(false)
  const [withStreak, setWithStreak] = useState(false)
  const [withElo, setWithElo] = useState(false)

  const legendary = REAL_GAME.legendary
    .map(m => `${m.san} (ply ${m.moveNumber})`)
    .join(', ')

  const fire = () => {
    warmupAudio()
    setRun(r => r + 1)
    setOpen(true)
  }

  return (
    <div className="h-full overflow-auto bg-chess-page px-5 py-6">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-black text-chess-text">Post-game popup — real game</h1>
        <p className="mt-1 text-sm text-chess-text-muted">
          Your Play Rookie game from {REAL_GAME.playedOn}. Every number below is what this
          game actually grades to.
        </p>

        {/* ─── The game ─── */}
        <div className="mt-5 rounded-2xl bg-chess-surface p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="text-[11px] font-black uppercase tracking-wide text-chess-blue">The game</div>
          <dl className="mt-2 space-y-1.5 text-sm">
            <Row k="Result" v={`Win by ${REAL_GAME.resultMethod} · you were ${REAL_GAME.playerColor}`} />
            <Row k="Opening" v={REAL_GAME.openingMoves.slice(0, 6).join(' ')} />
            <Row k="Length" v={`${REAL_GAME.totalMoves} moves · Rookie level ${REAL_GAME.rookieDifficulty}`} />
            <Row k="Accuracy" v={`${REAL_GAME.accuracy}%`} />
            <Row k="Legendary" v={legendary || '—'} />
          </dl>
          <p className="mt-3 text-[11px] leading-relaxed text-chess-text-faint">
            Graded at Stockfish depth {REAL_GAME.depth} — the depth /play evaluates at during
            the game, so this matches the popup you&apos;d have seen.
          </p>
        </div>

        {/* ─── Which animations to include ─── */}
        <div className="mt-4 flex flex-col gap-2">
          <Toggle
            on={withStreak}
            onChange={setWithStreak}
            label="Streak window first"
            hint="The campfire celebration that plays before the popup when the streak extends"
          />
          <Toggle
            on={withElo}
            onChange={setWithElo}
            label="Chess Path ELO chart"
            hint="The rising rating line that draws itself in above the buttons"
          />
        </div>

        <button
          onClick={fire}
          className="mt-4 w-full rounded-2xl py-4 text-base font-black text-white transition-all active:translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#58CC02 0%,#46A302 100%)', boxShadow: '0 4px 0 #3A8500' }}
        >
          {run === 0 ? 'Show the popup' : 'Replay animations'}
        </button>
        {run > 0 && (
          <p className="mt-2 text-center text-[11px] text-chess-text-faint">
            Replayed {run}× — each press re-mounts it, so the entrance, confetti and
            sounds all fire fresh.
          </p>
        )}
      </div>

      {open && (
        <ActivityComplete
          key={run}
          source="play"
          mode="dismissible"
          outcome={REAL_GAME.outcome}
          moveStats={REAL_GAME_STATS}
          playerName="Tyler"
          debugStreak={withStreak ? 7 : undefined}
          debugEloPoints={withElo ? DEBUG_ELO : undefined}
          shareConfig={{
            shareUrl: 'https://chesspath.app/play',
            ogEndpoint: '/api/og/workout',
            ogParams: { streak: '7', kind: 'game', outcome: 'win', result: 'Checkmate' },
            source: 'play',
            title: 'Play Rookie | Chess Path',
            text: 'I beat Rookie on Chess Path!',
          }}
          onContinue={() => { setOpen(false); console.log('[test] Continue') }}
          onDismiss={() => { setOpen(false); console.log('[test] Review Game') }}
        />
      )}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-xs font-bold text-chess-text-muted">{k}</dt>
      <dd className="min-w-0 font-medium text-chess-text">{v}</dd>
    </div>
  )
}

function Toggle({
  on, onChange, label, hint,
}: { on: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex w-full items-start gap-3 rounded-xl bg-chess-surface px-4 py-3 text-left transition-colors hover:bg-slate-50"
    >
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors"
        style={{ backgroundColor: on ? '#58CC02' : '#e2e8f0' }}
      >
        {on && (
          <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-chess-text">{label}</span>
        <span className="block text-[11px] leading-snug text-chess-text-muted">{hint}</span>
      </span>
    </button>
  )
}
