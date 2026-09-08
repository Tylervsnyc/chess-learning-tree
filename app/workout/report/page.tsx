'use client';

/**
 * /workout/report?id=<sessionId> — the post-workout report.
 *
 * Query-param twin of /workout/report/[id], and the form every link in the
 * app uses: the Chess Boxing iOS app is a static export, which can prerender
 * /workout/report but not /workout/report/<uuid> (same trick as /review?id=).
 * Thin wrapper; the page lives in components/workout/WorkoutReport.
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { WorkoutReport } from '@/components/workout/WorkoutReport';
import { ArenaScene } from '@/components/chessboxing/Arena';
import { FullBleedShell } from '@/components/chessboxing/FullBleedShell';

/** No session in the URL — say so kindly and point back to the workout. */
function NoReport() {
  return (
    <div className="h-full relative overflow-hidden bg-[#131a2e] flex flex-col">
      <FullBleedShell />
      <ArenaScene />
      <div className="flex-1 min-h-0 relative z-10 overflow-y-auto ring-scroll pt-[max(4rem,calc(env(safe-area-inset-top)+3.5rem))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto w-full px-5 py-6 flex flex-col items-center text-center gap-5">
          <h1 className="text-2xl font-black text-white">No report to open</h1>
          <p className="text-sm text-white/60 max-w-xs">
            Finish a Chess Boxing workout and your report shows up right after — every miss, what you played, and the answer.
          </p>
          <Link href="/workout?from=box" className="w-full max-w-xs">
            <button className="w-full min-h-[44px] rounded-2xl bg-chess-blue hover:bg-chess-blue-dark text-white font-black text-lg py-4 shadow-[0_4px_0_0_#0d7ec4] active:translate-y-[2px] active:shadow-none transition">
              Start a workout
            </button>
          </Link>
          <Link href="/box" className="text-sm font-bold text-white/60 hover:text-white underline underline-offset-2">
            Back to the gym
          </Link>
        </div>
      </div>
    </div>
  );
}

function ReportFromQuery() {
  const id = useSearchParams().get('id');
  if (!id) return <NoReport />;
  return <WorkoutReport sessionId={id} />;
}

export default function WorkoutReportPage() {
  return (
    <Suspense fallback={<div className="h-full bg-[#131a2e]" />}>
      <ReportFromQuery />
    </Suspense>
  );
}
