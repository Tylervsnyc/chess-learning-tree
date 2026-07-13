# Chess Boxing — iOS App

A native iOS shell (Capacitor) around the live Chess Boxing workout at
**https://chesspath.app/workout**. The app is a thin wrapper: every web deploy
updates the iOS app instantly — no App Store release needed for content or
feature changes. Only shell-level changes (icon, splash, plugins, config)
require a new build.

## How it works

- `capacitor.config.json` points the native WKWebView at `https://chesspath.app/workout`.
- The shell appends `ChessPathNative/1.0` to the user agent. The web app's
  webview-safe auth (`lib/auth/webview.ts`, CHE-390) detects that token and
  hides Google OAuth (which Google blocks inside webviews), leading with
  email/Apple sign-in instead.
- `www/` is only an offline fallback page; the real app is remote.
- The Xcode project (`ios/`) uses Swift Package Manager — no CocoaPods needed.

## Building (requires a Mac with Xcode 15+)

```bash
cd ios-app
npm install
npx cap sync ios
npx cap open ios       # opens the project in Xcode
```

In Xcode:
1. Select the **App** target → *Signing & Capabilities* → pick your Apple
   Developer team. Bundle ID is `app.chesspath.chessboxing` (change it here and
   in `capacitor.config.json` if you want a different one).
2. Pick a simulator or your plugged-in iPhone and press **Run**.

## Shipping to TestFlight / App Store

1. Apple Developer account ($99/yr) with the bundle ID registered.
2. Xcode → *Product → Archive* → *Distribute App* → App Store Connect.
3. In App Store Connect, create the app, attach the build, fill in metadata,
   and submit to TestFlight first.

### App Review notes (important)

Apple's guideline 4.2 is wary of apps that are "just a website." To keep
approval odds high:
- Position it in metadata as a **workout timer + chess trainer**, not a browser.
- Sign in with Apple already works (required when third-party login is offered).
- Good first native upgrades if review pushes back or for v1.1: haptics on the
  boxing bell / round changes (`@capacitor/haptics`), push notifications for
  streak reminders (`@capacitor/push-notifications`), and logging sessions to
  Apple Health as workouts (HealthKit) — that last one makes it a genuinely
  native fitness app.

## Troubleshooting

- **Content under the notch / weird top gap:** the web app has no safe-area
  CSS, so the shell uses `ios.contentInset: "always"` to keep the page below
  the notch. If layout looks off on device, try `"automatic"` or `"never"` in
  `capacitor.config.json`, then `npx cap sync ios` and rebuild.
- **Google sign-in missing in the app:** intentional. Google blocks OAuth in
  webviews; the shell's UA triggers the web app's webview-safe auth path
  (email + Apple).

## Regenerating icon / splash

Icon and splash are generated from `public/brand/` assets. From `ios-app/`:

```bash
npm install --no-save sharp
# see git history of this directory for the generation script
```

Outputs live in `ios/App/App/Assets.xcassets/` (`AppIcon.appiconset`,
`Splash.imageset`).
