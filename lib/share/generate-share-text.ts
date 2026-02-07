/**
 * Wordle-style text share generators for daily challenge and lesson completion.
 * Pure functions — no React dependencies.
 */

interface DailyChallengeShareInput {
  puzzleResults: Record<string, 'correct' | 'wrong'>;
  allPuzzleIds: string[];
  puzzlesSolved: number;
  totalPuzzles: number;
  timeMs: number;
  streak: number;
  beatPct: number | null;
}

interface LessonShareInput {
  puzzleResults: ('correct' | 'wrong')[];
  correctCount: number;
  lessonName: string;
  streak: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `0:${seconds.toString().padStart(2, '0')}`;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatDate(): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

export function generateDailyChallengeShareText(input: DailyChallengeShareInput): string {
  const { puzzleResults, allPuzzleIds, puzzlesSolved, totalPuzzles, timeMs, streak, beatPct } = input;

  // Build emoji grid from puzzle order
  const grid = allPuzzleIds
    .map(id => {
      const result = puzzleResults[id];
      if (result === 'correct') return '🟩';
      return '🟥'; // wrong or unattempted
    })
    .join('');

  const lines: string[] = [
    `♚ Chess Path · Daily Challenge`,
    formatDate(),
    '',
    grid,
    '',
    `Score: ${puzzlesSolved}/${totalPuzzles} · ${formatTime(timeMs)}`,
  ];

  if (beatPct !== null && beatPct > 0) {
    lines.push(`Beat ${beatPct}% of players`);
  }

  if (streak > 0) {
    lines.push(`🔥 ${streak} day streak`);
  }

  lines.push('');
  lines.push('chesspath.app/daily-challenge');

  return lines.join('\n');
}

export function generateLessonShareText(input: LessonShareInput): string {
  const { puzzleResults, correctCount, lessonName, streak } = input;

  // Build emoji grid (always 6 squares for lessons)
  const grid = puzzleResults
    .map(r => r === 'correct' ? '🟩' : '🟥')
    .join('');

  const lines: string[] = [
    `♚ Chess Path · ${lessonName}`,
    `Score: ${correctCount}/${puzzleResults.length}`,
    '',
    grid,
  ];

  if (streak > 0) {
    lines.push('');
    lines.push(`🔥 ${streak} day streak`);
  }

  lines.push('');
  lines.push('chesspath.app');

  return lines.join('\n');
}
