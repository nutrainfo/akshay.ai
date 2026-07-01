import type { Metadata } from 'next';
import { SITE } from '@/config/site';

interface BuildMetadataArgs {
  title: string;
  description: string;
  path: string; // e.g. "/sip-calculator" or "/guides/what-is-sip"
  keywords?: string[];
  ogImage?: string;
  type?: 'website' | 'article';
}

/**
 * Single source of truth for page <head> metadata: title tag, meta
 * description, canonical URL, Open Graph tags, and Twitter card tags.
 * Every calculator/guide page calls this from generateMetadata() so
 * there is nothing to hand-write per page.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = SITE.ogImage,
  type = 'website',
}: BuildMetadataArgs): Metadata {
  const url = `${SITE.url}${path}`;
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${SITE.url}${ogImage}`;

  return {
    // Plain title here — the root layout's `template: "%s | Calculate Future"`
    // appends the site name automatically. Appending it here too would
    // double it up (Next.js applies the parent template regardless).
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: absoluteOgImage, width: 1200, height: 630, alt: title }],
      locale: SITE.locale,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteOgImage],
      site: SITE.twitterHandle,
    },
    robots: { index: true, follow: true },
  };
}
