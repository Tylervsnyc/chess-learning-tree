import fs from 'node:fs';
import path from 'node:path';
import { Chess } from 'chess.js';
import { OPENINGS_REGISTRY, type OpeningConfig } from '@/data/openings/registry';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function fenAfterMoves(movesString: string): string {
  const chess = new Chess();
  const tokens = movesString
    .replace(/\d+\./g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  for (const san of tokens) {
    try {
      chess.move(san);
    } catch {
      return chess.fen();
    }
  }
  return chess.fen();
}

export interface OpeningStatsResponse {
  san: string;
  games: number;
  winRate: number;
  whiteWins: number;
  draws: number;
  blackWins: number;
}

export interface OpeningContent {
  slug: string;
  name: string;
  description: string;
  moves: string;
  side: 'white' | 'black';
  category: '1.e4' | '1.d4' | '1.c4';
  mainLineName: string;
  mainLineSubtitle: string;
  startingFen: string;
  openingFen: string;
  variations: OpeningConfig['variations'];
  topResponses: OpeningStatsResponse[];
  totalGames: number;
  faq: { question: string; answer: string }[];
}

function findOpening(slug: string): OpeningConfig | undefined {
  return OPENINGS_REGISTRY.find(o => o.slug === slug);
}

function readMastersStats(slug: string): { root: OpeningStatsResponse[]; totalGames: number } {
  try {
    const filePath = path.join(process.cwd(), 'data', 'opening-builds', `${slug}-L1`, 'masters.json');
    if (!fs.existsSync(filePath)) return { root: [], totalGames: 0 };
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as { root: OpeningStatsResponse[] };
    const root = (parsed.root || []).slice(0, 3).map(r => ({
      san: r.san,
      games: r.games,
      winRate: r.winRate,
      whiteWins: r.whiteWins,
      draws: r.draws,
      blackWins: r.blackWins,
    }));
    const totalGames = (parsed.root || []).reduce((sum, r) => sum + (r.games || 0), 0);
    return { root, totalGames };
  } catch {
    return { root: [], totalGames: 0 };
  }
}

function buildFaq(opening: OpeningConfig, stats: OpeningStatsResponse[]): { question: string; answer: string }[] {
  const name = opening.name;
  const faq: { question: string; answer: string }[] = [
    {
      question: `What is the ${name}?`,
      answer: `${opening.description} The main moves are ${opening.moves}.`,
    },
    {
      question: `Is the ${name} good for beginners?`,
      answer: `Yes. The ${name} follows the core opening principles — develop pieces toward the center, control the center, and castle early — which makes it a natural fit for players who are still learning how to open a game.`,
    },
  ];

  if (stats.length > 0) {
    const top = stats[0];
    faq.push({
      question: `What is the most common response to the ${name}?`,
      answer: `At master level, ${top.san} is the most popular reply, played in ${top.games.toLocaleString()} games in the Lichess masters database with a ${top.winRate.toFixed(1)}% result for White.`,
    });
  }

  if (opening.variations.length > 0) {
    const variationNames = opening.variations.map(v => v.name).join(', ');
    faq.push({
      question: `What are the main variations of the ${name}?`,
      answer: `The ${name} includes several well-known variations: ${variationNames}. Each leads to a different type of position with its own plans and typical middlegame ideas.`,
    });
  }

  faq.push({
    question: `How do I learn the ${name}?`,
    answer: `Chess Path teaches the ${name} one move at a time with interactive lessons — you predict the next move, play it on the board, then Rookie explains why it works. Start with the main line, then branch into the variations once the key moves feel natural.`,
  });

  return faq;
}

export function getOpeningContent(slug: string): OpeningContent | null {
  const opening = findOpening(slug);
  if (!opening || !opening.hasData) return null;

  const { root, totalGames } = readMastersStats(slug);

  return {
    slug: opening.slug,
    name: opening.name,
    description: opening.description,
    moves: opening.moves,
    side: opening.side,
    category: opening.category,
    mainLineName: opening.mainLine.name,
    mainLineSubtitle: opening.mainLine.subtitle,
    startingFen: STARTING_FEN,
    openingFen: fenAfterMoves(opening.moves),
    variations: opening.variations,
    topResponses: root,
    totalGames,
    faq: buildFaq(opening, root),
  };
}

export function getAllOpeningSlugs(): string[] {
  const slugs = new Set<string>();
  for (const opening of OPENINGS_REGISTRY) {
    if (!opening.hasData) continue;
    slugs.add(opening.slug);
    for (const variation of opening.variations) {
      if (variation.hasData && variation.slug) slugs.add(variation.slug);
    }
  }
  return [...slugs];
}
