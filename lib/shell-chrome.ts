'use client';

/**
 * shell-chrome — the two bits of Chess Boxing shell chrome that CSS cannot do:
 * the native status-bar text style, the <meta name="theme-color">, and the
 * native web-view background that fills the strips behind the status bar and
 * the home indicator (ios/App/App/ShellViewController.swift explains why the
 * page cannot paint those itself).
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
let appliedStrip: string | null = null;
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

  const hex = toHex(painted);
  if (hex && hex !== appliedStrip) {
    appliedStrip = hex;
    setStripColor(hex);
  }
}

/** "rgb(19, 26, 46)" → "#131a2e". Null for anything that is not opaque rgb. */
function toHex(color: string): string | null {
  const m = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!m || (m[4] !== undefined && Number(m[4]) < 1)) return null;
  return `#${[m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`;
}

type ShellBackground = { setColor(o: { color: string }): Promise<void> };
let shellBackground: Promise<{ plugin: ShellBackground }> | null = null;

function setStripColor(color: string) {
  // Register once — registerPlugin warns if the same name is registered twice.
  // Boxed in an object: a Capacitor plugin proxy answers every property, `then`
  // included, so resolving a promise WITH it makes the promise treat it as a
  // thenable and stall forever.
  shellBackground ??= import('@capacitor/core').then(({ registerPlugin }) => ({
    plugin: registerPlugin<ShellBackground>('ShellBackground'),
  }));
  shellBackground
    .then(({ plugin }) => plugin.setColor({ color }))
    .catch(() => {
      /* plugin unavailable (web, or a native build without ShellViewController) */
    });
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
