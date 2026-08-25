'use client';

import Link from 'next/link';
import type { StreakData } from '@/lib/streak-client';
import { StreakHero } from '@/components/shared/StreakHero';
import { WeekChart, type WeekData } from '@/components/shared/WeekChart';
import { rookieRating, type EloSeriesPoint } from '@/lib/elo/rookie-rating';

/**
 * CornerRoom — the Chess Boxing profile screen ("Your corner"), pure
 * presentation. The route (app/box/profile) owns auth and data.
 *
 * Iterate on it at /test/box-profile, which renders it with mock numbers.
 * This screen needs a session, so a screenshot of the real route only ever
 * shows the sign-in gate — the first version shipped flat white because it was
 * designed without ever being seen with data on it.
 *
 * LAYOUT (Tyler, v2 of the room): the name is a small gold-framed plate at the
 * TOP — it was a slab eating half the screen. Everything below is the actual
 * content: estimated rating first (the number people care about), then the
 * three day-to-day counts, then the week.
 *
 * THE ROOM (Tyler: "wooden backgrounds like a finished basement", then
 * "darker"): dark stained vertical paneling on the wall, stained baseboard,
 * deeper boards on the floor, and a bare bulb over the corner. Entirely flat
 * CSS gradients — no image, nothing to load, scales to any size. The floor
 * stays a shade deeper than the wall so the two read as different surfaces
 * rather than one big brown field.
 *
 * EVERY window is gold-framed (see Framed) and every window is cream inside.
 * On a dark ground that isn't decoration: dark copy laid straight on the wood
 * is unreadable, which is exactly how the Settings link and the signed-out
 * state each broke the first time this went brown. If you add a surface here,
 * frame it.
 */

/**
 * One gold. Every frame on this screen uses it, so they read as the same metal
 * — a slightly different gold on each card looks like a mistake.
 */
const GOLD =
  'linear-gradient(145deg, #f7e9b0 0%, #d9b544 22%, #9d7519 48%, #eeda94 72%, #c19b1f 100%)';

/**
 * A gold-framed window. The frame is a gradient BOX behind an inset panel, not
 * a flat border colour, so the metal catches light down one edge and darkens
 * on the other. Inner radius is deliberately a few px tighter than the outer,
 * which is what stops the corners looking like a sticker.
 */
export function Framed({
  children,
  className = '',
  thickness = 3,
  outer = 'rounded-2xl',
  inner = 'rounded-[13px]',
}: {
  children: React.ReactNode;
  className?: string;
  thickness?: number;
  outer?: string;
  inner?: string;
}) {
  return (
    <div
      className={`${outer} shadow-[0_8px_20px_-8px_rgba(40,22,4,0.75)] ${className}`}
      style={{ background: GOLD, padding: thickness }}
    >
      <div className={`${inner} bg-[#fffdf7] h-full`}>{children}</div>
    </div>
  );
}

export interface CornerRoomElo {
  current: number;
  events: number;
  series: EloSeriesPoint[];
}

export interface CornerRoomRecord {
  wins: number;
  losses: number;
  kos: number;
  total: number;
}

export interface CornerRoomProps {
  name: string;
  /** Passed straight through to the shared StreakHero. null = still loading. */
  streak: StreakData | null;
  record: CornerRoomRecord | null;
  /** null while loading; null-with-loaded means "not rated yet". */
  elo: CornerRoomElo | null;
  loading: boolean;
  week: WeekData | null;
}

