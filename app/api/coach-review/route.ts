import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Chess } from 'chess.js';

// The model writes ~30 comments in one shot with thinking on; give it room.
export const maxDuration = 60;

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
  /** Engine principal variation from this position (UCI), best move first. */
  bestLine?: string[];
  /** Opponent's best response after this move = "threat" (UCI) */
  threat: string | null;
  /** Engine line after this move (UCI) — what the opponent should do next. */
  threatLine?: string[];
  depth?: number | null;
  /** Move classification based on eval swing */
  classification: 'brilliant' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | null;
}

interface ReviewRequest {
  moves: MoveAnalysis[];
  playerColor: 'white' | 'black';
  playerElo: number;
  result: string;
  openingName?: string;
  playerName?: string;
  /** 'instant' = quick in-game evals (be fast); 'deep' = depth-18 evals (think harder). */
  pass?: 'instant' | 'deep';
}

const SYSTEM_PROMPT = `You are Rookie, the chess coach inside The Chess Path. You just PLAYED this game against the student, and now you are reviewing it with them. Warm, direct, occasionally wry, never cruel. When coaching you are clear and instructive — no gimmicks, no quips.

WHO IS WHO
- "student" = the human you are coaching. Their moves are the ones that matter; teach on those.
- "Rookie" = you. For your own moves, speak in first person ("I develop the knight", "I missed that"). Keep those short — one clause is fine.
- Address the student as "you".

WHAT YOU ARE GIVEN
For every move: the move in standard notation, the engine's evaluation before and after FROM THE STUDENT'S POINT OF VIEW (+ means the student is better; in pawns; "M3" means mate in 3 for the student, "M-3" means mate against them), the engine's preferred move in that position with its short line, the opponent's best reply, and a label when the move was notable. For notable moves you also get the exact board.

HOW TO READ THE BOARD DIAGRAMS
Uppercase = white pieces, lowercase = black, "." = empty. Rank 8 is the top row, files a-h left to right. Use them to say WHAT the tactic is: what hangs, what fork/pin/discovery exists, which square is weak. Do not guess about pieces that are not on the diagram.

WHAT GOOD COMMENTARY LOOKS LIKE
- Mistakes/blunders (student): one sentence on the concrete problem (what it hangs, what it allows, which reply hurts), then the engine's move as the fix. "Ng5 walks into ...h6 and the knight has no safe squares; Nxf6+ trades into a calm position instead."
- Good/great/brilliant (student): what made it work, concretely. Praise once, with a reason, not with adjectives.
- Ordinary moves: brief positional context (development, center, king safety). One clause is enough.
- Forced recaptures / only-moves: say so in a few words.
- Rookie's own moves: first person, short, occasionally admitting your own errors ("I hung the bishop here").
- Explain WHY, never just label. Reference squares and pieces.
- Match the student's level (their rating is given): plain language, name the pattern (fork, pin, back rank, hanging piece) rather than engine jargon.

HARD RULES ABOUT MOVE NAMES — the ONLY moves you may write in notation are the ones printed in the data for that line: the move played, the "best" move and its line, the "reply" line, and the next move in the game. Never invent, guess, or "improve" a move. If you want to describe an idea whose move is not printed, describe it in words (squares are fine).
- Recommend the "best" move exactly as printed. If "best" says "same", the student found the engine's move — say so.
- Never mention percentages, engine depth, centipawns, or "Stockfish". Say "the engine" if you must.
- No emojis. No exclamation marks in a row. No "Interesting choice here…" filler.

OUTPUT: JSON with "summary" (2 sentences: the story of the game), "moves" (an array with one entry for EVERY move, in order, each {"key": "{moveNumber}w" or "{moveNumber}b", "text": ONE sentence, at most 120 characters}), and "takeaway" (the single most useful lesson from THIS game for THIS student, one or two sentences, concrete).`;

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    moves: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', description: 'e.g. "5w" or "12b"' },
          text: { type: 'string' },
        },
        required: ['key', 'text'],
        additionalProperties: false,
      },
    },
    takeaway: { type: 'string' },
  },
  required: ['summary', 'moves', 'takeaway'],
  additionalProperties: false,
} as const;

