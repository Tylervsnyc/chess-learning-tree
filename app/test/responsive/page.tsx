'use client';

/**
 * /test/responsive — Responsive preview gallery.
 *
 * Renders every user-facing route inside phone / iPad / desktop iframes so we
 * can eyeball how each page looks across views in one place. Each iframe keeps
 * its TRUE device width (the page inside thinks it's a real 390/768/1280px
 * device); we only shrink it visually with `transform: scale()`.
 *
 * §50 pass criteria for each frame: no horizontal scroll · content centered +
 * capped · board scales · tap targets >= 44px.
 *
 * Test page: container MUST be overflow-auto (body is overflow:hidden globally).
 */

import React, { useMemo, useState } from 'react';

type Group = 'Primary' | 'Secondary' | 'Auth';

interface Route {
  label: string;
  url: string;
  group: Group;
  note?: string;
}

// Real slugs/params resolved from the codebase (italian / it-1 / lesson 1.1).
const TODAY = '2026-06-15';

const ROUTES: Route[] = [
  // Primary user-facing
  { label: 'Home /', url: '/', group: 'Primary' },
  { label: 'Play', url: '/play', group: 'Primary' },
  { label: 'Learn', url: '/learn', group: 'Primary' },
  { label: 'Path', url: '/path', group: 'Primary' },
  { label: 'Openings', url: '/openings', group: 'Primary' },
  { label: 'Opening detail', url: '/openings/italian', group: 'Primary' },
  { label: 'Opening lesson', url: '/openings/italian/it-1', group: 'Primary' },
  { label: 'Lesson', url: '/lesson/1.1', group: 'Primary' },
  { label: 'Chess Box (Today)', url: '/box?boxapp=1', group: 'Primary', note: 'native-shell home; ?boxapp=1 shows the tab bar' },
  { label: 'Workout', url: '/workout', group: 'Primary' },
  { label: 'Bout vs Rookie', url: '/box/bout', group: 'Primary', note: 'Bout mode pre-fight; the bout owns the viewport (no tab bar)' },
  { label: 'Box Play (gym)', url: '/play?boxapp=1', group: 'Primary', note: 'Play setup inside the shell — GymBackdrop + hittable bags' },
  { label: 'Box onboarding', url: '/box/onboarding?boxapp=1', group: 'Primary', note: 'first-launch flow; no tab bar' },
  { label: 'Box settings', url: '/box/settings?boxapp=1', group: 'Primary', note: 'handle, crew, camera, leaderboard opt-in' },
  { label: 'Box profile', url: '/box/profile?boxapp=1', group: 'Primary', note: 'Chess Boxing profile tab' },
  { label: 'Chess Boxing landing', url: '/boxing', group: 'Primary', note: 'public marketing page for the app' },
  { label: 'Leaderboard', url: '/leaderboard', group: 'Primary' },
  { label: "Rookie's Run", url: '/run', group: 'Primary' },
  { label: 'Run (replay)', url: `/run/${TODAY}`, group: 'Primary' },
  { label: 'Profile', url: '/profile', group: 'Primary' },
  { label: 'Pricing', url: '/pricing', group: 'Primary' },
  { label: 'Premium signup', url: '/premium-signup', group: 'Primary' },
  { label: 'Learn opening (SEO)', url: '/learn/italian', group: 'Primary' },

  // Secondary / educational
  { label: 'Basics', url: '/basics', group: 'Secondary' },
  { label: 'Repertoire', url: '/repertoire', group: 'Secondary' },
  { label: 'Solve', url: '/solve', group: 'Secondary' },
  { label: 'Welcome', url: '/welcome', group: 'Secondary' },
  { label: 'About', url: '/about', group: 'Secondary' },
  { label: 'Privacy', url: '/privacy', group: 'Secondary' },
  { label: 'Terms', url: '/terms', group: 'Secondary' },
  { label: 'Support', url: '/support', group: 'Secondary' },

  // Auth
  { label: 'Login', url: '/auth/login', group: 'Auth' },
  { label: 'Signup', url: '/auth/signup', group: 'Auth' },
  { label: 'Forgot password', url: '/auth/forgot-password', group: 'Auth' },
];

const DEVICES = [
  { name: 'Phone', w: 390, h: 780 },
  { name: 'iPad', w: 768, h: 1024 },
  { name: 'Desktop', w: 1280, h: 800 },
] as const;

const GROUPS: Group[] = ['Primary', 'Secondary', 'Auth'];

function DeviceFrame({ url, w, h, scale }: { url: string; w: number; h: number; scale: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
        style={{ width: w * scale, height: h * scale }}
      >
        <iframe
          src={url}
          title={`${url} @ ${w}`}
          style={{
            width: w,
            height: h,
            border: 'none',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </div>
  );
}

function RouteRow({ route, scale }: { route: Route; scale: number }) {
  return (
    <div className="border-b border-gray-200 py-5">
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-gray-900">{route.label}</span>
        <code className="text-xs text-gray-500">{route.url}</code>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        {DEVICES.map((d) => (
          <div key={d.name} className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-medium text-gray-400">
              {d.name} · {d.w}px
            </span>
            <DeviceFrame url={route.url} w={d.w} h={d.h} scale={scale} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResponsivePreviewPage() {
  const [scale, setScale] = useState(0.45);
  const [focus, setFocus] = useState<string>('all');

  const visible = useMemo(
    () => (focus === 'all' ? ROUTES : ROUTES.filter((r) => r.url === focus)),
    [focus],
  );

  // A focused single route can render bigger.
  const effectiveScale = focus === 'all' ? scale : Math.min(scale * 1.6, 0.85);

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6">
        {/* Header / controls */}
        <div className="sticky top-0 z-10 -mx-4 mb-4 border-b border-gray-200 bg-gray-50/95 px-4 pb-3 pt-1 backdrop-blur">
          <h1 className="text-xl font-bold text-gray-900">Responsive Preview</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Each frame is a real device width. §50 check per frame: no h-scroll · centered + capped ·
            board scales · tap targets ≥44px.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              Route
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-xs"
              >
                <option value="all">All routes</option>
                {GROUPS.map((g) => (
                  <optgroup key={g} label={g}>
                    {ROUTES.filter((r) => r.group === g).map((r) => (
                      <option key={r.url} value={r.url}>
                        {r.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              Zoom
              <input
                type="range"
                min={0.25}
                max={0.7}
                step={0.05}
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
              <span className="w-8 tabular-nums">{Math.round(effectiveScale * 100)}%</span>
            </label>
          </div>
        </div>

        {/* Rows, grouped */}
        {focus === 'all'
          ? GROUPS.map((g) => (
              <section key={g} className="mb-6">
                <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">{g}</h2>
                {ROUTES.filter((r) => r.group === g).map((r) => (
                  <RouteRow key={r.url} route={r} scale={effectiveScale} />
                ))}
              </section>
            ))
          : visible.map((r) => <RouteRow key={r.url} route={r} scale={effectiveScale} />)}
      </div>
    </div>
  );
}