export function CornerRoom({ name, streak, record, elo, loading, week }: CornerRoomProps) {
  return (
    <div className="h-full overflow-hidden bg-[#754c26] relative">
      <RoomBackdrop />

      <div className="relative h-full max-w-lg md:max-w-xl mx-auto w-full px-5 pt-[max(0.85rem,env(safe-area-inset-top))] pb-3 flex flex-col">
        {/* Name — small, top, gold frame. */}
        <div className="shrink-0 flex justify-center">
          <GoldPlate name={name} />
        </div>

        {/* THE STREAK. Same fire, same rules, same copy as chesspath.app —
            it IS that component (components/shared/StreakHero), not a
            reimplementation. Sits in what used to be dead wall. */}
        <div className="shrink-0 mt-2.5">
          <Framed className="w-full" thickness={4}>
            <div className="p-1.5">
              <StreakHero streak={streak} tone="compact" />
            </div>
          </Framed>
        </div>

        <div className="shrink-0 mt-2.5">
          <RatingCard elo={elo} loading={loading} />
        </div>

        {/* Streak / record / KOs. None of these repeat the chart below — an
            earlier pass had a "this week" tile sitting directly on top of a
            chart already headed "This week, 1,840 pts". */}
        <div className="shrink-0 mt-2.5 grid grid-cols-2 gap-2.5">
          <Stat
            label="Record"
            value={record === null ? null : `${record.wins}\u2013${record.losses}`}
          />
          <Stat label="Knockouts" value={record === null ? null : String(record.kos)} />
        </div>

        {/* WeekChart draws its own "This week" header — don't add a second.
            Natural height: letting this flex to fill turned it into a giant
            white box with a small chart floating in the middle of it. */}
        <Framed className="shrink-0 mt-2.5" thickness={4}>
          <div className="p-3">
            <WeekChart data={week} loading={loading} />
          </div>
        </Framed>

        <div className="flex-1 min-h-0" />

        <Link
          href="/box/settings"
          className="shrink-0 mt-1 mx-auto text-xs font-black text-[#43301a] px-4 min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-[#e3c193]/90 border border-[#f2dcb4]/80 shadow-[0_2px_6px_-1px_rgba(60,36,10,0.4)] tap-highlight"
        >
          <GearIcon />
          Settings
        </Link>
      </div>
    </div>
  );
}

/**
 * The name, framed in gold. Small on purpose — it's a label, not the content.
 * The frame is a gradient border (two stacked rounded boxes) rather than a
 * flat gold stroke, so it catches light like actual metal.
 */
function GoldPlate({ name }: { name: string }) {
  return (
    <div
      className="rounded-full p-[6px] shadow-[0_5px_14px_-3px_rgba(40,22,4,0.8)] max-w-full"
      style={{ background: GOLD }}
    >
      <div className="rounded-full bg-[#fffdf7] px-5 py-2 flex items-center gap-2.5 max-w-full ring-1 ring-[#8a6a12]/25">
        <span className="text-[8.5px] font-black uppercase tracking-[0.22em] text-[#9d7519] shrink-0">
          Corner
        </span>
        <span className="w-px h-3.5 bg-[#e0cb92] shrink-0" />
        <span className="text-[14px] font-black text-[#40340f] leading-none truncate">
          {name}
        </span>
      </div>
    </div>
  );
}

/**
 * Estimated rating — the number people actually open this screen for, and the
 * one thing /profile had that this didn't.
 *
 * Deliberately NOT components/profile/RookieRatingCard: that one carries a
 * Week/Month/Since-start toggle and a full chart, which is a scrolling web
 * card. This is the same DATA and the same VOICE (rookieRating() is the one
 * source for the tier line) at a size that fits a no-scroll phone screen.
 */
function RatingCard({ elo, loading }: { elo: CornerRoomElo | null; loading: boolean }) {
  const rated = !!elo && elo.events > 0;
  const voice = rated ? rookieRating(elo!.current, elo!.series) : null;

  return (
    <Framed className="shrink-0" thickness={4}>
      <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-chess-text-muted">
          Estimated rating
        </span>
        <span className="text-[8.5px] font-black uppercase tracking-widest text-chess-text-muted bg-slate-100 rounded-full px-2 py-0.5">
          Beta
        </span>
      </div>

      <div className="mt-1.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {loading ? (
            <div className="h-9 w-20 rounded bg-slate-100 animate-pulse" />
          ) : (
            <div className="text-[34px] leading-none font-black text-chess-text tabular-nums">
              {rated ? elo!.current : '—'}
            </div>
          )}
          <div className="mt-1 text-[11px] font-bold text-chess-text-muted truncate">
            {loading ? '' : rated ? voice!.tier : 'Play a few rounds to get rated'}
          </div>
        </div>

        {rated && elo!.series.length > 1 && (
          <Sparkline series={elo!.series} />
        )}
      </div>
      </div>
    </Framed>
  );
}

/** Tiny rating trend. No axes, no labels — shape only. */
function Sparkline({ series }: { series: EloSeriesPoint[] }) {
  const pts = series.slice(-30);
  const vals = pts.map((p) => p.elo);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const W = 92;
  const H = 34;
  const d = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * W;
      const y = H - ((p.elo - min) / span) * (H - 4) - 2;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const last = pts[pts.length - 1];
  const lastX = W;
  const lastY = H - ((last.elo - min) / span) * (H - 4) - 2;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0 overflow-visible" aria-hidden>
      <path d={d} fill="none" stroke="#1CB0F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="3" fill="#1CB0F6" />
    </svg>
  );
}

