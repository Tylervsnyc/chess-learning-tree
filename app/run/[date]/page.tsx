import { redirect } from 'next/navigation';
import { getRunIdForDate, isValidDate } from '@/lib/run/daily';

export default async function RunByDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!isValidDate(date)) {
    redirect('/run');
  }

  // Future-date guard uses server UTC as an upper bound; the client page applies
  // the user-TZ check too. Both layers together make a stale link harmless.
  const todayUtc = new Date().toISOString().slice(0, 10);
  if (date > todayUtc) {
    redirect('/run');
  }

  const runId = getRunIdForDate(date);
  redirect(`/run?date=${date}&run=${runId}`);
}
