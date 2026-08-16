import { notFound, redirect } from 'next/navigation';
import { getRunIdForDate, isValidDate } from '@/lib/run/daily';

/**
 * /YYYY-MM-DD — a date-locked deep link into a past daily run.
 *
 * This sits at the root now (it was /run/[date] inside Chess Path), so it is a
 * catch-all for any single unmatched segment. Static routes like /stc and
 * /admin still win by Next's normal precedence, but anything else that isn't a
 * date must 404 rather than silently bounce to the game — otherwise a typo'd
 * URL looks like it worked.
 */
export default async function RunByDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!isValidDate(date)) {
    notFound();
  }

  // Future-date guard uses server UTC as an upper bound; the client page applies
  // the user-TZ check too. Both layers together make a stale link harmless.
  const todayUtc = new Date().toISOString().slice(0, 10);
  if (date > todayUtc) {
    redirect('/');
  }

  const runId = getRunIdForDate(date);
  redirect(`/?date=${date}&run=${runId}`);
}
