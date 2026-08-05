import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Chess Boxing — native iOS shell around the live Chess Path web app.
 *
 * The app is SSR + API-route heavy (can't static-export), so the shell loads
 * the production site via `server.url`. A native splash covers that first load
 * so launch never shows a blank web view (Apple Guideline 4.2).
 *
 * 4.2 ("minimum functionality") is carried by BOUT MODE + the interval workout
 * — a real-time game vs an on-device engine, split across timed rounds. It is
 * NOT carried by the punch camera any more: that was flagged off 2026-08-05
 * because the detector miscounts, so nothing in the app uses the camera today.
 * Keep that in mind when writing the review notes — do not claim camera-based
 * punch tracking as functionality that is not currently shipping.
 *
 * For on-device dev testing against a local server, temporarily point
 * `server.url` at your Mac's LAN IP (e.g. http://192.168.x.x:3009).
 */
const config: CapacitorConfig = {
  appId: 'com.learnthroughstories.chessboxing',
  appName: 'Chess Boxing',
  // Local fallback bundle (shown only if the remote URL is unreachable).
  webDir: 'capacitor-shell',
  server: {
    url: 'https://chesspath.app',
    cleartext: false,
  },
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
