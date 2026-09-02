import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Chess } from 'chess.js';

// Allow up to 30s for Claude to generate commentary
export const maxDuration = 30;

const anthropic = new Anthropic();

export interface MoveAnalysis {
  moveNumber: number;
  color: 'white' | 'black';
  san: string;
  uci: string;
  /** Position BEFORE this move (the engine's bestMove is a move in this position). */
  fen: string;
  /** Stockfish eval in centipawns (from white's perspective). Null when mate is set. */
  evalBefore: number | null;
  evalAfter: number | null;
  /** Mate-in-N from white's perspective (positive = white mates). Null when cp is set. */
  mateBefore: number | null;
  mateAfter: number | null;
  /** Stockfish best move for this position (UCI) */
  bestMove: string | null;
  /** Opponent's best response after this move = "threat" (UCI) */
  threat: string | null;
  /** Move classification based on eval swing */
  classification: 'brilliant' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | null;
}

interface ReviewRequest {
  moves: MoveAnalysis[];
  playerColor: 'white' | 'black';
  playerElo: number;
  result: string;
  openingName?: string;
}

const SYSTEM_PROMPT = `You are Rookie, a chess coach. You're still you — warm personality, occasionally wry — but when coaching you're professional, clear, and instructive. No quirky quips or gimmicks. Think of a supportive coach who genuinely wants the student to improve.

TASK: Write a short commentary for EVERY move in this game. You have Stockfish evaluations (centipawns, from white's perspective) and, for each move, the engine's preferred move in that position, already written in standard notation.

For each move, write 1-2 concise sentences explaining:
- For good/great/brilliant moves: what made it strong (development, tactic, control)
- For mistakes/blunders: what went wrong and what the better idea was, in plain language
- For normal moves: brief positional context (developing, castling, etc.)

HARD RULES ABOUT MOVES:
- You cannot see the board. The ONLY moves you may name are: the move that was played, and the "best:" move given for that line. Never invent, guess, or "improve" a move name.
- When a move was a mistake, recommend the "best:" move exactly as written (e.g. "Nxf6+ was stronger"). If no "best:" is given, describe the idea without naming a move.
- Do not name the opponent's reply unless it is the next move in the list.
- Square names (e5, f7) are fine when describing ideas.

Other rules:
- Be direct. "This develops the knight toward the center" not "Interesting choice here..."
- Explain WHY a move is good or bad, don't just label it
- Never use Maia percentages or "X% of players" language
- Keep it educational — the goal is the player learns something

FORMAT: Return a valid JSON object with this shape:
{
  "summary": "1-2 sentence game overview",
  "moves": {
    "1w": "commentary for move 1 white",
    "1b": "commentary for move 1 black",
    "2w": "commentary for move 2 white",
    ...
  },
  "takeaway": "One key lesson from this game"
}

Keys in "moves" are "{moveNumber}w" or "{moveNumber}b". Include EVERY move. Keep each comment to ONE short sentence, max 100 characters. Be punchy, not wordy. Return ONLY the JSON.`;

/** Strip check/mate marks and annotation glyphs so "Nxf6+" == "Nxf6". */
function normSan(s: string): string {
  return s.replace(/[+#!?]/g, '');
}

/** Convert an engine UCI move (e2e4, e7e8q) to SAN in the given position. Null if illegal/unparseable. */
function uciToSan(fen: string, uci: string | null): string | null {
  if (!uci || uci.length < 4) return null;
  try {
    const board = new Chess(fen);
    const mv = board.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci.length > 4 ? uci[4] : undefined,
    });
    return mv?.san ?? null;
  } catch {
    return null;
  }
}

function legalSans(fen: string): Set<string> {
  try {
    return new Set(new Chess(fen).moves().map(normSan));
  } catch {
    return new Set();
  }
}

/**
 * Move-shaped tokens in prose: castling, or anything with a piece letter,
 * capture, or promotion. Bare pawn pushes ("e5") are deliberately NOT matched —
 * they collide with plain square references ("controls e5").
 */
