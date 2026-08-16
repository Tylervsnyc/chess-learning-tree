import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Rookie's Run — native iOS shell around the live web app.
 *
 * The app is SSR + API-route heavy (it can't static-export), so the shell
 * loads the production site via `server.url` and `webDir` is only an offline
 * fallback. The practical upshot: shipping web code to iOS is a `git push` —
 * a native rebuild is needed only for icons, splash, Info.plist and plugins.
 *
 * A native splash covers that first remote load so launch never shows a blank
 * web view (Apple Guideline 4.2).
 *
 * `backgroundColor` MUST match, exactly:
 *   - ios/App/App/Assets.xcassets/Splash.imageset/*.png  (canvas fill)
 *   - ios/App/App/Base.lproj/LaunchScreen.storyboard     (background color)
 *   - components/run/NativeSplash.tsx                    (SPLASH_BG)
 *   - app/layout.tsx                                     (viewport.themeColor)
 * Chess Boxing left this at Capacitor's default white between two navy
 * screens and flashed white on every cold start. Ours is light because the
 * game's first paint is --color-chess-page (#eef6fc) — do NOT copy Chess
 * Boxing's navy here.
 *
 * For on-device dev against a local server, temporarily point `server.url` at
 * your Mac's LAN IP (e.g. http://192.168.x.x:3000) and set cleartext: true.
 */
const config: CapacitorConfig = {
  appId: 'com.learnthroughstories.rookiesrun',
  appName: "Rookie's Run",
  // Local fallback bundle (shown only if the remote URL is unreachable).
  webDir: 'capacitor-shell',
  server: {
    url: 'https://run.chesspath.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1400,
      backgroundColor: '#eef6fc',
      showSpinner: false,
    },
  },
};

export default config;
