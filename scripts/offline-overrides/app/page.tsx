/**
 * OFFLINE OVERRIDE of app/page.tsx — copied over the real file by
 * scripts/build-offline.mjs. Not used by the Vercel build.
 *
 * On the web `/` is a server redirect to /welcome (or /path via middleware).
 * Inside the Chess Boxing app there is no server, and `/` IS the app: the
 * first thing that opens must be the Chess Boxing home, not the Chess Path
 * onboarding. Rendering /box's page directly here means launch never depends
 * on a redirect script firing.
 */
export { default, metadata } from './box/page';
