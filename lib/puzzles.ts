import fs from 'fs';
import path from 'path';
import readline from 'readline';

export interface Puzzle {
  puzzleId: string;
  fen: string;
  moves: string[];  // Array of UCI moves
  rating: number;
  themes: string[];
  gameUrl: string;
}

// Get the rating bracket for a given ELO
export function getRatingBracket(elo: number): string {
  if (elo < 800) return '0400-0800';
  if (elo < 1200) return '0800-1200';
  if (elo < 1600) return '1200-1600';
  if (elo < 2000) return '1600-2000';
  return '2000-plus';
}

// Get all available themes for a rating bracket
export function getAvailableThemes(ratingBracket: string): string[] {
  const dir = path.join(process.cwd(), 'data', 'puzzles-by-rating', ratingBracket);
  try {
    const files = fs.readdirSync(dir);
    return files
      .filter(f => f.endsWith('.csv'))
      .map(f => f.replace('.csv', ''));
  } catch {
    return [];
  }
}

// Parse a CSV line into a Puzzle object
function parseCSVLine(line: string): Puzzle | null {
  // CSV format: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
  const parts = line.split(',');
  if (parts.length < 9 || parts[0] === 'PuzzleId') return null;

  return {
    puzzleId: parts[0],
    fen: parts[1],
    moves: parts[2].split(' '),
    rating: parseInt(parts[3], 10),
    themes: parts[7].split(' '),
    gameUrl: parts[8],
  };
}

// Get random puzzles from a theme file using reservoir sampling
export async function getRandomPuzzles(
  ratingBracket: string,
  theme: string,
  count: number = 10,
  minRating?: number,
  maxRating?: number
): Promise<Puzzle[]> {
  const filePath = path.join(
    process.cwd(),
    'data',
    'puzzles-by-rating',
    ratingBracket,
    `${theme}.csv`
  );

  if (!fs.existsSync(filePath)) {
    return [];
  }

  return new Promise((resolve, reject) => {
    const reservoir: Puzzle[] = [];
    let lineCount = 0;

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      const puzzle = parseCSVLine(line);
      if (!puzzle) return;

      // Filter by rating if specified
      if (minRating && puzzle.rating < minRating) return;
      if (maxRating && puzzle.rating > maxRating) return;

      lineCount++;

      // Reservoir sampling algorithm
      if (reservoir.length < count) {
        reservoir.push(puzzle);
      } else {
        const randomIndex = Math.floor(Math.random() * lineCount);
        if (randomIndex < count) {
          reservoir[randomIndex] = puzzle;
        }
      }
    });

    rl.on('close', () => {
      // Shuffle the reservoir for good measure
      for (let i = reservoir.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [reservoir[i], reservoir[j]] = [reservoir[j], reservoir[i]];
      }
      resolve(reservoir);
    });

    rl.on('error', reject);
  });
}

// Get a single random puzzle
export async function getRandomPuzzle(
  ratingBracket: string,
  theme?: string,
  minRating?: number,
  maxRating?: number
): Promise<Puzzle | null> {
  // If no theme specified, pick a random one
  const themes = theme ? [theme] : getAvailableThemes(ratingBracket);
  if (themes.length === 0) return null;

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  const puzzles = await getRandomPuzzles(ratingBracket, selectedTheme, 1, minRating, maxRating);

  return puzzles[0] || null;
}

// Theme display names
export const THEME_DISPLAY_NAMES: Record<string, string> = {
  advancedPawn: 'Advanced Pawn',
  attraction: 'Attraction',
  backRankMate: 'Back Rank Mate',
  bishopEndgame: 'Bishop Endgame',
  clearance: 'Clearance',
  defensiveMove: 'Defensive Move',
  deflection: 'Deflection',
  discoveredAttack: 'Discovered Attack',
  endgame: 'Endgame',
  exposedKing: 'Exposed King',
  fork: 'Fork',
  hangingPiece: 'Hanging Piece',
  interference: 'Interference',
  knightEndgame: 'Knight Endgame',
  mateIn1: 'Mate in 1',
  mateIn2: 'Mate in 2',
  mateIn3: 'Mate in 3',
  pawnEndgame: 'Pawn Endgame',
  pin: 'Pin',
  promotion: 'Promotion',
  queenEndgame: 'Queen Endgame',
  quietMove: 'Quiet Move',
  rookEndgame: 'Rook Endgame',
  sacrifice: 'Sacrifice',
  skewer: 'Skewer',
  trappedPiece: 'Trapped Piece',
  zugzwang: 'Zugzwang',
  crushing: 'Crushing',
  advantage: 'Advantage',
  equality: 'Equality',
  mate: 'Mate',
  middlegame: 'Middlegame',
  opening: 'Opening',
  short: 'Short',
  long: 'Long',
  veryLong: 'Very Long',
};
