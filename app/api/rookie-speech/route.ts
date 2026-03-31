import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ROOKIE_GAMEPLAY_PROMPT } from '@/lib/rookie-personality';
import {
  EMPTY_ROOKIE_MEMORY,
  formatHonchoSummaryForPrompt,
  type RookieMemoryContext,
} from '@/lib/rookie-memory';

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
  try {
    const { type, context } = await req.json();

    if (!type || !context) {
      return NextResponse.json({ error: 'Missing type or context' }, { status: 400 });
    }

    const memory: RookieMemoryContext = {
      ...EMPTY_ROOKIE_MEMORY,
      ...(context.memory ?? {}),
    };
    const honchoPromptSummary = formatHonchoSummaryForPrompt(memory.honchoSummary);

    let userPrompt: string;

    if (type === 'opening') {
      const { threadName, playerName } = context;

      const factsBlock = memory.playerFacts.length
        ? `\nYou remember these things about ${playerName} from past games:\n${memory.playerFacts.map((fact) => `- ${fact}`).join('\n')}\nReference ONE of these naturally — don't list them all.`
        : '';

      const historyBlock = memory.gamesPlayed > 0
        ? `\nThis is game #${memory.gamesPlayed + 1} with ${playerName}.`
        : `\nThis is ${playerName}'s first game against you.`;

      const honchoBlock = honchoPromptSummary
        ? `\nPLAYER HISTORY (you MUST reference one specific fact from this — name an opening, a result, or their accuracy):\n${honchoPromptSummary}`
        : '';

      const honchoInstruction = honchoPromptSummary
        ? '\nIMPORTANT: Your greeting MUST mention something specific from the player history above. "Hey Tyler, back for more French Defense?" or "Last game was rough — 84% accuracy, we can do better." Show you remember them.'
        : '';

      userPrompt = `Write Rookie's opening line for a new chess game.

Player: ${playerName}${historyBlock}${factsBlock}${honchoBlock}

Your tangent topic this game is: ${threadName}. You'll bring it up later — don't mention it yet, just let it color your mood.${honchoInstruction}

Write exactly ONE line (1-2 sentences). Greeting + personality. Written for TTS — no formatting, no asterisks, no parentheses.`;

    } else if (type === 'game_end') {
      const { playerName, rookieWon, accuracy } = context;

      const outcomeText = rookieWon
        ? `Rookie won.`
        : `${playerName} won.`;

      const accuracyText = accuracy !== undefined
        ? ` ${playerName}'s accuracy was ${Math.round(accuracy)}%.`
        : '';

      const factsBlock = memory.playerFacts.length
        ? `\nThings you noticed: ${memory.playerFacts.join('. ')}.`
        : '';

      const honchoBlock = honchoPromptSummary
        ? `\nPLAYER HISTORY (compare this game to what you know):\n${honchoPromptSummary}`
        : '';

      const honchoInstruction = honchoPromptSummary
        ? '\nIMPORTANT: Compare this game to the player history. Did they improve? Repeat a mistake? Try a new opening? Be specific — "Your accuracy went up!" or "You keep struggling in the middlegame."'
        : '';

      userPrompt = `Write Rookie's reaction to the game ending.

${outcomeText}${accuracyText}${factsBlock}${honchoBlock}${honchoInstruction}

Write exactly ONE line (1-2 sentences). React to the outcome with genuine emotion — this matters to Rookie. Written for TTS — no formatting, no asterisks, no parentheses.`;

    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: ROOKIE_GAMEPLAY_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Rookie speech API error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
