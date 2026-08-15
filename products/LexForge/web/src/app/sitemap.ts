import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lexforge.ai';

  const routes = [
    '',
    '/playground',
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
    changeFrequency: route === '' || route === '/playground' ? 'daily' : 'weekly',
    priority: route === '' || route === '/playground' ? 1 : 0.8,
  }));
}
