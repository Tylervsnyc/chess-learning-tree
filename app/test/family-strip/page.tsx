'use client';

import { useState } from 'react';
import { FamilyStrip } from '@/components/shared/FamilyStrip';
import type { StreakData } from '@/lib/streak-client';

/**
 * Test page: the "Your Chess" strip (components/shared/FamilyStrip.tsx) in
 * every state, ignoring the FAMILY_STRIP flag. Container MUST be
 * overflow-auto (body is overflow:hidden globally).
 *
 * On the web the strip shows tiles for Chess Boxing + Rookie's Revenge; inside
 * the Chess Path app it shows Chess Boxing + Revenge, inside Chess Boxing it
 * shows Chess Path + Revenge (lib/family/apps.ts currentApp()).
 */

const STREAK: StreakData = { current: 12, longest: 31, completedToday: true, activeDays: [] };

export default function FamilyStripTestPage() {
  const [signedIn, setSignedIn] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="mx-auto max-w-xl px-4 py-6 space-y-8">
        <header>
          <h1 className="text-xl font-black text-chess-text">Your Chess strip</h1>
          <p className="text-sm text-chess-text-muted mt-1">
            Lives on /profile (Chess Path) and the Corner Room (Chess Boxing). Same account, same numbers, tiles open the other apps.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setSignedIn((v) => !v)}
              className="min-h-[44px] rounded-xl bg-white px-4 text-sm font-bold text-chess-text shadow-sm"
            >
              {signedIn ? 'Show signed out' : 'Show signed in'}
            </button>
            <button
              type="button"
              onClick={() => setLoading((v) => !v)}
              className="min-h-[44px] rounded-xl bg-white px-4 text-sm font-bold text-chess-text shadow-sm"
            >
              {loading ? 'Show loaded' : 'Show loading'}
            </button>
          </div>
        </header>

        <section>
          <h2 className="mb-2 text-xs font-black uppercase tracking-wide text-chess-text-muted">Chess Path profile (light)</h2>
          <FamilyStrip streak={STREAK} elo={1174} loading={loading} signedIn={signedIn} tone="light" />
        </section>

        <section className="rounded-2xl bg-[#0b1220] p-4">
          <h2 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Corner Room (dark)</h2>
          <FamilyStrip streak={STREAK} elo={1174} loading={loading} signedIn={signedIn} tone="dark" />
        </section>

        <section>
          <h2 className="mb-2 text-xs font-black uppercase tracking-wide text-chess-text-muted">Phone width (360px)</h2>
          <div className="w-[360px] max-w-full rounded-2xl border border-dashed border-chess-gray-light p-2">
            <FamilyStrip streak={STREAK} elo={1174} loading={loading} signedIn={signedIn} tone="light" />
          </div>
        </section>
      </div>
    </div>
  );
}
