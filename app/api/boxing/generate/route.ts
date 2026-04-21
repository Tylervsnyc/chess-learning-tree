import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { selectBoxingPuzzles } from '@/lib/boxing/select-puzzles';
import { BOXING_THEMES, type BoxingTheme } from '@/lib/boxing/themes';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const theme = body.theme as BoxingTheme;
  const pages = Math.min(8, Math.max(1, Number(body.pages) || 4));
  const showThemes = Boolean(body.showThemes);

  const validThemes = new Set<string>(['mixed', ...BOXING_THEMES]);
  if (!validThemes.has(theme)) {
    return NextResponse.json({ error: `Invalid theme: ${theme}` }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: used, error: usedErr } = await supabase
    .from('boxing_puzzle_draws')
    .select('puzzle_id');
  if (usedErr) {
    return NextResponse.json({ error: usedErr.message }, { status: 500 });
  }
  const excluded = new Set<string>((used ?? []).map((r) => r.puzzle_id));

  let puzzles;
  try {
    puzzles = selectBoxingPuzzles({ theme, pages, excluded });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Selection failed' },
      { status: 409 },
    );
  }

  const { data: draw, error: drawErr } = await supabase
    .from('boxing_draws')
    .insert({ theme, pages, show_themes: showThemes })
    .select('id')
    .single();
  if (drawErr || !draw) {
    return NextResponse.json({ error: drawErr?.message ?? 'Insert failed' }, { status: 500 });
  }

  const rows = puzzles.map((p, i) => ({
    puzzle_id: p.puzzleId,
    draw_id: draw.id,
    position: i,
    fen: p.fen,
    moves: p.moves,
    rating: p.rating,
    themes: p.themes,
  }));
  const { error: rowsErr } = await supabase.from('boxing_puzzle_draws').insert(rows);
  if (rowsErr) {
    // Roll back the draw row so we don't leave a draw with no puzzles.
    await supabase.from('boxing_draws').delete().eq('id', draw.id);
    return NextResponse.json({ error: rowsErr.message }, { status: 500 });
  }

  return NextResponse.json({ drawId: draw.id });
}
