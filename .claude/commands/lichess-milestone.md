---
description: Build a branded Chess Path "rating milestone" social card (1080x1350) from Lichess data, with auto-fitting callout windows.
---

# Lichess Milestone Card

Generate a shareable Chess Path milestone graphic: a rating chart with auto-sized
callout windows (e.g. "Started Chess Path here", "Hit an all-time high"), brand
stats, confetti at the peak, and the logo/handle footer.

**The whole point of this skill:** callout windows are **measured to their text**,
so the bubble can never be smaller than the words inside it. Never hardcode a box
width — the generator measures each text line with `getComputedTextLength()` and
sizes the rounded window (plus optional logo) to fit.

## Pipeline

1. **Pull the rating history** from the Lichess public API (no auth):
   ```bash
   curl -s "https://lichess.org/api/user/<username>/rating-history"
   ```
   Pick the perf (Blitz/Rapid/etc). Points are `[year, monthIndex(0-11), day, rating]`.
   Convert to `{ t: epochMs, r: rating }`. Slice to the window you want to tell the
   story (e.g. from the recent low, or from the Chess Path start date).

2. **Pull app stats** (optional but strong) from the DB with the service role —
   puzzles solved (`puzzle_attempts`), games vs Rookie (`game_sessions`), etc.,
   filtered to that user's `profiles.id`. See the growth scripts for the pattern.

3. **Write a config JSON** (see shape below) to `data/social/<name>.json`.

4. **Render:**
   ```bash
   node scripts/social/build-milestone-chart.mjs data/social/<name>.json /tmp/<name>.png
   ```

5. **VERIFY (required).** Read the output PNG back and check:
   - No callout text is clipped or overflowing its window.
   - Arrows point cleanly at their target dots (no loops/crossings).
   - Boxes don't cover the data line or each other.
   If anything's off, adjust `box.top` / `arrow` / window order in the config and
   re-render. Do not ship without eyeballing the rendered image.

## Config shape (`data/social/*.json`)

```jsonc
{
  "kicker": "Chess Path Milestone",
  "headline": ["A Chess Path user just hit", "their all-time high: *1800*", "on Lichess."], // *..* = green highlight
  "stats": [
    { "num": "1802", "label": "Peak Blitz rating" },
    { "num": "2,301", "label": "Puzzles solved", "color": "#E0B000" },
    { "num": "160", "label": "Games vs Rookie", "color": "#58CC02" }
  ],
  "lineColor": "#1CB0F6",
  "yRange": [1520, 1820],
  "gridFrom": 1550, "gridTo": 1800, "gridStep": 50,
  "xLabels": [ { "t": 1753..., "label": "Jul '25", "anchor": "start" }, ... ],
  "callouts": [
    {
      "accent": "#1CB0F6", "fill": "#EAF6FE", "logo": "icon",  // "logo":"icon" uses the rook mark
      "arrow": "down",                                          // "down" | "up-right"
      "box": { "cx": null, "top": 42 },                         // cx null = auto-position from target/arrow
      "target": { "t": 1769..., "r": 1693 },                    // data point the arrow points at
      "lines": [
        { "text": "Started using", "color": "#5a7088", "weight": 700, "size": 20 },
        { "text": "Chess Path here", "color": "#1899D6", "weight": 800, "size": 23 }
      ]
    }
  ],
  "confetti": true, "peakLabel": "1802",
  "footer": { "url": "chesspath.app", "handle": "lichess.org/@/<username>" },
  "points": [ { "t": 1753761600000, "r": 1541 }, ... ]
}
```

### Callout rules
- `box.cx: null` → auto-positioned. `arrow: "down"` centers the window over the
  target point (arrow drops straight down). `arrow: "up-right"` parks the window
  lower-left of the target with a smooth curve sweeping up into it (good for a peak).
- Set `box.top` (y in the 0–480 chart viewBox) to choose the vertical band; pick
  empty space so the window doesn't cover the line.
- Windows are tinted (`fill`) with a colored border (`accent`). Use a two-line
  pattern: muted gray lead-in line + bold colored payoff line.
- Arrowheads are small and tapered; strokes are 3px round. Don't make them chunky.

## Brand
- Page `#eef6fc`, surfaces white, text `#2A3C45` / muted `#94a3b8`, DM Sans.
- Blue `#1CB0F6`, green `#58CC02`, gold `#E0B000`. Assets pulled from
  `public/brand/icon-512.png` and `logo-horizontal-light.svg`. No emojis.

## Posting to Instagram
Upload the PNG to Vercel Blob and publish as an image post via the Instagram Graph
API (`lib/instagram.ts` → `uploadToBlob`, then POST `image_url` to `{id}/media`,
poll `status_code` until `FINISHED`, then `{id}/media_publish`). Confirm the caption
and get Tyler's go-ahead before publishing.
