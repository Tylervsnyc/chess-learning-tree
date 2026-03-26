/**
 * Coaching Prompt Builder — generates Rookie's post-game coaching script.
 *
 * Takes session data (+ optional cross-session stats for premium) and
 * produces a prompt for Claude that returns structured coaching messages.
 *
 * Framework: 2 positives, 1 improvement, optional content recommendation.
 */

import { ROOKIE_DIAGNOSTIC_PROMPT } from '@/lib/rookie-personality';
import { SessionSummary } from '@/lib/game-session';
import { SessionCoachingData } from '@/lib/coaching-stats';
import { CoachingProfile } from '@/lib/coaching-stats';
import { getRecommendations, getThemeName, getRookieRecommendation } from '@/lib/content-map';
import { GameAnalysis, MoveEvaluation } from '@/lib/game-eval';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

export interface CoachingMessage {
  type: 'positive' | 'improvement' | 'recommendation' | 'closing';
  text: string;
  lessonId?: string;   // for recommendation messages — tappable
  lessonName?: string;
}

export interface CoachingScript {
  messages: CoachingMessage[];
  mood: string;           // Rookie's mood for BreathingRook
  isPremium: boolean;
}

// ════════════════════════════════
// FREE TIER — session-only coaching (no LLM needed)
// ════════════════════════════════

/**
 * Generate free-tier coaching from session data alone.
 * No API call — instant, deterministic, runs client-side.
 *
 * When GameAnalysis is provided (from evals collected during play),
 * generates richer feedback: accuracy, biggest blunder, best move,
 * turning points, and clean stretches.
 */
