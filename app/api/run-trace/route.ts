import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

/**
 * Human playtest trace capture.
 *
 * Chess Path wrote these straight to disk under process.cwd(). That works in
 * `next dev` and does nothing at all on Vercel — the filesystem is read-only
 * outside /tmp, and the caller swallows the error — so every trace from a
 * deployed playtest session has been silently dropped. Since the interesting
 * traces are exactly the ones from a phone, this route now forks:
 *
 *   dev  -> data/run-playtest/human-traces/*.json (zero latency, and the
 *           existing scripts/run-playtest tooling reads those files directly)
 *   prod -> the run_traces table, via the service role
 *
 * Apply supabase/migrations/2026-08-16-run-traces.sql by hand in the SQL
 * editor before prod capture works. Until then this degrades to a logged
 * no-op and returns 200 — a missing table must never break the game.
 */

const DIR = path.join(process.cwd(), 'data', 'run-playtest', 'human-traces');

function safe(part: string): string {
  return part.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
}

/** Postgres "relation does not exist" — the migration hasn't been applied yet. */
function isMissingSchema(code?: string): boolean {
  return code === '42P01' || code === 'PGRST205';
}

let warnedMissingSchema = false;

async function persistToSupabase(body: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ ok: false, reason: 'not-configured' });
  }

  const meta = (body?.meta ?? {}) as Record<string, unknown>;
  // Service role, not the anon key: traces are write-only from the client's
  // point of view, and nothing about them should be readable with a public key.
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { error } = await supabase.from('run_traces').insert({
    run_id: String(meta.runId ?? 'unknown'),
    run_date: String(meta.iso ?? new Date().toISOString().slice(0, 10)),
    level: Number(meta.level ?? 0),
    outcome: String(meta.outcome ?? 'unknown'),
    device: String(meta.device ?? ''),
    payload: body,
  });

  if (error) {
    if (isMissingSchema(error.code)) {
      if (!warnedMissingSchema) {
        warnedMissingSchema = true;
        console.warn('[run-trace] run_traces table missing — apply the migration to capture traces');
      }
      return NextResponse.json({ ok: false, reason: 'schema' });
    }
    console.warn('[run-trace] insert failed', error.message);
    return NextResponse.json({ ok: false, reason: 'insert-failed' });
  }

  return NextResponse.json({ ok: true, sink: 'supabase' });
}

async function persistToDisk(body: Record<string, unknown>) {
  const meta = (body?.meta ?? {}) as Record<string, unknown>;
  const runId = safe(String(meta.runId ?? 'unknown'));
  const level = safe(String(meta.level ?? '0'));
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(DIR, `${runId}-L${level}-${stamp}.json`);
  await mkdir(DIR, { recursive: true });
  await writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');
  return NextResponse.json({
    ok: true,
    sink: 'disk',
    path: path.relative(process.cwd(), filePath),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return process.env.NODE_ENV === 'production'
      ? await persistToSupabase(body)
      : await persistToDisk(body);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[run-trace]', msg);
    // Never surface a 500 here — the client fires this and ignores the result,
    // and a failed trace write must not look like a broken game.
    return NextResponse.json({ ok: false, error: msg });
  }
}
