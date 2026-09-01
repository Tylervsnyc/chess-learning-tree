import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { aiGuard } from '@/lib/ai-guard';
import { createServiceClient } from '@/lib/supabase/service';
import { getSkillProfile, type ThemeSkill } from '@/lib/skill-profile';
import { stripLeakedPlaceholders } from '@/lib/speech/sanitize';
import { ROOKIE_REPORT_MODEL, ROOKIE_REPORT_SYSTEM } from '@/lib/workout/report-voice';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

export const maxDuration = 30;

/**
 * POST /api/workout/report-lines
 *
 * Rookie's commentary for the interactive post-workout report
 * (/workout/report/[id]). The browser already ran Stockfish and sends the
 * FACTS (solution, the move played, evals from the solver's view); this route
 * only writes the words — one line per miss + a one-sentence diagnosis — and
 * returns the user's theme profile for the "what these have in common" screen.
 *
 * Body: { sessionId, misses: [{ puzzleId, rating, themes, solutionSan, failedAtMove,
 *         playedSan, evalPlayed, evalCorrect }] }   (evals in pawns, mate = ±100)
 * Returns: { lines: string[], diagnosis, profile: { weakest, strongest, userLevel } }
 *
 * Guarded by aiGuard (auth + body cap + 20/day per user). ~$0.01 per call.
 */

const anthropic = new Anthropic();
const MAX_MISSES = 30;

interface MissFact {
  puzzleId: string;
  rating: number;
  themes: string[];
  solutionSan: string[];
  failedAtMove: number;
  playedSan: string | null;
  evalPlayed: number | null;
  evalCorrect: number | null;
}

function parseMisses(raw: unknown): MissFact[] {
  if (!Array.isArray(raw)) return [];
  const out: MissFact[] = [];
  for (const item of raw.slice(0, MAX_MISSES)) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    if (!Array.isArray(o.solutionSan)) continue;
    out.push({
      puzzleId: typeof o.puzzleId === 'string' ? o.puzzleId.slice(0, 16) : '?',
      rating: typeof o.rating === 'number' ? Math.trunc(o.rating) : 0,
      themes: Array.isArray(o.themes) ? o.themes.filter((t): t is string => typeof t === 'string').slice(0, 20) : [],
      solutionSan: o.solutionSan.filter((m): m is string => typeof m === 'string').slice(0, 40),
      failedAtMove: typeof o.failedAtMove === 'number' ? Math.max(0, Math.trunc(o.failedAtMove)) : 0,
      playedSan: typeof o.playedSan === 'string' ? o.playedSan.slice(0, 12) : null,
      evalPlayed: typeof o.evalPlayed === 'number' && Number.isFinite(o.evalPlayed) ? o.evalPlayed : null,
      evalCorrect: typeof o.evalCorrect === 'number' && Number.isFinite(o.evalCorrect) ? o.evalCorrect : null,
    });
  }
  return out;
}