export function generateFreeCoaching(
  session: SessionCoachingData,
  playerName?: string,
  analysis?: GameAnalysis | null,
): CoachingScript {
  const messages: CoachingMessage[] = [];
  const name = playerName || 'friend';

  // For play-rookie games
  if (session.result) {
    // ── Result message ──
    if (session.result === 'win') {
      messages.push({
        type: 'positive',
        text: `You won. I'm not sure what I'm feeling but my circuits are doing something unusual. Good game, ${name}.`,
      });
    } else if (session.result === 'loss') {
      messages.push({
        type: 'positive',
        text: `I won that one. But you made me work for it — I want you to know that.`,
      });
    } else {
      messages.push({
        type: 'positive',
        text: `A draw. Neither of us wanted that, but here we are. Respectable.`,
      });
    }

    // ── Analysis-driven feedback (from Stockfish evals collected during play) ──
    if (analysis && analysis.playerMoveCount > 0) {
      // Accuracy callout
      const acc = Math.round(analysis.playerAccuracy);
      messages.push({
        type: acc >= 70 ? 'positive' : 'improvement',
        text: acc >= 90
          ? `${acc}% accuracy. That's near-engine play. I'm... intimidated? Is that a feeling?`
          : acc >= 70
            ? `${acc}% accuracy — solid. You're making more right moves than wrong ones.`
            : acc >= 50
              ? `${acc}% accuracy. There's room to grow, but you're thinking about your moves. I can tell.`
              : `${acc}% accuracy. Some of those moves hurt us both, ${name}. Let's talk about it.`,
      });

      // Biggest blunder — the most teachable moment
      const biggestBlunder = findBiggestBlunder(analysis);
      if (biggestBlunder) {
        const drop = Math.round(biggestBlunder.winPercentDelta);
        messages.push({
          type: 'improvement',
          text: `Move ${biggestBlunder.moveNumber} — ${biggestBlunder.san}. That one cost you ${drop}% winning chances. `
            + (biggestBlunder.bestMoveSan
              ? `The engine wanted ${biggestBlunder.bestMoveSan} instead.`
              : `Before you move, ask: "What can they do to me after this?"`),
        });
      }

      // Best move — something to feel good about
      const bestMove = findBestPlayerMove(analysis);
      if (bestMove) {
        const cls = bestMove.classification;
        messages.push({
          type: 'positive',
          text: cls === 'brilliant'
            ? `Move ${bestMove.moveNumber} — ${bestMove.san}. That was brilliant. The only winning move and you found it.`
            : cls === 'great'
              ? `Move ${bestMove.moveNumber} — ${bestMove.san}. Engine's top choice. You saw what I saw.`
              : `Move ${bestMove.moveNumber} — ${bestMove.san}. Clean move. No win% lost.`,
        });
      }

      // Turning point — where the game swung
      const turningPoint = findTurningPoint(analysis);
      if (turningPoint && (!biggestBlunder || turningPoint.moveNumber !== biggestBlunder.moveNumber)) {
        const wasGaining = turningPoint.winPercentDelta < 0;
        messages.push({
          type: wasGaining ? 'positive' : 'improvement',
          text: wasGaining
            ? `The game turned on move ${turningPoint.moveNumber}. That's where you took control.`
            : `Move ${turningPoint.moveNumber} is where it slipped. You were doing well up to that point.`,
        });
      }

      // Clean stretch — longest run without a mistake/blunder
      const cleanStretch = findLongestCleanStretch(analysis);
      if (cleanStretch.length >= 5) {
        messages.push({
          type: 'positive',
          text: `${cleanStretch.length} moves in a row with no mistakes. That's real consistency, ${name}.`,
        });
      }

      // Blunder count warning (if multiple)
      if (analysis.blunders >= 3) {
        messages.push({
          type: 'improvement',
          text: `${analysis.blunders} blunders this game. Each one is a big swing — one less blunder and this might've gone differently.`,
        });
      }

    } else {
      // Fallback: no analysis available — use the old heuristics
      if (session.piecesHung > 0) {
        messages.push({
          type: 'improvement',
          text: session.piecesHung === 1
            ? `You left one piece hanging — undefended, free for me to take. Before you move, check: is anything unprotected?`
            : `You left ${session.piecesHung} pieces hanging. That's... a lot of free material. Before each move, ask yourself: "Can they just take something?"`,
        });
      } else if (session.capturesMissed > 0) {
        messages.push({
          type: 'improvement',
          text: session.capturesMissed === 1
            ? `You missed a free capture — I left something undefended and you didn't take it. Always look for free stuff.`
            : `You missed ${session.capturesMissed} free captures. I was practically handing you pieces. Look for undefended things before you plan.`,
        });
      }
    }

    const mood = session.result === 'win'
      ? 'happy'
      : (analysis && analysis.playerAccuracy >= 70) ? 'neutral' : 'nervous';
    return { messages, mood, isPremium: false };
  }

  // For puzzle sessions (Daily Rook / Lessons)
  const total = session.puzzlesTotal;
  const correct = session.puzzlesCorrect;
  const accuracy = total > 0 ? correct / total : 0;

  // Positive 1: what they got right
  if (session.themesCorrect.length > 0) {
    const best = session.themesCorrect[0];
    const themeName = getThemeName(best);
    messages.push({
      type: 'positive',
      text: accuracy >= 0.8
        ? `${correct} out of ${total}. ${themeName}s — you're seeing them now. That's not nothing.`
        : `You got the ${themeName.toLowerCase()} puzzles. Those are yours.`,
    });
  } else if (correct > 0) {
    messages.push({
      type: 'positive',
      text: `${correct} out of ${total}. You're getting there, ${name}.`,
    });
  }

  // Streak callout
  if (session.bestStreak >= 5) {
    messages.push({
      type: 'positive',
      text: `${session.bestStreak} in a row at one point. My circuits did that warm thing again.`,
    });
  }

  // Improvement: what they missed
  if (session.themesMissed.length > 0) {
    const weakest = session.themesMissed[0];
    const themeName = getThemeName(weakest);
    messages.push({
      type: 'improvement',
      text: `The ${themeName.toLowerCase()} puzzles tripped you up. That's the one to work on.`,
    });

    // Recommendation
    const rec = getRookieRecommendation(weakest);
    if (rec) {
      messages.push({
        type: 'recommendation',
        text: rec.message,
        lessonId: rec.lessonId,
        lessonName: rec.lessonName,
      });
    }
  }

  const mood = accuracy >= 0.8 ? 'happy' : accuracy >= 0.5 ? 'neutral' : 'nervous';
  return { messages, mood, isPremium: false };
}

// ════════════════════════════════
// PREMIUM TIER — LLM-powered coaching with cross-session memory
// ════════════════════════════════

/**
 * Build the prompt for Claude to generate premium coaching.
 * Returns the system prompt + user message to send to the API.
 */
