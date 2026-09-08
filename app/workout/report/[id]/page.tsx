'use client';

/**
 * /workout/report/[id] — legacy path form of the post-workout report.
 *
 * Kept so links already sent (report emails, Slack summaries) keep opening.
 * Every NEW link uses /workout/report?id=<sessionId>, the form the offline
 * iOS bundle can export. Thin wrapper; the page lives in
 * components/workout/WorkoutReport.
 */

import { useParams } from 'next/navigation';
import { WorkoutReport } from '@/components/workout/WorkoutReport';

export default function WorkoutReportByPathPage() {
  const params = useParams<{ id: string }>();
  return <WorkoutReport sessionId={params?.id ?? ''} />;
}
