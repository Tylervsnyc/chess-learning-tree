/**
 * App Store Connect API — read-only. Answers "what is Apple doing with my app?"
 *
 * Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY (the .p8 contents; literal
 * "\n" sequences are tolerated). Same key fastlane uses in ios/App/fastlane.
 */
import { createPrivateKey, sign } from 'node:crypto';

const ASC_BASE = 'https://api.appstoreconnect.apple.com/v1';

export interface AscVersion {
  version: string;
  state: string; // READY_FOR_SALE, WAITING_FOR_REVIEW, IN_REVIEW, PENDING_DEVELOPER_RELEASE, REJECTED, PREPARE_FOR_SUBMISSION ...
  createdAt: string | null;
}

export interface AscBuild {
  build: string;
  version: string | null;
  processingState: string; // PROCESSING, VALID, INVALID, FAILED
  betaState: string | null; // WAITING_FOR_BETA_REVIEW, IN_BETA_REVIEW, BETA_APPROVED, IN_BETA_TESTING, READY_FOR_BETA_SUBMISSION ...
  uploadedAt: string | null;
}

export interface AscAppStatus {
  appleId: string; // = iTunes lookup id
  name: string;
  live: AscVersion | null; // READY_FOR_SALE version
  pending: AscVersion | null; // anything not yet live and not replaced
  latestBuild: AscBuild | null;
  testers: number | null;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

let cachedToken: { jwt: string; exp: number } | null = null;

function ascToken(): string | null {
  const kid = process.env.ASC_KEY_ID;
  const iss = process.env.ASC_ISSUER_ID;
  const pem = process.env.ASC_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!kid || !iss || !pem) return null;

  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.jwt;

  const exp = now + 15 * 60;
  const header = b64url(JSON.stringify({ alg: 'ES256', kid, typ: 'JWT' }));
  const payload = b64url(JSON.stringify({ iss, iat: now, exp, aud: 'appstoreconnect-v1' }));
  const data = `${header}.${payload}`;
  const key = createPrivateKey(pem);
  const sig = sign('sha256', Buffer.from(data), { key, dsaEncoding: 'ieee-p1363' });
  const jwt = `${data}.${b64url(sig)}`;
  cachedToken = { jwt, exp };
  return jwt;
}

export function ascConfigured(): boolean {
  return ascToken() !== null;
}

async function ascGet<T = unknown>(path: string): Promise<T> {
  const token = ascToken();
  if (!token) throw new Error('ASC not configured');
  const res = await fetch(`${ASC_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`ASC ${res.status} ${path}: ${(await res.text()).slice(0, 200)}`);
  return res.json() as Promise<T>;
}

type AscResource = { id: string; type: string; attributes: Record<string, unknown>; relationships?: Record<string, unknown> };
type AscList = { data: AscResource[]; included?: AscResource[]; meta?: { paging?: { total?: number } } };

const LIVE_STATES = new Set(['READY_FOR_SALE', 'READY_FOR_DISTRIBUTION']);
const DEAD_STATES = new Set(['REPLACED_WITH_NEW_VERSION', 'REMOVED_FROM_SALE', 'DEVELOPER_REMOVED_FROM_SALE']);

/** One ASC round of calls for every bundle id. Returns a map keyed by bundleId. */
export async function fetchAscStatus(bundleIds: string[]): Promise<Record<string, AscAppStatus>> {
  const apps = await ascGet<AscList>(
    `/apps?filter[bundleId]=${encodeURIComponent(bundleIds.join(','))}&fields[apps]=name,bundleId`
  );

  const out: Record<string, AscAppStatus> = {};
  await Promise.all(
    apps.data.map(async (app) => {
      const bundleId = String(app.attributes.bundleId);
      const [versions, builds, testers] = await Promise.allSettled([
        ascGet<AscList>(`/apps/${app.id}/appStoreVersions?limit=5&filter[platform]=IOS`),
        ascGet<AscList>(`/builds?filter[app]=${app.id}&sort=-uploadedDate&limit=1&include=buildBetaDetail,preReleaseVersion`),
        ascGet<AscList>(`/betaTesters?filter[apps]=${app.id}&limit=1`),
      ]);

      let live: AscVersion | null = null;
      let pending: AscVersion | null = null;
      if (versions.status === 'fulfilled') {
        for (const v of versions.value.data) {
          const a = v.attributes;
          const state = String(a.appVersionState ?? a.appStoreState ?? 'UNKNOWN');
          const ver: AscVersion = {
            version: String(a.versionString ?? '?'),
            state,
            createdAt: (a.createdDate as string) ?? null,
          };
          if (LIVE_STATES.has(state)) live ??= ver;
          else if (!DEAD_STATES.has(state)) pending ??= ver;
        }
      }

      let latestBuild: AscBuild | null = null;
      if (builds.status === 'fulfilled' && builds.value.data[0]) {
        const b = builds.value.data[0];
        const included = builds.value.included ?? [];
        const beta = included.find((i) => i.type === 'buildBetaDetails');
        const pre = included.find((i) => i.type === 'preReleaseVersions');
        latestBuild = {
          build: String(b.attributes.version ?? '?'),
          version: pre ? String(pre.attributes.version) : null,
          processingState: String(b.attributes.processingState ?? 'UNKNOWN'),
          betaState: beta ? String(beta.attributes.externalBuildState ?? beta.attributes.internalBuildState ?? '') : null,
          uploadedAt: (b.attributes.uploadedDate as string) ?? null,
        };
      }

      out[bundleId] = {
        appleId: app.id,
        name: String(app.attributes.name),
        live,
        pending,
        latestBuild,
        testers: testers.status === 'fulfilled' ? testers.value.meta?.paging?.total ?? null : null,
      };
    })
  );
  return out;
}

/** Human label for an ASC state string. */
export function ascStateLabel(state: string): { label: string; tone: 'green' | 'amber' | 'red' | 'gray' } {
  switch (state) {
    case 'READY_FOR_SALE':
    case 'READY_FOR_DISTRIBUTION':
      return { label: 'Live', tone: 'green' };
    case 'PENDING_DEVELOPER_RELEASE':
      return { label: 'Approved — release it', tone: 'green' };
    case 'WAITING_FOR_REVIEW':
      return { label: 'Waiting for Apple', tone: 'amber' };
    case 'IN_REVIEW':
      return { label: 'In review', tone: 'amber' };
    case 'PROCESSING_FOR_DISTRIBUTION':
    case 'PROCESSING_FOR_APP_STORE':
      return { label: 'Processing', tone: 'amber' };
    case 'REJECTED':
    case 'METADATA_REJECTED':
    case 'DEVELOPER_REJECTED':
    case 'INVALID_BINARY':
      return { label: 'Rejected', tone: 'red' };
    case 'PREPARE_FOR_SUBMISSION':
      return { label: 'Not submitted', tone: 'gray' };
    case 'WAITING_FOR_BETA_REVIEW':
    case 'IN_BETA_REVIEW':
      return { label: 'Beta review', tone: 'amber' };
    case 'BETA_APPROVED':
    case 'IN_BETA_TESTING':
      return { label: 'TestFlight', tone: 'green' };
    case 'READY_FOR_BETA_SUBMISSION':
    case 'READY_FOR_BETA_TESTING':
      return { label: 'Ready for TestFlight', tone: 'gray' };
    case 'BETA_REJECTED':
      return { label: 'Beta rejected', tone: 'red' };
    case 'PROCESSING':
      return { label: 'Processing', tone: 'amber' };
    default:
      return { label: state.toLowerCase().replace(/_/g, ' '), tone: 'gray' };
  }
}
