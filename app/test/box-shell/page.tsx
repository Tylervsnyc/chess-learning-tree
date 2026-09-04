'use client';

/**
 * /test/box-shell — what the Chess Boxing app's status-bar strip looks like on
 * every screen, without building for iOS.
 *
 * WHY THIS PAGE EXISTS. In the app, `ios.contentInset: 'always'` insets the web
 * view: the page starts below the status bar, and the strip above it (plus the
 * one at the home indicator) is painted by the canvas background, i.e. by
 * <html>. The browser has no such inset, so the bug is invisible on the web.
 *
 * This page fakes it. Each route renders in a real 390x844 iframe, and the
 * frame is drawn with a 47pt strip above and a 34pt strip below, both painted
 * with the LIVE computed <html> background of the document inside — the exact
 * pixels iOS would show. A route whose strip does not match the page below it
 * is the bug.
 *
 * The three phase rows matter most: /play, /workout and /box/bout each open
 * dark and then show a light board, so their strip has to change colour
 * WITHOUT the URL changing. Those can only be checked by driving the iframe by
 * hand — start a game / begin the workout — and watching the strip follow.
 *
 * Test page: container MUST be overflow-auto (body is overflow:hidden globally).
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

/** iPhone 15 Pro-ish. Real insets are 59/34; 47/34 matches an older notch. */
const DEVICE_W = 390;
const DEVICE_H = 844;
const INSET_TOP = 47;
const INSET_BOTTOM = 34;
const SCALE = 0.42;

interface Row {
  label: string;
  url: string;
  expect: string;
  note?: string;
}

/** `?boxapp=frame` = shell mode for THIS document only (never writes sessionStorage). */
const f = (path: string) => `${path}${path.includes('?') ? '&' : '?'}boxapp=frame`;

const PHASE_ROWS: Row[] = [
  {
    label: 'Play',
    url: f('/play'),
    expect: 'gym navy #10162a, then LIGHT once a game starts',
    note: 'Pick a level and start — the strip must flip to light with no URL change.',
  },
  {
    label: 'Workout',
    url: f('/workout?from=box'),
    expect: 'arena navy #131a2e, then LIGHT once the workout runs',
    note: 'Press Begin — the strip must flip to light.',
  },
  {
    label: 'Bout',
    url: f('/box/bout'),
    expect: 'arena navy #131a2e pre-fight, then LIGHT for the live bout',
    note: 'Start the fight — the strip must flip to light.',
  },
];

const STATIC_ROWS: Row[] = [
  { label: 'Ring home', url: f('/box'), expect: 'arena navy #131a2e' },
  { label: 'Settings', url: f('/box/settings'), expect: 'light #eef6fc' },
  { label: 'Onboarding', url: f('/box/onboarding'), expect: 'light #eef6fc' },
  { label: 'Tactics tree', url: f('/path'), expect: 'light #eef6fc' },
  { label: 'Lesson', url: f('/lesson/1.1'), expect: 'light #eef6fc' },
  { label: 'Basics', url: f('/basics'), expect: 'light #eef6fc' },
  { label: 'Openings', url: f('/openings'), expect: 'light #eef6fc' },
  { label: 'Opening detail', url: f('/openings/italian'), expect: 'light #eef6fc' },
  { label: 'Leaderboard', url: f('/leaderboard'), expect: 'light #eef6fc' },
  { label: 'Profile', url: f('/profile'), expect: 'light #eef6fc' },
  { label: 'Corner room', url: f('/box/profile'), expect: 'wood brown #754c26 (not in the shipped bundle)' },
  { label: 'Review', url: f('/review'), expect: 'light #eef6fc' },
  { label: 'Level test', url: f('/level-test/1-2'), expect: 'light #eef6fc' },
  { label: 'Welcome', url: f('/welcome'), expect: 'light #eef6fc' },
  { label: 'Log in', url: f('/auth/login'), expect: 'light #eef6fc' },
  { label: 'Sign up', url: f('/auth/signup'), expect: 'light #eef6fc' },
  { label: 'About', url: f('/about'), expect: 'light #eef6fc' },
  { label: 'Support', url: f('/support'), expect: 'light #eef6fc' },
  { label: 'Privacy', url: f('/privacy'), expect: 'light #eef6fc' },
  { label: 'Terms', url: f('/terms'), expect: 'light #eef6fc' },
];

