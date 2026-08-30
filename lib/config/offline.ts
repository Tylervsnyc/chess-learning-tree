/**
 * True inside the offline app bundle that ships in Chess Boxing (iOS).
 *
 * Set by scripts/build-offline.mjs at build time; never set for the Vercel
 * build, so every `IS_OFFLINE_APP` branch below is dead code on the web and
 * gets stripped from the browser bundle.
 *
 * Use it for "there is no server" decisions ONLY — not for "the network is
 * currently down". The app bundle still talks to chesspath.app whenever it has
 * signal; losing signal at runtime is a separate question.
 */
export const IS_OFFLINE_APP = process.env.NEXT_PUBLIC_OFFLINE_BUILD === '1';

/**
 * Which iOS app this offline bundle is for. Empty on the web and (for
 * backwards compatibility with every shipped build) in the Chess Boxing
 * bundle; 'chesspath' only in the Chess Path app bundle.
 *
 * Build-time constants — like IS_OFFLINE_APP, dead branches are stripped, so
 * gating boxing-only UI on IS_CHESSBOXING_APP costs the web nothing.
 */
export const APP_TARGET = process.env.NEXT_PUBLIC_APP_TARGET ?? '';

/** Inside the Chess Boxing iOS app bundle (the default offline target). */
export const IS_CHESSBOXING_APP = IS_OFFLINE_APP && APP_TARGET !== 'chesspath';

/** Inside the Chess Path iOS app bundle (no boxing surfaces, NavHeader nav). */
export const IS_CHESSPATH_APP = IS_OFFLINE_APP && APP_TARGET === 'chesspath';
