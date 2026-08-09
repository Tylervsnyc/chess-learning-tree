'use client';

import { useState } from 'react';
import AchievementUnlockOverlay from '@/components/achievements/AchievementUnlockOverlay';
import { TrophyCase, TrophyCaseRow } from '@/components/achievements/TrophyCase';
import type { AchievementUnlock } from '@/lib/achievements/types';

/**
 * /test/achievements — preview the unlock animations (S/M/L) and the trophy
 * case without fighting ten bouts. The trophy case section shows the
 * logged-in user's REAL rows (empty grid when logged out / pre-migration).
 */

const SAMPLES: Record<string, AchievementUnlock[]> = {
  'Small (the nod)': [
    {
      id: 'bout-first-blood',
      name: 'First Blood',
      description: "Your first win. I'm framing this. I already framed it.",
      icon: '🥊',
      category: 'bout',
      tier: 1,
      band: 'amateur',
      kind: 'unlocked',
      size: 's',
      secret: false,
    },
  ],
  'Shame (small + sting)': [
    {
      id: 'shame-flagged',
      name: 'Flagged',
      description: 'You had all that time. You spent it like a lottery winner. The clock says hi.',
      icon: '🚩',
      category: 'shame',
      tier: 1,
      band: 'amateur',
      kind: 'unlocked',
      size: 's',
      secret: true,
    },
  ],
  'Medium (new belt)': [
    {
      id: 'bout-ko-artist',
      name: 'KO Artist',
      description: 'Checkmate is just a KO where the referee is math.',
      icon: '💥',
      category: 'bout',
      tier: 2,
      band: 'contender',
      kind: 'upgraded',
      size: 'm',
      secret: false,
    },
  ],
  'Large (title fight)': [
    {
      id: 'bout-up-the-ladder',
      name: 'Up the Ladder',
      description: 'I stopped going easy on you several levels ago. This is concerning.',
      icon: '🪜',
      category: 'bout',
      tier: 8,
      band: 'champion',
      kind: 'upgraded',
      size: 'l',
      secret: false,
    },
  ],
  'First bout (queue of 5, capped at 3)': [
    { id: 'bout-first-blood', name: 'First Blood', description: "Your first win. I'm framing this. I already framed it.", icon: '🥊', category: 'bout', tier: 1, band: 'amateur', kind: 'unlocked', size: 's', secret: false },
    { id: 'bout-ko-artist', name: 'KO Artist', description: 'Checkmate is just a KO where the referee is math.', icon: '💥', category: 'bout', tier: 1, band: 'amateur', kind: 'unlocked', size: 's', secret: false },
    { id: 'bout-buzzer-beater', name: 'Buzzer Beater', description: 'Under ten seconds left and you found mate. I need to sit down.', icon: '⏱️', category: 'bout', tier: 1, band: 'amateur', kind: 'unlocked', size: 's', secret: false },
    { id: 'bout-meltdown-button', name: 'The Meltdown Button', description: 'I was WINNING. I want that recorded.', icon: '🌋', category: 'bout', tier: 1, band: 'amateur', kind: 'unlocked', size: 's', secret: false },
    { id: 'bout-up-the-ladder', name: 'Up the Ladder', description: 'I stopped going easy on you several levels ago.', icon: '🪜', category: 'bout', tier: 5, band: 'title-shot', kind: 'unlocked', size: 'm', secret: false },
  ],
  'Undisputed (shimmer)': [
    {
      id: 'bout-up-the-ladder',
      name: 'Up the Ladder',
      description: 'Level ten. There is no level eleven. I checked. Twice.',
      icon: '🪜',
      category: 'bout',
      tier: 10,
      band: 'undisputed',
      kind: 'upgraded',
      size: 'l',
      secret: false,
    },
  ],
};

export default function TestAchievementsPage() {
  const [playing, setPlaying] = useState<AchievementUnlock[] | null>(null);

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-4">
        <h1 className="text-xl font-black text-chess-text">Achievements test</h1>

        <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
          <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
            Unlock animations
          </h2>
          {Object.entries(SAMPLES).map(([label, unlocks]) => (
            <button
              key={label}
              type="button"
              onClick={() => setPlaying(unlocks)}
              className="w-full rounded-xl border-2 border-slate-200 py-2.5 text-sm font-black text-chess-text tap-highlight text-left px-3"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
          <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted mb-2">
            Box-profile row (real data)
          </h2>
          <TrophyCaseRow />
        </div>

        <TrophyCase />
      </div>

      {playing && <AchievementUnlockOverlay unlocks={playing} onDone={() => setPlaying(null)} />}
    </div>
  );
}