/**
 * A phone frame with the two native strips drawn around a real iframe, each
 * painted with the iframe document's live <html> background.
 */
function PhoneFrame({ row }: { row: Row }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [shell, setShell] = useState<string>('#ffffff');
  // Click to load. Every frame is a full app route; mounting even three at
  // once wedges the dev server (and the browser with it) while Turbopack
  // compiles them. Load the one you want to look at.
  const [live, setLive] = useState(false);

  // Poll rather than listen: the colour changes on phase flips inside the app,
  // which fire no event we can see from out here.
  const read = useCallback(() => {
    try {
      const doc = ref.current?.contentDocument;
      if (!doc) return;
      const bg = doc.defaultView?.getComputedStyle(doc.documentElement).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)') setShell(bg);
    } catch {
      /* cross-origin — cannot happen for same-origin routes */
    }
  }, []);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(read, 400);
    return () => clearInterval(t);
  }, [read, live]);


  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative overflow-hidden rounded-[28px] border-[3px] border-neutral-800 shadow-lg"
        style={{
          width: DEVICE_W * SCALE,
          height: (DEVICE_H + INSET_TOP + INSET_BOTTOM) * SCALE,
        }}
      >
        {/* The status-bar strip — the whole point of this page. */}
        <div
          className="flex items-center justify-between px-5 font-semibold text-[10px]"
          style={{ height: INSET_TOP * SCALE, background: shell, color: 'rgba(128,128,128,0.9)' }}
        >
          <span>9:41</span>
          <span>▮▮▮</span>
        </div>
        {live ? (
          <iframe
            ref={ref}
            onLoad={read}
            src={row.url}
            title={row.url}
            loading="lazy"
            style={{
              width: DEVICE_W,
              height: DEVICE_H,
              border: 'none',
              transform: `scale(${SCALE})`,
              transformOrigin: 'top left',
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLive(true)}
            className="flex items-center justify-center w-full text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
            style={{ width: DEVICE_W * SCALE, height: DEVICE_H * SCALE }}
          >
            Load {row.label}
          </button>
        )}
        {/* The home-indicator strip — same canvas colour, by construction. */}
        <div
          className="absolute bottom-0 inset-x-0 flex items-end justify-center pb-1"
          style={{ height: INSET_BOTTOM * SCALE, background: shell }}
        >
          <div className="h-[3px] w-24 rounded-full bg-neutral-400/70" />
        </div>
      </div>
      <div className="text-center" style={{ width: DEVICE_W * SCALE }}>
        <div className="text-xs font-bold text-neutral-800">{row.label}</div>
        <div className="text-[10px] text-neutral-500">{row.expect}</div>
        <div className="mt-0.5 font-mono text-[10px] text-neutral-400">{shell}</div>
        {row.note && <div className="mt-1 text-[10px] text-amber-700">{row.note}</div>}
      </div>
    </div>
  );
}

export default function BoxShellTestPage() {
  return (
    <div className="h-full overflow-auto bg-neutral-100 p-6">
      {/* The root layout caps <main> at 768px; this gallery wants the screen. */}
      <style>{':root{--shell-max:none}'}</style>
      <div className="mx-auto max-w-[1400px]">
        <h1 className="text-2xl font-black text-neutral-900">Chess Boxing — shell strips</h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-600">
          Each phone draws the two strips iOS shows around the web view, painted with the live{' '}
          <code className="rounded bg-neutral-200 px-1">html</code> background of the page inside.
          In the app those strips are the only pixels a page cannot paint, which is why they were
          all the same pale blue. Every strip below should match the page under it.
        </p>

        <h2 className="mt-8 text-lg font-bold text-neutral-900">
          Changes colour mid-screen — check these by hand
        </h2>
        <p className="mb-4 text-sm text-neutral-600">
          These three open dark and then show a light board at the same URL. Drive each one and
          watch the strip follow.
        </p>
        <div className="flex flex-wrap gap-6">
          {PHASE_ROWS.map((r) => (
            <PhoneFrame key={r.url} row={r} />
          ))}
        </div>

        <h2 className="mt-10 text-lg font-bold text-neutral-900">One colour throughout</h2>
        <div className="mt-4 flex flex-wrap gap-6 pb-16">
          {STATIC_ROWS.map((r) => (
            <PhoneFrame key={r.url} row={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
