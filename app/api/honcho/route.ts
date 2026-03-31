import { NextRequest, NextResponse } from 'next/server';
import {
  createHonchoGameSession,
  getPlayerContext,
  getLastGameSummary,
  seedPeerCard,
  triggerDream,
} from '@/lib/honcho';
import { classifyOpening } from '@/lib/opening-classifier';
import { analyzePosition, type AnalysisInput } from '@/lib/chess-analysis-agent';
import { formatHonchoSummaryForPrompt } from '@/lib/rookie-memory';
import type { BoardEvent } from '@/lib/honcho-logger';

/**
 * POST /api/honcho
 *
 * Server-side proxy for Honcho operations. All logging is AWAITED here
 * (not fire-and-forget) because Vercel Lambdas freeze after response.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'start_session') {
      const { gameId, userId } = body;
      if (!gameId || !userId) {
        return NextResponse.json({ error: 'Missing gameId or userId' }, { status: 400 });
      }
      const honcho = await createHonchoGameSession(gameId, userId);
      console.log(`[Honcho] Session started: game=${gameId} user=${userId}`);
      return NextResponse.json({ ok: true, gameId });
    }

    if (action === 'get_context') {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }
      const context = await getPlayerContext(userId);
      const preview = formatHonchoSummaryForPrompt(context);
      console.log(`[Honcho] Player context for ${userId}: ${preview ? preview.slice(0, 100) + '...' : 'null'}`);
      return NextResponse.json({ context });
    }

    if (action === 'get_last_game') {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }
      const summary = await getLastGameSummary(userId);
      console.log(`[Honcho] Last game for ${userId}: ${summary ? summary.slice(0, 80) + '...' : 'null'}`);
      return NextResponse.json({ lastGame: summary });
    }

    if (action === 'log_opening') {
      const { gameId, userId, moves, color } = body;
      if (!gameId || !userId) {
        return NextResponse.json({ error: 'Missing gameId or userId' }, { status: 400 });
      }
      const honcho = await createHonchoGameSession(gameId, userId);
      const result = classifyOpening(moves);
      if (result) {
        const message = `Player opened with the ${result.name} (${result.eco}) playing ${color}.`;
        await honcho.session.addMessages([honcho.user.message(message)]);
        console.log(`[Honcho] Opening logged: ${result.name}`);
      }
      return NextResponse.json({ opening: result });
    }

    if (action === 'log_event') {
      const { gameId, userId, event, completedLessons, behavioral } = body;
      if (!gameId || !userId) {
        return NextResponse.json({ error: 'Missing gameId or userId' }, { status: 400 });
      }
      const honcho = await createHonchoGameSession(gameId, userId);

      // Behavioral events get a simpler message (no LLM analysis needed)
      if (behavioral) {
        const behaviorMessages: Record<string, string> = {
          long_think: `Player took ${behavioral.seconds}s to think on move ${event.moveNumber} before playing ${event.movePlayed}.`,
          panic_sequence: `Player made 3+ rapid moves after a long think around move ${behavioral.moveNumber}. Possible frustration or time pressure.`,
        };
        const msg = behaviorMessages[behavioral.type] ?? `Behavioral event: ${behavioral.type} on move ${event.moveNumber}.`;
        await honcho.session.addMessages([honcho.user.message(msg)]);
        console.log(`[Honcho] Behavioral: ${msg}`);
        return NextResponse.json({ ok: true });
      }

      // Board events run through the analysis agent for pedagogical context
      const input: AnalysisInput = { ...event, completedLessons: completedLessons ?? [] };
      const analysis = await analyzePosition(input);
      await honcho.session.addMessages([honcho.user.message(analysis.honchoMessage)]);
      console.log(`[Honcho] Event logged: ${event.eventType} move ${event.moveNumber} — "${analysis.honchoMessage.slice(0, 80)}..."`);
      return NextResponse.json({ ok: true, concept: analysis.concept });
    }

    if (action === 'log_summary') {
      const { gameId, userId, summary } = body;
      if (!gameId || !userId) {
        return NextResponse.json({ error: 'Missing gameId or userId' }, { status: 400 });
      }
      const honcho = await createHonchoGameSession(gameId, userId);

      const opening = summary.openingName
        ? `playing the ${summary.openingName}${summary.openingEco ? ` (${summary.openingEco})` : ''}`
        : 'with an unknown opening';
      const resultText = summary.result === 'win' ? 'won' : summary.result === 'loss' ? 'lost' : 'drew';
      const parts = [
        `Game ended: ${resultText} in ${summary.moveCount} moves as ${summary.color} ${opening}.`,
        `Accuracy: ${Math.round(summary.playerAccuracy)}%.`,
        summary.blunders > 0 ? `Blunders: ${summary.blunders}.` : null,
        summary.mistakes > 0 ? `Mistakes: ${summary.mistakes}.` : null,
        summary.brilliantMoves > 0 ? `Brilliant moves: ${summary.brilliantMoves}.` : null,
        summary.primaryWeakness ? `Key moments: ${summary.primaryWeakness}` : null,
        summary.deviation ? `Opening deviation: ${summary.deviation}` : null,
        `Phase: opening ${summary.phase.opening}, middlegame ${summary.phase.middlegame}, endgame ${summary.phase.endgame}.`,
      ];
      const message = parts.filter(Boolean).join(' ');

      await honcho.session.addMessages([honcho.user.message(message)]);
      console.log(`[Honcho] Summary logged: ${message.slice(0, 100)}...`);

      // Game is over — trigger a dream to consolidate into conclusions
      await triggerDream(userId);
      console.log(`[Honcho] Dream scheduled for ${userId}`);

      return NextResponse.json({ ok: true });
    }

    if (action === 'seed_card') {
      const { userId, profile } = body;
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }
      await seedPeerCard(userId, profile);
      console.log(`[Honcho] Peer card seeded for ${userId}`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error) {
    console.error('[Honcho] API error:', error);
    return NextResponse.json({ error: 'Honcho operation failed' }, { status: 500 });
  }
}
