'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { getStreak, getTz, type StreakData } from '@/lib/streak-client';
import RookieCampfire from '@/components/shared/RookieCampfire';
import { WeekChart, type WeekData } from '@/components/shared/WeekChart';
import RookieRatingCard from '@/components/profile/RookieRatingCard';
import { TrophyCaseRow } from '@/components/achievements/TrophyCase';
import { ELO_BASELINE, PROVISIONAL_EVENTS } from '@/lib/elo/estimate';
import type { EloSeriesPoint } from '@/lib/elo/rookie-rating';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { useProGate } from '@/hooks/useProGate';
import { useSubscription } from '@/hooks/useSubscription';

/**
 * /box/profile — the Chess Boxing app's Profile tab. A compact, no-scroll
 * fighter card: streak, ELO, fight record, lifetime numbers. The full website
 * profile (/profile) stays untouched for web; this screen reuses the same
 * endpoints (/api/profile/dashboard, /api/bout/record, streak-client).
 *
 * HARD RULE (docs/chess-boxing-app-structure.md): fits the window, never
 * scrolls. Fixed column; every section shrinks, nothing overflows.
 */

interface BoutRecord {
  wins: number;
  losses: number;
  draws: number;
  kos: number;
  total: number;
  points: number;
}

/** CHESSBOXING_PRO history feeds (app/api/pro/history). */
interface ProHistory {
  isPro: boolean;
  bouts: {
    id: string;
    createdAt: string;
    outcome: string;
    result: 'win' | 'loss' | 'draw';
    points: number;
    punches: number;
    moves: number;
    level: number;
    userCards: number[];
    rookieCards: number[];
  }[];
  punchLog: { id: string; createdAt: string; kind: 'workout' | 'bout'; punches: number; points: number }[];
  lockedBouts: number;
  lockedPunches: number;
}

interface DashboardData {
  stats?: {
    lessonsCompleted: number;
    puzzlesSolved: number;
    gamesPlayed: number;
    workoutPoints: number;
  };
  elo?: { current: number; events: number; series: EloSeriesPoint[] };
  week?: WeekData;
}

