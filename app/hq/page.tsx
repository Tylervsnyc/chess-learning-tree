import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { verifyAdmin } from '@/lib/admin-auth';
import { getHqData, type AppCard } from '@/lib/hq';
import { ascStateLabel } from '@/lib/hq/asc';
import AutoRefresh from '@/components/hq/AutoRefresh';
import Sparkline from '@/components/hq/Sparkline';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Chess HQ',
  manifest: '/hq-manifest.json',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Chess HQ', statusBarStyle: 'black-translucent' },
  themeColor: '#0b0f14',
};

const TONE: Record<'green' | 'amber' | 'red' | 'gray', string> = {
  green: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  red: 'bg-red-500/15 text-red-300 ring-red-500/30',
  gray: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30',
};

function Pill({ tone, children }: { tone: keyof typeof TONE; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${TONE[tone]}`}>{children}</span>;
}

function ago(iso: string | null | undefined): string {
  if (!iso) return '—';
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86_400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86_400)}d ago`;
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="text-xl font-bold tabular-nums leading-tight">{value}</div>
      {sub && <div className="text-[11px] text-zinc-500 truncate">{sub}</div>}
    </div>
  );
}

function Card({ card }: { card: AppCard }) {
  const { app, probe, usage, asc, listing, deploy } = card;
  const live = asc?.live ?? null;
  const pending = asc?.pending ?? null;
  const build = asc?.latestBuild ?? null;
  const storeTone = live ? ascStateLabel(live.state) : pending ? ascStateLabel(pending.state) : { label: 'Not in ASC', tone: 'gray' as const };

  return (
    <section className="rounded-2xl bg-zinc-900/80 ring-1 ring-white/10 p-4 space-y-3">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold leading-tight">{app.emoji} {app.name}</h2>
          <div className="text-xs text-zinc-500 truncate">{app.tagline}</div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Pill tone={probe.ok ? 'green' : 'red'}>{probe.ok ? `up · ${probe.ms}ms` : `DOWN ${probe.status ?? 'timeout'}`}</Pill>
          <Pill tone={storeTone.tone}>{storeTone.label}{live ? ` ${live.version}` : pending ? ` ${pending.version}` : ''}</Pill>
        </div>
      </header>

      {/* Live usage */}
      <div className="grid grid-cols-4 gap-2 items-end">
        <Stat label="Now" value={usage ? usage.activeNow : '—'} sub="10 min" />
        <Stat label="Today" value={usage ? usage.today : '—'} sub={usage ? `${usage.nativeLast24h} in app` : undefined} />
        <Stat label="7 days" value={usage ? usage.last7d : '—'} sub={usage ? `+${usage.signups24h} signups 24h` : undefined} />
        <div className="flex flex-col items-end gap-1">
          {usage && <Sparkline values={usage.series} />}
          {usage && usage.purchases24h > 0 && <span className="text-[11px] text-emerald-300">💸 {usage.purchases24h} bought</span>}
        </div>
      </div>

      {/* Apple */}
      <div className="text-xs space-y-1 rounded-xl bg-black/30 p-3">
        {live && (
          <Row k="App Store">
            {live.version} live{listing ? ` · ${listing.ratingCount} rating${listing.ratingCount === 1 ? '' : 's'}${listing.rating ? ` (${listing.rating.toFixed(1)}★)` : ''}` : ''}
            {listing?.url && <a className="ml-1 text-sky-400" href={listing.url} target="_blank" rel="noreferrer">open ↗</a>}
          </Row>
        )}
        {pending && (
          <Row k={pending.state === 'PENDING_DEVELOPER_RELEASE' ? '⚠️ Release' : 'Waiting'}>
            {pending.version} · {ascStateLabel(pending.state).label} · {ago(pending.createdAt)}
          </Row>
        )}
        {build && (
          <Row k="TestFlight">
            build {build.build}{build.version ? ` (${build.version})` : ''} · {ascStateLabel(build.betaState ?? build.processingState).label} · {ago(build.uploadedAt)}
            {asc?.testers != null && ` · ${asc.testers} testers`}
          </Row>
        )}
        {!asc && <Row k="Apple">—</Row>}
      </div>

      {/* Shipping */}
      <div className="text-xs text-zinc-400 flex items-start gap-2">
        <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${deploy?.state === 'READY' ? 'bg-emerald-400' : deploy?.state === 'ERROR' ? 'bg-red-400' : 'bg-zinc-600'}`} />
        <span className="min-w-0">
          {deploy ? (
            <>
              <span className="text-zinc-200">{deploy.commit ?? deploy.url}</span>
              <span className="text-zinc-500"> · {deploy.state.toLowerCase()} {ago(deploy.createdAt)}</span>
            </>
          ) : (
            <span className="text-zinc-600">no deploy info · {app.repo}</span>
          )}
        </span>
      </div>
    </section>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="w-20 shrink-0 text-zinc-500">{k}</span>
      <span className="min-w-0 text-zinc-200">{children}</span>
    </div>
  );
}

export default async function HqPage() {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) notFound();

  const data = await getHqData();
  const m = data.money;
  const totalNow = data.cards.reduce((n, c) => n + (c.usage?.activeNow ?? 0), 0);
  const attention = data.cards.filter((c) => !c.probe.ok || c.asc?.pending?.state === 'PENDING_DEVELOPER_RELEASE' || /REJECTED/.test(c.asc?.pending?.state ?? ''));

  return (
    <main className="min-h-screen bg-[#0b0f14] text-zinc-100 px-4 pb-16 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-md space-y-4">
        <header className="flex items-baseline justify-between">
          <h1 className="text-2xl font-black tracking-tight">Chess HQ</h1>
          <AutoRefresh generatedAt={data.generatedAt} />
        </header>

        {attention.length > 0 && (
          <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/30 p-3 text-sm">
            {attention.map((c) => (
              <div key={c.app.key}>
                {c.app.emoji} {c.app.name}: {!c.probe.ok ? 'site is DOWN' : c.asc?.pending?.state === 'PENDING_DEVELOPER_RELEASE' ? `${c.asc.pending.version} approved — press release in ASC` : `${c.asc?.pending?.version} rejected — read the resolution center`}
              </div>
            ))}
          </div>
        )}

        {/* Money strip */}
        <section className="rounded-2xl bg-zinc-900/80 ring-1 ring-white/10 p-4">
          <div className="grid grid-cols-4 gap-2">
            <Stat label="MRR" value={m?.snapshot ? `$${Math.round(m.snapshot.mrrUsd)}` : '—'} sub={m?.snapshot ? `as of ${m.snapshot.date.slice(5)}` : 'no snapshot'} />
            <Stat label="Premium" value={m ? m.premium : '—'} sub={m ? `${m.premiumStripe} Stripe · ${m.premiumOther} IAP/comp` : undefined} />
            <Stat label="Users" value={m ? m.totalUsers : '—'} sub={m ? `+${m.newUsers24h} today · +${m.newUsers7d} wk` : undefined} />
            <Stat label="Online" value={totalNow} sub={m && m.expiring7d ? `${m.expiring7d} expiring` : m?.snapshot ? `${m.snapshot.churnPct}% churn` : undefined} />
          </div>
        </section>

        {data.cards.map((c) => <Card key={c.app.key} card={c} />)}

        <footer className="text-[11px] text-zinc-600 space-y-1">
          <div>Supabase {data.supabase.ok ? `ok · ${data.supabase.ms}ms` : 'DOWN'} · <a className="text-sky-500" href="/admin/dashboard">admin</a> · <a className="text-sky-500" href="https://www.penelopehq.com/me" target="_blank" rel="noreferrer">Penelope</a></div>
          {data.errors.map((e) => <div key={e} className="text-amber-600/80">⚠ {e}</div>)}
        </footer>
      </div>
    </main>
  );
}
