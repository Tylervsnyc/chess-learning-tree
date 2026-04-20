import type { OpeningContent } from './opening-content';

export function learningResourceJsonLd(opening: OpeningContent, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `How to Play the ${opening.name}`,
    description: opening.description,
    url,
    educationalLevel: 'Beginner',
    teaches: opening.name,
    learningResourceType: 'Tutorial',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Chess Path',
      url: 'https://chesspath.app',
    },
    about: {
      '@type': 'Thing',
      name: `${opening.name} chess opening`,
    },
  };
}

export function faqJsonLd(opening: OpeningContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: opening.faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}
