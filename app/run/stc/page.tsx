import { redirect } from 'next/navigation';

/**
 * /run/stc — landing surface for the Story Time Chess co-branded mini-runs.
 * Redirects to the main /run page with the first STC run selected. The /run
 * page detects `stc-*` run IDs and swaps in STC branding (logo, picker filter,
 * suppressed ability offers, co-brand tagline).
 */
export default function StcRunLanding({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  void searchParams;
  redirect('/run?run=stc-king');
}
