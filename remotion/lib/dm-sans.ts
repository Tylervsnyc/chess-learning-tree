import { continueRender, delayRender, staticFile } from 'remotion';

/**
 * Self-hosted DM Sans for Remotion compositions.
 *
 * Drop-in replacement for `@remotion/google-fonts/DMSans` that loads the
 * variable font already shipped in public/fonts/dm-sans.woff2 (weights
 * 400-800) instead of fetching from fonts.gstatic.com. Keeps renders
 * deterministic and working offline / behind proxies.
 */

const FONT_FAMILY = 'DM Sans';

let started = false;

export const loadFont = (): { fontFamily: string } => {
  if (typeof document !== 'undefined' && !started) {
    started = true;
    // Generous timeout: under full render concurrency a tab can be CPU-starved
    const handle = delayRender('Loading DM Sans (self-hosted)', {
      timeoutInMilliseconds: 120000,
    });
    const font = new FontFace(
      FONT_FAMILY,
      `url(${staticFile('fonts/dm-sans.woff2')}) format('woff2')`,
      { weight: '100 900' },
    );
    font
      .load()
      .then(() => {
        document.fonts.add(font);
        continueRender(handle);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('DM Sans failed to load, falling back to system font', err);
        continueRender(handle);
      });
  }
  return { fontFamily: FONT_FAMILY };
};
