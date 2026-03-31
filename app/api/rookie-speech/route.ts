import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ROOKIE_GAMEPLAY_PROMPT } from '@/lib/rookie-personality';

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

    let userPrompt: string;

    if (type === 'opening') {
      const { threadName, playerName, playerFacts, gamesPlayed, honchoContext } = context;

      const factsBlock = playerFacts?.length
        ? `\nYou remember these things about ${playerName} from past games:\n${playerFacts.map((f: string) => `- ${f}`).join('\n')}\nReference ONE of these naturally — don't list them all.`
        : '';

      const historyBlock = gamesPlayed > 0
        ? `\nThis is game #${gamesPlayed + 1} with ${playerName}.`
        : `\nThis is ${playerName}'s first game against you.`;

      const honchoBlock = honchoContext
        ? `\nPLAYER HISTORY (you MUST reference one specific fact from this — name an opening, a result, or their accuracy):\n${honchoContext}`
        : '';

      userPrompt = `Write Rookie's opening line for a new chess game.

Player: ${playerName}${historyBlock}${factsBlock}${honchoBlock}

Your tangent topic this game is: ${threadName}. You'll bring it up later — don't mention it yet, just let it color your mood.

${honchoContext ? 'IMPORTANT: Your greeting MUST mention something specific from the player history above. "Hey Tyler, back for more French Defense?" or "Last game was rough — 84% accuracy, we can do better." Show you remember them.' : ''}
Write exactly ONE line (1-2 sentences). Greeting + personality. Written for TTS — no formatting, no asterisks, no parentheses.`;

    } else if (type === 'game_end') {
      const { playerName, rookieWon, accuracy, playerFacts, honchoContext } = context;

      const outcomeText = rookieWon
        ? `Rookie won.`
        : `${playerName} won.`;

      const accuracyText = accuracy !== undefined
        ? ` ${playerName}'s accuracy was ${Math.round(accuracy)}%.`
        : '';

      const factsBlock = playerFacts?.length
        ? `\nThings you noticed: ${playerFacts.join('. ')}.`
        : '';

      const honchoBlock = honchoContext
        ? `\nPLAYER HISTORY (compare this game to what you know):\n${honchoContext}`
        : '';

      userPrompt = `Write Rookie's reaction to the game ending.

${outcomeText}${accuracyText}${factsBlock}${honchoBlock}

${honchoContext ? 'IMPORTANT: Compare this game to the player history. Did they improve? Repeat a mistake? Try a new opening? Be specific — "Your accuracy went up!" or "You keep struggling in the middlegame."' : ''}
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
