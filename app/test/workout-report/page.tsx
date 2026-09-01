'use client';

/**
 * /test/workout-report — visual check for the interactive miss replay.
 * Feeds today's real misses (session 09071a4e…) through the same hook the
 * report page uses. The second miss gets a FAKE played move (Qxc5) so the
 * red-arrow → Show me → green-arrow flow can be seen without signing in.
 * Rookie lines need auth (aiGuard) — they'll show the skeleton here.
 */
import { MissReplay } from '@/components/workout/MissReplay';
import { useMissAnalysis } from '@/hooks/useMissAnalysis';

const MISSES = [
  { id: 'GjTnf', fen: '3k4/R4p2/4p3/2Np4/3P3p/1KP4q/4p1r1/R7 b - - 3 41', moves: ['g2g3', 'a7d7', 'd8e8', 'a1a8'], rating: 1530, puzzleId: 'GjTnf' },
  { id: 'NJO1s', fen: '3r2k1/2q2p2/3p1bp1/p2Q3p/1pP5/1P1R3P/P2N2P1/7K b - - 4 31', moves: ['c7c5', 'd2e4', 'c5d5', 'e4f6', 'g8g7', 'f6d5'], rating: 1867, puzzleId: 'NJO1s' },
  { id: 'HmXaY', fen: '3R1k2/7B/1p3p2/pPp2P2/8/1b6/r4P1P/6K1 b - - 7 41', moves: ['f8f7', 'h7g8', 'f7e7', 'g8b3', 'a2b2', 'd8d3'], rating: 1844, puzzleId: 'HmXaY' },
];

export default function TestWorkoutReport() {
  const r = useMissAnalysis(MISSES, 'test-session');
  return (
    <div className="h-full overflow-auto bg-[#131a2e] p-4">
      <div className="max-w-md mx-auto space-y-8">
        <p className="text-sm text-white/60">status: {r.status} · progress {Math.round(r.progress * 100)}%</p>
        {r.analyses.map((a, i) => (
          <div key={a.puzzleId} className="bg-white/[0.04] border border-white/10 rounded-2xl p-3">
            <p className="text-xs font-bold text-white/45 mb-2">Miss {i + 1} · {a.puzzleId} · {a.rating}</p>
            <MissReplay analysis={a} line={r.lines[i]} lineLoading={r.status !== 'done' && r.status !== 'error'} />
          </div>
        ))}
      </div>
    </div>
  );
}
