/**
 * Candidate triage page for Rookie's Run.
 *
 * Lists every candidate level (from mutator-explorer-agent) and candidate
 * ability (from ability-designer-agent) sitting in `data/run-playtest/`.
 * The operator swipes through them on mobile and taps Promote or Reject —
 * which forwards to /api/admin/{promote,reject}-candidate.
 *
 * Auth: the parent /admin/layout.tsx already enforces the admin gate.
 *
 * We fetch candidates from GitHub raw URLs so the page works without
 * shelling out to the filesystem (which an edge runtime can't do reliably
 * during ISR). The actual promotion endpoint DOES touch the filesystem —
 * it runs the promote CLI via a child process — so it has to be a node
 * runtime API route, not edge.
 */

import { CandidatesClient } from './CandidatesClient';
import type {
  CandidateAbility,
  CandidateLevel,
} from '@/scripts/run-playtest/candidate-schema';

export const revalidate = 30;
export const dynamic = 'force-dynamic';

const REPO = 'tylervsnyc/chess-learning-tree';
const CANDIDATE_LEVELS_DIR = 'data/run-playtest/candidate-levels';
const CANDIDATE_ABILITIES_DIR = 'data/run-playtest/candidate-abilities';

export interface CandidateLevelRecord {
  /** Original path relative to repo root — what the API needs to act on. */
  filename: string;
  /** Date string parsed from path (YYYY-MM-DD for levels). */
  dateLabel: string;
  data: CandidateLevel;
}

export interface CandidateAbilityRecord {
  filename: string;
  /** Week string parsed from path (YYYY-WW for abilities). */
  dateLabel: string;
  data: CandidateAbility;
}

interface GhContentEntry {
  type: 'file' | 'dir';
  name: string;
  path: string;
  download_url: string | null;
}

/**
 * Recursively list every file under a GitHub repo path.
 *
 * Why recursive: candidate-levels is two levels deep
 * (`YYYY-MM-DD/explorer-N/level.json`) so we need to drill in.
 */
async function listFilesRecursive(repoPath: string): Promise<GhContentEntry[]> {
  const url = `https://api.github.com/repos/${REPO}/contents/${repoPath}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return [];
    const body = (await res.json()) as GhContentEntry[] | { message: string };
    if (!Array.isArray(body)) return [];
    const files: GhContentEntry[] = [];
    for (const entry of body) {
      if (entry.type === 'file') {
        files.push(entry);
      } else if (entry.type === 'dir') {
        const sub = await listFilesRecursive(entry.path);
        files.push(...sub);
      }
    }
    return files;
  } catch {
    return [];
  }
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function loadLevelCandidates(): Promise<CandidateLevelRecord[]> {
  const files = await listFilesRecursive(CANDIDATE_LEVELS_DIR);
  const json = files.filter(
    (f) => f.name.endsWith('.json') && f.download_url !== null,
  );
  const records: CandidateLevelRecord[] = [];
  for (const f of json) {
    const data = await fetchJson<CandidateLevel>(f.download_url!);
    if (!data || data.candidate !== true) continue;
    // path looks like: data/run-playtest/candidate-levels/2026-05-12/explorer-3/level.json
    const segments = f.path.split('/');
    const dateLabel = segments[3] ?? '?';
    records.push({ filename: f.path, dateLabel, data });
  }
  return records;
}

async function loadAbilityCandidates(): Promise<CandidateAbilityRecord[]> {
  const files = await listFilesRecursive(CANDIDATE_ABILITIES_DIR);
  const json = files.filter(
    (f) => f.name.endsWith('.json') && f.download_url !== null,
  );
  const records: CandidateAbilityRecord[] = [];
  for (const f of json) {
    const data = await fetchJson<CandidateAbility>(f.download_url!);
    if (!data || data.candidate !== true) continue;
    const segments = f.path.split('/');
    const dateLabel = segments[3] ?? '?';
    records.push({ filename: f.path, dateLabel, data });
  }
  return records;
}

export default async function RunCandidatesPage(): Promise<React.ReactElement> {
  const [levels, abilities] = await Promise.all([
    loadLevelCandidates(),
    loadAbilityCandidates(),
  ]);

  return <CandidatesClient levels={levels} abilities={abilities} />;
}
