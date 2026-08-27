#!/usr/bin/env node
/**
 * Build the offline app bundle that ships inside Chess Boxing (iOS).
 *
 *   npm run build:offline
 *
 * WHY THIS EXISTS
 * The iOS app was a native shell whose webview loaded https://chesspath.app at
 * runtime (capacitor.config.ts `server.url`). No signal meant no app — you got
 * the "Reconnecting..." card in capacitor-shell/index.html and nothing else.
 * On a subway that is the entire experience.
 *
 * HOW IT WORKS
 * The site can't be static-exported as-is: 89 route handlers live under
 * `app/api`, and `output: 'export'` refuses to build if even one exists. So
 * rather than contort the real app, this script builds a SECOND target from a
 * throwaway copy of the tree:
 *
 *   1. copy source into .offline-build/ (node_modules symlinked, never copied)
 *   2. delete app/api and every route not on the allowlist
 *   3. filter public/ 1.7 GB -> ~25 MB and data/ 2.6 GB -> the bits that are
 *      actually imported at build time
 *   4. inject generateStaticParams for the dynamic segments
 *   5. next build with output: 'export'
 *   6. copy out/ -> capacitor-shell/
 *
 * The Vercel build never reads any of this. `next.config.ts`, `middleware.ts`
 * and every file under `app/` are untouched in the real repo — the only way
 * this can break prod is if it stops running, which the guards below make loud.
 *
 * See scripts/offline-build.config.mjs for the allowlists.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ROUTE_ALLOWLIST,
  APP_PURGE,
  PUBLIC_ALLOWLIST,
  SRC_COPY,
  DATA_ALLOWLIST,
  ROOT_FILES,
} from './offline-build.config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(ROOT, '.offline-build');
const OUT = path.join(ROOT, 'capacitor-shell');

const log = (msg) => console.log(`[offline] ${msg}`);
const die = (msg) => { console.error(`\n[offline] FAILED: ${msg}\n`); process.exit(1); };

/* ------------------------------------------------------------------ 1. copy */

function copyTree() {
  fs.rmSync(BUILD, { recursive: true, force: true });
  fs.mkdirSync(BUILD, { recursive: true });

  for (const dir of SRC_COPY) {
    const src = path.join(ROOT, dir);
    if (!fs.existsSync(src)) die(`expected source dir "${dir}" — did the repo layout change?`);
    fs.cpSync(src, path.join(BUILD, dir), { recursive: true });
  }

  for (const file of ROOT_FILES) {
    const src = path.join(ROOT, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(BUILD, file));
  }

  // Symlinked, not copied: node_modules is ~1 GB and identical either way.
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(BUILD, 'node_modules'), 'dir');

  log(`copied ${SRC_COPY.length} source dirs`);
}

/* ------------------------------------------------- 2. prune routes + api */

/** Every directory under app/ that renders a route, as a route path. */
function findRouteDirs(appDir, prefix = '') {
  const found = [];
  for (const entry of fs.readdirSync(appDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const route = prefix ? `${prefix}/${entry.name}` : entry.name;
    found.push(...findRouteDirs(path.join(appDir, entry.name), route));
  }
  if (fs.existsSync(path.join(appDir, 'page.tsx'))) found.push(prefix);
  return found;
}

function pruneApp() {
  const appDir = path.join(BUILD, 'app');

  for (const dir of APP_PURGE) {
    fs.rmSync(path.join(appDir, dir), { recursive: true, force: true });
  }

  // `output: 'export'` cannot tolerate a single route handler anywhere.
  let handlers = 0;
  const stripHandlers = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stripHandlers(full);
      else if (entry.name === 'route.ts' || entry.name === 'route.tsx') {
        fs.rmSync(full); handlers++;
      }
    }
  };
  stripHandlers(appDir);

  // SEO generators produce files the app has no use for and that need a host.
  for (const f of ['robots.ts', 'sitemap.ts']) {
    fs.rmSync(path.join(appDir, f), { force: true });
  }

  const allowed = new Set(ROUTE_ALLOWLIST);
  let dropped = 0;
  for (const route of findRouteDirs(appDir)) {
    if (allowed.has(route)) continue;
    fs.rmSync(path.join(appDir, route, 'page.tsx'), { force: true });
    dropped++;
  }

  const kept = findRouteDirs(appDir);
  const missing = ROUTE_ALLOWLIST.filter((r) => !kept.includes(r));
  if (missing.length) {
    die(`these allowlisted routes have no page.tsx — the allowlist is stale:\n  ${missing.join('\n  ')}`);
  }

  log(`kept ${kept.length} routes, dropped ${dropped}, stripped ${handlers} route handlers`);
}

