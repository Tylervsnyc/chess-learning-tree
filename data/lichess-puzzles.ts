// Lichess puzzle format
export interface LichessPuzzle {
  puzzleId: string;
  fen: string;
  moves: string;      // Space-separated UCI moves (first is opponent's last move, rest is solution)
  rating: number;
  themes: string;     // Space-separated themes
  gameUrl: string;
  openingTags?: string;
}

// Review decision for a puzzle
export interface PuzzleReview {
  puzzleId: string;
  decision: 'approved' | 'rejected' | 'maybe';
  assignedTheme: string | null;  // Our curriculum theme ID (e.g., "1.4.4")
  notes: string;
  reviewedAt: string;
}

// Sample puzzles from Lichess database - focusing on defensive themes
// Format: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
export const samplePuzzles: LichessPuzzle[] = [
  {
    puzzleId: "009tE",
    fen: "r2q1rk1/pp2ppbp/2n3p1/3P4/2P1P3/2N5/PP3PPP/R2QKB1R b KQ - 0 12",
    moves: "c6d4 d1d4 d8d4",
    rating: 1200,
    themes: "crushing middlegame short",
    gameUrl: "https://lichess.org/example1",
  },
  {
    puzzleId: "00Alf",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    moves: "h5f7",
    rating: 600,
    themes: "mateIn1 oneMove short",
    gameUrl: "https://lichess.org/example2",
  },
  // Add more puzzles below - you can paste from Lichess CSV
];

// Parse a line from Lichess puzzle CSV
export function parseLichessCSVLine(line: string): LichessPuzzle | null {
  const parts = line.split(',');
  if (parts.length < 8) return null;

  return {
    puzzleId: parts[0],
    fen: parts[1],
    moves: parts[2],
    rating: parseInt(parts[3], 10),
    themes: parts[7],
    gameUrl: parts[8] || '',
    openingTags: parts[9] || '',
  };
}

// Parse multiple CSV lines
export function parseLichessCSV(csv: string): LichessPuzzle[] {
  const lines = csv.trim().split('\n');
  const puzzles: LichessPuzzle[] = [];

  for (const line of lines) {
    // Skip header
    if (line.startsWith('PuzzleId')) continue;
    const puzzle = parseLichessCSVLine(line);
    if (puzzle) puzzles.push(puzzle);
  }

  return puzzles;
}
