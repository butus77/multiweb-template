// src/app/sitemap.ts
import {getBaseUrl} from '@/lib/site';

export default function sitemap() {
  const base = getBaseUrl();
  const locales = ['hu', 'sr', 'de', 'en'] as const;
  const routes = ['', '/about']; // ha bővül a site, bővítsd ezt a listát

  return routes.flatMap((route) =>
    locales.map((l) => ({
      url: `${base}/${l}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8
    }))
  );
}
