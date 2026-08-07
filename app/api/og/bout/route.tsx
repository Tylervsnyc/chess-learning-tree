import { ImageResponse } from 'next/og';
import { FightNightCard } from '@/lib/og/fight-night';

export const runtime = 'edge';

/**
 * Reel/story-sized (1080x1920) Fight Night share card for a finished Chess
 * Boxing BOUT — static PNG of the final position. The animated version (last
 * moves playing out) is /api/og/bout-gif; this is the fallback and the
 * link-preview image. Design approved on /test/box-share (2026-08-07).
 *
 * Query params:
 *   outcome  — ko_win | decision_win | draw | decision_loss | ko_loss | flag_loss
 *   username — handle (optional; tape shows "You" if absent)
 *   fen      — final position (board field is all that's read)
 *   last     — last move squares to highlight, e.g. "h5f7"
 *   rounds   — boxing rounds survived
 *   moves    — moves played
 *   clock    — seconds left on the user's bank at the end
 */

function fmtClock(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const outcome = searchParams.get('outcome') || 'decision_win';
  const username = (searchParams.get('username') || '').slice(0, 20);
  const fen = searchParams.get('fen') || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  const last = searchParams.get('last') || undefined;
  const rounds = Math.max(0, Math.min(9, parseInt(searchParams.get('rounds') || '0', 10) || 0));
  const moves = Math.max(0, parseInt(searchParams.get('moves') || '0', 10) || 0);
  const clock = Math.max(0, parseInt(searchParams.get('clock') || '0', 10) || 0);

  const s = 3.6; // 300x533 design space -> 1080x1919
  const response = new ImageResponse(
    (
      <FightNightCard
        frame={{ fen, last, stamp: outcome === 'ko_win' || outcome === 'ko_loss' }}
        outcome={outcome}
        username={username}
        moves={moves}
        rounds={rounds}
        clock={fmtClock(clock)}
        s={s}
      />
    ),
    { width: 300 * s, height: 533 * s },
  );
  response.headers.set('Cache-Control', 'public, s-maxage=86400');
  return response;
}
