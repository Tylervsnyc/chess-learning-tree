'use client';

import { CornerRoom } from '@/components/chessboxing/CornerRoom';
import type { WeekData } from '@/components/shared/WeekChart';

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
    props: { name: 'brooklyn_bishop', days: 5, fights: 12, rating: '1240', week: WEEK, weekLoading: false },
  },
  {
    title: 'Brand new (no rating, no fights)',
    props: { name: 'newguy', days: 0, fights: 0, rating: '—', week: { days: WEEK.days.map((d) => ({ ...d, points: 0 })), weekTotal: 0 }, weekLoading: false },
  },
  {
    title: 'Loading',
    props: { name: 'brooklyn_bishop', days: null, fights: null, rating: null, week: null, weekLoading: true },
  },
  {
    title: 'Long handle (20 chars)',
    props: { name: 'a_very_long_handle_x', days: 128, fights: 340, rating: '2015', week: WEEK, weekLoading: false },
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
