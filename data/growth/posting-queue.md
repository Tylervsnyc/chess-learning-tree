# Posting Queue — the one board to check each day

> **STATUS (2026-06-01): superseded for the daily puzzle Reel.** Instagram auto-posting is now wired and flipped ON — the daily puzzle Reel posts itself via the Vercel cron `/api/cron/ig-post` (8am ET, `IG_AUTOPOST=true`). No manual posting needed for that. This board still applies to the **manual** channels: comment-seeds and any non-puzzle Reels (run reels, candidates clips). The "no automation yet" language below predates the auto-poster — ignore it for the daily puzzle.

**What this is:** your single daily posting board. Open this, post what's marked READY, check it off. That's the whole ritual. No automation yet (posting API is blocked until you set up accounts — see `posting-api-research.md`), so this is the manual bridge.

**Why it exists:** we render content every day and almost none of it gets posted. 105 daily puzzle videos are sitting in `out/videos/` right now, each with a finished caption, never shared. The content isn't the bottleneck — *posting* is. This board fixes that with zero new infra.

---

## The daily ritual (2 minutes)

1. **Post today's video.** Grab the newest folder in `out/videos/{date}/`. It has two files:
   - `daily.{date}-{id}.mp4` — the video
   - `daily.{date}-{id}.txt` — the caption + hashtags (copy/paste as-is)

   Post the MP4 to Instagram Reels with that caption. Done. (Optional: TikTok + YT Shorts, same file.)
2. **Do one comment-seed.** Open `comment-seeding-queue.md`, post the top unposted **POST** row, mark it done there.
3. **Log it below.** One line in the Posted Log. That's it.

Two things a day. Video + one comment. That's the manual channel running.

---

## READY NOW — Daily puzzle videos (105 rendered, 0 posted)

These are evergreen — a puzzle is a puzzle whenever you post it. Work through them oldest-to-newest or newest-first, doesn't matter. One per day is plenty; batch 2-3 if you want a buffer.

- **Where:** `out/videos/{date}/`
- **Caption:** the `.txt` next to each MP4 (already written, Rookie-voiced, hashtagged)
- **Platform:** Instagram Reels (primary). Same MP4 works on TikTok / YT Shorts.
- **Pace:** 1/day. At that rate the current backlog alone is ~3 months of content.

> Tip: to see today's drop without digging, the newest render is the last folder when you sort `out/videos/` by date.

---

## READY NOW — Comment seeds

The full ranked list with drafts lives in **`comment-seeding-queue.md`**. Don't duplicate it here — just work top-down through the **POST** rows. Quora rows are the safest and highest-leverage; do those first. Reddit is manual/high-risk — only on threads where the OP explicitly asks for app recs, and always disclose you built it.

- Post 1 comment-seed per day alongside the video.
- Mark each as posted *in that file* so we don't double-post.

---

## NOT READY — needs you to unblock

- **Auto-posting** — blocked on account setup (IG Business + Facebook Page, TikTok audited client). See `posting-api-research.md`. Until then everything here is manual.
- **Reels beyond the daily puzzle** (run reels, candidates clips) — renders exist but need captions written. Ask me to draft them when you want to widen the mix.

---

## Posted Log

Keep it dead simple — date, what, where. This is how we'll know the channel is actually running.

| Date | What | Platform | Notes |
|------|------|----------|-------|
| _(start here)_ | | | |
