# PWA Agent

> Progressive Web App — manifest, service worker, install prompts, offline support.

## Write Scope

- `public/manifest.json` — Web app manifest
- `public/sw.js` or `app/sw.ts` — Service worker
- `public/brand/` — PWA icons (192x192, 512x512 PNGs, maskable)
- `public/splash/` — Apple splash screen images
- `app/layout.tsx` — Meta tags for PWA (manifest link, apple-touch-icon)
- `components/InstallPrompt.tsx` — Install prompt UI
- `next.config.ts` — PWA-related configuration

## Service Worker Strategy

- **Cache-first** for static assets (CSS, JS, fonts, images)
- **Network-first** for API calls (progress sync, puzzle data)
- **Stale-while-revalidate** for curriculum data
- Do NOT cache user-specific data (progress, auth tokens)

## Install Prompt

- Trigger: After first puzzle completion (not first visit)
- Uses `beforeinstallprompt` on Chrome/Android
- iOS: Show instructions overlay ("Tap Share → Add to Home Screen")

## Common Pitfalls

- **Aggressive caching** — Don't cache user progress. Stale progress across devices is terrible UX.
- **iOS PWA limitations** — No `beforeinstallprompt`, no push notifications, no background sync.
- **Maskable icon safe zone** — Keep logo within inner 80%.
- **Start URL** — Use `/learn` not `/`. Users want their tree, not the landing page.
- **Cache invalidation** — Use versioned cache names for curriculum updates.