/* ------------------------------------------------------- 2b. puzzle pack */

/**
 * Lesson puzzles normally come from /api/puzzles/lesson reading 72 MB of
 * corpora off the server's disk. The app has no server and no disk, so a
 * trimmed pack ships as static files under /puzzle-pack/ and the selection runs
 * on-device (lib/puzzles/lesson-source.ts).
 *
 * scripts/build-puzzle-pack.mjs validates the trim against all 446 lessons; it
 * is regenerated here so the bundle can never carry a stale pack.
 */
function buildPuzzlePack() {
  execFileSync('node', [path.join(ROOT, 'scripts', 'build-puzzle-pack.mjs')], {
    cwd: ROOT,
    stdio: 'inherit',
  });

  const src = path.join(ROOT, 'data', 'offline-puzzle-pack');
  if (!fs.existsSync(path.join(src, 'index.json'))) die('puzzle pack build produced no index.json');

  // The trim is lossy. Lossy in a way that empties one lesson is a bug you'd
  // only find by tapping that lesson on a train, so prove all 446 still fill.
  try {
    execFileSync('npx', ['tsx', path.join(ROOT, 'scripts', 'validate-puzzle-pack.ts')], {
      cwd: ROOT,
      stdio: 'inherit',
    });
  } catch {
    die('puzzle pack failed lesson validation (see above) — refusing to ship it.');
  }

  return src;
}

/* --------------------------------------------------- 3. filter public/data */

function filterDir(name, allowlist) {
  const src = path.join(ROOT, name);
  const dest = path.join(BUILD, name);
  fs.mkdirSync(dest, { recursive: true });

  const missing = allowlist.filter((e) => !fs.existsSync(path.join(src, e)));
  if (missing.length) die(`${name}/ allowlist references entries that don't exist: ${missing.join(', ')}`);

  for (const entry of allowlist) {
    fs.cpSync(path.join(src, entry), path.join(dest, entry), { recursive: true });
  }

  const bytes = execFileSync('du', ['-sk', dest]).toString().split('\t')[0];
  log(`${name}/ filtered to ${allowlist.length} entries (${Math.round(bytes / 1024)} MB)`);
}

/* ----------------------------------------------------- 3b. file overrides */

/**
 * Files under scripts/offline-overrides/ are copied over the offline copy after
 * pruning, replacing their real counterparts.
 *
 * This is for pages that are genuinely different in the app: the real version
 * depends on a request (cookies, headers, UA sniffing) and the app has no
 * request. Keeping them as whole files rather than patches means you can read
 * exactly what ships without running the build.
 */
function applyOverrides() {
  const src = path.join(ROOT, 'scripts', 'offline-overrides');
  if (!fs.existsSync(src)) return;

  let count = 0;
  const walk = (dir, rel = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const relPath = rel ? path.join(rel, entry.name) : entry.name;
      if (entry.isDirectory()) { walk(path.join(dir, entry.name), relPath); continue; }

      const target = path.join(BUILD, relPath);
      if (!fs.existsSync(path.join(ROOT, relPath))) {
        die(`override scripts/offline-overrides/${relPath} has no counterpart in the repo — it was moved or deleted.`);
      }
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(dir, entry.name), target);
      count++;
    }
  };
  walk(src);
  log(`applied ${count} offline overrides`);
}

