# Shipping the iOS app

Replaces Chess Path's `ios-setup.md`, which is stale — it tells you to install
CocoaPods and open `App.xcworkspace`. Capacitor 8 uses **Swift Package Manager**:
there is no `Podfile`, no `Pods/`, and `cap open ios` opens `App.xcodeproj`.

## How the app actually works

The iOS app **does not bundle the web app**. `capacitor.config.ts` sets
`server.url: 'https://run.chesspath.app'` and the native app is a WKWebView on
the live site. `capacitor-shell/index.html` is only the offline fallback.

**So shipping web code to iOS is a `git push`.** You need a native rebuild only
when you change:

- the app icon or splash (`npm run ios:assets`)
- `Info.plist`
- `capacitor.config.ts`
- Capacitor plugins

## One-time setup (Mac)

1. Full **Xcode** from the App Store — Command Line Tools alone can't
   `xcodebuild`. Then:
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```
2. `brew install fastlane`
3. Put the App Store Connect API key at `~/Downloads/AuthKey_767R5DY9P3.p8`
   (the same key Chess Boxing uses; the Fastfile expects this exact path).
4. **Create the app record in App Store Connect in a browser.** Fastlane
   registers the bundle ID but Apple blocks creating the app record via API —
   the `beta` lane prints a warning and continues without it, and the upload
   then fails. Bundle ID `com.learnthroughstories.rookiesrun`, name
   "Rookie's Run".

## Build and ship

```bash
npm install          # REQUIRED FIRST — see below
npm run ios:assets   # regenerate icon + splash (only if art changed)
npm run ios:sync     # npx cap sync ios
cd ios/App
fastlane beta        # cert, profile, bump build number, archive, sign
fastlane upload      # -> TestFlight
fastlane status      # poll until processing -> valid
fastlane fix_compliance   # only if TestFlight blocks on export compliance
fastlane invite      # create/ensure the Internal group, add the build
fastlane add_tester  # add tyler@tylervsnyc.com
```

> **`npm install` must run before Xcode opens.**
> `ios/App/CapApp-SPM/Package.swift` references plugins by relative path
> (`../../../node_modules/@capacitor/*`). On a fresh clone, Swift Package
> resolution fails with "package not found" until `node_modules` exists.

## Things that bit Chess Path — already fixed here

| Trap | Status |
|---|---|
| `Info.plist` hardcoded `CFBundleVersion` to a literal while the pbxproj said something else, so build bumps did nothing and TestFlight rejected uploads with "build number already exists" | Fixed — reads `$(CURRENT_PROJECT_VERSION)`, and `fastlane beta` now calls `increment_build_number` off the latest TestFlight build |
| Shipped TestFlight builds showing **Capacitor's stock logo**, because nobody replaced the generated placeholder splash | Fixed — `npm run ios:assets` generates the icon and splash from the pixel rook in `lib/daily-rook-blocks.ts`; both are committed |
| Splash background mismatched between config, imageset, launch storyboard and the web overlay, flashing white on every cold start | Fixed — `#eef6fc` in all four places. The storyboard uses an explicit colour, not `systemBackgroundColor` (which is **black** in dark mode) |
| `NSCameraUsageDescription` for a camera feature that isn't shipping | Removed |
| `@capacitor/haptics` installed but never imported | Actually used — see `lib/haptics.ts` |

## Apple Guideline 4.2

A WKWebView around a website is the classic "minimum functionality" rejection,
and this app is more exposed than Chess Boxing (which argued 4.2 on bout mode
plus a timed workout). What's shipping in our favour:

- **Haptics** on moves, captures, ability plays, level clears and death
  (`lib/haptics.ts`) — native feedback a reviewer physically feels.
- **Native splash + launch image** with no colour flash.
- **Status bar theming** (`components/run/StatusBarSync.tsx`).
- **Portrait-only**, so there's no orientation a reviewer can rotate into and
  find broken.
- **A branded offline screen** rather than a generic error.

Write the review notes concretely — "a daily chess roguelike: cross the board
in 10 escalating levels, earning permanent abilities; new board every day" —
and don't claim anything that isn't shipping.

If 4.2 comes back anyway, the escalation is a **service worker** on
run.chesspath.app precaching the shell, the 17 ability webp files and the
font (~1.5 MB), which makes the game genuinely playable in airplane mode. The
game is pure client-side computation over `lib/run/runs.ts`, so this is real,
not a trick. Do that before App Store review rather than before TestFlight.

Do **not** solve it by bundling the app into `webDir` — that forfeits the
"web deploys ship to iOS with a git push" property, which is the best thing
about this setup.

## Local device testing against a dev server

Temporarily point `server.url` at your Mac's LAN IP and allow cleartext:

```ts
server: { url: 'http://192.168.x.x:3000', cleartext: true },
```

Then `npm run ios:sync` and run from Xcode. Revert before building a release.
