'use client';

import Link from 'next/link';
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
 * THE ROOM: a room only reads if the floor is a different MATERIAL from the
 * wall, not a slightly different tint — warm wood with plank lines against a
 * cool wall, a baseboard, and the shadow it casts. That contrast is the whole
 * illusion; keep it if you retint. Flat CSS, no image, nothing to load.
 */

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
  /** null while loading. */
  days: number | null;
  record: CornerRoomRecord | null;
  /** null while loading; null-with-loaded means "not rated yet". */
  elo: CornerRoomElo | null;
  loading: boolean;
  week: WeekData | null;
}

export function CornerRoom({ name, days, record, elo, loading, week }: CornerRoomProps) {
  return (
    <div className="h-full overflow-hidden bg-[#eef3fa] relative">
      <RoomBackdrop />

      <div className="relative h-full max-w-lg md:max-w-xl mx-auto w-full px-5 pt-[max(0.85rem,env(safe-area-inset-top))] pb-3 flex flex-col">
        {/* Name — small, top, gold frame. */}
        <div className="shrink-0 flex justify-center">
          <GoldPlate name={name} />
        </div>

        {/* Leftover height is SPLIT between wall above and floor below, so the
            content sits in the room rather than piling at one end. Anchoring
            it all at the top left ~275px of blank floor; flexing the week card
            to fill left a giant white box with a small chart in it. */}
        <div className="flex-1 min-h-[12px]" />

        <RatingCard elo={elo} loading={loading} />

        {/* Streak / record / KOs. None of these repeat the chart below — an
            earlier pass had a "this week" tile sitting directly on top of a
            chart already headed "This week, 1,840 pts". */}
        <div className="shrink-0 mt-2.5 grid grid-cols-3 gap-2.5">
          <Stat label="Day streak" value={days === null ? null : String(days)} />
          <Stat
            label="Record"
            value={record === null ? null : `${record.wins}\u2013${record.losses}`}
          />
          <Stat label="Knockouts" value={record === null ? null : String(record.kos)} />
        </div>

        {/* WeekChart draws its own "This week" header — don't add a second.
            Natural height: letting this flex to fill turned it into a giant
            white box with a small chart floating in the middle of it. */}
        <div className="shrink-0 mt-2.5 rounded-2xl bg-white/95 border border-white shadow-[0_8px_20px_-8px_rgba(76,60,40,0.45)] p-3">
          <WeekChart data={week} loading={loading} />
        </div>

        <div className="flex-1 min-h-0" />

        <Link
          href="/box/settings"
          className="shrink-0 mt-1 mx-auto text-xs font-bold text-[#7d6f5c] py-2 min-h-[44px] inline-flex items-center gap-1.5 tap-highlight"
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
      className="rounded-full p-[2px] shadow-[0_3px_8px_-2px_rgba(120,90,20,0.4)] max-w-full"
      style={{
        background:
          'linear-gradient(145deg, #f6e6a8 0%, #d4af37 28%, #a8801f 52%, #e8cf85 76%, #c9a227 100%)',
      }}
    >
      <div className="rounded-full bg-[#fffdf6] px-4 py-1.5 flex items-center gap-2 max-w-full">
        <span className="text-[8.5px] font-black uppercase tracking-[0.22em] text-[#a8801f] shrink-0">
          Corner
        </span>
        <span className="w-px h-3 bg-[#e4d3a0] shrink-0" />
        <span className="text-[13px] font-black text-[#4a3c1f] leading-none truncate">
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
    <div className="shrink-0 rounded-2xl bg-white/95 border border-white shadow-[0_8px_20px_-8px_rgba(76,60,40,0.45)] px-4 py-3">
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
      {/* wall */}
      <div className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-[#f4f7fc] via-[#e9eff8] to-[#dde6f2]" />

      {/* light thrown from above onto the wall */}
      <div
        className="absolute inset-x-0 top-0 h-[22%]"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% -10%, rgba(255,252,242,0.95) 0%, rgba(255,252,242,0) 72%)',
        }}
      />

      {/* baseboard + the shadow it casts down onto the boards */}
      <div className="absolute inset-x-0 top-[26%] -translate-y-full h-2.5 bg-[#cdd7e6]" />
      <div className="absolute inset-x-0 top-[26%] h-[3px] bg-[#a08c6f]" />
      <div
        className="absolute inset-x-0 top-[26%] h-8"
        style={{ background: 'linear-gradient(to bottom, rgba(90,68,40,0.30), rgba(90,68,40,0))' }}
      />

      {/* wood floor */}
      <div className="absolute inset-x-0 top-[26%] bottom-0 bg-gradient-to-b from-[#e2d5c0] to-[#d2c1a6]" />

      {/* planks */}
      <div
        className="absolute inset-x-0 top-[26%] bottom-0 opacity-50"
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(120,92,58,0.20) 0 1px, rgba(120,92,58,0) 1px 74px)',
        }}
      />
      <div
        className="absolute inset-x-0 top-[26%] bottom-0 opacity-40"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(120,92,58,0.16) 0 1px, rgba(120,92,58,0) 1px 46px)',
        }}
      />

      {/* pooled light on the floor */}
      <div
        className="absolute inset-x-0 top-[20%] bottom-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 50% 30%, rgba(255,250,238,0.72) 0%, rgba(255,250,238,0) 70%)',
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl bg-white/95 border border-white shadow-[0_6px_16px_-6px_rgba(76,60,40,0.4)] px-2 py-2.5 text-center">
      {value === null ? (
        <div className="h-6 w-9 mx-auto rounded bg-slate-100 animate-pulse" />
      ) : (
        <div className="text-xl font-black text-chess-text leading-none tabular-nums">{value}</div>
      )}
      <div className="mt-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-chess-text-muted leading-none">
        {label}
      </div>
    </div>
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
