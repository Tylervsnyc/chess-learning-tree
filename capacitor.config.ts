import type { CapacitorConfig } from '@capacitor/cli';

/**
 * TWO native iOS apps ship from this repo, selected by APP_TARGET at CLI time
 * (the Capacitor CLI evaluates this file on every run; there is no multi-config
 * support, but ios.path routes each app to its own Xcode project):
 *
 *   (unset) / chessboxing → Chess Boxing, ios/, webDir capacitor-shell/
 *   chesspath             → Chess Path,  ios-chesspath/, webDir capacitor-shell-chesspath/
 *
 * Unset defaults to Chess Boxing — the live app — so a forgotten env var can
 * only ever rebuild what already ships, never cross-contaminate. npm scripts
 * set it for you: `npm run ios:sync:chesspath` etc.
 *
 * Chess Boxing — native iOS app around an OFFLINE bundle of the Chess Path app.
 *
 * This used to set `server.url = 'https://chesspath.app'`, i.e. the whole app
 * was fetched over the network at launch. On a subway that meant no app at all:
 * you got the "Reconnecting…" card in capacitor-shell/index.html.
 *
 * Now `webDir` holds a real static export — 990 prerendered pages built by
 * `npm run build:offline` (see scripts/build-offline.mjs). Lessons, Play and
 * the workout run entirely on-device; the network is only needed to sync
 * progress, which queues offline and flushes on reconnect.
 *
 * RUN the matching offline build BEFORE `cap sync ios`, or you will ship
 * whatever bundle happens to be sitting in the webDir:
 *   Chess Boxing: `npm run build:offline`
 *   Chess Path:   `npm run build:offline:chesspath`
 *
 * 4.2 ("minimum functionality"): Chess Boxing's is carried by BOUT MODE + the
 * interval workout — a real-time game vs an on-device engine, split across
 * timed rounds. It is NOT carried by the punch camera any more: that was
 * flagged off 2026-08-05 because the detector miscounts, so nothing in the app
 * uses the camera today. Keep that in mind when writing the review notes — do
 * not claim camera-based punch tracking as functionality that is not currently
 * shipping. Chess Path's is carried by 446 interactive on-device lessons + play
 * vs the on-device engine, fully offline.
 */
const IS_CHESSPATH = process.env.APP_TARGET === 'chesspath';

const config: CapacitorConfig = IS_CHESSPATH
  ? {
      appId: 'com.learnthroughstories.chesspath',
      appName: 'Chess Path',
      webDir: 'capacitor-shell-chesspath',
      ios: {
        path: 'ios-chesspath',
        contentInset: 'always',
      },
      plugins: {
        SplashScreen: {
          // The web NativeSplash hides this itself the moment it has painted
          // an identical frame (same rook, same size — lib/brand/rook-mark),
          // so the handoff is invisible. launchShowDuration is only the
          // safety net if the web never boots. No fade: the frames match.
          launchShowDuration: 4000,
          launchAutoHide: true,
          launchFadeOutDuration: 0,
          // MUST match the native launch image background (Splash.imageset)
          // and the web NativeSplash's Chess Path branch — the app's light
          // page blue, NOT the boxing navy.
          backgroundColor: '#eef6fc',
          showSpinner: false,
        },
      },
    }
  : {
      appId: 'com.learnthroughstories.chessboxing',
      appName: 'Chess Boxing',
      // The offline app bundle itself — generated, not hand-written.
      webDir: 'capacitor-shell',
      // No `server.url`: the app is served from the device. To test against a
      // local dev server instead, temporarily add
      //   server: { url: 'http://192.168.x.x:3007', cleartext: true }
      // and remember to take it back out before building for release.
      ios: {
        path: 'ios',
        contentInset: 'always',
      },
      plugins: {
        SplashScreen: {
          launchShowDuration: 1400,
          // MUST match the launch image background (Splash.imageset) and the
          // web NativeSplash. Left at Capacitor's default #ffffff this flashes
          // WHITE between two navy screens on every cold start.
          backgroundColor: '#101a33',
          showSpinner: false,
        },
      },
    };

export default config;
