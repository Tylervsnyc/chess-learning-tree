/**
 * Proves every page in an offline app bundle opens inside the iOS apps.
 *
 * `resolveLikeApp` is a JS mirror of StaticExportRouter
 * (ios-shared/StaticExportRouter.swift), the router both iOS apps use to map a
 * capacitor://localhost URL to a bundle file. Change the two together.
 *
 * `checkBundleRoutes` walks every exported page and asks the router for the
 * URLs the app actually requests:
 *   - the RSC payload Next fetches on a tap (client-side navigation). Next
 *     won't add a trailing slash to a path whose last segment looks like a
 *     file (`/lesson/1.1.1`), so it asks for `/lesson/1.1.1.txt` instead of
 *     `/lesson/1.1.1/index.txt`. If this doesn't resolve, the tap does
 *     nothing (all 446 lessons, 2026-10-02).
 *   - the page's own HTML for a full-page load.
 * Any miss fails the build.
 *
 * Usage: node scripts/offline-route-check.mjs [bundleDir]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const isFile = (p) => {
  try { return fs.statSync(p).isFile(); } catch { return false; }
};

/** Swift URL.pathExtension of a URL path (trailing slash ignored). */
export const urlPathExtension = (urlPath) =>
  path.posix.extname(urlPath.replace(/\/+$/, '')).slice(1);

/** Mirror of StaticExportRouter.route(for:). Returns an absolute file path. */
export function resolveLikeApp(basePath, urlPath) {
  if (urlPath.split('/').includes('..')) return path.join(basePath, 'index.html');

  const full = basePath + urlPath;
  if (isFile(full)) return full;

  const folderIndex = path.join(full, 'index.html');
  if (isFile(folderIndex)) return folderIndex;

  if (urlPath.endsWith('.txt')) {
    const rscPayload = full.slice(0, -4) + '/index.txt';
    if (isFile(rscPayload)) return rscPayload;
  }

  if (!urlPathExtension(urlPath)) return path.join(basePath, 'index.html');

  return full;
}

/** Next 16 normalizePathTrailingSlash + the export-mode RSC suffix. */
export function rscUrlFor(href) {
  const normalized = /\.[^/]+\/?$/.test(href)
    ? href.replace(/\/+$/, '')
    : href.endsWith('/') ? href : `${href}/`;
  return normalized.endsWith('/') ? `${normalized}index.txt` : `${normalized}.txt`;
}

function findPages(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_next') findPages(full, base, out);
    } else if (entry.name === 'index.html') {
      out.push(path.relative(base, dir).split(path.sep).join('/'));
    }
  }
  return out;
}

/**
 * Returns { pages, failures, fullLoadOnly } for a bundle directory.
 * fullLoadOnly: dotted pages that open fine on a tap but that a full-page
 * load would get with the wrong Content-Type (Capacitor limitation, see the
 * Swift file) — app code must navigate to these client-side.
 */
export function checkBundleRoutes(bundleDir) {
  const base = path.resolve(bundleDir);
  // Next's error pages are rendered in place, never navigated to.
  const pages = findPages(base).filter((p) => p !== '404' && p !== '_not-found');
  const failures = [];
  const fullLoadOnly = [];

  for (const page of pages) {
    const href = page ? `/${page}` : '/';
    const html = path.join(base, page, 'index.html');
    const rsc = path.join(base, page, 'index.txt');

    if (!isFile(rsc)) {
      failures.push(`${href}: no index.txt (RSC payload) was exported`);
      continue;
    }
    const tapUrl = rscUrlFor(href);
    if (resolveLikeApp(base, tapUrl) !== rsc) {
      failures.push(`${href}: a tap requests ${tapUrl}, which doesn't resolve to ${page}/index.txt`);
    }
    for (const loadUrl of new Set([href, href.endsWith('/') ? href : `${href}/`])) {
      if (resolveLikeApp(base, loadUrl) !== html) {
        failures.push(`${href}: a full-page load of ${loadUrl} doesn't resolve to ${page}/index.html`);
      }
    }
    if (urlPathExtension(href)) fullLoadOnly.push(href);
  }

  return { pages: pages.length, failures, fullLoadOnly };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2] || 'capacitor-shell-chesspath';
  const { pages, failures, fullLoadOnly } = checkBundleRoutes(dir);
  console.log(`${pages} pages checked in ${dir}`);
  if (fullLoadOnly.length) console.log(`${fullLoadOnly.length} dotted pages (tap-only, never full-page-load them)`);
  if (failures.length) {
    console.error(failures.slice(0, 20).join('\n'));
    console.error(`${failures.length} route failures`);
    process.exit(1);
  }
  console.log('all routes resolve');
}
