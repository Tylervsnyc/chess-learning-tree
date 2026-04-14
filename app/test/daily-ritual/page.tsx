'use client';

import { useState } from 'react';
import { ActivityComplete, type ActivitySource } from '@/components/shared/ActivityComplete';

export default function DailyRitualTestPage() {
  const [active, setActive] = useState<ActivitySource | null>(null);

  return (
    <div className="min-h-full bg-chess-page overflow-auto p-4">
      <div className="max-w-sm mx-auto space-y-4">
        <h1 className="text-lg font-bold text-chess-text">Transition Screen Preview</h1>
        <p className="text-sm text-chess-text-muted">Replaced by /test/activity-complete — this page is a simplified shortcut.</p>

        <div className="flex flex-col gap-2">
          <button onClick={() => setActive('path')} className="py-3 px-4 rounded-xl bg-chess-surface border border-slate-200 font-medium text-chess-text">
            Path (5/6 pass)
          </button>
          <button onClick={() => setActive('daily')} className="py-3 px-4 rounded-xl bg-chess-surface border border-slate-200 font-medium text-chess-text">
            Daily (18/22)
          </button>
          <button onClick={() => setActive('play')} className="py-3 px-4 rounded-xl bg-chess-surface border border-slate-200 font-medium text-chess-text">
            Play (win)
          </button>
        </div>
      </div>

      {active === 'path' && (
        <ActivityComplete source="path" mode="terminal" correctCount={5} totalCount={6} playerName="Tyler" onContinue={() => setActive(null)} />
      )}
      {active === 'daily' && (
        <ActivityComplete source="daily" mode="dismissible" correctCount={18} totalCount={22} playerName="Tyler" onContinue={() => setActive(null)} onDismiss={() => setActive(null)} />
      )}
      {active === 'play' && (
        <ActivityComplete source="play" mode="dismissible" outcome="win" playerName="Tyler" onContinue={() => setActive(null)} onDismiss={() => setActive(null)} />
      )}
    </div>
  );
}
