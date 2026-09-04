/** Is each app actually up right now? Probes the public URL and Supabase. */
import { createServiceClient } from '@/lib/supabase/service';

export interface Probe {
  ok: boolean;
  status: number | null;
  ms: number;
}

export async function probeUrl(url: string, timeoutMs = 8000): Promise<Probe> {
  const started = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'chesspath-hq-probe' },
    });
    return { ok: res.ok, status: res.status, ms: Date.now() - started };
  } catch {
    return { ok: false, status: null, ms: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

export async function probeSupabase(): Promise<Probe> {
  const started = Date.now();
  try {
    const { error } = await createServiceClient().from('profiles').select('id', { count: 'exact', head: true }).limit(1);
    return { ok: !error, status: error ? 500 : 200, ms: Date.now() - started };
  } catch {
    return { ok: false, status: null, ms: Date.now() - started };
  }
}
