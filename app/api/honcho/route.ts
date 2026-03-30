import { NextRequest, NextResponse } from 'next/server';
import {
  createHonchoGameSession,
  getPlayerContext,
  seedPeerCard,
  logToHoncho,
} from '@/lib/honcho';
import { logGameSummary, logOpeningClassification, logBoardEvent, type GameSummaryEvent, type BoardEvent } from '@/lib/honcho-logger';

/**
 * POST /api/honcho
 *
 * Lightweight proxy for Honcho operations (API key is server-side only).
 * Actions: start_session, get_context, log_opening, log_event, log_summary, seed_card
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
      // Return session ID so client can reference it
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
      const result = logOpeningClassification(honcho, moves, color);
      console.log(`[Honcho] Opening classified: ${result?.name ?? 'unknown'}`);
      return NextResponse.json({ opening: result });
    }

    if (action === 'log_event') {
      const { gameId, userId, event, completedLessons } = body;
      if (!gameId || !userId) {
        return NextResponse.json({ error: 'Missing gameId or userId' }, { status: 400 });
      }
      const honcho = await createHonchoGameSession(gameId, userId);
      logBoardEvent(honcho, event as BoardEvent, completedLessons ?? []);
      console.log(`[Honcho] Board event logged: ${event.eventType} move ${event.moveNumber}`);
      return NextResponse.json({ ok: true });
    }

    if (action === 'log_summary') {
      const { gameId, userId, summary } = body;
      if (!gameId || !userId) {
        return NextResponse.json({ error: 'Missing gameId or userId' }, { status: 400 });
      }
      const honcho = await createHonchoGameSession(gameId, userId);
      logGameSummary(honcho, summary as GameSummaryEvent);
      console.log(`[Honcho] Game summary logged: ${summary.result} in ${summary.moveCount} moves`);
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
