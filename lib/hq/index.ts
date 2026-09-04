/**
 * getHqData() — everything /hq renders, fetched in parallel. Every source can
 * fail on its own; the page shows "—" plus the error instead of dying.
 */
import { HQ_APPS, type HqApp, type HqAppKey } from './apps';
import { fetchAscStatus, ascConfigured, type AscAppStatus } from './asc';
import { fetchUsage, type AppUsage } from './posthog';
import { probeUrl, probeSupabase, type Probe } from './uptime';
import { fetchLastDeploys, vercelConfigured, type Deploy } from './vercel';
import { fetchMoney, fetchStoreListing, type MoneySummary, type StoreListing } from './money';

export interface AppCard {
  app: HqApp;
  probe: Probe;
  usage: AppUsage | null;
  asc: AscAppStatus | null;
  listing: StoreListing | null;
  deploy: Deploy | null;
}

export interface HqData {
  generatedAt: string;
  cards: AppCard[];
  supabase: Probe;
  money: MoneySummary | null;
  errors: string[];
}

async function settle<T>(label: string, p: Promise<T>, errors: string[]): Promise<T | null> {
  try {
    return await p;
  } catch (e) {
    errors.push(`${label}: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

export async function getHqData(): Promise<HqData> {
  const errors: string[] = [];
  const bundleIds = HQ_APPS.map((a) => a.bundleId);

  const [probes, supabase, usage, asc, deploys, money] = await Promise.all([
    Promise.all(HQ_APPS.map((a) => probeUrl(a.url))),
    probeSupabase(),
    settle('PostHog', fetchUsage(), errors),
    ascConfigured()
      ? settle('App Store Connect', fetchAscStatus(bundleIds), errors)
      : (errors.push('App Store Connect: ASC_KEY_ID / ASC_ISSUER_ID / ASC_PRIVATE_KEY not set'), null),
    vercelConfigured()
      ? settle('Vercel', fetchLastDeploys(HQ_APPS.map((a) => a.vercelProject)), errors)
      : (errors.push('Vercel: VERCEL_TOKEN not set'), null),
    settle('Supabase money', fetchMoney(), errors),
  ]);

  // Store listings need the Apple id, which ASC gives us.
  const listings = await Promise.all(
    HQ_APPS.map((a) => {
      const id = asc?.[a.bundleId]?.appleId;
      return id && asc?.[a.bundleId]?.live ? settle(`iTunes ${a.name}`, fetchStoreListing(id), errors) : Promise.resolve(null);
    })
  );

  const cards: AppCard[] = HQ_APPS.map((app, i) => ({
    app,
    probe: probes[i],
    usage: usage ? usage[app.key as HqAppKey] : null,
    asc: asc?.[app.bundleId] ?? null,
    listing: listings[i],
    deploy: deploys?.[app.vercelProject] ?? null,
  }));

  return { generatedAt: new Date().toISOString(), cards, supabase, money, errors };
}
