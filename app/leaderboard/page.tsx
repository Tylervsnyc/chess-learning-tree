'use client';

import { useCallback, useEffect, useState } from 'react';
import { PERIODS, type LeaderboardPeriod } from '@/lib/leaderboard/period';

type Scope = 'crew' | 'global';

interface Row {
  rank: number;
  username: string;
  points: number;
  punches: number;
  isSelf: boolean;
}
interface BoardData {
  scope: Scope;
  period: LeaderboardPeriod;
  crew: { id: string; name: string } | null;
  rows: Row[];
  me: Row | null;
  total: number;
  notInCrew?: boolean;
}

const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  daily: 'Today',
  weekly: 'This Week',
  monthly: 'This Month',
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [scope, setScope] = useState<Scope>('crew');
  const [data, setData] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle (username) gate.
  const [username, setUsername] = useState<string | null | undefined>(undefined); // undefined=unknown
  const [handleInput, setHandleInput] = useState('');
  const [handleErr, setHandleErr] = useState<string | null>(null);
  const [savingHandle, setSavingHandle] = useState(false);

  // Join-crew.
  const [joinCode, setJoinCode] = useState('');
  const [joinErr, setJoinErr] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?scope=${scope}&period=${period}`);
      if (res.ok) setData(await res.json());
    } catch {
      /* keep last board on transient failure */
    } finally {
      setLoading(false);
    }
  }, [scope, period]);

  useEffect(() => {
    fetch('/api/profile/username')
      .then((r) => (r.ok ? r.json() : { username: null }))
      .then((d) => setUsername(d.username ?? null))
      .catch(() => setUsername(null));
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const saveHandle = async () => {
    setHandleErr(null);
    setSavingHandle(true);
    try {
      const res = await fetch('/api/profile/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: handleInput.trim() }),
      });
      const d = await res.json();
      if (res.ok) {
        setUsername(d.username);
        loadBoard();
      } else {
        setHandleErr(d.error ?? 'Could not save handle.');
      }
    } catch {
      setHandleErr('Network error.');
    } finally {
      setSavingHandle(false);
    }
  };

  const joinCrew = async () => {
    setJoinErr(null);
    setJoining(true);
    try {
      const res = await fetch('/api/leaderboard/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: joinCode.trim() }),
      });
      const d = await res.json();
      if (res.ok) {
        setJoinCode('');
        loadBoard();
      } else {
        setJoinErr(d.error ?? 'Could not join.');
      }
    } catch {
      setJoinErr('Network error.');
    } finally {
      setJoining(false);
    }
  };

  const needsHandle = username === null;
  const meOutsideTop = data?.me && !data.rows.some((r) => r.isSelf);

  const shareRank = async () => {
    if (!data?.me) return;
    const params = new URLSearchParams({
      rank: String(data.me.rank),
      username: data.me.username,
      points: String(data.me.points),
      punches: String(data.me.punches),
      period,
      scope,
      total: String(data.total),
    });
    if (scope === 'crew' && data.crew?.name) params.set('crew', data.crew.name);
    const imgUrl = `/api/og/leaderboard?${params.toString()}`;
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const file = new File([blob], 'chess-boxing-rank.png', { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d?: unknown) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: 'Chess Boxing',
          text: `#${data.me.rank} on the ${scope === 'crew' ? data.crew?.name ?? 'crew' : 'global'} board.`,
        });
        return;
      }
    } catch {
      /* fall through to opening the image */
    }
    window.open(imgUrl, '_blank');
  };

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg md:max-w-2xl mx-auto w-full px-4 md:px-6 pt-4 pb-10 flex flex-col gap-4">
        <div className="text-center pt-2">
          <h1 className="text-2xl md:text-3xl font-black text-chess-text">Leaderboard</h1>
          <p className="text-sm text-chess-text-muted mt-1">
            Box, solve, climb. Every workout counts.
          </p>
        </div>

        {/* Scope toggle */}
        <Segmented
          options={[
            { value: 'crew', label: data?.crew?.name ?? 'My Crew' },
            { value: 'global', label: 'Global' },
          ]}
          value={scope}
          onChange={(v) => setScope(v as Scope)}
        />

        {/* Period toggle */}
        <Segmented
          options={PERIODS.map((p) => ({ value: p, label: PERIOD_LABELS[p] }))}
          value={period}
          onChange={(v) => setPeriod(v as LeaderboardPeriod)}
        />

        {/* Handle gate */}
        {needsHandle && (
          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
            <div>
              <h2 className="font-black text-chess-text">Pick your handle</h2>
              <p className="text-sm text-chess-text-muted mt-1">
                This is the name other fighters see on the board.
              </p>
            </div>
            <input
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="e.g. brooklyn_bishop"
              maxLength={20}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text focus:border-chess-green outline-none"
            />
            {handleErr && <p className="text-sm text-red-500">{handleErr}</p>}
            <button
              onClick={saveHandle}
              disabled={savingHandle || handleInput.trim().length < 3}
              className="rounded-xl bg-chess-green text-white font-bold py-3 min-h-[44px] disabled:opacity-50"
            >
              {savingHandle ? 'Saving…' : 'Save handle'}
            </button>
          </div>
        )}

        {/* Join crew (crew scope, not a member) */}
        {scope === 'crew' && data?.notInCrew && (
          <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
            <div>
              <h2 className="font-black text-chess-text">Join a crew</h2>
              <p className="text-sm text-chess-text-muted mt-1">
                Enter your crew&apos;s code to see its board. Training at Gleason&apos;s?
                Use code <span className="font-bold text-chess-text">NYC</span>.
              </p>
            </div>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Crew code"
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 min-h-[44px] text-chess-text focus:border-chess-green outline-none uppercase"
            />
            {joinErr && <p className="text-sm text-red-500">{joinErr}</p>}
            <button
              onClick={joinCrew}
              disabled={joining || !joinCode.trim()}
              className="rounded-xl bg-chess-green text-white font-bold py-3 min-h-[44px] disabled:opacity-50"
            >
              {joining ? 'Joining…' : 'Join crew'}
            </button>
          </div>
        )}

        {/* Board */}
        {loading && !data ? (
          <BoardSkeleton />
        ) : data && !data.notInCrew ? (
          data.rows.length === 0 ? (
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-chess-text-muted">
              No scores {PERIOD_LABELS[period].toLowerCase()} yet. Be the first —
              finish a workout.
            </div>
          ) : (
            <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {data.rows.map((r) => (
                <RankRow key={r.rank} row={r} />
              ))}
              {meOutsideTop && data.me && (
                <>
                  <div className="text-center text-xs text-chess-text-muted py-1 bg-chess-page">
                    · · ·
                  </div>
                  <RankRow row={data.me} />
                </>
              )}
            </div>
          )
        ) : null}

        {data?.me && (
          <button
            onClick={shareRank}
            className="w-full rounded-2xl border-2 border-chess-green text-chess-green font-black py-3 min-h-[44px] hover:bg-chess-green/5 transition"
          >
            Share my rank
          </button>
        )}
      </div>
    </div>
  );
}