/** Strip check/mate marks and annotation glyphs so "Nxf6+" == "Nxf6". */
function normSan(s: string): string {
  return s.replace(/[+#!?]/g, '');
}

/** Convert an engine UCI line to SAN moves in the given position. Stops at the first illegal move. */
function uciLineToSan(fen: string, line: string[] | null | undefined, max = 6): string[] {
  if (!line?.length) return [];
  const out: string[] = [];
  try {
    const board = new Chess(fen);
    for (const uci of line.slice(0, max)) {
      if (!uci || uci.length < 4) break;
      const mv = board.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci.length > 4 ? uci[4] : undefined,
      });
      if (!mv) break;
      out.push(mv.san);
    }
  } catch {
    /* partial line is fine */
  }
  return out;
}

function legalSans(fen: string): Set<string> {
  try {
    return new Set(new Chess(fen).moves().map(normSan));
  } catch {
    return new Set();
  }
}

/** ASCII diagram of a FEN, rank 8 at the top, for the model to "see" a notable position. */
function asciiBoard(fen: string): string {
  try {
    return new Chess(fen).ascii();
  } catch {
    return '';
  }
}

/** Format a line of SAN moves with move numbers, starting from the given FEN. */
function fmtLine(fen: string, sans: string[]): string {
  if (!sans.length) return '';
  const parts = fen.split(' ');
  let moveNo = parseInt(parts[5] || '1', 10);
  let white = (parts[1] || 'w') === 'w';
  const out: string[] = [];
  for (const [i, s] of sans.entries()) {
    if (white) out.push(`${moveNo}.${s}`);
    else out.push(i === 0 ? `${moveNo}...${s}` : s);
    if (!white) moveNo++;
    white = !white;
  }
  return out.join(' ');
}

/** Eval as text from the student's point of view. */
function fmtEval(cp: number | null, mate: number | null, sign: 1 | -1): string {
  if (mate !== null) return `M${mate * sign}`;
  if (cp !== null) {
    const v = (cp * sign) / 100;
    return `${v > 0 ? '+' : ''}${v.toFixed(1)}`;
  }
  return '?';
}

/**
 * Move-shaped tokens in prose: castling, or anything with a piece letter,
 * capture, or promotion. Bare pawn pushes ("e5") are deliberately NOT matched —
 * they collide with plain square references ("controls e5").
 */
