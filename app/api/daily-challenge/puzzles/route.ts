import { NextResponse } from 'next/server';
import dailyPuzzles from '@/data/daily-challenge-puzzles.json';

/**
 * GET /api/daily-challenge/puzzles
 *
 * Returns today's daily challenge puzzles - same for all users.
 * Puzzles are pre-generated and stored in data/daily-challenge-puzzles.json.
 *
 * The pre-generated file contains 90 days of puzzles, each with:
 * - 20 puzzles per day
 * - Progressive difficulty (400 → 2600 ELO)
 * - Variety of tactical themes
 *
 * To regenerate: npx ts-node scripts/generate-daily-puzzles.ts
 */
export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  // Look up today's puzzles from pre-generated data
  const puzzles = (dailyPuzzles as { days: Record<string, unknown[]> }).days[today];

  if (!puzzles || puzzles.length === 0) {
    // Fallback: coverage expired, return error with info
    return NextResponse.json({
      error: 'Daily challenge puzzles not available for today',
      message: 'Puzzle coverage has expired. Please regenerate.',
      coverage: {
        start: (dailyPuzzles as { coverageStart: string }).coverageStart,
        end: (dailyPuzzles as { coverageEnd: string }).coverageEnd,
      },
      requestedDate: today,
    }, { status: 503 });
  }

  return NextResponse.json({
    date: today,
    puzzles,
  });
}
