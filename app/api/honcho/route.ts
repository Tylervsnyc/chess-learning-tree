import { NextRequest, NextResponse } from 'next/server';
import {
  createHonchoGameSession,
  getPlayerContext,
  seedPeerCard,
} from '@/lib/honcho';
import { classifyOpening } from '@/lib/opening-classifier';
import { analyzePosition, type AnalysisInput } from '@/lib/chess-analysis-agent';
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
      console.log(`[Honcho] Player context for ${userId}: ${context ? context.slice(0, 100) + '...' : 'null'}`);
      return NextResponse.json({ context });
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
      const { gameId, userId, event, completedLessons } = body;
      if (!gameId || !userId) {
        return NextResponse.json({ error: 'Missing gameId or userId' }, { status: 400 });
      }
      const honcho = await createHonchoGameSession(gameId, userId);
      // Run analysis agent to get pedagogical message
      const input: AnalysisInput = { ...event, completedLessons: completedLessons ?? [] };
      const analysis = await analyzePosition(input);
      // Await the log — Lambda would freeze otherwise
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
      const message = `Game ended: ${resultText} in ${summary.moveCount} moves as ${summary.color} ${opening}. ` +
        `Accuracy: ${Math.round(summary.playerAccuracy)}%. ` +
        `Phase: opening ${summary.phase.opening}, middlegame ${summary.phase.middlegame}, endgame ${summary.phase.endgame}.`;

      await honcho.session.addMessages([honcho.user.message(message)]);
      console.log(`[Honcho] Summary logged: ${message.slice(0, 100)}...`);
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