export default function BoxProfilePage() {
  const { user, profile, loading: userLoading } = useUser();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [record, setRecord] = useState<BoutRecord | null>(null);
  const [showElo, setShowElo] = useState(false);
  // CHESSBOXING_PRO: history sheets + gold name. All of it renders nothing
  // while the flag is off.
  const proFlag = FEATURE_FLAGS.CHESSBOXING_PRO;
  const pro = useProGate();
  const sub = useSubscription();
  const [hist, setHist] = useState<ProHistory | null>(null);
  const [sheet, setSheet] = useState<'bouts' | 'punches' | null>(null);
  const isGold = proFlag && (sub.isPremium || sub.isPatron);

  useEffect(() => {
    getStreak().then(setStreak);
    fetch(`/api/profile/dashboard?tz=${encodeURIComponent(getTz())}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setDash(d ?? null))
      .catch(() => setDash(null));
    fetch('/api/bout/record')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRecord(d?.record ?? null))
      .catch(() => setRecord(null));
    if (proFlag) {
      fetch(`/api/pro/history?tz=${encodeURIComponent(getTz())}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setHist(d ?? null))
        .catch(() => setHist(null));
    }
  }, [proFlag]);

  // Logged-out gate — same pitch as the web profile, app-compact.
  if (!userLoading && !user) {
    return (
      <div className="h-full overflow-hidden bg-chess-page">
        <div className="max-w-lg mx-auto w-full h-full px-6 flex flex-col items-center justify-center gap-3 text-center">
          <h1 className="text-2xl font-black text-chess-text">Your corner</h1>
          <p className="text-sm font-semibold text-chess-text-muted">
            Sign in to keep a streak, climb the standings, and build a fight record.
          </p>
          <Link
            href="/auth/login"
            className="mt-2 w-full max-w-xs rounded-2xl bg-chess-green text-white text-center font-black py-3.5 shadow-[0_4px_0_0_var(--color-chess-green-shadow)] active:translate-y-[3px] active:shadow-none transition-transform tap-highlight"
          >
            Sign In
          </Link>
          <Link href="/auth/signup" className="text-sm font-bold text-chess-blue tap-highlight py-3 min-h-[44px] inline-flex items-center">
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  const name =
    (profile as { username?: string | null } | null)?.username ||
    user?.email?.split('@')[0] ||
    'Fighter';

  return (
    <div className="h-full overflow-hidden bg-chess-page">
      <div className="max-w-lg md:max-w-xl mx-auto w-full h-full px-4 md:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex flex-col gap-3">
        {/* Who */}
        <div className="relative text-center shrink-0 pt-1">
          <h1
            className={`text-2xl md:text-3xl font-black leading-tight truncate px-10 ${
              isGold ? 'text-chess-gold-dark' : 'text-chess-text'
            }`}
          >
            {name}
            {isGold && (
              <span className="ml-2 align-middle rounded-full bg-chess-gold/25 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-chess-gold-dark">
                Pro
              </span>
            )}
          </h1>
          <p className="text-xs font-semibold text-chess-text-muted mt-0.5">Chess Boxing record</p>
          <Link
            href="/box/settings"
            aria-label="Settings"
            className="absolute right-0 top-0 flex items-center justify-center w-11 h-11 rounded-xl text-chess-text-muted tap-highlight"
          >
            <GearIcon />
          </Link>
        </div>

        {/* Streak hero — same campfire as the website profile, app-compact */}
        <div className="shrink-0 rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-2.5 flex items-center gap-3">
          <div className="shrink-0">
            <RookieCampfire
              blockSize={9}
              active={!!streak && streak.completedToday}
              blaze={Math.max(0.3, Math.min(1, (streak?.current ?? 0) / 60))}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-3xl font-black tabular-nums leading-none ${
                  streak && streak.completedToday ? 'text-chess-green' : 'text-chess-text'
                }`}
              >
                {streak ? streak.current : '—'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted">
                Day streak
              </span>
            </div>
            <div className="text-xs font-bold text-chess-text truncate mt-0.5">
              {streak
                ? streak.completedToday
                  ? 'Done today. The fire stays lit.'
                  : streak.current > 0
                    ? 'Alive — finish one thing today.'
                    : 'Finish anything today to start it.'
                : ' '}
            </div>
          </div>
        </div>

        {/* Chess Path ELO — the chart lives ON the profile; tap for the full
            card + how-it's-calculated sheet */}
        <button
          type="button"
          onClick={() => setShowElo(true)}
          aria-label="Chess Path ELO — see the full rating graph and how it's calculated"
          className="shrink-0 rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-2.5 text-left tap-highlight active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wide text-chess-blue">
                Chess Path ELO
              </span>
              <span className="rounded-full bg-chess-blue/10 px-1.5 py-px text-[8px] font-black uppercase tracking-wide text-chess-blue">
                Beta
              </span>
            </div>
            <span className="text-[10px] font-bold text-chess-text-faint">How it&apos;s calculated ›</span>
          </div>
          <div className="mt-1 flex items-end gap-3">
            <div className="shrink-0 text-3xl font-black tabular-nums leading-none text-chess-text">
              {dash?.elo ? dash.elo.current.toLocaleString() : '—'}
            </div>
            <EloSparkline series={dash?.elo?.series ?? null} loading={dash === null} />
          </div>
        </button>

        {/* The week, in bars — the same chart as the website profile */}
        <div className="shrink-0">
          <WeekChart data={dash?.week ?? null} loading={dash === null} />
        </div>

        {/* Fight record — hidden until there's a bout, no wall of zeros */}
        {record && record.total > 0 && (
          <div className="shrink-0 rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-3">
            <div className="text-xs font-black uppercase tracking-wide text-chess-text-muted mb-1.5">
              Fight record
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black tabular-nums text-chess-text">
                {record.wins}–{record.losses}–{record.draws}
              </div>
              <div className="text-xs font-bold text-chess-text-muted">
                {record.kos} by checkmate · {record.total} bouts
              </div>
            </div>
          </div>
        )}

        {/* Chess Boxing Pro — history rows open bottom sheets (no-scroll rule) */}
        {proFlag && user && (
          <div className="shrink-0 rounded-2xl bg-chess-surface border border-slate-200 shadow-sm divide-y divide-slate-100">
            <HistoryRow
              title="Fight history"
              value={hist ? `${hist.bouts.length + hist.lockedBouts} bouts` : '…'}
              onClick={() => setSheet('bouts')}
            />
            <HistoryRow
              title="Punch log"
              value={hist ? `${hist.punchLog.length + hist.lockedPunches} sessions` : '…'}
              onClick={() => setSheet('punches')}
            />
            {!pro.isPro && (
              <HistoryRow title="Go Pro" value="Full history" gold onClick={() => pro.openPaywall('profile')} />
            )}
          </div>
        )}

        {/* Trophy case — one compact row (no-scroll rule); the full case
            opens as a bottom sheet, same escape hatch as the ELO card.
            Renders nothing until there's at least one medal. */}
        <TrophyCaseRow />

        {/* Lifetime tiles — one compact row so the whole card fits an SE */}
        <div className="flex-1 min-h-0 grid grid-cols-3 gap-2 content-start">
          <Tile
            label="Points"
            value={dash?.stats ? dash.stats.workoutPoints.toLocaleString() : '—'}
          />
          <Tile
            label="Puzzles"
            value={dash?.stats ? dash.stats.puzzlesSolved.toLocaleString() : '—'}
          />
          <Tile
            label="Games"
            value={dash?.stats ? dash.stats.gamesPlayed.toLocaleString() : '—'}
          />
        </div>
      </div>

      {/* Chess Boxing Pro history sheets */}
      {proFlag && sheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setSheet(null)}>
          <div
            className="w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-chess-page px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <h2 className="text-lg font-black text-chess-text px-1">
              {sheet === 'bouts' ? 'Fight history' : 'Punch log'}
            </h2>
            <p className="text-xs font-semibold text-chess-text-muted px-1 mb-3">
              {sheet === 'bouts'
                ? 'Every bout, newest first. Tap Go Pro to keep all of them.'
                : 'Punches landed per session, from the camera rounds.'}
            </p>
            <div className="rounded-2xl bg-chess-surface border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {sheet === 'bouts' &&
                (hist?.bouts ?? []).map((b) => (
                  <div key={b.id} className="px-4 py-3 flex items-center gap-3">
                    <span
                      className={`w-9 shrink-0 text-center rounded-lg py-1 text-[11px] font-black uppercase ${
                        b.result === 'win'
                          ? 'bg-chess-green/15 text-chess-green-dark'
                          : b.result === 'loss'
                            ? 'bg-chess-red/15 text-chess-red'
                            : 'bg-slate-100 text-chess-text-muted'
                      }`}
                    >
                      {b.result === 'win' ? 'W' : b.result === 'loss' ? 'L' : 'D'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-chess-text truncate">
                        {outcomeLabel(b.outcome)} · Lv {b.level}
                      </div>
                      <div className="text-[11px] font-semibold text-chess-text-muted truncate">
                        {b.userCards.length + 1} rounds · {b.moves} moves · {b.punches} punches
                        {b.userCards.length > 0 && ` · cards ${b.userCards.join('/')} vs ${b.rookieCards.join('/')}`}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-black tabular-nums text-chess-text">{b.points}</div>
                      <div className="text-[10px] font-semibold text-chess-text-muted">{shortDate(b.createdAt)}</div>
                    </div>
                  </div>
                ))}
              {sheet === 'punches' &&
                (hist?.punchLog ?? []).map((e) => (
                  <div key={e.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-chess-text">{e.kind === 'bout' ? 'Bout' : 'Workout'}</div>
                      <div className="text-[11px] font-semibold text-chess-text-muted">{shortDate(e.createdAt)}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-black tabular-nums text-chess-text">{e.punches.toLocaleString()}</div>
                      <div className="text-[10px] font-semibold text-chess-text-muted">punches</div>
                    </div>
                  </div>
                ))}
              {hist && (sheet === 'bouts' ? hist.bouts : hist.punchLog).length === 0 && (
                <div className="px-4 py-6 text-center text-sm font-semibold text-chess-text-muted">
                  {sheet === 'bouts' ? 'No bouts yet. The first one goes here.' : 'No punches counted yet. Turn on the camera game in a round.'}
                </div>
              )}
              {/* Locked tail for free users — blurred placeholders, never real data */}
              {hist &&
                !hist.isPro &&
                Array.from({ length: Math.min(4, sheet === 'bouts' ? hist.lockedBouts : hist.lockedPunches) }).map((_, i) => (
                  <div key={`lock-${i}`} className="px-4 py-3 flex items-center gap-3 select-none" aria-hidden>
                    <span className="w-9 h-6 rounded-lg bg-slate-200 blur-[3px]" />
                    <div className="flex-1">
                      <div className="h-3 w-2/3 rounded bg-slate-200 blur-[3px]" />
                      <div className="mt-1.5 h-2.5 w-1/2 rounded bg-slate-100 blur-[3px]" />
                    </div>
                    <div className="h-4 w-8 rounded bg-slate-200 blur-[3px]" />
                  </div>
                ))}
              {hist && !hist.isPro && (
                <HistoryRow
                  title="Go Pro"
                  value={
                    (sheet === 'bouts' ? hist.lockedBouts : hist.lockedPunches) > 0
                      ? `${sheet === 'bouts' ? hist.lockedBouts : hist.lockedPunches} more`
                      : 'Keep everything'
                  }
                  gold
                  onClick={() => pro.openPaywall(sheet === 'bouts' ? 'bout_history' : 'punch_log')}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => setSheet(null)}
              className="mt-3 w-full rounded-2xl bg-chess-surface border border-slate-200 py-3 text-sm font-black text-chess-text tap-highlight"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {pro.paywall}

      {/* Chess Path ELO sheet — the website's rating card, app-compact */}
      {showElo && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setShowElo(false)}
        >
          <div
            className="w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-chess-page px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <RookieRatingCard data={dash?.elo ?? null} loading={dash === null} />
            <EloExplainer />
            <button
              type="button"
              onClick={() => setShowElo(false)}
              className="mt-3 w-full rounded-2xl bg-chess-surface border border-slate-200 py-3 text-sm font-black text-chess-text tap-highlight"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Plain-English version of lib/elo/estimate.ts — keep in sync with the model
 * (baseline, provisional period, puzzle-vs-game weighting) if it changes.
 */
function EloExplainer() {
  return (
    <div className="mt-3 rounded-3xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-4">
      <h3 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
        How your ELO is calculated
      </h3>
      <ul className="mt-2 space-y-2 text-[13px] font-semibold leading-snug text-chess-text">
        <li>
          We never ask for a rating — we estimate one from everything you do here, replayed in
          order through standard Elo math.
        </li>
        <li>
          Every puzzle is a mini-match against an opponent rated at that puzzle&apos;s difficulty:
          solve it and your rating rises, miss it and it dips. Beating something above your level
          moves it most.
        </li>
        <li>
          Full games against Rookie — Chess Boxing bouts included — count double a puzzle, with
          her level setting the opponent rating (Level 1 ≈ 200, up to Level 10 ≈ 2000).
        </li>
        <li>
          Winning a bout by checkmate at your level promotes you: Rookie steps up a level
          everywhere, including regular play.
        </li>
        <li>
          Everyone starts at {ELO_BASELINE}. Your first {PROVISIONAL_EVENTS} results move the
          number fast so it finds your real level, then it settles down and shifts gradually.
        </li>
        <li>It&apos;s an honest estimate (Beta) — it can go down on a rough day — not an official rating.</li>
      </ul>
    </div>
  );
}

/**
 * Compact all-time rating line for the profile card — same series the full
 * RookieRatingCard plots, no toggles, sized to share a row with the number.
 */
function EloSparkline({ series, loading }: { series: EloSeriesPoint[] | null; loading: boolean }) {
  const W = 100;
  const H = 100;
  const PAD_Y = 10;

  if (loading) return <div className="h-10 flex-1 animate-pulse rounded-lg bg-slate-100" />;
  if (!series || series.length < 2) {
    return (
      <div className="h-10 flex-1 flex items-end">
        <span className="text-[11px] font-semibold leading-tight text-chess-text-muted">
          Solve puzzles or play games and your rating line fills in here.
        </span>
      </div>
    );
  }

  const elos = series.map((p) => p.elo);
  const lo = Math.min(...elos);
  const hi = Math.max(...elos);
  const span = Math.max(1, hi - lo);
  const n = series.length;
  const coords = series.map((p, i) => ({
    x: (i / (n - 1)) * W,
    y: PAD_Y + (1 - (p.elo - lo) / span) * (H - PAD_Y * 2),
  }));
  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;
  const last = coords[coords.length - 1];

  return (
    <div className="relative h-10 flex-1 min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="boxEloFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chess-blue, #3b82f6)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-chess-blue, #3b82f6)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#boxEloFill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-chess-blue, #3b82f6)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={last.x}
          cy={last.y}
          r={3}
          fill="var(--color-chess-blue, #3b82f6)"
          stroke="white"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function HistoryRow({
  title,
  value,
  onClick,
  gold,
}: {
  title: string;
  value: string;
  onClick: () => void;
  gold?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 min-h-[44px] text-left tap-highlight"
    >
      <span className={`text-sm font-black ${gold ? 'text-chess-gold-dark' : 'text-chess-text'}`}>{title}</span>
      <span className="flex items-center gap-1 text-xs font-bold text-chess-text-muted">
        {value}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  );
}

function outcomeLabel(outcome: string): string {
  switch (outcome) {
    case 'ko_win': return 'Checkmate';
    case 'ko_loss': return 'Got mated';
    case 'flag_loss': return 'Flagged';
    case 'decision_win': return 'Decision win';
    case 'decision_loss': return 'Decision loss';
    case 'draw': return 'Draw';
    default: return outcome.replace(/_/g, ' ');
  }
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-2 py-2.5 text-center min-w-0">
      <div className="text-lg font-black tabular-nums text-chess-text truncate">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted truncate">
        {label}
      </div>
    </div>
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
