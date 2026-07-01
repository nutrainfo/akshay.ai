import { SITE } from '@/config/site';
import type { CalculatorConfig, FAQItem, GuideConfig } from './types';

export function faqSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function calculatorSchema(calc: CalculatorConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calc.name,
    url: `${SITE.url}/${calc.slug}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    description: calc.metaDescription,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export function articleSchema(guide: GuideConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}${SITE.logo}` },
    },
    mainEntityOfPage: `${SITE.url}/guides/${guide.slug}`,
  };
}

/** Serialize any JSON-LD object(s) into a <script> tag payload. */
export function jsonLd(data: object | object[]): string {
  return JSON.stringify(Array.isArray(data) ? data : [data]);
}
