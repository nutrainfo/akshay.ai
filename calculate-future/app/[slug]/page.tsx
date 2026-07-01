import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CALCULATORS, getCalculatorBySlug, getRelatedCalculators } from '@/config/calculators.config';
import { GUIDES } from '@/config/guides.config';
import { buildMetadata } from '@/lib/seo';
import { calculatorSchema, jsonLd } from '@/lib/schema';
import { SITE } from '@/config/site';
import CalculatorWidget from '@/components/CalculatorWidget';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/FAQSection';
import RelatedCalculators from '@/components/RelatedCalculators';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

/**
 * generateStaticParams reads CALCULATORS directly from the config file —
 * this is the ONE place that turns "one new config entry" into "one new
 * pre-rendered page at build time." Nothing else needs to be touched.
 */
export async function generateStaticParams() {
  return CALCULATORS.map((calc) => ({ slug: calc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) return {};
  return buildMetadata({
    title: calc.metaTitle,
    description: calc.metaDescription,
    path: `/${calc.slug}`,
    keywords: calc.keywords,
  });
}

export default function CalculatorPage({ params }: Props) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) notFound();

  const related = getRelatedCalculators(calc);
  const relatedGuides = GUIDES.filter((g) => g.relatedCalculatorSlugs.includes(calc.slug)).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        schemaId="breadcrumb-schema"
        items={[
          { name: 'Home', href: '/', url: SITE.url },
          { name: 'Calculators', href: '/calculators', url: `${SITE.url}/calculators` },
          { name: calc.name, href: `/${calc.slug}`, url: `${SITE.url}/${calc.slug}` },
        ]}
      />

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{calc.h1}</h1>
      <p className="mt-3 text-lg text-slate-600">{calc.introParagraph}</p>

      <div className="mt-8">
        <CalculatorWidget slug={calc.slug} />
      </div>

      <section aria-labelledby="explanation-heading" className="prose prose-slate mt-12 max-w-none">
        <h2 id="explanation-heading" className="text-2xl font-bold text-slate-900">
          What is {calc.name}?
        </h2>
        {calc.explanation.split('\n\n').map((para, i) => (
          <p key={i} className="mt-4 leading-relaxed text-slate-700">
            {para}
          </p>
        ))}
      </section>

      <section aria-labelledby="formula-heading" className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 id="formula-heading" className="text-2xl font-bold text-slate-900">
          {calc.formula.title}
        </h2>
        <p className="mt-4 rounded-lg bg-white p-4 font-mono text-lg text-brand shadow-sm">{calc.formula.expression}</p>
        <ul className="mt-4 space-y-1 text-slate-700">
          {calc.formula.variables.map((v) => (
            <li key={v.symbol}>
              <strong className="font-mono text-slate-900">{v.symbol}</strong> = {v.meaning}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="example-heading" className="mt-12">
        <h2 id="example-heading" className="text-2xl font-bold text-slate-900">
          {calc.example.title}
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
          {calc.example.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <p className="mt-4 rounded-lg bg-brand/10 p-4 font-medium text-brand-dark">{calc.example.result}</p>
      </section>

      <section aria-labelledby="benefits-heading" className="mt-12">
        <h2 id="benefits-heading" className="text-2xl font-bold text-slate-900">
          Benefits of {calc.name}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {calc.benefits.map((benefit, i) => (
            <li key={i} className="flex gap-2 rounded-lg bg-white p-3 shadow-sm">
              <span className="text-brand">✓</span>
              <span className="text-slate-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <FAQSection faqs={calc.faqs} schemaId="faq-schema" />

      <RelatedCalculators calculators={related} />

      {relatedGuides.length > 0 && (
        <section aria-labelledby="related-guides-heading" className="mt-12">
          <h2 id="related-guides-heading" className="mb-4 text-2xl font-bold text-slate-900">
            Related Guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand hover:shadow-md"
              >
                <div className="font-semibold text-slate-800">{guide.title}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <script
        id="calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(calculatorSchema(calc)) }}
      />
    </div>
  );
}
