/**
 * Reject a candidate level or ability.
 *
 * Body: { kind: 'level' | 'ability', filename: string }
 * filename must be a path under data/run-playtest/. We move it to
 * `data/run-playtest/rejected-{levels|abilities}/YYYY-MM-DD/` so it doesn't
 * keep showing up in /admin/run-candidates.
 *
 * Auth: same admin gate as the promote endpoint.
 * Runtime: node — we need `fs`.
 */

import { NextResponse } from 'next/server';
import { existsSync, mkdirSync, renameSync } from 'node:fs';
import * as path from 'node:path';
import { verifyAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Body {
  kind?: unknown;
  filename?: unknown;
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

  const today = new Date().toISOString().slice(0, 10);
  const destDir = path.join(
    repoRoot,
    'data',
    'run-playtest',
    body.kind === 'level' ? 'rejected-levels' : 'rejected-abilities',
    today,
  );
  mkdirSync(destDir, { recursive: true });
  // Flatten the path into the filename so we don't lose the explorer-N
  // namespace for level candidates.
  const flatName = path.relative(
    path.join(
      repoRoot,
      'data',
      'run-playtest',
      body.kind === 'level' ? 'candidate-levels' : 'candidate-abilities',
    ),
    absFile,
  ).split(path.sep).join('__');
  const destFile = path.join(destDir, flatName);

  try {
    renameSync(absFile, destFile);
  } catch (e) {
    return NextResponse.json(
      { error: `Could not move file: ${(e as Error).message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Rejected → ${path.relative(repoRoot, destFile)}`,
  });
}
