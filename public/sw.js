const CACHE_NAME = 'chess-path-v1';
const STATIC_CACHE = 'chess-path-static-v1';

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/brand/icon-192.png',
  '/brand/icon-512.png',
  '/brand/icon-96.svg',
  '/manifest.json',
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Push: show a notification (CHE-345 / Engine 2 — Retain).
// Server payload shape: { title, body, url?, icon?, badge?, tag? }.
// Note: this only fires when the server actually sends. All real sends are
// gated server-side by WEB_PUSH_ENABLED — nothing reaches here until that's on.
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: 'Chess Path', body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'Chess Path';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/brand/icon-192.png',
    badge: payload.badge || '/brand/icon-96.svg',
    tag: payload.tag,
    data: { url: payload.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click: focus an existing tab if open, else open the app.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Fetch: routing strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // NEVER cache: progress sync, auth, Supabase calls
  if (
    url.pathname.startsWith('/api/progress') ||
    url.pathname.startsWith('/api/auth') ||
    url.pathname.startsWith('/auth') ||
    url.hostname.includes('supabase')
  ) {
    return;
  }

  // Cache-first: Next.js static assets (content-hashed, safe to cache forever)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  // Cache-first: brand assets, sounds, images
  if (
    url.pathname.startsWith('/brand/') ||
    url.pathname.startsWith('/sounds/') ||
    url.pathname.match(/\.(png|jpg|svg|ico|webp|mp3|woff2?)$/)
  ) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  // Network-first: API calls (puzzle data, daily challenge, etc.)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Network-first: page navigations (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Default: network-first
  event.respondWith(networkFirst(event.request));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // Cache successful GET responses for offline fallback.
    // Skip non-http(s) schemes (chrome-extension://, etc.) — Cache.put rejects them.
    const isCacheable =
      response.ok &&
      (request.url.startsWith('http://') || request.url.startsWith('https://'));
    if (isCacheable) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return new Response(offlinePage(), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

function offlinePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chess Path - Offline</title>
  <style>
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: #eef6fc;
      color: #2A3C45;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
      padding: 1rem;
    }
    .container { max-width: 320px; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #6b7c8a; line-height: 1.5; }
    button {
      margin-top: 1.5rem;
      background: #58CC02;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>You're offline</h1>
    <p>Check your connection and try again to continue your chess training.</p>
    <button onclick="location.reload()">Retry</button>
  </div>
</body>
</html>`;
}
