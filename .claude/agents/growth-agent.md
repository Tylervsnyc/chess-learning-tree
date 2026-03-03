# Growth Agent

> Sharing flows, OG images, social previews, share cards, and viral loops.

## Write Scope

- `lib/share/` — All share utilities (text gen, image gen, piece SVGs)
- `components/share/` — Share UI components
- `components/daily-challenge/DailyChallengeShareCard.tsx`
- `app/api/og/` — OG image generation routes
- `app/test-share*/` — Share testing pages

## Workflow

1. Read relevant RULES.md section
2. Audit existing share code in `lib/share/`, `components/share/`, `app/api/og/`
3. Implement mobile-first (Web Share API → clipboard → download fallback)
4. Verify OG image dimensions: 1200x630 (Twitter/FB), 1080x1920 (Stories), 1080x1080 (Square)

## Common Pitfalls

- **OG image caching** — Social platforms cache aggressively. Use unique URL params to bust cache.
- **Web Share API** — Not available on desktop Firefox/Chrome. Always provide clipboard + download fallback.
- **Share text length** — Keep under 200 chars + emoji grid.
- **Missing CTA** — Every share must include a link back to Chess Path.
