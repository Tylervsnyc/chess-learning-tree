'use client'

import { useState } from 'react'
import { ActivityComplete, type ActivitySource } from '@/components/shared/ActivityComplete'
import { warmupAudio } from '@/lib/sounds'

type Scenario = {
  label: string
  source: ActivitySource
  mode: 'dismissible' | 'terminal'
  correctCount?: number
  totalCount?: number
  outcome?: 'win' | 'loss' | 'draw' | 'resign'
  activityName?: string
  accentColor?: string
}

const SCENARIOS: Scenario[] = [
  { label: 'Path - Perfect (6/6)', source: 'path', mode: 'terminal', correctCount: 6, totalCount: 6 },
  { label: 'Path - Great (5/6)', source: 'path', mode: 'terminal', correctCount: 5, totalCount: 6 },
  { label: 'Path - Fail (2/6)', source: 'path', mode: 'terminal', correctCount: 2, totalCount: 6 },
  { label: 'Opening - Complete', source: 'opening', mode: 'terminal', activityName: 'The Italian Game: Main Ideas', accentColor: '#FF9600' },
  { label: 'Daily - Good (18/22)', source: 'daily', mode: 'dismissible', correctCount: 18, totalCount: 22 },
  { label: 'Daily - Perfect (22/22)', source: 'daily', mode: 'dismissible', correctCount: 22, totalCount: 22 },
  { label: 'Play - Win', source: 'play', mode: 'dismissible', outcome: 'win' },
  { label: 'Play - Loss', source: 'play', mode: 'dismissible', outcome: 'loss' },
  { label: 'Play - Draw', source: 'play', mode: 'dismissible', outcome: 'draw' },
]

export default function ActivityCompleteTestPage() {
  const [active, setActive] = useState<Scenario | null>(null)

  return (
    <div className="min-h-screen bg-chess-page p-6 overflow-auto">
      <h1 className="text-2xl font-bold text-chess-text mb-6">ActivityComplete Test</h1>
      <div className="flex flex-col gap-3 max-w-sm">
        {SCENARIOS.map((s) => (
          <button
            key={s.label}
            onClick={() => { warmupAudio(); setActive(s) }}
            className="w-full py-3 px-4 rounded-xl bg-chess-surface border border-slate-200 text-left font-medium text-chess-text hover:bg-slate-50 transition-colors"
          >
            {s.label}
            <span className="text-xs text-chess-text-muted ml-2">({s.mode})</span>
          </button>
        ))}
      </div>

      {active && (
        <ActivityComplete
          source={active.source}
          mode={active.mode}
          correctCount={active.correctCount}
          totalCount={active.totalCount}
          outcome={active.outcome}
          activityName={active.activityName}
          accentColor={active.accentColor}
          playerName="Tyler"
          onContinue={() => { setActive(null); alert('Continue clicked') }}
          onDismiss={active.mode === 'dismissible' ? () => { setActive(null); alert('Dismissed — would show review') } : undefined}
          onRetry={active.correctCount !== undefined && active.correctCount <= 3 ? () => { setActive(null); alert('Retry clicked') } : undefined}
        />
      )}
    </div>
  )
}
