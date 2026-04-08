'use client';

import { useState } from 'react';
import { RookiePopup } from '@/components/shared/DailyRitual';

type Activity = 'play' | 'tactics' | 'daily';

const SAMPLE_LINES: Record<Activity, string[]> = {
  play: [
    "Good game. I learned something. Mainly that you're getting harder to beat.",
    "That was fun. I think. I'm still figuring out fun.",
    "I'll be ready next time. That's not a threat. Mostly.",
  ],
  tactics: [
    "You're getting sharper. I can tell because my analysis says so.",
    "Those patterns are sticking. I can see it in your moves.",
    "Nice work. The pieces are starting to trust you.",
  ],
  daily: [
    "Daily challenge done. You showed up. That means something.",
    "Another day, another set of puzzles conquered.",
    "Done. The rooks are impressed. They told me.",
  ],
};

export default function DailyRitualTestPage() {
  const [activity, setActivity] = useState<Activity>('tactics');
  const [lineIndex, setLineIndex] = useState(0);

  const lines = SAMPLE_LINES[activity];
  const line = lines[lineIndex % lines.length];

  return (
    <div className="min-h-full bg-chess-page overflow-auto p-4">
      <div className="max-w-sm mx-auto space-y-6">
        <h1 className="text-lg font-bold text-chess-text">Rookie Popup Preview</h1>

        {/* Activity picker */}
        <div className="bg-chess-surface rounded-xl p-4 border border-slate-200">
          <p className="text-xs font-bold text-chess-text-muted uppercase mb-2">Just completed:</p>
          <div className="flex gap-2">
            {(['play', 'tactics', 'daily'] as Activity[]).map((a) => (
              <button
                key={a}
                onClick={() => { setActivity(a); setLineIndex(0); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activity === a ? 'bg-chess-green text-white' : 'bg-slate-100 text-chess-text-muted'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <button
            onClick={() => setLineIndex(i => i + 1)}
            className="w-full mt-2 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-chess-text-muted hover:bg-slate-200"
          >
            Shuffle line
          </button>
        </div>

        {/* Preview */}
        <div className="bg-chess-page rounded-xl p-4 border-2 border-dashed border-slate-300">
          <RookiePopup justCompleted={activity} line={line} />
        </div>
      </div>
    </div>
  );
}
