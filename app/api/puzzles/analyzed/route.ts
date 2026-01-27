import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Serve pre-analyzed puzzles from chain analysis JSON files
// These have been verified with move-by-move tactical analysis

interface AnalyzedPuzzle {
  puzzleId: string;
  fen: string;
  puzzleFen: string;
  playerColor: 'white' | 'black';
  moveCount: number;
  outcome: {
    type: string;
    materialGained?: number;
  };
  moves: Array<{
    moveNumber: number;
    san: string;
    theme: {
      name: string;
      level: string;
      confidence: number;
      evidence: string;
    };
  }>;
  verdict: {
    primaryTheme: string;
    teachAs: string;
    confidence: number;
  };
}

interface ChainAnalysisStats {
  total: number;
  byPrimaryTheme: Record<string, number>;
  byOutcome: Record<string, number>;
  combinations: {
    total: number;
    clean: number;
    flows: Record<string, number>;
  };
  confidence: {
    high: number;
    medium: number;
    low: number;
  };
}

interface ChainAnalysisData {
  level: string;
  minPlays?: number;
  stats: ChainAnalysisStats;
  examples: {
    cleanCombinations: AnalyzedPuzzle[];
    pureThemes: Record<string, AnalyzedPuzzle[]>;
  };
}

// Cache loaded data
const dataCache: Record<string, { data: ChainAnalysisData; fileName: string }> = {};

function loadData(level: string, minPlays: number): { data: ChainAnalysisData; fileName: string } | null {
  const cacheKey = `${level}-${minPlays}`;
  if (dataCache[cacheKey]) return dataCache[cacheKey];

  // Build filename based on minPlays
  // 0 = unfiltered, otherwise use the plays suffix
  const suffix = minPlays > 0 ? `-${minPlays}plays` : '';
  const fileName = `chain-analysis-${level}${suffix}.json`;
  const filePath = path.join(process.cwd(), 'data', fileName);

  if (!fs.existsSync(filePath)) {
    return null; // Don't fall back - let the API return an error so user knows
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as ChainAnalysisData;
    dataCache[cacheKey] = { data, fileName };
    return { data, fileName };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const theme = searchParams.get('theme');
  const level = searchParams.get('level') || '400-800';
  const limit = parseInt(searchParams.get('limit') || '5');
  const type = searchParams.get('type') || 'pure'; // 'pure' or 'combination'
  const minPlays = parseInt(searchParams.get('minPlays') || '0');

  const result = loadData(level, minPlays);
  if (!result) {
    const suffix = minPlays > 0 ? `-${minPlays}plays` : '';
    const expectedFile = `chain-analysis-${level}${suffix}.json`;
    return NextResponse.json({
      error: `Analysis data not found: ${expectedFile}`,
      hint: `Run: npx tsx scripts/run-chain-analysis.ts --level=${level} --sample=1 --min-plays=${minPlays}`,
      availableFiles: [
        'chain-analysis-400-800.json',
        'chain-analysis-400-800-1000plays.json',
        'chain-analysis-400-800-3000plays.json',
        'chain-analysis-800-1200.json',
        'chain-analysis-800-1200-3000plays.json',
        'chain-analysis-1200-1600.json',
        'chain-analysis-1200-1600-3000plays.json',
      ]
    }, { status: 404 });
  }

  const { data, fileName } = result;

  let puzzles: AnalyzedPuzzle[] = [];

  if (type === 'combination') {
    // Return clean combinations
    puzzles = data.examples.cleanCombinations.slice(0, limit);
  } else if (theme) {
    // Return pure theme examples
    const themeKey = theme.toLowerCase();

    // Try exact match first
    if (data.examples.pureThemes[themeKey]) {
      puzzles = data.examples.pureThemes[themeKey].slice(0, limit);
    } else {
      // Try partial match
      const matchingKey = Object.keys(data.examples.pureThemes).find(k =>
        k.toLowerCase().includes(themeKey) || themeKey.includes(k.toLowerCase())
      );
      if (matchingKey) {
        puzzles = data.examples.pureThemes[matchingKey].slice(0, limit);
      }
    }
  } else {
    // Return a mix of all themes
    const allPuzzles: AnalyzedPuzzle[] = [];
    for (const themePuzzles of Object.values(data.examples.pureThemes)) {
      allPuzzles.push(...themePuzzles.slice(0, 2));
    }
    puzzles = allPuzzles.slice(0, limit);
  }

  // Transform to API response format
  const response = puzzles.map(p => ({
    id: p.puzzleId,
    fen: p.puzzleFen, // Already the correct position after setup move
    originalFen: p.fen,
    playerColor: p.playerColor,
    moveCount: p.moveCount,
    outcome: p.outcome.type,
    materialGained: p.outcome.materialGained,
    primaryTheme: p.verdict.primaryTheme,
    teachAs: p.verdict.teachAs,
    confidence: p.verdict.confidence,
    moves: p.moves.map(m => ({
      number: m.moveNumber,
      san: m.san,
      theme: m.theme.name,
      confidence: m.theme.confidence,
      evidence: m.theme.evidence,
    })),
    url: `https://lichess.org/training/${p.puzzleId}`,
  }));

  // Calculate percentage stats from raw counts
  const total = data.stats.total;
  const primaryThemePercents: Record<string, number> = {};
  for (const [theme, count] of Object.entries(data.stats.byPrimaryTheme)) {
    primaryThemePercents[theme] = Math.round((count as number) / total * 1000) / 10;
  }

  const outcomePercents: Record<string, number> = {};
  for (const [outcome, count] of Object.entries(data.stats.byOutcome)) {
    outcomePercents[outcome] = Math.round((count as number) / total * 1000) / 10;
  }

  const combinationPercent = Math.round(data.stats.combinations.total / total * 1000) / 10;
  const highConfidencePercent = Math.round(data.stats.confidence.high / total * 1000) / 10;

  // Get top flows
  const topFlows = Object.entries(data.stats.combinations.flows)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)
    .map(([flow, count]) => ({ flow, count: count as number }));

  return NextResponse.json({
    theme,
    level,
    minPlays,
    dataFile: fileName,
    type,
    count: response.length,
    availableThemes: Object.keys(data.examples.pureThemes),
    puzzles: response,
    // Include stats for charts
    stats: {
      total,
      primaryThemes: primaryThemePercents,
      outcomes: outcomePercents,
      combinations: {
        percent: combinationPercent,
        topFlows,
      },
      confidence: {
        highPercent: highConfidencePercent,
      },
    },
  });
}
