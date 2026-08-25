'use client';

import Link from 'next/link';
import { WeekChart, type WeekData } from '@/components/shared/WeekChart';

/**
 * CornerRoom — the Chess Boxing profile screen ("Your corner"), as pure
 * presentation. The route (app/box/profile) owns auth and data; this owns the
 * look, so it can be rendered with mock numbers at /test/box-profile and
 * actually looked at. The first version of this screen shipped without anyone
 * seeing it signed-in, and it was flat white.
 *
 * WHY IT'S A ROOM AND NOT A CARD STACK (Tyler: "a chill looking room"):
 * v1 drew the room as two near-identical pale blue bands on a pale blue page,
 * which is to say it drew nothing. The room only reads if the floor is a
 * different MATERIAL from the wall, not a slightly different tint — so the
 * floor is warm wood against a cool wall, with a baseboard and a shadow at the
 * seam. That contrast is the whole illusion; keep it if you retint this.
 *
 * Still cheap: flat CSS bands and two gradients, no image, nothing to load.
 * Still light, per the house style — warm wood, not a dark gym.
 */

export interface CornerRoomProps {
  name: string;
  /** null while loading. */
  days: number | null;
  fights: number | null;
  /** null while loading; '—' shows when there's no rating yet. */
  rating: string | null;
  week: WeekData | null;
  weekLoading: boolean;
}

export function CornerRoom({ name, days, fights, rating, week, weekLoading }: CornerRoomProps) {
  return (
    <div className="h-full overflow-hidden bg-[#eef3fa] relative">
      <RoomBackdrop />

      <div className="relative h-full max-w-lg md:max-w-xl mx-auto w-full px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3 flex flex-col">
        {/* WALL — the nameplate centres in the space above the floor line, so
            there's no dead middle. */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
          <Hook />
          <div className="relative rounded-lg bg-[#fdfbf6] border border-[#d8cdb8] shadow-[0_5px_14px_-4px_rgba(76,60,40,0.3)] px-7 py-3 max-w-full">
            <Screw className="left-2 top-2" />
            <Screw className="right-2 top-2" />
            <Screw className="left-2 bottom-2" />
            <Screw className="right-2 bottom-2" />
            <div className="text-[9px] font-black uppercase tracking-[0.32em] text-[#a1907a] text-center">
              Your corner
            </div>
            <div className="mt-1 text-xl md:text-2xl font-black text-[#3d3323] text-center leading-tight break-all">
              {name}
            </div>
          </div>
        </div>

        {/* FLOOR — everything below stands on the boards. */}
        <div className="shrink-0 grid grid-cols-3 gap-2.5">
          <Stat label="Day streak" value={days === null ? null : String(days)} />
          <Stat label="Fights" value={fights === null ? null : String(fights)} />
          <Stat label="Rating" value={rating} />
        </div>

        {/* WeekChart draws its own "This week" header — don't add a second. */}
        <div className="shrink-0 mt-2.5 rounded-2xl bg-white/95 border border-white shadow-[0_8px_20px_-8px_rgba(76,60,40,0.45)] p-3">
          <WeekChart data={week} loading={weekLoading} />
        </div>

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
 * Wall, baseboard, wood floor, and a light hanging over it.
 *
 * The floor line sits at 46%. The first pass put it at 68% and the floor came
 * out a sliver behind the cards — the room read as a white page. It has to be
 * a real band you can see, or none of this is doing anything.
 *
 * Plank lines are a repeating-gradient — free, and they're what stops the
 * floor reading as "a beige rectangle".
 */
export function RoomBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* wall */}
      <div className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-[#f4f7fc] via-[#e9eff8] to-[#dde6f2]" />

      {/* light thrown from above onto the wall */}
      <div
        className="absolute inset-x-0 top-0 h-[38%]"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% -10%, rgba(255,252,242,0.95) 0%, rgba(255,252,242,0) 72%)',
        }}
      />

      {/* baseboard + the shadow it casts down onto the boards */}
      <div className="absolute inset-x-0 top-[46%] -translate-y-full h-2.5 bg-[#cdd7e6]" />
      <div className="absolute inset-x-0 top-[46%] h-[3px] bg-[#a08c6f]" />
      <div
        className="absolute inset-x-0 top-[46%] h-8"
        style={{ background: 'linear-gradient(to bottom, rgba(90,68,40,0.30), rgba(90,68,40,0))' }}
      />

      {/* wood floor */}
      <div className="absolute inset-x-0 top-[46%] bottom-0 bg-gradient-to-b from-[#e2d5c0] to-[#d2c1a6]" />

      {/* planks */}
      <div
        className="absolute inset-x-0 top-[46%] bottom-0 opacity-[0.5]"
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(120,92,58,0.20) 0 1px, rgba(120,92,58,0) 1px 74px)',
        }}
      />
      <div
        className="absolute inset-x-0 top-[46%] bottom-0 opacity-40"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(120,92,58,0.16) 0 1px, rgba(120,92,58,0) 1px 46px)',
        }}
      />

      {/* pooled light on the floor */}
      <div
        className="absolute inset-x-0 top-[40%] bottom-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 50% 30%, rgba(255,250,238,0.72) 0%, rgba(255,250,238,0) 70%)',
        }}
      />
    </div>
  );
}

/** The nail the plate hangs from. */
function Hook() {
  return <span className="block w-1.5 h-1.5 rounded-full bg-[#b9c4d4] mb-1.5" />;
}

function Screw({ className }: { className: string }) {
  return <span className={`absolute ${className} w-[3px] h-[3px] rounded-full bg-[#c9bda6]`} />;
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl bg-white/95 border border-white shadow-[0_6px_16px_-6px_rgba(76,60,40,0.4)] px-2 py-3 text-center">
      {value === null ? (
        <div className="h-7 w-10 mx-auto rounded bg-slate-100 animate-pulse" />
      ) : (
        <div className="text-2xl font-black text-chess-text leading-none tabular-nums">{value}</div>
      )}
      <div className="mt-1.5 text-[9.5px] font-black uppercase tracking-[0.14em] text-chess-text-muted leading-none">
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
