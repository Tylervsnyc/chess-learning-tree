'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArenaScene, GymSign } from '@/components/chessboxing/Arena';
import { useBoxShell } from '@/hooks/useBoxShell';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import type { LeaderboardPeriod } from '@/lib/leaderboard/period';

/**
 * RingHome — the "Living Ring" Chess Boxing home (BOX_RING_HOME flag).
 * Approved on /test/boxing-landing (2026-08-07).
 *
 * Fight-night scene: terraced crowd + flashbulbs up top, the hanging sign,
 * two corner buttons (Puzzle Boxing = ranked → /workout; Play Boxing = bout
 * vs Rookie), and live Global/Squad boards from /api/leaderboard with a
 * daily/weekly/monthly toggle. The page itself never scrolls (native-shell
 * hard rule) — only the two board windows scroll internally.
 */

type Period = LeaderboardPeriod;

type Row = { rank: number | null; name: string; pts: number; me?: boolean };

type BoardState =
  | { status: 'loading' }
  | { status: 'signedout' }
  | { status: 'nocrew' }
  | { status: 'ready'; rows: Row[] };

type PeriodBoards = { global: BoardState; squad: BoardState };

interface ApiRow {
  rank: number;
  username: string;
  points: number;
  isSelf: boolean;
}
interface RosterRow {
  username: string | null;
  points: number;
  isSelf: boolean;
  noScores: boolean;
}

const LOADING: PeriodBoards = { global: { status: 'loading' }, squad: { status: 'loading' } };

function toRows(rows: ApiRow[], me: ApiRow | null, roster?: RosterRow[]): Row[] {
  const out: Row[] = rows.map((r) => ({ rank: r.rank, name: r.username, pts: r.points, me: r.isSelf }));
  if (me && !rows.some((r) => r.isSelf)) {
    out.push({ rank: me.rank, name: me.username, pts: me.points, me: true });
  }
  // Crew roster tail: members with no score this window, so a small squad
  // never renders as a dead board.
  for (const m of roster ?? []) {
    out.push({ rank: null, name: m.username ?? 'unnamed fighter', pts: m.points, me: m.isSelf });
  }
  return out;
}

/** Time left in the current window, using the same midnight-ET ≈ 05:00 UTC
 * approximation as lib/leaderboard/period.ts. */
