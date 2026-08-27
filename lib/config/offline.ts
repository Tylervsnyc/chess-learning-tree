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
