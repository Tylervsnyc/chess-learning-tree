'use client';

/**
 * shell-chrome — the two bits of Chess Boxing shell chrome that CSS cannot do:
 * the native status-bar text style and the <meta name="theme-color">.
 *
 * These READ the colour that is actually painted (the computed background of
 * <html>, set by ShellColor / ShellChrome) rather than being told what it is,
 * so the status bar and the paint cannot disagree. A ShellColor mounting or
 * unmounting just says "something changed, look again".
 *
 * Do NOT reach for a MutationObserver here. Watching the document for style
 * changes means a getComputedStyle on every DOM mutation, and these screens
 * animate continuously (the arena crowd, the swinging sign); it saturated the
 * main thread and stopped the page hydrating at all.
 */

/** Light text (a light status bar) on anything this dark or darker. */
export function isDarkColor(color: string): boolean {
  const rgb = color.match(/\d+(\.\d+)?/g);
  if (!rgb || rgb.length < 3) return false;
  const [r, g, b] = rgb.map(Number);
  // Rec. 601 luma — plenty to pick between two status-bar styles.
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
}

let appliedDark: boolean | null = null;
const listeners = new Set<() => void>();

/** Called by ShellColor when a declaration mounts or unmounts. */
export function notifyShellChange() {
  for (const l of listeners) l();
}

/** ShellChrome subscribes so it can re-read the painted colour. */
export function onShellChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/**
 * Sync the theme-color meta and the native status bar to whatever <html> is
 * actually painted right now. Cheap and idempotent — safe to call often.
 */
export function syncShellChrome() {
  if (typeof document === 'undefined') return;
  const painted = getComputedStyle(document.documentElement).backgroundColor;
  if (!painted) return;

  // Compare against the tag's LIVE content, never a cached copy: Next
  // re-applies its own theme-color on navigation, and a cache would read that
  // overwrite as "already correct" and leave the wrong colour in place.
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta && meta.getAttribute('content') !== painted) {
    meta.setAttribute('content', painted);
  }

  const dark = isDarkColor(painted);
  if (dark !== appliedDark) {
    appliedDark = dark;
    setStatusBarText(dark);
  }
}

/**
 * The status bar's TEXT colour. Native-only: the Capacitor plugin no-ops on
 * the web, so this does nothing there.
 *
 * Style.Dark means light text (for a dark background); Style.Light means dark
 * text. The naming is Apple's, not ours.
 */
function setStatusBarText(light: boolean) {
  import('@capacitor/status-bar')
    .then(({ StatusBar, Style }) =>
      StatusBar.setStyle({ style: light ? Style.Dark : Style.Light }),
    )
    .catch(() => {
      /* plugin unavailable (web, or not in this build) */
    });
}