function ev(n: number | null): string {
  if (n == null) return '?';
  if (Math.abs(n) >= 100) return n > 0 ? 'mate' : 'gets mated';
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}`;
}

function themeLine(t: ThemeSkill): string {
  return `${t.theme} ${Math.round(t.accuracy * 100)}% of ${t.attempts}`;
}

export async function POST(req: NextRequest) {
  if (!FEATURE_FLAGS.WORKOUT_REPORT) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const guard = await aiGuard(req, { route: 'workout-report', dailyLimit: 20, maxBodyBytes: 20_000 });
  if (!guard.ok) return guard.response;

  const body = (guard.body ?? {}) as { sessionId?: unknown; misses?: unknown };
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : null;
  const misses = parseMisses(body.misses);
  if (!sessionId || misses.length === 0) {
    return NextResponse.json({ error: 'sessionId and misses required' }, { status: 400 });
  }

  const service = createServiceClient();

  // The session must belong to the caller — the facts are client-supplied,
  // but we never write commentary for someone else's workout.
  const { data: session } = await service
    .from('workout_sessions')
    .select('id, user_id, created_at')
    .eq('id', sessionId)
    .eq('user_id', guard.userId)
    .maybeSingle();
  if (!session) {
    return NextResponse.json({ error: 'session not found' }, { status: 404 });
  }

  const [{ themes, weakest, strongest, userLevel }, { data: hist }] = await Promise.all([
    getSkillProfile(service, guard.userId),
    service
      .from('workout_sessions')
      .select('correct_count, wrong_count')
      .eq('user_id', guard.userId)
      .lte('created_at', session.created_at)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);
  const trend = (hist ?? [])
    .reverse()
    .map((h) => `${h.correct_count}/${h.correct_count + h.wrong_count}`)
    .join(' → ');

  const missText = misses
    .map((m, i) => {
      const at = m.failedAtMove + 1;
      const answer = m.solutionSan[m.failedAtMove] ?? m.solutionSan[0] ?? '?';
      const played = m.playedSan
        ? `Player played ${m.playedSan} (${ev(m.evalPlayed)}) instead of ${answer} (${ev(m.evalCorrect)}).`
        : `Player's move was not recorded; the answer ${answer} is ${ev(m.evalCorrect)}.`;
      return `${i + 1}. Puzzle ${m.puzzleId} (${m.rating}, themes: ${m.themes.join(' ')}). Solution: ${m.solutionSan.join(' ')}. Failed at move ${at}. ${played}`;
    })
    .join('\n');
  const weak = themes
    .filter((t) => t.attempts >= 5)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)
    .map(themeLine)
    .join('; ');

  const prompt = `Today's misses:\n${missText}\n\nTheme accuracy (worst first): ${weak || 'not enough data'}\nRecent trend (right/total, oldest first): ${trend || 'first workout'}\n\nReturn JSON only: {"lines": [one line per miss, in order — say what the played move was TRYING to do and why the answer beats it; if the move wasn't recorded, say what makes the answer hard to see], "diagnosis": "one sentence naming the single habit behind these misses"}`;

  try {
    const res = await anthropic.messages.create({
      model: ROOKIE_REPORT_MODEL,
      max_tokens: 1500,
      system: ROOKIE_REPORT_SYSTEM,
      output_config: { effort: 'medium' },
      messages: [{ role: 'user', content: prompt }],
    });
    const text = res.content.find((b) => b.type === 'text')?.text ?? '';
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    let lines: string[] = [];
    let diagnosis = '';
    try {
      const parsed = JSON.parse(json) as { lines?: unknown; diagnosis?: unknown };
      lines = Array.isArray(parsed.lines)
        ? parsed.lines.map((l) => (typeof l === 'string' ? stripLeakedPlaceholders(l) : ''))
        : [];
      diagnosis = typeof parsed.diagnosis === 'string' ? stripLeakedPlaceholders(parsed.diagnosis) : '';
    } catch {
      diagnosis = stripLeakedPlaceholders(text.trim().slice(0, 300));
    }
    while (lines.length < misses.length) lines.push('');

    // getSkillProfile needs 12+ attempts per theme for a signal; new users
    // still deserve a pattern screen, so fall back to a 5-attempt floor.
    const withSignal = themes.filter((t) => t.attempts >= 5);
    const weakestOut = (weakest.length ? weakest : [...withSignal].sort((a, b) => a.accuracy - b.accuracy).filter((t) => t.accuracy < 1)).slice(0, 3);
    const strongestOut = (strongest.length ? strongest : [...withSignal].sort((a, b) => b.accuracy - a.accuracy)).slice(0, 2);
    const slim = ({ theme, accuracy, attempts }: ThemeSkill) => ({ theme, accuracy, attempts });

    return NextResponse.json({
      lines: lines.slice(0, misses.length),
      diagnosis,
      profile: { weakest: weakestOut.map(slim), strongest: strongestOut.map(slim), userLevel },
    });
  } catch (err) {
    console.error('[report-lines] claude call failed', err);
    return NextResponse.json({ error: 'commentary unavailable' }, { status: 502 });
  }
}
