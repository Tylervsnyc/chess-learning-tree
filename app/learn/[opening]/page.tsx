import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOpeningContent, getAllOpeningSlugs } from '@/lib/seo/opening-content';
import { learningResourceJsonLd, faqJsonLd, courseJsonLd } from '@/lib/seo/structured-data';
import { StaticBoard } from '@/components/seo/StaticBoard';

type Params = { opening: string };

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllOpeningSlugs().map(opening => ({ opening }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { opening: slug } = await params;
  const content = getOpeningContent(slug);
  if (!content) return {};

  const title = `How to Play the ${content.name} — Chess Opening Guide`;
  const description = `${content.description} Learn the ${content.name} (${content.moves}) with interactive lessons from Rookie.`;
  const url = `https://chesspath.app/learn/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'The Chess Path',
      type: 'article',
      images: [
        {
          url: `https://chesspath.app/api/og/default`,
          width: 1200,
          height: 630,
          alt: `${content.name} chess opening`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LearnOpeningPage({ params }: { params: Promise<Params> }) {
  const { opening: slug } = await params;
  const content = getOpeningContent(slug);
  if (!content) notFound();

  const url = `https://chesspath.app/learn/${slug}`;
  const sideLabel = content.side === 'white' ? 'White' : 'Black';

  return (
    <article className="px-5 py-8 sm:py-12 w-full overflow-y-auto flex-1 min-h-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd(content, url)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd(content, url)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(content)) }}
      />

      <header className="mb-8">
        <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">
          Chess Opening for {sideLabel} · {content.category}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          How to Play the {content.name}
        </h1>
        <p className="text-lg text-slate-700 mb-4">{content.description}</p>
        <div className="inline-flex items-center gap-2 text-base font-mono bg-slate-100 px-3 py-2 rounded-lg">
          {content.moves}
        </div>
      </header>

      <section className="mb-10 flex justify-center">
        <StaticBoard
          fen={content.openingFen}
          size={360}
          caption={`Position after ${content.moves}`}
        />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">The Main Line</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">
            {content.mainLineName}
          </p>
          <p className="text-slate-700">{content.mainLineSubtitle}</p>
        </div>
      </section>

      {content.topResponses.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">What Masters Play</h2>
          <p className="text-slate-700 mb-4">
            From {content.totalGames.toLocaleString()} master-level games after {content.moves} in the
            Lichess masters database:
          </p>
          <ul className="space-y-2">
            {content.topResponses.map((response, i) => {
              const pct = content.totalGames > 0
                ? ((response.games / content.totalGames) * 100).toFixed(1)
                : '0.0';
              return (
                <li
                  key={response.san}
                  className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3"
                >
                  <div>
                    <span className="font-semibold text-slate-900">
                      {i + 1}. {response.san}
                    </span>
                    <span className="text-slate-500 ml-2">
                      {response.games.toLocaleString()} games · {pct}%
                    </span>
                  </div>
                  <span className="text-sm text-slate-600">
                    {response.winRate.toFixed(1)}% for {sideLabel}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {content.variations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Main Variations</h2>
          <ul className="space-y-3">
            {content.variations.map(variation => (
              <li
                key={variation.name}
                className="bg-white border border-slate-200 rounded-xl p-4"
              >
                <p className="font-semibold text-slate-900 mb-1">{variation.name}</p>
                <p className="text-sm text-slate-600">{variation.subtitle}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {content.faq.map(({ question, answer }) => (
            <div key={question} className="bg-white border border-slate-200 rounded-xl p-5">
              <dt className="font-semibold text-slate-900 mb-2">{question}</dt>
              <dd className="text-slate-700">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-4">
        <div className="bg-[#58CC02] rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Learn the {content.name} interactively
          </h2>
          <p className="text-white/90 mb-4">
            Rookie teaches you every move — predict, play, repeat.
          </p>
          <Link
            href={`/openings/${slug}`}
            className="inline-block bg-white text-[#58CC02] font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Start the {content.name} lessons
          </Link>
        </div>
      </section>
    </article>
  );
}