function periodEndsIn(period: Period): string {
  const now = new Date();
  // Next daily boundary (05:00 UTC).
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 5));
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 1);

  let end = next;
  if (period === 'weekly') {
    const toMonday = (1 - next.getUTCDay() + 7) % 7;
    end = new Date(next);
    end.setUTCDate(end.getUTCDate() + toMonday);
  } else if (period === 'monthly') {
    end =
      next.getUTCDate() === 1
        ? next
        : new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 1, 5));
  }

  const mins = Math.max(1, Math.floor((end.getTime() - now.getTime()) / 60_000));
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins % 60}m`;
  return `${mins}m`;
}

export function RingHome() {
  const inShell = useBoxShell();
  const [period, setPeriod] = useState<Period>('weekly');
  const [boards, setBoards] = useState<Partial<Record<Period, PeriodBoards>>>({});
  const [needsUsername, setNeedsUsername] = useState(false);

  useEffect(() => {
    // 401 = logged out (no nudge); ok + null username = nudge.
    fetch('/api/profile/username')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setNeedsUsername(d !== null && d.username === null))
      .catch(() => {});
  }, []);

  // One fetch per period per mount; results are cached so toggling back is
  // instant. Keyed writes are idempotent, so no cancellation dance needed.
  const requested = useRef<Set<Period>>(new Set());
  useEffect(() => {
    if (requested.current.has(period)) return;
    requested.current.add(period);
    setBoards((b) => ({ ...b, [period]: LOADING }));

    (async () => {
      const load = async (scope: 'global' | 'crew'): Promise<BoardState> => {
        try {
          const res = await fetch(`/api/leaderboard?scope=${scope}&period=${period}`);
          if (res.status === 401) return { status: 'signedout' };
          if (!res.ok) return { status: 'ready', rows: [] };
          const d = await res.json();
          if (scope === 'crew' && d?.notInCrew) return { status: 'nocrew' };
          return { status: 'ready', rows: toRows(d?.rows ?? [], d?.me ?? null, d?.roster) };
        } catch {
          return { status: 'ready', rows: [] };
        }
      };
      const [global, squad] = await Promise.all([load('global'), load('crew')]);
      setBoards((b) => ({ ...b, [period]: { global, squad } }));
    })();
  }, [period]);

  const current = boards[period] ?? LOADING;

  return (
    <div className="h-full text-white relative overflow-hidden bg-[#131a2e]">
      <div className="absolute inset-0 mx-auto max-w-lg md:max-w-xl flex flex-col overflow-hidden">
        <ArenaScene />

        {/* ---- sign ---- */}
        <div className="pt-[max(0.9rem,env(safe-area-inset-top))] flex justify-center relative z-10">
          <div className="ring-swing"><GymSign /></div>
        </div>

        {/* ---- the two corners + VS coin ---- */}
        <div className="relative z-10 mt-8 px-5">
          <div className="grid grid-cols-2 gap-4">
            <CornerButton
              href="/workout?from=box"
              corner="red"
              title="Puzzle"
              sub="Boxing"
              tagIcon={<TrophyIcon className="w-3 h-3" />}
              tag="Ranked"
              icon={
                <div className="mx-auto w-[64px] h-[58px] relative">
                  <Image
                    src="/boxing/locker/gloves.webp"
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover object-[50%_22%] scale-[1.35] drop-shadow-[0_3px_2px_rgba(0,0,0,0.35)]"
                  />
                </div>
              }
            />
            <CornerButton
              href={FEATURE_FLAGS.BOUT_MODE ? '/box/bout' : '/play'}
              corner="blue"
              title="Play"
              sub="Boxing"
              tag="vs Rookie"
              icon={
                <div className="mx-auto w-[64px] h-[58px] relative">
                  <Image
                    src="/boxing/locker/piece-bn.webp"
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain drop-shadow-[0_3px_2px_rgba(0,0,0,0.35)]"
                  />
                </div>
              }
            />
          </div>
          {/* VS coin overlapping both corners */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-[#f6c445] border-[3px] border-[#b8860b] shadow-[0_3px_0_0_#8a6508] flex items-center justify-center rotate-[-8deg]">
              <span className="text-[15px] font-black text-[#3d2e00] tracking-tight">VS</span>
            </div>
          </div>
        </div>

        {/* ---- canvas apron trim ---- */}
        <div
          className="relative z-10 mt-7 mx-5 h-2 rounded-full overflow-hidden opacity-60"
          style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 8px, transparent 8px 16px)' }}
        />

        {/* ---- rankings ---- */}
        <div className="mt-4 flex-1 min-h-0 px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] relative z-10 flex flex-col">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-white/20" />
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
              <LiveDot /> The Rankings
            </span>
            <span className="h-px w-8 bg-white/20" />
          </div>

          <div className="mt-3 flex-1 min-h-0 grid grid-cols-2 gap-3">
            <Board title="Global" color="red" state={current.global} period={period} />
            <Board title="Squad" color="blue" state={current.squad} period={period} />
          </div>

          <div className="pt-3 flex flex-col items-center gap-2">
            <PeriodToggle period={period} onChange={setPeriod} />
            <div className="flex items-center justify-center gap-2 text-[10.5px] font-bold text-white/45">
              <BellIcon className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest">Board resets in</span>
              <span className="font-black text-white/80 tabular-nums">{periodEndsIn(period)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fighter-name nudge — signed in, no handle, invisible on the boards. */}
      {needsUsername && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-20">
          <Link
            href="/leaderboard"
            className="pointer-events-auto flex items-center gap-1.5 min-h-[44px] px-4 rounded-full bg-chess-surface border-2 border-chess-blue text-chess-blue text-xs font-extrabold shadow-[0_3px_0_0_#0d7ec4] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
          >
            Pick your fighter name to enter the rankings
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      )}

      {/* Settings gear — only inside the app shell. */}
      {inShell && (
        <Link
          href="/box/settings"
          aria-label="Settings"
          className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 text-white/70 border border-white/15 active:translate-y-[2px] transition-transform tap-highlight"
        >
          <GearIcon />
        </Link>
      )}
    </div>
  );
}

/* ---------- corner buttons ---------- */

function CornerButton({
  href, corner, title, sub, tag, tagIcon, icon,
}: {
  href: string; corner: 'red' | 'blue'; title: string; sub: string; tag: string; tagIcon?: React.ReactNode; icon: React.ReactNode;
}) {
  const red = corner === 'red';
  return (
    <Link
      href={href}
      className={`block rounded-2xl px-3 pt-4 pb-3.5 text-center text-white border-2 transition-transform active:translate-y-[5px] active:shadow-none tap-highlight ${
        red
          ? 'bg-chess-red border-[#e86060] shadow-[0_5px_0_0_#CC3939,0_12px_24px_rgba(255,75,75,0.22)]'
          : 'bg-chess-blue border-[#54c2f8] shadow-[0_5px_0_0_#0d7ec4,0_12px_24px_rgba(28,176,246,0.22)]'
      }`}
    >
      {icon}
      <div className="mt-2 text-[19px] font-black uppercase leading-[0.95] tracking-tight">
        {title}<br />{sub}
      </div>
      <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[9.5px] font-black uppercase tracking-[0.14em] ${
        red ? 'bg-[#a32b2b] text-[#ffd7a1]' : 'bg-[#116b9c] text-[#d8f1ff]'
      }`}>
        {tagIcon}{tag}
      </div>
    </Link>
  );
}

/* ---------- period toggle ---------- */

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