function RankRow({ row }: { row: Row }) {
  // Top-3 get a colored rank (gold / silver / bronze) — no emoji.
  const rankColor =
    row.rank === 1
      ? 'text-amber-500'
      : row.rank === 2
        ? 'text-slate-400'
        : row.rank === 3
          ? 'text-orange-700'
          : 'text-chess-text-muted';
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 ${
        row.isSelf ? 'bg-chess-green/10' : ''
      }`}
    >
      <div className={`w-8 text-center font-black tabular-nums ${rankColor}`}>
        {row.rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-bold truncate ${row.isSelf ? 'text-chess-green' : 'text-chess-text'}`}>
          {row.username}
          {row.isSelf && <span className="text-chess-text-muted font-semibold"> (you)</span>}
        </div>
        {row.punches > 0 && (
          <div className="text-[11px] font-semibold text-chess-text-muted">
            {row.punches.toLocaleString()} punches
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="font-black text-chess-text tabular-nums">{row.points.toLocaleString()}</div>
        <div className="text-[10px] font-semibold text-chess-text-muted">pts</div>
      </div>
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0">
          <div className="w-8 h-4 bg-slate-100 rounded animate-pulse" />
          <div className="flex-1 h-4 bg-slate-100 rounded animate-pulse" />
          <div className="w-10 h-4 bg-slate-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex bg-chess-surface rounded-xl border border-slate-200 p-1 gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-lg py-2 min-h-[44px] text-sm font-bold truncate transition ${
            value === o.value
              ? 'bg-chess-green text-white'
              : 'text-chess-text-muted hover:text-chess-text'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
