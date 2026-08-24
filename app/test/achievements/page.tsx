'use client';

import { useMemo, useState } from 'react';
import AchievementUnlockOverlay from '@/components/achievements/AchievementUnlockOverlay';
import { TrophyCase, TrophyCaseRow } from '@/components/achievements/TrophyCase';
import { AchievementTile } from '@/components/achievements/BeltBadge';
import { ACHIEVEMENT_CATALOG } from '@/lib/achievements/catalog';
import { evaluate, type AchievementContext } from '@/lib/achievements/engine';
import {
  beltBandForLevel,
  beltBandForRung,
  CATEGORY_LABELS,
  type AchievementCategory,
  type AchievementDef,
  type AchievementRow,
  type AchievementUnlock,
} from '@/lib/achievements/types';

/**
 * /test/achievements — review every line in the catalog, play any medal's
 * unlock animation, and preview the real first-workout / first-bout stacks
 * (run through the real engine with empty rows). The trophy case section
 * shows the logged-in user's REAL rows.
 */

function toUnlock(def: AchievementDef, tier = 1, kind: 'unlocked' | 'upgraded' = 'unlocked'): AchievementUnlock {
  const band = def.levelTiered
    ? beltBandForLevel(tier)
    : def.thresholds
      ? beltBandForRung(tier, def.thresholds.length)
      : (def.band ?? 'amateur');
  const size =
    def.celebration ??
    (def.secret || def.category === 'shame'
      ? 's'
      : band === 'champion' || band === 'undisputed'
        ? 'l'
        : band === 'amateur'
          ? 's'
          : 'm');
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    icon: def.icon,
    category: def.category,
    tier,
    band,
    kind,
    size,
    secret: def.secret === true,
  };
}

const EMPTY_CTX: AchievementContext = {
  rows: new Map<string, AchievementRow>(),
  streakCurrent: 1,
  gapDaysBeforeToday: null,
  localHour: 18,
  localWeekday: 6,
  boutsToday: 0,
  boutLossesToday: 0,
  workoutsToday: 1,
  rankedWinDayStreak: 0,
};

/** A realistic first workout at the gym: 8 minutes, 6 right, 2 wrong, 40 punches. */
const FIRST_WORKOUT = evaluate(
  {
    kind: 'workout_finished',
    correct: 6,
    wrong: 2,
    punches: 40,
    perfect: false,
    durationMinutes: 8,
    bestRoundPoints: 120,
    bestCombo: 3,
    firedUp: false,
    struckOutFirstSegment: false,
    isPersonalBest: true,
  },
  EMPTY_CTX,
).unlocks;

/** A first bout: lost on the cards after surviving every round, 14 punches landed. */
const FIRST_BOUT = evaluate(
  {
    kind: 'bout_finished',
    outcome: 'decision_loss',
    result: 'loss',
    level: 2,
    ranked: true,
    format: 'standard',
    roundsSurvived: 3,
    boxingRounds: 3,
    clockLeftSeconds: 40,
    material: -3,
    facts: null,
    punches: 14,
    userCards: [70, 65, 91],
  },
  { ...EMPTY_CTX, boutsToday: 1, workoutsToday: 0 },
).unlocks;

const SAMPLES: Record<string, AchievementUnlock[]> = {
  [`First workout at the gym (${FIRST_WORKOUT.length} medals, real engine)`]: FIRST_WORKOUT,
  [`First bout, lost on cards (${FIRST_BOUT.length} medals, real engine)`]: FIRST_BOUT,
  'Medium (new belt)': [toUnlock(ACHIEVEMENT_CATALOG.find((d) => d.id === 'bout-ko-artist')!, 2, 'upgraded')],
  'Large (title fight)': [toUnlock(ACHIEVEMENT_CATALOG.find((d) => d.id === 'bout-up-the-ladder')!, 8, 'upgraded')],
  'Shame (small + sting)': [toUnlock(ACHIEVEMENT_CATALOG.find((d) => d.id === 'shame-flagged')!)],
  'Undisputed (shimmer)': [toUnlock(ACHIEVEMENT_CATALOG.find((d) => d.id === 'mate-castle-doctrine')!)],
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as AchievementCategory[];

export default function TestAchievementsPage() {
  const [playing, setPlaying] = useState<AchievementUnlock[] | null>(null);
  const [filter, setFilter] = useState<AchievementCategory | 'all'>('all');

  const catalog = useMemo(
    () => ACHIEVEMENT_CATALOG.filter((d) => filter === 'all' || d.category === filter),
    [filter],
  );

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-4">
        <h1 className="text-xl font-black text-chess-text">Achievements test</h1>
        <p className="text-xs font-semibold text-chess-text-muted">
          {ACHIEVEMENT_CATALOG.length} medals in the catalog. Tap any row to play its unlock.
        </p>

        <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
          <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
            Stacks and sizes
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

        <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
              Full catalog — every line
            </h2>
            <span className="text-[11px] font-bold text-chess-text-muted tabular-nums">{catalog.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['all', ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black tap-highlight border ${
                  filter === c ? 'bg-chess-text text-white border-chess-text' : 'border-slate-200 text-chess-text-muted'
                }`}
              >
                {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <ul className="flex flex-col divide-y divide-slate-100">
            {catalog.map((def) => {
              const ladder = def.levelTiered
                ? 'Belt tier = Rookie level beaten'
                : def.thresholds
                  ? `Ladder: ${def.thresholds.join(' → ')}`
                  : def.band && def.band !== 'amateur'
                    ? `Binary · ${def.band}`
                    : 'Binary';
              return (
                <li key={def.id}>
                  <button
                    type="button"
                    onClick={() => setPlaying([toUnlock(def, def.levelTiered ? 5 : 1)])}
                    className="w-full flex items-start gap-3 py-2.5 text-left tap-highlight"
                  >
                    <AchievementTile
                      icon={def.icon}
                      band={def.levelTiered ? 'title-shot' : def.thresholds ? 'amateur' : (def.band ?? 'amateur')}
                      size={40}
                      secret={!!def.secret}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-black text-chess-text">{def.name}</span>
                        <span className="text-[10px] font-bold text-chess-text-faint truncate">{def.id}</span>
                      </div>
                      <p className="text-xs font-semibold text-chess-text leading-snug mt-0.5">{def.description}</p>
                      <div className="text-[10px] font-bold text-chess-text-muted mt-0.5">
                        {CATEGORY_LABELS[def.category]} · {ladder}
                        {def.secret ? ' · secret' : ''}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
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
