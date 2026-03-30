/**
 * Chess Analysis Agent — translates positions into pedagogical language for Honcho.
 *
 * Sits between Stockfish eval output and Honcho logging. Takes a position,
 * the move played, and the eval delta — returns a plain-language pedagogical
 * explanation with a curriculum concept tag.
 *
 * Uses Haiku for speed (~1-2s). Not in the real-time trigger path —
 * fires in parallel with Rookie's commentary.
 *
 * @see CHE-202 https://linear.app/chesspathapp/issue/CHE-202
 */

import Anthropic from '@anthropic-ai/sdk';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface AnalysisInput {
  fen: string;
  movePlayed: string;       // SAN
  bestMove: string;         // SAN
  evalBefore: number;       // centipawns
  evalAfter: number;        // centipawns
  moveNumber: number;
  phase: 'opening' | 'middlegame' | 'endgame';
  color: 'white' | 'black';
  eventType: 'blunder' | 'missed_win' | 'brilliant' | 'missed_tactic' | 'good_move';
  completedLessons: string[];
}

export interface AnalysisOutput {
  explanation: string;
  concept: string | null;
  curriculumRef: string | null;
  lessonCompleted: boolean;
  honchoMessage: string;
}

// ════════════════════════════════
// CONCEPT TAXONOMY
// ════════════════════════════════

const CONCEPT_TAXONOMY = `
Tactics: Fork, Pin, Skewer, Discovered Attack, Deflection, Attraction, Interference, Back Rank Mate, Removing the Defender
Openings: Italian Game, Ruy Lopez, Sicilian Defense, French Defense, Caro-Kann, London System, King's Gambit, Scotch Game, King's Indian, Pirc Defense, English Opening, Grunfeld Defense
Principles: Development, Center Control, King Safety, Piece Activity, Pawn Structure, Material Balance
`.trim();

// ════════════════════════════════
// SYSTEM PROMPT
// ════════════════════════════════

const SYSTEM_PROMPT = `You are a chess analysis agent for Chess Path, a learning platform for beginners (under 1500 ELO).

Your job: explain what happened in a chess position in plain, pedagogical language.

When a significant event occurs (blunder, missed tactic, brilliant move), you must:
1. Explain the IDEA behind the position — what concept was at play
2. Map it to one of these curriculum concepts if applicable:
${CONCEPT_TAXONOMY}
3. Note if the player has already completed the relevant lesson
4. Write a final "honchoMessage" that captures all of this in 2-3 natural sentences

The honchoMessage will be stored in Honcho (a memory system) and read by Rookie (an AI chess commentator) to personalize her commentary. Write it so Rookie can understand what happened and why it matters for this player's learning journey.

RULES:
- Never include raw FEN strings or engine evaluations in your output
- Always explain the IDEA, not just the move
- Use simple language — a non-chess player should understand the concept at stake
- Be specific about what was missed or executed correctly
- Reference the curriculum lesson when applicable

Respond in JSON format only:
{
  "explanation": "plain language explanation of what happened",
  "concept": "concept name or null",
  "curriculumRef": "Learn Path reference or null",
  "lessonCompleted": true/false,
  "honchoMessage": "final 2-3 sentence message for Honcho"
}`;

// ════════════════════════════════
// ANALYSIS FUNCTION
// ════════════════════════════════

const anthropic = new Anthropic();

/**
 * Analyze a position and return pedagogical explanation + curriculum mapping.
 * Uses Haiku for speed. Fire-and-forget from the game loop.
 */
export async function analyzePosition(input: AnalysisInput): Promise<AnalysisOutput> {
  const evalDeltaPawns = ((input.evalAfter - input.evalBefore) / 100).toFixed(1);
  const completedList = input.completedLessons.length > 0
    ? input.completedLessons.join(', ')
    : 'None yet';

  const userPrompt = `Position analysis:
- Move ${input.moveNumber} (${input.phase}): ${input.color} played ${input.movePlayed}
- Best move was: ${input.bestMove}
- Eval change: ${evalDeltaPawns} pawns (${input.evalBefore / 100} → ${input.evalAfter / 100})
- Event type: ${input.eventType}
- Player's completed lessons: ${completedList}
- FEN: ${input.fen}

Analyze this position and explain what concept was at play.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('');

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return fallbackOutput(input);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      explanation: parsed.explanation || '',
      concept: parsed.concept || null,
      curriculumRef: parsed.curriculumRef || null,
      lessonCompleted: parsed.lessonCompleted ?? false,
      honchoMessage: parsed.honchoMessage || parsed.explanation || '',
    };
  } catch (err) {
    console.error('Chess analysis agent error:', err);
    return fallbackOutput(input);
  }
}

/**
 * Fallback when the LLM call fails — still produces a usable message.
 */
function fallbackOutput(input: AnalysisInput): AnalysisOutput {
  const action = input.eventType === 'blunder'
    ? `made a mistake on move ${input.moveNumber}`
    : input.eventType === 'brilliant'
      ? `found a strong move on move ${input.moveNumber}`
      : input.eventType === 'missed_win'
        ? `missed a winning opportunity on move ${input.moveNumber}`
        : input.eventType === 'missed_tactic'
          ? `missed a tactic on move ${input.moveNumber}`
          : `played move ${input.moveNumber}`;

  return {
    explanation: `Player ${action}. ${input.movePlayed} was played instead of ${input.bestMove}.`,
    concept: null,
    curriculumRef: null,
    lessonCompleted: false,
    honchoMessage: `Player ${action} during the ${input.phase}. Played ${input.movePlayed} instead of ${input.bestMove}.`,
  };
}
