export type CalculatorCategory =
  | 'investment'
  | 'loan'
  | 'savings'
  | 'retirement'
  | 'tax'
  | 'planning';

export interface CalculatorField {
  id: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface CalculatorResultItem {
  label: string;
  value: string;
}

export interface CalculatorComputeOutput {
  headline: { label: string; value: string };
  items: CalculatorResultItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculatorConfig {
  /** URL slug — becomes /{slug} at the site root, e.g. "sip-calculator" */
  slug: string;
  /** Stable internal id, e.g. "sip" */
  id: string;
  name: string;
  shortName: string;
  category: CalculatorCategory;

  /** ---- SEO metadata (auto-wired into <head>, OG, Twitter, canonical) ---- */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  /** ---- On-page content ---- */
  h1: string;
  introParagraph: string;
  explanation: string; // long-form HTML-safe markdown-lite string
  formula: {
    title: string;
    expression: string;
    variables: { symbol: string; meaning: string }[];
  };
  example: {
    title: string;
    steps: string[];
    result: string;
  };
  benefits: string[];
  faqs: FAQItem[];

  /** ---- Interactive calculator ---- */
  fields: CalculatorField[];
  compute: (values: Record<string, number>) => CalculatorComputeOutput;

  /** ---- Internal linking (drives Related Calculators + internal link graph) ---- */
  relatedSlugs: string[];
}

export interface GuideConfig {
  slug: string; // becomes /guides/{slug}
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishedAt: string; // ISO date
  updatedAt: string;
  readingTimeMinutes: number;
  category: CalculatorCategory;
  content: string; // long-form content, one string per paragraph joined by \n\n
  faqs: FAQItem[];
  relatedCalculatorSlugs: string[];
  relatedGuideSlugs: string[];
}