/* ------------------------------------------- 4. generateStaticParams inject */

/**
 * `output: 'export'` needs the full list of values for every dynamic segment,
 * and generateStaticParams can't live in a 'use client' page — all three of our
 * dynamic pages are client components. Next allows the export on the segment's
 * LAYOUT instead, which is where these go.
 *
 * Injected into the copy only. Adding them to the real repo would make the
 * Vercel build prerender ~900 extra shells for no benefit.
 */
const PARAM_LAYOUTS = [
  {
    // 446 tactic lessons
    route: 'lesson/[lessonId]',
    expectExisting: true,
    code: `
import { getAllLessonIds } from '@/lib/curriculum-registry';

export function generateStaticParams() {
  return getAllLessonIds().map((lessonId: string) => ({ lessonId }));
}
`,
  },
  {
    // one page per opening, plus its /tree view
    route: 'openings/[slug]',
    expectExisting: false,
    code: `import { TREE_LOOKUP } from '@/lib/opening-trees';

export function generateStaticParams() {
  return Object.keys(TREE_LOOKUP).map((slug) => ({ slug }));
}

export default function OpeningSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
`,
  },
  {
    // the level-unlock gates (1-2, 2-3, ...)
    route: 'level-test/[transition]',
    expectExisting: false,
    code: `import { LEVEL_UNLOCK_TESTS } from '@/data/level-unlock-tests';

export function generateStaticParams() {
  return Object.keys(LEVEL_UNLOCK_TESTS).map((transition) => ({ transition }));
}

export default function LevelTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
`,
  },
  {
    // every node of every opening tree
    route: 'openings/[slug]/[lessonId]',
    expectExisting: true,
    code: `
import { TREE_LOOKUP } from '@/lib/opening-trees';

export function generateStaticParams() {
  return Object.entries(TREE_LOOKUP).flatMap(([slug, tree]) =>
    tree.nodes.map((node) => ({ slug, lessonId: node.id }))
  );
}
`,
  },
];

function copyPuzzlePack(src) {
  const dest = path.join(BUILD, 'public', 'puzzle-pack');
  fs.cpSync(src, dest, { recursive: true });
  const bytes = execFileSync('du', ['-sk', dest]).toString().split('\t')[0];
  log(`bundled puzzle pack (${Math.round(bytes / 1024)} MB)`);
}

function injectParams() {
  for (const { route, expectExisting, code } of PARAM_LAYOUTS) {
    const file = path.join(BUILD, 'app', route, 'layout.tsx');
    const exists = fs.existsSync(file);

    if (expectExisting !== exists) {
      die(
        `app/${route}/layout.tsx ${exists ? 'exists but was not expected' : 'is missing'}.\n` +
        `  scripts/build-offline.mjs assumed otherwise — the route moved or was renamed.\n` +
        `  Fix PARAM_LAYOUTS rather than letting the app bundle silently lose this route.`
      );
    }

    if (exists) {
      const current = fs.readFileSync(file, 'utf-8');
      if (current.includes('generateStaticParams')) {
        die(`app/${route}/layout.tsx already exports generateStaticParams — injection would duplicate it.`);
      }
      fs.writeFileSync(file, current + code);
    } else {
      fs.writeFileSync(file, code);
    }
  }
  log(`injected generateStaticParams for ${PARAM_LAYOUTS.length} dynamic segments`);
}

/* ------------------------------------------------------------ 4b. env vars */

/**
 * Next inlines NEXT_PUBLIC_* into the client bundle at BUILD time. The offline
 * build runs in a scratch directory with no .env.local, so without this every
 * page dies on "@supabase/ssr: Your project's URL and API key are required" —
 * which the error boundary renders as "Something went wrong", i.e. a bundle
 * that looks fine to build and is completely broken to run.
 *
 * Only NEXT_PUBLIC_* is forwarded. Secrets (SUPABASE_SERVICE_ROLE_KEY,
 * STRIPE_SECRET_KEY, ...) must never reach a bundle that ships to devices, and
 * there is no server here to use them anyway.
 */
