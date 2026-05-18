import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Allow up to 30s for Claude to generate commentary
export const maxDuration = 30;

const anthropic = new Anthropic();

export interface MoveAnalysis {
  moveNumber: number;
  color: 'white' | 'black';
  san: string;
  uci: string;
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

TASK: Write a short commentary for EVERY move in this game. You have Stockfish evaluations (centipawns, from white's perspective).

For each move, write 1-2 concise sentences explaining:
- For good/great/brilliant moves: what made it strong (development, tactic, control)
- For mistakes/blunders: what went wrong and what the better idea was, in plain language
- For normal moves: brief positional context (developing, castling, etc.)

Rules:
- Be direct. "This develops the knight toward the center" not "Interesting choice here..."
- Explain WHY a move is good or bad, don't just label it
- Reference specific squares and pieces when explaining tactics
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

Keys in "moves" are "{moveNumber}w" or "{moveNumber}b". Include EVERY move. Keep each comment to ONE short sentence, max 100 characters. Be punchy, not wordy.`;

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

    // Build compact game data — every move with eval
    const fmtEval = (cp: number | null, mate: number | null): string => {
      if (mate !== null) return mate > 0 ? `M${mate}` : `M${mate}`;
      if (cp !== null) return (cp / 100).toFixed(1);
      return '?';
    };
    const moveLines = moves.map(m => {
      const evalBefore = fmtEval(m.evalBefore, m.mateBefore);
      const evalAfter = fmtEval(m.evalAfter, m.mateAfter);
      const best = m.bestMove ? ` best:${m.bestMove}` : '';
      const cls = m.classification && m.classification !== 'good' ? ` [${m.classification}]` : '';
      return `${m.moveNumber}${m.color === 'white' ? '.' : '...'} ${m.san} (${evalBefore}→${evalAfter}${best})${cls}`;
    }).join('\n');

    const gameContext = `
GAME: ${playerColor} (~${playerElo}) vs opponent. Result: ${result}.${openingName ? ` Opening: ${openingName}.` : ''}

MOVES (eval in pawns from white's perspective, best = engine's preferred move):
${moveLines}
`.trim();

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: gameContext }],
    });
    console.log('[coach-review] Claude response received, tokens:', response.usage);

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse review', raw: text }, { status: 500 });
    }

    const review = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ review });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[coach-review] error:', msg, error);
    return NextResponse.json(
      { error: 'Review generation failed', detail: msg },
      { status: 500 },
    );
  }
}
