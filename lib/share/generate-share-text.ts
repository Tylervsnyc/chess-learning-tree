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

// Rook shape: 6 rows top-to-bottom, 5 columns.
// Each cell: { idx: puzzleIndex, emoji: colored square } or null (empty space).
// Puzzle indices match GRID_POSITIONS order (bottom-to-top in the OG route).
const ROOK_GRID: (({ idx: number; emoji: string }) | null)[][] = [
  [{ idx: 19, emoji: '🟦' }, null, { idx: 20, emoji: '🟦' }, null, { idx: 21, emoji: '🟪' }],
  [{ idx: 14, emoji: '🟩' }, { idx: 15, emoji: '🟨' }, { idx: 16, emoji: '🟧' }, { idx: 17, emoji: '🟥' }, { idx: 18, emoji: '🟥' }],
  [null, { idx: 11, emoji: '🟦' }, { idx: 12, emoji: '🟦' }, { idx: 13, emoji: '🟪' }, null],
  [null, { idx: 8, emoji: '🟩' }, { idx: 9, emoji: '🟨' }, { idx: 10, emoji: '🟧' }, null],
  [null, { idx: 5, emoji: '🟥' }, { idx: 6, emoji: '🟥' }, { idx: 7, emoji: '🟦' }, null],
  [{ idx: 0, emoji: '🟦' }, { idx: 1, emoji: '🟪' }, { idx: 2, emoji: '🟩' }, { idx: 3, emoji: '🟨' }, { idx: 4, emoji: '🟧' }],
];

function buildRookGrid(results: Record<string, 'correct' | 'wrong'>, allPuzzleIds: string[]): string {
  return ROOK_GRID.map(row =>
    row.map(cell => {
      if (!cell) return '  ';
      const id = allPuzzleIds[cell.idx];
      return id && results[id] === 'correct' ? cell.emoji : '⬜';
    }).join('')
  ).join('\n');
}

export function generateDailyChallengeShareText(input: DailyChallengeShareInput): string {
  const { puzzleResults, allPuzzleIds, puzzlesSolved, totalPuzzles, timeMs, beatPct } = input;

  const grid = buildRookGrid(puzzleResults, allPuzzleIds);

  const lines: string[] = [
    `♚ The Daily Rook`,
    formatDate(),
    '',
    grid,
    '',
    `Score: ${puzzlesSolved}/${totalPuzzles} · ${formatTime(timeMs)}`,
  ];

  if (beatPct !== null && beatPct > 0) {
    lines.push(`Beat ${beatPct}% of players`);
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
