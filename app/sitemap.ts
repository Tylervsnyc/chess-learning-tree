import { MetadataRoute } from 'next';
import { OPENINGS_REGISTRY } from '@/data/openings/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chesspath.app';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/run`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/openings`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const openingSlugs = new Set<string>();
  for (const opening of OPENINGS_REGISTRY) {
    if (!opening.hasData) continue;
    openingSlugs.add(opening.slug);
    for (const variation of opening.variations) {
      if (variation.hasData && variation.slug) openingSlugs.add(variation.slug);
    }
  }

  const openingPages: MetadataRoute.Sitemap = [];
  for (const slug of openingSlugs) {
    openingPages.push({
      url: `${baseUrl}/openings/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
    openingPages.push({
      url: `${baseUrl}/learn/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  return [...staticPages, ...openingPages];
}
