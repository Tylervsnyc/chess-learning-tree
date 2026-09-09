# App Store campaign links

Attributed install links generated in App Store Connect → App Analytics → Acquisition → Campaigns.
Installs from these show up under the campaign name instead of the "unknown" bucket.

**Provider token (ours, stable across every campaign): `pt=128592055`**

Link shape:

```
https://apps.apple.com/app/apple-store/<APP_ID>?pt=128592055&ct=<campaign>&mt=8
```

| App | App ID |
|---|---|
| Chess Path | `6806865294` |
| Chess Boxing | `6796812770` |

## Live campaigns

### `social-post-sep-2026` — the two-app launch announcement (2026-09-08)

The "Same rook. Two apps." card (`/test/announce`, variant B). Goes in the Instagram
bio and on the launch story's link sticker.

- Chess Path — https://apps.apple.com/app/apple-store/id6806865294?pt=128592055&ct=social-post-sep-2026&mt=8
- Chess Boxing — https://apps.apple.com/app/apple-store/id6796812770?pt=128592055&ct=social-post-sep-2026&mt=8

### `social-post-sep-2026-li` — the same announcement, LinkedIn (2026-09-09)

The 1:1 cut of the App Store end card (`AppsLaunchSquare` in Remotion,
`out/linkedin/apps-launch-square.mp4`). Own `ct` so LinkedIn installs don't
collapse into the Instagram number.

- Chess Path — https://apps.apple.com/app/apple-store/id6806865294?pt=128592055&ct=social-post-sep-2026-li&mt=8
- Chess Boxing — https://apps.apple.com/app/apple-store/id6796812770?pt=128592055&ct=social-post-sep-2026-li&mt=8

## Rules

- **Campaign links are for outbound marketing only.** Never swap them into
  `lib/family/apps.ts` — that file drives in-app cross-app navigation, and
  tagging those taps would report existing users as social installs.
- `ct` is a free-text label, so a new surface just needs a new one. Splitting by
  surface (`...-story` vs `...-feed`) is what tells you which one actually
  converts; one shared token collapses them into a single number.
- `ct` values are visible to anyone who sees the URL. Keep them boring.
