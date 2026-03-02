import { redirect } from 'next/navigation';

export default async function OpeningSharePage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string; status: string }>;
}) {
  const { slug, lessonId, status } = await params;

  if (status !== 'completed' && status !== 'perfect') {
    redirect(`/openings/${slug}/${lessonId}`);
  }

  // Render minimal HTML so crawlers see the OG meta tags from layout.tsx,
  // then redirect real users to the opening tree via client-side JS.
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.location.replace('/openings/${slug}/tree')`,
      }}
    />
  );
}
