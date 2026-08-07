'use client';

/**
 * /test/punch-zones — QUADRANT FIGHT prototype (NOT linked from the app).
 *
 * The game itself now lives in components/box/QuadrantFight.tsx (shared with
 * the Chess Boxing workout + Bout opt-in). This page is the full-page harness:
 * same game, page chrome only. Game logic/tuning is FROZEN — edit nothing
 * about timing, judging, or scoring without a playtest.
 */

import QuadrantFight from '@/components/box/QuadrantFight';

export default function PunchZonesPage() {
  return (
    <div className="h-full overflow-auto bg-slate-950 text-white">
      <div className="mx-auto max-w-lg px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quadrant Fight <span className="text-slate-500 text-sm font-normal">/test prototype</span></h1>
          <p className="text-slate-400 text-sm">Punch the green squares. Dodge the red. From round 3 they overlap.</p>
        </div>

        <QuadrantFight />

        <p className="text-slate-400 text-xs">
          Yellow dots = wrists · blue ring = head · each lit square has its own clock.
          Amber −N = damage you dealt · red −N = damage you took.
          Round 3+: up to 2 commands at once · round 6+: up to 3. MoveNet Lightning via CDN — zero app deps.
        </p>
      </div>
    </div>
  );
}
