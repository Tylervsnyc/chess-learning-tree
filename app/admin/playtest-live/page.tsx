/**
 * Live view of the Rookie's Run playtest pipeline.
 *
 * Polls GitHub (no auth needed — public repo) every 30s for:
 *   1. Recent commits to main matching "playtest" — shows the nightly bot's progress
 *   2. The latest digest markdown — rendered raw for skim
 *
 * Mobile-friendly. Auto-refreshes via meta-refresh + Next.js revalidate.
 */

export const revalidate = 30;
export const dynamic = 'force-dynamic';

const REPO = 'tylervsnyc/chess-learning-tree';
const COMMITS_URL = `https://api.github.com/repos/${REPO}/commits?per_page=20`;
const DIGEST_URL = `https://raw.githubusercontent.com/${REPO}/main/data/run-playtest/digests/latest.md`;

interface Commit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

async function fetchCommits(): Promise<Commit[]> {
  try {
    const res = await fetch(COMMITS_URL, {
      next: { revalidate: 30 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return [];
    return (await res.json()) as Commit[];
  } catch {
    return [];
  }
}

async function fetchDigest(): Promise<string | null> {
  try {
    const res = await fetch(DIGEST_URL, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export default async function PlaytestLivePage(): Promise<React.ReactElement> {
  const [commits, digest] = await Promise.all([fetchCommits(), fetchDigest()]);
  const playtestCommits = commits.filter((c) =>
    /playtest|rookies-run.*(digest|playtest|harness)/i.test(c.commit.message),
  );
  const latestPlaytestCommit = playtestCommits[0];
  const latestAnyCommit = commits[0];

  const renderedAt = new Date().toLocaleTimeString();

  return (
    <div className="h-full overflow-auto bg-stone-50 text-stone-900">
      {/* Auto-refresh fallback for browsers that ignore revalidate */}
      <meta httpEquiv="refresh" content="30" />

      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Rookie&apos;s Run — Playtest Live</h1>
          <p className="mt-1 text-sm text-stone-600">
            Rendered {renderedAt}. Auto-refreshes every 30s.
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Reads commits + latest digest directly from GitHub (no local server needed). Works on your phone.
          </p>
        </header>

        <section className="mb-8 rounded-lg border border-stone-200 bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold">Status</h2>
          {latestPlaytestCommit ? (
            <p className="text-sm">
              <span className="font-medium">Last playtest commit:</span>{' '}
              <a
                href={latestPlaytestCommit.html_url}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {latestPlaytestCommit.sha.slice(0, 7)}
              </a>{' '}
              · {timeAgo(latestPlaytestCommit.commit.author.date)} ·{' '}
              {latestPlaytestCommit.commit.author.name}
            </p>
          ) : (
            <p className="text-sm text-stone-600">
              No playtest commits yet. The nightly run will commit a digest when it finishes (~40 min after start).
            </p>
          )}
          {latestAnyCommit && (
            <p className="mt-1 text-xs text-stone-500">
              Last main-branch commit (any kind): {timeAgo(latestAnyCommit.commit.author.date)} —{' '}
              {latestAnyCommit.commit.message.split('\n')[0].slice(0, 80)}
            </p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">Recent commits to main</h2>
          <ul className="space-y-1 text-sm">
            {commits.slice(0, 10).map((c) => (
              <li key={c.sha} className="flex items-baseline gap-2 border-b border-stone-100 py-1.5">
                <a
                  href={c.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 underline"
                >
                  {c.sha.slice(0, 7)}
                </a>
                <span className="flex-1 truncate">{c.commit.message.split('\n')[0]}</span>
                <span className="shrink-0 text-xs text-stone-500">
                  {timeAgo(c.commit.author.date)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Latest digest</h2>
          {digest ? (
            <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-stone-200 bg-white p-4 text-xs leading-relaxed text-stone-800">
              {digest}
            </pre>
          ) : (
            <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-600">
              No digest published yet. The first run is in progress —
              come back in ~40 minutes after kickoff. The file will appear at
              <code className="ml-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                data/run-playtest/digests/latest.md
              </code>{' '}
              once the routine finishes.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
