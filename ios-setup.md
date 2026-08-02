# Chess Boxing — iOS (Capacitor) setup

The web app is wrapped in a native iOS shell with Capacitor. The scaffolding
(deps, `capacitor.config.ts`, `capacitor-shell/`) is done. The steps below need
tools/accounts only a human can set up; after them, the native project is one
command away.

## What only Tyler can do
1. **Install full Xcode** from the Mac App Store (~7–15 GB). Command Line Tools
   alone are NOT enough (`xcodebuild` needs the full app).
2. Point the toolchain at Xcode + accept the license:
   ```
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```
3. **Install CocoaPods** (Capacitor iOS uses it):
   ```
   brew install cocoapods      # or: sudo gem install cocoapods
   ```
4. **Apple Developer Program** ($99/yr) — needed to run on a device + TestFlight
   + submit. Sign in inside Xcode (Settings → Accounts).

## Then generate + open the native project
```
npm run ios:add     # creates ios/ (runs pod install)
npm run ios:sync    # copies config + web assets into the native project
npm run ios:open    # opens ios/App/App.xcworkspace in Xcode
```
In Xcode: pick your Team (signing), plug in an iPhone, press Run.

## Camera permission (required — the punch counter uses the camera)
After `ios:add`, add to `ios/App/App/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Chess Boxing counts your punches during the workout using the camera. Video never leaves your phone.</string>
```
(The punch model runs on-device via getUserMedia in the WKWebView; this key is
what lets the camera start.)

## Apple Health (Chess Boxing workouts → Health app)

The code side is done: a local `HealthWorkout` plugin
(`ios/App/App/HealthWorkoutPlugin.swift`, registered in
`BridgeViewController.swift`) saves finished workouts to Apple Health as
boxing workouts. Usage strings are in `Info.plist`, the entitlement is in
`App/App.entitlements`, and the web app calls it behind the `APPLE_HEALTH`
flag (inert in normal browsers).

What only Tyler can do (once, ~15 min):
1. In [developer.apple.com](https://developer.apple.com/account/resources/identifiers)
   → Identifiers → `com.learnthroughstories.chessboxing` → check **HealthKit**
   and save. (The project uses Manual signing, so the App ID must carry the
   capability.)
2. Regenerate + re-download the `com.learnthroughstories.chessboxing AppStore`
   provisioning profile (editing the App ID invalidates it), double-click to
   install.
3. In Xcode → App target → Signing & Capabilities: confirm **HealthKit**
   appears (add it with `+ Capability` if not — it should pick up the existing
   entitlements file).
4. Build to your phone / TestFlight. Finish a workout → iOS shows the Health
   permission sheet → the session lands in the Health app as a Boxing workout
   and the results card shows "Saved to Apple Health."

## Notes
- `capacitor.config.ts` loads `https://chesspath.app` behind a native splash.
- For on-device testing against your local dev server, temporarily set
  `server.url` to your Mac's LAN IP (e.g. `http://192.168.x.x:3009`) and set
  `cleartext: true`, then `npm run ios:sync`.
- v1 ships FREE (no in-app purchase) — Apple requires StoreKit/IAP for in-app
  subscriptions, so premium stays web-only for now.
