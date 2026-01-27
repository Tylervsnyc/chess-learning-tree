import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { Chess } from 'chess.js';
import { PUZZLE_VALIDATION_RULES } from '@/data/curriculum-v2-config';

// Mate pattern tags from Lichess
const MATE_TAGS = [
  'mate', 'mateIn1', 'mateIn2', 'mateIn3', 'mateIn4', 'mateIn5',
  'backRankMate', 'smotheredMate', 'hookMate', 'arabianMate', 'anastasiasMate',
  'bodensMate', 'doubleBishopMate', 'operaMate', 'pillsburysMate', 'suffocationMate',
];

// Fast primary theme prediction - no chess.js, just tag analysis
function fastPredictPrimaryTheme(themes: string[]): { theme: string; reasoning: string } {
  // Check for mate patterns first
  const hasMate = themes.some(t => MATE_TAGS.includes(t));

  if (hasMate) {
    // Look for specific mate pattern
    const matePattern = themes.find(t =>
      ['backRankMate', 'smotheredMate', 'hookMate', 'arabianMate', 'anastasiasMate',
       'bodensMate', 'doubleBishopMate', 'operaMate', 'pillsburysMate', 'suffocationMate'].includes(t)
    );
    if (matePattern) {
      return { theme: matePattern, reasoning: `Checkmate with ${matePattern} pattern` };
    }
    const mateInN = themes.find(t => t.startsWith('mateIn'));
    if (mateInN) {
      return { theme: mateInN, reasoning: `${mateInN} puzzle` };
    }
    return { theme: 'checkmate', reasoning: 'Checkmate puzzle' };
  }

  // Material-winning: look for mechanisms
  const mechanism = themes.find(t => ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck'].includes(t));
  if (mechanism) {
    return { theme: mechanism, reasoning: `${mechanism} wins material` };
  }

  // Enablers
  const enabler = themes.find(t => ['deflection', 'attraction', 'clearance', 'interference', 'sacrifice'].includes(t));
  if (enabler) {
    return { theme: enabler, reasoning: `${enabler} enables the tactic` };
  }

  // Fallback
  return { theme: themes[0] || 'tactical', reasoning: 'General tactical puzzle' };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
    else current += char;
  }
  result.push(current);
  return result;
}

// Apply the setup move to get the actual puzzle position
function getPuzzleFen(fen: string, moves: string): string {
  try {
    const chess = new Chess(fen);
    const moveList = moves.split(' ');
    if (moveList.length > 0) {
      const setupMove = moveList[0];
      chess.move({
        from: setupMove.slice(0, 2),
        to: setupMove.slice(2, 4),
        promotion: setupMove.length > 4 ? setupMove[4] : undefined,
      });
    }
    return chess.fen();
  } catch {
    return fen; // Return original if parsing fails
  }
}

// Map Lichess theme names to our hierarchy themes
const LICHESS_TO_HIERARCHY: Record<string, string> = {
  // MECHANISMS
  fork: 'fork',
  pin: 'pin',
  skewer: 'skewer',
  discoveredAttack: 'discoveredAttack',
  doubleCheck: 'doubleCheck',
  xRayAttack: 'xRayAttack',

  // ENABLERS
  attraction: 'attraction',
  deflection: 'deflection',
  clearance: 'clearance',
  capturingDefender: 'destructionOfDefender',
  interference: 'interference',
  sacrifice: 'sacrifice',

  // OUTCOMES (Lichess uses various mate-related tags)
  mate: 'checkmate',
  mateIn1: 'checkmate',
  mateIn2: 'checkmate',
  mateIn3: 'checkmate',
  mateIn4: 'checkmate',
  backRankMate: 'checkmate',
  smotheredMate: 'checkmate',
  hookMate: 'checkmate',
  arabianMate: 'checkmate',
  anastasiasMate: 'checkmate',
  bodensMate: 'checkmate',
  doubleBishopMate: 'checkmate',
  operaMate: 'checkmate',
  pillsburysMate: 'checkmate',
  suffocationMate: 'checkmate',
  crushing: 'materialGain',
  advantage: 'advantage',
  hangingPiece: 'materialGain',
  trappedPiece: 'materialGain',

  // FORCING (usually incidental, not primary)
  // These are usually "how" you do something, not "what" you're learning
};

// Get player move count from UCI moves string
function getPlayerMoveCount(moves: string): number {
  const moveList = moves.split(' ').slice(1); // Remove setup move
  return Math.ceil(moveList.length / 2);
}

