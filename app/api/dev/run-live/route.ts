import { NextRequest, NextResponse } from 'next/server';
import { appendFile, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

// Dev-only live move stream for Rookie's Run. The page POSTs every recorded
// event here while Tyler plays so Claude can tail it in real time. No-ops in prod.
const LOG_PATH = join(tmpdir(), 'rookies-run-live.jsonl');

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, skipped: 'prod' });
  }
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false });
  if (body.reset) {
    await writeFile(LOG_PATH, '');
    return NextResponse.json({ ok: true, reset: true, path: LOG_PATH });
  }
  await appendFile(LOG_PATH, JSON.stringify(body) + '\n');
  return NextResponse.json({ ok: true });
}
