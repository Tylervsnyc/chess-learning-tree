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

      const lastGameBlock = memory.lastGameContext
        ? `\nLAST GAME (reference this — it's what just happened):\n${memory.lastGameContext}`
        : '';

      const lastGameInstruction = memory.lastGameContext
        ? '\nIMPORTANT: Your greeting MUST reference the last game. "Back after that French Defense loss?" or "Ready to top that 91% accuracy?" Show you remember what just happened.'
        : '';

      const honchoBlock = !memory.lastGameContext && honchoPromptSummary
        ? `\nPLAYER HISTORY (you MUST reference one specific fact from this — name an opening, a result, or their accuracy):\n${honchoPromptSummary}`
        : '';

      const honchoInstruction = !memory.lastGameContext && honchoPromptSummary
        ? '\nIMPORTANT: Your greeting MUST mention something specific from the player history above. "Hey Tyler, back for more French Defense?" or "Last game was rough — 84% accuracy, we can do better." Show you remember them.'
        : '';

      userPrompt = `Write Rookie's opening line for a new chess game.

Player: ${playerName}${historyBlock}${factsBlock}${lastGameBlock}${honchoBlock}

Your tangent topic this game is: ${threadName}. You'll bring it up later — don't mention it yet, just let it color your mood.${lastGameInstruction}${honchoInstruction}

Write exactly ONE line (1-2 sentences). Greeting + personality. Written for TTS — no formatting, no asterisks, no parentheses.`;

    } else if (type === 'game_end') {
      const { playerName, rookieWon, accuracy, gameSummary } = context;

      const outcomeText = rookieWon
        ? `Rookie won.`
        : `${playerName} won.`;

      const accuracyText = accuracy !== undefined
        ? ` ${playerName}'s accuracy was ${Math.round(accuracy)}%.`
        : '';

      // Build game summary block from analysis data
      let summaryBlock = '';
      if (gameSummary) {
        const parts: string[] = [];
        parts.push(`Result: ${gameSummary.result} in ${gameSummary.moveCount} moves.`);
        if (gameSummary.openingName) parts.push(`Opening: ${gameSummary.openingName}.`);
        if (gameSummary.blunders > 0) parts.push(`Blunders: ${gameSummary.blunders}.`);
        if (gameSummary.mistakes > 0) parts.push(`Mistakes: ${gameSummary.mistakes}.`);
        if (gameSummary.brilliantMoves > 0) parts.push(`Brilliant moves: ${gameSummary.brilliantMoves}!`);
        if (gameSummary.keyMoments) parts.push(`Key moments: ${gameSummary.keyMoments}`);
        summaryBlock = `\nTHIS GAME'S STATS:\n${parts.join(' ')}`;
      }

      const honchoBlock = honchoPromptSummary
        ? `\nPLAYER HISTORY (compare this game to what you know):\n${honchoPromptSummary}`
        : '';

      const honchoInstruction = honchoPromptSummary
        ? '\nCompare this game to the player history. Did they improve? Repeat a mistake? Try a new opening?'
        : '';

      userPrompt = `Write Rookie's fun summary of the game that just ended.

${outcomeText}${accuracyText}${summaryBlock}${honchoBlock}${honchoInstruction}

Summarize the game in Rookie's voice — mention specific things that happened (the opening, a blunder, a brilliant move, their accuracy). Make it feel like a friend recapping the game. Be specific, not generic.

Write 2-3 sentences. Written for TTS — no formatting, no asterisks, no parentheses.`;

    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
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
