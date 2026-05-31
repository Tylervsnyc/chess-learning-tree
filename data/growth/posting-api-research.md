# Social Posting API Research — Auto-posting the Daily Rookie Video

**Goal:** Automate posting one short-form vertical video per day (TikTok / YouTube Shorts / Instagram Reels) from the existing Remotion render pipeline.

**Our case:** Solo creator, ~1 video/day, 1 account per platform, organic + small-tools budget. We already render `out/videos/{date}/daily.{date}-{id}.mp4` and generate the caption + hashtags in `scripts/render-daily-video.ts`. We just need a "post this MP4 to all 3 platforms" step.

**Research only — no accounts created, no API calls, no purchases.**

---

## TL;DR Recommendation

**Use Upload-Post.** Cheapest path that actually posts **public** video to all three platforms via a single API call, with a free tier (10 uploads/mo) to prototype for $0. ~**$16/mo** when we go daily (billed annually). One `POST /api/upload` with the MP4 + a `platform[]` array does the whole job.

Runner-up: **Post Bridge** ($29/mo Creator + $5/mo API add-on = ~$34/mo). Great UX and an AI-agent CLI, but pricier and the API is a paid add-on on top of a paid plan.

**Avoid Ayrshare** for a solo budget (API starts at **$149/mo**) and **Buffer** (its developer API is effectively closed to new automation — no new app registrations, third-party OAuth not enabled).

---

## The two platform-level gotchas that decide everything

These apply no matter which tool you use — they're imposed by TikTok and Meta, not the aggregator. The whole reason to pay an aggregator is that **they** absorb these approvals for you.

1. **TikTok "unaudited client" trap.** If you post to TikTok through an API client that TikTok hasn't *audited*, every post is forced to **private (SELF_ONLY)** and you're capped at 5 users/24h. To post **public** video you need an *audited* TikTok client (privacy_policy URL, working demo video of the OAuth+upload flow, ~1–2 week review). A good aggregator is already an audited client, so your posts go out public without you doing the audit. **Confirm this is true for whichever tool you pick — it's the single most important question.**

2. **Instagram Reels needs a Business account + Facebook Page + an approved Meta app.** Meta's Content Publishing API only works for an **Instagram Business** account (Creator accounts are *not* supported for publishing), linked to a Facebook Page, behind a Meta app that passed App Review (`instagram_content_publish`). Hard limit ~**25 published posts / 24h** (Reels + stories share the bucket — fine for 1/day). Again, an aggregator's whole pitch is that *they* are the approved Meta app, so you skip App Review.

   Action item regardless of tool: switch the Rookie IG account to **Business** and link it to a Facebook Page before connecting.

3. Minor: YouTube Shorts has no special API — you upload a normal video via the YouTube Data API and it's auto-classified as a Short if it's vertical and ≤3 min. Watermarks are not added by these tools (no TikTok/CapCut-style watermark on API uploads).

---

## Comparison

| Tool | Cheapest tier w/ API + video | Public TikTok? | YT Shorts | IG Reels | API / docs quality | Notable gotchas |
|------|------------------------------|----------------|-----------|----------|--------------------|-----------------|
| **Upload-Post** ⭐ | **Free** = 10 uploads/mo (API included). Paid from **~$16/mo** (annual) = unlimited | **Yes** — verified/audited with official OAuth + documented endpoints; `privacy_level=PUBLIC_TO_EVERYONE` | Yes (`youtube_shorts=true`) | Yes (needs IG Business) | Clean REST, one `POST /api/upload` for all platforms, Python + JS SDKs, curl in docs | Limits are per "user/profile"; annual billing for the cheap rate; less deep per-network controls |
| **Post Bridge** | $29/mo (Creator, 15 accts) **+ $5/mo API add-on** = ~$34/mo | Yes (supports public + a per-platform draft override) | Yes (Shorts) | Yes (Reels/Stories/Feed) | Nice REST + **MCP/agent mode** (zero-dep Node CLI: `upload` then `post`), auto format conversion | API is a paid add-on *on top of* a paid plan; free tier is only 5 posts total (testing) |
| **Blotato** | From **$29/mo** (7-day trial) | Yes (X, LinkedIn, TikTok, YouTube, IG + 4 more via one REST API) | Yes | Yes | REST + MCP; built for AI/automation; credits only for AI *generation*, not posting | Product is bundled with AI video/writer features we don't need; pay for a bigger suite than required |
| **Ayrshare** | **$149/mo** (Premium, 1 profile, API included) | Yes (13+ platforms, Reels/Shorts/Stories direct) | Yes | Yes | Best-documented enterprise API, raised video limits (TikTok up to 10 GB) | **Price** — free tier (20 posts/mo) has Ayrshare branding + no real API posting; API realistically starts at $149/mo |
| **Buffer** | Free / $6 per-channel (Essentials) | Via scheduler; TikTok needs manual approval per post | Limited | Reels schedulable, not full-featured | **Dev API closed**: "no longer supports creation of new developer apps"; GraphQL beta lacks third-party OAuth | Not viable for headless automation from our script today |

⭐ = recommended.

---

## Why Upload-Post for us

