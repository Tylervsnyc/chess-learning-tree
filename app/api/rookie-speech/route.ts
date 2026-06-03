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
        /** Post-game lens instruction (from lib/speech/angles.ts pickAngle). */
        angle?: string;
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

    // Anti-repeat: feed back the last few lines Rookie said so she varies herself.
    const recentLinesBlock = memory.recentLines.length
      ? `\n\nYOU RECENTLY SAID THESE LINES — say something genuinely different this time, in wording, structure, AND what you choose to notice. Do not echo their phrasing:\n${memory.recentLines.map((l) => `- "${l}"`).join('\n')}`
      : '';

    let userPrompt: string;

    if (type === 'opening') {
      const { threadName, playerName } = context;

      const factsBlock = memory.playerFacts.length
        ? `\nYou remember these things about ${playerName} from past games:\n${memory.playerFacts.map((fact) => `- ${fact}`).join('\n')}\nYou may nod to AT MOST one of these — and only if it's fresh. Do NOT default to a mistake or a "hung piece" fact; you lean on those too much. Most games, skip the facts entirely and just react to the moment.`
        : '';

      const historyBlock = memory.gamesPlayed > 0
        ? `\nThis is game #${memory.gamesPlayed + 1} with ${playerName}.`
        : `\nThis is ${playerName}'s first game against you.`;

      userPrompt = `Write Rookie's opening line for a new chess game.

Player: ${playerName}${historyBlock}${factsBlock}

Your private mood-color this game is: ${threadName}. Don't mention it yet — just let it tint your energy.${recentLinesBlock}

Write exactly ONE line (1-2 sentences). It should sound like Rookie genuinely reacting to THIS moment, not a stock greeting.

VARY YOUR STRUCTURE — do NOT open the same way every game. Rotate among:
- A blunt observation ("You're back. Good. I was getting bored.")
- A mid-thought you're bailing out of ("I was sorting my rooks by height — anyway, your move.")
- A small confession or feeling ("I've decided I'm a little nervous. That's new for me.")
- A direct challenge ("Let's see if you fixed what went wrong last time.")
- Just diving straight in, no greeting at all.

BANNED PATTERNS (never use these):
- Compute-flex: "calculated", "processing", "simulated", "analyzed", "running numbers", "algorithms". Rookie has feelings, not a CPU.
- Crutch openers: do NOT start with "Ah," "Well," "Alright," or "So,".
- Written for TTS — no formatting, no asterisks, no parentheses.`;

    } else if (type === 'game_end') {
      const { playerName, rookieWon, accuracy, gameSummary } = context;

      // Headline facts — the neutral, non-judgmental stuff she can build a recap on.
      const facts: string[] = [];
      facts.push(rookieWon ? 'Rookie won.' : `${playerName} won.`);
      if (accuracy !== undefined) facts.push(`Accuracy: ${Math.round(accuracy)}%.`);
      if (gameSummary) {
        facts.push(`Result: ${gameSummary.result} in ${gameSummary.moveCount} moves.`);
        if (gameSummary.openingName) facts.push(`Opening: ${gameSummary.openingName}.`);
        if (gameSummary.brilliantMoves > 0) facts.push(`Brilliant moves: ${gameSummary.brilliantMoves}.`);
        if (gameSummary.keyMoments) facts.push(`Key moments: ${gameSummary.keyMoments}`);
      }

      // Blunders/mistakes are DEMOTED — an optional detail, never a headline fact.
      const errorBits: string[] = [];
      if (gameSummary && gameSummary.blunders > 0) errorBits.push(`${gameSummary.blunders} blunder${gameSummary.blunders > 1 ? 's' : ''}`);
      if (gameSummary && gameSummary.mistakes > 0) errorBits.push(`${gameSummary.mistakes} mistake${gameSummary.mistakes > 1 ? 's' : ''}`);
      const errorBlock = errorBits.length
        ? `\n\nOPTIONAL DETAIL (do NOT lead with this, do NOT mention every one): there ${errorBits.length === 1 && !errorBits[0].endsWith('s') ? 'was' : 'were'} ${errorBits.join(' and ')} this game.`
        : '';

      // The angle Rookie leads from this game (picked client-side per game).
      const angleLens = context.angle ?? 'Tell the story of the whole game in two sentences — its shape and how it felt.';

      // Rotate the call-to-action so it isn't always "rematch?".
      const CTAS = [
        'invite a rematch',
        'suggest trying one specific different opening next time',
        'suggest a quick tactics drill',
        'suggest replaying the key moment together',
        'suggest going again as the other color',
        'just leave them with a thought — no call to action at all',
      ];
      const cta = CTAS[Math.floor(Math.random() * CTAS.length)];

      // Honcho player history — not yet wired up from client
      const honchoPromptSummary = (context as Record<string, unknown>).honchoPromptSummary as string | undefined;

      const honchoBlock = honchoPromptSummary
        ? `\nPLAYER HISTORY (you may reference this):\n${honchoPromptSummary}`
        : '';

      const noHistoryWarning = honchoPromptSummary
        ? ''
        : '\nYou have NO player history. Do NOT reference past games, improvement, or how many times they have played anything.';

      userPrompt = `Write Rookie's 2-sentence post-game recap.

THIS GAME'S FACTS (you may ONLY reference these — never invent counts, history, or progress):
${facts.join(' ')}${errorBlock}${honchoBlock}${noHistoryWarning}${recentLinesBlock}

YOUR ANGLE THIS GAME:
${angleLens}
Lead sentence 1 from THIS angle — it's what makes each recap feel different. Commit to it.

HOW TO END (sentence 2):
End by: ${cta}. Keep it natural, never a sales pitch.

HARD RULES:
- Do NOT open with "you hung a piece" / "you lost a piece." Most games, don't mention the mistakes at all.
- ONLY if a mistake genuinely decided the game may you touch on ONE — and rotate the wording. Use phrasings like "left it loose", "let it slip", "gave me the opening", "missed the threat", "dropped material", or "overlooked it". NEVER use the words "hang", "hung", or "hanging" — you badly overuse them.
- Be concrete and specific (name the opening, a move number, a piece) — specific about something INTERESTING, not just an error.
- 2 sentences max. Written for TTS — no formatting, no asterisks, no parentheses.

EXAMPLES (notice how each one leads with a DIFFERENT thing — match that variety, never copy them):
"You went straight for the King's Gambit -- bold, a little unhinged, I respected it. It came apart around move 20, but that opening alone earned a rematch."
"The whole thing pivoted on move 24 when your knight jumped into e5. Quiet before, all yours after -- want to run it back as White?"
"Honestly? I felt something watching that endgame. You squeezed the rook ending for thirty moves and I didn't think you had it in you."
"That bishop of yours never once left its corner. I think about bishops a lot. Maybe next game give it somewhere to go."`;

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
