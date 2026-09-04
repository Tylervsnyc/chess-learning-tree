/**
 * Last production deploy per Vercel project. Env: VERCEL_TOKEN (read scope is
 * enough), VERCEL_TEAM_ID (defaults to the tyler-schwartzs-projects team).
 */
const TEAM_ID = process.env.VERCEL_TEAM_ID ?? 'team_WIjNimQkWpkvOYNGwGesUz2d';

export interface Deploy {
  state: string; // READY, ERROR, BUILDING, QUEUED, CANCELED
  createdAt: string;
  commit: string | null;
  branch: string | null;
  url: string;
}

export function vercelConfigured(): boolean {
  return Boolean(process.env.VERCEL_TOKEN);
}

export async function fetchLastDeploys(projectNames: string[]): Promise<Record<string, Deploy | null>> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error('VERCEL_TOKEN not set');
  const headers = { Authorization: `Bearer ${token}` };
  const out: Record<string, Deploy | null> = {};

  await Promise.all(
    [...new Set(projectNames)].map(async (name) => {
      const res = await fetch(
        `https://api.vercel.com/v6/deployments?teamId=${TEAM_ID}&projectId=${encodeURIComponent(name)}&target=production&limit=1`,
        { headers, cache: 'no-store' }
      );
      if (!res.ok) throw new Error(`Vercel ${res.status} for ${name}`);
      const json = (await res.json()) as { deployments: Array<Record<string, unknown>> };
      const d = json.deployments?.[0];
      if (!d) { out[name] = null; return; }
      const meta = (d.meta ?? {}) as Record<string, string>;
      out[name] = {
        state: String(d.readyState ?? d.state ?? 'UNKNOWN'),
        createdAt: new Date(Number(d.createdAt)).toISOString(),
        commit: meta.githubCommitMessage?.split('\n')[0] ?? null,
        branch: meta.githubCommitRef ?? null,
        url: String(d.url ?? ''),
      };
    })
  );
  return out;
}
