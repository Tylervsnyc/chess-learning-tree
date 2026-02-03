import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/staging/',
          '/preview/',
          '/test-*',
        ],
      },
    ],
    sitemap: 'https://chesspath.app/sitemap.xml',
  };
}
