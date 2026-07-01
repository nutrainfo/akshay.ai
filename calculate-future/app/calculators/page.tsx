import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { CALCULATORS, getAllCategories, getCalculatorsByCategory } from '@/config/calculators.config';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'All Financial Calculators',
  description: `Browse all ${CALCULATORS.length}+ free Indian financial calculators — SIP, EMI, FD, RD, PPF, NPS, CAGR, inflation, SWP and more — organized by category.`,
  path: '/calculators',
});

export default function CalculatorsIndexPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs
        schemaId="breadcrumb-schema-calculators"
        items={[
          { name: 'Home', href: '/', url: SITE.url },
          { name: 'Calculators', href: '/calculators', url: `${SITE.url}/calculators` },
        ]}
      />
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">All Financial Calculators</h1>
      <p className="mt-3 text-lg text-slate-600">
        {CALCULATORS.length} free, accurate calculators covering investment, loans, savings, retirement, and tax planning.
      </p>

      {categories.map((category) => (
        <section key={category} className="mt-10">
          <h2 className="mb-4 flex items-center justify-between text-xl font-bold capitalize text-slate-900">
            {category}
            <Link href={`/category/${category}`} className="text-sm font-medium text-brand hover:underline">
              View category →
            </Link>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getCalculatorsByCategory(category).map((calc) => (
              <Link
                key={calc.slug}
                href={`/${calc.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-md"
              >
                <div className="font-semibold text-slate-800">{calc.name}</div>
                <p className="mt-1 text-sm text-slate-500">{calc.metaDescription.slice(0, 90)}…</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
