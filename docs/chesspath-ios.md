# Chess Path iOS app — runbook

The SECOND iOS app shipped from this repo (the first is Chess Boxing). Same
offline-bundle architecture, selected by `APP_TARGET`:

| | Chess Boxing | Chess Path |
|---|---|---|
| bundle id | com.learnthroughstories.chessboxing | com.learnthroughstories.chesspath |
| APP_TARGET | (unset) | `chesspath` |
| web bundle | `capacitor-shell/` | `capacitor-shell-chesspath/` |
| Xcode project | `ios/App/` | `ios-chesspath/App/` |
| entry | /box (locker home) | onboarding → /play (onboarded/signed-in devices go straight to /play) |
| chrome | BoxTabBar, no NavHeader | NavHeader, no tab bar |
| splash | navy #101a33 | page blue #eef6fc, bare rook mark (see Cold start) |

Chess Path contains NO boxing: `/box`, `/workout` and `/leaderboard` (a
workout-points board) are stripped from its bundle by
`scripts/offline-build.config.mjs` (`APP_TARGETS.chesspath`), and boxing UI in
shared screens is gated by `IS_CHESSPATH_APP` (`lib/config/offline.ts`). The
boot-to-/box script in `app/layout.tsx` is compiled out of this bundle. No
purchases in v1 (NativeNoSaleGuard + purged pricing routes apply as on boxing).

## Cold start (2026-08-31)

One continuous sequence, no logo swap: the native launch image is the bare
rook mark on page blue (`scripts/generate-chesspath-splash.ts`, geometry from
`lib/brand/rook-mark.ts`); the web `NativeSplash` paints the identical rook
at the identical size (`ROOK_FRACTION * max(100vw,100vh)` mirrors
scaleAspectFill), hides the Capacitor splash itself with no fade, plays a
random Rookie intro (hop / wiggle / shimmer / scatter — all start from the
static pose), and fades the moment `/play` has painted
(`lib/native-splash.ts`, min 1.15s, max 4s). Replay on `/test/native-splash`
or any page with `?nativeSplash=hop`. If you change the rook geometry,
re-run the generator AND rebuild the iOS app — the launch image is native.

## Build + ship

```bash
npm run build:offline:chesspath     # static export → capacitor-shell-chesspath/
npm run ios:sync:chesspath          # → ios-chesspath/App/App/public
npm run ios:open:chesspath          # simulator / device runs from Xcode
cd ios-chesspath/App
fastlane beta                       # cert + profile + signed IPA (/tmp/chesspath_build/ChessPath.ipa)
fastlane upload                     # → TestFlight
fastlane fix_compliance             # usesNonExemptEncryption=false on latest build
```

ALWAYS run the offline build before sync, or you ship a stale bundle. Never
run `cap sync` with the wrong/absent APP_TARGET expecting the other app — each
target's webDir and ios.path move together (capacitor.config.ts), so a wrong
env var rebuilds the other app, it cannot cross-contaminate.

## One-time setup still needed (Tyler, in browser)

- Create the App Store Connect app record for
  `com.learnthroughstories.chesspath` (API cannot; `fastlane beta` registers
  the Bundle ID and prints a warning until the record exists).
- Listing: screenshots (6.9" iPhone + 13" iPad), privacy label (copy Chess
  Boxing's), demo account `appreview@chesspath.app` (already exists),
  age rating.
- Review notes (Guideline 4.2): lead with "fully offline on-device app — 446
  interactive lessons + play vs the bundled engine, ~990 prerendered pages,
  works in airplane mode." Do not mention boxing or cameras.

## Versioning

Bump `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` in
`ios-chesspath/App/App.xcodeproj/project.pbxproj` only — Info.plist reads
`$(CURRENT_PROJECT_VERSION)`. A new App Store version ALWAYS needs a new build
whose CFBundleShortVersionString matches (no metadata-only updates on iOS).

## Signing

Shares the Chess Boxing keychain `~/Library/Keychains/chessbox-signing.keychain-db`
on purpose (team-scoped Distribution cert, scarce slots). Keep it out of /tmp.
ASC API key `767R5DY9P3` at `~/Downloads/AuthKey_767R5DY9P3.p8`.
