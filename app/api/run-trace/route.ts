import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'data', 'run-playtest', 'human-traces');

function safe(part: string): string {
  return part.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const runId = safe(String(body?.meta?.runId ?? 'unknown'));
    const level = safe(String(body?.meta?.level ?? '0'));
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${runId}-L${level}-${stamp}.json`;
    await mkdir(DIR, { recursive: true });
    const filePath = path.join(DIR, filename);
    await writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ ok: true, path: path.relative(process.cwd(), filePath) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
