import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: draw, error: drawErr } = await supabase
    .from('boxing_draws')
    .select('id, theme, pages, show_themes, created_at')
    .eq('id', id)
    .single();
  if (drawErr || !draw) {
    return NextResponse.json({ error: 'Draw not found' }, { status: 404 });
  }

  const { data: puzzleRows, error: rowsErr } = await supabase
    .from('boxing_puzzle_draws')
    .select('puzzle_id, position, fen, moves, rating, themes')
    .eq('draw_id', id)
    .order('position', { ascending: true });
  if (rowsErr) {
    return NextResponse.json({ error: rowsErr.message }, { status: 500 });
  }

  const puzzles = (puzzleRows ?? []).map((r) => ({
    puzzleId: r.puzzle_id,
    fen: r.fen,
    moves: r.moves as string[],
    rating: r.rating,
    themes: r.themes as string[],
  }));

  return NextResponse.json({
    draw: {
      id: draw.id,
      theme: draw.theme,
      pages: draw.pages,
      showThemes: draw.show_themes,
      createdAt: draw.created_at,
    },
    puzzles,
  });
}
