import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GUIDES, getGuideBySlug, getRelatedGuides } from '@/config/guides.config';
import { getCalculatorBySlug } from '@/config/calculators.config';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, jsonLd } from '@/lib/schema';
import { SITE } from '@/config/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/FAQSection';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    keywords: guide.keywords,
    type: 'article',
  });
}

export default function GuidePage({ params }: Props) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const relatedCalcs = guide.relatedCalculatorSlugs.map(getCalculatorBySlug).filter(Boolean);
  const relatedGuides = getRelatedGuides(guide);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        schemaId="breadcrumb-schema-guide"
        items={[
          { name: 'Home', href: '/', url: SITE.url },
          { name: 'Guides', href: '/guides', url: `${SITE.url}/guides` },
          { name: guide.title, href: `/guides/${guide.slug}`, url: `${SITE.url}/guides/${guide.slug}` },
        ]}
      />
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{guide.title}</h1>
      <div className="mt-3 text-sm text-slate-400">
        {guide.readingTimeMinutes} min read · Updated {new Date(guide.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      <div className="prose prose-slate mt-8 max-w-none">
        {guide.content.split('\n\n').map((para, i) => (
          <p key={i} className="mt-4 leading-relaxed text-slate-700">
            {para}
          </p>
        ))}
      </div>

      <FAQSection faqs={guide.faqs} schemaId="faq-schema-guide" />

      {relatedCalcs.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Try These Calculators</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedCalcs.map((calc) => (
              <Link
                key={calc!.slug}
                href={`/${calc!.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand hover:shadow-md"
              >
                <div className="font-semibold text-slate-800">{calc!.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedGuides.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Related Guides</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand hover:shadow-md"
              >
                <div className="font-semibold text-slate-800">{g.title}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema(guide)) }} />
    </article>
  );
}
