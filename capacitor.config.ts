import type { CapacitorConfig } from '@capacitor/cli';

/**
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
 * RUN `npm run build:offline` BEFORE `npx cap sync ios`, or you will ship
 * whatever bundle happens to be sitting in capacitor-shell/.
 *
 * 4.2 ("minimum functionality") is carried by BOUT MODE + the interval workout
 * — a real-time game vs an on-device engine, split across timed rounds. It is
 * NOT carried by the punch camera any more: that was flagged off 2026-08-05
 * because the detector miscounts, so nothing in the app uses the camera today.
 * Keep that in mind when writing the review notes — do not claim camera-based
 * punch tracking as functionality that is not currently shipping.
 */
const config: CapacitorConfig = {
  appId: 'com.learnthroughstories.chessboxing',
  appName: 'Chess Boxing',
  // The offline app bundle itself — generated, not hand-written.
  webDir: 'capacitor-shell',
  // No `server.url`: the app is served from the device. To test against a local
  // dev server instead, temporarily add
  //   server: { url: 'http://192.168.x.x:3007', cleartext: true }
  // and remember to take it back out before building for release.
  ios: {
    contentInset: 'always',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1400,
      // MUST match the launch image background (Splash.imageset) and the web
      // NativeSplash. Left at Capacitor's default #ffffff this flashes WHITE
      // between two navy screens on every cold start.
      backgroundColor: '#101a33',
      showSpinner: false,
    },
  },
};

export default config;