/**
 * Wall, baseboard, wood floor, and a light hanging over it.
 *
 * The floor line sits at 26% — the wall is the band the nameplate hangs on,
 * and everything else stands on the boards. Earlier passes put it at 68% then
 * 46%; both left the floor as a sliver hidden behind the cards, and the room
 * read as a white page. It has to be a band you can actually see.
 */
export function RoomBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* ── WALL: vertical knotty-pine paneling ───────────────────────────── */}
      <div className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-[#8c5f33] to-[#754c26]" />
      {/* grain — irregular widths so it doesn't read as a barcode */}
      <div
        className="absolute inset-x-0 top-0 h-[26%] opacity-[0.35]"
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(30,16,4,0.16) 0 2px, rgba(226,182,124,0.12) 2px 5px, rgba(30,16,4,0) 5px 13px, rgba(30,16,4,0.11) 13px 15px, rgba(30,16,4,0) 15px 23px)',
        }}
      />
      {/* the panel grooves: a dark cut with a lit bevel on its right edge */}
      <div
        className="absolute inset-x-0 top-0 h-[26%]"
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(38,22,8,0.75) 0 2px, rgba(214,168,106,0.45) 2px 4px, rgba(0,0,0,0) 4px 46px)',
        }}
      />

      {/* ── BASEBOARD: stained trim, and the shadow it throws on the floor ── */}
      <div className="absolute inset-x-0 top-[26%] -translate-y-full h-3 bg-[#4c2f14]" />
      <div className="absolute inset-x-0 top-[26%] -translate-y-full h-[2px] bg-[#6d4520]" />
      <div className="absolute inset-x-0 top-[26%] h-[2px] bg-[#2a1808]" />
      <div
        className="absolute inset-x-0 top-[26%] h-9"
        style={{ background: 'linear-gradient(to bottom, rgba(72,44,16,0.38), rgba(72,44,16,0))' }}
      />

      {/* ── FLOOR: horizontal boards, a shade deeper than the walls ───────── */}
      <div className="absolute inset-x-0 top-[26%] bottom-0 bg-gradient-to-b from-[#6f4620] to-[#573517]" />
      {/* board seams */}
      <div
        className="absolute inset-x-0 top-[26%] bottom-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(24,12,4,0.6) 0 2px, rgba(206,158,98,0.14) 2px 3px, rgba(0,0,0,0) 3px 52px)',
        }}
      />
      {/* staggered board ends */}
      <div
        className="absolute inset-x-0 top-[26%] bottom-0 opacity-40"
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(24,12,4,0.6) 0 2px, rgba(0,0,0,0) 2px 118px)',
        }}
      />
      {/* grain along the boards */}
      <div
        className="absolute inset-x-0 top-[26%] bottom-0 opacity-25"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(90,58,24,0.10) 0 1px, rgba(0,0,0,0) 1px 7px)',
        }}
      />

      {/* ── the bare bulb over the corner ─────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-[45%]"
        style={{
          background:
            'radial-gradient(ellipse 55% 100% at 50% -12%, rgba(255,232,180,0.55) 0%, rgba(255,240,205,0) 70%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-[22%] bottom-0"
        style={{
          background:
            'radial-gradient(ellipse 52% 46% at 50% 22%, rgba(255,232,180,0.34) 0%, rgba(255,240,208,0) 72%)',
        }}
      />
      {/* corners fall off, the way a basement does */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 88% 74% at 50% 38%, rgba(20,10,2,0) 58%, rgba(20,10,2,0.34) 100%)',
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return (
    <Framed thickness={3}>
      <div className="px-2 py-2.5 text-center">
      {value === null ? (
        <div className="h-6 w-9 mx-auto rounded bg-slate-100 animate-pulse" />
      ) : (
        <div className="text-xl font-black text-chess-text leading-none tabular-nums">{value}</div>
      )}
      <div className="mt-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted leading-none">
        {label}
      </div>
      </div>
    </Framed>
  );
}

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1.02-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.02H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03z" />
    </svg>
  );
}