function PeriodToggle({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  return (
    <div className="flex rounded-full bg-white/[0.07] border border-white/15 p-[3px]" role="tablist" aria-label="Ranking period">
      {PERIODS.map(({ key, label }) => {
        const active = key === period;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`min-h-[34px] px-4 rounded-full text-[11px] font-black uppercase tracking-wide transition-colors tap-highlight ${
              active
                ? 'bg-[#f6c445] text-[#3d2e00] shadow-[0_2px_0_0_#b8860b]'
                : 'text-white/55 active:text-white/85'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- leaderboards: fixed windows, inner scroll ---------- */

function Board({ title, color, state, period }: { title: string; color: 'red' | 'blue'; state: BoardState; period: Period }) {
  const red = color === 'red';
  return (
    <div className="h-full min-h-0 flex flex-col rounded-2xl bg-white/[0.05] border border-white/10 overflow-hidden backdrop-blur-[2px]">
      <div className={`shrink-0 px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.22em] ${
        red ? 'bg-chess-red/25 text-[#ff9d9d]' : 'bg-chess-blue/25 text-[#8fd6fb]'
      }`}>
        {title}
      </div>
      <div className="ring-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 py-2 space-y-1">
        <BoardBody state={state} period={period} squad={!red} />
      </div>
      <div className="relative shrink-0 h-0">
        <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#1a2138] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function BoardBody({ state, period, squad }: { state: BoardState; period: Period; squad: boolean }) {
  if (state.status === 'loading') {
    return (
      <div className="space-y-2 px-1 py-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-6 rounded-lg bg-white/[0.06] animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    );
  }
  if (state.status === 'signedout') {
    return (
      <EmptyNote>
        <Link href="/leaderboard" className="underline underline-offset-2 font-black text-white/80">Sign in</Link> and pick a
        fighter name to enter the rankings.
      </EmptyNote>
    );
  }
  if (state.status === 'nocrew') {
    return (
      <EmptyNote>
        No squad yet. <Link href="/leaderboard" className="underline underline-offset-2 font-black text-white/80">Join a crew</Link> with
        a code and fight for it.
      </EmptyNote>
    );
  }
  if (state.rows.length === 0) {
    return (
      <EmptyNote>
        {period === 'daily' ? 'No fights yet today — the first bell is yours.' : 'No fights this window yet — be first on the board.'}
      </EmptyNote>
    );
  }
  return (
    <>
      {state.rows.map((r, i) => (r.me ? <MeRow key={`${r.name}-${i}`} r={r} /> : <BoardRow key={`${r.name}-${i}`} r={r} squad={squad} />))}
    </>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="px-2 py-3 text-[11.5px] font-semibold leading-snug text-white/55">{children}</p>;
}

function BoardRow({ r, squad }: { r: Row; squad: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-1.5 py-[7px] ${r.rank === null ? 'text-white/45' : 'text-white/90'}`}>
      {r.rank === null ? (
        <span className="w-6 text-center text-[13px] font-black text-white/25">–</span>
      ) : (
        <RankBadge rank={r.rank} />
      )}
      <span className={`flex-1 truncate text-[12.5px] font-bold ${squad && r.rank === null ? 'italic' : ''}`}>{r.name}</span>
      <span className="text-[11px] font-black tabular-nums text-white/55">{fmtPts(r.pts)}</span>
    </div>
  );
}

/** Your row — a gold pill with a slow repeating sheen. */
function MeRow({ r }: { r: Row }) {
  return (
    <div className="relative overflow-hidden flex items-center gap-2 px-1.5 py-1.5 rounded-xl bg-chess-gold/[0.16] border border-chess-gold/50 text-chess-gold">
      <span
        className="ring-sheen-run absolute inset-y-0 w-10 bg-white/20"
        style={{ animation: 'ringSheen 3.2s ease-in-out 1.5s infinite' }}
      />
      <span className="w-6 text-center text-[13px] font-black tabular-nums">{r.rank ?? '–'}</span>
      <span className="flex-1 truncate text-[12.5px] font-black">{r.name}</span>
      <span className="text-[11px] font-black tabular-nums">{fmtPts(r.pts)}</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return <span className="w-6 text-center text-[13px] font-black tabular-nums text-white/40">{rank}</span>;
  }
  const medal =
    rank === 1
      ? 'bg-[#f6c445] text-[#3d2e00] border-[#b8860b]'
      : rank === 2
        ? 'bg-[#cbd5e1] text-[#334155] border-[#94a3b8]'
        : 'bg-[#d9955c] text-[#4a2a10] border-[#a5642f]';
  return (
    <span className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center text-[11px] font-black ${medal}`}>
      {rank}
    </span>
  );
}

function fmtPts(pts: number) {
  return pts >= 1000 ? `${(pts / 1000).toFixed(1)}k` : String(pts);
}

/* ---------- tiny icons ---------- */

function LiveDot() {
  return <span className="inline-block w-1.5 h-1.5 rounded-full bg-chess-green animate-pulse" />;
}

function TrophyIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4a2 2 0 0 0 2 5M17 6h3a2 2 0 0 1-2 5" />
    </svg>
  );
}

function BellIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3a6 6 0 0 0-6 6c0 4-1.5 5.5-2 6h16c-.5-.5-2-2-2-6a6 6 0 0 0-6-6Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1.02-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.02H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03z" />
    </svg>
  );
}
