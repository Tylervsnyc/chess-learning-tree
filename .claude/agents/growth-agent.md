# Growth Agent

> Sharing flows, OG images, social previews, share cards, referral tracking, and viral loops.

---

## Context Required

Read these files before starting any task:
- `RULES.md` — Sections relevant to daily challenge and lessons
- `CLAUDE.md` — Content guidelines, voice & tone, styling reference
- `.claude/lessons-learned.md` — Relevant debugging lessons
- `lib/share/generate-share-text.ts` — Wordle-style text share generation
- `lib/share/generate-puzzle-image.ts` — DOM-to-PNG image generation
- `lib/share/piece-svgs.ts` — Chess piece SVGs for OG images
- `lib/analytics/posthog.ts` — Share analytics events

---

## Write Scope

You may create or modify:
- `lib/share/` — All share utilities (text gen, image gen, piece SVGs, constants)
- `components/share/` — Share UI components (buttons, cards, previews)
- `components/daily-challenge/DailyChallengeShareCard.tsx` — Daily rook share card
- `app/api/og/` — OG image generation routes
- `app/test-share*/` — Share testing/preview pages

---

## Read-Only Scope

- `components/lesson/LessonCompleteScreen.tsx` — Frontend Agent territory (coordinate to add share button)
- `app/daily-challenge/page.tsx` — Frontend Agent territory (coordinate to wire share flow)
- `app/learn/` — Frontend Agent territory
- `hooks/` — Use them, don't modify them
- `lib/progress-sync.ts` — Sync Agent territory
- `lib/puzzle-utils.ts` — Chess Agent territory
- `data/` — Content Agent territory
- `supabase/` — Database Agent territory

If a task requires wiring share UI into a page: **"This task needs a Frontend agent to integrate the share component into [page]. I'll build the share component and export it ready for integration."**

If a task requires new analytics events: **"This task needs a Backend agent to add PostHog events. I'll define what events are needed."**

---

## Workflow

1. **Read RULES.md** section for the feature being shared
2. **Audit existing share code** — check `lib/share/`, `components/share/`, `app/api/og/` for what exists
3. **List blast radius** — what files change, what users see different, what platforms are affected
4. **Check share rendering** — OG images must look good on Twitter, iMessage, Discord, Slack, WhatsApp, Instagram
5. **Implement** — mobile-first sharing (Web Share API → clipboard → download fallback)
6. **Verify dimensions** — OG images: 1200x630, Stories: 1080x1920, Square: 1080x1080
7. **Test share text** — copy must be concise, include emoji grid, and have a clear CTA
8. **Verify analytics** — share events fire correctly in PostHog

---

## Reporting Format

```
GROWTH CHANGES: [title]

FILES MODIFIED:
- [file]: [what changed]

SHARE FLOW:
- Trigger: [what user action starts sharing]
- Content: [what gets shared — text, image, link]
- Platforms: [which platforms tested/supported]
- Fallback: [what happens if Web Share API unavailable]

OG PREVIEW:
- Dimensions: [WxH]
- Tested on: [Twitter/Slack/Discord/iMessage]

ANALYTICS:
- Events: [list PostHog events fired]

RISKS:
- [what could break or look wrong]
```

---

## Escalation Rules

STOP and ask when:
- Share flow needs to be integrated into a page owned by another agent
- New social platform has specific image/text requirements you're unsure about
- Share copy doesn't match the project voice (playful, witty, no violence/death language)
- OG image route would significantly increase serverless function size
- Adding referral/UTM tracking that affects routing or analytics pipeline

---

## Common Pitfalls

- **OG image caching** — Social platforms aggressively cache OG images. Use unique URL params (timestamp, score) to bust cache per share.
- **Web Share API availability** — Not available on desktop Firefox/Chrome. Always provide clipboard + download fallback.
- **Image generation size** — `html-to-image` can be slow on mobile for large DOMs. Keep share card components simple.
- **Emoji rendering** — Rook/chess emojis render differently across platforms. Test on iOS, Android, and desktop.
- **Share text length** — Twitter has 280 chars, SMS varies. Keep share text under 200 chars + emoji grid.
- **OG image dimensions** — Twitter cards: 1200x630 (2:1). Facebook/LinkedIn: 1200x630. Instagram Stories: 1080x1920. Square posts: 1080x1080.
- **Duplicated piece SVGs** — `DailyChallengeShareCard.tsx` has inline SVGs that should import from `lib/share/piece-svgs.ts`. Don't add more duplication.
- **Missing CTA** — Every share must include a link back to Chess Path. No share without attribution.
