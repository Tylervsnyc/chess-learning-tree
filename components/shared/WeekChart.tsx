'use client';

/**
 * WeekChart — the 7-day workout-points bar chart. ONE implementation, used by
 * the website profile (/profile) and the Chess Boxing app profile
 * (/box/profile). Data shape comes from /api/profile/dashboard.
 */

export interface WeekDay {
  date: string; // YYYY-MM-DD
  label: string; // Mon
  points: number;
}

export interface WeekData {
  days: WeekDay[];
  weekTotal: number;
}

function todayLocalKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function WeekChart({ data, loading }: { data: WeekData | null; loading: boolean }) {
  const today = todayLocalKey();

  if (loading || !data) {
    return (
      <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-chess-text">This week</h2>
        </div>
        <div className="h-28 flex items-end gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-slate-100 rounded-md animate-pulse" style={{ height: `${30 + (i % 3) * 20}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const days = data.days ?? [];
  const maxPoints = Math.max(1, ...days.map((d) => d.points));

  return (
    <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-bold text-chess-text">This week</h2>
        <span className="text-xs font-bold text-chess-text-muted tabular-nums">
          {data.weekTotal.toLocaleString()} pts
        </span>
      </div>

      {data.weekTotal === 0 ? (
        <p className="text-sm text-chess-text-muted py-6 text-center">
          No workouts yet this week. Start one to fill the chart.
        </p>
      ) : (
        <div className="flex items-end gap-2 h-28">
          {days.map((d) => {
            const isToday = d.date === today;
            const pct = Math.round((d.points / maxPoints) * 100);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-md transition-all ${
                      isToday ? 'bg-chess-blue' : 'bg-chess-blue/30'
                    }`}
                    style={{ height: d.points > 0 ? `${Math.max(pct, 6)}%` : '4px' }}
                    title={`${d.points} pts`}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold leading-none ${
                    isToday ? 'text-chess-blue' : 'text-chess-text-faint'
                  }`}
                >
                  {d.label.charAt(0)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