// Check if a theme matches the puzzle's PRIMARY theme
// Simplified validation that aligns with chain analysis results
function validateThemeAsPrimary(
  requestedTheme: string,
  lichessThemes: string[],
  moves: string,
  predictedPrimaryTheme: string
): { valid: boolean; reason: string } {
  const normalizedRequested = requestedTheme.toLowerCase();
  const normalizedPrimary = predictedPrimaryTheme.toLowerCase();

  // Direct match with predicted primary theme
  if (normalizedPrimary === normalizedRequested) {
    return { valid: true, reason: 'Direct primary theme match' };
  }

  // Handle partial matches (e.g., "mateIn2" matches "mate")
  if (normalizedPrimary.includes(normalizedRequested) || normalizedRequested.includes(normalizedPrimary)) {
    return { valid: true, reason: 'Primary theme match' };
  }

  // For mechanisms (fork, pin, skewer, discoveredAttack), check if this is truly a material-winning puzzle
  // NOT a checkmate puzzle. The key insight: if fastPredictPrimaryTheme returned a mechanism,
  // it means there's no mate tag, so this is a valid material-winning mechanism puzzle.
  const mechanisms = ['fork', 'pin', 'skewer', 'discoveredattack', 'doublecheck'];
  if (mechanisms.includes(normalizedRequested)) {
    // If the predicted primary is also a mechanism (not mate), it's valid
    if (mechanisms.includes(normalizedPrimary)) {
      return { valid: true, reason: 'Mechanism puzzle (material-winning)' };
    }
    // If predicted primary is a mate pattern, the mechanism is absorbed
    return { valid: false, reason: 'Mechanism absorbed by checkmate outcome' };
  }

  // For enablers (deflection, attraction, etc.), they should be the primary theme
  const enablers = ['deflection', 'attraction', 'clearance', 'interference', 'sacrifice'];
  if (enablers.includes(normalizedRequested)) {
    if (normalizedPrimary === normalizedRequested) {
      return { valid: true, reason: 'Enabler as primary theme' };
    }
    // Enablers can also be valid if the puzzle is tagged with both enabler and mechanism
    // and no mate pattern (material-winning combination)
    const hasMate = lichessThemes.some(t =>
      t === 'mate' || t.startsWith('mateIn') ||
      ['backRankMate', 'smotheredMate', 'hookMate', 'arabianMate'].includes(t)
    );
    if (!hasMate && lichessThemes.includes(requestedTheme)) {
      return { valid: true, reason: 'Enabler in material-winning combination' };
    }
  }

  // For mate patterns
  if (normalizedRequested === 'mate' || normalizedRequested === 'checkmate') {
    if (normalizedPrimary.includes('mate') || normalizedPrimary === 'checkmate') {
      return { valid: true, reason: 'Checkmate puzzle' };
    }
  }

  return { valid: false, reason: 'Theme not primary' };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const theme = searchParams.get('theme');
  const connectedTheme = searchParams.get('connected'); // Optional: filter by connected theme
  const level = searchParams.get('level') || '400-800';
  const limit = parseInt(searchParams.get('limit') || '5');

  if (!theme) {
    return NextResponse.json({ error: 'theme parameter required' }, { status: 400 });
  }

  // Map level to file
  const levelToFile: Record<string, string> = {
    '400-800': '0400-0800.csv',
    '800-1200': '0800-1200.csv',
    '1200-1600': '1200-1600.csv',
  };

  const fileName = levelToFile[level];
  if (!fileName) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'data', 'puzzles-by-rating', fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Puzzle file not found' }, { status: 404 });
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').slice(1); // Skip header

  const puzzles: Array<{
    id: string;
    fen: string;
    moves: string;
    rating: number;
    themes: string[];
    primaryTheme: string;
    reasoning: string;
    url: string;
  }> = [];

  // Sample every Nth line for performance, look for matching puzzles
  const SAMPLE_RATE = 5; // Check more puzzles since we filter by primary theme now

  for (let i = 0; i < lines.length && puzzles.length < limit; i += SAMPLE_RATE) {
    const line = lines[i];
    if (!line?.trim()) continue;

    const fields = parseCsvLine(line);
    if (fields.length < 8) continue;

    const [puzzleId, fen, moves, rating, , , , themesStr] = fields;
    if (!puzzleId || !themesStr) continue;

    const themes = themesStr.split(' ').filter(Boolean);

    // Quick pre-filter: puzzle must at least have the theme tag
    if (!themes.includes(theme)) continue;

    // Use fast validation - no chess.js overhead
    const prediction = fastPredictPrimaryTheme(themes);
    const primaryTheme = prediction.theme;

    // Validate using curriculum v2 rules
    const validation = validateThemeAsPrimary(theme, themes, moves, primaryTheme);
    if (!validation.valid) {
      continue;
    }
    const reasoning = validation.reason;

    // If connected theme specified, check for that too
    if (connectedTheme && !themes.includes(connectedTheme)) continue;

    puzzles.push({
      id: puzzleId,
      fen: getPuzzleFen(fen, moves), // Apply setup move to get actual puzzle position
      moves,
      rating: parseInt(rating) || 0,
      themes,
      primaryTheme,
      reasoning,
      url: `https://lichess.org/training/${puzzleId}`,
    });
  }

  // If we didn't find enough with sampling, do a more thorough search
  if (puzzles.length < limit) {
    for (let i = 0; i < lines.length && puzzles.length < limit; i++) {
      if (i % SAMPLE_RATE === 0) continue; // Skip already checked

      const line = lines[i];
      if (!line?.trim()) continue;

      const fields = parseCsvLine(line);
      if (fields.length < 8) continue;

      const [puzzleId, fen, moves, rating, , , , themesStr] = fields;
      if (!puzzleId || !themesStr) continue;

      const themes = themesStr.split(' ').filter(Boolean);

      if (!themes.includes(theme)) continue;
      if (connectedTheme && !themes.includes(connectedTheme)) continue;

      // Check if we already have this puzzle
      if (puzzles.some(p => p.id === puzzleId)) continue;

      // Use fast validation - no chess.js overhead
      const prediction = fastPredictPrimaryTheme(themes);
      const primaryTheme = prediction.theme;

      // Validate using curriculum v2 rules
      const validation = validateThemeAsPrimary(theme, themes, moves, primaryTheme);
      if (!validation.valid) {
        continue;
      }
      const reasoning = validation.reason;

      puzzles.push({
        id: puzzleId,
        fen: getPuzzleFen(fen, moves),
        moves,
        rating: parseInt(rating) || 0,
        themes,
        primaryTheme,
        reasoning,
        url: `https://lichess.org/training/${puzzleId}`,
      });
    }
  }

  return NextResponse.json({
    theme,
    connectedTheme,
    level,
    count: puzzles.length,
    puzzles,
  });
}