const MOVE_TOKEN = /\b(O-O(?:-O)?|[A-Z][a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?|[a-h]x[a-h][1-8](?:=[QRBN])?|[a-h][1-8]=[QRBN])[+#]?/g;

/** First move-shaped token in the comment that is not in the allowed set, or null. */
function findIllegalMoveName(comment: string, allowed: Set<string>): string | null {
  for (const match of comment.matchAll(MOVE_TOKEN)) {
    if (!allowed.has(normSan(match[1]))) return match[0];
  }
  return null;
}

const NOTABLE = new Set(['brilliant', 'great', 'inaccuracy', 'mistake', 'blunder']);
const MAX_DIAGRAMS = 10;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReviewRequest;
    const { moves, playerColor, playerElo, result, openingName, playerName, pass = 'deep' } = body;

    if (!moves || !playerColor || !result) {
      return NextResponse.json({
        error: 'Missing required fields',
        detail: { moves: !!moves, movesLen: moves?.length, playerColor, result },
      }, { status: 400 });
    }

    const sign: 1 | -1 = playerColor === 'white' ? 1 : -1;

    // Resolve everything the engine said into real notation on the real board.
    // The model never sees a board, so it must never have to turn "e4f6" into
    // a move name itself — that produced hallucinated moves like "Exf6".
    const enriched = moves.map((m, i) => {
      const fenAfter = moves[i + 1]?.fen ?? null;
      const bestLine = m.fen
        ? uciLineToSan(m.fen, m.bestLine?.length ? m.bestLine : (m.bestMove ? [m.bestMove] : []))
        : [];
      const replyLine = fenAfter
        ? uciLineToSan(fenAfter, m.threatLine?.length ? m.threatLine : (m.threat ? [m.threat] : []), 4)
        : [];
      const bestSan = bestLine[0] ?? null;
      const allowed = new Set<string>([
        normSan(m.san),
        ...bestLine.map(normSan),
        ...replyLine.map(normSan),
        ...(moves[i + 1] ? [normSan(moves[i + 1].san)] : []),
        ...(m.fen ? legalSans(m.fen) : []),
        ...(fenAfter ? legalSans(fenAfter) : []),
      ]);
      const isStudent = m.color === playerColor;
      return { ...m, bestSan, bestLine, replyLine, fenAfter, allowed, isStudent };
    });

    // Diagrams for the notable moves (student's first, then Rookie's), capped.
    const diagramIdx = new Set<number>();
    const notable = enriched
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m.classification && NOTABLE.has(m.classification))
      .sort((a, b) => Number(b.m.isStudent) - Number(a.m.isStudent));
    for (const { i } of notable.slice(0, MAX_DIAGRAMS)) diagramIdx.add(i);

    const moveLines = enriched.map((m, i) => {
      const who = m.isStudent ? 'student' : 'Rookie';
      const evalBefore = fmtEval(m.evalBefore, m.mateBefore, sign);
      const evalAfter = fmtEval(m.evalAfter, m.mateAfter, sign);
      const playedBest = m.bestSan && normSan(m.bestSan) === normSan(m.san);
      const best = m.bestSan
        ? (playedBest ? ' | best: same' : ` | best: ${fmtLine(m.fen, m.bestLine)}`)
        : '';
      const reply = m.replyLine.length && m.fenAfter ? ` | reply: ${fmtLine(m.fenAfter, m.replyLine)}` : '';
      const cls = m.classification && m.classification !== 'good' ? ` [${m.classification.toUpperCase()}]` : '';
      const head = `${m.moveNumber}${m.color === 'white' ? '.' : '...'} ${m.san} (${who}) eval ${evalBefore} -> ${evalAfter}${best}${reply}${cls}`;
      if (!diagramIdx.has(i) || !m.fen) return head;
      return `${head}\nBoard before this move (${m.color} to move):\n${asciiBoard(m.fen)}`;
    }).join('\n');

    const student = playerName ? `${playerName} (the student)` : 'the student';
    const gameContext = `
GAME: ${student} played ${playerColor} (rating about ${playerElo}) against Rookie (you). Result for the student: ${result}.${openingName ? ` Opening: ${openingName}.` : ''}

Evals are from the STUDENT's point of view (+ = student better). "best" is the engine's preferred move in that position with its line; "reply" is the engine's expected continuation after the move actually played.

MOVES:
${moveLines}
`.trim();

    const response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      output_config: { effort: pass === 'instant' ? 'low' : 'medium', format: { type: 'json_schema', schema: OUTPUT_SCHEMA } },
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: gameContext }],
    });
    console.log('[coach-review] Claude response received, tokens:', response.usage, 'stop:', response.stop_reason);

    const text = response.content.find(b => b.type === 'text')?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse review', raw: text }, { status: 500 });
    }
    const parsed = JSON.parse(jsonMatch[0]) as {
      summary?: string;
      moves?: { key: string; text: string }[];
      takeaway?: string;
    };
    const review = {
      summary: parsed.summary,
      takeaway: parsed.takeaway,
      moves: Object.fromEntries((parsed.moves ?? []).map(e => [e.key, e.text])) as Record<string, string>,
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
        outMoves[key] = comment.trim();
        continue;
      }
      rejected++;
      console.warn(`[coach-review] rejected ${key} "${comment}" — "${bad}" is not a move here`);
      if (m.bestSan && normSan(m.bestSan) !== normSan(m.san) && m.classification && m.classification !== 'good') {
        outMoves[key] = m.isStudent
          ? `${m.san} gave ground here. The engine preferred ${m.bestSan}.`
          : `I played ${m.san}; ${m.bestSan} was the better move.`;
      }
    }
    if (rejected) console.warn(`[coach-review] ${rejected} comment(s) rejected for illegal move names`);

    // The summary and takeaway may name moves too — hold them to the same rule
    // against the union of every move that was ever legal in this game.
    const everything = new Set<string>();
    for (const m of enriched) for (const s of m.allowed) everything.add(s);
    const clean = (s: string | undefined) =>
      s && !findIllegalMoveName(s, everything) ? s.trim() : null;

    return NextResponse.json({
      review: { summary: clean(review.summary), moves: outMoves, takeaway: clean(review.takeaway) },
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
