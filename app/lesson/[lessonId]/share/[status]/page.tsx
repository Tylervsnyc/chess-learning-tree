import { redirect } from 'next/navigation';

export default async function SharePage({
  params,
}: {
  params: Promise<{ lessonId: string; status: string }>;
}) {
  const { status, lessonId } = await params;

  if (status !== 'completed' && status !== 'perfect') {
    redirect(`/lesson/${lessonId}`);
  }

  // Render minimal HTML so crawlers see the OG meta tags from layout.tsx,
  // then redirect real users to /path via client-side JS.
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: "window.location.replace('/path')",
      }}
    />
  );
}