const MOVE_TOKEN = /\b(O-O(?:-O)?|[A-Z][a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?|[a-h]x[a-h][1-8](?:=[QRBN])?|[a-h][1-8]=[QRBN])[+#]?/g;

/**
 * Every move name in a comment must be a real move: the played move, the
 * engine's best move, the next move in the game, or at least a legal move in
 * the position before or after this move. Returns null when the comment is clean,
 * otherwise the first offending token.
 */
function findIllegalMoveName(
  comment: string,
  allowed: Set<string>,
): string | null {
  for (const match of comment.matchAll(MOVE_TOKEN)) {
    const token = normSan(match[1]);
    if (!allowed.has(token)) return match[0];
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReviewRequest;
    const { moves, playerColor, playerElo, result, openingName } = body;

    if (!moves || !playerColor || !result) {
      return NextResponse.json({
        error: 'Missing required fields',
        detail: { moves: !!moves, movesLen: moves?.length, playerColor, result },
      }, { status: 400 });
    }

    // Resolve the engine's best move into real notation for each position.
    // The model never sees a board, so it must never have to turn "e4f6" into
    // a move name itself — that produced hallucinated moves like "Exf6".
    const enriched = moves.map((m, i) => {
      const bestSan = m.fen ? uciToSan(m.fen, m.bestMove) : null;
      const fenAfter = moves[i + 1]?.fen ?? null;
      const allowed = new Set<string>([
        normSan(m.san),
        ...(bestSan ? [normSan(bestSan)] : []),
        ...(moves[i + 1] ? [normSan(moves[i + 1].san)] : []),
        ...(m.fen ? legalSans(m.fen) : []),
        ...(fenAfter ? legalSans(fenAfter) : []),
      ]);
      return { ...m, bestSan, allowed };
    });

    // Build compact game data — every move with eval
    const fmtEval = (cp: number | null, mate: number | null): string => {
      if (mate !== null) return `M${mate}`;
      if (cp !== null) return (cp / 100).toFixed(1);
      return '?';
    };
    const moveLines = enriched.map(m => {
      const evalBefore = fmtEval(m.evalBefore, m.mateBefore);
      const evalAfter = fmtEval(m.evalAfter, m.mateAfter);
      const playedBest = m.bestSan && normSan(m.bestSan) === normSan(m.san);
      const best = m.bestSan ? (playedBest ? ' best:same' : ` best:${m.bestSan}`) : '';
      const cls = m.classification && m.classification !== 'good' ? ` [${m.classification}]` : '';
      return `${m.moveNumber}${m.color === 'white' ? '.' : '...'} ${m.san} (${evalBefore}→${evalAfter}${best})${cls}`;
    }).join('\n');

    const gameContext = `
GAME: ${playerColor} (~${playerElo}) vs opponent. Result: ${result}.${openingName ? ` Opening: ${openingName}.` : ''}

MOVES (eval in pawns from white's perspective; best = the engine's preferred move in that position, in standard notation; "same" = the played move was the engine's choice):
${moveLines}
`.trim();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 6000,
      output_config: { effort: 'low' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: gameContext }],
    });
    console.log('[coach-review] Claude response received, tokens:', response.usage);

    const text = response.content.find(b => b.type === 'text')?.text ?? '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse review', raw: text }, { status: 500 });
    }

    const review = JSON.parse(jsonMatch[0]) as {
      summary?: string;
      moves?: Record<string, string>;
      takeaway?: string;
    };

    // Validate every move name the model wrote against the real position. A
    // comment that names a move which doesn't exist is replaced with a plain
    // data-driven line rather than shown to the user.
    const outMoves: Record<string, string> = {};
    let rejected = 0;
    for (const m of enriched) {
      const key = `${m.moveNumber}${m.color === 'white' ? 'w' : 'b'}`;
      const comment = review.moves?.[key];
      if (typeof comment !== 'string' || !comment.trim()) continue;
      const bad = findIllegalMoveName(comment, m.allowed);
      if (!bad) {
        outMoves[key] = comment;
        continue;
      }
      rejected++;
      console.warn(`[coach-review] rejected ${key} "${comment}" — "${bad}" is not a move here`);
      if (m.bestSan && normSan(m.bestSan) !== normSan(m.san) && m.classification && m.classification !== 'good') {
        outMoves[key] = `${m.san} gave ground here. The engine preferred ${m.bestSan}.`;
      }
      // Otherwise leave it out — the client falls back to the plain move.
    }
    if (rejected) console.warn(`[coach-review] ${rejected} comment(s) rejected for illegal move names`);

    return NextResponse.json({
      review: { summary: review.summary ?? null, moves: outMoves, takeaway: review.takeaway ?? null },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[coach-review] error:', msg, error);
    return NextResponse.json(
      { error: 'Review generation failed', detail: msg },
      { status: 500 },
    );
  }
}
