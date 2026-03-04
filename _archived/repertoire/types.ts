/**
 * Shared types for the Opening Repertoire system.
 *
 * Core concept: FEN-keyed DAG where each position is a node
 * and each move is a directed edge with stats from both the
 * user's games and master databases.
 */

// ── Tree Structure ──────────────────────────────────────

export interface PositionNode {
  fen: string; // normalized (stripped halfmove/fullmove counters)
  moves: Record<string, MoveEdge>; // keyed by SAN
}

export interface MoveEdge {
  targetFen: string;
  san: string;
  uci: string;
  userGames: number;
  userWins: number;
  userDraws: number;
  userLosses: number;
  masterGames: number;
  masterWins: number;
  masterDraws: number;
  masterLosses: number;
  masterRank: number; // 1 = most popular master move
  isUserMove: boolean;
}

export type RepertoireTree = Record<string, PositionNode>; // keyed by normalized FEN

// ── Gap Analysis ────────────────────────────────────────

export type GapType = 'shallow_line' | 'bad_move' | 'losing_branch';

export interface Gap {
  type: GapType;
  fen: string;
  severity: number; // 0-1, higher = worse
  description: string; // human-readable explanation
  userMove?: string; // SAN of what user plays (if applicable)
  masterMove?: string; // SAN of what masters play
  userGames: number;
  userScore: number; // (wins + 0.5*draws) / total
  masterScore: number;
  lineLabel: string; // e.g. "Sicilian Defense: 5.h3"
}

export interface DiagnosisResult {
  color: 'white' | 'black';
  gaps: Gap[];
  summary: string;
  diagnosedAt: string;
}

// ── SRS (Spaced Repetition) ─────────────────────────────

export interface SrsCard {
  id: string;
  fen: string;
  correctMoveSan: string;
  correctMoveUci: string;
  lineName: string | null;
  color: 'white' | 'black';
  level: number; // 0=new, 1-8=SRS levels
  nextReviewAt: string;
  lastReviewedAt: string | null;
  totalReviews: number;
  correctReviews: number;
}

export interface DrillSession {
  cards: SrsCard[];
  totalDue: number;
  newCards: number;
}

export interface ReviewResult {
  cardId: string;
  correct: boolean;
}

// ── Game Fetching ───────────────────────────────────────

export type ChessPlatform = 'lichess' | 'chesscom';

export interface FetchedGame {
  pgn: string;
  platform: ChessPlatform;
  playerColor: 'white' | 'black';
  result: 'win' | 'draw' | 'loss';
  timeControl: string;
}

// ── Master Explorer ─────────────────────────────────────

export interface MasterMoveData {
  san: string;
  uci: string;
  white: number;
  draws: number;
  black: number;
  averageRating: number;
}

export interface ExplorerResponse {
  moves: MasterMoveData[];
  white: number;
  draws: number;
  black: number;
}

// ── API Payloads ────────────────────────────────────────

export interface ConnectRequest {
  platform: ChessPlatform;
  username: string;
}

export interface AnalyzeRequest {
  color: 'white' | 'black';
}

export interface DrillReviewRequest {
  cardId: string;
  correct: boolean;
}
