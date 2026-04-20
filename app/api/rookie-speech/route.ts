import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ROOKIE_GAMEPLAY_PROMPT, withTone } from '@/lib/rookie-personality';
import { toneForLevel } from '@/lib/quips/tone';
import {
  EMPTY_ROOKIE_MEMORY,
  type RookieMemoryContext,
} from '@/lib/rookie-memory';
import { aiGuard } from '@/lib/ai-guard';
import { renderLine } from '@/lib/speech/sanitize';

const anthropic = new Anthropic();

/**
 * POST /api/rookie-speech
 *
 * Generates Rookie's opening or game-end line via Claude.
 * 2 calls per game max — opening + game-end.
 *
 * Body: { type: 'opening' | 'game_end', context: { ... } }
 */
export async function POST(req: NextRequest) {
  const guard = await aiGuard(req, {
    route: 'rookie-speech',
    dailyLimit: 100,
    maxBodyBytes: 20_000,
  });
  if (!guard.ok) return guard.response;

  try {
    const { type, context } = (guard.body ?? {}) as {
      type?: 'opening' | 'game_end';
      context?: Record<string, unknown> & {
        memory?: Partial<RookieMemoryContext>;
        threadName?: string;
        playerName?: string;
        rookieWon?: boolean;
        accuracy?: number;
        attitudeLevel?: number;
        gameSummary?: {
          result: string;
          moveCount: number;
          openingName?: string;
          blunders: number;
          mistakes: number;
          brilliantMoves: number;
          keyMoments?: string;
        };
      };
    };

    if (!type || !context) {
      return NextResponse.json({ error: 'Missing type or context' }, { status: 400 });
    }

    const memory: RookieMemoryContext = {
      ...EMPTY_ROOKIE_MEMORY,
      ...(context.memory ?? {}),
    };
    let userPrompt: string;

    if (type === 'opening') {
      const { threadName, playerName } = context;

      const factsBlock = memory.playerFacts.length
        ? `\nYou remember these things about ${playerName} from past games:\n${memory.playerFacts.map((fact) => `- ${fact}`).join('\n')}\nReference ONE of these naturally — don't list them all.`
        : '';

      const historyBlock = memory.gamesPlayed > 0
        ? `\nThis is game #${memory.gamesPlayed + 1} with ${playerName}.`
        : `\nThis is ${playerName}'s first game against you.`;

      userPrompt = `Write Rookie's opening line for a new chess game.

Player: ${playerName}${historyBlock}${factsBlock}

Your tangent topic this game is: ${threadName}. You'll bring it up later — don't mention it yet, just let it color your mood.

Write exactly ONE line (1-2 sentences). Greeting + personality. Written for TTS — no formatting, no asterisks, no parentheses.

BANNED PATTERNS (never use these):
- Compute-flex: "calculated", "processing", "simulated", "analyzed", "running numbers", "algorithms"
- Rookie doesn't brag about being a computer. She's a rook who has feelings, not a CPU.`;

    } else if (type === 'game_end') {
      const { playerName, rookieWon, accuracy, gameSummary } = context;

      // Build facts block — ONLY confirmed data
      const facts: string[] = [];
      facts.push(rookieWon ? 'Rookie won.' : `${playerName} won.`);
      if (accuracy !== undefined) facts.push(`Accuracy: ${Math.round(accuracy)}%.`);
      if (gameSummary) {
        facts.push(`Result: ${gameSummary.result} in ${gameSummary.moveCount} moves.`);
        if (gameSummary.openingName) facts.push(`Opening: ${gameSummary.openingName}.`);
        if (gameSummary.blunders > 0) facts.push(`Blunders: ${gameSummary.blunders}.`);
        if (gameSummary.mistakes > 0) facts.push(`Mistakes: ${gameSummary.mistakes}.`);
        if (gameSummary.brilliantMoves > 0) facts.push(`Brilliant moves: ${gameSummary.brilliantMoves}.`);
        if (gameSummary.keyMoments) facts.push(`Key moments: ${gameSummary.keyMoments}`);
      }

      // Honcho player history — not yet wired up from client
      const honchoPromptSummary = (context as Record<string, unknown>).honchoPromptSummary as string | undefined;

      const honchoBlock = honchoPromptSummary
        ? `\nPLAYER HISTORY (you may reference this):\n${honchoPromptSummary}`
        : '';

      const noHistoryWarning = honchoPromptSummary
        ? ''
        : '\nYou have NO player history. Do NOT reference past games, improvement, or how many times they have played anything.';

      userPrompt = `Write Rookie's 2-sentence post-game summary.

THIS GAME'S FACTS (you may ONLY reference these):
${facts.join(' ')}${honchoBlock}${noHistoryWarning}

FORMAT:
Sentence 1: Name the opening and say something about it. If no opening name is provided, skip the opening and comment on the game itself.
Sentence 2: How the game ended + suggest what's next. Either a rematch, or learning an opening, or practicing tactics.

STRICT RULES:
- ONLY reference data listed above. Never invent game counts, history, or progress you weren't given.
- Be concrete: "You checkmated me on move 34" not "great finish." Name pieces, move numbers, the opening.
- If you have player history, you may compare. If you don't, stick to this game only.
- End with a gentle push toward what to do next.
- 2 sentences max. Written for TTS — no formatting, no asterisks, no parentheses.

EXAMPLES:
"French Defense -- solid choice. You got my rook on move 18 and I never recovered. Want to try the Italian next?"
"That was a Sicilian and it got wild. I checkmated you on move 26 after you left your king exposed -- there's a lesson on king safety that might help."
"Good game. You resigned on move 22 down a knight, but honestly the middle game was close. Rematch?"
"I didn't recognize that opening but it worked. You checkmated me on move 41 -- clean finish. Want to go again?"`;

    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const tone = toneForLevel(context.attitudeLevel ?? 3);
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: withTone(ROOKIE_GAMEPLAY_PROMPT, tone),
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawText = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    const text = renderLine(rawText, context.playerName);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Rookie speech API error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