export function buildPremiumCoachingPrompt(
  session: SessionCoachingData,
  profile: CoachingProfile,
  playerName?: string,
): { system: string; userMessage: string } {
  const name = playerName || 'friend';

  // Build context block for Claude
  const sessionContext = buildSessionContext(session);
  const profileContext = buildProfileContext(profile);
  const recommendationContext = buildRecommendationContext(profile.weakThemes);

  const userMessage = `
You just finished a ${session.result ? 'chess game' : 'puzzle session'} with ${name}. Here's what happened:

SESSION:
${sessionContext}

PLAYER HISTORY (last 30 days):
${profileContext}

AVAILABLE LESSONS TO RECOMMEND:
${recommendationContext}

Generate Rookie's post-game coaching. Follow the 2-positives-1-improvement framework:

1. POSITIVE 1: Something they did well THIS session. Be specific — name the tactic or pattern.
2. POSITIVE 2: How they've improved over time (use the history data). If no history, skip this.
3. IMPROVEMENT: One specific thing to work on. Actionable. Tied to what they missed.
4. RECOMMENDATION: If there's a relevant lesson, mention it conversationally. Include the lesson ID.
5. CLOSING: One Rookie-style sign-off. Brief. Can reference a side project or an emotion she's processing.

Respond as JSON array of objects: [{ "type": "positive"|"improvement"|"recommendation"|"closing", "text": "...", "lessonId?": "..." }]
Keep each message to 1-2 sentences max. Write for TTS — conversational, contractions, em dashes for pauses.`;

  return { system: ROOKIE_DIAGNOSTIC_PROMPT, userMessage };
}

/**
 * Call Claude API to generate premium coaching messages.
 */
export async function generatePremiumCoaching(
  session: SessionCoachingData,
  profile: CoachingProfile,
  playerName?: string,
): Promise<CoachingScript> {
  const { system, userMessage } = buildPremiumCoachingPrompt(session, profile, playerName);

  try {
    const res = await fetch('/api/coaching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, userMessage }),
    });

    if (!res.ok) throw new Error('Coaching API failed');

    const data = await res.json();
    const messages: CoachingMessage[] = data.messages || [];

    // Determine mood from session
    let mood = 'neutral';
    if (session.result === 'win') mood = 'happy';
    else if (session.result === 'loss') mood = 'nervous';
    else if (session.puzzlesCorrect / Math.max(session.puzzlesTotal, 1) >= 0.8) mood = 'happy';

    return { messages, mood, isPremium: true };
  } catch {
    // Fallback to free coaching if API fails
    return generateFreeCoaching(session, playerName);
  }
}

// ════════════════════════════════
// CONTEXT BUILDERS
// ════════════════════════════════

function buildSessionContext(session: SessionCoachingData): string {
  const lines: string[] = [];

  if (session.result) {
    lines.push(`Result: ${session.result}`);
    lines.push(`Pieces hung (left undefended): ${session.piecesHung}`);
    lines.push(`Free captures missed: ${session.capturesMissed}`);
  } else {
    lines.push(`Puzzles: ${session.puzzlesCorrect}/${session.puzzlesTotal} correct`);
    lines.push(`Best streak: ${session.bestStreak} in a row`);
  }

  if (session.themesCorrect.length > 0) {
    lines.push(`Themes they got right: ${session.themesCorrect.map(t => getThemeName(t)).join(', ')}`);
  }
  if (session.themesMissed.length > 0) {
    lines.push(`Themes they struggled with: ${session.themesMissed.map(t => getThemeName(t)).join(', ')}`);
  }

  return lines.join('\n');
}