const REQUIRED_PUBLIC_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

function writeEnv() {
  const envLocal = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envLocal)) die('.env.local not found — needed for NEXT_PUBLIC_* values.');

  const vars = {};
  for (const line of fs.readFileSync(envLocal, 'utf-8').split('\n')) {
    const m = line.match(/^\s*(NEXT_PUBLIC_[A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) vars[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }

  const missing = REQUIRED_PUBLIC_ENV.filter((k) => !vars[k]);
  if (missing.length) {
    die(
      `.env.local is missing ${missing.join(', ')}.\n` +
      `  Building without them produces a bundle that compiles and then throws on\n` +
      `  every screen. Refusing to ship that.`
    );
  }

  vars.NEXT_PUBLIC_OFFLINE_BUILD = '1';
  fs.writeFileSync(
    path.join(BUILD, '.env.production'),
    Object.entries(vars).map(([k, v]) => `${k}=${v}`).join('\n') + '\n'
  );
  log(`forwarded ${Object.keys(vars).length} NEXT_PUBLIC_* vars (no secrets)`);
}

/* ----------------------------------------------------------- 5. next build */

function writeConfig() {
  fs.writeFileSync(path.join(BUILD, 'next.config.ts'), `
import type { NextConfig } from 'next';
import path from 'node:path';

// Generated by scripts/build-offline.mjs. Do not edit — edit that instead.
const MEDIAPIPE_POSE_STUB = './lib/punch/mediapipe-pose-stub.ts';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,          // /play/index.html — file:// friendly inside the app
  images: { unoptimized: true },// no image optimizer without a server
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { optimizePackageImports: ['posthog-js'] },
  turbopack: { resolveAlias: { '@mediapipe/pose': MEDIAPIPE_POSE_STUB } },
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, '@mediapipe/pose': path.resolve(MEDIAPIPE_POSE_STUB) };
    return config;
  },
};

export default nextConfig;
`);
}

function build() {
  log('running next build (output: export) — this takes a few minutes');
  execFileSync('npx', ['next', 'build'], {
    cwd: BUILD,
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_OFFLINE_BUILD: '1' },
  });
}

/* ------------------------------------------------------------- 6. ship out */

function publish() {
  const exported = path.join(BUILD, 'out');
  if (!fs.existsSync(path.join(exported, 'index.html'))) {
    die('next build produced no out/index.html');
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.cpSync(exported, OUT, { recursive: true });

  // Next 16 emits a per-segment prefetch file (__next.<segment>.txt) beside every
  // page — 7,364 of them, ~50 MB once 4 KB block overhead is counted. They exist
  // to hide network latency on prefetch. This bundle is read off the device's own
  // filesystem, where there is no latency to hide, and a missing one degrades to
  // the full RSC payload in index.txt (also a local read). Pure cost, no benefit.
  let pruned = 0;
  const prunePrefetch = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) prunePrefetch(full);
      else if (/^__next\..*\.txt$/.test(entry.name)) { fs.rmSync(full); pruned++; }
    }
  };
  prunePrefetch(OUT);
  log(`pruned ${pruned} segment-prefetch files`);

  const bytes = execFileSync('du', ['-sk', OUT]).toString().split('\t')[0];
  const pages = execFileSync('sh', ['-c', `find ${OUT} -name '*.html' | wc -l`]).toString().trim();
  log(`published ${pages} pages to capacitor-shell/ (${Math.round(bytes / 1024)} MB)`);
  log('next: npx cap sync ios');
}

/* -------------------------------------------------------------------- run */

copyTree();
pruneApp();
const pack = buildPuzzlePack();
filterDir('public', PUBLIC_ALLOWLIST);
filterDir('data', DATA_ALLOWLIST);
copyPuzzlePack(pack);
applyOverrides();
injectParams();
writeEnv();
writeConfig();
build();
publish();
