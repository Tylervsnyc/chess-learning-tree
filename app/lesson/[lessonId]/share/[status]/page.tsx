import { redirect } from 'next/navigation';

export default async function SharePage({
  params,
}: {
  params: Promise<{ lessonId: string; status: string }>;
}) {
  const { status, lessonId } = await params;

  // Validate status, then redirect to /learn
  if (status !== 'completed' && status !== 'perfect') {
    redirect(`/lesson/${lessonId}`);
  }

  redirect('/learn');
}
