/**
 * Promote a candidate level or ability into the live game.
 *
 * Body: { kind: 'level' | 'ability', filename: string }
 * `filename` must be a path relative to the repo root, beginning with
 * `data/run-playtest/`. We refuse anything else so a leaked endpoint can't
 * be coerced into reading arbitrary files.
 *
 * Implementation: shell out to scripts/run-playtest/promote.ts. The CLI
 * already enforces all safety bars and writes to runs.ts itself. Keeping
 * the API thin here means there's exactly ONE promotion code path.
 *
 * Runtime: node — we need fs + child_process. Edge can't shell out.
 */

import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import { verifyAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Body {
  kind?: unknown;
  filename?: unknown;
}

function runPromote(
  kind: 'level' | 'ability',
  absFile: string,
): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    // process.cwd() is the repo root when running `next start` / `next dev`,
    // so relative `scripts/run-playtest/promote.ts` resolves correctly.
    const proc = spawn(
      'npx',
      ['tsx', 'scripts/run-playtest/promote.ts', kind, absFile],
      { cwd: process.cwd() },
    );
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });
    proc.on('close', (code) => {
      resolve({ ok: code === 0, stdout, stderr });
    });
    proc.on('error', (e) => {
      resolve({ ok: false, stdout, stderr: stderr + String(e) });
    });
  });
}

export async function POST(req: Request): Promise<Response> {
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (body.kind !== 'level' && body.kind !== 'ability') {
    return NextResponse.json({ error: 'kind must be "level" or "ability"' }, { status: 400 });
  }
  if (typeof body.filename !== 'string' || body.filename.length === 0) {
    return NextResponse.json({ error: 'filename is required' }, { status: 400 });
  }

  // Path scoping — protect against `../../../etc/passwd` style escapes.
  const repoRoot = process.cwd();
  const absFile = path.resolve(repoRoot, body.filename);
  const allowedPrefix = path.join(repoRoot, 'data', 'run-playtest') + path.sep;
  if (!absFile.startsWith(allowedPrefix)) {
    return NextResponse.json(
      { error: 'filename must be under data/run-playtest/' },
      { status: 400 },
    );
  }
  if (!existsSync(absFile)) {
    return NextResponse.json({ error: `File not found: ${body.filename}` }, { status: 404 });
  }

  const result = await runPromote(body.kind, absFile);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.stderr.trim() || 'Promotion failed',
        stdout: result.stdout,
        stderr: result.stderr,
      },
      { status: 422 },
    );
  }
  return NextResponse.json({
    ok: true,
    message: result.stdout.trim().split('\n').slice(-1)[0] || 'Promoted',
    stdout: result.stdout,
  });
}
