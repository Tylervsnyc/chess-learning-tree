import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cron-auth';
import { createServiceClient } from '@/lib/supabase/service';

interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  action: string;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const metrics: Record<string, number | string | null> = {};
  const suggestions: Suggestion[] = [];
  const errors: string[] = [];

  // --- Query puzzle_attempts for yesterday ---
  try {
    const { data: attempts, error: attemptsError } = await supabase
      .from('puzzle_attempts')
      .select('puzzle_id, is_correct, themes')
      .gte('created_at', `${yesterday}T00:00:00.000Z`)
      .lt('created_at', `${today}T00:00:00.000Z`);

    if (attemptsError) {
      console.error('Content report: puzzle_attempts query failed:', attemptsError);
      errors.push('puzzle_attempts');
      metrics.hardest_puzzle = null;
      metrics.hardest_puzzle_rate = null;
      metrics.easiest_puzzle = null;
      metrics.avg_accuracy = null;
      metrics.most_attempted_theme = null;
      metrics.total_attempts_yesterday = null;
    } else {
      const allAttempts = attempts || [];
      metrics.total_attempts_yesterday = allAttempts.length;

      if (allAttempts.length > 0) {
        // Group by puzzle_id
        const puzzleStats: Record<string, { correct: number; total: number }> = {};
        const themeCounts: Record<string, number> = {};
        let totalCorrect = 0;

        for (const attempt of allAttempts) {
          const pid = attempt.puzzle_id;
          if (!puzzleStats[pid]) {
            puzzleStats[pid] = { correct: 0, total: 0 };
          }
          puzzleStats[pid].total++;
          if (attempt.is_correct) {
            puzzleStats[pid].correct++;
            totalCorrect++;
          }

          // Count themes
          const themes = attempt.themes;
          if (Array.isArray(themes)) {
            for (const theme of themes) {
              themeCounts[String(theme)] = (themeCounts[String(theme)] || 0) + 1;
            }
          } else if (typeof themes === 'string' && themes) {
            themeCounts[themes] = (themeCounts[themes] || 0) + 1;
          }
        }

        // Overall accuracy
        metrics.avg_accuracy = Math.round((totalCorrect / allAttempts.length) * 10000) / 100;

        // Find hardest and easiest puzzles (min 5 attempts)
        let hardestPuzzle: string | null = null;
        let hardestRate = 100;
        let easiestPuzzle: string | null = null;
        let easiestRate = 0;

        for (const [pid, stats] of Object.entries(puzzleStats)) {
          if (stats.total < 5) continue;
          const rate = (stats.correct / stats.total) * 100;
          if (rate < hardestRate) {
            hardestRate = rate;
            hardestPuzzle = pid;
          }
          if (rate > easiestRate) {
            easiestRate = rate;
            easiestPuzzle = pid;
          }
        }

        metrics.hardest_puzzle = hardestPuzzle;
        metrics.hardest_puzzle_rate = hardestPuzzle ? Math.round(hardestRate * 100) / 100 : null;
        metrics.easiest_puzzle = easiestPuzzle;

        // Most attempted theme
        const topTheme = Object.entries(themeCounts)
          .sort(([, a], [, b]) => b - a)[0];
        metrics.most_attempted_theme = topTheme ? topTheme[0] : null;
      } else {
        metrics.hardest_puzzle = null;
        metrics.hardest_puzzle_rate = null;
        metrics.easiest_puzzle = null;
        metrics.avg_accuracy = null;
        metrics.most_attempted_theme = null;
      }
    }
  } catch (err) {
    console.error('Content report: unexpected error:', err);
    errors.push('puzzle_attempts_unexpected');
    metrics.hardest_puzzle = null;
    metrics.hardest_puzzle_rate = null;
    metrics.easiest_puzzle = null;
    metrics.avg_accuracy = null;
    metrics.most_attempted_theme = null;
    metrics.total_attempts_yesterday = null;
  }

  // --- Generate suggestions ---
  if (typeof metrics.hardest_puzzle_rate === 'number' && metrics.hardest_puzzle_rate < 15) {
    suggestions.push({
      priority: 'high',
      title: 'Extremely hard puzzle',
      detail: `Puzzle ${metrics.hardest_puzzle} has only ${metrics.hardest_puzzle_rate}% success rate — may be too hard for its slot`,
      action: 'Review puzzle difficulty and consider moving it to a harder level',
    });
  }

  if (typeof metrics.avg_accuracy === 'number') {
    if (metrics.avg_accuracy < 40) {
      suggestions.push({
        priority: 'medium',
        title: 'Low overall accuracy',
        detail: `Overall accuracy at ${metrics.avg_accuracy}% — puzzles may be too challenging`,
        action: 'Review puzzle difficulty curve and consider adding easier puzzles',
      });
    }
    if (metrics.avg_accuracy > 80) {
      suggestions.push({
        priority: 'medium',
        title: 'High overall accuracy',
        detail: `Overall accuracy at ${metrics.avg_accuracy}% — puzzles may be too easy`,
        action: 'Consider adding more challenging puzzles to maintain engagement',
      });
    }
  }

  if (typeof metrics.total_attempts_yesterday === 'number' && metrics.total_attempts_yesterday < 20) {
    suggestions.push({
      priority: 'low',
      title: 'Low puzzle engagement',
      detail: `Only ${metrics.total_attempts_yesterday} attempts yesterday — low engagement with puzzles`,
      action: 'Promote puzzles more prominently in the app',
    });
  }

  // --- Store report ---
  const { error: upsertError } = await supabase
    .from('dashboard_reports')
    .upsert({
      report_type: 'content',
      generated_at: new Date().toISOString(),
      period: today,
      metrics,
      suggestions,
      raw_data: { errors },
    }, { onConflict: 'report_type,period' });

  if (upsertError) {
    console.error('Content report: failed to store:', upsertError);
    return NextResponse.json(
      { error: `Failed to store report: ${upsertError.message}` },
      { status: 500 }
    );
  }

  console.log(`[Content Report] Generated for ${today}: attempts=${metrics.total_attempts_yesterday}, accuracy=${metrics.avg_accuracy}%, ${suggestions.length} suggestions`);

  return NextResponse.json({
    success: true,
    report_type: 'content',
    period: today,
    metrics,
    suggestions,
    errors: errors.length > 0 ? errors : undefined,
  });
}
