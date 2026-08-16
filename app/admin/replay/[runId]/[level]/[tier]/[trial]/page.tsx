/**
 * Replay viewer for a single Rookie's Run playtest sim.
 *
 * URL pattern: /admin/playtest-replay/[runId]/[level]/[tier]/[trial]
 *
 * Fetches the trace JSON from GitHub raw (path:
 * data/run-playtest/traces/{runId}__{level}__{tier}__{trial}.json). When the
 * trace doesn't exist yet, we show a CLI hint so the operator can generate
 * it. The actual turn-by-turn UI is a client component (`ReplayClient`)
 * because the swipe / button navigation needs state — the page itself is a
 * server component so it can fetch the trace from GitHub server-side and
 * pass it down already deserialized.
 *
 * Auth: the parent `/admin/layout.tsx` already enforces the admin gate.
 */

import { ReplayClient } from './ReplayClient';
import type { DecisionTrace } from '@/scripts/run-playtest/types';

// Refresh frequently because traces are generated on-demand and we want
// changes to show up quickly without forcing the operator to hard-reload.
export const revalidate = 30;
export const dynamic = 'force-dynamic';

const REPO = 'Tylervsnyc/rookies-run';

interface PageProps {
  params: Promise<{
    runId: string;
    level: string;
    tier: string;
    trial: string;
  }>;
}

async function fetchTrace(
  runId: string,
  level: string,
  tier: string,
  trial: string,
): Promise<DecisionTrace | null> {
  const url = `https://raw.githubusercontent.com/${REPO}/main/data/run-playtest/traces/${runId}__${level}__${tier}__${trial}.json`;
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as DecisionTrace;
  } catch {
    return null;
  }
}

export default async function PlaytestReplayPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { runId, level, tier, trial } = await params;
  const trace = await fetchTrace(runId, level, tier, trial);

  if (!trace) {
    const cmd = `npx tsx scripts/run-playtest/trace.ts ${runId} ${level} ${tier} ${trial}`;
    return (
      <div className="h-full overflow-auto bg-stone-50 text-stone-900">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="text-2xl font-bold">Replay not found</h1>
          <p className="mt-2 text-sm text-stone-600">
            No trace JSON has been generated for{' '}
            <code className="rounded bg-stone-200 px-1 py-0.5 text-xs">
              {runId} / level {level} / {tier} / trial {trial}
            </code>{' '}
            yet.
          </p>
          <p className="mt-4 text-sm">Run this command to generate it:</p>
          <pre className="mt-2 overflow-auto rounded-lg border border-stone-200 bg-white p-3 text-xs">
            {cmd}
          </pre>
          <p className="mt-3 text-xs text-stone-500">
            Then commit the file in{' '}
            <code className="rounded bg-stone-200 px-1 py-0.5">
              data/run-playtest/traces/
            </code>{' '}
            and push to main. The page revalidates every 30s.
          </p>
        </div>
      </div>
    );
  }

  return <ReplayClient trace={trace} />;
}
