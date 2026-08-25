'use client';

import { CornerRoom } from '@/components/chessboxing/CornerRoom';
import type { WeekData } from '@/components/shared/WeekChart';
import type { EloSeriesPoint } from '@/lib/elo/rookie-rating';

/** A believable climb with a couple of dips, so the sparkline has a shape. */
const SERIES: EloSeriesPoint[] = [
  1090, 1105, 1098, 1120, 1142, 1138, 1160, 1175, 1168, 1190,
  1205, 1198, 1216, 1230, 1224, 1240,
].map((elo, i) => ({ date: `2026-08-${String(10 + i).padStart(2, '0')}`, elo }));

/**
 * /test/box-profile — the Chess Boxing profile room with mock numbers.
 *
 * Exists because /box/profile needs a signed-in session to show anything, so
 * the real route renders the signed-out gate in any screenshot and the room
 * itself can't be judged. The first version of this screen shipped without
 * being seen with data on it. Don't design this screen without this page.
 *
 * Test pages must scroll (CLAUDE.md) — body is overflow:hidden globally.
 */

const WEEK: WeekData = {
  weekTotal: 1840,
  days: [
    { date: '2026-08-19', label: 'Tue', points: 220 },
    { date: '2026-08-20', label: 'Wed', points: 0 },
    { date: '2026-08-21', label: 'Thu', points: 410 },
    { date: '2026-08-22', label: 'Fri', points: 180 },
    { date: '2026-08-23', label: 'Sat', points: 530 },
    { date: '2026-08-24', label: 'Sun', points: 0 },
    { date: '2026-08-25', label: 'Mon', points: 500 },
  ],
};

const CASES: { title: string; props: React.ComponentProps<typeof CornerRoom> }[] = [
  {
    title: 'Regular',
    props: { name: 'brooklyn_bishop', days: 5, record: { wins: 8, losses: 3, kos: 2, total: 12 }, elo: { current: 1240, events: 86, series: SERIES }, loading: false, week: WEEK },
  },
  {
    title: 'Brand new (no rating, no fights)',
    props: { name: 'newguy', days: 0, record: { wins: 0, losses: 0, kos: 0, total: 0 }, elo: { current: 600, events: 0, series: [] }, loading: false, week: { days: WEEK.days.map((d) => ({ ...d, points: 0 })), weekTotal: 0 } },
  },
  {
    title: 'Loading',
    props: { name: 'brooklyn_bishop', days: null, record: null, elo: null, loading: true, week: null },
  },
  {
    title: 'Long handle (20 chars)',
    props: { name: 'a_very_long_handle_x', days: 128, record: { wins: 210, losses: 130, kos: 44, total: 340 }, elo: { current: 2015, events: 940, series: SERIES }, loading: false, week: WEEK },
  },
];

export default function TestBoxProfile() {
  return (
    <div className="h-full overflow-auto bg-slate-100 p-6">
      <h1 className="text-lg font-black text-slate-700 mb-4">
        /box/profile — the corner room
      </h1>
      <div className="flex flex-wrap gap-8">
        {CASES.map(({ title, props }) => (
          <div key={title}>
            <div className="text-xs font-bold text-slate-500 mb-2">{title}</div>
            <div
              className="w-[390px] h-[720px] rounded-[28px] overflow-hidden ring-1 ring-slate-300 shadow-xl bg-white"
            >
              <CornerRoom {...props} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
