import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';
import { CALCULATORS, getAllCategories } from '@/config/calculators.config';
import { GUIDES } from '@/config/guides.config';

/**
 * Fully automatic sitemap: every entry is derived from the config files.
 * Adding a calculator or guide to its config array automatically adds it
 * here on the next build — nothing to maintain by hand.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE.url}/calculators`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/guides`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map((category) => ({
    url: `${SITE.url}/category/${category}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const calculatorRoutes: MetadataRoute.Sitemap = CALCULATORS.map((calc) => ({
    url: `${SITE.url}/${calc.slug}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${SITE.url}/guides/${guide.slug}`,
    lastModified: guide.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes, ...guideRoutes];
}
