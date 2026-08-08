import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lexforge.ai';

  const routes = [
    '',
    '/generate',
    '/pricing',
    '/research',
    '/dataset',
    '/changelog',
    '/contact',
    '/roadmap',
    '/about',
    '/legal/privacy',
    '/legal/terms',
    '/legal/cookies',
    '/legal/ai-usage',
    '/legal/disclaimer'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/generate' ? 'daily' : 'weekly',
    priority: route === '' || route === '/generate' ? 1 : 0.8,
  }));
}