function buildProfileContext(profile: CoachingProfile): string {
  const lines: string[] = [];

  lines.push(`Total sessions: ${profile.totalSessions}`);
  if (profile.totalPlayRookieGames > 0) {
    lines.push(`Play Rookie games: ${profile.totalPlayRookieGames} (win rate: ${Math.round(profile.winRate * 100)}%)`);
  }

  if (profile.strongThemes.length > 0) {
    lines.push(`Strong themes: ${profile.strongThemes.map(t => getThemeName(t)).join(', ')}`);
  }
  if (profile.weakThemes.length > 0) {
    lines.push(`Weak themes: ${profile.weakThemes.map(t => getThemeName(t)).join(', ')}`);
  }

  // Trends
  const improving = profile.trends.filter(t => t.improving && t.delta > 0.1);
  if (improving.length > 0) {
    lines.push(`Improving this week: ${improving.map(t => `${getThemeName(t.theme)} (+${Math.round(t.delta * 100)}%)`).join(', ')}`);
  }
  const declining = profile.trends.filter(t => !t.improving && t.delta < -0.1);
  if (declining.length > 0) {
    lines.push(`Declining this week: ${declining.map(t => `${getThemeName(t.theme)} (${Math.round(t.delta * 100)}%)`).join(', ')}`);
  }

  if (profile.recurringWeaknesses.length > 0) {
    lines.push(`Recurring issues (3+ sessions): ${profile.recurringWeaknesses.map(t => getThemeName(t)).join(', ')}`);
  }

  if (profile.piecesHungTotal > 0) {
    lines.push(`Total pieces hung (all time): ${profile.piecesHungTotal}`);
  }

  return lines.join('\n');
}

function buildRecommendationContext(weakThemes: string[]): string {
  if (weakThemes.length === 0) return 'No specific recommendations available.';

  const recs = getRecommendations(weakThemes, new Set(), 1);
  if (recs.length === 0) return 'No matching lessons found.';

  return recs
    .map(r => `- ${r.name} (ID: ${r.id}) — ${r.sectionName}, Level ${r.level}`)
    .join('\n');
}

// ════════════════════════════════
// ANALYSIS HELPERS — extract moments from GameAnalysis
// ════════════════════════════════

/** Find the player's biggest blunder (largest win% drop). */
function findBiggestBlunder(analysis: GameAnalysis): MoveEvaluation | null {
  const blunders = analysis.moves.filter(
    m => m.movedBy === 'player' && (m.classification === 'blunder' || m.classification === 'mistake'),
  );
  if (blunders.length === 0) return null;
  return blunders.reduce((worst, m) =>
    m.winPercentDelta > worst.winPercentDelta ? m : worst,
  );
}

/** Find the player's best move (great/brilliant, with highest accuracy in a non-trivial position). */
function findBestPlayerMove(analysis: GameAnalysis): MoveEvaluation | null {
  const good = analysis.moves.filter(
    m => m.movedBy === 'player' && (m.classification === 'brilliant' || m.classification === 'great'),
  );
  if (good.length === 0) return null;
  // Prefer brilliant, then the great move in the most volatile position (hardest to find)
  const brilliant = good.find(m => m.classification === 'brilliant');
  if (brilliant) return brilliant;
  // Pick the great move where win% before was closest to 50 (sharpest position)
  return good.reduce((best, m) => {
    const sharpness = Math.abs(50 - m.winPercentBefore);
    const bestSharpness = Math.abs(50 - best.winPercentBefore);
    return sharpness < bestSharpness ? m : best;
  });
}

/**
 * Find the turning point — the single move with the biggest absolute eval swing.
 * This is often the moment the game was won or lost.
 */
function findTurningPoint(analysis: GameAnalysis): MoveEvaluation | null {
  if (analysis.moves.length < 4) return null;
  let biggest: MoveEvaluation | null = null;
  let biggestSwing = 0;
  for (const m of analysis.moves) {
    const swing = Math.abs(m.winPercentDelta);
    if (swing > biggestSwing) {
      biggestSwing = swing;
      biggest = m;
    }
  }
  // Only report if the swing was significant
  return biggestSwing >= 15 ? biggest : null;
}

/**
 * Find the longest stretch of player moves without a mistake or blunder.
 * Returns the array of consecutive clean moves.
 */
function findLongestCleanStretch(analysis: GameAnalysis): MoveEvaluation[] {
  const playerMoves = analysis.moves.filter(m => m.movedBy === 'player');
  let best: MoveEvaluation[] = [];
  let current: MoveEvaluation[] = [];

  for (const m of playerMoves) {
    if (m.classification !== 'blunder' && m.classification !== 'mistake') {
      current.push(m);
    } else {
      if (current.length > best.length) best = current;
      current = [];
    }
  }
  if (current.length > best.length) best = current;
  return best;
}
