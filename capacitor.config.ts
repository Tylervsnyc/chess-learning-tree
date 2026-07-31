import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Chess Boxing — native iOS shell around the live Chess Path web app.
 *
 * The app is SSR + API-route heavy (can't static-export), so the shell loads
 * the production site via `server.url`. A native splash covers that first load
 * so launch never shows a blank web view (Apple Guideline 4.2). The interactive
 * workout + on-device punch camera are the genuine native-grade functionality
 * that clears 4.2.
 *
 * For on-device dev testing against a local server, temporarily point
 * `server.url` at your Mac's LAN IP (e.g. http://192.168.x.x:3009).
 */
const config: CapacitorConfig = {
  appId: 'app.chesspath.boxing',
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
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
  },
};

export default config;
