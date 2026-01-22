import { NextResponse } from 'next/server';

interface LichessUser {
  username: string;
  perfs?: {
    puzzle?: { rating: number };
    rapid?: { rating: number };
    blitz?: { rating: number };
    bullet?: { rating: number };
    classical?: { rating: number };
  };
}

interface ChessComStats {
  tactics?: {
    highest?: { rating: number };
    lowest?: { rating: number };
  };
  chess_rapid?: {
    last?: { rating: number };
  };
  chess_blitz?: {
    last?: { rating: number };
  };
  chess_bullet?: {
    last?: { rating: number };
  };
  puzzle_rush?: {
    best?: { score: number };
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const username = searchParams.get('username');

  if (!platform || !username) {
    return NextResponse.json(
      { error: 'Missing platform or username' },
      { status: 400 }
    );
  }

  if (platform !== 'lichess' && platform !== 'chesscom') {
    return NextResponse.json(
      { error: 'Invalid platform. Use "lichess" or "chesscom"' },
      { status: 400 }
    );
  }

  try {
    if (platform === 'lichess') {
      // Lichess API
      const res = await fetch(`https://lichess.org/api/user/${encodeURIComponent(username)}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (res.status === 404) {
        return NextResponse.json(
          { error: `User "${username}" not found on Lichess` },
          { status: 404 }
        );
      }

      if (!res.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch from Lichess' },
          { status: 502 }
        );
      }

      const data: LichessUser = await res.json();

      return NextResponse.json({
        username: data.username,
        platform: 'lichess',
        puzzleRating: data.perfs?.puzzle?.rating || null,
        rapidRating: data.perfs?.rapid?.rating || null,
        blitzRating: data.perfs?.blitz?.rating || null,
        bulletRating: data.perfs?.bullet?.rating || null,
      });
    } else {
      // Chess.com API - first check if user exists
      const profileRes = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(username.toLowerCase())}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (profileRes.status === 404) {
        return NextResponse.json(
          { error: `User "${username}" not found on Chess.com` },
          { status: 404 }
        );
      }

      if (!profileRes.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch from Chess.com' },
          { status: 502 }
        );
      }

      const profile = await profileRes.json();

      // Now fetch stats
      const statsRes = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(username.toLowerCase())}/stats`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!statsRes.ok) {
        // User exists but no stats yet
        return NextResponse.json({
          username: profile.username || username,
          platform: 'chesscom',
          puzzleRating: null,
          rapidRating: null,
          blitzRating: null,
          bulletRating: null,
        });
      }

      const stats: ChessComStats = await statsRes.json();

      return NextResponse.json({
        username: profile.username || username,
        platform: 'chesscom',
        puzzleRating: stats.tactics?.highest?.rating || null,
        rapidRating: stats.chess_rapid?.last?.rating || null,
        blitzRating: stats.chess_blitz?.last?.rating || null,
        bulletRating: stats.chess_bullet?.last?.rating || null,
      });
    }
  } catch (error) {
    console.error('Error fetching rating:', error);
    return NextResponse.json(
      { error: 'Network error while fetching rating' },
      { status: 502 }
    );
  }
}
