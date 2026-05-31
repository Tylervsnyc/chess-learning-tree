import type { OpeningContent } from './opening-content';

const SITE_URL = 'https://chesspath.app';
const SITE_NAME = 'The Chess Path';
const SITE_DESCRIPTION = 'The Fun Way to Learn Chess.';

/** Sitewide Organization schema. Rendered once in the root layout. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/icon-512.png`,
    description: SITE_DESCRIPTION,
  };
}

/** Sitewide WebSite schema. Rendered once in the root layout. */
export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
  };
}

/** Course schema for an opening guide. Complements the LearningResource schema. */
export function courseJsonLd(opening: OpeningContent, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `How to Play the ${opening.name}`,
    description: opening.description,
    url,
    teaches: opening.name,
    educationalLevel: 'Beginner',
    inLanguage: 'en',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

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
