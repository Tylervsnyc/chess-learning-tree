import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/lichess-explorer?fen=...
 * Proxies the Lichess masters explorer API with server-side auth.
 * Lichess now requires authentication for the masters endpoint.
 */
export async function GET(req: NextRequest) {
  const fen = req.nextUrl.searchParams.get('fen');
  if (!fen) {
    return NextResponse.json({ error: 'Missing fen' }, { status: 400 });
  }

  const token = process.env.LICHESS_TOKEN;
  const encoded = encodeURIComponent(fen);

  try {
    const response = await fetch(
      `https://explorer.lichess.ovh/masters?fen=${encoded}&topGames=0&recentGames=0`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Lichess API error', status: response.status },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Timeout' }, { status: 504 });
  }
}