- **It's the only one that's $0 to start and ~$16/mo at scale** while still doing **public** posts to all three target platforms. For 1 video/day (~30/mo) we outgrow the free 10/mo, so we'd land on the ~$16/mo annual plan — the cheapest "real" option in the field.
- **One API call, multi-platform.** `POST /api/upload` with `platform[]=tiktok&platform[]=youtube&platform[]=instagram` posts the same MP4 everywhere. That's a ~10-line addition to our existing render script.
- **They own the hard approvals.** Verified/audited TikTok client (public posts) and official Meta OAuth for IG — we skip the TikTok audit and Meta App Review entirely. (We still must make the IG account a **Business** account linked to a FB Page.)
- **No watermarks, official endpoints**, respects rate limits — lower account-ban risk than scraper-style tools.

**Rough monthly cost:** $0 to prototype (10 uploads), then **~$16/mo** (annual) once daily.

---

## Integration sketch (after the MP4 is rendered)

Our render step already produces `outputFile` and a `caption` string in `scripts/render-daily-video.ts`. Add a post step that runs after `execSync(remotion render ...)` succeeds. Pseudocode:

```ts
// scripts/post-daily-video.ts (new) — or appended to render-daily-video.ts
import fs from 'fs';

const API = 'https://api.upload-post.com/api/upload';
const APIKEY = process.env.UPLOAD_POST_API_KEY!;          // add to .env.local

async function postVideo(file: string, title: string, caption: string) {
  const form = new FormData();
  form.append('user', 'rookie');                          // Upload-Post profile id
  form.append('video', new Blob([fs.readFileSync(file)]), 'daily.mp4');
  form.append('title', title);                            // required for YouTube
  form.append('caption', caption);                        // our existing hashtag caption
  ['tiktok', 'youtube', 'instagram'].forEach(p => form.append('platform[]', p));
  form.append('privacy_level', 'PUBLIC_TO_EVERYONE');     // public TikTok
  form.append('youtube_shorts', 'true');
  // optional: form.append('scheduled_date', iso); form.append('timezone', 'America/...');

  const res = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Apikey ${APIKEY}` },        // NOTE: "Apikey", not "Bearer"
    body: form,
  });
  if (!res.ok) throw new Error(`Upload-Post failed: ${res.status} ${await res.text()}`);
  console.log('Posted:', await res.json());
}
```

Equivalent curl (from their docs):

```bash
curl -H 'Authorization: Apikey YOUR_KEY' \
  -F 'video=@out/videos/5.30.26/daily.5.30.26-XXXX.mp4' \
  -F 'title=Checkmate in ONE move!' \
  -F 'user=rookie' \
  -F 'platform[]=tiktok' -F 'platform[]=youtube' -F 'platform[]=instagram' \
  -F 'privacy_level=PUBLIC_TO_EVERYONE' -F 'youtube_shorts=true' \
  -X POST https://api.upload-post.com/api/upload
```

Wiring notes:
- Add `UPLOAD_POST_API_KEY` to `.env.local`.
- The header scheme is `Authorization: Apikey <key>` (not `Bearer`).
- Could be a `--post` flag on the existing render script, or a tiny `npm run video:post` that takes the rendered path. Fits the existing cron/daily-maintenance flow (RULES.md §34/§40).
- Upload-Post also supports `scheduled_date`/`timezone` and per-platform title overrides (`tiktok_title`, `youtube_description`) if we want different copy per network later.

---

## One-time setup checklist (before first post — no action taken here)

1. Create Upload-Post account, connect the Rookie TikTok / YouTube / Instagram accounts via their OAuth.
2. **Switch Rookie's Instagram to a Business account and link it to a Facebook Page** (required for Reels publishing; Creator accounts can't publish via API).
3. Verify a test upload posts **public** on TikTok (confirms their client is audited for our account).
4. Drop the API key in `.env.local`, add the post step, dry-run on a rendered MP4.

---

## Sources

- [Ayrshare Pricing](https://www.ayrshare.com/pricing/)
- [Ayrshare — What's New (video upload limits)](https://www.ayrshare.com/docs/whatsnew/latest)
- [Post Bridge Pricing](https://www.post-bridge.com/pricing) / [Review (ContentCreators)](https://contentcreators.com/tools/postbridge-review) / [Agent Mode (GitHub)](https://github.com/post-bridge-hq/agent-mode)
- [Blotato Pricing](https://www.blotato.com/pricing) / [Social Media APIs guide](https://www.blotato.com/blog/social-media-api)
- [Upload-Post](https://www.upload-post.com/) / [Docs — Upload Video](https://docs.upload-post.com/api/upload-video/) / [Review (LinkStartAI)](https://www.linkstartai.com/en/agents/upload-post) / [Auto-post YouTube Shorts](https://www.upload-post.com/how-to/auto-post-youtube-shorts/)
- [Buffer Developer API](https://buffer.com/developer-api) / [Buffer pricing 2026](https://fluxnote.io/guides/buffer-pricing-guide-2026)
- [TikTok Content Posting API — Direct Post](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post) / [Content Sharing Guidelines (unaudited = SELF_ONLY)](https://developers.tiktok.com/doc/content-sharing-guidelines)
- [Instagram Reels API guide (Phyllo)](https://www.getphyllo.com/post/a-complete-guide-to-the-instagram-reels-api) / [Meta — Instagram Platform overview](https://developers.facebook.com/docs/instagram-platform/overview/)
