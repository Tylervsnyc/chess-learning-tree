import { redirect } from 'next/navigation';

// Must be dynamic — a static prerender of a page that calls redirect()
// ends up serving the prerendered HTML (which renders the not-found
// fallback) instead of issuing a real 307 at request time.
export const dynamic = 'force-dynamic';

/**
 * /run/stc — landing surface for the Story Time Chess co-branded mini-runs.
 * Redirects to the main /run page with the first STC run selected. The /run
 * page detects `stc-*` run IDs and swaps in STC branding (logo, picker filter,
 * suppressed ability offers, co-brand tagline).
 */
export default function StcRunLanding() {
  redirect('/run?run=stc-king');
}
